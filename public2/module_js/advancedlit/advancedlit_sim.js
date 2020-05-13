function changeActiveTab(newActiveTab) {
  $('.ui.tab').removeClass('active');
  switch (newActiveTab) {
    case 'home':
      $('.ui.tab[data-tab="one"]').addClass('active');
      break;
    case 'article':
      $('.ui.tab[data-tab="two"]').addClass('active');
      hintsList = [
        {
          hint: `testing hint set 1`,
          element: '#hint1'
        },
        {
          hint: `testing hint 2A`,
          element: '#hint2'
        },
        {
          hint: `testing hint 2B`,
          element: '#hint3'
        },
        {
          hint: `testing hint 2C`,
          element: '#hint4'
        }
      ]
      startHints();

      break;

    case 'search':
      $('.ui.tab[data-tab="three"]').addClass('active');
      break;
    default:
      $('.ui.tab[data-tab="one"]').addClass('active');
      break;
  }
}

$('.articleTab[data-tab="two"]').on('click', function(){
  $('.ui.card').transition({
    animation: 'pulse',
    onComplete: function(){
      if(closedHints === numberOfHints){
        changeActiveTab('article');
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
  });
})

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
