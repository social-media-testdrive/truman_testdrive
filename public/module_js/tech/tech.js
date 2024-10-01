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

    }


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
                        if(typeof pastAttempts !== 'undefined') {
                            if(pastAttempts  && backPage === 'quiz') {
                                const urlParams = new URLSearchParams(window.location.search);
                                backPage = "quiz-results";
                                urlParams.set('question', backPage); 
                                const newUrl = window.location.pathname + '?' + urlParams.toString();
                                history.pushState({path: newUrl}, '', newUrl);
                            }
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
            window.location.href = '/about/tech';
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
                    if(typeof pastAttempts !== 'undefined') {
                        if(pastAttempts && nextPage === 'quiz') {
                            const urlParams = new URLSearchParams(window.location.search);
                            nextPage = "quiz-results";
                            urlParams.set('question', nextPage); 
                            const newUrl = window.location.pathname + '?' + urlParams.toString();
                            history.pushState({path: newUrl}, '', newUrl);
                        }
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
    page = currentPage;

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

    if (section === "challenge") {
        let baseurl = "/course-player?module=tech&section=challenge&page=";
    
        if (currentPage === "intro") {
          backlink = "/about/tech";
          nextlink = baseurl + "quiz";
        } else if (currentPage === "quiz") {
          backlink = baseurl + "intro";
          nextlink = baseurl + "badge";
        } else if (currentPage === "badge") {
          backlink = baseurl + "quiz";
          nextlink ="/course-player?module=tech&section=concepts&page=objectives";
        }
      } else if (section === "concepts") {
        let baseurl = "/course-player?module=tech&section=concepts&page=";
    
        if (currentPage === "objectives") {
          backlink = "/course-player?module=tech&section=challenge&page=intro";
          nextlink = baseurl + "intro-video";
        } else if (currentPage === "intro-video") {
          // pause video
          $("#my_video_1")[0].player.pause();
    
          backlink = baseurl + "objectives";
          nextlink = baseurl + "definitions";
        } else if (currentPage === "definitions") {
          backlink = baseurl + "intro-video";
          nextlink = baseurl + "types";
        } else if (currentPage === "types") {
          backlink = baseurl + "definitions";
          nextlink = baseurl + "initial";
        } else if (currentPage === "initial") {
          backlink = baseurl + "types";
          nextlink = baseurl + "communicate";
        } else if (currentPage === "communicate") {
            backlink = baseurl + "initial";
            nextlink = baseurl + "steal";
        } else if (currentPage === "steal") {
            backlink = baseurl + "communicate";
            nextlink = baseurl + "quiz";
          }else if (currentPage === "quiz") {
          backlink = baseurl + "steal";
          nextlink = baseurl + "reflection";
        } else if (currentPage === "reflection") {
          backlink = baseurl + "quiz";
          nextlink = baseurl + "takeaways";
        } else if (currentPage === "takeaways") {
          backlink = baseurl + "reflection";
          nextlink ="/course-player?module=tech&section=consequences&page=objectives";
        }
      } else if (section === "consequences") {
        let baseurl = "/course-player?module=tech&section=consequences&page=";
    
        if (currentPage === "objectives") {
          backlink ="/course-player?module=tech&section=concepts&page=objectives";
          nextlink = baseurl + "financial";
        } else if (currentPage === "financial") {
          backlink = baseurl + "objectives";
          nextlink = baseurl + "identity";
        } else if (currentPage === "identity") {
            backlink = baseurl + "financial";
            nextlink = baseurl + "privacy";
        } else if (currentPage === "privacy") {
            backlink = baseurl + "identity";
            nextlink = baseurl + "emotional";
        }  else if (currentPage === "emotional") {
          backlink = baseurl + "privacy";
          nextlink = baseurl + "targeted";
        } else if (currentPage === "targeted") {
          backlink = baseurl + "emotional";
          nextlink = baseurl + "quiz";
        } else if (currentPage === "quiz") {
          backlink = baseurl + "targeted";
          nextlink = baseurl + "reflection";
        } else if (currentPage === "reflection") {
          backlink = baseurl + "quiz";
          nextlink = baseurl + "takeaways";
        } else if (currentPage === "takeaways") {
          backlink = baseurl + "reflection";
          nextlink = "/course-player?module=tech&section=techniques&page=objectives";
        }
      } else if (section === "techniques") {
        let baseurl = "/course-player?module=tech&section=techniques&page=";
    
        if (currentPage === "objectives") {
          backlink = "/course-player?module=tech&section=consequences&page=objectives";
          nextlink = baseurl + "intro-video";
        } else if (currentPage === "intro-video") {
            $("#my_video_1")[0].player.pause();

          backlink = baseurl + "objectives";
          nextlink = baseurl + "spoofing";
        } else if (currentPage === "spoofing") {
          backlink = baseurl + "intro-video";
          nextlink = baseurl + "robocalls";
        } else if (currentPage === "robocalls") {
          backlink = baseurl + "spoofing";
          nextlink = baseurl + "websites";
        } else if (currentPage === "websites") {
            backlink = baseurl + "robocalls";
            nextlink = baseurl + "popups";
        } else if (currentPage === "popups") {
            backlink = baseurl + "websites";
            nextlink = baseurl + "callout";
        } else if (currentPage === "callout") {
            backlink = baseurl + "popups";
            nextlink = baseurl + "pressure";
        } else if (currentPage === "pressure") {
            backlink = baseurl + "callout";
            nextlink = baseurl + "quiz";
        } else if (currentPage === "quiz") {
          backlink = baseurl + "pressure";
          nextlink = baseurl + "reflection";
        } else if (currentPage === "reflection") {
          backlink = baseurl + "quiz";
          nextlink = baseurl + "takeaways";
        } else if (currentPage === "takeaways") {
          backlink = baseurl + "reflection";
          nextlink =
            "/course-player?module=tech&section=signs&page=objectives";
        }
      } else if (section === "signs") {
        let baseurl = "/course-player?module=tech&section=signs&page=";
    
        if (currentPage === "objectives") {
          backlink = "/course-player?module=tech&section=techniques&page=objectives";
          nextlink = baseurl + "sign-1";
        } else if (currentPage === "sign-1") {
          backlink = baseurl + "objectives";
          nextlink = baseurl + "sign-2";
        } else if (currentPage === "sign-2") {
          backlink = baseurl + "sign-1";
          nextlink = baseurl + "sign-3";
        } else if (currentPage === "sign-3") {
          backlink = baseurl + "sign-2";
          nextlink = baseurl + "sign-4";
        } else if (currentPage === "sign-4") {
          backlink = baseurl + "sign-3";
          nextlink = baseurl + "sign-5";
        } else if (currentPage === "sign-5") {
          backlink = baseurl + "sign-4";
          nextlink = baseurl + "sign-6";
        } else if (currentPage === "sign-6") {
          backlink = baseurl + "sign-5";
          nextlink = baseurl + "sign-7";
        } else if (currentPage === "sign-7") {
          backlink = baseurl + "sign-6";
          nextlink = baseurl + "quiz";
        } 
        // else if (currentPage === "activity") {
        //   backlink = baseurl + "sign-7";
        //   nextlink = baseurl + "quiz";
        // } 
        else if (currentPage === "quiz") {
          backlink = baseurl + "sign-7";
          nextlink = baseurl + "reflection";
        } else if (currentPage === "reflection") {
          backlink = baseurl + "quiz";
          nextlink = baseurl + "takeaways";
        } 
        
         else if (currentPage === "takeaways") {
          backlink = baseurl + "quiz";
          nextlink =
            "/course-player?module=tech&section=protection&page=objectives";
        }
      }else if (section === "protection") {
        let baseurl = "/course-player?module=tech&section=protection&page=";
    
        if (currentPage === "objectives") {
          backlink = "/course-player?module=tech&section=signs&page=objectives";
          nextlink = baseurl + "intro-video";
        } else if (currentPage === "intro-video") {
            $("#my_video_1")[0].player.pause();

          backlink = baseurl + "objectives";
          nextlink = baseurl + "contact-methods";
        } else if (currentPage === "contact-methods") {
          backlink = baseurl + "intro-video";
          nextlink = baseurl + "fundamental-measures";
        }
        else if (currentPage === "fundamental-measures") {
          backlink = baseurl + "contact-methods";
          nextlink = baseurl + "contacted";
        }
        else if (currentPage === "contacted") {
          backlink = baseurl + "fundamental-measures";
          nextlink = baseurl + "pop-up";
        } else if (currentPage === "pop-up") {
          backlink = baseurl + "contacted";
          nextlink = baseurl + "download";
        } else if (currentPage === "download") {
          backlink = baseurl + "pop-up";
          nextlink = baseurl + "post-actions";
        }else if (currentPage === "post-actions"){
          backlink = baseurl + "download";
          nextlink = baseurl + "reporting";
        }else if (currentPage === "reporting"){
          backlink = baseurl + "post-actions";
          nextlink = baseurl + "reflection";
        } else if (currentPage === "reflection") {
          backlink = baseurl + "reporting";
          nextlink = baseurl + "quiz";
        } else if (currentPage === "quiz") {
          backlink = baseurl + "reflection";
          nextlink = baseurl + "takeaways";
        } else if (currentPage === "takeaways") {
          backlink = baseurl + "reflection";
          nextlink =
            "/course-player?module=tech&section=practice&page=objectives";
        }
      } else if (section === "practice") {
        let baseurl = "/course-player?module=tech&section=practice&page=";
    
        if (currentPage === "objectives") {
          backlink = "/course-player?module=tech&section=protection&page=objectives";
          nextlink = baseurl + "introduction";
        } else if (currentPage === "introduction") {
          backlink = baseurl + "objectives";
          nextlink = baseurl + "activity";
        } else if (currentPage === "activity") {
          backlink = baseurl + "introduction";
          nextlink = baseurl + "call";
        } else if (currentPage === "call") {
          backlink = baseurl + "activity";
          nextlink = baseurl + "call2";
        } else if (currentPage === "call2") {
          backlink = baseurl + "call";
          nextlink = baseurl + "call3";
        } else if (currentPage === "call3") {
          backlink = baseurl + "call2";
          nextlink = baseurl + "reflection";
        } else if (currentPage === "close") {
          backlink = baseurl + "call2";
          nextlink = baseurl + "friends";
        } else if (currentPage === "friends") {
          backlink = baseurl + "close";
          nextlink = baseurl + "search";
        } else if (currentPage === "search") {
          backlink = baseurl + "friends";
          nextlink = baseurl + "reflection";
        }else if (currentPage === "reflection") {
          backlink = baseurl + "search";
          nextlink = baseurl + "takeaways";
        } else if (currentPage === "takeaways") {
          backlink = baseurl + "reflection";
          nextlink = "/course-player?module=tech&section=evaluation&page=intro";
  
          // complete module status to 100 manually since there is no quiz
          console.log("HEY Posting to complete practice module status");
          $.post('/completeModuleStatus', {
              modId: 'tech',
              section: 'practice'
          });
        }
      } else if (currentPage === "takeaways") {
          backlink = baseurl + "results";
          nextlink = "/course-player?module=tech&section=evaluation&page=intro";
      } else if (section === "evaluation") {
        let baseurl = "/course-player?module=tech&section=evaluation&page=";
    
        if (currentPage === "intro") {
          backlink ="/course-player?module=tech&section=practice&page=objectives";
          nextlink = baseurl + "quiz";
        } else if (currentPage === "quiz") {
          backlink = baseurl + "intro";
          nextlink = baseurl + "badge";
        } else if (currentPage === "badge") {
          backlink = baseurl + "quiz";
          nextlink = baseurl + "certificate";
        } else if (currentPage === "certificate") {
          backlink = baseurl + "badge";
          nextlink = "/about/tech";
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
        } else if (pageParam === 'types') {
            progress = (4 / total) * 100;
        } else if (pageParam === 'initial') {
            progress = (5 / total) * 100;
        } else if (pageParam === 'communicate') {
            progress = (6 / total) * 100;
        } else if (pageParam === 'steal') {
            progress = (7 / total) * 100;
        } else if (pageParam === 'quiz') {
            progress = (8 / total) * 100;
        } else if (pageParam === 'reflection') {
            progress = (10 / total) * 100;
        } else if (pageParam === 'takeaways') {
            progress = 100;
        }
    } else if(section === 'consequences') {
        if (pageParam === 'objectives') {
            progress = 0;
        } else if (pageParam === 'financial') {
            progress = (1 / total) * 100;
        }  else if (pageParam === 'identity') {
            progress = (2 / total) * 100;
        } else if (pageParam === 'privacy') {
            progress = (3 / total) * 100;
        } else if (pageParam === 'emotional') {
            progress = (4 / total) * 100;
        } else if (pageParam === 'targeted') {
            progress = (5 / total) * 100;
        } else if (pageParam === 'quiz') {
            progress = (6 / total) * 100;
        } else if (pageParam === 'reflection') {
            progress = (7 / total) * 100;
        } else if (pageParam === 'takeaways') {
            progress = 100;
        }
    } else if(section === 'techniques') {
        if (pageParam === 'objectives') {
            progress = 0;
        } else if (pageParam === 'intro-video') {
            progress = (1 / total) * 100;
        } else if (pageParam === 'spoofing') {
            progress = (2 / total) * 100;
        } else if (pageParam === 'robocalls') {
            progress = (3 / total) * 100;
        } else if (pageParam === 'websites') {
            progress = (4 / total) * 100;
        } else if (pageParam === 'popups') {
            progress = (5 / total) * 100;
        } else if (pageParam === 'callout') {
            progress = (6 / total) * 100;
        } else if (pageParam === 'pressure') {
            progress = (7 / total) * 100;
        } else if (pageParam === 'quiz') {
            progress = (8 / total) * 100;
        } else if (pageParam === 'reflection') {
            progress = (11 / total) * 100;
        } else if (pageParam === 'takeaways') {
            progress = 100;
        }
    } else if(section === 'signs') {
        if (pageParam === 'objectives') {
            progress = 0;
        } else if (pageParam === 'sign-1') {
            progress = (1 / total) * 100;
        } else if (pageParam === 'sign-2') {
            progress = (2 / total) * 100;
        } else if (pageParam === 'sign-3') {
            progress = (3 / total) * 100;
        } else if (pageParam === 'sign-4') {
            progress = (4 / total) * 100;
        } else if (pageParam === 'sign-5') {
            progress = (5 / total) * 100;
        } else if (pageParam === 'sign-6') {
            progress = (6 / total) * 100;
        } else if (pageParam === 'sign-7') {
            progress = (7 / total) * 100;
        } else if (pageParam === 'quiz') {
            progress = (8 / total) * 100;
        } else if (pageParam === 'reflection') {
            progress = (14 / total) * 100;
        } else if (pageParam === 'takeaways') {
            progress = 100;
        }
    }  else if(section === 'protection') {
        if (pageParam === 'objectives') {
            progress = 0;
        } else if (pageParam === 'intro-video') {
            progress = (1 / total) * 100;
        } else if (pageParam === 'contact-methods') {
            progress = (2 / total) * 100;
        } else if (pageParam === 'fundamental-measures') {
            progress = (3 / total) * 100;
        } else if (pageParam === 'contacted') {
            progress = (4 / total) * 100;
        } else if (pageParam === 'pop-up') {
            progress = (5 / total) * 100;
        } else if (pageParam === 'download') {
            progress = (6 / total) * 100;
        } else if (pageParam === 'post-actions') {
            progress = (7 / total) * 100;
        } else if (pageParam === 'reporting') {
            progress = (8 / total) * 100;
        } else if (pageParam === 'quiz') {
            progress = (9 / total) * 100;
        } else if (pageParam === 'reflection') {
            progress = (17 / total) * 100;
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

// function appendScriptWithVariables(filename, modID, page, section, nextLink, progress) {
//     var head = document.getElementsByTagName('head')[0];

//     var script = document.createElement('script');
//     script.src = filename;
//     script.type = 'text/javascript';
//     script.setAttribute('mod-id', modID);
//     script.setAttribute('page', page);
//     script.setAttribute('current-section', section);
//     script.setAttribute('next-link', nextLink);
//     script.setAttribute('progress', progress);

//     head.appendChild(script);
// }
