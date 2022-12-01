const async = require('async');
const User = require('./models/User.js');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const fs = require('fs');
const CSVToJSON = require("csvtojson");
const csvWriter = require('csv-write-stream');
dotenv.config({ path: '.env' });

// establish initial Mongoose connection
mongoose.connect(process.env.PRO_MONGODB_URI, { useNewUrlParser: true });
// listen for errors after establishing initial connection
const db = mongoose.connection;
db.on('error', (err) => {
    console.error(err);
    console.log('%s MongoDB connection error.');
    process.exit(1);
});

const color_start = '\x1b[33m%s\x1b[0m'; // yellow
const color_success = '\x1b[32m%s\x1b[0m'; // green
const color_error = '\x1b[31m%s\x1b[0m'; // red

async function addStudentToDB(){
  // command inputs
  const myArgs = process.argv.slice(2);
  const username = myArgs[0]
  const password = myArgs[1];
  console.log(color_start, `Creating new student...`);

  const user = new User({
    username: username,
    password: password,
    active: true,
    start : Date.now(),
    isStudent: true,
  });
  user.profile.name = "Guest";
  user.profile.location = "Guest Town";
  user.profile.bio = '';
  user.profile.picture = 'avatar-icon.svg';

  User.findOne({
   username: username
  }, (err, existingUser) => {
    if (err) {
      return next(err);
    }
    if (existingUser) {
      console.log(color_error, `ERROR: This username is already taken.`);
      mongoose.connection.close();
      return;
    }
    user.save((err) => {
      if (err) {
        return next(err);
      }
      console.log(color_success, `Account successfully created. Closing db connection.`);
      mongoose.connection.close();
    });
  });
}

addStudentToDB();
