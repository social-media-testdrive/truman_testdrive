{
  const cdn = 'https://dhpd030vnpk29.cloudfront.net';
  const audioChannel = new Audio(); // the audio channel for voiceovers
  let voiceoverSequenceCount = 0;

  function resetVoiceoverSequenceCount(){
    voiceoverSequenceCount = 0;
  }

  function pauseVoiceover(){
    audioChannel.pause();
  }

  function playVoiceover(audioFile, delay) {
    const pathArray = window.location.pathname.split('/');
    const subdirectory2 = pathArray[2];
    if (audioFile !== '') {
      if( audioFile[voiceoverSequenceCount] !== ''){
        if (subdirectory2 === "cyberbullying") { // TODO: remove once cyberbullying voice-overs recorded
          audioChannel.src = `/audioFiles/${subdirectory2}/${audioFile[voiceoverSequenceCount]}`;
        } else {
          audioChannel.src = `${cdn}/voice-overs/${audioFile[voiceoverSequenceCount]}`;
        }
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
      console.log(`** No audio filename provided. If this is expected, then ignore this message. **`);
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
}
