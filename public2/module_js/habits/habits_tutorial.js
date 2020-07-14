const nextPageURL = 'sim';

let stepsList;

function additionalOnBeforeChange(jqThis){
  if(jqThis[0]._currentStep == 1){
    setTimeout(function(){
      $('#notificationsTabLabel').transition('jiggle');
    }, 500);
  }
  if((jqThis[0]._currentStep === 2) || jqThis[0]._currentStep === 3){
    $(".feedDisplay").hide();
    $(".notificationsDisplay").show();
    $('#feedsteps').removeClass('active');
    $('#notificationsteps').addClass('active');
  } else {
    $(".feedDisplay").show();
    $(".notificationsDisplay").hide();
    $('#notificationsteps').removeClass('active');
    $('#feedsteps').addClass('active');
  }
}

$(window).on("load", function() {

  if ( $('.ui.menu.notMobileView').is(":visible") ) {
    stepsList = [
      {
        element: document.querySelectorAll('#step0')[0],
        intro: `Have you ever seen notifications from social media that pop up
        and buzz on your phone?`,
        position: "right",
        scrollTo: 'tooltip'
      },
      {
        element: document.querySelectorAll('#notificationsteps')[0],
        intro: `Notifications use bright colors that look urgent to grab your
        attention. It can make you feel like you have to go on the site to
        check what it’s about.`,
        position: "right",
        scrollTo: "tooltip"
      },
      {
        element: document.querySelectorAll('#step2')[0],
        intro: `We all love getting likes and comments on the things that we
        post. It gives us a feeling of being valued and accepted by other
        people.`,
        position: "left",
        scrollTo: "tooltip"
      },
      {
        element: document.querySelectorAll('#step2')[0],
        intro: `Likes and comments can create a feedback loop that makes you
        check again and again to see if you got anything new.`,
        position: "right",
        scrollTo: "tooltip"
      },
      {
        element: document.querySelectorAll('#step5')[0],
        intro: `Another feature that may keep you drawn into apps is autoplay,
        which starts playing another video as soon as you've finished the one
        you were watching.`,
        position: "right",
        scrollTo: "tooltip"
      },
      {
        element: document.querySelectorAll('#step5')[0],
        intro: `This makes it tempting to keep watching, even if you have
        other things you want or need to do!`,
        position: "right"
      },
      {
        element: document.querySelectorAll('#step6')[0],
        intro: `Also, in a real social media site, the timeline has no end!
        This keeps you engaged, but you could end up scrolling for hours,
        possibly spending more time than you had hoped to.`,
        position: "right",
        scrollTo: "tooltip"
      }
    ]
  } else if ( $('.ui.menu.mobileView').is(":visible") ) {
    steptsList = [
      {
        element: document.querySelectorAll('#step0')[0],
        intro: `Have you ever had notifications buzz on your phone or seen
        them pop up on your phone's home screen?`,
        position: "right",
        scrollTo: 'tooltip'
      },
      {
        element: document.querySelectorAll('#notificationstepsMobile')[0],
        intro: `Notifications use bright colors that look urgent to grab your
        attention. It can make you feel like you have to go on the app to
        check what it’s about.`,
        position: "right",
        scrollTo: "tooltip"
      },
      {
        element: document.querySelectorAll('#step2')[0],
        intro: `We all love getting likes and comments on the things that we
        post. It gives us a sense of being validated by other people.`,
        position: "left",
        scrollTo: "tooltip"
      },
      {
        element: document.querySelectorAll('#step2')[0],
        intro: `Likes and comments can create a feedback loop that makes you
        check again and again to see if you got anything new.`,
        position: "right",
        scrollTo: "tooltip"
      },
      {
        element: document.querySelectorAll('#step5')[0],
        intro: `Another feature that may keep you drawn into apps is autoplay,
        which starts playing another video as soon as you've finished the one
        you were watching.`,
        position: "right",
        scrollTo: "tooltip"
      },
      {
        element: document.querySelectorAll('#step5')[0],
        intro: `This makes it tempting to keep watching, even if you have
        other things you want or need to do!`,
        position: "right"
      },
      {
        element: document.querySelectorAll('#step6')[0],
        intro: `Also, in a real social media site, the timeline has no end!
        This keeps you engaged, but you could end up scrolling for hours,
        possibly spending more time than you had hoped to.`,
        position: "right",
        scrollTo: "tooltip"
      }
    ];
  }

});
