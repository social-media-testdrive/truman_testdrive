function openPhishingModal(phishingLink){
  if(phishingLink.attr('phishingPostType') === "surveyScam"){
    $('#phishingModal1').modal('show');
  } else if (phishingLink.attr('phishingPostType') === "loginScam"){
    $('#phishingModal2').modal('show');
  } else if (phishingLink.attr('phishingPostType') === "creditCardScam"){
    $('#phishingModal3').modal('show');
  }
}

//Misc code
$('.big.plus.icon').css({"display": "block"})
$('.ui.simple.dropdown.item').css({"display":"inherit"})

//Open the corresponding phishing modal when a phishing link is clicked
$('.phishingLink').on('click', function () { openPhishingModal($(this)) });
