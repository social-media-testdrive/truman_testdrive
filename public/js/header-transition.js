$(document).ready(function() {
    let header = $("header.ui.borderless.menu.tablet-and-computer");
    let loginItem = $("a[href='/login']");
    let signupItem = $("a[href='/signup']");
    let getStartedItem = $("button[href='/getGuest']");
    let dartBlueItems = $(".dart-blue");
    let dartLogo = $(".dart-logo");
    let toTopBtn = $("#scrollToTop");
    let isScrollBtnVisible = false;

    // Initial setup
    header.css({
        'position': 'fixed',
        'top': 0,
        'left': 0,
        'right': 0,
        'z-index': 1000,
        'transition': 'top 0.3s, background-color 0.3s, box-shadow 0.3s, border 0.3s',
        'background-color': 'transparent',
        'box-shadow': 'none',
        'border': 'none'
    });

    let lastScrollTop = 0;
    let headerHeight = header.outerHeight() + 10; // Add 10px to account for border and shadow

    // Buffer value of 10% of the viewport height
    let buffer = 0.10 * $(window).height();

    function adjustHeaderBasedOnScroll() {
        let currentScrollTop = $(this).scrollTop();

        // When at the very top of the page
        if (currentScrollTop === 0) {
            header.css({
                'box-shadow': 'none',
                'border': 'none'
            });
        } else {
            header.css({
                'box-shadow': '0 0 4px 0 rgba(0, 0, 0, 0.08), 0 2px 4px 0 rgba(0, 0, 0, 0.12)',
                'border': '1px solid rgba(34,36,38,.15)'
            });
        }

        // When near or above 90vh (with buffer), begin the transition
        if (currentScrollTop <= ($(window).height() - buffer)) {
            header.css('background-color', 'transparent');
            loginItem.show();
            signupItem.show();
            getStartedItem.hide();
            dartBlueItems.css('color', 'white');
            dartLogo.attr('src', '/images/dart-white.svg');
        } else if (currentScrollTop > ($(window).height() - buffer)) {
            header.css('background-color', 'white');
            loginItem.hide();
            signupItem.hide();
            getStartedItem.show();
            dartBlueItems.css('color', '#3757A6');
            dartLogo.attr('src', '/images/dart-logo.svg');
        }

        // Check if scrolling up or down
        // Make it a showup navbar / hide on scroll navbar  
        if (currentScrollTop > lastScrollTop) {
            // Scrolling down
            header.css('top', '-' + headerHeight + 'px'); // Hide the header
        } else {
            // Scrolling up
            header.css('top', '0'); // Show the header
        }


        // Show or hide the 'scroll to top' button
        // if ($(window).scrollTop() > ($(window).height() - buffer)) {
        //     toTopBtn.fadeIn();
        // } else {
        //     toTopBtn.fadeOut();
        // }


        lastScrollTop = currentScrollTop;
    }


    
    // Call the function on document ready to ensure correct settings load
    adjustHeaderBasedOnScroll();

    // Bind the function to the scroll event
    $(window).scroll(adjustHeaderBasedOnScroll);

    $(window).on('scroll', function() {
        if ($(this).scrollTop() > 100) {
            toTopBtn.addClass('active');
        } else {
            toTopBtn.removeClass('active');
        }
    });
});

// window.addEventListener('scroll', () => {
//     if(window.scrollY > 100) {
//         toTopBtn.classList.add('active');
//     } else {
//         toTopBtn.classList.remove('active');
//     }
// });