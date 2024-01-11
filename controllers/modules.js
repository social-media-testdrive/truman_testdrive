// for json file reading
const fs = require('fs');
const util = require('util');
const User = require('../models/User');
  
/**
 * GET /about/:page?/:modId
 * Render the about pages for the modules.
 */
exports.getAbout = (req, res) => {
    const modId = req.params.modId;
    
    const introPage = `module-content/${modId}/${modId}_about`;
    const title = 'About';
  
    res.render(introPage, { title });
};
  

// Handler for '/getModule' route
exports.getModule = async (req, res) => {
    // const module = req.query.module;
    // const page = req.query.page;
    const { module, section, page } = req.query;
    let numPages;

    // each quiz question is being counted as a page too so we need to add those
    if(section === 'challenge'){
      numPages = 8;
    } else if(section === 'concepts') {
      numPages = 10;
    } else if(section === 'consequences') {
      numPages = 7;
    }

    const modulePage = `module-content/${module}/${section}.pug`;

    const currentTime = getCurrentTime();
    const currentDate = getCurrentDate();

    const data = await fs.readFileAsync(`${__dirname}/../public/json/` +  module + `/` + section + `.json`);
    quizData = JSON.parse(data.toString());

    res.render(modulePage, { module, section, page, numPages, quizData, currentTime, currentDate });
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