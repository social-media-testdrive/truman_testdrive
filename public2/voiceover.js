{
  let pathArray = window.location.pathname.split('/');
  let page = pathArray[1];
  let modName = pathArray[2];

  function playAudioFile(audioChannel,audioFile){
    audioChannel.src = `/audioFiles/${modName}/${audioFile}`;
    let playVoiceoverPromise = audioChannel.play();

    if (playVoiceoverPromise !== undefined) {
      playVoiceoverPromise.then(() => {
        // Start whatever you need to do only after playback
        // has begun.
      }).catch(error => {
        if (error.name === "NotAllowedError") {
          console.log("You have been stopped");
        } else {
          console.log(error)
        }
      });
    }
  };

  function attachAudioEvent(audioChannel,voiceoverItem,audioFile,playOn){
    switch(playOn){
      case 'pageLoad':
        console.log(`it should be playing!`);
        // play it now, aka on window load, with a 2 second delay\
        setTimeout(playAudioFile(audioChannel,audioFile),2000);
        break;
      case 'clickEvent':
        $(voiceoverItem).on('click', function(){
          playAudioFile(audioChannel,audioFile);
        });
        break;
      default:
        console.log(`Cannot add voiceover ${audioFile}:\nUnknown playOn definition!`);
    }
  };

  async function getData(jsonPath){
    return $.getJSON(jsonPath).then(function(data){
      return data;
    })
  };

  async function addVoiceovers(audioChannel){
    let data = await getData(`/json/audioMappings/${modName}.json`);
    for (const voiceoverItem in data[page]){
      const playOn = data[page][voiceoverItem]["playOn"];
      const audioFile = data[page][voiceoverItem]["audioFile"];
      attachAudioEvent(audioChannel,voiceoverItem,audioFile,playOn);
    }

  };

  $(window).on("load", function () {
    let audioChannel = new Audio()
    addVoiceovers(audioChannel);
  });
}
