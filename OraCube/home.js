// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the 3D background
    initVantaBackground();
    
    // Hide loader after everything is loaded
    setTimeout(hideLoader, 1500);
    
    // Initialize ScrollTrigger
    initScrollTrigger();
    
    // Initialize animation effects
    initAnimations();
    
    // Initialize digital cube interactions
    initDigitalCube();
});

// Initialize the 3D background animation
function initVantaBackground() {
    VANTA.NET({
        el: "#bg-animation",
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.00,
        minWidth: 200.00,
        scale: 1.00,
        scaleMobile: 1.00,
        color: 0x6366f1,
        backgroundColor: 0x0a0e1a,
        points: 12.00,
        maxDistance: 25.00,
        spacing: 18.00,
        showDots: false
    });
    
    // Initialize the 3D footer effect
    initFooter3D();
}

// Initialize the 3D footer effect
function initFooter3D() {
    // Create a starry background for the footer
    const footerWorld = document.getElementById('footer-3d-world');
    
    for (let i = 0; i < 100; i++) {
        const star = document.createElement('div');
        star.classList.add('star');
        star.style.width = `${Math.random() * 3 + 1}px`;
        star.style.height = star.style.width;
        star.style.borderRadius = '50%';
        star.style.background = 'white';
        star.style.position = 'absolute';
        star.style.top = `${Math.random() * 100}%`;
        star.style.left = `${Math.random() * 100}%`;
        star.style.opacity = `${Math.random() * 0.7 + 0.3}`;
        star.style.animation = `twinkle ${Math.random() * 5 + 3}s infinite`;
        footerWorld.appendChild(star);
    }
    
    // Add keyframe animation dynamically
    const style = document.createElement('style');
    style.innerHTML = `
    @keyframes twinkle {
        0%, 100% { opacity: 0.3; }
        50% { opacity: 1; }
    }
    `;
    document.head.appendChild(style);
}

// Hide the loader
function hideLoader() {
    const loader = document.getElementById('loader');
    if (loader) {
        loader.classList.add('hidden');
    }
}

// Initialize ScrollTrigger for animations
function initScrollTrigger() {
    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);
    
    // Animate cards on scroll
    const cards = document.querySelectorAll('.action-card');
    cards.forEach(card => {
        gsap.to(card, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            scrollTrigger: {
                trigger: card,
                start: "top 80%",
                toggleClass: "visible"
            }
        });
    });
    
    // Animate feature cards on scroll
    const features = document.querySelectorAll('.feature-card');
    features.forEach((feature, index) => {
        gsap.to(feature, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            delay: index * 0.1,
            scrollTrigger: {
                trigger: feature,
                start: "top 80%",
                toggleClass: "visible"
            }
        });
    });
    
    // Animate scheme cards on scroll
    const schemes = document.querySelectorAll('.scheme-card');
    schemes.forEach((scheme, index) => {
        gsap.to(scheme, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            delay: index * 0.2,
            scrollTrigger: {
                trigger: scheme,
                start: "top 80%",
                toggleClass: "visible"
            }
        });
    });
}

// Initialize animation effects
function initAnimations() {
    // Create floating particles effect
    createParticles();
    
    // Add card tilt effect
    addCardTiltEffect();
    
    // Add digital cube interactions
    initDigitalCube();
}

// Create floating particles
function createParticles() {
    const particlesContainer = document.getElementById('bg-animation');
    const particleCount = 20;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Set random positions and animations
        particle.style.left = Math.random() * 100 + 'vw';
        particle.style.top = Math.random() * 100 + 'vh';
        particle.style.animationDuration = (Math.random() * 15 + 10) + 's';
        particle.style.animationDelay = Math.random() * 5 + 's';
        particle.style.opacity = Math.random() * 0.5;
        particle.style.width = particle.style.height = Math.random() * 4 + 2 + 'px';
        
        particlesContainer.appendChild(particle);
    }
}

// Add tilt effect to cards
function addCardTiltEffect() {
    const cards = document.querySelectorAll('.action-card, .feature-card, .scheme-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const angleX = (y - centerY) / 15;
            const angleY = (centerX - x) / 15;
            
            this.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) translateY(-10px) scale(1.02)`;
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });
}

// Add special animations to the banking 3D logo
function animateBankLogo() {
    const rings = document.querySelectorAll('.sphere-ring');
    
    rings.forEach((ring, index) => {
        ring.style.animation = `rotateRing ${(index + 4)}s linear infinite`;
    });
    
    const orbits = document.querySelector('.coin-orbit');
    if (orbits) {
        orbits.style.animation = 'rotateOrbit 20s linear infinite';
    }
    
    // Add shimmer effect to coins
    const coins = document.querySelectorAll('.coin-face');
    
    coins.forEach(coin => {
        const shimmer = document.createElement('div');
        shimmer.classList.add('coin-shimmer');
        shimmer.style.position = 'absolute';
        shimmer.style.top = '0';
        shimmer.style.left = '-100%';
        shimmer.style.width = '100%';
        shimmer.style.height = '100%';
        shimmer.style.background = 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)';
        shimmer.style.zIndex = '10';
        shimmer.style.animation = 'coinShimmer 3s linear infinite';
        
        coin.appendChild(shimmer);
    });
    
    // Add keyframe animations dynamically
    const style = document.createElement('style');
    style.innerHTML = `
    @keyframes rotateRing {
        0% { transform: translate(-50%, -50%) rotateX(80deg) rotateY(0deg); }
        100% { transform: translate(-50%, -50%) rotateX(80deg) rotateY(360deg); }
    }
    
    @keyframes rotateOrbit {
        0% { transform: rotateY(0deg); }
        100% { transform: rotateY(360deg); }
    }
    
    @keyframes coinShimmer {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(200%); }
    }
    `;
    document.head.appendChild(style);
}

// Create placeholder pages for links that don't exist yet
function handleMissingPages() {
    const cards = document.querySelectorAll('.action-card');
    
    cards.forEach(card => {
        card.addEventListener('click', function(e) {
            const target = this.getAttribute('onclick').match(/window\.location\.href='([^']+)'/)[1];
            
            // Redirect to the admin dashboard if it exists, otherwise show a message
            if (target === 'admin-dashboard.html') {
                window.location.href = 'admin-dashboard.html';
            } else {
                e.preventDefault();
                // alert('This feature is coming soon! For now, please use the Admin Login to see the dashboard.');
                return false;
            }
        });
    });
}

// Add smooth scrolling for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Call this after DOM is loaded
setTimeout(handleMissingPages, 2000);

// Initialize digital cube interactions
function initDigitalCube() {
    const cubeContainer = document.querySelector('.cube-container');
    const digitalCube = document.querySelector('.digital-cube');
    
    if (!cubeContainer || !digitalCube) return;
    
    // Mouse hover interaction
    digitalCube.addEventListener('mouseenter', function() {
        cubeContainer.style.animationPlayState = 'paused';
        cubeContainer.style.transform = 'rotateX(15deg) rotateY(15deg) scale(1.1)';
        cubeContainer.style.transition = 'transform 0.5s ease';
    });
    
    digitalCube.addEventListener('mouseleave', function() {
        cubeContainer.style.animationPlayState = 'running';
        cubeContainer.style.transform = '';
        cubeContainer.style.transition = '';
    });
    
    // Click interaction for dramatic effect
    digitalCube.addEventListener('click', function() {
        // Create burst effect
        createCubeBurst();
        
        // Temporary speed boost
        cubeContainer.style.animation = 'rotateCube 2s infinite linear';
        setTimeout(() => {
            cubeContainer.style.animation = 'rotateCube 20s infinite linear';
        }, 4000);
    });
    
    // Add floating motion to the entire cube if GSAP is available
    if (typeof gsap !== 'undefined') {
        gsap.to(digitalCube, {
            y: -10,
            duration: 3,
            repeat: -1,
            yoyo: true,
            ease: "power2.inOut"
        });
    }
}

// Create burst effect when cube is clicked
function createCubeBurst() {
    const digitalCube = document.querySelector('.digital-cube');
    const burstContainer = document.createElement('div');
    burstContainer.style.position = 'absolute';
    burstContainer.style.top = '50%';
    burstContainer.style.left = '50%';
    burstContainer.style.transform = 'translate(-50%, -50%)';
    burstContainer.style.pointerEvents = 'none';
    burstContainer.style.zIndex = '10';
    
    // Create burst particles
    for (let i = 0; i < 12; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.width = '4px';
        particle.style.height = '4px';
        particle.style.background = `hsl(${Math.random() * 60 + 220}, 70%, 60%)`;
        particle.style.borderRadius = '50%';
        particle.style.boxShadow = `0 0 10px hsl(${Math.random() * 60 + 220}, 70%, 60%)`;
        
        const angle = (i * 30) * (Math.PI / 180);
        const distance = 100 + Math.random() * 50;
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;
        
        burstContainer.appendChild(particle);
        
        // Animate particle
        if (typeof gsap !== 'undefined') {
            gsap.set(particle, { x: 0, y: 0, scale: 0 });
            gsap.to(particle, {
                x: x,
                y: y,
                scale: 1,
                opacity: 0,
                duration: 1.5,
                ease: "power2.out",
                onComplete: () => particle.remove()
            });
        } else {
            // Fallback CSS animation
            particle.style.animation = `burstParticle 1.5s ease-out forwards`;
            setTimeout(() => particle.remove(), 1500);
        }
    }
    
    digitalCube.appendChild(burstContainer);
    
    // Remove burst container after animation
    setTimeout(() => {
        if (burstContainer.parentNode) {
            burstContainer.remove();
        }
    }, 2000);
}

// Add fallback CSS animation for burst particles
const burstStyle = document.createElement('style');
burstStyle.innerHTML = `
@keyframes burstParticle {
    0% { 
        transform: translate(0, 0) scale(0);
        opacity: 1;
    }
    100% { 
        transform: translate(var(--x, 100px), var(--y, 100px)) scale(1);
        opacity: 0;
    }
}
`;
document.head.appendChild(burstStyle);
