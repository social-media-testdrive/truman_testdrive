const nextPageURL = 'sim';

const stepsList = [{
        element: '#step1',
        intro: `Click "Next" to begin!`,
        position: 'left',
        scrollTo: 'tooltip',
        audioFile: ['']
    },
    {
        element: '#step1',
        intro: `When you sign up for an account on social media, be sure to check
    your <b>privacy settings</b>. You can control what information is visible to
    others. You can also go to this page to change your settings any time.`,
        position: 'left',
        scrollTo: "tooltip",
        audioFile: ['CUSML.7.5.1.mp3']
    },
    {
        element: '#step2',
        intro: `A “<i>Public</i>” setting on your social media account means that it
    is visible to anyone on the internet. A “<i>Private</i>” setting will
    restrict access to your account so that only the people you approve can see
    the things that you post.`,
        position: 'left',
        scrollTo: "tooltip",
        audioFile: ['CUSML.7.5.2.mp3']
    },
    {
        element: '#step3',
        intro: `Some social media sites will let you choose who can contact you. You
    can change who can add you as a friend on the site, comment on your posts,
    or tag you in posts.`,
        position: 'left',
        scrollTo: "tooltip",
        audioFile: ['CUSML.7.5.3.mp3']
    },
    {
        element: '#tagStep',
        intro: `Changing these settings will stop people from being able to
    “<i>tag</i>” you in posts that you did not make. This way, you can control
    which posts show up on your profile.`,
        position: 'left',
        scrollTo: "tooltip",
        audioFile: ['CUSML.7.5.4.mp3']
    },
    {
        element: '#step4',
        intro: `Here, you can change how you share your location information. You
    can choose to remove it completely or hide it from certain people.`,
        position: 'right',
        scrollTo: "tooltip",
        audioFile: ['CUSML.7.5.5.mp3']
    }
];

$(window).on('load', function() {
    $('.ui.dropdown').dropdown('set selected', '0');

    // Defining multi-select onAdd and onRemove functions, triggered when a dropdown multi-select is changed
    $('.blocklistDropdown').dropdown({
        onAdd: function(addedValue, addedText, $addedChoice) {
            const cat = {
                subdirectory1: 'tutorial',
                subdirectory2: 'privacy',
                inputField: 'blockList- add',
                absoluteTimestamp: Date.now(),
                inputText: addedValue
            };

            $.post("/privacyAction", {
                action: cat,
                actionType: 'privacy',
                _csrf: $('meta[name="csrf-token"]').attr('content')
            });
        },
        onRemove: function(addedValue, removedText, $removedChoice) {
            const cat = {
                subdirectory1: 'tutorial',
                subdirectory2: 'privacy',
                inputField: 'blockList- remove',
                absoluteTimestamp: Date.now(),
                inputText: addedValue
            };

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
            const cat = {
                subdirectory1: 'tutorial',
                subdirectory2: 'privacy',
                inputField: $(this).find('input').attr('name'),
                absoluteTimestamp: Date.now(),
                inputText: text
            };

            $.post("/privacyAction", {
                action: cat,
                actionType: 'privacy',
                _csrf: $('meta[name="csrf-token"]').attr('content')
            });
        }
    });

    //Triggered when a toggle is changed
    $('.ui.toggle.checkbox input').change(function() {
        const cat = {
            subdirectory1: 'tutorial',
            subdirectory2: 'privacy',
            inputField: $(this).attr('name'),
            absoluteTimestamp: Date.now(),
            inputText: $(this).is(':checked') ? "true" : "false"
        };

        $.post("/privacyAction", {
            action: cat,
            actionType: 'privacy',
            _csrf: $('meta[name="csrf-token"]').attr('content')
        });
    })
});