var hintsList = [
  {
    hint: `Check other sources to see if they are saying the same thing. You
    search for “Haywell Middle School closing” on Google, and here are the first
    5 things that you find.`,
    element: '#hint1',
    hintPosition: 'middle-middle'
  },
  {
    hint: `This is what a correction looks like. It tells you that this article
    was recently updated to add more information. The language used also
    suggests that there may be more information to come.`,
    element: '#hint2',
    hintPosition: 'middle-middle'
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
    $('.articleTab').addClass('green');

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
