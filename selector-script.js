// Platform Selector Script
document.addEventListener('DOMContentLoaded', function() {
    initializePlatformSelector();
});

function initializePlatformSelector() {
    const platformCards = document.querySelectorAll('.platform-card');
    
    // Add click event listeners to platform cards
    platformCards.forEach(card => {
        card.addEventListener('click', handlePlatformSelection);
        card.addEventListener('keydown', handleKeyboardNavigation);
        
        // Add hover effects
        card.addEventListener('mouseenter', handleCardHover);
        card.addEventListener('mouseleave', handleCardLeave);
    });
    
    // Add keyboard navigation
    document.addEventListener('keydown', handleGlobalKeyboard);
    
    // Initialize animations
    initializeAnimations();
    
    // Add accessibility enhancements
    enhanceAccessibility();
    
    console.log('Platform selector initialized successfully');
}

function handlePlatformSelection(event) {
    const card = event.currentTarget;
    const platform = card.dataset.platform;
    
    // Add selection animation
    card.classList.add('selecting');
    
    // Navigate to the selected platform
    setTimeout(() => {
        navigateToPlatform(platform);
    }, 300);
}

function handleKeyboardNavigation(event) {
    if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        handlePlatformSelection(event);
    }
}

function handleGlobalKeyboard(event) {
    const platformCards = document.querySelectorAll('.platform-card');
    const currentFocus = document.activeElement;
    const currentIndex = Array.from(platformCards).indexOf(currentFocus);
    
    switch(event.key) {
        case 'ArrowRight':
        case 'ArrowDown':
            event.preventDefault();
            const nextIndex = (currentIndex + 1) % platformCards.length;
            platformCards[nextIndex].focus();
            break;
            
        case 'ArrowLeft':
        case 'ArrowUp':
            event.preventDefault();
            const prevIndex = currentIndex === 0 ? platformCards.length - 1 : currentIndex - 1;
            platformCards[prevIndex].focus();
            break;
            
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
            event.preventDefault();
            const numberIndex = parseInt(event.key) - 1;
            if (numberIndex < platformCards.length) {
                platformCards[numberIndex].focus();
                platformCards[numberIndex].click();
            }
            break;
    }
}

function handleCardHover(event) {
    const card = event.currentTarget;
    const preview = card.querySelector('.platform-preview');
    
    // Add dynamic hover effects based on platform
    const platform = card.dataset.platform;
    addPlatformSpecificEffects(card, platform);
    
    // Pause any ongoing animations
    preview.style.animationPlayState = 'paused';
}

function handleCardLeave(event) {
    const card = event.currentTarget;
    const preview = card.querySelector('.platform-preview');
    
    // Resume animations
    preview.style.animationPlayState = 'running';
    
    // Remove hover effects
    card.classList.remove('platform-hover');
}

function addPlatformSpecificEffects(card, platform) {
    card.classList.add('platform-hover');
    
    switch(platform) {
        case 'netflix':
            addNetflixEffects(card);
            break;
        case 'prime':
            addPrimeEffects(card);
            break;
        case 'linkedin':
            addLinkedInEffects(card);
            break;
        case 'instagram':
            addInstagramEffects(card);
            break;
        case 'tiktok':
            addTikTokEffects(card);
            break;
        case 'youtube':
            addYouTubeEffects(card);
            break;
    }
}

function addNetflixEffects(card) {
    const progressBars = card.querySelectorAll('.preview-row::after');
    // Animate progress bars
    card.style.setProperty('--netflix-glow', '0 0 20px rgba(229, 9, 20, 0.3)');
}

function addPrimeEffects(card) {
    const banner = card.querySelector('.preview-banner');
    if (banner) {
        banner.style.background = 'linear-gradient(135deg, #00A8E1 0%, #0099cc 50%, #0066cc 100%)';
    }
}

function addLinkedInEffects(card) {
    const avatar = card.querySelector('.profile-avatar');
    if (avatar) {
        avatar.style.background = 'linear-gradient(135deg, #0A66C2 0%, #004182 100%)';
    }
}

function addInstagramEffects(card) {
    const stories = card.querySelectorAll('.story-circle');
    stories.forEach((story, index) => {
        setTimeout(() => {
            story.style.transform = 'scale(1.1)';
            story.style.transition = 'transform 0.3s ease';
        }, index * 100);
    });
}

function addTikTokEffects(card) {
    const actionButtons = card.querySelectorAll('.action-button');
    actionButtons.forEach((button, index) => {
        setTimeout(() => {
            button.style.background = index % 2 === 0 ? '#fe2c55' : '#25f4ee';
            button.style.transform = 'scale(1.1)';
        }, index * 150);
    });
}

function addYouTubeEffects(card) {
    const player = card.querySelector('.preview-player');
    if (player) {
        player.style.background = 'linear-gradient(135deg, #FF0000 0%, #cc0000 100%)';
    }
}

function navigateToPlatform(platform) {
    // Show loading state
    showLoadingOverlay(platform);
    
    // Platform-specific navigation
    const navigationMap = {
        'netflix': 'media-hub.html',
        'prime': 'prime-portfolio.html',
        'linkedin': 'linkedin-portfolio.html',
        'instagram': 'instagram-portfolio.html',
        'tiktok': 'tiktok-portfolio.html',
        'youtube': 'youtube-portfolio.html'
    };
    
    const targetUrl = navigationMap[platform];
    
    if (targetUrl) {
        // Smooth transition with platform-specific styling
        setTimeout(() => {
            if (platform === 'netflix') {
                // Netflix already exists
                window.location.href = targetUrl;
            } else {
                // For other platforms, show coming soon or redirect to a placeholder
                showComingSoon(platform, targetUrl);
            }
        }, 800);
    } else {
        console.error('Invalid platform selection:', platform);
        hideLoadingOverlay();
    }
}

function showLoadingOverlay(platform) {
    const overlay = document.createElement('div');
    overlay.className = 'loading-overlay';
    overlay.innerHTML = `
        <div class="loading-content">
            <div class="loading-spinner ${platform}"></div>
            <h3>Launching ${getPlatformName(platform)}...</h3>
            <p>Preparing your portfolio experience</p>
        </div>
    `;
    
    document.body.appendChild(overlay);
    
    // Trigger animation
    setTimeout(() => {
        overlay.classList.add('active');
    }, 10);
}

function hideLoadingOverlay() {
    const overlay = document.querySelector('.loading-overlay');
    if (overlay) {
        overlay.classList.remove('active');
        setTimeout(() => {
            overlay.remove();
        }, 300);
    }
}

function showComingSoon(platform, targetUrl) {
    hideLoadingOverlay();
    
    const modal = document.createElement('div');
    modal.className = 'coming-soon-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>Coming Soon</h2>
                <button class="modal-close" aria-label="Close modal">&times;</button>
            </div>
            <div class="modal-body">
                <div class="platform-icon ${platform}">
                    ${getPlatformIcon(platform)}
                </div>
                <h3>${getPlatformName(platform)} Style Portfolio</h3>
                <p>This portfolio style is currently under development. For now, check out the Netflix-style portfolio!</p>
                <div class="modal-actions">
                    <button class="btn-primary" onclick="window.location.href='media-hub.html'">
                        View Netflix Style
                    </button>
                    <button class="btn-secondary" onclick="closeModal()">
                        Back to Selector
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add event listeners
    modal.querySelector('.modal-close').addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
    
    // Show modal
    setTimeout(() => {
        modal.classList.add('active');
    }, 10);
}

function closeModal() {
    const modal = document.querySelector('.coming-soon-modal');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.remove();
        }, 300);
    }
}

function getPlatformName(platform) {
    const names = {
        'netflix': 'Netflix',
        'prime': 'Amazon Prime',
        'linkedin': 'LinkedIn',
        'instagram': 'Instagram',
        'tiktok': 'TikTok',
        'youtube': 'YouTube'
    };
    return names[platform] || platform;
}

function getPlatformIcon(platform) {
    const icons = {
        'netflix': 'N',
        'prime': 'prime',
        'linkedin': 'in',
        'instagram': '📷',
        'tiktok': '🎵',
        'youtube': '▶'
    };
    return icons[platform] || '?';
}

function initializeAnimations() {
    // Stagger card animations
    const cards = document.querySelectorAll('.platform-card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });
    
    // Initialize preview animations
    initializePreviewAnimations();
}

function initializePreviewAnimations() {
    // Netflix progress bar animation
    const netflixCard = document.querySelector('[data-platform="netflix"]');
    if (netflixCard) {
        const progressRows = netflixCard.querySelectorAll('.preview-row');
        progressRows.forEach((row, index) => {
            row.style.setProperty('--progress-delay', `${index * 0.5}s`);
        });
    }
    
    // Instagram story pulse
    const instagramCard = document.querySelector('[data-platform="instagram"]');
    if (instagramCard) {
        const stories = instagramCard.querySelectorAll('.story-circle');
        stories.forEach((story, index) => {
            story.style.animationDelay = `${index * 0.2}s`;
        });
    }
    
    // TikTok action buttons pulse
    const tiktokCard = document.querySelector('[data-platform="tiktok"]');
    if (tiktokCard) {
        const buttons = tiktokCard.querySelectorAll('.action-button');
        buttons.forEach((button, index) => {
            button.style.animationDelay = `${index * 0.3}s`;
        });
    }
}

function enhanceAccessibility() {
    const cards = document.querySelectorAll('.platform-card');
    
    cards.forEach((card, index) => {
        // Add tabindex for keyboard navigation
        card.setAttribute('tabindex', '0');
        
        // Add aria-labels
        const platform = card.dataset.platform;
        const platformName = getPlatformName(platform);
        card.setAttribute('aria-label', `Select ${platformName} style portfolio (Press ${index + 1} or Enter)`);
        
        // Add role
        card.setAttribute('role', 'button');
    });
    
    // Add skip link
    if (!document.querySelector('.skip-link')) {
        const skipLink = document.createElement('a');
        skipLink.className = 'skip-link';
        skipLink.href = '#platform-grid';
        skipLink.textContent = 'Skip to platform selection';
        document.body.insertBefore(skipLink, document.body.firstChild);
    }
}

// Add CSS for loading overlay and modals
function addDynamicStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .loading-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        
        .loading-overlay.active {
            opacity: 1;
        }
        
        .loading-content {
            text-align: center;
            color: white;
        }
        
        .loading-spinner {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            margin: 0 auto 1rem;
            animation: spin 1s linear infinite;
        }
        
        .loading-spinner.netflix {
            border: 4px solid rgba(229, 9, 20, 0.3);
            border-top: 4px solid #E50914;
        }
        
        .loading-spinner.prime {
            border: 4px solid rgba(0, 168, 225, 0.3);
            border-top: 4px solid #00A8E1;
        }
        
        .loading-spinner.linkedin {
            border: 4px solid rgba(10, 102, 194, 0.3);
            border-top: 4px solid #0A66C2;
        }
        
        .loading-spinner.instagram {
            border: 4px solid rgba(228, 64, 95, 0.3);
            border-top: 4px solid #E4405F;
        }
        
        .loading-spinner.tiktok {
            border: 4px solid rgba(254, 44, 85, 0.3);
            border-top: 4px solid #fe2c55;
        }
        
        .loading-spinner.youtube {
            border: 4px solid rgba(255, 0, 0, 0.3);
            border-top: 4px solid #FF0000;
        }
        
        .coming-soon-modal {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1001;
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        
        .coming-soon-modal.active {
            opacity: 1;
        }
        
        .modal-content {
            background: white;
            border-radius: 20px;
            padding: 2rem;
            max-width: 500px;
            width: 90%;
            text-align: center;
            transform: scale(0.8);
            transition: transform 0.3s ease;
        }
        
        .coming-soon-modal.active .modal-content {
            transform: scale(1);
        }
        
        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1rem;
        }
        
        .modal-close {
            background: none;
            border: none;
            font-size: 2rem;
            cursor: pointer;
            color: #666;
            padding: 0;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .platform-icon {
            width: 80px;
            height: 80px;
            border-radius: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 2rem;
            font-weight: bold;
            color: white;
            margin: 0 auto 1rem;
        }
        
        .modal-actions {
            display: flex;
            gap: 1rem;
            justify-content: center;
            margin-top: 2rem;
        }
        
        .btn-primary, .btn-secondary {
            padding: 0.75rem 1.5rem;
            border: none;
            border-radius: 10px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .btn-primary {
            background: #E50914;
            color: white;
        }
        
        .btn-secondary {
            background: #f8f9fa;
            color: #333;
            border: 1px solid #e9ecef;
        }
        
        .skip-link {
            position: absolute;
            top: -40px;
            left: 6px;
            background: #000;
            color: white;
            padding: 8px;
            text-decoration: none;
            border-radius: 4px;
            z-index: 1000;
        }
        
        .skip-link:focus {
            top: 6px;
        }
        
        .platform-card.selecting {
            transform: scale(0.95);
            opacity: 0.8;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
}

// Initialize dynamic styles
addDynamicStyles();

// Export for potential external use
window.platformSelector = {
    navigateToPlatform,
    showComingSoon,
    closeModal
};
