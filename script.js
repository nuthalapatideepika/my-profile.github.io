// Portfolio JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Header scroll effect
    const header = document.querySelector('.main-header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Smooth navigation
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            // Smooth scroll to section
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Update active nav link on scroll
    const sections = document.querySelectorAll('section[id]');
    
    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY + 120;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => link.classList.remove('active'));
                if (navLink) {
                    navLink.classList.add('active');
                }
            }
        });
    });

    // Hero buttons
    const playBtn = document.querySelector('.btn-play');
    const infoBtn = document.querySelector('.btn-info');
    
    if (playBtn) {
        playBtn.addEventListener('click', () => {
            document.querySelector('#projects').scrollIntoView({
                behavior: 'smooth'
            });
        });
    }
    
    if (infoBtn) {
        infoBtn.addEventListener('click', () => {
            document.querySelector('#summary').scrollIntoView({
                behavior: 'smooth'
            });
        });
    }

    // Card hover effects
    const portfolioCards = document.querySelectorAll('.netflix-card');
    
    portfolioCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            // Scale down other cards in the same row
            const row = card.closest('.content-slider');
            if (row) {
                const siblings = row.querySelectorAll('.netflix-card');
                siblings.forEach(sibling => {
                    if (sibling !== card) {
                        sibling.style.transform = 'scale(0.9)';
                        sibling.style.opacity = '0.5';
                    }
                });
            }
        });
        
        card.addEventListener('mouseleave', () => {
            // Reset all cards in the row
            const row = card.closest('.content-slider');
            if (row) {
                const siblings = row.querySelectorAll('.netflix-card');
                siblings.forEach(sibling => {
                    sibling.style.transform = 'scale(1)';
                    sibling.style.opacity = '1';
                });
            }
        });
    });

    // Card button interactions and progress tracking
    const cardButtons = document.querySelectorAll('.control-btn');
    const netflixCardsWithProgress = document.querySelectorAll('.netflix-card');
    
    // Progress tracking system
    const progressData = new Map();
    
    // Initialize progress for each card
    const portfolioCardsWithProgress = document.querySelectorAll('.netflix-card');
    
    // Initialize progress for each card
    portfolioCardsWithProgress.forEach((card, index) => {
        const cardId = `card-${index}`;
        card.setAttribute('data-card-id', cardId);
        
        // Initialize progress data
        progressData.set(cardId, {
            viewed: false,
            progress: 0,
            completed: false,
            lastPosition: 0
        });
        
        // Add click handler to the entire card
        card.addEventListener('click', (e) => {
            if (!e.target.closest('.control-btn') && !e.target.closest('.video-progress')) {
                startCardProgress(cardId, card);
            }
        });
        
        // Add progress bar click handler for seeking
        const progressBar = card.querySelector('.video-progress');
        if (progressBar) {
            progressBar.addEventListener('click', (e) => {
                e.stopPropagation();
                seekToPosition(cardId, card, e);
            });
            
            // Add hover preview on progress bar
            progressBar.addEventListener('mousemove', (e) => {
                showProgressPreview(card, e);
            });
            
            progressBar.addEventListener('mouseleave', () => {
                hideProgressPreview(card);
            });
        }
    });
    
    // Function to seek to specific position on progress bar
    function seekToPosition(cardId, cardElement, event) {
        const progressContainer = event.currentTarget;
        const rect = progressContainer.getBoundingClientRect();
        const clickPosition = event.clientX - rect.left;
        const newProgress = (clickPosition / rect.width) * 100;
        
        const data = progressData.get(cardId);
        const progressBar = cardElement.querySelector('.progress-bar');
        
        // Update progress
        data.progress = Math.min(Math.max(newProgress, 0), 100);
        data.lastPosition = data.progress;
        progressBar.style.width = `${data.progress}%`;
        
        // Mark as viewed and start from new position
        data.viewed = true;
        
        // Add visual feedback
        cardElement.classList.add('currently-viewing');
        portfolioCardsWithProgress.forEach(otherCard => {
            if (otherCard !== cardElement) {
                otherCard.classList.remove('currently-viewing');
            }
        });
        
        // Continue from new position if not completed
        if (data.progress < 100) {
            animateProgress(cardId, cardElement);
        } else {
            completeCardProgress(cardId, cardElement);
        }
        
        showNotification(`⏩ Seeking to ${Math.round(data.progress)}%`);
    }
    
    // Function to show progress preview on hover
    function showProgressPreview(cardElement, event) {
        const progressContainer = event.currentTarget;
        const rect = progressContainer.getBoundingClientRect();
        const hoverPosition = event.clientX - rect.left;
        const hoverProgress = (hoverPosition / rect.width) * 100;
        
        // Remove existing preview
        const existingPreview = cardElement.querySelector('.progress-preview');
        if (existingPreview) existingPreview.remove();
        
        // Create preview indicator
        const preview = document.createElement('div');
        preview.className = 'progress-preview';
        preview.style.cssText = `
            position: absolute;
            top: -30px;
            left: ${hoverPosition - 25}px;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            pointer-events: none;
            z-index: 10;
        `;
        preview.textContent = `${Math.round(hoverProgress)}%`;
        
        progressContainer.appendChild(preview);
    }
    
    // Function to hide progress preview
    function hideProgressPreview(cardElement) {
        const preview = cardElement.querySelector('.progress-preview');
        if (preview) preview.remove();
    }
    
    // Function to start/update card progress
    function startCardProgress(cardId, cardElement) {
        const progressBar = cardElement.querySelector('.progress-bar');
        const data = progressData.get(cardId);
        
        if (!data.viewed) {
            data.viewed = true;
            data.progress = 0;
            
            // Start progress animation
            animateProgress(cardId, cardElement);
            
            // Mark as currently viewing
            cardElement.classList.add('currently-viewing');
            
            // Remove currently viewing from other cards
            portfolioCardsWithProgress.forEach(otherCard => {
                if (otherCard !== cardElement) {
                    otherCard.classList.remove('currently-viewing');
                }
            });
            
            showNotification(`Started viewing ${cardElement.querySelector('h3').textContent}`);
        } else if (!data.completed) {
            // Resume from last position
            continueProgress(cardId, cardElement);
            cardElement.classList.add('currently-viewing');
            showNotification(`▶ Resuming ${cardElement.querySelector('h3').textContent}`);
        } else {
            // Already completed, show full progress
            showNotification(`✅ ${cardElement.querySelector('h3').textContent} - Already viewed`);
        }
    }
    
    // Function to animate progress
    function animateProgress(cardId, cardElement) {
        const progressBar = cardElement.querySelector('.progress-bar');
        const data = progressData.get(cardId);
        
        const progressInterval = setInterval(() => {
            if (cardElement.classList.contains('currently-viewing') && data.progress < 100) {
                data.progress += 0.5; // Adjust speed as needed
                data.lastPosition = data.progress;
                progressBar.style.width = `${data.progress}%`;
                
                // Add visual feedback for progress milestones
                if (data.progress >= 25 && data.progress < 26) {
                    cardElement.classList.add('quarter-viewed');
                }
                if (data.progress >= 50 && data.progress < 51) {
                    cardElement.classList.add('half-viewed');
                }
                if (data.progress >= 75 && data.progress < 76) {
                    cardElement.classList.add('three-quarter-viewed');
                }
                
                // Complete when reaching 100%
                if (data.progress >= 100) {
                    completeCardProgress(cardId, cardElement);
                    clearInterval(progressInterval);
                }
            } else if (!cardElement.classList.contains('currently-viewing')) {
                // Pause progress when not currently viewing
                clearInterval(progressInterval);
            }
        }, 50); // Update every 50ms for smooth animation
        
        // Store interval for cleanup
        data.progressInterval = progressInterval;
    }
    
    // Function to continue progress from last position
    function continueProgress(cardId, cardElement) {
        const data = progressData.get(cardId);
        const progressBar = cardElement.querySelector('.progress-bar');
        
        // Set progress bar to last position
        progressBar.style.width = `${data.lastPosition}%`;
        data.progress = data.lastPosition;
        
        // Continue animation
        animateProgress(cardId, cardElement);
    }
    
    // Function to complete card progress
    function completeCardProgress(cardId, cardElement) {
        const data = progressData.get(cardId);
        const progressBar = cardElement.querySelector('.progress-bar');
        
        data.completed = true;
        data.progress = 100;
        progressBar.style.width = '100%';
        
        // Add completed visual state
        cardElement.classList.add('completed');
        cardElement.classList.remove('currently-viewing');
        
        // Add checkmark or completion indicator
        const completionBadge = document.createElement('div');
        completionBadge.className = 'completion-badge';
        completionBadge.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
            </svg>
        `;
        
        // Remove existing badge if present
        const existingBadge = cardElement.querySelector('.completion-badge');
        if (existingBadge) existingBadge.remove();
        
        cardElement.querySelector('.card-media').appendChild(completionBadge);
        
        showNotification(`🎉 Completed: ${cardElement.querySelector('h3').textContent}`);
    }
    
    // Enhanced button interactions
    cardButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            
            const card = button.closest('.netflix-card');
            const cardId = card.getAttribute('data-card-id');
            
            if (button.classList.contains('play')) {
                // Start progress when play is clicked
                startCardProgress(cardId, card);
                showNotification('▶ Playing content...');
            } else if (button.classList.contains('add')) {
                button.style.background = 'rgba(229, 9, 20, 0.8)';
                button.innerHTML = `
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                    </svg>
                `;
                showNotification('✓ Added to My List');
            } else if (button.classList.contains('like')) {
                button.style.background = 'rgba(229, 9, 20, 0.8)';
                showNotification('👍 Liked!');
            }
            
            // Add ripple effect
            addRippleEffect(button);
        });
    });

    // Search and notification button interactions
    const searchBtn = document.querySelector('.search-icon');
    const notificationBtn = document.querySelector('.notifications-icon');
    const profileDropdown = document.querySelector('.profile-menu');
    
    if (searchBtn) {
        searchBtn.addEventListener('click', () => {
            showSearchModal();
        });
    }
    
    if (notificationBtn) {
        notificationBtn.addEventListener('click', () => {
            showNotification('🔔 No new notifications');
        });
    }
    
    if (profileDropdown) {
        profileDropdown.addEventListener('click', () => {
            showNotification('👤 Profile menu');
        });
    }

    // Experience card interactions
    const experienceCards = document.querySelectorAll('.experience-card');
    
    experienceCards.forEach(card => {
        card.addEventListener('click', () => {
            experienceCards.forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            const companyName = card.querySelector('h4').textContent;
            showNotification(`${companyName} experience selected`);
        });
    });

    // Contact method interactions
    const contactMethods = document.querySelectorAll('.contact-method');
    
    contactMethods.forEach(method => {
        method.addEventListener('click', (e) => {
            const href = method.getAttribute('href');
            
            if (href.startsWith('mailto:')) {
                showNotification('📧 Opening email client...');
            } else if (href.includes('linkedin')) {
                showNotification('Opening LinkedIn profile...');
            } else if (href.includes('github')) {
                showNotification('Opening GitHub...');
            } else if (href.startsWith('tel:')) {
                showNotification('Ready to call...');
            }
            
            addRippleEffect(method);
        });
    });

    // Horizontal scrolling with mouse wheel for card rows
    const cardRows = document.querySelectorAll('.content-slider');
    
    cardRows.forEach(row => {
        row.addEventListener('wheel', (e) => {
            if (e.deltaY !== 0) {
                e.preventDefault();
                row.scrollLeft += e.deltaY;
            }
        });
        
        // Touch scrolling support
        let isDown = false;
        let startX;
        let scrollLeft;
        
        row.addEventListener('mousedown', (e) => {
            isDown = true;
            row.classList.add('active');
            startX = e.pageX - row.offsetLeft;
            scrollLeft = row.scrollLeft;
        });
        
        row.addEventListener('mouseleave', () => {
            isDown = false;
            row.classList.remove('active');
        });
        
        row.addEventListener('mouseup', () => {
            isDown = false;
            row.classList.remove('active');
        });
        
        row.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - row.offsetLeft;
            const walk = (x - startX) * 2;
            row.scrollLeft = scrollLeft - walk;
        });
    });

    // Skill item hover effects
    const skillItems = document.querySelectorAll('.skill-item');
    
    skillItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            const skillName = item.querySelector('span').textContent;
            item.setAttribute('title', `Click to learn more about ${skillName}`);
        });
        
        item.addEventListener('click', () => {
            const skillName = item.querySelector('span').textContent;
            showNotification(`💡 ${skillName} - View projects using this technology`);
        });
    });

    // Netflix-style notification system
    function showNotification(message, duration = 3000) {
        // Remove existing notification
        const existing = document.querySelector('.netflix-notification');
        if (existing) {
            existing.remove();
        }
        
        const notification = document.createElement('div');
        notification.className = 'netflix-notification';
        notification.textContent = message;
        
        // Style the notification
        Object.assign(notification.style, {
            position: 'fixed',
            top: '100px',
            right: '30px',
            background: 'rgba(0, 0, 0, 0.9)',
            color: '#fff',
            padding: '15px 20px',
            borderRadius: '4px',
            borderLeft: '4px solid #E50914',
            zIndex: '9999',
            opacity: '0',
            transform: 'translateX(100px)',
            transition: 'all 0.3s ease',
            boxShadow: '0 8px 25px rgba(0,0,0,0.8)',
            fontWeight: '400',
            fontSize: '14px',
            maxWidth: '300px',
            backdropFilter: 'blur(10px)'
        });
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Animate out
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100px)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, duration);
    }

    // Ripple effect function
    function addRippleEffect(element) {
        const ripple = document.createElement('span');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = rect.width / 2 - size / 2;
        const y = rect.height / 2 - size / 2;
        
        Object.assign(ripple.style, {
            position: 'absolute',
            width: `${size}px`,
            height: `${size}px`,
            left: `${x}px`,
            top: `${y}px`,
            background: 'rgba(255,255,255,0.3)',
            borderRadius: '50%',
            transform: 'scale(0)',
            animation: 'ripple 0.6s ease-out',
            pointerEvents: 'none'
        });
        
        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(ripple);
        
        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        }, 600);
    }

    // Auto-scroll rows occasionally (Netflix-like behavior)
    function autoScrollRows() {
        const rows = document.querySelectorAll('.content-slider');
        
        setInterval(() => {
            rows.forEach((row, index) => {
                if (Math.random() > 0.7) { // 30% chance
                    const scrollAmount = 200;
                    const currentScroll = row.scrollLeft;
                    const maxScroll = row.scrollWidth - row.clientWidth;
                    
                    if (currentScroll >= maxScroll) {
                        row.scrollTo({ left: 0, behavior: 'smooth' });
                    } else {
                        row.scrollBy({ left: scrollAmount, behavior: 'smooth' });
                    }
                }
            });
        }, 15000); // Every 15 seconds
    }

    // Initialize auto-scroll
    autoScrollRows();

    // Add CSS for ripple animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            from { transform: scale(0); opacity: 1; }
            to { transform: scale(4); opacity: 0; }
        }
        
        .experience-card.selected {
            border-left: 4px solid #E50914;
            background-color: rgba(229, 9, 20, 0.1);
            box-shadow: 0 0 20px rgba(229, 9, 20, 0.3);
        }
        
        .row-content.active,
        .experience-timeline.active {
            cursor: grabbing;
        }
        
        .row-content,
        .experience-timeline {
            cursor: grab;
        }
    `;
    document.head.appendChild(style);

    // Welcome notification
    setTimeout(() => {
        showNotification(`Welcome to Deepika's Portfolio!`, 4000);
    }, 2000);
});

// Intersection Observer for animation triggers
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animationDelay = Math.random() * 0.5 + 's';
            entry.target.classList.add('animate-in');
        }
    });
}, observerOptions);

// Observe all cards and sections
document.addEventListener('DOMContentLoaded', () => {
    const elementsToAnimate = document.querySelectorAll('.netflix-card, .skill-item, .experience-card, .contact-method');
    elementsToAnimate.forEach(el => observer.observe(el));
});

// Keyboard navigation support
document.addEventListener('keydown', (e) => {
    const currentCard = document.querySelector('.netflix-card.currently-viewing');
    
    if (e.key === 'Escape') {
        // Pause all progress and close any open modals
        const notification = document.querySelector('.netflix-notification');
        if (notification) {
            notification.remove();
        }
        
        // Pause current viewing
        if (currentCard) {
            currentCard.classList.remove('currently-viewing');
            showNotification('⏸ Paused');
        }
    }
    
    if (e.key === '/') {
        e.preventDefault();
        // Focus search (if implemented)
        const searchBtn = document.querySelector('.search-icon');
        if (searchBtn) {
            searchBtn.click();
        }
    }
    
    // Progress control with arrow keys
    if (currentCard) {
        const cardId = currentCard.getAttribute('data-card-id');
        const data = progressData.get(cardId);
        const progressBar = currentCard.querySelector('.progress-bar');
        
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            // Rewind 10%
            data.progress = Math.max(data.progress - 10, 0);
            data.lastPosition = data.progress;
            progressBar.style.width = `${data.progress}%`;
            showNotification('⏪ Rewind 10%');
        }
        
        if (e.key === 'ArrowRight') {
            e.preventDefault();
            // Fast forward 10%
            data.progress = Math.min(data.progress + 10, 100);
            data.lastPosition = data.progress;
            progressBar.style.width = `${data.progress}%`;
            
            if (data.progress >= 100) {
                completeCardProgress(cardId, currentCard);
            }
            showNotification('⏩ Fast forward 10%');
        }
        
        if (e.key === ' ') {
            e.preventDefault();
            // Toggle pause/play
            if (currentCard.classList.contains('currently-viewing')) {
                currentCard.classList.remove('currently-viewing');
                showNotification('⏸ Paused');
            } else {
                currentCard.classList.add('currently-viewing');
                if (!data.completed) {
                    animateProgress(cardId, currentCard);
                }
                showNotification('▶ Resumed');
            }
        }
    }
});

// Search functionality for portfolio content
function showSearchModal() {
    let searchModal = document.querySelector('.search-modal');
    
    if (!searchModal) {
        searchModal = document.createElement('div');
        searchModal.className = 'search-modal';
        searchModal.innerHTML = `
            <div class="search-container">
                <div class="search-header">
                    <h2>Search Portfolio Content</h2>
                    <button class="close-search">✕</button>
                </div>
                <div class="search-input-container">
                    <input type="text" class="search-input" placeholder="Search skills, experience, education...">
                    <button class="search-btn">Search</button>
                </div>
                <div class="search-results">
                    <p class="search-placeholder">Start typing to search through Professional Summary, Technical Skills, Experience, and Education...</p>
                </div>
            </div>
        `;
        document.body.appendChild(searchModal);

        // Add event listeners
        const closeBtn = searchModal.querySelector('.close-search');
        const searchInput = searchModal.querySelector('.search-input');
        const searchButton = searchModal.querySelector('.search-btn');

        closeBtn.addEventListener('click', () => {
            searchModal.style.display = 'none';
        });

        searchModal.addEventListener('click', (e) => {
            if (e.target === searchModal) {
                searchModal.style.display = 'none';
            }
        });

        searchInput.addEventListener('input', (e) => {
            performPortfolioSearch(e.target.value);
        });

        searchButton.addEventListener('click', () => {
            performPortfolioSearch(searchInput.value);
        });

        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                performPortfolioSearch(searchInput.value);
            }
        });
    }
    
    searchModal.style.display = 'flex';
    const searchInput = searchModal.querySelector('.search-input');
    searchInput.focus();
}

function performPortfolioSearch(query) {
    const resultsContainer = document.querySelector('.search-results');
    const portfolioData = getPortfolioContent();
    
    if (!query.trim()) {
        resultsContainer.innerHTML = '<p class="search-placeholder">Start typing to search through Professional Summary, Technical Skills, Experience, and Education...</p>';
        return;
    }

    const results = searchPortfolioContent(portfolioData, query.toLowerCase());
    
    if (results.length === 0) {
        resultsContainer.innerHTML = '<p class="no-results">No matching content found in your portfolio.</p>';
    } else {
        resultsContainer.innerHTML = results.map(result => `
            <div class="search-result-item">
                <h4>${result.section}</h4>
                <p>${result.content}</p>
            </div>
        `).join('');
    }
}

function getPortfolioContent() {
    return {
        'Professional Summary': `Senior Software Developer with 5+ years of experience in full-stack development. 
                               Expertise in JavaScript, React, Node.js, and cloud technologies. 
                               Passionate about creating scalable web applications and user-centric solutions.`,
        
        'Technical Skills': `JavaScript, TypeScript, React, Angular, Vue.js, Node.js, Express.js, 
                           Python, Django, FastAPI, AWS, Azure, Docker, Kubernetes, MongoDB, PostgreSQL, 
                           Git, CI/CD, Microservices, REST APIs, GraphQL, Machine Learning, Data Analysis`,
        
        'Professional Experience': `Software Developer at TechCorp (2020-Present): Led development of 
                                  e-commerce platform serving 100K+ users. Implemented microservices architecture 
                                  resulting in 40% performance improvement. Frontend Developer at StartupXYZ 
                                  (2018-2020): Built responsive web applications using React and Redux.`,
        
        'Education': `Master of Science in Computer Science, State University (2018). 
                     Bachelor of Science in Information Technology, Tech College (2016). 
                     Relevant coursework: Data Structures, Algorithms, Software Engineering, Database Systems.`,
        
        'Certifications': `AWS Certified Solutions Architect, Google Cloud Professional Developer, 
                          Microsoft Azure Fundamentals, Certified Kubernetes Administrator, 
                          React Developer Certification, Full Stack JavaScript Developer`
    };
}

function searchPortfolioContent(portfolioData, query) {
    const results = [];
    
    Object.keys(portfolioData).forEach(section => {
        const content = portfolioData[section].toLowerCase();
        if (content.includes(query)) {
            // Find the relevant snippet around the match
            const index = content.indexOf(query);
            const start = Math.max(0, index - 50);
            const end = Math.min(content.length, index + query.length + 50);
            let snippet = portfolioData[section].substring(start, end);
            
            // Highlight the search term
            const regex = new RegExp(`(${query})`, 'gi');
            snippet = snippet.replace(regex, '<mark>$1</mark>');
            
            if (start > 0) snippet = '...' + snippet;
            if (end < content.length) snippet = snippet + '...';
            
            results.push({
                section: section,
                content: snippet
            });
        }
    });
    
    return results;
}