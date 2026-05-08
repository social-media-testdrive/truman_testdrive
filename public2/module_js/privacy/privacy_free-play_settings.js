var hintsList = [{
        hint: `Lily would like to hide her location information from the public on
    the internet. Which privacy settings would she have to change?`,
        element: '#hint1',
        hintPosition: 'top-middle',
        audioFile: ['CUSML.7.8.08.mp3']
    },
    {
        hint: `She can <b>turn off location sharing</b> and restrict who can see her
    location to <b>"Friends"</b> only. Let's try doing that!`,
        element: '#hint2',
        hintPosition: 'top-middle',
        audioFile: ['CUSML.7.8.09.mp3']
    },
    {
        hint: `Have you turned off location sharing and set “Share my location with” to Friends? Close all three blue-dot hints with “Got it”, then click “Let's Continue!”.`,
        element: '#hint3',
        hintPosition: 'middle-right',
        audioFile: ['CUSML.7.8.10.mp3']
    }
];

// Menu row "Friends" / "Amigos" — use data-value (display text varies, e.g. Everyone vs All).
const LOCATION_SHARE_FRIENDS_VALUE = '2';

function readLocationSharingToggleOn() {
    var $wrap = $('#locationCue1');
    if (!$wrap.length) {
        return false;
    }
    var $inp = $wrap.find('input[type=checkbox]').first();
    if ($wrap.hasClass('ui') && $wrap.hasClass('checkbox')) {
        try {
            var api = $wrap.checkbox('is checked');
            if (api === true) {
                return true;
            }
            if (api === false) {
                return false;
            }
        } catch (e) {
            /* fall through */
        }
    }
    if ($inp.length && $inp.prop('checked')) {
        return true;
    }
    return $wrap.hasClass('checked');
}

let keySetting1 = readLocationSharingToggleOn();
/** Hidden value for #locationCue2: '0'..'3' */
let keySetting2 = '';

function $locationCue2Module() {
    var $d = $('#locationCue2');
    if (!$d.length) {
        return $d;
    }
    if ($d.hasClass('ui') && $d.hasClass('dropdown')) {
        return $d;
    }
    return $d.closest('.ui.dropdown');
}

function normalizeDropdownValue(value) {
    if (value === undefined || value === null) {
        return '';
    }
    if (Array.isArray(value)) {
        value = value.length ? value[0] : '';
    }
    return String(value).trim();
}

function readLocationShareValue() {
    var $m = $locationCue2Module();
    if (!$m.length) {
        return '';
    }
    try {
        var v = normalizeDropdownValue($m.dropdown('get value'));
        if (v === '') {
            v = normalizeDropdownValue($m.find('input[type=hidden]').first().val());
        }
        return v;
    } catch (e) {
        try {
            return normalizeDropdownValue($m.find('input[type=hidden]').first().val());
        } catch (e2) {
            return '';
        }
    }
}

function refreshKeySettingsFromDom() {
    keySetting1 = readLocationSharingToggleOn();
    keySetting2 = readLocationShareValue();
}

function locationShareIsFriends() {
    if (keySetting2 === LOCATION_SHARE_FRIENDS_VALUE) {
        return true;
    }
    try {
        var t = ($locationCue2Module().dropdown('get text') || '').trim().toLowerCase();
        return t === 'friends' || /\bfriends\b/.test(t);
    } catch (e) {
        return false;
    }
}

function onAudienceChange(value) {
    keySetting2 = normalizeDropdownValue(value);
    if (keySetting2 === '') {
        keySetting2 = readLocationShareValue();
    }
    if (locationShareIsFriends()) {
        $('#locationCue2Text').hide();
    }
    updateContinueGreen();
}

function updateContinueGreen() {
    refreshKeySettingsFromDom();
    if (closedHints == hintsList.length) {
        if (keySetting1 === false && locationShareIsFriends()) {
            $('.settings1').addClass('green');
            $('#locationCue1Text').hide();
            $('#locationCue2Text').hide();
        } else {
            $('.settings1').removeClass('green');
        }
    }
}

function customOnHintCloseFunction() {
    closedHints++;
    clickedHints = 0;
    if ($('#removeHidden').is(':visible')) {
        $('#removeHidden').transition('fade');
        if ($('#clickAllDotsWarning').is(':hidden')) {
            $('#cyberTransButton').css('margin-bottom', '4em');
        }
    }
    if (closedHints == hintsList.length) {
        if ($('#clickAllDotsWarning').is(':visible')) {
            $('#clickAllDotsWarning').transition('fade');
            $('#cyberTransButton').css('margin-bottom', '4em');
        }
        updateContinueGreen();
    }
}

function onLocationSharingToggleUiRefresh() {
    refreshKeySettingsFromDom();
    if (keySetting1 === false) {
        $('#locationCue1Text').hide();
    }
    updateContinueGreen();
}

$(function () {
    $('#locationCue1').checkbox({
        onChange: onLocationSharingToggleUiRefresh,
        onChecked: onLocationSharingToggleUiRefresh,
        onUnchecked: onLocationSharingToggleUiRefresh,
    });
    $('#privateAccountCue').checkbox();

    $('.ui.selection.dropdown').not('#locationCue2').dropdown();
    $('#locationCue2').dropdown({
        onChange: function (value) {
            onAudienceChange(value);
        },
    });
    $('.blocklistDropdown').dropdown();

    $('.ui.selection.dropdown').not('#locationCue2').dropdown('set selected', '0');
    $('#locationCue2').dropdown('set selected', '0');

    $('#locationCue2').on('change', 'input[type=hidden]', function () {
        onAudienceChange($(this).val());
    });

    refreshKeySettingsFromDom();
    updateContinueGreen();
});

$(window).on('load', function () {
    refreshKeySettingsFromDom();
    updateContinueGreen();
});

function jiggleCueOne() {
    $('#locationCue1').transition('shake');
}

function jiggleCueTwo() {
    $('#locationCue2').transition('shake');
}

function showLocationMessage() {
    if (keySetting1 == false && locationShareIsFriends()) {
        $('#locationMessage').show();
    } else {
        $('#locationMessage').hide();
    }
}

$('#cyberTransButton').on('click', function () {
    refreshKeySettingsFromDom();
    if (keySetting1 == true) {
        $('#locationCue1Text').show();
        $('#locationCue1').transition('bounce');
    } else {
        $('#locationCue1Text').hide();
    }
    if (!locationShareIsFriends()) {
        $('#locationCue2Text').show();
        $('#locationCue2').transition('bounce');
    } else {
        $('#locationCue2Text').hide();
    }
    if (closedHints != hintsList.length) {
        if ($('#clickAllDotsWarning').is(':hidden')) {
            $('#clickAllDotsWarning').transition('fade');
            $('#cyberTransButton').css('margin-bottom', '10em');
        } else {
            $('#clickAllDotsWarning').transition('bounce');
        }
    }
    showLocationMessage();
});
