// console.log("Hello from the script**************")
let this_js_script = $('script[src*=identity_theft_explore]');
let emailData = this_js_script.attr('emailData');   
// console.log(emailData);
let iCurrentEmail = 0;
let openEmailTutorialDone = false;
let skipped = false;

const emails = JSON.parse(emailData);
// console.log(emails);
// console.log(emails[0]);
// // Iterate through the emails array
// emails.forEach(email => {
//   console.log("Sender:", email.sender);
//   console.log("Subject:", email.subject);
//   console.log("Date:", email.date);
//   console.log("From:", email.from);
//   console.log("Content:", email.content);
//   console.log("-------------------------");
// });

let intro2 = introJs();
let intro3 = introJs();

document.addEventListener("DOMContentLoaded", function() {
    $('.warning-button')
        .popup({
            // title   : 'Popup Title',
            // inline     : true,
            // content : 'Hello I am a popup',
            hoverable: true
        })
    ;

    // $('#nextButton').hide();
    $('#nextButton').prop('disabled', true);

    // Watch for tutorial skip, then enable free exploration of email sim

    // Use event delegation for dynamically added elements
    $(document).on('click', '.introjs-skipbutton', function() {
        $('.emailSimContainer').css('pointer-events', 'auto');
        $('.openEmailContainer').css('pointer-events', 'auto');
        // $('#nextButton').show();
        $('#nextButton').removeAttr('disabled');
        skipped = true;
    });
    
    // console.log("DOM loaded and parsed!");
    
    intro2.setOptions({
        steps: [
            {
                element: document.querySelector('.emailSimContainer'),
                position: 'auto',
                intro: "This is your email inbox. Here you will find all the emails you've received.<br><br>Click the 'Next' button below to continue. <br><img src='/images/chat-head.png' alt='age intrepid profile picture' width='125px' style='display: block; margin: 0 auto;margin-top:20px;'>",
            },
            {
                myBeforeChangeFunction: function() { 
                    $('#email-0').css('pointer-events', 'auto');  
                    setTimeout(function() {
                        $('.showOpenEmailAnimation').removeClass('hidden');
                    }, 5000);
                },
                element: document.querySelector('#email-0'),
                position: 'right',
                intro: "Each email header contains the sender's name, subject line, and the date. These details offer valuable insights right from the start.<br><br>When you're ready, click on the email to open it and learn more. <br><img src='/images/chat-head.png' alt='age intrepid profile picture' width='125px' style='display: block; margin: 0 auto;margin-top:20px;'>",
            },
            ],
        'hidePrev': true,
        'hideNext': true,
        'exitOnOverlayClick': false,
        'exitOnEsc': false,
        'showStepNumbers': false,
        'showBullets': false,
        'scrollToElement': true,
        'doneLabel': 'Done &#10003',
        tooltipClass: 'customWideTooltip',
    })
    /*
    Source: https://stackoverflow.com/a/58673991/11060111
    Source: https://stackoverflow.com/questions/36650854/how-to-make-intro-js-select-the-element-that-dynamically-generated-after-page-lo

    onbeforechange:
    "Given callback function will be called before starting a new step of
    introduction. The callback function receives the element of the new step as
    an argument."
    */
    .onbeforechange(function() {
         // check to see if there is a function on this step
        if(this._introItems[this._currentStep].myBeforeChangeFunction){
            //if so, execute it.
            this._introItems[this._currentStep].myBeforeChangeFunction();
        }
        }).onchange(function() {  //intro.js built in onchange function
        if (this._introItems[this._currentStep].myChangeFunction){
            this._introItems[this._currentStep].myChangeFunction();
        }
     })
        /*
    onafterchange:
    "Given callback function will be called after starting a new step of
    introduction. The callback function receives the element of the new step as
    an argument."
    */
    // .onafterchange(function() {
    //     // alert("The currect step is: " + this._currentStep);
    //     // make user open email
    //     if(this._currentStep === 1) {
    //         var original_onclick = $('.introjs-nextbutton').get(0).onclick;
    //         let elements = document.getElementsByTagName('a');
    //         console.log(elements);
    //         console.log(elements[13]);
    //         elements[13].style.filter = "grayscale(100%)";

    //         $('.introjs-nextbutton').addClass('introjs-disabled');
    //         $('.introjs-nextbutton').get(0).onclick = null;
    //         $('#email-0').on('click', function() {
    //             // reset next button for future use
    //             elements[13].style.filter = "";
    //             $('.introjs-nextbutton').removeClass('introjs-disabled');
    //             $('.introjs-nextbutton').get(0).onclick = original_onclick;
                
    //             // $('.emailSimContainer').hide;
    //             // $('.openEmailContainer').show;
                
    //             // activate the click for the user too so we can automatically move them along!!
    //             elements[13].click();
    //           })

    //     }
    // })
    // Start the introduction
    .start();
});


function showEmail(index) {
    intro2.exit();

    iCurrentEmail = index;
    $('#email-' + index).css('background-color', '#F2F6FC');
    // Add class "open" to the envelope icon within the email element
    $('#email-' + index).find('.envelope.icon').addClass('open');

    $('.emailSimContainer').hide();
    // console.log("email shown: ", index);

    var email = emails[index]; 
    
    // Create the main container
    var openEmailContainer = $('<div>', { class: 'openEmailContainer', id: 'openEmail-' + iCurrentEmail, });

    // Create the email segment
    var emailSegment = $('<div>', { class: 'ui padded segment' });

    // Create the closeEmailArrow button
    var closeEmailArrow = $('<button>', {
      class: 'ui circular icon button closeEmailArrow',
      onclick: 'closeEmail()'
    });
    closeEmailArrow.append($('<i>', { class: 'left arrow big icon' }));

    // Create the report button
    var reportButton = $('<button>', {
      class: 'ui circular icon button',
      id: 'report',
      onclick: 'reportEmail()',
      'data-tooltip': "Report"
    });
    reportButton.append($('<i>', { class: 'bullhorn large icon' }));
    const tooltipReport = $('<div class="report-tooltip">Report</div>');
    reportButton.append(tooltipReport);

    // Create the block button
    var blockButton = $('<button>', {
      class: 'ui circular icon button',
      id: 'block',
      onclick: 'blockEmail()',
      'data-tooltip': "Block"
    });
    blockButton.append($('<i>', { class: 'ban large icon' }));
    const tooltipBlock = $('<div class="block-tooltip">Block</div>');
    blockButton.append(tooltipBlock);

    // Create the delete button
    var deleteButton = $('<button>', {
      class: 'ui circular icon button',
      id: 'delete',
      onclick: 'deleteEmail()',
      'data-tooltip': "Delete"
    });
    deleteButton.append($('<i>', { class: 'trash alternate outline large icon' }));
    const tooltipDelete = $('<div class="delete-tooltip">Delete</div>');
    deleteButton.append(tooltipDelete);

    // Create subjectLine and inboxLabel
    var subjectLine = $('<span>', { id: 'subjectLine' }).text(email.subject);
    var inboxLabel = $('<div>', { class: 'ui label', id: 'inboxLabel' }).text('Inbox');
    inboxLabel.append($('<i>', { class: 'delete icon' }));
    subjectLine.append(inboxLabel);

    // Create openDate
    var openDate = $('<span>', { id: 'openDate' }).text(email.date);
    var openDateHeader = $('<div>', { class: 'ui right floated header' }).append(openDate);

    // Create senderInfo and emailContent
    var senderInfo = $('<div>', { class: 'content senderInfo' });
    var senderHeader = $('<div>', { class: 'header' }).text(email.sender);
    var fromEmail = $('<span>', { class: 'fromEmail' }).text(email.from);
    // var fromEmail = $('<span>', { 
    //     class: 'fromEmail', 
    //     'data-hint': 'This email comes from walmart@gmail.com. Companies usually have their own email domain, such as @walmart.com. Another big sign of an email being a scam are misspellings and inconsistencies in names. This email misspells the name of the company its pretending to be as Walmrt, instead of Walmart, which it says in their email address.', 
    //     'data-hint-position': 'bottom-middle',
    //     text: email.from 
    // });


    senderHeader.append(fromEmail);
    // add warning for walmart email
    if(email.from === "<walmrt@gmail.com>") {
        var warningButton = $('<button>', {
            class: 'ui red button warning-button walmart-1',
            text: 'WARNING'
        });

        senderHeader.append(warningButton);
    } else if(email.from === "<irsgov@gmail.com>") {
        var warningButton = $('<button>', {
            class: 'ui red button warning-button irs-1',
            text: 'WARNING'
        });

        senderHeader.append(warningButton);
    } else if(email.from === "<no-reply@dropbox.com>") {
        var warningButton = $('<button>', {
            class: 'ui green button warning-button dropbox-1',
            text: 'Review point'
        });

        senderHeader.append(warningButton);
    } else if(email.from === "<nccustudent@gmail.com>") {
        var warningButton = $('<button>', {
            class: 'ui red button warning-button nccu-1',
            text: 'WARNING'
        });

        senderHeader.append(warningButton);
    }








    senderInfo.append(senderHeader);
    
    var emailContent = $('<p>', { id: 'emailContent' }).html(email.content);

    // Create reply button
    var replyButton = $('<button>', {
      class: 'ui basic button',
      id: 'reply',
      onclick: 'replyEmail()'
    });
    replyButton.append($('<i>', { class: 'reply icon' }));
    replyButton.append('Reply');


    // Append all elements to emailSegment
    emailSegment.append(closeEmailArrow);
    emailSegment.append(reportButton);
    emailSegment.append(blockButton);
    emailSegment.append(deleteButton);
    emailSegment.append($('<div>', { class: 'ui horizontal divider' }));
    emailSegment.append(subjectLine);
    emailSegment.append(openDateHeader);
    emailSegment.append($('<div>', { class: 'ui horizontal divider' }));
    emailSegment.append($('<div>', { class: 'ui icon message' }).append($('<i>', { class: 'user circle icon' }), senderInfo));
    emailSegment.append(emailContent);
    emailSegment.append(replyButton);

    // add cursor close email animation for tutorial
    if(openEmailTutorialDone === false) {
        var closeEmailAnimation = $('<div>').addClass('showReturnToInboxAnimation hidden')
            .append($('<img>').attr('src', '/images/cursor.png'));
        emailSegment.append(closeEmailAnimation); 
    }



    // Append the new element to the body
    // $('body').append(closeEmailAnimation);


    // Append emailSegment to openEmailContainer
    openEmailContainer.append($('<br>'));
    // openEmailContainer.append(closeEmailAnimation);
    openEmailContainer.append(emailSegment);
    openEmailContainer.append($('<br>'));

    // Append openEmailContainer to the body
    $('.limit').append(openEmailContainer);




    // $('.warning-button').popup();

    if(email.from === "<walmrt@gmail.com>") {
        $('.warning-button.walmart-1').popup({
            position: 'bottom center',
            html: "This email comes from walmart@gmail.com. Companies usually have their own email domain, such as <strong>@walmart.com</strong>. Another big sign of an email being a scam are <strong>misspellings and inconsistencies</strong> in names. This email misspells the name of the company its pretending to be as <strong>Walmrt</strong>, instead of Walmart, which it says in their email address."
        });
        $('.warning-button.walmart-2').popup({
            position: 'bottom center',
            html: "Legitimate and trusted emails will include a proper header and closer, identifying you by name. This email greets you through saying &quot;Hi customer,&quot; does not clarify your name. Additionally, scam emails or messages often include words and phrases that indicate urgency. This email says &quot;URGENT!!!&quot; and &quot;NOW!&quot;"
        });
        $('.warning-button.walmart-3').popup({
            position: 'bottom center',
            html: "In a legitimate email, you will never have to click on a link to submit personal financial information. This email tells you to resubmit your credit card details. Also, suspicious links are often indicated by beginning with http://, like the one in this email rather than https://."
        });

        $('.warning-button')
            .transition('pulsating looping')
        ;
    } else if(email.from === "<irsgov@gmail.com>") {
        $('.warning-button.irs-1').popup({
            position: 'bottom center',
            html: "This email is sent from <strong>irsgov@gmail.com</strong>. The IRS is a government department, and its official domain should be '.org' instead of '.com'. Therefore, the legitimate domain for this email address should be <strong>XXX@irs.org</strong>. Furthermore, it's important to note that the IRS website explicitly states that 'The IRS will not initiate email contact with you without your consent.’"
        });
        $('.warning-button.irs-2').popup({
            position: 'bottom center',
            html: "Legitimate and trusted emails will include a proper header and closer, identifying you by name. This email greets you through saying “Dear Tax Payer”"
        });
        $('.warning-button.irs-3').popup({
            position: 'bottom center',
            html: "The IRS will never request or verify your personal information through email or a link."
        });

        $('.warning-button')
            .transition('pulsating looping')
        ;
    }   else if(email.from === "<no-reply@dropbox.com>") {
        $('.warning-button.dropbox-1').popup({
            position: 'bottom center',
            html: "Trusted companies usually have their own email domain, like this email which comes from no-reply@<strong>dropbox.com</strong>."
        });
        $('.warning-button.dropbox-2').popup({
            position: 'bottom center',
            html: "The focus on this email is ensuring the safety of your account. Scam emails will rarely offer details or make suggestions to increase your account protection."
        });

        $('.warning-button')
            .transition('pulsating looping')
        ;
    } else if(email.from === "<nccustudent@gmail.com>") {
        $('.warning-button.nccu-1').popup({
            position: 'bottom center',
            html: "Always check if you recognize the sender's email address. If the sender's email address is unfamiliar or suspicious, exercise caution and do not click on any links or provide personal information."
        });
        $('.warning-button.nccu-2').popup({
            position: 'bottom center',
            html: "A popular type of scam email is when people pretend like they know you and ask for money. This email does not address you by name or ask you any questions indicating they have a personal relationship with you. "
        });
        $('.warning-button.nccu-3').popup({
            position: 'bottom center',
            html: "One major red flag that indicates this email is a scam is the request to send money to an unfamiliar recipient."
        });

        $('.warning-button')
            .transition('pulsating looping')
        ;
    }
    
    // Event handler for stopping the pulsating and removing 'red' class on click
    $('.warning-button').on('click', function() {
        // $(this).remove(); 

        $(this).transition('stop');
        $(this).removeClass('red green pulsating transition'); 
        $(this).addClass('hide-after');
        $(this).text('Reviewed');
        
        // $(this).addClass('green'); 
    });
    
    // $('#container').on('mouseenter', '.warning-button', function() {
    //     $(this).popup({
    //         content: $(this).attr('data-content'),
    //         position: $(this).attr('data-position')
    //     }).popup('show');
    // });

    console.log("Skipped: ", skipped);
    if(openEmailTutorialDone === false && skipped === false) {
        intro3.setOptions({
            steps: [
                {
                    myBeforeChangeFunction: function() { 
                        if(skipped === false) {
                            $('.openEmailContainer').css('pointer-events', 'none');
                        }
                    },
                    element: document.querySelector('.openEmailContainer .ui.padded.segment'),
                    position: 'right',
                    intro: "An opened email reveals the sender's information and message content. From here you can reply, report, block, or delete it. Let's explore these options. <br><img src='/images/chat-head.png' alt='age intrepid profile picture' width='125px' style='display: block; margin: 0 auto;margin-top:20px;'>",
                },
                {
                    element: document.querySelector('.left.arrow.big.icon'),
                    position: 'right',
                    intro: "<strong>Return Button</strong><br><br>This button takes you back to your inbox home page.",
                },
                {
                    element: document.querySelector('#report'),
                    position: 'right',
                    intro: "<strong>Report Button</strong><br><br>By reporting an email you're helping to protect not only yourself but also others from potential scams or cyberattacks.",
                },
                {
                    element: document.querySelector('#block'),
                    position: 'right',
                    intro: "<strong>Block Button</strong><br><br>If you're constantly receiving annoying emails or spam from a particular sender, you can use this function to prevent them from bothering you.",
                },
                {
                    element: document.querySelector('#delete'),
                    position: 'right',
                    intro: "<strong>Delete Button</strong><br><br>Deleting an email is like throwing away junk mail from your physical mailbox.",
                },
                {
                    element: document.querySelector('#reply'),
                    position: 'right',
                    intro: "<strong>Reply Button</strong><br><br>Allows you to send back a message in response.",
                },
                {
                    myBeforeChangeFunction: function() { 
                        $('.openEmailContainer').css('pointer-events', 'auto');  
                        // $('#nextButton').show();
                        $('#nextButton').removeAttr('disabled');
                        setTimeout(function() {
                            $('.showReturnToInboxAnimation').removeClass('hidden');
                        }, 5000);
                    },
                    element: document.querySelector('.ui.padded.segment'),
                    position: 'right',
                    intro: "This concludes the tutorial for the email inbox. You now know everything you need to know to begin managing your emails and dealing with spam.<br><br>Click the top left arrow button to return to your inbox and begin exploring.<br><img src='/images/chat-head.png' alt='age intrepid profile picture' width='125px' style='display: block; margin: 0 auto;margin-top:20px;'>",
                },
                ],
            'hidePrev': true,
            'hideNext': true,
            'exitOnOverlayClick': false,
            'exitOnEsc': false,
            'showStepNumbers': false,
            'showBullets': false,
            'scrollToElement': true,
            'doneLabel': 'Done &#10003',
            tooltipClass: 'customWideTooltip',
        })
        .onbeforechange(function() {
            // check to see if there is a function on this step
           if(this._introItems[this._currentStep].myBeforeChangeFunction){
               //if so, execute it.
               this._introItems[this._currentStep].myBeforeChangeFunction();
           }
           }).onchange(function() {  //intro.js built in onchange function
           if (this._introItems[this._currentStep].myChangeFunction){
               this._introItems[this._currentStep].myChangeFunction();
           }
        }).start();    

        openEmailTutorialDone = true;
        $('.emailSimContainer').css('pointer-events', 'auto');  
        $('.showOpenEmailAnimation').addClass('hidden');


    }
    // intro2.addStep({
    //     element: document.querySelector('#report'),
    //     intro: 'Yooo, here is the starting dialog'
    // }).addStep({
    //     element: document.querySelector('#block'), // Specify the element for the next step
    //     intro: 'This is the second step'
    // }).addStep({
    //     element: document.querySelector('#delete'), // Specify the element for the third step
    //     intro: 'And this is the third step'
    // }).addStep({
    //     element: document.querySelector('#reply'), // Specify the element for the third step
    //     intro: 'And this is the third step'
    // }).addStep({
    //     element: document.querySelector('.left.arrow.big.icon'), // Specify the element for the third step
    //     intro: 'And this is the third step'
    // }).start();
}
  
function closeEmail() {
    intro3.exit();

    $('.openEmailContainer').remove();
    $('.emailSimContainer').show();
    $('.showOpenEmailAnimation').addClass('hidden');
    // console.log("email closed");
}
  
function reportEmail() {
    // console.log("email reported");
    let responseTitle;
    if(emails[iCurrentEmail].reportHeader === "warning"){
        responseTitle = '<i class="exclamation triangle red icon"></i> Warning';
    } else {
        responseTitle = '<i class="check circle green icon"></i> Good Job';
    }

    $.modal({
        title: responseTitle,
        classTitle: 'modalTitle',
        class: 'small emailSimModal',
        closeIcon: true,
        content: emails[iCurrentEmail].reportContent,
        actions: [
            {
                text: 'Back to Email',
                class: 'ui black basic big button',
                click: function () {
                    $(this).modal('hide');
                }
            },
            {
                text: 'See Why',
                class: 'ui blue big button',
                click: function () {
                    $(this).modal('hide');
                    introJs().addHints();
                }
            }, 
        ],
        classActions: 'center aligned'
    }).modal('show');

    // old way with just "got it" action
    // $.modal({
    //     title: responseTitle,
    //     classTitle: 'modalTitle',
    //     class: 'small emailSimModal',
    //     closeIcon: true,
    //     content: emails[iCurrentEmail].reportContent,
    //     actions: [{
    //       text: 'Got it',
    //       class: 'blue big'
    //     }]
    // }).modal('show');
    $('.dimmable.dimmed').css('margin-right', '0px');
}
  
function blockEmail() {
    // console.log("email blocked");

    let responseTitle;
    if(emails[iCurrentEmail].blockHeader === "warning"){
        responseTitle = '<i class="exclamation triangle red icon"></i> Warning';
    } else {
        responseTitle = '<i class="check circle green icon"></i> Good Job';
    }

    $.modal({
        title: responseTitle,
        classTitle: 'modalTitle',
        class: 'small emailSimModal',
        closeIcon: true,
        content: emails[iCurrentEmail].blockContent,
        actions: [{
          text: 'Got it',
          class: 'blue big'
        }]
    }).modal('show');
    $('.dimmable.dimmed').css('margin-right', '0px');
}
  
function deleteEmail() {
    // $('.openEmailContainer').remove();
    // $('.emailSimContainer').show();

    // console.log("email deleted");

    let responseTitle;
    if(emails[iCurrentEmail].deleteHeader === "warning"){
        responseTitle = '<i class="exclamation triangle red icon"></i> Warning';
    } else {
        responseTitle = '<i class="check circle green icon"></i> Good Job';
    }

    $.modal({
        title: responseTitle,
        classTitle: 'modalTitle',
        class: 'small emailSimModal',
        closeIcon: true,
        content: emails[iCurrentEmail].deleteContent,
        actions: [{
          text: 'Got it',
          class: 'blue big'
        }]
    }).modal('show');
    $('.dimmable.dimmed').css('margin-right', '0px');
}
  
function replyEmail() {
    // console.log("email replied");

    let responseTitle;
    if(emails[iCurrentEmail].replyHeader === "warning"){
        responseTitle = '<i class="exclamation triangle red icon"></i> Warning';
    } else {
        responseTitle = '<i class="check circle green icon"></i> Good Job';
    }

    $.modal({
        title: responseTitle,
        classTitle: 'modalTitle',
        class: 'small emailSimModal',
        closeIcon: true,
        content: emails[iCurrentEmail].replyContent,
        actions: [{
          text: 'Got it',
          class: 'blue big'
        }]
    }).modal('show');
    $('.dimmable.dimmed').css('margin-right', '0px');
}
  

function linkClick() {
    // console.log("link clicked");

    $.modal({
        title: '<i class="exclamation triangle red icon"></i> Warning',
        classTitle: 'modalTitle',
        class: 'small emailSimModal',
        closeIcon: true,
        content: 'This email is indicative of an identity theft scam. Clicking on the link is dangerous! The safe options would be to block sender, report scam, or delete the email.',
        actions: [{
          text: 'Got it',
          class: 'blue big'
        }]
    }).modal('show');
    $('.dimmable.dimmed').css('margin-right', '0px');
}
  