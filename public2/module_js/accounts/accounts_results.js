function onPrint(){

  $(".insertPrint").empty();
  $(".insertPrint").css('display','block');

  $(".insertPrint").append("<h4>What kind of information should you include or not include in a social media profile?</h4>");
  var responseOne = document.getElementById("accounts_responseOne").value;
  $(".insertPrint").append(responseOne);

  window.print();

  $(".insertPrint").css('display','none');
}
