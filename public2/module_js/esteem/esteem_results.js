function onPrint(){

    $(".insertPrint").empty();
    $(".insertPrint").css('display','block');
    $(".insertPrint").append("<br><h4>What did you do when you saw a post that could cause a red flag feeling?</h4>");
    $(".checkOne").clone().appendTo(".insertPrint");

    $(".insertPrint").append("<br><h4>What are some things you can do when you get a red flag feeling on social media?</h4>");
    var responseOne = document.getElementById("literacy_responseOne").value;
    $(".insertPrint").append(responseOne);

    window.print();

    $(".insertPrint").css('display','none');
}

setTimeout(function(){
  $('.ui.label').transition('bounce');
}, 1000);
