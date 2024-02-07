// Before Page load:
let enableDataCollection;
let isResearchVersion;

function changeActiveProgressTo(activeStep) {
    if (!$(activeStep).hasClass('progressBarActive')) {
        $('#headerStep1, #headerStep2, #headerStep3, #headerStep4').removeClass('progressBarActive');
        $(activeStep).addClass('progressBarActive');
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
        $.post("/pageLog", {
            subdirectory1: currentPageForHeader,
            subdirectory2: currentModuleForHeader,
            _csrf: $('meta[name="csrf-token"]').attr('content')
        });
    }

    /**
     * Progress Bar (in header) functionality
     */
    let stepNumber = "";
    let jsonPath = '/json/progressDataA.json';

    switch (currentModuleForHeader) {
        case 'cyberbullying':
        case 'digfoot':
            jsonPath = "/json/progressDataB.json";
            break;
        default:
            jsonPath = "/json/progressDataA.json";
            break;
    }

    // Add the module title to the progress bar
    $.getJSON('/json/moduleInfo.json', function(data) {
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
                        window.location.href = `/tut_guide/${currentModuleForHeader}`
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
                        window.location.href = `/tut_guide/${currentModuleForHeader}`
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
                        window.location.href = `/tut_guide/${currentModuleForHeader}`
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
                        window.location.href = `/tut_guide/${currentModuleForHeader}`
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
            })
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

    // When #newpost is clicked, open new post modal and lazy load images. 
    // When .editProfilePictureButton is clicked, open edit profile modal and lazy load images.
    $("#newpost, .editProfilePictureButton").click(function() {
        $('.ui.small.post.modal').modal('show');
        //lazy load the images in the modal
        $(".lazy").each(function() {
            $(this).attr('src', $(this).attr('data-src'));
        });
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
            } else if (pathArray[2] === "digfoot" || pathArray[2] === "esteem" || pathArray[2] === "targeted" || pathArray[2] === "cyberbullying") {
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

    // To free play page: /modual/
    $(document).on('click', '.cyber_script.blue', function() {
        const pathArray = window.location.pathname.split('/');
        window.location.href = '/modual/' + pathArray[2];
    });

    // Privacy free-play to settings
    $(document).on('click', '.ui.big.labeled.icon.button.free1.green', function() {
        window.location.href = '/free-settings/privacy';
    });

    // Privacy settings to free-play2
    $(document).on('click', '.ui.big.labeled.icon.button.settings1.green', function() {
        window.location.href = '/free-play2/privacy';
    });

    // Privacy free-play2 to settings3
    $(document).on('click', '.ui.big.labeled.icon.button.settings3.green', function() {
        window.location.href = '/free-settings3/privacy';
    });

    // Privacy settings3 to free-play4
    $(document).on('click', '.ui.big.labeled.icon.button.free4.green', function() {
        window.location.href = '/free-play4/privacy';
    });

    // Privacy free-play4 to settings2
    $(document).on('click', '.ui.big.labeled.icon.button.settings2.green', function() {
        window.location.href = '/free-settings2/privacy';
    });

    // Privacy settings2 to free3
    $(document).on('click', '.ui.big.labeled.icon.button.free3.green', function() {
        window.location.href = '/free-play3/privacy';
    });

    // Privacy free3 to results
    $(document).on('click', '.ui.big.labeled.icon.button.privacyresults.green', function() {
        window.location.href = '/results/privacy';
    });

    // To Edit My Profile page
    $('.ui.editprofile.button').on('click', function() {
        const pathArray = window.location.pathname.split('/');
        window.location.href = '/account/' + pathArray[2];
    });

    /** End of button links functionality */

    // Lazy loading of images
    $(`#content .fluid.card .img img, img.ui.avatar.image, #content a.avatar.image img`).visibility({
        type: 'image',
        onLoad: function(calculations) {
            $('.ui.sticky:visible').sticky('refresh');
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
})