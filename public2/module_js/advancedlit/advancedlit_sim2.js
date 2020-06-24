var hintsList = [
  {
    hint: `Let’s try to analyze the news article to identify if this is an
    accurate story.`,
    element: '#hint1',
    hintPosition: 'bottom-left'
  },
  {
    hint: `This label tells you if the article is an opinion piece or a news
    story. It’s great to read about other people’s opinions, but it’s important
    not to confuse it for being fact!`,
    element: '#hint2',
    hintPosition: 'bottom-left'
  },
  {
    hint: `Trustworthy news articles will also explain how and where their
    information was gathered, and provide links to relevant sources. That is
    missing here.`,
    element: '#hint3',
    hintPosition: 'bottom-middle'
  },
  {
    hint: `Let’s check other sources to see if they are saying the same thing.
    Click the “Search for” button to learn what the first five results are.`,
    element: '#hint4',
    hintPosition: 'bottom-middle'
  },

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
    $('#instructionsToContinue').show();

  } else {
    if ($('#removeHidden').is(":visible")) {
      $('#removeHidden').transition('fade');
    }
  }
}

$('.searchTab').on('click', function(){
  if(closedHints === numberOfHints){
    window.location.href = '/sim3/advancedlit';
  } else {
    if($('#clickAllDotsWarning').is(":hidden")){
      $('#clickAllDotsWarning').transition('fade');
    }else{
      //otherwise, bounce the message to draw attention to it
      $('#clickAllDotsWarning').transition('bounce');
    }
  }
});
