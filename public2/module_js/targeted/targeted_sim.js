function showHelp(){
  if($('#removeHidden').is(":hidden")){
    if(literacy_counter != 5){
      //user does not know to click blue dots
      $('#removeHidden').transition('fade');
    }
  }
};

function startIntro(){

  var hints;
   literacy_counter = 0;
  clickCount = 0;
  var intro = introJs().setOptions({ 'hidePrev': true, 'hideNext': true, 'exitOnOverlayClick': false, 'showStepNumbers':false, 'showBullets':false, 'scrollToElement':true, 'doneLabel':'Done &#10003' });
    intro.setOptions({
      steps: [
        {
          element: document.querySelectorAll('#blueDotStep')[0],
          intro: "This is the social media timeline of Hannah, a middle school student. One of Hannah’s favorite hobbies is playing the guitar.",
          scrollTo: 'tooltip',
          position: 'right'
        },
        {
          element: document.querySelectorAll('#blueDotStep')[0],
          intro: " Recently, she has been watching guitar tutorials on YouTube and looking up cool guitar brands on Google.",
          scrollTo: 'tooltip',
          position: 'right'
        },
        {
          element: document.querySelectorAll('#blueDotStep')[0],
          intro: "In this activity, you will see how targeted advertisements work. Click on the blue dots&nbsp;<a role='button' tabindex='0' class='introjs-hint'><div class='introjs-hint-dot'></div><div class='introjs-hint-pulse'></div></a> &nbsp; &nbsp; &nbsp;to learn more...",
          scrollTo: 'tooltip',
          position: 'right'
        }

      ]
    });
    intro.start().onexit(function() {

      //Activate the dropdown
      $('.ui.dropdown.icon.item').dropdown({
        duration: 300
      });

      $('.ui.accordion')
       .accordion();

      //Adding functionality to the dropdown
      $('.ui.dropdown.icon.item')
       .dropdown({
         onChange: function() {
           var dropdownSelection = $(this).data().value
           if(dropdownSelection == 0){
             $(".inverted.dimmer").css("background-color","rgba(211,211,211,0.95)");
             //hide the post
             $('input[type=checkbox]').prop('checked',false);
             var post = $(this).closest(".ui.fluid.card.dim");
             var postID = post.attr("postID");
             // console.log("***********HIDE: post " + postID);
             post.find(".ui.inverted.dimmer.notflag").dimmer({
               closable: false
             }).dimmer('show')
             //repeat to ensure its closable
             post.find(".ui.inverted.dimmer.notflag").dimmer({
               closable: true
             })
               .dimmer('show');
             //open hida ad Modal
             $("#hideAdModal").modal('show');

           } else if (dropdownSelection == 1){
             //flag the post
             var post = $(this).closest(".ui.fluid.card.dim");
             var postID = post.attr("postID");
             // console.log("***********FLAG: post " + postID);
             post.find(".ui.dimmer.flag").dimmer({
               closable: false
             })
               .dimmer('show');
             //repeat to ensure its closable
             post.find(".ui.dimmer.flag").dimmer({
               closable: true
             })
               .dimmer('show');

           } else if (dropdownSelection == 2){
             //get the company name to dynamically use in the modal
             var companyName = $(this).closest(".ui.fluid.card.dim").find("#companyName").text();
             //open info modal
             $("#whyAmISeeingThisAdModal .content").html(
               "<p>Hannah is seeing this ad because <b>"+companyName+"</b> wanted to reach people interested in <b>guitars</b>.</p>" +
               "<p>This is based on what Hannah does on TestDrive, such as pages she has visited and search terms she has clicked on.</p>"+
               "<br>" +
               "<div class='actions'>" +
               "<div class='ui positive right labeled icon button'>Done" +
               "<i class='checkmark icon'></i></div></div>"
             );
             $("#whyAmISeeingThisAdModal").modal('show');

           }
         }
       });

      hints = introJs().addHints();

      //for providing guidance message
      hints.onhintclick(function() {
          clickCount++;
          if(clickCount >= 5){
            //show the guidance message, user probably doesn't know to click "got it"
            if($('#removeHidden').is(":hidden")){
              $('#removeHidden').transition('fade');
            } else {
              $('#removeHidden').transition('bounce');
            }
          }
      });

      hints.onhintclose(function(e) {
       literacy_counter++;
       clickCount = 0;
       if($('#removeHidden').is(":visible")){
         $('#removeHidden').transition('fade');
       }
       if(literacy_counter == 5) {
         if($('#clickAllDotsWarning').is(':visible')){
           $('#clickAllDotsWarning').transition('fade');
         }
         $( ".cybertrans" ).addClass("green");
       }
     });

     setInterval(function (){showHelp()},120000);
  });

  //error messaging
  $('#cyberTransButton').on('click', function() {
    if(literacy_counter != 5){
      //show the message normally the first time
      if($('#clickAllDotsWarning').is(":hidden")){
        $('#clickAllDotsWarning').transition('fade');
      }else{
        //otherwise, bounce the message to draw attention to it
        $('#clickAllDotsWarning').transition('bounce');
      }
    }
  });

};

$(window).on("load", function() {startIntro();});
