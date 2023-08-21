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
    console.log("email shown: ", index);
}
  
function closeEmail() {
    console.log("email closed");
}
  