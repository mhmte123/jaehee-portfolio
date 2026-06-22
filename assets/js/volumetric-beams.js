/* ──────────────────────────────────────────────────────────────────
   Volumetric Beams — 히어로 배경 (순수 Three.js 포팅)
   원본은 React Three Fiber 컴포넌트였지만, 이 사이트는 빌드 과정이
   없는 정적 HTML/CSS/JS 사이트라서 React/Tailwind/shadcn 없이
   순수 Three.js로만 동작하도록 다시 작성했다.
   셰이더(GLSL) 자체는 프레임워크와 무관하므로 그대로 사용한다.
   ────────────────────────────────────────────────────────────────── */
(function () {
  const VERTEX_SHADER = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = vec4(position.xy, 0.0, 1.0);
    }
  `;

  const FRAGMENT_SHADER = `
    precision highp float;
    varying vec2 vUv;
    uniform float uTime;
    uniform vec2  uResolution;
    uniform vec2  uMouse;
    uniform float uSpeed;
    uniform float uRadius;
    uniform float uFov;
    uniform float uMouseInfluence;
    uniform float uAutoRotateSpeed;
    uniform float uBeamCount;
    uniform float uHalfAngle;
    uniform float uEdgeSoft;
    uniform float uBeamRot;
    uniform float uTwistDepth;
    uniform float uDensity;
    uniform float uFalloff;
    uniform float uAniso;
    uniform float uLightIntensity;
    uniform vec3  uLightColor;
    uniform vec3  uTint;
    uniform float uStripeFreq;
    uniform float uStripeAmp;
    uniform float uStripeSharp;
    uniform float uStripeSpeed;
    uniform float uStripeJit;
    uniform float uVolSteps;
    uniform float uStepMin;
    uniform float uStepMax;
    uniform float uMaxDist;
    uniform float uExposure;
    uniform float uGamma;
    uniform float uGrainAmount;
    uniform float uVignette;
    uniform vec3  uBgColor;

    const float PI = 3.141592653589793;

    float hash21(vec2 p) {
      p = fract(p*vec2(123.34, 345.45));
      p += dot(p, p+34.45);
      return fract(p.x*p.y);
    }

    mat2 rot2(float a){ float s=sin(a), c=cos(a); return mat2(c,-s,s,c); }

    void beamAxis(vec2 p, float N, float rot, out vec2 axis, out float angDist){
      float ang = atan(p.y, p.x) + rot;
      float period = 2.0*PI / max(1.0, N);
      float k = floor(ang/period + 0.5);
      float centerAng = k * period;
      axis = vec2(cos(centerAng - rot), sin(centerAng - rot));
      float d = ang - centerAng;
      d = mod(d + PI, 2.0*PI) - PI;
      angDist = abs(d);
    }

    float beamMask(float ad, float halfAng, float edgeSoft){
      float a0 = max(0.0, halfAng - edgeSoft);
      float a1 = halfAng + edgeSoft;
      return 1.0 - smoothstep(a0, a1, ad);
    }

    float hg(float mu, float g){
      float g2 = g*g;
      return (1.0 - g2) / pow(1.0 + g2 - 2.0*g*mu, 1.5);
    }

    float mediumDensity(vec3 p, float t, out vec2 stripeInfo){
      vec3 q = p;
      q.xy *= rot2(uTwistDepth * q.z);
      vec2 axis; float ad;
      beamAxis(q.xy, uBeamCount, uBeamRot, axis, ad);
      float beam = beamMask(ad, uHalfAngle, uEdgeSoft);
      float r = length(q.xy);
      float center = exp(-uFalloff * r * r);
      vec2 perp = vec2(-axis.y, axis.x);
      float coord = dot(q.xy, perp);
      float jit = uStripeJit * sin(0.7*q.z + 2.3*coord + 1.7*t);
      float stripes = 0.5 + 0.5 * sin(coord * uStripeFreq + jit - t*uStripeSpeed);
      stripes = pow(clamp(stripes, 0.0, 1.0), uStripeSharp);
      float rib = mix(1.0, 0.55 + 0.45*stripes, uStripeAmp * beam);
      float d = uDensity * beam * center;
      stripeInfo = vec2(stripes, beam);
      return d;
    }

    void main(){
      float t = uTime * uSpeed;
      vec2 uv = (gl_FragCoord.xy - 0.5*uResolution.xy) / uResolution.y;
      float az = t*uAutoRotateSpeed + (uMouse.x*2.0-1.0) * PI * 0.35 * uMouseInfluence;
      float el = (uMouse.y*2.0-1.0) * 0.25 * uMouseInfluence;
      vec3 ro = vec3(cos(az)*cos(el), sin(el), sin(az)*cos(el)) * uRadius;
      vec3 ta = vec3(0.0);
      vec3 ww = normalize(ta - ro);
      vec3 uu = normalize(cross(vec3(0.0,1.0,0.0), ww));
      vec3 vv = cross(ww, uu);
      vec3 rd = normalize(uv.x*uu + uv.y*vv + uFov*ww);

      vec3 col = uBgColor;
      vec3 accum = vec3(0.0);
      float Tr = 1.0;
      float dist = 0.0;
      int stepsHard = int(uVolSteps);
      for(int i=0; i<256; i++){
        if(i >= stepsHard) break;
        float s = mix(uStepMin, uStepMax, clamp(dist/uMaxDist, 0.0, 1.0));
        vec3 pos = ro + rd * dist;
        vec2 stripeInfo;
        float dens = mediumDensity(pos, t, stripeInfo);
        vec3 L = normalize(-pos);
        float mu = dot(rd, L);
        float phase = hg(mu, uAniso);
        vec3 scatterCol = uLightColor * uLightIntensity * phase * dens;
        accum += Tr * scatterCol * s;
        Tr *= exp(-dens * s);
        dist += s;
        if(Tr < 1e-3 || dist > uMaxDist) break;
      }
      col += accum * abs(ro * 0.3) * uTint;

      float vig = 1.0 - uVignette * length(uv);
      col *= clamp(vig, 0.0, 1.0);

      float g = (hash21(gl_FragCoord.xy + fract(t*123.45)) - 0.5) * uGrainAmount * 1.4;
      col += g;

      col *= uExposure;
      col = col / (1.0 + col);
      col = pow(col, vec3(1.0 / uGamma));
      gl_FragColor = vec4(col, 1.0);
    }
  `;

  function initVolumetricBeams() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas || typeof THREE === 'undefined') return;

    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: 'low-power' });
    } catch (e) {
      return; // WebGL을 못 쓰면 조용히 포기하고 기존 다크 배경만 보여준다
    }

    const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2);
    renderer.setPixelRatio(dpr);

    const scene = new THREE.Scene();
    // 버텍스 셰이더가 position.xy를 그대로 clip space로 쓰기 때문에
    // 카메라 자체는 렌더 결과에 영향을 주지 않는다(더미).
    const camera = new THREE.PerspectiveCamera();

    const uniforms = {
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(1, 1) },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uSpeed: { value: 4.6 },
      uRadius: { value: 4.8 },
      uFov: { value: 1.25 },
      uMouseInfluence: { value: 0.35 },
      uAutoRotateSpeed: { value: 0.035 },
      uBeamCount: { value: 5 },
      uHalfAngle: { value: 0.065 },
      uEdgeSoft: { value: 0.045 },
      uBeamRot: { value: 0.7 },
      uTwistDepth: { value: 0.95 },
      uDensity: { value: 0.95 },
      uFalloff: { value: 0.15 },
      uAniso: { value: 0.86 },
      uLightIntensity: { value: 1.4 },
      uLightColor: { value: new THREE.Vector3(0.54, 0.74, 1.0) },
      uTint: { value: new THREE.Vector3(0.55, 0.38, 0.95) },
      uStripeFreq: { value: 800.0 },
      uStripeAmp: { value: 0.07 },
      uStripeSharp: { value: 0.08 },
      uStripeSpeed: { value: 0.16 },
      uStripeJit: { value: 0.91 },
      uVolSteps: { value: isMobile ? 90 : 190 },
      uStepMin: { value: 0.05 },
      uStepMax: { value: 0.1 },
      uMaxDist: { value: 3.0 },
      uExposure: { value: 0.5 },
      uGamma: { value: 2.0 },
      uGrainAmount: { value: 0.005 },
      uVignette: { value: 0.95 },
      uBgColor: { value: new THREE.Vector3(0.04, 0.035, 0.06) },
    };

    const material = new THREE.ShaderMaterial({
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
      uniforms,
      depthTest: false,
      depthWrite: false,
      side: THREE.DoubleSide,
    });

    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2, 1, 1), material);
    mesh.frustumCulled = false;
    scene.add(mesh);

    function resize() {
      const w = canvas.clientWidth || canvas.parentElement.clientWidth;
      const h = canvas.clientHeight || canvas.parentElement.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      uniforms.uResolution.value.set(w * dpr, h * dpr);
    }

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    resize();

    // 포인터에 따라 살짝 시야가 움직이는 효과 (원본의 마우스 인터랙션과 동일)
    const pointerSmoothing = 0.28;
    const targetMouse = { x: 0.5, y: 0.5 };
    function onPointerMove(clientX, clientY) {
      const rect = canvas.getBoundingClientRect();
      const nx = ((clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -(((clientY - rect.top) / rect.height) * 2 - 1);
      targetMouse.x = 0.5 + nx * 0.5;
      targetMouse.y = 0.5 + ny * 0.5;
    }
    window.addEventListener('pointermove', e => onPointerMove(e.clientX, e.clientY));

    let running = true;
    let frameId = null;
    const clock = new THREE.Clock();

    function tick() {
      if (!running) {
        frameId = null;
        return;
      }
      frameId = requestAnimationFrame(tick);
      uniforms.uTime.value = clock.getElapsedTime();
      uniforms.uMouse.value.x += (targetMouse.x - uniforms.uMouse.value.x) * pointerSmoothing;
      uniforms.uMouse.value.y += (targetMouse.y - uniforms.uMouse.value.y) * pointerSmoothing;
      renderer.render(scene, camera);
    }

    // 화면 밖으로 스크롤되거나 탭이 비활성화되면 렌더를 멈춰 자원을 아낀다
    const heroSection = document.getElementById('hero');
    const visibilityObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        running = entry.isIntersecting && !document.hidden;
        if (running && frameId === null) tick();
      });
    }, { threshold: 0.01 });
    if (heroSection) visibilityObserver.observe(heroSection);

    document.addEventListener('visibilitychange', () => {
      running = !document.hidden && (!heroSection || isElementInViewport(heroSection));
      if (running && frameId === null) tick();
    });

    function isElementInViewport(el) {
      const r = el.getBoundingClientRect();
      return r.bottom > 0 && r.top < window.innerHeight;
    }

    if (reduceMotion) {
      // 모션 최소화를 선호하는 경우, 한 프레임만 그려서 정적인 이미지로 둔다
      uniforms.uTime.value = 2.5;
      resize();
      renderer.render(scene, camera);
    } else {
      tick();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initVolumetricBeams);
  } else {
    initVolumetricBeams();
  }
})();
