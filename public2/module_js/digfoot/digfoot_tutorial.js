function startIntro(){
  var intro = introJs().setOptions({ 'hidePrev': true, 'hideNext': true, 'exitOnOverlayClick': false, 'showStepNumbers':false, 'showBullets':false, 'scrollToElement':true, 'doneLabel':'Done &#10003' });
    intro.setOptions({
      steps: [
        {
          element: '#step3',
          intro: `How can you shape your digital footprint?`,
          position: "right",
          scrollTo: 'tooltip'
        },
        {
          element: '#step3',
          intro: `Think before you post, because many things you do online
          will add to your digital footprint.`,
          position: "right",
          scrollTo: "tooltip"
        },
        {
          element: '#step4',
          intro: `Think about whether you are sharing too much personal or
          private information. Would you be ok with this being a part of your
          digital footprint?`,
          position: "left",
          scrollTo: "tooltip"
        },
        {
          element: '#step5',
          intro: `How can you be responsible for other people’s digital
          footprints?`,
          position: "right",
          scrollTo: "tooltip"
        },
        {
          element: '#step5',
          intro: `Think about your friends’ digital footprints, too! It’s your
          responsibility to not post embarrassing pictures, gossip, or hateful
          things about others.`,
          position: "right",
          scrollTo: "tooltip"
        },
        {
          element: '#step5',
          intro: `If someone posts something you don’t want to have as part of
          your digital footprint, you can ask them to delete it through a
          private message.`,
          position: "right",
          scrollTo: "tooltip"
        }

      ]
    });
    intro.onbeforechange(function(){
      hideHelpMessage();
    })
    intro.start().onexit(function() {
      window.location.href='/sim/digfoot';
    });
    return intro;
  };

  function isTutorialBoxOffScreen(bottomOffset){
    if (window.scrollY > bottomOffset) {
      return true;
    } else {
      return false;
    }
  }

  function hideHelpMessage(){
    if($('#clickNextHelpMessage').is(':visible')){
      $('#clickNextHelpMessage').transition('fade');
    }
  }

  function showHelpMessage(){
    if($('#clickNextHelpMessage').is(':hidden')){
      $('#clickNextHelpMessage').transition('fade down');
    }
  }

  $(window).on("load", function() {
    const intro = startIntro();
    const tooltipTopOffset = $('.introjs-tooltip').offset().top;
    const tooltipBottomOffset = tooltipTopOffset + $('.introjs-tooltip').outerHeight();
    let scrolledAway = false;
    // When the user scrolls, check that they haven't missed the first tooltip.
    // If the tooltip is scrolled out of the viewport and the user is still on
    // the first tooltip step after 4 seconds, show a help message.
    $(window).scroll(function(){
      // only want to do this once, so check that scrolledAway is false
      if (isTutorialBoxOffScreen(tooltipBottomOffset) && (!scrolledAway)) {
        scrolledAway = true;
        setTimeout(function(){
          if(intro._currentStep === 0){
            showHelpMessage();
          }
        }, 4000);
      }
    });
  });
