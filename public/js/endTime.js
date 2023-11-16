function postEndTime(modID, page, backLink) {    // console.log("Post end time")
    // back link set to none when coming from postModuleProgress
    // we only want it to navigate to back page when the back button was clicked from the footer nav
    // console.log("!!! In endTime post function");
    // console.log("!!! Module ID: " + modID);
    // console.log("!!! Page Name: " + page);
    // console.log("!!! Back link: " + backLink);
    // console.log("!!! In endTime.js post function**********");

    // POST module progress to database
    fetch('/postEndTime', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
            // 'X-CSRF-Token': csrfToken
        },
        //data to be sent in the request body
        body: JSON.stringify({
            "modID": modID, 
            "page": page, 
        })
    })
    .then(response => {
        if (response.ok) {
            // Request was successful
            // console.log('Page END time posted successfully!');
            if(backLink !== "none") {
                window.location.href = backLink;
            }
        } else {
            // Handle error response
            console.error('Failed to post page END time');
        }
    })

    if(backLink !== "none") {
        window.location.href = backLink;
    }

    
};
