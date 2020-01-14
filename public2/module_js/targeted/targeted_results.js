function onPrint(){

    $(".insertPrint").empty();
    $(".insertPrint").css('display','block');
    $(".insertPrint").append("<br><h4>What did you do when you saw an advertisement or a sponsored post?</h4>");
    $(".checkOne").clone().appendTo(".insertPrint");

    $(".insertPrint").append("<br><h4>Why do companies collect data from people's profiles or online activity?</h4>");
    var responseOne = document.getElementById("literacy_responseOne").value;
    $(".insertPrint").append(responseOne);

    $(".insertPrint").append("<h4>Why is it important to know how to identify advertisements on social media?</h4>");
    var responseTwo = document.getElementById("literacy_responseTwo").value;
    $(".insertPrint").append(responseTwo);

    window.print();

    $(".insertPrint").css('display','none');
}

setTimeout(function(){
  $('.ui.label').transition('bounce');
}, 1000);


setTimeout(function(){
  $('#card1,#card2,#card3,#card4,#card5,#card6').transition({
  animation : 'jiggle',
  duration  : 800,
  interval  : 200
  });
}, 2000);
