const stepsList = [
  {
    element: '#step0',
    intro: `Click "Next" to begin!`,
    position: 'right',
    scrollTo: 'tooltip',
    audioFile: ['']
  },
  {
    element: '#step0',
    intro: `Thinking about your media choices and the habits you form while using
    them is important. Good habits help us build healthy and happy lives. Bad
    habits can make our lives more difficult.`,
    position: "right",
    scrollTo: 'tooltip',
    audioFile: ['CUSML.10.4.01.mp3']
  },
  {
    element: '#step0',
    intro: `While apps use certain features to grab your attention and keep you
    using them for as long as possible, it's important to think about how you
    can form good habits and be in control of your media use!`,
    position: "right",
    scrollTo: 'tooltip',
    audioFile: ['CUSML.10.4.02.mp3']
  },
  {
    element: '#step0',
    intro: `Let's learn some strategies to build healthy social media habits.
    Click on \"Done\" and then look for the blue dots&nbsp;&nbsp;<a role='button' tabindex='0' class='introjs-hint'>
    <div class='introjs-hint-dot'></div>
    <div class='introjs-hint-pulse'></div></a> &nbsp; &nbsp; &nbsp; &nbsp; to learn more...`,
    position: "right",
    scrollTo: 'tooltip',
    audioFile: ['CUSML.10.4.03.mp3']
  }
];

const hintsList = [
  {
    element: '#hint1',
    hint: `This is a social media timeline. You will get notifications when
    your friends like or comment on your posts.`,
    hintPosition: "middle-middle",
    audioFile: ['CUSML.10.4.04.mp3']
  },
  {
    element: '#hint2',
    hint: `Once you've clicked all the blue dots, click on the Notifications tab
    to see what notifications you have received!`,
    hintPosition: "middle-middle",
    audioFile: ['CUSML.10.4.05.mp3']
  }
];

let literacy_counter = 0;

function customOnHintCloseFunction() {
  clickedHints = 0; //The user knows to click "got it"
  if($('#removeHidden').is(":visible")){
    $("#removeHidden").transition('fade');
  }
  literacy_counter++;
  if(literacy_counter == 2) {

    //hide the warning message if it's visible
    if($('#notificationWarning').is(":visible")){
      $('#notificationWarning').transition('fade');
    }
    //show the instructional message
    if($('#nextPageInstruction').is(":hidden")){
      $('#nextPageInstruction').transition('fade');
      //add margin to the bottom of the page
      $('#addBottomMargin').css('margin-bottom', '10em');
    }

   //enable the notifications button
   $('a.item[data-value="notifications"]').on('click', function(){
     window.location.href='/sim2/habits';
   });

   function glowNotifications(){
     $('a.item[data-value="notifications"]').transition('glow');
   }
   glowNotifications();
   setInterval(glowNotifications, 2000);

  }
};

function eventsAfterHints() {
  $('a.item[data-value="notifications"]').on('click', function(){
     if(literacy_counter != 2){
       //show the message normally the first time
       if($('#notificationWarning').is(":hidden")){
         $('#notificationWarning').transition('fade');
         $('#addBottomMargin').css('margin-bottom', '10em');
       }else{
         //otherwise, bounce the message to draw attention to it
         $('#notificationWarning').transition('bounce');
       }
     }
   });
}
