const progressBar = document.getElementById('theft-progress');
let pageReload= false;
let badgeEarned = false;
let mute = false;
let voiceSpeed = 1;
var userInteracted = false;
let avatarSpeechData = null;
let isPaused = false; // Flag to check if highlighting should be paused

let wordData = null;
let totalWords; // Total number of words to highlight
let currentWordIndex = 0; // Current index of the word being highlighted
let highlightTimeoutWordID = null; // Timeout reference for word highlighting
let delay;
let startTimeMS = 0;

let totalStart = 0;
let totalFinish = 0;

let selectedElement = null;

// Flag to check if word highlighting is enabled
let wordHighlighting = true; 
let sentenceHighlighting = false;

let contrastWords = false;
// when 
let hiddenHighlight = false;

let showingHere = false;

document.addEventListener('click', function clickHandler() {
    console.log("User interacted with the page")
    userInteracted = true;

    // remove the event listener after the first interaction if needed
    document.removeEventListener('click', clickHandler);
});

let previousElement = "none";
let started = false; 
// *later set to DB values for curent user highlighting preferences
let wordChecked = true;
let sentenceChecked = true;

function stopHighlighting() {
    clearWordHighlights();
    clearTimeout(highlightTimeoutWordID);

    wordData = null;
    totalWords; // Total number of words to highlight
    currentWordIndex = 0; // Current index of the word being highlighted
    highlightTimeoutWordID = null; // Timeout reference for word highlighting
    delay;
    startTimeMS = 0;

    totalStart = 0;
    totalFinish = 0;

    selectedElement = null;

    wordHighlighting = true; 
    sentenceHighlighting = false;

    contrastWords = false;
    // when 
    hiddenHighlight = false;

    showingHere = false;
    previousElement = "none";
    started = false; 
    // *later set to DB values for curent user highlighting preferences
    wordChecked = true;
    sentenceChecked = true;

    const button = document.getElementById('play-pause-audio');
    var buttonIcon = document.querySelector('#play-pause-audio i.icon');
    var buttonText = document.querySelector('#play-pause-audio span.toggle-text');

    button.classList.remove('grey');
    button.classList.add('blue');
    button.style.pointerEvents = 'auto';

    buttonIcon.classList.remove('play', 'pause', 'check');
    buttonIcon.classList.add('pause');
    buttonText.innerText = 'Pause';

    $('#volume-icon').removeClass('off');
    $('#volume-icon').addClass('up'); 

}

function toggleHighlighting() {

    // save previous values so can see if going from: on to off to clear the highlights
    let priorWordChecked = wordChecked;
    let priorSentenceChecked = sentenceChecked;
    // console.log("77777 IN TOGGLE HIGHLIGHTING 77777");
    wordChecked = document.querySelector('.ui.toggle.checkbox.item#highlight-words input[type="checkbox"]').checked;
    sentenceChecked = document.querySelector('.ui.toggle.checkbox.item#highlight-sentences input[type="checkbox"]').checked;

    // if it went from on to off, clear the highlights
    // if(started && (priorWordChecked && !wordChecked)) {
    //     clearToggleVisual("words");
    // }
    // if(started && (priorSentenceChecked && !sentenceChecked)) {
    //     // clear dark words
    //     clearToggleVisual("words");
    //     clearToggleVisual("sentences");
    // }

    // clear both visuals if anything changed (except case where sentence is on and then word goes changes)
    if(started && (priorWordChecked !== wordChecked || priorSentenceChecked !== sentenceChecked)) {
        clearToggleVisual("words");
        clearToggleVisual("sentences");
    }

    // if both turned off, turn on hidden highlight
    // if(!wordChecked && !sentenceChecked) {
    //     hiddenHighlight = true;
    // }

    // if word goes from on to off, change highlights to transparent
    // if(started && (priorWordChecked && !wordChecked)) {
    //     clearWordHighlights();
    // }
    // if both were 

    if(wordChecked && sentenceChecked) {
        wordHighlighting = true;
        sentenceHighlighting = true;

        contrastWords = true;
        hiddenHighlight = false;
    } else if(wordChecked) {
        wordHighlighting = true;
        sentenceHighlighting = false;

        contrastWords = false;
        hiddenHighlight = false;
    } else if(sentenceChecked) {
        wordHighlighting = false;
        sentenceHighlighting = true;

        contrastWords = false;
        hiddenHighlight = false;
    } else if(!wordChecked && !sentenceChecked) {
        wordHighlighting = false;
        sentenceHighlighting = false;

        contrastWords = false;
        hiddenHighlight = true;
    }

    started = true;
}

function highlightWord(start, finish, word, element) {
    // console.log("Highlighting: " + word + ", start: " + start + ", finish: " + finish + ", totalFinish: " + totalFinish + ", element: " + element + ", previousElement: " + previousElement);

    let wordClass = "highlighted-word";
    if(contrastWords) {
        wordClass += "-dark";
    } 
    if(hiddenHighlight) {
        wordClass += "-hide";
    }

    let sentenceClass = "highlighted-sentence";

    let nextElement = "none";
    if(currentWordIndex !== totalWords - 1) {
        nextElement = wordData[currentWordIndex + 1]["element"];
    }
    // console.log("right before bey, elment is: " + element + " and previous element is: " + previousElement);
    // Clear all previous highlights if the element has changed
    if (element !== previousElement) {
        // console.log("yo in this one here.")
        clearWordHighlights();
    }
    if (element !== nextElement) {
        // console.log("IN this one.")
        clearWordHighlights();
        totalStart = 0;
        totalFinish = 0;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const currentPage = urlParams.get('page');

    if(element === "narrate-title-" + currentPage) {
        if(wordHighlighting || sentenceHighlighting) {
            let temp = document.getElementById("narrate-title-" + currentPage);
            temp.classList.add(sentenceClass);
        }

        // let temp =  $("#narrate-title");
        // console.log("The temp before: " + temp.html());
        // temp.addClass("sentenceClass");
        // console.log("the temp after" + temp.html())
    } else if(element === "narrate-time-" + currentPage) {
        if(wordHighlighting || sentenceHighlighting) {
            let temp = document.getElementById("narrate-time-" + currentPage);
            temp.classList.add(sentenceClass);
        }
    } else if(element === "narrate-header-" + currentPage) {
        if(wordHighlighting || sentenceHighlighting) {
            let temp = document.getElementById("narrate-header-" + currentPage);
            temp.classList.add(sentenceClass);
        }
    } else if(element === "shownHere") {
        if(wordHighlighting || sentenceHighlighting) {
            // console.log("in shownhere -> showingHere: " + showingHere);
            let temp = document.getElementById("shownHere");
            temp.classList.add(wordClass);

            setTimeout(function() {
                temp.classList.remove(wordClass);
                showingHere = false;
            }, 1000);
        }
    } else if(element === "none"){
        // console.log("skip break element");
    } else {
        if(currentPage !== "quiz" && (wordHighlighting || sentenceHighlighting)) {

            // console.log("HIGHLIGH element: " + element );
            let temp = document.getElementById(element);
            selectedElement = temp.getElementsByTagName('span')[0];

            // console.log("BEYYYY the selected element: " + selectedElement + " and the element: " + element + " and the word: " + word + " and the start: " + start + " and the finish: " + finish + " and the word class: " + wordClass + " and the sentence class: " + sentenceClass)
            if(sentenceHighlighting) {
                selectedElement.classList.add(sentenceClass);
            }

            // console.log("Bey the selected element: " + selectedElement.innerHTML + " start: " + start + " finish: " + finish + " word: " + word + " element: " + element)

            // always marking when audio is playing, just marks are transparent if wording highlighting is off, yellow if only word highlighting, white on dark bg if both sentence and word are on
            // remove previous mark tags before adding new ones
            selectedElement.innerHTML = selectedElement.innerHTML.replace(new RegExp(`<mark class="${wordClass}">|<\/mark>`, 'g'), "");
            s = selectedElement.innerHTML;
            // Add the mark tags to highlight the word
            selectedElement.innerHTML = s.substring(0, start) + `<mark class="${wordClass}">${word}</mark>` + s.substring(finish);
        }
    } 

}

function toRepeatWords() {
    // console.log("Word highlighting is " +  wordHighlighting + " and sentence highlighting is " + sentenceHighlighting)
    // Check for pause
    // if (isPaused) {
    //     // console.log("Breaking the loop.");
    //     return;
    // }

    
    if(currentWordIndex === totalWords - 1) {
        delay = wordData[currentWordIndex]["time"] - wordData[currentWordIndex - 1]["time"];
        if (voiceSpeed > 1) {
            delay /= voiceSpeed;
        } else {
            delay *= (1 / voiceSpeed);
        }
        // console.log("The delay: " + delay + " and the voice speed: " + voiceSpeed);
    } else {
        delay = wordData[currentWordIndex + 1]["time"] - wordData[currentWordIndex]["time"];
        if (voiceSpeed > 1) {
            delay /= voiceSpeed;
        } else {
            delay *= (1 / voiceSpeed);
        }
        // console.log("The delay: " + delay + " and the voice speed: " + voiceSpeed);
    }

    if(totalFinish === 0) {
        start = 0;
    } else {
        start = totalFinish + 1;
    }

    // let finish = start + wordData[currentWordIndex]["end"];
    let finish = start + wordData[currentWordIndex]["value"].length;

    totalFinish = finish;

    // totalFinish = finish;
    let element = wordData[currentWordIndex]["element"];

    word = wordData[currentWordIndex]["value"];

    if(element === "shownHere") {
        showingHere = true;
    }
    
    highlightWord(start, finish, word, element);


    previousElement = element;

    // Move to the next word
    currentWordIndex++;

    // Check if there are more words to highlight
    if (currentWordIndex < totalWords) {
        if (!isPaused) {

            startTimeMS = (new Date()).getTime();

            // Setup another timeout for the next word
            highlightTimeoutWordID = setTimeout(function () {
                // console.log("Delayed for: " + delay + " MS , the current word index: " + currentWordIndex + " the word is: " + wordData[currentWordIndex]["value"] + " and the element is: " + wordData[currentWordIndex]["element"]);
                toRepeatWords();
            }, delay);
        } else {
            // Save the state but do not proceed to next word
            // audio.pause();
            return;
        }
    } else {
        let lastDelay = 1000;

        // console.log("the last delay is: " + lastDelay);

        // All words have been highlighted
        // console.log("Finished highlighting");
        setTimeout(function () {
            clearWordHighlights();
        }, lastDelay);
    }
    
}

function startHighlightingWords() {
    const urlParams = new URLSearchParams(window.location.search);
    const currentPage = urlParams.get('page');

    if(speechData !== "none" && currentPage !== 'quiz') {

        // console.log("In starting the highlight") 
        
        const urlParams = new URLSearchParams(window.location.search);
        const currentPage = urlParams.get('page');
        // console.log("The current page: " + currentPage);
        // console.log("The avatar: " + avatar)
        // console.log("The speech data: " + speechData)

        avatarSpeechData = speechData[currentPage][avatar];

        // console.log("The avatar speech data: " + avatarSpeechData);

        wordData= avatarSpeechData;
        // console.log("The word data: " + JSON.stringify(wordData));

        isPaused = false;
        totalWords = wordData.length;
        currentWordIndex = 0;
        let startDelay = wordData[currentWordIndex]["time"];

        if (voiceSpeed > 1) {
            startDelay /= voiceSpeed;
        } else {
            startDelay *= (1 / voiceSpeed);
        }

        delay = startDelay;

        startTimeMS = (new Date()).getTime();

        // Start highlighting the first word
        highlightTimeoutWordID = setTimeout(function () {
            toRepeatWords();
        }, startDelay);
    }

}

function getRemainingTime(){
    return  delay - ( (new Date()).getTime() - startTimeMS );
}

function clearWordHighlights() {
    // console.log("* In clear word highlights, clearing existing timeouts")
    clearTimeout(highlightTimeoutWordID); // Clear any existing timeouts

    const urlParams = new URLSearchParams(window.location.search);
    const currentPage = urlParams.get('page');

    if(previousElement.includes("narrate-title")){ 
        document.getElementById(previousElement).classList.remove('highlighted-sentence');
    }
    if(previousElement.includes("narrate-time")){ 
        document.getElementById(previousElement).classList.remove('highlighted-sentence');
    }
    if(previousElement.includes("narrate-header")){ 
        document.getElementById(previousElement).classList.remove('highlighted-sentence');
    }


    // const urlParams = new URLSearchParams(window.location.search);
    // const currentPage = urlParams.get('page');
    // console.log("the page is: " + currentPage + " and the current word index is: " + currentWordIndex);
    // if(currentPage === 'intro') {
    //     document.getElementById('narrate-section').classList.remove('highlighted-sentence');
    //     document.getElementById('narrate-time').classList.remove('highlighted-sentence');
    // }

    if(selectedElement !== null && !showingHere) {
        selectedElement.classList.remove('highlighted-sentence');
    }

    let markElements = null;
    if(contrastWords) {
        markElements = $('mark.highlighted-word-dark');
    } else if(hiddenHighlight) {
        markElements = $('mark.highlighted-word-hide');
    }  else {
        markElements = $('mark.highlighted-word');
    }

    // Loop through all the 'mark' elements and remove them
    if(markElements.length > 0) {
        for (let i = markElements.length - 1; i >= 0; i--) {
            let markElement = markElements[i];
            markElement.parentNode.replaceChild(document.createTextNode(markElement.textContent), markElement);
        }    
    }
}

function clearToggleVisual(whichHighlighting) {
    // console.log("*In clear toggle visual for: " + whichHighlighting);

    const urlParams = new URLSearchParams(window.location.search);
    const currentPage = urlParams.get('page');

    if(previousElement.includes("narrate-title")){ 
        document.getElementById('narrate-title-' + currentPage).classList.remove('highlighted-sentence');
    }

    if(previousElement.includes("narrate-time")){ 
        document.getElementById('narrate-time-' + currentPage).classList.remove('highlighted-sentence');
    }

    if(previousElement.includes("narrate-header")){ 
        document.getElementById('narrate-header-' + currentPage).classList.remove('highlighted-sentence');
    }

    // if(currentPage === 'intro') {
    //     document.getElementById('narrate-section').classList.remove('highlighted-sentence');
    //     document.getElementById('narrate-time').classList.remove('highlighted-sentence');
    // }

    if(whichHighlighting === "words") {
        let markElements = null;
        if(contrastWords) {
            markElements = $('mark.highlighted-word-dark');
        } else if(hiddenHighlight) {
            markElements = $('mark.highlighted-word-hide');
        } else {
            markElements = $('mark.highlighted-word');
        }
    
        // Loop through all the 'mark' elements and remove them
        if(markElements.length > 0) {
            for (let i = markElements.length - 1; i >= 0; i--) {
                let markElement = markElements[i];
                markElement.parentNode.replaceChild(document.createTextNode(markElement.textContent), markElement);
            }    
        }
    } else if(whichHighlighting === "sentences") {
        if(selectedElement !== null) {
            selectedElement.classList.remove('highlighted-sentence');
        }
    }
}
function pauseHighlight() {
    if (!isPaused) { // Only pause if not already paused
        isPaused = true;
        clearTimeout(highlightTimeoutWordID); // Clear the current timeout

        // Calculate the elapsed time since the last highlight started
        var currentTimeMS = (new Date()).getTime();
        var elapsedTime = currentTimeMS - startTimeMS;

        // Adjust the delay for the current word based on the elapsed time
        delay -= elapsedTime;

        // console.log("Highlighting paused after " + elapsedTime + "ms");
    }

    // if (!isPaused) { // Prevent pausing if already paused
    //     isPaused = true; // Set pause flag
    //     clearTimeout(highlightTimeoutWordID); // Clear the timeout to pause highlighting
    //     console.log("Highlighting paused");
    // }


    // isPaused = true;
    // console.log("flag in pauseHighlight()  " + isPaused + " currentWordIndex " + currentWordIndex);
    // console.log("paused at: " + currentWordIndex);
}

function resumeHighlight() {
    if (isPaused) { // Only resume if currently paused
        isPaused = false;
        // console.log("Resuming highlighting");

        // Use the adjusted delay to continue with the next word
        highlightTimeoutWordID = setTimeout(function () {
            toRepeatWords();
        }, delay);
    }


    // console.log("In resume the highlight")

    // if (isPaused) { // Only resume if currently paused
    //     isPaused = false; // Reset pause flag
    //     console.log("Resuming highlighting");
    //     toRepeatWords(); // Continue highlighting
    // }

}  

function stopPropagation(event) {
    event.stopPropagation();
}

function muteNarration() {
    mute = !mute;

    var audio = document.getElementById('narration-audio');
    // audio.pause();

    if (audio.muted) {
        audio.muted = false; // Unmute the audio

        $('#volume-icon').removeClass('mute');

        if($('#play-pause-audio i.icon').hasClass('pause')) {
            $('#volume-icon').addClass('up');  
        } else {
            $('#volume-icon').addClass('off');  
        }  
    } else {
        audio.muted = true; // Mute the audio

        $('#volume-icon').removeClass('up off');
        $('#volume-icon').addClass('mute');    
    }

    // volume_icon.classList.toggle('up', 'mute');
}

function playAudio(thePage) { 
    // console.log("In play audio")

    // console.log("mute is: " + mute);
    // document.getElementById('narration-audio').play();


    const urlParams = new URLSearchParams(window.location.search);
    const currentPage = urlParams.get('page');

    if(speechData !== "none" && currentPage !== 'quiz') {

        var audio = document.getElementById('narration-audio');

        if(audio) {
            audio.src = `https://dart-store.s3.amazonaws.com/identity-narration/${section}/${thePage}_${avatar}.mp3`;
            audio.load();
            audio.playbackRate = voiceSpeed;

            // if(!mute) {
            // catch error when user hasn't interacted with page yet
            if (userInteracted) {
                $('#volume-icon').removeClass('off');
                $('#volume-icon').addClass('up');  

                var audio = document.getElementById('narration-audio');
                var buttonIcon = document.querySelector('#play-pause-audio i.icon');
                var buttonText = document.querySelector('#play-pause-audio span.toggle-text');

                buttonIcon.classList.remove('play', 'pause');
                buttonIcon.classList.add('pause');
                buttonText.innerText = 'Pause';

                audio.play();
            } else {
                // console.log("in here:")
                $('#page-article').click();

                audio.play();
                // console.warn('User has not interacted with the webpage yet. Cannot autoplay audio.');
            }
        }
    }

    // }
}

function replayAudio() {
    if(!mute) {
        var audio = document.getElementById('narration-audio');
        audio.currentTime = 0; // Set the playback position to the beginning
        audio.play();

        var audio = document.getElementById('narration-audio');
        const button = document.getElementById('play-pause-audio');
        var buttonIcon = document.querySelector('#play-pause-audio i.icon');
        var buttonText = document.querySelector('#play-pause-audio span.toggle-text');

        button.classList.remove('grey'); // Remove the grey class
        button.classList.add('blue'); // Add the blue class to change its color back
        button.style.pointerEvents = 'auto';

        buttonIcon.classList.remove('play', 'pause', 'check');
        buttonIcon.classList.add('pause');
        buttonText.innerText = 'Pause';

        $('#volume-icon').removeClass('off');
        $('#volume-icon').addClass('up');  

        restartWordHighlighting();

        // if(wordHighlighting || sentenceHighlighting) {
        //     restartWordHighlighting();
        // }

    }
}

function restartWordHighlighting() {
    clearWordHighlights(); // Clear existing highlights
    startHighlightingWords();
}

function togglePlayPause() {
    var audio = document.getElementById('narration-audio');
    var buttonIcon = document.querySelector('#play-pause-audio i.icon');
    var buttonText = document.querySelector('#play-pause-audio span.toggle-text');
    var volumeIcon = document.querySelector('#volume-icon');
    if (audio.paused) {
        resumeHighlight();
        audio.play();
        // Change icon and text to "Pause" when playing
        volumeIcon.classList.remove('off');
        volumeIcon.classList.add('up');
        buttonIcon.classList.remove('play', 'pause');
        buttonIcon.classList.add('pause');
        buttonText.textContent = 'Pause';
    } else {
        pauseHighlight();
        audio.pause();
        volumeIcon.classList.remove('up');
        volumeIcon.classList.add('off');
        // Change icon and text to "Play" when paused
        buttonIcon.classList.remove('play', 'pause');
        buttonIcon.classList.add('play');
        buttonText.textContent = 'Play';
    }   
}


function disableNarrationPlayButton() {
    // Find the button by its ID
    const button = document.getElementById('play-pause-audio');
    var buttonIcon = document.querySelector('#play-pause-audio i.icon');

    // Change the button's style to visually indicate it is disabled
    // button.style.opacity = '0.5'; 
    // Change the button color to grey
    button.classList.remove('blue'); // Remove the blue class if it's there
    button.classList.add('grey'); // Add the grey class to change its color
    
    button.style.pointerEvents = 'none';

    // Find the span that holds the "Play" text
    const buttonText = button.querySelector('.toggle-text');

    buttonIcon.classList.remove('play', 'pause');
    buttonIcon.classList.add('check');

    // Change the text to "Done"
    buttonText.textContent = 'Done';
}

function updateAvatar(avatarName) {
    console.log("The passed Avatar: " + avatarName);


    avatar = avatarName.toLowerCase();

    if(avatarName === 'Intrepid'){
        avatarImg = '/images/agent-intrepid.png';
    } else if (avatarName === 'Daring') {
        avatarImg = '/images/agent-daring.png';
    } else {
        avatarImg = '/images/agent-valiant.png';
    }

    var userData = {
      avatar: avatarName,
      avatarImg: avatarImg
    };
    
    fetch('/postAvatar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Include other headers as needed
      },
      body: JSON.stringify(userData)
    })
    .then(response => {
      if (response.ok) {
        console.log('Avatar updated successfully');

        // reload page to complete avatar change ie not just voice but also avatar image and name etc
        location.reload();

        // // const urlParams = new URLSearchParams(window.location.search);
        // // const pageParam = urlParams.get('page');
        // // console.log("Avatar change the page is: " + page);
        // clearWordHighlights();

        // const urlParams = new URLSearchParams(window.location.search);
        // const currentPage = urlParams.get('page');
    
        // playAudio(currentPage);

        // const button = document.getElementById('play-pause-audio');
        // var buttonIcon = document.querySelector('#play-pause-audio i.icon');
        // var buttonText = document.querySelector('#play-pause-audio span.toggle-text');

        // button.classList.remove('grey'); // Remove the grey class
        // button.classList.add('blue'); // Add the blue class to change its color back
        // button.style.pointerEvents = 'auto';

        // buttonIcon.classList.remove('play', 'pause', 'check');
        // buttonIcon.classList.add('pause');
        // buttonText.innerText = 'Pause';
        // startHighlightingWords();

        
      } else {
        console.error('Failed to update avatar');
        // Handle errors
      }
    })
    .catch(error => {
      console.error('Error:', error);
      // Handle network errors
    });
  }

function changeSpeed(speedValue) {
    console.log("The speed value: " + speedValue);

    // Convert the speed value to a number
    let speed = parseFloat(speedValue);
    voiceSpeed = speed;
    
    // Assuming the audio element has the ID 'narration-audio'
    let audio = document.getElementById('narration-audio');

    // Set the playback rate of the audio element
    if (audio) {
        audio.playbackRate = speed;
    }
}


$(document).ready(function() {
    if(speechData !== "none") {
        $('#page-article').click();
    } else {
        $('#volume-button').hide();
    }

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
    })
  ;

;
    // later make so check from db whether to play audio / highlight 
    setLinks(startPage);
    updateProgressBar();

    // for testing only do pages with speech data to avoid console log error 
    if(speechData !== "none") {
        playAudio(page);
        toggleHighlighting();
        startHighlightingWords();
    }
    // if(wordHighlighting || sentenceHighlighting) {
    //     startHighlightingWords();
    // }
    

    $('#backButton').on('click', function() {
        // console.log("Back button clicked");
        const urlParams = new URLSearchParams(window.location.search);
        const currentPage = urlParams.get('page');

        $('.ui.sidebar').sidebar('hide');

        if(speechData !== "none" && currentPage !== 'quiz') {
            stopHighlighting();
        }
        // restartWordHighlighting();


        const { backlink, nextlink } = setLinks(currentPage);
        history.pushState(null, '', backlink);

        const backParams = new URLSearchParams(backlink);
        const backPage = backParams.get('page');

        var audio = document.getElementById('narration-audio');
        audio.src = `https://dart-store.s3.amazonaws.com/identity+theft+voice+over/${section}/${backPage}_${avatar}.mp3`;
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

                    if(speechData !== "none" && backPage !== 'quiz') {
                        playAudio(backPage);
                        toggleHighlighting();
                        startHighlightingWords();
                    }

                    if(backPage === 'quiz') {
                        console.log("Page is quiz so pause");
                        var audio = document.getElementById('narration-audio');
                        audio.pause();
                        stopHighlighting();
    
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

        // stop and reseat audio and highlighting immediately
        if(speechData !== "none" && currentPage !== 'quiz') {
            stopHighlighting();
        }

        // restartWordHighlighting();

        const { backlink, nextlink } = setLinks(currentPage);
        history.pushState(null, '', nextlink);

        const nextParams = new URLSearchParams(nextlink);
        const nextPage = nextParams.get('page');

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

                if(speechData !== "none" && nextPage !== 'quiz') {
                    playAudio(nextPage);
                    toggleHighlighting();
                    startHighlightingWords();
                }

                if(nextPage === 'quiz') {
                    console.log("Page is quiz so pause");
                    var audio = document.getElementById('narration-audio');
                    audio.pause();
                    stopHighlighting();
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
        } else if (pageParam === 'preventative') {
            progress = (2 / total) * 100;
        } else if (pageParam === 'contacted') {
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
  