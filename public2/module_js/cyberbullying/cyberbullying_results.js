function onPrint(){
  if($('.results_print').hasClass('green')){
    $(".insertPrint").empty();
    $(".insertPrint").css('display','block');
    $(".insertPrint").append("<h4>Tell us what you did to be an upstander.</h4>");
    $(".checkOne").clone().removeClass('reflectionPromptSegment').appendTo(".insertPrint");

    $(".insertPrint").append("<br><h4>Why did you act this way?</h4>");
    var responseOne = document.getElementById("cyber_responseOne").value;
    $(".insertPrint").append(responseOne);

    $(".insertPrint").append("<h4>Why is it important for people to act against cyberbullying?</h4>");
    var responseOne = document.getElementById("cyber_responseTwo").value;
    $(".insertPrint").append(responseOne);

    $(".insertPrint").append("<h4>What will you do in the future to be an upstander if you see cyberbullying?</h4>");
    var responseThree = document.getElementById("cyber_responseThree").value;
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
//
//
// setTimeout(function(){
//   $('#card1,#card2,#card3').transition({
//   animation : 'jiggle',
//   duration  : 800,
//   interval  : 200
//   });
// }, 2000);
