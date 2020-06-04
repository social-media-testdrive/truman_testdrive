function onPrint(){

    $(".insertPrint").empty();
    $(".insertPrint").css('display','block');
    $(".insertPrint").append("<br><h4>What did you do when you saw an advertisement or a sponsored post?</h4>");
    $(".checkOne").clone().appendTo(".insertPrint");

    $(".insertPrint").append("<br><h4>Why is it important to get the full story before reacting to or sharing breaking news?</h4>");
    var responseOne = document.getElementById("literacy_responseOne").value;
    $(".insertPrint").append(responseOne);

    window.print();

    $(".insertPrint").css('display','none');
}

setTimeout(function(){
  $('.ui.label').transition('bounce');
}, 1000);


setTimeout(function(){
  $('#card1,#card2').transition({
  animation : 'jiggle',
  duration  : 800,
  interval  : 200
  });
}, 2000);
