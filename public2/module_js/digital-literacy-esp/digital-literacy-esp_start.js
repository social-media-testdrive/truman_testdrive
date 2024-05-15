let actionArray = []; // this array will be handed to Promise.all
if (typeof enableDataCollection === 'undefined') {
    let enableDataCollection = $('meta[name="isDataCollectionEnabled"]').attr('content') === "true";
}

$('.showLearnSectionButton').on('click', function() {
    $('#clickNextWarning').hide();
    $('.learnSegment').show();
    $('.learnSegment .ui.header').transition('jiggle');
    $('.showLearnSectionButton').hide();
    // stop here unless we are logging the action in the db
    if (!enableDataCollection) {
        return;
    }
    // log action in db
    let cat = new Object();
    let pathArray = window.location.pathname.split('/');
    cat.subdirectory1 = pathArray[1];
    cat.subdirectory2 = pathArray[2];
    cat.actionType = 'next_showLearnSection';
    cat.absoluteTimestamp = Date.now();
    const jqxhr = $.post("/startPageAction", {
        action: cat,
        _csrf: $('meta[name="csrf-token"]').attr('content')
    });
    actionArray.push(jqxhr);
});

$('#introduction_next').on('click', function() {
    $('#clickNextWarning').hide();
    $('#question').show();
    $('#question').transition('jiggle');
    if ($(".keyTermDefinition:hidden").length === 0) {
        $('.ui.labeled.icon.button').addClass('green');
    }
    // stop here unless we are logging the action in the db
    if (!enableDataCollection) {
        return;
    }
    // log action in db
    let cat = new Object();
    let pathArray = window.location.pathname.split('/');
    cat.subdirectory1 = pathArray[1];
    cat.subdirectory2 = pathArray[2];
    cat.actionType = 'next_showKeyIdeas';
    cat.absoluteTimestamp = Date.now();
    const jqxhr = $.post("/startPageAction", {
        action: cat,
        _csrf: $('meta[name="csrf-token"]').attr('content')
    });
    actionArray.push(jqxhr);
});

function animateUnclickedLabels() {
    $('.keyTermLabel:visible').each(function() {
        if ($(this).siblings('.keyTermDefinition').is(":hidden")) {
            $(this).transition('bounce');
        }
    })
};

function clickGotIt() {
    if ($('#question').is(":hidden") && $('#question2').is(":hidden")) {
        //User has not yet clicked next
        $('#clickNextWarning').show();
        $('#introduction_next').transition('bounce');
    } else if ($('#question').is(":visible") && $('#question2').is(":hidden")) {
        // User is on part 1 of terms
        if ($(".part1.keyTermDefinition:hidden").length === 0) {
            //everything is good to proceed to part 2
            $('.ui.labeled.icon.button').removeClass('green');
            $('#clickLabelsWarning').hide();
            $('#learn').hide();
            $('#question').hide();
            $('#question2').show();
            Voiceovers.pauseVoiceover();
        } else {
            //User has not clicked all the labels
            $('#clickLabelsWarning').show();
            animateUnclickedLabels();
        }
    } else {
        // User is on part 2 of terms
        //determine if all the labeles are clicked
        if ($(".part2.keyTermDefinition:hidden").length === 0) {
            //everything is good to proceed
            $('#clickLabelsWarning').hide();
            let pathArray = window.location.pathname.split('/');
            Promise.all(actionArray).then(function() {
                window.location.href = '/tutorial/' + pathArray[2];
            });
        } else {
            //User has not clicked all the labels
            $('#clickLabelsWarning').show();
            animateUnclickedLabels();
        }
    }
};


$('.keyTerm').on('click', function(event) {
    $(event.target).closest('.keyTerm').children('.keyTermDefinition').show();
    $(event.target).closest('.keyTerm').transition('tada');

    if ($('#question').is(":visible")) {
        if ($(".part1.keyTermDefinition:hidden").length === 0) {
            $('#clickLabelsWarning').hide();
            $('.ui.labeled.icon.button').addClass('green');
        }
    } else if ($('#question2').is(':visible')) {
        if ($(".part2.keyTermDefinition:hidden").length === 0) {
            $('#clickLabelsWarning').hide();
            $('.ui.labeled.icon.button').addClass('green');
        }
    }
    // stop here unless we are logging the action in the db
    if (!enableDataCollection) {
        return;
    }
    // log action in db
    let cat = new Object();
    let pathArray = window.location.pathname.split('/');
    cat.subdirectory1 = pathArray[1];
    cat.subdirectory2 = pathArray[2];
    cat.actionType = 'keyIdea';
    cat.vocabTerm = $(event.target).closest('.keyTerm').children('.keyTermLabel').text();
    cat.absoluteTimestamp = Date.now();
    const jqxhr = $.post("/startPageAction", {
        action: cat,
        _csrf: $('meta[name="csrf-token"]').attr('content')
    });
    actionArray.push(jqxhr);
});

$(window).on('load', function() {
    Voiceovers.addVoiceovers();
})
