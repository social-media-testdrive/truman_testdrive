// chart initialization/creation

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

// "My Achievement" section

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
        tooltips: {
          enabled: false
        },
        legend: {
          display: false
        }
      }
  });
  // add the custom text in the center of the chart
  $('.completionChartColumn .customChartLabelText').text(`${completedCount} out of ${totalModuleCount} modules completed`)
  return;
}

async function appendEarnedBadges(){
  const earnedBadges = await $.get('/getLearnerEarnedBadges');
  for(const badge of earnedBadges) {
    $(`#badgeItems`).append(`
      <div class="item">
        <div class="ui tiny image">
          <img src="/badges/${badge.image}"></img>
        </div>
        <div class="content middle aligned">
          <p>${badge.title}</p>
        </div>
      </div>
    `);
  }
}

// "Learning Map" section

function setLearningMapColumnWidths(){
  const tableWidth = $(`#learningMapTable tbody`).width();
  const yAxisWidth = $(`#learningMapTable tbody .yAxisLabel`).first().width();
  const totalPadding = 66; // 11 * 6
  const idealColumnWidth = Math.round((tableWidth - yAxisWidth - 66) / 3);
  $(`td:not(.xAxisLabel, .yAxisLabel)`).css('width', idealColumnWidth);
}

async function addLearningMapIcons(completedModules){
  for(const modName of completedModules) {
    $(`#learningMapTable .container[data-mapTableMod="${modName}"]`).append(`
      <i class="icon large white circular icon check">
    `);
  }
};

// "Module Completion" section: module details tabs

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

async function updateTimelineActions(modName, moduleGeneralData){
  $(`#setLikeCount`).text(moduleGeneralData[modName].likes);
  $(`#setFlagCount`).text(moduleGeneralData[modName].flags);
  $(`#setReplyCount`).text(moduleGeneralData[modName].replies);
  return;
}

// "Module Completion" section: module list

function updateModuleStatusList(moduleGeneralData){
  $('#moduleProgressColumn .item').each(function(){
    const modName = $(this).attr('data-itemModuleName');
    // set the icon depending on module status
    if (moduleGeneralData[modName].status === "completed") {
      $(this).children('.moduleProgressCustomIcon').append(`
        <i class="big circular icon check"></i>
        <h3>Completed</h3>
      `);
    } else if (moduleGeneralData[modName].status === "started") {
      $(this).children('.moduleProgressCustomIcon').append(`
        <i class="big circular icon hourglass outline"></i>
        <h3>Started</h3>
      `);
    }
    // set the last accessed info
    if(moduleGeneralData[modName].lastAccessed !== 0) {
      $(this).find('.description p').text(`Last accessed ${humanized_time_span(moduleGeneralData[modName].lastAccessed)}`)
    }
  });
};

$(window).on("load", async function() {
  const totalModuleCount = 12;
  const fullModuleNames = {
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
  const moduleGeneralData = await $.get('/getLearnerGeneralModuleData');
  const allRoundedSectionTimes = await $.get(`/getLearnerSectionTimeData`);
  $('.menu.moduleCompletionTabs .item').tab();
  let completedModules = [];
  for (const modName of Object.keys(moduleGeneralData)){
    if(moduleGeneralData[modName].status === "completed") {
      completedModules.push(modName);
    }
  }
  createModuleCompletionCountChart(completedModules, totalModuleCount);
  appendEarnedBadges();
  addLearningMapIcons(completedModules);
  setLearningMapColumnWidths();
  updateModuleStatusList(moduleGeneralData);
  $('.refreshModuleCompletion').on('click', async function(){
    const modName = $(this).closest('.item').attr('data-itemModuleName');
    const roundedSectionTimes = [
      allRoundedSectionTimes[modName].learn,
      allRoundedSectionTimes[modName].practice,
      allRoundedSectionTimes[modName].explore,
      allRoundedSectionTimes[modName].reflect
    ]
    // Update displayed mod name
    $('.setModName').text(fullModuleNames[modName]);
    updatePieChartData(timePieChart, roundedSectionTimes);
    updateTimeTexts(roundedSectionTimes);
    updateTimelineActions(modName, moduleGeneralData);
    // module details are initially hidden on window load, unhide
    $('#moduleDetailsColumn').removeClass('hideModuleDetails')
  });
});
