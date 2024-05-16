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
