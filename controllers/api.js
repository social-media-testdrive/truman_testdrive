/*
 * These functions do not seem to be used in TestDrive - likely safe to delete.
 * Clean up the corresponding routes in app.js as well when this is removed.
 */

// 'use strict';
//
// const bluebird = require('bluebird');
// const request = bluebird.promisifyAll(require('request'), { multiArgs: true });
// const cheerio = require('cheerio');

//  exports.postFileUpload = (req, res) => {
//    //console.log("OG file name is "+req.file.originalname);
//    //console.log("Actual file name is "+req.file.filename);
//    //filename
//    req.flash('success', { msg: 'File was uploaded successfully.' });
//    res.redirect('/api/upload');
//  };

// /**
//  * GET /api
//  * List of API examples.
//  */
// exports.getApi = (req, res) => {
//   res.render('api/index', {
//     title: 'API Examples'
//   });
// };

// /**
//  * GET /api/upload
//  * File Upload API example.
//  */
//
// exports.getFileUpload = (req, res) => {
//   res.render('api/ui_upload', {
//     title: 'File Upload'
//   });
// };
