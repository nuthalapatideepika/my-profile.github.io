// Prime Video Style Portfolio JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initializePrimePortfolio();
});

function initializePrimePortfolio() {
    // Initialize carousel functionality
    initializeCarousels();
    
    // Initialize header scroll effects
    initializeHeader();
    
    // Initialize hero actions
    initializeHeroActions();
    
    // Initialize search functionality
    initializeSearch();
    
    // Initialize skill level animations
    initializeSkillAnimations();
    
    console.log('Prime portfolio initialized successfully');
}

function initializeCarousels() {
    const carousels = document.querySelectorAll('.content-carousel');
    
    carousels.forEach(carousel => {
        const track = carousel.querySelector('.carousel-track');
        const prevBtn = carousel.querySelector('.carousel-btn.prev');
        const nextBtn = carousel.querySelector('.carousel-btn.next');
        
        if (!track || !prevBtn || !nextBtn) return;
        
        const scrollAmount = 320; // Adjust based on item width
        
        prevBtn.addEventListener('click', () => {
            track.scrollBy({
                left: -scrollAmount,
                behavior: 'smooth'
            });
        });
        
        nextBtn.addEventListener('click', () => {
            track.scrollBy({
                left: scrollAmount,
                behavior: 'smooth'
            });
        });
        
        // Add touch/swipe support for mobile
        let isDown = false;
        let startX;
        let scrollLeft;
        
        track.addEventListener('mousedown', (e) => {
            isDown = true;
            startX = e.pageX - track.offsetLeft;
            scrollLeft = track.scrollLeft;
        });
        
        track.addEventListener('mouseleave', () => {
            isDown = false;
        });
        
        track.addEventListener('mouseup', () => {
            isDown = false;
        });
        
        track.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - track.offsetLeft;
            const walk = (x - startX) * 2;
            track.scrollLeft = scrollLeft - walk;
        });
        
        // Update button visibility based on scroll position
        updateCarouselButtons(carousel, track);
        
        track.addEventListener('scroll', () => {
            updateCarouselButtons(carousel, track);
        });
    });
}

function updateCarouselButtons(carousel, track) {
    const prevBtn = carousel.querySelector('.carousel-btn.prev');
    const nextBtn = carousel.querySelector('.carousel-btn.next');
    
    // Hide previous button at start
    if (track.scrollLeft <= 0) {
        prevBtn.style.opacity = '0.5';
        prevBtn.style.pointerEvents = 'none';
    } else {
        prevBtn.style.opacity = '1';
        prevBtn.style.pointerEvents = 'auto';
    }
    
    // Hide next button at end
    if (track.scrollLeft >= (track.scrollWidth - track.clientWidth)) {
        nextBtn.style.opacity = '0.5';
        nextBtn.style.pointerEvents = 'none';
    } else {
        nextBtn.style.opacity = '1';
        nextBtn.style.pointerEvents = 'auto';
    }
}

function initializeHeader() {
    const header = document.querySelector('.prime-header');
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        // Change header background opacity based on scroll
        if (currentScrollY > 100) {
            header.style.background = 'rgba(15, 23, 30, 0.98)';
        } else {
            header.style.background = 'rgba(15, 23, 30, 0.95)';
        }
        
        lastScrollY = currentScrollY;
    });
}

function initializeHeroActions() {
    const primaryBtn = document.querySelector('.btn-primary');
    const secondaryBtn = document.querySelector('.btn-secondary');
    const watchlistBtn = document.querySelector('.btn-watchlist');
    
    if (primaryBtn) {
        primaryBtn.addEventListener('click', () => {
            // Scroll to featured projects
            const featuredSection = document.querySelector('.content-row');
            if (featuredSection) {
                featuredSection.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    }
    
    if (secondaryBtn) {
        secondaryBtn.addEventListener('click', () => {
            showMoreInfoModal();
        });
    }
    
    if (watchlistBtn) {
        watchlistBtn.addEventListener('click', (e) => {
            toggleWatchlist(e.target);
        });
    }
}

function initializeSearch() {
    const searchInput = document.querySelector('.search-input');
    const searchBtn = document.querySelector('.search-btn');
    
    if (searchInput && searchBtn) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                performSearch(searchInput.value);
            }
        });
        
        searchBtn.addEventListener('click', () => {
            performSearch(searchInput.value);
        });
        
        // Add search suggestions (optional enhancement)
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            if (query.length > 2) {
                showSearchSuggestions(query);
            } else {
                hideSearchSuggestions();
            }
        });
    }
}

function initializeSkillAnimations() {
    const skillItems = document.querySelectorAll('.skill-item');
    
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const levelBar = entry.target.querySelector('.level-bar');
                if (levelBar) {
                    // Trigger the CSS animation
                    levelBar.style.transform = 'scaleX(1)';
                    levelBar.style.transformOrigin = 'left';
                }
            }
        });
    }, observerOptions);
    
    skillItems.forEach(item => {
        const levelBar = item.querySelector('.level-bar');
        if (levelBar) {
            levelBar.style.transform = 'scaleX(0)';
            levelBar.style.transition = 'transform 1.5s ease-out';
        }
        skillObserver.observe(item);
    });
}

function showMoreInfoModal() {
    const modal = document.createElement('div');
    modal.className = 'info-modal';
    modal.innerHTML = `
        <div class="modal-overlay"></div>
        <div class="modal-content">
            <div class="modal-header">
                <h2>About Deepika Nuthalapati</h2>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <div class="info-section">
                    <h3>Education</h3>
                    <p>M.S. Computer Science, University of South Dakota (2024)</p>
                </div>
                <div class="info-section">
                    <h3>Research Focus</h3>
                    <p>Computer Vision & Applied AI with emphasis on:</p>
                    <ul>
                        <li>Multimodal spatiotemporal transformers</li>
                        <li>Remote sensing applications</li>
                        <li>Climate impact analysis</li>
                        <li>Medical imaging</li>
                    </ul>
                </div>
                <div class="info-section">
                    <h3>Affiliation</h3>
                    <p>Graduate Research Assistant at USD 2AI Lab</p>
                </div>
                <div class="info-section">
                    <h3>Contact</h3>
                    <p>Deepika.Nuthalapati@coyotes.usd.edu</p>
                    <p>📍 Vermillion, SD</p>
                </div>
                <div class="info-section">
                    <h3>🔗 Links</h3>
                    <div class="modal-links">
                        <a href="https://linkedin.com/in/deepika-nuthalapati" target="_blank" rel="noopener">LinkedIn</a>
                        <a href="https://github.com/nuthalapatideepika" target="_blank" rel="noopener">GitHub</a>
                        <a href="https://github.com/2ai-lab" target="_blank" rel="noopener">2AI Lab</a>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add event listeners
    modal.querySelector('.modal-close').addEventListener('click', closeModal);
    modal.querySelector('.modal-overlay').addEventListener('click', closeModal);
    
    // Show modal with animation
    setTimeout(() => {
        modal.classList.add('active');
    }, 10);
    
    function closeModal() {
        modal.classList.remove('active');
        setTimeout(() => {
            document.body.removeChild(modal);
        }, 300);
    }
}

function toggleWatchlist(button) {
    const isAdded = button.dataset.added === 'true';
    
    if (isAdded) {
        button.innerHTML = '<span class="plus-icon">+</span> Add to Favorites';
        button.dataset.added = 'false';
        showNotification('Removed from favorites');
    } else {
        button.innerHTML = '<span class="check-icon">✓</span> Added to Favorites';
        button.dataset.added = 'true';
        showNotification('Added to favorites');
    }
}

function performSearch(query) {
    if (!query.trim()) return;
    
    console.log('Searching for:', query);
    
    // Highlight matching content
    const contentItems = document.querySelectorAll('.content-item');
    let matches = 0;
    
    contentItems.forEach(item => {
        const title = item.querySelector('.item-title')?.textContent.toLowerCase();
        const description = item.querySelector('.item-description')?.textContent.toLowerCase();
        const tags = Array.from(item.querySelectorAll('.tag')).map(tag => tag.textContent.toLowerCase());
        
        const isMatch = title?.includes(query.toLowerCase()) ||
                       description?.includes(query.toLowerCase()) ||
                       tags.some(tag => tag.includes(query.toLowerCase()));
        
        if (isMatch) {
            item.style.transform = 'scale(1.05)';
            item.style.boxShadow = '0 0 20px rgba(0, 168, 225, 0.5)';
            matches++;
            
            // Scroll to first match
            if (matches === 1) {
                item.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'center'
                });
            }
        } else {
            item.style.transform = '';
            item.style.boxShadow = '';
        }
    });
    
    showNotification(`Found ${matches} result(s) for "${query}"`);
    
    // Reset highlights after 3 seconds
    setTimeout(() => {
        contentItems.forEach(item => {
            item.style.transform = '';
            item.style.boxShadow = '';
        });
    }, 3000);
}

function showSearchSuggestions(query) {
    // This would show search suggestions in a real implementation
    console.log('Showing suggestions for:', query);
}

function hideSearchSuggestions() {
    // Hide search suggestions
    console.log('Hiding search suggestions');
}

function showNotification(message) {
    // Remove existing notification
    const existing = document.querySelector('.prime-notification');
    if (existing) {
        existing.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = 'prime-notification';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Hide notification after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 3000);
}

// Add dynamic styles for modal and notifications
function addDynamicStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .info-modal {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 10000;
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        
        .info-modal.active {
            opacity: 1;
        }
        
        .modal-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.8);
        }
        
        .modal-content {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(0.9);
            background: #232f3e;
            border-radius: 8px;
            max-width: 600px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            transition: transform 0.3s ease;
        }
        
        .info-modal.active .modal-content {
            transform: translate(-50%, -50%) scale(1);
        }
        
        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1.5rem;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .modal-header h2 {
            color: #ffffff;
            margin: 0;
        }
        
        .modal-close {
            background: none;
            border: none;
            color: #ffffff;
            font-size: 2rem;
            cursor: pointer;
            padding: 0;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .modal-body {
            padding: 1.5rem;
        }
        
        .info-section {
            margin-bottom: 1.5rem;
        }
        
        .info-section h3 {
            color: #00a8e1;
            margin-bottom: 0.5rem;
            font-size: 1.1rem;
        }
        
        .info-section p {
            color: rgba(255, 255, 255, 0.9);
            margin-bottom: 0.5rem;
        }
        
        .info-section ul {
            list-style: none;
            padding-left: 1rem;
        }
        
        .info-section li {
            color: rgba(255, 255, 255, 0.8);
            margin-bottom: 0.25rem;
            position: relative;
        }
        
        .info-section li::before {
            content: '•';
            color: #00a8e1;
            position: absolute;
            left: -1rem;
        }
        
        .modal-links {
            display: flex;
            gap: 1rem;
            flex-wrap: wrap;
        }
        
        .modal-links a {
            color: #00a8e1;
            text-decoration: none;
            padding: 0.5rem 1rem;
            border: 1px solid #00a8e1;
            border-radius: 4px;
            transition: all 0.3s ease;
        }
        
        .modal-links a:hover {
            background: #00a8e1;
            color: #ffffff;
        }
        
        .prime-notification {
            position: fixed;
            top: 100px;
            right: 2rem;
            background: #00a8e1;
            color: #ffffff;
            padding: 1rem 1.5rem;
            border-radius: 4px;
            z-index: 9999;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }
        
        .prime-notification.show {
            transform: translateX(0);
        }
    `;
    document.head.appendChild(style);
}

// Initialize dynamic styles
addDynamicStyles();
