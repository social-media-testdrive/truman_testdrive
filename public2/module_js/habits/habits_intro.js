function startIntro(){
  window.location.href='/start/habits';
};

$("#learn").on('click', function() {
  $('#learn').transition('tada');
  });

$('#practice').on('click', function() {
  $('#practice').transition('tada');
});

$('#explore').on('click', function() {
  $('#explore').transition('tada');
});

$('#reflect').on('click', function() {
  $('#reflect').transition('tada');
});
