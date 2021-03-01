function initializeModuleProgressCharts(){
  $(`#moduleProgressColumn .item canvas`).each(function(){
    const ctx = $(this);
    const timePieChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
          datasets: [{
              data: [50,50],
              backgroundColor: [
                'rgba(250, 101, 132)'
              ]
          }],
          labels: ["Completed","not completed"],
        },
        options: {
          maintainAspectRatio: false,
          legend: {
            display: false
          }
        }
    });
  });
}

function initializeModuleTimePieChart() {
  const ctx = $('#moduleTimePieChart');
  const timePieChart = new Chart(ctx, {
      type: 'pie',
      data: {
        datasets: [{
            data: [0,0,0,0],
            backgroundColor: [
              'rgba(254, 153, 35)',
              'rgba(22, 137, 252)',
              'rgba(250, 101, 132)',
              'rgba(229, 0, 39)'
            ]
        }],
        labels: ["Learn","Practice","Explore","Reflect"],
      },
      options: {
        maintainAspectRatio: false,
        legend: {
          display: false
        }
      }
  });
  return timePieChart;
}

async function addLearningMapIcons(){
  const completedModules = await $.get('/getLearnerCompletedModules');
  for(const modName of completedModules) {
    $(`#learningMapTable .container[data-mapTableMod="${modName}"]`).append(`
      <i class="icon large white circular icon check">
    `);
  }
};


function updatePieChartData(chart, data) {
  chart.data.datasets[0].data = data;
  chart.update();
  return;
}

function updateTimeTexts(roundedSectionTimes) {
  // get the total time
  let totalTime = 0;
  for (const i in roundedSectionTimes) {
    totalTime += roundedSectionTimes[i];
    $(`#setSection${i}Time`).text(roundedSectionTimes[i]);
  }
  $(`#setTotalTime`).text(totalTime);
  return;
}


$(window).on("load", async function() {
  const timePieChart = initializeModuleTimePieChart();
  $('.menu.moduleCompletionTabs .item').tab();
  addLearningMapIcons();
  initializeModuleProgressCharts();
  $('.refreshModuleCompletion').on('click', async function(){
    const modName = $(this).closest('.item').attr('data-itemModuleName');
    // Update mod name
    $('.setModName').text(modName);
    const roundedSectionTimes = await $.get(`/getLearnerSectionTimeData/${modName}`);
    updatePieChartData(timePieChart, roundedSectionTimes);
    updateTimeTexts(roundedSectionTimes);
  });
});
