$(window).on('load', function(){

  $('.addStudentButton').on('click', function(){
    let classname = $(this).closest('tr').find('a').text()
    $("#addStudentToClassModal").find('input[name="className"]').val(classname);
    $('#classNameHeader span').text(' ' + classname);
    $('#addStudentToClassModal').modal('show');
  });

  $('.deleteClassButton').popup();

  $('.deleteClassButton').on('click', function(){
    let accessCode = $(this).closest('td').siblings('.accessCodeColumn').text();
    let className = $(this).closest('td').siblings('.classNameColumn').text();
    $('#confirmDeleteClassText').html(`
      <h2>Are you sure you want to delete the class "${className}"?</h2>
      <h2>(access code: ${accessCode})</h2>
    `);
    $("#deleteClass input[name='accessCode']").attr('value', accessCode);
    $("#deleteClass input[name='className']").attr('value', className);
    $('#deleteClassModal').modal('show');
  });

  $('#deleteClassModal').modal({
    onApprove: function(){
      $(this).find('form').submit();
      $('#loadingDimmer').addClass('active')
    }
  });
});
