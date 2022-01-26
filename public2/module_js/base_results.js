const pathArray = window.location.pathname.split('/');
const currentModule = pathArray[2]; // idenifies the current module
const actionArray = new Array(); // this array will be handed to Promise.all

// This function is only called if enableDataCollection = true
function recordResponse(responseType,timestamp){
  // create new object with desired data to pass to the post request
  let cat = new Object();
  cat.modual = currentModule
  // prompt with any new line characters removed
  cat.prompt = $(this).text().replace(/\r?\n|\r/, '');
  cat.questionNumber = $(this).attr('data-questionNumber');
  cat.absoluteTimeContinued = timestamp;
  // adjust variables depending on the response type
  switch(responseType){
    case 'written':
      cat.type = 'written';
      cat.writtenResponse = $(this)
        .closest('.ui.label')
          .siblings('.ui.form')
            .find('textarea')
            .val();
      break;
    case 'checkboxes':
      cat.type = 'checkbox';
      // using bit shifting to record which boxes are checked
      // i.e. [][✓][][][✓][]  => 010010
      // records the base 10 number in DB, decode to binary string later
      let checkboxInputs = 0b0; // does not need to be binary, useful for testing
      let numberOfCheckboxes = 0; // record number of boxes to add any leading zeros when decoding
      $(this).closest('.ui.segment').find('.ui.checkbox input').each(function(){
        numberOfCheckboxes++;
        if ($(this).is(":checked")){
          checkboxInputs = checkboxInputs << 1;
          checkboxInputs++;
        } else {
          checkboxInputs = checkboxInputs << 1;
        }
      });
      cat.numberOfCheckboxes = numberOfCheckboxes;
      cat.checkboxResponse = checkboxInputs;
      break;
    case 'radio':
      cat.type = 'radio';
      let radioSelection = "";
      radioSelection = $(this)
        .closest('.ui.segment')
          .find('.radio.checkbox input:checked')
            .siblings('label')
            .text();
      cat.radioSelection = radioSelection;
      break;
    case 'habits_time_entry':
      cat.type = 'habitsUnique';
      cat.writtenResponse = $(this)
        .closest('.ui.label')
          .siblings('.ui.form')
            .find('input')
            .val();
      cat.checkedActualTime = $('.habitsReflectionCheckTime').is(":visible");
      break;
  }

  const jqxhr = $.post("/reflection", {
    action: cat,
    _csrf: $('meta[name="csrf-token"]').attr('content')
  });
  actionArray.push(jqxhr);
}

// This function is only called if enableDataCollection = true
function iterateOverPrompts() {
  const timestamp = Date.now();

  // Search for each prompt type.
  // The types are: written, checkboxes, radio**, and habits_time_entry**.
  // **Unusual prompt types that currently only occur once in the project.

  $('.reflectionPrompt').each( function() {
    return recordResponse.call($(this),'written',timestamp);
  });

  $('.reflectionCheckboxesPrompt').each( function() {
    return recordResponse.call($(this),'checkboxes',timestamp)
  });

  $('.reflectionRadioPrompt').each( function() {
    return recordResponse.call($(this),'radio',timestamp)
  });

  $('.reflectionHabitsTimeEntryPrompt').each( function() {
    return recordResponse.call($(this),'habits_time_entry',timestamp)
  });

  // wait to change pages until all post requests in actionArray return,
  // otherwise the post requests might get cancelled during the page change
  Promise.all(actionArray).then(function() {
    window.location.href = `/end/${currentModule}`
  });
}

function checkAllPromptsOpened(){
  let status = true;
  $('.reflectionPromptSegment').each(function(){
    if($(this).is(':hidden')){
      status = false;
    }
  });
  return status;
}

function showWarning(warningID){
  if($(warningID).is(':visible')){
    $(warningID).transition('bounce');
  } else {
    $(warningID).transition('fade down');
  }
}

function hideWarning(warningID){
  if($(warningID).is(':visible')){
    $(warningID).transition('fade down');
  }
}

$(window).on("load", function(){
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
  // Make any "which ones did you notice?" posts at the top interactable.
  // Plays an animation and toggles a blue glow around the post.
  $('.selectablePosts .card').on('click', function(){
    $(this).transition('pulse');
    $(this).toggleClass('selectedCard');
  });
  // Defining the behavior for the "next" button on each question's segment.
  $('.reflectionSegmentButton').on('click', function(){
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
    if(checkAllPromptsOpened()){
      $('.button.results_print, .button.resultsContinueButton')
        .addClass('green')
        .transition('jiggle');
    }
  });
  // Defining the behavior for the "continue" button
  $('.resultsContinueButton').on('click', function () {
    // Empty .insertPrint to avoid problems with iterating over responses
    $(".insertPrint").empty();
    if(!checkAllPromptsOpened()){
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
    if (enableDataCollection) {
      // If data collection is enabled, iterate over the prompts to record the
      // responses.
      return iterateOverPrompts();
    } else if (enableShareActivityData) {
      // If sharing activity data is enabled, show the corresponding popup and
      // save the user's activity data if the user checks the box.
      $('.optInToShareActivityDataSegment').modal('show');
      $('.optInToShareActivityDataSegment').modal({
        onApprove: function(){
          // Change the print/continue button appearances
          $('.button.resultsContinueButton, .button.results_print')
            .addClass('loading disabled');
          // Get the checkbox input
          const optInSelection = $('.optInToShareActivityDataSegment .ui.checkbox input').is(":checked");
          if (optInSelection) {
            // Save the user's activity data for the current module
            $.post('/postActivityData', {
              module: currentModule,
              _csrf: $('meta[name="csrf-token"]').attr('content')
            }).then(function(){
              window.location.href = `/end/${currentModule}`;
            });
          } else {
            // Delete any data saved from this module for the currently
            // logged in user
            $.post('/postDeleteActivityData', {
              module: currentModule,
              _csrf: $('meta[name="csrf-token"]').attr('content')
            }).then(function(){
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
