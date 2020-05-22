var hintsList = [
  {
    hint: `Let’s try to analyze the news article to identify if this is an
    accurate story. First, check the source. Is the article from a reliable news
    source?`,
    element: '#hint1',
    hintPosition: 'middle-right'
  },
  {
    hint: `This label tells you if the article is an opinion piece or a news
    story. News stories will be more about what is happening whereas opinion
    pieces will be about what a writer thinks about what is happening.`,
    element: '#hint2',
    hintPosition: 'middle-middle'
  },
  {
    hint: `Reliable news articles will also explain how and where their
    information was gathered, and provide working links to relevant sources.`,
    element: '#hint3',
    hintPosition: 'top-middle'
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
    if ($('#removeHidden').is(":visible")) {
      $('#removeHidden').transition('fade');
    } else {
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
    }else{
      //otherwise, bounce the message to draw attention to it
      $('#clickAllDotsWarning').transition('bounce');
    }
  }
});
