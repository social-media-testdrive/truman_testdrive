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
let showingLink = false;

// remove quiz question and slide numbers on reload 
window.onload = function() {
    const urlParams = new URLSearchParams(window.location.search);
    // console.log("IN HERE 1211221212")
    // console.log("past attempts on load:" + pastAttempts)
    if (urlParams.has('question') && !pastAttempts) { // Check if the 'question' parameter exists
        urlParams.delete('question'); // Remove the 'question' parameter
        const newUrl = window.location.pathname + '?' + urlParams.toString();
        window.history.replaceState(null, '', newUrl); // Replace the URL without reloading
        // window.location.reload(); 
    }
    if(urlParams.has('slide')) {
        urlParams.delete('slide');
        const newUrl = window.location.pathname + '?' + urlParams.toString();
        window.history.replaceState(null, '', newUrl); // Replace the URL without reloading
    }
};

document.addEventListener('click', function clickHandler() {
    // console.log("User interacted with the page")
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
    showingLink = false;
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

    // $('#volume-icon').removeClass('off');
    // $('#volume-icon').addClass('up'); 

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
    let resultsClass = "highlightedResults";
    let buttonClass = "highlightedButton";

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
    } else if(element === "showLink") {
        if(wordHighlighting || sentenceHighlighting) {
            let temp = document.getElementById("showLink");
            temp.classList.add(wordClass);

            setTimeout(function() {
                temp.classList.remove(wordClass);
                showingLink = false;
            }, 1000);
        }
    } else if(element === "narrate-image-" + currentPage) {

        if(wordHighlighting || sentenceHighlighting) {
            $('#narrate-image-' + currentPage + " img").addClass(buttonClass);
        }
    } else if(element === "showResults") {

        if(wordHighlighting || sentenceHighlighting) {
            let temp = document.getElementById("showResults");
            temp.classList.add(resultsClass);
        }
    } else if(element === "narrate-try-again") {

        if(wordHighlighting || sentenceHighlighting) {
            $('#narrate-try-again').addClass(buttonClass);
            // let temp = document.getElementById("narrate-try-again");
            // temp.classList.add(buttonClass);
        }
    }  else if(element === "narrate-view-answers") {

        if(wordHighlighting || sentenceHighlighting) {
            $('#narrate-view-answers').addClass(buttonClass);
            // let temp = document.getElementById("narrate-view-answers");
            // temp.classList.add(buttonClass);
        }
    } else if(element === "narrate-next") {

        if(wordHighlighting || sentenceHighlighting) {
            $('#narrate-next').addClass(buttonClass);
            $('#nextButton').addClass(buttonClass);

            // let temp = document.getElementById("narrate-next");
            // temp.classList.add(buttonClass);
        }
    } else if (element === "clear") {
        console.log("*****clearing the highlights");
        $('#showResults').removeClass(resultsClass);

        $('#narrate-view-answers').removeClass(buttonClass);
        $('#narrate-try-again').removeClass(buttonClass);
        $('#narrate-image-' + currentPage + " img").removeClass(buttonClass);
        $('#narrate-next').removeClass(buttonClass);
        $('#nextButton').removeClass(buttonClass);

    } else if(element === "none"){
        // console.log("skip break element");
    } else if (element === "narrate-slide-header-" + currentPage) {
        if (wordHighlighting || sentenceHighlighting) {
            let temp = document.getElementById("narrate-slide-header-" + currentPage);
            temp.classList.add(sentenceClass);
        }
    } else if (element === "narrate-slide-header-" + currentPage + "-2") {
        if (wordHighlighting || sentenceHighlighting) {
            let temp = document.getElementById("narrate-slide-header-" + currentPage + "-2");
            temp.classList.add(sentenceClass);
        }
    } else if (element === "narrate-slide-header-" + currentPage + "-3") {
        if (wordHighlighting || sentenceHighlighting) {
            let temp = document.getElementById("narrate-slide-header-" + currentPage + "-3");
            temp.classList.add(sentenceClass);
        }
    } else if (element === "narrate-slide-header-" + currentPage + "-4") {
        if (wordHighlighting || sentenceHighlighting) {
            let temp = document.getElementById("narrate-slide-header-" + currentPage + "-4");
            temp.classList.add(sentenceClass);
        }
    } else if (element === "narrate-slide-header-" + currentPage + "-5") {
        if (wordHighlighting || sentenceHighlighting) {
            let temp = document.getElementById("narrate-slide-header-" + currentPage + "-5");
            temp.classList.add(sentenceClass);
        }
    } else if (element === "narrate-slide-header-" + currentPage + "-6") {
        if (wordHighlighting || sentenceHighlighting) {
            let temp = document.getElementById("narrate-slide-header-" + currentPage + "-6");
            temp.classList.add(sentenceClass);
        }
    } else {
        if(wordHighlighting || sentenceHighlighting) {

            // console.log("HIGHLIGH element: " + element );
            let temp = document.getElementById(element);
            // console.log("The temp: ", temp);
            selectedElement = temp.getElementsByTagName('span')[0];
            console.log("The selected element: ", selectedElement);

            // console.log("BEYYYY the selected element: " + selectedElement + " and the element: " + element + " and the word: " + word + " and the start: " + start + " and the finish: " + finish + " and the word class: " + wordClass + " and the sentence class: " + sentenceClass)
            if(sentenceHighlighting) {
                selectedElement.classList.add(sentenceClass);
            }

            // console.log("Bey the selected element: " + selectedElement.innerHTML + " start: " + start + " finish: " + finish + " word: " + word + " element: " + element)

            // always marking when audio is playing, just marks are transparent if wording highlighting is off, yellow if only word highlighting, white on dark bg if both sentence and word are on
            // remove previous mark tags before adding new ones
            selectedElement.innerHTML = selectedElement.innerHTML.replace(new RegExp(`<mark class="${wordClass}">|<\/mark>`, 'g'), "");
            s = selectedElement.innerHTML;

            console.log("* Before: " + s);
            console.log("* Info: " + start + " " + finish + " " + word + " " + element + " " + wordClass + " " + sentenceClass)
            // Add the mark tags to highlight the word
            selectedElement.innerHTML = s.substring(0, start) + `<mark class="${wordClass}">${word}</mark>` + s.substring(finish);
            console.log("* After: " + selectedElement.innerHTML);

            console.log("---------------------------")
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
    
    // console.log("** The wordData is: " + JSON.stringify(wordData[currentWordIndex]));

    // totalFinish = finish;
    let element = wordData[currentWordIndex]["element"];

    // console.log("** The element is: " + element);

    word = wordData[currentWordIndex]["value"];

    // console.log("*** To repeat. The word to be highlighted: " + word);

    if(element === "shownHere") {
        showingHere = true;
    }

    if(element === "showLink") {
        showingLink = true;
    }

    // console.log("*** to repeat starting highlight words with: " + start + " and finishing with: " + finish + " and the word: " + word + " and the element: " + element);
    // if(word === "<span class=\"underline-text\">Contact Us</span>") {
    //     console.log("BINGO SUBTRACTING 1 -----------------------------")
    //     // subtract 1 from the start and finish
    //     start += 1;
    //     finish += 1;
    // }
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
    const question = urlParams.get('question');
    const slide = urlParams.get('slide');

    console.log("IN start highlighting the current page: " + currentPage + " and the question: " + question);

    if(speechData !== "none") {

        // console.log("In starting the highlight") 
        
        const urlParams = new URLSearchParams(window.location.search);
        let currentPage = urlParams.get('page');
        // for quiz page, set the current page to the question like quiz-2 or quiz-3 to get correct highlight speech mark data
        if(currentPage === 'quiz' && question !== null) {
            currentPage = question;
        }
        // for types page, set the current page to the slide like types-1 or types-2 to get correct highlight speech mark data
        if(currentPage === 'types' && slide !== null) {
            currentPage = slide;
        }

        // console.log("The current page: " + currentPage);
        // console.log("The avatar: " + avatar)
        // console.log("The speech data: " + speechData)

        avatarSpeechData = speechData[currentPage][avatar];
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

        // // add event listener for types slideshow pages to play correct audio for the current slide
        // if(currentPage === 'types') {
        //     $('#steps-slider').on('afterChange', function(event, slick, currentSlide){
        //         // slide count starts at zero so add 1 to get the correct slide number
        //         let temp = currentSlide + 1;
        //         console.log('Current slide number:', temp);
        //         stopHighlighting();
        //     });    
        // }    

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
    if(previousElement.includes("narrate-slide-header")){ 
        document.getElementById(previousElement).classList.remove('highlighted-sentence');
    }


    if(selectedElement !== null && !showingHere && !showingLink) {
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

    if(previousElement.includes("narrate-slide-header")){ 
        const slideNum = urlParams.get('slide');
        if(slideNum === null) {
            document.getElementById('narrate-slide-header-' + currentPage).classList.remove('highlighted-sentence');
        } else if(slideNum === '2') {
            document.getElementById('narrate-slide-header-' + currentPage + "-2").classList.remove('highlighted-sentence');
        } else if(slideNum === '3') {
            document.getElementById('narrate-slide-header-' + currentPage + "-3").classList.remove('highlighted-sentence');
        } else if(slideNum === '4') {
            document.getElementById('narrate-slide-header-' + currentPage + "-4").classList.remove('highlighted-sentence');
        } else if(slideNum === '5') {
            document.getElementById('narrate-slide-header-' + currentPage + "-5").classList.remove('highlighted-sentence');
        } else if(slideNum === '6') {
            document.getElementById('narrate-slide-header-' + currentPage + "-6").classList.remove('highlighted-sentence');
        }
    }

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
    console.log("In play audio")
    console.log("The page: " + thePage)




    // const urlParams = new URLSearchParams(window.location.search);
    // const currentPage = urlParams.get('page');

    if(speechData !== "none") {

        var audio = document.getElementById('narration-audio');

        if(audio) {
            audio.src = `https://dart-store.s3.amazonaws.com/${module}-narration/${section}/${thePage}_${avatar}.mp3`;
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

    // get rid of volume icon sound imagery
    $('#volume-icon').removeClass('up');
    $('#volume-icon').addClass('off'); 
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

function turnOffNarrationAndHighlighting() {
    stopHighlighting();
    disableNarrationPlayButton();
    var audio = document.getElementById('narration-audio');
    audio.pause();
    audio.currentTime = 0;
}

// don't disable play button for types/slides pages because it immediately starts the next audio
function slideResetNarrationAndHighlighting() {
    stopHighlighting();

    var audio = document.getElementById('narration-audio');
    audio.pause();
    audio.currentTime = 0;
}
