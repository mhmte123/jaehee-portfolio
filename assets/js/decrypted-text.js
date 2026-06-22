/* ──────────────────────────────────────────────────────────────────
   DecryptedText — 히어로 이름(JAEHEE LEE) 글자가 암호처럼
   뒤섞이다가 하나씩 해독되어 나타나는 효과
   (React Bits DecryptedText 포팅)

   원본은 React 컴포넌트로 hover/click/view 등 다양한 트리거를
   지원하지만, 이 사이트는 히어로 이름이 페이지 로드 즉시 화면에
   보이는 요소라 별도 트리거 없이 로드 후 바로 한 번 재생되도록
   단순화했다(예전 TextScramble과 동일한 동작 방식). sequential +
   revealDirection: 'start' 조합과 동일하게, 글자가 왼쪽부터 순서대로
   해독되는 형태로 구현.

   원본과 다른 점: .hero-name 안에는 J, H 글자만 다른 색
   (.hero-name-white)으로 강조되어 있다. 원본 컴포넌트의 className/
   encryptedClassName 개념을 확장해서, "해독 완료 + 강조 인덱스"인
   글자만 hero-name-white 클래스를 받도록 처리했다.

   해독이 끝나면 'herotext-ready' 이벤트를 쏴서 FuzzyText 효과
   (assets/js/fuzzy-text.js)가 그 신호를 받아 캔버스로 바꿔치기를
   시작하도록 기존 연동 방식을 그대로 유지한다.
   ────────────────────────────────────────────────────────────────── */
(function () {
  const TARGET_SELECTOR = '.hero-name';
  const TEXT = 'JAEHEE LEE';
  const ACCENT_INDICES = [0, 3]; // J, H
  const CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ@#$%&*?!';
  const SPEED = 35; // ms, 한 틱당 간격 (DecryptedText의 speed prop과 동일한 의미)
  const START_DELAY = 400; // ms, 페이지 로드 후 시작까지 지연 (기존 TextScramble과 동일)

  function randomChar() {
    return CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];
  }

  // revealDirection: 'start' — 앞에서부터 한 글자씩 순서대로 해독.
  // end를 랜덤으로 두면 가끔 뒤 글자가 앞 글자보다 먼저 확정되는
  // 경우가 생겨서(겹치는 구간), 글자별 종료 시점은 고정값으로 둬서
  // 항상 인덱스 순서대로(앞→뒤) 확정되도록 보장한다.
  function buildSchedule(text) {
    const STEP = 3;   // 글자마다 해독 시작 시점 간격 (프레임)
    const WINDOW = 10; // 글자 하나가 뒤섞이다 확정되기까지 걸리는 길이 (프레임, 고정)
    return text.split('').map((ch, i) => {
      if (ch === ' ') return { ch, start: 0, end: 0 };
      const start = i * STEP;
      const end = start + WINDOW;
      return { ch, start, end };
    });
  }

  function init() {
    const target = document.querySelector(TARGET_SELECTOR);
    if (!target) return;

    target.setAttribute('aria-label', TEXT);
    target.innerHTML = '';

    // 스크린리더용 원본 텍스트 (시각적으로는 숨김)
    const srOnly = document.createElement('span');
    srOnly.style.position = 'absolute';
    srOnly.style.width = '1px';
    srOnly.style.height = '1px';
    srOnly.style.padding = '0';
    srOnly.style.margin = '-1px';
    srOnly.style.overflow = 'hidden';
    srOnly.style.clip = 'rect(0,0,0,0)';
    srOnly.style.border = '0';
    srOnly.textContent = TEXT;
    // 화면에 보이는 효과(FuzzyText 등)가 이 텍스트까지 다시 읽어서
    // 중복으로 그리지 않도록 표시해둔다
    srOnly.setAttribute('data-sr-only', '1');
    target.appendChild(srOnly);

    const visible = document.createElement('span');
    visible.setAttribute('aria-hidden', 'true');
    target.appendChild(visible);

    const charEls = TEXT.split('').map(ch => {
      const span = document.createElement('span');
      if (ch === ' ') {
        span.textContent = ' ';
      } else {
        span.className = 'scramble-char';
        span.textContent = randomChar();
      }
      visible.appendChild(span);
      return span;
    });

    const schedule = buildSchedule(TEXT);
    let frame = 0;
    let timer = null;

    function tick() {
      let completeCount = 0;

      schedule.forEach((item, i) => {
        if (item.ch === ' ') {
          completeCount++;
          return;
        }

        const span = charEls[i];

        if (frame >= item.end) {
          // 해독 완료
          completeCount++;
          span.textContent = item.ch;
          span.className = ACCENT_INDICES.includes(i) ? 'hero-name-white' : '';
        } else if (frame >= item.start) {
          // 해독 진행 중 — 가끔씩만 글자를 바꿔 깜빡이는 느낌을 준다
          if (Math.random() < 0.35) span.textContent = randomChar();
          span.className = 'scramble-char';
        } else {
          // 아직 시작 전 — 계속 무작위로 뒤섞임
          span.textContent = randomChar();
          span.className = 'scramble-char';
        }
      });

      frame++;

      if (completeCount === schedule.length) {
        clearInterval(timer);
        target.dataset.scrambleDone = '1';
        target.dispatchEvent(new CustomEvent('herotext-ready', { bubbles: true }));
      }
    }

    // FuzzyText 쪽 안전장치 타임아웃(3초)이 이 디코딩보다 먼저 발동하면
    // 그 순간 뒤섞여 있던 글자(예: "JAEHOG N%Y" 같은 상태)가 캔버스에
    // 그대로 굳어버린다(백그라운드 탭 쓰로틀링 등으로 타이머가 늦게 돌면
    // 충분히 일어날 수 있는 일). 이를 막기 위해 외부에서 디코딩을 즉시
    // 끝낼 수 있는 강제 완료 이벤트를 둔다.
    function finishNow() {
      clearInterval(timer);
      schedule.forEach((item, i) => {
        if (item.ch === ' ') return;
        charEls[i].textContent = item.ch;
        charEls[i].className = ACCENT_INDICES.includes(i) ? 'hero-name-white' : '';
      });
      if (target.dataset.scrambleDone !== '1') {
        target.dataset.scrambleDone = '1';
        target.dispatchEvent(new CustomEvent('herotext-ready', { bubbles: true }));
      }
    }
    target.addEventListener('herotext-force-finish', finishNow);

    setTimeout(() => {
      timer = setInterval(tick, SPEED);
    }, START_DELAY);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
