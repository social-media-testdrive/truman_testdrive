function recordResponses() {
  // Records each response as an individual action written to the db.
  // Different types of inputs are handled: text, checkbox, radio, and
  // custom.

  let pathArray = window.location.pathname.split('/');
  const subdirectory2 = pathArray[2]; // idenify the current module
  let actionArray = new Array(); // this array will be handed to Promise.all

  // ****** Handling different input types ******

  // for standard text inputs
  $('.reflectionPrompt').each(function(){
    let cat = new Object();
    cat.modual = subdirectory2
    cat.prompt = $(this).text();
    cat.writtenResponse = $(this).closest('.ui.label').siblings('.ui.form').find('textarea').val();
    const jqxhr = $.post("/reflection", {
      action: cat,
      _csrf: $('meta[name="csrf-token"]').attr('content')
    });
    actionArray.push(jqxhr);
  });

  // for checkbox inputs
  $('.reflectionCheckboxesPrompt').each(function(){
    let cat = new Object();
    cat.modual = subdirectory2
    cat.prompt = $(this).text();
    let checkboxInputs = 0b0;
    let numberOfCheckboxes = 0;
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
    const jqxhr = $.post("/reflection", {
      action: cat,
      _csrf: $('meta[name="csrf-token"]').attr('content')
    });
    actionArray.push(jqxhr);
  });

  // for radio box selections (currently only used once in the presentation module)
  $('.reflectionRadioPrompt').each(function(){
    let cat = new Object();
    cat.modual = subdirectory2
    cat.prompt = $(this).text();
    let radioSelection = "";
    radioSelection = $(this).closest('.ui.segment').find('.radio.checkbox input:checked').siblings('label').text();
    cat.radioSelection = radioSelection;
    const jqxhr = $.post("/reflection", {
      action: cat,
      _csrf: $('meta[name="csrf-token"]').attr('content')
    });
    actionArray.push(jqxhr);
  });

  // specifically for the habits module: for the time spend on free play question
  $('.reflectionHabitsTimeEntryPrompt').each(function(){
    let cat = new Object();
    cat.modual = subdirectory2
    cat.prompt = $(this).text();
    cat.writtenResponse = $(this).closest('.ui.label').siblings('.ui.form').find('input').val();
    if ($('.habitsReflectionCheckTime').is(":visible")){
      cat.checkedActualTime = true;
    } else {
      cat.checkedActualTime = false;
    }
    const jqxhr = $.post("/reflection", {
      action: cat,
      _csrf: $('meta[name="csrf-token"]').attr('content')
    });
    actionArray.push(jqxhr);
  });

  // ********************************************

  // wait to change pages until ALL post requests in actionArray return,
  // otherwise the post requests might get cancelled during the page change
  Promise.all(actionArray).then(function() {
    window.location.href = `/end/${pathArray[2]}`
  });

} //end recordResponses()

$('.ui.big.green.labeled.icon.button.results_end').on('click', function () {
  recordResponses();
});
