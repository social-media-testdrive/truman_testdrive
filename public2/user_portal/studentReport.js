async function getTimeColumns(finalStudentData, classId, username){
  let pageTimes = await $.get(`/studentPageTimes/${classId}/${username}`).then(function(data){
    return data.studentPageTimes;
  });
}

function initializeDropdowns(){
  $(".ui.selection.dropdown[name='classSelection']").dropdown({
    onChange: function(){
      $('.nextStepButton1').addClass('green');
    }
  });
  $(".usernameSelection").dropdown({
    onChange: function(){
      $('.nextStepButton2').removeClass('hidden').addClass('green');
    }
  });
};

async function handleSelectClassDropdown(){
  // get selected class
  const classId = ($(".ui.selection.dropdown[name='classSelection']").dropdown('get value'));
  if(!classId){
    return;
  }
  // appearances: clear the username dropdown selection, display as "loading"
  $('.usernameSelectionStepLabel, .usernameSelection').removeClass('hidden');
  $('.usernameSelection').dropdown("clear");
  $('.usernameSelection .menu').empty();
  $('.usernameSelection').addClass('loading');
  // get each username in the class, add it to dropdown options
  const usernameArray = await $.get(`/classUsernames/${classId}`).then(function(data){
    return data.classUsernames;
  });
  for(const username of usernameArray) {
    console.log(username)
    $('.usernameSelection .menu').append(`
      <div class="item" data-value="${username}">${username}</div>
    `);
  }
  $('.usernameSelection').removeClass('loading');
  return classId;
};

$(window).on('load', async function(){
  let classId;
  let username;
  initializeDropdowns();
  // appearances: hide the username selection dropdown
  $(".usernameSelection").addClass('hidden');

  $('.nextStepButton1').on('click', async function(){
    classId = await handleSelectClassDropdown();
  });

  $('.nextStepButton2').on('click', async function(){
    username = ($(".usernameSelection").dropdown('get text'));
    if(!username){
      return;
    }
    console.log(`Selected user ${username}`)
    let finalStudentTableData = {
      "accounts": {},
      "advancedlit": {},
      "cyberbullying": {},
      "digfoot": {},
      "digital-literacy": {},
      "esteem": {},
      "habits": {},
      "phishing": {},
      "presentation": {},
      "privacy": {},
      "safe-posting": {},
      "targeted": {}
    };

    getTimeColumns(finalStudentTableData, classId, username);
  });
});
