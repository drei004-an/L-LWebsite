// Mobile Navigation Toggle
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

if (navToggle) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
}

// Close mobile menu when a link is clicked
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});

// Active Navigation Link on Scroll (Scroll Spy)
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.scrollY + 100; // Offset for navbar height

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// Update active link on scroll
window.addEventListener('scroll', updateActiveNavLink);

// Set initial active link on page load
updateActiveNavLink();

// ============ SPARKLE EFFECTS ============
const canvas = document.getElementById('sparkleCanvas');
const ctx = canvas.getContext('2d');
let sparkles = [];
let animationFrameId;

// Set canvas size
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Sparkle class
class Sparkle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 3 + 1;
        this.speedX = (Math.random() - 0.5) * 2;
        this.speedY = (Math.random() - 0.5) * 2;
        this.life = 100;
        this.maxLife = 100;
        this.color = this.randomGoldColor();
        this.rotation = Math.random() * 360;
        this.rotationSpeed = (Math.random() - 0.5) * 10;
        this.opacity = 1;
    }
    
    randomGoldColor() {
        const colors = [
            'rgba(212, 175, 55, ',   // Gold
            'rgba(255, 215, 0, ',     // Bright Gold
            'rgba(255, 223, 186, ',   // Light Gold
            'rgba(255, 255, 255, ',   // White
            'rgba(255, 248, 220, '    // Cornsilk
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.life--;
        this.rotation += this.rotationSpeed;
        this.opacity = this.life / this.maxLife;
        this.speedY += 0.05; // Gravity effect
    }
    
    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate((this.rotation * Math.PI) / 180);
        
        // Draw star sparkle
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color + this.opacity + ')';
        
        // Create star shape
        const spikes = 4;
        const outerRadius = this.size;
        const innerRadius = this.size / 2;
        
        ctx.beginPath();
        for (let i = 0; i < spikes * 2; i++) {
            const radius = i % 2 === 0 ? outerRadius : innerRadius;
            const angle = (i * Math.PI) / spikes;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.closePath();
        ctx.fill();
        
        // Add glow
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color + '0.8)';
        ctx.fill();
        
        ctx.restore();
    }
}

// Create sparkles continuously
function createSparkles() {
    // Random sparkles across the screen
    if (Math.random() < 0.1) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        sparkles.push(new Sparkle(x, y));
    }
}

// Add floating light orbs
class LightOrb {
    constructor() {
        this.reset();
    }
    
    reset() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + 50;
        this.radius = Math.random() * 3 + 2;
        this.speedY = -(Math.random() * 0.5 + 0.3);
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.opacity = Math.random() * 0.3 + 0.2;
        this.pulseSpeed = Math.random() * 0.02 + 0.01;
        this.pulsePhase = Math.random() * Math.PI * 2;
    }
    
    update() {
        this.y += this.speedY;
        this.x += this.speedX;
        this.pulsePhase += this.pulseSpeed;
        
        if (this.y < -50 || this.x < -50 || this.x > canvas.width + 50) {
            this.reset();
        }
    }
    
    draw() {
        const pulse = Math.sin(this.pulsePhase) * 0.2 + 0.8;
        const currentRadius = this.radius * pulse;
        
        ctx.save();
        ctx.globalAlpha = this.opacity * pulse;
        
        // Create gradient for glow effect
        const gradient = ctx.createRadialGradient(
            this.x, this.y, 0,
            this.x, this.y, currentRadius * 3
        );
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        gradient.addColorStop(0.3, 'rgba(255, 215, 0, 0.6)');
        gradient.addColorStop(1, 'rgba(212, 175, 55, 0)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, currentRadius * 3, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }
}

// Create light orbs
const lightOrbs = [];
for (let i = 0; i < 15; i++) {
    lightOrbs.push(new LightOrb());
}

// Mouse move sparkles - enhanced for better visibility
document.addEventListener('mousemove', (e) => {
    // Create sparkle trail on mouse movement - higher probability
    if (Math.random() < 0.5) {
        sparkles.push(new Sparkle(e.clientX, e.clientY));
    }
});

// Click to create burst of sparkles
document.addEventListener('click', (e) => {
    // Create burst of sparkles on click
    for (let i = 0; i < 8; i++) {
        sparkles.push(new Sparkle(e.clientX, e.clientY));
    }
});

// Animate sparkles - single combined animation loop
function animateSparkles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw and update light orbs
    lightOrbs.forEach(orb => {
        orb.update();
        orb.draw();
    });
    
    createSparkles();
    
    // Update and draw sparkles
    for (let i = sparkles.length - 1; i >= 0; i--) {
        sparkles[i].update();
        sparkles[i].draw();
        
        // Remove dead sparkles
        if (sparkles[i].life <= 0 || sparkles[i].y > canvas.height) {
            sparkles.splice(i, 1);
        }
    }
    
    // Limit sparkles for performance
    if (sparkles.length > 150) {
        sparkles = sparkles.slice(-150);
    }
    
    animationFrameId = requestAnimationFrame(animateSparkles);
}

// Start animation
animateSparkles();

// ============ END SPARKLE EFFECTS ============

// Smooth scroll with offset for fixed navbar
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offset = 80;
            const targetPosition = target.offsetTop - offset;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Add scroll effect to navbar
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.05)';
    }
    
    lastScroll = currentScroll;
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.milestone-card, .detail-box, .gallery-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Tradition Toggle Functionality
document.querySelectorAll('.tradition-toggle').forEach(button => {
    button.addEventListener('click', function() {
        const targetId = this.getAttribute('data-target');
        const targetSection = document.getElementById(targetId);
        
        if (targetSection.style.display === 'none' || targetSection.style.display === '') {
            targetSection.style.display = 'grid';
            targetSection.classList.remove('hide');
            targetSection.classList.add('show');
            this.textContent = 'Hide';
        } else {
            targetSection.classList.remove('show');
            targetSection.classList.add('hide');
            this.textContent = 'Show';
            
            // Hide after animation completes
            setTimeout(() => {
                targetSection.style.display = 'none';
                targetSection.classList.remove('hide');
            }, 400);
        }
    });
});

// Map View Toggle Functionality
document.querySelectorAll('.map-toggle-btn').forEach(button => {
    button.addEventListener('click', function() {
        const viewType = this.getAttribute('data-view');
        
        // Remove active class from all buttons
        document.querySelectorAll('.map-toggle-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Add active class to clicked button
        this.classList.add('active');
        
        // Hide all iframes
        document.querySelectorAll('.map-iframe').forEach(iframe => {
            iframe.classList.remove('active');
        });
        
        // Show the selected iframe
        if (viewType === 'map') {
            document.getElementById('mapView').classList.add('active');
        } else if (viewType === 'street') {
            document.getElementById('streetView').classList.add('active');
        }
    });
});

// Countdown Timer - January 3, 2026 at 6:00 PM Philippine Time (UTC+8)
function updateCountdown() {
    // Set event date in Philippine Time (UTC+8)
    const eventDate = new Date('2026-01-03T18:00:00+08:00').getTime();
    
    // Get current time
    const now = new Date().getTime();
    
    // Calculate time difference
    const distance = eventDate - now;
    
    // Calculate days, hours, minutes, seconds
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
    // Update DOM elements
    document.getElementById('days').textContent = days.toString().padStart(2, '0');
    document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
    document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
    document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
    
    // If countdown is finished
    if (distance < 0) {
        document.getElementById('days').textContent = '00';
        document.getElementById('hours').textContent = '00';
        document.getElementById('minutes').textContent = '00';
        document.getElementById('seconds').textContent = '00';
        document.querySelector('.countdown-title').textContent = 'The Celebration Has Begun!';
    }
}

// Update countdown every second
updateCountdown();
setInterval(updateCountdown, 1000);
