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
      window.location.href='/tutorial/' + pathArray[2];
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
});

$('.keyTerm').on('click', function (event) {
  $(event.target).closest('.keyTerm').children('.keyTermDefinition').show();;
  $(event.target).closest('.keyTerm').transition('tada');

  if($(".keyTermDefinition:hidden").length === 0){
    $('#clickLabelsWarning').hide();
    $('.ui.labeled.icon.button').addClass('green');
  }
});
