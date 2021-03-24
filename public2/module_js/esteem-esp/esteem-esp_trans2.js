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
  var currentSelect = ($(".ui.selection.dropdown[name='topicSelect']").dropdown('get text'));
  if($('.ui.big.labeled.icon.button').hasClass('green')){
    //record the choice in the db to use when generating the free play section
    $.post("/esteemInterest", { chosenTopic: currentSelect, _csrf: $('meta[name="csrf-token"]').attr('content') }).then(function(){
      //take the user to the free-play section
      window.location.href='/trans_script/esteem-esp';
    });
  }
};
