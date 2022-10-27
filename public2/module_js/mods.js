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
      <div class="ui card inactiveCard ${cardInfo.week === "Week 1:"? "blue" : "red"}">
        <div class="image">
          <div class="ui huge green ribbon label inactiveCardLabel">Completed!</div>
          <img class="inactiveCardImage" src=${cdn}/${cardInfo.image}></img>
        </div>
        <div class="content">
          <div class="header">
            <span class="underlineText">${cardInfo.week}</span><br/>
            ${cardInfo.title}
          </div>
        </div>
      </div>
    `;
    return htmlToAppend;
}

function addActiveModuleCard(cdn, modName, cardInfo) {
    const htmlToAppend = `
      <a class="ui card ${cardInfo.type} ${cardInfo.week === "Week 1:"? "blue" : "red"}" href="${cardInfo.url}" ${cardInfo.type === "link"? "id="+modName : ""}>
        <div class="image">
          <img src=${cdn}/${cardInfo.image}></img>
        </div>
        <div class="content">
          <div class="header">
            <span class="underlineText">${cardInfo.week}</span><br/>
            ${cardInfo.title}
          </div>
        </div>
      </a>
    `;
    return htmlToAppend;
}

function addUpcomingModuleCard(cdn, modName, cardInfo) {
    const htmlToAppend = `
      <a class="ui card inactiveCard ${cardInfo.week === "Week 1:"? "blue" : "red"}" data-content="${cardInfo.string}" data-position="bottom left">
        <div class="image">
          <div class="ui huge ${cardInfo.week === "Week 1:"? "blue" : "red"} ribbon label inactiveCardLabel">Available Soon</div>
          <img class="inactiveCardImage" src=${cdn}/${cardInfo.image}></img>
        </div>
        <div class="content">
          <div class="header">
            <span class="underlineText">${cardInfo.week}</span><br/>
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
     <a class="ui card ${cardInfo.type} ${cardInfo.week === "Week 1:"? "blue" : "red"}" href="${cardInfo.url}" ${cardInfo.type === "link"? "id="+modName : ""}>
       <div class="image">
         <img src=${cdn}/${cardInfo.image}></img>
       </div>
       <div class="content">
         <div class="header">
            <span class="underlineText">${cardInfo.week}</span><br/>
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
    const surveyDictionary = surveyParameters.control ? {
        "survey-1": {
            "cyberbullying": `https://cornell.ca1.qualtrics.com/jfe/form/SV_4GXxnU4ywZNfdRQ?GroupCode=${surveyParameters.classCode}&Username=${surveyParameters.username}`,
            "digital-literacy": `https://cornell.ca1.qualtrics.com/jfe/form/SV_eQkBjBUd0Bq9T8O?GroupCode=${surveyParameters.classCode}&Username=${surveyParameters.username}`,
            "phishing": `https://cornell.ca1.qualtrics.com/jfe/form/SV_ezIwjZf2SGIMPga?GroupCode=${surveyParameters.classCode}&Username=${surveyParameters.username}`,
        },
        "survey-2": {
            "cyberbullying": `https://cornell.ca1.qualtrics.com/jfe/form/SV_5attrGlv4XnEWZU?GroupCode=${surveyParameters.classCode}&Username=${surveyParameters.username}`,
            "digital-literacy": `https://cornell.ca1.qualtrics.com/jfe/form/SV_5ikqADXFG1rMZWC?GroupCode=${surveyParameters.classCode}&Username=${surveyParameters.username}`,
            "phishing": `https://cornell.ca1.qualtrics.com/jfe/form/SV_bmaUpHZrUnPZeFE?GroupCode=${surveyParameters.classCode}&Username=${surveyParameters.username}`

        }
    } : {
        "survey-1": {
            "cyberbullying": `https://cornell.ca1.qualtrics.com/jfe/form/SV_8GKWzWokVMdqQd0?GroupCode=${surveyParameters.classCode}&Username=${surveyParameters.username}`,
            "digital-literacy": `https://cornell.ca1.qualtrics.com/jfe/form/SV_09BYaQ2qOasR57o?GroupCode=${surveyParameters.classCode}&Username=${surveyParameters.username}`,
            "phishing": `https://cornell.ca1.qualtrics.com/jfe/form/SV_bC8Eye9nUWhpMwK?GroupCode=${surveyParameters.classCode}&Username=${surveyParameters.username}`
        },
        "survey-2": {
            "cyberbullying": `https://cornell.ca1.qualtrics.com/jfe/form/SV_4VL4vrYiSb4wBy6?GroupCode=${surveyParameters.classCode}&Username=${surveyParameters.username}`,
            "digital-literacy": `https://cornell.ca1.qualtrics.com/jfe/form/SV_dbDsPdswnhrzase?GroupCode=${surveyParameters.classCode}&Username=${surveyParameters.username}`,
            "phishing": `https://cornell.ca1.qualtrics.com/jfe/form/SV_6sWIX6dIAepeRZY?GroupCode=${surveyParameters.classCode}&Username=${surveyParameters.username}`
        }
    };

    // Module card dictionary
    const moduleCardDictionary = {
        "phishing": {
            "image": "phishing.png",
            "week": "Week 1:",
            "title": "Scams and Phishing",
            "string": "Click to start this module.",
            "url": "/intro/phishing",
            "type": "module"
        },
        "cyberbullying": {
            "image": "upstander.png",
            "week": "Week 1:",
            "title": "How to Be an Upstander",
            "string": "Click to start this module.",
            "url": "/intro/cyberbullying",
            "type": "module"
        },
        "digital-literacy": {
            "image": "news.png",
            "week": "Week 1:",
            "title": "News in Social Media",
            "string": "Click to start this module.",
            "url": "/intro/digital-literacy",
            "type": "module"
        },
        "survey-1": {
            "image": "post_pictures/outcome-eval-3/survey.jpg",
            "week": "Week 1:",
            "title": "Survey",
            "string": "Complete the module first to start this survey.",
            "url": `${surveyDictionary["survey-1"][surveyParameters.module]}`,
            "type": "link"
        },
        "extended-fp": {
            "image": "post_pictures/outcome-eval-3/extendedfp.jpg",
            "week": "Week 2:",
            "title": "Explore the Timeline",
            "string": "Come back again later to explore this timeline.",
            "url": "/modual/extended-fp",
            "type": "link"
        },
        "survey-2": {
            "image": "post_pictures/outcome-eval-3/survey.jpg",
            "week": "Week 2:",
            "title": "Survey",
            "string": "Complete Exploring The Timeline to start this survey.",
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
    // When clicked, update moduleProgress to "completed"
    $('.ui.card.link').click(async function(e) {
        e.preventDefault();
        const id = $(this).attr('id');
        const url = $(this).attr('href');
        await updateModuleProgressStarted(id);
        window.location.href = url;
    });
});