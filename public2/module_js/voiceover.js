{
  const audioChannel = new Audio(); // the audio channel for voiceovers
  let voiceoverSequenceCount = 0;

  function playVoiceover(audioFile) {

    const pathArray = window.location.pathname.split('/');
    const subdirectory2 = pathArray[2];
    if (audioFile !== '') {
      if (typeof audioFile === "string"){
        audioChannel.src = `/audioFiles/${subdirectory2}/${audioFile}`;
      } else if (typeof audioFile === "object"){
        audioChannel.src = `/audioFiles/${subdirectory2}/${audioFile[voiceoverSequenceCount]}`;
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
        if ((typeof audioFile === "object") && (voiceoverSequenceCount < audioFile.length)){
          playVoiceover(audioFile);
        }
      }
    } else {
      console.log(`** No audio filename provided for this step. If this is expected, then ignore this message. **`);
    }
  };

  function addVoiceovers() {
    for (const element in voiceoverMappings) {
      $(element).on('click', function(){
        playVoiceover(voiceoverMappings[element]);
      });
    }
  };

  function pauseVoiceover(){
    audioChannel.pause();
  }

  window.Voiceovers = {
    playVoiceover,
    pauseVoiceover,
    addVoiceovers
  }
}
