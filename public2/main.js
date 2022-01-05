// Before Page load:
// Hide news feed before it is all loaded

$('#content').hide();
$('#loading').show();

function changeActiveProgressTo(activeStep) {
    if (!$(activeStep).hasClass('progressBarActive')) {
        $('#headerStep1, #headerStep2, #headerStep3, #headerStep4').removeClass('progressBarActive');
        $(activeStep).addClass('progressBarActive');
    }
}

$(window).on("load", function() {
    let initialVoiceoverState = window.sessionStorage.getItem('enableVoiceovers');
    if (initialVoiceoverState === 'false') {
        $('#voiceoverCheckbox input').removeAttr('checked');
    }
    $('#voiceoverCheckbox').removeClass("hidden")

    $('#voiceoverCheckbox').change(function() {
        if ($("input[name='voiceoverCheckbox']").is(":checked")) {
            window.sessionStorage.setItem('enableVoiceovers', 'true');
        } else {
            window.sessionStorage.setItem('enableVoiceovers', 'false');
            Voiceovers.pauseVoiceover();
        }
    });


    const enableDataCollection = $('meta[name="isDataCollectionEnabled"]').attr('content') === "true";
    // Record the current page if data collection is enabled
    if (enableDataCollection) {
        let pathArray = window.location.pathname.split('/');
        $.post("/pageLog", {
            subdirectory1: pathArray[1],
            subdirectory2: pathArray[2],
            _csrf: $('meta[name="csrf-token"]').attr('content')
        });
    }

    // managing the progress bar in the header
    let pathArrayForHeader = window.location.pathname.split('/');
    let currentPageForHeader = pathArrayForHeader[1];
    let currentModuleForHeader = pathArrayForHeader[2];
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

    // Adding the module title to the progress bar
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

    $('.ui.sticky.sideMenu')
        .sticky({
            context: '#content',
            offset: 115
        });

    //close loading dimmer on load
    $('#loading').hide();
    $('#content').attr('style', 'block');
    $('#content').fadeIn('slow');

    //close messages from flash message
    $('.message .close')
        .on('click', function() {
            $(this).closest('.message').transition('fade');
        });

    //activate checkboxes
    $('.ui.checkbox')
        .checkbox();

    //get add new reply post modal to show
    $('.reply.button').click(function() {
        let parent = $(this).closest(".ui.fluid.card");
        let postID = parent.attr("postID");
        parent.find("input.newcomment").focus();
    });

    //get add new feed post modal to work
    $("#newpost, a.item.newpost, .editProfilePictureButton").click(function() {
        $(' .ui.small.post.modal').modal('show');
        //lazy load the images in the modal
        $(".lazy").each(function() {
            $(this).attr('src', $(this).attr('data-src'));
        });
    });

    //New Class Button
    $("#new_class.ui.big.green.labeled.icon.button").click(function() {
        $('.ui.small.newclass.modal').modal('show');
    });

    //new post validator (picture and text can not be empty)
    $('.ui.feed.form')
        .form({
            on: 'blur',
            fields: {
                body: {
                    identifier: 'body',
                    rules: [{
                        type: 'empty',
                        prompt: 'Please add some text'
                    }]
                }
            }
        });

    // article info popup in the digital-literacy module
    $(".modual.info_button").click(function() {

        $('.ui.small.popinfo.modal').modal('show');
        document.getElementById('post_info_text_modual').innerHTML = $(this).data('info_text');
    });

    //Picture Preview on Image Selection
    function readURL(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            //console.log("Now changing a photo");
            reader.onload = function(e) {
                $('#imgInp').attr('src', e.target.result);
                //console.log("FILE is "+ e.target.result);
            }

            reader.readAsDataURL(input.files[0]);
        }
    }

    $("#picinput").change(function() {
        //console.log("@@@@@ changing a photo");
        readURL(this);
    });

    //
    // MOVED TO COMMENTS.JS
    //add humanized time to all posts
    // $('.right.floated.time.meta, .date.sim, .time.notificationTime').each(function () {
    //   var ms = parseInt($(this).text(), 10);
    //   let time = new Date(ms);
    //   $(this).text(humanized_time_span(time));
    // });

    //Sign Up Button
    // $('.ui.big.green.labeled.icon.button.signup')
    //   .on('click', function () {
    //     window.location.href = '/signup';
    //   });

    //Cyberbullying to Transition
    $('.cybertrans')
        .on('click', function(e) {
            if ($(this).hasClass('green')) {
                let pathArray = window.location.pathname.split('/');
                // Special Case: When a user clicks "Let's Continue" in the accounts module, but has not completed any profile fields
                // prompt the user: "It seems you did not fill out any profile information fields. Are you sure you would like to continue? "
                if (pathArray[2] === "accounts") {
                    if ($('#input').val() === "" && $('input[name="profilePhoto"]').val() === 'avatar-icon.svg') {
                        if ($('#confirmContinueCheck').is(":hidden")) {
                            $('#confirmContinueCheck').show();
                            $('#confirmContinueCheck')[0].scrollIntoView({
                                behavior: "smooth", // or "auto" or "instant"
                                block: "center", // defines vertical alignment
                                inline: "nearest" // defines horizontal alignment
                            });;
                            return;
                        }
                    }
                    // Special Case: When a user clicks "Let's Continue" in the digfoot, esteem, targeted module, but has not clicked on any post
                    // prompt the user: "It seems you did not click on any posts to ... Are you sure you do not want to click on a post before continuing?"
                } else if (pathArray[2] === "digfoot" || pathArray[2] === "esteem" || pathArray[2] === "targeted" || pathArray[2] === "cyberbullying") {
                    if (!clickPost && $('#confirmContinueCheck').is(":hidden")) {
                        $('#confirmContinueCheck').show()
                        $('#confirmContinueCheck')[0].scrollIntoView({
                            behavior: "smooth", // or "auto" or "instant"
                            block: "center", // defines vertical alignment
                            inline: "nearest" // defines horizontal alignment
                        });;
                        return;
                    }
                }
                window.location.href = '/trans/' + pathArray[2];
            } else {
                e.preventDefault();
            }
        });

    //cyberbullying to transition 2
    $('.cybertrans2')
        .on('click', function(e) {
            if ($(this).hasClass('green')) {
                let pathArray = window.location.pathname.split('/');
                window.location.href = '/trans2/' + pathArray[2];
                //window.location.href = '/trans2/privacy';
            } else {
                e.preventDefault();
                //alert('Please go through each blue dot to proceed further !');
            }

        });

    /*
    Start button links
    */

    //Cyberbullying to Transition
    $('.ui.big.green.labeled.icon.button.cybertutorial')
        .on('click', function() {
            let pathArray = window.location.pathname.split('/');
            window.location.href = '/tutorial/' + pathArray[2];
        });

    //Cyberbullying to Transition (blue button)
    $('.ui.big.blue.labeled.icon.button.cybertutorial')
        .on('click', function() {
            let pathArray = window.location.pathname.split('/');
            window.location.href = '/tutorial/' + pathArray[2];
        });

    //Cyberbullying to Transition
    $(document).on('click', '.ui.big.labeled.icon.button.cybersim.green', function() {
        let pathArray = window.location.pathname.split('/');
        window.location.href = '/sim/' + pathArray[2];
    });

    //Cyberbullying to Transition (blue button)
    $(document).on('click', '.ui.big.labeled.icon.button.cybersim.blue', function() {
        let pathArray = window.location.pathname.split('/');
        window.location.href = '/sim/' + pathArray[2];
    });

    //Cyberbullying to Transition 1
    $(document).on('click', '.ui.big.labeled.icon.button.cybersim1.green', function() {
        let pathArray = window.location.pathname.split('/');
        window.location.href = '/sim1/' + pathArray[2];
    });

    //Privacy sim2 to Tutorial
    $(document).on('click', '.ui.big.labeled.icon.button.privacytutorial.green', function() {
        window.location.href = '/tutorial/privacy';
    });

    //Privacy sim to trans2
    $(document).on('click', '.ui.big.labeled.icon.button.privacytrans2.green', function() {
        // Special Case: When a user clicks "Let's Continue" in the privacy module, but has not toggled any settings
        // prompt the user: Are you sure you do not want to try changing some privacy settings before continuing?
        if (!clickAction && $('#confirmContinueCheck').is(":hidden")) {
            $('#confirmContinueCheck').show();
            $('#confirmContinueCheck')[0].scrollIntoView({
                behavior: "smooth", // or "auto" or "instant"
                block: "center", // defines vertical alignment
                inline: "nearest" // defines horizontal alignment
            });;
            return;
        }
        window.location.href = '/trans2/privacy';
    });

    //To sim2
    $(document).on('click', '.ui.big.labeled.icon.button.cybersim2.green', function() {
        let pathArray = window.location.pathname.split('/');
        // Special Case: When a user clicks "Let's Continue" in the accounts module, but has a Very Weak or Weak password,
        // prompt the user: "This password seems weak and easy to guess, are you sure you want to use it?"
        if (pathArray[2] === "accounts") {
            let result = zxcvbn($('input[name="password"]').val());
            if (result.score == 0 || result.score == 1) {
                if ($('#confirmContinueCheck').is(":hidden")) {
                    $('#confirmContinueCheck').show();
                    $('#confirmContinueCheck')[0].scrollIntoView({
                        behavior: "smooth", // or "auto" or "instant"
                        block: "center", // defines vertical alignment
                        inline: "nearest" // defines horizontal alignment
                    });;
                    return;
                }
            }
        }
        window.location.href = '/sim2/' + pathArray[2];
    });

    //Privacy free-play to settings
    $(document).on('click', '.ui.big.labeled.icon.button.free1.green', function() {
        window.location.href = '/free-settings/privacy';
    });

    //Privacy settings to free-play2
    $(document).on('click', '.ui.big.labeled.icon.button.settings1.green', function() {
        window.location.href = '/free-play2/privacy';
    });

    //Privacy free-play2 to settings3
    $(document).on('click', '.ui.big.labeled.icon.button.settings3.green', function() {
        window.location.href = '/free-settings3/privacy';
    });

    //Privacy settings3 to free-play4
    $(document).on('click', '.ui.big.labeled.icon.button.free4.green', function() {
        window.location.href = '/free-play4/privacy';
    });

    //Privacy free-play4 to settings2
    $(document).on('click', '.ui.big.labeled.icon.button.settings2.green', function() {
        window.location.href = '/free-settings2/privacy';
    });

    //Privacy settings2 to free3
    $(document).on('click', '.ui.big.labeled.icon.button.free3.green', function() {
        window.location.href = '/free-play3/privacy';
    });

    //Privacy free3 to results
    $(document).on('click', '.ui.big.labeled.icon.button.privacyresults.green', function() {
        window.location.href = '/results/privacy';
    });


    //Cyberbullying Start to Tutorial
    $('.ui.big.green.labeled.icon.button.cyberstart')
        .on('click', function() {
            window.location.href = '/tutorial/cyberbullying';
        });

    //Cyberbullying to Transition
    $('.ui.big.green.labeled.icon.button.cybertrans_script')
        .on('click', function() {
            window.location.href = '/trans_script/cyberbullying';
        });

    ///modual/:modId
    //Cyberbullying Transition to freeplay
    $('.ui.big.green.labeled.icon.button.cyber_script')
        .on('click', function() {
            console.log(window.location.pathname)
            let pathArray = window.location.pathname.split('/');
            console.log(pathArray);
            window.location.href = '/modual/' + pathArray[2];
        });

    //Cyberbullying Transition to freeplay (blue button)
    $('.ui.big.blue.labeled.icon.button.cyber_script')
        .on('click', function() {
            console.log(window.location.pathname)
            let pathArray = window.location.pathname.split('/');
            console.log(pathArray);
            window.location.href = '/modual/' + pathArray[2];
        });


    //Sign Up Info Skip Button
    $('button.ui.button.skip')
        .on('click', function() {
            window.location.href = '/info';
        });


    //Pre qiuz for presentation mod (rocket!!!)
    $('.ui.big.green.labeled.icon.button.prepres')
        .on('click', function() {
            window.location.href = '/modual/presentation';
        });

    //Go to Post Quiz (Presentation)
    $('.ui.big.green.labeled.icon.button.prez_post_quiz')
        .on('click', function() {
            window.location.href = '/postquiz/presentation';
        });

    //Go to Post Quiz (ANY)
    $('.ui.big.green.labeled.icon.button.post_quiz')
        .on('click', function() {
            let mod = $(this).attr("mod");
            console.log("Mod is now: " + mod);
            window.location.href = '/postquiz/' + mod + '/wait';
        });


    $('.ui.big.green.labeled.icon.button.finished')
        .on('click', function() {
            window.location.href = '/';
        });


    $('.ui.big.green.labeled.icon.button.finish_lesson')
        .on('click', function() {
            window.location.href = '/';
        });

    //Community Rules Button (rocket!!!)
    $('.ui.big.green.labeled.icon.button.com')
        .on('click', function() {
            window.location.href = '/info'; //maybe go to tour site???
        });

    //Info  (rocket!!!)
    $('.ui.big.green.labeled.icon.button.info')
        .on('click', function() {
            window.location.href = '/'; //maybe go to tour site???
        });

    //More info Skip Button
    $('button.ui.button.skip')
        .on('click', function() {
            window.location.href = '/com'; //maybe go to tour site???
        });

    //Edit button
    $('.ui.editprofile.button')
        .on('click', function() {
            let pathArray = window.location.pathname.split('/');
            window.location.href = '/account/' + pathArray[2];
        });

    /*
    end button links
    */

    //this is the REPORT User button
    $('button.ui.button.report')
        .on('click', function() {

            var username = $(this).attr("username");

            $('.ui.small.report.modal').modal('show');

            $('.coupled.modal')
                .modal({
                    allowMultiple: false
                });
            // attach events to buttons
            $('.second.modal')
                .modal('attach events', '.report.modal .button');
            // show first now
            $('.ui.small.report.modal')
                .modal('show');

        });

    //Report User Form//
    $('form#reportform').submit(function(e) {

        e.preventDefault();
        $.post($(this).attr('action'), $(this).serialize(), function(res) {
            // Do something with the response `res`
            console.log(res);
            // Don't forget to hide the loading indicator!
        });
        //return false; // prevent default action

    });

    //this is the Block User button - this doesn't have consequences in TestDrive
    $('button.ui.button.block')
        .on('click', function() {

            var username = $(this).attr("username");
            //Modal for Blocked Users
            $('.ui.small.basic.blocked.modal')
                .modal({
                    closable: false,
                    onDeny: function() {
                        //report user

                    },
                    onApprove: function() {
                        //unblock user
                        $.post("/user", { unblocked: username, _csrf: $('meta[name="csrf-token"]').attr('content') });
                    }
                })
                .modal('show');


            console.log("***********Block USER " + username);
            $.post("/user", { blocked: username, _csrf: $('meta[name="csrf-token"]').attr('content') });

        });

    //Block Modal for User that is already Blocked
    $('.ui.on.small.basic.blocked.modal')
        .modal({
            closable: false,
            onDeny: function() {
                //report user

            },
            onApprove: function() {
                //unblock user
                var username = $('button.ui.button.block').attr("username");
                $.post("/user", { unblocked: username, _csrf: $('meta[name="csrf-token"]').attr('content') });

            }
        })
        .modal('show');

    //lazy loading of images
    $(`#content .fluid.card .img img,
    img.ui.avatar.image,
    a.avatar.image img`)
        .visibility({
            type: 'image',
            offset: 0,
            onLoad: function(calculations) {
                $(`#content .fluid.card .img img,
            img.ui.avatar.image,
            a.avatar.image img`)
                    .visibility('refresh');
            }
        });

    $(".dimmer.soon").dimmer({
        closable: false
    });

    introJs().start();

});