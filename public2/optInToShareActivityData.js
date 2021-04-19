$(window).on('load', function() {
  $('.button.resultsContinueButton')
    .on('click', function () {
      $('.optInToShareActivityDataSegment').modal('show');
      $('.optInToShareActivityDataSegment').modal({
        onApprove: function(){
          // change button
          $('.button.resultsContinueButton, .button.printResponsesButton').addClass('loading', 'disabled');
          // get the checkbox status
          const optInSelection = $('.optInToShareActivityDataSegment .ui.checkbox input').is(":checked");
          // update the status in the db
          $.post('/updateOptInToShareActivityData', {
            optInSelection: optInSelection,
            _csrf: $('meta[name="csrf-token"]').attr('content')
          }).then(function(){
            let pathArray = window.location.pathname.split('/');
            window.location.href = `/end/${pathArray[2]}`;
          })
        }
      })
    });
});
