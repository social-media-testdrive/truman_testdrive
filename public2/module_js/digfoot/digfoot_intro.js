function startIntro(){
  window.location.href='/start/digfoot';
};

function animateObject(obj){
  $(obj).transition('tada');
}

$("#learn, #practice, #explore, #reflect").on('click',
  function() {animateObject($(this))}
);
