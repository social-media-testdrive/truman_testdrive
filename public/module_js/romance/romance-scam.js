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
        audio.src = `https://dart-store.s3.amazonaws.com/romance+narration/${section}/${backPage}_${avatar}.mp3`;
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
            window.location.href = '/about/romance';
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
                  
                        postBadge("Romance", "Challenge", "Bronze", "Challenge Conqueror", "/badges/romance/challenge.svg");

                        badgeEarned = true;
                    } else if(section === 'concepts') {
                        document.getElementById('unlockBadge').play();

                        $('#earned_badge')
                          .transition({
                            animation: 'tada in',
                            duration: '1s',
                          })
                        ;
                  
                        postBadge("Romance", "Concepts", "Bronze", "Foundation Acheivers", "/badges/romance/concepts.svg");

                        badgeEarned = true;
                    } else if(section === 'consequences') {
                        document.getElementById('unlockBadge').play();

                        $('#earned_badge')
                          .transition({
                            animation: 'tada in',
                            duration: '1s',
                          })
                        ;
                  
                        postBadge("Romance", "Consequences", "Bronze", "Aftermath Ace", "/badges/romance/consequences.svg");

                        badgeEarned = true;                    
                    } else if(section === 'techniques') {
                        document.getElementById('unlockBadge').play();

                        $('#earned_badge')
                          .transition({
                            animation: 'tada in',
                            duration: '1s',
                          })
                        ;
                  
                        postBadge("Romance", "Techniques", "Silver", "Trained Tactician", "/badges/romance/trained_tactician.svg");

                        badgeEarned = true;                    
                    }  else if(section === 'fake') {
                      document.getElementById('unlockBadge').play();

                      $('#earned_badge')
                        .transition({
                          animation: 'tada in',
                          duration: '1s',
                        })
                      ;
                
                      postBadge("Romance", "Fake", "Silver", "Profile Prodigy", "/badges/romance/techniques.svg");

                      badgeEarned = true;                    
                  }  else if(section === 'contact') {
                    document.getElementById('unlockBadge').play();

                    $('#earned_badge')
                      .transition({
                        animation: 'tada in',
                        duration: '1s',
                      })
                    ;
              
                    postBadge("Romance", "Contact", "Silver", "Contact Champion", "/badges/romance/techniques.svg");

                    badgeEarned = true;                    
                }  else if(section === 'requests') {
                  document.getElementById('unlockBadge').play();

                  $('#earned_badge')
                    .transition({
                      animation: 'tada in',
                      duration: '1s',
                    })
                  ;

                  postBadge("Romance", "Contact", "Silver", "Request Ready", "/badges/romance/requests.svg");

                  badgeEarned = true;                    
              } else if(section === 'protection') {
                        document.getElementById('unlockBadge').play();

                        $('#earned_badge')
                          .transition({
                            animation: 'tada in',
                            duration: '1s',
                          })
                        ;
                  
                        postBadge("Romance", "Protection", "Silver", "Prodigy Protector", "/badges/romance/protection.svg");

                        badgeEarned = true;                             
                    } else if(section === 'reporting') {
                        document.getElementById('unlockBadge').play();

                        $('#earned_badge')
                          .transition({
                            animation: 'tada in',
                            duration: '1s',
                          })
                        ;
                  
                        postBadge("Romance", "Reporting", "Gold", "Alert Advocate", "/badges/romance/reporting.svg");

                        badgeEarned = true;                             
                    } else if(section === 'practice') {
                        document.getElementById('unlockBadge').play();

                        $('#earned_badge')
                          .transition({
                            animation: 'tada in',
                            duration: '1s',
                          })
                        ;
                  
                        postBadge("Romance", "Practice", "Gold", "Scam Spotter", "/badges/romance/practice.svg");

                        badgeEarned = true;                             
                    } else if(section === 'evaluation') {
                        document.getElementById('unlockBadge').play();

                        $('#earned_badge')
                          .transition({
                            animation: 'tada in',
                            duration: '1s',
                          })
                        ;
                  
                        postBadge("Romance", "Evaluation", "Platinum", "Champion of Completion", "/badges/romance/evaluation.svg");

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
      let baseurl = "/course-player?module=romance&section=challenge&page=";
  
      if (currentPage === "intro") {
        backlink = "/about/romance";
        nextlink = baseurl + "quiz";
      } else if (currentPage === "quiz") {
        backlink = baseurl + "intro";
        nextlink = baseurl + "badge";
      } else if (currentPage === "badge") {
        backlink = baseurl + "quiz";
        nextlink =
          "/course-player?module=romance&section=concepts&page=objectives";
      }
    } else if (section === "concepts") {
      let baseurl = "/course-player?module=romance&section=concepts&page=";
  
      if (currentPage === "objectives") {
        backlink = "/course-player?module=romance&section=challenge&page=intro";
        nextlink = baseurl + "intro-video";
      } else if (currentPage === "intro-video") {
        // pause video
        $("#my_video_1")[0].player.pause();
        backlink = baseurl + "objectives";
        nextlink = baseurl + "phases";
      } else if (currentPage === "phases") {
        backlink = baseurl + "intro-video";
        nextlink = baseurl + "definitions";
      } else if (currentPage === "definitions") {
        backlink = baseurl + "phases";
        nextlink = baseurl + "fake-websites";
      } else if (currentPage === "fake-websites") {
        backlink = baseurl + "definitions";
        nextlink = baseurl + "trusted";
      } else if (currentPage === "trusted") {
        backlink = baseurl + "fake-websites";
        nextlink = baseurl + "matching";
      }else if (currentPage === "matching") {
        backlink = baseurl + "trusted";
        nextlink = baseurl + "quiz";
      }else if (currentPage === "quiz") {
        backlink = baseurl + "matching";
        nextlink = baseurl + "reflection";
      } else if (currentPage === "reflection") {
        backlink = baseurl + "quiz";
        nextlink = baseurl + "takeaways";
      } else if (currentPage === "takeaways") {
        backlink = baseurl + "reflection";
        nextlink ="/course-player?module=romance&section=consequences&page=objectives";
      }
    } else if (section === "consequences") {
      let baseurl = "/course-player?module=romance&section=consequences&page=";
  
      if (currentPage === "objectives") {
        backlink =
          "/course-player?module=romance&section=concepts&page=objectives";
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
        nextlink = "/course-player?module=romance&section=fake&page=objectives";
      }
    } else if (section === "fake") {
      let baseurl = "/course-player?module=romance&section=fake&page=";
  
      if (currentPage === "objectives") {
        backlink =
          "/course-player?module=romance&section=consequences&page=objectives";
        nextlink = baseurl + "what";
      } else if (currentPage === "what") {
        backlink = baseurl + "objectives";
        nextlink = baseurl + "male";
      } else if (currentPage === "male") {
        backlink = baseurl + "what";
        nextlink = baseurl + "examples";
      } else if (currentPage === "examples") {
        backlink = baseurl + "male";
        nextlink = baseurl + "female";
      } else if (currentPage === "female") {
        backlink = baseurl + "examples";
        nextlink = baseurl + "examples2";
      } else if (currentPage === "examples2") {
        backlink = baseurl + "female";
        nextlink = baseurl + "disclaimer";
      } else if (currentPage === "disclaimer") {
        backlink = baseurl + "examples2";
        nextlink = baseurl + "activity";
      } else if (currentPage === "activity") {
        backlink = baseurl + "disclaimer";
        nextlink = baseurl + "activity2";
      } else if (currentPage === "activity2") {
        backlink = baseurl + "activity";
        nextlink = baseurl + "quiz";
      }  else if (currentPage === "quiz") {
        backlink = baseurl + "activity2";
        nextlink = baseurl + "reflection";
      } else if (currentPage === "reflection") {
        backlink = baseurl + "quiz";
        nextlink = baseurl + "takeaways";
      } else if (currentPage === "takeaways") {
        backlink = baseurl + "reflection";
        nextlink =
          "/course-player?module=romance&section=contact&page=objectives";
      }
    } else if (section === "contact") {
      let baseurl = "/course-player?module=romance&section=contact&page=";
  
      if (currentPage === "objectives") {
        backlink =
          "/course-player?module=romance&section=fake&page=objectives";
        nextlink = baseurl + "intro-video";
      } else if (currentPage === "intro-video") {
        $("#my_video_1")[0].player.pause();
  
        backlink = baseurl + "objectives";
        nextlink = baseurl + "channels";
      } else if (currentPage === "channels") {
        backlink = baseurl + "intro-video";
        nextlink = baseurl + "initial";
      } else if (currentPage === "initial") {
        backlink = baseurl + "channels";
        nextlink = baseurl + "types";
      } else if (currentPage === "types") {
        backlink = baseurl + "initial";
        nextlink = baseurl + "switch";
      } 
      
      else if (currentPage === "switch") {
        backlink = baseurl + "types";
        nextlink = baseurl + "avoid";
      } else if (currentPage === "avoid") {
        backlink = baseurl + "switch";
        nextlink = baseurl + "fast";
      } else if (currentPage === "fast") {
        backlink = baseurl + "avoid";
        nextlink = baseurl + "inconsistent";
      } else if (currentPage === "inconsistent") {
        backlink = baseurl + "fast";
        nextlink = baseurl + "isolate";
      } else if (currentPage === "isolate") {
        backlink = baseurl + "inconsistent";
        nextlink = baseurl + "dramatic";
      } else if (currentPage === "dramatic") {
        backlink = baseurl + "isolate";
        nextlink = baseurl + "reflection";
      } 
      // else if (currentPage === "communication") {
      //   backlink = baseurl + "types";
      //   nextlink = baseurl + "relationship";
      // }  else if (currentPage === "relationship") {
      //   backlink = baseurl + "communication";
      //   nextlink = baseurl + "reflection";
      // }  
      
      else if (currentPage === "reflection") {
        backlink = baseurl + "dramatic";
        nextlink = baseurl + "quiz";
      } else if (currentPage === "quiz") {
        backlink = baseurl + "reflection";
        nextlink = baseurl + "takeaways";
      } else if (currentPage === "takeaways") {
        backlink = baseurl + "quiz";
        nextlink =
          "/course-player?module=romance&section=requests&page=objectives";
      }
    } else if (section === "requests") {
      let baseurl = "/course-player?module=romance&section=requests&page=";
  
      if (currentPage === "objectives") {
        backlink =
          "/course-player?module=romance&section=contact&page=objectives";
        nextlink = baseurl + "types";
      } else if (currentPage === "types") {
        backlink = baseurl + "objectives";
        nextlink = baseurl + "examples";
      } else if (currentPage === "examples") {
        backlink = baseurl + "types";
        nextlink = baseurl + "pressure";
      }  else if (currentPage === "pressure") {
        backlink = baseurl + "examples";
        nextlink = baseurl + "sob";
      } else if (currentPage === "sob") {
        backlink = baseurl + "pressure";
        nextlink = baseurl + "emotional";
      } else if (currentPage === "emotional") {
        backlink = baseurl + "sob";
        nextlink = baseurl + "blackmail";
      } else if (currentPage === "blackmail") {
        backlink = baseurl + "emotional";
        nextlink = baseurl + "callout";
      } else if (currentPage === "callout") {
        backlink = baseurl + "blackmail";
        nextlink = baseurl + "reflection";
      } else if (currentPage === "reflection") {
        backlink = baseurl + "callout";
        nextlink = baseurl + "quiz";
      } else if (currentPage === "quiz") {
        backlink = baseurl + "reflection";
        nextlink = baseurl + "takeaways";
      } else if (currentPage === "takeaways") {
        backlink = baseurl + "quiz";
        nextlink = "/course-player?module=romance&section=protection&page=objectives";
      }
    } else if (section === "techniques") {
      let baseurl = "/course-player?module=romance&section=techniques&page=";
  
      if (currentPage === "objectives") {
        backlink =
          "/course-player?module=romance&section=consequences&page=objectives";
        nextlink = baseurl + "types";
      } else if (currentPage === "types") {
        // pause video
        backlink = baseurl + "objectives";
        nextlink = baseurl + "issue";
      } else if (currentPage === "issue") {
        backlink = baseurl + "types";
        nextlink = baseurl + "know-you";
      } else if (currentPage === "know-you") {
        backlink = baseurl + "issue";
        nextlink = baseurl + "offer";
      } else if (currentPage === "offer") {
        backlink = baseurl + "know-you";
        nextlink = baseurl + "suspicious";
      } else if (currentPage === "suspicious") {
        backlink = baseurl + "offer";
        nextlink = baseurl + "activity";
      } else if (currentPage === "activity") {
        backlink = baseurl + "suspicious";
        nextlink = baseurl + "reflection";
      } else if (currentPage === "reflection") {
        backlink = baseurl + "activity";
        nextlink = baseurl + "quiz";
      } else if (currentPage === "quiz") {
        backlink = baseurl + "reflection";
        nextlink = baseurl + "takeaways";
      } else if (currentPage === "takeaways") {
        backlink = baseurl + "quiz";
        nextlink =
          "/course-player?module=romance&section=protection&page=objectives";
      }
    } else if (section === "protection") {
      let baseurl = "/course-player?module=romance&section=protection&page=";
  
      if (currentPage === "objectives") {
        backlink =
          "/course-player?module=romance&section=requests&page=objectives";
        nextlink = baseurl + "intro-video";
      } else if (currentPage === "intro-video") {
        backlink = baseurl + "objectives";
        nextlink = baseurl + "guidelines";
      } else if (currentPage === "guidelines") {
        backlink = baseurl + "intro-video";
        nextlink = baseurl + "security";
      } else if (currentPage === "security") {
        backlink = baseurl + "guidelines";
        nextlink = baseurl + "communication";
      } else if (currentPage === "communication") {
        backlink = baseurl + "security";
        nextlink = baseurl + "privacy";
      } else if (currentPage === "privacy") {
        backlink = baseurl + "communication";
        nextlink = baseurl + "search";
      } else if (currentPage === "search") {
        backlink = baseurl + "privacy";
        nextlink = baseurl + "quiz";
      } else if (currentPage === "quiz") {
        backlink = baseurl + "search";
        nextlink = baseurl + "reflection";
      }  else if (currentPage === "reflection") {
        backlink = baseurl + "quiz";
        nextlink = baseurl + "takeaways";
      } else if (currentPage === "takeaways") {
        backlink = baseurl + "reflection";
        nextlink =
          "/course-player?module=romance&section=reporting&page=objectives";
      }
    } else if (section === "reporting") {
      let baseurl = "/course-player?module=romance&section=reporting&page=";
  
      if (currentPage === "objectives") {
        backlink = "/course-player?module=romance&section=protection&page=objectives";
        nextlink = baseurl + "realizing";
      } else if (currentPage === "realizing") {
        backlink = baseurl + "objectives";
        nextlink = baseurl + "scammed";
      } else if (currentPage === "scammed") {
        backlink = baseurl + "realizing";
        nextlink = baseurl + "responsive";
      } else if (currentPage === "responsive") {
        backlink = baseurl + "scammed";
        nextlink = baseurl + "callout";
      } else if (currentPage === "callout") {
        backlink = baseurl + "responsive";
        nextlink = baseurl + "quiz";
      } else if (currentPage === "quiz") {
        backlink = baseurl + "callout";
        nextlink = baseurl + "takeaways";
      } else if (currentPage === "takeaways") {
        backlink = baseurl + "quiz";
        nextlink =
          "/course-player?module=romance&section=practice&page=objectives";
      }
    } else if (section === "practice") {
      let baseurl = "/course-player?module=romance&section=practice&page=";
  
      if (currentPage === "objectives") {
        backlink = "/course-player?module=romance&section=reporting&page=objectives";

        //- check if they have completed the practice module, then show results page
        //- console.log("Checking if practice module is completed. Their score is: "  + scoreTotal);
        if(scoreTotal > 0) {
          nextlink = baseurl + "results";
        } else {
          nextlink = baseurl + "arrive";
        }
      } else if (currentPage === "arrive") {
        $('.ui.modal').modal('hide');
        backlink = baseurl + "objectives";
        nextlink = baseurl + "conversation";
      } else if (currentPage === "conversation") {
        $('.ui.modal').modal('hide');
        backlink = baseurl + "arrive";
  
        var conversationChoice = localStorage.getItem('conversation_choice');

        if (conversationChoice === 'yes') {
          nextlink = baseurl + "conversation2";
        } else if (conversationChoice === 'no') {
            nextlink = baseurl + "conversation3";
        } else {
            console.log('Skipping');
            nextlink = baseurl + "takeaways";
        }      
      } else if (currentPage === "conversation2") {
        $('.ui.modal').modal('hide');
        backlink = baseurl + "conversation";
        nextlink = baseurl + "conversation3";
      } else if (currentPage === "conversation3") {
        $('.ui.modal').modal('hide');
        backlink = baseurl + "conversation";
        nextlink = baseurl + "conversation4";
      } else if (currentPage === "conversation4") {
        $('.ui.modal').modal('hide');
        backlink = baseurl + "conversation3";
        nextlink = baseurl + "conversation5";
      } else if (currentPage === "conversation5") {
        $('.ui.modal').modal('hide');
        backlink = baseurl + "conversation4";
        nextlink = baseurl + "conversation6";
      } else if (currentPage === "conversation6") {
        $('.ui.modal').modal('hide');
        backlink = baseurl + "conversation5";
        nextlink = baseurl + "conversation7";
      } else if (currentPage === "conversation7") {
        $('.ui.modal').modal('hide');
        backlink = baseurl + "conversation6";
        nextlink = baseurl + "conversation8";
      } else if (currentPage === "conversation8") {
        $('.ui.modal').modal('hide');
        backlink = baseurl + "conversation7";
        nextlink = baseurl + "ending";
      } else if (currentPage === "ending") {
        $('.ui.modal').modal('hide');
        backlink = baseurl + "conversation8";
        nextlink = baseurl + "results";
      } else if (currentPage === "results") {
        backlink = baseurl + "objectives";
        nextlink = baseurl + "takeaways";

      
      } else if (currentPage === "takeaways") {
        backlink = baseurl + "results";
        nextlink = "/course-player?module=romance&section=evaluation&page=intro";

        // complete module status to 100 manually since there is no quiz
        console.log("HEY Posting to complete practice module status");
        $.post('/completeModuleStatus', {
            modId: 'romance',
            section: 'practice'
        });
      }
    } else if (section === "evaluation") {
      let baseurl = "/course-player?module=romance&section=evaluation&page=";
  
      if (currentPage === "intro") {
        backlink =
          "/course-player?module=romance&section=practice&page=objectives";
        nextlink = baseurl + "quiz";
      } else if (currentPage === "quiz") {
        backlink = baseurl + "intro";
        nextlink = baseurl + "badge";
      } else if (currentPage === "badge") {
        backlink = baseurl + "quiz";
        nextlink = baseurl + "reflection";
      } else if (currentPage === "reflection") {
        backlink = baseurl + "badge";
        nextlink = baseurl + "certificate";
      } else if (currentPage === "certificate") {
        backlink = baseurl + "reflection";
        nextlink = "/about/romance";
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
      } else if (pageParam === "phases") {
        progress = (2 / total) * 100;
      } else if (pageParam === "definitions") {
        progress = (3 / total) * 100;
      } else if (pageParam === "fake-websites") {
        progress = (4 / total) * 100;
      } else if (pageParam === "trusted") {
        progress = (5 / total) * 100;
      } else if (pageParam === "matching") {
        progress = (6 / total) * 100;
      } else if (pageParam === "quiz") {
        progress = (7 / total) * 100;
      } else if (pageParam === "reflection") {
        progress = (10 / total) * 100;
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
      } else if (pageParam === "activity") {
        progress = (7 / total) * 100;
      } else if (pageParam === "activity2") {
        progress = (8 / total) * 100;
      } else if (pageParam === "quiz") {
        progress = (9 / total) * 100;
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
      } else if (pageParam === "channels") {
        progress = (2 / total) * 100;
      }  else if (pageParam === "initial") {
        progress = (3 / total) * 100;
      } else if (pageParam === "types") {
        progress = (4 / total) * 100;
      }

      else if (pageParam === "switch") {
        progress = (5 / total) * 100;
      } else if (pageParam === "avoid") {
        progress = (6 / total) * 100;
      } else if (pageParam === "fast") {
        progress = (7 / total) * 100;
      } else if (pageParam === "inconsistent") {
        progress = (8 / total) * 100;
      } else if (pageParam === "isolate") {
        progress = (9 / total) * 100;
      } else if (pageParam === "dramatic") {
        progress = (10 / total) * 100;
      }
      // else if (pageParam === "communication") {
      //   progress = (5 / total) * 100;
      // } else if (pageParam === "relationship") {
      //   progress = (6 / total) * 100;
      // }
      
      else if (pageParam === "reflection") {
        progress = (11 / total) * 100;
      } else if (pageParam === "quiz") {
        progress = (13 / total) * 100;
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
      } else if (pageParam === "types") {
        progress = (2 / total) * 100;
      } else if (pageParam === "issue") {
        progress = (3 / total) * 100;
      } else if (pageParam === "know-you") {
        progress = (4 / total) * 100;
      } else if (pageParam === "offer") {
        progress = (5 / total) * 100;
      } else if (pageParam === "suspicious") {
        progress = (6 / total) * 100;
      } else if (pageParam === "activity") {
        progress = (7 / total) * 100;
      } else if (pageParam === "reflection") {
        progress = (8 / total) * 100;
      } else if (pageParam === "quiz") {
        progress = (9 / total) * 100;
      } else if (pageParam === "takeaways") {
        progress = 100;
      }
    } else if (section === "protection") {
      if (pageParam === "objectives") {
        progress = 0;
      } else if (pageParam === "intro-video") {
        progress = (1 / total) * 100;
      } else if (pageParam === "guidelines") {
        progress = (2 / total) * 100;
      } else if (pageParam === "security") {
        progress = (3 / total) * 100;
      } else if (pageParam === "communication") {
        progress = (4 / total) * 100;
      } else if (pageParam === "privacy") {
        progress = (5 / total) * 100;
      } else if (pageParam === "search") {
        progress = (6 / total) * 100;
      } else if (pageParam === "reverse-image") {
        progress = (7 / total) * 100;
      } else if (pageParam === "quiz") {
        progress = (7.5 / total) * 100;
      } else if (pageParam === "reflection") {
        progress = (11 / total) * 100;
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
        progress = (9 / total) * 100;
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
