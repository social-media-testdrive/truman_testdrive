console.log("Hello from the script**************")
let this_js_script = $('script[src*=identity_theft_explore]');
let emailData = this_js_script.attr('emailData');   
console.log(emailData);


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

function showEmail(index) {
    $('#email-' + index).css('background-color', '#F2F6FC');
    // Add class "open" to the envelope icon within the email element
    $('#email-' + index).find('.envelope.icon').addClass('open');

    $('.emailSimContainer').hide();
    console.log("email shown: ", index);

    var email = emails[index]; // Replace with your method to fetch email data
    
    // Create the main container
    var openEmailContainer = $('<div>', { class: 'openEmailContainer' });

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
      id: 'report'
    });
    reportButton.append($('<i>', { class: 'bullhorn large icon' }));

    // Create the ban button
    var banButton = $('<button>', {
      class: 'ui circular icon button',
      id: 'ban'
    });
    banButton.append($('<i>', { class: 'ban large icon' }));

    // Create the delete button
    var deleteButton = $('<button>', {
      class: 'ui circular icon button',
      id: 'delete'
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
    
    var emailContent = $('<p>', { id: 'emailContent' }).text(email.content);

    // Create reply button
    var replyButton = $('<button>', {
      class: 'ui basic button',
      id: 'reply'
    });
    replyButton.append($('<i>', { class: 'reply icon' }));
    replyButton.append('Reply');

    // Append all elements to emailSegment
    emailSegment.append(closeEmailArrow);
    emailSegment.append(reportButton);
    emailSegment.append(banButton);
    emailSegment.append(deleteButton);
    emailSegment.append($('<div>', { class: 'ui horizontal divider' }));
    emailSegment.append(subjectLine);
    emailSegment.append(openDateHeader);
    emailSegment.append($('<div>', { class: 'ui horizontal divider' }));
    emailSegment.append($('<div>', { class: 'ui icon message' }).append($('<i>', { class: 'user circle icon' }), senderInfo));
    emailSegment.append(emailContent);
    emailSegment.append(replyButton);

    // Append emailSegment to openEmailContainer
    openEmailContainer.append(emailSegment);
    
    // Append openEmailContainer to the body
    $('.limit').append(openEmailContainer);

    
}
  
function closeEmail() {
    $('.openEmailContainer').remove();
    $('.emailSimContainer').show();

    console.log("email closed");
}
  
