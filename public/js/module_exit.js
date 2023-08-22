
$('#exit-button').click(function() {
  $('#exit-modal').modal('show');
  // fix semantic ui trying to add margin-right to body for scroll bar since we already have a scroll bar
  $('.dimmable.dimmed').css('margin-right', '0px');
});



$('#no-button').click(function() {
  $('#exit-modal').modal('hide');
});

$('#yes-button').click(function() {
  window.location.href = '/'; 
});
