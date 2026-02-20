// Netflix Clone JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Navigation scroll effect
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Movie row navigation
    const movieRows = document.querySelectorAll('.movie-row');
    const prevButtons = document.querySelectorAll('.row-nav.prev');
    const nextButtons = document.querySelectorAll('.row-nav.next');

    // Add scroll functionality to movie rows
    movieRows.forEach((row, index) => {
        const prevBtn = prevButtons[index];
        const nextBtn = nextButtons[index];
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                row.scrollBy({
                    left: -300,
                    behavior: 'smooth'
                });
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                row.scrollBy({
                    left: 300,
                    behavior: 'smooth'
                });
            });
        }

        // Show/hide navigation buttons based on scroll position
        row.addEventListener('scroll', () => {
            const scrollLeft = row.scrollLeft;
            const maxScroll = row.scrollWidth - row.clientWidth;
            
            if (prevBtn) {
                prevBtn.style.opacity = scrollLeft > 0 ? '1' : '0';
            }
            
            if (nextBtn) {
                nextBtn.style.opacity = scrollLeft < maxScroll ? '1' : '0';
            }
        });
        
        // Initial button state
        if (prevBtn) prevBtn.style.opacity = '0';
    });

    // Movie card hover effects
    const movieCards = document.querySelectorAll('.movie-card');
    
    movieCards.forEach(card => {
        let hoverTimeout;
        
        card.addEventListener('mouseenter', () => {
            clearTimeout(hoverTimeout);
            
            // Add hover effect after small delay
            hoverTimeout = setTimeout(() => {
                card.style.zIndex = '100';
            }, 300);
        });
        
        card.addEventListener('mouseleave', () => {
            clearTimeout(hoverTimeout);
            
            // Remove hover effect
            setTimeout(() => {
                card.style.zIndex = '1';
            }, 300);
        });
    });

    // Play button functionality
    const playButtons = document.querySelectorAll('.btn-play, .play-btn');
    
    playButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Add ripple effect
            const ripple = document.createElement('span');
            const rect = button.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
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
            
            button.style.position = 'relative';
            button.style.overflow = 'hidden';
            button.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
            
            // Simulate play action
            console.log('Playing content...');
            showNotification('Playing content...');
        });
    });

    // Add to list functionality
    const addButtons = document.querySelectorAll('.control-btn:not(.play-btn)');
    
    addButtons.forEach(button => {
        if (button.querySelector('.fa-plus')) {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                const icon = button.querySelector('i');
                
                if (icon.classList.contains('fa-plus')) {
                    icon.classList.remove('fa-plus');
                    icon.classList.add('fa-check');
                    button.style.background = '#46d369';
                    showNotification('Added to My List');
                } else {
                    icon.classList.remove('fa-check');
                    icon.classList.add('fa-plus');
                    button.style.background = 'rgba(255,255,255,0.2)';
                    showNotification('Removed from My List');
                }
            });
        }
    });

    // Like/Dislike functionality
    const likeButtons = document.querySelectorAll('.fa-thumbs-up');
    const dislikeButtons = document.querySelectorAll('.fa-thumbs-down');
    
    likeButtons.forEach(button => {
        button.parentElement.addEventListener('click', (e) => {
            e.stopPropagation();
            const btn = button.parentElement;
            
            if (btn.classList.contains('liked')) {
                btn.classList.remove('liked');
                btn.style.background = 'rgba(255,255,255,0.2)';
                showNotification('Like removed');
            } else {
                btn.classList.add('liked');
                btn.style.background = '#46d369';
                showNotification('Liked');
                
                // Remove dislike if present
                const dislikeBtn = btn.parentElement.querySelector('.fa-thumbs-down').parentElement;
                dislikeBtn.classList.remove('disliked');
                dislikeBtn.style.background = 'rgba(255,255,255,0.2)';
            }
        });
    });
    
    dislikeButtons.forEach(button => {
        button.parentElement.addEventListener('click', (e) => {
            e.stopPropagation();
            const btn = button.parentElement;
            
            if (btn.classList.contains('disliked')) {
                btn.classList.remove('disliked');
                btn.style.background = 'rgba(255,255,255,0.2)';
                showNotification('Dislike removed');
            } else {
                btn.classList.add('disliked');
                btn.style.background = '#e50914';
                showNotification('Disliked');
                
                // Remove like if present
                const likeBtn = btn.parentElement.querySelector('.fa-thumbs-up').parentElement;
                likeBtn.classList.remove('liked');
                likeBtn.style.background = 'rgba(255,255,255,0.2)';
            }
        });
    });

    // More Info functionality
    const infoButtons = document.querySelectorAll('.btn-info');
    
    infoButtons.forEach(button => {
        button.addEventListener('click', () => {
            showNotification('More Info clicked');
            console.log('Showing more info...');
        });
    });

    // Search functionality
    const searchIcon = document.querySelector('.fa-search');
    
    if (searchIcon) {
        searchIcon.addEventListener('click', () => {
            // Create search overlay
            const searchOverlay = document.createElement('div');
            searchOverlay.className = 'search-overlay';
            searchOverlay.innerHTML = `
                <div class="search-container">
                    <input type="text" placeholder="Search for shows, movies..." class="search-input">
                    <button class="search-close">&times;</button>
                </div>
            `;
            
            searchOverlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0,0,0,0.9);
                z-index: 2000;
                display: flex;
                align-items: flex-start;
                justify-content: center;
                padding-top: 100px;
            `;
            
            const searchContainer = searchOverlay.querySelector('.search-container');
            searchContainer.style.cssText = `
                display: flex;
                align-items: center;
                gap: 20px;
                max-width: 600px;
                width: 100%;
                padding: 0 20px;
            `;
            
            const searchInput = searchOverlay.querySelector('.search-input');
            searchInput.style.cssText = `
                flex: 1;
                padding: 15px 20px;
                border: none;
                border-radius: 4px;
                background: rgba(255,255,255,0.1);
                color: white;
                font-size: 16px;
                outline: none;
            `;
            
            const searchClose = searchOverlay.querySelector('.search-close');
            searchClose.style.cssText = `
                background: none;
                border: none;
                color: white;
                font-size: 30px;
                cursor: pointer;
                padding: 10px;
            `;
            
            document.body.appendChild(searchOverlay);
            searchInput.focus();
            
            // Close search
            searchClose.addEventListener('click', () => {
                searchOverlay.remove();
            });
            
            // Close on escape
            document.addEventListener('keydown', function escapeHandler(e) {
                if (e.key === 'Escape') {
                    searchOverlay.remove();
                    document.removeEventListener('keydown', escapeHandler);
                }
            });
            
            // Close on overlay click
            searchOverlay.addEventListener('click', (e) => {
                if (e.target === searchOverlay) {
                    searchOverlay.remove();
                }
            });
        });
    }

    // Profile dropdown
    const profileDropdown = document.querySelector('.profile-dropdown');
    
    if (profileDropdown) {
        profileDropdown.addEventListener('click', () => {
            showNotification('Profile menu clicked');
        });
    }

    // Notification system
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: #333;
            color: white;
            padding: 15px 20px;
            border-radius: 4px;
            z-index: 3000;
            opacity: 0;
            transform: translateX(100px);
            transition: all 0.3s ease;
            box-shadow: 0 4px 12px rgba(0,0,0,0.5);
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100px)';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }

    // Lazy loading for movie images
    const movieImages = document.querySelectorAll('.movie-card img');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.style.opacity = '0';
                img.style.transition = 'opacity 0.3s ease';
                
                img.onload = () => {
                    img.style.opacity = '1';
                };
                
                imageObserver.unobserve(img);
            }
        });
    });
    
    movieImages.forEach(img => {
        imageObserver.observe(img);
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        const focusedElement = document.activeElement;
        
        // Navigate movie cards with arrow keys
        if (focusedElement && focusedElement.classList.contains('movie-card')) {
            const movieRow = focusedElement.parentElement;
            const cards = Array.from(movieRow.querySelectorAll('.movie-card'));
            const currentIndex = cards.indexOf(focusedElement);
            
            if (e.key === 'ArrowRight' && currentIndex < cards.length - 1) {
                e.preventDefault();
                cards[currentIndex + 1].focus();
            } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
                e.preventDefault();
                cards[currentIndex - 1].focus();
            }
        }
    });

    // Make movie cards focusable
    movieCards.forEach(card => {
        card.setAttribute('tabindex', '0');
        
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const playBtn = card.querySelector('.play-btn');
                if (playBtn) {
                    playBtn.click();
                }
            }
        });
    });
});

// CSS injection for ripple effect
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
    
    .search-input::placeholder {
        color: rgba(255,255,255,0.7);
    }
`;
document.head.appendChild(style);
