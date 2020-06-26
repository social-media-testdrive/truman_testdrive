var hintsList = [
  {
    hint: `Search engines like google often prioritize results about breaking
    news.`,
    element: '#hint2',
    hintPosition: 'middle-middle'
  },
  {
    hint: `None of the sources you found seem to be mentioning the same thing.
    This might be an indication that the article has inaccurate information.`,
    element: '#hint3',
    hintPosition: 'middle-right'
  }
];

function eventsAfterHints(){
  introJs().hideHints();
  introJs().showHint(0);
}

function customOnHintCloseFunction(stepID){

  // sequential hint appearance
  stepID += 1;
  if(stepID !== numberOfHints){
    introJs().showHint(stepID);
  }
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
    $('.articleTab').addClass('green');
    $('#instructionsToContinue').show();

  } else {
    if($('#removeHidden').is(":visible")){
      $('#removeHidden').transition('fade');
    }
  }
}

$('.articleTab').on('click', function(){
  if(closedHints === numberOfHints){
    window.location.href = '/sim4/advancedlit';
  } else {
    if($('#clickAllDotsWarning').is(":hidden")){
      $('#clickAllDotsWarning').transition('fade');
    }else{
      //otherwise, bounce the message to draw attention to it
      $('#clickAllDotsWarning').transition('bounce');
    }
  }
});
