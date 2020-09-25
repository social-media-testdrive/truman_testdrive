const hintsList = [
  {
    hint: `Now that you have analyzed and fact-checked the article, what would
    you do next?`,
    element: '#hint1',
    hintPosition: 'middle-middle',
    audioFile: ['']
  },
  {
    hint: `Sharing a news article that is not accurate or does not have all the
    information might trick others into believing something that might not be
    true.`,
    element: '#hint2',
    hintPosition: 'top-middle',
    audioFile: ['']
  }
];

function customOnHintCloseFunction(){
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
