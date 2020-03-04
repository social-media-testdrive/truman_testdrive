function startIntro(){
  window.location.href='/start/privacy';
};

function animateObject(obj){
  $(obj).transition('tada');
}

$("#learn, #practice, #explore, #reflect").on('click',
  function() {animateObject($(this))}
);
