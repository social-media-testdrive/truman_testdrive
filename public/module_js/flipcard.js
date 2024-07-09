$('.ui.shape .ui.card').on('click', function() {
    $(this).closest('.ui.card').removeClass('click-me-glow');
    // Navigate up to the parent '.ui.shape' of the clicked '.ui.card' and perform the flip
    $(this).closest('.ui.shape').shape('flip over');
    
});