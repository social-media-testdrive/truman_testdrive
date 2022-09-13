function createModuleCompletionCountChart(completedModules, totalModuleCount) {
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

async function appendEarnedBadges() {
    const cdn = "https://dhpd030vnpk29.cloudfront.net";
    const earnedBadges = await $.get('/getLearnerEarnedBadges');
    for (const badge of earnedBadges) {
        $(`#badgeItems`).append(`
        <div class="column">
          <div class="ui basic segment center aligned">
            <div class="ui tiny image">
              <img src="${cdn}/badge_images/${badge.image}"></img>
            </div>
            <div class="content middle aligned">
              <p>${badge.title}</p>
            </div>
          </div>
        </div>
      `);
    }
}


$(window).on("load", async function() {
    const totalModuleCount = 12;
    const moduleGeneralData = await $.get('/getLearnerGeneralModuleData');
    let completedModules = [];
    for (const modName of Object.keys(moduleGeneralData)) {
        if (moduleGeneralData[modName].status === "completed") {
            completedModules.push(modName);
        }
    }
    createModuleCompletionCountChart(completedModules, totalModuleCount);
    appendEarnedBadges();
});