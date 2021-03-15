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
      <div class="column">
        <div class="ui basic segment center aligned">
          <div class="ui tiny image">
            <img src="/badges/${badge.image}"></img>
          </div>
          <div class="content middle aligned">
            <p>${badge.title}</p>
          </div>
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

// Used with the old design for the module completion section - remove after
// new design is approved
function updateModuleStatusList(allModuleGeneralData){
  $('#moduleProgressColumn .item').each(function(){
    const modName = $(this).attr('data-itemModuleName');
    // set the icon depending on module status
    if (allModuleGeneralData[modName].status === "completed") {
      $(this).children('.moduleProgressCustomIcon').append(`
        <i class="big circular icon check"></i>
        <h3>Completed</h3>
      `);
    } else if (allModuleGeneralData[modName].status === "started") {
      $(this).children('.moduleProgressCustomIcon').append(`
        <i class="big circular icon hourglass outline"></i>
        <h3>Started</h3>
      `);
    }
    // set the last accessed info
    if(allModuleGeneralData[modName].lastAccessed !== 0) {
      $(this).find('.description p').text(`Last accessed ${humanized_time_span(allModuleGeneralData[modName].lastAccessed)}`)
    }
  });
};

function updateModuleStatus(moduleGeneralData){
  $('#moduleStatus .moduleProgressCustomIcon').empty();
  // set the icon depending on module status
  if (moduleGeneralData.status === "completed") {
    $('#moduleStatus .moduleProgressCustomIcon').append(`
      <i class="huge circular icon check"></i>
      <h2>Completed</h2>
    `);
  } else if (moduleGeneralData.status === "started") {
    $('#moduleStatus .moduleProgressCustomIcon').append(`
      <i class="huge circular icon hourglass outline"></i>
      <h2>Started</h2>
    `);
  } else {
    $('#moduleStatus .moduleProgressCustomIcon').append(`
      <i class="huge circular icon minus"></i>
      <h2>Not Started</h2>
    `);
  }

  // set the last accessed info
  if(moduleGeneralData.lastAccessed !== 0) {
    console.log(`set last accessed...`)
    $('#moduleStatus .description h3').text(`Last accessed ${humanized_time_span(moduleGeneralData.lastAccessed)}`)
  }
}

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
  $('.ui.dropdown').dropdown();
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
  $('#modSelectDropdown').dropdown({
    onChange: function(){
      const modName = $('#modSelectDropdown').dropdown('get value');
      const roundedSectionTimes = [
        allRoundedSectionTimes[modName].learn,
        allRoundedSectionTimes[modName].practice,
        allRoundedSectionTimes[modName].explore,
        allRoundedSectionTimes[modName].reflect
      ]
      const singleModuleGeneralData = moduleGeneralData[modName];
      // Update displayed mod name
      $('.setModName').text(fullModuleNames[modName]);
      updateModuleStatus(singleModuleGeneralData);
      updatePieChartData(timePieChart, roundedSectionTimes);
      updateTimeTexts(roundedSectionTimes);
      updateTimelineActions(modName, moduleGeneralData);
    }
  });
  // Used with the old design for the module completion section - remove after
  // new design is approved
  // updateModuleStatusList(moduleGeneralData);
  // $('.refreshModuleCompletion').on('click', async function(){
  //   const modName = $(this).closest('.item').attr('data-itemModuleName');
  //   const roundedSectionTimes = [
  //     allRoundedSectionTimes[modName].learn,
  //     allRoundedSectionTimes[modName].practice,
  //     allRoundedSectionTimes[modName].explore,
  //     allRoundedSectionTimes[modName].reflect
  //   ]
  //   // Update displayed mod name
  //   $('.setModName').text(fullModuleNames[modName]);
  //   updatePieChartData(timePieChart, roundedSectionTimes);
  //   updateTimeTexts(roundedSectionTimes);
  //   updateTimelineActions(modName, moduleGeneralData);
  //   // module details are initially hidden on window load, unhide
  //   $('#moduleDetailsColumn').removeClass('hideModuleDetails')
  // });
});
