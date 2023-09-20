// for json file reading
const fs = require('fs');
const util = require('util');

// Promisify the readFile method
fs.readFileAsync = util.promisify(fs.readFile);

/**
 * GET /
 * Courses page.
 */
exports.index = (req, res) => {
  res.render('courses', {
    title: 'Courses'
  });
};


/**
 * GET /courses/:modId/intro
 * Render the intro page for a specific module.
 */
// exports.moduleIntro = (req, res) => {
//   const modId = req.params.modId;
//   const introPath = `${modId}/intro/${modId}_intro`;

//   res.render(introPath, {
//     title: 'Intro'
//   });
// };

/**
 * GET /intro/:page?/:modId
 * Render the intro pages for the module.
 */
exports.getIntro = (req, res) => {
  const modId = req.params.modId;
  const pageNum = req.params.page;
  
  const introPage = `${modId}/intro/${modId}_intro${pageNum || ''}`;
  const title = 'Intro';

  res.render(introPage, { title });
};


/**
 * GET /challenge/:page?/:modId
 * Render the challenge page for the module.
 */
exports.getChallenge = async (req, res) => {
  const modId = req.params.modId;
  const pageNum = req.params.page;
  // console.log("MOD ID: ", modId);
  // console.log(typeof modId);
  // console.log("PAGE NUM: ", pageNum);
  // console.log(typeof pageNum);
  // console.log("******************************")
  const title = 'Challenge';
  // console.log("DIRNAME: ", __dirname);

  // render the quiz else the normal page
  if(modId === "identity" && parseInt(pageNum) === 2) {
    // console.log("IN THE IF*********************")
    let quizData;
    let modID = "identity";
    let currentSection = "challenge";
    let page = "challenge2";
    let backLink = "/challenge/identity";
    let nextLink = "/challenge/3/identity";
    let progress = 8;

    // __dirname is the directory of the current module. Here it is to courses.js instead of app.js so we need to go up one directory
    const data = await fs.readFileAsync(`${__dirname}/../public/json/` +  req.params.modId + `/challenge.json`);
    quizData = JSON.parse(data.toString());
    // console.log("QUIZ DATA: ", quizData);

    const currentTime = getCurrentTime();
    const currentDate = getCurrentDate();
    res.render('dart-quiz-template.pug', {
        title: 'Challenge',
        quizData,
        modID,
        currentSection,
        page,
        backLink,
        nextLink,
        progress,
        currentTime,
        currentDate
    });
  } else {
    const introPage = `${modId}/challenge/${modId}_challenge${pageNum || ''}`;

    res.render(introPage, { title });
  }
};


/**
 * GET /learn/(submod|submod2|submod3)/:page?/:modId
 * Render the learn pages for the module.
 */
exports.getLearn = async (req, res) => {
  const submod = req.params.submod;
  const modId = req.params.modId;
  const pageNum = req.params.page;
  console.log("***submod is: ", submod);
  // console.log("MOD ID: ", modId);
  // console.log(typeof modId);
  // console.log("PAGE NUM: ", pageNum);
  // console.log(typeof pageNum);
  // console.log("******************************")
  const title = 'Learn';
  // console.log("DIRNAME: ", __dirname);

  // render the quiz page (1 for each submod) else the normal pages
  if(modId === "identity" && submod === "submod" && parseInt(pageNum) === 6) {
    let quizData;
    let modID = "identity";
    let currentSection = "submodOne";
    let page = "sub_learn6";
    let backLink = "/learn/submod/5/identity";
    let nextLink = "/learn/submod/7/identity";
    let progress = 22;

    // __dirname is the directory of the current module. Here it is to courses.js instead of app.js so we need to go up one directory
    const data = await fs.readFileAsync(`${__dirname}/../public/json/` +  req.params.modId + `/submod.json`);
    quizData = JSON.parse(data.toString());

    const currentTime = getCurrentTime();
    const currentDate = getCurrentDate();
    res.render('dart-quiz-template.pug', {
        title: 'Quiz',
        quizData,
        modID,
        currentSection,
        page,
        backLink,
        nextLink,
        progress,
        currentTime,
        currentDate
    });
  } else if(modId === "identity" && submod === "submod2" && parseInt(pageNum) === 14) {
    let quizData;
    let modID = "identity";
    let currentSection = "submodTwo";
    let page = "sub2_learn14";
    let backLink = "/learn/submod2/13/identity";
    let nextLink = "/learn/submod2/15/identity";
    let progress = 55;

    const data = await fs.readFileAsync(`${__dirname}/../public/json/` +  req.params.modId + `/submodTwo.json`);
    quizData = JSON.parse(data.toString());

    const currentTime = getCurrentTime();
    const currentDate = getCurrentDate();
    const futureDate = getFutureDate();

    res.render('dart-quiz-template.pug', {
      title: 'Quiz',
      quizData,
      modID,
      currentSection,
      page,
      backLink,
      nextLink,
      progress,
      currentTime,
      currentDate,
      futureDate
    });
  } else if(modId === "identity" && submod === "submod3" && parseInt(pageNum) === 11) {
    let quizData;
    let modID = "identity";
    let currentSection = "submodThree";
    let page = "sub3_learn11";
    let backLink = "/learn/submod3/10/identity";
    let nextLink = "/learn/submod3/12/identity";
    let progress = 55;

    const data = await fs.readFileAsync(`${__dirname}/../public/json/` +  req.params.modId + `/submodThree.json`);
    quizData = JSON.parse(data.toString());

    const currentTime = getCurrentTime();
    const currentDate = getCurrentDate();

    res.render('dart-quiz-template.pug', {
      title: 'Quiz',
      quizData,
      modID,
      currentSection,
      page,
      backLink,
      nextLink,
      progress,
      currentTime,
      currentDate
    });
  } else if(modId === "identity" && submod === "submod3" && pageNum === "activity") {
      res.render(`${modId}/learn/submod3/${modId}_sub3_activity`, {
        title: 'Activity'
      });  
  } else {
      let learnPage;

      if(submod === "submod") {
        learnPage = `${modId}/learn/submod/${modId}_sub_learn${pageNum || ''}`;
      } else if(submod === "submod2") {
        learnPage = `${modId}/learn/submod2/${modId}_sub2_learn${pageNum || ''}`;
      } else if(submod === "submod3") {
        learnPage = `${modId}/learn/submod3/${modId}_sub3_learn${pageNum || ''}`;
      }
    
      res.render(learnPage, { title });
  }

};

/**
 * GET /explore/:page?/:modId
 * Render the explore pages for the module.
 */
exports.getExplore = (req, res) => {
  const modId = req.params.modId;
  const pageNum = req.params.page;
  
  const explorePage = `${modId}/explore/${modId}_explore${pageNum || ''}`;
  const title = 'Explore';

  res.render(explorePage, { title });
};






// time helper functions


// get time for phone text message like: 12:48 PM 
// actually have 32 minutes in the past
function getCurrentTime() {
  // get time 5 - 240 minutes ago
  const now = new Date();
  const randomMinutes = Math.floor(Math.random() * (240 - 5 + 1)) + 5; // Generate a random number between 5 and 240
  const pastTime = new Date(now.getTime() - randomMinutes * 60 * 1000); // Subtract random minutes in milliseconds
  // const options = { hour: 'numeric', minute: '2-digit', hour12: true };
  const estOptions = { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: 'America/New_York' };
  return pastTime.toLocaleString('en-US', estOptions);
}

// get date for emails like: 8/10/2023
function getCurrentDate() {
  const now = new Date();
  const options = { month: 'numeric', day: 'numeric', year: 'numeric', timeZone: 'America/New_York' };
  return now.toLocaleString('en-US', options);
}

function getFutureDate() {
  // get date a week from the current date for the scam quiz emails 
  // for example if currentDate is 8/19/2023 this function will return 8/26/2023
  const today = new Date();
  const oneWeekLater = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
  
  const options = { month: 'numeric', day: 'numeric', year: 'numeric', timeZone: 'America/New_York' };
  return oneWeekLater.toLocaleString('en-US', options);
}




/**
 * GET /challenge/:modId
 * Render the challenge page for the module.
 */
// exports.getChallenge = async (req, res) => {
//   const modId = req.params.modId;
//   const challengePage = `${modId}/challenge/${modId}_challenge${req.params.page || ''}`;
//   const title = 'Challenge';

//   // You can add additional logic here if needed (e.g., loading quiz data)

//   const currentTime = getCurrentTime();
//   const currentDate = getCurrentDate();

//   res.render(challengePage, { title, currentTime, currentDate });
// };