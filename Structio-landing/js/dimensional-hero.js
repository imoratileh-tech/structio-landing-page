/**
 * STRUCTIO® — Dimensional 3D Typography Engine
 * Architectural WebGL Installation: S T R U C T I O Letterforms
 * Integrated with the 5-Colour Continuum
 */

(function () {
  'use strict';

  // State & References
  let container, canvas, renderer, scene, camera;
  let typographyGroup, letters = [];
  let lights = {};
  let animationFrameId;
  let isWebGLAvailable = false;
  let mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
  let currentPreset = 'studio';
  let isReducedMotion = false;
  let isDragging = false;
  let touchStart = { x: 0, y: 0 };

  // Exact 5-Colour Hex Tokens
  const PALETTE = {
    blueGrey: 0x2A363B,
    coral:    0xE84A5F,
    softCoral:0xFF847C,
    peach:    0xFECEA8,
    sage:     0x99B898,
    darkStage:0x161D1F
  };

  // Raw SVG Letter Path Data from Structio Architecture Brand System
  const LETTER_PATHS = [
    {
      id: 'S',
      d: "M332 -12Q256 -12 190.5 11.0Q125 34 85.0 80.5Q45 127 45 199Q45 205 45.5 211.0Q46 217 46 220H177Q177 218 176.5 212.5Q176 207 176 203Q176 154 218.5 126.0Q261 98 335 98Q418 98 454.5 121.5Q491 145 491 183Q491 216 468.0 236.5Q445 257 406.5 270.5Q368 284 322.5 296.0Q277 308 231.0 322.5Q185 337 146.5 359.5Q108 382 85.0 418.0Q62 454 62 508Q62 573 98.0 615.0Q134 657 196.5 677.5Q259 698 337 698Q411 698 471.5 677.0Q532 656 568.5 612.5Q605 569 605 499V487H476V497Q476 540 437.5 564.0Q399 588 336 588Q269 588 231.0 569.0Q193 550 193 514Q193 485 216.0 467.0Q239 449 277.5 436.0Q316 423 362.0 411.5Q408 400 453.5 385.5Q499 371 537.5 348.0Q576 325 599.0 289.5Q622 254 622 201Q622 124 584.5 77.0Q547 30 481.5 9.0Q416 -12 332 -12Z",
      x: 0.00
    },
    {
      id: 'T1',
      d: "M244 0V574H25V686H594V574H374V0Z",
      x: 95.90
    },
    {
      id: 'R',
      d: "M76 0V686H437Q551 686 607.0 628.5Q663 571 663 473Q663 406 633.0 354.5Q603 303 545 277L687 0H545L419 255H206V0ZM206 364H427Q477 364 504.0 393.0Q531 422 531 473Q531 522 504.5 548.5Q478 575 427 575H206Z",
      x: 185.51
    },
    {
      id: 'U',
      d: "M361 -12Q225 -12 148.5 54.0Q72 120 72 254V686H202V258Q202 179 243.5 138.5Q285 98 361 98Q437 98 479.5 138.5Q522 179 522 258V686H652V254Q652 120 575.0 54.0Q498 -12 361 -12Z",
      x: 287.97
    },
    {
      id: 'C',
      d: "M378 -12Q221 -12 133.0 72.5Q45 157 45 343Q45 524 133.0 611.0Q221 698 378 698Q463 698 531.5 669.0Q600 640 640.5 581.5Q681 523 681 433H548Q548 508 501.0 548.0Q454 588 380 588Q277 588 228.0 529.0Q179 470 179 354V332Q179 214 228.0 156.0Q277 98 380 98Q458 98 505.5 137.5Q553 177 553 252H681Q681 162 641.0 103.5Q601 45 532.5 16.5Q464 -12 378 -12Z",
      x: 391.36
    },
    {
      id: 'T2',
      d: "M244 0V574H25V686H594V574H374V0Z",
      x: 494.34
    },
    {
      id: 'I',
      d: "M76 0V686H206V0Z",
      x: 583.95
    },
    {
      id: 'O',
      d: "M391 -12Q230 -12 137.5 75.0Q45 162 45 343Q45 524 137.5 611.0Q230 698 391 698Q552 698 644.5 611.0Q737 524 737 343Q737 162 644.5 75.0Q552 -12 391 -12ZM391 98Q495 98 549.5 157.0Q604 216 604 331V353Q604 469 549.5 528.5Q495 588 391 588Q288 588 233.5 528.5Q179 469 179 353V331Q179 216 233.5 157.0Q288 98 391 98Z",
      x: 629.34
    }
  ];

  // Check WebGL availability
  function checkWebGL() {
    try {
      const testCanvas = document.createElement('canvas');
      return !!(window.WebGLRenderingContext && 
        (testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl')));
    } catch (e) {
      return false;
    }
  }

  // Fallback activation
  function activateFallback() {
    const fallbackEl = document.getElementById('hero-fallback-3d');
    if (fallbackEl) {
      fallbackEl.classList.add('active');
    }
    const canvasWrap = document.getElementById('hero-canvas-container');
    if (canvasWrap) {
      canvasWrap.style.display = 'none';
    }
  }

  // Initialize Scene
  function init() {
    container = document.getElementById('hero-canvas-container');
    if (!container) return;

    isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!window.THREE || !window.THREE.SVGLoader || !checkWebGL()) {
      activateFallback();
      return;
    }

    isWebGLAvailable = true;

    // 1. Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(PALETTE.darkStage);
    scene.fog = new THREE.FogExp2(PALETTE.darkStage, 0.0018);

    // 2. Camera
    const aspect = container.clientWidth / container.clientHeight;
    camera = new THREE.PerspectiveCamera(36, aspect, 1, 3000);
    updateCameraPosition();

    // 3. Renderer
    renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
      alpha: true
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);

    // 4. Lighting Rig (5-Colour Architecture)
    setupLighting();

    // 5. Letter Sculpture
    buildTypographyInstallation();
    updateCameraPosition();

    // 6. Architectural Ground & Datum Lines
    buildArchitecturalStage();

    // 7. Event Listeners
    setupInteractions();

    // 8. Start Loop
    animate();
  }

  function updateCameraPosition() {
    if (!camera) return;
    const width = window.innerWidth;
    if (typographyGroup) {
      // Scale group proportionally so letterforms fit seamlessly across all viewports
      const scaleFactor = Math.min(1, Math.max(0.44, width / 920));
      typographyGroup.scale.set(scaleFactor, scaleFactor, scaleFactor);
    }

    if (width <= 480) {
      camera.position.set(0, 65, 780);
      camera.fov = 40;
    } else if (width <= 768) {
      camera.position.set(0, 65, 720);
      camera.fov = 36;
    } else if (width <= 1200) {
      camera.position.set(0, 60, 690);
      camera.fov = 35;
    } else {
      camera.position.set(0, 55, 660);
      camera.fov = 33;
    }
    camera.updateProjectionMatrix();
    camera.lookAt(0, 42, 0);
  }

  function setupLighting() {
    // Ambient Light (Deep Blue-Grey base)
    lights.ambient = new THREE.AmbientLight(PALETTE.blueGrey, 1.4);
    scene.add(lights.ambient);

    // Key Light: Coral Red (Sharp directional architectural emphasis)
    lights.key = new THREE.DirectionalLight(PALETTE.coral, 4.0);
    lights.key.position.set(-240, 320, 340);
    lights.key.castShadow = true;
    lights.key.shadow.mapSize.width = 1024;
    lights.key.shadow.mapSize.height = 1024;
    lights.key.shadow.camera.near = 20;
    lights.key.shadow.camera.far = 1200;
    lights.key.shadow.bias = -0.0004;
    scene.add(lights.key);

    // Rim Light: Soft Coral (Crisp reflections along beveled letter facets)
    lights.rim = new THREE.DirectionalLight(PALETTE.softCoral, 3.4);
    lights.rim.position.set(300, 260, -100);
    scene.add(lights.rim);

    // Fill Light: Peach (Luminous warm architectural fill)
    lights.fill = new THREE.PointLight(PALETTE.peach, 2.8, 1500);
    lights.fill.position.set(180, 40, 380);
    scene.add(lights.fill);

    // Bounce / Floor Light: Muted Sage (Calm structural grounding)
    lights.bounce = new THREE.PointLight(PALETTE.sage, 2.2, 1200);
    lights.bounce.position.set(-160, -80, 180);
    scene.add(lights.bounce);
  }

  function buildTypographyInstallation() {
    typographyGroup = new THREE.Group();
    scene.add(typographyGroup);

    // Architectural Matte Stone / Composite Material with Beveled Specular Response
    const letterMaterial = new THREE.MeshStandardMaterial({
      color: 0x4B5E66,
      roughness: 0.28,
      metalness: 0.16,
      flatShading: false
    });

    const bevelMaterial = new THREE.MeshStandardMaterial({
      color: 0x768D96,
      roughness: 0.18,
      metalness: 0.32
    });

    const loader = new THREE.SVGLoader();

    // Build each letter from exact SVG path data
    LETTER_PATHS.forEach((item, index) => {
      const svgFragment = `<svg xmlns="http://www.w3.org/2000/svg"><path d="${item.d}" /></svg>`;
      const svgData = loader.parse(svgFragment);

      if (svgData.paths.length > 0) {
        const path = svgData.paths[0];
        const shapes = path.toShapes(true);

        const extrudeSettings = {
          steps: 2,
          depth: 26,
          bevelEnabled: true,
          bevelThickness: 3.0,
          bevelSize: 2.2,
          bevelOffset: 0,
          bevelSegments: 5
        };

        const geometry = new THREE.ExtrudeGeometry(shapes, extrudeSettings);
        
        // Scale to architectural dimensions. Raw font glyph paths naturally have +Y pointing up in Three.js
        geometry.scale(0.092, 0.092, 1);
        geometry.center();

        const mesh = new THREE.Mesh(geometry, [letterMaterial, bevelMaterial]);
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        // X placement with architectural kerning centered on wordmark midpoint
        const letterX = (item.x - 360) * 0.76;
        mesh.position.set(letterX, 0, 0);

        // Store initial coordinates for subtle floating motion
        mesh.userData = {
          initialX: letterX,
          initialY: 0,
          initialZ: 0,
          phase: index * 0.42,
          speed: 0.0014 + index * 0.0002
        };

        letters.push(mesh);
        typographyGroup.add(mesh);
      }
    });

    // Elevated position so the wordmark commands center stage above the lower text
    typographyGroup.position.set(0, 68, 0);
    typographyGroup.rotation.set(-0.05, 0.05, 0);
  }

  function buildArchitecturalStage() {
    // Subtle shadow-receiving datum plane
    const planeGeo = new THREE.PlaneGeometry(1600, 800);
    const planeMat = new THREE.ShadowMaterial({
      opacity: 0.35
    });
    const plane = new THREE.Mesh(planeGeo, planeMat);
    plane.rotation.x = -Math.PI / 2;
    plane.position.y = -65;
    plane.receiveShadow = true;
    scene.add(plane);

    // Subtle Architectural Datum Grid Lines
    const gridHelper = new THREE.GridHelper(1200, 24, PALETTE.coral, PALETTE.blueGrey);
    gridHelper.position.y = -65.2;
    gridHelper.material.opacity = 0.12;
    gridHelper.material.transparent = true;
    scene.add(gridHelper);
  }

  function setupInteractions() {
    // Mouse / Pointer Parallax
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('resize', onWindowResize);

    // Touch Interaction
    container.addEventListener('touchstart', onTouchStart, { passive: true });
    container.addEventListener('touchmove', onTouchMove, { passive: true });
    container.addEventListener('touchend', onTouchEnd, { passive: true });

    // UI Control Pills
    const presetBtns = document.querySelectorAll('[data-3d-preset]');
    presetBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const preset = e.currentTarget.getAttribute('data-3d-preset');
        applyLightingPreset(preset);
        presetBtns.forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
      });
    });

    const angleBtns = document.querySelectorAll('[data-3d-angle]');
    angleBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const angle = e.currentTarget.getAttribute('data-3d-angle');
        setCameraAngle(angle);
        angleBtns.forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
      });
    });

    // Scroll parallax coupling
    window.addEventListener('scroll', onWindowScroll, { passive: true });
  }

  function onPointerMove(e) {
    if (isReducedMotion) return;
    const halfW = window.innerWidth / 2;
    const halfH = window.innerHeight / 2;
    mouse.targetX = (e.clientX - halfW) / halfW;
    mouse.targetY = (e.clientY - halfH) / halfH;
  }

  function onTouchStart(e) {
    if (e.touches.length === 1) {
      isDragging = true;
      touchStart.x = e.touches[0].clientX;
      touchStart.y = e.touches[0].clientY;
    }
  }

  function onTouchMove(e) {
    if (!isDragging || e.touches.length !== 1 || isReducedMotion) return;
    const deltaX = (e.touches[0].clientX - touchStart.x) / (window.innerWidth / 2);
    const deltaY = (e.touches[0].clientY - touchStart.y) / (window.innerHeight / 2);
    mouse.targetX = deltaX * 1.5;
    mouse.targetY = deltaY * 1.5;
  }

  function onTouchEnd() {
    isDragging = false;
  }

  function onWindowScroll() {
    if (!typographyGroup) return;
    const scrollY = window.scrollY;
    if (scrollY < 900) {
      const scrollFactor = scrollY / 900;
      typographyGroup.rotation.x = -0.06 - (scrollFactor * 0.12);
      typographyGroup.position.y = - (scrollFactor * 35);
    }
  }

  function onWindowResize() {
    if (!container || !renderer || !camera) return;
    const width = container.clientWidth;
    const height = container.clientHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    updateCameraPosition();
    renderer.setSize(width, height);
  }

  function applyLightingPreset(preset) {
    currentPreset = preset;
    if (preset === 'coral-sunset') {
      lights.key.color.setHex(PALETTE.coral);
      lights.key.intensity = 3.2;
      lights.fill.color.setHex(PALETTE.peach);
      lights.fill.intensity = 2.4;
      lights.rim.color.setHex(PALETTE.softCoral);
      lights.bounce.intensity = 0.6;
    } else if (preset === 'sage-monolith') {
      lights.key.color.setHex(PALETTE.sage);
      lights.key.intensity = 2.4;
      lights.fill.color.setHex(PALETTE.blueGrey);
      lights.fill.intensity = 1.6;
      lights.rim.color.setHex(PALETTE.peach);
      lights.bounce.color.setHex(PALETTE.sage);
      lights.bounce.intensity = 2.0;
    } else {
      // Default Balanced Studio
      lights.key.color.setHex(PALETTE.coral);
      lights.key.intensity = 2.2;
      lights.fill.color.setHex(PALETTE.peach);
      lights.fill.intensity = 1.4;
      lights.rim.color.setHex(PALETTE.softCoral);
      lights.rim.intensity = 1.8;
      lights.bounce.color.setHex(PALETTE.sage);
      lights.bounce.intensity = 1.1;
    }
  }

  function setCameraAngle(angle) {
    if (!typographyGroup) return;
    if (angle === 'isometric') {
      typographyGroup.rotation.set(-0.25, 0.42, 0.08);
    } else if (angle === 'frontal') {
      typographyGroup.rotation.set(0, 0, 0);
    } else {
      // Reset Default Art-Directed Stance
      typographyGroup.rotation.set(-0.06, 0.08, 0);
    }
  }

  // Animation Loop
  function animate(timestamp) {
    animationFrameId = requestAnimationFrame(animate);

    // Smooth cursor interpolation
    mouse.x += (mouse.targetX - mouse.x) * 0.04;
    mouse.y += (mouse.targetY - mouse.y) * 0.04;

    if (typographyGroup && !isReducedMotion) {
      // Gentle controlled rotation responding to pointer
      typographyGroup.rotation.y = 0.08 + (mouse.x * 0.22);
      typographyGroup.rotation.x = -0.06 - (mouse.y * 0.16);

      // Subtle dynamic key light tracking
      if (lights.key) {
        lights.key.position.x = -180 + (mouse.x * 80);
        lights.key.position.y = 220 - (mouse.y * 60);
      }

      // Very subtle, premium architectural breathing motion for individual letters
      const time = timestamp * 0.001;
      letters.forEach((letter) => {
        letter.position.y = letter.userData.initialY + Math.sin(time + letter.userData.phase) * 1.8;
      });
    }

    renderer.render(scene, camera);
  }

  // Expose API for external control if needed
  window.Structio3D = {
    init,
    applyLightingPreset,
    setCameraAngle
  };

  // Auto-init on DOM Ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
