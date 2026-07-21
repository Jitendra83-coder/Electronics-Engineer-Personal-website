// ===================================
// Navigation & Mobile Menu
// ===================================
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

// Handle scroll event for navbar
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Toggle mobile menu
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a nav link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
});

// ===================================
// Smooth Scrolling & Full-Page Sections (Blog / Learning)
// ===================================
// Home, About, Skills, Projects, Experience, Certificates & Contact stay on
// one long scrolling page. Blog & Learning open as a separate "page" that
// hides the rest of the content, similar to a normal sub-page.
const pageModeSections = ['blog', 'learning'];

function enterPageMode(sectionId) {
    document.body.classList.add('page-mode');
    document.querySelectorAll('section[id]').forEach(sec => {
        sec.classList.toggle('active-page', sec.id === sectionId);
    });
    navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${sectionId}`);
    });
    window.scrollTo(0, 0);
    if (location.hash !== `#${sectionId}`) {
        history.pushState({ page: sectionId }, '', `#${sectionId}`);
    }
}

function exitPageMode(scrollToId) {
    document.body.classList.remove('page-mode');
    document.querySelectorAll('section[id]').forEach(sec => sec.classList.remove('active-page'));
    const target = scrollToId ? document.getElementById(scrollToId) : null;
    if (target) {
        requestAnimationFrame(() => {
            window.scrollTo({ top: target.offsetTop - 70, behavior: 'auto' });
        });
    }
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const hash = this.getAttribute('href');
        const targetId = hash.slice(1);
        const target = document.querySelector(hash);

        if (!target) return;

        // Blog / Learning: open as a dedicated page, hiding everything else
        if (pageModeSections.includes(targetId)) {
            enterPageMode(targetId);
            return;
        }

        // Any other link: if we're currently inside a full-page section,
        // leave that mode first, then scroll normally.
        if (document.body.classList.contains('page-mode')) {
            if (location.hash !== hash) {
                history.pushState({ page: targetId }, '', hash);
            }
            exitPageMode(targetId);
            return;
        }

        const offsetTop = target.offsetTop - 70;
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    });
});

// "Back to Home" buttons placed inside the Blog / Learning pages
document.querySelectorAll('.page-back-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        history.pushState({ page: 'home' }, '', '#home');
        exitPageMode('home');
    });
});

// Support browser Back/Forward buttons while switching in/out of page mode
window.addEventListener('popstate', () => {
    const hash = location.hash.replace('#', '');
    if (pageModeSections.includes(hash)) {
        enterPageMode(hash);
    } else {
        exitPageMode(hash || 'home');
    }
});

// If the page is loaded/refreshed directly on #blog or #learning, open that page view
window.addEventListener('load', () => {
    const hash = location.hash.replace('#', '');
    if (pageModeSections.includes(hash)) {
        enterPageMode(hash);
    }
});

// ===================================
// Active Nav Link on Scroll
// ===================================
const sections = document.querySelectorAll('section[id]');

function updateActiveNavLink() {
    if (document.body.classList.contains('page-mode')) return;
    const scrollY = window.pageYOffset;
    
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', updateActiveNavLink);

// ===================================
// Skills Progress Bar Animation
// ===================================
const skillsSection = document.querySelector('.skills');
let skillsAnimated = false;

function animateSkills() {
    const progressBars = document.querySelectorAll('.progress');
    
    progressBars.forEach(bar => {
        const width = bar.style.width;
        bar.style.width = '0';
        
        setTimeout(() => {
            bar.style.width = width;
        }, 100);
    });
}

function checkSkillsInView() {
    if (!skillsAnimated && skillsSection) {
        const rect = skillsSection.getBoundingClientRect();
        const isInView = rect.top < window.innerHeight && rect.bottom >= 0;
        
        if (isInView) {
            animateSkills();
            skillsAnimated = true;
        }
    }
}

window.addEventListener('scroll', checkSkillsInView);
window.addEventListener('load', checkSkillsInView);

// ===================================
// Contact Form Handling
// ===================================
const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');

contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form values
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    
    // Basic validation
    if (name.trim() === '' || email.trim() === '' || message.trim() === '') {
        showMessage('Please fill in all fields.', 'error');
        return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showMessage('Please enter a valid email address.', 'error');
        return;
    }
    
    // Simulate form submission (In production, this would send to a backend)
    setTimeout(() => {
        showMessage('Message sent successfully! I will get back to you soon.', 'success');
        contactForm.reset();
    }, 500);
});

function showMessage(message, type) {
    formMessage.textContent = message;
    formMessage.className = `form-message ${type}`;
    
    // Auto-hide message after 5 seconds
    setTimeout(() => {
        formMessage.className = 'form-message';
    }, 5000);
}

// ===================================
// Scroll to Top Button
// ===================================
const scrollTopBtn = document.getElementById('scrollTop');

scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Show/hide scroll to top button
window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
        scrollTopBtn.style.opacity = '1';
        scrollTopBtn.style.pointerEvents = 'auto';
    } else {
        scrollTopBtn.style.opacity = '0';
        scrollTopBtn.style.pointerEvents = 'none';
    }
});

// Initialize scroll top button visibility
scrollTopBtn.style.transition = 'opacity 0.3s ease';
scrollTopBtn.style.opacity = '0';
scrollTopBtn.style.pointerEvents = 'none';

// ===================================
// Intersection Observer for Animations
// ===================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe elements for animation
const animateElements = document.querySelectorAll('.project-card, .timeline-item, .skill-category, .info-card');
animateElements.forEach(el => {
    el.style.opacity = '0';
    observer.observe(el);
});

// ===================================
// Set Current Year in Footer
// ===================================
document.getElementById('currentYear').textContent = new Date().getFullYear();

// ===================================
// Typing Effect for Hero Section (Optional Enhancement)
// ===================================
const heroTitle = document.querySelector('.hero-title');
const originalText = heroTitle.textContent;
let typingIndex = 0;
let typingInterval;

function typeEffect() {
    if (typingIndex < originalText.length) {
        heroTitle.textContent = originalText.substring(0, typingIndex + 1);
        typingIndex++;
    } else {
        clearInterval(typingInterval);
    }
}

// Uncomment below to enable typing effect
// window.addEventListener('load', () => {
//     heroTitle.textContent = '';
//     typingIndex = 0;
//     typingInterval = setInterval(typeEffect, 100);
// });

// ===================================
// Project Card Tilt Effect (Optional Enhancement)
// ===================================
const projectCards = document.querySelectorAll('.project-card');

projectCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        // Uncomment below for tilt effect
        // card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    });
});

// ===================================
// Form Input Focus Effects
// ===================================
const formInputs = document.querySelectorAll('.form-group input, .form-group textarea');

formInputs.forEach(input => {
    input.addEventListener('focus', function() {
        this.parentElement.classList.add('focused');
    });
    
    input.addEventListener('blur', function() {
        if (this.value === '') {
            this.parentElement.classList.remove('focused');
        }
    });
});

// ===================================
// Prevent Default Form Submission on Enter (except textarea)
// ===================================
document.querySelectorAll('.form-group input').forEach(input => {
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
        }
    });
});

// ===================================
// Loading Animation (Optional)
// ===================================
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// ===================================
// Parallax Scroll Effect for Hero (Optional Enhancement)
// ===================================
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroContent = document.querySelector('.hero-content');
    
    if (heroContent && scrolled < window.innerHeight) {
        // Uncomment for parallax effect
        // heroContent.style.transform = `translateY(${scrolled * 0.5}px)`;
        // heroContent.style.opacity = 1 - (scrolled / window.innerHeight);
    }
});

// ===================================
// Console Message (Optional)
// ===================================
console.log('%c👋 Hello! Thanks for checking out my portfolio!', 'color: #2563eb; font-size: 20px; font-weight: bold;');
console.log('%cInterested in the code? Feel free to reach out!', 'color: #6b7280; font-size: 14px;');

// ===================================
// Add Active State to Current Section
// ===================================
const addActiveClass = () => {
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.pageYOffset >= sectionTop - 150) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
};

window.addEventListener('scroll', addActiveClass);

// ===================================
// Disable Right Click on Images (Optional - for portfolio protection)
// ===================================
// Uncomment if you want to disable right-click on images
// document.querySelectorAll('img').forEach(img => {
//     img.addEventListener('contextmenu', (e) => {
//         e.preventDefault();
//     });
// });

// ===================================
// Initialize AOS (Animate On Scroll) if library is included
// ===================================
// If you include AOS library, uncomment:
// AOS.init({
//     duration: 800,
//     offset: 100,
//     once: true
// });

// ===================================
// Print message when all resources are loaded
// ===================================
window.addEventListener('load', () => {
    console.log('Portfolio loaded successfully! 🚀');
});

// ===================================
// Easter Egg - Konami Code (Optional Fun Feature)
// ===================================
let konamiCode = [];
const konamiPattern = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode.splice(-konamiPattern.length - 1, konamiCode.length - konamiPattern.length);
    
    if (konamiCode.join('') === konamiPattern.join('')) {
        // Easter egg activated!
        document.body.style.animation = 'rainbow 2s infinite';
        setTimeout(() => {
            document.body.style.animation = '';
        }, 5000);
    }
});

// ===================================
// Cursor Trail Effect (Optional)
// ===================================
// Uncomment for cursor trail effect
// const coords = { x: 0, y: 0 };
// const circles = document.querySelectorAll(".circle");

// circles.forEach(function (circle) {
//     circle.x = 0;
//     circle.y = 0;
// });

// window.addEventListener("mousemove", function(e){
//     coords.x = e.clientX;
//     coords.y = e.clientY;
// });

// function animateCircles() {
//     let x = coords.x;
//     let y = coords.y;
    
//     circles.forEach(function (circle, index) {
//         circle.style.left = x - 12 + "px";
//         circle.style.top = y - 12 + "px";
        
//         circle.style.scale = (circles.length - index) / circles.length;
        
//         circle.x = x;
//         circle.y = y;

//         const nextCircle = circles[index + 1] || circles[0];
//         x += (nextCircle.x - x) * 0.3;
//         y += (nextCircle.y - y) * 0.3;
//     });
    
//     requestAnimationFrame(animateCircles);
// }

// animateCircles();

// ===================================
// Load Dynamic Content from Admin Panel (LocalStorage)
// ===================================
document.addEventListener('DOMContentLoaded', () => {
    // Hero Section
    const savedHeroName = localStorage.getItem('heroName');
    const savedHeroTitle = localStorage.getItem('heroTitle');
    const savedHeroTagline = localStorage.getItem('heroTagline');

    if (savedHeroName) {
        const heroNameElement = document.querySelector('.hero-name');
        if (heroNameElement) heroNameElement.textContent = savedHeroName;
    }
    
    if (savedHeroTitle) {
        const heroTitleElement = document.querySelector('.hero-title');
        // If typing effect is enabled, it overrides the text content, so we just update the text content.
        if (heroTitleElement) heroTitleElement.textContent = savedHeroTitle;
    }
    
    if (savedHeroTagline) {
        const heroTaglineElement = document.querySelector('.hero-tagline');
        if (heroTaglineElement) heroTaglineElement.textContent = savedHeroTagline;
    }

    // About Section
    const savedAboutParagraphs = localStorage.getItem('aboutParagraphs');
    if (savedAboutParagraphs) {
        try {
            const paragraphs = JSON.parse(savedAboutParagraphs);
            const aboutTextDiv = document.querySelector('.about-text');
            if (aboutTextDiv && paragraphs.length > 0) {
                aboutTextDiv.innerHTML = ''; // Clear default HTML
                paragraphs.forEach(item => {
                    // Check if it's the old format (string) or new format (object)
                    const isLegacy = typeof item === 'string';
                    const headingText = isLegacy ? '' : item.heading;
                    const paragraphText = isLegacy ? item : item.text;
                    
                    if (headingText) {
                        const h3 = document.createElement('h3');
                        h3.textContent = headingText;
                        aboutTextDiv.appendChild(h3);
                    }
                    
                    if (paragraphText) {
                        const p = document.createElement('p');
                        p.style.whiteSpace = 'pre-wrap';
                        p.textContent = paragraphText;
                        aboutTextDiv.appendChild(p);
                    }
                });
            }
        } catch (e) {
            console.error('Error parsing about paragraphs', e);
        }
    }

    // About Objectives
    const savedAboutObjectives = localStorage.getItem('aboutObjectives');
    if (savedAboutObjectives) {
        try {
            const objectives = JSON.parse(savedAboutObjectives);
            const aboutContentDiv = document.querySelector('.about-content');
            
            if (aboutContentDiv && objectives.length > 0) {
                // Remove existing info-cards
                const existingCards = aboutContentDiv.querySelectorAll('.info-card');
                existingCards.forEach(card => card.remove());
                
                // Append new ones
                objectives.forEach(item => {
                    const cardDiv = document.createElement('div');
                    cardDiv.className = 'info-card objective-card';
                    cardDiv.style.marginTop = '20px'; // spacing between multiple cards
                    
                    const iconClass = item.icon || 'fas fa-bullseye';
                    const headingText = item.heading || 'Career Objective';
                    
                    cardDiv.innerHTML = `
                        <div class="card-icon">
                            <i class="${iconClass}"></i>
                        </div>
                        <div class="card-content">
                            <h4>${headingText}</h4>
                            <p style="white-space: pre-wrap;">${item.text}</p>
                        </div>
                    `;
                    
                    aboutContentDiv.appendChild(cardDiv);
                });
            }
        } catch (e) {
            console.error('Error parsing about objectives', e);
        }
    } else {
        const savedAboutObjective = localStorage.getItem('aboutObjective');
        if (savedAboutObjective) {
            const objectiveParagraph = document.querySelector('.objective-card .card-content p');
            if (objectiveParagraph) {
                objectiveParagraph.style.whiteSpace = 'pre-wrap';
                objectiveParagraph.textContent = savedAboutObjective;
            }
        }
    }

    // Education Section
    const savedEducationItems = localStorage.getItem('educationItems');
    if (savedEducationItems) {
        try {
            const educationList = JSON.parse(savedEducationItems);
            const educationGrid = document.querySelector('.education-grid');
            
            if (educationGrid && educationList.length > 0) {
                // Clear existing
                educationGrid.innerHTML = '';
                
                educationList.forEach((item) => {
                    const categoryDiv = document.createElement('div');
                    categoryDiv.className = 'education-category';
                    
                    // Determine icon based on level keyword
                    let iconClass = 'fas fa-graduation-cap';
                    const levelLower = (item.level || '').toLowerCase();
                    if (levelLower.includes('school')) iconClass = 'fas fa-school';
                    
                    categoryDiv.innerHTML = `
                        <div class="category-header">
                            <div class="category-icon">
                                <i class="${iconClass}"></i>
                            </div>
                            <h3>${item.level || 'Education'}</h3>
                        </div>
                        <div class="education-details">
                            <div class="education-item">
                                <span class="education-label">Course</span>
                                <span class="education-value">${item.course || ''}</span>
                            </div>
                            <div class="education-item">
                                <span class="education-label">Year</span>
                                <span class="education-value">${item.year || ''}</span>
                            </div>
                            <div class="education-item">
                                <span class="education-label">Percentage/CGPA</span>
                                <span class="education-value">${item.percentage || ''}</span>
                            </div>
                            <div class="education-item">
                                <span class="education-label">University/Board</span>
                                <span class="education-value">${item.university || ''}</span>
                            </div>
                        </div>
                    `;
                    educationGrid.appendChild(categoryDiv);
                });
            }
        } catch (e) {
            console.error('Error parsing education items', e);
        }
    }

    // --- RENDER SKILLS FROM LOCALSTORAGE ---
    const skillsGrid = document.querySelector('.skills-grid');
    if (skillsGrid) {
        try {
            const storedSkills = localStorage.getItem('skillsItems');
            if (storedSkills) {
                const skills = JSON.parse(storedSkills);
                if (skills.length > 0) {
                    skillsGrid.innerHTML = '';
                    // Grouping skills by category
                    const categories = {};
                    skills.forEach(skill => {
                        const catName = skill.category || 'General';
                        if (!categories[catName]) {
                            categories[catName] = {
                                icon: skill.icon || 'fas fa-star',
                                items: []
                            };
                        }
                        categories[catName].items.push(skill);
                    });

                    Object.keys(categories).forEach(catName => {
                        const cat = categories[catName];
                        const catDiv = document.createElement('div');
                        catDiv.className = `skill-category ${catName.toLowerCase().replace(/\s+/g, '-')}`;
                        
                        let itemsHTML = '';
                        cat.items.forEach(item => {
                            itemsHTML += `
                                <div class="skill-item">
                                    <div class="skill-info">
                                        <span>${item.name}</span>
                                        <span>${item.percentage}%</span>
                                    </div>
                                    <div class="progress-bar">
                                        <div class="progress" style="width: ${item.percentage}%"></div>
                                    </div>
                                </div>
                            `;
                        });

                        catDiv.innerHTML = `
                            <div class="category-header">
                                <div class="category-icon">
                                    <i class="${cat.icon}"></i>
                                </div>
                                <h3>${catName}</h3>
                            </div>
                            <div class="skill-list">
                                ${itemsHTML}
                            </div>
                        `;
                        skillsGrid.appendChild(catDiv);
                    });
                }
            }
        } catch (e) {
            console.error('Error rendering skills:', e);
        }
    }

    // --- RENDER PROJECTS FROM LOCALSTORAGE ---
    const projectsGrid = document.querySelector('.projects-grid');
    if (projectsGrid) {
        try {
            const storedProjects = localStorage.getItem('projectsItems');
            if (storedProjects) {
                const projects = JSON.parse(storedProjects);
                if (projects.length > 0) {
                    projectsGrid.innerHTML = '';
                    projects.forEach(project => {
                        const projectCard = document.createElement('div');
                        projectCard.className = 'project-card';
                        
                        const tagsHTML = (project.tags || '')
                            .split(',')
                            .map(tag => `<span class="tag">${tag.trim()}</span>`)
                            .join('');

                        projectCard.innerHTML = `
                            <div class="project-image">
                                <img src="${project.image || 'https://via.placeholder.com/600x400'}" alt="${project.title}">
                                <div class="project-overlay"></div>
                            </div>
                            <div class="project-content">
                                <h3>${project.title}</h3>
                                <p>${project.description}</p>
                                <div class="project-tags">
                                    ${tagsHTML}
                                </div>
                                <div class="project-links">
                                    <a href="${project.github || '#'}" target="_blank" class="btn-link">
                                        <i class="fab fa-github"></i> Code
                                    </a>
                                    <a href="${project.demo || '#'}" target="_blank" class="btn-link primary">
                                        <i class="fas fa-external-link-alt"></i> Demo
                                    </a>
                                </div>
                            </div>
                        `;
                        projectsGrid.appendChild(projectCard);
                    });
                }
            }
        } catch (e) {
            console.error('Error rendering projects:', e);
        }
    }

    // --- RENDER EXPERIENCE FROM LOCALSTORAGE ---
    const timeline = document.querySelector('.timeline');
    if (timeline) {
        try {
            const storedExp = localStorage.getItem('experienceItems');
            if (storedExp) {
                const experience = JSON.parse(storedExp);
                if (experience.length > 0) {

                    // ----- Date-wise sorting helpers (latest first) -----
                    const EXPERIENCE_MONTHS = {
                        january: 0, jan: 0, february: 1, feb: 1, march: 2, mar: 2, april: 3, apr: 3,
                        may: 4, june: 5, jun: 5, july: 6, jul: 6, august: 7, aug: 7,
                        september: 8, sep: 8, sept: 8, october: 9, oct: 9,
                        november: 10, nov: 10, december: 11, dec: 11
                    };

                    function parseExperienceDate(str) {
                        if (!str) return null;
                        const s = str.trim().toLowerCase();

                        const yearMatch = s.match(/\b(19|20)\d{2}\b/);
                        if (!yearMatch) return null;
                        const year = parseInt(yearMatch[0], 10);

                        let month = 0;
                        for (const key in EXPERIENCE_MONTHS) {
                            if (s.includes(key)) { month = EXPERIENCE_MONTHS[key]; break; }
                        }

                        let day = 1;
                        const dayMatch = s.match(/\b([1-9]|[12]\d|3[01])(?:st|nd|rd|th)?\b/);
                        if (dayMatch) {
                            const d = parseInt(dayMatch[1], 10);
                            if (d >= 1 && d <= 31) day = d;
                        }

                        return new Date(year, month, day);
                    }

                    function getExperienceSortValue(item) {
                        const duration = (item.duration || '').trim();
                        if (!duration) return -Infinity;

                        const lower = duration.toLowerCase();
                        if (/till date|present|current|ongoing|now\b/.test(lower)) {
                            return Infinity;
                        }

                        const parts = duration.split(/\s*(?:-|–|—|\bto\b)\s*/i).map(p => p.trim()).filter(Boolean);
                        const endPart = parts.length > 1 ? parts[parts.length - 1] : parts[0];

                        if (/till date|present|current|ongoing/i.test(endPart)) return Infinity;

                        const endDate = parseExperienceDate(endPart) || parseExperienceDate(duration);
                        return endDate ? endDate.getTime() : -Infinity;
                    }

                    experience.sort((a, b) => getExperienceSortValue(b) - getExperienceSortValue(a));
                    // ----- end sorting helpers -----

                    timeline.innerHTML = '';
                    experience.forEach(item => {
                        const timelineItem = document.createElement('div');
                        timelineItem.className = 'timeline-item';
                        
                        const skillsTagsHTML = (item.tags || '')
                            .split(',')
                            .map(tag => `<span class="skill-tag">${tag.trim()}</span>`)
                            .join('');

                        timelineItem.innerHTML = `
                            <div class="timeline-dot">
                                <i class="${item.icon || 'fas fa-briefcase'}"></i>
                            </div>
                            <div class="timeline-card">
                                <div class="card-header">
                                    <span class="badge">${item.badge}</span>
                                    <span class="duration">${item.duration}</span>
                                </div>
                                <h3>${item.title}</h3>
                                <p class="company">${item.company} </p>
                                <p class="description">${item.description}</p>
                                <div class="skills-tags">
                                    ${skillsTagsHTML}
                                </div>
                            </div>
                        `;
                        timeline.appendChild(timelineItem);
                    });
                }
            }
        } catch (e) {
            console.error('Error rendering experience:', e);
        }
    }

    // --- RENDER CERTIFICATIONS FROM LOCALSTORAGE ---
    const certList = document.querySelector('.cert-list');
    if (certList) {
        try {
            const storedCerts = localStorage.getItem('certificatesItems');
            if (storedCerts) {
                const certifications = JSON.parse(storedCerts);
                if (certifications.length > 0) {
                    certList.innerHTML = '';
                    certifications.forEach(cert => {
                        const certItem = document.createElement('div');
                        certItem.className = 'cert-item';
                        
                        const tagsHTML = (cert.tags || '')
                            .split(',')
                            .filter(tag => tag.trim() !== '')
                            .map(tag => `<span class="skill-tag">${tag.trim()}</span>`)
                            .join('');

                        certItem.innerHTML = `
                            <h4>${cert.name}</h4>
                            <p><span class="cert-issuer">${cert.issuer}</span> | <span class="cert-year">${cert.year}</span></p>
                            ${cert.description ? `<p class="description">${cert.description}</p>` : ''}
                            ${tagsHTML ? `<div class="skills-tags">${tagsHTML}</div>` : ''}
                        `;
                        certList.appendChild(certItem);
                    });
                }
            }
        } catch (e) {
            console.error('Error rendering certifications:', e);
        }
    }

    // --- RENDER BLOG FROM LOCALSTORAGE ---
    const blogGrid = document.querySelector('.blog-grid');
    if (blogGrid) {
        try {
            const storedBlog = localStorage.getItem('blogItems');
            if (storedBlog) {
                const blogItems = JSON.parse(storedBlog);
                if (blogItems.length > 0) {
                    blogGrid.innerHTML = '';
                    blogItems.forEach((post, idx) => {
                        const tagsHTML = (post.tags || '')
                            .split(',')
                            .filter(t => t.trim())
                            .map(tag => `<span class="skill-tag">${tag.trim()}</span>`)
                            .join('');

                        const card = document.createElement('div');
                        card.className = 'blog-card';
                        card.style.cssText = 'background:#fff; border-radius:12px; overflow:hidden; box-shadow:0 4px 15px rgba(0,0,0,0.08); display:flex; flex-direction:column;';
                        card.innerHTML = `
                            ${post.image ? `<img src="${post.image}" alt="${post.title}" style="width:100%; height:180px; object-fit:cover;">` : ''}
                            <div style="padding:20px; flex:1; display:flex; flex-direction:column;">
                                <div style="font-size:0.8rem; color:#888; margin-bottom:8px;">${post.category || ''} ${post.date ? '&middot; ' + post.date : ''}</div>
                                <h3 style="margin:0 0 10px; font-size:1.15rem;">${post.title}</h3>
                                <p style="color:#666; font-size:0.9rem; flex:1;">${post.excerpt || ''}</p>
                                ${tagsHTML ? `<div class="skills-tags" style="margin:12px 0;">${tagsHTML}</div>` : ''}
                                <button class="btn-read-more" data-index="${idx}" style="margin-top:10px; padding:10px 18px; border:none; border-radius:6px; background:var(--primary-color, #4361ee); color:#fff; cursor:pointer; align-self:flex-start;">Read More</button>
                                <div class="blog-full-content" style="display:none; margin-top:15px; padding-top:15px; border-top:1px solid #eee; white-space:pre-wrap; color:#444; font-size:0.9rem;"></div>
                            </div>
                        `;
                        blogGrid.appendChild(card);
                    });

                    blogGrid.querySelectorAll('.btn-read-more').forEach(btn => {
                        btn.addEventListener('click', function () {
                            const idx = parseInt(this.getAttribute('data-index'));
                            const contentDiv = this.nextElementSibling;
                            if (contentDiv.style.display === 'none') {
                                contentDiv.textContent = blogItems[idx].content || '';
                                contentDiv.style.display = 'block';
                                this.textContent = 'Show Less';
                            } else {
                                contentDiv.style.display = 'none';
                                this.textContent = 'Read More';
                            }
                        });
                    });
                }
            }
        } catch (e) {
            console.error('Error rendering blog:', e);
        }
    }

    // --- SEED DEFAULT C / C++ COURSES (only the first time, so it never
    //     overwrites courses you add or delete later from the admin panel) ---
    if (localStorage.getItem('learningCourses') === null) {
        const defaultLearningCourses = [
            {
                title: 'C Programming',
                description: 'Core concepts of C with practice MCQs for quick revision and exam prep.',
                icon: 'fas fa-code',
                modules: [
                    {
                        title: 'Introduction & Basics',
                        notes: 'C is a procedural, general-purpose programming language created by Dennis Ritchie in 1972 at Bell Labs. Every C program has a mandatory entry-point function called main(), and every statement ends with a semicolon.',
                        questions: [
                            {
                                question: 'Who developed the C programming language?',
                                options: ['Dennis Ritchie', 'James Gosling', 'Bjarne Stroustrup', 'Guido van Rossum'],
                                correctIndex: 0,
                                explanation: 'C was created by Dennis Ritchie at Bell Labs in 1972.'
                            },
                            {
                                question: 'Which function is the entry point of a C program?',
                                options: ['start()', 'main()', 'begin()', 'init()'],
                                correctIndex: 1,
                                explanation: 'Execution of every C program begins from the main() function.'
                            },
                            {
                                question: 'Which symbol is used to terminate a statement in C?',
                                options: [', (comma)', ': (colon)', '; (semicolon)', '. (period)'],
                                correctIndex: 2,
                                explanation: 'A semicolon marks the end of a statement in C.'
                            }
                        ]
                    },
                    {
                        title: 'Data Types & Variables',
                        notes: 'C provides basic data types such as int, float, double and char, along with qualifiers like const and storage sizes that depend on the system/compiler.',
                        questions: [
                            {
                                question: "What is the size of an 'int' on most modern 32/64-bit systems?",
                                options: ['2 bytes', '4 bytes', '8 bytes', '1 byte'],
                                correctIndex: 1,
                                explanation: 'On most modern systems an int occupies 4 bytes, though this is compiler/platform dependent.'
                            },
                            {
                                question: 'Which keyword is used to define a constant in C?',
                                options: ['const', 'final', 'static', 'constant'],
                                correctIndex: 0,
                                explanation: "The 'const' qualifier makes a variable's value unmodifiable after initialization."
                            },
                            {
                                question: 'Which format specifier is used to print a float value with printf()?',
                                options: ['%d', '%f', '%c', '%s'],
                                correctIndex: 1,
                                explanation: "'%f' is the format specifier for floating point values."
                            }
                        ]
                    },
                    {
                        title: 'Control Structures',
                        notes: 'C supports decision-making with if/else and switch, and looping with for, while and do-while, plus break/continue to alter loop flow.',
                        questions: [
                            {
                                question: 'Which loop is guaranteed to execute at least once?',
                                options: ['for', 'while', 'do-while', 'if'],
                                correctIndex: 2,
                                explanation: 'A do-while loop checks its condition after the loop body runs, so it always executes at least once.'
                            },
                            {
                                question: 'Which statement immediately exits the nearest enclosing loop?',
                                options: ['continue', 'break', 'return', 'exit'],
                                correctIndex: 1,
                                explanation: "'break' terminates the loop it is placed in immediately."
                            },
                            {
                                question: "What does a 'switch' statement compare its expression against?",
                                options: ['Ranges of values', 'Boolean expressions', 'Discrete constant values/labels', 'Pointers only'],
                                correctIndex: 2,
                                explanation: 'switch-case matches an expression against discrete constant case labels.'
                            }
                        ]
                    },
                    {
                        title: 'Functions & Storage Classes',
                        notes: 'Functions let you organize reusable blocks of code. Storage classes (auto, static, extern, register) control a variable\'s scope, lifetime and default value.',
                        questions: [
                            {
                                question: "Which storage class retains a variable's value between function calls?",
                                options: ['auto', 'static', 'register', 'extern'],
                                correctIndex: 1,
                                explanation: 'A static local variable keeps its value between successive calls to the function.'
                            },
                            {
                                question: 'What is recursion?',
                                options: ['A loop inside a loop', 'A function calling itself', 'A pointer to a function', 'A type of array'],
                                correctIndex: 1,
                                explanation: 'Recursion occurs when a function calls itself, directly or indirectly, to solve a smaller sub-problem.'
                            },
                            {
                                question: 'Which keyword is used to access a variable defined in another file?',
                                options: ['static', 'extern', 'auto', 'register'],
                                correctIndex: 1,
                                explanation: "'extern' declares a variable that is defined elsewhere, often in another source file."
                            }
                        ]
                    },
                    {
                        title: 'Arrays, Strings & Pointers',
                        notes: 'Arrays store fixed-size sequential collections of elements. Strings in C are arrays of characters terminated by \\0. Pointers hold memory addresses of variables.',
                        questions: [
                            {
                                question: "What does the pointer expression '*p' represent?",
                                options: ['The address of p', 'The value stored at the address p points to', 'A new pointer', 'A string'],
                                correctIndex: 1,
                                explanation: "The dereference operator '*' accesses the value stored at the address a pointer holds."
                            },
                            {
                                question: 'Which function is used to find the length of a string in C?',
                                options: ['strlen()', 'length()', 'size()', 'strcount()'],
                                correctIndex: 0,
                                explanation: "strlen() returns the number of characters in a string, excluding the null terminator."
                            },
                            {
                                question: 'Array indices in C start from which number?',
                                options: ['1', '0', '-1', 'Depends on the compiler'],
                                correctIndex: 1,
                                explanation: 'C arrays are zero-indexed, so the first element is at index 0.'
                            }
                        ]
                    },
                    {
                        title: 'Structures & File Handling',
                        notes: 'Structures (struct) group related variables of different types under one name. The stdio.h library provides functions like fopen(), fread()/fwrite() and fclose() for file I/O.',
                        questions: [
                            {
                                question: 'Which keyword defines a user-defined data type grouping variables of different types?',
                                options: ['array', 'struct', 'union', 'class'],
                                correctIndex: 1,
                                explanation: "'struct' is used to group related variables (possibly of different types) under one name."
                            },
                            {
                                question: 'Which function is used to open a file in C?',
                                options: ['open()', 'fopen()', 'fileopen()', 'openFile()'],
                                correctIndex: 1,
                                explanation: 'fopen() opens a file and returns a FILE pointer used for subsequent operations.'
                            },
                            {
                                question: 'Which file mode opens a file for appending data without deleting existing content?',
                                options: ['"r"', '"w"', '"a"', '"x"'],
                                correctIndex: 2,
                                explanation: '"a" mode opens (or creates) a file and writes are added to the end, preserving existing content.'
                            }
                        ]
                    }
                ]
            },
            {
                title: 'C++ Programming',
                description: 'Object-oriented programming in C++ with MCQs covering classes, inheritance, polymorphism, STL and more.',
                icon: 'fas fa-laptop-code',
                modules: [
                    {
                        title: 'OOP Basics',
                        notes: 'C++ extends C with object-oriented features built on four pillars: encapsulation, abstraction, inheritance and polymorphism, organized around classes and objects.',
                        questions: [
                            {
                                question: 'Which of the following is NOT one of the four pillars of OOP?',
                                options: ['Encapsulation', 'Polymorphism', 'Compilation', 'Inheritance'],
                                correctIndex: 2,
                                explanation: 'Compilation is a build step, not an OOP principle. The four pillars are encapsulation, abstraction, inheritance and polymorphism.'
                            },
                            {
                                question: 'Which keyword is used to define a class in C++?',
                                options: ['struct', 'class', 'object', 'define'],
                                correctIndex: 1,
                                explanation: "The 'class' keyword defines a new class in C++ (struct can also define one, but with public members by default)."
                            },
                            {
                                question: 'What is an object in OOP terms?',
                                options: ['A blueprint for data', 'An instance of a class', 'A type of function', 'A loop construct'],
                                correctIndex: 1,
                                explanation: 'An object is a concrete instance created from a class, which acts as its blueprint.'
                            }
                        ]
                    },
                    {
                        title: 'Constructors & Destructors',
                        notes: 'Constructors initialize objects automatically when created; destructors clean up resources when an object goes out of scope. Both can be customized and, in the case of constructors, overloaded.',
                        questions: [
                            {
                                question: 'Which constructor is called automatically when an object is created without arguments?',
                                options: ['Default constructor', 'Copy constructor', 'Destructor', 'Static constructor'],
                                correctIndex: 0,
                                explanation: 'The default constructor runs automatically whenever an object is created with no explicit arguments.'
                            },
                            {
                                question: "What symbol precedes a destructor's name in C++?",
                                options: ['&', '*', '~', '#'],
                                correctIndex: 2,
                                explanation: "A destructor's name is the class name prefixed with a tilde ('~')."
                            },
                            {
                                question: 'Can constructors be overloaded in C++?',
                                options: ['No, never', 'Yes, based on differing parameter lists', 'Only in derived classes', 'Only when using templates'],
                                correctIndex: 1,
                                explanation: 'C++ allows multiple constructors with different parameter lists, just like normal function overloading.'
                            }
                        ]
                    },
                    {
                        title: 'Inheritance',
                        notes: 'Inheritance lets a class (derived) acquire properties and behavior from another class (base), enabling code reuse. C++ supports single, multiple, multilevel, hierarchical and hybrid inheritance.',
                        questions: [
                            {
                                question: 'Which type of inheritance involves exactly one base class and one derived class?',
                                options: ['Multiple inheritance', 'Single inheritance', 'Hierarchical inheritance', 'Hybrid inheritance'],
                                correctIndex: 1,
                                explanation: 'Single inheritance means one derived class inherits from just one base class.'
                            },
                            {
                                question: 'Which access specifier restricts members to be accessible only within the same class?',
                                options: ['public', 'protected', 'private', 'friend'],
                                correctIndex: 2,
                                explanation: "'private' members are accessible only inside the class that declares them (not even derived classes)."
                            },
                            {
                                question: 'How is a class inherited from a base class in C++ syntax?',
                                options: ["Using the 'implements' keyword", "A colon (:) followed by the base class name", "Using the 'extends' keyword", "Using #include"],
                                correctIndex: 1,
                                explanation: "C++ uses 'class Derived : access-specifier Base { ... }' syntax to inherit from a base class."
                            }
                        ]
                    },
                    {
                        title: 'Polymorphism',
                        notes: 'Polymorphism allows the same interface to behave differently. Compile-time polymorphism is achieved via function/operator overloading; runtime polymorphism uses virtual functions and inheritance.',
                        questions: [
                            {
                                question: 'Function overloading is an example of which kind of polymorphism?',
                                options: ['Runtime polymorphism', 'Compile-time polymorphism', 'Dynamic binding', 'Encapsulation'],
                                correctIndex: 1,
                                explanation: 'Overload resolution happens at compile time, making function overloading a form of compile-time (static) polymorphism.'
                            },
                            {
                                question: 'Which keyword enables runtime polymorphism through function overriding?',
                                options: ['static', 'virtual', 'const', 'inline'],
                                correctIndex: 1,
                                explanation: "Declaring a base class function as 'virtual' allows derived classes to override it, enabling runtime (dynamic) polymorphism."
                            },
                            {
                                question: 'What does operator overloading allow you to do?',
                                options: ['Redefine how operators work for user-defined types', 'Overload loops', 'Only overload functions, not operators', 'It is not possible in C++'],
                                correctIndex: 0,
                                explanation: 'Operator overloading lets you define custom behavior for operators (like +, ==) when used with user-defined types/classes.'
                            }
                        ]
                    },
                    {
                        title: 'STL & Templates',
                        notes: 'The Standard Template Library (STL) provides ready-made containers (vector, set, map...), algorithms and iterators. Templates let you write generic, type-independent functions and classes.',
                        questions: [
                            {
                                question: 'What does STL stand for?',
                                options: ['Standard Template Library', 'Structured Type Language', 'System Type Library', 'Static Template Layer'],
                                correctIndex: 0,
                                explanation: 'STL stands for Standard Template Library, part of the C++ standard library.'
                            },
                            {
                                question: 'Which STL container stores unique elements in sorted order?',
                                options: ['vector', 'set', 'list', 'queue'],
                                correctIndex: 1,
                                explanation: 'std::set stores unique elements automatically kept in sorted order.'
                            },
                            {
                                question: 'What is the main advantage of using templates in C++?',
                                options: ['Faster compilation always', 'Writing generic, type-independent code', 'Smaller executable size always', 'Automatic memory management'],
                                correctIndex: 1,
                                explanation: 'Templates let the same function/class work with any data type, avoiding duplicated type-specific code.'
                            }
                        ]
                    },
                    {
                        title: 'Exception Handling',
                        notes: 'C++ handles runtime errors using try, throw and catch blocks, allowing a program to respond to exceptional situations without crashing abruptly.',
                        questions: [
                            {
                                question: 'Which block is used to catch exceptions thrown in a try block?',
                                options: ['try', 'catch', 'throw', 'handle'],
                                correctIndex: 1,
                                explanation: "A 'catch' block follows a 'try' block and handles exceptions of a matching type."
                            },
                            {
                                question: 'Which keyword is used to raise/signal an exception in C++?',
                                options: ['raise', 'throw', 'catch', 'error'],
                                correctIndex: 1,
                                explanation: "The 'throw' keyword signals that an exceptional condition has occurred."
                            },
                            {
                                question: 'What happens if an exception is thrown but never caught?',
                                options: ['The program continues normally', "std::terminate() is called and the program aborts", 'It is silently ignored', 'A compiler error occurs'],
                                correctIndex: 1,
                                explanation: 'An uncaught exception calls std::terminate(), which by default aborts the program.'
                            }
                        ]
                    }
                ]
            }
        ];
        localStorage.setItem('learningCourses', JSON.stringify(defaultLearningCourses));
    }

    // --- RENDER LEARNING (COURSES/MODULES/MCQ) FROM LOCALSTORAGE ---
    const learningContainer = document.querySelector('.learning-courses');
    if (learningContainer) {
        try {
            const storedLearning = localStorage.getItem('learningCourses');
            if (storedLearning) {
                const courses = JSON.parse(storedLearning);
                if (courses.length > 0) {
                    learningContainer.innerHTML = '';
                    courses.forEach((course, cIdx) => {
                        const courseCard = document.createElement('div');
                        courseCard.style.cssText = 'background:#fff; border-radius:12px; box-shadow:0 4px 15px rgba(0,0,0,0.08); margin-bottom:20px; overflow:hidden;';

                        const modulesHTML = (course.modules || []).map((mod, mIdx) => {
                            const questionsHTML = (mod.questions || []).map((q, qIdx) => {
                                const optsHTML = (q.options || []).map((opt, oIdx) => `
                                    <label style="display:block; padding:8px 12px; margin:5px 0; border:1px solid #e0e0e0; border-radius:6px; cursor:pointer;">
                                        <input type="radio" name="c${cIdx}-m${mIdx}-q${qIdx}" value="${oIdx}" style="margin-right:8px;"> ${opt}
                                    </label>
                                `).join('');
                                return `
                                    <div class="mcq-block" style="margin:15px 0; padding:15px; background:#f8f9fa; border-radius:8px;" data-correct="${q.correctIndex}">
                                        <p style="font-weight:600; margin-bottom:8px;">${qIdx + 1}. ${q.question}</p>
                                        ${optsHTML}
                                        <button class="btn-check-answer" style="margin-top:8px; padding:6px 14px; border:none; border-radius:6px; background:#4361ee; color:#fff; cursor:pointer; font-size:0.85rem;">Check Answer</button>
                                        <p class="mcq-result" style="margin-top:8px; font-size:0.85rem; display:none;"></p>
                                        ${q.explanation ? `<p class="mcq-explanation" style="margin-top:5px; font-size:0.8rem; color:#777; display:none;">${q.explanation}</p>` : ''}
                                    </div>
                                `;
                            }).join('');

                            return `
                                <div class="learning-module" style="border-top:1px solid #eee;">
                                    <div class="module-header" style="padding:15px 20px; cursor:pointer; display:flex; justify-content:space-between; align-items:center;">
                                        <strong>${mod.title}</strong>
                                        <i class="fas fa-chevron-down"></i>
                                    </div>
                                    <div class="module-body" style="display:none; padding:0 20px 20px;">
                                        ${mod.notes ? `<p style="white-space:pre-wrap; color:#555; margin-bottom:15px;">${mod.notes}</p>` : ''}
                                        ${questionsHTML}
                                    </div>
                                </div>
                            `;
                        }).join('');

                        courseCard.innerHTML = `
                            <div class="course-header" style="padding:20px; background:#f8f9fa; display:flex; align-items:center; gap:15px; cursor:pointer;">
                                <i class="${course.icon || 'fas fa-book'}" style="font-size:1.4rem; color:#4361ee;"></i>
                                <div>
                                    <h3 style="margin:0;">${course.title}</h3>
                                    <p style="margin:5px 0 0; color:#777; font-size:0.9rem;">${course.description || ''}</p>
                                </div>
                            </div>
                            <div class="course-body" style="display:none;">
                                ${modulesHTML || '<p style="padding:20px; color:#999;">No modules yet.</p>'}
                            </div>
                        `;
                        learningContainer.appendChild(courseCard);
                    });

                    // Toggle course body
                    learningContainer.querySelectorAll('.course-header').forEach(header => {
                        header.addEventListener('click', () => {
                            const body = header.nextElementSibling;
                            body.style.display = body.style.display === 'none' ? 'block' : 'none';
                        });
                    });
                    // Toggle module body
                    learningContainer.querySelectorAll('.module-header').forEach(header => {
                        header.addEventListener('click', () => {
                            const body = header.nextElementSibling;
                            body.style.display = body.style.display === 'none' ? 'block' : 'none';
                        });
                    });
                    // Check answer buttons
                    learningContainer.querySelectorAll('.btn-check-answer').forEach(btn => {
                        btn.addEventListener('click', function () {
                            const block = this.closest('.mcq-block');
                            const correctIdx = parseInt(block.getAttribute('data-correct'));
                            const selected = block.querySelector('input[type="radio"]:checked');
                            const resultP = block.querySelector('.mcq-result');
                            const explanationP = block.querySelector('.mcq-explanation');

                            if (!selected) {
                                resultP.textContent = 'Please select an answer first.';
                                resultP.style.color = '#e63946';
                                resultP.style.display = 'block';
                                return;
                            }
                            const isCorrect = parseInt(selected.value) === correctIdx;
                            resultP.textContent = isCorrect ? '✓ Correct!' : '✗ Incorrect. Try again!';
                            resultP.style.color = isCorrect ? '#2a9d8f' : '#e63946';
                            resultP.style.display = 'block';
                            if (explanationP) explanationP.style.display = 'block';
                        });
                    });
                }
            }
        } catch (e) {
            console.error('Error rendering learning courses:', e);
        }
    }
});
