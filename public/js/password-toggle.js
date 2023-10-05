$(document).ready(function() {
    $('.password-toggle').on("click", function() {
      // Toggle eye icon between slashed and unslashed
      let passwordIcon = $('#showPassword');
      passwordIcon.toggleClass("slash");
      
      // Toggle text between "show" and "hide"
      let passwordText = $('.password-text');
      passwordText.text(passwordIcon.hasClass('slash') ? 'Hide' : 'Show');
  
      // Toggle password visibility
      let passwordInput = $('#password');
  
      if (passwordInput.attr('type') === 'password') {
          $('.password-toggle').attr('aria-label', 'Hide password.');
          passwordInput.attr('type', 'text');
      } else {
          $('.password-toggle').attr('aria-label', 'Show password as plain text. Warning: this will display your password on the screen.');
          passwordInput.attr('type', 'password');
      }
    });
})    
  