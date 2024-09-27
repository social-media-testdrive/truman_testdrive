// function setupPractice() {
//     // Start with showing the loader screen
//     $('#loadingScreen').removeClass('hidden');

//     setTimeout(function() {
//         $('.elastic.loader').removeClass('blue').addClass('red');  // Turn the loader red
//         $('#loader-text').text('ERROR').addClass('red');  // Change text to "ERROR" and make it red
        
//         // Trigger the virus detected pop-ups
//         setTimeout(function() {
//             $('#loadingScreen').addClass('hidden');  // Hide the loading screen
//             $('#scam-popup').modal('show');  // Show the scam popup modal

//             // Create 10 "Virus detected" pop-ups and append them to #displaypage with a staggered delay
//             for (let i = 0; i < 10; i++) {
//                 setTimeout(function() {
//                     let popup = document.createElement("div");
//                     popup.classList.add("ad");
//                     popup.textContent = "Virus detected!";
//                     document.querySelector('#scam-simulation').appendChild(popup);
//                 }, i * 300);  // Each popup will appear 500ms after the previous one
//             }
//         }, 5000);  // Wait 2 seconds after showing the error before showing the popup and triggering the pop-ups

//     }, 3000);  // Wait 5 seconds before changing to the error message
// }


function setupPractice() {
    document.querySelectorAll('.ui.button[data-choice]').forEach(button => {
        button.addEventListener('click', function () {
            const choice = this.getAttribute('data-choice');

            console.log("The user choose path: ", choice);
            //   var choiceData = {
            //     choice: choice,
            //   };
            if(choice === "call") {
                // window.location.href = "course-player?module=tech&section=practice&page=call";

                setLinks("call");
                $('#scam-popup').modal('hide');
                $('#nextButton').click();
            } else if(choice === "close") {
                window.location.href = "course-player?module=tech&section=practice&page=close";
                // const urlParams = new URLSearchParams(window.location.search);
                // const currentPage = urlParams.get('page');
        
                // setLinks("close");
                // $('#scam-popup').modal('hide');
                // const { backlink, nextlink } = setLinks(currentPage);
                // history.pushState(null, '', backlink);
        
                            // fade out current page, then fade in previous page. at half duration each, 400ms total
            $('#' + currentPage).transition({
                animation: 'fade out',
                duration: 200,
                onComplete: function() {
                    console.log('fade out complete');
                    }
            });
        
                // $('#nextButton').click();

            } else if(choice === "friends") {
                window.location.href = "course-player?module=tech&section=practice&page=friends";

                // setLinks("friends");
                // $('#scam-popup').modal('hide');
                // $('#nextButton').click();
            } else if(choice === "search") {
                window.location.href = "course-player?module=tech&section=practice&page=search";

                // setLinks("search");
                // $('#scam-popup').modal('hide');
                // $('#nextButton').click();
            }
            
        });
      });              
    

    // Start with showing the loader screen
    $('#loadingScreen').removeClass('hidden');

    // After 5 seconds, change the loader to an error message
    setTimeout(function() {
        $('.elastic.loader').removeClass('blue').addClass('red');  // Turn the loader red
        $('#loader-text').text('ERROR: SYSTEM CORRUPTED!!').addClass('red');  // Change text to "ERROR" and make it red
        $('#loader-text').transition('tada');
      
        // Create 10 "Virus detected" pop-ups
        // for (let i = 0; i < 10; i++) {
        //     let popup = document.createElement("div");
        //     popup.classList.add("ad");
        //     popup.textContent = "Virus detected!";
        //     document.querySelector('#activity').appendChild(popup);
        // }


        // for (let i = 0; i < 10; i++) {
        //     setTimeout(function() {
        //         let popup = document.createElement("div");
        //         popup.classList.add("ad");
        //         popup.textContent = "Virus detected!";
        //         document.querySelector('#scam-simulation').appendChild(popup);
        //     }, i * 300);  // Each popup will appear 500ms after the previous one
        // }

        setTimeout(function() {
            for (let i = 0; i < 30; i++) {
                setTimeout(function() {
                    let popup = document.createElement("div");
                    popup.classList.add("ad");
                    popup.textContent = "Virus detected!";

                    // Generate random positions for top and left
                    let topPosition = Math.floor(Math.random() * 80) + 10;  // Random value between 10% and 90%
                    let leftPosition = Math.floor(Math.random() * 80) + 10;  // Random value between 10% and 90%

                    // Apply the random positions
                    popup.style.top = topPosition + '%';
                    popup.style.left = leftPosition + '%';

                    document.querySelector('#scam-simulation').appendChild(popup);
                    $(popup).transition('flash');

                }, i * 300);  // Each popup will appear 300ms after the previous one
            }

            setTimeout(function() {
                $('#loadingScreen').addClass('hidden');  // Hide the loading screen
                $('#scam-popup').modal('show');  // Show the scam popup modal
            }, 4000);  // Wait 4 seconds after showing the error before showing the popup
    
        }, 1500);  // Wait 1.5 second after showing the error before showing the virus detected messages



    }, 2000);  // Wait 2 seconds before changing to the error message
}
