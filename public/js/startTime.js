function postStartTime(module_id, pageURL) {
    console.log("In startTime post function");
    console.log("Module ID: " + module_id);
    console.log("Page URL: " + pageURL);


    // POST module progress to database
    fetch('/postStartTime', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
            // 'X-CSRF-Token': csrfToken
        },
        //data to be sent in the request body
        body: JSON.stringify({
            "modID": module_id, 
            "pageURL": pageURL, 
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
