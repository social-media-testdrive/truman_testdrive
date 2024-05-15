function onPrint(){
  if($('.results_print').hasClass('green')){
    $(".insertPrint").empty();
    $(".insertPrint").css('display','block');

    $(".insertPrint").append("<h4>¿Notaste algún cambio en el perfil de Lucía después de cambiar la configuración de privacidad?</h4>");
    var responseOne = document.getElementById("privacy_responseOne").value;
    $(".insertPrint").append(responseOne);

    $(".insertPrint").append("<h4>¿Por qué es importante saber qué información recopilan los sitios web sobre ti?</h4>");
    var responseTwo = document.getElementById("privacy_responseTwo").value;
    $(".insertPrint").append(responseTwo);

    $(".insertPrint").append("<h4>¿Cuáles son las tres cosas que debes preguntarte al leer una política de privacidad?</h4>");
    var responseThree = document.getElementById("privacy_responseThree").value;
    $(".insertPrint").append(responseThree);

    $(".insertPrint").append("<h4>¿Qué puedes hacer en el futuro para proteger tu privacidad en las redes sociales?</h4>");
    var responseFour = document.getElementById("privacy_responseFour").value;
    $(".insertPrint").append(responseFour);

    window.print();

    $(".insertPrint").css('display','none');
  } else {
    if($('.voiceover_reflection1').next('.reflectionPromptSegment').is(':hidden')){
      showWarning('.startPromptsWarning');
    } else {
      showWarning('.openAllPromptsWarning');
    }
  }
}
