function fillDropdownOptions(){

}


$(window).on('load', async function(){
  $(".usernameSelection").addClass('hidden');

  $(".ui.selection.dropdown[name='classSelection']").dropdown({
    onChange: function(){
      $('.nextStepButton1').addClass('green')
    }
  });

  $(".usernameSelection").dropdown({
    onChange: function(){
      $('.nextStepButton2').removeClass('hidden').addClass('green');
    }
  });

  $('.nextStepButton1').on('click', async function(){
    const classId = ($(".ui.selection.dropdown[name='classSelection']").dropdown('get value'));
    if(classId){
      $('.usernameSelectionStepLabel, .usernameSelection').removeClass('hidden');
      $('.usernameSelection').dropdown("clear");
      $('.usernameSelection .menu').empty();
      $('.usernameSelection').addClass('loading');
      const usernameArray = await $.get(`/classUsernames/${classId}`).then(function(data){
        return data.classUsernames;
      });
      for(const username of usernameArray) {
        console.log(username)
        $('.usernameSelection .menu').append(`
          <div class="item" data-value="${username}">${username}</div>
        `);
      }
      $('.usernameSelection').removeClass('loading')
    }
  });

  $('.nextStepButton2').on('click', async function(){
    const username = ($(".usernameSelection").dropdown('get text'));
    if(username){
      console.log(`Selected user ${username}`)
    }
  });
});
