var hintsList = [{
        hint: `Lily would like to hide her location information from the public on
    the internet. Which privacy settings would she have to change?`,
        element: '#hint1',
        hintPosition: 'top-middle',
        audioFile: ['CUSML.7.8.08.mp3']
    },
    {
        hint: `Ella puede <b>desactivar el uso compartido de la ubicación</b> y 
        restringir quién puede ver su ubicación únicamente a <b>"Amigos"</b>. ¡Intentemos hacer eso!`,
        element: '#hint2',
        hintPosition: 'top-middle',
        audioFile: ['CUSML.7.8.09.mp3']
    },
    {
        hint: `¿Desactivaste la opción de compartir ubicación y cambiaste quién puede ver la ubicación de Lucía? Haz clic en "<i>¡Continuar!</i>" para ver cómo ha cambiado su perfil.`,
        element: '#hint3',
        hintPosition: 'middle-right',
        audioFile: ['CUSML.7.8.10.mp3']
    }
];

//Variables for the two key settings
let keySetting1 = $("input[name='locationSetting']").is(':checked');
let keySetting2 = "";

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
        if ((keySetting1 == false) && (keySetting2 === "Friends")) {
            $(".settings1").addClass("green");
        }
    }
};

//Make the dropdown work
$('.ui.dropdown')
    .dropdown('set selected', '0');

/*All code below is using logic to determine if all required criteria are met before allowing to proceed, handling error messages*/

//Functions for adding visual cues to the appropriate settings

function jiggleCueOne() {
    $('#locationCue1').transition('shake');
}

function jiggleCueTwo() {
    $('#locationCue2').transition('shake');
}

// Function for adding visual text to location sharing setting
function showLocationMessage() {
    if (keySetting1 == false && keySetting2 === "Friends") {
        $('#locationMessage').show();
    } else {
        $('#locationMessage').hide();
    }
}

$('#cyberTransButton').on('click', function() {
    if (keySetting1 == true) {
        $('#locationCue1Text').show();
        $('#locationCue1').transition('bounce');
    } else {
        $('#locationCue1Text').hide();
    }
    if (keySetting2 !== "Friends") {
        $('#locationCue2Text').show();
        $('#locationCue2').transition('bounce');
    } else {
        $('#locationCue2Text').hide();
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
    showLocationMessage();
});


//get the value of the dropdown when it changes
$(".ui.selection.dropdown[name='shareLocationWith']").change(function() {
    keySetting2 = $(".ui.selection.dropdown[name='shareLocationWith']").dropdown('get text');

    //If the yellow warning is already open, make it disappear when setting is corrected
    //If
    if (keySetting2 === "Friends") {
        $('#locationCue2Text').hide();
    }

    //All blue dots are clicked and the settings are correct
    if (closedHints == hintsList.length) {
        if ((keySetting1 == false) && (keySetting2 === "Friends")) {
            $(".settings1").addClass("green");
        } else {
            $(".settings1").removeClass("green");
        }
    }
    showLocationMessage();
});

//Get the value of the toggle when it changes
$(".ui.toggle.checkbox[name='locationToggle']").change(function() {
    keySetting1 = $("input[name='locationSetting']").is(":checked");

    //If the yellow warning is already open, make it disappear when setting is corrected
    if (keySetting1 == false) {
        $('#locationCue1Text').hide();
    }

    if (closedHints == hintsList.length) {
        if ((keySetting1 == false) && (keySetting2 === "Friends")) {
            $(".settings1").addClass("green");
        } else {
            //Indicate settings to change with animation
            $(".settings1").removeClass("green");
        }
    }
    showLocationMessage();
});