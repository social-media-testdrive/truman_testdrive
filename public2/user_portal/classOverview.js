function initializeStudentActivityBarChart(){
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
  return studentActivityBarChart;
}

function initializeAvgTimeSpentChart(){
  const ctx = $('#avgTimeSpentBarChart');
  var avgTimeSpentBarChart = new Chart(ctx, {
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
              label: 'Class Average',
              data: [0,0,0,0,0,0,0,0,0,0,0,0],
              backgroundColor: 'rgba(54, 162, 235, 1)',
              borderColor: 'rgba(54, 162, 235, 1)',
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
  return avgTimeSpentBarChart;
}

function getNumberOfStudents(progressData){
  let count = 0;
  for(const username in progressData){
    count++;
  }
  return count;
}

function getNewModNameDictionary(dashes){
  let modNameDictionary;
  if (dashes) {
    modNameDictionary = {
      "accounts": 0,
      "advancedlit": 0,
      "cyberbullying": 0,
      "digfoot": 0,
      "digital-literacy": 0,
      "esteem": 0,
      "habits": 0,
      "phishing": 0,
      "presentation": 0,
      "privacy": 0,
      "safe-posting": 0,
      "targeted": 0
    };
  } else {
    modNameDictionary = {
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
    };
  }
  return modNameDictionary;
}

function getCountArray(progressData, progressLabel){
  let startedCounts = getNewModNameDictionary(false);
  for (const username in progressData){
    for (const modName in progressData[username]) {
      if(progressData[username][modName] === progressLabel) {
        startedCounts[modName]++;
      }
    }
  }
  return startedCounts;
}

function updateChartValues(chart, classSize, startedCounts, completedCounts){
  chart.options.scales.yAxes[0].ticks.suggestedMin = classSize;
  chart.options.scales.yAxes[0].ticks.suggestedMax = classSize;
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
  chart.update();
};

function visualizeStudentActivityData(chart, moduleProgressData) {
  let classSize = 0;
  let completedCounts = {};
  let startedCounts = {};
  classSize = getNumberOfStudents(moduleProgressData);
  startedCounts = getCountArray(moduleProgressData, 'started');
  completedCounts = getCountArray(moduleProgressData, 'completed');
  updateChartValues(chart, classSize, startedCounts, completedCounts);
};

function updateAvgTimeChartValues(chart, yAxisScale, avgTimesArray){
  chart.options.scales.yAxes[0].ticks.suggestedMin = yAxisScale;
  chart.options.scales.yAxes[0].ticks.suggestedMax = yAxisScale;
  chart.data.datasets[0].data = avgTimesArray;
  chart.update();
}

function getYAxisScale(modTimeInfo){
  let largestValue = 0;
  let yAxisScale = 0;
  for(const mod of modTimeInfo){
    if (mod.avgTime > largestValue) {
      largestValue = mod.avgTime;
    }
  }
  // take largest avg value, then round up to the nearest multiple of 5
  yAxisScale = (Math.ceil(largestValue/5))*5;
  return yAxisScale;
}

function getAvgTimeArray(modTimeInfo) {
  let avgTimesArray = [];
  for(const mod of modTimeInfo){
    avgTimesArray.push(mod.avgTime);
  }
  return avgTimesArray;
}

function getTimeInfo(classPageTimes){
  let modDurations = {
    "accounts": {"totalTime":0,"studentCount":0,"avgTime":0},
    "advancedlit": {"totalTime":0,"studentCount":0,"avgTime":0},
    "cyberbullying": {"totalTime":0,"studentCount":0,"avgTime":0},
    "digfoot": {"totalTime":0,"studentCount":0,"avgTime":0},
    "digital-literacy": {"totalTime":0,"studentCount":0,"avgTime":0},
    "esteem": {"totalTime":0,"studentCount":0,"avgTime":0},
    "habits": {"totalTime":0,"studentCount":0,"avgTime":0},
    "phishing": {"totalTime":0,"studentCount":0,"avgTime":0},
    "presentation": {"totalTime":0,"studentCount":0,"avgTime":0},
    "privacy": {"totalTime":0,"studentCount":0,"avgTime":0},
    "safe-posting": {"totalTime":0,"studentCount":0,"avgTime":0},
    "targeted": {"totalTime":0,"studentCount":0,"avgTime":0},
  };
  for(const modName of Object.keys(modDurations)){
    for(const student of classPageTimes){
      let studentTotalModTime = 0;
      let addStudentToCount = false;
      for(const timeItem of student.timeArray){
        // don't include time durations that are longer than 20 minutes
        // TODO: inform and consult with team about this cutoff.
        if((timeItem.subdirectory2 === modName) && (timeItem.timeDuration <= 20)) {
          studentTotalModTime = studentTotalModTime + timeItem.timeDuration;
          // only add student to studentCount if they have a page log for the relevant mod
          addStudentToCount = true;
        }
      }
      modDurations[modName].totalTime = modDurations[modName].totalTime + studentTotalModTime;
      if(addStudentToCount){
        modDurations[modName].studentCount++;
      }
    }
  }
  // get average times
  for(const modName of Object.keys(modDurations)){
    const totalTime = modDurations[modName].totalTime;
    const studentCount = modDurations[modName].studentCount;
    if(totalTime && studentCount){
      // round up to nearest whole minute
      const avgTime = Math.ceil(totalTime / studentCount);
      modDurations[modName].avgTime = avgTime;
    }
  }
  return Object.values(modDurations);
}


function visualizeAvgTimeSpentData(avgTimeSpentChart, classPageTimes){
  const modTimeInfo = getTimeInfo(classPageTimes);
  const yAxisScale = getYAxisScale(modTimeInfo)
  const avgTimesArray = getAvgTimeArray(modTimeInfo);
  updateAvgTimeChartValues(avgTimeSpentChart, yAxisScale, avgTimesArray);
  return;
}


$(window).on('load', async function(){
  const studentActivityBarChart = initializeStudentActivityBarChart();
  const avgTimeSpentChart = initializeAvgTimeSpentChart();
  $('.refreshSelectionButton').on('click', async function(){
    const classId = ($(".ui.selection.dropdown[name='classSelection']").dropdown('get value'));
    if(!classId) {
      return;
    }
    const moduleProgressData = await $.get(`/moduleProgress/${classId}`).then(function(data){
      return data.classModuleProgress;
    });
    const classPageTimes = await $.get(`/classPageTimes/${classId}`).then(function(data){
      return data.classPageTimes;
    });
    visualizeStudentActivityData(studentActivityBarChart, moduleProgressData);
    visualizeAvgTimeSpentData(avgTimeSpentChart, classPageTimes);
  })
})
