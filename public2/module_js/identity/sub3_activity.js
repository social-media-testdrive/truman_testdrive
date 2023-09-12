// Add click event listeners to the red buttons
$('.red-button').click(function() {
    // Show "Try again" text for this specific red button
    $(this).addClass('clicked');

    // Set a timeout to remove the "clicked" class after 10 seconds
    setTimeout(function() {
        $(this).removeClass('clicked');
    }.bind(this), 1000);


    // Disable only the clicked red button
    // $(this).siblings('.green-button').addClass('disabled');
    // $(this).addClass('disabled');
});

// Add click event listeners to the green buttons
$('.green-button').click(function() {
    // Fill the button green
    $(this).addClass('correct');
    // Disable only the clicked green button
    $(this).siblings('.red-button').css('pointer-events', 'none');
    $(this).css('pointer-events', 'none');    
});
