let actionArray = new Array();
const pathArray = window.location.pathname.split('/');

/** Semantic “.hidden” / display:none !important — force section visible */
function tdRevealSection($el, display) {
    display = display || 'block';
    $el.each(function () {
        var el = this;
        el.classList.remove('hidden');
        el.removeAttribute('hidden');
        el.style.setProperty('display', display, 'important');
    });
    return $el;
}

function animateUnclickedLabels() {
    $('.keyTermDefinition').each(function () {
        if ($(this).hasClass('hidden') || $(this).is(':hidden')) {
            $(this).siblings('.keyTermLabel').transition('bounce');
        }
    });
}

function clickGotIt() {
    // Do not rely on :hidden alone — Semantic UI + transitions can lie after reveal
    if (!$('.learnSegment').hasClass('td-start-learn-revealed')) {
        $('#clickNextWarning').show();
        $('.showLearnSectionButton').transition('bounce');
    } else if (!$('.keyIdeasSegment').hasClass('td-start-keyideas-revealed')) {
        $('#clickNextWarning').show();
        $('.showKeyTermsButton').transition('bounce');
    } else {
        if ($('.keyTermDefinition.hidden').length === 0) {
            $('#clickLabelsWarning').hide();
            Promise.all(actionArray).then(function () {
                let pa = window.location.pathname.split('/');
                if (pa[2] === 'privacy') {
                    window.location.href = '/tut_guide/' + pa[2];
                } else {
                    window.location.href = '/tutorial/' + pa[2];
                }
            });
        } else {
            $('#clickLabelsWarning').show();
            animateUnclickedLabels();
        }
    }
}

function logActionInDB(enableDataCollection, actionType, keyIdea = '') {
    if (!enableDataCollection) {
        return;
    }
    const cat = new Object();
    cat.subdirectory1 = pathArray[1];
    cat.subdirectory2 = pathArray[2];
    cat.actionType = actionType;
    if (keyIdea !== '') {
        cat.vocabTerm = keyIdea;
    }
    cat.absoluteTimestamp = Date.now();
    const jqxhr = $.post('/startPageAction', {
        action: cat,
        _csrf: $('meta[name="csrf-token"]').attr('content'),
    });
    actionArray.push(jqxhr);
}

$(function () {
    $('#clickNextWarning, #clickLabelsWarning').hide();

    try {
        if (typeof Voiceovers !== 'undefined' && typeof voiceoverMappings !== 'undefined') {
            Voiceovers.addVoiceovers();
        }
    } catch (e) {
        console.warn('Voiceovers.addVoiceovers skipped:', e);
    }

    const enableDataCollection = $('meta[name="isDataCollectionEnabled"]').attr('content') === 'true';

    // Delegated + namespaced so double-loads do not stack handlers
    $(document)
        .off('click.tdStartLearn', '.showLearnSectionButton')
        .on('click.tdStartLearn', '.showLearnSectionButton', function (e) {
            e.preventDefault();
            $('#clickNextWarning').hide();
            var $learn = $('.learnSegment');
            tdRevealSection($learn, 'block');
            $learn.addClass('td-start-learn-revealed');
            $learn.find('.ui.header').first().transition('jiggle');
            $(this).closest('.ui.segment').hide();
            logActionInDB(enableDataCollection, 'next_showLearnSection');
        });

    $(document)
        .off('click.tdStartKeyideas', '.showKeyTermsButton')
        .on('click.tdStartKeyideas', '.showKeyTermsButton', function (e) {
            e.preventDefault();
            $('#clickNextWarning').hide();
            $(this).css('display', 'none');
            var $key = $('.keyIdeasSegment');
            tdRevealSection($key, 'block');
            $key.addClass('td-start-keyideas-revealed');
            $key.transition('jiggle');
            if ($('.keyTermDefinition.hidden').length === 0) {
                $('.ui.labeled.icon.button').addClass('green');
            }
            logActionInDB(enableDataCollection, 'next_showKeyIdeas');
        });

    $(document)
        .off('click.tdStartKeyterm', '.keyTerm')
        .on('click.tdStartKeyterm', '.keyTerm', function (event) {
            var $def = $(event.target).closest('.keyTerm').children('.keyTermDefinition');
            tdRevealSection($def, 'block');
            $(event.target).closest('.keyTerm').transition('tada');
            if ($('.keyTermDefinition.hidden').length === 0) {
                $('#clickLabelsWarning').hide();
                $('.ui.labeled.icon.button').addClass('green');
            }
            const vocabTerm = $(event.target).closest('.keyTerm').children('.keyTermLabel').text();
            logActionInDB(enableDataCollection, 'keyIdea', vocabTerm);
        });
});

window.clickGotIt = clickGotIt;
