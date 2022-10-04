function initializeStudentActivityBarChart() {
    const ctx = $('#studentActivityBarChart');
    var studentActivityBarChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: [
                'Accounts and Passwords',
                'Responding to Breaking News!',
                'How to Be an Upstander',
                'Shaping Your Digital Footprint',
                'News in Social Media',
                'The Ups and Downs of Social Media',
                'Healthy Social Media Habits',
                'Scams and Phishing',
                'Online Identities',
                'Social Media Privacy',
                'Is It Private Information?',
                'Ads on Social Media'
            ],
            datasets: [{
                    label: ' # Started',
                    data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    backgroundColor: 'rgba(54, 162, 235, 1)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1,
                    barPercentage: 1,
                    categoryPercentage: 0.5
                },
                {
                    label: ' # Completed',
                    data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    backgroundColor: 'rgba(255, 99, 132, 1)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1,
                    barPercentage: 1,
                    categoryPercentage: 0.5
                }
            ]
        },
        options: {
            title: {
                display: true,
                fontSize: 16,
                fontColor: '#000',
                text: "Class Progress For Each Module"
            },
            maintainAspectRatio: false,
            scales: {
                xAxes: [{
                    scaleLabel: {
                        display: true,
                        fontSize: 14,
                        fontColor: '#000',
                        labelString: "Module"
                    }
                }],
                yAxes: [{
                    scaleLabel: {
                        display: true,
                        fontSize: 14,
                        fontColor: '#000',
                        labelString: "# of Students"
                    },
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

function initializeAvgTimeSpentChart() {
    const ctx = $('#avgTimeSpentBarChart');
    var avgTimeSpentBarChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: [
                'Accounts and Passwords',
                'Responding to Breaking News!',
                'How to Be an Upstander',
                'Shaping Your Digital Footprint',
                'News in Social Media',
                'The Ups and Downs of Social Media',
                'Healthy Social Media Habits',
                'Scams and Phishing',
                'Online Identities',
                'Social Media Privacy',
                'Is It Private Information?',
                'Ads on Social Media'
            ],
            datasets: [{
                label: ' Average Time (minutes)',
                data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                backgroundColor: 'rgba(54, 162, 235, 1)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
                barPercentage: 1,
                categoryPercentage: 0.5
            }]
        },
        options: {
            title: {
                display: true,
                fontSize: 16,
                fontColor: '#000',
                text: "Class Average Time Spent to Complete Each Module"
            },
            maintainAspectRatio: false,
            scales: {
                xAxes: [{
                    scaleLabel: {
                        display: true,
                        fontSize: 14,
                        fontColor: '#000',
                        labelString: "Module"
                    }
                }],
                yAxes: [{
                    scaleLabel: {
                        display: true,
                        fontSize: 14,
                        fontColor: '#000',
                        labelString: "Average Time (minutes)"
                    },
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

function manageConfirmButton() {
    $(`.ui.selection.dropdown[name='classSelection']`).dropdown({
        onChange: function() {
            $('.refreshSelectionButton').addClass('green')
        }
    })
};

function showPageContent() {
    if (!control) {
        if ($('#studentActivitySegment').hasClass('hiddenVisibility')) {
            $('#studentActivitySegment').removeClass('hiddenVisibility');
        }
        if ($('#avgTimeSegment').hasClass('hiddenVisibility')) {
            $('#avgTimeSegment').removeClass('hiddenVisibility')
        }
        if ($('#leaderboardParentSegment').hasClass('hidden')) {
            $('#leaderboardParentSegment').removeClass('hidden')
        }
    }
    if ($('#studentProgressParentSegment').hasClass('hidden')) {
        $('#studentProgressParentSegment').removeClass('hidden')
    }
}

function addLoadingIcons() {
    $(`#studentActivitySegment .dimmer`).addClass('active');
    $(`#avgTimeSegment .dimmer`).addClass('active');
    $(`#leaderboardParentSegment .loader`).addClass('active');
    $(`#studentProgressParentSegment .dimmer`).addClass('active');
};

function getNumberOfStudents(progressData) {
    let count = 0;
    for (const username in progressData) {
        count++;
    }
    return count;
}

function getNewModNameDictionary(dashes) {
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

function getCountArray(progressData, progressLabel) {
    let startedCounts = getNewModNameDictionary(false);
    for (const username in progressData) {
        for (const modName in progressData[username]) {
            if (progressData[username][modName] === progressLabel) {
                startedCounts[modName]++;
            }
        }
    }
    return startedCounts;
}

function updateChartValues(chart, classSize, startedCounts, completedCounts) {
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
    // remove loading icon
    $(`#studentActivitySegment .dimmer`).removeClass('active');
};

function updateAvgTimeChartValues(chart, yAxisScale, avgTimesArray) {
    chart.options.scales.yAxes[0].ticks.suggestedMin = yAxisScale;
    chart.options.scales.yAxes[0].ticks.suggestedMax = yAxisScale;
    chart.data.datasets[0].data = avgTimesArray;
    chart.update();
}

function getYAxisScale(modTimeInfo) {
    let largestValue = 0;
    let yAxisScale = 0;
    for (const mod of modTimeInfo) {
        if (mod.avgTime > largestValue) {
            largestValue = mod.avgTime;
        }
    }
    // take largest avg value, then round up to the nearest multiple of 5
    yAxisScale = (Math.ceil(largestValue / 5)) * 5;
    return yAxisScale;
}

function getAvgTimeArray(modTimeInfo) {
    let avgTimesArray = [];
    for (const mod of modTimeInfo) {
        avgTimesArray.push(mod.avgTime);
    }
    return avgTimesArray;
}

function getTimeInfo(classPageTimes) {
    let modDurations = {
        "accounts": { "totalTime": 0, "studentCount": 0, "avgTime": 0 },
        "advancedlit": { "totalTime": 0, "studentCount": 0, "avgTime": 0 },
        "cyberbullying": { "totalTime": 0, "studentCount": 0, "avgTime": 0 },
        "digfoot": { "totalTime": 0, "studentCount": 0, "avgTime": 0 },
        "digital-literacy": { "totalTime": 0, "studentCount": 0, "avgTime": 0 },
        "esteem": { "totalTime": 0, "studentCount": 0, "avgTime": 0 },
        "habits": { "totalTime": 0, "studentCount": 0, "avgTime": 0 },
        "phishing": { "totalTime": 0, "studentCount": 0, "avgTime": 0 },
        "presentation": { "totalTime": 0, "studentCount": 0, "avgTime": 0 },
        "privacy": { "totalTime": 0, "studentCount": 0, "avgTime": 0 },
        "safe-posting": { "totalTime": 0, "studentCount": 0, "avgTime": 0 },
        "targeted": { "totalTime": 0, "studentCount": 0, "avgTime": 0 },
    };
    for (const modName of Object.keys(modDurations)) {
        for (const student of classPageTimes) {
            let studentTotalModTime = 0;
            let addStudentToCount = false;
            for (const timeItem of student.timeArray) {
                // don't include time durations that are longer than 20 minutes
                // TODO: inform and consult with team about this cutoff.
                if ((timeItem.subdirectory2 === modName) && (timeItem.timeDuration <= 20)) {
                    studentTotalModTime = studentTotalModTime + timeItem.timeDuration;
                    // only add student to studentCount if they have a page log for the relevant mod
                    addStudentToCount = true;
                }
            }
            modDurations[modName].totalTime = modDurations[modName].totalTime + studentTotalModTime;
            if (addStudentToCount) {
                modDurations[modName].studentCount++;
            }
        }
    }
    // get average times
    for (const modName of Object.keys(modDurations)) {
        const totalTime = modDurations[modName].totalTime;
        const studentCount = modDurations[modName].studentCount;
        if (totalTime && studentCount) {
            // round up to nearest whole minute
            const avgTime = Math.ceil(totalTime / studentCount);
            modDurations[modName].avgTime = avgTime;
        }
    }
    return Object.values(modDurations);
}

function visualizeAvgTimeSpentData(avgTimeSpentChart, classPageTimes) {
    const modTimeInfo = getTimeInfo(classPageTimes);
    const yAxisScale = getYAxisScale(modTimeInfo)
    const avgTimesArray = getAvgTimeArray(modTimeInfo);
    updateAvgTimeChartValues(avgTimeSpentChart, yAxisScale, avgTimesArray);
    $(`#avgTimeSegment .dimmer`).removeClass('active');
    return;
}

function updateLeaderboardTableHtml(finalLeaderboardData) {
    $('#leaderboardSegment').append(`
      <table class="ui single lined table">
        <thead>
          <tr>
            <th>Ranking</th>
            <th>Username</th>
            <th class='centerText-override'>Modules Completed</th>
            <th class='centerText-override'>Avg Time Spent per Module</th>
            <th class='centerText-override'>Modules Started</th>
            <th class='centerText-override'>Last Accessed</th>
          </tr>
        </thead>
        <tbody id="studentReportTable"></tbody>
      </table>
    `);
    const numberOfStudents = finalLeaderboardData.length;
    const maxRanking = numberOfStudents < 5 ? numberOfStudents : 5;
    let i = 0;
    while (i < maxRanking) {
        const rowData = finalLeaderboardData[i];
        const rankingText = i + 1;
        $(`#studentReportTable`).append(`
          <tr>
            <td>${rankingText}</td>
            <td>${rowData.username}</td>
            <td class='centerText-override'>${rowData.completed}</td>
            <td class='centerText-override'>${rowData.avgTime ? Math.round(rowData.avgTime) + " minutes": "N/A"}</td>
            <td class='centerText-override'>${rowData.started}</td>
            <td class='centerText-override'>${rowData.lastVisited ? humanized_time_span(rowData.lastVisited) : ""}</td>
          </tr>
        `);
        i++;
    }
    return;
}

function getFinalLeaderboardData(moduleProgressData, classPageTimes) {
    let finalLeaderboardData = [];
    for (const student of classPageTimes) {
        let tableRowData = {};
        tableRowData['username'] = student.username;
        // get status counts
        let completedCount = 0;
        let startedCount = 0;
        for (const key of Object.keys(moduleProgressData[student.username])) {
            if (moduleProgressData[student.username][key] === "completed") {
                completedCount++;
            } else if (moduleProgressData[student.username][key] === "started") {
                startedCount++;
            }
        }
        tableRowData['completed'] = completedCount;
        tableRowData['started'] = startedCount;
        // get average time spent per completed module
        const studentIndex = Object.keys(classPageTimes).find(key => classPageTimes[key].username === student.username);
        const modNameList = Object.keys(moduleProgressData[student.username]);
        let totalTime = 0;
        for (const modName of modNameList) {
            if (moduleProgressData[student.username][modName] === "completed") {
                for (const timeItem of classPageTimes[studentIndex].timeArray) {
                    if (timeItem.subdirectory2 && (timeItem.subdirectory2 === modName)) {
                        totalTime = totalTime + timeItem.timeDuration;
                    }
                }
            }
        }
        let avgTimePerModule = 0;
        if (completedCount > 0) {
            avgTimePerModule = Math.round(totalTime / completedCount);
        }
        tableRowData['avgTime'] = avgTimePerModule;
        // get most recent visit time
        let mostRecentVisit = 0;
        for (const timeItem of classPageTimes[studentIndex].timeArray) {
            let dateObj = new Date(timeItem.timeOpened);
            if (!mostRecentVisit) {
                mostRecentVisit = dateObj;
            } else if (mostRecentVisit < dateObj) {
                mostRecentVisit = dateObj;
            }
        }
        tableRowData['lastVisited'] = mostRecentVisit;
        finalLeaderboardData.push(tableRowData);
    }
    // all data calculated, sort in descending order by number of modules completed
    // From MDN docs: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
    finalLeaderboardData.sort(function(a, b) {
            return b.completed - a.completed;
        })
        // take only the first 5 entries
    if (finalLeaderboardData.length > 5) {
        finalLeaderboardData.slice(0, 5);
    }
    return finalLeaderboardData;
};

function visualizeLeaderboard(moduleProgressData, classPageTimes) {
    $('#leaderboardSegment').empty();
    let finalLeaderboardData = getFinalLeaderboardData(moduleProgressData, classPageTimes);
    // remove loading icon
    $('#leaderboardParentSegment .loader').removeClass('active');
    updateLeaderboardTableHtml(finalLeaderboardData);
}

function getStatusIcon(status) {
    switch (status) {
        case "completed":
            return `<i class="check circle big icon green"></i>`;
        case "started":
            return `<i class="clock big icon yellow"></i>`;
        default:
            return `<div></div>`;
    }
}

function updateStudentProgressTableHtml(finalStudentProgressData) {
    $('#studentProgressTable').empty();
    for (const student of finalStudentProgressData) {
        $(`#studentProgressTable`).append(`
          <tr>
            <td>${student.username}</td>
            ${student.module !== undefined ? "<td class='centerText-override'>"+getStatusIcon(student.module)+"</td>" : ""}
            <td class='centerText-override'>${getStatusIcon(student.survey1)}</td>
            <td class='centerText-override'>${getStatusIcon(student.extendedfp)}</td>
            <td class='centerText-override'>${getStatusIcon(student.survey2)}</td>
          </tr>
        `);
    }
    return;
}

function getFinalStudentProgressData(moduleProgressData) {
    let finalStudentProgressData = [];
    for (const student of Object.keys(moduleProgressData)) {
        let tableRowData = {};
        tableRowData['username'] = student;
        // get status counts
        let completedCount = 0;
        for (const mod of Object.keys(moduleProgressData[student])) {
            tableRowData[mod] = moduleProgressData[student][mod];
            if (moduleProgressData[student][mod] === "completed") {
                completedCount++;
            }
        }
        tableRowData['completed'] = completedCount;
        finalStudentProgressData.push(tableRowData);
    }
    // all data calculated, sort in descending order by number of modules completed
    // From MDN docs: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
    finalStudentProgressData.sort(function(a, b) {
        return b.completed - a.completed;
    });
    return finalStudentProgressData;
};

function visualizeStudentProgressData(moduleProgressData) {
    let finalStudentProgressData = getFinalStudentProgressData(moduleProgressData);
    // remove loading icon
    $('#studentProgressParentSegment .dimmer').removeClass('active');
    $('#studentProgressParentSegment .loaderRow').remove();
    updateStudentProgressTableHtml(finalStudentProgressData);
}

$(window).on('load', async function() {
    let studentActivityBarChart;
    let avgTimeSpentChart;
    if (!control) {
        studentActivityBarChart = initializeStudentActivityBarChart();
        avgTimeSpentChart = initializeAvgTimeSpentChart();
    }
    manageConfirmButton();
    $('.refreshSelectionButton').on('click', async function() {
        const classId = ($(".ui.selection.dropdown[name='classSelection']").dropdown('get value'));
        if (!classId) {
            return;
        }
        showPageContent();
        addLoadingIcons();
        const moduleProgressData = await $.get(`/moduleProgress/${classId}`).then(function(data) {
            return data.classModuleProgress;
        });
        const classPageTimes = await $.get(`/classPageTimes/${classId}`).then(function(data) {
            return data.classPageTimes;
        });
        const assignedModuleProgressData = await $.get(`/assignedModuleProgress/${classId}`).then(function(data) {
            return data.classAssignedModuleProgress;
        });
        if (!control) {
            visualizeStudentActivityData(studentActivityBarChart, moduleProgressData);
            visualizeAvgTimeSpentData(avgTimeSpentChart, classPageTimes);
            visualizeLeaderboard(moduleProgressData, classPageTimes);
        }
        visualizeStudentProgressData(assignedModuleProgressData);
    })
})