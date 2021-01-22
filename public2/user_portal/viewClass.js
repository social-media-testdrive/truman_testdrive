$(window).on('load', function(){
  $('.addStudentButton').on('click', function(){
    let classname = $('#className').val();
    $('#addStudentToClassModal').modal('show');
  });

  $('.generateAccountsButton').on('click', function(){
    $('#generateAccountsModal').modal('show');
  });

  $('.deleteAccountButton').popup();

  $('#deleteAccountModal').modal({
    onApprove: function(){
      $(this).find('form').submit();
      $('#loadingDimmer').addClass('active')
    }
  });

  $('#generateAccountsModal').modal({
    onApprove: function(){
      $(this).find('form').submit();
      $('#loadingDimmer').addClass('active')
    }
  });

  $('.deleteAccountButton').on('click', function(){
    let username = $(this).closest('td').siblings('.usernameCell').text();
    $('#confirmDeleteAccountText').text(`Are you sure you want to delete ${username}?`);
    $("#deleteAccount input[name='username']").attr('value', username);
    $('#deleteAccountModal').modal('show');
  })
})
