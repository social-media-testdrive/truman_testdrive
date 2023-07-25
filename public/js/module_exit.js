$('#exit-button').click(function() {
    $('#exit-modal').modal('show');
  });

  $('#no-button').click(function() {
    $('#exit-modal').modal('hide');
  });

  $('#yes-button').click(function() {
    window.location.href = '/'; 
});
