/* ── Hero Swarm Preview ──
   로컬 검토용 Swarm 스타일 데모. 실제 배포 여부는 검토 후 결정한다. */
(function initHeroSwarmPreview() {
  const hero = document.querySelector('.hero');
  const layer = document.getElementById('heroSwarmLayer');
  if (!hero || !layer) return;

  // 모바일에서는 히어로 원본 애니메이션을 그대로 사용한다. 작은 화면에서
  // Swarm 오버레이가 타이핑 대상의 최종 표시 상태와 충돌하는 것을 방지한다.
  if (window.matchMedia('(max-width: 768px)').matches) {
    layer.remove();
    return;
  }

  // 히어로 밖에 있는 fixed 헤더까지 같은 좌표계에서 조립하기 위해,
  // 오버레이를 body 직속의 화면 레이어로 이동한다.
  document.body.appendChild(layer);

  const targetSpecs = [
    { selector: '.nav', passive: true, isHeader: true },
    { selector: '.nav > .nav-logo', text: 'JH.', isHeader: true },
    { selector: '.nav .nav-logo--capsule', text: 'JH.', isHeader: true },
    { selector: '.nav .nav-link', text: element => element.textContent.trim(), isHeader: true },
    { selector: '.hero-eyebrow', text: 'UX/UI Designer & Frontend-ready' },
    { selector: '.hero-name', text: 'JAEHEE LEE', useElementBox: true },
    { selector: '.hero-tagline', text: '계속 성장하는 디자이너' },
    { selector: '.hero-actions > .btn', text: element => element.textContent.trim() },
    { selector: '.hero-stat-num', text: element => element.textContent.trim(), isCounter: true },
    { selector: '.hero-stat-label', text: element => element.textContent.trim() },
    { selector: '.hero-scroll-text', text: element => element.textContent.trim() },
  ];
  const targets = targetSpecs.flatMap(spec => [...document.querySelectorAll(spec.selector)]
    .map(element => ({
      element,
      text: typeof spec.text === 'function' ? spec.text(element) : spec.text,
      passive: spec.passive,
      isHeader: spec.isHeader,
      useElementBox: spec.useElementBox,
      typingInterval: spec.typingInterval,
      isCounter: spec.isCounter,
    })));
  let timers = [];

  const clearTimers = () => {
    timers.forEach(window.clearTimeout);
    timers = [];
  };

  const createCursors = () => {
    layer.replaceChildren();
    const hud = document.createElement('div');
    hud.className = 'hero-swarm-hud';
    hud.innerHTML = '<span class="hero-swarm-hud-dot"></span><strong>SWARM</strong><span>HERO CANVAS</span>';
    layer.appendChild(hud);

    for (let index = 0; index < 4; index += 1) {
      const cursor = document.createElement('span');
      cursor.className = `hero-swarm-cursor hero-swarm-cursor--${index + 1}`;
      cursor.innerHTML = `<span class="hero-swarm-pointer" aria-hidden="true"><svg viewBox="0 0 28 34" focusable="false"><path d="M3.5 2.8 24.5 15.2 12.4 19.4 8.5 30.8Z"/></svg></span>`;
      cursor.style.setProperty('--x', `${18 + index * 18}%`);
      cursor.style.setProperty('--y', `${25 + (index % 2) * 22}%`);
      layer.appendChild(cursor);
    }
  };

  const targetMetrics = (element) => {
    const box = element.getBoundingClientRect();
    return {
      left: Math.round(box.left),
      top: Math.round(box.top),
      width: Math.round(box.width),
      height: Math.round(box.height),
    };
  };

  const typingDuration = (target) => {
    const steps = Math.max(target.text.length, 8);
    const interval = target.typingInterval ?? Math.max(26, Math.min(52, Math.round(760 / steps)));
    return target.text.length * interval + 120;
  };

  const textMetrics = (element, fallback) => {
    const range = document.createRange();
    range.selectNodeContents(element);
    const box = range.getBoundingClientRect();
    if (!box.width || !box.height) return fallback;
    return {
      left: Math.round(box.left),
      top: Math.round(box.top),
      width: Math.round(box.width),
      height: Math.round(box.height),
    };
  };

  const addTypingOverlay = (target, metrics) => {
    if (!target.text) return null;
    const styles = window.getComputedStyle(target.element);
    const textBox = target.useElementBox ? metrics : textMetrics(target.element, metrics);
    const typing = document.createElement('span');
    typing.className = 'hero-swarm-typing';
    typing.textContent = '';
    typing.style.left = `${textBox.left}px`;
    typing.style.top = `${textBox.top}px`;
    typing.style.width = `${textBox.width}px`;
    typing.style.fontSize = styles.fontSize;
    typing.style.fontFamily = styles.fontFamily;
    typing.style.fontWeight = styles.fontWeight;
    typing.style.letterSpacing = styles.letterSpacing;
    typing.style.lineHeight = styles.lineHeight;
    typing.style.color = styles.color;
    typing.style.textAlign = target.useElementBox ? styles.textAlign : 'left';
    typing.style.textTransform = styles.textTransform;
    layer.appendChild(typing);

    if (target.isCounter) {
      const [, number, suffix] = target.text.match(/^(\d+)(.*)$/) || [];
      const goal = Number(number);
      const duration = 980;
      const startedAt = performance.now();
      typing.textContent = `0${suffix}`;
      const tick = now => {
        const progress = Math.min((now - startedAt) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        typing.textContent = `${Math.round(goal * eased)}${suffix}`;
        if (progress < 1) window.requestAnimationFrame(tick);
      };
      window.requestAnimationFrame(tick);
      return { element: typing, duration: duration + 60 };
    }

    const interval = (typingDuration(target) - 120) / target.text.length;
    [...target.text].forEach((character, index) => {
      const id = window.setTimeout(() => {
        typing.textContent += character;
      }, index * interval);
      timers.push(id);
    });
    return { element: typing, duration: target.text.length * interval + 120 };
  };

  const addEditingUI = (target) => {
    const metrics = targetMetrics(target.element);
    const verticalGuide = document.createElement('span');
    verticalGuide.className = 'hero-swarm-guide hero-swarm-guide--vertical';
    verticalGuide.style.left = `${metrics.left}px`;

    const horizontalGuide = document.createElement('span');
    horizontalGuide.className = 'hero-swarm-guide hero-swarm-guide--horizontal';
    horizontalGuide.style.top = `${metrics.top}px`;

    const selection = document.createElement('span');
    selection.className = 'hero-swarm-selection';
    if (target.text) selection.classList.add('is-text');
    selection.style.left = `${metrics.left}px`;
    selection.style.top = `${metrics.top}px`;
    selection.style.width = `${metrics.width}px`;
    selection.style.height = `${metrics.height}px`;
    selection.innerHTML = `
      <span class="hero-swarm-size">W ${metrics.width} × H ${metrics.height}</span>
      <span class="hero-swarm-handle hero-swarm-handle--tl"></span>
      <span class="hero-swarm-handle hero-swarm-handle--tr"></span>
      <span class="hero-swarm-handle hero-swarm-handle--br"></span>
      <span class="hero-swarm-handle hero-swarm-handle--bl"></span>`;

    layer.append(verticalGuide, horizontalGuide, selection);
    const typing = addTypingOverlay(target, metrics);
    window.setTimeout(() => selection.classList.add('is-placed'), 24);
    return { typing, guides: [verticalGuide, horizontalGuide], selection };
  };

  const fadeEditingUI = ({ guides, selection }) => {
    [...guides, selection].forEach(item => item.classList.add('is-fading'));
    const id = window.setTimeout(() => {
      [...guides, selection].forEach(item => item.remove());
    }, 240);
    timers.push(id);
  };

  const moveCursor = (index, target) => {
    const metrics = targetMetrics(target.element);
    const cursors = layer.querySelectorAll('.hero-swarm-cursor');
    const cursor = cursors[index % cursors.length];
    if (!cursor) return;
    cursor.style.setProperty('--x', `${metrics.left + Math.min(metrics.width * 0.62, 180)}px`);
    cursor.style.setProperty('--y', `${metrics.top + Math.min(metrics.height * 0.54, 64)}px`);
    cursor.classList.add('is-working');
  };

  const finish = (delay) => {
    const id = window.setTimeout(() => {
      // 완성 상태를 유지해 기존 CSS의 진입 애니메이션이 한 번 더 재생되는 것을 막는다.
      layer.querySelectorAll('.hero-swarm-cursor').forEach(cursor => cursor.classList.add('is-leaving'));
      const cleanup = window.setTimeout(() => layer.replaceChildren(), 120);
      timers.push(cleanup);
    }, delay);
    timers.push(id);
  };

  const runSwarmDemo = () => {
    clearTimers();
    targets.forEach(({ element }) => element.classList.remove('swarm-build-target', 'swarm-built'));
    createCursors();
    document.body.classList.add('swarm-demo-active');

    let endDelay = 0;
    const headerCount = targets.filter(item => item.isHeader).length;
    targets.forEach((target, index) => {
      if (!target.passive) target.element.classList.add('swarm-build-target');
      const startDelay = target.isHeader
        ? 220 + index * 130
        : 1450 + (index - headerCount) * 310;
      const duration = target.isCounter ? 1040 : (target.text ? typingDuration(target) : 180);
      endDelay = Math.max(endDelay, startDelay + duration);
      const id = window.setTimeout(() => {
        moveCursor(index, target);
        const editorUI = addEditingUI(target);
        const uiFadeTimer = window.setTimeout(() => fadeEditingUI(editorUI), 260);
        timers.push(uiFadeTimer);
        window.setTimeout(() => {
          editorUI.typing?.element.remove();
          if (target.isCounter) target.element.textContent = target.text;
          if (!target.passive) target.element.classList.add('swarm-built');
        }, editorUI.typing?.duration || 180);
      }, startDelay);
      timers.push(id);
    });

    finish(endDelay + 80);
  };

  // 첫 방문 시 조작 없이 바로 조립 모션을 보여준다.
  const autoStart = window.setTimeout(runSwarmDemo, 320);
  timers.push(autoStart);
})();
