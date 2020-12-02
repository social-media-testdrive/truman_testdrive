function startIntro(){

  var intro = introJs().setOptions({
    'hidePrev': true,
    'hideNext': true,
    'exitOnOverlayClick': false,
    'showStepNumbers':false,
    'showBullets':false,
    'scrollToElement':true,
    'doneLabel':'Done &#10003'
  });

  $('.ui.dropdown.icon.item').dropdown({
    duration: 0
  });
  //prevent the dropdown from closing on item select
  $('.item').on('click', function (e) {
    e.stopPropagation();
  });


  intro.setOptions({
    steps: [
      {
        element: document.querySelectorAll('#step1')[0],
        intro: "Sometimes, advertisements and sponsored posts can look very similar to other posts or articles on social media.",
        position: "right",
        scrollTo: 'tooltip'
      },
      {
        element: document.querySelectorAll('#step1')[0],
        intro: "Here are some tips that can help you figure out if a post is an advertisement or not.",
        position: "right",
        scrollTo: "tooltip"
      },
      {
        element: document.querySelectorAll('#sponsoredTag')[0],
        intro: "Look for the words “<i>AD</i>,” “<i>Advertisement</i>,” “<i>Promoted</i>,” or “<i>Sponsored</i>” at the top or bottom of a post. Ads can also have a #hashtag with the same words!",
        position: "left",
        scrollTo: "tooltip"
      },
      {
        element: document.querySelectorAll('#poster')[0],
        intro: "You might also notice that the post is from someone you don’t know and is not your social media friend, even though your friend might have liked or commented on the post!",
        position: "right",
        scrollTo: "tooltip"
      },
      {
        element: document.querySelectorAll('#item1')[0],
        intro: "What can you do if  you spot an ad?",
        position: "right",
        scrollTo: "tooltip"
      },
      {
        element: document.querySelectorAll('#item1')[0],
        intro: "If the advertisement is not relevant to you, or you don’t want to see it again, you can click “<i>Hide ad</i>” to get rid of the ad from your timeline.",
        position: "right",
        scrollTo: "tooltip"
      },
      {
        element: document.querySelectorAll('#item1')[0],
        intro: "If the advertisement is offensive or inappropriate, you can click “Report ad” to report it to the website.",
        position: "right",
        scrollTo: "tooltip"
      },
      {
        element: document.querySelectorAll('#item1')[0],
        intro: "You can click “Why am I seeing this ad?” to learn more about why the website decided to show you the advertisement.",
        position: "right",
        scrollTo: "tooltip"
      },
      {
        element: document.querySelectorAll('#step1')[0],
        intro: "Remember, you can always ignore the ad, hide it, or change your settings so you don’t see them altogether!",
        position: "right",
        scrollTo: "tooltip"
      }
    ]
  });

  intro.onbeforechange(function() {
    hideHelpMessage();
    if(($(this)[0]._currentStep >= 4) && ($(this)[0]._currentStep < 8)){
      $('.ui.dropdown.icon.item').dropdown({
        duration: 0
      });
      $('.ui.dropdown.icon.item').dropdown('show');
      if($(this)[0]._currentStep === 5){
        $('.ui.dropdown.icon.item')
          .dropdown('set selected', '0');
      } else if ($(this)[0]._currentStep === 6){
        $('.ui.dropdown.icon.item')
          .dropdown('set selected', '1');
      } else if ($(this)[0]._currentStep === 7){
        $('.ui.dropdown.icon.item')
          .dropdown('set selected', '2');
      } else {
        $('.ui.dropdown.icon.item')
          .dropdown('clear');
      }
      intro.refresh();
    } else {
      $('.ui.dropdown.icon.item')
        .dropdown('clear');
      $('.ui.dropdown.icon.item').dropdown('hide');
    }
  });

  intro.start().onexit(function() {
    window.location.href='/tut_guide/targeted';
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
