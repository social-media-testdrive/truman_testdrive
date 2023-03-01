function onPrint() {
    if ($('.results_print').hasClass('green')) {
        $(".insertPrint").empty();
        $(".insertPrint").css('display', 'block');


        $(".selectPostsQuestion1").clone().appendTo(".insertPrint");
        $(".insertPrint").append('<div class="breakHere"</div>');


        $(".insertPrint").append("<br><h4>How would the following posts have a negative impact on digital footprints?</h4><br>");
        $(".checkOne").clone().removeClass('reflectionPromptSegment').appendTo(".insertPrint");
        $(".insertPrint").append('<div class="breakHere"</div><br>');
        $(".checkTwo").clone().removeClass('reflectionPromptSegment').appendTo(".insertPrint");
        $(".insertPrint").append('<div class="breakHere"</div>');
        $(".checkThree").clone().removeClass('reflectionPromptSegment').appendTo(".insertPrint");

        $(".insertPrint").append("<br><h4>¿Qué puedes hacer en el futuro para asegurarte de tener una huella digital positiva en las redes sociales?</h4>");
        var responseOne = document.getElementById("digfoot_responseOne").value;
        $(".insertPrint").append(responseOne);

        $(".insertPrint").append("<h4>¿Qué puedes hacer en el futuro para tener en cuenta las huellas digitales de los demás en las redes sociales?</h4>");
        var responseTwo = document.getElementById("digfoot_responseTwo").value;
        $(".insertPrint").append(responseTwo);

        window.print();

        $(".insertPrint").css('display', 'none');
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


// setTimeout(function(){
//   $('#card1,#card2,#card3').transition({
//   animation : 'jiggle',
//   duration  : 800,
//   interval  : 200
//   });
// }, 2000);