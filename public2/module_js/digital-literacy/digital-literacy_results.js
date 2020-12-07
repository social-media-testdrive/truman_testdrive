function onPrint(){
  if($('.results_print').hasClass('green')){
    $(".insertPrint").empty();
    $(".insertPrint").css('display','block');

    $(".selectPostsQuestion1").clone().appendTo(".insertPrint");
    $(".insertPrint").append('<div class="breakHere"</div>');

    $(".selectPostsQuestion2").clone().appendTo(".insertPrint");
    $(".insertPrint").append('<div class="breakHere"</div>');

    $(".checkOne").clone().removeClass('reflectionPromptSegment').appendTo(".insertPrint");
    $(".insertPrint").append('<div class="breakHere"</div>');
    $(".checkTwo").clone().removeClass('reflectionPromptSegment').appendTo(".insertPrint");
    $(".insertPrint").append('<div class="breakHere"</div>');
    $(".checkThree").clone().removeClass('reflectionPromptSegment').appendTo(".insertPrint");
    $(".insertPrint").append('<br>');

    $(".insertPrint").append("<h5>Tell us what you would do next to check the credibility of the above articles.</h5>");
    $(".checkFour").clone().removeClass('reflectionPromptSegment').appendTo(".insertPrint");

    $(".insertPrint").append('<div class="breakHere"</div>');
    $(".insertPrint").append("<br><h4>What are the benefits and drawbacks of getting news on social media?</h4>");
    var responseOne = document.getElementById("literacy_responseOne").value;
    $(".insertPrint").append(responseOne);

    $(".insertPrint").append("<h4>Why is it important to evaluate the information you see on social media?</h4>");
    var responseTwo = document.getElementById("literacy_responseTwo").value;
    $(".insertPrint").append(responseTwo);

    $(".insertPrint").append("<h4>What would you do in the future on real social media sites to make sure that the information you see is credible?</h4>");
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
//
//
// setTimeout(function(){
//   $('#card1,#card2,#card3,#card4,#card5,#card6').transition({
//   animation : 'jiggle',
//   duration  : 800,
//   interval  : 200
//   });
// }, 2000);
