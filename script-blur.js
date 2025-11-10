// ===================================
// SLICK SLIDER WITH MOTION BLUR
// ===================================

$(document).ready(function() {
    console.log('🚀 Slick Slider initializing...');
    
    // Initialize Slick Slider
    $('.slider').slick({
        arrows: true,
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        centerMode: true,
        variableWidth: true,
        draggable: false
    });
    
    console.log('✅ Slick Slider ready!');
    
    // Motion blur on slide change
    $('.slider')
        .on('beforeChange', function(event, slick, currentSlide, nextSlide){
            $('.slick-list').addClass('do-transition');
        })
        .on('afterChange', function(){
            $('.slick-list').removeClass('do-transition');
        });
});

// ===================================
// NAVIGATION MANAGEMENT
// ===================================
const navLinks = document.querySelectorAll('.nav-link');
const contentViews = document.querySelectorAll('.content-view');

navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const menu = this.getAttribute('data-menu');
        
        console.log(`📌 Menu: ${menu}`);
        
        // Update nav active state
        navLinks.forEach(l => l.classList.remove('active'));
        this.classList.add('active');
        
        // Show corresponding view
        showView(`view-${menu}`);
    });
});

function showView(viewId) {
    console.log(`👁️ View: ${viewId}`);
    
    // Hide all views
    contentViews.forEach(view => {
        view.classList.remove('active');
    });
    
    // Show target view
    const targetView = document.getElementById(viewId);
    if (targetView) {
        targetView.classList.add('active');
    }
}

