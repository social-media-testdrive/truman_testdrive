const hintsList = [
  {
    hint: `Lily would like to hide her location information from the public on
    the internet. Which privacy settings would she have to change?`,
    element: '#hint1',
    hintPosition: 'top-middle'
  },
  {
    hint: `She can <b>turn off location sharing</b> and restrict who can see her
    location to <b>“Friends” only</b>. Let’s try doing this!`,
    element: '#hint2',
    hintPosition: 'top-middle'
  },
  {
    hint: `Have you turned off location sharing and changed who can see Lily’s
    location? Click “<i>Let’s Continue!</i>” to see how her profile has
    changed.`,
    element: '#hint3',
    hintPosition: 'middle-right'
  }
];

//Variables for the two key settings
let keySetting1 = $("input[name='locationSetting']").is(':checked');
let keySetting2 = "";

function customOnHintCloseFunction() {
  closedHints++;
  clickedHints = 0;
  if($('#removeHidden').is(":visible")){
    $('#removeHidden').transition('fade');
    if($('#clickAllDotsWarning').is(":hidden")){
      $('#cyberTransButton').css("margin-bottom", "4em");
    }
  }
  //turn the button green if all three criteria are met
  if(closedHints == hintsList.length) {
    //remove the yellow warning about dots
    if($('#clickAllDotsWarning').is(':visible')){
      $('#clickAllDotsWarning').transition('fade');
      $('#cyberTransButton').css("margin-bottom", "4em");
    }
    if((keySetting1 == false) && (keySetting2 === "Friends")){
      $( ".settings1" ).addClass("green");
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

$('#cyberTransButton').on('click', function () {
  if(keySetting1 == true){
    $('#locationCue1Text').show();
    $('#locationCue1').transition('bounce');
  } else {
    $('#locationCue1Text').hide();
  }
  if(keySetting2 !== "Friends"){
    $('#locationCue2Text').show();
    $('#locationCue2').transition('bounce');
  } else {
    $('#locationCue2Text').hide();
  }
  if(closedHints != hintsList.length){
    //show the message normally the first time
    if($('#clickAllDotsWarning').is(":hidden")){
      $('#clickAllDotsWarning').transition('fade');
      $('#cyberTransButton').css("margin-bottom", "10em");
    }else{
      //otherwise, bounce the message to draw attention to it
      $('#clickAllDotsWarning').transition('bounce');
    }
  }
});


//get the value of the dropdown when it changes
$(".ui.selection.dropdown[name='shareLocationWith']").change(function() {
  keySetting2 = $(".ui.selection.dropdown[name='shareLocationWith']").dropdown('get text');

  //If the yellow warning is already open, make it disappear when setting is corrected
  if(keySetting2 === "Friends"){
    $('#locationCue2Text').hide();
  }

  //All blue dots are clicked and the settings are correct
  if(closedHints == hintsList.length) {
    if((keySetting1 == false) && (keySetting2 === "Friends")){
       $( ".settings1" ).addClass("green");
    }
    else{
      $( ".settings1" ).removeClass("green");
    }
  }
});

//Get the value of the toggle when it changes
$(".ui.toggle.checkbox[name='locationToggle']").change(function() {
  keySetting1 = $("input[name='locationSetting']").is(":checked");

  //If the yellow warning is already open, make it disappear when setting is corrected
  if(keySetting1 == false){
    $('#locationCue1Text').hide();
  }

  if(closedHints == hintsList.length) {
    if((keySetting1 == false) && (keySetting2 === "Friends")){
       $( ".settings1" ).addClass("green");
    }
    else{
      //Indicate settings to change with animation
      $( ".settings1" ).removeClass("green");
    }
  }
});
