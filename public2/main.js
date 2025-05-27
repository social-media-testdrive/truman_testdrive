// Before Page load:
// Hide news feed before it is all loaded

$("#content").hide();
$("#loading").show();
let enableDataCollection;
let isResearchVersion;

function changeActiveProgressTo(activeStep) {
  if (!$(activeStep).hasClass("progressBarActive")) {
    $("#headerStep1, #headerStep2, #headerStep3, #headerStep4").removeClass(
      "progressBarActive"
    );
    $(activeStep).addClass("progressBarActive");
  }
}

function addVoiceoverTime() {
    const voiceoverChangeTime = window.sessionStorage.getItem('voiceoverChangeTime');
    // Record the time the voiceover was on ONLY if data collection is enabled AND if it's not the home page for the public site
    // (becuase prior to clicking a module card, no "guest" account has been created to log voiceoverTimer to)
    if (enableDataCollection && voiceoverChangeTime !== null && !(!isResearchVersion && window.location.pathname === "/")) {
        const timeDuration = Date.now() - voiceoverChangeTime;
        $.post("/voiceoverTimer", {
            voiceoverTimer: timeDuration,
            _csrf: $('meta[name="csrf-token"]').attr('content')
        }).catch(function(err) {
            console.log(err);
        });
    }
}

$(window).on("load", function() {
    enableDataCollection = $('meta[name="isDataCollectionEnabled"]').attr('content') === "true";
    isResearchVersion = $('meta[name="isResearchVersion"]').attr('content') === "true";
    const pathArrayForHeader = window.location.pathname.split('/');
    let currentPageForHeader = pathArrayForHeader[1];
    let currentModuleForHeader = pathArrayForHeader[2];

    /**
     * Voiceover functionality
     */
    const initialVoiceoverState = window.sessionStorage.getItem('enableVoiceovers');
    if (initialVoiceoverState === 'false') {
        $('#voiceoverCheckbox input').removeAttr('checked');
    }
    $('#voiceoverCheckbox').removeClass("hidden");

    // null if it is a new session (https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage)
    if (window.sessionStorage.getItem('voiceoverChangeTime') === null) {
        window.sessionStorage.setItem('voiceoverChangeTime', Date.now());
    }

    $('#voiceoverCheckbox').change(function() {
        if ($("input[name='voiceoverCheckbox']").is(":checked")) {
            window.sessionStorage.setItem('enableVoiceovers', 'true');
            window.sessionStorage.setItem('voiceoverChangeTime', Date.now());
        } else {
            window.sessionStorage.setItem('enableVoiceovers', 'false');
            addVoiceoverTime();
            Voiceovers.pauseVoiceover();
        }
    });

    // Record the current page if data collection is enabled
    // AND if it's not the home page for the public site (because prior to clicking a module card, no "guest" account has been created to log pageLog to)
    if (enableDataCollection && !(!isResearchVersion && window.location.pathname === "/")) {
        let pathArray = window.location.pathname.split("/");
        $.post("/pageLog", {
            subdirectory1: pathArray[1],
            subdirectory2: pathArray[2],
            _csrf: $('meta[name="csrf-token"]').attr("content"),
        });
    }

    /**
     * Progress Bar (in header) functionality
     */
    let stepNumber = "";
    let jsonPath = '/json/progressDataA.json';

    switch (currentModuleForHeader) {
        case "cyberbullying":
        case "digfoot":
            jsonPath = "/json/progressDataB.json";
            break;
        default:
            jsonPath = "/json/progressDataA.json";
            break;
    }

    // Adding the module title to the progress bar
    $.getJSON("/json/moduleInfo.json", function(data) {
        if (currentModuleForHeader === undefined) {
            return;
        }
        if (data.hasOwnProperty(currentModuleForHeader)) {
            $('.moduleTitle span').text(data[currentModuleForHeader]["title"]);
        }
    });

    $.getJSON(jsonPath, function(data) {
        stepNumber = data[currentPageForHeader];
    }).then(function() {
        switch (stepNumber) {
            case '1':
                changeActiveProgressTo('#headerStep1');
                $('.hideHeader').css('display', 'block');
                break;
            case '2':
                changeActiveProgressTo("#headerStep2");
                $('.hideHeader').css('display', 'block');
                $('#headerStep1').on('click', function() {
                    if (currentModuleForHeader === "privacy") {
                        window.location.href = `/tut_guide/${currentModuleForHeader}`;
                    } else {
                        window.location.href = `/tutorial/${currentModuleForHeader}`;
                    }
                });
                break;
            case '3':
                changeActiveProgressTo("#headerStep3");
                $('.hideHeader').css('display', 'block');
                $('#headerStep1').on('click', function() {
                    if (currentModuleForHeader === "privacy") {
                        window.location.href = `/tut_guide/${currentModuleForHeader}`;
                    } else {
                        window.location.href = `/tutorial/${currentModuleForHeader}`;
                    }
                });
                $('#headerStep2').on('click', function() {
                    window.location.href = `/sim/${currentModuleForHeader}`;
                });
                break;
            case '4':
                changeActiveProgressTo("#headerStep4");
                $('.hideHeader').css('display', 'block');
                $('#headerStep1').on('click', function() {
                    if (currentModuleForHeader === "privacy") {
                        window.location.href = `/tut_guide/${currentModuleForHeader}`;
                    } else {
                        window.location.href = `/tutorial/${currentModuleForHeader}`;
                    }
                });
                $('#headerStep2').on('click', function() {
                    window.location.href = `/sim/${currentModuleForHeader}`;
                });
                $('#headerStep3').on('click', function() {
                    if (currentModuleForHeader === "accounts") {
                        window.location.href = `/sim/${currentModuleForHeader}`;
                    } else if (currentModuleForHeader === "privacy") {
                        window.location.href = `/free-play/${currentModuleForHeader}`;
                    } else {
                        window.location.href = `/modual/${currentModuleForHeader}`;
                    }
                });
                break;
            case 'end':
                $('#headerStep1, #headerStep2, #headerStep3, #headerStep4').removeClass('progressBarActive');
                $('.hideHeader').css('display', 'block');
                $('#headerStep1').on('click', function() {
                    if (currentModuleForHeader === "privacy") {
                        window.location.href = `/tut_guide/${currentModuleForHeader}`;
                    } else {
                        window.location.href = `/tutorial/${currentModuleForHeader}`;
                    }
                });
                $('#headerStep2').on('click', function() {
                    window.location.href = `/sim/${currentModuleForHeader}`;
                });
                $('#headerStep3').on('click', function() {
                    if (currentModuleForHeader === "accounts") {
                        window.location.href = `/sim/${currentModuleForHeader}`;
                    } else if (currentModuleForHeader === "privacy") {
                        window.location.href = `/free-play/${currentModuleForHeader}`;
                    } else {
                        window.location.href = `/modual/${currentModuleForHeader}`;
                    }
                });
                $('#headerStep4').on('click', function() {
                    window.location.href = `/results/${currentModuleForHeader}`;
                });
                break;
            default:
                // Progress bar is not visible right now
                break;
        }
    });

    /**
     * Load Content
     */
    $('#loading').hide();
    $('#content').fadeIn('slow', function() {
        // Keep user & actor side menu profile sticky on page as user scrolls on page.
        $('.ui.sticky.sideMenu').sticky({
            context: '#content',
            offset: 115
        });
        if (currentModuleForHeader == 'esteem' && currentPageForHeader == 'modual') {
            $('.esteemReminder').sticky({
                context: '#content',
                offset: 115
            });
        }
    });

    /**
     * Additional functionality
     */

    // Close messages from flash message
    $('.message .close').on('click', function() {
        $(this).closest('.message').transition('fade');
    });

    // Activate checkboxes
    $('.ui.checkbox').checkbox();

    // Activate accordions 
    $('.ui.accordion').accordion();

    // Activate dropdowns 
    $('.ui.dropdown').dropdown();

    // Ensure modals are closable
    $('.ui.modal').modal({ closable: true });

    // Get add new reply post modal to show
    $(".reply.button").click(function() {
        let parent = $(this).closest(".ui.fluid.card");
        let postID = parent.attr("postID");
        parent.find("input.newcomment").focus();
    });

    // When #newpost is clicked, open new post modal and lazy load images. 
    // When .editProfilePictureButton is clicked, open edit profile modal and lazy load images.
    $("#newpost, a.item.newpost, .editProfilePictureButton").click(function() {
        $('.ui.small.post.modal').modal('show');
        //lazy load the images in the modal
        $(".lazy").each(function() {
            $(this).attr('src', $(this).attr('data-src'));
        });
    });

    // New Class Button
    $("#new_class.ui.big.green.labeled.icon.button").click(function() {
        $(".ui.small.newclass.modal").modal("show");
    });

    // New post validator (picture and text can not be empty)
    $(".ui.feed.form").form({
        on: "blur",
        fields: {
            body: {
                identifier: "body",
                rules: [
                    {
                        type: "empty",
                        prompt: "Please add some text",
                    },
                ],
            },
        },
    });

    // Article info popup in the digital-literacy module
    $(".modual.info_button").click(function() {
        $(".ui.small.popinfo.modal").modal("show");
        document.getElementById("post_info_text_modual").innerHTML = $(this).data("info_text");
    });

    // Picture Preview on Image Selection
    function readURL(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            reader.onload = function(e) {
                $("#imgInp").attr("src", e.target.result);
            };
            reader.readAsDataURL(input.files[0]);
        }
    }

    $("#picinput").change(function() {
        readURL(this);
    });

    /** 
     * Button links functionality
     */
    // $(document).on("click", ELEMENT, function () {}) will bind the event on the elements which are not present at the time of the binding event. 
    // This is called event delgation. 
    // Whereas $(ELEMENT).click(function () { will bind events only to the elements which are present in DOM.
    // We use $(document).on("click") because many of the transition buttons are not green to begin with. 

    // To tutorial page: /tutorial/
    $(document).on('click', '.cybertutorial.green, .cybertutorial.blue', function() {
        const pathArray = window.location.pathname.split('/');
        window.location.href = '/tutorial/' + pathArray[2];
    });

    // To guided activity page: /sim/
    $(document).on('click', '.cybersim.green, .cybersim.blue', function() {
        const pathArray = window.location.pathname.split('/');
        window.location.href = '/sim/' + pathArray[2];
    });

    // To guided activity page: /sim1/
    $(document).on('click', '.cybersim1.green', function() {
        const pathArray = window.location.pathname.split('/');
        window.location.href = '/sim1/' + pathArray[2];
    });

    // To guided activity page: /sim2/
    $(document).on('click', '.cybersim2.green', async function() {
        const pathArray = window.location.pathname.split('/');
        if (typeof customOnClickGreenContinue !== 'undefined') {
            await customOnClickGreenContinue();
        }
        // Special Case: When a user clicks "Let's Continue" in the accounts module, but has a Very Weak or Weak password,
        // prompt the user: "This password seems weak and easy to guess, are you sure you want to use it?"
        if (pathArray[2] === "accounts") {
            const result = zxcvbn($('input[name="password"]').val());
            if (result.score == 0 || result.score == 1) {
                if ($('#confirmContinueCheck').is(":hidden")) {
                    $('#confirmContinueCheck').show();
                    $('#confirmContinueCheck')[0].scrollIntoView({
                        behavior: "smooth", // or "auto" or "instant"
                        block: "center", // defines vertical alignment
                        inline: "nearest" // defines horizontal alignment
                    });
                    return;
                }
            }
        }
        window.location.href = '/sim2/' + pathArray[2];
    });

    // To transition page: /trans/
    $(document).on('click', '.cybertrans.green', async function(e) {
        if ($(this).hasClass('green')) {
            let pathArray = window.location.pathname.split('/');
            if (typeof customOnClickGreenContinue !== 'undefined') {
                await customOnClickGreenContinue();
            };
            // Special Case: When a user clicks "Let's Continue" in the accounts module, but has not completed any profile fields
            // prompt the user: "It seems you did not fill out any profile information fields. Are you sure you would like to continue? "
            if (pathArray[2] === "accounts") {
                if ($('input[type=text], textarea[type=text]').filter(function() { return $(this).val() == ""; }).length === 6 && $('input[name="profilePhoto"]').val() === 'avatar-icon.svg') {
                    if ($('#confirmContinueCheck').is(":hidden")) {
                        $('#confirmContinueCheck').show();
                        $('#confirmContinueCheck')[0].scrollIntoView({
                            behavior: "smooth", // or "auto" or "instant"
                            block: "center", // defines vertical alignment
                            inline: "nearest" // defines horizontal alignment
                        });
                        return;
                    };
                };
                // Special Case: When a user clicks "Let's Continue" but haven't completed recommended actions.
                // prompt the user: "It seems you did not click on any posts to ... Are you sure you do not want to click on a post before continuing?"
            } else if (pathArray[2] === "digfoot" || 
                      pathArray[2] === "digfoot-esp" || 
                      pathArray[2] === "esteem" || 
                      pathArray[2] === "targeted" || 
                      pathArray[2] === "cyberbullying" || 
                      pathArray[2] === "cyberbullying-esp") {
                if (!clickPost && $('#confirmContinueCheck').is(":hidden")) {
                    $('#confirmContinueCheck').show();
                    $('#confirmContinueCheck')[0].scrollIntoView({
                        behavior: "smooth", // or "auto" or "instant"
                        block: "center", // defines vertical alignment
                        inline: "nearest" // defines horizontal alignment
                    });
                    return;
                };
            } else if (pathArray[2] === "privacy") {
                // Special Case: When a user clicks "Let's Continue" in the privacy module, but has not toggled any settings
                // prompt the user: Are you sure you do not want to try changing some privacy settings before continuing?
                if (!clickAction && $('#confirmContinueCheck').is(":hidden")) {
                    $('#confirmContinueCheck').show();
                    $('#confirmContinueCheck')[0].scrollIntoView({
                        behavior: "smooth", // or "auto" or "instant"
                        block: "center", // defines vertical alignment
                        inline: "nearest" // defines horizontal alignment
                    });
                    return;
                }
            };
            window.location.href = '/trans/' + pathArray[2];
        } else {
            e.preventDefault();
        };
    });

    // To second transition page: /trans2/
    $(document).on('click', '.cybertrans2', function(e) {
        if ($(this).hasClass('green')) {
            let pathArray = window.location.pathname.split('/');
            window.location.href = '/trans2/' + pathArray[2];
        } else {
            e.preventDefault();
        }
    });

    // To free play page: /modual/
    $(document).on('click', '.cyber_script.blue, .cyber_script.green', function() {
        const pathArray = window.location.pathname.split('/');
        window.location.href = '/modual/' + pathArray[2];
    });

    // Cyberbullying to Transition
    $(".ui.big.green.labeled.icon.button.cybertrans_script").on("click", function() {
        window.location.href = "/trans_script/cyberbullying";
    });

    // Cyberbullying Start to Tutorial
    $(".ui.big.green.labeled.icon.button.cyberstart").on("click", function() {
        window.location.href = "/tutorial/cyberbullying";
    });

    // Privacy specific routes
    // Privacy sim2 to Tutorial
    $(document).on('click', '.ui.big.labeled.icon.button.privacytutorial.green', function() {
        window.location.href = '/tutorial/privacy';
    });

    // Privacy sim to trans2
    $(document).on('click', '.ui.big.labeled.icon.button.privacytrans2.green', function() {
        // Special Case: When a user clicks "Let's Continue" in the privacy module, but has not toggled any settings
        // prompt the user: Are you sure you do not want to try changing some privacy settings before continuing?
        if (!clickAction && $('#confirmContinueCheck').is(":hidden")) {
            $('#confirmContinueCheck').show();
            $('#confirmContinueCheck')[0].scrollIntoView({
                behavior: "smooth", 
                block: "center",
                inline: "nearest"
            });
            return;
        }
        window.location.href = '/trans2/privacy';
    });

    // Privacy esp sim to trans2
    $(document).on('click', '.ui.big.labeled.icon.button.privacyesptrans2.green', function() {
        // Special Case: When a user clicks "Let's Continue" in the privacy module, but has not toggled any settings
        // prompt the user: Are you sure you do not want to try changing some privacy settings before continuing?
        if (!clickAction && $('#confirmContinueCheck').is(":hidden")) {
            $('#confirmContinueCheck').show();
            $('#confirmContinueCheck')[0].scrollIntoView({
                behavior: "smooth",
                block: "center",
                inline: "nearest"
            });
            return;
        }
        window.location.href = '/trans2/privacy-esp';
    });
    
    // Privacy Spanish-specific routes
    // Privacy free-play to settings
    $(document).on('click', '.ui.big.labeled.icon.button.free1.green', function() {
        window.location.href = '/free-settings/privacy-esp';
    });

    // Privacy settings to free-play2
    $(document).on('click', '.ui.big.labeled.icon.button.settings1.green', function() {
        window.location.href = '/free-play2/privacy-esp';
    });

    // Privacy free-play2 to settings3
    $(document).on('click', '.ui.big.labeled.icon.button.settings3.green', function() {
        window.location.href = '/free-settings3/privacy-esp';
    });

    // Privacy settings3 to free-play4
    $(document).on('click', '.ui.big.labeled.icon.button.free4.green', function() {
        window.location.href = '/free-play4/privacy-esp';
    });

    // Privacy free-play4 to settings2
    $(document).on('click', '.ui.big.labeled.icon.button.settings2.green', function() {
        window.location.href = '/free-settings2/privacy-esp';
    });

    // Privacy settings2 to free3
    $(document).on('click', '.ui.big.labeled.icon.button.free3.green', function() {
        window.location.href = '/free-play3/privacy-esp';
    });

    // Privacy free3 to results
    $(document).on('click', '.ui.big.labeled.icon.button.privacyresults.green', function() {
        window.location.href = '/results/privacy-esp';
    });

    // Sign Up Info Skip Button
    $("button.ui.button.skip").on("click", function() {
        window.location.href = "/info";
    });

    // Pre quiz for presentation mod (rocket!!!)
    $(".ui.big.green.labeled.icon.button.prepres").on("click", function() {
        window.location.href = "/modual/presentation";
    });

    // Go to Post Quiz (Presentation)
    $(".ui.big.green.labeled.icon.button.prez_post_quiz").on("click", function() {
        window.location.href = "/postquiz/presentation";
    });

    // Go to Post Quiz (ANY)
    $(".ui.big.green.labeled.icon.button.post_quiz").on("click", function() {
        let mod = $(this).attr("mod");
        console.log("Mod is now: " + mod);
        window.location.href = "/postquiz/" + mod + "/wait";
    });

    $(".ui.big.green.labeled.icon.button.finished").on("click", function() {
        window.location.href = "/";
    });

    $(".ui.big.green.labeled.icon.button.finish_lesson").on("click", function() {
        window.location.href = "/";
    });

    // Community Rules Button (rocket!!!)
    $(".ui.big.green.labeled.icon.button.com").on("click", function() {
        window.location.href = "/info"; //maybe go to tour site???
    });

    // Info (rocket!!!)
    $(".ui.big.green.labeled.icon.button.info").on("click", function() {
        window.location.href = "/"; //maybe go to tour site???
    });

    // More info Skip Button
    $("button.ui.button.skip").on("click", function() {
        window.location.href = "/com"; //maybe go to tour site???
    });

    // Edit button
    $(".ui.editprofile.button").on("click", function() {
        const pathArray = window.location.pathname.split("/");
        window.location.href = "/account/" + pathArray[2];
    });

    /** End of button links functionality */

    // This is the REPORT User button
    $("button.ui.button.report").on("click", function() {
        var username = $(this).attr("username");
        $(".ui.small.report.modal").modal("show");
        $(".coupled.modal").modal({
            allowMultiple: false,
        });
        // attach events to buttons
        $(".second.modal").modal("attach events", ".report.modal .button");
        // show first now
        $(".ui.small.report.modal").modal("show");
    });

    // Report User Form
    $("form#reportform").submit(function(e) {
        e.preventDefault();
        $.post($(this).attr("action"), $(this).serialize(), function(res) {
            // Do something with the response `res`
            console.log(res);
            // Don't forget to hide the loading indicator!
        });
    });

    // This is the Block User button - this doesn't have consequences in TestDrive
    $("button.ui.button.block").on("click", function() {
        var username = $(this).attr("username");
        // Modal for Blocked Users
        $(".ui.small.basic.blocked.modal")
            .modal({
                closable: false,
                onDeny: function() {
                    // report user
                },
                onApprove: function() {
                    // unblock user
                    $.post("/user", {
                        unblocked: username,
                        _csrf: $('meta[name="csrf-token"]').attr("content"),
                    });
                },
            })
            .modal("show");

        console.log("***********Block USER " + username);
        $.post("/user", {
            blocked: username,
            _csrf: $('meta[name="csrf-token"]').attr("content"),
        });
    });

    // Block Modal for User that is already Blocked
    $(".ui.on.small.basic.blocked.modal")
        .modal({
            closable: false,
            onDeny: function() {
                // report user
            },
            onApprove: function() {
                // unblock user
                var username = $("button.ui.button.block").attr("username");
                $.post("/user", {
                    unblocked: username,
                    _csrf: $('meta[name="csrf-token"]').attr("content"),
                });
            },
        })
        .modal("show");

    // Lazy loading of images
    $(`#content .fluid.card .img img, img.ui.avatar.image, #content a.avatar.image img`).visibility({
        type: 'image',
        onLoad: function(calculations) {
            $('.ui.sticky.sideMenu').sticky('refresh');
            if (currentModuleForHeader == 'esteem' && currentPageForHeader == 'modual') {
                $('.esteemReminder').sticky('refresh');
            }
            $('.ui.sticky.newPostSticky').sticky('refresh');
        }
    });

    $(".dimmer.soon").dimmer({
        closable: false
    });

    introJs().start();
});

$(window).on("beforeunload", function() {
    const pathArrayForHeader = window.location.pathname.split('/');
    let currentPageForHeader = pathArrayForHeader[1];
    if ($("input[name='voiceoverCheckbox']").is(":checked") && !isResearchVersion && currentPageForHeader != "end") {
        addVoiceoverTime();
    }
});

