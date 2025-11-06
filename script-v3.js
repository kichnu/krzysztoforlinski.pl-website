// ===================================
// STATE MANAGEMENT
// ===================================
const state = {
    currentView: 'home',
    currentMenu: 'home',
    currentSection: null,
    currentIndex: 0,
    sectionItems: [],
    previousView: null
};

// Section data - każda sekcja ma swoje kafelki
const sectionsData = {
    'akwarystyka': [
        { id: 1, title: 'Akwarium 300L' },
        { id: 2, title: 'Akwarium morskie' },
        { id: 3, title: 'Biotop amazoński' }
    ],
    'aplikacje': [
        { id: 1, title: 'Task Manager' },
        { id: 2, title: 'Weather App' },
        { id: 3, title: 'E-commerce' },
        { id: 4, title: 'Chat App' },
        { id: 5, title: 'Portfolio CMS' },
        { id: 6, title: 'Analytics Dashboard' }
    ],
    'rower': [
        { id: 1, title: 'Projekt konstrukcji' },
        { id: 2, title: 'Proces budowy' }
    ],
    'inne': [
        { id: 1, title: 'Fotografia' },
        { id: 2, title: 'Grafika 3D' },
        { id: 3, title: 'DIY projekty' },
        { id: 4, title: 'Podróże' }
    ]
};

// ===================================
// DOM ELEMENTS
// ===================================
const navLinks = document.querySelectorAll('.nav-link');
const contentViews = document.querySelectorAll('.content-view');

// Navigation buttons
const btnPrev = document.getElementById('btn-prev');
const btnNext = document.getElementById('btn-next');
const btnBack = document.getElementById('btn-back');

// Breadcrumb
const breadcrumbSection = document.getElementById('breadcrumb-section');
const breadcrumbItem = document.getElementById('breadcrumb-item');

// ===================================
// INIT
// ===================================
function init() {
    console.log('🚀 Inicjalizacja strony v3...');
    
    // Show home by default
    showView('view-home');
    
    // Menu navigation
    navLinks.forEach(link => {
        link.addEventListener('click', handleMenuClick);
    });
    
    // Navigation buttons
    if (btnPrev) btnPrev.addEventListener('click', navigatePrev);
    if (btnNext) btnNext.addEventListener('click', navigateNext);
    if (btnBack) btnBack.addEventListener('click', navigateBack);
    
    // Submenu items - używamy delegacji zdarzeń
    document.addEventListener('click', handleSubmenuClick);
    
    // Keyboard navigation
    initKeyboardNavigation();
    
    console.log('✅ Strona gotowa!');
    console.log('💡 SKRÓTY:');
    console.log('   ESC - Wróć do submenu');
    console.log('   ← - Poprzedni kafelek');
    console.log('   → - Następny kafelek');
}

// ===================================
// VIEW SWITCHING
// ===================================
function showView(viewId) {
    console.log('📍 Przełączam widok:', viewId);
    
    state.previousView = state.currentView;
    
    // Hide all views
    contentViews.forEach(view => {
        view.classList.remove('active');
    });
    
    // Show target view
    const targetView = document.getElementById(viewId);
    if (targetView) {
        targetView.classList.add('active');
        state.currentView = viewId;
    }
}

// ===================================
// MENU CLICK HANDLER
// ===================================
function handleMenuClick(e) {
    e.preventDefault();
    const menuId = this.getAttribute('data-menu');
    
    console.log('📌 Menu:', menuId);
    state.currentMenu = menuId;
    
    // Update nav active state
    navLinks.forEach(link => {
        const isActive = link.getAttribute('data-menu') === menuId;
        link.style.fontWeight = isActive ? '700' : '500';
    });
    
    if (menuId === 'home') {
        showView('view-home');
    } else if (menuId === 'kontakt') {
        showView('view-kontakt');
    } else {
        // Show submenu for this section
        state.currentSection = menuId;
        showSubmenuForSection(menuId);
    }
}

// ===================================
// SUBMENU DISPLAY
// ===================================
function showSubmenuForSection(sectionId) {
    const viewId = `view-submenu-${sectionId}`;
    console.log('📂 Pokazuję submenu:', viewId);
    
    showView(viewId);
    
    // Get submenu grid for this section
    const submenuView = document.getElementById(viewId);
    if (!submenuView) {
        console.error('❌ Nie znaleziono widoku:', viewId);
        return;
    }
    
    const submenuGrid = submenuView.querySelector('.submenu-grid');
    if (!submenuGrid) {
        console.error('❌ Nie znaleziono submenu-grid w:', viewId);
        return;
    }
    
    // Remove animation class
    submenuGrid.classList.remove('animate');
    
    // Reset all items
    const items = submenuGrid.querySelectorAll('.submenu-item');
    items.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'scale(0.8)';
    });
    
    // Trigger animation
    setTimeout(() => {
        submenuGrid.classList.add('animate');
        console.log('✨ Animacja stagger');
    }, 50);
}

// ===================================
// SUBMENU CLICK HANDLER (Event Delegation)
// ===================================
function handleSubmenuClick(e) {
    const item = e.target.closest('.submenu-item');
    if (!item) return;
    
    const section = item.getAttribute('data-section');
    const itemId = parseInt(item.getAttribute('data-item'));
    
    if (!section || !itemId) return;
    
    console.log('📦 Kliknięto kafelek:', section, '-', itemId);
    
    // Ustaw stan
    state.currentSection = section;
    state.sectionItems = sectionsData[section] || [];
    state.currentIndex = itemId - 1; // Convert to 0-based index
    
    // Update navigation buttons
    updateNavigationButtons();
    
    // Load detail for this item
    loadDetailView(section, itemId);
}

// ===================================
// DETAIL VIEW
// ===================================
function loadDetailView(section, itemId) {
    const itemData = sectionsData[section]?.find(item => item.id === itemId);
    
    if (!itemData) {
        console.error('❌ Nie znaleziono danych dla:', section, itemId);
        return;
    }
    
    console.log('📄 Ładuję szczegóły:', itemData.title);
    
    // Update breadcrumb
    updateBreadcrumb(section, itemData.title);
    
    // Update detail content
    const detailTitle = document.getElementById('detail-title');
    if (detailTitle) {
        detailTitle.textContent = itemData.title;
    }
    
    // Show detail view with animation
    showView('view-detail');
}

// ===================================
// NAVIGATION - PREV / NEXT
// ===================================
function navigatePrev() {
    if (state.currentIndex <= 0) return;
    
    console.log('⬅️ Poprzedni kafelek');
    state.currentIndex--;
    
    const newItem = state.sectionItems[state.currentIndex];
    if (newItem) {
        animateTransition('prev');
        loadDetailView(state.currentSection, newItem.id);
    }
}

function navigateNext() {
    if (state.currentIndex >= state.sectionItems.length - 1) return;
    
    console.log('➡️ Następny kafelek');
    state.currentIndex++;
    
    const newItem = state.sectionItems[state.currentIndex];
    if (newItem) {
        animateTransition('next');
        loadDetailView(state.currentSection, newItem.id);
    }
}

function navigateBack() {
    console.log('⏪ Wróć do submenu');
    goBackToSubmenu();
}

function goBackToSubmenu() {
    if (state.currentView === 'view-detail' && state.currentSection) {
        showSubmenuForSection(state.currentSection);
    }
}

// ===================================
// NAVIGATION BUTTONS STATE
// ===================================
function updateNavigationButtons() {
    if (!btnPrev || !btnNext) return;
    
    // Disable prev button if at first item
    btnPrev.disabled = (state.currentIndex <= 0);
    
    // Disable next button if at last item
    btnNext.disabled = (state.currentIndex >= state.sectionItems.length - 1);
    
    console.log(`🎮 Nawigacja: ${state.currentIndex + 1}/${state.sectionItems.length}`);
}

// ===================================
// TRANSITION ANIMATION
// ===================================
function animateTransition(direction) {
    const splitContainer = document.querySelector('#view-detail .split-container');
    if (!splitContainer) return;
    
    // Remove existing animation
    splitContainer.style.animation = 'none';
    
    // Trigger reflow
    void splitContainer.offsetWidth;
    
    // Apply new animation based on direction
    if (direction === 'next') {
        splitContainer.style.animation = 'slideInFromRight 0.5s ease-out';
    } else {
        splitContainer.style.animation = 'slideInFromLeft 0.5s ease-out';
    }
}

// ===================================
// BREADCRUMB UPDATE
// ===================================
function updateBreadcrumb(sectionName, itemName) {
    const formatted = getMenuLabel(sectionName);
    
    if (breadcrumbSection) {
        breadcrumbSection.textContent = formatted;
    }
    
    if (breadcrumbItem) {
        breadcrumbItem.textContent = itemName;
    }
}

// ===================================
// KEYBOARD NAVIGATION
// ===================================
function initKeyboardNavigation() {
    document.addEventListener('keydown', handleKeyPress);
    console.log('⌨️ Keyboard navigation ready');
}

function handleKeyPress(e) {
    const key = e.key;
    
    // Only handle navigation in detail view
    if (state.currentView !== 'view-detail') {
        if (key === 'Escape' && state.currentView.includes('submenu')) {
            const homeLink = document.querySelector('[data-menu="home"]');
            if (homeLink) homeLink.click();
        }
        return;

    }
    
    switch(key) {
        case 'Escape':
            navigateBack();
            break;
        
        case 'ArrowLeft':
            if (!btnPrev.disabled) navigatePrev();
            break;
            
        case 'ArrowRight':
            if (!btnNext.disabled) navigateNext();
            break;
    }
}

// ===================================
// UTILITY FUNCTIONS
// ===================================
function getMenuLabel(menuId) {
    const labels = {
        'home': 'Home',
        'akwarystyka': 'Akwarystyka',
        'aplikacje': 'Aplikacje',
        'rower': 'Rower poziomy',
        'inne': 'Inne',
        'kontakt': 'Kontakt'
    };
    return labels[menuId] || menuId;
}

// ===================================
// CSS ANIMATIONS (dodane dynamicznie)
// ===================================
// Dodaj style dla animacji slide
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInFromRight {
        0% {
            opacity: 0;
            transform: translateX(30px);
        }
        100% {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideInFromLeft {
        0% {
            opacity: 0;
            transform: translateX(-30px);
        }
        100% {
            opacity: 1;
            transform: translateX(0);
        }
    }
`;
document.head.appendChild(style);

// ===================================
// START APPLICATION
// ===================================
document.addEventListener('DOMContentLoaded', init);

// ===================================
// CONSOLE INFO
// ===================================
console.log(`
╔═══════════════════════════════════════╗
║   🎨 PORTFOLIO NAVIGATION v3.0       ║
╠═══════════════════════════════════════╣
║                                       ║
║  ✅ Flex layout - wszystko center    ║
║  ✅ Percentage-based dimensions       ║
║  ✅ Multiple submenu sections         ║
║  ✅ Carousel navigation (</>/<<)      ║
║  ✅ Stagger animation                 ║
║  ✅ Slide transitions                 ║
║  ✅ Full keyboard support             ║
║                                       ║
║  💡 SKRÓTY:                           ║
║     ESC - Wróć do submenu             ║
║     ←   - Poprzedni kafelek           ║
║     →   - Następny kafelek            ║
║                                       ║
║  📊 STRUKTURA:                        ║
║     Akwarystyka: 3 kafelki            ║
║     Aplikacje: 6 kafelków             ║
║     Rower: 2 kafelki                  ║
║     Inne: 4 kafelki                   ║
║                                       ║
╚═══════════════════════════════════════╝
`);