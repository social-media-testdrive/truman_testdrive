function onPrint(){

  $(".insertPrint").empty();
  $(".insertPrint").css('display','block');

  $(".checkOne").clone().appendTo(".insertPrint");
  $(".insertPrint").append('<div class="breakHere"</div>');
  $(".checkTwo").clone().appendTo(".insertPrint");
  $(".insertPrint").append('<div class="breakHere"</div>');
  $(".checkThree").clone().appendTo(".insertPrint");
  $(".insertPrint").append('<div class="breakHere"</div><br>');

  $(".insertPrint").append("<h4>What are some clues you can use to identify phishing scams?</h4>");
  var responseOne = document.getElementById("digfoot_responseOne").value;
  $(".insertPrint").append(responseOne);

  $(".insertPrint").append("<h4>Why is it important to protect yourself against phishing scams?</h4>");
  var responseTwo = document.getElementById("digfoot_responseTwo").value;
  $(".insertPrint").append(responseTwo);

  window.print();

  $(".insertPrint").css('display','none');
}

setTimeout(function(){
  $('.ui.label').transition('bounce');
}, 1000);


setTimeout(function(){
  $('#card1,#card2,#card3').transition({
  animation : 'jiggle',
  duration  : 800,
  interval  : 200
  });
}, 2000);
