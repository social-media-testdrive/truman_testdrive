function clickGetStarted(){
  window.location.href='/start/phishing';
};

function animateObject(obj){
  $(obj).transition('tada');
}

$("#learn, #practice, #explore, #reflect").on('click', function() {animateObject($(this))});
