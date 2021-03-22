$(document).ready(function(){

  $('.ui.sticky.newPostSticky')
    .sticky({
      context: '#content',
      offset: 90
    });

  //activating a normal dropdown (the one used in the habits module settings)
  $('.ui.selection.dropdown[name="pauseTimeSelect"]').dropdown('set selected', '1 hour');
  $('.ui.selection.dropdown[name="reminderTimeSelect"]').dropdown();

  /*
  * Misc code
  */
  $('.newpost').css({"visibility": "visible"})
  $('.ui.simple.dropdown.item').css({"display":"inherit"})
  $('.ui.accordion').accordion();

  //hiding the pause time select unless pause is turned on (in notification settings)
  $(".ui.toggle.checkbox[name='popupAlertsCheckbox']").change(function() {
   console.log("CHANGE");
   if($("input[name='popupAlerts']").is(":checked")){
     $('#pauseTimeSelectField').show();
   } else {
     $('#pauseTimeSelectField').hide();
   }
  });
});

// function recordNewViewTime(windowLocation){
//   console.log("CALLED");
//   var currentTime = Date.now();
//   var totalViewTime = currentTime - freePlayPageViewTimer;
//   $.post("/habitsTimer", { habitsTimer: totalViewTime,
//    _csrf : $('meta[name="csrf-token"]').attr('content')});
// };

function recordNewViewTime(windowLocation){
  console.log("CALLED");
  var currentTime = Date.now();
  var totalViewTime = currentTime - freePlayPageViewTimer;
  $.post("/habitsTimer", { habitsTimer: totalViewTime, _csrf : $('meta[name="csrf-token"]').attr('content') }).then(function(){
    if(windowLocation !== undefined){
      window.location.href = windowLocation;
    }
  });
};

//$(window).on('beforeunload', recordNewViewTime);
//window.addEventListener('beforeunload', recordNewViewTime);

function goToActivityPage(){
  $('.habitsHomeDisplay').hide();
  $('.habitsNotificationsDisplay').hide();
  $('.habitsNotificationItem').hide();
  $('.habitsSettingsDisplay').hide();
};

function updateActivityTimeDisplay(){
  activityDisplayTimeMinutes = Math.floor((totalTimeViewedHabits + (Date.now() - freePlayPageViewTimer))/60000);
  activityDisplayTimeSeconds = Math.floor(((totalTimeViewedHabits + (Date.now() - freePlayPageViewTimer)) % 60000) / 1000);
  $('#habitsActivityTotalTimeMinutes').html(activityDisplayTimeMinutes);
  $('#habitsActivityTotalTimeSeconds').html(activityDisplayTimeSeconds);
  $('.habitsActivityDisplay').show();
};

function goToSettingsPage(){
  $('.habitsHomeDisplay').hide();
  $('.habitsNotificationsDisplay').hide();
  $('.habitsNotificationItem').hide();
  $('.habitsActivityDisplay').hide();
  $('.habitsSettingsDisplay').show();
};

function goToFeed(){
  $(".habitsSettingsDisplay").hide();
  $(".habitsActivityDisplay").hide();
  if($("#notificationsteps").hasClass("active")){
    $(".ui.red.right.pointing.label").hide();
    //hide any old notification popups
    $('.notificationPopup').hide();
  }
  $('.habitsHomeDisplay').show();
  $('.habitsNotificationsDisplay').hide();
  $('.habitsNotificationItem').hide();
  $("#feedsteps").addClass("active");
  $("#notificationsteps").removeClass("active");
};

function goToNotifications(){
  $(".habitsHomeDisplay").hide();
  $(".habitsSettingsDisplay").hide();
  $(".habitsActivityDisplay").hide();
  $(".habitsNotificationsDisplay").show();
  $("#feedsteps").removeClass("active");
  $("#notificationsteps").addClass("active");
  //hide any old notifications popups
  $('.notificationPopup').hide();
  $(".ui.red.right.pointing.label").hide();
};



var freePlayPageViewTimer = Date.now();
var totalTimeViewedHabits = 0;

//Send a new view time when the "let's continue" button is clicked
$('.ui.big.green.labeled.icon.button.script.habitsHomeDisplay').on('click', function(){
  recordNewViewTime('/results/habits');
});

//send a new time when an actor profile is visited
$('.actorLink').on('click', function(){
  recordNewViewTime();
});

$('.myProfileLink').on('click', function(){
  recordNewViewTime();
});

$('.habitsEditprofile').on('click', function(){
    var pathArray = window.location.pathname.split('/');
    var location = '/account/' + pathArray[2];
    recordNewViewTime(location);
})

$('.ui.small.post.modal').modal({
  onVisible: function() {
    recordNewViewTime();
  }
});

//creating the activity page, requires timer
$('.habitsActivityButton').on('click', function(){
  goToActivityPage();
  //get the current amount of time if we don't have it already
  var activityDisplayTimeMinutes = 0;
  var activityDisplayTimeSeconds = 0;
  if(totalTimeViewedHabits == 0){
    $.get( "/habitsTimer", function( data ) {
      totalTimeViewedHabits = data.totalTimeViewedHabits;
      updateActivityTimeDisplay();
    });
  }else{
    updateActivityTimeDisplay();
  }
});


/*
*code to make habits module UI work, swaps between various displays via hide/show of classes
*Also determine here which notifications to show in notification page based on time elapsed
*/

//show the settings page
$('.habitsSettingsButton').on('click',function(){goToSettingsPage();});

//making the side menu work
$(".ui.vertical.menu a.item").on('click', function(){
  $('.ui.vertical.menu a.item').removeClass('active');
  $(this).addClass('active');
  if($(this).data().value === 'feed'){
    goToFeed();
  } else if ($(this).data().value === 'notifications'){
    goToNotifications();
    //get the start time, i.e. when the user first opened the free-play section
    $.get( "/habitsTimer", function( data ) {
      var timeNow = Date.now();
      var habitsStart = data.startTime;
      var timeElapsed = timeNow - habitsStart;
      //determine which notifications to show
      $('.habitsNotificationItem').each(function(index){ //for each notification, check if it is within the time elapsed
        var notifTimestamp = parseInt($(this).find('.time.millisecondType').html(), 10);
        if(notifTimestamp < timeElapsed){
          $(this).find('.time.notificationTime').html(humanized_time_span(habitsStart + notifTimestamp));
          $(this).show();
        }
      });
    });
  }
});

//making the popup notifications work, have an interval set for every second to check if the popup should show.

$.get( "/habitsTimer", function( data ) {
  var timeElapsed = Date.now() - data.startTime;
  $.get('/habitsNotificationTimes', function (data){
    //get the array of timestamps for the notifications from the script, will be sorted from least to greatest
    var notificationTimestamps = data.notificationTimestamps;
    var notificationIndexCount = 0;
    //get the correct index based on when you open the page vs. when you started
    for(var j = 0; j < notificationTimestamps.length; j++){
      if(notificationTimestamps[j] > timeElapsed){
        notificationIndexCount = j;
        //got the right index, good to go. Start the interval now.
        function intervalFunction(){
          if(notificationTimestamps[notificationIndexCount] <= timeElapsed){
            //code to actually show popup in frontend
            //don't show popups in notifications window, only home
            if($('.ui.vertical.menu a.item.active').data().value == "feed"){
              //hide the mobile view popups if not in mobile view anymore
              if($('.ui.top.fixed.vertical.menu').is(':hidden')){
                $('#removeHiddenMobile').hide();
              }else{
                $('#removeHidden').hide();
              }
              var imageHref = "https://dhpd030vnpk29.cloudfront.net/profile_pictures/" + data.notificationPhoto[notificationIndexCount];
              $('.popupNotificationImage').attr("src",imageHref);
              $('.notificationPopup').attr("correspondingpost",data.notifCorrespondingPost[notificationIndexCount]);
              $('.ui.fixed.bottom.sticky.notificationPopup .summary').text(data.notificationText[notificationIndexCount]);
              $('.ui.fixed.bottom.sticky.notificationPopup .time').hide();
              //only show the popup and animate the bell if they aren't disabled in the settings
              if(!$("input[name='popupAlerts']").is(':checked')){
                $('.ui.red.right.pointing.label').transition('pulse');
                $('i.icon.bell').transition("tada");
                //if in a mobile view, put popup in the middle
                if($('.ui.top.fixed.vertical.menu').is(':visible')){
                  $('#removeHiddenMobile').removeClass('hidden').show();
                  $('#mobilePopup').transition('pulse');
                }else {
                  //else put popup on the side
                  $('#removeHidden').removeClass('hidden').show();
                  $('#desktopPopup').transition('pulse');
                }
              }
            }
            notificationIndexCount++;
            //stop the interval when we have gotten through all the notifications
            if(notificationIndexCount >= notificationTimestamps.length){
              clearInterval(setIntervalID);
              console.log("CLEARED INTERVAL!");
            }
          }
          timeElapsed = timeElapsed + 1000;
        };
        var setIntervalID = setInterval(intervalFunction,1000);
        break;
      }
      //if we don't find a timestamp that's greater than the time elapsed, there will not be any popup notifications and we don't need the interval.
    } //end for loop
  });
});


//notifications popup on click, show the corresponding post
$('.habitsNotificationItem, .notificationPopup').on('click', function(event){
  if ($(event.target).hasClass('close')){
    return false;
  }
  console.log("clicked item!");
  var relevantPostNumber = $(this).attr('correspondingPost');
  //show the relevant post in a popup modal
  var relevantPost = $('.ui.fluid.card.habitsHomeDisplay[postnumber="'+relevantPostNumber+'"]').clone().show();
  $('.ui.viewPolicyPopup.modal .ui.fluid.card').html(relevantPost);
  $('.ui.viewPolicyPopup.modal .ui.fluid.card').removeAttr('postnumber').show();
  $('.ui.viewPolicyPopup.modal .ui.fluid.card .content a').removeAttr('href').show();
  $('.viewPolicyPopup').modal('show');
  //lazy load the images
  $(".ui.viewPolicyPopup.modal .ui.fluid.card img")
  .visibility({
    type: 'image',
    offset: 0,
    onLoad: function (calculations) {
      $('.ui.viewPolicyPopup.modal .ui.fluid.card img').visibility('refresh');
    }
  });
});

/*
*end code for habits UI functionality
*/
