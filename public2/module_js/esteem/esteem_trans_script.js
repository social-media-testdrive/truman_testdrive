const cdn = "https://dhpd030vnpk29.cloudfront.net";
let topicSelection = "";
let eventKeyword = "";
let bot1Image = "";
let bot1FullName = "";
let bot1FirstName = "";
let bot2Image = "";
let bot2FullName = "";
let bot2FirstName = "";

function startIntro(){

  switch (topicSelection) {
    case 'Sports':
      eventKeyword = 'soccer game';
      bot1Image = 'user53.jpg';
      bot1FullName = "Brielle Jordan";
      bot1FirstName = "Brielle";
      bot2Image = 'user4.jpg';
      bot2FullName = "Hayden Abbey";
      bot2FirstName = "Hayden";
      break;
    case 'Music':
      eventKeyword = 'music camp';
      bot1Image = 'user5.jpeg';
      bot1FullName = "Kiki Pualani";
      bot1FirstName = " Kiki";
      bot2Image = 'user10.jpg';
      bot2FullName = "Franklin Robinson";
      bot2FirstName = "Franklin";
      break;
    case 'Gaming':
      eventKeyword = 'gaming meetup';
      bot1Image = 'user30.jpg';
      bot1FullName = "Lindsay Stokes";
      bot1FirstName = "Lindsay";
      bot2Image = 'user48.jpeg';
      bot2FullName = "Asher Michaels";
      bot2FirstName = "Asher";
      break;
    default:
      eventKeyword = 'soccer game';
      bot1Image = 'user30.jpg';
      bot1FullName = "Lindsay Stokes"
      bot1FirstName = "Lindsay"
      bot2Image = 'user48.jpeg';
      bot2FullName = "Asher Michaels"
      bot2FirstName = "Asher"
      break;
  }

  var intro = introJs().setOptions({ 'hidePrev': true, 'hideNext': true, 'exitOnOverlayClick': false, 'showStepNumbers':false, 'showBullets':false, 'scrollToElement':true, 'doneLabel':'Done &#10003', 'tooltipClass':'blueTooltip'});
    intro.setOptions({
      steps: [
        {
          intro: `Now you get to explore the TestDrive timeline! You can read
          what others have posted, respond, or make your own posts.`
        },
        {
          intro: `Here is some background before you start: Imagine that you are
          looking at
          <span class='noLineBreak'><img class='ui avatar image customCircularAvatar' src='${cdn}/profile_pictures/user77.jpg'>
          Jeremy Murray's</span>
          social media timeline.`
        },
        {
          intro: `Jeremy has two friends,
          <span class='noLineBreak'><img class='ui avatar image customCircularAvatar' src='${cdn}/profile_pictures/${bot1Image}'>
          <span>${bot1FullName}</span></span> and
          <span class='noLineBreak'><img class='ui avatar image customCircularAvatar' src='${cdn}/profile_pictures/${bot2Image}'>
          <span>${bot2FullName}</span></span> whom he met  at a ${eventKeyword}.
          Look out for posts from ${bot1FirstName} and ${bot2FirstName}.`
        },
        {
          intro: `You may also see posts by other people that express red flag
          feelings. Click on the posts to reflect on how Jeremy might feel when
          he sees the posts.`
        }

      ]
    });
  intro.start().onexit(function() {
    window.location.href='/modual/esteem';
  });
};

$(window).on("load", function(){
  $.get("/esteemTopic", function( data ) {
    topicSelection = data.esteemTopic;
  }).then(startIntro);
});
