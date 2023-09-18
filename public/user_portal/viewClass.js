$(window).on('load', function(){

  $('.deleteAccountButton, .setNameButton').popup();

  $('.generateAccountsButton').on('click', function(){
    $('#generateAccountsModal').modal('show');
  });

  $('.setNameButton').on('click', function(){
    let username = $(this).closest('td').siblings('.usernameCell').text();
    $('#setNameText').text(`Assign a name to account ${username}`);
    $("#setName input[name='username']").attr('value', username);
    $('#setNameModal').modal('show');
  });

  $('.deleteAccountButton').on('click', function(){
    let username = $(this).closest('td').siblings('.usernameCell').text();
    $('#confirmDeleteAccountText').text(`Are you sure you want to delete ${username}?`);
    $("#deleteAccount input[name='username']").attr('value', username);
    $('#deleteAccountModal').modal('show');
  });

  $('#setNameModal, #deleteAccountModal, #generateAccountsModal').modal({
    onApprove: function(){
      $(this).find('form').submit();
      $('#loadingDimmer').addClass('active');
    }
  });
});
