const progressBar = document.getElementById('theft-progress');
let pageReload= false;

$(document).ready(function() {
    // Load the first page based on the URL
    // console.log("The start page: " + startPage);
    setLinks(startPage);
    updateProgressBar();


    $('#backButton').on('click', function() {
        // console.log("Back button clicked");
        const urlParams = new URLSearchParams(window.location.search);
        const currentPage = urlParams.get('page');

        $('.ui.sidebar').sidebar('hide');


        const { backlink, nextlink } = setLinks(currentPage);
        history.pushState(null, '', backlink);

        const backParams = new URLSearchParams(backlink);
        const backPage = backParams.get('page');

        if(backPage === null) {
            window.location.href = backlink;
        } 
        // instead have it so only if they press the back button on the first page of the module, it will reload the page
        else if(currentPage != 'intro-video' && (backPage === 'objectives' || backPage === 'intro') ) {
            // console.log("page reloaded just now!!!!!!!!!!!!!!!")
            // console.log("current page is just now: " + currentPage)
            // console.log("back page is just now: " + backPage)
            location.reload();
        } 
        else {
            // fade out current page, then fade in previous page. at half duration each, 400ms total
            $('#' + currentPage).transition({
                animation: 'fade out',
                duration: 200,
                onComplete: function() {
                    if(backPage === 'types') {
                        $('#steps-slider').slick("refresh");
                        $('#image-slider').slick("refresh");
                    } 

                    if(section === 'techniques' && currentPage === 'activity') {
                        var introDiv = document.getElementsByClassName("introjs-hints")[0];
                        introDiv.parentNode.removeChild(introDiv);
                    }

                    $('#' + backPage).transition({
                        animation: 'fade in',
                        duration: 200,
                    });

                    if(section === "techniques" && backPage === 'activity') {
                        introJs().addHints();
                    }

                    if(section === 'practice' && backPage === 'activity') {
                        let intro2 = introJs();
                        intro2.setOptions({
                            steps: [
                                {
                                    element: document.querySelector('.emailSimContainer'),
                                    position: 'auto',
                                    intro: "This is your email inbox. Here you will find all the emails you've received.<br><br>Click the 'Next' button below to continue. <br><img src='/images/chat-head.png' alt='age intrepid profile picture' width='125px' style='display: block; margin: 0 auto;margin-top:20px;'>",
                                },
                                {
                                    myBeforeChangeFunction: function() { 
                                        $('#email-0').css('pointer-events', 'auto');  
                                        setTimeout(function() {
                                            $('.showOpenEmailAnimation').removeClass('hidden');
                                        }, 5000);
                                    },
                                    element: document.querySelector('#email-0'),
                                    position: 'right',
                                    intro: "Each email header contains the sender's name, subject line, and the date. These details offer valuable insights right from the start.<br><br>When you're ready, click on the email to open it and learn more. <br><img src='/images/chat-head.png' alt='age intrepid profile picture' width='125px' style='display: block; margin: 0 auto;margin-top:20px;'>",
                                },
                                ],
                            'hidePrev': true,
                            'hideNext': true,
                            'exitOnOverlayClick': false,
                            'exitOnEsc': false,
                            'showStepNumbers': false,
                            'showBullets': false,
                            'scrollToElement': true,
                            'doneLabel': 'Done &#10003',
                            tooltipClass: 'customWideTooltip',
                        })
                        .onbeforechange(function() {
                            // check to see if there is a function on this step
                            if(this._introItems[this._currentStep].myBeforeChangeFunction){
                                //if so, execute it.
                                this._introItems[this._currentStep].myBeforeChangeFunction();
                            }
                            }).onchange(function() {  //intro.js built in onchange function
                            if (this._introItems[this._currentStep].myChangeFunction){
                                this._introItems[this._currentStep].myChangeFunction();
                            }
                        })
                        .start();
                    }
    
    
                }
            });
        }
        updateProgressBar();
    });
    
    $('#nextButton').on('click', function() {
        const urlParams = new URLSearchParams(window.location.search);
        const currentPage = urlParams.get('page');
        
        $('.ui.sidebar').sidebar('hide');

        const { backlink, nextlink } = setLinks(currentPage);
        history.pushState(null, '', nextlink);

        const nextParams = new URLSearchParams(nextlink);
        const nextPage = nextParams.get('page');

        if(nextPage === 'objectives' || nextPage === 'intro') {
            location.reload();
        }

        // fade out current page, then fade in next page. at half duration each, 400ms total
        $('#' + currentPage).transition({
            animation: 'fade out',
            duration: 200,
            onComplete: function() {
                if(nextPage === 'types') {
                    $('#steps-slider').slick("refresh");
                    $('#image-slider').slick("refresh");
                }   

                if(section === 'techniques' && currentPage === 'activity') {
                    var introDiv = document.getElementsByClassName("introjs-hints")[0];
                    introDiv.parentNode.removeChild(introDiv);
                }

                $('#' + nextPage).transition({
                    animation: 'fade in',
                    duration: 200,
                });
                if (nextPage === 'quiz' && $('.preButton').text() != 'Try Again') {
                    $("#nextButton").hide();
                    $("#backButton").hide();
                    $("#module-footer").hide();
                } 
                if(section === "techniques" && nextPage === 'activity') {
                    introJs().addHints();
                }
                if(section === 'practice' && nextPage === 'activity') {
                    let intro2 = introJs();
                    intro2.setOptions({
                        steps: [
                            {
                                element: document.querySelector('.emailSimContainer'),
                                position: 'auto',
                                intro: "This is your email inbox. Here you will find all the emails you've received.<br><br>Click the 'Next' button below to continue. <br><img src='/images/chat-head.png' alt='age intrepid profile picture' width='125px' style='display: block; margin: 0 auto;margin-top:20px;'>",
                            },
                            {
                                myBeforeChangeFunction: function() { 
                                    $('#email-0').css('pointer-events', 'auto');  
                                    setTimeout(function() {
                                        $('.showOpenEmailAnimation').removeClass('hidden');
                                    }, 5000);
                                },
                                element: document.querySelector('#email-0'),
                                position: 'right',
                                intro: "Each email header contains the sender's name, subject line, and the date. These details offer valuable insights right from the start.<br><br>When you're ready, click on the email to open it and learn more. <br><img src='/images/chat-head.png' alt='age intrepid profile picture' width='125px' style='display: block; margin: 0 auto;margin-top:20px;'>",
                            },
                            ],
                        'hidePrev': true,
                        'hideNext': true,
                        'exitOnOverlayClick': false,
                        'exitOnEsc': false,
                        'showStepNumbers': false,
                        'showBullets': false,
                        'scrollToElement': true,
                        'doneLabel': 'Done &#10003',
                        tooltipClass: 'customWideTooltip',
                    })
                    .onbeforechange(function() {
                        // check to see if there is a function on this step
                        if(this._introItems[this._currentStep].myBeforeChangeFunction){
                            //if so, execute it.
                            this._introItems[this._currentStep].myBeforeChangeFunction();
                        }
                        }).onchange(function() {  //intro.js built in onchange function
                        if (this._introItems[this._currentStep].myChangeFunction){
                            this._introItems[this._currentStep].myChangeFunction();
                        }
                    })
                    .start();
                }

            }
        });

        updateProgressBar();

    });
});

function setLinks(currentPage) {
    let backlink, nextlink;

    // console.log("module: " + module + " section: " + section + " page: " + currentPage);
    

    if(!pageReload) {
        $('#' + currentPage).transition({
            animation: 'fade in',
            onComplete: function() {
                if(section === "techniques" && currentPage === 'activity') {
                    introJs().addHints();
                }

                if(section === 'practice' && currentPage === 'activity') {
                    intro2.setOptions({
                        steps: [
                            {
                                element: document.querySelector('.emailSimContainer'),
                                position: 'auto',
                                intro: "This is your email inbox. Here you will find all the emails you've received.<br><br>Click the 'Next' button below to continue. <br><img src='/images/chat-head.png' alt='age intrepid profile picture' width='125px' style='display: block; margin: 0 auto;margin-top:20px;'>",
                            },
                            {
                                myBeforeChangeFunction: function() { 
                                    $('#email-0').css('pointer-events', 'auto');  
                                    setTimeout(function() {
                                        $('.showOpenEmailAnimation').removeClass('hidden');
                                    }, 5000);
                                },
                                element: document.querySelector('#email-0'),
                                position: 'right',
                                intro: "Each email header contains the sender's name, subject line, and the date. These details offer valuable insights right from the start.<br><br>When you're ready, click on the email to open it and learn more. <br><img src='/images/chat-head.png' alt='age intrepid profile picture' width='125px' style='display: block; margin: 0 auto;margin-top:20px;'>",
                            },
                            ],
                        'hidePrev': true,
                        'hideNext': true,
                        'exitOnOverlayClick': false,
                        'exitOnEsc': false,
                        'showStepNumbers': false,
                        'showBullets': false,
                        'scrollToElement': true,
                        'doneLabel': 'Done &#10003',
                        tooltipClass: 'customWideTooltip',
                    })
                    .onbeforechange(function() {
                        // check to see if there is a function on this step
                        if(this._introItems[this._currentStep].myBeforeChangeFunction){
                            //if so, execute it.
                            this._introItems[this._currentStep].myBeforeChangeFunction();
                        }
                        }).onchange(function() {  //intro.js built in onchange function
                        if (this._introItems[this._currentStep].myChangeFunction){
                            this._introItems[this._currentStep].myChangeFunction();
                        }
                    })
                    .start();
                }
            }
        });


        pageReload = true;
    }

    // if(currentPage === 'objectives' || currentPage === 'intro') {
    //     $('#backButton').on('click', function() {
    //         location.reload();
    //         // window.location.href = backlink;
    //     });
    // }

    if(section === 'challenge') {
        let baseurl = '/course-player?module=identity&section=challenge&page=';

        if(currentPage === 'intro') {
            backlink = '/about/identity';
            nextlink = baseurl + 'quiz'; 
        } else if(currentPage === 'quiz') {            
            backlink = baseurl + 'intro';
            nextlink = baseurl + 'badge';
        } else if(currentPage === 'badge') {
            backlink = baseurl + 'quiz';
            nextlink = '/course-player?module=identity&section=concepts&page=objectives';
        }
    } else if(section === 'concepts') {
        let baseurl = '/course-player?module=identity&section=concepts&page=';

        if(currentPage === 'objectives') {
            backlink = '/course-player?module=identity&section=challenge&page=intro';
            nextlink = baseurl + 'intro-video';
        } 
        else if(currentPage === 'intro-video') {
            // pause video
            $('#my_video_1')[0].player.pause();

            backlink = baseurl + 'objectives';
            nextlink = baseurl + 'definitions';
        } else if(currentPage === 'definitions') {
            backlink = baseurl + 'intro-video';
            nextlink = baseurl + 'personal-info';
        } else if(currentPage === 'personal-info') {
            backlink = baseurl + 'definitions';
            nextlink = baseurl + 'activity';
        } else if(currentPage === 'activity') {
            backlink = baseurl + 'personal-info';
            nextlink = baseurl + 'reflection';
        } else if(currentPage === 'reflection') {
            backlink = baseurl + 'activity';
            nextlink = baseurl + 'quiz';
        } else if(currentPage === 'quiz') {
            backlink = baseurl + 'reflection';
            nextlink = baseurl + 'takeaways';
        } else if(currentPage === 'takeaways') {

            backlink = baseurl + 'quiz';
            nextlink = '/course-player?module=identity&section=consequences&page=objectives';
        }
    } else if(section === 'consequences') {
        let baseurl = '/course-player?module=identity&section=consequences&page=';

        if(currentPage === 'objectives') {
            backlink = '/course-player?module=identity&section=concepts&page=objectives';
            nextlink = baseurl + 'intro-video'; 
        } 
        else if(currentPage === 'intro-video') {
            // pause video
            $('#my_video_1')[0].player.pause();

            backlink = baseurl + 'objectives';
            nextlink = baseurl + 'general';
        } else if(currentPage === 'general') {

            backlink = baseurl + 'intro-video';
            nextlink = baseurl + 'types';
        } else if(currentPage === 'types') {

            backlink = baseurl + 'general';
            nextlink = baseurl + 'reflection';
        } else if(currentPage === 'reflection') {
            backlink = baseurl + 'types';
            nextlink = baseurl + 'quiz';
        } else if(currentPage === 'quiz') {            
            backlink = baseurl + 'reflection';
            nextlink = baseurl + 'takeaways';
        } else if(currentPage === 'takeaways') {
            backlink = baseurl + 'quiz';
            nextlink = '/course-player?module=identity&section=techniques&page=objectives';
        }
    } else if(section === 'techniques') {
        let baseurl = '/course-player?module=identity&section=techniques&page=';

        if(currentPage === 'objectives') {
            backlink = '/course-player?module=identity&section=consequences&page=objectives';
            nextlink = baseurl + 'types';
        } else if(currentPage === 'types') {
            // pause video
            backlink = baseurl + 'objectives';
            nextlink = baseurl + 'issue';
        } else if(currentPage === 'issue') {
            backlink = baseurl + 'types';
            nextlink = baseurl + 'know-you';
        } else if(currentPage === 'know-you') {
            backlink = baseurl + 'issue';
            nextlink = baseurl + 'offer';
        } else if(currentPage === 'offer') {
            backlink = baseurl + 'know-you';
            nextlink = baseurl + 'suspicious';
        } else if(currentPage === 'suspicious') {
            backlink = baseurl + 'offer';
            nextlink = baseurl + 'activity';
        } else if(currentPage === 'activity') {
            backlink = baseurl + 'suspicious';
            nextlink = baseurl + 'reflection';
        } else if(currentPage === 'reflection') {
            backlink = baseurl + 'activity';
            nextlink = baseurl + 'quiz';
        } else if(currentPage === 'quiz') {            
            backlink = baseurl + 'reflection';
            nextlink = baseurl + 'takeaways';
        } else if(currentPage === 'takeaways') {
            backlink = baseurl + 'quiz';
            nextlink = '/course-player?module=identity&section=protection&page=objectives';
        }
    } else if(section === 'protection') {
        let baseurl = '/course-player?module=identity&section=protection&page=';

        if(currentPage === 'objectives') {
            backlink = '/course-player?module=identity&section=techniques&page=objectives';
            nextlink = baseurl + 'common-measures'; 
        } 
        else if(currentPage === 'common-measures') {
            backlink = baseurl + 'objectives';
            nextlink = baseurl + 'preventative-dos';
        } else if(currentPage === 'preventative-dos') {
            backlink = baseurl + 'common-measures';
            nextlink = baseurl + 'preventative-donts';
        } else if(currentPage === 'preventative-donts') {
            backlink = baseurl + 'preventative-dos';
            nextlink = baseurl + 'activity';
        }  else if(currentPage === 'activity') {
            backlink = baseurl + 'preventative-donts';
            nextlink = baseurl + 'reflection';
        } else if(currentPage === 'reflection') {
            backlink = baseurl + 'activity';
            nextlink = baseurl + 'quiz';
        } else if(currentPage === 'quiz') {            
            backlink = baseurl + 'reflection';
            nextlink = baseurl + 'takeaways';
        } else if(currentPage === 'takeaways') {
            backlink = baseurl + 'quiz';
            nextlink = '/course-player?module=identity&section=reporting&page=objectives';
        }
    } else if(section === 'reporting') {
        let baseurl = '/course-player?module=identity&section=reporting&page=';

        if(currentPage === 'objectives') {
            backlink = '/course-player?module=identity&section=techniques&page=objectives';
            nextlink = baseurl + 'intro-video'; 
        } 
        else if(currentPage === 'intro-video') {
            // pause video
            $('#my_video_1')[0].player.pause();

            backlink = baseurl + 'objectives';
            nextlink = baseurl + 'when';
        } else if(currentPage === 'when') {

            backlink = baseurl + 'intro-video';
            nextlink = baseurl + 'financial';
        } else if(currentPage === 'financial') {
            backlink = baseurl + 'when';
            nextlink = baseurl + 'medical';
        } else if(currentPage === 'medical') {
            backlink = baseurl + 'financial';
            nextlink = baseurl + 'tax';
        } else if(currentPage === 'tax') {
            backlink = baseurl + 'medical';
            nextlink = baseurl + 'quiz';
        } else if(currentPage === 'quiz') {            
            backlink = baseurl + 'tax';
            nextlink = baseurl + 'takeaways';
        } else if(currentPage === 'takeaways') {
            backlink = baseurl + 'quiz';
            nextlink = '/course-player?module=identity&section=practice&page=objectives';
        }
    } else if(section === 'practice') {
        let baseurl = '/course-player?module=identity&section=practice&page=';

        if(currentPage === 'objectives') {
            backlink = '/course-player?module=identity&section=reporting&page=objectives';
            nextlink = baseurl + 'arrive'; 
        } 
        else if(currentPage === 'arrive') {
            backlink = baseurl + 'objectives';
            nextlink = baseurl + 'activity';
        } else if(currentPage === 'activity') {
            backlink = baseurl + 'arrive';
            nextlink = baseurl + 'reflection';
        } else if(currentPage === 'reflection') {
            backlink = baseurl + 'activity';
            nextlink = baseurl + 'takeaways';
        }  else if(currentPage === 'takeaways') {
            backlink = baseurl + 'reflection';
            nextlink = '/course-player?module=identity&section=evaluate&page=objectives';
        }

    }

    return { backlink, nextlink };

}


function updateProgressBar() {
    let progress;

    const urlParams = new URLSearchParams(window.location.search);
    const pageParam = urlParams.get('page');

    

    if(section === 'challenge') {
        if(pageParam === 'intro') {
            progress = 0;
        } else if(pageParam === 'quiz') {
            progress = 10;
        } else if(pageParam === 'badge') {
            progress = 100;
        }
    } else if(section === 'concepts') {
        if (pageParam === 'objectives') {
            progress = 0;
        } else if (pageParam === 'intro-video') {
            progress = (1 / total) * 100;
        } else if (pageParam === 'definitions') {
            progress = (2 / total) * 100;
        } else if (pageParam === 'personal-info') {
            progress = (3 / total) * 100;
        } else if (pageParam === 'activity') {
            progress = (4 / total) * 100;
        } else if (pageParam === 'reflection') {
            progress = (5 / total) * 100;
        } else if (pageParam === 'quiz') {
            progress = (6 / total) * 100;
        } else if (pageParam === 'takeaways') {
            progress = 100;
        }
    } else if(section === 'consequences') {
        if (pageParam === 'objectives') {
            progress = 0;
        } else if (pageParam === 'intro-video') {
            progress = (1 / total) * 100;
        } else if (pageParam === 'types') {
            progress = (2 / total) * 100;
        } else if (pageParam === 'activity') {
            progress = (3 / total) * 100;
        } else if (pageParam === 'reflection') {
            progress = (4 / total) * 100;
        } else if (pageParam === 'quiz') {
            progress = (5 / total) * 100;
        } else if (pageParam === 'takeaways') {
            progress = 100;
        }
    } else if(section === 'techniques') {
        if (pageParam === 'objectives') {
            progress = 0;
        } else if (pageParam === 'intro-video') {
            progress = (1 / total) * 100;
        } else if (pageParam === 'types') {
            progress = (2 / total) * 100;
        } else if (pageParam === 'issue') {
            progress = (3 / total) * 100;
        } else if (pageParam === 'know-you') {
            progress = (4 / total) * 100;
        } else if (pageParam === 'offer') {
            progress = (5 / total) * 100;
        } else if (pageParam === 'suspicious') {
            progress = (6 / total) * 100;
        } else if (pageParam === 'activity') {
            progress = (7 / total) * 100;
        } else if (pageParam === 'reflection') {
            progress = (8 / total) * 100;
        } else if (pageParam === 'quiz') {
            progress = (9 / total) * 100;
        } else if (pageParam === 'takeaways') {
            progress = 100;
        }
    } else if(section === 'protection') {
        if (pageParam === 'objectives') {
            progress = 0;
        } else if (pageParam === 'common-measures') {
            progress = (1 / total) * 100;
        } else if (pageParam === 'preventative-dos') {
            progress = (2 / total) * 100;
        } else if (pageParam === 'preventative-donts') {
            progress = (3 / total) * 100;
        } else if (pageParam === 'activity') {
            progress = (4 / total) * 100;
        } else if (pageParam === 'reflection') {
            progress = (5 / total) * 100;
        } else if (pageParam === 'quiz') {
            progress = (6 / total) * 100;
        } else if (pageParam === 'takeaways') {
            progress = 100;
        }
    } else if(section === 'reporting') {
        if (pageParam === 'objectives') {
            progress = 0;
        } else if (pageParam === 'intro-video') {
            progress = (1 / total) * 100;
        } else if (pageParam === 'when') {
            progress = (2 / total) * 100;
        } else if (pageParam === 'financial') {
            progress = (3 / total) * 100;
        } else if (pageParam === 'medical') {
            progress = (4 / total) * 100;
        } else if (pageParam === 'tax') {
            progress = (5 / total) * 100;
        } else if (pageParam === 'quiz') {
            progress = (6 / total) * 100;
        } else if (pageParam === 'takeaways') {
            progress = 100;
        }
    }

    console.log("The Progress: " + progress);

    if (progressBar) {
        progressBar.setAttribute('data-percent', progress);
        progressBar.querySelector('.bar').style.width = progress + "%";
        if(progress > 0 && progress < 100){
            progressBar.querySelector('.bar').style.backgroundColor = '#7AC4E0';
        } else if(progress == 100) {
            progressBar.querySelector('.bar').style.backgroundColor = '#3757A7';
        }
        // progressBar.querySelector('.progress').textContent = progress + "%";
    } else {
        console.error('Could not find progress bar element');
    }
}

function appendScriptWithVariables(filename, modID, page, section, nextLink, progress) {
    var head = document.getElementsByTagName('head')[0];

    var script = document.createElement('script');
    script.src = filename;
    script.type = 'text/javascript';
    script.setAttribute('mod-id', modID);
    script.setAttribute('page', page);
    script.setAttribute('current-section', section);
    script.setAttribute('next-link', nextLink);
    script.setAttribute('progress', progress);

    head.appendChild(script);
}


