var hintsList = [
  {
    hint: `How can you have a positive impact on your digital footprint?
    You can post things related to your hobbies, your school activities, or
    any other interests!`,
    element: '#hint1',
    audioFile: ''
  },
  {
    hint: `Read this post and then click on it to think more about how a
    post like this impacts someone’s digital footprint.`,
    element: '#hint2',
    hintPosition: 'bottom-right',
    audioFile: ''
  },
  {
    hint: `Read this post and then click on it to think more about how a
    post like this impacts someone’s digital footprint.`,
    element: '#hint3',
    hintPosition: 'middle-middle',
    audioFile: ''
  },
  {
    hint: `Remember, your digital footprint can affect your reputation
    online and offline! Think about who can see your post and how they might
    view you as a result.`,
    element: '#hint4',
    hintPosition: 'middle-middle',
    audioFile: ''
  },
  {
    hint: `If someone posts something you don’t want to have as part of your
    digital footprint, you can ask them to delete it through a private
    message.`,
    element: '#hint5',
    hintPosition: 'bottom-right',
    audioFile: ''
  }
];

var stepsList = [
  {
    element: '#step1',
    intro: `NOTE: Most browsers require users to interact with the page before
    audio can play, so this step will not have a voiceover. Its purpose is to
    get the user to interact with the page. Text would be added later.`,
    position: 'left',
    scrollTo: 'tooltip',
    audioFile: ''
  },
  {
    element: '#step1',
    intro: `Click on the blue dots&nbsp;<a role='button' tabindex='0'
    class='introjs-hint'><div class='introjs-hint-dot'></div><div class=
    'introjs-hint-pulse'></div></a> &nbsp; &nbsp; &nbsp;to learn more...`,
    position: "left",
    scrollTo: 'tooltip',
    audioFile: ''
  }
];


function eventsAfterHints() {
  $('.img.post img').on('click', function(){
    $('input[type=checkbox]').prop('checked',false);
    // $('#digfoot_sim_modal').modal('show');
    recordSimModalInputs('digfoot_simModal');
  });
}
