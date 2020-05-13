var hintsList = [
  {
    hint: `testing hint set 1`,
    element: '#hint1'
  }
];

function customOnHintCloseFunction(){
  // do nothing
  closedHints++;
  clickedHints = 0;
  if (closedHints == numberOfHints){
    if($('#clickAllDotsWarning').is(":visible")){
      $('#clickAllDotsWarning').transition('fade');
    }
    if($('#removeHidden').is(":visible")){
      $('#removeHidden').transition('fade');
    }

  } else {
    if($('#clickAllDotsWarning').is(":hidden")){
      $('#clickAllDotsWarning').transition('fade');
      $('.gridInsideTab').css("margin-bottom", "12em");
    }else{
      //otherwise, bounce the message to draw attention to it
      $('#clickAllDotsWarning').transition('bounce');
    }
  }
}

$('.ui.card').on('click', function(){
  $('.ui.card').transition({
    animation: 'pulse',
    onComplete: function(){
      if(closedHints === numberOfHints){
        window.location.href = '/sim2/advancedlit';
      } else {
        if($('#clickAllDotsWarning').is(":hidden")){
          $('#clickAllDotsWarning').transition('fade');
          $('.gridInsideTab').css("margin-bottom", "12em");
        }else{
          //otherwise, bounce the message to draw attention to it
          $('#clickAllDotsWarning').transition('bounce');
        }
      }
    }
  });
})
