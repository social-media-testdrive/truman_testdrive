var hintsList = [{
        hint: `What would Lily need to do if she didn’t want strangers to see her
    social media posts? Which privacy settings would she have to change?`,
        element: '#hint1',
        audioFile: ['CUSML.7.8.18.mp3']
    },
    {
        hint: `She can make her account “Private,” so that only her social media
    friends can see her posts. Let’s try doing this!`,
        element: '#hint2',
        hintPosition: 'top-middle',
        audioFile: ['CUSML.7.8.19.mp3']

    },
    {
        hint: `Have you changed the account settings to a “Private” account? Click
    “Let’s Continue!” to see how her profile has changed.`,
        element: '#hint3',
        hintPosition: 'middle-right',
        audioFile: ['CUSML.7.8.20.mp3']
    }
];

//Get the status of the key setting
let keySetting1 = $("input[name='toggleValue']").is(':checked');

//Using logic to determine if all required criteria are met before allowing to proceed

$(".ui.toggle.checkbox[name='togglePrivateAccount']").change(function() {
    keySetting1 = $("input[name='toggleValue']").is(":checked");
    if (keySetting1 == true) {
        $('#privateAccountCueText').hide();
    }
    if (closedHints == hintsList.length) {
        if ((keySetting1 == true)) {
            $("#cyberTransButton").addClass("green");
        } else {
            $("#cyberTransButton").removeClass("green");
        }
    }
});

function customOnHintCloseFunction() {
    closedHints++;
    clickedHints = 0;
    if ($('#removeHidden').is(":visible")) {
        $('#removeHidden').transition('fade');
        if ($('#clickAllDotsWarning').is(":hidden")) {
            $('#cyberTransButton').css("margin-bottom", "4em");
        }
    }
    if (closedHints == hintsList.length) {
        if ($('#clickAllDotsWarning').is(':visible')) {
            $('#clickAllDotsWarning').transition('fade');
            $('#cyberTransButton').css("margin-bottom", "4em");
        }
        if (keySetting1 == true) {
            $(".free3").addClass("green");
        }
    }
}

//Function for adding visual cue to the appropriate setting

function jiggleCue() {
    $('#privateAccountCue').transition('shake');
}

//Adding messaging for the private account setting, scrolling to the setting

$('#cyberTransButton').on('click', function() {
    if (closedHints != hintsList.length) {
        //show the message normally the first time
        if ($('#clickAllDotsWarning').is(":hidden")) {
            $('#clickAllDotsWarning').transition('fade');
            $('#cyberTransButton').css("margin-bottom", "10em");
        } else {
            //otherwise, bounce the message to draw attention to it
            $('#clickAllDotsWarning').transition('bounce');
        }
    }
    if (keySetting1 == false) {
        $('#privateAccountCueText').show();

        //snippet taken from StackOverflow
        $([document.documentElement, document.body]).animate({
            scrollTop: $("#topOfPage").offset().top
        }, 1000);

        setTimeout(function() {
            $('#privateAccountCue').transition('bounce');
        }, 1000);
    } else {
        $('#privateAccountCueText').hide();
    }
});

//Make the dropdown work
$('.ui.dropdown').dropdown('set selected', '0');

$('#locationDropdown')
    .dropdown('set selected', '2');