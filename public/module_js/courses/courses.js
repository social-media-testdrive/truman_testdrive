$('.message .close')
.on('click', function() {
    $(this)
        .closest('.message')
        .transition('fade')
    ;
})
;
function resetIdentityProgress() {
let subdirectory2 = "identity"; 
let percent_to_post = 0;
let link_to_post = "/intro/identity";

//- reset module progress in database
fetch('/postModuleProgress', {
method: 'POST',
headers: {
  'Content-Type': 'application/json'
},
//data to be sent in the request body
body: JSON.stringify({
  "modID": subdirectory2, // current module ID so we can update the right module in the database
  "percent": percent_to_post, // percent of the module completed
  "link": link_to_post, // link to the current page
})
})
.then(response => {
if (response.ok) {
  // Request was successful
  console.log('Module progress reset successfully!');
  //- reload the page
  location.reload();
} else {
  // Handle error response
  console.error('Failed to reset module progress');
}
})
.catch(error => {
// Handle network or fetch error
console.error(error);
});


}

