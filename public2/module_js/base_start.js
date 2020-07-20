let actionArray = new Array(); // this array will be handed to Promise.all

function animateUnclickedLabels() {
  $('.keyTermDefinition').each(function(){
    if($(this).is(":hidden")){
      $(this).siblings('.keyTermLabel').transition('bounce');
    }
  })
};

function clickGotIt(){
  if($('#question').is(":hidden")){
    //User has not yet clicked next
    $('#clickNextWarning').show();
    $('#introduction_next').transition('bounce');
  }else{
    //determine if all the labeles are clicked
    if($(".keyTermDefinition:hidden").length === 0){
      //everything is good to proceed
      $('#clickLabelsWarning').hide();
      let pathArray = window.location.pathname.split('/');
      Promise.all(actionArray).then(function(){
        window.location.href='/tutorial/' + pathArray[2];
      });
    } else {
      //User has not clicked all the labels
      $('#clickLabelsWarning').show();
      animateUnclickedLabels();
    }
  }
};

$('#introduction_next').on('click', function () {
  $('#clickNextWarning').hide();
  $('#question').show();
  $('#question').transition('jiggle');
  if($(".keyTermDefinition:hidden").length === 0){
    $('.ui.labeled.icon.button').addClass('green');
  }

  // log action in db
  let cat = new Object();
  let pathArray = window.location.pathname.split('/');
  cat.subdirectory1 = pathArray[1];
  cat.subdirectory2 = pathArray[2];
  cat.actionType = 'next';
  cat.absoluteTimestamp = Date.now();
  const jqxhr = $.post("/startPageAction", {
    action: cat,
    _csrf: $('meta[name="csrf-token"]').attr('content')
  });
  actionArray.push(jqxhr);
});

$('.keyTerm').on('click', function (event) {
  $(event.target).closest('.keyTerm').children('.keyTermDefinition').show();
  $(event.target).closest('.keyTerm').transition('tada');

  if($(".keyTermDefinition:hidden").length === 0){
    $('#clickLabelsWarning').hide();
    $('.ui.labeled.icon.button').addClass('green');
  }

  // log action in db
  let cat = new Object();
  let pathArray = window.location.pathname.split('/');
  cat.subdirectory1 = pathArray[1];
  cat.subdirectory2 = pathArray[2];
  cat.actionType = 'term';
  cat.vocabTerm = $(event.target).closest('.keyTerm').children('.keyTermLabel').text();
  cat.absoluteTimestamp = Date.now();
  const jqxhr = $.post("/startPageAction", {
    action: cat,
    _csrf: $('meta[name="csrf-token"]').attr('content')
  });
  actionArray.push(jqxhr);
});
