const hintsList = [
  {
    hint: `Based on your analysis of the article, what would you do next?`,
    element: '#hint1',
    hintPosition: 'middle-middle'
  },
  {
    hint: `It's not a good idea to share a news article that isn't accurate
    since it may just make other people believe something that isn't true.`,
    element: '#hint2',
    hintPosition: 'top-middle'
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
  if($('#removeHidden').is(":visible")){
    $('#removeHidden').transition('fade');
  }
  if (closedHints == numberOfHints){
    if($('#clickAllDotsWarning').is(":visible")){
      $('#clickAllDotsWarning').transition('fade');
    }
    $('.articleTab').addClass('green');
  }
}

$('.articleTab').on('click', function(){
  if(closedHints === numberOfHints){
    window.location.href = '/trans/advancedlit';
  } else {
    if($('#clickAllDotsWarning').is(":hidden")){
      $('#clickAllDotsWarning').transition('fade');
    }else{
      //otherwise, bounce the message to draw attention to it
      $('#clickAllDotsWarning').transition('bounce');
    }
  }
});
