function onPrint(){
  if($('.results_print').hasClass('green')){
    $(".insertPrint").empty();
    $(".insertPrint").css('display','block');

    $(".selectPostsQuestion1").clone().appendTo(".insertPrint");
    $(".insertPrint").append('<div class="breakHere"</div>');

    $(".insertPrint").append(
      `<br>
      <h4>
        Why might these posts cause Jeremy to have a red flag feeling?
      </h4>`
    );
    var responseOne = document.getElementById("literacy_responseOne").value;
    $(".insertPrint").append(responseOne);

    $(".insertPrint").append(
      `<br>
      <h4>
      Do you remember seeing posts that might have caused Jeremy to feel good?
      What kinds of posts were they?
      </h4>`
    );
    var responseTwo = document.getElementById("literacy_responseTwo").value;
    $(".insertPrint").append(responseTwo);

    $(".insertPrint").append(
      `<br>
      <h4>
        What could Jeremy do to feel better after experiencing a red flag feeling
        on social media?
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
