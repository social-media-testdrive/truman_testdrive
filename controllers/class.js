//const Actor = require('../models/Actor.js');
//const Script = require('../models/Script.js');
const Class = require('../models/Class.js');
const User = require('../models/User');
var ObjectId = require('mongoose').Types.ObjectId;
const CSVToJSON = require("csvtojson");
const _ = require('lodash');
var async = require('async');

//Get all Classes for a currently logged in instructor
exports.getClasses = (req, res) => {
  if (req.user.isInstructor) {
    Class.find({teacher: req.user.id}, (err, classes) => {
      //classes is array with all classes for this instructor
      res.render('classes', { classes: classes });
    });
  } else {
    res.redirect('/');
  }
};

// Show info on one Class led by the currently logged in instructor
// For the route /class/:classId
exports.getClass = (req, res, next) => {
  if (req.user.isInstructor) {
    Class.findOne({
      accessCode: req.params.classId,
      teacher: req.user.id
    }).populate('students') // populate lets you reference docs in other collections
    .exec(function (err, found_class) {
      if (err) {
        console.log("ERROR");
        console.log(err);
        return next(err);
      }
      if (found_class == null){
        console.log("NULL");
        var myerr = new Error('Class not found!');
        return next(myerr);
      }

      res.render('class', { found_class: found_class});

    });
  } else {
    res.redirect('/');
  }
};

// Currently just used for dropdowns
exports.getClassIdList = (req, res, next) => {
  if (req.user.isInstructor) {
    Class.find({teacher: req.user.id}, (err, classes) => {
      const outputData = [];
      for (const singleClass in classes) {
        accessCode = classes[singleClass].accessCode;
        outputData.push(accessCode);
      }
      res.json({classIdList: outputData});
    });
  }
}

// Show info on a class such as: student activity
exports.getModuleProgress = (req, res, next) => {
  if (!req.user.isInstructor) {
    return res.json({classModuleProgress: {}});
  }
  Class.findOne({
    accessCode: req.params.classId,
    teacher: req.user.id
  }).populate('students') // populate lets you reference docs in other collections
  .exec(function (err, found_class) {
    if (err) {
      console.log("ERROR");
      console.log(err);
      return next(err);
    }
    if (found_class == null){
      console.log("NULL");
      var myerr = new Error('Class not found!');
      return next(myerr);
    }
    const outputData = {};
    for (var i = 0; i < found_class.students.length; i++) {
      const modProgressObj = found_class.students[i].moduleProgress.toObject();
      const username = found_class.students[i].username;
      outputData[username] = modProgressObj;
    }
    res.json({
      classModuleProgress: outputData
    });
  });
};

// Show info on a class such as: student activity
exports.getReflectionResponses = (req, res, next) => {
  if (!req.user.isInstructor) {
    return res.json({classReflectionResponses: {}});
  }
  Class.findOne({
    accessCode: req.params.classId,
    teacher: req.user.id
  }).populate('students') // populate lets you reference docs in other collections
  .exec(function (err, found_class) {
    if (err) {
      console.log("ERROR");
      console.log(err);
      return next(err);
    }
    if (found_class == null){
      console.log("NULL");
      var myerr = new Error('Class not found!');
      return next(myerr);
    }
    const outputData = {};
    for (var i = 0; i < found_class.students.length; i++) {
      const reflectionActions = found_class.students[i].reflectionAction.toObject();
      const username = found_class.students[i].username;
      outputData[username] = reflectionActions;
    }
    res.json({
      reflectionResponses: outputData
    });
  });
};


/**
 * POST /class/create
 * Update/Create Instructor's class
 */
exports.postCreateClass = (req, res, next) => {

  //Should never needs these checks (will check on Client Side)
  req.assert('classname', 'Class Name cannot be blank').notEmpty();
  req.assert('accesscode', 'Access Code cannot be blank').notEmpty();
  req.assert('accesscode', 'Access Code must be at least 4 characters long').len(4);

  const errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/classes');
  }
  // NOTE from Anna: should probably check that user isInstructor if not already checked
  User.findById(req.user.id, (err, user) => {
    //somehow user does not exist here
    if (err) {
      return next(err);
    }

    const new_class = new Class({
      className: req.body.classname,
      teacher: user,
      accessCode: req.body.accesscode
    });

    Class.findOne({
      accessCode: req.body.accesscode
    }, (err, existingClass) => {
      if (err) {
        return next(err);
      }
      if (existingClass) {
        req.flash('errors', { msg: 'Class with that Access Code already exists. Try another Access Code.' });
        return res.redirect('/classes');
      }
      new_class.save((err) => {
      if (err) {
        return next(err);
      }
        res.redirect('/classes');
      });
    });

  });
};

exports.addStudentToClass = (req, res, next) => {
  Class.findOne({
    className: req.body.className
  }, (err, existingClass) => {
    if(err) {
      return next(err);
    }
    if(!existingClass) {
      req.flash('errors', {msg: `There was an issue finding the class name. Try again, or click "Contact Us" for assistance.`})
      res.redirect(`/class/${req.body.classId}`);
    }
    User.findOne({username: req.body.studentUsername}, (err, student) => {
      if(err){
        return next(err);
      }
      if(!student){
        req.flash('errors', {msg: `No students found with the username '${req.body.studentUsername}'.`})
        res.redirect(`/class/${req.body.classId}`);
      }
      if(student){
        existingClass.students.push(student._id);
        existingClass.save((err) => {
          if (err) {
            return next(err);
          }
          res.redirect(`/class/${req.body.classId}`);
        });
      }
    });
  });
}







// Function copied directly from the MDN web docs:
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
// The maximum is exclusive and the minimum is inclusive
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
};

// getUniqueUsername is a recursive function that will call itself until it
// generates a username that both (1) does not exist in the db and (2) is not in
// the array of usernames to add in this batch.
async function getUniqueUsername(accessCode, adjectiveArray, nounArray, usernameArray){
  // While we aren't worried about efficiency, there is the issue that this will
  // miss frequently as more accounts are created.
  let adjective = adjectiveArray[getRandomInt(0, adjectiveArray.length)];
  let noun = nounArray[getRandomInt(0, nounArray.length)];
  let username = `${adjective}${noun}`;
  console.log(`Generated a username... ${username}`);
  let result = await User.findOne({
    username: username,
    accessCode: accessCode
  });
  if(result !== null){
    // Duplicate found in db. Generating another username...
    await getUniqueUsername(accessCode, adjectiveArray, nounArray, usernameArray);
  } else if (usernameArray.includes(username)) {
    // Duplicate found in array. Generating another username...
    await getUniqueUsername(accessCode, adjectiveArray, nounArray, usernameArray);
  } else {
    // No duplicates found in db or array. Added to array.
    usernameArray.push(username);
  }
  return usernameArray;
}

exports.generateStudentAccounts = async (req, res, next) => {
  // get the current class by its name
  Class.findOne({
    accessCode: req.body.accessCode
  }, async (err, existingClass) => {

    if(err) {
      return next(err);
    }

    if(!existingClass) {
      req.flash('errors', {msg: `There was an issue finding the class name. Try again, or click "Contact Us" for assistance.`})
      res.redirect(`/class/${req.body.accessCode}`);
    }

    let adjectiveArray = [];
    let nounArray = [];
    try {
      adjectiveArray = await CSVToJSON({
            noheader: true,
            output: 'csv'
      }).fromFile('outputFiles/inputFiles/UsernameAdjectiveComponents.csv');
      adjectiveArray = adjectiveArray[0];
      nounArray = await CSVToJSON({
            noheader: true,
            output: 'csv'
      }).fromFile('outputFiles/inputFiles/UsernameNounComponents.csv');
      nounArray = nounArray[0];
    } catch {
      return next(err);
    }

    // How many accounts could we possibly have in one class?
    // 214 x 180 = 38,520
    // No instructor could possibly need that many, so I will place an arbitrary limit.
    const currentClassSize = existingClass.students.length;
    const requestedNumberOfAccounts = req.body.numberOfAccounts;
    const maximumClassSize = 300;
    if((currentClassSize + requestedNumberOfAccounts) > maximumClassSize) {
      // Inform that this is too many accounts for one class.
      req.flash('errors', {
        msg: `Each class can only have a maximum of ${maximumClassSize} students.`
      });
      res.redirect(`/class/${req.body.accessCode}`);
    } else {
      let usernameArray = [];
      for(let i = 0; i < requestedNumberOfAccounts; i++) {
        await getUniqueUsername(req.body.accessCode,adjectiveArray, nounArray, usernameArray);
      }
      // async.each is waiting for each call to getUsername to return and runs callback for each of those
      let promiseArray = [];
      for (let username of usernameArray) {
        promiseArray.push(saveUsernameInExistingClass(req,username,existingClass));
      }
      await Promise.all(promiseArray);
      console.log("About to save class...")
      existingClass.save((err) => {
        if(err) {
          return next(err);
        }
        res.redirect(`/class/${req.body.accessCode}`);
      });
    }
  });
}

async function saveUsernameInExistingClass(req, item, existingClass) {
  let duplicateUser = await User.findOne({ username: item, accessCode: req.body.accessCode })
    .catch(err => {
      console.log("duplicateUser failed");
      return next(err);
    });
  if (duplicateUser) {
    return next("Found duplicate user, check getUniqueUsername");
  }
  const user = new User({
    username: item,
    active: true,
    start : Date.now(),
    accessCode: req.body.accessCode
  });
  user.profile.name = "Student";
  user.profile.location = '';
  user.profile.bio = '';
  user.profile.picture = 'avatar-icon.svg';
  console.log("About to save user...")
  try {
    await user.save();
    existingClass.students.push(user._id);
  } catch (err) {
    // ignore
  }
}
