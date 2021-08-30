const pathArray = window.location.pathname.split('/');
const currentModule = pathArray[2]; // idenifies the current module
const actionArray = new Array(); // this array will be handed to Promise.all
var attemptNumber = 0;

// This function is only called if enableDataCollection = true
function recordResponse(responseType, timestamp) {
  // create new object with desired data to pass to the post request
  let cat = new Object();
  cat.modual = currentModule
  // prompt with any new line characters removed
  cat.prompt = $(this).text().replace(/\r?\n|\r/, '');
  cat.questionNumber = $(this).attr('data-questionNumber');
  cat.absoluteTimeContinued = timestamp;
  cat.type = responseType; // always "radio"
  let radioSelection = "";
  radioSelection = $(this)
    .closest('.ui.segment')
    .find('.radio.checkbox input:checked')
    .siblings('label')
    .text();
  cat.radioSelection = radioSelection;
  cat.attemptNumber = attemptNumber;
  const jqxhr = $.post("/quiz", {
    action: cat,
    _csrf: $('meta[name="csrf-token"]').attr('content')
  });
  actionArray.push(jqxhr);
}

// This function is only called if enableDataCollection = true
function iterateOverPrompts() {
  const timestamp = Date.now();

  $('.quizRadioPrompt').each(function () {
    return recordResponse.call($(this), 'radio', timestamp)
  });

  // wait to change page until all post requests in actionArray return,
  // otherwise the post requests might get cancelled during the page change
  Promise.all(actionArray).then(function () {
  });
}

function checkAllPromptsOpened() {
  let status = true;
  $('.quizPromptSegment').each(function () {
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

$(window).on("load", function () {
  // The code assumes that only one of these will be true, not both.
  const enableDataCollection = $('meta[name="isDataCollectionEnabled"]').attr('content') === "true";
  const enableShareActivityData = $('meta[name="isShareActivityDataEnabled"]').attr('content') === "true";

  // TODO: Add voiceovers from the voiceoverMappings variable
  Voiceovers.addVoiceovers();
  // Ensure the print/continue buttons don't have any residual classes
  // (these classes would be added after viewing sharing activity data popup,
  // if enabled)
  $('.button.quizCheckAnswersButton, .button.quiz_print')
    .removeClass('loading disabled');

  // Defining the behavior for the "next" button on each question's segment.
  $('.quizSegmentButton').on('click', function () {
    let segmentButton = $(this);
    segmentButton.hide();
    segmentButton.next('.quizPromptSegment').transition({
      animation: 'fade down',
      onComplete: function () {
        segmentButton.parents('.quizTopSegment')
          .next('.quizTopSegment')
          .transition('fade down');
      }
    });
    hideWarning('.startPromptsWarning');
    hideWarning('.openAllPromptsWarning');
    // If this was the last question, all of the prompts should be opened and the
    // print/continue buttons should be enabled
    if (checkAllPromptsOpened()) {
      $('.button.quiz_print, .button.quizCheckAnswersButton')
        .addClass('green')
        .transition('jiggle');
    }
  });

  // Defining the behavior for the "Check my Answers" button
  $('.quizCheckAnswersButton').on('click', function () {
    // Empty .insertPrint to avoid problems with iterating over responses
    $(".insertPrint").empty();
    if (!checkAllPromptsOpened()) {
      // All of the questions are not yet visible to the user.
      // Show slightly different error messaging for start vs next buttons:
      // If the first question is not visible, show the "start" warning,
      // otherwise show the default warning.
      if ($('.voiceover_reflection1')
        .next('.quizPromptSegment')
        .is(':hidden')) {
        showWarning('.startPromptsWarning');
      } else {
        showWarning('.openAllPromptsWarning');
      }
      return;
    }

    // All of the questions are now visible to the user.
    if (enableDataCollection) {
      // If data collection is enabled, iterate over the prompts to record the
      // responses.
      iterateOverPrompts();
    }

    const answerArray = new Array();
    $('.quizRadioPrompt').each(function () {
      let radioSelection = "";
      radioSelection = $(this)
        .closest('.ui.segment')
        .find('.radio.checkbox input:checked').val();
      answerArray.push(radioSelection);
    });

    $('h3.feedBack').each(function (index) {
      const questionNumber = "Q" + (index + 1).toString()
      $(this)[0].innerHTML = (answerArray[index] === quizData[questionNumber]["correctResponse"])
        ? "Correct" : "Incorrect";
      $(this).removeClass("hidden");
    })

    $('.skipButtonText').html("Continue")
    window.scrollTo({ top: 0, behavior: 'smooth' });
    attemptNumber++;
  });

  // Defining the behavior for the "Skip Quiz" button
  $('.quizSkipButton').on('click', function () {
    if (enableShareActivityData) {
      // If sharing activity data is enabled, show the corresponding popup and
      // save the user's activity data if the user checks the box.
      $('.optInToShareActivityDataSegment').modal('show');
      $('.optInToShareActivityDataSegment').modal({
        onApprove: function () {
          // Change the print/continue button appearances
          $('.button.quizCheckAnswersButton, .button.quiz_print')
            .addClass('loading disabled');
          // Get the checkbox input
          const optInSelection = $('.optInToShareActivityDataSegment .ui.checkbox input').is(":checked");
          if (optInSelection) {
            // Save the user's activity data for the current module
            $.post('/postActivityData', {
              module: currentModule,
              _csrf: $('meta[name="csrf-token"]').attr('content')
            }).then(function () {
              window.location.href = `/end/${currentModule}`;
            });
          } else {
            // Delete any data saved from this module for the currently
            // logged in user
            $.post('/postDeleteActivityData', {
              module: currentModule,
              _csrf: $('meta[name="csrf-token"]').attr('content')
            }).then(function () {
              window.location.href = `/end/${currentModule}`;
            })
          }
        }
      });
    } else {
      // No additional action needed before navigating away from the
      // reflection page.
      window.location.href = `/end/${currentModule}`
    }
  });
});

function onPrint() {
  if ($('.quiz_print').hasClass('green')) {
    $(".insertPrint").empty();
    $(".insertPrint").css('display', 'block');

    $('.radioQuestion').each(function () {
      $(this).clone().removeClass('quizPromptSegment').appendTo(".insertPrint");
    });

    window.print();

    $(".insertPrint").css('display', 'none');
  } else {
    if ($('.voiceover_reflection1').next('.quizPromptSegment').is(':hidden')) {
      showWarning('.startPromptsWarning');
    } else {
      showWarning('.openAllPromptsWarning');
    }
  }
}
