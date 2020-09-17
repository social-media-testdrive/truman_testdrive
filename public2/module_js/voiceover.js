{
  const audioChannel = new Audio(); // the audio channel for voiceovers

  function playVoiceover(audioFile) {
    const subdirectory2 = pathArray[2];
    if (audioFile !== '') {
      const pathArray = window.location.pathname.split('/');
      audioChannel.src = `/audioFiles/${subdirectory2}/${audioFile}`;
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
