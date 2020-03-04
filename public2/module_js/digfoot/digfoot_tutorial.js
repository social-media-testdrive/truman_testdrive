function startIntro(){
    var intro = introJs().setOptions({ 'hidePrev': true, 'hideNext': true, 'exitOnOverlayClick': false, 'showStepNumbers':false, 'showBullets':false, 'scrollToElement':true, 'doneLabel':'Done &#10003' });
      intro.setOptions({
        steps: [
          {
            element: document.querySelectorAll('#step3')[0],
            intro: "How can you shape your digital footprint?",
            position: "right",
            scrollTo: 'tooltip'
          },
          {
            element: document.querySelectorAll('#step3')[0],
            intro: "Think before you post, because many things you do online will add to your digital footprint.",
            position: "right",
            scrollTo: "tooltip"
          },
          {
            element: document.querySelectorAll('#step4')[0],
            intro: "Think about whether you are sharing too much personal or private information. Would you be ok with this being a part of your digital footprint?",
            position: "left",
            scrollTo: "tooltip"
          },
          {
            element: document.querySelectorAll('#step5')[0],
            intro: "How can you be responsible for other people’s digital footprints?",
            position: "right",
            scrollTo: "tooltip"
          },
          {
            element: document.querySelectorAll('#step5')[0],
            intro: "Think about your friends’ digital footprints, too! It’s your responsibility to not post embarrassing pictures, gossip, or hateful things about others.",
            position: "right",
            scrollTo: "tooltip"
          },
          {
            element: document.querySelectorAll('#step5')[0],
            intro: "If someone posts something you don’t want to have as part of your digital footprint, you can ask them to delete it through a private message.",
            position: "right",
            scrollTo: "tooltip"
          }

        ]
      });
      intro.start().onexit(function() {
      window.location.href='/sim/digfoot';
    });

  };

$(window).on("load", function() {startIntro();});
