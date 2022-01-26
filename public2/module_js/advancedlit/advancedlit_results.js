function onPrint(){
  if($('.results_print').hasClass('green')){
    $(".insertPrint").empty();
    $(".insertPrint").css('display','block');


    $(".selectPostsQuestion1").clone().appendTo(".insertPrint");

    $(".insertPrint").append("<br><h4>What did you do when you saw an advertisement or a sponsored post?</h4>");
    $(".checkOne").clone().removeClass('reflectionPromptSegment').appendTo(".insertPrint");

    $(".insertPrint").append("<br><h4>Did you read any of the articles? Did you notice any signs that the article may be inaccurate?</h4>");
    var responseOne = document.getElementById("literacy_responseOne").value;
    $(".insertPrint").append(responseOne);

    $(".insertPrint").append("<br><h4>Why is it important to get the full story before reacting to or sharing breaking news?</h4>");
    var responseTwo = document.getElementById("literacy_responseTwo").value;
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
