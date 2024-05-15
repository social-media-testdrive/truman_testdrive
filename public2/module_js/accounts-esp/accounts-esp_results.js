function insertPrint() {
    $(".insertPrint").empty();
    $(".insertPrint").css('display', 'block');

    $(".insertPrint").append(`<h4>¿Cuáles son algunas de las características de una contraseña segura?</h4>`);
    var responseOne = document.getElementById("accounts_responseOne").value;
    $(".insertPrint").append(responseOne);
    $(".insertPrint").append(`<h4>¿Por qué es importante elegir tu nombre de usuario cuidadosamente?</h4>`);
    var responseTwo = document.getElementById("accounts_responseTwo").value;
    $(".insertPrint").append(responseTwo);
    $(".insertPrint").append(`<h4>¿Qué tipo de información está bien compartir en tu perfil de redes sociales?</h4>`);
    var responseThree = document.getElementById("accounts_responseThree").value;
    $(".insertPrint").append(responseThree);

}

async function onPrint() {
    if ($('.results_print').hasClass('green')) {
        await insertPrint();
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
