// ===================================
// STATE MANAGEMENT
// ===================================
const state = {
    currentView: 'home',
    currentMenu: 'home',
    currentItem: null,
    previousView: null
};

// ===================================
// DOM ELEMENTS
// ===================================
const navLinks = document.querySelectorAll('.nav-link');
const contentViews = document.querySelectorAll('.content-view');
const submenuGrid = document.querySelector('.submenu-grid');
const submenuItems = document.querySelectorAll('.submenu-item');
const backButton = document.getElementById('back-button');
const breadcrumbSection = document.getElementById('breadcrumb-section');
const breadcrumbItem = document.getElementById('breadcrumb-item');

// ===================================
// INIT
// ===================================
function init() {
    console.log('🚀 Inicjalizacja strony...');
    
    // Show home by default
    showView('view-home');
    
    // Menu navigation
    navLinks.forEach(link => {
        link.addEventListener('click', handleMenuClick);
    });
    
    // Submenu items
    submenuItems.forEach(item => {
        item.addEventListener('click', handleSubmenuClick);
    });
    
    // Back button
    if (backButton) {
        backButton.addEventListener('click', handleBackClick);
    }
    
    // Keyboard navigation
    initKeyboardNavigation();
    
    console.log('✅ Strona gotowa!');
    console.log('💡 Naciśnij ESC by wrócić do submenu');
}

// ===================================
// VIEW SWITCHING
// ===================================
function showView(viewId) {
    console.log('📍 Przełączam widok:', viewId);
    
    // Save previous view for back navigation
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
        // Show submenu with animation
        showSubmenuWithAnimation();
    }
}

// ===================================
// SUBMENU ANIMATION
// ===================================
function showSubmenuWithAnimation() {
    showView('view-submenu');
    
    // Remove animation class
    submenuGrid.classList.remove('animate');
    
    // Reset all items
    submenuItems.forEach(item => {
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
// SUBMENU CLICK HANDLER
// ===================================
function handleSubmenuClick() {
    const itemId = this.getAttribute('data-item');
    const itemText = this.querySelector('span').textContent;
    
    console.log('📦 Submenu item:', itemId, '-', itemText);
    
    state.currentItem = itemId;
    
    // Update breadcrumb
    updateBreadcrumb(state.currentMenu, itemText);
    
    // Show detail view
    showView('view-detail');
    
    // Here you would load specific content
    // based on currentMenu and currentItem
    console.log(`📄 Ładuję: ${state.currentMenu} > ${itemText}`);
}

// ===================================
// BACK NAVIGATION
// ===================================
function handleBackClick() {
    console.log('⬅️ Wracam do submenu');
    goBackToSubmenu();
}

function goBackToSubmenu() {
    if (state.currentView === 'view-detail') {
        showSubmenuWithAnimation();
    }
}

// ===================================
// BREADCRUMB UPDATE
// ===================================
function updateBreadcrumb(sectionName, itemName) {
    // Capitalize first letter
    const formatted = sectionName.charAt(0).toUpperCase() + sectionName.slice(1);
    
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
    
    switch(key) {
        case 'Escape':
            handleEscapeKey();
            break;
        
        // Przyszłe funkcje keyboard navigation
        case 'ArrowLeft':
            // TODO: Navigate left in carousel
            break;
        case 'ArrowRight':
            // TODO: Navigate right in carousel
            break;
        case 'ArrowUp':
            // TODO: Navigate up in submenu
            break;
        case 'ArrowDown':
            // TODO: Navigate down in submenu
            break;
        case 'Enter':
            // TODO: Confirm selection
            break;
    }
}

function handleEscapeKey() {
    console.log('⌨️ ESC pressed');
    
    if (state.currentView === 'view-detail') {
        goBackToSubmenu();
    } else if (state.currentView === 'view-submenu') {
        // Optional: Go back to home
        const homeLink = document.querySelector('[data-menu="home"]');
        if (homeLink) homeLink.click();
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
// START APPLICATION
// ===================================
document.addEventListener('DOMContentLoaded', init);

// ===================================
// CONSOLE INFO
// ===================================
console.log(`
╔═══════════════════════════════════════╗
║   🎨 PORTFOLIO NAVIGATION v2.0       ║
╠═══════════════════════════════════════╣
║                                       ║
║  ✅ Flex layout (1-12+ items)        ║
║  ✅ Stagger animation                 ║
║  ✅ Back button (floating)            ║
║  ✅ Breadcrumb navigation             ║
║  ✅ ESC key support                   ║
║  ⏳ Keyboard nav (w przygotowaniu)   ║
║                                       ║
║  💡 SKRÓTY:                           ║
║     ESC - Wróć do submenu             ║
║                                       ║
║  📝 DODAWANIE ITEMÓW:                 ║
║     1. Skopiuj <div submenu-item>     ║
║     2. Zmień data-item                ║
║     3. Zmień tekst                    ║
║     4. Gotowe! Flex dostosuje layout  ║
║                                       ║
╚═══════════════════════════════════════╝
`);