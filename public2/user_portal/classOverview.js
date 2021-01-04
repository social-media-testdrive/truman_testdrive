function setActiveMenuItem(){
  const subdirectory1 = window.location.pathname.split('/')[1];
  $('.teacherDashboardMenu .item[href$=' + subdirectory1 + ']').addClass('active');
}

$(window).on('load', function(){
  setActiveMenuItem();
  $('.ui.dropdown').dropdown();

  $.get(`/classIdList`, function(data){
    const classIdList = data.classIdList;
    for (const id of classIdList) {
     $(`<div class="item" data-value="${id}">${id}</div>`).appendTo( $('.ui.selection.dropdown[name="classSelection"] .menu') )
    }
  });

  // initialize the bar graph
  const ctx = $('#studentActivityBarChart');
  var studentActivityBarChart = new Chart(ctx, {
      type: 'bar',
      data: {
          labels: [
            'Accounts',
            'Advancedlit',
            'Cyberbullying',
            'Digfoot',
            'Digital literacy',
            'Esteem',
            'Habits',
            'Phishing',
            'Presentation',
            'Privacy',
            'Safe Posting',
            'Targeted'
          ],
          datasets: [
            {
              label: '# Started',
              data: [0,0,0,0,0,0,0,0,0,0,0,0],
              backgroundColor: 'rgba(54, 162, 235, 1)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 1,
              barPercentage: 1,
              categoryPercentage: 0.5
            },
            {
                label: '# Completed',
                data: [0,0,0,0,0,0,0,0,0,0,0,0],
                backgroundColor: 'rgba(255, 99, 132, 1)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1,
                barPercentage: 1,
                categoryPercentage: 0.5
            }
          ]
      },
      options: {
        maintainAspectRatio: false,
        scales: {
          yAxes: [{
            ticks: {
              stepSize: 1,
              beginAtZero: true
            }
          }]
        }
      }
  });

  $('.refreshSelectionButton').on('click', function(){
    let classId = ($(".ui.selection.dropdown[name='classSelection']").dropdown('get value'));
    let classSize = 0;
    let completedCounts = {};
    let startedCounts = {};
    if(classId) {
      $.get(`/moduleProgress/${classId}`, function(data){
        const moduleProgressData = data.classModuleProgress;
        classSize = getNumberOfStudents(moduleProgressData);
        startedCounts = getCountArray(moduleProgressData, 'started');
        completedCounts = getCountArray(moduleProgressData, 'completed')
      }).then(function(){
        visualizeStudentProgress(studentActivityBarChart, classSize, startedCounts, completedCounts);
      });
    } else {
      console.log('No selected class')
    }

  })
})

function getNewModNameDictionary(){
  const modNameDictionary = {
    "accounts": 0,
    "advancedlit": 0,
    "cyberbullying": 0,
    "digfoot": 0,
    "digitalliteracy": 0,
    "esteem": 0,
    "habits": 0,
    "phishing": 0,
    "presentation": 0,
    "privacy": 0,
    "safeposting": 0,
    "targeted": 0
  }
  return modNameDictionary;
}

function getCountArray(progressData, progressLabel){
  let startedCounts = getNewModNameDictionary();
  for (const username in progressData){
    for (const modName in progressData[username]) {
      if(progressData[username][modName] === progressLabel) {
        startedCounts[modName]++;
      }
    }
  }
  return startedCounts;
}

function getNumberOfStudents(progressData){
  let count = 0;
  for(const username in progressData){
    count++;
  }
  return count;
}

function visualizeStudentProgress(chart, classSize, startedCounts, completedCounts){
  chart.data.datasets[0].data = [
    startedCounts["accounts"],
    startedCounts["advancedlit"],
    startedCounts["cyberbullying"],
    startedCounts["digfoot"],
    startedCounts["digitalliteracy"],
    startedCounts["esteem"],
    startedCounts["habits"],
    startedCounts["phishing"],
    startedCounts["presentation"],
    startedCounts["privacy"],
    startedCounts["safeposting"],
    startedCounts["targeted"]
  ];
  chart.data.datasets[1].data = [
    completedCounts["accounts"],
    completedCounts["advancedlit"],
    completedCounts["cyberbullying"],
    completedCounts["digfoot"],
    completedCounts["digitalliteracy"],
    completedCounts["esteem"],
    completedCounts["habits"],
    completedCounts["phishing"],
    completedCounts["presentation"],
    completedCounts["privacy"],
    completedCounts["safeposting"],
    completedCounts["targeted"]
  ];
  chart.options.scales.yAxes[0].ticks.suggestedMin = classSize;
  chart.options.scales.yAxes[0].ticks.suggestedMax = classSize;
  chart.update();
};
