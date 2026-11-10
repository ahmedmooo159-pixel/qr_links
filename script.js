// ===== DOM Ready =====
document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    initTypewriter();
    initScrollAnimations();
    initQRCode();
    initScrollToTop();
    initCountUp();
    initCardStagger();
});

// ===== Particles Background =====
function initParticles() {
    const container = document.getElementById('particles');
    const particleCount = window.innerWidth < 768 ? 25 : 50;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        const size = Math.random() * 3 + 1;
        const left = Math.random() * 100;
        const duration = Math.random() * 15 + 10;
        const delay = Math.random() * 15;
        const hue = Math.random() > 0.5 ? '217' : '43'; // blue or gold
        
        particle.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            left: ${left}%;
            animation-duration: ${duration}s;
            animation-delay: ${delay}s;
            background: hsl(${hue}, 80%, 65%);
        `;
        
        container.appendChild(particle);
    }
}

// ===== Typewriter Effect =====
function initTypewriter() {
    const element = document.getElementById('typewriter');
    const texts = [
        'Full-Stack Developer',
        'مطور ويب محترف',
        'React & Next.js Expert',
        'UI/UX Designer',
        'مستقل ومتاح للمشاريع'
    ];
    
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 80;

    function type() {
        const currentText = texts[textIndex];
        
        if (isDeleting) {
            element.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 40;
        } else {
            element.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 80;
        }

        if (!isDeleting && charIndex === currentText.length) {
            isDeleting = true;
            typingSpeed = 2000; // pause before deleting
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            typingSpeed = 400; // pause before next word
        }

        setTimeout(type, typingSpeed);
    }

    setTimeout(type, 1000);
}

// ===== Scroll Animations (Intersection Observer) =====
function initScrollAnimations() {
    const sections = document.querySelectorAll('.link-section');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Stagger cards within this section
                const cards = entry.target.querySelectorAll('.link-card');
                cards.forEach((card, index) => {
                    setTimeout(() => {
                        card.classList.add('animate-in');
                    }, index * 100);
                });
                
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    sections.forEach(section => observer.observe(section));
}

// ===== Card Stagger Initial Load =====
function initCardStagger() {
    // For sections already visible on load
    setTimeout(() => {
        const firstSection = document.querySelector('.link-section');
        if (firstSection) {
            const rect = firstSection.getBoundingClientRect();
            if (rect.top < window.innerHeight) {
                firstSection.classList.add('visible');
                const cards = firstSection.querySelectorAll('.link-card');
                cards.forEach((card, index) => {
                    setTimeout(() => {
                        card.classList.add('animate-in');
                    }, 300 + index * 100);
                });
            }
        }
    }, 800);
}

// ===== QR Code =====
function initQRCode() {
    const qrToggle = document.getElementById('qrToggle');
    const qrPopup = document.getElementById('qrPopup');
    const qrClose = document.getElementById('qrClose');
    const qrCodeDiv = document.getElementById('qrCode');

    // Generate QR Code - points to the page itself
    // Use a placeholder URL; replace with your actual deployed URL
    const pageUrl = window.location.href !== 'about:blank' 
        ? window.location.href 
        : 'https://ahmed-mourad-links.vercel.app';

    try {
        new QRCode(qrCodeDiv, {
            text: pageUrl,
            width: 160,
            height: 160,
            colorDark: '#0a0e1a',
            colorLight: '#ffffff',
            correctLevel: QRCode.CorrectLevel.H
        });
    } catch(e) {
        // Fallback if QRCode library not loaded
        qrCodeDiv.innerHTML = '<div style="padding:20px;text-align:center;color:#666;font-size:12px;">QR Code</div>';
    }

    // Toggle popup
    qrToggle.addEventListener('click', () => {
        qrPopup.classList.toggle('active');
    });

    qrClose.addEventListener('click', () => {
        qrPopup.classList.remove('active');
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.qr-container')) {
            qrPopup.classList.remove('active');
        }
    });
}

// ===== Scroll to Top =====
function initScrollToTop() {
    const btn = document.getElementById('scrollTop');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            btn.classList.add('visible');
        } else {
            btn.classList.remove('visible');
        }
    });

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ===== Count Up Animation =====
function initCountUp() {
    const counters = document.querySelectorAll('.stat-number');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.dataset.count);
                animateCount(entry.target, target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
}

function animateCount(element, target) {
    let current = 0;
    const duration = 2000;
    const step = target / (duration / 16);
    
    function update() {
        current += step;
        if (current >= target) {
            element.textContent = target;
            return;
        }
        element.textContent = Math.floor(current);
        requestAnimationFrame(update);
    }
    
    setTimeout(update, 500);
}

// ===== Tilt Effect on Cards =====
document.addEventListener('mousemove', (e) => {
    const cards = document.querySelectorAll('[data-tilt]');
    
    cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / centerY * -3;
            const rotateY = (x - centerX) / centerX * 3;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-3px)`;
        }
    });
});

document.addEventListener('mouseleave', () => {
    document.querySelectorAll('[data-tilt]').forEach(card => {
        card.style.transform = '';
    });
});

// Reset tilt on mouse leave from individual cards
document.querySelectorAll('[data-tilt]').forEach(card => {
    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
    });
});

// ===== Smooth Reveal on Scroll =====
let ticking = false;
window.addEventListener('scroll', () => {
    if (!ticking) {
        requestAnimationFrame(() => {
            // Parallax for hero
            const hero = document.getElementById('hero');
            if (hero) {
                const scrolled = window.scrollY;
                const opacity = Math.max(0, 1 - scrolled / 500);
                hero.style.opacity = opacity;
                hero.style.transform = `translateY(${scrolled * 0.15}px)`;
            }
            ticking = false;
        });
        ticking = true;
    }
});

// ===== Ripple Effect on Card Click =====
document.querySelectorAll('.link-card').forEach(card => {
    card.addEventListener('click', function(e) {
        const ripple = document.createElement('div');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(59, 130, 246, 0.15);
            border-radius: 50%;
            transform: scale(0);
            animation: rippleEffect 0.6s ease-out;
            pointer-events: none;
            z-index: 10;
        `;
        
        this.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    });
});

// Add ripple keyframes
const style = document.createElement('style');
style.textContent = `
    @keyframes rippleEffect {
        to {
            transform: scale(2.5);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

