//Convenient variable to indicate which module we're in
let pathArray = window.location.pathname.split('/');
var currentModule = pathArray[2];


//activating a normal dropdown (the one used in the habits module settings)
$('.ui.selection.dropdown[name="pauseTimeSelect"]').dropdown('set selected', '1 hour');
$('.ui.selection.dropdown[name="reminderTimeSelect"]').dropdown();

/*
* Misc code
*/
  $('.big.plus.icon').css({"display": "block"})
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

   /**
    * Implementing timer for habits module, and activity page, only want this to occur in habits module
    */

    console.log("current Module: "+currentModule);
    if(currentModule === "habits"){
      //Timing how long the user looks at this page
      //from https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API

      // Set the name of the hidden property and the change event for visibility
      var hidden, visibilityChange;

      if (typeof document.hidden !== "undefined") { // Opera 12.10 and Firefox 18 and later support
        hidden = "hidden";
        visibilityChange = "visibilitychange";
      } else if (typeof document.msHidden !== "undefined") {
        hidden = "msHidden";
        visibilityChange = "msvisibilitychange";
      } else if (typeof document.webkitHidden !== "undefined") {
        hidden = "webkitHidden";
        visibilityChange = "webkitvisibilitychange";
      }

      // If the page is hidden, stop the timer and push total time in db
      // if the page is shown, start the timer (i.e. get the current time)

      var freePlayPageViewTimer = Date.now();

      function handleVisibilityChange() {
        if (document[hidden]) {
          var currentTime = Date.now();
          var totalViewTime = currentTime - freePlayPageViewTimer;
          //post to db
          $.post("/habitsTimer", { habitsTimer: totalViewTime, _csrf : $('meta[name="csrf-token"]').attr('content') } );
        } else {
          //start the timer
          freePlayPageViewTimer = Date.now();
        }
      }

      //also send a new time stamp when the "let's continue" button is clicked, since the post request gets cancelled on page change
      $('.ui.big.green.labeled.icon.button.script.habitsHomeDisplay').on('click', function(){
        var freePlayPageViewTimer = Date.now();
        var currentTime = Date.now();
        var totalViewTime = currentTime - freePlayPageViewTimer;
        $.post("/habitsTimer", { habitsTimer: totalViewTime, _csrf : $('meta[name="csrf-token"]').attr('content') }, function(){
          window.location.href = '/results/habits';
        });
      })

      //creating the activity page, requires timer
      $('.habitsActivityButton').on('click', function(){
        $('.habitsHomeDisplay').hide();
        $('.habitsNotificationsDisplay').hide();
        $('.habitsNotificationItem').hide();
        $('.habitsSettingsDisplay').hide();
        //get the current amount of time
        $.get( "/habitsTimer", function( data ) {
          var activityDisplayTimeMinutes = Math.floor((data.totalTimeViewedHabits + (Date.now() - freePlayPageViewTimer))/60000);
          var activityDisplayTimeSeconds = Math.floor(((data.totalTimeViewedHabits + (Date.now() - freePlayPageViewTimer)) % 60000) / 1000);
          $('#habitsActivityTotalTimeMinutes').html(activityDisplayTimeMinutes);
          $('#habitsActivityTotalTimeSeconds').html(activityDisplayTimeSeconds);
          $('.habitsActivityDisplay').show();
        });
      });

      // Handle page visibility change
      document.addEventListener(visibilityChange, handleVisibilityChange, false);
    }
  /**
   * End timer implementation and activity page for habits module
   */




   /*
   *code to make habits module UI work, swaps between various displays via hide/show of classes
   *could attempt to improve this with use of semantic ui tabs,
   *or could make 4 separate pages rather than keeping it all on one, did this to minimize amount of data needed to pass
   *but in hindsight it probably did not save much effort.
   *Also determine here which notifications to show in notification page based on time elapsed
   */

     //show the settings page

     $('.habitsSettingsButton').on('click',function(){
       $('.habitsHomeDisplay').hide();
       $('.habitsNotificationsDisplay').hide();
       $('.habitsNotificationItem').hide();
       $('.habitsActivityDisplay').hide();
       $('.habitsSettingsDisplay').show();
     });

     //making the side menu work
     //this code in particular could be improved with the use of tabs or multiple pages

     $(".ui.vertical.menu a.item").on('click', function(){
       $('.ui.vertical.menu a.item').removeClass('active');
       $(this).addClass('active');
       if($(this).data().value === 'feed'){
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

       } else if ($(this).data().value === 'notifications'){
         $(".habitsHomeDisplay").hide();
         $(".habitsSettingsDisplay").hide();
         $(".habitsActivityDisplay").hide();
         $(".habitsNotificationsDisplay").show();
         $("#feedsteps").removeClass("active");
         $("#notificationsteps").addClass("active");
         //hide any old notifications popups
         $('.notificationPopup').hide();
         $(".ui.red.right.pointing.label").hide();
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

     if(currentModule === "habits"){
       $.get( "/habitsTimer", function( data ) {
         var timeElapsed = Date.now() - data.startTime;
         console.log("TIME ELAPSED: " + timeElapsed);
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
     }

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
       $('.viewPolicyPopup').modal('show');
       //lazy load the images
       $(".ui.viewPolicyPopup.modal .ui.fluid.card img")
       .visibility({
         type: 'image',
         offset: 0,
         onLoad: function (calculations) {
           $('.ui.viewPolicyPopup.modal .ui.fluid.card img').visibility('refresh');
         }
       })
       ;

     });

     /*
     *end code for habits UI functionality
     */
