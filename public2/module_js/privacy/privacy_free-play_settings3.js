var literacy_counter = 0;
clickCount = 0;

//Variables for the two key settings
var keySetting1 = $("input[name='allowTagInput']").is(':checked');
var keySetting2 = $("input[name='autoTagInput']").is(':checked');

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
            $('#free4Button').css("margin-bottom", "10em");
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
         $('#free4Button').css("margin-bottom", "4em");
       }
     }
     //turn the button green if all three criteria are met
     if(literacy_counter == 3) {
       //remove the yellow warning about dots
       if($('#clickAllDotsWarning').is(':visible')){
         $('#clickAllDotsWarning').transition('fade');
         $('#free4Button').css("margin-bottom", "4em");
       }
       if((keySetting1 == false) && (keySetting2 == false)){
          $( ".free4" ).addClass("green");
       }
     }
    });
  };

$(window).on("load", function() {startIntro();});

//Make the dropdown work
$('.ui.dropdown')
  .dropdown('set selected', '0');

$('#locationDropdown')
  .dropdown('set selected', '2');

/*All code below is using logic to determine if all required criteria are met before allowing to proceed, handling error messages*/

//Giving appropriate feedback upon clicking continue

$('#free4Button').on('click', function () {
  if(keySetting1 == true){
    $('#tagCue1Text').show();
    $('#tagCue1').transition('bounce');
  } else {
    $('#tagCue1Text').hide();
  }
  if(keySetting2 == true){
    $('#tagCue2Text').show();
    $('#tagCue2').transition('bounce');
  } else {
    $('#tagCue2Text').hide();
  }
  if(literacy_counter != 3){
    //show the message normally the first time
    if($('#clickAllDotsWarning').is(":hidden")){
      $('#clickAllDotsWarning').transition('fade');
      $('#free4Button').css("margin-bottom", "10em");
    }else{
      //otherwise, bounce the message to draw attention to it
      $('#clickAllDotsWarning').transition('bounce');
    }
  }
});

//Get the value of the toggle when it changes, make messaging disappear if corrrected

$(".ui.toggle.checkbox[name='allowTagToggle']").change(function() {
  keySetting1 = $("input[name='allowTagInput']").is(":checked");

  //If the yellow warning is already open, make it disappear when setting is corrected
  if(keySetting1 == false){
    $('#tagCue1Text').hide();
  }

  if(literacy_counter == 3) {
    if((keySetting1 == false) && (keySetting2 == false)){
       $( ".free4" ).addClass("green");
    }
    else{
      $( ".free4" ).removeClass("green");
    }
  }
});

$(".ui.toggle.checkbox[name='autoTagToggle']").change(function() {
  keySetting2 = $("input[name='autoTagInput']").is(":checked");

  //If the yellow warning is already open, make it disappear when setting is corrected
  if(keySetting2 == false){
    $('#tagCue2Text').hide();
  }

  if(literacy_counter == 3) {
    if((keySetting1 == false) && (keySetting2 == false)){
       $( ".free4" ).addClass("green");
    }
    else{
      $( ".free4" ).removeClass("green");
    }
  }
});
