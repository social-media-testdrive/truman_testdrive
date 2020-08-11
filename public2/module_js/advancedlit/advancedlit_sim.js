var stepsList = [
  {
    element: '#step1',
    intro: `Click on "Done" and then look for the blue dots&nbsp;<a role='button' tabindex='0'
    class='introjs-hint'><div class='introjs-hint-dot'></div><div
    class='introjs-hint-pulse'></div></a> &nbsp; &nbsp; &nbsp; 
    to learn more!`,
    scrollTo: 'tooltip'
  }
]

var hintsList = [
  {
    hint: `Your friend Corey just posted an article that says your school is
    closing, and it looks like many of your other friends are sharing it as
    well. Click on the article to see what it says.`,
    element: '#hint1',
    hintPosition: 'middle-middle'
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
  closedHints++;
  clickedHints = 0;
  if (closedHints == numberOfHints){
    if($('#clickAllDotsWarning').is(":visible")){
      $('#clickAllDotsWarning').transition('fade');
    }
    if($('#removeHidden').is(":visible")){
      $('#removeHidden').transition('fade');
    }
    $('#instructionsToContinue').show();

  } else {
    if($('#clickAllDotsWarning').is(":hidden")){
      $('#clickAllDotsWarning').transition('fade');
      // $('.gridInsideTab').css("margin-bottom", "12em");
    }else{
      //otherwise, bounce the message to draw attention to it
      $('#clickAllDotsWarning').transition('bounce');
    }
  }
}

$('.articleClickable').on('click', function(){
  $('.articleImage.articleClickable').transition({
    animation: 'pulse',
    onComplete: function(){
      if(closedHints === numberOfHints){
        window.location.href = '/sim2/advancedlit';
      } else {
        if($('#clickAllDotsWarning').is(":hidden")){
          $('#clickAllDotsWarning').transition('fade');
          // $('.gridInsideTab').css("margin-bottom", "12em");
        }else{
          //otherwise, bounce the message to draw attention to it
          $('#clickAllDotsWarning').transition('bounce');
        }
      }
    }
  });
})
