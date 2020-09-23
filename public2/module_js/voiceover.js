{
  const cdn = 'https://dhpd030vnpk29.cloudfront.net';
  const audioChannel = new Audio(); // the audio channel for voiceovers
  let voiceoverSequenceCount = 0;

  function pauseVoiceover(){
    audioChannel.pause();
  }

  function playVoiceover(audioFile) {

    const pathArray = window.location.pathname.split('/');
    const subdirectory2 = pathArray[2];
    if (audioFile !== '') {
      if (typeof audioFile === "string"){
        if (subdirectory2 === "cyberbullying") { // TODO: remove once cyberbullying voice-overs recorded
          audioChannel.src = `/audioFiles/${subdirectory2}/${audioFile}`;
        } else {
          audioChannel.src = `${cdn}/voice-overs/${audioFile}`;
        }
      } else if (typeof audioFile === "object"){
        if( audioFile[voiceoverSequenceCount] !== ''){
          if (subdirectory2 === "cyberbullying") { // TODO: remove once cyberbullying voice-overs recorded
            audioChannel.src = `/audioFiles/${subdirectory2}/${audioFile[voiceoverSequenceCount]}`;
          } else {
            audioChannel.src = `${cdn}/voice-overs/${audioFile[voiceoverSequenceCount]}`;
          }
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
        if ((typeof audioFile === "object") && (voiceoverSequenceCount < audioFile.length)){
          playVoiceover(audioFile);
        } else {
          resetVoiceoverSequenceCount();
        }
      }
    } else {
      pauseVoiceover();
      console.log(`** No audio filename provided. If this is expected, then ignore this message. **`);
    }
  };

  function resetVoiceoverSequenceCount(){
    voiceoverSequenceCount = 0;
  }

  function addVoiceovers() {
    for (const element in voiceoverMappings) {
      $(element).on('click', function(){
        playVoiceover(voiceoverMappings[element]);
      });
    }
  };



  window.Voiceovers = {
    playVoiceover,
    resetVoiceoverSequenceCount,
    pauseVoiceover,
    addVoiceovers
  }
}
