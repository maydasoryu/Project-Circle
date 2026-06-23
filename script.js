/* =========================================================
   PROJECT CIRCLE - M3 EXPRESSIVE LOGIC (ALIVE & DYNAMIC)
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    initRipple();
    initScrollReveal();
    initVideoSwap();
    initCarousel();
    initScreenshotsParallax();
    initScrollProgress();
    initNavbarBlur();
    init3DTilt();
});

// --- 1. Material 3 Ripple Effect ---
function initRipple() {
    const rippleElements = document.querySelectorAll('.ripple, .ripple-container');
    rippleElements.forEach(el => {
        el.addEventListener('click', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const circle = document.createElement('span');
            circle.classList.add('ripple-circle');
            circle.style.left = `${x}px`;
            circle.style.top = `${y}px`;

            const radius = Math.max(rect.width, rect.height);
            circle.style.width = circle.style.height = `${radius}px`;
            circle.style.marginTop = circle.style.marginLeft = `-${radius/2}px`;

            this.appendChild(circle);

            setTimeout(() => { circle.remove(); }, 600);
        });
    });
}

// --- 2. Expressive Scroll Reveals (Staggered) ---
function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    });

    reveals.forEach(reveal => observer.observe(reveal));
}

// --- 3. Dynamic Video Source Swap ---
function initVideoSwap() {
    const video = document.getElementById('bg-video');
    const source = video.querySelector('source');
    
    const checkViewport = () => {
        const isMobile = window.innerWidth <= 768;
        const targetSrc = isMobile ? 'assets/bg-mobile.mp4' : 'assets/bg.mp4';
        
        if (!source.src.endsWith(targetSrc)) {
            source.src = targetSrc;
            video.load();
        }
    };

    checkViewport();
    window.addEventListener('resize', () => {
        clearTimeout(window.videoResizeTimer);
        window.videoResizeTimer = setTimeout(checkViewport, 250);
    });
}

// --- 4. Features Carousel Controls ---
function initCarousel() {
    const track = document.getElementById('features-track');
    const btnNext = document.getElementById('btn-next');
    const btnPrev = document.getElementById('btn-prev');

    if(!track || !btnNext || !btnPrev) return;

    btnNext.addEventListener('click', () => {
        track.scrollBy({ left: 380, behavior: 'smooth' });
    });

    btnPrev.addEventListener('click', () => {
        track.scrollBy({ left: -380, behavior: 'smooth' });
    });
}

// --- 5. Advanced Stacked Screenshot Parallax ---
function initScreenshotsParallax() {
    const showcase = document.getElementById('showcase');
    const layers = document.querySelectorAll('.screenshot-layer');
    if (!showcase || layers.length === 0) return;

    layers.forEach((layer, index) => {
        layer.style.zIndex = layers.length - index;
    });

    window.addEventListener('scroll', () => {
        requestAnimationFrame(() => {
            const rect = showcase.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            
            let progress = -rect.top / (rect.height - viewportHeight);
            progress = Math.max(0, Math.min(1, progress));

            layers.forEach((layer, index) => {
                const offsetThreshold = index * (1 / layers.length);
                let shiftProgress = Math.max(0, progress - offsetThreshold) * (layers.length);
                shiftProgress = Math.min(1, shiftProgress);

                const translateX = shiftProgress * -140; 
                const rotateY = shiftProgress * -20; 
                const scale = 1 - (index * 0.04) + (shiftProgress * 0.1); 
                const opacity = 1 - Math.pow(shiftProgress, 4); 

                layer.style.transform = `
                    translateX(${translateX}vw) 
                    rotateY(${rotateY}deg) 
                    scale(${scale})
                    translateY(${index * 12}px)
                `;
                layer.style.opacity = opacity;
                layer.style.boxShadow = `0px ${15 + shiftProgress*30}px ${30 + shiftProgress*40}px rgba(157,51,245,${0.2 - shiftProgress*0.1})`;
            });
        });
    }, { passive: true });
}

// --- 6. Scroll Progress Indicator ---
function initScrollProgress() {
    const progressBar = document.querySelector('.scroll-progress');
    window.addEventListener('scroll', () => {
        requestAnimationFrame(() => {
            const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrollPercent = (scrollTop / scrollHeight) * 100;
            progressBar.style.width = scrollPercent + "%";
        });
    }, { passive: true });
}

// --- 7. Navbar M3 Elevation ---
function initNavbarBlur() {
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }, { passive: true });
}

// --- 8. 3D Hover Tilt Effect (Bringing cards to LIFE) ---
function init3DTilt() {
    const isMobile = window.innerWidth <= 768;
    if (isMobile) return; // Disable on mobile to prevent jank/touch issues

    const cards = document.querySelectorAll('.tilt-card');
    
    cards.forEach(card => {
        card.classList.add('js-tilt');
        
        card.addEventListener('mousemove', (e) => {
            requestAnimationFrame(() => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                // Calculate rotation (max 12 degrees)
                const rotateX = ((y - centerY) / centerY) * -12;
                const rotateY = ((x - centerX) / centerX) * 12;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
                
                // Dynamic border glow effect following mouse
                card.style.borderImage = `radial-gradient(20% 40% at ${x}px ${y}px, rgba(157, 51, 245, 0.6), transparent) 1`;
            });
        });

        card.addEventListener('mouseleave', () => {
            requestAnimationFrame(() => {
                card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
                card.style.borderImage = 'none';
                card.style.borderColor = 'rgba(157, 51, 245, 0.15)'; // Reset border
            });
        });
    });
}