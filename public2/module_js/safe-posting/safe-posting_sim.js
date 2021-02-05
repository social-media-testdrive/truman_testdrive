const stepsList = [
  {
    intro: `Click "Next" to begin!`,
    audioFile: ['']
  },
  {
    intro: `Click on \"Done\" and then look for the blue dots&nbsp;&nbsp;<a role='button' tabindex='0' class='introjs-hint'>
    <div class='introjs-hint-dot'></div><div class='introjs-hint-pulse'>
    </div></a> &nbsp; &nbsp; &nbsp; &nbsp; to learn more...`,
    audioFile: ['CUSML.11.5.1.mp3']
  }
];

const hintsList = [
  {
    element: '#hint1',
    hint: `If you see your friends sharing private information on social media,
    it's a good idea to tell them to take it down.`,
    hintPosition: "middle-right",
    audioFile: ['CUSML.11.5.3.mp3']
  },
  {
    element: '#hint2',
    hint: `Since these messages came from a stranger, you should not share any
    private information with them. Remember, you can also ignore the person.`,
    hintPosition: "top-middle",
    audioFile: ['CUSML.11.5.2.mp3']
  }
];

function customOnHintCloseFunction(){
   closedHints++;
   clickedHints = 0;
   if($('#removeHidden').is(":visible")){
     $('#removeHidden').transition('fade');
   }
   if(closedHints == hintsList.length) {
     endIntro();
   }
}

function endIntro(){
  var intro = introJs().setOptions({ 'hidePrev': true, 'hideNext': true,
  'exitOnOverlayClick': false, 'showBullets':false,'showStepNumbers':false,
  'scrollToElement':true, 'doneLabel':'Done &#10003' });
  intro.setOptions({
    steps: [
      {
        intro: "Now let’s review what we learned."
      }
    ]
  });
  intro.start().onexit(function() {
    window.location.href='/trans/safe-posting';
  });
};
