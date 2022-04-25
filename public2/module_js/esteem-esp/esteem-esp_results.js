function onPrint(){
  if($('.results_print').hasClass('green')){
    $(".insertPrint").empty();
    $(".insertPrint").css('display','block');

    $(".selectPostsQuestion1").clone().appendTo(".insertPrint");
    $(".insertPrint").append('<div class="breakHere"</div>');

    $(".insertPrint").append(
      `<br>
      <h4>
      ¿Por qué estas publicaciones pueden hacer que Jorge tenga una sensación de bandera roja?
      </h4>`
    );
    var responseOne = document.getElementById("literacy_responseOne").value;
    $(".insertPrint").append(responseOne);

    $(".insertPrint").append(
      `<br>
      <h4>
      ¿Recuerdas haber visto publicaciones que podrían haber hecho que Jorge se sintiera bien? ¿Qué tipo de publicaciones eran?
      </h4>`
    );
    var responseTwo = document.getElementById("literacy_responseTwo").value;
    $(".insertPrint").append(responseTwo);

    $(".insertPrint").append(
      `<br>
      <h4>
      ¿Qué podría hacer Jorge para sentirse mejor después de experimentar una sensación de bandera roja en las redes sociales?
      </h4>`
    );
    var responseThree = document.getElementById("literacy_responseThree").value;
    $(".insertPrint").append(responseThree);

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

// setTimeout(function(){
//   $('.ui.label').transition('bounce');
// }, 1000);
