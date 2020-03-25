function startIntro(){
  let pathArray = window.location.pathname.split('/');
  window.location.href='/start/' + pathArray[2];
};

function animateObject(obj){
  $(obj).transition('tada');
}

$("#learn, #practice, #explore, #reflect").on('click',
  function() {animateObject($(this))}
);
