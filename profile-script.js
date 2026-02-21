// Netflix-Style Portfolio JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Netflix header scroll effect
    const header = document.querySelector('.netflix-header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.netflix-nav a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Update active link
                navLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });

    // Active navigation highlighting on scroll
    const sections = document.querySelectorAll('section[id]');
    
    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY + 120;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.netflix-nav a[href="#${sectionId}"]`);
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => link.classList.remove('active'));
                if (navLink) {
                    navLink.classList.add('active');
                }
            }
        });
    });

    // Hero buttons functionality
    const playBtn = document.querySelector('.play-btn');
    const infoBtn = document.querySelector('.info-btn');
    
    if (playBtn) {
        playBtn.addEventListener('click', () => {
            document.querySelector('#projects').scrollIntoView({
                behavior: 'smooth'
            });
            showNetflixNotification('Viewing Projects...');
        });
    }
    
    if (infoBtn) {
        infoBtn.addEventListener('click', () => {
            document.querySelector('#about').scrollIntoView({
                behavior: 'smooth'
            });
            showNetflixNotification('Learning More...');
        });
    }

    // Card hover effects with Netflix-style scaling
    const cards = document.querySelectorAll('.about-card, .skill-card, .project-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            // Scale up the hovered card
            card.style.transform = 'scale(1.08)';
            card.style.zIndex = '10';
            
            // Add slight scale down to siblings
            const siblings = Array.from(card.parentElement.children).filter(c => c !== card);
            siblings.forEach(sibling => {
                sibling.style.transform = 'scale(0.95)';
                sibling.style.opacity = '0.7';
            });
        });
        
        card.addEventListener('mouseleave', () => {
            // Reset all cards
            const allCards = card.parentElement.querySelectorAll('.about-card, .skill-card, .project-card');
            allCards.forEach(c => {
                c.style.transform = 'scale(1)';
                c.style.zIndex = '1';
                c.style.opacity = '1';
            });
        });
    });

    // Project card controls
    const projectControls = document.querySelectorAll('.card-controls button');
    
    projectControls.forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent card click
            
            if (button.classList.contains('play-btn')) {
                showNetflixNotification('▶ Opening project demo...');
            } else if (button.classList.contains('add-btn')) {
                button.style.background = 'rgba(229, 9, 20, 0.8)';
                showNetflixNotification('✓ Added to your list');
            } else if (button.classList.contains('like-btn')) {
                button.style.background = 'rgba(229, 9, 20, 0.8)';
                showNetflixNotification('👍 Liked!');
            }
            
            addRippleEffect(button);
        });
    });

    // Contact methods
    const contactMethods = document.querySelectorAll('.contact-method');
    
    contactMethods.forEach(method => {
        method.addEventListener('click', (e) => {
            const href = method.getAttribute('href');
            
            if (href.startsWith('mailto:')) {
                showNetflixNotification('📧 Opening email...');
            } else if (href.includes('linkedin')) {
                showNetflixNotification('💼 Opening LinkedIn...');
            } else if (href.includes('github')) {
                showNetflixNotification('💻 Opening GitHub...');
            } else if (href.startsWith('tel:')) {
                showNetflixNotification('📞 Ready to call...');
            }
            
            addRippleEffect(method);
        });
    });

    // Experience cards interaction
    const experienceCards = document.querySelectorAll('.experience-card');
    
    experienceCards.forEach(card => {
        card.addEventListener('click', () => {
            // Add selection effect
            experienceCards.forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            
            const companyName = card.querySelector('h4').textContent;
            showNetflixNotification(`Viewing experience at ${companyName}`);
        });
    });

    // Horizontal scroll for card sliders (Netflix-style)
    const cardSliders = document.querySelectorAll('.cards-slider, .experience-timeline');
    
    cardSliders.forEach(slider => {
        let isDown = false;
        let startX;
        let scrollLeft;
        
        slider.addEventListener('mousedown', (e) => {
            isDown = true;
            slider.classList.add('active');
            startX = e.pageX - slider.offsetLeft;
            scrollLeft = slider.scrollLeft;
        });
        
        slider.addEventListener('mouseleave', () => {
            isDown = false;
            slider.classList.remove('active');
        });
        
        slider.addEventListener('mouseup', () => {
            isDown = false;
            slider.classList.remove('active');
        });
        
        slider.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - slider.offsetLeft;
            const walk = (x - startX) * 2;
            slider.scrollLeft = scrollLeft - walk;
        });
    });

    // Profile dropdown interaction
    const profileDropdown = document.querySelector('.profile-dropdown');
    
    if (profileDropdown) {
        profileDropdown.addEventListener('click', () => {
            showNetflixNotification('Profile menu coming soon...');
        });
    }

    // Search functionality
    const searchIcon = document.querySelector('.search-icon');
    
    if (searchIcon) {
        searchIcon.addEventListener('click', () => {
            showNetflixNotification('Search functionality coming soon...');
        });
    }

    // Notifications icon
    const notificationsIcon = document.querySelector('.notifications-icon');
    
    if (notificationsIcon) {
        notificationsIcon.addEventListener('click', () => {
            showNetflixNotification('No new notifications');
        });
    }

    // Utility function for Netflix-style notifications
    function showNetflixNotification(message, duration = 3000) {
        // Remove any existing notifications
        const existing = document.querySelector('.netflix-notification');
        if (existing) {
            existing.remove();
        }
        
        const notification = document.createElement('div');
        notification.className = 'netflix-notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 30px;
            background: rgba(0, 0, 0, 0.9);
            color: white;
            padding: 15px 25px;
            border-radius: 4px;
            border-left: 4px solid #E50914;
            z-index: 3000;
            opacity: 0;
            transform: translateX(100px);
            transition: all 0.3s ease;
            box-shadow: 0 8px 25px rgba(0,0,0,0.6);
            font-weight: 400;
            font-size: 14px;
            max-width: 300px;
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after duration
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100px)';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, duration);
    }

    // Utility function for ripple effect
    function addRippleEffect(element) {
        const ripple = document.createElement('span');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = rect.width / 2 - size / 2;
        const y = rect.height / 2 - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255,255,255,0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: netflixRipple 0.6s ease-out;
            pointer-events: none;
        `;
        
        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    // Auto-scroll teasers for card rows (Netflix-style auto-preview)
    const autoScrollCards = () => {
        const sliders = document.querySelectorAll('.cards-slider');
        let currentSliderIndex = 0;
        
        setInterval(() => {
            if (sliders.length > 0) {
                const slider = sliders[currentSliderIndex];
                const scrollAmount = 320; // Width of one card plus gap
                
                if (slider.scrollLeft >= slider.scrollWidth - slider.clientWidth) {
                    slider.scrollLeft = 0; // Reset to beginning
                } else {
                    slider.scrollBy({
                        left: scrollAmount,
                        behavior: 'smooth'
                    });
                }
                
                currentSliderIndex = (currentSliderIndex + 1) % sliders.length;
            }
        }, 8000); // Change every 8 seconds
    };

    // Initialize auto-scroll (uncomment to enable)
    // autoScrollCards();

    // Welcome message with Netflix style
    setTimeout(() => {
        showNetflixNotification('Welcome to Deepika\'s Portfolio! 🎬', 4000);
    }, 2000);
});

// CSS injection for animations
const netflixStyle = document.createElement('style');
netflixStyle.textContent = `
    @keyframes netflixRipple {
        from {
            transform: scale(0);
            opacity: 1;
        }
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .experience-card.selected {
        border-left: 4px solid #E50914;
        background: rgba(229, 9, 20, 0.1);
    }
    
    .cards-slider.active,
    .experience-timeline.active {
        cursor: grabbing;
        cursor: -webkit-grabbing;
    }
    
    .cards-slider,
    .experience-timeline {
        cursor: grab;
        cursor: -webkit-grab;
    }
`;
document.head.appendChild(netflixStyle);

    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Update active link
                navLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });

    // Active navigation highlighting on scroll
    const sections = document.querySelectorAll('section[id]');
    
    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY + 120;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-menu a[href="#${sectionId}"]`);
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => link.classList.remove('active'));
                if (navLink) {
                    navLink.classList.add('active');
                }
            }
        });
    });

    // Animated counter for stats
    const observeCounters = () => {
        const counters = document.querySelectorAll('.stat-number');
        
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const target = parseInt(counter.textContent);
                    const duration = 2000;
                    const increment = target / (duration / 16);
                    let count = 0;
                    
                    const timer = setInterval(() => {
                        count += increment;
                        if (count >= target) {
                            counter.textContent = target + '+';
                            clearInterval(timer);
                        } else {
                            counter.textContent = Math.floor(count);
                        }
                    }, 16);
                    
                    counterObserver.unobserve(counter);
                }
            });
        }, { threshold: 0.5 });
        
        counters.forEach(counter => {
            counterObserver.observe(counter);
        });
    };

    // Intersection Observer for animations
    const animateOnScroll = () => {
        const animatedElements = document.querySelectorAll(
            '.about-card, .skill-category, .experience-card, .project-card, .contact-card'
        );
        
        const animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { 
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        // Set initial state and observe
        animatedElements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            animationObserver.observe(element);
        });
    };

    // Project card interactions
    const initProjectCards = () => {
        const projectCards = document.querySelectorAll('.project-card');
        
        projectCards.forEach(card => {
            const controls = card.querySelector('.project-controls');
            
            if (controls) {
                const playBtn = controls.querySelector('.control-btn:first-child');
                const githubBtn = controls.querySelector('.control-btn:nth-child(2)');
                const likeBtn = controls.querySelector('.control-btn:last-child');
                
                if (playBtn) {
                    playBtn.addEventListener('click', () => {
                        showNotification('Opening project demo...');
                        addRippleEffect(playBtn);
                    });
                }
                
                if (githubBtn) {
                    githubBtn.addEventListener('click', () => {
                        window.open('https://github.com/nuthalapatideepika', '_blank');
                        addRippleEffect(githubBtn);
                    });
                }
                
                if (likeBtn) {
                    likeBtn.addEventListener('click', () => {
                        const icon = likeBtn.querySelector('i');
                        
                        if (icon.classList.contains('fas')) {
                            icon.classList.remove('fas');
                            icon.classList.add('far');
                            likeBtn.style.background = 'rgba(255,255,255,0.2)';
                            showNotification('Removed from favorites');
                        } else {
                            icon.classList.remove('far');
                            icon.classList.add('fas');
                            likeBtn.style.background = '#E50914';
                            showNotification('Added to favorites');
                        }
                        addRippleEffect(likeBtn);
                    });
                }
            }
        });
    };

    // Contact method interactions
    const initContactMethods = () => {
        const contactMethods = document.querySelectorAll('.contact-method');
        
        contactMethods.forEach(method => {
            method.addEventListener('click', (e) => {
                const href = method.getAttribute('href');
                
                if (href.startsWith('mailto:')) {
                    showNotification('Opening email client...');
                } else if (href.includes('linkedin')) {
                    showNotification('Opening LinkedIn profile...');
                } else if (href.includes('github')) {
                    showNotification('Opening GitHub profile...');
                }
                
                addRippleEffect(method);
            });
        });
    };

    // Hero button interactions
    const initHeroButtons = () => {
        const heroButtons = document.querySelectorAll('.btn-primary, .btn-secondary');
        
        heroButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                addRippleEffect(button);
                
                if (button.classList.contains('btn-primary')) {
                    showNotification('Scrolling to projects...');
                } else {
                    showNotification('Learning more about Deepika...');
                }
            });
        });
    };

    // Skill card hover effects
    const initSkillCards = () => {
        const skillCards = document.querySelectorAll('.skill-card');
        
        skillCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-5px) scale(1.05)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(-5px)';
            });
        });
    };

    // Row navigation for projects (if needed in future)
    const initRowNavigation = () => {
        const projectsGrid = document.querySelector('.projects-grid');
        const prevBtn = document.querySelector('.row-nav.prev');
        const nextBtn = document.querySelector('.row-nav.next');
        
        if (prevBtn && nextBtn && projectsGrid) {
            prevBtn.addEventListener('click', () => {
                projectsGrid.scrollBy({
                    left: -300,
                    behavior: 'smooth'
                });
                addRippleEffect(prevBtn);
            });
            
            nextBtn.addEventListener('click', () => {
                projectsGrid.scrollBy({
                    left: 300,
                    behavior: 'smooth'
                });
                addRippleEffect(nextBtn);
            });
        }
    };

    // Utility function for ripple effect
    function addRippleEffect(element) {
        const ripple = document.createElement('span');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = rect.width / 2 - size / 2;
        const y = rect.height / 2 - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255,255,255,0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
        `;
        
        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    // Notification system
    function showNotification(message, duration = 3000) {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: var(--card-bg);
            color: var(--light-text);
            padding: 15px 25px;
            border-radius: 8px;
            border: 1px solid var(--primary-red);
            z-index: 3000;
            opacity: 0;
            transform: translateX(100px);
            transition: all 0.3s ease;
            box-shadow: 0 8px 25px rgba(0,0,0,0.6);
            font-weight: 500;
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after duration
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100px)';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, duration);
    }

    // Parallax effect for hero background
    const initParallax = () => {
        const hero = document.querySelector('.hero');
        
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const speed = 0.5;
            hero.style.transform = `translateY(${scrolled * speed}px)`;
        });
    };

    // Typing effect for hero title (optional)
    const initTypingEffect = () => {
        const title = document.querySelector('.hero-title');
        const text = title.textContent;
        title.textContent = '';
        
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                title.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        };
        
        // Start typing effect after a short delay
        setTimeout(typeWriter, 1000);
    };

    // Initialize all functions
    observeCounters();
    animateOnScroll();
    initProjectCards();
    initContactMethods();
    initHeroButtons();
    initSkillCards();
    initRowNavigation();
    // initParallax(); // Uncomment for parallax effect
    // initTypingEffect(); // Uncomment for typing effect
    
    // Welcome message
    setTimeout(() => {
        showNotification('Welcome to Deepika\'s Portfolio! 🚀', 4000);
    }, 2000);

// CSS injection for animations
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        from {
            transform: scale(0);
            opacity: 1;
        }
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .hero-title {
        opacity: 1;
        animation: fadeInUp 1s ease-out;
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .tag {
        animation: fadeInUp 0.6s ease-out forwards;
        opacity: 0;
    }
    
    .tag:nth-child(1) { animation-delay: 0.1s; }
    .tag:nth-child(2) { animation-delay: 0.2s; }
    .tag:nth-child(3) { animation-delay: 0.3s; }
    .tag:nth-child(4) { animation-delay: 0.4s; }
    
    .btn-primary,
    .btn-secondary {
        animation: fadeInUp 0.6s ease-out 0.5s forwards;
        opacity: 0;
        animation-delay: 0.7s;
    }
`;
document.head.appendChild(style);
