var hintsList = [
  {
    hint: `This post is suspicious because it has spelling errors and sounds
    too good to be true.`,
    element: '#hint1',
    hintPosition: 'middle-middle',
    audioFile: ''
  },
  {
    hint: `This post has a shortened URL, which can lead to a risky website.
    Don’t click on the link!`,
    element: '#hint2',
    hintPosition: 'middle-right',
    audioFile: ''
  },
  {
    hint: `Watch out for scammers who are pretending to be your friend!
    You may see a photo of someone you know, but the post isn't
    really from them.`,
    element: '#hint3',
    hintPosition: 'middle-middle',
    audioFile: ''
  },
  {
    hint: `If you decide the post is a phishing scam, click on the flag
    button to report it.`,
    element: '#hint4',
    hintPosition: 'middle-right',
    audioFile: ''
  }
];

var stepsList = [
  {
    element: '#step0',
    intro: `NOTE: Most browsers require users to interact with the page before
    audio can play, so this step will not have a voiceover. Its purpose is to
    get the user to interact with the page. Text would be added later.`,
    position: 'right',
    scrollTo: 'tooltip',
    audioFile: ''
  },
  {
    element: '#step0',
    intro: "Click on the blue dots&nbsp;<a role='button' "+
      "tabindex='0' class='introjs-hint'><div class='introjs-hint-dot'>"+
      "</div><div class='introjs-hint-pulse'></div></a>" +
      " &nbsp; &nbsp; &nbsp;to learn more...",
    position: "right",
    scrollTo: 'tooltip',
    audioFile: ''
  }
];


function eventsAfterHints(){
  //activate the phishing links
  $("#shortenedURL1").on('click', function() {
    recordSimModalInputs('phishing_iPhoneModal');
  });
  $("#shortenedURL2").on('click', function() {
    recordSimModalInputs('phishing_ticketGiveawayModal');
  });
}

$('.ui.modal').modal({ closable: false });
