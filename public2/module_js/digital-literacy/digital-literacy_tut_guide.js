$(window).on("load", function() {
    $('.ui.accordion .title').on('click', function() {
        Voiceovers.pauseVoiceover();
        if (!$(this).hasClass('active')) {
            let voiceoverKey = $(this).attr('data-voiceoverIndex');
            Voiceovers.resetVoiceoverSequenceCount();
            const voiceoverInfo = voiceoverMappings[voiceoverKey];
            setTimeout(function() {
                Voiceovers.playVoiceover(voiceoverInfo["files"], voiceoverInfo["delay"]);
            }, voiceoverInfo["initialDelay"]);
        }
    });

    setTimeout(function() {
        $('.sub.header').transition('shake');
    }, 1500);

    setTimeout(function() {
        $('#point1').transition('jiggle');
    }, 2500);

    setTimeout(function() {
        $('#point2').transition('jiggle');
    }, 3000);


    $('#point1_button').on('click', function() {

        $('#point2').transition('jiggle');
        $('#point2').click();

    });

    $("input.checkbox").change(function() {
        if (($('input.checkbox:checked').length) ==
            ($('input.checkbox').length)) {
            $("#checkAllBoxesWarning").hide();
            $('.ui.big.labeled.icon.button.cybersim').addClass('green');
            $('.ui.big.labeled.icon.button.cybersim').transition('jiggle');
        } else {
            $('.ui.big.labeled.icon.button.cybersim').removeClass('green');
        }
    });

    $("#cyberSimButton").on('click', function() {
        if (($('input.checkbox:checked').length) != ($('input.checkbox').length)) {
            $("#checkAllBoxesWarning").show();
        }
    });
});