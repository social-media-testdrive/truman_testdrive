const cdn = "https://dhpd030vnpk29.cloudfront.net";
let topicSelection = "";
let eventKeyword = "";
let bot1Image = "";
let bot1FullName = "";
let bot1FirstName = "";
let bot2Image = "";
let bot2FullName = "";
let bot2FirstName = "";

const nextPageURL = 'modual';
let stepsList;

function customOnWindowLoad(){
  $.get("/esteemTopic", function( data ) {
    topicSelection = data.esteemTopic;
  }).then( function() {

    switch (topicSelection) {
      case 'Sports':
        eventKeyword = 'soccer game';
        bot1Image = 'user53.jpg';
        bot1FullName = "Brielle Jordan";
        bot1FirstName = "Brielle";
        bot2Image = 'user4.jpg';
        bot2FullName = "Hayden Abbey";
        bot2FirstName = "Hayden";
        customAudioFile = "";
        break;
      case 'Music':
        eventKeyword = 'music camp';
        bot1Image = 'user5.jpeg';
        bot1FullName = "Kiki Pualani";
        bot1FirstName = " Kiki";
        bot2Image = 'user10.jpg';
        bot2FullName = "Franklin Robinson";
        bot2FirstName = "Franklin";
        customAudioFile = "";
        break;
      case 'Gaming':
        eventKeyword = 'gaming club';
        bot1Image = 'user30.jpg';
        bot1FullName = "Lindsay Stokes";
        bot1FirstName = "Lindsay";
        bot2Image = 'user48.jpeg';
        bot2FullName = "Asher Michaels";
        bot2FirstName = "Asher";
        customAudioFile = "";
        break;
      default:
        eventKeyword = 'soccer game';
        bot1Image = 'user30.jpg';
        bot1FullName = "Lindsay Stokes"
        bot1FirstName = "Lindsay"
        bot2Image = 'user48.jpeg';
        bot2FullName = "Asher Michaels"
        bot2FirstName = "Asher"
        customAudioFile = "";
        break;
    }

    stepsList = [
      {
        intro: `NOTE: Most browsers require users to interact with the page before
        audio can play, so this step will not have a voiceover. Its purpose is to
        get the user to interact with the page. Text would be added later.`,
        position: 'right',
        scrollTo: 'tooltip',
        audioFile: ''
      },
      {
        intro: `Now you get to explore the TestDrive timeline! You can read
        what others have posted, respond, or make your own posts.`,
        audioFile: ''
      },
      {
        intro: `Here is some background before you start: Imagine that you are
        looking at
        <span class='noLineBreak'><img class='ui avatar image customCircularAvatar' src='${cdn}/profile_pictures/user77.jpg'>
        Jeremy Murray's</span>
        social media timeline.`,
        audioFile: ''
      },
      {
        intro: `Jeremy has two friends,
        <span class='noLineBreak'><img class='ui avatar image customCircularAvatar' src='${cdn}/profile_pictures/${bot1Image}'>
        <span>${bot1FullName}</span></span> and
        <span class='noLineBreak'><img class='ui avatar image customCircularAvatar' src='${cdn}/profile_pictures/${bot2Image}'>
        <span>${bot2FullName}</span></span> whom he met  at a ${eventKeyword}.
        Look out for posts from ${bot1FirstName} and ${bot2FirstName}.`,
        audioFile: `${customAudioFile}`
      },
      {
        intro: `You may also see posts from other friends that could cause
        Jeremy to have a red flag feeling. Click on these posts to think about
        how Jeremy might feel and what he can do about it.`,
        audioFile: ''
      }
    ];

    startIntro();

  });
}
