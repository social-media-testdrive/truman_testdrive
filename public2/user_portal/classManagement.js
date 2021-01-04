$('.addStudentButton').on('click', function(){
  let classname = $(this).closest('tr').find('a').text()
  $("#addStudentToClassModal").find('input[name="className"]').val(classname);
  $('#classNameHeader span').text(' ' + classname);
  $('#addStudentToClassModal').modal('show');
});

// 
// $('.copyLoginLink').on('click', function(){
//   let copyText = $(this).siblings('.loginLink').text();
//   console.log(copyText);
//   copyText.select();
//   document.execCommand('copy');
// })
