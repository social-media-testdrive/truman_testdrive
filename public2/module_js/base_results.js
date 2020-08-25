let pathArray = window.location.pathname.split('/');
const subdirectory2 = pathArray[2]; // idenifies the current module
let actionArray = new Array(); // this array will be handed to Promise.all

function recordResponse(responseType,timestamp){
  // create new object with desired data to pass to the post request
  let cat = new Object();
  cat.modual = subdirectory2
  cat.prompt = $(this).text();
  cat.absoluteTimeContinued = timestamp;
  // adjust variables depending on the response type
  switch(responseType){
    case 'written':
      cat.writtenResponse = $(this)
        .closest('.ui.label')
          .siblings('.ui.form')
            .find('textarea')
            .val();
      break;
    case 'checkboxes':
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
      let radioSelection = "";
      radioSelection = $(this)
        .closest('.ui.segment')
          .find('.radio.checkbox input:checked')
            .siblings('label')
            .text();
      cat.radioSelection = radioSelection;
      break;
    case 'habits_time_entry':
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

function iterateOverPrompts() {

  let timestamp = Date.now();

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
    window.location.href = `/end/${pathArray[2]}`
  });
}

$('.ui.big.green.labeled.icon.button.results_end').on('click', function () {
  $(".insertPrint").empty();
  return iterateOverPrompts();
});
