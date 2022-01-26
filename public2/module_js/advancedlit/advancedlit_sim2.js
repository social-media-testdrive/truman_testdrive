var hintsList = [
  {
    hint: `Let’s try to analyze the news article to identify if this is an
    accurate story.`,
    element: '#hint1',
    audioFile: ['CUSML.9.4.03.mp3']
  },
  {
    hint: `This label tells you if the article is an opinion piece or a news
    story. It’s great to read about other people’s opinions, but it’s important
    not to confuse it for being fact!`,
    element: '#hint2',
    hintPosition: 'bottom-left',
    audioFile: ['CUSML.9.4.04.mp3']
  },
  {
    hint: `Trustworthy news articles will also explain how and where their
    information was gathered, and provide links to sources used by the author.
    This article does not cite any official sources.`,
    element: '#hint3',
    hintPosition: 'bottom-middle',
    audioFile: ['CUSML.9.4.05.mp3']
  },
  {
    hint: `Let’s search for more sources to see if others are reporting the same
    news. Click the “Search for” button to learn what the first five results
    are.`,
    element: '#hint4',
    hintPosition: 'bottom-middle',
    audioFile: ['CUSML.9.4.06.mp3']
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
    $('.searchTab').addClass('green');
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
