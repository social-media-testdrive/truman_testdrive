// text2speech.js
//init the voices array 
const synth = window.speechSynthesis;

let voices = [] ;

const getVoices = () =>{
    voices = synth.getVoices();
    console.log(voices)
}
getVoices() ;

if(synth.onvoiceschanged !== undefined){
    synth.onvoiceschanged = getVoices
}

// Select the volume up button element
const volumeUpButton = document.querySelector('#volume-up-button');
let isSpeaking = false; // Track if speech is currently in progress

// Function to read text content from a DOM element
const readTextContent = (element) => {
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null, false);
  const textNodes = [];

  while (walker.nextNode()) {
    textNodes.push(walker.currentNode.textContent);
  }

  const fullText = textNodes.join(' ');

  // Create a SpeechSynthesisUtterance and set the text
  const speakText = new SpeechSynthesisUtterance(fullText);

  if(voices[115]){
      speakText.voice = voices[115];
      speakText.lang = voices[115].lang;
  }

  // Speak and handle events
  speakText.onend = () => {
    console.log('Finished reading: ' + fullText);
    isSpeaking = false; // Mark speech as finished
  };

  speakText.onerror = () => {
    console.error('Error while reading: ' + fullText);
    isSpeaking = false; // Mark speech as finished
  };


  // Use the default voice and settings
  speechSynthesis.speak(speakText);
  isSpeaking = true; // Mark speech as in progress
};

// Function to stop speech
const stopSpeech = () => {
  if (isSpeaking) {
    speechSynthesis.cancel(); // Cancel current speech
    isSpeaking = false; // Mark speech as stopped
  }
};

// Function to read all the text within the raised-container
const readTextInRaisedContainer = () => {
    let currentURL = window.location.href;
    let urlParams = new URLSearchParams(window.location.search);
    let pageParam = urlParams.get('page');

    console.log(pageParam);


    const raisedContainer = document.querySelector('#' + pageParam + '-read');
    if (raisedContainer) {
    if (isSpeaking) {
      stopSpeech(); // If speaking, stop speech
    } else {
      readTextContent(raisedContainer); // If not speaking, read text
    }
  }
};

// Add a click event listener to the volume up button
volumeUpButton.addEventListener('click', () => {
  readTextInRaisedContainer();
});

// Ensure any ongoing speech is stopped when the page is unloaded
window.addEventListener('beforeunload', () => {
  if (isSpeaking) {
    stopSpeech();
  }
});