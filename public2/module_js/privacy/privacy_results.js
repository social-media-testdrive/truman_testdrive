function onPrint(){

  $(".insertPrint").empty();
  $(".insertPrint").css('display','block');

  $(".insertPrint").append("<h4>Did you notice any changes in Lily’s profile after you changed the privacy settings?</h4>");
  var responseOne = document.getElementById("privacy_responseOne").value;
  $(".insertPrint").append(responseOne);

  $(".insertPrint").append("<h4>Why is it important to know what information websites collect about you?</h4>");
  var responseTwo = document.getElementById("privacy_responseTwo").value;
  $(".insertPrint").append(responseTwo);

  $(".insertPrint").append("<h4>What are the three things you should ask yourself when reading a privacy policy?</h4>");
  var responseThree = document.getElementById("privacy_responseThree").value;
  $(".insertPrint").append(responseThree);

  $(".insertPrint").append("<h4>What can you do in the future to protect your privacy on social media?</h4>");
  var responseFour = document.getElementById("privacy_responseFour").value;
  $(".insertPrint").append(responseFour);

  window.print();

  $(".insertPrint").css('display','none');
}
