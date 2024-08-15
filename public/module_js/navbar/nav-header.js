$(function() {
    console.log('Script is running');

    // Get current URL path
    var currentPath = window.location.pathname;
    console.log('Current path:', currentPath);
    
    // Remove 'active' class from all links
    $('#navbar-header a').removeClass('active');

    // Loop through each link and add 'active' class to the matching link
    $('#navbar-header a').each(function() {
        var linkPath = $(this).attr('href');
        if (linkPath === currentPath) {
            $(this).addClass('active');
        }
    });
});

