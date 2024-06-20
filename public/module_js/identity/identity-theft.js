const progressBar = document.getElementById('theft-progress');
let pageReload= false;
let badgeEarned = false;

$(document).ready(function() {
    if(speechData !== "none") {
        $('#page-article').click();
    } else {
        $('#volume-button').hide();
    }

    // Check if the video element exists before initializing Video.js
    if ($('#my_video_1').length > 0) {
        // Initialize Video.js and make it so when user clicks on the video, stop the voiceover narration and highlighting
        var player = videojs('my_video_1');

        // Add event listener for the 'play' event using Video.js's on() method
        // could use 'play' 'pause' 'click' etc 
        player.on('play', function() {
            console.log("video playing");
            turnOffNarrationAndHighlighting();
        });
    } 
    // else {
    //     console.log("No video element found with ID 'my_video_1'");
    // }
    
    // var player = videojs('my_video_1');
    // // Event listener for the 'play' event using Video.js's on() method
    // if(player) {
    //     player.on('play', function() {
    //         console.log("video playing");
    //         turnOffNarrationAndHighlighting();

    //     });
    // }

    // for highlighting
    // avatarSpeechData = speechData[page][avatar];
    // wordData= avatarSpeechData.filter(entry => entry.type === "word");


    // console.log("Speech data: " + speechData);
    // console.log(JSON.stringify(speechData))

    // Load the first page based on the URL
    // console.log("The start page: " + startPage);
    // narration audio dropdown
    $('.ui.dropdown')
        .dropdown()
    ;
    $('.ui.dropdown2').dropdown({
        onChange: function(value, text, $selectedItem) {
            updateAvatar(value.replace(/,/g, ''));
        }
    });
    $('.ui.dropdown3').dropdown({
        onChange: function(value, text, $selectedItem) {
            changeSpeed(value.replace(/,/g, ''));
        }
    });

    $('.ui.slider')
        .slider({
        min: 0.5,
        max: 2,
        start: 1,
        step: 0.25
        });
    ;
    // later make so check from db whether to play audio / highlight 
    setLinks(startPage);
    updateProgressBar();

    // for testing only do pages with speech data to avoid console log error 
    if(speechData !== "none") {

        if(page === 'quiz') {
            document.addEventListener('QuizDataLoaded', function(e) {
                pastAttempts = e.detail.pastAttempts;
                console.log("the past attempts now after custom event loaded: " + pastAttempts);
                if(pastAttempts) {
                    const urlParams = new URLSearchParams(window.location.search);
                    page = "quiz-results";
                    urlParams.set('question', page); 
                    const newUrl = window.location.pathname + '?' + urlParams.toString();
                    history.pushState({path: newUrl}, '', newUrl);
                }
                playAudio(page);
                toggleHighlighting();
                startHighlightingWords();
            });
        } 
        // } else if(page === 'types') {
        // want event added to types page from wherever the submodule is loaded into as well, not just when it loads in from the types page directly. So include in else instead of else if
        else  {
            // add event listener for types slideshow pages to play correct audio for the current slide
            $('#steps-slider').on('afterChange', function(event, slick, currentSlide){
                // slide count starts at zero so add 1 to get the correct slide number
                let slideNum = currentSlide + 1;
                console.log('Current slide number:', slideNum);

                if(slideNum !== 1) {
                    slideResetNarrationAndHighlighting(); // stop and remove previous audio/highlighting (needed to fix when user clicks next before narration is finished)

                    const urlParams = new URLSearchParams(window.location.search);
                    page = "types-" + slideNum;
                    urlParams.set('slide', page); 
                    const newUrl = window.location.pathname + '?' + urlParams.toString();
                    history.pushState({path: newUrl}, '', newUrl);

                    playAudio(page);
                    toggleHighlighting();
                    startHighlightingWords();          
                } else {
                    // remove slide param when returning back to first slide
                    if(window.location.search.includes('slide')) {
                        const urlParams = new URLSearchParams(window.location.search);
                        urlParams.delete('slide');
                        const newUrl = window.location.pathname + '?' + urlParams.toString();
                        history.pushState({path: newUrl}, '', newUrl);

                        // not needed, does it below?
                        page = "types";
                        playAudio(page);
                        toggleHighlighting();
                        startHighlightingWords();
                    }          
                }
            });    
        } 

        playAudio(page);
        toggleHighlighting();
        startHighlightingWords();

        // else {
        //     playAudio(page);
        //     toggleHighlighting();
        //     startHighlightingWords();
        // }
    }
    // if(wordHighlighting || sentenceHighlighting) {
    //     startHighlightingWords();
    // }
    

    $('#backButton').on('click', function() {
        // console.log("Back button clicked");
        const urlParams = new URLSearchParams(window.location.search);
        const currentPage = urlParams.get('page');

        if(currentPage === 'quiz') {
            // clear quiz-results highlights to catch when user presses button before narration is finished
            $('#showResults').removeClass("highlightedResults");
            $('#narrate-view-answers').removeClass("highlightedButton");
            $('#narrate-try-again').removeClass("highlightedButton");
            $('#narrate-next').removeClass("highlightedButton");
            $('#nextButton').removeClass("highlightedButton");
        }

        $('.ui.sidebar').sidebar('hide');

        // stop and reset audio and highlighting immediately
        if(speechData !== "none") {
            stopHighlighting();
        }


        const { backlink, nextlink } = setLinks(currentPage);
        history.pushState(null, '', backlink);

        const backParams = new URLSearchParams(backlink);
        // changed from const to let so on quiz pages can override backPage from quiz to quiz-results if user has past attempts
        let backPage = backParams.get('page');

        var audio = document.getElementById('narration-audio');
        audio.src = `https://dart-store.s3.amazonaws.com/identity+narration/${section}/${backPage}_${avatar}.mp3`;
        audio.load(); // Reload the audio to apply the new source
        
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
                        setupPractice();
                    }

                    if(speechData !== "none") {
                        // console.log("YO YO YO the past attempts: " + pastAttempts + " and the back page: " + backPage)
                        if(pastAttempts  && backPage === 'quiz') {
                            const urlParams = new URLSearchParams(window.location.search);
                            backPage = "quiz-results";
                            urlParams.set('question', backPage); 
                            const newUrl = window.location.pathname + '?' + urlParams.toString();
                            history.pushState({path: newUrl}, '', newUrl);
                        }

                        playAudio(backPage);
                        toggleHighlighting();
                        startHighlightingWords();
                    }


                    }
            });
        }
        updateProgressBar();
    });
    
    $('#nextButton').on('click', function() {
        const urlParams = new URLSearchParams(window.location.search);
        const currentPage = urlParams.get('page');
        if(currentPage === 'quiz') {
            // clear quiz-results highlights to catch when user presses button before narration is finished
            $('#showResults').removeClass("highlightedResults");
            $('#narrate-view-answers').removeClass("highlightedButton");
            $('#narrate-try-again').removeClass("highlightedButton");
            $('#narrate-next').removeClass("highlightedButton");
            $('#nextButton').removeClass("highlightedButton");
        }
        
        $('.ui.sidebar').sidebar('hide');

        // stop and reset audio and highlighting immediately
        if(speechData !== "none") {
            stopHighlighting();
        }

        // restartWordHighlighting();

        const { backlink, nextlink } = setLinks(currentPage);
        history.pushState(null, '', nextlink);

        const nextParams = new URLSearchParams(nextlink);
        //  changed from const to let so on quiz pages can override nextPage from quiz to quiz-results if user has past attempts
        let nextPage = nextParams.get('page');

        if(nextPage === 'objectives' || nextPage === 'intro') {
            location.reload();
        }

        if(currentPage === 'certificate') {
            window.location.href = '/about/identity';
        }

        // fade out current page, then fade in next page. at half duration each, 400ms total
        $('#' + currentPage).transition({
            animation: 'fade out',
            duration: 200,
            onComplete: function() {
                // post badge if at end
                if(!badgeEarned && (nextPage === 'takeaways' || nextPage === 'badge')) {
                    if(section === 'challenge') {
                        document.getElementById('unlockBadge').play();

                        $('#earned_badge')
                          .transition({
                            animation: 'tada in',
                            duration: '1s',
                          })
                        ;
                  
                        postBadge("Identity Theft", "Challenge", "Bronze", "Challenge Conqueror", "/badges/identity/challenge_conqueror.svg");

                        badgeEarned = true;
                    } else if(section === 'concepts') {
                        document.getElementById('unlockBadge').play();

                        $('#earned_badge')
                          .transition({
                            animation: 'tada in',
                            duration: '1s',
                          })
                        ;
                  
                        postBadge("Identity Theft", "Concepts", "Bronze", "Foundation Acheivers", "/badges/identity/foundation_acheivers.svg");

                        badgeEarned = true;
                    } else if(section === 'consequences') {
                        document.getElementById('unlockBadge').play();

                        $('#earned_badge')
                          .transition({
                            animation: 'tada in',
                            duration: '1s',
                          })
                        ;
                  
                        postBadge("Identity Theft", "Consequences", "Bronze", "Aftermath Ace", "/badges/identity/aftermath_ace.svg");

                        badgeEarned = true;                    
                    } else if(section === 'techniques') {
                        document.getElementById('unlockBadge').play();

                        $('#earned_badge')
                          .transition({
                            animation: 'tada in',
                            duration: '1s',
                          })
                        ;
                  
                        postBadge("Identity Theft", "Techniques", "Silver", "Trained Tactician", "/badges/identity/trained_tactician.svg");

                        badgeEarned = true;                    
                    } else if(section === 'protection') {
                        document.getElementById('unlockBadge').play();

                        $('#earned_badge')
                          .transition({
                            animation: 'tada in',
                            duration: '1s',
                          })
                        ;
                  
                        postBadge("Identity Theft", "Protection", "Silver", "Prodigy Protector", "/badges/identity/prodigy_protector.svg");

                        badgeEarned = true;                             
                    } else if(section === 'reporting') {
                        document.getElementById('unlockBadge').play();

                        $('#earned_badge')
                          .transition({
                            animation: 'tada in',
                            duration: '1s',
                          })
                        ;
                  
                        postBadge("Identity Theft", "Reporting", "Gold", "Alert Advocate", "/badges/identity/alert_advocate.svg");

                        badgeEarned = true;                             
                    } else if(section === 'practice') {
                        document.getElementById('unlockBadge').play();

                        $('#earned_badge')
                          .transition({
                            animation: 'tada in',
                            duration: '1s',
                          })
                        ;
                  
                        postBadge("Identity Theft", "Practice", "Gold", "Scam Spotter", "/badges/identity/scam_spotter.svg");

                        badgeEarned = true;                             
                    } else if(section === 'evaluation') {
                        document.getElementById('unlockBadge').play();

                        $('#earned_badge')
                          .transition({
                            animation: 'tada in',
                            duration: '1s',
                          })
                        ;
                  
                        postBadge("Identity Theft", "Evaluation", "Platinum", "Champion of Completion", "/badges/identity/champion_of_completion.svg");

                        badgeEarned = true;                             
                    }
                }
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
                    setupPractice();
                }

                if(speechData !== "none") {
                    if(pastAttempts && nextPage === 'quiz') {
                        const urlParams = new URLSearchParams(window.location.search);
                        nextPage = "quiz-results";
                        urlParams.set('question', nextPage); 
                        const newUrl = window.location.pathname + '?' + urlParams.toString();
                        history.pushState({path: newUrl}, '', newUrl);
                    }
                    playAudio(nextPage);
                    toggleHighlighting();
                    startHighlightingWords();
                }

                // if(nextPage === 'quiz') {
                //     console.log("Page is quiz so pause");
                //     var audio = document.getElementById('narration-audio');
                //     audio.pause();
                //     stopHighlighting();
                // }


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
                    setupPractice();
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
            nextlink = baseurl + 'quiz';
        } else if(currentPage === 'quiz') {
            backlink = baseurl + 'activity';
            nextlink = baseurl + 'reflection';
        } else if(currentPage === 'reflection') {
            backlink = baseurl + 'quiz';
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
            nextlink = baseurl + 'quiz';
        }  else if(currentPage === 'quiz') {
            backlink = baseurl + 'types';
            nextlink = baseurl + 'reflection';
        } else if(currentPage === 'reflection') {
            backlink = baseurl + 'quiz';
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
            nextlink = baseurl + 'quiz';
        }  else if(currentPage === 'quiz') {
            backlink = baseurl + 'activity';
            nextlink = baseurl + 'reflection';
        } else if(currentPage === 'reflection') {
            backlink = baseurl + 'quiz';
            nextlink = baseurl + 'takeaways';
        } else if(currentPage === 'takeaways') {
            backlink = baseurl + 'reflection';
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
            nextlink = baseurl + 'preventative';
        } else if(currentPage === 'preventative') {
            backlink = baseurl + 'common-measures';
            nextlink = baseurl + 'contacted';
        } else if(currentPage === 'contacted') {
            backlink = baseurl + 'preventative';
            nextlink = baseurl + 'activity';
        }  else if(currentPage === 'activity') {
            backlink = baseurl + 'contacted';
            nextlink = baseurl + 'quiz';
        }  else if(currentPage === 'quiz') {
            backlink = baseurl + 'activity';
            nextlink = baseurl + 'reflection';
        } else if(currentPage === 'reflection') {
            backlink = baseurl + 'quiz';
            nextlink = baseurl + 'takeaways';
        } else if(currentPage === 'takeaways') {
            backlink = baseurl + 'reflection';
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
            introJs().exit();
            $('.openEmailContainer').hide();
            $('#nextButton').prop('disabled', false);

            backlink = baseurl + 'arrive';
            nextlink = baseurl + 'reflection';
        } else if(currentPage === 'reflection') {
            backlink = baseurl + 'activity';
            nextlink = baseurl + 'takeaways';
        }  else if(currentPage === 'takeaways') {
            backlink = baseurl + 'reflection';
            nextlink = '/course-player?module=identity&section=evaluation&page=intro';


        }

    } else if(section === 'evaluation') {
        let baseurl = '/course-player?module=identity&section=evaluation&page=';

        if(currentPage === 'intro') {
            backlink = '/course-player?module=identity&section=practice&page=objectives';
            nextlink = baseurl + 'quiz'; 
        } else if(currentPage === 'quiz') {            
            backlink = baseurl + 'intro';
            nextlink = baseurl + 'badge';
        } else if(currentPage === 'badge') {
            backlink = baseurl + 'quiz';
            nextlink = baseurl + 'reflection';
        } else if(currentPage === 'reflection') {
            backlink = baseurl + 'badge';
            nextlink =  baseurl + 'certificate';
        } else if(currentPage === 'certificate') {
            backlink = baseurl + 'reflection';
            nextlink = '/about/identity';
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
        } else if (pageParam === 'quiz') {
            progress = (5 / total) * 100;
        } else if (pageParam === 'reflection') {
            progress = (6 / total) * 100;
        } else if (pageParam === 'takeaways') {
            progress = 100;
        }
    } else if(section === 'consequences') {
        if (pageParam === 'objectives') {
            progress = 0;
        } else if (pageParam === 'intro-video') {
            progress = (1 / total) * 100;
        }  else if (pageParam === 'general') {
            progress = (2 / total) * 100;
        } else if (pageParam === 'types') {
            progress = (3 / total) * 100;
        } else if (pageParam === 'activity') {
            progress = (4 / total) * 100;
        } else if (pageParam === 'quiz') {
            progress = (5 / total) * 100;
        } else if (pageParam === 'reflection') {
            progress = (6 / total) * 100;
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
        } else if (pageParam === 'quiz') {
            progress = (8 / total) * 100;
        } else if (pageParam === 'reflection') {
            progress = (9 / total) * 100;
        } else if (pageParam === 'takeaways') {
            progress = 100;
        }
    } else if(section === 'protection') {
        if (pageParam === 'objectives') {
            progress = 0;
        } else if (pageParam === 'common-measures') {
            progress = (1 / total) * 100;
        } else if (pageParam === 'preventative') {
            progress = (2 / total) * 100;
        } else if (pageParam === 'contacted') {
            progress = (3 / total) * 100;
        } else if (pageParam === 'activity') {
            progress = (4 / total) * 100;
        } else if (pageParam === 'quiz') {
            progress = (5 / total) * 100;
        } else if (pageParam === 'reflection') {
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
    } else if (section === 'practice') {
        if (pageParam === 'objectives') {
            progress = 0;
        } else if (pageParam === 'arrive') {
            progress = (1 / total) * 100;
        } else if (pageParam === 'activity') {
            progress = (2 / total) * 100;
        } else if (pageParam === 'reflection') {
            progress = (4 / total) * 100;
        } else if (pageParam === 'takeaways') {
            progress = 100;
        }
    } else if (section === 'evaluation') {
        if (pageParam === 'intro') {
            progress = 0;
        } else if (pageParam === 'quiz') {
            progress = (1 / total) * 100;
        } else if (pageParam === 'badge') {
            progress = (10 / total) * 100;
        } else if (pageParam === 'reflection') {
            progress = (11 / total) * 100;
        } else if (pageParam === 'certificate') {
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
