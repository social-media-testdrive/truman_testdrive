var hintsList=
[
  {
    hint: `How can you have a positive impact on your digital footprint?
    You can post things related to your hobbies, your school activities, or
    any other interests!`,
    element: '#hint1'
  },
  {
    hint: `Read this post and then click on it to think more about how a
    post like this impacts someone’s digital footprint.`,
    element: '#hint2',
    hintPosition: 'bottom-right'
  },
  {
    hint: `Read this post and then click on it to think more about how a
    post like this impacts someone’s digital footprint.`,
    element: '#hint3',
    hintPosition: 'middle-middle'
  },
  {
    hint: `Remember, your digital footprint can affect your reputation
    online and offline! Think about who can see your post and how they might
    view you as a result.`,
    element: '#hint4',
    hintPosition: 'middle-middle'
  },
  {
    hint: `If someone posts something you don’t want to have as part of your
    digital footprint, you can ask them to delete it through a private
    message.`,
    element: '#hint5',
    hintPosition: 'bottom-right'
  }
]

var stepsList=
[
  {
    element: document.querySelectorAll('#step1')[0],
    intro: `Click on the blue dots&nbsp;<a role='button' tabindex='0'
    class='introjs-hint'><div class='introjs-hint-dot'></div><div class=
    'introjs-hint-pulse'></div></a> &nbsp; &nbsp; &nbsp;to learn more...`,
    position: "left",
    scrollTo: 'tooltip'
  }

]


function eventsAfterHints() {
  $('.img.post img').on('click', function(){
    $('input[type=checkbox]').prop('checked',false);
    // $('#digfoot_sim_modal').modal('show');
    recordSimModalInputs('digfoot_simModal')
  });
}
