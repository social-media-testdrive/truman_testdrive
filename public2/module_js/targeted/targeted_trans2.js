$(".ui.selection.dropdown[name='topicSelect']").change(function() {
    $('.ui.big.labeled.icon.button').addClass('green');
    $('#selectTopicError').hide();
    //var newSelect = ($(".ui.selection.dropdown[name='topicSelect']").dropdown('get text'));
    //$.post("/feed", { targetedAdTopic: newSelect, _csrf: $('meta[name="csrf-token"]').attr('content') });
});

$('.ui.big.labeled.icon.button').on('click', function() {
    if (!$(this).hasClass('green')) {
        $('#selectTopicError').show();
        $("#animateDropdownError").transition('bounce');
    }
});


function startIntro() {
    let pathArrayForHeader = window.location.pathname.split('/');
    let subdirectory1 = pathArrayForHeader[1];
    let subdirectory2 = pathArrayForHeader[2];

    var currentSelect = ($(".ui.selection.dropdown[name='topicSelect']").dropdown('get text'));
    if ($('.ui.big.labeled.icon.button').hasClass('green')) {
        //record the choice in the db to use later when generating the free play section, wait to receive success response
        $.post("/interest", {
            chosenTopic: currentSelect,
            subdirectory2: subdirectory2,
            _csrf: $('meta[name="csrf-token"]').attr('content')
        }).then(function() {
            //take the user to the appropriate interest page corresponging to their choice
            if (currentSelect === "Food") {
                window.location.href = '/food/targeted';
            } else if (currentSelect === "Sports") {
                window.location.href = '/sports/targeted';
            } else if (currentSelect === "Gaming") {
                window.location.href = '/gaming/targeted';
            }
        });
    }
};