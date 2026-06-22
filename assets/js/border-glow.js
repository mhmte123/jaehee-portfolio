/* ──────────────────────────────────────────────────────────────────
   Border Glow — 카드 호버 효과 (React Bits BorderGlow 컴포넌트 포팅)
   원본은 React 컴포넌트(props로 색상/강도 등을 커스터마이즈)였지만,
   이 사이트는 빌드 과정이 없는 정적 HTML/CSS/JS 구조라서
   색상·그라데이션 등 고정값은 style.css의 .border-glow-card에서
   CSS 변수로 정의해두고, 이 스크립트는 다음만 담당한다:
   1. 대상 카드에 .border-glow-card 클래스 + .edge-light span 부여
   2. 마우스 좌표 → 카드 중심 기준 "가장자리 근접도"와 "각도" 계산 후
      --edge-proximity / --cursor-angle CSS 변수 갱신
   3. 갤러리처럼 나중에 동적으로 추가되는 카드도 감지해서 적용
   ────────────────────────────────────────────────────────────────── */
(function () {
  const SELECTOR = '.process-card, .project-card, .contact-card, .gallery-item';

  function getEdgeProximity(w, h, x, y) {
    const cx = w / 2;
    const cy = h / 2;
    const dx = x - cx;
    const dy = y - cy;
    let kx = Infinity;
    let ky = Infinity;
    if (dx !== 0) kx = cx / Math.abs(dx);
    if (dy !== 0) ky = cy / Math.abs(dy);
    return Math.min(Math.max(1 / Math.min(kx, ky), 0), 1);
  }

  function getCursorAngle(w, h, x, y) {
    const cx = w / 2;
    const cy = h / 2;
    const dx = x - cx;
    const dy = y - cy;
    if (dx === 0 && dy === 0) return 0;
    const radians = Math.atan2(dy, dx);
    let degrees = radians * (180 / Math.PI) + 90;
    if (degrees < 0) degrees += 360;
    return degrees;
  }

  function setupCard(card) {
    if (card.dataset.borderGlow === 'on') return;
    card.dataset.borderGlow = 'on';
    card.classList.add('border-glow-card');

    if (!card.querySelector(':scope > .edge-light')) {
      const span = document.createElement('span');
      span.className = 'edge-light';
      card.appendChild(span);
    }

    card.addEventListener('pointermove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const edge = getEdgeProximity(rect.width, rect.height, x, y);
      const angle = getCursorAngle(rect.width, rect.height, x, y);
      card.style.setProperty('--edge-proximity', (edge * 100).toFixed(3));
      card.style.setProperty('--cursor-angle', `${angle.toFixed(3)}deg`);
    });
  }

  function initBorderGlow() {
    document.querySelectorAll(SELECTOR).forEach(setupCard);

    // 그래픽 디자인 갤러리는 JS로 동적 생성되므로 새로 추가되는 카드도 계속 감지
    const gallery = document.getElementById('gallery');
    if (gallery) {
      const observer = new MutationObserver(() => {
        gallery.querySelectorAll('.gallery-item').forEach(setupCard);
      });
      observer.observe(gallery, { childList: true });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBorderGlow);
  } else {
    initBorderGlow();
  }
})();
