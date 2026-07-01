/**
 * RAFIH ANJA - 2000+ LINES MASTERPIECE (JS CORE)
 * Features: Lenis, WebGL Shader Background (Three.js), Terminal UI Typing, ScrollTrigger Timeline, Rich Motion
 */

document.addEventListener("DOMContentLoaded", () => {
    gsap.registerPlugin(ScrollTrigger);
    
    // Fix mobile scroll jump when address bar shows/hides
    ScrollTrigger.config({ ignoreMobileResize: true });
    
    let isPerfMode = false;
    let animateShader;
    let animateParticles;
    let shaderAnimId = null;
    let particleAnimId = null;
    
    // ==========================================
    // 1. CUSTOM CURSOR
    // ==========================================
    // Prevent initial flicker before preloader finishes
    gsap.set(['.elegant-heading .line', '.hero-desc .line', '.terminal-ui', '.site-header'], { opacity: 0 });

    // Scroll Merge Interaction for Header
    const headerInner = document.querySelector('.header-inner');
    
    ScrollTrigger.create({
        trigger: 'body',
        start: "100px top",
        onEnter: () => headerInner.classList.add('scrolled'),
        onLeaveBack: () => {
            headerInner.classList.remove('scrolled');
            headerInner.classList.remove('expanded');
        }
    });

    gsap.to('.site-header', {
        scrollTrigger: {
            trigger: 'body',
            start: "100px top",
            end: "300px top",
            scrub: 1
        },
        paddingTop: "15px"
    });

    // Expand header on click when scrolled
    let expandTimeout;
    headerInner.addEventListener('click', () => {
        if (headerInner.classList.contains('scrolled')) {
            headerInner.classList.add('expanded');
            clearTimeout(expandTimeout);
            expandTimeout = setTimeout(() => {
                headerInner.classList.remove('expanded');
            }, 3000);
        }
    });

    // Custom Cursor
    const cursor = document.getElementById('micro-cursor');
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorRing = document.querySelector('.cursor-ring');
    let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    let pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        gsap.to(cursorDot, { x: mouse.x, y: mouse.y, duration: 0.1, overwrite: true });
    });

    const updateCursorRing = () => {
        pos.x += (mouse.x - pos.x) * 0.15;
        pos.y += (mouse.y - pos.y) * 0.15;
        gsap.set(cursorRing, { x: pos.x, y: pos.y });
        requestAnimationFrame(updateCursorRing);
    };
    updateCursorRing();

    document.querySelectorAll('a, button, .interactive-hover, .skill-item').forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
    });

    // ==========================================
    // 1.2 "WOW" EFFECT: SPOTLIGHT & 3D TILT
    // ==========================================
    const heroSection = document.querySelector('.section-hero');
    const heroTextWrap = document.querySelector('.hero-text');
    
    if (heroSection && heroTextWrap && window.innerWidth > 768) {
        heroSection.addEventListener('mousemove', (e) => {
            const rect = heroSection.getBoundingClientRect();
            // Spotlight Variables
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            heroSection.style.setProperty('--mouse-x', `${x}px`);
            heroSection.style.setProperty('--mouse-y', `${y}px`);

            // 3D Tilt Variables
            const xNorm = (x / rect.width) - 0.5; // -0.5 to 0.5
            const yNorm = (y / rect.height) - 0.5; // -0.5 to 0.5
            gsap.to(heroTextWrap, {
                rotationY: xNorm * 15, // max 15deg tilt
                rotationX: -yNorm * 15, // max 15deg tilt
                transformPerspective: 1000,
                transformOrigin: "center center",
                ease: "power2.out",
                duration: 0.5
            });
        });

        heroSection.addEventListener('mouseleave', () => {
            gsap.to(heroTextWrap, {
                rotationY: 0,
                rotationX: 0,
                ease: "power3.out",
                duration: 1
            });
        });
    }

    // ==========================================
    // 1.5 MAGNETIC BUTTONS & GLITCH TEXT
    // ==========================================
    // Magnetic Hover Logic
    document.querySelectorAll('.nav-link, .cv-link, .lang-btn, .brand-name').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            if(window.innerWidth <= 768) return; // Disable on mobile
            const rect = btn.getBoundingClientRect();
            const h = rect.width / 2;
            const w = rect.height / 2;
            const x = e.clientX - rect.left - h;
            const y = e.clientY - rect.top - w;
            gsap.to(btn, { x: x * 0.3, y: y * 0.3, duration: 0.4, ease: "power2.out" });
        });
        btn.addEventListener('mouseleave', () => {
            if(window.innerWidth <= 768) return; // Disable on mobile
            gsap.to(btn, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.3)" });
        });
    });

    // Lightweight Text Glitch/Scramble Effect
    const glitchChars = '!<>-_\\/[]{}—=+*^?#________';
    document.querySelectorAll('.brand-name, .nav-link').forEach(el => {
        const originalText = el.innerText;
        el.addEventListener('mouseenter', () => {
            // Hanya jalankan jika bukan tampilan mobile untuk performa
            if(window.innerWidth > 768) {
                let iteration = 0;
                clearInterval(el.dataset.scrambleInterval);
                el.dataset.scrambleInterval = setInterval(() => {
                    el.innerText = originalText.split('').map((letter, index) => {
                        if(index < iteration) { return originalText[index]; }
                        return glitchChars[Math.floor(Math.random() * glitchChars.length)];
                    }).join('');
                    if(iteration >= originalText.length) { 
                        clearInterval(el.dataset.scrambleInterval);
                        el.innerText = originalText;
                    }
                    iteration += 1 / 2;
                }, 30);
            }
        });
        // Pastikan teks kembali normal saat leave jika interval belum selesai
        el.addEventListener('mouseleave', () => {
            clearInterval(el.dataset.scrambleInterval);
            el.innerText = originalText;
        });
    });

    // ==========================================
    // 2. SMOOTH SCROLL (LENIS)
    // ==========================================
    const lenis = new Lenis({
        lerp: 0.08, // Lerp is much smoother and performant on lower-end devices than fixed duration
        wheelMultiplier: 0.8, // Slightly softer wheel
        smoothWheel: true,
        syncTouch: false, // Turn off on mobile to prevent scroll fighting/jumping
        smoothTouch: false, // Let native mobile scrolling take over
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0, 0);
    lenis.stop(); // Stop during preload

    // ==========================================
    // 3. PRELOADER & TEXT SPLITTING
    // ==========================================
    const splitLines = new SplitType('.split-lines', { types: 'lines' });
    document.querySelectorAll('.line').forEach(el => {
        const wrap = document.createElement('div');
        wrap.style.overflow = 'hidden';
        el.parentNode.insertBefore(wrap, el);
        wrap.appendChild(el);
    });

    const preloaderPctHuge = document.querySelector('.preloader-percent-huge');
    const preloaderStatus = document.getElementById('preloader-status-text');
    const progressFill = document.querySelector('.preloader-progress-fill');
    
    const statuses = [
        "[ BOOTING SYSTEM ]",
        "[ LOADING SHADERS ]",
        "[ INJECTING GSAP ]",
        "[ COMPILING UI ]",
        "[ READY ]"
    ];
    let statusIndex = 0;

    // Animate corner brackets entrance
    gsap.from('.pl-corner', { opacity: 0, scale: 0.5, duration: 0.6, stagger: 0.1, ease: "back.out(2)" });
    gsap.from('.pl-ring', { scale: 0.3, opacity: 0, duration: 1, ease: "power2.out" });
    
    let progress = { val: 0 };
    gsap.to(progress, {
        val: 100,
        duration: window.innerWidth > 768 ? 1.8 : 0.8, // Loadscreen 0.8 detik di mobile
        ease: "power2.inOut",
        onUpdate: () => {
            const v = Math.round(progress.val);
            preloaderPctHuge.innerText = v;
            progressFill.style.width = progress.val + "%";
            
            // Update status text based on progress
            let targetIndex = Math.floor((progress.val / 100) * statuses.length);
            if (targetIndex >= statuses.length) targetIndex = statuses.length - 1;
            if (targetIndex !== statusIndex) {
                statusIndex = targetIndex;
                gsap.fromTo(preloaderStatus, { opacity: 0, y: 5 }, { opacity: 1, y: 0, duration: 0.2 });
                preloaderStatus.innerText = statuses[statusIndex];
            }
        },
        onComplete: () => {
            // Cinematic clip-path exit animation
            const tl = gsap.timeline({
                onComplete: () => {
                    document.getElementById('preloader').style.display = 'none';
                    document.body.classList.remove('loading-state');
                    lenis.start();
                    initHero();
                }
            });
            tl.to('.preloader-content-huge', { opacity: 0, scale: 0.9, duration: 0.3, ease: "power2.inOut" }, 0)
              .to('.pl-corner', { opacity: 0, scale: 1.5, duration: 0.4, stagger: 0.05 }, 0)
              .to('.pl-ring', { scale: 2, opacity: 0, duration: 0.5 }, 0)
              .to('.pl-scanline', { opacity: 0, duration: 0.2 }, 0)
              .to('#preloader', { 
                  clipPath: 'circle(0% at 50% 50%)', 
                  duration: 1, 
                  ease: "expo.inOut" 
              }, 0.15);
        }
    });

    // ==========================================
    // 4. TERMINAL TYPING ANIMATION
    // ==========================================
    function typeText(element, text, speed, onComplete) {
        let i = 0;
        element.innerHTML = "";
        function typeWriter() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(typeWriter, speed);
            } else if (onComplete) {
                setTimeout(onComplete, 500);
            }
        }
        typeWriter();
    }

    // ==========================================
    // 5. HERO ANIMATION SEQUENCE
    // ==========================================
    function initHero() {
        // Typography entrance
        gsap.fromTo('.elegant-heading .line', 
            { yPercent: 120, opacity: 0 },
            { yPercent: 0, opacity: 1, duration: 1.2, stagger: 0.1, ease: "power4.out", clearProps: "all" }
        );
        
        gsap.fromTo('.hero-desc .line', 
            { yPercent: 100, opacity: 0 },
            { yPercent: 0, opacity: 1, duration: 1, stagger: 0.1, delay: 0.5, ease: "power3.out", clearProps: "all" }
        );

        // Terminal Sequence
        gsap.fromTo('.terminal-ui', 
            { y: 50, rotateX: 10, rotateY: -5, opacity: 0 },
            { y: 0, rotateX: 0, rotateY: -5, opacity: 1, duration: 1.5, delay: 0.2, ease: "expo.out", clearProps: "all" }
        );

        setTimeout(() => {
            const type1 = document.getElementById('typewriter-1');
            const targetText1 = type1.getAttribute('data-' + (document.querySelector('.lang-btn.active').classList.contains('id') ? 'id' : 'en'));
            typeText(type1, targetText1, 100, () => {
                document.getElementById('term-out-1').classList.remove('hidden');
                setTimeout(() => {
                    document.getElementById('term-line-2').classList.remove('hidden');
                    const type2 = document.getElementById('typewriter-2');
                    const targetText2 = type2.getAttribute('data-' + (document.querySelector('.lang-btn.active').classList.contains('id') ? 'id' : 'en'));
                    typeText(type2, targetText2, 80, () => {
                        document.getElementById('term-out-2').classList.remove('hidden');
                        const inputLine = document.getElementById('term-input-line');
                        const cliInput = document.getElementById('terminal-cli-input');
                        if (inputLine && cliInput) {
                            inputLine.classList.remove('hidden');
                            cliInput.focus();
                        }
                        gsap.to('.system-msg', { opacity: 0.2, repeat: -1, yoyo: true, duration: 0.5 });
                    });
                }, 800);
            });
        }, 1500);

        // Header entrance
        gsap.fromTo('.site-header', 
            { y: -50, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, delay: 0.5, clearProps: "transform,opacity" }
        );
    }

    // ==========================================
    // 6. ABOUT & SKILLS (RICH SCROLL MOTION)
    // ==========================================
    // Decrypter Cipher Header reveals on section-labels
    gsap.utils.toArray('.section-label').forEach(label => {
        const originalText = label.innerText;
        const matrixChars = "█▓▒░<>/[]{}*#$_-+=@01";
        
        gsap.from(label, {
            scrollTrigger: { 
                trigger: label, 
                start: 'top 85%',
                onEnter: () => {
                    let iteration = 0;
                    clearInterval(label.dataset.cipherInterval);
                    label.dataset.cipherInterval = setInterval(() => {
                        label.innerText = originalText.split('').map((letter, index) => {
                            if (index < iteration) {
                                return originalText[index];
                            }
                            if (letter === ' ' || letter === '/' || !isNaN(letter)) {
                                return letter;
                            }
                            return matrixChars[Math.floor(Math.random() * matrixChars.length)];
                        }).join('');
                        
                        if (iteration >= originalText.length) {
                            clearInterval(label.dataset.cipherInterval);
                            label.innerText = originalText;
                        }
                        iteration += 1 / 3;
                    }, 40);
                }
            },
            x: -20, opacity: 0, duration: 1, ease: "power3.out"
        });
    });

    // Image Parallax
    gsap.to('.small-photo', {
        yPercent: 20,
        ease: "none",
        scrollTrigger: {
            trigger: ".small-photo-wrap",
            start: "top bottom",
            end: "bottom top",
            scrub: true
        }
    });
    
    gsap.from('.small-photo-wrap', {
        scrollTrigger: { trigger: '.section-about', start: 'top 75%' },
        scale: 0.8, rotate: -5, opacity: 0, duration: 1.5, ease: "back.out(1.2)"
    });

    gsap.from('.bio-text', {
        scrollTrigger: { trigger: '.bio-text', start: 'top 80%' },
        y: 30, opacity: 0, duration: 1, ease: "power3.out"
    });

    gsap.from('.cv-link', {
        scrollTrigger: { trigger: '.cv-link', start: 'top 85%' },
        y: 20, opacity: 0, duration: 0.8, delay: 0.2, ease: "power3.out"
    });

    // Skills Groups Stagger Entrance
    const skillGroups = document.querySelectorAll('.skills-group');
    if (skillGroups.length > 0) {
        gsap.from(skillGroups, {
            scrollTrigger: { trigger: '.skills-groups', start: 'top 80%' },
            x: 40, opacity: 0, duration: 0.8, stagger: 0.15, ease: "power3.out"
        });
    }

    // ==========================================
    // 7. JOURNEY TIMELINE SCROLL TRIGGER
    // ==========================================
    const timelineNodes = document.querySelectorAll('.timeline-item');
    
    gsap.to('.timeline-progress', {
        scrollTrigger: { trigger: '.timeline-container', start: 'top 60%', end: 'bottom 50%', scrub: 1 },
        height: '100%', ease: "none"
    });

    timelineNodes.forEach((node, index) => {
        // Node fade in from side
        gsap.from(node.querySelector('.timeline-content'), {
            scrollTrigger: { trigger: node, start: 'top 75%' },
            x: index % 2 === 0 ? 50 : -50, opacity: 0, duration: 1, ease: "power3.out"
        });

        // Dot pulse
        ScrollTrigger.create({
            trigger: node, start: 'top 55%',
            onEnter: () => {
                node.classList.add('active');
                gsap.from(node.querySelector('.timeline-dot'), { scale: 2, duration: 0.5, ease: "back.out(2)" });
            },
            onLeaveBack: () => node.classList.remove('active')
        });
    });



    // ==========================================
    // 8. HORIZONTAL SCROLL PROJECTS
    // ==========================================
    const horizontalSection = document.querySelector('.horizontal-scroll-section');
    const horizontalContainer = document.querySelector('.horizontal-scroll-container');
    const projectCards = document.querySelectorAll('.h-project-card');

    if (horizontalSection && horizontalContainer) {
        // Calculate the total scrolling distance based on container width
        const getScrollAmount = () => {
            const containerWidth = horizontalContainer.scrollWidth;
            return -(containerWidth - window.innerWidth);
        };

        const tween = gsap.to(horizontalContainer, {
            x: getScrollAmount,
            ease: "none"
        });

        ScrollTrigger.create({
            trigger: horizontalSection,
            start: "top top",
            end: () => `+=${getScrollAmount() * -1}`,
            pin: true,
            animation: tween,
            scrub: 1,
            invalidateOnRefresh: true
        });
        
        // Entrance animation for cards
        gsap.from(projectCards, {
            scrollTrigger: { trigger: horizontalSection, start: 'top 85%' },
            y: 50, opacity: 0, duration: 1, stagger: 0.15, ease: "power3.out"
        });
    }

    // ==========================================
    // 9. WEBGL SHADER BACKGROUND (THREE.JS) & PARTICLE CANVAS (2D)
    // ==========================================
    const container = document.getElementById('webgl-container');
    const pCanvas = document.getElementById('particle-canvas');
    const scrollData = { velocity: 0, scroll: 0 };
    
    try {
        const scene = new THREE.Scene();
        const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
        const renderer = new THREE.WebGLRenderer({ alpha: true });
        
        // Optimize pixel ratio for mobile to maintain 60fps
        renderer.setPixelRatio(window.innerWidth <= 768 ? 1 : Math.min(window.devicePixelRatio, 2));
        renderer.setSize(window.innerWidth, window.innerHeight);
        container.appendChild(renderer.domElement);

        const vertexShader = `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = vec4(position, 1.0);
            }
        `;

        const fragmentShader = `
            precision mediump float;
            uniform float time;
            uniform vec2 resolution;
            uniform float scroll;
            uniform float velocity;
            varying vec2 vUv;

            // Highly optimized 2D Value Noise (Zero logical branches)
            float noise(in vec2 p) {
                vec2 i = floor(p);
                vec2 f = fract(p);
                vec2 u = f * f * (3.0 - 2.0 * f);
                
                float a = sin(dot(i + vec2(0.0, 0.0), vec2(127.1, 311.7))) * 43758.5453123;
                float b = sin(dot(i + vec2(1.0, 0.0), vec2(127.1, 311.7))) * 43758.5453123;
                float c = sin(dot(i + vec2(0.0, 1.0), vec2(127.1, 311.7))) * 43758.5453123;
                float d = sin(dot(i + vec2(1.0, 1.0), vec2(127.1, 311.7))) * 43758.5453123;
                
                return mix(mix(fract(a), fract(b), u.x), mix(fract(c), fract(d), u.x), u.y);
            }

            // High-speed 2-octave FBM for volumetric gas effect
            float fbm(in vec2 p) {
                float v = 0.0;
                float a = 0.5;
                vec2 shift = vec2(100.0);
                mat2 rot = mat2(0.80, 0.60, -0.60, 0.80);
                for (int i = 0; i < 2; ++i) {
                    v += a * noise(p);
                    p = rot * p * 2.0 + shift;
                    a *= 0.5;
                }
                return v;
            }

            void main() {
                vec2 uv = gl_FragCoord.xy / resolution.xy;
                vec2 p = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
                
                // Plasma distortion for liquid-like organic movement with zero GPU lag
                float t = time * 0.15;
                p.x += sin(p.y * 1.5 + t) * 0.4;
                p.y += cos(p.x * 1.5 - t) * 0.4;
                
                // Wave distortion based on velocity and scroll speed
                float deform = sin(p.x * 2.0 + time * 0.3) * (velocity * 0.015);
                p.y += scroll * 0.0004 + deform;
                p.x += deform;
                
                // Calculate FBM layers
                float n = fbm(p * 0.6);
                float n2 = fbm(p * 1.2 + n * 0.3);
                
                // Glowing HSL-tailored colors (Violet purple and Cyan blue)
                vec3 col1 = vec3(0.5, 0.15, 0.85); // Purple
                vec3 col2 = vec3(0.02, 0.45, 0.7);  // Cyan Blue
                vec3 bgColor = vec3(0.03, 0.03, 0.05); // Base background
                
                // Blend nebula gas with background
                vec3 gasColor = mix(col1, col2, n2 * 0.8 + 0.2);
                vec3 finalColor = mix(bgColor, gasColor, clamp(n * n * 2.2, 0.0, 1.0));
                
                // Smooth grid pattern overlay
                vec2 gridUv = fract(uv * 15.0 + vec2(0.0, scroll * 0.0001));
                float lineX = smoothstep(0.012, 0.0, abs(gridUv.x - 0.5));
                float lineY = smoothstep(0.012, 0.0, abs(gridUv.y - 0.5));
                float gridPattern = max(lineX, lineY);
                finalColor = mix(finalColor, vec3(0.4, 0.2, 0.7) * 0.15, gridPattern * 0.3);
                
                // Vignette
                float dist = distance(uv, vec2(0.5));
                finalColor *= (1.0 - dist * 0.8);
                
                gl_FragColor = vec4(finalColor, 1.0);
            }
        `;

        const uniforms = {
            time: { value: 0 },
            resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
            scroll: { value: 0 },
            velocity: { value: 0 }
        };

        const geometry = new THREE.PlaneGeometry(2, 2);
        const material = new THREE.ShaderMaterial({ vertexShader, fragmentShader, uniforms });
        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);

        window.addEventListener('resize', () => {
            renderer.setSize(window.innerWidth, window.innerHeight);
            uniforms.resolution.value.set(window.innerWidth, window.innerHeight);
        });

        lenis.on('scroll', (e) => { 
            gsap.to(scrollData, {
                velocity: e.velocity,
                scroll: e.scroll,
                duration: 0.5,
                ease: "power2.out",
                overwrite: "auto",
                onUpdate: () => {
                    uniforms.scroll.value = scrollData.scroll;
                    uniforms.velocity.value = scrollData.velocity;
                }
            });
        });

        animateShader = function() {
            if (isPerfMode) return;
            uniforms.time.value += 0.01;
            renderer.render(scene, camera);
            shaderAnimId = requestAnimationFrame(animateShader);
        };
        animateShader();

    } catch (e) {
        console.warn("WebGL blocked or unsupported, falling back to basic background:", e);
        container.style.background = 'radial-gradient(circle at top left, #1a1a2e 0%, #050505 100%)';
    }

    // Initialize 2D Particle Canvas
    if (pCanvas) {
        const pCtx = pCanvas.getContext('2d');
        const particles = [];
        const particleCount = window.innerWidth <= 768 ? 20 : 55;

        const resizeParticles = () => {
            pCanvas.width = window.innerWidth;
            pCanvas.height = window.innerHeight;
        };
        resizeParticles();
        window.addEventListener('resize', resizeParticles);

        // Populate particles
        for (let i = 0; i < particleCount; i++) {
            const vx = (Math.random() - 0.5) * 0.5;
            const vy = (Math.random() - 0.5) * 0.5;
            particles.push({
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                vx: vx,
                vy: vy,
                baseVx: vx,
                baseVy: vy,
                radius: Math.random() * 1.5 + 1.2,
                opacity: Math.random() * 0.4 + 0.3
            });
        }

        animateParticles = function() {
            if (isPerfMode) return;
            pCtx.clearRect(0, 0, pCanvas.width, pCanvas.height);

            const w = pCanvas.width;
            const h = pCanvas.height;

            // Update and draw particles
            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];
                
                // Mouse attraction (springy magnetic orbital pull)
                const dx = mouse.x - p.x;
                const dy = mouse.y - p.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 180 && window.innerWidth > 768) {
                    const force = (1.0 - dist / 180) * 0.08;
                    p.vx += (dx / dist) * force;
                    p.vy += (dy / dist) * force;
                } else {
                    // Drift back toward original base speed/direction slowly
                    p.vx += (p.baseVx - p.vx) * 0.04;
                    p.vy += (p.baseVy - p.vy) * 0.04;
                }

                // Damping to prevent particle speed runaway
                p.vx *= 0.96;
                p.vy *= 0.96;

                p.x += p.vx;
                p.y += p.vy - scrollData.velocity * 0.25;

                // Bounce boundaries for horizontal axis, infinite wrap-around for vertical scroll axis
                if (p.x < 0) { p.x = 0; p.vx *= -1; p.baseVx *= -1; }
                else if (p.x > w) { p.x = w; p.vx *= -1; p.baseVx *= -1; }
                if (p.y < 0) { p.y = h; }
                else if (p.y > h) { p.y = 0; }

                // Draw particle
                pCtx.beginPath();
                pCtx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                pCtx.fillStyle = `rgba(168, 85, 247, ${p.opacity})`;
                pCtx.fill();
            }

            // Draw connection lines
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const p1 = particles[i];
                    const p2 = particles[j];
                    const dx = p1.x - p2.x;
                    const dy = p1.y - p2.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 110) {
                        const alpha = (1.0 - dist / 110) * 0.12;
                        pCtx.strokeStyle = `rgba(6, 182, 212, ${alpha})`;
                        pCtx.lineWidth = 0.6;
                        pCtx.beginPath();
                        pCtx.moveTo(p1.x, p1.y);
                        pCtx.lineTo(p2.x, p2.y);
                        pCtx.stroke();
                    }
                }
            }

            particleAnimId = requestAnimationFrame(animateParticles);
        };
        animateParticles();
    }

    // ==========================================
    // 10. BILINGUAL SYSTEM
    // ==========================================
    const langBtns = document.querySelectorAll('.lang-btn');
    langBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            langBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            
            const lang = e.target.classList.contains('id') ? 'id' : 'en';
            const els = document.querySelectorAll('[data-en][data-id]');
            
            gsap.to(els, {
                opacity: 0, duration: 0.3,
                onComplete: () => {
                    // Revert split type FIRST before changing text
                    SplitType.revert('.split-lines');
                    
                    els.forEach(el => {
                        if(el.id === 'term-out-1' || el.id === 'term-out-2') {
                            el.innerHTML = el.getAttribute(`data-${lang}`);
                        } else {
                            el.innerText = el.getAttribute(`data-${lang}`);
                        }
                    });
                    
                    const type1 = document.getElementById('typewriter-1');
                    const type2 = document.getElementById('typewriter-2');
                    if(type1) type1.innerText = type1.getAttribute(`data-${lang}`);
                    if(type2) type2.innerText = type2.getAttribute(`data-${lang}`);
                    
                    // Re-apply SplitType
                    new SplitType('.split-lines', { types: 'lines' });
                    
                    // Re-apply wrapper for mask reveal
                    document.querySelectorAll('.split-lines .line').forEach(el => {
                        const wrap = document.createElement('div');
                        wrap.style.overflow = 'hidden';
                        el.parentNode.insertBefore(wrap, el);
                        wrap.appendChild(el);
                    });
                    
                    gsap.to(els, { opacity: 1, duration: 0.3 });
                }
            });
        });
    });

    // ==========================================
    // 12. PREMIUM SOUND EFFECTS (WEB AUDIO GENERATOR)
    // ==========================================
    function playSciFiSound(freq = 800, type = 'sine', duration = 0.08) {
        if (isPerfMode) return;
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!AudioContext) return;
            const ctx = new AudioContext();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            
            osc.type = type;
            osc.frequency.setValueAtTime(freq, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(freq / 2, ctx.currentTime + duration);
            
            gain.gain.setValueAtTime(0.08, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
            
            osc.connect(gain);
            gain.connect(ctx.destination);
            
            osc.start();
            osc.stop(ctx.currentTime + duration);
        } catch (e) {
            console.warn("Audio Context blocked:", e);
        }
    }

    document.querySelectorAll('.nav-link, .lang-btn, .perf-toggle, .cv-link, .h-project-card, .brand-name').forEach(el => {
        el.addEventListener('mouseenter', () => {
            playSciFiSound(1300, 'sine', 0.05);
        });
        el.addEventListener('click', () => {
            playSciFiSound(700, 'triangle', 0.12);
        });
    });

    // ==========================================
    // 13. 3D CARD TILT & AMBIENT AUDIO SYNTH (FASE 6)
    // ==========================================
    let ambientOscNode = null;
    let ambientGainNode = null;
    let ambientAudioCtx = null;
    
    function startAmbientHum() {
        if (isPerfMode || ambientOscNode) return;
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!AudioContext) return;
            ambientAudioCtx = new AudioContext();
            ambientOscNode = ambientAudioCtx.createOscillator();
            ambientGainNode = ambientAudioCtx.createGain();
            
            ambientOscNode.type = 'triangle';
            ambientOscNode.frequency.setValueAtTime(200, ambientAudioCtx.currentTime);
            ambientGainNode.gain.setValueAtTime(0, ambientAudioCtx.currentTime);
            ambientGainNode.gain.linearRampToValueAtTime(0.08, ambientAudioCtx.currentTime + 0.1);
            
            ambientOscNode.connect(ambientGainNode);
            ambientGainNode.connect(ambientAudioCtx.destination);
            
            ambientOscNode.start();
        } catch (e) {
            console.warn("Ambient hum creation blocked:", e);
        }
    }
    
    function updateAmbientHum(freq, gainVal) {
        if (ambientOscNode && ambientAudioCtx) {
            ambientOscNode.frequency.setTargetAtTime(freq, ambientAudioCtx.currentTime, 0.05);
            ambientGainNode.gain.setTargetAtTime(gainVal, ambientAudioCtx.currentTime, 0.05);
        }
    }
    
    function stopAmbientHum() {
        if (ambientOscNode) {
            try {
                if (ambientGainNode && ambientAudioCtx) {
                    ambientGainNode.gain.setValueAtTime(ambientGainNode.gain.value, ambientAudioCtx.currentTime);
                    ambientGainNode.gain.exponentialRampToValueAtTime(0.001, ambientAudioCtx.currentTime + 0.15);
                }
                setTimeout(() => {
                    if (ambientOscNode) {
                        ambientOscNode.stop();
                        ambientOscNode.disconnect();
                        ambientOscNode = null;
                    }
                    if (ambientGainNode) {
                        ambientGainNode.disconnect();
                        ambientGainNode = null;
                    }
                    if (ambientAudioCtx) {
                        ambientAudioCtx.close();
                        ambientAudioCtx = null;
                    }
                }, 200);
            } catch (e) {
                console.warn(e);
            }
        }
    }

    document.querySelectorAll('.h-project-card').forEach(card => {
        const wrap = card.querySelector('.h-card-image-wrap');
        if (wrap) {
            card.addEventListener('mouseenter', () => {
                startAmbientHum();
            });

            card.addEventListener('mousemove', (e) => {
                if (window.innerWidth <= 768) return;
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const xNorm = (x / rect.width) - 0.5;
                const yNorm = (y / rect.height) - 0.5;
                
                gsap.to(wrap, {
                    rotationY: xNorm * 18,
                    rotationX: -yNorm * 18,
                    transformPerspective: 1000,
                    transformOrigin: "center center",
                    ease: "power2.out",
                    duration: 0.4
                });

                // Pitch modulation
                const yPosRatio = y / rect.height;
                const targetFreq = 180 + (1.0 - yPosRatio) * 300;
                
                // Volume modulation
                const xPosRatio = x / rect.width;
                const targetGain = 0.02 + (xPosRatio * 0.06);
                
                updateAmbientHum(targetFreq, targetGain);
            });
            
            card.addEventListener('mouseleave', () => {
                stopAmbientHum();
                gsap.to(wrap, {
                    rotationY: 0,
                    rotationX: 0,
                    ease: "power3.out",
                    duration: 0.8
                });
            });
        }
    });

    // ==========================================
    // 14. CODE MATRIX SCRAMBLE (BAFFLE PATTERN)
    // ==========================================
    const codeStream = document.getElementById('code-stream-text');
    if (codeStream) {
        const originalCode = codeStream.textContent;
        const matrixChars = "█▓▒░<>/[]{}*#$_-+=@01";
        let interval;
        
        const startScramble = () => {
            clearInterval(interval);
            interval = setInterval(() => {
                codeStream.textContent = originalCode.split('').map((char) => {
                    if (char === '\n' || char === ' ' || Math.random() > 0.2) {
                        return char;
                    }
                    return matrixChars[Math.floor(Math.random() * matrixChars.length)];
                }).join('');
            }, 80);
        };
        
        const stopScramble = () => {
            clearInterval(interval);
            codeStream.textContent = originalCode;
        };
        
        const card3 = codeStream.closest('.h-project-card');
        if (card3) {
            card3.addEventListener('mouseenter', startScramble);
            card3.addEventListener('mouseleave', stopScramble);
        }
    }

    // ==========================================
    // 15. INTERACTIVE DETAIL MODAL LOGIC (FASE 4)
    // ==========================================
    const projectDetails = {
        zenith: {
            tag: "Next.js / Tailwind",
            title: "Zenith Matcha",
            problem: {
                id: "Membangun tampilan e-commerce iced matcha premium bertema gelap yang interaktif tanpa menurunkan kecepatan loading aset dan pergeseran tata letak (CLS).",
                en: "Building a high-end dark-themed e-commerce concept for a matcha brand with complex animations without causing layout shifts (CLS) or asset loading lag."
            },
            solution: {
                id: "Menggunakan Next.js untuk Server-Side Rendering dan pra-pemuatan gambar secara adaptif, dipadukan dengan optimasi performa GPU transform untuk animasi reveal.",
                en: "Leveraging Next.js for server-side rendering, adaptive image preloading, and optimizing GPU transform renders to ensure buttery smooth reveals."
            },
            features: {
                id: ["Desain gelap premium (dark-mode aesthetic)", "Transisi gambar dinamis", "Responsivitas tinggi"],
                en: ["Premium dark-mode aesthetic", "Dynamic image transitions", "Full mobile responsiveness"]
            },
            links: {
                github: "https://github.com/rafihanja",
                live: "https://project-porto-v1-0.vercel.app/"
            }
        },
        zakat: {
            tag: "Vue.js / CSS",
            title: "Cek Zakat",
            problem: {
                id: "Menyederhanakan rumus perhitungan zakat harta, penghasilan, dan perak yang rumit ke dalam aplikasi kalkulator interaktif yang mudah dipahami semua kalangan usia.",
                en: "Simplifying complex Islamic financial alms calculation rules into an easy-to-use calculator for users of all age groups."
            },
            solution: {
                id: "Membangun antarmuka kalkulator berbasis Vue.js dengan reactivity data instan untuk memperbarui hasil perhitungan secara real-time tanpa reload halaman.",
                en: "Building a Vue.js reactive interface that updates calculations instantly on data changes without any page refreshes."
            },
            features: {
                id: ["Kalkulasi zakat real-time", "Antarmuka ramah pengguna", "Riwayat perhitungan singkat"],
                en: ["Real-time alms calculation", "Highly accessible UI layout", "Short local calculation logs"]
            },
            links: {
                github: "https://github.com/rafihanja",
                live: "https://project-porto-v1-1.vercel.app/"
            }
        },
        shorts: {
            tag: "Node.js / AI / FFmpeg",
            title: "Bot YT Shorts Otomatis",
            problem: {
                id: "Membuat video pendek YouTube secara massal yang mengotomatisasi pencarian materi, pembuatan teks/voiceover, dan penggabungan klip video tanpa intervensi manual.",
                en: "Generating mass short video clips automatically, covering script writing, voiceover generation, and rendering without manual intervention."
            },
            solution: {
                id: "Menghubungkan API Google GenAI untuk skrip konten, TTS Google untuk suara, dan FFmpeg untuk perakitan klip video secara otomatis di backend Node.js.",
                en: "Integrating Google GenAI for scripting, Text-to-Speech API for voice, and FFmpeg for automated video clip composition in Node.js backend."
            },
            features: {
                id: ["Otomasi skrip cerdas AI", "Voiceover jernih", "Rendering klip video cepat"],
                en: ["AI-powered smart scripting", "Crystal-clear TTS engine", "High-speed video rendering"]
            },
            links: {
                github: "https://github.com/rafihanja",
                live: "#"
            }
        },
        ranja: {
            tag: "Vanilla JS / Serverless / AI",
            title: "Ranja.Ai",
            problem: {
                id: "Menghadirkan asisten chatbot cerdas dengan antarmuka web interaktif yang modern, responsif, dan mudah digunakan langsung dari browser desktop/mobile.",
                en: "Delivering a smart chatbot assistant interface that is modern, highly responsive, and easy to use directly from mobile or desktop web browsers."
            },
            solution: {
                id: "Membangun UI chat minimalis dengan Vanilla JS yang terhubung secara asinkron ke serverless function AI (Cloudflare Workers) untuk respon streaming.",
                en: "Building a minimal chat interface with Vanilla JS that communicates asynchronously with AI serverless edge workers for streaming responses."
            },
            features: {
                id: ["Respon streaming real-time", "Desain chat premium minimalis", "Integrasi serverless Cloudflare"],
                en: ["Real-time streaming responses", "Clean minimalist chat interface", "Cloudflare edge workers integration"]
            },
            links: {
                github: "https://github.com/rafihanja",
                live: "https://ranja-ai.pages.dev/"
            }
        }
    };

    const modal = document.getElementById('project-modal');
    const modalBackdrop = modal ? modal.querySelector('.modal-backdrop') : null;
    const modalContainer = modal ? modal.querySelector('.modal-card-container') : null;
    const modalCloseBtn = document.getElementById('modal-close-btn');

    // Fill modal contents dynamically
    function fillModalData(projectId) {
        const lang = document.querySelector('.lang-btn.active').classList.contains('id') ? 'id' : 'en';
        const data = projectDetails[projectId];
        if (!data) return;

        document.getElementById('modal-project-tag').innerText = data.tag;
        document.getElementById('modal-project-title').innerText = data.title;
        document.getElementById('modal-project-problem').innerText = data.problem[lang];
        document.getElementById('modal-project-solution').innerText = data.solution[lang];

        const featuresList = document.getElementById('modal-project-features');
        featuresList.innerHTML = '';
        data.features[lang].forEach(feat => {
            const li = document.createElement('li');
            li.innerText = feat;
            featuresList.appendChild(li);
        });

        // Set action links
        const btnGithub = document.getElementById('modal-link-github');
        const btnLive = document.getElementById('modal-link-live');

        btnGithub.href = data.links.github;
        
        if (data.links.live === '#') {
            btnLive.href = '#';
            btnLive.classList.add('disabled');
            btnLive.querySelector('span').setAttribute('data-en', 'No Live Demo');
            btnLive.querySelector('span').setAttribute('data-id', 'Tanpa Demo');
            btnLive.querySelector('span').innerText = lang === 'id' ? 'Tanpa Demo' : 'No Live Demo';
        } else {
            btnLive.href = data.links.live;
            btnLive.classList.remove('disabled');
            btnLive.querySelector('span').setAttribute('data-en', 'Live Demo');
            btnLive.querySelector('span').setAttribute('data-id', 'Kunjungi Situs');
            btnLive.querySelector('span').innerText = lang === 'id' ? 'Kunjungi Situs' : 'Live Demo';
        }
    }

    // GSAP Opening Timeline
    function openProjectModal(projectId) {
        if (!modal) return;
        fillModalData(projectId);
        
        // Stop smooth scrolling
        if (typeof lenis !== 'undefined') {
            lenis.stop();
        }

        modal.setAttribute('aria-hidden', 'false');
        modal.classList.add('active');

        // Connect close button to hover custom cursor
        document.body.classList.add('hovering');

        const tl = gsap.timeline();
        tl.to(modal, { opacity: 1, duration: 0.1 })
          .to(modalBackdrop, { opacity: 1, duration: 0.4, ease: "power2.out" }, 0)
          .to(modalContainer, { 
              scale: 1, 
              y: 0, 
              opacity: 1, 
              duration: 0.5, 
              ease: "back.out(1.2)" 
          }, 0.1);
    }

    // GSAP Closing Timeline
    function closeProjectModal() {
        if (!modal) return;
        // Disconnect close button cursor hover
        document.body.classList.remove('hovering');

        const tl = gsap.timeline({
            onComplete: () => {
                modal.classList.remove('active');
                modal.setAttribute('aria-hidden', 'true');
                // Restart smooth scrolling
                if (typeof lenis !== 'undefined') {
                    lenis.start();
                }
            }
        });

        tl.to(modalContainer, { 
            scale: 0.9, 
            y: 20, 
            opacity: 0, 
            duration: 0.4, 
            ease: "power2.in" 
        })
          .to(modalBackdrop, { opacity: 0, duration: 0.3, ease: "power2.in" }, 0.1)
          .to(modal, { opacity: 0, duration: 0.1 }, 0.3);
    }

    // Intercept card click events
    document.querySelectorAll('.h-project-card').forEach(card => {
        card.addEventListener('click', (e) => {
            const projectId = card.getAttribute('data-project');
            if (projectId && projectDetails[projectId]) {
                openProjectModal(projectId);
            }
        });
    });

    // Close on click button, backdrop or ESC key
    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', () => {
            playSciFiSound(600, 'triangle', 0.1);
            closeProjectModal();
        });
        modalCloseBtn.addEventListener('mouseenter', () => {
            playSciFiSound(1300, 'sine', 0.05);
        });
    }

    if (modalBackdrop) {
        modalBackdrop.addEventListener('click', () => {
            playSciFiSound(600, 'triangle', 0.1);
            closeProjectModal();
        });
    }

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
            playSciFiSound(600, 'triangle', 0.1);
            closeProjectModal();
        }
    });

    // Translate modal contents if language changes while modal is open
    const observer = new MutationObserver(() => {
        if (modal && modal.classList.contains('active')) {
            const activeCard = document.querySelector('.h-project-card:hover') || document.querySelector('.h-project-card');
            const projectId = activeCard ? activeCard.getAttribute('data-project') : 'zenith';
            fillModalData(projectId);
        }
    });
    
    const langBtnsWrapper = document.querySelector('.lang-toggle');
    if (langBtnsWrapper) {
        observer.observe(langBtnsWrapper, { attributes: true, subtree: true, childList: true });
    }

    // ==========================================
    // 16. CYBER VISUAL ENRICHMENTS (FASE 5)
    // ==========================================
    // Project card border draw animation
    document.querySelectorAll('.h-project-card').forEach(card => {
        const rect = card.querySelector('.card-border-rect');
        if (rect) {
            card.addEventListener('mouseenter', () => {
                gsap.to(rect, { strokeDashoffset: 0, duration: 0.6, ease: "power2.out" });
            });
            card.addEventListener('mouseleave', () => {
                gsap.to(rect, { strokeDashoffset: 1800, duration: 0.6, ease: "power2.out" });
            });
        }
    });

    // Canvas Particle Trail Emitter (Cursor sparks)
    const cursorCanvas = document.getElementById('cursor-trail-canvas');
    if (cursorCanvas) {
        const ctx = cursorCanvas.getContext('2d');
        let particles = [];
        
        const resizeCanvas = () => {
            cursorCanvas.width = window.innerWidth;
            cursorCanvas.height = window.innerHeight;
        };
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        
        class Spark {
            constructor(x, y) {
                this.x = x;
                this.y = y;
                this.size = Math.random() * 2 + 1.5;
                this.speedX = (Math.random() - 0.5) * 2;
                this.speedY = (Math.random() - 0.5) * 2;
                this.color = `rgba(168, 85, 247, ${Math.random() * 0.4 + 0.6})`;
                this.alpha = 1;
                this.decay = Math.random() * 0.02 + 0.015;
            }
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                this.alpha -= this.decay;
            }
            draw() {
                ctx.save();
                ctx.globalAlpha = this.alpha;
                ctx.shadowBlur = 6;
                ctx.shadowColor = 'rgba(168, 85, 247, 0.8)';
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
        }
        
        const spawnSparks = (x, y) => {
            if (isPerfMode || window.innerWidth <= 768) return;
            for (let i = 0; i < 2; i++) {
                particles.push(new Spark(x, y));
            }
        };
        
        window.addEventListener('mousemove', (e) => {
            spawnSparks(e.clientX, e.clientY);
        });
        
        const renderParticles = () => {
            ctx.clearRect(0, 0, cursorCanvas.width, cursorCanvas.height);
            if (!isPerfMode && window.innerWidth > 768) {
                particles.forEach((p, index) => {
                    p.update();
                    p.draw();
                    if (p.alpha <= 0) {
                        particles.splice(index, 1);
                    }
                });
            } else {
                particles = [];
            }
            requestAnimationFrame(renderParticles);
        };
        renderParticles();
    }

    // ==========================================
    // 17. INTERACTIVE CLI TERMINAL (FASE 6)
    // ==========================================
    const cliInput = document.getElementById('terminal-cli-input');
    const termHistory = document.getElementById('term-history');
    
    if (cliInput && termHistory) {
        cliInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const cmd = cliInput.value.trim().toLowerCase();
                cliInput.value = '';
                
                if (cmd === '') return;
                
                // Add echo command
                const echoLine = document.createElement('div');
                echoLine.className = 'term-line';
                echoLine.innerHTML = `<span class="prompt">$</span> <span>${cmd}</span>`;
                termHistory.appendChild(echoLine);
                
                // Parser
                const outputLine = document.createElement('div');
                outputLine.className = 'term-line output';
                
                const lang = document.querySelector('.lang-btn.active').classList.contains('id') ? 'id' : 'en';
                
                if (cmd === 'help') {
                    if (lang === 'id') {
                        outputLine.innerHTML = `Bantuan Perintah:<br> - <strong>projects</strong> : Daftar proyek pilihan<br> - <strong>skills</strong> : Daftar keahlian teknis<br> - <strong>clear</strong> : Bersihkan layar terminal`;
                    } else {
                        outputLine.innerHTML = `Available Commands:<br> - <strong>projects</strong> : List of selected works<br> - <strong>skills</strong> : Technical stack expertise<br> - <strong>clear</strong> : Clear terminal screen`;
                    }
                } else if (cmd === 'projects') {
                    if (lang === 'id') {
                        outputLine.innerHTML = `Karya Pilihan:<br> 1. Zenith Matcha (Next.js)<br> 2. Cek Zakat (Vue.js)<br> 3. Bot YT Shorts (Node.js/AI)<br> 4. Ranja.Ai (Vanilla JS/AI)`;
                    } else {
                        outputLine.innerHTML = `Selected Works:<br> 1. Zenith Matcha (Next.js)<br> 2. Cek Zakat (Vue.js)<br> 3. Bot YT Shorts (Node.js/AI)<br> 4. Ranja.Ai (Vanilla JS/AI)`;
                    }
                } else if (cmd === 'skills') {
                    if (lang === 'id') {
                        outputLine.innerHTML = `Keahlian Utama:<br> - Core Stack : [██████░░░░] 60%<br> - Animations : [███████░░░] 70%<br> - Dev Tools  : [██████░░░░] 60%`;
                    } else {
                        outputLine.innerHTML = `Technical Skills:<br> - Core Stack : [██████░░░░] 60%<br> - Animations : [███████░░░] 70%<br> - Dev Tools  : [██████░░░░] 60%`;
                    }
                } else if (cmd === 'clear') {
                    termHistory.innerHTML = '';
                    outputLine.innerHTML = '';
                } else {
                    if (lang === 'id') {
                        outputLine.innerHTML = `Perintah '${cmd}' tidak dikenali. Ketik 'help' untuk petunjuk.`;
                    } else {
                        outputLine.innerHTML = `Command '${cmd}' not recognized. Type 'help' for help.`;
                    }
                }
                
                if (outputLine.innerHTML !== '') {
                    termHistory.appendChild(outputLine);
                }
                
                // Play sound
                playSciFiSound(500, 'sine', 0.05);
                
                // Scroll to bottom
                const termBody = document.getElementById('terminal-body-content');
                if (termBody) {
                    termBody.scrollTop = termBody.scrollHeight;
                }
            }
        });
    }

    // ==========================================
    // 11. PERFORMANCE MODE INTERACTION
    // ==========================================
    const perfBtn = document.getElementById('perf-btn');
    if (perfBtn) {
        perfBtn.addEventListener('click', () => {
            isPerfMode = !isPerfMode;
            if (isPerfMode) {
                document.body.classList.add('perf-mode');
                perfBtn.classList.add('active');
                
                // Wait for the 800ms CSS opacity transition to complete smoothly
                // while animation is still running, then halt loops and clear canvas
                setTimeout(() => {
                    if (isPerfMode) {
                        if (shaderAnimId) cancelAnimationFrame(shaderAnimId);
                        if (particleAnimId) cancelAnimationFrame(particleAnimId);

                        const pCanvas = document.getElementById('particle-canvas');
                        if (pCanvas) {
                            const pCtx = pCanvas.getContext('2d');
                            pCtx.clearRect(0, 0, pCanvas.width, pCanvas.height);
                        }
                    }
                }, 800);
            } else {
                document.body.classList.remove('perf-mode');
                perfBtn.classList.remove('active');
                
                // Cancel any pending frames before relaunching to guarantee thread safety
                if (shaderAnimId) cancelAnimationFrame(shaderAnimId);
                if (particleAnimId) cancelAnimationFrame(particleAnimId);

                // Restart render loops if supported
                if (typeof animateShader === 'function') {
                    animateShader();
                }
                if (typeof animateParticles === 'function') {
                    animateParticles();
                }
            }
        });
    }

});
