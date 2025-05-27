// adds bounce animation to any unchecked boxes
function animateUnchecked() {
    $('.requiredCheckboxInput').each(function() {
        if ($(this).is(':not(:checked)')) {
            $(this).closest('.requiredCheckbox').transition('bounce')
        }
    });
};

$(window).on('load', function() {
    Voiceovers.addVoiceovers();
    $('#tut_guide_start').on('click', function() {
        const hiddenSegment = $(this).siblings('.hidden');
        $(hiddenSegment).removeClass('hidden');
        $(hiddenSegment).find('.header').transition('jiggle')
        $(this).css('display', 'none');
        $('#clickStartWarning').hide();
    });

    $('#tut_guide_next').on('click', function() {
        $('#clickNextWarning').hide();
        $('#askQuestion').show();
        $('#askQuestion').transition('jiggle');
        $("#tut_guide_next").hide();
    });

    $("input").change(function() {
        if (($('.requiredCheckboxInput:checked').length) === ($('.requiredCheckboxInput').length)) {
            $("#checkAllWarning").hide();
            $('.ui.big.labeled.icon.button.cybersim2').addClass('green');
            $('.ui.big.labeled.icon.button.cybersim2').transition('jiggle');
        } else {
            $('.ui.big.labeled.icon.button.cybersim2').removeClass('green');
        }
    });

    $("#privacyTutGuideButton").on('click', function() {
        if (!$(this).hasClass('green')) {
            if ($('#tut_guide_start').is(':visible')) {
                $('#clickStartWarning').show();
                $('#tut_guide_start').transition('bounce');
            } else if ($("#askQuestion").is(":visible")) {
                $('#checkAllWarning').show();
                animateUnchecked();
            } else {
                $('#clickNextWarning').show();
                $('#tut_guide_next').transition('bounce');
            }
        }
    });
});