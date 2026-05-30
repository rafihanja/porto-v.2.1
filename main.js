/**
 * RAFIH ANJA - 2000+ LINES MASTERPIECE (JS CORE)
 * Features: Lenis, WebGL Shader Background (Three.js), Terminal UI Typing, ScrollTrigger Timeline, Rich Motion
 */

document.addEventListener("DOMContentLoaded", () => {
    gsap.registerPlugin(ScrollTrigger);

    // ==========================================
    // 1. CUSTOM CURSOR
    // ==========================================
    // Prevent initial flicker before preloader finishes
    gsap.set(['.elegant-heading .line', '.hero-desc .line', '.terminal-ui', '.site-header'], { opacity: 0 });

    // Floating Pill Header on Scroll with Scrub
    gsap.to('.header-inner', {
        scrollTrigger: {
            trigger: 'body',
            start: "50px top",
            end: "250px top",
            scrub: 1
        },
        maxWidth: "600px", // Gathers them to the center
        opacity: 0.4, // Makes it transparent and not too visible
        padding: "10px 25px"
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
    // 2. SMOOTH SCROLL (LENIS)
    // ==========================================
    const lenis = new Lenis({
        lerp: 0.08, // Lerp is much smoother and performant on lower-end devices than fixed duration
        wheelMultiplier: 0.8, // Slightly softer wheel
        smoothWheel: true,
        syncTouch: true, // Native-like touch scrolling
        smoothTouch: true,
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
        duration: 1.8,
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
    // Skew text effect on scroll for Section Labels
    gsap.utils.toArray('.section-label').forEach(label => {
        gsap.from(label, {
            scrollTrigger: { trigger: label, start: 'top 85%' },
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

    // Skills Stagger
    const skillItems = document.querySelectorAll('.skill-item');
    gsap.from(skillItems, {
        scrollTrigger: { trigger: '.skills-list', start: 'top 80%' },
        x: 50, opacity: 0, duration: 0.8, stagger: 0.15, ease: "power3.out"
    });

    const skillFills = document.querySelectorAll('.skill-fill');
    ScrollTrigger.create({
        trigger: '.skills-list',
        start: 'top 75%',
        onEnter: () => {
            skillFills.forEach((fill, i) => {
                const target = fill.getAttribute('data-target');
                const pctText = fill.closest('.skill-item').querySelector('.skill-pct');
                
                gsap.to(fill, {
                    width: target + "%", duration: 1.5, delay: i * 0.15, ease: "expo.out"
                });
                
                let countObj = { val: 0 };
                gsap.to(countObj, {
                    val: target, duration: 1.5, delay: i * 0.15, ease: "expo.out",
                    onUpdate: () => { pctText.innerText = Math.round(countObj.val) + "%"; }
                });
            });
        },
        once: true
    });

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
    // 9. WEBGL SHADER BACKGROUND (THREE.JS)
    // ==========================================
    const container = document.getElementById('webgl-container');
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    
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
        uniform float time;
        uniform vec2 resolution;
        uniform float scroll;
        varying vec2 vUv;

        vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

        float snoise(vec2 v) {
            const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
            vec2 i  = floor(v + dot(v, C.yy) );
            vec2 x0 = v -   i + dot(i, C.xx);
            vec2 i1;
            i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
            vec4 x12 = x0.xyxy + C.xxzz;
            x12.xy -= i1;
            i = mod289(i);
            vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
            vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
            m = m*m;
            m = m*m;
            vec3 x = 2.0 * fract(p * C.www) - 1.0;
            vec3 h = abs(x) - 0.5;
            vec3 ox = floor(x + 0.5);
            vec3 a0 = x - ox;
            m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
            vec3 g;
            g.x  = a0.x  * x0.x  + h.x  * x0.y;
            g.yz = a0.yz * x12.xz + h.yz * x12.yw;
            return 130.0 * dot(m, g);
        }

        void main() {
            vec2 uv = gl_FragCoord.xy / resolution.xy;
            uv.y += scroll * 0.001; 
            
            float n = snoise(vec2(uv.x * 2.0 + time * 0.1, uv.y * 2.0 - time * 0.05));
            float n2 = snoise(vec2(uv.x * 4.0 - time * 0.2, uv.y * 4.0 + time * 0.1));
            
            float finalNoise = n * 0.5 + n2 * 0.5;
            
            vec3 color1 = vec3(0.03, 0.03, 0.04);
            vec3 color2 = vec3(0.1, 0.15, 0.25);
            
            vec3 finalColor = mix(color1, color2, finalNoise + 0.5);
            gl_FragColor = vec4(finalColor, 1.0);
        }
    `;

    const uniforms = {
        time: { value: 0 },
        resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        scroll: { value: 0 }
    };

    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial({ vertexShader, fragmentShader, uniforms });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    window.addEventListener('resize', () => {
        renderer.setSize(window.innerWidth, window.innerHeight);
        uniforms.resolution.value.set(window.innerWidth, window.innerHeight);
    });

    lenis.on('scroll', (e) => { uniforms.scroll.value = e.scroll; });

    function animateShader() {
        uniforms.time.value += 0.01;
        renderer.render(scene, camera);
        requestAnimationFrame(animateShader);
    }
    animateShader();

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

});
