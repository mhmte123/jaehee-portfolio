/* ──────────────────────────────────────────────────────────────────
   FuzzyText — 히어로 이름(JAEHEE LEE) 텍스트 흐릿하게 떨리는 효과
   (React Bits FuzzyText 포팅)

   원본은 React 컴포넌트로 children을 받아 캔버스에 그린 뒤
   매 프레임 가로/세로로 랜덤 변위(fuzz)를 줘서 노이즈 낀 듯한
   텍스트를 만드는 구조였음. 이 사이트는 빌드 단계가 없는 순수
   HTML/CSS/JS라 같은 캔버스 드로잉 로직을 그대로 바닐라 JS로
   옮기고, 대상 엘리먼트(.hero-name)에 바로 붙였다.

   원본과 다른 점: .hero-name 안에는 <span class="hero-name-white">로
   감싼 글자(J, H)와 일반 글자가 섞여 있어 단색 텍스트만 지원하는
   원본 그대로는 못 쓴다. 그래서 캔버스에 그릴 때 글자 하나하나마다
   원래 DOM에 있던 색을 그대로 읽어와 fillStyle로 적용하도록
   확장했다 (다른 부분의 fuzz 로직은 원본과 동일).
   ────────────────────────────────────────────────────────────────── */
(function () {
  const TARGET_SELECTOR = '.hero-name';

  const OPTS = {
    enableHover: true,
    baseIntensity: 0.35,
    hoverIntensity: 0.94,
    fuzzRange: 14,
    fps: 60,
    direction: 'horizontal',
    transitionDuration: 6, // 프레임 단위로 부드럽게 강도 전환
    clickEffect: false,
    glitchMode: false,
  };

  function initFuzzyText() {
    const target = document.querySelector(TARGET_SELECTOR);
    if (!target) return;

    // main.js의 텍스트 스크램블 효과가 .hero-name 글자를 한 자씩
    // 채워 넣는 애니메이션을 먼저 끝내야 한다. 그 전에 캔버스로
    // 바꿔치기하면 글자가 아직 비어 있어서(textContent='') 아무것도
    // 그려지지 않고 끝나버린다. 스크램블이 끝났다는 신호
    // (herotext-ready 이벤트 또는 scrambleDone 플래그)를 기다린 뒤 시작.
    if (target.dataset.scrambleDone !== '1') {
      let started = false;
      const start = () => {
        if (started) return;
        started = true;
        runFuzzyText(target);
      };
      target.addEventListener('herotext-ready', start, { once: true });
      // 안전장치: 스크램블 신호가 어떤 이유로든 오지 않을 경우를 대비해
      // 일정 시간 후에는 강제로 시작한다. 단, 이때 디코딩이 아직
      // 중간에 뒤섞인 상태(예: "JAEHOG N%Y")일 수 있으므로, 그 상태를
      // 그대로 캔버스에 박아버리지 않도록 먼저 강제 완료 이벤트를 쏴서
      // decrypted-text.js 쪽이 최종 텍스트로 즉시 확정하게 한 뒤 시작한다.
      setTimeout(() => {
        if (started) return;
        target.dispatchEvent(new CustomEvent('herotext-force-finish', { bubbles: true }));
        start();
      }, 3000);
      return;
    }

    runFuzzyText(target);
  }

  function runFuzzyText(target) {
    let canvas;
    try {
      canvas = document.createElement('canvas');
      if (!canvas.getContext('2d')) return;
    } catch (e) {
      return; // 캔버스를 못 쓰면 조용히 원래 텍스트 그대로 둔다
    }

    // 원본 텍스트 색 구성을 DOM에서 미리 읽어 segments로 보관
    // (span.hero-name-white로 감싼 글자만 다른 색).
    // decrypted-text.js가 만들어둔 구조는 스크린리더용 sr-only 텍스트와
    // 화면에 보이는 글자별 span이 함께 들어있는 형태라, 트리를 재귀적으로
    // 훑으면서 data-sr-only가 붙은 노드는 건너뛰어야 텍스트가 중복되지 않는다.
    const segments = [];
    (function collect(node) {
      if (node.nodeType === Node.TEXT_NODE) {
        const txt = node.textContent;
        if (txt) segments.push({ text: txt, color: getComputedStyle(node.parentElement || target).color });
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        if (node.hasAttribute && node.hasAttribute('data-sr-only')) return;
        node.childNodes.forEach(collect);
      }
    })(target);
    const fullText = segments.map(s => s.text).join('');
    if (!fullText.trim()) return;

    // 스크린리더/SEO를 위해 원래 텍스트는 aria-label로 보존
    target.setAttribute('aria-label', fullText);
    target.innerHTML = '';
    canvas.setAttribute('aria-hidden', 'true');
    // .hero-name은 text-align: center로 가운데 정렬되는 구조라
    // canvas도 inline-block이어야 같은 방식으로 가운데 정렬된다
    canvas.style.display = 'inline-block';
    canvas.style.maxWidth = '100%';
    target.appendChild(canvas);

    const ctx = canvas.getContext('2d');

    let animationFrameId = null;
    let resizeTimer = null;
    let cleanupCurrent = null;

    function build() {
      if (cleanupCurrent) cleanupCurrent();

      const computed = getComputedStyle(target);
      const fontWeight = computed.fontWeight;
      const fontFamily = computed.fontFamily;
      const fontSizeStr = computed.fontSize; // clamp()가 이미 px로 계산되어 나온다
      const numericFontSize = parseFloat(fontSizeStr);
      const fontString = `${fontWeight} ${fontSizeStr} ${fontFamily}`;

      const offscreen = document.createElement('canvas');
      const offCtx = offscreen.getContext('2d');
      if (!offCtx) return;

      offCtx.font = fontString;
      offCtx.textBaseline = 'alphabetic';

      // 글자 단위로 폭을 미리 측정해 각자의 색을 기억해둔다
      const chars = [];
      let totalWidth = 0;
      segments.forEach(seg => {
        for (const ch of seg.text) {
          const w = offCtx.measureText(ch).width;
          chars.push({ ch, color: seg.color, width: w });
          totalWidth += w;
        }
      });

      const metrics = offCtx.measureText(fullText);
      const actualAscent = metrics.actualBoundingBoxAscent || numericFontSize;
      const actualDescent = metrics.actualBoundingBoxDescent || numericFontSize * 0.2;

      const textBoundingWidth = Math.ceil(totalWidth);
      const tightHeight = Math.ceil(actualAscent + actualDescent);
      const extraWidthBuffer = 10;
      const offscreenWidth = textBoundingWidth + extraWidthBuffer;
      offscreen.width = offscreenWidth;
      offscreen.height = tightHeight;
      const xOffset = extraWidthBuffer / 2;

      offCtx.font = fontString;
      offCtx.textBaseline = 'alphabetic';
      let xPos = xOffset;
      for (const entry of chars) {
        offCtx.fillStyle = entry.color;
        offCtx.fillText(entry.ch, xPos, actualAscent);
        xPos += entry.width;
      }

      const { fuzzRange, fps, direction, baseIntensity, hoverIntensity, transitionDuration, clickEffect, glitchMode, enableHover } = OPTS;
      const horizontalMargin = fuzzRange + 20;
      const verticalMargin = 0;
      canvas.width = offscreenWidth + horizontalMargin * 2;
      canvas.height = tightHeight + verticalMargin * 2;
      canvas.style.width = canvas.width + 'px';
      canvas.style.height = canvas.height + 'px';
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.translate(horizontalMargin, verticalMargin);

      const interactiveLeft = horizontalMargin + xOffset;
      const interactiveTop = verticalMargin;
      const interactiveRight = interactiveLeft + textBoundingWidth;
      const interactiveBottom = interactiveTop + tightHeight;

      let isHovering = false;
      let isClicking = false;
      let isGlitching = false;
      let currentIntensity = baseIntensity;
      let targetIntensity = baseIntensity;
      let lastFrameTime = 0;
      const frameDuration = 1000 / fps;
      let running = true;

      const run = timestamp => {
        if (!running) return;
        if (timestamp - lastFrameTime < frameDuration) {
          animationFrameId = window.requestAnimationFrame(run);
          return;
        }
        lastFrameTime = timestamp;

        ctx.clearRect(
          -fuzzRange - 20,
          -fuzzRange - 10,
          offscreenWidth + 2 * (fuzzRange + 20),
          tightHeight + 2 * (fuzzRange + 10)
        );

        if (isClicking || isGlitching) {
          targetIntensity = 1;
        } else if (isHovering) {
          targetIntensity = hoverIntensity;
        } else {
          targetIntensity = baseIntensity;
        }

        if (transitionDuration > 0) {
          const step = 1 / transitionDuration;
          if (currentIntensity < targetIntensity) {
            currentIntensity = Math.min(currentIntensity + step, targetIntensity);
          } else if (currentIntensity > targetIntensity) {
            currentIntensity = Math.max(currentIntensity - step, targetIntensity);
          }
        } else {
          currentIntensity = targetIntensity;
        }

        if (direction === 'vertical') {
          for (let i = 0; i < offscreenWidth; i++) {
            const dy = Math.floor(currentIntensity * (Math.random() - 0.5) * fuzzRange);
            ctx.drawImage(offscreen, i, 0, 1, tightHeight, i, dy, 1, tightHeight);
          }
        } else {
          for (let j = 0; j < tightHeight; j++) {
            const dx = Math.floor(currentIntensity * (Math.random() - 0.5) * fuzzRange);
            ctx.drawImage(offscreen, 0, j, offscreenWidth, 1, dx, j, offscreenWidth, 1);
          }
        }

        animationFrameId = window.requestAnimationFrame(run);
      };
      animationFrameId = window.requestAnimationFrame(run);

      const isInsideTextArea = (x, y) =>
        x >= interactiveLeft && x <= interactiveRight && y >= interactiveTop && y <= interactiveBottom;

      const handleMouseMove = e => {
        if (!enableHover) return;
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const x = (e.clientX - rect.left) * scaleX;
        const y = (e.clientY - rect.top) * scaleY;
        isHovering = isInsideTextArea(x, y);
      };
      const handleMouseLeave = () => { isHovering = false; };
      const handleClick = () => {
        if (!clickEffect) return;
        isClicking = true;
        setTimeout(() => { isClicking = false; }, 150);
      };

      if (enableHover) {
        canvas.addEventListener('mousemove', handleMouseMove);
        canvas.addEventListener('mouseleave', handleMouseLeave);
      }
      if (clickEffect) {
        canvas.addEventListener('click', handleClick);
      }

      let glitchTimer = null;
      let glitchEndTimer = null;
      function startGlitchLoop() {
        if (!glitchMode) return;
        glitchTimer = setTimeout(() => {
          isGlitching = true;
          glitchEndTimer = setTimeout(() => {
            isGlitching = false;
            startGlitchLoop();
          }, 200);
        }, 2000);
      }
      if (glitchMode) startGlitchLoop();

      cleanupCurrent = function () {
        running = false;
        if (animationFrameId) window.cancelAnimationFrame(animationFrameId);
        clearTimeout(glitchTimer);
        clearTimeout(glitchEndTimer);
        // 리빌드(리사이즈 등)로 이 빌드가 정리될 때 호버 중이었다면,
        // 외부(volumetric-beams.js)에 호버가 끝났다는 신호를 보내 배경
        // 속도가 빠른 상태로 멈춰있지 않게 한다.
        setHovering(false);
        if (enableHover) {
          canvas.removeEventListener('mousemove', handleMouseMove);
          canvas.removeEventListener('mouseleave', handleMouseLeave);
        }
        if (clickEffect) {
          canvas.removeEventListener('click', handleClick);
        }
      };
    }

    const ready = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
    ready.then(build).catch(build);

    // 폰트 크기가 vw 기반 clamp()라 창 크기가 바뀌면 다시 그려야 한다
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(build, 150);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFuzzyText);
  } else {
    initFuzzyText();
  }
})();
