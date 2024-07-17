function onPrint() {
  if ($(".results_print").hasClass("green")) {
    $(".insertPrint").empty();
    $(".insertPrint").css("display", "block");

    $(".selectPostsQuestion1").clone().appendTo(".insertPrint");

    $(".insertPrint").append(
      "<h4>Cuéntanos qué hiciste para ser un aliado</h4>"
    );
    $(".checkOne")
      .clone()
      .removeClass("reflectionPromptSegment")
      .appendTo(".insertPrint");

    $(".insertPrint").append("<br><h4>¿Por qué actuaste de esa forma?</h4>");
    var responseOne = document.getElementById("cyber_responseOne").value;
    $(".insertPrint").append(responseOne);

    $(".insertPrint").append(
      "<h4>¿Por qué es importante para las personas actuar contra el ciberbullying?</h4>"
    );
    var responseOne = document.getElementById("cyber_responseTwo").value;
    $(".insertPrint").append(responseOne);

    $(".insertPrint").append(
      "<h4>¿Qué harías en el futuro para ser un aliado si ves alguna situación de ciberbullying?</h4>"
    );
    var responseThree = document.getElementById("cyber_responseThree").value;
    $(".insertPrint").append(responseThree);

    window.print();

    $(".insertPrint").css("display", "none");
  } else {
    if (
      $(".voiceover_reflection1").next(".reflectionPromptSegment").is(":hidden")
    ) {
      showWarning(".startPromptsWarning");
    } else {
      showWarning(".openAllPromptsWarning");
    }
  }
}

// setTimeout(function(){
//   $('.ui.label').transition('bounce');
// }, 1000);
//
//
// setTimeout(function(){
//   $('#card1,#card2,#card3').transition({
//   animation : 'jiggle',
//   duration  : 800,
//   interval  : 200
//   });
// }, 2000);
