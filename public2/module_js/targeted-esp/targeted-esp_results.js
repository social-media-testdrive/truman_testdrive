function onPrint() {
    if ($('.results_print').hasClass('green')) {
        $(".insertPrint").empty();
        $(".insertPrint").css('display', 'block');

        $(".selectPostsQuestion1").clone().appendTo(".insertPrint");

        $(".insertPrint").append("<br><h4>¿Qué hiciste cuando viste un anuncio o publicidad pagada?</h4>");
        $(".checkOne").clone().removeClass('reflectionPromptSegment').appendTo(".insertPrint");

        $(".insertPrint").append('<div class="breakHere"</div>');
        $(".insertPrint").append("<br><h4>¿Por qué las compañías recopilan datos de los perfiles de las personas o de su actividad en línea?</h4>");
        var responseOne = document.getElementById("literacy_responseOne").value;
        $(".insertPrint").append(responseOne);

        $(".insertPrint").append("<br><h4>¿Por qué es importante identificar los anuncios en las redes sociales?</h4>");
        var responseTwo = document.getElementById("literacy_responseTwo").value;
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
//   $('#card1,#card2,#card3,#card4,#card5,#card6').transition({
//   animation : 'jiggle',
//   duration  : 800,
//   interval  : 200
//   });
// }, 2000);