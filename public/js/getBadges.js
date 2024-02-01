function getBadges() {
    console.log("calling getBadges"); 
    
    // GET array of URL's from database to display on the front end 
        fetch('/getBadges', { 
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        })
        .then(response => {
            if (response.ok) {
                // Request was successful
                console.log('GetBadges() successful!');
                console.log(response.data); 
            } else {
                // Handle error response
                console.error('Failed to get badges');
            }
        })
        .catch(error => {
            // Handle network or fetch error
            console.error(error);
        });
    
    
    
};