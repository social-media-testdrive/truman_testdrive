function recordResponses() {
  let pathArray = window.location.pathname.split('/');
  const subdirectory2 = pathArray[2];
  let actionArray = new Array();

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

  Promise.all(actionArray).then(function(values) {
    console.log(values);
    window.location.href = `/end/${pathArray[2]}`
  });

//collect as an array of promises and hand off the array to promise.WAIT
//can hand an array of promises, will resolve when they are done
//will trigger "then" when they are done
//does not require all of them to be successes
//promise.all
}

$('.ui.big.green.labeled.icon.button.results_end').on('click', function () {
  recordResponses();
});
