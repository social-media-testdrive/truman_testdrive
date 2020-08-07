const hintsList = [
  {
    hint: `Based on your analysis of the article, think about what would you do
    next.`,
    element: '#hint1',
    hintPosition: 'middle-middle'
  },
  {
    hint: `It's not a good idea to share a news article that isn't accurate
    since it can cause other people believe something that isn't true.`,
    element: '#hint2',
    hintPosition: 'bottom-middle'
  },
  {
    hint: `If you think the article is incorrect, you can flag the post to
    report it to the website.`,
    element: '#hint3',
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

$('.continueButton').on('click', function(){
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
