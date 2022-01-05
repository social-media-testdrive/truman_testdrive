var hintsList = [{
        hint: `How can you have a positive impact on your digital footprint?
    You can post things related to your hobbies, your school activities, or
    any other interests!`,
        element: '#hint1',
        audioFile: ['CUSML.4.4.2.mp3']
    },
    {
        hint: `Read this post and then click on it to think more about how a
    post like this impacts someone’s digital footprint.`,
        element: '#hint2',
        hintPosition: 'bottom-right',
        audioFile: ['CUSML.4.4.3.mp3']
    },
    {
        hint: `Read this post and then click on it to think more about how a
    post like this impacts someone’s digital footprint.`,
        element: '#hint3',
        hintPosition: 'middle-middle',
        audioFile: ['CUSML.4.4.3.mp3']
    },
    {
        hint: `Remember, your digital footprint can affect your reputation
    online and offline! Think about who can see your post and how they might
    view you as a result.`,
        element: '#hint4',
        hintPosition: 'middle-middle',
        audioFile: ['CUSML.4.4.4.mp3']
    },
    {
        hint: `If someone posts something you don’t want to have as part of your
    digital footprint, you can ask them to delete it through a private
    message.`,
        element: '#hint5',
        hintPosition: 'bottom-right',
        audioFile: ['CUSML.4.4.5.mp3']
    }
];

var stepsList = [{
        element: '#step1',
        intro: `Click "Next" to begin!`,
        position: 'left',
        scrollTo: 'tooltip',
        audioFile: ['']
    },
    {
        element: '#step1',
        intro: `Click on "Done" and then look for the blue dots&nbsp;&nbsp;<a role='button' tabindex='0'
    class='introjs-hint'><div class='introjs-hint-dot'></div><div class=
    'introjs-hint-pulse'></div></a> &nbsp; &nbsp; &nbsp; &nbsp; to learn more...`,
        position: "left",
        scrollTo: 'tooltip',
        audioFile: ['CUSML.4.4.1.mp3']
    }
];

let clickPost = false;

function eventsAfterHints() {
    $('.img.post img').on('click', function() {
        clickPost = true;
        $('#confirmContinueCheck').hide();
        $('.ui.modal input[type=checkbox]').prop('checked', false);
        // $('#digfoot_sim_modal').modal('show');
        recordSimModalInputs('digfoot_simModal');
    });
}