function changeActiveTab(newActiveTab) {
  $('.ui.tab').removeClass('active');
  switch (newActiveTab) {
    case 'home':
      $('.ui.tab[data-tab="one"]').addClass('active');
      break;
    case 'article':
      $('.ui.tab[data-tab="two"]').addClass('active');
      break;
    case 'search':
      $('.ui.tab[data-tab="three"]').addClass('active');
      break;
    default:
      $('.ui.tab[data-tab="one"]').addClass('active');
      break;
  }
}

$('.menu .item').tab();

$('.articleTab[data-tab="two"]').on('click', function(){
  $('.ui.card').transition({
    animation: 'pulse',
    onComplete: function(){
      // if(closedHints === numberOfHints){
      //   changeActiveTab('article');
      // } else {
        if($('#clickAllDotsWarning').is(":hidden")){
          $('#clickAllDotsWarning').transition('fade');
          $('.gridInsideTab').css("margin-bottom", "10em");
        }else{
          //otherwise, bounce the message to draw attention to it
          $('#clickAllDotsWarning').transition('bounce');
        }
      // }
    }
  });
})

function customOnHintCloseFunction(){
  // do nothing
  if (closedHints === numberOfHints){
    $('.articleTab[data-tab="two"]').on('click', function(){
      $('.ui.card').transition({
        animation: 'pulse',
        onComplete: function(){
          // if(closedHints === numberOfHints){
            changeActiveTab('article');
          // } else {
            // if($('#clickAllDotsWarning').is(":hidden")){
            //   $('#clickAllDotsWarning').transition('fade');
            //   $('.gridInsideTab').css("margin-bottom", "10em");
            // }else{
            //   //otherwise, bounce the message to draw attention to it
            //   $('#clickAllDotsWarning').transition('bounce');
            // }
          // }
        }
      });
    })
  }

}
