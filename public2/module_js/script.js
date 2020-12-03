//Convenient variable to indicate which module we're in
let pathArray = window.location.pathname.split('/');
var currentModule = pathArray[2];

//Activating the sticky functionality for the left column
//$('.ui.sticky.sideMenu').sticky();

//activating the "let's continue" button at the scrollToBottom
$('.ui.big.green.labeled.icon.button.script').on('click', function(){
  window.location.href = "/results/" + currentModule;
});

//activating a normal dropdown (the one used in the habits module settings)
$('.ui.selection.dropdown[name="pauseTimeSelect"]').dropdown('set selected', '1 hour');
$('.ui.selection.dropdown[name="reminderTimeSelect"]').dropdown();

/**
 * Code for ad dropdown functionality in targeted ads module
 */
$('.ui.dropdown.icon.item')
 .dropdown({
   onChange: function() {
     var dropdownSelection = $(this).data().value
     if(dropdownSelection == 0){
       $(".inverted.dimmer").css("background-color","rgba(211,211,211,0.95)");
       //hide the post
       var post = $(this).closest(".ui.fluid.card.dim");
       var postID = post.attr("postID");
       $.post("/feed", { postID: postID, flag: 1, _csrf: $('meta[name="csrf-token"]').attr('content') });
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
       $.post("/feed", { postID: postID, flag: 1, _csrf: $('meta[name="csrf-token"]').attr('content') });
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
       //get the ad type
       var adType = $("#whyAmISeeingThisAdModal").find(".content").attr("id");
       //open info modal, generate correct text based on ad type and company name
       $("#whyAmISeeingThisAdModal .content").html(
         "<p>You are seeing this ad because <b>"+companyName+"</b> wanted to reach people interested in <b>"+adType+"</b>.</p>" +
         "<p>This is based on what you have done on TestDrive, such as pages you have visited and search terms you have clicked on.</p>"+
         "<br>" +
         "<div class='actions'>" +
         "<div class='ui positive right labeled icon button'>Done" +
         "<i class='checkmark icon'></i></div></div>"
       );
       $("#whyAmISeeingThisAdModal").modal('show');
     }
   }
 });

 /**
  * End code for targeted ads dropdown functionality
  */

  /*
  * Misc code
  */
    $('.big.plus.icon').css({"display": "block"})
    $('.ui.simple.dropdown.item').css({"display":"inherit"})
    $('.ui.accordion').accordion();



  /**
   * Code to open modals
   */

    function openPost(){
      $('#next_steps_modual').find('.accordion').accordion('close', 0);
      $('#next_steps_modual').find('.accordion').accordion('close', 1);
      $('#next_steps_modual').find('.accordion').accordion('close', 2);
      $('#next_steps_modual').find('.accordion').accordion('close', 3);
      $('#next_steps_modual').modal('show');
    }

    function openPostDigfoot(){
      $('input[type=checkbox]').prop('checked',false);
      $('#digfoot_post_modual').modal('show');
    }

    function openPostEsteem(){
      $('.ui.accordion').accordion('open', 0);
      $('.ui.accordion').accordion('close', 1);
      $('input[type=checkbox]').prop('checked',false);
      $('#esteem_post_modal').modal('show');
    }

    $('.esteemModalNextButton').on('click', function(){
      $('.esteemModalSection2').click();
    });
  /**
   * End code to open modals
   */

/**
 * chat box code
 */

function setStickyElementsAdvancedlit(){
 $('.ui.sticky.newPostSticky')
   .sticky({
     context: '#content',
     offset: 115
   });
 $('.ui.sticky.sideMenuAdvancedlit')
   .sticky({
     context: '#content',
     offset: 115
   });
 $('.card .img.post img').off("load",setStickyElementsAdvancedlit);
}


$(window).on("load", function() {
  openChat();
  // wait for an image to load so that the width is correct before setting sticky elements
  // only an issue with advacedlit module
  if(currentModule === 'advancedlit'){
    $('.card .img.post img').on("load",setStickyElementsAdvancedlit);
  } else {
    $('.ui.sticky.newPostSticky')
      .sticky({
        context: '#content',
        offset: 115
      });
  }
});


  function openChat(){
    if(currentModule == "safe-posting"){
    setTimeout(function(){
        $($('#chatbox1 .chat-history')[0]).slideToggle(300, 'swing');
        $($('#chatbox1 .chat-message')[0]).slideToggle(300, 'swing');
        $('#chatbox1').slideToggle(300, 'swing');
        $($('#chatbox1 .chat-history')[0]).slideToggle(300, 'swing');
        $($('#chatbox1 .chat-message')[0]).slideToggle(300, 'swing');

      }, 10000);

    setTimeout(function(){

        $($('#chatbox2 .chat-history')[0]).slideToggle(300, 'swing');
        $($('#chatbox2 .chat-message')[0]).slideToggle(300, 'swing');
        $('#chatbox2').slideToggle(300, 'swing');
        $($('#chatbox2 .chat-history')[0]).slideToggle(300, 'swing');
        $($('#chatbox2 .chat-message')[0]).slideToggle(300, 'swing');

      }, 20000);
    }
  }

/**
 * End chat box code
 */
