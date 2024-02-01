function postBadge(module, section, type, name, imageUrl) {

    // POST badge to database
        fetch('/postBadge', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            //data to be sent in the request body
            body: JSON.stringify({
                "module": module,
                "section": section,
                "type": type,
                "name": name, 
                "imageUrl": imageUrl, 
            })
        })
        .then(response => {
            if (response.ok) {
                // Request was successful
                console.log('Badge posted successfully!');
            } else {
                // Handle error response
                console.error('Failed to post badge');
            }
        })
        .catch(error => {
            // Handle network or fetch error
            console.error(error);
        });
    
    
    
    };