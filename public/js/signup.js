$(document).ready(function() {
  $(document).ready(function() {
    $('.icon.info.circle.link').popup({
        hoverable: true
    });
  });

  $('.message .close')
      .on('click', function() {
          $(this)
              .closest('.message')
              .transition('fade')
          ;
      })
  ;
  //- Formantic ui form validation rules
  var validationRules = {
    email: {
      identifier: 'email',
      rules: [
        {
          type: 'empty',
          prompt: 'Please enter your e-mail',
        },
        {
          type: 'email',
          prompt: 'Please enter a valid e-mail',
        },
      ],
    },
    password: {
      identifier: 'password',
      rules: [
        {
          type: 'empty',
          prompt: 'Please enter a password',
        },
        {
          type: 'minLength[8]',
          prompt: 'Your password must be at least 8 characters',
        },
      ],
    }
    // confirmPassword: {
    //   identifier: 'confirmPassword',
    //   rules: [
    //     {
    //       type: 'empty',
    //       prompt: 'Please confirm your password',
    //     },
    //     {
    //       type: 'minLength[8]',              
    //       prompt: 'Your password must be at least {ruleValue} characters',
    //     },
    //   ],
    // },
  };


// Initialize form validation
$('.ui.form')
  .form({
    fields: validationRules,
    inline: true,
    on: 'blur',
  });
})    

