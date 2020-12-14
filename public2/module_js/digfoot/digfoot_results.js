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

    $(".insertPrint").append("<h4>What can you do in the future to make sure you have a positive digital footprint on social media?</h4>");
    var responseOne = document.getElementById("digfoot_responseOne").value;
    $(".insertPrint").append(responseOne);

    $(".insertPrint").append("<h4>What can you do in the future to be mindful of other people's digital footprints on social media?</h4>");
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
