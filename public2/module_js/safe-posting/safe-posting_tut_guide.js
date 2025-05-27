const voiceoverMappings = {
    '.voiceover_keyTerm1': {
        "initialDelay": 700,
        "delay": 0,
        "files": ['CUSML.11.4.1.mp3']
    },
    '.voiceover_keyTerm2': {
        "initialDelay": 700,
        "delay": 0,
        "files": ['CUSML.11.4.2.mp3']
    },
    '.voiceover_keyTerm3': {
        "initialDelay": 700,
        "delay": 0,
        "files": ['CUSML.11.4.3.mp3']
    },
    '.voiceover_keyTerm4': {
        "initialDelay": 700,
        "delay": 0,
        "files": ['CUSML.11.4.4.mp3']
    }
};

// Animates any unclicked labels, used for error messaging
function animateUnclickedLabels() {
    if ($('#step1_info').is(":hidden")) {
        $('#step1Label').transition('bounce');
    }
    if ($('#step2_info').is(":hidden")) {
        $('#step2Label').transition('bounce');
    }
    if ($('#step3_info').is(":hidden")) {
        $('#step3Label').transition('bounce');
    }
    if ($('#step4_info').is(":hidden")) {
        $('#step4Label').transition('bounce');
    }
};

$(window).on('load', function() {
    $('#introduction_next').on('click', function() {
        if ($('#show_steps').is(":hidden")) {
            $('#clickViewMessagesWarning').hide();
            $('#chat1').show();
            setTimeout(function() {
                $('#show_steps').show();
                $('#steps').hide();
                $('#show_steps').transition('jiggle');
            }, 3000);
        }
    });

    $('#show_steps>a').on('click', function() {
        $('#steps').show();
        $('#steps .ui.raised.segment').transition('jiggle');
        $('#clickToSeeWarning').hide();
    });

    $(".step").on('click', function(event) {
        $(event.target).closest('.step').find('.responseSuggestion').show();
        $(event.target).closest('.step').transition('tada');
        $('#clickLabelsWarning').hide();
        if ($(".step .responseSuggestion:hidden").length == 0) {
            $('.ui.large.labeled.icon.button.cybersim').addClass('green');
        };
    })

    $('.cybersim').on('click', function() {
        if ($('#chat1').is(":hidden")) {
            $("#clickViewMessagesWarning").show();
        } else if ($('#show_steps').is(":visible") && $('#steps').is(":hidden")) {
            $("#clickToSeeWarning").show();
            $("#clickHereToSee").transition('bounce');
        } else if ($('#show_steps').is(":visible") && $('#steps').is(":visible")) {
            if ($(".step .responseSuggestion:hidden").length == 0) {
                $('.ui.large.labeled.icon.button.cybersim').addClass('green');
            } else {
                $('#clickLabelsWarning').show();
                animateUnclickedLabels();
            }
        }
    });
    Voiceovers.addVoiceovers();
})