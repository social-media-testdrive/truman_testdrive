/*
Function that records popup modal data when the popup closes.
Requires the data-modalName attribute string as a parameter.
To add this functionality to a modal: Give the modal a unique data-modalname
attribute, then find where $(modal).show("modal") is called and replace it with
this function.
*/

function recordSimModalInputs(modalNameAttrStr) {
    /**
     * Sim modals: Values of 'modalNameAttrStr' 
     * digital-literacy
     * - 'digital-literacy_articleModal'
     * - 'digital-literacy_infoModal'
     * - 'digital-literacy_flagModal'
     * digfoot: 
     * - 'digfoot_simModal'
     * esteem: 
     * - 'esteem_simPostModal1'
     * - 'esteem_simPostModal2' (in onHide function)
     * targeted:
     * - 'targeted_hideAdModal'
     * - 'targeted_whySeeingAdModal'
     * phishing: 
     * - 'phishing_iPhoneModal'
     * - 'phishing_ticketGiveawayModal'
     */
    const enableDataCollection = $('meta[name="isDataCollectionEnabled"]').attr('content') === "true";
    let target = $(event.target);
    const post = target.closest(".ui.card");
    const postID = post.attr("postID");
    const modalOpenedTime = Date.now();
    let checkboxInputs = 0b0; // going to use bit shifting

    $(`.ui.modal[data-modalName=${modalNameAttrStr}] .ui.checkbox`).removeClass("checked");
    $('.ui.modal input[type=checkbox]').prop('checked', false);
    var numOfModalDropdown = $(`.ui.modal[data-modalName=${modalNameAttrStr}] .title.modalDropdown`).length // gets the number of modal dropdown elements
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
                case 'digfoot_simModal':
                    Voiceovers.playVoiceover(['CUSML.misc_04.mp3'])
                    break;
                case 'esteem_simPostModal1':
                    Voiceovers.playVoiceover(['CUSML.misc_05.mp3'])
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
            // collapses all 'active' (open) accordion elements in digital-literacy_articleModal
            $(`.ui.modal[data-modalName=${modalNameAttrStr}] .title.modalDropdown`).removeClass("active");
            $(`.ui.modal[data-modalName=${modalNameAttrStr}] .content`).removeClass("active");

            const modalClosedTime = Date.now();
            const modalViewTime = modalClosedTime - modalOpenedTime;
            const pathArrayForHeader = window.location.pathname.split('/');
            const currentModule = pathArrayForHeader[2];
            const modalName = $(this).attr('data-modalName');
            let numberOfCheckboxes = 0;

            $(`.ui.modal[data-modalName=${modalNameAttrStr}] .ui.checkbox input`).each(function() {
                numberOfCheckboxes++;
                if ($(this).is(":checked")) {
                    checkboxInputs = checkboxInputs << 1; // shift left and add 1 to mark true
                    checkboxInputs++;
                } else {
                    checkboxInputs = checkboxInputs << 1; //shift left
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

            // Skip the rest of the function if data collection is not enabled
            if (!enableDataCollection) {
                return;
            }

            $.post("/feed", {
                actionType: 'guided activity',
                postID: postID,
                modual: currentModule,
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
            if (modalNameAttrStr === "esteem_simPostModal1") {
                // if the user has selected a NEGATIVE emotion (indicated by the binary number),
                // show the second module after the first one closes.
                if ((checkboxInputs & 0b001101110) !== 0) {
                    const secondModalNameAttr = modalNameAttrStr.replace('1', '2');
                    const secondModalOpenedTime = Date.now();
                    $(`.ui.modal[data-modalName=${secondModalNameAttr}]`).modal({
                        allowMultipe: false,
                        closable: false,
                        onVisible: function() {
                            Voiceovers.playVoiceover(['CUSML.misc_06.mp3'])
                        },
                        onHide: function() {
                            Voiceovers.pauseVoiceover();
                            // Skip the rest of the function if data collection is not enabled
                            if (!enableDataCollection) {
                                return;
                            }
                            const modalClosedTime = Date.now();
                            const modalViewTime = modalClosedTime - secondModalOpenedTime;
                            const pathArrayForHeader = window.location.pathname.split('/');
                            const currentModule = pathArrayForHeader[2];
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
                                actionType: 'guided activity',
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