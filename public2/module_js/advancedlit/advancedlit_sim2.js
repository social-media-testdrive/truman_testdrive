var hintsList = [
  {
    hint: `testing hint set 2`,
    element: '#hint2'
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
    $('.searchTab').removeClass('testDriveLightGray').addClass('green');

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

$('.searchTab').on('click', function(){
  if(closedHints === numberOfHints){
    window.location.href = '/sim3/advancedlit';
  } else {
    if($('#clickAllDotsWarning').is(":hidden")){
      $('#clickAllDotsWarning').transition('fade');
      $('.gridInsideTab').css("margin-bottom", "12em");
    }else{
      //otherwise, bounce the message to draw attention to it
      $('#clickAllDotsWarning').transition('bounce');
    }
  }
});
