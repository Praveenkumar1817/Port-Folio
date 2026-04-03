import { Renderer, Program, Mesh, Color, Triangle } from 'https://cdn.skypack.dev/ogl';

document.addEventListener('DOMContentLoaded', () => {
    console.log("Main.js loaded - Initializing...");

    /* ==========================================
       Mobile Menu
    ========================================== */
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = menuToggle.querySelector('i');
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times');
        });
    }

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            const icon = menuToggle.querySelector('i');
            icon.classList.add('fa-bars');
            icon.classList.remove('fa-times');
        });
    });

    /* ==========================================
       Hacker / Decoding Text Effect
    ========================================== */
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const titleElement = document.querySelector(".glitch-text");

    if (titleElement) {
        let interval = null;
        const originalText = titleElement.dataset.text || titleElement.innerText;

        const startDecoding = () => {
            let iteration = 0;
            clearInterval(interval);

            interval = setInterval(() => {
                titleElement.innerText = originalText
                    .split("")
                    .map((letter, index) => {
                        if (index < iteration) {
                            return originalText[index];
                        }
                        return letters[Math.floor(Math.random() * 26)];
                    })
                    .join("");

                if (iteration >= originalText.length) {
                    clearInterval(interval);
                }

                iteration += 1 / 3;
            }, 30);
        };

        startDecoding();
        titleElement.addEventListener('mouseover', startDecoding);
    }

    /* ==========================================
       Interact: Spotlight Effect
    ========================================== */
    const spotlightCards = document.querySelectorAll('[data-spotlight]');

    spotlightCards.forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    /* ==========================================
       Interact: Tilt Effect
    ========================================== */
    const tiltCards = document.querySelectorAll('.tilt-card');

    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -10;
            const rotateY = ((x - centerX) / centerX) * 10;
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        });
    });


    /* ==========================================
       Scroll Animations
    ========================================== */
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const elementsToAnimate = document.querySelectorAll(
        '.section-title, .card-glass, .timeline-item, .hero-badge, .btn, .stat-card, .tech-pill, .bento-item, .cert-card-ticket'
    );

    elementsToAnimate.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)';
        observer.observe(el);
    });

    document.querySelectorAll('.achievement-card-timeline').forEach(el => {
        observer.observe(el);
    });

    const styleSheet = document.createElement("style");
    styleSheet.innerText = `
        .visible {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(styleSheet);


    /* ==========================================
       Mouse Parallax Effect
    ========================================== */
    const bgGrid = document.querySelector('.bg-grid');
    if (bgGrid) {
        document.addEventListener('mousemove', (e) => {
            const x = (window.innerWidth - e.pageX * 2) / 100;
            const y = (window.innerHeight - e.pageY * 2) / 100;
            bgGrid.style.transform = `translateX(${x}px) translateY(${y}px)`;
        });
    }

    /* ==========================================
       ReactBits: Faulty Terminal (OGL Port)
    ========================================== */
    console.log("Starting Faulty Terminal setup...");
    try {
        const container = document.getElementById('home');

        let canvasElement = document.getElementById('terminal-canvas');
        if (canvasElement) canvasElement.remove();

        if (container) {
            console.log("Container found, initializing OGL");
            const renderer = new Renderer({
                dpr: 1, // Optimized for performance
                alpha: true
            });
            const gl = renderer.gl;
            gl.clearColor(0, 0, 0, 0);

            const canvas = gl.canvas;
            canvas.id = 'terminal-canvas';
            container.insertBefore(canvas, container.firstChild);

            // Config 
            const config = {
                scale: 1,
                gridMul: [2, 1],
                digitSize: 1.5,
                scanlineIntensity: 0.3,
                glitchAmount: 1.0,
                flickerAmount: 0.1,
                noiseAmp: 0.05,
                chromaticAberration: 0,
                dither: 0,
                curvature: 0.2,
                tint: [1.0, 1.0, 1.0],
                mouseReact: true,
                mouseStrength: 0.2,
                brightness: 1.0
            };

            const vertexShader = `
            attribute vec2 position;
            attribute vec2 uv;
            varying vec2 vUv;
            void main() {
              vUv = uv;
              gl_Position = vec4(position, 0.0, 1.0);
            }
            `;

            const fragmentShader = `
            precision mediump float;
            varying vec2 vUv;

            uniform float iTime;
            uniform vec3  iResolution;
            uniform float uScale;
            uniform vec2  uGridMul;
            uniform float uDigitSize;
            uniform float uScanlineIntensity;
            uniform float uGlitchAmount;
            uniform float uFlickerAmount;
            uniform float uNoiseAmp;
            uniform float uChromaticAberration;
            uniform float uDither;
            uniform float uCurvature;
            uniform vec3  uTint;
            uniform vec2  uMouse;
            uniform float uMouseStrength;
            uniform float uUseMouse;
            uniform float uPageLoadProgress;
            uniform float uUsePageLoadAnimation;
            uniform float uBrightness;

            float time;

            float hash21(vec2 p){
              p = fract(p * 234.56);
              p += dot(p, p + 34.56);
              return fract(p.x * p.y);
            }

            float noise(vec2 p) {
              return sin(p.x * 10.0) * sin(p.y * (3.0 + sin(time * 0.090909))) + 0.2; 
            }

            mat2 rotate(float angle) {
              float c = cos(angle);
              float s = sin(angle);
              return mat2(c, -s, s, c);
            }

            float fbm(vec2 p) {
              p *= 1.1;
              float f = 0.0;
              float amp = 0.5 * uNoiseAmp;
              
              mat2 modify0 = rotate(time * 0.02);
              f += amp * noise(p);
              p = modify0 * p * 2.0;
              amp *= 0.454545;
              
              mat2 modify1 = rotate(time * 0.02);
              f += amp * noise(p);
              p = modify1 * p * 2.0;
              amp *= 0.454545;
              
              mat2 modify2 = rotate(time * 0.08);
              f += amp * noise(p);
              
              return f;
            }

            float pattern(vec2 p, out vec2 q, out vec2 r) {
              vec2 offset1 = vec2(1.0);
              vec2 offset0 = vec2(0.0);
              mat2 rot01 = rotate(0.1 * time);
              mat2 rot1 = rotate(0.1);
              
              q = vec2(fbm(p + offset1), fbm(rot01 * p + offset1));
              r = vec2(fbm(rot1 * q + offset0), fbm(q + offset0));
              return fbm(p + r);
            }

            float digit(vec2 p){
                vec2 grid = uGridMul * 15.0;
                vec2 s = floor(p * grid) / grid;
                p = p * grid;
                vec2 q, r;
                float intensity = pattern(s * 0.1, q, r) * 1.3 - 0.03;
                
                if(uUseMouse > 0.5){
                    vec2 mouseWorld = uMouse * uScale;
                    float distToMouse = distance(s, mouseWorld);
                    float mouseInfluence = exp(-distToMouse * 8.0) * uMouseStrength * 10.0;
                    intensity += mouseInfluence;
                    
                    float ripple = sin(distToMouse * 20.0 - iTime * 5.0) * 0.1 * mouseInfluence;
                    intensity += ripple;
                }
                
                if(uUsePageLoadAnimation > 0.5){
                    float cellRandom = fract(sin(dot(s, vec2(12.9898, 78.233))) * 43758.5453);
                    float cellDelay = cellRandom * 0.8;
                    float cellProgress = clamp((uPageLoadProgress - cellDelay) / 0.2, 0.0, 1.0);
                    
                    float fadeAlpha = smoothstep(0.0, 1.0, cellProgress);
                    intensity *= fadeAlpha;
                }
                
                p = fract(p);
                p *= uDigitSize;
                
                float px5 = p.x * 5.0;
                float py5 = (1.0 - p.y) * 5.0;
                float x = fract(px5);
                float y = fract(py5);
                
                float i = floor(py5) - 2.0;
                float j = floor(px5) - 2.0;
                float n = i * i + j * j;
                float f = n * 0.0625;
                
                float isOn = step(0.1, intensity - f);
                float brightness = isOn * (0.2 + y * 0.8) * (0.75 + x * 0.25);
                
                return step(0.0, p.x) * step(p.x, 1.0) * step(0.0, p.y) * step(p.y, 1.0) * brightness;
            }

            float onOff(float a, float b, float c) {
              return step(c, sin(iTime + a * cos(iTime * b))) * uFlickerAmount;
            }

            float displace(vec2 look) {
                float y = look.y - mod(iTime * 0.25, 1.0);
                float window = 1.0 / (1.0 + 50.0 * y * y);
                return sin(look.y * 20.0 + iTime) * 0.0125 * onOff(4.0, 2.0, 0.8) * (1.0 + cos(iTime * 60.0)) * window;
            }

            vec3 getColor(vec2 p){
                float bar = step(mod(p.y + time * 20.0, 1.0), 0.2) * 0.4 + 1.0;
                bar *= uScanlineIntensity;
                
                float displacement = displace(p);
                p.x += displacement;

                if (uGlitchAmount != 1.0) {
                  float extra = displacement * (uGlitchAmount - 1.0);
                  p.x += extra;
                }

                float middle = digit(p);
                
                const float off = 0.002;
                float sum = digit(p + vec2(-off, -off)) + digit(p + vec2(0.0, -off)) + digit(p + vec2(off, -off)) +
                            digit(p + vec2(-off, 0.0)) + digit(p + vec2(0.0, 0.0)) + digit(p + vec2(off, 0.0)) +
                            digit(p + vec2(-off, off)) + digit(p + vec2(0.0, off)) + digit(p + vec2(off, off));
                
                vec3 baseColor = vec3(0.9) * middle + sum * 0.1 * vec3(1.0) * bar;
                return baseColor;
            }

            vec2 barrel(vec2 uv){
              vec2 c = uv * 2.0 - 1.0;
              float r2 = dot(c, c);
              c *= 1.0 + uCurvature * r2;
              return c * 0.5 + 0.5;
            }

            void main() {
                time = iTime * 0.333333;
                vec2 uv = vUv;

                if(uCurvature != 0.0){
                  uv = barrel(uv);
                }
                
                vec2 p = uv * uScale;
                vec3 col = getColor(p);

                if(uChromaticAberration != 0.0){
                  vec2 ca = vec2(uChromaticAberration) / iResolution.xy;
                  col.r = getColor(p + ca).r;
                  col.b = getColor(p - ca).b;
                }

                col *= uTint;
                col *= uBrightness;

                if(uDither > 0.0){
                  float rnd = hash21(gl_FragCoord.xy);
                  col += (rnd - 0.5) * (uDither * 0.003922);
                }

                gl_FragColor = vec4(col, 1.0);
            }
            `;

            const geometry = new Triangle(gl);

            const program = new Program(gl, {
                vertex: vertexShader,
                fragment: fragmentShader,
                uniforms: {
                    iTime: { value: 0 },
                    iResolution: { value: new Color(gl.canvas.width, gl.canvas.height, gl.canvas.width / gl.canvas.height) },
                    uScale: { value: config.scale },
                    uGridMul: { value: new Float32Array(config.gridMul) },
                    uDigitSize: { value: config.digitSize },
                    uScanlineIntensity: { value: config.scanlineIntensity },
                    uGlitchAmount: { value: config.glitchAmount },
                    uFlickerAmount: { value: config.flickerAmount },
                    uNoiseAmp: { value: config.noiseAmp },
                    uChromaticAberration: { value: config.chromaticAberration },
                    uDither: { value: config.dither },
                    uCurvature: { value: config.curvature },
                    uTint: { value: new Color(config.tint[0], config.tint[1], config.tint[2]) },
                    uMouse: { value: new Float32Array([0.5, 0.5]) },
                    uMouseStrength: { value: config.mouseStrength },
                    uUseMouse: { value: config.mouseReact ? 1 : 0 },
                    uPageLoadProgress: { value: 1.0 }, // Skip load anim for now
                    uUsePageLoadAnimation: { value: 0.0 },
                    uBrightness: { value: config.brightness }
                },
                transparent: true
            });

            const mesh = new Mesh(gl, { geometry, program });

            console.log("Mesh created, starting loop");

            function resize() {
                renderer.setSize(container.offsetWidth, container.offsetHeight);
                program.uniforms.iResolution.value = new Color(
                    gl.canvas.width,
                    gl.canvas.height,
                    gl.canvas.width / gl.canvas.height
                );
            }
            window.addEventListener('resize', resize);
            resize();

            // Mouse Move
            const mouse = { x: 0.5, y: 0.5 };
            const smoothMouse = { x: 0.5, y: 0.5 };

            container.addEventListener('mousemove', e => {
                const rect = container.getBoundingClientRect();
                mouse.x = (e.clientX - rect.left) / rect.width;
                mouse.y = 1 - (e.clientY - rect.top) / rect.height;
            });

            let rafId;
            const update = (t) => {
                rafId = requestAnimationFrame(update);
                const time = t * 0.001 * 0.3; // timeScale = 0.3
                program.uniforms.iTime.value = time;

                // Smooth Mouse
                const damping = 0.08;
                smoothMouse.x += (mouse.x - smoothMouse.x) * damping;
                smoothMouse.y += (mouse.y - smoothMouse.y) * damping;
                program.uniforms.uMouse.value.set([smoothMouse.x, smoothMouse.y]);

                renderer.render({ scene: mesh });
            };
            rafId = requestAnimationFrame(update);
        }

    } catch (e) {
        console.error("Critical Error in Faulty Terminal Init:", e);
    }
});
