$(window).on('load', function() {
  // make sure the buttons don't have residual classes
  $('.button.resultsContinueButton, .button.results_print').removeClass('loading disabled');

  // get the current module
  let pathArray = window.location.pathname.split('/');
  let currentModule = pathArray[2];

  $('.button.resultsContinueButton')
    .on('click', function () {
      $('.optInToShareActivityDataSegment').modal('show');
      $('.optInToShareActivityDataSegment').modal({
        onApprove: function(){
          // change button
          $('.button.resultsContinueButton, .button.results_print').addClass('loading disabled');
          // get the checkbox status
          const optInSelection = $('.optInToShareActivityDataSegment .ui.checkbox input').is(":checked");
          if (optInSelection) {
            $.post('/postActivityData', {
              module: currentModule,
              _csrf: $('meta[name="csrf-token"]').attr('content')
            }).then(function(){
              window.location.href = `/end/${currentModule}`;
            });
          } else {
            $.post('/postDeleteActivityData', {
              module: currentModule,
              _csrf: $('meta[name="csrf-token"]').attr('content')
            }).then(function(){
              window.location.href = `/end/${currentModule}`;
            })
          }
        }
      });
    });
});
