
var literacy_counter = 0;
clickCount = 0;

//Get the status of the key setting
var keySetting1 = $("input[name='toggleValue']").is(':checked');

//Using logic to determine if all required criteria are met before allowing to proceed

$(".ui.toggle.checkbox[name='togglePrivateAccount']").change(function() {
  keySetting1 = $("input[name='toggleValue']").is(":checked");
  if(keySetting1 == true){
    $('#privateAccountCueText').hide();
  }
  if(literacy_counter == 3) {
    if((keySetting1 == true)){
       $( ".free3" ).addClass("green");
    }
    else{
      $( ".free3" ).removeClass("green");
    }
  }
});

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
            $('#free3Button').css("margin-bottom", "10em");
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
         $('#free3Button').css("margin-bottom", "4em");
       }
     }
     if(literacy_counter == 3) {
       if($('#clickAllDotsWarning').is(':visible')){
         $('#clickAllDotsWarning').transition('fade');
         $('#free3Button').css("margin-bottom", "4em");
       }
       if(keySetting1 == true){
          $( ".free3" ).addClass("green");
       }
     }
    });
  };

  //Function for adding visual cue to the appropriate setting

  function jiggleCue() {
    $('#privateAccountCue').transition('shake');
  }

  //Adding messaging for the private account setting, scrolling to the setting

  $('#free3Button').on('click', function () {
    if(literacy_counter != 3){
      //show the message normally the first time
      if($('#clickAllDotsWarning').is(":hidden")){
        $('#clickAllDotsWarning').transition('fade');
        $('#free3Button').css("margin-bottom", "10em");
      }else{
        //otherwise, bounce the message to draw attention to it
        $('#clickAllDotsWarning').transition('bounce');
      }
    }
    if(keySetting1 == false){
      $('#privateAccountCueText').show();

      //snippet taken from StackOverflow
      $([document.documentElement, document.body]).animate({
          scrollTop: $("#topOfPage").offset().top
      }, 1000);

      setTimeout(function () {
        $('#privateAccountCue').transition('bounce');
      }, 1000);
    } else {
      $('#privateAccountCueText').hide();
    }
 });

$(window).on("load", function() {startIntro();});

//Make the dropdown work
$('.ui.dropdown')
  .dropdown('set selected', '0');

$('#locationDropdown')
  .dropdown('set selected', '2');
