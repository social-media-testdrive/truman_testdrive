function initializeStudentProgressChart(){
  const ctx = $('#studentProgress');
  const studentProgressChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        datasets: [{
            data: [0,0,1],
            backgroundColor: [
              'rgba(54, 162, 235, 1)',
              'rgba(255, 99, 132, 1)',
              'rgba(0, 0, 0, 0.1)'
            ]
        }],
        labels: ["Completed", "Started but not completed", "Have not started"],

      },
      options: {
        maintainAspectRatio: false
      }
  });
  return studentProgressChart;
}

function getStudentCount(classReflectionResponses){
  let studentCount = 0;
  for (const username in classReflectionResponses){
    studentCount++;
  }
  return studentCount;
}

// Determines how many students in a given class have responded to a prompt
// Inputs:
// prompt - string, exact copy of the prompt
// classReflectionResponses - json, data.classReflectionResponses from /classReflectionResponses/:classId
function countResponsesToPrompt(prompt, classReflectionResponses){
  let responseCount = 0;
  for (const username in classReflectionResponses) {
    for (let i = 0; i < classReflectionResponses[username].length; i++) {
      if (classReflectionResponses[username][i].prompt === prompt) {
        // for written repsonses, only count it if not a blank response
        if (classReflectionResponses[username][i].type === 'written'){
          if (classReflectionResponses[username][i].writtenResponse !== ''){
            responseCount++;
          }
        }
      }
    }
  }
  return responseCount;
}

// Used to determine axis labels in reflection bar graphs.
function getCheckboxLabelArray(reflectionJsonData,modName,question){
  const labelArray = [];
  for(const checkboxLabel in reflectionJsonData[modName][question].checkboxLabels){
    labelArray.push(reflectionJsonData[modName][question].checkboxLabels[checkboxLabel]);
  }
  return labelArray;
}

// Parse the class's checkbox-type responses to a question into a format that
// can be readily inserted into a bar chart.
// Inputs:
// questionNumber - id of the question, matches up with reflectionSectionData.json
// numberOfCheckboxes - how many checkboxes there are for the question
// classReflectionResponses - json, data.classReflectionResponses from /classReflectionResponses/:classId
// modReflectionData - from reflectionSectionData.json, lists the questions in the relevant module
// Return values:
// checkboxSelections - Ex.
// checkboxSelections[2] = number of students in the class that checked the third box (direction: top to bottom)
function parseClassCheckboxSelectionsForQuestion(questionNumber, numberOfCheckboxes, classReflectionResponses, modReflectionData){
  const questionPrompt = modReflectionData[questionNumber].prompt;
  const checkboxSelections = [];
  for (let i=0; i<numberOfCheckboxes; i++){
    checkboxSelections.push(0);
  }
  for(const username in classReflectionResponses) {
    const userResponseList = classReflectionResponses[username];
    // Array.filter() returns an array. There can only be one match, so use the result at index [0].
    const searchResultArray = (userResponseList.filter(response => response.prompt === questionPrompt));
    let response = 0;
    if(searchResultArray.length) {
      response = searchResultArray[0];
    };
    // checkboxes responses are recorded in the binary format of the number.
    // Ex: 110 =
    // [√] checkbox label 1
    // [√] checkbox label 2
    // [ ] checkbox label 3
    let checkboxBinary = response.checkboxResponse;
    // iterate in reverse to get the correct direction
    for(let i=numberOfCheckboxes-1; i>=0; i--){
      checkboxSelections[i] = checkboxSelections[i] + (checkboxBinary & 1);
      checkboxBinary = checkboxBinary >> 1;
    }
  }
  return checkboxSelections;
}

function appendGroupedCheckboxTypeHtml(questionNumber, itemNumber, questionData){
  const cdn = "https://dhpd030vnpk29.cloudfront.net";
  $("#groupedCheckboxResponses").append(`
    <div class="row addMargin">
      <div class="ui items">
        <div class="item">
          <div class="middle aligned content">
            <img src=${cdn}${questionData.groupImages[itemNumber]} style='width:100px;height:100px;'>
          </div>
          <div class="ui image">
            <canvas id="groupedCheckboxChart${itemNumber}" width="700" height="200">
          </div>
        </div>
      </div>
    </div>
  `)
}

function appendCheckboxTypeHtml(questionNumber, questionData){
  $("#checkboxResponses").append(`
    <div class="row">
      <h4>${questionNumber}. ${questionData.prompt}</h4>
    </div>
    <div class="row addMargin">
      <div class="ui basic segment">
        <canvas id="chart${questionNumber}" height="300">
      </div>
    </div>
  `);
}

function createCheckboxTypeChart(chartId, chartLabelArray, studentCount, checkboxData){
  const ctxCheckbox = $(chartId);
  const newChartCheckbox = new Chart(ctxCheckbox, {
      type: 'horizontalBar',
      data: {
        datasets: [{
            data: checkboxData,
            backgroundColor: 'rgba(54, 162, 235, 1)',
            borderColor: 'rgba(54, 162, 235, 1)',
        }],
        labels: chartLabelArray,

      },
      options: {
        legend: {
          display: false
        },
        maintainAspectRatio: false,
        responsive: true,
        scales: {
          xAxes: [{
            ticks: {
              stepSize: 1,
              beginAtZero: true,
              suggestedMin: studentCount,
              suggestedMax: studentCount
            }
          }]
        }
      }
  });
}

function appendWrittenTypeHtml(questionNumber, questionData, responseCount){
  $("#openEndedResponses").append(`
    <div class="row addMargin">
      <h4>${questionNumber}. ${questionData.prompt}</h4>
    </div>
    <div class="row addMargin">
      <div class="ui items">
        <div class="item">
          <div class="ui image">
            <canvas id="chart${questionNumber}" width="150" height="100">
          </div>
          <div class="middle aligned content">
            <h4>${responseCount} students answered this question</h4>
          </div>
        </div>
      </div>
    </div>
  `)
}

function createWrittenTypeChart(questionNumber, studentCount, responseCount){
  const ctx = $(`#chart${questionNumber}`);
  const studentCountDifference = studentCount - responseCount;
  const newChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        datasets: [{
            data: [responseCount, studentCountDifference],
            backgroundColor: [
              'rgba(54, 162, 235, 1)',
              'rgba(0, 0, 0, 0.1)'
            ]
        }],
        labels: ["Answered", "Not Answered"],

      },
      options: {
        legend: {
          display: false
        },
        maintainAspectRatio: false
      }
  });
}

async function visualizeStudentReflectionData(modName, classId){
  if (!(modName && classId)) {
    console.log('Missing a selection');
    return;
  }
  // clear any existing charts
  $("#openEndedResponses").empty();
  $("#checkboxResponses").empty();
  $("#groupedCheckboxResponses").empty();
  // append section labels
  $("#openEndedResponses").append(`
    <h4> Students' answers to the open-ended questions:</h4>
  `)
  $("#checkboxResponses").append(`
    <h4> Students' answers to the checkbox questions:</h4>
  `)
  $("#groupedCheckboxResponses").append(`
    <h4> Students' answers to the grouped checkbox questions:</h4>
  `)
  const reflectionJsonData = await $.getJSON("/json/reflectionSectionData.json");
  const dbData = await $.get(`/classReflectionResponses/${classId}`);
  const classReflectionResponses = dbData.reflectionResponses;
  //console.log(`Response data:`)
  //console.log(classReflectionResponses);
  const studentCount = getStudentCount(classReflectionResponses);
  const modReflectionData = reflectionJsonData[modName];
  for (const questionNumber in modReflectionData) {
    const questionData = modReflectionData[questionNumber];

    switch (questionData.type){
      case "written": {
        const responseCount = countResponsesToPrompt(questionData.prompt, classReflectionResponses);
        appendWrittenTypeHtml(questionNumber, questionData, responseCount);
        createWrittenTypeChart(questionNumber, studentCount, responseCount);
        break;
      }
      case "checkbox": {
        const chartLabelArray = getCheckboxLabelArray(reflectionJsonData,modName,questionNumber);
        const numberOfCheckboxes = chartLabelArray.length;
        const checkboxData = parseClassCheckboxSelectionsForQuestion(questionNumber, numberOfCheckboxes, classReflectionResponses, modReflectionData);
        appendCheckboxTypeHtml(questionNumber, questionData);
        const chartId = `#chart${questionNumber}`;
        createCheckboxTypeChart(chartId, chartLabelArray, studentCount, checkboxData);
        break;
      }
      case "checkboxGrouped": {
        const numberOfGroups = modReflectionData[questionNumber].groupCount;
        const chartLabelArray = getCheckboxLabelArray(reflectionJsonData,modName,questionNumber);
        const checkboxesPerGroup = chartLabelArray.length;
        const totalNumberOfCheckboxes = numberOfGroups * chartLabelArray.length;
        $("#groupedCheckboxResponses").append(`
          <div class="row addMargin">
            <h4>${questionNumber}. ${questionData.prompt}</h4>
          </div>
        `);
        const allGroupsCheckboxData = parseClassCheckboxSelectionsForQuestion(questionNumber, totalNumberOfCheckboxes, classReflectionResponses, modReflectionData);
        for (let i=0; i<numberOfGroups; i++){
          const sliceStart = i*checkboxesPerGroup;
          const sliceEnd = sliceStart + checkboxesPerGroup
          const subgroupCheckboxData = allGroupsCheckboxData.slice(sliceStart,sliceEnd);
          appendGroupedCheckboxTypeHtml(questionNumber, i, questionData);
          const chartId = `#groupedCheckboxChart${i}`;
          createCheckboxTypeChart(chartId, chartLabelArray, studentCount, subgroupCheckboxData);
        }
        break;
      }
    }
  }
}

function updateStudentProgressChart(chart, completedCount, startedCount, noneCount){
  chart.data.datasets[0].data = [completedCount, startedCount, noneCount];
  chart.update();
}

function updateStudentProgressTable(completedUsernames, startedUsernames, noneUsernames){
  const maxLength = getMaxLength(completedUsernames, startedUsernames, noneUsernames);
  for (let i = 0; i < maxLength; i++) {
    let completed = getValueAtIndex(completedUsernames, i);
    let started = getValueAtIndex(startedUsernames, i);
    let none = getValueAtIndex(noneUsernames, i);
    $("#fillProgressTableBody").append(`
      <tr>
        <td data-label='Completed'>${completed}</td>
        <td data-label='Started'>${started}</td>
        <td data-label='None'>${none}</td>
      </tr>
    `);
    $('#progressTable').show();
  }
}

function updateStudentProgressText(completedCount, startedCount, noneCount){
  $('#studentProgressText').prepend(`
    <h3>${completedCount} students have completed this module.</h3>
    <h3>${startedCount} students have started but not completed this module.</h3>
    <h3>${noneCount} students have not started this module.</h3>
  `);
  $('#studentProgressText').show();
}

// Used when filling the student progress table
// Want to return an empty string if accessing an out-of-bounds index
function getValueAtIndex(array, index){
  if(array[index] === undefined){
    return "";
  } else {
    return array[index];
  }
}

// Takes exactly three lists as inputs
// Return value is used to determine number of rows in student progress table
function getMaxLength(listOne, listTwo, listThree){
  let returnValue = listOne.length;
  if(listTwo.length > returnValue){
     returnValue = listTwo.length;
  }
  if(listThree.length > returnValue){
     returnValue = listThree.length;
  }
  return  returnValue;
}

// Breaks down the progress data into three lists that indicate each user's status in a module
// Inputs:
// progressData - json, data.classModuleProgress from path /moduleProgress/:classId
// modName - string that indicates which module we want to know about
// Return values:
// completedUsers - array of the usernames of students who completed the module
// startedUsers - array of the usernames of students who started the module
// noneUsers - array of the usernames of students who have no progress the module
function getUserStatusesBreakdown(progressData, modName){
  let completedUsers = [];
  let startedUsers = [];
  let noneUsers = [];
  for (const username in progressData) {
    switch(progressData[username][modName]){
      case "completed":
        completedUsers.push(username);
        break;
      case "started":
        startedUsers.push(username);
        break;
      case "none":
        noneUsers.push(username);
        break;
      default:
        console.log("There is an error in getModuleProgressBreakdown: unrecognized status")
        console.log(modName)
        break;
    }
  }
  return [completedUsers, startedUsers, noneUsers];
}

function visualizeStudentProgressData(studentProgressChart, modName, classId){
  if (!(modName && classId)) {
    console.log('Missing a selection');
    return;
  }

  let completedUsernames = [];
  let startedUsernames = [];
  let noneUsernames = [];
  let completedCount = 0;
  let startedCount = 0;
  let noneCount = 0;

  // Clear the progress text and the progress table before inserting new data
  $('#studentProgressText').empty();
  $("#fillProgressTableBody").empty();

  $.get(`/moduleProgress/${classId}`, function(data){
    let userStatusesBreakdown = getUserStatusesBreakdown(data.classModuleProgress, modName);
    completedUsernames = userStatusesBreakdown[0];
    startedUsernames = userStatusesBreakdown[1];
    noneUsernames = userStatusesBreakdown[2];
    completedCount = completedUsernames.length;
    startedCount = startedUsernames.length;
    noneCount = noneUsernames.length;
  }).then(function() {
    updateStudentProgressText(completedCount, startedCount, noneCount);
    updateStudentProgressTable(completedUsernames, startedUsernames, noneUsernames);
    updateStudentProgressChart(studentProgressChart, completedCount, startedCount, noneCount);
  });

}

function calculateTotalActionCount(actions){
  let actionSum = 0;
  if(actions.liked){
    actionSum++;
  }
  if(actions.flagged){
    actionSum++;
  }
  if(actions.comments.length){
    actionSum++;
  }
  if(actions.modal.length){
    actionSum++;
  }
  return actionSum;
}

function getTopThreePosts(classFreeplayActions){
  const classwideTotals = {};
  for(const username in classFreeplayActions) {
    for(const actions of classFreeplayActions[username]){
      actions.totalActionCount = calculateTotalActionCount(actions);
      if(classwideTotals[actions.post]){
        classwideTotals[actions.post] = classwideTotals[actions.post] + actions.totalActionCount;
      } else {
        classwideTotals[actions.post] = actions.totalActionCount;
      }
    }
  }
  // change to array and sort
  // references:
  // https://stackoverflow.com/a/1069840
  // https://stackoverflow.com/a/38824395
  const sortableArray = Object.keys(classwideTotals).map((key) => [key, classwideTotals[key]]);
  sortableArray.sort(function(a, b) {
      return b[1] - a[1];
  });
  // from largest at [0] to third largest at [2]
  const topPosts = [sortableArray[0][0],sortableArray[1][0],sortableArray[2][0]];
  return topPosts;
}

async function visualizeFreeplayActivity(modName, classId){
  const allFreeplayContentInfo = await $.getJSON("/json/freeplaySectionQuickReference.json");
  const freeplayContentInfo = allFreeplayContentInfo[modName];
  const dbData = await $.get(`/classFreeplayActions/${classId}/${modName}`);
  const classFreeplayActions = dbData.classFreeplayActions;
  const topPosts = getTopThreePosts(classFreeplayActions);
}

$(window).on("load", async function(){
  $('#studentProgressText').hide();
  $('#progressTable').hide();
  const studentProgressChart = initializeStudentProgressChart();
  $('.refreshModSelectionButton').on('click', function(){
    let modName = ($(".ui.selection.dropdown[name='moduleSelection']").dropdown('get value'));
    let classId = ($(".ui.selection.dropdown[name='classSelection']").dropdown('get value'));
    visualizeStudentProgressData(studentProgressChart, modName, classId);
    visualizeStudentReflectionData(modName, classId);
    visualizeFreeplayActivity(modName, classId);
  });
});
