function postStartTime(modID, page) {
    console.log("In startTime post function");
    console.log("Module ID: " + modID);
    console.log("Page URL: " + page);


    // POST module progress to database
    fetch('/postStartTime', {
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
            console.log('Page start time posted successfully!');
        } else {
            // Handle error response
            console.error('Failed to post page start time');
        }
    })
    .catch(error => {
        // Handle network or fetch error
        console.error(error);
    });
};
