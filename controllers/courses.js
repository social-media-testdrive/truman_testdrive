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
  // console.log("***submod is: ", submod);
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
      const currentTime = getCurrentTime();
      const currentDate = getCurrentDate();
  
      if(submod === "submod") {
        learnPage = `${modId}/learn/submod/${modId}_sub_learn${pageNum || ''}`;
      } else if(submod === "submod2") {
        learnPage = `${modId}/learn/submod2/${modId}_sub2_learn${pageNum || ''}`;
      } else if(submod === "submod3") {
        learnPage = `${modId}/learn/submod3/${modId}_sub3_learn${pageNum || ''}`;
      }
    
      res.render(learnPage, { title, currentTime, currentDate });
  }

};

/**
 * GET /explore/:page?/:modId
 * Render the explore pages for the module.
 */
exports.getExplore = (req, res) => {
  const modId = req.params.modId;
  const pageNum = req.params.page;

  if(parseInt(pageNum) === 3) {
    const currentDate = new Date();
    const currentTime = getCurrentTime();

    const oneDayAgo = new Date(currentDate.getTime() - 24 * 60 * 60 * 1000);
    const twoDaysAgo = new Date(currentDate.getTime() - 24 * 2 * 60 * 60 * 1000);
    const threeDaysAgo = new Date(currentDate.getTime() - 24 * 3 * 60 * 60 * 1000);
    const fourDaysAgo = new Date(currentDate.getTime() - 24 * 4 * 60 * 60 * 1000);

    const emails = [
      { index: 0, sender: "Agent Intrepid", subject: "Great Job!", date: currentTime, from:"<intrepid@gmail.com>", content: "<p>Hello, </p><p>Just wanted to let you know you're doing great!</p><p>Best,</p><p>Agent Intrepid</p>", replyHeader: "good", replyContent: "Replying is okay because this email is legitimate and can be trusted.", blockHeader: "warning", blockContent: "Blocking the sender is not needed for this email because it comes from a legitimate source and can be trusted.", reportHeader: "warning", reportContent: "Reporting as a scam is not needed for this email because it comes from a legitimate source and can be trusted.", deleteHeader: "warning", deleteContent: "Deleting is not needed for this email because it comes from a legitimate source and can be trusted." },
      { index: 1, sender: "Walmart", subject: "URGENT!", date: formatDate(oneDayAgo), from:"<walmrt@gmail.com>", content: "<p>Hi customer. This is an URGENT message!</p><p>Your payment was declined on a recent purchase. Resubmit your credit card details at this link below within 24 hours.</p><p>Click here NOW! <a class='fakeLink' onclick='linkClick()'>http://jdksj6879sh.com</a></p>", replyHeader: "warning", replyContent: "This email is indicative of an identity theft scam. Replying to the email is dangerous! The safe options would be to block sender, report scam, or delete the email. We can look into why this is a scam.", blockHeader: "good", blockContent: "Blocking this sender is correct because this email is indicative of an identity theft scam. You could also report or delete the email.", reportHeader: "good", reportContent: "Reporting this email is correct because this email is indicative of an identity theft scam. You could also block the sender or delete the email.", deleteHeader: "good", deleteContent: "Deleting this email is correct because this email is indicative of an identity theft scam. You could also block the sender or report it as a scam." },
      { index: 2, sender: "irs gov", subject: "Identity Verification", date: formatDate(oneDayAgo), from:"<irsgov@gmail.com>", content: "<p>Dear Tax Payer,</p><p>We’ve noticed your account information is missing orincorrect. We need to verify your account information to file your Tax Refund.</p><p>Please follow <a class='fakeLink' onclick='linkClick()'>this link</a> to verify your info.</p><p>Thanks,</p><p>IRS Team <br> 2016 IRS All right reserved.</p><img src='/images/irs.png' alt='irs logo' width='50px'><p>IMPORTANT NOTE: If you receive this message in spam or junk it is a result of your network provider.</p>", replyHeader: "warning", replyContent: "This email is indicative of an identity theft scam. Replying to the email is dangerous! The safe options would be to block sender, report scam, or delete the email. We can look into why this is a scam.", blockHeader: "good", blockContent: "Blocking this sender is correct because this email is indicative of an identity theft scam. You could also report or delete the email.", reportHeader: "good", reportContent: "Reporting this email is correct because this email is indicative of an identity theft scam. You could also block the sender or delete the email.", deleteHeader: "good", deleteContent: "Deleting this email is correct because this email is indicative of an identity theft scam. You could also block the sender or report it as a scam."},
      { index: 3, sender: "Dropbox", subject: "New Sign In Detected", date: formatDate(twoDaysAgo), from:"<no-reply@dropbox.com>", content: "<img class='ui tiny centered image' src='/images/Dropbox_logo.svg' /><br /><p>We noticed you logged into dropbox using <b> Chrome on Windows 10 </b> 12:39 PM GMT-04:00 from <b> Orlando Florida, USA. </b></p><p><b> Note: </b> Your location may be inaccurate since it was estimated using your IP address.</p><p>You can check on this and other login events by visiting your <a class='fakeLink' onclick='linkClick()'>account page</a></p><p>Happy Dropboxing!</p><p>The Dropbox Team</p><p>P.S. Learn how to <a class='fakeLink' onclick='linkClick()'>protect your account</a></p>", replyHeader: "good", replyContent: "Replying is okay because this email is legitimate and can be trusted. We can look into why this is not a scam.", blockHeader: "warning", blockContent: "Blocking the sender is not needed for this email because it comes from a legitimate source and can be trusted. We can look into why this is not a scam.", reportHeader: "warning", reportContent: "Reporting as a scam is not needed for this email because it comes from a legitimate source and can be trusted. We can look into why this is not a scam.", deleteHeader: "warning", deleteContent: "Deleting is not needed for this email because it comes from a legitimate source and can be trusted. We can look into why this is not a scam." },
      { index: 4, sender: "NCCUstudent", subject: "Re: Hi-- Favor", date: formatDate(twoDaysAgo), from:"<joeBren@gmail.com>", content: "<p>How are you doing? Hope you and your family are safe and healthy? I was wondering if I can get a quick favor from you.</p><p>I am sorry for any inconvenience this will cost you, i am suposed to call you but my phone is bad. I got bad news this morning that I lost a childhood friend to the deadly COVID-19. I want to support the struggling family with a small donation. So, I was going to ask if you could kindly help e send out a donation to them anytime you can today, I’ll refund as soon as I get back.</p><p>I want to donate $500. Can you help me get the donation sent directly to their Cash App account?</p><p>Thanks, God Bless you.</p><p>Joe Bren</p>", replyHeader: "warning", replyContent: "This email is indicative of an identity theft scam. Replying to the email is dangerous! The safe options would be to block sender, report scam, or delete the email. We can look into why this is a scam.", blockHeader: "good", blockContent: "Blocking this sender is correct because this email is indicative of an identity theft scam. You could also report or delete the email.", reportHeader: "good", reportContent: "Reporting this email is correct because this email is indicative of an identity theft scam. You could also block the sender or delete the email.", deleteHeader: "good", deleteContent: "Deleting this email is correct because this email is indicative of an identity theft scam. You could also block the sender or report it as a scam." },
      { index: 5, sender: "iPhone 14", subject: "Congrats!", date: formatDate(threeDaysAgo), from:"<4kbug82ob@hotmail.com>", content: "<div id='iphone-email'><div class='ui basic center aligned segment'><h1 class='iphone-header font'> iPhone 14 Tester</h1><h2 class='font' id='congrats'> Congratulations</h2><h3 class='font'> YOU HAVE BEEN SELECTED TO GET OUR EXCLUSIVE REWARD</h3><h3 class='font'> You simply need to answer a few Quick questions regarding your experience with us to get a brand- new <span class='pink-text font'> iPhone 14 Pro</span></h3><br /><br /><button class='ui big font button fakeLink' id='confirmButton' onclick='linkClick()'>CONTINUE FOR FREE &gt;&gt;</button><br /><br /></div></div>", replyHeader: "warning", replyContent: "This email is indicative of an identity theft scam. Replying to the email is dangerous! The safe options would be to block sender, report scam, or delete the email. We can look into why this is a scam.", blockHeader: "good", blockContent: "Blocking this sender is correct because this email is indicative of an identity theft scam. You could also report or delete the email.", reportHeader: "good", reportContent: "Reporting this email is correct because this email is indicative of an identity theft scam. You could also block the sender or delete the email.", deleteHeader: "good", deleteContent: "Deleting this email is correct because this email is indicative of an identity theft scam. You could also block the sender or report it as a scam." },
      { index: 6, sender: "Amazon", subject: "Password Assistance", date: formatDate(fourDaysAgo), from:"<account-update@amazon.com>", content: "<div id='amazon-header'><img class='ui medium image' id='amazon-logo' src='/images/Amazon_logo.svg' /><h3 id='amazon-assistance'> Password Assistance</h3></div><br /><p>To verify your identity, please use the following code:</p><h1 id='amazon-code'>456459</h1><p>Amazon takes your account security very seriously. Amazon will never email you to disclose or verify your Amazon password, credit card, or banking account number. If you receive a suspicious email with a link to update your account information, do not click the link - instead, report the email to Amazon for investigation.</p><p>We hope to see you again soon.</p>", replyHeader: "good", replyContent: "Replying is okay because this email is legitimate and can be trusted. We can look into why this is not a scam.", blockHeader: "warning", blockContent: "Blocking the sender is not needed for this email because it comes from a legitimate source and can be trusted. We can look into why this is not a scam.", reportHeader: "warning", reportContent: "Reporting as a scam is not needed for this email because it comes from a legitimate source and can be trusted. We can look into why this is not a scam.", deleteHeader: "warning", deleteContent: "Deleting is not needed for this email because it comes from a legitimate source and can be trusted. We can look into why this is not a scam." },
    ];  

    res.render(req.params.modId + '/explore/' + req.params.modId + '_explore3', {
        title: 'Explore',
        emails
    });
  } else {
    const explorePage = `${modId}/explore/${modId}_explore${pageNum || ''}`;
    const title = 'Explore';
  
    res.render(explorePage, { title });
  }
};


/**
 * GET /evaluate/:page?/:modId
 * Render the evaluate page for the module.
 */
exports.getEvaluate = async (req, res) => {
  const modId = req.params.modId;
  const pageNum = req.params.page;
  const title = 'Evaluate';

  // render the quiz else the normal page
  if(modId === "identity" && parseInt(pageNum) !== 2) {
    console.log("in evaluate if statement*************")
    let quizData;
    let modID = "identity";
    let currentSection = "evaluate";
    let page = "evaluate";
    let backLink = "/explore/4/identity";
    let nextLink = "/evaluate/2/identity";
    let progress = 85;
    const data = await fs.readFileAsync(`${__dirname}/../public/json/` +  req.params.modId + `/evaluate.json`);
    quizData = JSON.parse(data.toString());

    const currentTime = getCurrentTime();
    const currentDate = getCurrentDate();
    const futureDate = getFutureDate();

    res.render('dart-quiz-template.pug', {
        title: 'Evaluate',
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
  } else {
    const introPage = `${modId}/evaluate/${modId}_evaluate${pageNum || ''}`;

    res.render(introPage, { title });
  }
};


/**
 * GET /reflect/:page?/:modId
 * Render the reflect pages for the module.
 */
exports.getReflect = (req, res) => {
  const modId = req.params.modId;
  const pageNum = req.params.page;
  
  const reflectPage = `${modId}/reflect/${modId}_reflect${pageNum || ''}`;
  const title = 'Reflect';

  res.render(reflectPage, { title });
};


/**
 * GET /certificate/:page?/:modId
 * Render the certificate pages for the module.
 */
exports.getCertificate = (req, res) => {
  const modId = req.params.modId;
  
  const certificatePage = `${modId}/${modId}_certificate`;
  const title = 'Certificate';

  res.render(certificatePage, { title });
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

// get date for explore emails like: Aug 10
function formatDate(date) {
  const options = { month: 'short', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
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