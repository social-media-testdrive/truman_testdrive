$(document).ready(function() {
    //Activate and set dropdown (in the Settings tab)
    $('.ui.selection.dropdown[name="pauseTimeSelect"]').dropdown('set selected', '1 hour');

    //Hide the pause time select field unless pause is turned on (in Settings tab)
    $(".ui.toggle.checkbox[name='popupAlertsCheckbox']").change(function() {
        let cat = {
            subdirectory1: 'modual',
            subdirectory2: 'habits',
            absoluteTimestamp: Date.now(),
            actionType: 'togglePauseNotifications'
        };

        if ($("input[name='popupAlerts']").is(":checked")) {
            $('#pauseTimeSelectField').show();
            cat.setValue = 'pause';
        } else {
            $('#pauseTimeSelectField').hide();
            cat.setValue = 'unpause';
        }

        $.post("/habitsAction", {
            action: cat,
            actionType: 'habits',
            _csrf: $('meta[name="csrf-token"]').attr('content')
        });
    });

    //If "set daily reminder" value is changed
    $(".ui.selection.dropdown[name='reminderTimeSelect']").change(function() {
        const cat = {
            subdirectory1: 'modual',
            subdirectory2: 'habits',
            absoluteTimestamp: Date.now(),
            actionType: 'setDailyReminder',
            setValue: $("#reminderTimeSelectValue").val()
        };

        $.post("/habitsAction", {
            action: cat,
            actionType: 'habits',
            _csrf: $('meta[name="csrf-token"]').attr('content')
        });
    });

    //If "pause notifications" value is changed
    $(".ui.selection.dropdown[name='pauseTimeSelect']").change(function() {
        const cat = {
            subdirectory1: 'modual',
            subdirectory2: 'habits',
            absoluteTimestamp: Date.now(),
            actionType: 'setPauseNotifications',
            setValue: $("#pauseTimeSelectValue").val()
        };

        $.post("/habitsAction", {
            action: cat,
            actionType: 'habits',
            _csrf: $('meta[name="csrf-token"]').attr('content')
        });
    });
});

// Record a new time duration on habits module free play page
async function recordNewViewTime() {
    const currentTime = Date.now();
    const totalViewTime = currentTime - freePlayPageViewTimer;
    await $.post("/habitsTimer", { habitsTimer: totalViewTime, _csrf: $('meta[name="csrf-token"]').attr('content') })
        .catch(function(err) {
            console.log(err);
        });;
};

// Go to My Activity tab: Hide all other elements
function goToActivityPage() {
    $('.habitsHomeDisplay').hide();
    $('.habitsNotificationsDisplay').hide();
    $('.habitsNotificationItem').hide();
    $('.habitsSettingsDisplay').hide();
};

// Update the user's activity time display
function updateActivityTimeDisplay() {
    activityDisplayTimeMinutes = Math.floor((totalTimeViewedHabits + (Date.now() - freePlayPageViewTimer)) / 60000);
    activityDisplayTimeSeconds = Math.floor(((totalTimeViewedHabits + (Date.now() - freePlayPageViewTimer)) % 60000) / 1000);
    $('#habitsActivityTotalTimeMinutes').html(activityDisplayTimeMinutes);
    $('#habitsActivityTotalTimeSeconds').html(activityDisplayTimeSeconds);
    $('.habitsActivityDisplay').show();
};

// Go to Settings tab: Hide all other elements
function goToSettingsPage() {
    $('.habitsHomeDisplay').hide();
    $('.habitsNotificationsDisplay').hide();
    $('.habitsNotificationItem').hide();
    $('.habitsActivityDisplay').hide();
    $('.habitsSettingsDisplay').show();
};

// Go to Feed: Hide all other elements
function goToFeed() {
    $(".habitsSettingsDisplay").hide();
    $(".habitsActivityDisplay").hide();
    if ($("#notificationsteps").hasClass("active")) {
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

// Go to Notifications tab: Hide all other elements
function goToNotifications() {
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

const freePlayPageViewTimer = Date.now();
let totalTimeViewedHabits = 0;

$(window).on("load", function() {
    /**
     * Code to make habits module UI work, swaps between various displays via hide/show of classes.
     * Also determine here which notifications to show in notification page based on time elapsed.
     */
    // Show the My Activity tab, requires timer
    $('.habitsActivityButton').on('click', function() {
        goToActivityPage();
        // Get the current amount of time if we don't have it already
        if (totalTimeViewedHabits == 0) {
            $.get("/habitsTimer", function(data) {
                totalTimeViewedHabits = data.totalTimeViewedHabits;
                updateActivityTimeDisplay();
            });
        } else {
            updateActivityTimeDisplay();
        }

        const cat = {
            subdirectory1: 'modual',
            subdirectory2: 'habits',
            absoluteTimestamp: Date.now(),
            actionType: 'clickMyActivityTab'
        };

        $.post("/habitsAction", {
            action: cat,
            actionType: 'habits',
            _csrf: $('meta[name="csrf-token"]').attr('content')
        });
    });

    // Show the Settings page
    $('.habitsSettingsButton').on('click', function() {
        goToSettingsPage();

        const cat = {
            subdirectory1: 'modual',
            subdirectory2: 'habits',
            absoluteTimestamp: Date.now(),
            actionType: 'clickSettingsTab'
        };

        $.post("/habitsAction", {
            action: cat,
            actionType: 'habits',
            _csrf: $('meta[name="csrf-token"]').attr('content')
        });
    });

    // Functionality for the side menu
    $(".ui.vertical.menu a.item").on('click', function() {
        $('.ui.vertical.menu a.item').removeClass('active');
        $(this).addClass('active');

        if ($(this).data().value === 'feed') {
            goToFeed();
        } else if ($(this).data().value === 'notifications') {
            goToNotifications();

            const cat = {
                subdirectory1: 'modual',
                subdirectory2: 'habits',
                absoluteTimestamp: Date.now(),
                actionType: 'clickNotificationsTab'
            };

            //get the start time, i.e. when the user first opened the free-play section
            $.get("/habitsTimer", function(data) {
                const timeNow = Date.now();
                const habitsStart = data.startTime;
                const timeElapsed = timeNow - habitsStart;
                //determine which notifications to show
                $('.habitsNotificationItem').each(function(index) { //for each notification, check if it is within the time elapsed
                    const notifTimestamp = parseInt($(this).find('.time.millisecondType').html(), 10);
                    if (notifTimestamp < timeElapsed) {
                        $(this).find('.time.notificationTime').html(humanized_time_span(habitsStart + notifTimestamp));
                        $(this).show();
                    }
                });
            });

            $.post("/habitsAction", {
                action: cat,
                actionType: 'habits',
                _csrf: $('meta[name="csrf-token"]').attr('content')
            });
        }
    });

    // Functionality for popup notifications, have an interval set for every second to check if the popup should show.
    $.get("/habitsTimer", function(data) {
        let timeElapsed = Date.now() - data.startTime;
        $.get('/habitsNotificationTimes', function(data) {
            //get the array of timestamps for the notifications from the script, will be sorted from least to greatest
            const notificationTimestamps = data.notificationTimestamps;
            let notificationIndexCount = 0;
            //get the correct index based on when you open the page vs. when you started
            for (var j = 0; j < notificationTimestamps.length; j++) {
                if (notificationTimestamps[j] > timeElapsed) {
                    notificationIndexCount = j;
                    //got the right index, good to go. Start the interval now.
                    function intervalFunction() {
                        if (notificationTimestamps[notificationIndexCount] <= timeElapsed) {
                            //code to actually show popup in frontend
                            //don't show popups in notifications window, only home
                            if ($('.ui.vertical.menu a.item.active').data().value == "feed") {
                                //hide the mobile view popups if not in mobile view anymore
                                if ($('.ui.top.fixed.vertical.menu').is(':hidden')) {
                                    $('#removeHiddenMobile').hide();
                                } else {
                                    $('#removeHidden').hide();
                                }
                                const imageHref = "https://dhpd030vnpk29.cloudfront.net/profile_pictures/" + data.notificationPhoto[notificationIndexCount];
                                $('.popupNotificationImage').attr("src", imageHref);
                                $('.notificationPopup').attr("correspondingpost", data.notifCorrespondingPost[notificationIndexCount]);
                                $('.ui.fixed.bottom.sticky.notificationPopup .summary').text(data.notificationText[notificationIndexCount]);
                                $('.ui.fixed.bottom.sticky.notificationPopup .time').hide();
                                //only show the popup and animate the bell if they aren't disabled in the settings
                                if (!$("input[name='popupAlerts']").is(':checked')) {
                                    $('.ui.red.right.pointing.label').transition('pulse');
                                    $('i.icon.bell').transition("tada");
                                    //if in a mobile view, put popup in the middle
                                    if ($('.ui.top.fixed.vertical.menu').is(':visible')) {
                                        $('#removeHiddenMobile').removeClass('hidden').show();
                                        $('#mobilePopup').transition('pulse');
                                    } else {
                                        //else put popup on the side
                                        $('#removeHidden').removeClass('hidden').show();
                                        $('#desktopPopup').transition('pulse');
                                    }
                                }
                            }
                            notificationIndexCount++;
                            //stop the interval when we have gotten through all the notifications
                            if (notificationIndexCount >= notificationTimestamps.length) {
                                clearInterval(setIntervalID);
                            }
                        }
                        timeElapsed = timeElapsed + 1000;
                    };
                    const setIntervalID = setInterval(intervalFunction, 1000);
                    break;
                }
                //if we don't find a timestamp that's greater than the time elapsed, there will not be any popup notifications and we don't need the interval.
            } //end for loop
        });
    });

    // Notification card or notification poup is clicked. Show the corresponding post
    $('.habitsNotificationItem, .notificationPopup').on('click', function(event) {
        if ($(event.target).hasClass('close')) {
            return false;
        }
        const relevantPostNumber = $(this).attr('correspondingPost');
        //show the relevant post in a popup modal
        const relevantPost = $('.ui.fluid.card.habitsHomeDisplay[postnumber="' + relevantPostNumber + '"]').clone().show();

        $('.ui.viewPostPopup.modal .ui.fluid.card').html(relevantPost);
        $('.ui.viewPostPopup.modal .ui.fluid.card').removeAttr('postnumber').show();
        $('.ui.viewPostPopup.modal .ui.fluid.card .content a').removeAttr('href').show();
        $('.viewPostPopup').modal('show');
        //lazy load the images
        $(".ui.viewPostPopup.modal .ui.fluid.card img")
            .visibility({
                type: 'image',
                offset: 0,
                onLoad: function(calculations) {
                    $('.ui.viewPostPopup.modal .ui.fluid.card img').visibility('refresh');
                }
            });

        const cat = {
            subdirectory1: 'modual',
            subdirectory1: 'habits',
            absoluteTimestamp: Date.now(),
            actionType: $(this)[0].classList.contains('habitsNotificationItem') ? 'clickNotificationItem' : 'clickNotificationPopup', // Did user click a popup or item on page?
            setValue: relevantPostNumber
        };

        $.post("/habitsAction", {
            action: cat,
            actionType: 'habits',
            _csrf: $('meta[name="csrf-token"]').attr('content')
        });
    });

});
$(window).on("beforeunload", function() {
    recordNewViewTime();
})