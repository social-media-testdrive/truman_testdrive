function updateTableHtml(studentData){
  $('#studentReportSegment').empty();
  $('#studentReportSegment').append(`
    <table class="ui single lined table">
      <thead>
        <tr>
          <th rowspan="2" class="bottom aligned">Module</th>
          <th rowspan="2" class="bottom aligned">Time Spent to Complete</th>
          <th rowspan="2" class="bottom aligned">Last Accessed</th>
          <th colspan="3" class="center aligned">Explore Timeline Actions</th>
        </tr>
        <tr>
          <th class="center aligned">Like Posts</th>
          <th class="center aligned">Flag Posts</th>
          <th class="center aligned">Replies</th>
        </tr>
      </thead>
      <tbody id="studentReportTable"></tbody>
    </table>
  `);
  for(const modName of Object.keys(studentData)){
    $(`#studentReportTable`).append(`
      <tr>
        <td>${studentData[modName].modTitle}</td>
        <td>${studentData[modName].timeToComplete ? studentData[modName].timeToComplete + " minutes" : "Not completed"}</td>
        <td>${studentData[modName].dateLastVisited ? humanized_time_span(studentData[modName].dateLastVisited) : "N/A"}</td>
        <td class="center aligned">${studentData[modName].likeCount}</td>
        <td class="center aligned">${studentData[modName].flagCount}</td>
        <td class="center aligned">${studentData[modName].replyCount}</td>
      </tr>
    `);
  }
};

function getExploreColumns(studentReportData, finalStudentTableData){
  for(let modName of Object.keys(finalStudentTableData)){
    let likeCount = 0;
    let flagCount = 0;
    let replyCount = 0;
    const freeplayActions = studentReportData.freeplayActions;
    for(const post in freeplayActions){
      if (post.liked) {
        likeCount++;
      }
      if (post.flagged) {
        flagCount++;
      }
      if (post.comments) {
        for(const comment in post.comments) {
          if(comment.new_comment){
            replyCount++;
          }
        }
      }
    }
    finalStudentTableData[modName]['likeCount'] = likeCount;
    finalStudentTableData[modName]['flagCount'] = flagCount;
    finalStudentTableData[modName]['replyCount'] = replyCount;
  }
  return finalStudentTableData;
};

function getTimeColumns(studentReportData, finalStudentTableData){
  const pageTimes = studentReportData.pageTimes;
  const moduleProgress = studentReportData.moduleProgress;
  for(let modName of Object.keys(finalStudentTableData)){
    let timeToComplete = 0;
    let mostRecentVisit = 0;
    for (const timeItem of pageTimes) {
      if (timeItem.subdirectory2 === modName) {
        if (moduleProgress[modName] === "completed"){
          timeToComplete = timeToComplete + timeItem.timeDuration;
        }
        let dateObj = new Date(timeItem.timeOpened);
        if(!mostRecentVisit){
          mostRecentVisit = dateObj;
        } else if (mostRecentVisit < dateObj) {
          mostRecentVisit = dateObj;
        }
      }
    }
    finalStudentTableData[modName]['timeToComplete'] = timeToComplete;
    finalStudentTableData[modName]['dateLastVisited'] = mostRecentVisit;
  }
  return finalStudentTableData;
};

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

function addLoadingIcon(){
  $('#studentReportSegment').append(`
    <div class="ui active inline loader"></div>
  `);
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

    $('#studentReportSegment').empty();
    addLoadingIcon();
    let finalStudentTableData = {
      "accounts": {"modTitle":"Accounts and Passwords"},
      "advancedlit": {"modTitle":"Advanced News Literacy"},
      "cyberbullying": {"modTitle":"How to Be an Upstander"},
      "digfoot": {"modTitle":"Shaping Your Digital Footprint"},
      "digital-literacy": {"modTitle":"News in Social Media"},
      "esteem": {"modTitle":"The Ups and Downs of Social Media"},
      "habits": {"modTitle":"Healthy Social Media Habits"},
      "phishing": {"modTitle":"Scams and Phishing"},
      "presentation": {"modTitle":"Online Identities"},
      "privacy": {"modTitle":"Social Media Privacy"},
      "safe-posting": {"modTitle":"Is It Private Information?"},
      "targeted": {"modTitle":"Ads on Social Media"}
    };
    const studentReportData = await $.get(`/studentReportData/${classId}/${username}`);
    finalStudentTableData = await getTimeColumns(studentReportData, finalStudentTableData);
    finalStudentTableData = await getExploreColumns(studentReportData, finalStudentTableData);
    updateTableHtml(finalStudentTableData);
  });
});
