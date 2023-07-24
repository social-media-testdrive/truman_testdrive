function postModuleProgress(link_to_post, percent_to_post) {
    // console.log("THE NEXT LINX IS: " + link_to_post);
    // console.log("THE PERCENT TO POST IS: " + percent_to_post);    
    
    // resource: https://stackoverflow.com/questions/2190801/passing-parameters-to-javascript-files
    // let this_js_script = $('script[src*=progress]');
    // let percent_to_post = this_js_script.attr('percent');   
    // let link_to_post = this_js_script.attr('link');   

    // console.log("In progress.js");
    // console.log(percent_to_post);
    // console.log(link_to_post);

    let pathArray = window.location.pathname.split('/');
    let subdirectory1 = pathArray[1]; // e.g. "intro"
    let subdirectory2 = pathArray[2]; // e.g. "identity"

    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

    // POST module progress to database
    fetch('/postModuleProgress', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': csrfToken
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
            console.log('Module progress posted successfully!');
            // Now can navigate to the next page
            window.location.href = link_to_post;
        } else {
            // Handle error response
            console.error('Failed to post module progress');
        }
    })
    .catch(error => {
        // Handle network or fetch error
        console.error(error);
    });
};
