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

function initializeTimeBreakdownChart() {
  const ctx = $('#timeBreakdown');
  const timeBreakdownChart = new Chart(ctx, {
      type: 'bar',
      data: {
        datasets: [{
          label: '# of Students',
          data: [0,0,0,0],
          backgroundColor: 'rgba(54, 162, 235, 1)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
          barPercentage: 1,
          categoryPercentage: 0.5
        }],
        labels: ["0-10", "10-20", "20-30", "30-40"]

      },
      options: {
        title: {
          display: true,
          fontSize: 16,
          fontColor: '#000',
          text: "Time Spent To Complete This Module"
        },
        maintainAspectRatio: false,
        scales: {
          xAxes: [{
            scaleLabel: {
              display: true,
              fontSize: 14,
              fontColor: '#000',
              labelString: "Time Range (Minutes)"
            }
          }],
          yAxes: [{
            scaleLabel: {
              display: true,
              fontSize: 14,
              fontColor: '#000',
              labelString: "# of Students"
            },
            ticks: {
              stepSize: 1,
              beginAtZero: true
            }
          }]
        }
      }
  });
  return timeBreakdownChart;
}

function initializeAvgSectionTimeChart() {
  const ctx = $('#avgSectionTime');
  const avgSectionTimeChart = new Chart(ctx, {
      type: 'bar',
      data: {
        datasets: [{
          label: 'Minutes',
          data: [0,0,0,0],
          backgroundColor: 'rgba(255, 99, 132, 1)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1,
          barPercentage: 1,
          categoryPercentage: 0.5
        }],
        labels: ["Learn","Practice","Explore","Reflect"]
      },
      options: {
        title: {
          display: true,
          fontSize: 16,
          fontColor: '#000',
          text: "Avg Time Spent to Complete Each Section"
        },
        maintainAspectRatio: false,
        scales: {
          xAxes: [{
            scaleLabel: {
              display: true,
              fontSize: 14,
              fontColor: '#000',
              labelString: "Section"
            }
          }],
          yAxes: [{
            scaleLabel: {
              display: true,
              fontSize: 14,
              fontColor: '#000',
              labelString: "Avg Time (Minutes)"
            },
            ticks: {
              suggestedMin: 14,
              suggestedMax: 14,
              stepSize: 2,
              beginAtZero: true
            }
          }]
        }
      }
  });
  return avgSectionTimeChart;
}

function showPageContent(){
  if($('#studentProgressSegment ').hasClass('hiddenVisibility')){
    $('#studentProgressSegment ').removeClass('hiddenVisibility');
  }
  if($('#timeSpentSegment').hasClass('hiddenVisibility')){
    $('#timeSpentSegment').removeClass('hiddenVisibility')
  }
  if($('#studentActivtiesSegment').hasClass('hiddenVisibility')){
    $('#studentActivtiesSegment').removeClass('hiddenVisibility')
  }
}

// Determines how many students in a given class have responded to a prompt
// Inputs:
// prompt - string, exact copy of the prompt
// classReflectionResponses - json, data.classReflectionResponses from /classReflectionResponses/:classId
function countResponsesToPrompt(prompt, classReflectionResponses){
  let responseCount = 0;
  for (const username in classReflectionResponses) {
    for (let i = 0, l = classReflectionResponses[username].length; i < l; i++) {
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
function getCheckboxLabelArray(reflectionJsonData, modName, question){
  return Object.values(reflectionJsonData[modName][question].checkboxLabels)
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
    // TODO: use loop w/ break instead, better efficiency
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
          <div class="ui fluid card">
            <div class="img post">
              <img src="${cdn}${questionData.groupPostImages[itemNumber]}" style="max-width:100%">
            </div>
            <div class="content">
              <div class="description">${questionData.groupPostDescriptions[itemNumber]}</div>
            </div>
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
            scaleLabel: {
              display: true,
              fontSize: 14,
              fontColor: '#000',
              labelString: "Number of Students"
            },
            ticks: {
              stepSize: 1,
              beginAtZero: true,
              suggestedMin: studentCount,
              suggestedMax: studentCount
            }
          }],
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

function appendSectionLabels(modReflectionData){
  let written = false;
  let checkbox = false;
  let checkboxGrouped = false;
  // check which types are present
  for (const questionNumber in modReflectionData) {
    const questionData = modReflectionData[questionNumber];
    switch (questionData.type) {
      case "written": {
        written = true;
        break;
      }
      case "checkbox": {
        checkbox = true;
        break;
      }
      case "checkboxGrouped": {
        checkboxGrouped = true;
        break;
      }
    }
  }
  if(written) {
    $("#openEndedResponses").append(`
      <h3>Students' answers to the open-ended questions:</h3>
    `);
  }
  if(checkbox) {
    $("#checkboxResponses").append(`
      <h3>Students' answers to the checkbox questions:</h3>
    `);
  }
  if(checkboxGrouped) {
    $("#groupedCheckboxResponses").append(`
      <h3>Students' answers to the grouped checkbox questions:</h3>
    `);
  }
};

// returns the student count, for later convenience
async function visualizeStudentReflectionData(modName, classId, classSize){
  if (!(modName && classId)) {
    console.log('Missing a selection');
    return;
  }
  // clear any existing charts
  $("#reflectionHeading").empty();
  $("#openEndedResponses").empty();
  $("#checkboxResponses").empty();
  $("#groupedCheckboxResponses").empty();
  // append section labels
  $("#reflectionHeading").append(`
    <h2>Reflection</h2>
  `);
  const reflectionJsonData = await $.getJSON("/json/reflectionSectionData.json");
  downloadReflectionData(classId, modName);
  const dbData = await $.get(`/classReflectionResponses/${classId}`);
  const classReflectionResponses = dbData.reflectionResponses;
  //console.log(`Response data:`)
  //console.log(classReflectionResponses);
  const modReflectionData = reflectionJsonData[modName];
  appendSectionLabels(modReflectionData);
  for (const questionNumber in modReflectionData) {
    const questionData = modReflectionData[questionNumber];

    switch (questionData.type){
      case "written": {
        const responseCount = countResponsesToPrompt(questionData.prompt, classReflectionResponses);
        appendWrittenTypeHtml(questionNumber, questionData, responseCount);
        createWrittenTypeChart(questionNumber, classSize, responseCount);
        break;
      }
      case "checkbox": {
        const chartLabelArray = getCheckboxLabelArray(reflectionJsonData,modName,questionNumber);
        const numberOfCheckboxes = chartLabelArray.length;
        const checkboxData = parseClassCheckboxSelectionsForQuestion(questionNumber, numberOfCheckboxes, classReflectionResponses, modReflectionData);
        appendCheckboxTypeHtml(questionNumber, questionData);
        const chartId = `#chart${questionNumber}`;
        createCheckboxTypeChart(chartId, chartLabelArray, classSize, checkboxData);
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
          createCheckboxTypeChart(chartId, chartLabelArray, classSize, subgroupCheckboxData);
        }
        break;
      }
    }
  }
  $('#reflectionSegment .loadingDimmer').removeClass('active');
}


function updateStudentProgressChart(chart, completedCount, startedCount, noneCount){
  chart.data.datasets[0].data = [completedCount, startedCount, noneCount];
  chart.update();
}

function updateStudentProgressTable(completedUsernames, startedUsernames, noneUsernames){
  const maxLength = getMaxLength(completedUsernames, startedUsernames, noneUsernames);
  for (let i = 0; i < maxLength; i++) {
    let completed = completedUsernames[i] || "";
    let started = startedUsernames[i] || "";
    let none = noneUsernames[i] || "";
    $("#fillProgressTableBody").append(`
      <tr>
        <td data-label='Completed'>${completed}</td>
        <td data-label='Started'>${started}</td>
        <td data-label='None'>${none}</td>
      </tr>
    `);
  }
}

function updateStudentProgressText(completedCount, startedCount, noneCount){
  $('#studentProgressText').prepend(`
    <h3>${completedCount} students have completed this module.</h3>
    <h3>${startedCount} students have started but not completed this module.</h3>
    <h3>${noneCount} students have not started this module.</h3>
    <br>
    <button class="ui right labeled icon button" id="viewProgressTableButton">
      <i class="down arrow icon"></i>
      Show Details
    </button>
  `);
  $('#studentProgressText').show();
  $('#viewProgressTableButton').on('click', function(){
    $('#progressTable').transition({
      animation: 'fade down',
      onShow: function(){
        $('#viewProgressTableButton').html(`
          <i class="up arrow icon"></i>
          Hide Details
        `);
      },
      onHide: function(){
        $('#viewProgressTableButton').html(`
          <i class="down arrow icon"></i>
          Show Details
        `);
      }
    });
  });
}

// // Used when filling the student progress table
// // Want to return an empty string if accessing an out-of-bounds index
// function getValueAtIndex(array, index){
//   return array[index] || "";
//   // if(array[index] === undefined){
//   //   return "";
//   // } else {
//   //   return array[index];
//   // }
// }

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
  return returnValue;
}

// Breaks down the progress data and counts the number of students with each status
// Simultaneously updates the progress table (id #progressTable)
// Inputs:
// progressData - json, data.classModuleProgress from path /moduleProgress/:classId
// modName - string that indicates which module we want to know about
// Return values:
// completedCount - number of students who completed the module
// startedCount - number of students who started the module
// noneCount - number of students who have no progress the module
function getStatusCountsUpdateTable(progressData, modName){
  // remove dashes from modName
  modName = modName.replace('-','');
  let completedCount = 0;
  let startedCount = 0;
  let noneCount = 0;
  for (const username in progressData) {
    switch(progressData[username][modName]){
      case "completed":
        completedCount++;
        $("#fillProgressTableBody").append(`
          <tr class="center aligned">
            <td class="left aligned" data-label='Username'>${username}</td>
            <td class="positive" data-label='Completed'>
              <i class="check icon"></i>
            </td>
            <td data-label='Started'></td>
            <td data-label='None'></td>
          </tr>
        `);
        break;
      case "started":
        startedCount++;
        $("#fillProgressTableBody").append(`
          <tr class="center aligned">
            <td class="left aligned" data-label='Username'>${username}</td>
            <td data-label='Completed'></td>
            <td data-label='Started'>
              <i class="check icon"></i>
            </td>
            <td data-label='None'></td>
          </tr>
        `);
        break;
      case "none":
        noneCount++;
        $("#fillProgressTableBody").append(`
          <tr class="center aligned">
            <td class="left aligned" data-label='Username'>${username}</td>
            <td data-label='Completed'></td>
            <td data-label='Started'></td>
            <td data-label='None'>
              <i class="check icon"></i>
            </td>
          </tr>
        `);
        break;
      default:
        console.log("There is an error in getModuleProgressBreakdown: unrecognized status")
        console.log(modName)
        break;
    }
  }
  return [completedCount, startedCount, noneCount];
}

async function visualizeStudentProgressData(studentProgressChart, modName, classId){
  if (!(modName && classId)) {
    console.log('Missing a selection');
    return;
  }

  let completedCount = 0;
  let startedCount = 0;
  let noneCount = 0;

  // Clear the progress text and the progress table before inserting new data
  $('#studentProgressText').empty();

  const classModuleProgress = await $.get(`/moduleProgress/${classId}`).then(function(data){
    return data.classModuleProgress;
  });

  const userStatusesBreakdown = getStatusCountsUpdateTable(classModuleProgress, modName);
  completedCount = userStatusesBreakdown[0];
  startedCount = userStatusesBreakdown[1];
  noneCount = userStatusesBreakdown[2];

  updateStudentProgressText(completedCount, startedCount, noneCount);
  updateStudentProgressChart(studentProgressChart, completedCount, startedCount, noneCount);
  $('#studentProgressSegment .loadingDimmer').removeClass('active');
  //updateStudentProgressTable(completedUsernames, startedUsernames, noneUsernames);


}


function appendFreeplayRankingHtml(ranking, imageName, postText){
  const cdn = "https://dhpd030vnpk29.cloudfront.net";
  $("#topPosts").append(`
    <div class="row addMargin">
      <div class="ui items">
        <div class="item">
          <div class="ui fluid card">
            <div class="img post">
              <img src="${cdn}/post_pictures/${imageName}" style="max-width:100%">
            </div>
            <div class="content">
              <div class="description">${postText}</div>
            </div>
          </div>
          <div class="ui image">
            <canvas id="topPost${ranking}" width="700" height="200">
          </div>
        </div>
      </div>
    </div>
  `)
}

function updateRankingChartModalData(postId, chartLabels, chartData, freeplayContentInfo, classFreeplayActions){
  for (const modalType in freeplayContentInfo.modalInfo){
    chartLabels.push(freeplayContentInfo.modalInfo[modalType].label);
    chartData.push(0);
    const modalName = freeplayContentInfo.modalInfo[modalType].modalName;
    for(const username in classFreeplayActions) {
      for(const actions of classFreeplayActions[username]){
        if ((actions.post === postId) && actions.modal.length) {
          for(const modal of actions.modal){
            if(modal.modalName === modalName) {
              chartData[chartData.length - 1]++;
            }
          }
        }
      }
    }
  }
}

function getRankingChartBasicLabels(modName, freeplayContentInfo){
  let labelArray = ['Liked', 'Flagged', 'Replied', 'Interacted with Comments'];
  // TODO: this works, now figure out how to get the modal data
  // if(freeplayContentInfo.modals){
  //   for (const modalType in freeplayContentInfo.modalInfo){
  //     labelArray.push(freeplayContentInfo.modalInfo[modalType].label);
  //   }
  // }
  return labelArray;
}

function getRankingChartBasicData(chartLabels, postId, classFreeplayActions){
  // TODO: include modal actions
  let actionData = [];
  for (let i=0, j=chartLabels.length; i<j; i++){
    actionData.push(0);
  }
  for(const username in classFreeplayActions) {
    for(const actions of classFreeplayActions[username]){
      if (actions.post === postId) {
        if (actions.liked) {
          actionData[0]++;
        }
        if (actions.flagged) {
          actionData[1]++;
        }
        if (actions.comments.length) {
          for(const comment of actions.comments){
            if (comment.new_comment) {
              // This is a user-made comment
              actionData[2]++;
            } else {
              // This is an interaction with an existing comment
              actionData[3]++;
            }
          }
        }

      }
    }
  }
  return actionData;
}

function createFreeplayRankingChart(i, chartLabels, chartData, studentCount){
  const ctxCheckbox = $(`#topPost${i}`);
  const newChartCheckbox = new Chart(ctxCheckbox, {
      type: 'horizontalBar',
      data: {
        datasets: [{
            data: chartData,
            backgroundColor: 'rgba(54, 162, 235, 1)',
            borderColor: 'rgba(54, 162, 235, 1)',
        }],
        labels: chartLabels,
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

function calculateTotalActionCount(actions){
  let actionSum = 0;
  if(actions.liked){
    actionSum++;
  }
  if(actions.flagged){
    actionSum++;
  }
  if(actions.comments.length){
    for(const action in actions.comments){
      actionSum++;
    }
  }
  if(actions.modal.length){
    for(const modal in actions.modal) {
      actionSum++;
    }
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
  let topPosts;
  if(sortableArray.length >= 3){
    topPosts = [sortableArray[0][0],sortableArray[1][0],sortableArray[2][0]];
  } else {
    topPosts = [];
    for(let i=0; i<sortableArray.length; i++){
      topPosts.push(sortableArray[i][0]);
    }
  }
  return topPosts;
}

function appendRelevantPostHtml(relevantPosts, modName){
  const cdn = "https://dhpd030vnpk29.cloudfront.net";
  // Most modules have 3 relevant posts, but there are special cases.
  if (Object.keys(relevantPosts).length === 3) {
    // This is the standard case.
    $('#relevantPosts').append(`
      <div class="ui basic segment" style="padding:0;">
        <h3> These were the relevant posts in this module:</h3>
        <div class="ui three stackable cards" id="relevantPostsCards">
        </div>
      </div>
    `);
    for(const post of Object.values(relevantPosts)) {
      $('#relevantPostsCards').append(`
        <div class="ui fluid card">
          <div class="image">
            <img src="${cdn}/post_pictures/${post.image}" style="max-width:100%">
          </div>
          <div class="content">
            <div class="description">
              ${post.body}
            </div>
          </div>
        </div>
      `);
    }
  }
  return;
}

async function visualizeFreeplayActivity(modName, classId, classSize){
  // clear any existing data
  $("#topPosts").empty();
  $("#exploreHeading").empty();
  $('#exploreHeading').append(`
    <h2>Exploring the Timeline</h2>
  `);
  const allFreeplayContentInfo = await $.getJSON("/json/freeplaySectionQuickReference.json");
  const freeplayContentInfo = allFreeplayContentInfo[modName];
  // show the intended relevant posts for this module for easy comparison with top posts
  $('#relevantPosts').empty();
  if (Object.keys(freeplayContentInfo.relevantPosts).length) {
    appendRelevantPostHtml(freeplayContentInfo.relevantPosts, modName);
  }
  const dbData = await $.get(`/classFreeplayActions/${classId}/${modName}`);
  const classFreeplayActions = dbData.classFreeplayActions;
  const topPosts = getTopThreePosts(classFreeplayActions);
  // For each post, visualize the data
  let i = 0;
  if(!topPosts.length){
    $("#topPosts").append(`
      <h3>There has been no activity to report in the freeplay section.</h3>
    `);
    $('#exploreSegment .loadingDimmer').removeClass('active');
    return;
  }
  for(const postId of topPosts){
    const singlePostJson = await $.get(`/singlePost/${postId}`);
    const post = singlePostJson.post;
    appendFreeplayRankingHtml(i, post.picture, post.body);
    let chartLabels = getRankingChartBasicLabels(modName, freeplayContentInfo);
    let chartData = getRankingChartBasicData(chartLabels, postId, classFreeplayActions);
    if(freeplayContentInfo.modals){
      updateRankingChartModalData(postId, chartLabels, chartData, freeplayContentInfo, classFreeplayActions);
    }
    createFreeplayRankingChart(i, chartLabels, chartData, classSize);
    i++;
  }
  $('#exploreSegment .loadingDimmer').removeClass('active');
  return;
}


function updateAvgSectionTimeChart(chart, avgSectionTimeArray) {
  chart.data.datasets[0].data = avgSectionTimeArray;
  chart.update();
};

async function getAvgSectionTimeArray(classPageTimes, modName) {
  // Array for the front-end chart:
  // [0] = Learn; [1] = Practice; [2] = Explore; [3] = Reflect;
  let totalSectionTimeArray = [0,0,0,0];
  let avgSectionTimeArray = [0,0,0,0];
  switch (modName) {
    case 'cyberbullying':
    case 'digfoot':
      jsonPath = "/json/progressDataB.json";
      break;
    default:
      jsonPath = "/json/progressDataA.json";
      break;
  }
  let sectionData = await $.getJSON(jsonPath);
  let studentCount = 0;
  for (const student of classPageTimes) {
    if(student.timeArray.length){
      studentCount++;
    }
    for (const timeItem of student.timeArray) {
      if(!sectionData[timeItem.subdirectory1]){
        continue;
      }
      if(sectionData[timeItem.subdirectory1] === "end"){
        continue;
      }
      // get the index to add timeDuration to using the sectionData
      const i = sectionData[timeItem.subdirectory1] - 1;
      totalSectionTimeArray[i] = totalSectionTimeArray[i] + timeItem.timeDuration;
    }
  }
  // Totals for each section have been calculated, now calculate averages
  avgSectionTimeArray = totalSectionTimeArray.map(x => Math.round(x / studentCount));
  return avgSectionTimeArray;
};

function getTimeBreakdownArray(classPageTimes) {
  // Array for the font-end chart:
  // [0] = 0-10min; [1] = 11-20min; [2] = 21-30min; [3] = 31-40min;
  let timeBreakdownArray = [0,0,0,0];
  for (const student of classPageTimes) {
    if(student.timeArray.length === 0){
      continue;
    }
    let studentTimeMinutes = 0;
    for (const timeItem of student.timeArray) {
      studentTimeMinutes = studentTimeMinutes + timeItem.timeDuration;
    }
    (0 < studentTimeMinutes && studentTimeMinutes <= 10) ? timeBreakdownArray[0]++
    : (10 < studentTimeMinutes && studentTimeMinutes <= 20) ? timeBreakdownArray[1]++
    : (20 < studentTimeMinutes && studentTimeMinutes <= 30) ? timeBreakdownArray[2]++
    : (30 < studentTimeMinutes && studentTimeMinutes <= 40) ? timeBreakdownArray[3]++
    : console.log(`Warning: Time longer than 40 minutes recorded`);
  }
  return timeBreakdownArray;
}

function updateTimeBreakdownChart(chart, numberOfStudents, timeBreakdownArray){
  chart.options.scales.yAxes[0].ticks.suggestedMin = numberOfStudents;
  chart.options.scales.yAxes[0].ticks.suggestedMax = numberOfStudents;
  chart.data.datasets[0].data = timeBreakdownArray;
  chart.update();
};

async function visualizeTimeData(timeBreakdownChart, avgSectionTimeChart, modName, classId, classSize) {
  const classPageTimes = await $.get(`/classPageTimes/${classId}/${modName}`).then(function(data){
    return data.classPageTimes;
  });
  const numberOfStudents = Object.keys(classPageTimes).length;
  // classPageTimes only contains entries within the specified module, and only
  // includes pagetimes if student completed the module
  const timeBreakdownArray = getTimeBreakdownArray(classPageTimes)
  updateTimeBreakdownChart(timeBreakdownChart, numberOfStudents, timeBreakdownArray);
  const avgSectionTimeArray = await getAvgSectionTimeArray(classPageTimes, modName);
  updateAvgSectionTimeChart(avgSectionTimeChart, avgSectionTimeArray);
  $('#timeSpentSegment .dimmer').removeClass('active');
  return;
};


function manageConfirmButton(){
  $(".ui.selection.dropdown[name='moduleSelection']").dropdown({
    onChange: function(){
      if($(".ui.selection.dropdown[name='classSelection']").dropdown('get value')){
        $('.refreshModSelectionButton').addClass('green');
      }
    }
  });
  $(".ui.selection.dropdown[name='classSelection']").dropdown({
    onChange: function(){
      if($(".ui.selection.dropdown[name='moduleSelection']").dropdown('get value')){
        $('.refreshModSelectionButton').addClass('green');
      }
    }
  });
}

function downloadReflectionData(classId, modName){
  $('.downloadReflectionData').on('click', function(){
    window.location.href = (`/downloadReflectionResponses/${classId}/${modName}`);
  })
}

$(window).on("load", async function(){
  $('#studentProgressText').hide();
  $('#progressTable').hide();
  manageConfirmButton();
  const studentProgressChart = initializeStudentProgressChart();
  const timeBreakdownChart = initializeTimeBreakdownChart();
  const avgSectionTimeChart = initializeAvgSectionTimeChart();
  $('.refreshModSelectionButton').on('click', async function(){
    let modName = ($(".ui.selection.dropdown[name='moduleSelection']").dropdown('get value'));
    let classId = ($(".ui.selection.dropdown[name='classSelection']").dropdown('get value'));
    if(!(modName && classId)){
      return;
    }
    showPageContent();
    // appearances: clear data in the progress table, add dimmers with loading
    // icons to sections
    $('#progressTable').hide();
    $('#fillProgressTableBody').empty();
    $('.loadingDimmer').addClass('active');
    $('#timeSpentSegment .dimmer').addClass('active');
    const getClassSize = await $.get(`/classSize/${classId}`);
    const classSize = getClassSize.studentCount;
    visualizeStudentProgressData(studentProgressChart, modName, classId);
    visualizeStudentReflectionData(modName, classId, classSize);
    visualizeFreeplayActivity(modName, classId, classSize);
    visualizeTimeData(timeBreakdownChart, avgSectionTimeChart, modName, classId, classSize);
  });
});
