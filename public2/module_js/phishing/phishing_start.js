
function animateUnclickedLabels() {
  if($('#keyTerm1Definition').is(":hidden")){
    $('#keyTerm1Label').transition('bounce');
  }
  if($('#keyTerm2Definition').is(":hidden")){
    $('#keyTerm2Label').transition('bounce');
  }
  if($('#keyTerm3Definition').is(":hidden")){
    $('#keyTerm3Label').transition('bounce');
  }
};

function clickGotIt(){
  if($('#question').is(":hidden")){
    //User has not yet clicked next
    $('#clickNextWarning').show();
    $('#introduction_next').transition('bounce');
  }else{
    //determine if all the labeles are clicked
    var clickedAllLabels = ($('#keyTerm1Definition').is(":visible") && $('#keyTerm2Definition').is(":visible") &&  $('#keyTerm3Definition').is(":visible"));
    if(clickedAllLabels == true){
      //everything is good to proceed
      $('#clickLabelsWarning').hide();
      window.location.href='/tutorial/phishing';
    } else {
      //User has not clicked all the labels
      $('#clickLabelsWarning').show();
      animateUnclickedLabels();
    }
  }
};

function clickLabel(labelName){
  $(labelName.concat("Definition")).show();
  $(labelName).transition('tada');
  if(!($('#question').is(":hidden") ||  $('#keyTerm2Definition').is(":hidden") || $('#keyTerm1Definition').is(":hidden")|| $('#keyTerm3Definition').is(":hidden"))){
    $('#clickLabelsWarning').hide();
    $('.ui.labeled.icon.button').addClass('green');
  }
};


$('#introduction_next').on('click', function () {
  $('#clickNextWarning').hide();
  $('#question').show();
  $('#question').transition('jiggle');
  if(!($('#question').is(":hidden") ||  $('#keyTerm2Definition').is(":hidden") || $('#keyTerm1Definition').is(":hidden") || $('#keyTerm3Definition').is(":hidden"))){
    $('.ui.labeled.icon.button').addClass('green');
  }
});

$('#keyTerm1>a').on('click', function () { clickLabel('#keyTerm1') });
$('#keyTerm2>a').on('click', function () { clickLabel('#keyTerm2') });
$('#keyTerm3>a').on('click', function () { clickLabel('#keyTerm3') });
