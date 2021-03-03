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

function createModuleCompletionCountChart(completedModules, totalModuleCount){
  const completedCount = completedModules.length;
  const incompleteCount = totalModuleCount - completedCount;
  const ctx = $('#moduleCompletionCount');
  const completedCountPieChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        datasets: [{
            data: [completedCount, incompleteCount],
            backgroundColor: [
              'rgba(250, 101, 132)'
            ]
        }],
        labels: ["Completed", "Not Complete"],
      },
      options: {
        cutoutPercentage: 70,
        maintainAspectRatio: false,
        legend: {
          display: false
        }
      }
  });
  // add the custom text in the center of the chart
  $('.completionChartColumn .customChartLabelText').text(`${completedCount} out of ${totalModuleCount} modules completed`)
  return;
}

async function addLearningMapIcons(completedModules){
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

function updateModuleStatusIcons(moduleStatuses){
  $('#moduleProgressColumn .item').each(function(){
    const modName = $(this).attr('data-itemModuleName');
    if (moduleStatuses[modName] === "completed") {
      $(this).children('.moduleProgressCustomIcon').append(`
        <i class="big circular icon star"></i>
        <h3>Completed</h3>
      `);
    } else if (moduleStatuses[modName] === "started") {
      $(this).children('.moduleProgressCustomIcon').append(`
        <i class="big circular icon star half"></i>
        <h3>Started</h3>
      `);
    }
  });
};

async function updateTimelineActions(modName){
  const timelineActions = await $.get(`/getLearnerTimelineActions/${modName}`);
  $(`#setLikeCount`).text(timelineActions.likes);
  $(`#setFlagCount`).text(timelineActions.flags);
  $(`#setReplyCount`).text(timelineActions.replies);
  return;
}

function setLearningMapColumnWidths(){
  const tableWidth = $(`#learningMapTable tbody`).width();
  const yAxisWidth = $(`#learningMapTable tbody .yAxisLabel`).first().width();
  const totalPadding = 66; // 11 * 6
  const idealColumnWidth = Math.round((tableWidth - yAxisWidth - 66) / 3);
  $(`td:not(.xAxisLabel, .yAxisLabel)`).css('width', idealColumnWidth);
}

$(window).on("load", async function() {
  const totalModuleCount = 12; // Update this number if there are ever additional modules
  const moduleNames = {
    "accounts": "Accounts and Passwords",
    "advancedlit": "Advanced News Literacy",
    "cyberbullying": "How to Be an Upstander",
    "digfoot": "Shaping Your Digital Footprint",
    "digital-literacy": "News in Social Media",
    "esteem": "The Ups and Downs of Social Media",
    "habits": "Healthy Social Media Habits",
    "phishing": "Scams and Phishing",
    "presentation": "Online Identities",
    "privacy": "Social Media Privacy",
    "safe-posting": "Is It Private Information?",
    "targeted": "Ads on Social Media"
  };
  const timePieChart = initializeModuleTimePieChart();
  $('.menu.moduleCompletionTabs .item').tab();
  const completedModules = await $.get('/getLearnerCompletedModules');
  createModuleCompletionCountChart(completedModules, totalModuleCount)
  addLearningMapIcons(completedModules);
  setLearningMapColumnWidths();
  const moduleStatuses = await $.get('/getLearnerModuleStatuses');
  updateModuleStatusIcons(moduleStatuses);
  $('.refreshModuleCompletion').on('click', async function(){
    const modName = $(this).closest('.item').attr('data-itemModuleName');
    // Update mod name
    console.log(modName)
    $('.setModName').text(moduleNames[modName]);
    const roundedSectionTimes = await $.get(`/getLearnerSectionTimeData/${modName}`);
    updatePieChartData(timePieChart, roundedSectionTimes);
    updateTimeTexts(roundedSectionTimes);
    updateTimelineActions(modName);
    $('#moduleDetailsColumn').removeClass('hideModuleDetails')
  });
});
