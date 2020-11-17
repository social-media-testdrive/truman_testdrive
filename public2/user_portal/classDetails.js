$('.addStudentButton').on('click', function(){
  let classname = $('#className').val();
  $('#addStudentToClassModal').modal('show');
});

$('.generateAccountsButton').on('click', function(){
  $('#generateAccountsModal').modal('show');
});
