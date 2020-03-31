function onPrint(){

  $(".insertPrint").empty();
  $(".insertPrint").css('display','block');

  $(".insertPrint").append(`<h4>What are some features of a strong password?</h4>`);
  var responseOne = document.getElementById("accounts_responseOne").value;
  $(".insertPrint").append(responseOne);
  $(".insertPrint").append(`<h4>What kind of information is ok to share on your
  social media profile?</h4>`);
  var responseTwo = document.getElementById("accounts_responseTwo").value;
  $(".insertPrint").append(responseTwo);

  window.print();

  $(".insertPrint").css('display','none');
}
