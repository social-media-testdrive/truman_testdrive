function onPrint(){
  if($('.results_print').hasClass('green')){
    $(".insertPrint").empty();
    $(".insertPrint").css('display','block');

    $(".selectPostsQuestion1").clone().appendTo(".insertPrint");
    $(".insertPrint").append('<div class="breakHere"</div>');
    
    $(".checkOne").clone().removeClass('reflectionPromptSegment').appendTo(".insertPrint");
    $(".checkTwo").clone().removeClass('reflectionPromptSegment').appendTo(".insertPrint");

    $(".insertPrint").append('<div class="breakHere"</div><br>');
    $(".insertPrint").append("<h4>What would you do in the future to protect your private information and other people’s private information on social media?</h4>");
    var responseOne = document.getElementById("safe_responseOne").value;
    $(".insertPrint").append(responseOne);

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
