const pathArray = window.location.pathname.split('/');
const currentModule = pathArray[2]; // idenifies the current module
const actionArray = new Array(); // this array will be handed to Promise.all

// This function is only called if enableDataCollection = true
function recordResponse(responseType) {
    // create new answer object with desired data to append to answers which will be part of object passed to the post request
    let answer = {};
    answer.questionNumber = $(this).attr('data-questionNumber');
    // prompt with any new line characters removed
    answer.prompt = $(this).text().replace(/\r?\n|\r/, '');
    // adjust variables depending on the response type
    switch (responseType) {
        case 'written':
            answer.type = 'written';
            answer.writtenResponse = $(this)
                .closest('.ui.label')
                .siblings('.ui.form')
                .find('textarea')
                .val();
            break;
        case 'checkboxes':
            answer.type = 'checkbox';
            // using bit shifting to record which boxes are checked
            // i.e. [][✓][][][✓][]  => 010010
            // records the base 10 number in DB, decode to binary string later
            let checkboxInputs = 0b0; // does not need to be binary, useful for testing
            let numberOfCheckboxes = 0; // record number of boxes to add any leading zeros when decoding
            $(this).closest('.ui.segment').find('.ui.checkbox input').each(function() {
                numberOfCheckboxes++;
                if ($(this).is(":checked")) {
                    checkboxInputs = checkboxInputs << 1;
                    checkboxInputs++;
                } else {
                    checkboxInputs = checkboxInputs << 1;
                }
            });
            answer.numberOfCheckboxes = numberOfCheckboxes;
            answer.checkboxResponse = checkboxInputs;
            break;
        case 'radio':
            answer.type = 'radio';
            let radioSelection = "";
            radioSelection = $(this)
                .closest('.ui.segment')
                .find('.radio.checkbox input:checked')
                .siblings('label')
                .text();
            answer.radioSelection = radioSelection;
            break;
        case 'habits_time_entry':
            answer.type = 'habitsUnique';
            answer.writtenResponse = $(this)
                .closest('.ui.label')
                .siblings('.ui.form')
                .find('input')
                .val();
            answer.checkedActualTime = $('.habitsReflectionCheckTime').is(":visible");
            break;
    }

    return answer;
}

// This function is only called if enableDataCollection = true
function iterateOverPrompts(startTime) {
    console.log('=== NAVIGATION STARTING ===');
    
    // Determine the quiz URL
    const quizUrl = `/quiz/${currentModule || 'cyberbullying-esp'}`;
    console.log('Navigating to:', quizUrl);
    console.log('Current path:', window.location.pathname);
    
    // COMPLETELY SKIP THE POST REQUEST FOR NOW
    console.log('Skipping POST request to avoid CSRF issues');
    
    // Navigate immediately using multiple methods to ensure it works
    console.log('Attempting navigation...');
    
    // Method 1: Direct navigation
    window.location.href = quizUrl;
    
    // Method 2: Backup navigation after short delay
    setTimeout(function() {
        if (window.location.pathname.indexOf('/results/') !== -1) {
            console.log('Backup navigation triggered - still on results page');
            window.location.replace(quizUrl);
        }
    }, 100);
    
    // Method 3: Final backup
    setTimeout(function() {
        if (window.location.pathname.indexOf('/results/') !== -1) {
            console.log('Final backup navigation - forcing redirect');
            window.location = quizUrl;
        }
    }, 500);
}

function checkAllPromptsOpened() {
    let status = true;
    $('.reflectionPromptSegment').each(function() {
        if ($(this).is(':hidden')) {
            status = false;
        }
    });
    return status;
}

function showWarning(warningID) {
    if ($(warningID).is(':visible')) {
        $(warningID).transition('bounce');
    } else {
        $(warningID).transition('fade down');
    }
}

function hideWarning(warningID) {
    if ($(warningID).is(':visible')) {
        $(warningID).transition('fade down');
    }
}

$(window).on("load", function() {
    console.log('base_results.js: Window loaded');
    console.log('base_results.js: Current module from path:', currentModule);
    console.log('base_results.js: Button exists?', $('.resultsContinueButton').length);
    
    // startTime is used to track the start time of each attempt, to later calculate the duration/time the user spent on each attempt
    let startTime = Date.now();
    // The code assumes that only one of these will be true, not both.
    const enableDataCollection = $('meta[name="isDataCollectionEnabled"]').attr('content') === "true";
    const enableShareActivityData = $('meta[name="isShareActivityDataEnabled"]').attr('content') === "true";
    // Add voiceovers from the voiceoverMappings variable
    Voiceovers.addVoiceovers();
    // Ensure the print/continue buttons don't have any residual classes
    // (these classes would be added after viewing sharing activity data popup,
    // if enabled)
    $('.button.resultsContinueButton, .button.results_print')
        .removeClass('loading disabled');
    
    console.log('base_results.js: Buttons after cleanup:', $('.resultsContinueButton').length);
    // Make any "which ones did you notice?" posts at the top interactable.
    // Plays an animation and toggles a blue glow around the post.
    $('.selectablePosts .card').on('click', function() {
        $(this).transition('pulse');
        $(this).toggleClass('selectedCard');
    });

    // Defining the behavior for the "next" button on each question's segment.
    $('.reflectionSegmentButton').on('click', function() {
        let segmentButton = $(this);
        segmentButton.hide();
        segmentButton.next('.reflectionPromptSegment').transition({
            animation: 'fade down',
            onComplete: function() {
                segmentButton.parents('.reflectionTopSegment')
                    .next('.reflectionTopSegment')
                    .transition('fade down');
            }
        });
        hideWarning('.startPromptsWarning');
        hideWarning('.openAllPromptsWarning');
        // If this was the last question, all of the prompts should be opened and the
        // print/continue buttons should be enabled
        if (checkAllPromptsOpened()) {
            $('.button.results_print, .button.resultsContinueButton')
                .addClass('green')
                .transition('jiggle');
        }
    });

    // Defining the behavior for the "continue" button
    $('.resultsContinueButton').on('click', function(e) {
        console.log('=== CONTINUE BUTTON CLICKED ===');
        e.preventDefault(); // Prevent any default form submission
        e.stopPropagation(); // Stop event bubbling
        
        // Empty .insertPrint to avoid problems with iterating over responses
        $(".insertPrint").empty();
        
        if (!checkAllPromptsOpened()) {
            console.log('Not all prompts opened - showing warning');
            // All of the questions are not yet visible to the user.
            if ($('.voiceover_reflection1')
                .next('.reflectionPromptSegment')
                .is(':hidden')) {
                showWarning('.startPromptsWarning');
            } else {
                showWarning('.openAllPromptsWarning');
            }
            return false;
        }
        
        console.log('All prompts opened - starting navigation');
        iterateOverPrompts(startTime);
        
        // Return false to prevent any default behavior
        return false;
    });
});