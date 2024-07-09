function onPrint() {
    if ($('.results_print').hasClass('green')) {
        $(".insertPrint").empty();
        $(".insertPrint").css('display', 'block');

        $(".selectPostsQuestion1").clone().appendTo(".insertPrint");

        $(".insertPrint").append("<br><h4>¿Qué hiciste cuando viste esta noticia de último minuto?</h4>");
        $(".checkOne").clone().removeClass('reflectionPromptSegment').appendTo(".insertPrint");

        $(".insertPrint").append("<br><h4>¿Leíste alguno de los artículos? ¿Notaste alguna señal de que el artículo podría ser erróneo?</h4>");
        var responseOne = document.getElementById("literacy_responseOne").value;
        $(".insertPrint").append(responseOne);

        $(".insertPrint").append('<div class="breakHere"</div>');
        $(".insertPrint").append("<h4>¿Por qué es importante conocer la historia completa antes de reaccionar o compartir noticias de último minuto?</h4>");
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
//
//
// setTimeout(function(){
//   $('#card1,#card2,#card3').transition({
//   animation : 'jiggle',
//   duration  : 800,
//   interval  : 200
//   });
// }, 2000);