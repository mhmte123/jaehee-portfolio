/* ──────────────────────────────────────────────────────────────────
   Glass Surface — 메뉴 캡슐(소개/프로세스/UX·UI/그래픽/경력/연락을
   감싸는 .nav-links 캡슐) 리퀴드 글래스 효과 (React Bits GlassSurface 포팅)

   원본은 React 컴포넌트 + ResizeObserver + useEffect로 SVG
   feDisplacementMap을 동적으로 만들어 backdrop-filter에 연결하는
   구조였음. 이 사이트는 빌드 단계가 없는 순수 HTML/CSS/JS라 같은
   로직을 그대로 바닐라 JS로 옮겼다.

   - SVG 필터(feImage + feDisplacementMap + feColorMatrix + feBlend)를
     메뉴 캡슐(.nav-links) 크기에 맞춰 동적으로 생성해
     backdrop-filter: url(#id)로 연결 → 배경이 굴절되는 "리퀴드 글래스" 느낌.
   - Safari/Firefox처럼 backdrop-filter에 SVG filter url()을 못 쓰는
     브라우저는 원본 컴포넌트와 동일하게 단순 blur 폴백으로 전환.
   - 캡슐 크기가 바뀔 수 있으므로 ResizeObserver로 감지해
     displacement map을 다시 그린다.
   ────────────────────────────────────────────────────────────────── */
(function () {
  const TARGET_SELECTOR = '.nav-links';
  const FILTER_ID = 'nav-links-glass-filter';
  const RED_GRAD_ID = 'nav-links-glass-red-grad';
  const BLUE_GRAD_ID = 'nav-links-glass-blue-grad';

  const OPTS = {
    borderRadius: 999,
    borderWidth: 0.3,
    brightness: 60,
    opacity: 0.9,
    blur: 6,
    displace: 1.2,
    backgroundOpacity: 0.06,
    saturation: 1.6,
    distortionScale: -90,
    redOffset: 4,
    greenOffset: 10,
    blueOffset: 18,
    xChannel: 'R',
    yChannel: 'G',
    mixBlendMode: 'difference'
  };

  function supportsSVGFilters() {
    const ua = navigator.userAgent;
    const isWebkit = /Safari/.test(ua) && !/Chrome/.test(ua);
    const isFirefox = /Firefox/.test(ua);
    if (isWebkit || isFirefox) return false;
    const div = document.createElement('div');
    div.style.backdropFilter = `url(#${FILTER_ID})`;
    return div.style.backdropFilter !== '';
  }

  function generateDisplacementMap(width, height) {
    const { borderRadius, borderWidth, brightness, opacity, blur, mixBlendMode } = OPTS;
    const edgeSize = Math.min(width, height) * (borderWidth * 0.5);
    const svgContent = `
      <svg viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="${RED_GRAD_ID}" x1="100%" y1="0%" x2="0%" y2="0%">
            <stop offset="0%" stop-color="#0000"/>
            <stop offset="100%" stop-color="red"/>
          </linearGradient>
          <linearGradient id="${BLUE_GRAD_ID}" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#0000"/>
            <stop offset="100%" stop-color="blue"/>
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="${width}" height="${height}" fill="black"></rect>
        <rect x="0" y="0" width="${width}" height="${height}" rx="${borderRadius}" fill="url(#${RED_GRAD_ID})" />
        <rect x="0" y="0" width="${width}" height="${height}" rx="${borderRadius}" fill="url(#${BLUE_GRAD_ID})" style="mix-blend-mode: ${mixBlendMode}" />
        <rect x="${edgeSize}" y="${edgeSize}" width="${width - edgeSize * 2}" height="${height - edgeSize * 2}" rx="${borderRadius}" fill="hsl(0 0% ${brightness}% / ${opacity})" style="filter:blur(${blur}px)" />
      </svg>
    `;
    return `data:image/svg+xml,${encodeURIComponent(svgContent)}`;
  }

  function buildFilterSVG() {
    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('class', 'nav-links__glass-filter');

    const filter = document.createElementNS(svgNS, 'filter');
    filter.setAttribute('id', FILTER_ID);
    filter.setAttribute('color-interpolation-filters', 'sRGB');
    filter.setAttribute('x', '0%');
    filter.setAttribute('y', '0%');
    filter.setAttribute('width', '100%');
    filter.setAttribute('height', '100%');

    const feImage = document.createElementNS(svgNS, 'feImage');
    feImage.setAttribute('x', '0');
    feImage.setAttribute('y', '0');
    feImage.setAttribute('width', '100%');
    feImage.setAttribute('height', '100%');
    feImage.setAttribute('preserveAspectRatio', 'none');
    feImage.setAttribute('result', 'map');

    function makeDisplacementMap(id, resultName, colorMatrixValues) {
      const disp = document.createElementNS(svgNS, 'feDisplacementMap');
      disp.setAttribute('in', 'SourceGraphic');
      disp.setAttribute('in2', 'map');
      disp.setAttribute('id', id);
      disp.setAttribute('result', `disp${resultName}`);
      disp.setAttribute('xChannelSelector', OPTS.xChannel);
      disp.setAttribute('yChannelSelector', OPTS.yChannel);

      const matrix = document.createElementNS(svgNS, 'feColorMatrix');
      matrix.setAttribute('in', `disp${resultName}`);
      matrix.setAttribute('type', 'matrix');
      matrix.setAttribute('values', colorMatrixValues);
      matrix.setAttribute('result', resultName.toLowerCase());

      return { disp, matrix };
    }

    const red = makeDisplacementMap('redchannel', 'Red', '1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0');
    const green = makeDisplacementMap('greenchannel', 'Green', '0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0');
    const blue = makeDisplacementMap('bluechannel', 'Blue', '0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0');

    red.disp.setAttribute('scale', String(OPTS.distortionScale + OPTS.redOffset));
    green.disp.setAttribute('scale', String(OPTS.distortionScale + OPTS.greenOffset));
    blue.disp.setAttribute('scale', String(OPTS.distortionScale + OPTS.blueOffset));

    const blendRG = document.createElementNS(svgNS, 'feBlend');
    blendRG.setAttribute('in', 'red');
    blendRG.setAttribute('in2', 'green');
    blendRG.setAttribute('mode', 'screen');
    blendRG.setAttribute('result', 'rg');

    const blendOutput = document.createElementNS(svgNS, 'feBlend');
    blendOutput.setAttribute('in', 'rg');
    blendOutput.setAttribute('in2', 'blue');
    blendOutput.setAttribute('mode', 'screen');
    blendOutput.setAttribute('result', 'output');

    const gaussianBlur = document.createElementNS(svgNS, 'feGaussianBlur');
    gaussianBlur.setAttribute('in', 'output');
    gaussianBlur.setAttribute('stdDeviation', String(OPTS.displace));

    filter.appendChild(feImage);
    filter.appendChild(red.disp);
    filter.appendChild(red.matrix);
    filter.appendChild(green.disp);
    filter.appendChild(green.matrix);
    filter.appendChild(blue.disp);
    filter.appendChild(blue.matrix);
    filter.appendChild(blendRG);
    filter.appendChild(blendOutput);
    filter.appendChild(gaussianBlur);

    const defs = document.createElementNS(svgNS, 'defs');
    defs.appendChild(filter);
    svg.appendChild(defs);

    return { svg, feImage };
  }

  function initGlassSurface() {
    const target = document.querySelector(TARGET_SELECTOR);
    if (!target) return;

    const svgSupported = supportsSVGFilters();
    target.classList.add('glass-surface--' + (svgSupported ? 'svg' : 'fallback'));
    target.style.setProperty('--glass-frost', OPTS.backgroundOpacity);
    target.style.setProperty('--glass-saturation', OPTS.saturation);

    if (!svgSupported) return; // 폴백 모드는 CSS 블러만으로 충분, SVG 불필요

    target.style.setProperty('--filter-id', `url(#${FILTER_ID})`);

    const { svg, feImage } = buildFilterSVG();
    target.insertBefore(svg, target.firstChild);

    function updateDisplacementMap() {
      const rect = target.getBoundingClientRect();
      const w = rect.width || 300;
      const h = rect.height || 44;
      feImage.setAttribute('href', generateDisplacementMap(w, h));
    }

    updateDisplacementMap();
    setTimeout(updateDisplacementMap, 0);

    let resizeTimer = null;
    const ro = new ResizeObserver(() => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(updateDisplacementMap, 0);
    });
    ro.observe(target);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGlassSurface);
  } else {
    initGlassSurface();
  }
})();
