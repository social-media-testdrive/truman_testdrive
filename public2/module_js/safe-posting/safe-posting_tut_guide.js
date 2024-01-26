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

//a function to animate any unclicked labels, used for error messaging
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
    setTimeout(function() {
        $('.sub.header').transition('shake');
    }, 1500);

    setTimeout(function() {
        $('#point1').transition('jiggle');
    }, 2500);

    $('#introduction_next').on('click', function() {
        $('#clickViewMessagesWarning').hide();
        $('#chat1').show();
        setTimeout(function() {
            $('#show_steps').show();
            $('#steps').hide();
            $('#show_steps').transition('jiggle');
        }, 3000);
    });

    $('#show_steps>a').on('click', function() {
        $('#steps').show();
        $('#steps .ui.raised.segment').transition('jiggle');
        $('#clickToSeeWarning').hide();
    });

    $('#step1').on('click', function() {
        $('#step1_info').show();
        $('#step1').transition('tada');
        if ($('#step1_info').is(":visible") && $('#step2_info').is(":visible") && $('#step3_info').is(":visible") && $('#step4_info').is(":visible")) {
            $('#clickLabelsWarning').hide();
            $('.ui.large.labeled.icon.button.cybersim').addClass('green');
        }
    });

    $('#step2').on('click', function() {
        $('#step2_info').show();
        $('#step2').transition('tada');
        if ($('#step1_info').is(":visible") && $('#step2_info').is(":visible") && $('#step3_info').is(":visible") && $('#step4_info').is(":visible")) {
            $('#clickLabelsWarning').hide();
            $('.ui.large.labeled.icon.button.cybersim').addClass('green');
        }
    });

    $('#step3').on('click', function() {
        $('#step3_info').show();
        $('#step3').transition('tada');
        if ($('#step1_info').is(":visible") && $('#step2_info').is(":visible") && $('#step3_info').is(":visible") && $('#step4_info').is(":visible")) {
            $('#clickLabelsWarning').hide();
            $('.ui.large.labeled.icon.button.cybersim').addClass('green');
        }
    });

    $('#step4').on('click', function() {
        $('#step4_info').show();
        $('#step4').transition('tada');
        if ($('#step1_info').is(":visible") && $('#step2_info').is(":visible") && $('#step3_info').is(":visible") && $('#step4_info').is(":visible")) {
            $('#clickLabelsWarning').hide();
            $('.ui.large.labeled.icon.button.cybersim').addClass('green');
        }
    });

    $('#safepostSimButton').on('click', function() {
        if ($('#chat1').is(":hidden")) {
            $("#clickViewMessagesWarning").show();
        } else if ($('#show_steps').is(":visible") && $('#steps').is(":hidden")) {
            $("#clickToSeeWarning").show();
            $("#clickHereToSee").transition('bounce');
        } else if ($('#show_steps').is(":visible") && $('#steps').is(":visible")) {
            if ($('#step1_info').is(":visible") && $('#step2_info').is(":visible") && $('#step3_info').is(":visible") && $('#step4_info').is(":visible")) {
                $('#clickLabelsWarning').hide();
                $('.ui.large.labeled.icon.button.cybersim').addClass('green');
            } else {
                $('#clickLabelsWarning').show();
                animateUnclickedLabels();
            }
        }
    });

    Voiceovers.addVoiceovers();
})