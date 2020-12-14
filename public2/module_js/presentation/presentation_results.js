function onPrint(){
  if($('.results_print').hasClass('green')){
    $(".insertPrint").empty();
    $(".insertPrint").css('display','block');

    $(".selectPostsQuestion1").clone().appendTo(".insertPrint");
    $(".insertPrint").append('<div class="breakHere"</div>');

    $(".checkOne").clone().removeClass('reflectionPromptSegment').appendTo(".insertPrint");
    $(".radioOne").clone().removeClass('reflectionPromptSegment').appendTo(".insertPrint");

    $(".insertPrint").append("<h4>How did you think about the audience when you created your post?</h4>");
    var responseOne = document.getElementById("presentation_responseOne").value;
    $(".insertPrint").append(responseOne);

    $(".insertPrint").append("<h4>What are the benefits of having multiple social media accounts?</h4>");
    var responseTwo = document.getElementById("presentation_responseTwo").value;
    $(".insertPrint").append(responseTwo);

    $(".insertPrint").append("<h4>What are the drawbacks of having multiple social media accounts?</h4>");
    var responseThree = document.getElementById("presentation_responseThree").value;
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
