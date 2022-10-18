const pathArray = window.location.pathname.split('/');
const currentModule = pathArray[2]; // idenifies the current module
const actionArray = new Array(); // this array will be handed to Promise.all

// This function is only called if isResearchVersion = true
async function postNewCompletedBadge(modName) {
    const completedTypeBadges = await $.getJSON('/json/testdriveBadges.json');
    const badgeId = `completed_${modName}`;
    const badgeTitle = completedTypeBadges[badgeId].title;
    const badgeImage = completedTypeBadges[badgeId].image;
    await $.post('/postUpdateNewBadge', {
        badgeId: badgeId,
        badgeTitle: badgeTitle,
        badgeImage: badgeImage,
        _csrf: $('meta[name="csrf-token"]').attr('content')
    });
    return;
}

// This function is only called if isResearchVersion = true
async function updateModuleProgressCompleted() {
    await $.post("/moduleProgress", {
        module: currentModule,
        status: 'completed',
        _csrf: $('meta[name="csrf-token"]').attr('content')
    });
    await $.post("/moduleProgress", {
        module: 'survey-1',
        status: 'started',
        _csrf: $('meta[name="csrf-token"]').attr('content')
    });
}

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
async function iterateOverPrompts(startTime) {
    /* Sample reflectionAction object: 
      reflectionAction: {
          absoluteTimeContinued: Date, //time that the user left the page by clicking continue
          modual: String, // which lesson mod did this take place in?
          answers: [{
              questionNumber: String, // corresponds with reflectionSectionData.json, i.e. 'Q1', 'Q2', 'Q3'...
              prompt: String,
              type: String, // Which type of response this will be: written, checkbox, radio, habitsUnique
              writtenResponse: String,
              radioSelection: String, // this is for the presentation module
              numberOfCheckboxes: Number,
              checkboxResponse: Number,
              checkedActualTime: Boolean, // this is unique to the habits module
          }]
        }
    */
    const timestamp = Date.now();

    // create new object with desired data to pass to the post request
    let cat = {};
    cat.absoluteTimeContinued = timestamp;
    cat.modual = currentModule;
    cat.attemptDuration = timestamp - startTime;

    let answers = [];
    // Search for each prompt type.
    // The types are: written, checkboxes, radio**, and habits_time_entry**.
    // **Unusual prompt types that currently only occur once in the project.
    $('.reflectionPrompt').each(function() {
        answers.push(recordResponse.call($(this), 'written'));
    });

    $('.reflectionCheckboxesPrompt').each(function() {
        answers.push(recordResponse.call($(this), 'checkboxes'));
    });

    $('.reflectionRadioPrompt').each(function() {
        answers.push(recordResponse.call($(this), 'radio'));
    });

    $('.reflectionHabitsTimeEntryPrompt').each(function() {
        answers.push(recordResponse.call($(this), 'habits_time_entry'));
    });
    cat.answers = answers;

    await $.post("/reflection", {
        action: cat,
        _csrf: $('meta[name="csrf-token"]').attr('content')
    });
    // Specific to the Outcome Evaluation Study #3
    // If Research Site, skip quiz and redirect to Qualtrics Survey
    const isResearchVersion = $('meta[name="isResearchVersion"]').attr('content') === "true";
    if (isResearchVersion) {
        await updateModuleProgressCompleted(); //Mark module and survey-1 as complete
        const surveyParameters = await $.get('/surveyParameters');
        if (surveyParameters) {
            const qualtricsLinks = surveyParameters.control ? {
                "cyberbullying": "https://cornell.ca1.qualtrics.com/jfe/form/SV_4GXxnU4ywZNfdRQ",
                "digital-literacy": "https://cornell.ca1.qualtrics.com/jfe/form/SV_eQkBjBUd0Bq9T8O",
                "phishing": "https://cornell.ca1.qualtrics.com/jfe/form/SV_ezIwjZf2SGIMPga",
            } : {
                "cyberbullying": "https://cornell.ca1.qualtrics.com/jfe/form/SV_8GKWzWokVMdqQd0",
                "digital-literacy": "https://cornell.ca1.qualtrics.com/jfe/form/SV_09BYaQ2qOasR57o",
                "phishing": "https://cornell.ca1.qualtrics.com/jfe/form/SV_bC8Eye9nUWhpMwK",
            };
            const qualtricsUrl = `${qualtricsLinks[currentModule]}?GroupCode=${surveyParameters.classCode}&Username=${surveyParameters.username}`;
            /* Need to add a "visit" to the end page for various functionalities to work:
              + calculating the time spent on the reflection page
              + calculating the time spent completing the entire module
              Calculating 'time spent' uses the difference between adjacent pageLog entries,
              and now that the Qualtrics link is linked here, the 'end' page is no longer visited.
              Adding an artificial "visit" to that page will fix a multitude of issues.
            */
            await $.post("/pageLog", {
                subdirectory1: "end",
                subdirectory2: pathArray[2],
                artificialVisit: true,
                _csrf: $('meta[name="csrf-token"]').attr('content')
            });
            window.location.href = qualtricsUrl;
            // surveyParameters will return false if the currently logged in user is not a
            // student.
        } else {
            window.location.href = `/end/${currentModule}`;
        }
    } else {
        window.location.href = `/quiz/${currentModule}`
    }
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
    // startTime is used to track the start time of each attempt, to later calculate the duration/time the user spent on each attempt
    let startTime = Date.now();
    // Add voiceovers from the voiceoverMappings variable
    Voiceovers.addVoiceovers();
    // Ensure the print/continue buttons don't have any residual classes
    // (these classes would be added after viewing sharing activity data popup,
    // if enabled)
    $('.button.resultsContinueButton, .button.results_print')
        .removeClass('loading disabled');
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
    $('.resultsContinueButton').on('click', function() {
        // Empty .insertPrint to avoid problems with iterating over responses
        $(".insertPrint").empty();
        if (!checkAllPromptsOpened()) {
            // All of the questions are not yet visible to the user.
            // Show slightly different error messaging for start vs next buttons:
            // If the first question is not visible, show the "start" warning,
            // otherwise show the default warning.
            if ($('.voiceover_reflection1')
                .next('.reflectionPromptSegment')
                .is(':hidden')) {
                showWarning('.startPromptsWarning');
            } else {
                showWarning('.openAllPromptsWarning');
            }
            return;
        }
        // All of the questions are now visible to the user.
        $(this).addClass('loading disabled');
        iterateOverPrompts(startTime);
    });
});