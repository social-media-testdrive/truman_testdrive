function getModuleProgressUserBreakdown(progressData, modName){
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
        console.log("There is an error in getModuleProgressUserBreakdown: unrecognized status")
        break;
    }
  }
  return [completedUsers, startedUsers, noneUsers];
}

function getValueAtIndex(array, index){
  if(array[index] === undefined){
    return "";
  } else {
    return array[index];
  }
}

// Can assume that there will always be exactly three lists
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

$('#studentProgressText').hide();
$('#progressTable').hide();

function visualizeStudentProgressData(modName, classId){
  let completedUsernames = [];
  let startedUsernames = [];
  let noneUsernames = [];
  let completedCount = 0;
  let startedCount = 0;
  let noneCount = 0;

  if (classId && modName) {
    $('#studentProgressText').empty();
    $("#fillProgressTableBody").empty();
    $.get(`/moduleProgress/${classId}`, function(data){
      let userStatusesArrays = getModuleProgressUserBreakdown(data.classModuleProgress, modName);
      completedUsernames = userStatusesArrays[0];
      startedUsernames = userStatusesArrays[1];
      noneUsernames = userStatusesArrays[2];
      completedCount = completedUsernames.length;
      startedCount = startedUsernames.length;
      noneCount = noneUsernames.length;
    }).then(function() {
      $('#studentProgressText').prepend(`
        <h3>${completedCount} students have completed this module.</h3>
        <h3>${startedCount} students have started but not completed this module.</h3>
        <h3>${noneCount} students have not started this module.</h3>
      `);
      $('#studentProgressText').show();
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

      const ctx = $('#studentProgress');
      const myChart = new Chart(ctx, {
          type: 'doughnut',
          data: {
            datasets: [{
                data: [completedCount, startedCount, noneCount],
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
    });
  } else {
    console.log('Missing a selection')
  }
}

function countOccurrenceAcrossStudents(prompt, classReflectionResponses){
  let occurrenceCount = 0;
  for (const username in classReflectionResponses) {
    for (let i = 0; i < classReflectionResponses[username].length; i++) {
      if (classReflectionResponses[username][i].prompt === prompt) {
        // for written repsonses, only count it if not a blank response
        if (classReflectionResponses[username][i].type === 'written'){
          if (classReflectionResponses[username][i].writtenResponse !== ''){
            occurrenceCount++;
          }
        }
      }
    }
  }
  return occurrenceCount;
}

function getStudentCount(classReflectionResponses){
  let studentCount = 0;
  for (const username in classReflectionResponses){
    studentCount++;
  }
  return studentCount;
}

async function visualizeStudentReflectionData(modName, classId){
  $("#openEndedResponses").empty();
  $("#openEndedResponses").append(`
    <h4> Students' answers to the open-ended questions:</h4>
  `)
  const reflectionJsonData = await $.getJSON("/json/reflectionSectionData.json");
  console.log(reflectionJsonData)
  const dbData = await $.get(`/classReflectionResponses/${classId}`);
  const classReflectionResponses = dbData.reflectionResponses;
  console.log(`Response data:`)
  console.log(classReflectionResponses);
  const studentCount = getStudentCount(classReflectionResponses);
  console.log(`Student count: ${studentCount}`);
  const modReflectionData = reflectionJsonData[modName];
  for (const questionNumber in modReflectionData) {
    const questionData = modReflectionData[questionNumber];
    const occurrenceCount = countOccurrenceAcrossStudents(questionData.prompt, classReflectionResponses);
    console.log(`Occurence count for prompt:\n${questionData.prompt}\n${occurrenceCount}`);
    switch (questionData.type){
      case "written":
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
                  <h4>${occurrenceCount} students answered this question</h4>
                </div>
              </div>
            </div>
          </div>
        `)
        const ctx = $(`#chart${questionNumber}`);
        const studentCountDifference = studentCount - occurrenceCount;
        const newChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
              datasets: [{
                  data: [occurrenceCount, studentCountDifference],
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
        break;
    }



  }
}


$(window).on("load", async function(){
  $('.refreshModSelectionButton').on('click', function(){
    let modName = ($(".ui.selection.dropdown[name='moduleSelection']").dropdown('get value'));
    let classId = ($(".ui.selection.dropdown[name='classSelection']").dropdown('get value'));
    visualizeStudentProgressData(modName, classId);
    visualizeStudentReflectionData(modName, classId);

  });
});
