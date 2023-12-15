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
exports.getModule = (req, res) => {
    // const module = req.query.module;
    // const page = req.query.page;
    const { module, section, page } = req.query;
    const numPages = 8;

    const modulePage = `module-content/${module}/${section}.pug`;

    res.render(modulePage, { module, section, page, numPages});
};
