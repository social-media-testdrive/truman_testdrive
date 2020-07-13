const nextPageURL = 'tut_guide';

const stepsList = [
  {
    element: '#step1',
    intro: `You have recently seen that some people keep saying mean
    things about Dylan. A group of friends from school are bullying
    Dylan on social media.`,
    position: 'right',
    scrollTo: 'tooltip'
  },
  {
    element: '#step1',
    intro: `<b>Cyberbullying</b> is when someone posts or shares
    negative things about someone else online. <br>The <b>bully</b> may
    use digital devices, sites, or apps. The bully often does this again
    and again to the same person.`,
    position: 'right',
    scrollTo: 'tooltip'
  },
  {
    element: '#step3.text',
    intro: `This is an example of <b>cyberbullying.</b>`,
    position: 'right',
    scrollTo: 'tooltip'
  },
  {
    element: 'a.flag',
    intro: `One way you can act against cyberbullying is by pressing the
    <b>“Flag”</b> button.`,
    position: 'right',
    scrollTo: 'tooltip'
  },
  {
    element: 'a.flag',
    intro: `<b>Flagging</b> something will report it to the website and
    the bullying post will be taken down. Sometimes it takes a while for
    the website to respond.`,
    position: 'right',
    scrollTo: 'tooltip'
  },
  {
    element: '#step7',
    intro: `Another way you can act against cyberbullying is by writing
    a <b>supportive comment</b> to the target.`,
    position: 'left',
    scrollTo: 'tooltip'
  },
  {
    element: '#step7',
    intro: `Another way you can act against cyberbullying is by
    <b>confronting the bully</b>.`,
    position: 'left',
    scrollTo: 'tooltip'
  }
];


// {
//   let jqhxrArray = new Array(); // this array will be handed to Promise.all
//   let pathArray = window.location.pathname.split('/');
//   const subdirectory1 = pathArray[1]; // idenify the current page
//   const subdirectory2 = pathArray[2]; // idenify the current module
//   let startTimestamp = Date.now();
//
//   function startIntro(){
//     var intro = introJs().setOptions({
//       'hidePrev': true,
//       'hideNext': true,
//       'exitOnOverlayClick': false,
//       'showStepNumbers':false,
//       'showBullets':false,
//       'scrollToElement':true,
//       'doneLabel':'Done &#10003'
//     });
//
//     intro.setOptions({
//       steps: [
//         {
//           element: '#step1',
//           intro: `You have recently seen that some people keep saying mean
//           things about Dylan. A group of friends from school are bullying
//           Dylan on social media.`,
//           position: 'right',
//           scrollTo: 'tooltip'
//         },
//         {
//           element: '#step1',
//           intro: `<b>Cyberbullying</b> is when someone posts or shares
//           negative things about someone else online. <br>The <b>bully</b> may
//           use digital devices, sites, or apps. The bully often does this again
//           and again to the same person.`,
//           position: 'right',
//           scrollTo: 'tooltip'
//         },
//         {
//           element: '#step3.text',
//           intro: `This is an example of <b>cyberbullying.</b>`,
//           position: 'right',
//           scrollTo: 'tooltip'
//         },
//         {
//           element: 'a.flag',
//           intro: `One way you can act against cyberbullying is by pressing the
//           <b>“Flag”</b> button.`,
//           position: 'right',
//           scrollTo: 'tooltip'
//         },
//         {
//           element: 'a.flag',
//           intro: `<b>Flagging</b> something will report it to the website and
//           the bullying post will be taken down. Sometimes it takes a while for
//           the website to respond.`,
//           position: 'right',
//           scrollTo: 'tooltip'
//         },
//         {
//           element: '#step7',
//           intro: `Another way you can act against cyberbullying is by writing
//           a <b>supportive comment</b> to the target.`,
//           position: 'left',
//           scrollTo: 'tooltip'
//         },
//         {
//           element: '#step7',
//           intro: `Another way you can act against cyberbullying is by
//           <b>confronting the bully</b>.`,
//           position: 'left',
//           scrollTo: 'tooltip'
//         },
//
//       ]
//     });
//
//     // ************ logging the time spent on each tutorial box ****************
//
//     /*
//     onbeforechange:
//     "Given callback function will be called before starting a new step of
//     introduction. The callback function receives the element of the new step as
//     an argument."
//     */
//     intro.onbeforechange(function(){
//       // ._currentStep has the number of the NEXT tutorial box you're moving toward.
//       // However, we want to know the number of the step we are LEAVING.
//       // We can use ._direction to determine if we are going forward or backward,
//       // and then subtract/add accordingly to get the number we want.
//       let leavingStep = 0;
//       if($(this)[0]._direction === "forward") {
//         leavingStep = ($(this)[0]._currentStep - 1);
//       } else if ($(this)[0]._direction === "backward"){
//         leavingStep = ($(this)[0]._currentStep + 1);
//       } else {
//         console.log(`There was an error in calculating the step number.`);
//       }
//       let totalTimeOpen = Date.now() - startTimestamp;
//       let cat = new Object();
//       cat.subdirectory1 = subdirectory1;
//       cat.subdirectory2 = subdirectory2;
//       cat.stepNumber = leavingStep;
//       cat.viewDuration = totalTimeOpen;
//       cat.absoluteStartTime = startTimestamp;
//       // Check that leavingStep is a legitimate number. -1 seems to occur whenever
//       // the page is loaded, or when the back button is used - we don't want to
//       // record those occurrences.
//       if(leavingStep !== -1){
//         const jqxhr = $.post("/introjsStep", {
//           action: cat,
//           _csrf: $('meta[name="csrf-token"]').attr('content')
//         });
//         jqhxrArray.push(jqxhr);
//       }
//     });
//
//     /*
//     onafterchange:
//     "Given callback function will be called after starting a new step of
//     introduction. The callback function receives the element of the new step as
//     an argument."
//     */
//     intro.onafterchange(function(){
//       // reset the timestamp for the next step
//       startTimestamp = Date.now();
//     })
//
//     /*
//     onbeforexit:
//     "Works exactly same as onexit but calls before closing the tour. Also,
//     returning false would prevent the tour from closing."
//     */
//     intro.onbeforeexit(function(){
//       let leavingStep = $(this)[0]._currentStep;
//       // edge case: current step will = -1 when the user leaves the page using
//       // something like the back button. Don not record that.
//       let totalTimeOpen = Date.now() - startTimestamp;
//       let cat = new Object();
//       cat.subdirectory1 = subdirectory1;
//       cat.subdirectory2 = subdirectory2;
//       cat.stepNumber = leavingStep;
//       cat.viewDuration = totalTimeOpen;
//       cat.absoluteStartTime = startTimestamp;
//       const jqxhr = $.post("/introjsStep", {
//         action: cat,
//         _csrf: $('meta[name="csrf-token"]').attr('content')
//       });
//       jqhxrArray.push(jqxhr);
//       // this is the last step in the module, so change pages once all Promises
//       // are completed
//       Promise.all(jqhxrArray).then(function() {
//         // double check this location for each module - not always the same
//         window.location.href = `/tut_guide/${subdirectory2}`
//       });
//     })
//
//     // ************************************************************************
//
//     // start the intro
//     intro.start();
//   };
//
//   $(window).on("load", function() {
//     startIntro();
//   });
//
// }
