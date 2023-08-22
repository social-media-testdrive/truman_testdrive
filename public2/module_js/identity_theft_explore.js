console.log("Hello from the script**************")
let this_js_script = $('script[src*=identity_theft_explore]');
let emailData = this_js_script.attr('emailData');   
console.log(emailData);
let iCurrentEmail = 0;
let openEmailTutorialDone = false;

const emails = JSON.parse(emailData);
console.log(emails);
console.log(emails[0]);
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
    $('#nextButton').hide();
    console.log("DOM loaded and parsed!");
    
    intro2.setOptions({
        steps: [
            {
                element: document.querySelector('.emailSimContainer'),
                position: 'auto',
                intro: "This is your email inbox. Here you will find all the emails you've received.<br><br>Click the 'Next' button below to continue. <br><img src='/images/chat-head.png' alt='age intrepid profile picture' width='125px' style='display: block; margin: 0 auto;margin-top:20px;'>",
            },
            {
                myBeforeChangeFunction: function() { 
                    $('.emailSimContainer').css('pointer-events', 'auto');  
                },
                element: document.querySelector('#email-0'),
                position: 'right',
                intro: "Each email header contains the sender's name, subject line, and the date. These details offer valuable insights right from the start.<br><br>When you're ready, click on an email to open it and learn more. <br><img src='/images/chat-head.png' alt='age intrepid profile picture' width='125px' style='display: block; margin: 0 auto;margin-top:20px;'>",
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
    console.log("email shown: ", index);

    var email = emails[index]; // Replace with your method to fetch email data
    
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
      onclick: 'reportEmail()'
    });
    reportButton.append($('<i>', { class: 'bullhorn large icon' }));

    // Create the block button
    var blockButton = $('<button>', {
      class: 'ui circular icon button',
      id: 'block',
      onclick: 'blockEmail()'
    });
    blockButton.append($('<i>', { class: 'ban large icon' }));

    // Create the delete button
    var deleteButton = $('<button>', {
      class: 'ui circular icon button',
      id: 'delete',
      onclick: 'deleteEmail()'
    });
    deleteButton.append($('<i>', { class: 'trash alternate outline large icon' }));

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
    senderHeader.append(fromEmail);
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

    // Append emailSegment to openEmailContainer
    openEmailContainer.append($('<br>'));
    openEmailContainer.append(emailSegment);
    openEmailContainer.append($('<br>'));

    // Append openEmailContainer to the body
    $('.limit').append(openEmailContainer);

    if(openEmailTutorialDone === false) {
        intro3.setOptions({
            steps: [
                {
                    myBeforeChangeFunction: function() { 
                        $('.openEmailContainer').css('pointer-events', 'none');  
                    },
                    element: document.querySelector('.openEmailContainer .ui.padded.segment'),
                    position: 'right',
                    intro: "An opened email reveals the sender's information and message content. From here you can reply, report, block, or delete it. Let's explore these options. <br><img src='/images/chat-head.png' alt='age intrepid profile picture' width='125px' style='display: block; margin: 0 auto;margin-top:20px;'>",
                },
                {
                    element: document.querySelector('.left.arrow.big.icon'),
                    position: 'right',
                    intro: "This button is used to return back the your inbox home page.<br><br>This concludes the tutorial for the email inbox. Click the 'Done' button below to exit the tutorial.",
                },
                {
                    element: document.querySelector('#report'),
                    position: 'right',
                    intro: "This button is used to report this email as spam. By using the 'Report' function, you're telling the email system that this email might be a problem. By doing this, you're helping to protect not only yourself but also others from potential scams or cyberattacks.",
                },
                {
                    element: document.querySelector('#block'),
                    position: 'right',
                    intro: "This button is used to block the sender of this email. If you're constantly receiving annoying emails or spam from a particular sender, you can use this function to prevent them from bothering you. It's a way to safeguard your inbox against unwanted content and maintain a clutter-free environment.",
                },
                {
                    element: document.querySelector('#delete'),
                    position: 'right',
                    intro: "This button is used to delete this email. Clicking 'Delete' is like throwing away junk mail from your physical mailbox. By using this, you're keeping your inbox clean and reducing the chances of accidentally opening harmful emails.",
                },
                {
                    element: document.querySelector('#reply'),
                    position: 'right',
                    intro: "This button is used to reply to this email. After clicking it you can then type your response and send it back to the sender.",
                },
                {
                    myBeforeChangeFunction: function() { 
                        $('.openEmailContainer').css('pointer-events', 'auto');  
                        $('#nextButton').show();
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
        actions: [{
          text: 'Got it',
          class: 'blue big'
        }]
    }).modal('show');
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
  