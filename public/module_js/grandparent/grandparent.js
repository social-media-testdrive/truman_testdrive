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

                        // not needed, does it below
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

                    // if(section === 'practice' && backPage === 'activity') {
                    //     setupPractice();
                    // }

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

                    // if(backPage === 'quiz') {
                    //     console.log("Page is quiz so pause");
                    //     var audio = document.getElementById('narration-audio');
                    //     audio.pause();
                    //     stopHighlighting();
                    // }


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
            window.location.href = '/about/grandparent';
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
                  
                        postBadge("Grandparent Scams", "Challenge", "Bronze", "Challenge Conqueror", "/badges/identity/challenge_conqueror.svg");

                        badgeEarned = true;
                    } else if(section === 'concepts') {
                        document.getElementById('unlockBadge').play();

                        $('#earned_badge')
                          .transition({
                            animation: 'tada in',
                            duration: '1s',
                          })
                        ;
                  
                        postBadge("Grandparent Scams", "Concepts", "Bronze", "Foundation Acheivers", "/badges/identity/foundation_acheivers.svg");

                        badgeEarned = true;
                    } else if(section === 'consequences') {
                        document.getElementById('unlockBadge').play();

                        $('#earned_badge')
                          .transition({
                            animation: 'tada in',
                            duration: '1s',
                          })
                        ;
                  
                        postBadge("Grandparent Scams", "Consequences", "Bronze", "Aftermath Ace", "/badges/identity/aftermath_ace.svg");

                        badgeEarned = true;                    
                    } else if(section === 'techniques') {
                        document.getElementById('unlockBadge').play();

                        $('#earned_badge')
                          .transition({
                            animation: 'tada in',
                            duration: '1s',
                          })
                        ;
                  
                        postBadge("Grandparent Scams", "Techniques", "Silver", "Trained Tactician", "/badges/identity/trained_tactician.svg");

                        badgeEarned = true;                    
                    } else if(section === 'protection') {
                        document.getElementById('unlockBadge').play();

                        $('#earned_badge')
                          .transition({
                            animation: 'tada in',
                            duration: '1s',
                          })
                        ;
                  
                        postBadge("Grandparent Scams", "Protection", "Silver", "Prodigy Protector", "/badges/identity/prodigy_protector.svg");

                        badgeEarned = true;                             
                    } else if(section === 'reporting') {
                        document.getElementById('unlockBadge').play();

                        $('#earned_badge')
                          .transition({
                            animation: 'tada in',
                            duration: '1s',
                          })
                        ;
                  
                        postBadge("Grandparent Scams", "Reporting", "Gold", "Alert Advocate", "/badges/identity/alert_advocate.svg");

                        badgeEarned = true;                             
                    } else if(section === 'practice') {
                        document.getElementById('unlockBadge').play();

                        $('#earned_badge')
                          .transition({
                            animation: 'tada in',
                            duration: '1s',
                          })
                        ;
                  
                        postBadge("Grandparent Scams", "Practice", "Gold", "Scam Spotter", "/badges/identity/scam_spotter.svg");

                        badgeEarned = true;                             
                    } else if(section === 'evaluation') {
                        document.getElementById('unlockBadge').play();

                        $('#earned_badge')
                          .transition({
                            animation: 'tada in',
                            duration: '1s',
                          })
                        ;
                  
                        postBadge("Grandparent", "Evaluation", "Platinum", "Champion of Completion", "/badges/identity/champion_of_completion.svg");

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
                // if(section === 'practice' && nextPage === 'activity') {
                //     setupPractice();
                // }

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

                // if(section === 'practice' && currentPage === 'activity') {
                //     setupPractice();
                // }
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
      let baseurl = "/course-player?module=grandparent&section=challenge&page=";
  
      if (currentPage === "intro") {
        backlink = "/about/grandparent";
        nextlink = baseurl + "quiz";
      } else if (currentPage === "quiz") {
        backlink = baseurl + "intro";
        nextlink = baseurl + "badge";
      } else if (currentPage === "badge") {
        backlink = baseurl + "quiz";
        nextlink =
          "/course-player?module=grandparent&section=concepts&page=objectives";
      }
    } else if (section === "concepts") {
      let baseurl = "/course-player?module=grandparent&section=concepts&page=";
  
      if (currentPage === "objectives") {
        backlink = "/course-player?module=grandparent&section=challenge&page=intro";
        nextlink = baseurl + "intro-video";
      } else if (currentPage === "intro-video") {
        // pause video
        // $("#my_video_1")[0].player.pause();
  
        backlink = baseurl + "objectives";
        nextlink = baseurl + "definitions";
      } else if (currentPage === "definitions") {
        backlink = baseurl + "intro-video";
        nextlink = baseurl + "types";
      } else if (currentPage === "types") {
        backlink = baseurl + "definitions";
        nextlink = baseurl + "avatar";
      } else if (currentPage === "avatar") {
        backlink = baseurl + "types";
        nextlink = baseurl + "quiz";
      } else if (currentPage === "quiz") {
        backlink = baseurl + "avatar";
        nextlink = baseurl + "reflection";
      } else if (currentPage === "reflection") {
        backlink = baseurl + "quiz";
        nextlink = baseurl + "takeaways";
      } else if (currentPage === "takeaways") {
        backlink = baseurl + "reflection";
        nextlink ="/course-player?module=grandparent&section=consequences&page=objectives";
      }
    } else if (section === "consequences") {
      let baseurl = "/course-player?module=grandparent&section=consequences&page=";
  
      if (currentPage === "objectives") {
        backlink =
          "/course-player?module=grandparent&section=concepts&page=objectives";
        nextlink = baseurl + "financial";
      } else if (currentPage === "financial") {
        backlink = baseurl + "objectives";
        nextlink = baseurl + "emotional";
      } else if (currentPage === "emotional") {
        backlink = baseurl + "financial";
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
        nextlink = "/course-player?module=grandparent&section=techniques&page=objectives";
      }
    } else if (section === "techniques") {
      let baseurl = "/course-player?module=grandparent&section=techniques&page=";
  
      if (currentPage === "objectives") {
        backlink =
          "/course-player?module=grandparent&section=consequences&page=objectives";
        nextlink = baseurl + "intro-video";
      } else if (currentPage === "intro-video") {
        backlink = baseurl + "objectives";
        nextlink = baseurl + "data";
      } else if (currentPage === "data") {
        backlink = baseurl + "intro-video";
        nextlink = baseurl + "avatar";
      } else if (currentPage === "avatar") {
        backlink = baseurl + "data";
        nextlink = baseurl + "types";
      } else if (currentPage === "types") {
        backlink = baseurl + "avatar";
        nextlink = baseurl + "grandchild";
      } else if (currentPage === "grandchild") {
        // pause audio player
        $('audio.with-transcript').get(0).pause();

        backlink = baseurl + "types";
        nextlink = baseurl + "authority";
      } else if (currentPage === "authority") {
        // pause audio player
        $('audio.with-transcript').get(1).pause();

        backlink = baseurl + "grandchild";
        nextlink = baseurl + "reflection";
      } else if (currentPage === "reflection") {
        backlink = baseurl + "authority";
        nextlink = baseurl + "quiz";
      } else if (currentPage === "quiz") {
        backlink = baseurl + "reflection";
        nextlink = baseurl + "takeaways";
      } else if (currentPage === "takeaways") {
        backlink = baseurl + "quiz";
        nextlink =
          "/course-player?module=grandparent&section=signs&page=objectives";
      }
    }else if (section === "signs") {
      let baseurl = "/course-player?module=grandparent&section=signs&page=";
  
      if (currentPage === "objectives") {
        backlink = "/course-player?module=grandparent&section=protection&page=objectives";
        nextlink = baseurl + "titles";
      } 
      
      else if (currentPage === "titles") {
        backlink = baseurl + "objectives";
        nextlink = baseurl + "responses";
      } else if (currentPage === "responses") {
        backlink = baseurl + "titles";
        nextlink = baseurl + "family";
      } else if (currentPage === "family") {
        backlink = baseurl + "responses";
        nextlink = baseurl + "voice";
      } else if (currentPage === "voice") {
        $('audio.with-transcript').get(0).pause();

        backlink = baseurl + "family";
        nextlink = baseurl + "fear";
      } else if (currentPage === "fear") {
        $('audio.with-transcript').get(1).pause();

        backlink = baseurl + "voice";
        nextlink = baseurl + "pressure";
      } else if (currentPage === "pressure") {
        $('audio.with-transcript').get(2).pause();

        backlink = baseurl + "fear";
        nextlink = baseurl + "secrecy1";
      } else if (currentPage === "secrecy1") {
        backlink = baseurl + "pressure";
        nextlink = baseurl + "secrecy2";
      } else if (currentPage === "secrecy2") {
        backlink = baseurl + "secrecy1";
        nextlink = baseurl + "payment";
      } else if (currentPage === "payment") {
        $('audio.with-transcript').get(3).pause();

        backlink = baseurl + "secrecy2";
        nextlink = baseurl + "money";
      } else if (currentPage === "money") {
        backlink = baseurl + "payment";
        nextlink = baseurl + "activity1";
      } else if (currentPage === "activity1") {
        backlink = baseurl + "money";
        nextlink = baseurl + "activity2";
      } else if (currentPage === "activity2") {
        backlink = baseurl + "activity1";
        nextlink = baseurl + "quiz";
      } else if (currentPage === "quiz") {
        backlink = baseurl + "activity2";
        nextlink = baseurl + "reflection";
      } else if (currentPage === "reflection") {
        backlink = baseurl + "quiz";
        nextlink = baseurl + "takeaways";
      } 
      
       else if (currentPage === "takeaways") {
        backlink = baseurl + "quiz";
        nextlink =
          "/course-player?module=grandparent&section=protection&page=objectives";
      }
    } else if (section === "protection") {
      let baseurl = "/course-player?module=grandparent&section=protection&page=";
  
      if (currentPage === "objectives") {
        backlink =
          "/course-player?module=grandparent&section=signs&page=objectives";
        nextlink = baseurl + "intro-video";
      } else if (currentPage === "intro-video") {
        backlink = baseurl + "objectives";
        nextlink = baseurl + "fundamental-measures";
      } else if (currentPage === "fundamental-measures") {
        backlink = baseurl + "intro-video";
        nextlink = baseurl + "contacted";
      }
      else if (currentPage === "contacted") {
        backlink = baseurl + "fundamental-measures";

        nextlink = baseurl + "reactive";
      } else if (currentPage === "reactive") {
        backlink = baseurl + "contacted";
        nextlink = baseurl + "accident";
      } else if (currentPage === "accident") {
        backlink = baseurl + "reactive";
        nextlink = baseurl + "post-actions";
      } else if (currentPage === "post-actions") {
        backlink = baseurl + "accident";
        nextlink = baseurl + "activity";
      } else if (currentPage === "activity") {
        backlink = baseurl + "post-actions";
        nextlink = baseurl + "quiz";
      } else if (currentPage === "quiz") {
        backlink = baseurl + "activity";
        nextlink = baseurl + "reflection";
      } else if (currentPage === "reflection") {
        backlink = baseurl + "quiz";
        nextlink = baseurl + "takeaways";
      } else if (currentPage === "takeaways") {
        backlink = baseurl + "reflection";
        nextlink =
          "/course-player?module=grandparent&section=practice&page=objectives";
      }
    } else if (section === "practice") {
      let baseurl = "/course-player?module=grandparent&section=practice&page=";
  
      if (currentPage === "objectives") {
        backlink = "/course-player?module=grandparent&section=signs&page=objectives";
        nextlink = baseurl + "activity";
      } else if (currentPage === "activity") {
        backlink = baseurl + "objectives";
        nextlink = baseurl + "takeaways";
      } else if (currentPage === "takeaways") {
        backlink = baseurl + "activity";
        nextlink = "/course-player?module=grandparent&section=evaluation&page=intro";

        // complete module status to 100 manually since there is no quiz
        console.log("HEY Posting to complete practice module status");
        $.post('/completeModuleStatus', {
            modId: 'grandparent',
            section: 'practice'
        });
      }
    } else if (section === "evaluation") {
      let baseurl = "/course-player?module=grandparent&section=evaluation&page=";
  
      if (currentPage === "intro") {
        backlink =
          "/course-player?module=grandparent&section=practice&page=objectives";
        nextlink = baseurl + "quiz";
      } else if (currentPage === "quiz") {
        backlink = baseurl + "intro";
        nextlink = baseurl + "badge";
      } else if (currentPage === "badge") {
        backlink = baseurl + "quiz";
        nextlink = baseurl + "certificate";
      } else if (currentPage === "certificate") {
        backlink = baseurl + "badge";
        nextlink = "/about/grandparent";
      }
    }
  
    return { backlink, nextlink };
  }
  
  function updateProgressBar() {
    let progress;
  
    const urlParams = new URLSearchParams(window.location.search);
    const pageParam = urlParams.get("page");
  
    if (section === "challenge") {
      if (pageParam === "intro") {
        progress = 0;
      } else if (pageParam === "quiz") {
        progress = 10;
      } else if (pageParam === "badge") {
        progress = 100;
      }
    } else if (section === "concepts") {
      if (pageParam === "objectives") {
        progress = 0;
      } else if (pageParam === "intro-video") {
        progress = (1 / total) * 100;
      } else if (pageParam === "definitions") {
        progress = (2 / total) * 100;
      } else if (pageParam === "types") {
        progress = (3 / total) * 100;
      } else if (pageParam === "avatar") {
        progress = (4 / total) * 100;
      } else if (pageParam === "matching") {
        progress = (5 / total) * 100;
      } else if (pageParam === "quiz") {
        progress = (6 / total) * 100;
      } else if (pageParam === "reflection") {
        progress = (8.5 / total) * 100;
      } else if (pageParam === "takeaways") {
        progress = 100;
      }
    } else if (section === "consequences") {
      if (pageParam === "objectives") {
        progress = 0;
      } else if (pageParam === "financial") {
        progress = (1 / total) * 100;
      } else if (pageParam === "emotional") {
        progress = (2 / total) * 100;
      } else if (pageParam === "targeted") {
        progress = (3 / total) * 100;
      } else if (pageParam === "quiz") {
        progress = (4 / total) * 100;
      } else if (pageParam === "reflection") {
        progress = (7 / total) * 100;
      } else if (pageParam === "takeaways") {
        progress = 100;
      }
    } else if (section === "fake") {
      if (pageParam === "objectives") {
        progress = 0;
      } else if (pageParam === "what") {
        progress = (1 / total) * 100;
      } else if (pageParam === "male") {
        progress = (2 / total) * 100;
      } else if (pageParam === "examples") {
        progress = (3 / total) * 100;
      }  else if (pageParam === "female") {
        progress = (4 / total) * 100;
      } else if (pageParam === "examples2") {
        progress = (5 / total) * 100;
      } else if (pageParam === "disclaimer") {
        progress = (6 / total) * 100;
      } else if (pageParam === "quiz") {
        progress = (7 / total) * 100;
      } else if (pageParam === "reflection") {
        progress = (11 / total) * 100;
      } else if (pageParam === "takeaways") {
        progress = 100;
      }
    } else if (section === "contact") {
      if (pageParam === "objectives") {
        progress = 0;
      } else if (pageParam === "intro-video") {
        progress = (1 / total) * 100;
      } else if (pageParam === "initial") {
        progress = (2 / total) * 100;
      } else if (pageParam === "types") {
        progress = (3 / total) * 100;
      } else if (pageParam === "communication") {
        progress = (4 / total) * 100;
      } else if (pageParam === "relationship") {
        progress = (5 / total) * 100;
      } else if (pageParam === "reflection") {
        progress = (6 / total) * 100;
      } else if (pageParam === "quiz") {
        progress = (6.5 / total) * 100;
      } else if (pageParam === "takeaways") {
        progress = 100;
      }
    } else if (section === "requests") {
      if (pageParam === "objectives") {
        progress = 0;
      } else if (pageParam === "types") {
        progress = (1 / total) * 100;
      } else if (pageParam === "examples") {
        progress = (2 / total) * 100;
      } else if (pageParam === "pressure") {
        progress = (3 / total) * 100;
      } else if (pageParam === "sob") {
        progress = (4 / total) * 100;
      } else if (pageParam === "emotional") {
        progress = (5 / total) * 100;
      } else if (pageParam === "blackmail") {
        progress = (6 / total) * 100;
      } else if (pageParam === "callout") {
        progress = (7 / total) * 100;
      } else if (pageParam === "reflection") {
        progress = (8 / total) * 100;
      } else if (pageParam === "quiz") {
        progress = (9 / total) * 100;
      } else if (pageParam === "takeaways") {
        progress = 100;
      }
    } else if (section === "techniques") {
      if (pageParam === "objectives") {
        progress = 0;
      } else if (pageParam === "intro-video") {
        progress = (1 / total) * 100;
      } else if (pageParam === "data") {
        progress = (2 / total) * 100;
      } else if (pageParam === "avatar") {
        progress = (3 / total) * 100;
      } else if (pageParam === "types") {
        progress = (4 / total) * 100;
      } else if (pageParam === "grandchild") {
        progress = (5 / total) * 100;
      } else if (pageParam === "authority") {
        progress = (6 / total) * 100;
      } else if (pageParam === "reflection") {
        progress = (7 / total) * 100;
      } else if (pageParam === "quiz") {
        progress = (11 / total) * 100;
      } else if (pageParam === "takeaways") {
        progress = 100;
      }
    } else if (section === "signs") {
      if (pageParam === "objectives") {
        progress = 0;
      } else if (pageParam === "titles") {
        progress = (1 / total) * 100;
      } else if (pageParam === "responses") {
        progress = (2 / total) * 100;
      } else if (pageParam === "family") {
        progress = (3 / total) * 100;
      } else if (pageParam === "voice") {
        progress = (4 / total) * 100;
      } else if (pageParam === "fear") {
        progress = (5 / total) * 100;
      } else if (pageParam === "pressure") {
        progress = (6 / total) * 100;
      } else if (pageParam === "secrecy1") {
        progress = (7 / total) * 100;
      } else if (pageParam === "secrecy2") {
        progress = (8 / total) * 100;
      } else if (pageParam === "payment") {
        progress = (9 / total) * 100;
      } else if (pageParam === "money") {
        progress = (10 / total) * 100;
      } else if (pageParam === "activity1") {
        progress = (11 / total) * 100;
      } else if (pageParam === "activity2") {
        progress = (12 / total) * 100;
      } else if (pageParam === "quiz") {
        progress = (17 / total) * 100;
      } else if (pageParam === "reflection") {
        progress = (18 / total) * 100;
      } else if (pageParam === "takeaways") {
        progress = 100;
      }
    } else if (section === "protection") {
      if (pageParam === "objectives") {
        progress = 0;
      } else if (pageParam === "intro-video") {
        progress = (1 / total) * 100;
      } else if (pageParam === "fundamental-measures") {
        progress = (2 / total) * 100;
      } else if (pageParam === "preventative") {
        progress = (3 / total) * 100;
      } else if (pageParam === "contacted") {
        progress = (4 / total) * 100;
      } else if (pageParam === "reactive") {
        progress = (5 / total) * 100;
      } else if (pageParam === "accident") {
        progress = (6 / total) * 100;
      } else if (pageParam === "post-actions") {
        progress = (7 / total) * 100;
      } else if (pageParam === "activity") {
        progress = (8 / total) * 100;
      } else if (pageParam === "quiz") {
        progress = (13 / total) * 100;
      } else if (pageParam === "reflection") {
        progress = (14 / total) * 100;
      } else if (pageParam === "takeaways") {
        progress = 100;
      }
    } else if (section === "reporting") {
      if (pageParam === "objectives") {
        progress = 0;
      } else if (pageParam === "intro-video") {
        progress = (1 / total) * 100;
      } else if (pageParam === "realizing") {
        progress = (2 / total) * 100;
      } else if (pageParam === "scammed") {
        progress = (3 / total) * 100;
      } else if (pageParam === "responsive") {
        progress = (4 / total) * 100;
      } else if (pageParam === "callout") {
        progress = (5 / total) * 100;
      } else if (pageParam === "quiz") {
        progress = (7 / total) * 100;
      } else if (pageParam === "takeaways") {
        progress = 100;
      }
    } else if (section === "practice") {
      if (pageParam === "objectives") {
        progress = 0;
      } else if (pageParam === "arrive") {
        progress = (1 / total) * 100;
      } else if (pageParam === "conversation") {
        progress = (2 / total) * 100;
      } else if (pageParam === "conversation2") {
        progress = (3 / total) * 100;
      } else if (pageParam === "conversation3") {
        progress = (4 / total) * 100;
      } else if (pageParam === "conversation4") {
        progress = (5 / total) * 100;
      } else if (pageParam === "conversation5") {
        progress = (6 / total) * 100;
      } else if (pageParam === "conversation6") {
        progress = (7 / total) * 100;
      } else if (pageParam === "conversation7") {
        progress = (8 / total) * 100;
      } else if (pageParam === "conversation8") {
        progress = (9 / total) * 100;
      } else if (pageParam === "ending") {
        progress = (10 / total) * 100;
      } else if (pageParam === "results") {
        progress = (11 / total) * 100;
      } else if (pageParam === "takeaways") {
        progress = 100;
      }
    } else if (section === "evaluation") {
      if (pageParam === "intro") {
        progress = 0;
      } else if (pageParam === "quiz") {
        progress = (1 / total) * 100;
      } else if (pageParam === "badge") {
        progress = 100;
      } else if (pageParam === "certificate") {
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

// let this_js_script = $('script[src*=identity-theft]');
// let emailData = this_js_script.attr('emailData');   
// let iCurrentEmail = 0;
// let openEmailTutorialDone = false;
// let skipped = false;

// const emails = JSON.parse(emailData);

// let intro2 = introJs();
// let intro3 = introJs();


function setupPractice() {

    $('.warning-button')
        .popup({
            // title   : 'Popup Title',
            // inline     : true,
            // content : 'Hello I am a popup',
            hoverable: true
        })
    ;

    // $('#nextButton').hide();
    $('#nextButton').prop('disabled', true);

    // Watch for tutorial skip, then enable free exploration of email sim

    // Use event delegation for dynamically added elements
    $(document).on('click', '.introjs-skipbutton', function() {
        $('.emailSimContainer').css('pointer-events', 'auto');
        $('.openEmailContainer').css('pointer-events', 'auto');
        // $('#nextButton').show();
        $('#nextButton').removeAttr('disabled');
        skipped = true;
    });
    
    console.log("DOM loaded and parsed!");
    
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

function showEmail(index) {
    intro2.exit();


    iCurrentEmail = index;
    $('#email-' + index).css('background-color', '#F2F6FC');
    // Add class "open" to the envelope icon within the email element
    $('#email-' + index).find('.envelope.icon').addClass('open');

    $('.emailSimContainer').hide();
    // console.log("email shown: ", index);

    var email = emails[index]; 
    
    // Create the main container
    var openEmailContainer = $('<div>', { class: 'openEmailContainer', id: 'openEmail-' + iCurrentEmail, });

    // Create the email segment
    var emailSegment = $('<div>', { class: 'ui padded segment' });

    // Create the closeEmailArrow button
    var closeEmailArrow = $('<button>', {
      class: 'ui circular icon button closeEmailArrow',
      onclick: 'closeEmail()'
    });
    closeEmailArrow.append($('<i>', { class: 'left arrow big icon' }));

    // Create the report button
    var reportButton = $('<button>', {
      class: 'ui circular icon button',
      id: 'report',
      onclick: 'reportEmail()',
      'data-tooltip': "Report"
    });
    reportButton.append($('<i>', { class: 'bullhorn large icon' }));
    const tooltipReport = $('<div class="report-tooltip">Report</div>');
    reportButton.append(tooltipReport);

    // Create the block button
    var blockButton = $('<button>', {
      class: 'ui circular icon button',
      id: 'block',
      onclick: 'blockEmail()',
      'data-tooltip': "Block"
    });
    blockButton.append($('<i>', { class: 'ban large icon' }));
    const tooltipBlock = $('<div class="block-tooltip">Block</div>');
    blockButton.append(tooltipBlock);

    // Create the delete button
    var deleteButton = $('<button>', {
      class: 'ui circular icon button',
      id: 'delete',
      onclick: 'deleteEmail()',
      'data-tooltip': "Delete"
    });
    deleteButton.append($('<i>', { class: 'trash alternate outline large icon' }));
    const tooltipDelete = $('<div class="delete-tooltip">Delete</div>');
    deleteButton.append(tooltipDelete);

    // Create subjectLine and inboxLabel
    var subjectLine = $('<span>', { id: 'subjectLine' }).text(email.subject);
    var inboxLabel = $('<div>', { class: 'ui label', id: 'inboxLabel' }).text('Inbox');
    inboxLabel.append($('<i>', { class: 'delete icon' }));
    subjectLine.append(inboxLabel);

    // Create openDate
    var openDate = $('<span>', { id: 'openDate' }).text(email.date);
    var openDateHeader = $('<div>', { class: 'ui right floated header' }).append(openDate);

    // Create senderInfo and emailContent
    var senderInfo = $('<div>', { class: 'content senderInfo' });
    var senderHeader = $('<div>', { class: 'header' }).text(email.sender);
    var fromEmail = $('<span>', { class: 'fromEmail' }).text(email.from);
    // var fromEmail = $('<span>', { 
    //     class: 'fromEmail', 
    //     'data-hint': 'This email comes from walmart@gmail.com. Companies usually have their own email domain, such as @walmart.com. Another big sign of an email being a scam are misspellings and inconsistencies in names. This email misspells the name of the company its pretending to be as Walmrt, instead of Walmart, which it says in their email address.', 
    //     'data-hint-position': 'bottom-middle',
    //     text: email.from 
    // });


    senderHeader.append(fromEmail);
    // add warning for walmart email
    if(email.from === "<walmrt@gmail.com>") {
        var warningButton = $('<button>', {
            class: 'ui red button hideme warning-button walmart-1',
            text: 'WARNING'
        });

        senderHeader.append(warningButton);
    } else if(email.from === "<irsgov@gmail.com>") {
        var warningButton = $('<button>', {
            class: 'ui red button hideme warning-button irs-1',
            text: 'WARNING'
        });

        senderHeader.append(warningButton);
    } else if(email.from === "<no-reply@dropbox.com>") {
        var warningButton = $('<button>', {
            class: 'ui green button hideme warning-button dropbox-1',
            text: 'Review point'
        });

        senderHeader.append(warningButton);
    } else if(email.from === "<nccustudent@gmail.com>") {
        var warningButton = $('<button>', {
            class: 'ui red button hideme warning-button nccu-1',
            text: 'WARNING'
        });

        senderHeader.append(warningButton);
    } else if(email.from === "<4kbug82ob@hotmail.com>") {
        var warningButton = $('<button>', {
            class: 'ui red button hideme warning-button iphone-1',
            text: 'WARNING'
        });

        senderHeader.append(warningButton);
    } else if(email.from === "<account-update@amazon.com>") {
        var warningButton = $('<button>', {
            class: 'ui green button hideme warning-button amazon-1',
            text: 'Review point'
        });

        senderHeader.append(warningButton);
    }  else if(email.from === "<account-update@amazon.com>") {
        var warningButton = $('<button>', {
            class: 'ui green button hideme warning-button amazon-1',
            text: 'Review point'
        });

        senderHeader.append(warningButton);
    }








    senderInfo.append(senderHeader);
    
    var emailContent = $('<p>', { id: 'emailContent' }).html(email.content);

    // Create reply button
    var replyButton = $('<button>', {
      class: 'ui basic button',
      id: 'reply',
      onclick: 'replyEmail()'
    });
    replyButton.append($('<i>', { class: 'reply icon' }));
    replyButton.append('Reply');


    // Append all elements to emailSegment
    emailSegment.append(closeEmailArrow);
    emailSegment.append(reportButton);
    emailSegment.append(blockButton);
    emailSegment.append(deleteButton);
    emailSegment.append($('<div>', { class: 'ui horizontal divider' }));
    emailSegment.append(subjectLine);
    emailSegment.append(openDateHeader);
    emailSegment.append($('<div>', { class: 'ui horizontal divider' }));
    emailSegment.append($('<div>', { class: 'ui icon message' }).append($('<i>', { class: 'user circle icon' }), senderInfo));
    emailSegment.append(emailContent);
    emailSegment.append(replyButton);

    // add cursor close email animation for tutorial
    if(openEmailTutorialDone === false) {
        var closeEmailAnimation = $('<div>').addClass('showReturnToInboxAnimation hidden')
            .append($('<img>').attr('src', '/images/cursor.png'));
        emailSegment.append(closeEmailAnimation); 
    }



    // Append the new element to the body
    // $('body').append(closeEmailAnimation);


    // Append emailSegment to openEmailContainer
    openEmailContainer.append($('<br>'));
    // openEmailContainer.append(closeEmailAnimation);
    openEmailContainer.append(emailSegment);
    openEmailContainer.append($('<br>'));

    // Append openEmailContainer to the body
    $('.limit').append(openEmailContainer);




    // $('.warning-button').popup();

    if(email.from === "<walmrt@gmail.com>") {
        $('.warning-button.walmart-1').popup({
            position: 'bottom center',
            html: "This email comes from walmart@gmail.com. Companies usually have their own email domain, such as <strong>@walmart.com</strong>. Another big sign of an email being a scam are <strong>misspellings and inconsistencies</strong> in names. This email misspells the name of the company its pretending to be as <strong>Walmrt</strong>, instead of Walmart, which it says in their email address.",
            on: 'click'
        });
        $('.warning-button.walmart-2').popup({
            position: 'bottom center',
            html: "Legitimate and trusted emails will include a proper header and closer, identifying you by name. This email greets you through saying &quot;Hi customer,&quot; does not clarify your name. Additionally, scam emails or messages often include words and phrases that indicate urgency. This email says &quot;URGENT!!!&quot; and &quot;NOW!&quot;",
            on: 'click'
        });
        $('.warning-button.walmart-3').popup({
            position: 'bottom center',
            html: "In a legitimate email, you will never have to click on a link to submit personal financial information. This email tells you to resubmit your credit card details. Also, suspicious links are often indicated by beginning with http://, like the one in this email rather than https://.",
            on: 'click'
        });
    } else if(email.from === "<irsgov@gmail.com>") {
        $('.warning-button.irs-1').popup({
            position: 'bottom center',
            html: "This email is sent from <strong>irsgov@gmail.com</strong>. The IRS is a government department, and its official domain should be '.org' instead of '.com'. Therefore, the legitimate domain for this email address should be <strong>XXX@irs.org</strong>. Furthermore, it's important to note that the IRS website explicitly states that 'The IRS will not initiate email contact with you without your consent.’",
            on: 'click'
        });
        $('.warning-button.irs-2').popup({
            position: 'bottom center',
            html: "Legitimate and trusted emails will include a proper header and closer, identifying you by name. This email greets you through saying “Dear Tax Payer”",
            on: 'click'
        });
        $('.warning-button.irs-3').popup({
            position: 'bottom center',
            html: "The IRS will never request or verify your personal information through email or a link.",
            on: 'click'
        });
    } else if(email.from === "<no-reply@dropbox.com>") {
        $('.warning-button.dropbox-1').popup({
            position: 'bottom center',
            html: "Trusted companies usually have their own email domain, like this email which comes from no-reply@<strong>dropbox.com</strong>.",
            on: 'click'
        });
        $('.warning-button.dropbox-2').popup({
            position: 'bottom center',
            html: "The focus on this email is ensuring the safety of your account. Scam emails will rarely offer details or make suggestions to increase your account protection.",
            on: 'click'
        });
    } else if(email.from === "<nccustudent@gmail.com>") {
        $('.warning-button.nccu-1').popup({
            position: 'bottom center',
            html: "Always check if you recognize the sender's email address. If the sender's email address is unfamiliar or suspicious, exercise caution and do not click on any links or provide personal information.",
            on: 'click'
        });
        $('.warning-button.nccu-2').popup({
            position: 'bottom center',
            html: "A popular type of scam email is when people pretend like they know you and ask for money. This email does not address you by name or ask you any questions indicating they have a personal relationship with you. ",
            on: 'click'
        });
        $('.warning-button.nccu-3').popup({
            position: 'bottom center',
            html: "One major red flag that indicates this email is a scam is the request to send money to an unfamiliar recipient.",
            on: 'click'
        });
    } else if(email.from === "<4kbug82ob@hotmail.com>") {
        $('.warning-button.iphone-1').popup({
            position: 'bottom center',
            html: "Legitimate companies typically have their own email domains, like @apple.com. This email does not appear to have a legitimate email address.",
            on: 'click'
        });
        $('.warning-button.iphone-2').popup({
            position: 'bottom center',
            html: "A lot of scam emails use the <strong>too good to be true</strong> tactic. This email fails to provide fine prints, such as the expiration data or the exceptions to the sale. A legitimate coupon usually lists the details.",
            on: 'click'
        });
    } else if(email.from === "<account-update@amazon.com>") {
        $('.warning-button.amazon-1').popup({
            position: 'bottom center',
            html: "Trusted companies often have their own email domain. This email comes from @amazon.com. Also, it doesn’t ask for any of your personal information.",
            on: 'click'
        });
        $('.warning-button.amazon-2').popup({
            position: 'bottom center',
            html: "This email provides you with a verification code, a strong indicator that it is not a scam. Furthermore, it does not request any of your personal information.",
            on: 'click'
        });
    } else if(email.from === "<intrepid@gmail.com>") {
        $('.warning-button.intrepid-1').popup({
            position: 'bottom center',
            html: "This email is from a known sender and it contains a simple, positive message without any requests for personal information or actions. This familiarity and lack of unusual content confirms that it is not a scam.",
            on: 'click'
        });

    }

    // Event handler for stopping the pulsating and removing 'red' class on click
    $('.warning-button').on('click', function() {
        // $(this).remove(); 

        $(this).transition('stop');
        $(this).removeClass('red green pulsating transition'); 
        $(this).addClass('hide-after');
        $(this).text('Reviewed');
        
        // $(this).addClass('green'); 
    });

    console.log("Skipped: ", skipped);
    if(openEmailTutorialDone === false && skipped === false) {
        intro3.setOptions({
            steps: [
                {
                    myBeforeChangeFunction: function() { 
                        if(skipped === false) {
                            $('.openEmailContainer').css('pointer-events', 'none');
                        }
                    },
                    element: document.querySelector('.openEmailContainer .ui.padded.segment'),
                    position: 'right',
                    intro: "An opened email reveals the sender's information and message content. From here you can reply, report, block, or delete it. Let's explore these options. <br><img src='/images/chat-head.png' alt='age intrepid profile picture' width='125px' style='display: block; margin: 0 auto;margin-top:20px;'>",
                },
                {
                    element: document.querySelector('.left.arrow.big.icon'),
                    position: 'right',
                    intro: "<strong>Return Button</strong><br><br>This button takes you back to your inbox home page.",
                },
                {
                    element: document.querySelector('#report'),
                    position: 'right',
                    intro: "<strong>Report Button</strong><br><br>By reporting an email you're helping to protect not only yourself but also others from potential scams or cyberattacks.",
                },
                {
                    element: document.querySelector('#block'),
                    position: 'right',
                    intro: "<strong>Block Button</strong><br><br>If you're constantly receiving annoying emails or spam from a particular sender, you can use this function to prevent them from bothering you.",
                },
                {
                    element: document.querySelector('#delete'),
                    position: 'right',
                    intro: "<strong>Delete Button</strong><br><br>Deleting an email is like throwing away junk mail from your physical mailbox.",
                },
                {
                    element: document.querySelector('#reply'),
                    position: 'right',
                    intro: "<strong>Reply Button</strong><br><br>Allows you to send back a message in response.",
                },
                {
                    myBeforeChangeFunction: function() { 
                        $('.openEmailContainer').css('pointer-events', 'auto');  
                        // $('#nextButton').show();
                        $('#nextButton').removeAttr('disabled');
                        setTimeout(function() {
                            $('.showReturnToInboxAnimation').removeClass('hidden');
                        }, 5000);
                    },
                    element: document.querySelector('.ui.padded.segment'),
                    position: 'right',
                    intro: "This concludes the tutorial for the email inbox. You now know everything you need to know to begin managing your emails and dealing with spam.<br><br>Click the top left arrow button to return to your inbox and begin exploring.<br><img src='/images/chat-head.png' alt='age intrepid profile picture' width='125px' style='display: block; margin: 0 auto;margin-top:20px;'>",
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

            // $('.hidden').removeClass('hidden');
            // // $('#objectives').hide();
            // $('#arrive').hide();
            // $('#reflection').hide();
            // $('#takeaways').hide();

            // $('.transition').removeClass('transition');
            // $('.visible').removeClass('visible');

            // check to see if there is a function on this step
           if(this._introItems[this._currentStep].myBeforeChangeFunction){
               //if so, execute it.
               this._introItems[this._currentStep].myBeforeChangeFunction();
           }
           }).onchange(function() {  //intro.js built in onchange function
           if (this._introItems[this._currentStep].myChangeFunction){
               this._introItems[this._currentStep].myChangeFunction();
           }

           
        }).start();


        openEmailTutorialDone = true;
        $('.emailSimContainer').css('pointer-events', 'auto');  
        $('.showOpenEmailAnimation').addClass('hidden');


    }

}
  
function closeEmail() {
    intro3.exit();

    $('.openEmailContainer').remove();
    $('.emailSimContainer').show();
    $('.showOpenEmailAnimation').addClass('hidden');
    // console.log("email closed");
}
  
function reportEmail() {
    // console.log("email reported");
    let responseTitle;
    if(emails[iCurrentEmail].reportHeader === "warning"){
        responseTitle = '<i class="exclamation triangle red icon"></i> Warning';
    } else {
        responseTitle = '<i class="check circle green icon"></i> Good Job';
    }

    $.modal({
        title: responseTitle,
        classTitle: 'modalTitle',
        class: 'small emailSimModal',
        closeIcon: true,
        content: emails[iCurrentEmail].reportContent,
        actions: [
            {
                text: 'Back to Email',
                class: 'ui black basic big button',
                click: function () {
                    $(this).modal('hide');
                }
            },
            {
                text: 'See Why',
                class: 'ui blue big button',
                click: function () {
                    $(this).modal('hide');
                    $('.warning-button').removeClass('hideme');
                    $('.warning-button')
                        .transition('pulsating looping')
                    ;

                }
            }, 
        ],
        classActions: 'center aligned'
    }).modal('show');

    // old way with just "got it" action
    // $.modal({
    //     title: responseTitle,
    //     classTitle: 'modalTitle',
    //     class: 'small emailSimModal',
    //     closeIcon: true,
    //     content: emails[iCurrentEmail].reportContent,
    //     actions: [{
    //       text: 'Got it',
    //       class: 'blue big'
    //     }]
    // }).modal('show');
    $('.dimmable.dimmed').css('margin-right', '0px');
}
  
function blockEmail() {
    // console.log("email blocked");

    let responseTitle;
    if(emails[iCurrentEmail].blockHeader === "warning"){
        responseTitle = '<i class="exclamation triangle red icon"></i> Warning';
    } else {
        responseTitle = '<i class="check circle green icon"></i> Good Job';
    }


    $.modal({
        title: responseTitle,
        classTitle: 'modalTitle',
        class: 'small emailSimModal',
        closeIcon: true,
        content: emails[iCurrentEmail].reportContent,
        actions: [
            {
                text: 'Back to Email',
                class: 'ui black basic big button',
                click: function () {
                    $(this).modal('hide');
                }
            },
            {
                text: 'See Why',
                class: 'ui blue big button',
                click: function () {
                    $(this).modal('hide');
                    $('.warning-button').removeClass('hideme');
                    $('.warning-button')
                        .transition('pulsating looping')
                    ;

                }
            }, 
        ],
        classActions: 'center aligned'
    }).modal('show');
    
    // fix modal scroll bar shifting page issue
    $('.dimmable.dimmed').css('margin-right', '0px');
}
  
function deleteEmail() {
    // $('.openEmailContainer').remove();
    // $('.emailSimContainer').show();

    // console.log("email deleted");

    let responseTitle;
    if(emails[iCurrentEmail].deleteHeader === "warning"){
        responseTitle = '<i class="exclamation triangle red icon"></i> Warning';
    } else {
        responseTitle = '<i class="check circle green icon"></i> Good Job';
    }


    $.modal({
        title: responseTitle,
        classTitle: 'modalTitle',
        class: 'small emailSimModal',
        closeIcon: true,
        content: emails[iCurrentEmail].reportContent,
        actions: [
            {
                text: 'Back to Email',
                class: 'ui black basic big button',
                click: function () {
                    $(this).modal('hide');
                }
            },
            {
                text: 'See Why',
                class: 'ui blue big button',
                click: function () {
                    $(this).modal('hide');
                    $('.warning-button').removeClass('hideme');
                    $('.warning-button')
                        .transition('pulsating looping')
                    ;

                }
            }, 
        ],
        classActions: 'center aligned'
    }).modal('show');
    $('.dimmable.dimmed').css('margin-right', '0px');
}
  
function replyEmail() {
    // console.log("email replied");

    let responseTitle;
    if(emails[iCurrentEmail].replyHeader === "warning"){
        responseTitle = '<i class="exclamation triangle red icon"></i> Warning';
    } else {
        responseTitle = '<i class="check circle green icon"></i> Good Job';
    }


    $.modal({
        title: responseTitle,
        classTitle: 'modalTitle',
        class: 'small emailSimModal',
        closeIcon: true,
        content: emails[iCurrentEmail].reportContent,
        actions: [
            {
                text: 'Back to Email',
                class: 'ui black basic big button',
                click: function () {
                    $(this).modal('hide');
                }
            },
            {
                text: 'See Why',
                class: 'ui blue big button',
                click: function () {
                    $(this).modal('hide');
                    $('.warning-button').removeClass('hideme');
                    $('.warning-button')
                        .transition('pulsating looping')
                    ;

                }
            }, 
        ],
        classActions: 'center aligned'
    }).modal('show');
    $('.dimmable.dimmed').css('margin-right', '0px');

}
  

function linkClick() {
    // console.log("link clicked");

    $.modal({
        title: '<i class="exclamation triangle red icon"></i> Warning',
        classTitle: 'modalTitle',
        class: 'small emailSimModal',
        closeIcon: true,
        content: 'It\'s best not to click on links from emails. Navigating to the website yourself using a browser is always safer.',
        actions: [{
          text: 'Got it',
          class: 'blue big'
        }]
    }).modal('show');
    $('.dimmable.dimmed').css('margin-right', '0px');
}
  