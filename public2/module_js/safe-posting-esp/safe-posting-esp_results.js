function onPrint() {
    if ($('.results_print').hasClass('green')) {
        $(".insertPrint").empty();
        $(".insertPrint").css('display', 'block');

        $(".selectPostsQuestion1").clone().appendTo(".insertPrint");
        $(".insertPrint").append('<div class="breakHere"</div>');

        $(".insertPrint").append("<h4>¿Por qué esta publicación no es adecuada para las redes sociales?</h4>");
        $(".checkOne").clone().removeClass('reflectionPromptSegment').appendTo(".insertPrint");
        $(".insertPrint").append('<div class="breakHere"</div><br>');
        $(".insertPrint").append("<h4>¿Cómo respondiste a estos mensajes que pedían información privada?</h4>");
        $(".checkTwo").clone().removeClass('reflectionPromptSegment').appendTo(".insertPrint");

        $(".insertPrint").append("<br><h4>¿Qué harías en el futuro para proteger tu información privada y la información privada de otras personas en las redes sociales?</h4>");
        var responseOne = document.getElementById("safe_responseOne").value;
        $(".insertPrint").append(responseOne);

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
