function postModuleProgress(module_id, page, link_to_post, percent_to_post, current_percent) {
    // $('#loadingScreen').removeClass('hidden');
    $('#nextButton').text('Loading...');
    $('#nextButton').css('pointer-events', 'none');

    postEndTime(module_id, page, "none");
    // fetch('/postEndTime', {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json'
    //     },
    //     //data to be sent in the request body
    //     body: JSON.stringify({
    //         "modID": module_id, 
    //         "page": page, 
    //     })
    // })
    // .then(response => {
    //     if (response.ok) {
    //         // Request was successful
    //         console.log('Page END time posted successfully!');
    //     } else {
    //         // Handle error response
    //         console.error('Failed to post page END time');
    //     }
    // })


    const parsedPercentToPost = parseInt(percent_to_post);
    const parsedCurrentPercent = parseInt(current_percent);

    if (parsedPercentToPost > parsedCurrentPercent && parsedPercentToPost < 100) {
        // POST module progress to database
        fetch('/postModuleProgress', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "modID": module_id,
                "percent": parsedPercentToPost,
                "link": link_to_post,
            })
        })
        .then(response => {
            if (response.ok) {
                console.log('Module progress posted successfully!');
                window.location.href = link_to_post;
            } else {
                console.error('Failed to post module progress');
            }
        })
        .catch(error => {
            console.error(error);
        });
    } else {
        window.location.href = link_to_post;
    }
}
