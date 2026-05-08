var hintsList = [
  {
    hint: `A Lucía le gustaría ocultar las publicaciones etiquetadas de su perfil. ¿Qué configuración de privacidad tendría que cambiar?`,
    element: '#hint1',
    audioFile: ['CUSML.7.8.13.mp3']
  },
  {
    hint: `Puede desactivar la configuración de etiquetado y ocultar las publicaciones etiquetadas de su feed. ¡Intentemos hacer eso!`,
    element: '#hint2',
    hintPosition: 'top-middle',
    audioFile: ['CUSML.7.8.14.mp3']
  },
  {
    hint: `¿Has desactivado la configuración de etiquetado y has ocultado las publicaciones etiquetadas del feed de Lucía? Haz clic en "¡Continuar!" para ver cómo ha cambiado su perfil.`,
    element: '#hint3',
    hintPosition: 'middle-right',
    audioFile: ['CUSML.7.8.15.mp3']
  }

];

//Variables for the two key settings
let keySetting1 = $("input[name='allowTagInput']").is(':checked');
let keySetting2 = $("input[name='autoTagInput']").is(':checked');

function syncTagSettingsFromDom() {
  keySetting1 = $("input[name='allowTagInput']").is(':checked');
  keySetting2 = $("input[name='autoTagInput']").is(':checked');
}

function onAllowTagChange() {
  syncTagSettingsFromDom();
  if (keySetting1 === false) {
    $('#tagCue1Text').hide();
  }
  if (closedHints === hintsList.length) {
    if (keySetting1 === false && keySetting2 === false) {
      $('.free4').addClass('green');
    } else {
      $('.free4').removeClass('green');
    }
  }
}

function onAutoTagChange() {
  syncTagSettingsFromDom();
  if (keySetting2 === false) {
    $('#tagCue2Text').hide();
  }
  if (closedHints === hintsList.length) {
    if (keySetting1 === false && keySetting2 === false) {
      $('.free4').addClass('green');
    } else {
      $('.free4').removeClass('green');
    }
  }
}

function customOnHintCloseFunction() {
 closedHints++;
 clickedHints = 0;
 if($('#removeHidden').is(":visible")){
   $('#removeHidden').transition('fade');
   if($('#clickAllDotsWarning').is(":hidden")){
     $('#cyberTransButton').css("margin-bottom", "4em");
   }
 }
 syncTagSettingsFromDom();
 //turn the button green if all three criteria are met
 if(closedHints == hintsList.length) {
   //remove the yellow warning about dots
   if($('#clickAllDotsWarning').is(':visible')){
     $('#clickAllDotsWarning').transition('fade');
     $('#cyberTransButton').css("margin-bottom", "4em");
   }
   if((keySetting1 == false) && (keySetting2 == false)){
      $( "#cyberTransButton" ).addClass("green");
   }
 }
}


$(function () {
  $('#tagCue1').checkbox({ onChange: onAllowTagChange });
  $('#tagCue2').checkbox({ onChange: onAutoTagChange });
  $('.ui.toggle.checkbox:not(.read-only)').not('#tagCue1').not('#tagCue2').checkbox();
  $('.ui.toggle.read-only.checkbox').checkbox();

  $('.ui.selection.dropdown').not('#locationDropdown').dropdown();
  $('.ui.selection.dropdown').not('#locationDropdown').dropdown('set selected', '0');
  $('#locationDropdown').dropdown();
  $('#locationDropdown').dropdown('set selected', '2');
  $('.blocklistDropdown').dropdown();
});

/*All code below is using logic to determine if all required criteria are met before allowing to proceed, handling error messages*/

//Giving appropriate feedback upon clicking continue

$('#cyberTransButton').on('click', function () {
  syncTagSettingsFromDom();
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

