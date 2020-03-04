var literacy_counter = 0;
clickCount = 0;

//Variables for the two key settings
var keySetting1 = $("input[name='locationSetting']").is(':checked');
var keySetting2 = "";

//Initializing and managing the hints
function startIntro(){
    var hints;
    hints = introJs().addHints();

    hints.onhintclick(function() {
        clickCount++;
        if(clickCount >= 3){
          //show the guidance message, user probably doesn't know to click "got it"
          if($('#removeHidden').is(":hidden")){
            $('#removeHidden').transition('fade');
            $('#settings1Button').css("margin-bottom", "10em");
          } else {
            $('#removeHidden').transition('bounce');
          }
        }
    });

    hints.onhintclose(function(e) {
     literacy_counter++;
     clickCount = 0;
     if($('#removeHidden').is(":visible")){
       $('#removeHidden').transition('fade');
       if($('#clickAllDotsWarning').is(":hidden")){
         $('#cyberTransButton').css("margin-bottom", "4em");
       }
     }
     //turn the button green if all three criteria are met
     if(literacy_counter == 3) {
       //remove the yellow warning about dots
       if($('#clickAllDotsWarning').is(':visible')){
         $('#clickAllDotsWarning').transition('fade');
         $('#cyberTransButton').css("margin-bottom", "4em");
       }
       if((keySetting1 == false) && (keySetting2 === "Friends")){
          $( ".settings1" ).addClass("green");
       }
     }
    });
  };

$(window).on("load", function() {startIntro();});

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

$('#settings1Button').on('click', function () {
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
  if(literacy_counter != 3){
    //show the message normally the first time
    if($('#clickAllDotsWarning').is(":hidden")){
      $('#clickAllDotsWarning').transition('fade');
      $('#settings1Button').css("margin-bottom", "10em");
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
  if(literacy_counter == 3) {
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

  if(literacy_counter == 3) {
    if((keySetting1 == false) && (keySetting2 === "Friends")){
       $( ".settings1" ).addClass("green");
    }
    else{
      //Indicate settings to change with animation
      $( ".settings1" ).removeClass("green");
    }
  }
});
