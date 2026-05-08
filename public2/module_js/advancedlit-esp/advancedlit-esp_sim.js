var stepsList = [
  {
    element: '#step1',
    intro: `¡Dale clic a "Siguiente" para comenzar!`,
    position: 'right',
    scrollTo: 'tooltip',
    audioFile: ['']
  },
  {
    element: '#step1',
    intro: `¡Dale clic a "Listo" y busca los puntos azules&nbsp;&nbsp;<a role='button' tabindex='0'
    class='introjs-hint'><div class='introjs-hint-dot'></div>
    <div class='introjs-hint-pulse'></div></a> &nbsp; &nbsp; &nbsp; &nbsp;
    para aprender más!`,
    position: "left",
    scrollTo: 'tooltip',
    audioFile: ['CUSML.9.4.01.mp3']
  }
]

var hintsList = [
  {
    hint: `Tu amigo Corey acaba de publicar un artículo que dice que tu escuela va a cerrar, y parece que muchos de tus otros amigos también lo están compartiendo. Haz clic en el artículo para ver qué dice.`,
    element: '#hint1',
    hintPosition: 'middle-middle',
    audioFile: ['CUSML.9.4.02.mp3']
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
        window.location.href = '/sim2/advancedlit-esp';
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
