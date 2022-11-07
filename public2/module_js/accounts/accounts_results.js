function insertPrint() {
    $(".insertPrint").empty();
    $(".insertPrint").css('display', 'block');

    $(".insertPrint").append(`<h4>What are some features of a strong password?</h4>`);
    var responseOne = document.getElementById("accounts_responseOne").value;
    $(".insertPrint").append(responseOne);
    $(".insertPrint").append(`<h4>Why is it important to choose your username carefully?</h4>`);
    var responseTwo = document.getElementById("accounts_responseTwo").value;
    $(".insertPrint").append(responseTwo);
    $(".insertPrint").append(`<h4>What kind of information is okay to share on
  your social media profile?</h4>`);
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