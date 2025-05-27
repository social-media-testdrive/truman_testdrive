let actionArray = []; // this array will be handed to Promise.all
const pathArray = window.location.pathname.split('/');

function animateUnclickedLabels() {
    $('.keyTermDefinition').each(function() {
        if ($(this).is(":hidden")) {
            $(this).siblings('.keyTermLabel').transition('bounce');
        }
    })
};

function clickGotIt() {
    if ($('.learnSegment').is(':hidden') && $('.keyIdeasSegment').first().is(":hidden") && $('.keyIdeasSegment').last().is(":hidden")) {
        //User has not yet clicked next
        $('#clickNextWarning').show();
        $('.showLearnSectionButton').transition('bounce');
    }
    if ($('.keyIdeasSegment').first().is(":hidden") && $('.keyIdeasSegment').last().is(":hidden")) {
        // User has not yet clicked next
        $('#clickNextWarning').show();
        $('.showKeyTermsButton').transition('bounce');
    } else if ($('.keyIdeasSegment').first().is(":visible") && $('.keyIdeasSegment').last().is(":hidden")) {
        //only entered in digital-literacy module: when first 'question' is visible, but second 'question' is hidden
        // Determine if all the labels are clicked
        if ($(".keyIdeasSegment:visible .keyTermDefinition:hidden").length === 0) { //everything is good to proceed to part 2
            $('.ui.labeled.icon.button').removeClass('green');
            $('#clickLabelsWarning').hide();
            $('#learn').hide();
            $('.learnSegment').parent().hide();
            $('.keyIdeasSegment').first().hide();
            $('.keyIdeasSegment').last().show();
            Voiceovers.pauseVoiceover();
        } else {
            // User has not clicked all the labels - show warning and animate unclicked
            $('#clickLabelsWarning').show();
            animateUnclickedLabels();
        }
    } else {
        // Determine if all the labels are clicked
        if ($(".keyIdeasSegment:visible .keyTermDefinition:hidden").length === 0) {
            // All labels are clicked so everything is good to proceed
            $('#clickLabelsWarning').hide();
            // actionArray should be empty if enableDataCollection = false
            Promise.all(actionArray).then(function() {
                let pathArray = window.location.pathname.split('/');
                if (pathArray[2] === "privacy") {
                    // special case for the privacy module
                    window.location.href = '/tut_guide/' + pathArray[2];
                } else {
                    window.location.href = '/tutorial/' + pathArray[2];
                }
            });
        } else {
            // User has not clicked all the labels - show warning and animate unclicked
            $('#clickLabelsWarning').show();
            animateUnclickedLabels();
        }
    }
};

function logActionInDB(enableDataCollection, actionType, keyIdea = '') {
    // check if data collection is enabled first
    if (!enableDataCollection) {
        return;
    }
    // log action in db
    const cat = {
        'subdirectory1': pathArray[1],
        'subdirectory2': pathArray[2],
        'actionType': actionType,
        'absoluteTimestamp': Date.now()
    };
    if (keyIdea !== '') {
        cat.vocabTerm = keyIdea;
    }
    const jqxhr = $.post("/startPageAction", {
        action: cat,
        _csrf: $('meta[name="csrf-token"]').attr('content')
    });
    actionArray.push(jqxhr);
};

$(window).on("load", function() {
    Voiceovers.addVoiceovers();
    const enableDataCollection = $('meta[name="isDataCollectionEnabled"]').attr('content') === "true";
    $('.showLearnSectionButton').on('click', function() {
        $('#clickNextWarning').hide();
        $('.learnSegment').show();
        $('.learnSegment .ui.header').transition('jiggle');
        $('.showLearnSectionButton').parent('.ui.segment').hide();
        logActionInDB(enableDataCollection, 'next_showLearnSection');
    });

    $('.showKeyTermsButton').on('click', function() {
        $('#clickNextWarning').hide();
        $('.showKeyTermsButton').css('display', 'none');
        $('.keyIdeasSegment').first().show();
        $('.keyIdeasSegment').first().transition('jiggle');
        if ($(".keyTermDefinition:hidden").length === 0) {
            $('.ui.labeled.icon.button').addClass('green');
        }
        logActionInDB(enableDataCollection, 'next_showKeyIdeas');
    });

    $('.keyTerm').on('click', function(event) {
        $(event.target).closest('.keyTerm').children('.keyTermDefinition').show();
        $(event.target).closest('.keyTerm').transition('tada');
        if ($(".ui.segment.keyIdeasSegment:visible .keyTermDefinition:hidden").length === 0) {
            $('#clickLabelsWarning').hide();
            $('.ui.labeled.icon.button').addClass('green');
        }
        const vocabTerm = $(event.target).closest('.keyTerm').children('.keyTermLabel').text();
        logActionInDB(enableDataCollection, 'keyIdea', vocabTerm);
    });

});