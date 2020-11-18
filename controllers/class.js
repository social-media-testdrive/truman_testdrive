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
exports.getClass = (req, res, next) => {
  if (req.user.isInstructor) {
    console.log(req.params.classId);
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

      for (var i = 0; i < found_class.students.length; i++) {
        // NOTE from Anna: Seems to be referencing quiz results?
        // We don't use quizzes, so this must be outdated.
        // Probably safe to clear this.
        // found_class.students[i].username = found_class.students[i].username;
        //
        //
        //
        // found_class.students[i].post_presentation = found_class.students[i].quiz.find(function(e) {return (e.type == "post"&&e.modual=="presentation")});
        // found_class.students[i].pre_cyberbullying = found_class.students[i].quiz.find(function(e) {return (e.type == "pre"&&e.modual=="cyberbullying")});
        // found_class.students[i].post_cyberbullying = found_class.students[i].quiz.find(function(e) {return (e.type == "post"&&e.modual=="cyberbullying")});
        // found_class.students[i].pre_digital_literacy = found_class.students[i].quiz.find(function(e) {return (e.type == "pre"&&e.modual=="digital-literacy")});
        // found_class.students[i].post_digital_literacy = found_class.students[i].quiz.find(function(e) {return (e.type == "post"&&e.modual=="digital-literacy")});
        // found_class.students[i].pre_like = found_class.students[i].quiz.find(function(e) {return (e.type == "pre"&&e.modual=="likes")});
        // found_class.students[i].post_like = found_class.students[i].quiz.find(function(e) {return (e.type == "post"&&e.modual=="likes")});
        // found_class.students[i].pre_image = found_class.students[i].quiz.find(function(e) {return (e.type == "pre"&&e.modual=="image")});
        // found_class.students[i].post_image = found_class.students[i].quiz.find(function(e) {return (e.type == "post"&&e.modual=="image")});
      }
      console.log("BEFORE RENDER!!!!");
      res.render('class', { found_class: found_class});
      console.log("AFTER RENDER!!!!");
    });
  } else {
    res.redirect('/');
  }
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
async function getUniqueUsername(className, adjectiveArray, nounArray, usernameArray){
  // While we aren't worried about efficiency, there is the issue that this will
  // miss frequently as more accounts are created.
  let adjective = adjectiveArray[getRandomInt(0, adjectiveArray.length)];
  let noun = nounArray[getRandomInt(0, nounArray.length)];
  let username = `${adjective}${noun}`;
  console.log(`Generated a username... ${username}`);
  let result = await User.findOne({
    username: username,
    className: className
  });
  if(result !== null){
    // Duplicate found in db. Generating another username...
    await getUniqueUsername(adjectiveArray, nounArray, usernameArray);
  } else if (usernameArray.includes(username)) {
    // Duplicate found in array. Generating another username...
    await getUniqueUsername(adjectiveArray, nounArray, usernameArray);
  } else {
    // No duplicates found in db or array. Added to array.
    usernameArray.push(username);
  }
  return usernameArray;
}

exports.generateStudentAccounts = async (req, res, next) => {
  // get the current class by its name
  Class.findOne({
    className: req.body.className
  }, async (err, existingClass) => {

    if(err) {
      return next(err);
    }

    if(!existingClass) {
      req.flash('errors', {msg: `There was an issue finding the class name. Try again, or click "Contact Us" for assistance.`})
      res.redirect(`/class/${req.body.classId}`);
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
      res.redirect(`/class/${req.body.classId}`);
    } else {
      let usernameArray = [];
      for(let i = 0; i < requestedNumberOfAccounts; i++) {
        await getUniqueUsername(req.body.className,adjectiveArray, nounArray, usernameArray);
      }
      async.each(usernameArray, function(item, callback){
        const user = new User({
          username: item,
          active: true,
          start : Date.now(),
          className: req.body.className
        });
        user.profile.name = "Student";
        user.profile.location = '';
        user.profile.bio = '';
        user.profile.picture = 'avatar-icon.svg';

        User.findOne({ username: item, className: req.body.className }, (err, existingUser) => {
          if (err) {
            console.log(err);
            return next(err);
          }
          if (existingUser) {
            console.log(color_error, `ERROR..! There is a duplicate username!`);
            return;
          }
          user.save((err) => {
            if (err) {
              return next(err);
            }
            console.log(`Saved username ${user.username} with id  ${user._id}`)
            existingClass.students.push(user._id);
            console.log(`Pushed to class ${existingClass.className}`)
            console.log(existingClass);
            callback();
          });
        });
      },
        function (err) {
          console.log(`Finished saving users. Now save the class.`);
          console.log(`Current state of existingClass:`)
          console.log(existingClass);
          existingClass.save((err) => {
            if(err) {
              return next(err);
            }
            console.log(`Existingclass should be saved now.`)
            res.redirect(`/class/${req.body.classId}`);
          });
        }
      );
    }
  });
}
