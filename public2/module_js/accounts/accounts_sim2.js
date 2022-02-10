function eventsAfterHints() {
    $(':input').on('input', function () {
        $('#confirmContinueCheck').hide();
    });
}