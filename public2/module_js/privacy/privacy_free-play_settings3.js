var hintsList = [{
        hint: `Lily would like to hide tagged posts from her profile. Which privacy
    settings would she have to change?`,
        element: '#hint1',
        audioFile: ['CUSML.7.8.13.mp3']
    },
    {
        hint: `She can turn off tagging settings and hide tagged posts from her
    timeline. Let’s try doing this!`,
        element: '#hint2',
        hintPosition: 'top-middle',
        audioFile: ['CUSML.7.8.14.mp3']
    },
    {
        hint: `Have you turned off tagging settings and hidden tagged posts from
    Lily’s timeline? Click “Let’s Continue!” to see how her profile has changed.`,
        element: '#hint3',
        hintPosition: 'middle-right',
        audioFile: ['CUSML.7.8.15.mp3']
    }

];

//Variables for the two key settings
let keySetting1 = $("input[name='allowTagInput']").is(':checked');
let keySetting2 = $("input[name='autoTagInput']").is(':checked');

function customOnHintCloseFunction() {
    closedHints++;
    clickedHints = 0;
    if ($('#removeHidden').is(":visible")) {
        $('#removeHidden').transition('fade');
        if ($('#clickAllDotsWarning').is(":hidden")) {
            $('#cyberTransButton').css("margin-bottom", "4em");
        }
    }
    //turn the button green if all three criteria are met
    if (closedHints == hintsList.length) {
        //remove the yellow warning about dots
        if ($('#clickAllDotsWarning').is(':visible')) {
            $('#clickAllDotsWarning').transition('fade');
            $('#cyberTransButton').css("margin-bottom", "4em");
        }
        if ((keySetting1 == false) && (keySetting2 == false)) {
            $("#cyberTransButton").addClass("green");
        }
    }
}


//Make the dropdown work
$('.ui.dropdown').dropdown('set selected', '0');

$('#locationDropdown').dropdown('set selected', '2');

/*All code below is using logic to determine if all required criteria are met before allowing to proceed, handling error messages*/

//Giving appropriate feedback upon clicking continue

$('#cyberTransButton').on('click', function() {
    if (keySetting1 == true) {
        $('#tagCue1Text').show();
        $('#tagCue1').transition('bounce');
    } else {
        $('#tagCue1Text').hide();
    }
    if (keySetting2 == true) {
        $('#tagCue2Text').show();
        $('#tagCue2').transition('bounce');
    } else {
        $('#tagCue2Text').hide();
    }
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
});

//Get the value of the toggle when it changes, make messaging disappear if corrrected

$(".ui.toggle.checkbox[name='allowTagToggle']").change(function() {
    keySetting1 = $("input[name='allowTagInput']").is(":checked");

    //If the yellow warning is already open, make it disappear when setting is corrected
    if (keySetting1 == false) {
        $('#tagCue1Text').hide();
    }

    if (closedHints == hintsList.length) {
        if ((keySetting1 == false) && (keySetting2 == false)) {
            $(".free4").addClass("green");
        } else {
            $(".free4").removeClass("green");
        }
    }
});

$(".ui.toggle.checkbox[name='autoTagToggle']").change(function() {
    keySetting2 = $("input[name='autoTagInput']").is(":checked");

    //If the yellow warning is already open, make it disappear when setting is corrected
    if (keySetting2 == false) {
        $('#tagCue2Text').hide();
    }

    if (closedHints == hintsList.length) {
        if ((keySetting1 == false) && (keySetting2 == false)) {
            $(".free4").addClass("green");
        } else {
            $(".free4").removeClass("green");
        }
    }
});