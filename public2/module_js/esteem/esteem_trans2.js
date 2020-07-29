$('.ui.dropdown')
  .dropdown();

$(".ui.selection.dropdown[name='topicSelect']").change(function() {
      $('.ui.big.labeled.icon.button').addClass('green');
      $('#selectTopicError').hide();
});

$('.ui.big.labeled.icon.button').on('click',function(){
  if(!$(this).hasClass('green')){
    $('#selectTopicError').show();
    $("#animateDropdownError").transition('bounce');
  }
});


function startIntro(){
  let pathArrayForHeader = window.location.pathname.split('/');
  let subdirectory1 = pathArrayForHeader[1];
  let subdirectory2 = pathArrayForHeader[2];

  var currentSelect = ($(".ui.selection.dropdown[name='topicSelect']").dropdown('get text'));
  if($('.ui.big.labeled.icon.button').hasClass('green')){
    //record the choice in the db to use when generating the free play section
    $.post("/interest", {
      chosenTopic: currentSelect,
      subdirectory2: subdirectory2,
      _csrf: $('meta[name="csrf-token"]').attr('content')
    }).then(function(){
      //take the user to the free-play section
      window.location.href='/trans_script/esteem';
    });
  }
};
