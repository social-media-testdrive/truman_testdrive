async function updateModuleProgressStarted(modName) {
    let status;
    if (modName === 'survey-1' || modName === 'survey-2') {
        status = 'completed';
    } else {
        status = 'started';
    }
    await $.post("/moduleProgress", {
        module: modName,
        status: status,
        _csrf: $('meta[name="csrf-token"]').attr('content')
    });
}

function addCompletedModuleCard(cdn, modName, cardInfo) {
    const htmlToAppend = `
      <div class="ui card inactiveCard">
        <div class="image">
        <div class="ui huge green ribbon label inactiveCardLabel">Completed!</div>
          <img class="inactiveCardImage" src=${cdn}/${cardInfo.image}></img>
        </div>
        <div class="content">
          <div class="header">
            ${cardInfo.title}
          </div>
        </div>
      </div>
    `;
    return htmlToAppend;
}

function addActiveModuleCard(cdn, modName, cardInfo) {
    const htmlToAppend = `
      <a class="ui card ${cardInfo.type}" href="${cardInfo.url}" ${cardInfo.type === "link"? "id="+modName : ""}>
        <div class="image">
          <img src=${cdn}/${cardInfo.image}></img>
        </div>
        <div class="content">
          <div class="header">
            ${cardInfo.title}
          </div>
        </div>
      </a>
    `;
    return htmlToAppend;
}

function addUpcomingModuleCard(cdn, modName, cardInfo) {
    const htmlToAppend = `
      <a class="ui card inactiveCard" data-content="${cardInfo.string}" data-position="bottom left">
        <div class="image">
          <div class="ui huge blue ribbon label inactiveCardLabel">Available Soon</div>
          <img class="inactiveCardImage" src=${cdn}/${cardInfo.image}></img>
        </div>
        <div class="content">
          <div class="header">
            ${cardInfo.title}
          </div>
        </div>
      </a>
    `;
    return htmlToAppend;
}

function addActiveStartedModuleCard(cdn, modName, cardInfo) {
    let htmlToAppend = "";
    htmlToAppend = `
     <a class="ui card ${cardInfo.type}" href="${cardInfo.url}" ${cardInfo.type === "link"? "id="+modName : ""}>
       <div class="image">
         <img src=${cdn}/${cardInfo.image}></img>
       </div>
       <div class="content">
         <div class="header">
           ${cardInfo.title}
         </div>
       </div>
     </a>
   `;
    return htmlToAppend;
}

async function showVisibleModules(visibleModules) {
    const surveyParameters = await $.get('/surveyParameters');
    const cdn = "https://dhpd030vnpk29.cloudfront.net";

    // Survey dictionary 
    const surveyDictionary = {
        "survey-1": {
            "phishing": `https://cornell.yul1.qualtrics.com/survey-builder/SV_egJPIvhZQ8eJjgi/edit?GroupCode=${surveyParameters.classCode}&Username=${surveyParameters.username}`,
            "cyberbullying": `https://cornell.yul1.qualtrics.com/survey-builder/SV_8hKlrhnpuimJFwq/edit?GroupCode=${surveyParameters.classCode}&Username=${surveyParameters.username}`,
            "digital-literacy": `https://cornell.yul1.qualtrics.com/survey-builder/SV_0BrtbQGXJDHzxdk/edit?GroupCode=${surveyParameters.classCode}&Username=${surveyParameters.username}`
        },
        "survey-2": {
            "phishing": `https://cornell.ca1.qualtrics.com/jfe/form/SV_ekXVMiHv0016UfA?GroupCode=${surveyParameters.classCode}&Username=${surveyParameters.username}`,
            "cyberbullying": `https://cornell.ca1.qualtrics.com/jfe/form/SV_6gvfzZ9lbnmeMoC?GroupCode=${surveyParameters.classCode}&Username=${surveyParameters.username}`,
            "digital-literacy": `https://cornell.ca1.qualtrics.com/jfe/form/SV_cuMDJCaay8x3lKm?GroupCode=${surveyParameters.classCode}&Username=${surveyParameters.username}`

        }
    }

    // Module card dictionary
    const moduleCardDictionary = {
        "phishing": {
            "image": "phishing.png",
            "title": "Scams and Phishing",
            "string": "Click to start this module.",
            "url": "/intro/phishing",
            "type": "module"
        },
        "cyberbullying": {
            "image": "upstander.png",
            "title": "How to Be an Upstander",
            "string": "Click to start this module.",
            "url": "/intro/cyberbullying",
            "type": "module"
        },
        "digital-literacy": {
            "image": "news.png",
            "title": "News in Social Media",
            "string": "Click to start this module.",
            "url": "/intro/digital-literacy",
            "type": "module"
        },
        "survey-1": {
            "image": "post_pictures/outcome-eval-3/survey.jpg",
            "title": "Knowledge Assessment Survey",
            "string": "Complete the module first to start this survey.",
            "url": `${surveyDictionary["survey-1"][surveyParameters.module]}`,
            "type": "link"
        },
        "extended-fp": {
            "image": "post_pictures/outcome-eval-3/extendedfp.jpg",
            "title": "Behavioral Assessment",
            "string": "Come back again later to explore this timeline.",
            "url": "/modual/extended-fp",
            "type": "link"
        },
        "survey-2": {
            "image": "post_pictures/outcome-eval-3/survey.jpg",
            "title": "Behavioral Assessment Survey",
            "string": "Come back again later to start this survey.",
            "url": `${surveyDictionary["survey-2"][surveyParameters.module]}`,
            "type": "link"
        }
    };
    let activeModulesHtmlToAppend = "";
    let inactiveModulesHtmlToAppend = "";
    for (const mod of visibleModules) {
        const cardInfo = moduleCardDictionary[mod.name];
        switch (mod.status) {
            case "active":
                {
                    activeModulesHtmlToAppend += addActiveModuleCard(cdn, mod.name, cardInfo)
                    break;
                }
            case "completed":
                {
                    inactiveModulesHtmlToAppend += addCompletedModuleCard(cdn, mod.name, cardInfo)
                    break;
                }
            case "started":
                {
                    activeModulesHtmlToAppend += addActiveStartedModuleCard(cdn, mod.name, cardInfo)
                    break;
                }
            case "upcoming":
                {
                    activeModulesHtmlToAppend += addUpcomingModuleCard(cdn, mod.name, cardInfo);
                    break;
                }
            default:
                {
                    // do not show the module
                }
        }
    }
    $('.activeModules').append(activeModulesHtmlToAppend)
    $('.inactiveModules').append(inactiveModulesHtmlToAppend)
    $('.ui.card').popup();
}

$(window).on('load', async function() {
    const visibleModules = await $.get('/getVisibleModules');
    await showVisibleModules(visibleModules);
    // Determine if the "next module" section should be hidden in favor of a
    // "no modules remaining" success message
    const pastModuleCardCount = $('.inactiveModulesSegment .card').length;
    if (pastModuleCardCount > 0) {
        $('.inactiveModulesSegment h2').removeClass('setVisibilityHidden');
    }
    if (pastModuleCardCount === visibleModules.length) {
        $('.activeModuleSegment').addClass('setDisplayNone');
        $('.noModsRemainingMessage').removeClass('setDisplayNone');
    }
    // For extended-fp card
    // When clicked, update moduleProgress to "started"
    $('.ui.card.link').click(async function(e) {
        e.preventDefault();
        const id = $(this).attr('id');
        const url = $(this).attr('href');
        await updateModuleProgressStarted(id);
        window.location.href = url;
    });
});