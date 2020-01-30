function startIntro(){

  var intro = introJs().setOptions({ 'hidePrev': true, 'hideNext': true, 'exitOnOverlayClick': false, 'showStepNumbers':false, 'showBullets':false, 'scrollToElement':true, 'doneLabel':'Done &#10003' });

  intro.setOptions({
    steps: [
      {
        element: document.querySelectorAll('#generalStep')[0],
        intro: "Don’t share too much information on your profile.",
        position: "right",
        scrollTo: 'tooltip'
      },
      {
        element: document.querySelectorAll('#generalStep')[0],
        intro: "Start off by sharing only a little bit of information about yourself. You can always add more information later but it is difficult to remove information. ",
        position: "right",
        scrollTo: 'tooltip'
      },
      {
        element: document.querySelectorAll('#locationStep')[0],
        intro: "If you include detailed information about yourself, it can be very easy for strangers to figure out who you are and where you live. It is a good idea to not be too specific when you share your location.",
        position: "right",
        scrollTo: 'tooltip'
      },
      {
        element: document.querySelectorAll('#generalStep')[0],
        intro: "You want to have a balance of sharing just enough information so that your friends can find your profile, but not too much information.",
        position: "right",
        scrollTo: 'tooltip'
      },
    ]
  });

  intro.start().onexit(function() {
    window.location.href='/sim/accounts';
  });
}; //end startIntro

$(window).on("load", function() { startIntro(); });
