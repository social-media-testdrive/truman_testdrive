// const crypto = require('crypto');
// const cheerio = require('cheerio');
// const { Octokit } = require('@octokit/rest');
// const stripe = require('stripe')(process.env.STRIPE_SKEY);
// const twilio = require('twilio')(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);
// const paypal = require('paypal-rest-sdk');
// const axios = require('axios');
// const googledrive = require('@googleapis/drive');
// const googlesheets = require('@googleapis/sheets');
// const validator = require('validator');
// const {
//   Configuration: LobConfiguration, LetterEditable, LettersApi, ZipEditable, ZipLookupsApi
// } = require('@lob/lob-typescript-sdk');

/**
 * GET /api
 * List of API examples.
 */
// exports.getApi = (req, res) => {
//   res.render('api/index', {
//     title: 'API Examples'
//   });
// };


// /**
//  * GET /api/paypal
//  * PayPal SDK example.
//  */
// exports.getPayPal = (req, res, next) => {
//   paypal.configure({
//     mode: 'sandbox',
//     client_id: process.env.PAYPAL_ID,
//     client_secret: process.env.PAYPAL_SECRET
//   });

//   const paymentDetails = {
//     intent: 'sale',
//     payer: {
//       payment_method: 'paypal'
//     },
//     redirect_urls: {
//       return_url: `${process.env.BASE_URL}/api/paypal/success`,
//       cancel_url: `${process.env.BASE_URL}/api/paypal/cancel`
//     },
//     transactions: [{
//       description: 'Hackathon Starter',
//       amount: {
//         currency: 'USD',
//         total: '1.99'
//       }
//     }]
//   };

//   paypal.payment.create(paymentDetails, (err, payment) => {
//     if (err) { return next(err); }
//     const { links, id } = payment;
//     req.session.paymentId = id;
//     for (let i = 0; i < links.length; i++) {
//       if (links[i].rel === 'approval_url') {
//         res.render('api/paypal', {
//           approvalUrl: links[i].href
//         });
//       }
//     }
//   });
// };

// /**
//  * GET /api/paypal/success
//  * PayPal SDK example.
//  */
// exports.getPayPalSuccess = (req, res) => {
//   const { paymentId } = req.session;
//   const paymentDetails = { payer_id: req.query.PayerID };
//   paypal.payment.execute(paymentId, paymentDetails, (err) => {
//     res.render('api/paypal', {
//       result: true,
//       success: !err
//     });
//   });
// };

// /**
//  * GET /api/paypal/cancel
//  * PayPal SDK example.
//  */
// exports.getPayPalCancel = (req, res) => {
//   req.session.paymentId = null;
//   res.render('api/paypal', {
//     result: true,
//     canceled: true
//   });
// };


// /**
//  * GET /api/stripe
//  * Stripe API example.
//  */
// exports.getStripe = (req, res) => {
//   res.render('api/stripe', {
//     title: 'Stripe API',
//     publishableKey: process.env.STRIPE_PKEY
//   });
// };

// /**
//  * POST /api/stripe
//  * Make a payment.
//  */
// exports.postStripe = (req, res) => {
//   const { stripeToken, stripeEmail } = req.body;
//   stripe.charges.create({
//     amount: 395,
//     currency: 'usd',
//     source: stripeToken,
//     description: stripeEmail
//   }, (err) => {
//     if (err && err.type === 'StripeCardError') {
//       req.flash('errors', { msg: 'Your card has been declined.' });
//       return res.redirect('/api/stripe');
//     }
//     req.flash('success', { msg: 'Your card has been successfully charged.' });
//     res.redirect('/api/stripe');
//   });
// };

// /**
//  * GET /api/upload
//  * File Upload API example.
//  */

// exports.getFileUpload = (req, res) => {
//   res.render('api/upload', {
//     title: 'File Upload'
//   });
// };

// exports.postFileUpload = (req, res) => {
//   req.flash('success', { msg: 'File was uploaded successfully.' });
//   res.redirect('/api/upload');
// };

// exports.getGoogleDrive = (req, res) => {
//   const token = req.user.tokens.find((token) => token.kind === 'google');
//   const authObj = new googledrive.auth.OAuth2({
//     access_type: 'offline'
//   });
//   authObj.setCredentials({
//     access_token: token.accessToken
//   });
//   const drive = googledrive.drive({
//     version: 'v3',
//     auth: authObj
//   });

//   drive.files.list({
//     fields: 'files(iconLink, webViewLink, name)'
//   }, (err, response) => {
//     if (err) return console.log(`The API returned an error: ${err}`);
//     res.render('api/google-drive', {
//       title: 'Google Drive API',
//       files: response.data.files,
//     });
//   });
// };

// exports.getGoogleSheets = (req, res) => {
//   const token = req.user.tokens.find((token) => token.kind === 'google');
//   const authObj = new googlesheets.auth.OAuth2({
//     access_type: 'offline'
//   });
//   authObj.setCredentials({
//     access_token: token.accessToken
//   });

//   const sheets = googlesheets.sheets({
//     version: 'v4',
//     auth: authObj
//   });

//   const url = 'https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit#gid=0';
//   const re = /spreadsheets\/d\/([a-zA-Z0-9-_]+)/;
//   const id = url.match(re)[1];

//   sheets.spreadsheets.values.get({
//     spreadsheetId: id,
//     range: 'Class Data!A1:F',
//   }, (err, response) => {
//     if (err) return console.log(`The API returned an error: ${err}`);
//     res.render('api/google-sheets', {
//       title: 'Google Sheets API',
//       values: response.data.values,
//     });
//   });
// };
