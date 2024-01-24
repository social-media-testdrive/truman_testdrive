// chart initialization/creation

function initializeModuleTimePieChart() {
    const ctx = $('#moduleTimePieChart');
    const timePieChart = new Chart(ctx, {
        type: 'pie',
        data: {
            datasets: [{
                data: [0, 0, 0, 0],
                backgroundColor: [
                    'rgba(254, 153, 35)',
                    'rgba(22, 137, 252)',
                    'rgba(250, 101, 132)',
                    'rgba(229, 0, 39)'
                ]
            }],
            labels: ["Learn", "Practice", "Explore", "Reflect"],
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

async function updateTimelineActions(modName, moduleGeneralData) {
    $(`#setLikeCount`).text(moduleGeneralData[modName].likes);
    $(`#setFlagCount`).text(moduleGeneralData[modName].flags);
    $(`#setReplyCount`).text(moduleGeneralData[modName].replies);
    return;
}

// "Module Completion" section: module status

function updateModuleStatus(modName, moduleGeneralData) {
    $('#moduleStatus .moduleProgressCustomIcon').empty();
    $('#moduleStatus .description h3').empty();
    // set the icon depending on module status
    if (moduleGeneralData.status === "completed") {
        $('#moduleStatus .moduleProgressCustomIcon').append(`
      <i class="huge circular icon check completedIcon"></i>
      <h2>Completed</h2>
    `);
    } else if (moduleGeneralData.status === "started") {
        $('#moduleStatus .moduleProgressCustomIcon').append(`
      <i class="huge circular icon hourglass outline startedIcon"></i>
      <h2>Started</h2>
    `);
    } else {
        $('#moduleStatus .moduleProgressCustomIcon').append(`
      <i class="huge circular icon play notStartedIcon"></i>
      <h2>Not Started</h2>
    `);
    }

    // Set the link location for the "return to module" button
    $('#returnToModuleButton').off();
    $('#returnToModuleButton').on('click', function() {
            window.location.href = `/intro/${modName}`;
        })
        // show the button to go back to the module if hidden
    if ($('#returnToModuleButton').hasClass('setDisplayNone')) {
        $('#returnToModuleButton').removeClass('setDisplayNone');
    }
    // set the last accessed info
    if (moduleGeneralData.lastAccessed !== 0) {
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

    $('.menu.moduleCompletionTabs .item').tab();
    let completedModules = [];
    for (const modName of Object.keys(moduleGeneralData)) {
        if (moduleGeneralData[modName].status === "completed") {
            completedModules.push(modName);
        }
    }
    $('#modSelectDropdown').dropdown({
        onChange: function() {
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
            updateModuleStatus(modName, singleModuleGeneralData);
            updatePieChartData(timePieChart, roundedSectionTimes);
            updateTimeTexts(roundedSectionTimes);
            updateTimelineActions(modName, moduleGeneralData);
            if (singleModuleGeneralData.status === "none") {
                // hide the tabs if the module has not been started
                $('#moduleDetailsColumn').addClass('hiddenVisibility');
            } else {
                // show the tabs if they were hidden
                $('#moduleDetailsColumn').removeClass('hiddenVisibility');
            }
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