function startIntro(){

  var intro = introJs().setOptions({ 'hidePrev': true, 'hideNext': true, 'exitOnOverlayClick': false, 'showStepNumbers':false, 'showBullets':false, 'scrollToElement':true, 'doneLabel':'Done &#10003' });

  intro.setOptions({
    steps: [
      {
        element: document.querySelectorAll('#generalStep')[0],
        intro: `When you first create your profile, don’t share too much
          information on it.`,
        position: "right",
        scrollTo: 'tooltip'
      },
      {
        element: document.querySelectorAll('#generalStep')[0],
        intro: `Some platforms make it optional to share certain information.
          Don't feel pressured to share everything!`,
        position: "right",
        scrollTo: 'tooltip'
      },
      {
        element: document.querySelectorAll('#locationStep')[0],
        intro: `If you include detailed information about yourself, it can be
        very easy for strangers to figure out who you are and where you live.
        Try not to be too specific when you share your location.`,
        position: "right",
        scrollTo: 'tooltip'
      }
    ]
  });

  intro.start().onexit(function() {
    window.location.href='/sim/accounts';
  });
}; //end startIntro

$(window).on("load", function() { startIntro(); });
