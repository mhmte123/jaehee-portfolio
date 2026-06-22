/* ──────────────────────────────────────────────────────────────────
   Cursor Mode Toggle — 마우스에 붙는 커스텀 효과(도트+링 커서, 스플래시
   유체 효과)를 한 번에 켜고 끌 수 있는 화면 우하단 토글 버튼.
   상태는 localStorage에 저장해서 새로고침해도 유지된다.
   ────────────────────────────────────────────────────────────────── */
(function () {
  const STORAGE_KEY = 'cursorEffectsEnabled';

  function loadSavedState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved === null ? true : saved === 'true';
    } catch (e) {
      return true; // localStorage 접근 불가(프라이버시 모드 등) 시 기본값
    }
  }

  function saveState(enabled) {
    try {
      localStorage.setItem(STORAGE_KEY, String(enabled));
    } catch (e) {
      /* 저장 실패해도 토글 자체는 동작하도록 무시 */
    }
  }

  function applyMode(enabled, btn) {
    document.body.classList.toggle('cursor-mode-off', !enabled);

    // 스플래시 유체 효과 (모바일/저성능 기기나 WebGL 미지원 환경에서는
    // window.__splashCursorAPI 자체가 없을 수 있으므로 존재할 때만 호출)
    if (window.__splashCursorAPI && typeof window.__splashCursorAPI.setActive === 'function') {
      window.__splashCursorAPI.setActive(enabled);
    }

    if (btn) {
      btn.classList.toggle('is-off', !enabled);
      btn.setAttribute('aria-pressed', String(enabled));
      btn.title = enabled ? '마우스 커서 효과 끄기' : '마우스 커서 효과 켜기';
    }
  }

  function initCursorModeToggle() {
    const btn = document.getElementById('cursorModeToggle');
    if (!btn) return;

    let enabled = loadSavedState();
    applyMode(enabled, btn);

    btn.addEventListener('click', () => {
      enabled = !enabled;
      saveState(enabled);
      applyMode(enabled, btn);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCursorModeToggle);
  } else {
    initCursorModeToggle();
  }
})();
