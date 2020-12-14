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

$('.refreshModSelectionButton').on('click', function(){
  let modName = ($(".ui.selection.dropdown[name='moduleSelection']").dropdown('get value'));
  let classId = ($(".ui.selection.dropdown[name='classSelection']").dropdown('get value'));
  let completedUsernames = [];
  let startedUsernames = [];
  let noneUsernames = [];
  let completedCount = 0;
  let startedCount = 0;
  let noneCount = 0;

  if (classId && modName) {
    $("#fillProgressTable").empty();
    $.get(`/moduleProgress/${classId}`, function(data){
      let userStatusesArrays = getModuleProgressUserBreakdown(data.classModuleProgress, modName);
      completedUsernames = userStatusesArrays[0];
      startedUsernames = userStatusesArrays[1];
      noneUsernames = userStatusesArrays[2];
      completedCount = completedUsernames.length;
      startedCount = startedUsernames.length;
      noneCount = noneUsernames.length;
    }).then(function() {
      const maxLength = getMaxLength(completedUsernames, startedUsernames, noneUsernames);
      for (let i = 0; i < maxLength; i++) {
        let completed = getValueAtIndex(completedUsernames, i);
        let started = getValueAtIndex(startedUsernames, i);
        let none = getValueAtIndex(noneUsernames, i);
        $("#fillProgressTable").append(`
          <tr>
            <td data-label='Completed'>${completed}</td>
            <td data-label='Started'>${started}</td>
            <td data-label='None'>${none}</td>
          </tr>
        `);
      }

      const ctx = $('#studentProgress');
      var myChart = new Chart(ctx, {
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
})
