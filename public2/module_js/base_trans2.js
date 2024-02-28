// Selection of interest. Used in 'targeted' and 'esteem' modules.
function addInterest() {
    let pathArrayForHeader = window.location.pathname.split('/');
    let subdirectory2 = pathArrayForHeader[2];

    const currentSelect = ($(".ui.selection.dropdown[name='topicSelect']").dropdown('get text'));
    if ($('.ui.big.labeled.icon.button').hasClass('green')) {
        //record the choice in the db to use later when generating the free play section, wait to receive success response
        $.post("/interest", {
            chosenTopic: currentSelect,
            subdirectory2: subdirectory2,
            _csrf: $('meta[name="csrf-token"]').attr('content')
        }).then(function() {
            if (subdirectory2 == 'targeted') {
                //take the user to the appropriate interest page corresponging to their choice
                window.location.href = `/${currentSelect.toLowerCase()}/targeted`;
            } else {
                //take the user to the free-play section
                window.location.href = '/trans_script/esteem';
            }
        });
    }
};

$(window).on("load", function() {
    $(".ui.selection.dropdown[name='topicSelect']").change(function() {
        $('.ui.big.labeled.icon.button').addClass('green');
        $('#selectTopicError').hide();
    });

    $('.ui.big.labeled.icon.button').on('click', function() {
        if (!$(this).hasClass('green')) {
            $('#selectTopicError').show();
            $("#animateDropdownError").transition('bounce');
        }
    });
});