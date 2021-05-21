const audioChannel = new Audio(); // the audio channel for voiceovers
let voiceoverSequenceCount = 0;

function resetVoiceoverSequenceCount(){
  voiceoverSequenceCount = 0;
}

function pauseVoiceover(){
  audioChannel.pause();
}

function playVoiceover(audioFile, delay = 0) {
  const pathArray = window.location.pathname.split('/');
  const subdirectory2 = pathArray[2];
  if (audioFile !== '') {
    if( audioFile[voiceoverSequenceCount] !== ''){
      if(audioFile.length > 1){
        audioChannel.src = `https://dhpd030vnpk29.cloudfront.net/voice-overs/${audioFile[voiceoverSequenceCount]}`;
      } else if (audioFile.length === 1) {
        audioChannel.src = `https://dhpd030vnpk29.cloudfront.net/voice-overs/${audioFile[0]}`;
      }
      let playVoiceoverPromise = audioChannel.play();
      if (playVoiceoverPromise !== undefined) {
        playVoiceoverPromise.catch(error => {
          if (error.name === 'NotAllowedError') {
            console.log(`** Browser has determined that audio is not allowed to play yet. **`);
          } else {
            console.log(error)
          }
        });
      }
    }

    audioChannel.onended = function(){
      voiceoverSequenceCount++;
      if (voiceoverSequenceCount < audioFile.length){
        setTimeout(function(){
          playVoiceover(audioFile,delay);
        }, delay);
      } else {
        resetVoiceoverSequenceCount();
      }
    }
  } else {
    pauseVoiceover();
  }
};

function addVoiceovers() {
  for (const element in voiceoverMappings) {
    const voiceoverInfo = voiceoverMappings[element];
    $(element).on('click', function(){
      pauseVoiceover();
      setTimeout( function() {
        playVoiceover(voiceoverInfo["files"],voiceoverInfo["delay"]);
      }, voiceoverInfo["initialDelay"]);
    });
  }
};

window.Voiceovers = {
  resetVoiceoverSequenceCount,
  pauseVoiceover,
  playVoiceover,
  addVoiceovers
}
