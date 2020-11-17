$('.addStudentButton').on('click', function(){
  let classname = $(this).closest('tr').find('a').text()
  $("#addStudentToClassModal").find('input[name="className"]').val(classname);
  $('#classNameHeader span').text(' ' + classname);
  $('#addStudentToClassModal').modal('show');
});
