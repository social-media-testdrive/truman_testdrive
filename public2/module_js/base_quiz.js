const pathArray = window.location.pathname.split('/');
const currentModule = pathArray[2]; // identifies the current module

const actionArray = new Array(); // this array will be handed to Promise.all

const attemptScoresArray = new Array();
var attemptNumber = 0;
const maxAttempt = 2; // maximum number of attempts student can take a quiz (starting at 0)
// var allCorrect = false;

// This function is only called if enableDataCollection = true
function recordResponse(responseType, timestamp) {
  /* quizAction: {
    absoluteTimeContinued: Date, //time that the user left the page by clicking continue
    modual: String, //which lesson mod did this take place in?
    questionNumber: String, // corresponds with quizSectionData.json, i.e. 'Q1', 'Q2', 'Q3'...
    prompt: String, // question prompt text
    type: String, // Which type of response this will be: It is always "radio"
    radioSelection: String, // radio selection text
    attemptNumber: Number, // this tracks the user's attempt
  }
  */

  // create new object with desired data to pass to the post request
  let cat = {};
  cat.absoluteTimeContinued = timestamp;
  cat.modual = currentModule;
  cat.questionNumber = $(this).attr('data-questionNumber');
  // prompt with any new line characters removed
  cat.prompt = $(this).text().replace(/\r?\n|\r/, '');
  cat.type = responseType; // always "radio"
  let radioSelection = "";
  radioSelection = $(this)
    .closest('.ui.segment')
    .find('.radio.checkbox input:checked')
    .siblings('label')
    .text().replace(/\r?\n|\r/, '');
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
    return recordResponse.call($(this), 'radio', timestamp);
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

function showScoreBanner(score, totalQuestions) {
  attemptScoresArray.push(score);

  // Append "Good job" message and the score of this attempt to the score banner. 
  // Only say "Good job" when student has answered 3+ questions correctly. 
  // Do not prompt student to retake quiz if they have answered all the questions correctly,
  // or they have reached the maximum number of attempts.
  let text = "";
  text += (score >= 3) ? "Good job! " : "";
  text += "You answered <span class = 'inline bold'>" + score + "</span> out of <span class = 'inline bold'>" + totalQuestions + "</span>  questions correctly on this quiz attempt.";
  text += (attemptNumber <= maxAttempt && score !== totalQuestions)
    ? "</br>You can review and change your answers, and resubmit the quiz (up to a maximum of 3 times) to recheck your answers. </br>"
    : (score === totalQuestions)
      ? "</br> You are ready to check the explanations for each of the questions! </br>"
      : "</br>";

  // Append the scores for every attempt to the score banner.
  attemptScoresArray.forEach(function (score, i) {
    text += "</br> <span class = 'inline bold'> Attempt " + (i + 1) + ": &nbsp;" + score + " </span> out of <span class = 'inline bold'>" + totalQuestions + "</span> questions answered correctly"
  });

  if ($('.scoreBanner').is(':visible')) {
    $('.scoreBanner').html(text);
    $('.scoreBanner').transition('bounce');
  } else {
    $('.scoreBanner').html(text);
    $('.scoreBanner').transition('fade down');
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
    const segmentButton = $(this);
    const questionNumber = segmentButton.attr('questionnumber'); // returns questionNumber of question to be displayed next (ex: "Q1", "Q2")
    const nextQuestionNumber = 'Q'+(parseInt(questionNumber.substring(1))+1)
  
    segmentButton.hide();

    $(`.quizPromptSegment.${questionNumber}`).transition({
      animation: 'fade down',
      onComplete: function(){
        $(`.quizTopSegment.${nextQuestionNumber}`).transition({
          animation: 'fade down',
        })
      }
    })

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
    let numCorrect = 0;

    // Iterate over each prompt and append the radio value (0, 1, 2... ) selected to 'answerArray'
    // and disable radio prompts where the user has already chosen the correct answer.
    $('.quizRadioPrompt').each(function (index) {
      const questionNumber = $(this).attr('data-questionNumber');
      // const questionNumber = "Q" + (index + 1).toString();
      let radioSelection = $(this)
        .closest('.ui.segment')
        .find('.radio.checkbox input:checked').val();

      if (radioSelection === quizData[questionNumber]["correctResponse"]) {
        numCorrect++;
        $(this)
          .closest('.ui.segment')
          .find('.radio.checkbox input').prop("disabled", true);
      }
      answerArray.push(radioSelection);
    });

    let numTotal = answerArray.length;

    // Iterate over each prompt and display "Correct" or "Incorrect" 
    $('h4.ui.header.feedBack').each(function (index) {
      const questionNumber = "Q" + (index + 1).toString();
      const optionLabelDictionary = ["A", "B", "C", "D", "E"]
      const letterAnswer = optionLabelDictionary[answerArray[index]];

      const correctIconElement = $(this)[0].querySelector('.check');
      const incorrectIconElement = $(this)[0].querySelector('.times');
      const contentElement = $(this)[0].querySelector('.content');
      const explanationElement = $(this)[0].querySelector('.explanation');

      if (answerArray[index] === quizData[questionNumber]["correctResponse"]) {
        $(correctIconElement).removeClass('hidden')
        $(incorrectIconElement).addClass('hidden')

        $(contentElement).addClass("green");
        contentElement.innerHTML = (letterAnswer !== undefined) ? letterAnswer + " is correct." : "";

        explanationElement.innerHTML = "";
      } else {
        $(incorrectIconElement).removeClass('hidden')
        $(correctIconElement).addClass('hidden')

        $(contentElement).addClass("red");
        contentElement.innerHTML = (letterAnswer !== undefined)
          ? letterAnswer + " is incorrect."
          : "Please choose an answer.";

        explanationElement.innerHTML = (attemptNumber < maxAttempt) ? "Would you like to try again? Please re-select your answer above." : "You can view the correct answers and explanations by clicking the blue button at the bottom of the page.";
      }
      $(this).removeClass('hidden');
    })

    //  NEXT ATTEMPT
    attemptNumber++;
    // Change text of "Skip Quiz" button to "Exit Quiz" when student has attempted the quiz
    $('.skipButtonText').html("Exit Quiz");

    // Display the score banner
    showScoreBanner(numCorrect, numTotal);

    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (attemptNumber > maxAttempt || numTotal === numCorrect) {
      $('.button.quizCheckAnswersButton')
        .transition('fade down');
      $('.button.showExplanationButton')
        .transition('fade down');

      // Iterate over each prompt and disable radio prompts.
      $('.quizRadioPrompt').each(function () {
        $(this)
          .closest('.ui.segment')
          .find('.radio.checkbox input').prop("disabled", true);
      });
    }
  });

  // Defining the behavior for the "Show Correct Answers and Explanations" button
  $('.showExplanationButton').on('click', function () {
    if (enableDataCollection) {
      // If data collection is enabled, log that user clicked to view explanations
      let cat = new Object();
      cat.module = currentModule;
      cat.click = true;
      cat.absoluteTime = Date.now();

      $.post('/postViewQuizExplanations', {
        viewAction: cat,
        _csrf: $('meta[name="csrf-token"]').attr('content')
      }).then(function () { });
    }
    // Iterate over each prompt and display "Correct", "Incorrect" and guiding explanations
    $('h4.ui.header.feedBack').each(function (index) {
      const questionNumber = "Q" + (index + 1).toString();
      const explanationElement = $(this)[0].querySelector('.explanation');
      $(explanationElement).addClass('explanationLight');

      let explanationText = quizData[questionNumber]["explanation"];
      explanationElement.innerHTML = explanationText.replace(/(\r\n|\r|\n)/g, '<br>');
    });
    document.getElementById("scoreBannerHeader").scrollIntoView({ behavior: 'smooth' });
    // window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Defining the behavior for the "Skip Quiz"/ "Continue" button
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

    // At the moment of cloning and appending the radio elements to ".insertPrint",
    // the new element has the same name and id of the original one. 
    // This causes the original radio input to be unchecked. 

    // A way to avoid this is to save the original radio inputs
    // and resetting it after the cloning and appending is done. 

    // used to save checked radio inputs
    const answerArray = new Array();

    // Iterate over each prompt and save the radio value (0, 1, 2... ) selected to 'answerArray'
    $('.quizRadioPrompt').each(function (index) {
      let radioSelection = $(this)
        .closest('.ui.segment')
        .find('.radio.checkbox input:checked').val();
      answerArray.push(radioSelection);
    });

    // Append printed elements to '.insertPrint'
    var scoreBannerText = document.getElementById("scoreBannerHeader").innerHTML;
    let scoreBannerToAppend = $(document.getElementById("scoreBannerHeader")).clone().removeAttr('id');
    scoreBannerToAppend.innerHTML = scoreBannerText;
    $(".insertPrint").append(scoreBannerToAppend);

    $('.radioQuestion').each(function () {
      $(this).clone().removeClass('quizPromptSegment').appendTo(".insertPrint");
    });

    window.print();

    $(".insertPrint").css('display', 'none');
    $(".insertPrint").empty();

    // reset radio selections to original radio inputs
    $('.quizRadioPrompt').each(function (index) {
      $(this)
        .closest('.ui.segment')
        .find('.radio.checkbox input[value=' + answerArray[index] + ']').prop("checked", true);
    });
  } else {
    if ($('.voiceover_reflection1').next('.quizPromptSegment').is(':hidden')) {
      showWarning('.startPromptsWarning');
    } else {
      showWarning('.openAllPromptsWarning');
    }
  }
}
