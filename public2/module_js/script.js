//Convenient variable to indicate which module we're in
let pathArray = window.location.pathname.split('/');
var currentModule = pathArray[2];

// Function that records popup modal data once it is closed
// Requires the data-modalName attribute string as a parameter
function recordModalInputs(modalNameAttrStr) {
  let target = $(event.target);
  const postNumber = target.closest('.ui.card').attr('postNumber');
  const post = target.closest(".ui.fluid.card");
  const postID = post.attr("postID");
  const modalOpenedTime = Date.now();
  let checkboxInputs = 0b0;

  $(`.ui.modal[data-modalName=${modalNameAttrStr}] .ui.checkbox`).removeClass("checked");
  $('input[type=checkbox]').prop('checked',false);

  $(`.ui.modal[data-modalName=${modalNameAttrStr}]`).modal({
    closable: false,
    onHide: function(){

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
         postID: postID,
         modalName: modalName,
         modalOpenedTime: modalOpenedTime,
         modalViewTime: modalViewTime,
         modalCheckboxesCount: numberOfCheckboxes,
         modalCheckboxesInput: checkboxInputs,
         _csrf: $('meta[name="csrf-token"]').attr('content')
       });
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

//Activating the sticky functionality for the left column
//$('.ui.sticky.sideMenu').sticky();

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
$('.big.plus.icon').css({"display": "block"})
$('.ui.simple.dropdown.item').css({"display":"inherit"})
$('.ui.accordion').accordion();


/**
* Code to open modals, sorted by corresponding module
*/

// digital-literacy

$('.openPostDigitalLiteracy').on('click', function(){
  recordModalInputs('digital-literacy_articleModal');
});

$(".modual.info_button").click(function () {
  recordModalInputs('digital-literacy_articleInfoModal');
  document.getElementById('post_info_text_modual').innerHTML = $(this).data('info_text');
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
  recordModalInputs('esteem_postModal');
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

$(window).on("load", function() {openChat()});

/**
 * End chat box code
 */
