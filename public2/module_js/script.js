// const stepsList = [
//   {
//     element: '#newpost',
//     intro: `Click here to create your own post on the timeline.`,
//     highlightClass: 'stickyTooltip',
//     position: 'right',
//     scrollTo: 'tooltip',
//     audioFile: ['']
//   },
//   {
//     element: '.ui.button.like:first-of-type',
//     intro: `Click this button to "like" any post.`,
//     position: 'right',
//     scrollTo: 'tooltip',
//     audioFile: ['']
//   },
//   {
//     element: '.ui.card .extra.content .ui.input:first-of-type',
//     intro: `Click here to make a comment on any post.`,
//     position: 'right',
//     scrollTo: 'tooltip',
//     audioFile: ['']
//   }
// ]

//Convenient variable to indicate which module we're in
let pathArray = window.location.pathname.split('/');
var currentModule = pathArray[2];

// Function that records popup modal data once it is closed
// Requires the data-modalName attribute string as a parameter
function recordModalInputs(modalNameAttrStr) {
  let target = $(event.target);
  const post = target.closest(".ui.card");
  const postID = post.attr("postID");
  const modalOpenedTime = Date.now();
  let checkboxInputs = 0b0;

  $(`.ui.modal[data-modalName=${modalNameAttrStr}] .ui.checkbox`).removeClass("checked");
  $('input[type=checkbox]').prop('checked',false);

  $(`.ui.modal[data-modalName=${modalNameAttrStr}]`).modal({
    allowMultipe: false,
    closable: false,
    onVisible: function(){
      switch(modalNameAttrStr){
        case 'digital-literacy_articleModal':
          Voiceovers.playVoiceover(['CUSML.misc_02.mp3'])
          break;
        case 'digital-literacy_flagModal':
          Voiceovers.playVoiceover(['CUSML.misc_03.mp3'])
          break;
        case 'digfoot_normalPostModal':
          Voiceovers.playVoiceover(['CUSML.misc_04.mp3'])
          break;
        case 'esteem_postModal1':
          Voiceovers.playVoiceover(['CUSML.misc_07.mp3'])
          break;
        case 'esteem_simPostModal1':
          Voiceovers.playVoiceover(['CUSML.misc_05.mp3'])
          break;
      }
    },
    onHide: function(){
      Voiceovers.pauseVoiceover();
      const modalClosedTime = Date.now();
      const modalViewTime = modalClosedTime - modalOpenedTime;
      const modalName = $(this).attr('data-modalName');
      let numberOfCheckboxes = 0;

      $(`.ui.modal[data-modalName=${modalNameAttrStr}] .ui.checkbox input`).each(function(){
        numberOfCheckboxes++;
        if ($(this).is(":checked")){
          checkboxInputs = checkboxInputs << 1;
          checkboxInputs++;
        } else {
          checkboxInputs = checkboxInputs << 1;
        }
      });

       $.post("/feed", {
         actionType: 'free play',
         postID: postID,
         modual: currentModule,
         modalName: modalName,
         modalOpenedTime: modalOpenedTime,
         modalViewTime: modalViewTime,
         modalCheckboxesCount: numberOfCheckboxes,
         modalCheckboxesInput: checkboxInputs,
         _csrf: $('meta[name="csrf-token"]').attr('content')
       });
    },
    // the following is only relevant in the esteem module:
    onHidden: function(){
      if (modalNameAttrStr === "esteem_simPostModal1" || modalNameAttrStr === "esteem_postModal1" ){
        // if the user has selected a NEGATIVE emotion (indicated by the binary number),
        // show the second module after the first one closes.
        if ((checkboxInputs & 0b001101110) !== 0) {
          const secondModalNameAttr = modalNameAttrStr.replace('1','2');
          const secondModalOpenedTime = Date.now();
          $(`.ui.modal[data-modalName=${secondModalNameAttr}]`).modal({
            allowMultipe: false,
            closable: false,
            onVisible: function(){
              if (secondModalNameAttr.includes('sim')) {
                Voiceovers.playVoiceover(['CUSML.misc_06.mp3'])
              } else {
                Voiceovers.playVoiceover(['CUSML.misc_07.mp3'])
              }
            },
            onHide: function(){
              Voiceovers.pauseVoiceover();
              const modalClosedTime = Date.now();
              const modalViewTime = modalClosedTime - secondModalOpenedTime;
              const pathArrayForHeader = window.location.pathname.split('/');
              const currentModule = pathArrayForHeader[2];
              const modalName = $(this).attr('data-modalName');
              let numberOfCheckboxes = 0;
              let checkboxInputs2 = 0b0;
              $(`.ui.modal[data-modalName=${secondModalNameAttr}] .ui.checkbox input`).each(function(){
                numberOfCheckboxes++;
                if ($(this).is(":checked")){
                  checkboxInputs2 = checkboxInputs2 << 1; // shift left and add 1 to mark true
                  checkboxInputs2++;
                } else {
                  checkboxInputs2 = checkboxInputs2 << 1; //shift left
                }
              });
              $.post("/feed", {
                actionType: 'free play',
                postID: postID,
                modual: currentModule,
                modalName: modalName,
                modalOpenedTime: secondModalOpenedTime,
                modalViewTime: modalViewTime,
                modalCheckboxesCount: numberOfCheckboxes,
                modalCheckboxesInput: checkboxInputs2,
                _csrf: $('meta[name="csrf-token"]').attr('content')
              });
            }
          }).modal('show');
        }
      }
    }
  }).modal('show');
};

// opens the chat boxes in the safe-posting module
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

// this function handles the dropdown menu on targeted ads
function targetedAdDropdownSelection(){
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
    //open hide ad Modal
    recordModalInputs('targeted_hideAdModal');
    //$("#hideAdModal").modal('show');

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
    recordModalInputs('targeted_whyAdModal');
    //$("#whyAmISeeingThisAdModal").modal('show');
  }
};

// activating the "let's continue" button at the scrollToBottom
$('.ui.big.green.labeled.icon.button.script').on('click', function(){
  window.location.href = "/results/" + currentModule;
});

// activating a normal dropdown (the one used in the habits module settings)
$('.ui.selection.dropdown[name="pauseTimeSelect"]').dropdown('set selected', '1 hour');
$('.ui.selection.dropdown[name="reminderTimeSelect"]').dropdown();

// dropdown menu functionality in the targeted ads module
$('.ui.dropdown.icon.item')
 .dropdown({
   onChange: targetedAdDropdownSelection
 });


/*
* Misc code
*/
$('.newpost').css({"visibility": "visible"})
$('.ui.simple.dropdown.item').css({"display":"inherit"})
$('.ui.accordion').accordion();


/**
* Code to open modals, sorted by corresponding module
*/

// digital-literacy

$('.openPostDigitalLiteracy').on('click', function(){
  recordModalInputs('digital-literacy_articleModal');
});

$(".modual.info_button").click(function (e) {
  recordModalInputs('digital-literacy_articleInfoModal');
  document.getElementById('post_info_text_modual').innerHTML = $(this).data('info_text');
  e.stopPropagation();
});

// digfoot

$('.openPostDigfoot').on('click', function(){
  recordModalInputs('digfoot_normalPostModal')
});

// esteem
$('.openPostEsteem').on('click', function(){
  // $('.ui.accordion').accordion('open', 0);
  // $('.ui.accordion').accordion('close', 1);
  // $('input[type=checkbox]').prop('checked',false);
  recordModalInputs('esteem_postModal1');
});
//
// function openPostEsteem(){
//   $('.ui.accordion').accordion('open', 0);
//   $('.ui.accordion').accordion('close', 1);
//   $('input[type=checkbox]').prop('checked',false);
//   $('#esteem_post_modal').modal('show');
// }

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
      offset: 90
    });
  $('.ui.sticky.sideMenuAdvancedlit')
    .sticky({
      context: '#content',
      offset: 90
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
        offset: 90
      });
  }

});

/**
 * End chat box code
 */
