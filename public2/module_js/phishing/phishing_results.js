function onPrint(){
  if($('.results_print').hasClass('green')){
    $(".insertPrint").empty();
    $(".insertPrint").css('display','block');

    $(".selectPostsQuestion1").clone().appendTo(".insertPrint");
    $(".insertPrint").append('<div class="breakHere"</div>');

    $(".checkOne").clone().removeClass('reflectionPromptSegment').appendTo(".insertPrint");
    $(".insertPrint").append('<div class="breakHere"</div>');
    $(".checkTwo").clone().removeClass('reflectionPromptSegment').appendTo(".insertPrint");
    $(".insertPrint").append('<div class="breakHere"</div>');
    $(".checkThree").clone().removeClass('reflectionPromptSegment').appendTo(".insertPrint");
    $(".insertPrint").append('<div class="breakHere"</div><br>');

    $(".insertPrint").append("<h4>What are some clues you can use to identify phishing scams?</h4>");
    var responseOne = document.getElementById("digfoot_responseOne").value;
    $(".insertPrint").append(responseOne);

    $(".insertPrint").append("<h4>Why is it important to protect yourself against phishing scams?</h4>");
    var responseTwo = document.getElementById("digfoot_responseTwo").value;
    $(".insertPrint").append(responseTwo);

    window.print();

    $(".insertPrint").css('display','none');
  } else {
    if($('.voiceover_reflection1').next('.reflectionPromptSegment').is(':hidden')){
      showWarning('.startPromptsWarning');
    } else {
      showWarning('.openAllPromptsWarning');
    }
  }
};

// function animateQuestions(){
//   $('.ui.label').transition('bounce');
// };
//
// function animateCards(){
//   $('#card1,#card2,#card3').transition({
//   animation : 'jiggle',
//   duration  : 800,
//   interval  : 200
//   });
// };
//
// setTimeout(function(){animateQuestions()}, 1000);
// setTimeout(function(){animateCards()}, 2000);
