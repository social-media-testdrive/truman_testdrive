const nextPageURL = 'sim';

const stepsList = [{
        element: '#step1',
        intro: `Click "Next" to begin!`,
        position: 'left',
        scrollTo: 'tooltip',
        audioFile: ['']
    },
    {
        element: document.querySelectorAll('#step1')[0],
        intro: `When you sign up for an account on social media, be sure to check
    your <b>privacy settings</b>. You can control what information is visible to
    others. You can also go to this page to change your settings any time.`,
        position: 'left',
        scrollTo: "tooltip",
        audioFile: ['CUSML.7.5.1.mp3']
    },
    {
        element: document.querySelectorAll('#step2')[0],
        intro: `A “<i>Public</i>” setting on your social media account means that it
    is visible to anyone on the internet. A “<i>Private</i>” setting will
    restrict access to your account so that only the people you approve can see
    the things that you post.`,
        position: 'left',
        scrollTo: "tooltip",
        audioFile: ['CUSML.7.5.2.mp3']
    },
    {
        element: document.querySelectorAll('#step3')[0],
        intro: `Some social media sites will let you choose who can contact you. You
    can change who can add you as a friend on the site, comment on your posts,
    or tag you in posts.`,
        position: 'left',
        scrollTo: "tooltip",
        audioFile: ['CUSML.7.5.3.mp3']
    },
    {
        element: document.querySelectorAll('#tagStep')[0],
        intro: `Changing these settings will stop people from being able to
    “<i>tag</i>” you in posts that you did not make. This way, you can control
    which posts show up on your profile.`,
        position: 'left',
        scrollTo: "tooltip",
        audioFile: ['CUSML.7.5.4.mp3']
    },
    {
        element: document.querySelectorAll('#step4')[0],
        intro: `Here, you can change how you share your location information. You
    can choose to remove it completely or hide it from certain people.`,
        position: 'right',
        scrollTo: "tooltip",
        audioFile: ['CUSML.7.5.5.mp3']
    }
];

$('.ui.dropdown').dropdown('set selected', '0');

// Defining multi-select onAdd and onRemove functions, triggered when a dropdown multi-select is changed
$('.blocklistDropdown').dropdown({
    onAdd: function(addedValue, addedText, $addedChoice) {
        let cat = {};
        cat.subdirectory1 = 'tutorial';
        cat.subdirectory2 = 'privacy';
        cat.inputField = 'blockList- add';
        cat.absoluteTimestamp = Date.now();
        cat.inputText = addedValue;

        $.post("/privacyAction", {
            action: cat,
            actionType: 'privacy',
            _csrf: $('meta[name="csrf-token"]').attr('content')
        });
    },
    onRemove: function(addedValue, removedText, $removedChoice) {
        let cat = {};
        cat.subdirectory1 = 'tutorial';
        cat.subdirectory2 = 'privacy';
        cat.inputField = 'blockList- remove';
        cat.absoluteTimestamp = Date.now();
        cat.inputText = addedValue;

        $.post("/privacyAction", {
            action: cat,
            actionType: 'privacy',
            _csrf: $('meta[name="csrf-token"]').attr('content')
        });
    }
});

//Triggered when a dropdown select is changed
$('.ui.selection.dropdown:not(.blocklistDropdown)').dropdown({
    onChange: function(value, text, $choice) {
        let cat = {};
        cat.subdirectory1 = 'tutorial';
        cat.subdirectory2 = 'privacy';
        cat.inputField = $(this).find('input').attr('name');
        cat.absoluteTimestamp = Date.now();
        cat.inputText = text;

        $.post("/privacyAction", {
            action: cat,
            actionType: 'privacy',
            _csrf: $('meta[name="csrf-token"]').attr('content')
        });
    }
});

//Triggered when a toggle is changed
$('.ui.toggle.checkbox input').change(function() {
    let cat = {};
    cat.subdirectory1 = 'tutorial';
    cat.subdirectory2 = 'privacy';
    cat.inputField = $(this).attr('name');
    cat.absoluteTimestamp = Date.now();
    cat.inputText = $(this).is(':checked') ? "true" : "false";

    $.post("/privacyAction", {
        action: cat,
        actionType: 'privacy',
        _csrf: $('meta[name="csrf-token"]').attr('content')
    });
})