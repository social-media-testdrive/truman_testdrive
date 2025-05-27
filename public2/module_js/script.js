// Function that records popup modal data once it is closed
// Requires the data-modalName attribute string as a parameter
function recordModalInputs(modalNameAttrStr) {
    /**
     * Free-play modals: Values of 'modalNameAttrStr' 
     * digital-literacy
     * - 'digital-literacy_articleModal'
     * - 'digital-literacy_articleInfoModal'
     * - 'digital-literacy_flagModal' (called in postFunctionalities.js)
     * digfoot: 
     * - 'digfoot_normalPostModal'
     * esteem: 
     * - 'esteem_postModal1'
     * - 'esteem_postModal2' (in onHide function)
     * targeted:
     * - 'targeted_hideAdModal'
     * - 'targeted_whyAdModal'
     * phishing: 
     * - 'phishing_surveyScam'
     * - 'phishing_loginScam'
     * - 'phishing_creditCardScam'
     */
    const enableDataCollection = $('meta[name="isDataCollectionEnabled"]').attr('content') === "true";
    let target = $(event.target);
    const post = target.closest(".ui.card");
    const postID = post.attr("postID");
    const modalOpenedTime = Date.now();
    let checkboxInputs = 0b0;

    // Uncheck any checked inputs
    $(`.ui.modal[data-modalName=${modalNameAttrStr}] .ui.checkbox`).removeClass("checked");
    $('.ui.modal input[type=checkbox]').prop('checked', false);

    const numOfModalDropdown = $(`.ui.modal[data-modalName=${modalNameAttrStr}] .title.modalDropdown`).length // gets the number of modal dropdown elements
    let dropdownClicks = 0b0; // going to use bit shifting
    let dropdownClicksBoolean = new Array(numOfModalDropdown).fill(false)

    $(`.ui.modal[data-modalName=${modalNameAttrStr}]`).modal({
        allowMultipe: false,
        closable: false,
        onVisible: function() {
            switch (modalNameAttrStr) {
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
            }

            // OnClick Listening Events for dropdown triangles in digital-literacy_articleModal
            if (modalNameAttrStr === 'digital-literacy_articleModal') {
                $('.modalDropdown').on('click', function(event) {
                    dropdownClicksBoolean[event.target.id.replace(/\D/g, '') - 1] = true
                });
            }
        },
        onHide: function() {
            Voiceovers.pauseVoiceover();

            // Collapses all 'active' (open) accordion elements in digital-literacy_articleModal
            $(`.ui.modal[data-modalName=${modalNameAttrStr}] .title.modalDropdown`).removeClass("active");
            $(`.ui.modal[data-modalName=${modalNameAttrStr}] .content`).removeClass("active");

            const modalClosedTime = Date.now();
            const modalViewTime = modalClosedTime - modalOpenedTime;
            const modalName = $(this).attr('data-modalName');
            let numberOfCheckboxes = 0;

            $(`.ui.modal[data-modalName=${modalNameAttrStr}] .ui.checkbox input`).each(function() {
                numberOfCheckboxes++;
                if ($(this).is(":checked")) {
                    checkboxInputs = checkboxInputs << 1;
                    checkboxInputs++;
                } else {
                    checkboxInputs = checkboxInputs << 1;
                }
            });

            dropdownClicksBoolean.forEach(function(element) {
                if (element) {
                    dropdownClicks = dropdownClicks << 1; // shift left and add 1 to mark true
                    dropdownClicks++;
                } else {
                    dropdownClicks = dropdownClicks << 1; //shift left
                }
            });

            if (!enableDataCollection) {
                return;
            }

            $.post("/feed", {
                actionType: 'free play',
                postID: postID,
                modual: currentModuleForHeader,
                modalName: modalName,
                modalOpenedTime: modalOpenedTime,
                modalViewTime: modalViewTime,
                modalCheckboxesCount: numberOfCheckboxes,
                modalCheckboxesInput: checkboxInputs,
                modalDropdownCount: numOfModalDropdown,
                modalDropdownClick: dropdownClicks,
                _csrf: $('meta[name="csrf-token"]').attr('content')
            });
        },
        // the following is only relevant in the esteem module:
        onHidden: function() {
            if (modalNameAttrStr === "esteem_postModal1") {
                // if the user has selected a NEGATIVE emotion (indicated by the binary number),
                // show the second module after the first one closes.
                if ((checkboxInputs & 0b001101110) !== 0) {
                    const secondModalNameAttr = modalNameAttrStr.replace('1', '2');
                    const secondModalOpenedTime = Date.now();
                    $(`.ui.modal[data-modalName=${secondModalNameAttr}]`).modal({
                        allowMultipe: false,
                        closable: false,
                        onVisible: function() {
                            Voiceovers.playVoiceover(['CUSML.misc_08.mp3'])
                        },
                        onHide: function() {
                            Voiceovers.pauseVoiceover();
                            if (!enableDataCollection) {
                                return;
                            }
                            const modalClosedTime = Date.now();
                            const modalViewTime = modalClosedTime - secondModalOpenedTime;
                            const modalName = $(this).attr('data-modalName');
                            let numberOfCheckboxes = 0;
                            let checkboxInputs2 = 0b0;
                            $(`.ui.modal[data-modalName=${secondModalNameAttr}] .ui.checkbox input`).each(function() {
                                numberOfCheckboxes++;
                                if ($(this).is(":checked")) {
                                    checkboxInputs2 = checkboxInputs2 << 1; // shift left and add 1 to mark true
                                    checkboxInputs2++;
                                } else {
                                    checkboxInputs2 = checkboxInputs2 << 1; //shift left
                                }
                            });
                            $.post("/feed", {
                                actionType: 'free play',
                                postID: postID,
                                modual: currentModuleForHeader,
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

// safe-posting: Opens the chat boxes in module
function openChat() {
    if (currentModuleForHeader == "safe-posting") {
        setTimeout(function() {
            $('#chatbox1').slideToggle(300, 'swing');
        }, 10000);

        setTimeout(function() {
            $('#chatbox2').slideToggle(300, 'swing');
        }, 20000);
    }
}

// targeted: Functionality for ad dropdown menu in module
function targetedAdDropdownSelection() {
    const dropdownSelection = $(this).data().value;
    const post = $(this).closest(".ui.fluid.card");
    const postID = post.attr("postID");
    if (dropdownSelection == 0) {
        $(".inverted.dimmer").css("background-color", "rgba(211,211,211,0.95)");
        // TO DO: hide the post
        $.post("/feed", {
            postID: postID,
            modual: currentModuleForHeader,
            flag: Date.now(),
            _csrf: $('meta[name="csrf-token"]').attr('content')
        });
        post.find(".ui.inverted.dimmer.notflag").dimmer({ closable: true }).dimmer('show');
        //repeat to ensure its closable
        post.find(".ui.inverted.dimmer.notflag").dimmer({ closable: true }).dimmer('show');
        //open hide ad Modal
        recordModalInputs('targeted_hideAdModal');
    } else if (dropdownSelection == 1) {
        //flag the post
        $.post("/feed", {
            postID: postID,
            flag: Date.now(),
            modual: currentModuleForHeader,
            _csrf: $('meta[name="csrf-token"]').attr('content')
        });
        post.find(".ui.dimmer.flag").dimmer({ closable: true }).dimmer('show');
        //repeat to ensure its closable
        post.find(".ui.dimmer.flag").dimmer({ closable: true }).dimmer('show');
    } else if (dropdownSelection == 2) {
        //get the company name to dynamically use in the modal
        const companyName = $(this).closest(".ui.fluid.card").find("#companyName").text();
        //get the ad type
        const adType = $("#whyAmISeeingThisAdModal").find(".content").attr("id");
        //open info modal, generate correct text based on ad type and company name
        $("#whyAmISeeingThisAdModal .content").html(
            "<p>You are seeing this ad because <b>" + companyName + "</b> wanted to reach people interested in <b>" + adType + "</b>.</p>" +
            "<p>This is based on what you have done on TestDrive, such as pages you have visited and search terms you have clicked on.</p>" +
            "<br>" +
            "<div class='actions'>" +
            "<div class='ui positive right labeled icon button'>Done" +
            "<i class='checkmark icon'></i></div></div>"
        );
        recordModalInputs('targeted_whyAdModal');
    }
};

// phishing: Opens correct phishing post
function openPhishingModal(phishingLink) {
    const postType = phishingLink.attr('phishingPostType'); // "surveyScam", "loginScam", "creditCardScam"
    recordModalInputs('phishing_' + postType);
}

// Wait for an image to load so that the width is correct before setting sticky elements
// Only an issue with advacedlit module
function setStickyElementsAdvancedlit() {
    $('.ui.sticky.newPostSticky')
        .sticky({
            context: '#content',
            offset: 115
        });
    $('.card .img.post img').off("load", setStickyElementsAdvancedlit);
}

$(window).on("load", function() {
    // safe-posting: Opens the chat boxes in module
    openChat();

    // targeted: handles ad dropdown menu in module
    $('.ui.dropdown.icon.item').dropdown({ onChange: targetedAdDropdownSelection });

    // Redirect user to reflection page when the "let's continue" button is clicked.
    $('.ui.big.green.labeled.icon.button.script').on('click', async function() {
        window.location.href = "/results/" + currentModuleForHeader;
    });

    $('.ui.simple.dropdown.item').css({ "display": "inherit" })

    // Wait for an image to load so that the width is correct before setting sticky elements
    // Only an issue with advacedlit module
    if (currentModuleForHeader === 'advancedlit') {
        $('.card .img.post img').on("load", setStickyElementsAdvancedlit);
    } else {
        $('.ui.sticky.newPostSticky')
            .sticky({
                context: '#content',
                offset: 115
            });
    }

    /** New User Post functionality */
    //New user post validator (picture and text can not be empty)
    $('.ui.feed.form').form({
        on: 'blur',
        fields: {
            body: {
                identifier: 'body',
                rules: [{
                    type: 'empty',
                    prompt: 'Please add some text.'
                }]
            }
        }
    });

    //Picture Preview on Image Selection
    function readURL(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            reader.onload = function(e) {
                $('#imgInp').attr('src', e.target.result);
            }

            reader.readAsDataURL(input.files[0]);
        }
    }

    $("#picinput").change(function() {
        readURL(this);
    });

    /** Code to open modals, sorted by corresponding module. */

    // digital-literacy
    $('.openPostDigitalLiteracy').on('click', function() {
        recordModalInputs('digital-literacy_articleModal');
    });

    $(".modual.info_button").click(function(e) {
        recordModalInputs('digital-literacy_articleInfoModal');
        document.getElementById('post_info_text_modual').innerHTML = $(this).data('info_text');
        e.stopPropagation();
    });

    // digfoot
    $('.openPostDigfoot').on('click', function() {
        recordModalInputs('digfoot_normalPostModal')
    });

    // esteem
    $('.openPostEsteem').on('click', function() {
        recordModalInputs('esteem_postModal1');
    });

    // phishing 
    $('.phishingLink').on('click', function() { openPhishingModal($(this)) });
});