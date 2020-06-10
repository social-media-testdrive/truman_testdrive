function onPrint(){

    $(".insertPrint").empty();
    $(".insertPrint").css('display','block');

    $(".insertPrint").append("<br><h4>Do you remember seeing other posts that might have caused Jeremy to feel good? What were they?</h4>");
    var responseOne = document.getElementById("literacy_responseOne").value;
    $(".insertPrint").append(responseOne);

    $(".insertPrint").append("<br><h4>What could you do to feel better when you get red flag feelings on social media?</h4>");
    var responseTwo = document.getElementById("literacy_responseTwo").value;
    $(".insertPrint").append(responseTwo);

    window.print();

    $(".insertPrint").css('display','none');
}

setTimeout(function(){
  $('.ui.label').transition('bounce');
}, 1000);
