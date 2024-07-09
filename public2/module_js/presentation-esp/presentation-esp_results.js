function onPrint() {
    if ($('.results_print').hasClass('green')) {
        $(".insertPrint").empty();
        $(".insertPrint").css('display', 'block');

        $(".selectPostsQuestion1").clone().appendTo(".insertPrint");


        $(".insertPrint").append("<br><h4>How were the posts in Elena's finsta different from the ones in her main account?</h4>");
        $(".checkOne").clone().removeClass('reflectionPromptSegment').appendTo(".insertPrint");

        // At the moment of cloning and appending a radio element to ".insertPrint",
        // the new element has the same name and id of the original one. 
        // This causes the original radio input to be unchecked. 

        // A way to avoid this is to save the original radio input
        // and resetting it after the cloning and appending is done. 

        // Find and save the radio value ('yes' or 'no') to 'radioOne' variable
        let radioOne = $('.radioOne')
            .closest('.ui.segment')
            .find('.radio.checkbox input:checked').val();

        $(".insertPrint").append("<h4>Did you create a post on the TestDrive timeline?</h4>");
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

        $(".insertPrint").css('display', 'none');

        // Reset radio selection to the original radio input
        $('.radioOne')
            .closest('.ui.segment')
            .find('.radio.checkbox input[value=' + radioOne + ']').prop("checked", true);
    } else {
        if ($('.voiceover_reflection1').next('.reflectionPromptSegment').is(':hidden')) {
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