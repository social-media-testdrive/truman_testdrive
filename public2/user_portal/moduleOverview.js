function getModualProgressCount(progressData, modName, progressLabel){
  let count = 0;
  for (const username in progressData){
    if(progressData[username][modName] === progressLabel){
      count++;
    }
  }
  return count;
}

$('.refreshModSelectionButton').on('click', function(){
  let modName = ($(".ui.selection.dropdown[name='moduleSelection']").dropdown('get value'));
  let classId = ($(".ui.selection.dropdown[name='classSelection']").dropdown('get value'));
  let classSize = 0;
  let startedCount = 0;
  let completedCount = 0;
  let noneCount = 0;
  if (classId && modName) {
    $.get(`/moduleProgress/${classId}`, function(data){
      const moduleProgressData = data.classModuleProgress;
      startedCount = getModualProgressCount(moduleProgressData, modName, 'started');
      completedCount = getModualProgressCount(moduleProgressData, modName,  'completed');
      noneCount = getModualProgressCount(moduleProgressData, modName, 'none');
    }).then(function(){
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
            labels: ["Completed", "Started", "Not Started"],

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
