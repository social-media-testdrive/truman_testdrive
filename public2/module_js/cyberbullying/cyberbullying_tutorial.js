function startIntro(){
    var intro = introJs().setOptions({ 'hidePrev': true, 'hideNext': true, 'exitOnOverlayClick': false, 'showStepNumbers':false, 'showBullets':false, 'scrollToElement':true, 'doneLabel':'Done &#10003' });
      intro.setOptions({
        steps: [
          {
            element: document.querySelectorAll('#step1')[0],
            intro: "You have recently seen that some people keep saying mean things about Dylan. A group of friends from school are bullying Dylan on social media.",
            position: 'right',
            scrollTo: 'tooltip'
          },
          {
            element: document.querySelectorAll('#step1')[0],
            intro: "<b>Cyberbullying</b> is when someone posts or shares negative things about someone else online. <br>The <b>bully</b> may use digital devices, sites, or apps. The bully often does this again and again to the same person.",
            position: 'right',
            scrollTo: 'tooltip'
          },
          {
            element: document.querySelectorAll('#step3.text')[0],
            intro: "This is an example of <b>cyberbullying.</b>",
            position: 'right',
            scrollTo: 'tooltip'
          },
          {
            element: document.querySelectorAll('a.flag')[0],
            intro: "One way you can act against cyberbullying is by pressing the <b>“Flag”</b> button.",
            position: 'right',
            scrollTo: 'tooltip'
          },
          {
            element: document.querySelectorAll('a.flag')[0],
            intro: "<b>Flagging</b> something will report it to the website and the bullying post will be taken down. Sometimes it takes a while for the website to respond.",
            position: 'right',
            scrollTo: 'tooltip'
          },
          {
            element: document.querySelectorAll('#step7')[0],
            intro: "Another way you can act against cyberbullying is by writing a <b>supportive comment</b> to the target.",
            position: 'left',
            scrollTo: 'tooltip'
          },
          {
            element: document.querySelectorAll('#step7')[0],
            intro: "Another way you can act against cyberbullying is by <b>confronting the bully</b>.",
            position: 'left',
            scrollTo: 'tooltip'
          },

        ]
      });
      intro.start().onexit(function() {
      window.location.href='/tut_guide/cyberbullying';
    });

  };

  $(window).on("load", function() {startIntro();});
