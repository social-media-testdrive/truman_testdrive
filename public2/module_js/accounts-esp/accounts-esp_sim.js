let stepsList = [{
        element: '#generalStep',
        intro: `¡Dale clic a "Siguiente" para comenzar!`,
        position: 'right',
        scrollTo: 'tooltip',
        // audioFile: ['']
    },
    {
        element: '#generalStep',
        intro: `Let’s practice creating an account on social media.`,
        position: "right",
        scrollTo: 'tooltip',
        // audioFile: ['CUSML.8.4.01.mp3']
    },
    {
        element: '#generalStep',
        intro: `Dale click a "Listo" y busca los puntos azules &nbsp;<a role='button' tabindex='0'
                class='introjs-hint'><div class='introjs-hint-dot'></div><div
                class='introjs-hint-pulse'></div></a> &nbsp; &nbsp; &nbsp; para aprender más...`,
        position: "right",
        scrollTo: 'tooltip',
        // audioFile: ['CUSML.8.4.02.mp3']
    }
];

let hintsList = [{
        hint: `Think about whether you want to include part of your name or a
    nickname. You may or may not want people to know exactly who you are based
    on your username.`,
        element: '#hint1',
        hintPosition: 'middle-middle',
        // audioFile: ['CUSML.8.4.03.mp3']
    },
    {
        hint: `Make sure you have a strong password that you can easily remember,
    but that is difficult for others to guess!`,
        element: '#hint2',
        hintPosition: 'middle-middle',
        // audioFile: ['CUSML.8.4.04.mp3']
    },
    {
        hint: `You can make your password stronger by including different types of
    characters, such as capital letters, numbers, and symbols. Making your
    password longer can be good too!`,
        element: '#strengthLabel',
        hintPosition: 'middle-right',
        // audioFile: ['CUSML.8.4.05.mp3']
    }
];

let result;
let suggestionStringHTML;

function displayFeedback(result) {
    if (result.feedback.warning !== "") {
        suggestionStringHTML = "<li>" + result.feedback.warning + "</li>";
    } else {
        suggestionStringHTML = "";
    }
    result.feedback.suggestions.forEach(element => {
        suggestionStringHTML = suggestionStringHTML.concat("<li>" + element + "</li>");
    });
    if ((suggestionStringHTML === "")) {
        $('#feedbackMessage').hide();
    } else {
        $('#feedbackSuggestion').html(suggestionStringHTML);
        $('#feedbackMessage').show();
    }
}

function hideFieldMessage(messageID) {
    $(messageID).hide();
    if ((closedHints === numberOfHints) &&
        ($('input[name="username"]').val() !== "") &&
        ($('input[name="password"]').val() !== "")) {
        $('#cyberTransButton').addClass('green');
    } else {
        $('#cyberTransButton').removeClass('green');
    }
}

function eventsAfterHints() {

    $('input[name="username"]').removeAttr('readonly');
    $('input[name="password"]').removeAttr('readonly');

    $('input[name="username"]').on('input', function() {
        hideFieldMessage('#usernameWarning');
    });

    $('input[name="password"]').on('input', function() {
        result = zxcvbn($(this).val());
        switch (result.score) {
            case 0:
                if (result.password === "") {
                    $('#passwordStrength').progress('reset');
                    $("#strengthLabel").text("Password Strength");
                    $('#cyberTransButton').removeClass('green');
                    $('#feedbackWarning').text("");
                    $('#feedbackSuggestion').html("");
                    $('#feedbackMessage').hide();
                } else {
                    $('#passwordStrength').progress({ value: 1 });
                    $("#strengthLabel").text("Password Strength: Very Weak");
                    hideFieldMessage('#passwordWarning');
                    displayFeedback(result);
                }
                break;
            case 1:
                $('#passwordStrength').progress({ value: 2 });
                $("#strengthLabel").text("Password Strength: Weak");
                hideFieldMessage('#passwordWarning');
                displayFeedback(result);
                break;
            case 2:
                $('#passwordStrength').progress({ value: 3 });
                $("#strengthLabel").text("Password Strength: Moderate");
                hideFieldMessage('#passwordWarning');
                hideFieldMessage('#confirmContinueCheck');
                displayFeedback(result);
                break;
            case 3:
                $('#passwordStrength').progress({ value: 4 });
                $("#strengthLabel").text("Password Strength: Strong");
                hideFieldMessage('#passwordWarning');
                hideFieldMessage('#confirmContinueCheck');
                displayFeedback(result);
                break;
            case 4:
                $('#passwordStrength').progress({ value: 5 });
                $("#strengthLabel").text("Password Strength: Very Strong");
                hideFieldMessage('#passwordWarning');
                hideFieldMessage('#confirmContinueCheck');
                displayFeedback(result);
                break;
            default:
                $('#passwordStrength').progress('reset');
                $("#strengthLabel").text("Password Strength");
                hideFieldMessage('#passwordWarning');
                hideFieldMessage('#confirmContinueCheck');
                displayFeedback(result);
                break;
        }
    });
}

function customErrorCheck() {
    if (closedHints != numberOfHints) {
        //show the message normally the first time
        if ($('#clickAllDotsWarning').is(":hidden")) {
            $('#clickAllDotsWarning').transition('fade');
            $('#cyberTransButton').css("margin-bottom", "10em");
        } else {
            //otherwise, bounce the message to draw attention to it
            $('#clickAllDotsWarning').transition('bounce');
        }
    }
    if ($('input[name="password"]').val() === "") {
        $('#passwordWarning').show();
    }
    if ($('input[name="username"]').val() === "") {
        $('#usernameWarning').show();
    }
    // Scroll to the first blue dot that is still visible
    if ($('.introjs-hint:visible')[0]) { //Check if undefined. Undefined when there are no more visible blue dots.
        $('.introjs-hint:visible')[0].scrollIntoView({
            behavior: "smooth", // or "auto" or "instant"
            block: "center", // defines vertical alignment
            inline: "nearest" // defines horizontal alignment
        });
    };
}

function customOnHintCloseFunction() {
    closedHints++;
    clickedHints = 0;
    if ($('#removeHidden').is(":visible")) {
        $('#removeHidden').transition('fade');
        if ($('#clickAllDotsWarning').is(":hidden")) {
            $('#cyberTransButton').css("margin-bottom", "4em");
        }
    }
    if (closedHints == numberOfHints) {
        if ($('#clickAllDotsWarning').is(':visible')) {
            $('#clickAllDotsWarning').transition('fade');
            $('#cyberTransButton').css("margin-bottom", "4em");
        }
        if (($('input[name="password"]').val() !== "") && ($('input[name="username"]').val() !== "")) {
            $("#cyberTransButton").addClass("green");
        } else {
            $('#cyberTransButton').removeClass('green');
        }
    }
}

function customOnClickGreenContinue() {
    const enableDataCollection = $('meta[name="isDataCollectionEnabled"]').attr('content') === "true";
    if (enableDataCollection) {
        actionArray = [];
        passwordDictionary = ["Very Weak", "Weak", "Moderate", "Strong", "Very Strong"];
        $('input[type=text]').each(function() {
            let cat = {};
            cat.inputField = $(this).attr('name');
            cat.inputText = $(this).val();
            cat.subdirectory1 = 'sim';
            cat.subdirectory2 = 'accounts';
            if (cat.inputField === 'password') {
                cat.passwordStrength = passwordDictionary[result.score];
            }
            cat.absoluteTimestamp = Date.now();

            const jqxhr = $.post("/accountsAction", {
                action: cat,
                actionType: 'accounts',
                _csrf: $('meta[name="csrf-token"]').attr('content')
            });
            actionArray.push(jqxhr);
        });

        return Promise.all(actionArray);
    }
}
