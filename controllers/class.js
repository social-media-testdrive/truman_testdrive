const fs = require('fs');
const Class = require('../models/Class.js');
const User = require('../models/User');
var ObjectId = require('mongoose').Types.ObjectId;
const CSVToJSON = require("csvtojson");
const _ = require('lodash');
var async = require('async');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

// Get all Classes for a currently logged in instructor
exports.getClasses = (req, res) => {
  if (req.user.isInstructor) {
    Class.find({
      teacher: req.user.id,
      deleted: false
    }, (err, classes) => {
      //classes is array with all classes for this instructor
      res.render('teacherDashboard/classManagement', { classes: classes });
    });
  } else {
    res.redirect('/');
  }
};

// Return how many students there are in a specified class
exports.getClassSize = (req, res, next) => {
  if (!req.user.isInstructor){
    res.redirect('/');
  }
  Class.findOne({
    accessCode: req.params.classId,
    teacher: req.user.id,
    deleted: false
  }).exec(function (err, found_class) {
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
    const studentCount = found_class.students.length;
    res.json({studentCount: studentCount});
  });
}

// Show info on one Class led by the currently logged in instructor
// For the route /class/:classId
exports.getClass = (req, res, next) => {
  if (req.user.isInstructor) {
    Class.findOne({
      accessCode: req.params.classId,
      teacher: req.user.id,
      deleted: false
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
      res.render('teacherDashboard/viewClass', { found_class: found_class});

    });
  } else {
    res.redirect('/');
  }
};

// Get list of usernames for all students in a class
exports.getClassUsernames = (req, res, next) => {
  if (!req.user.isInstructor) {
    return res.json({classUsernames: []});
  }
  Class.findOne({
    accessCode: req.params.classId,
    teacher: req.user.id,
    deleted: false
  }).populate('students')
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
    let usernameArray = [];
    for(const student of found_class.students){
      usernameArray.push(student.username);
    }
    console.log(usernameArray)
    res.json({classUsernames: usernameArray});
  });
}

// Currently just used for dropdowns
exports.getClassIdList = (req, res, next) => {
  if (req.user.isInstructor) {
    Class.find({
      teacher: req.user.id,
      deleted: false
    }, (err, classes) => {
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
    teacher: req.user.id,
    deleted: false
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

function getClassPageTimes(found_class, modName) {
  let classPageTimes = [];
  for(const student of found_class.students){
    const pageLog = student.pageLog;
    let pageTimeArray = [];
    for(let i=0, l=pageLog.length-1; i<l; i++) {
      // if a modName is specified, skip pageLog entries that are not for that modName
      if(modName){
        if(pageLog[i].subdirectory2 !== modName){
          continue;
        }
      }
      // if the student has not completed the module yet, skip any pageLogs for that module
      if (pageLog[i].subdirectory2) {
        const modNameNoDashes = pageLog[i].subdirectory2.replace('-','');
        if(student.moduleProgress[modNameNoDashes] !== "completed"){
          continue;
        }
      }
      // convert from ms to minutes
      let timeDurationOnPage = (pageLog[i+1].time - pageLog[i].time)/60000;
      // skip any page times that are longer than 30 minutes
      if(timeDurationOnPage > 30) {
        continue;
      }
      const dataToPush = {
        timeOpened: pageLog[i].time,
        timeDuration: timeDurationOnPage,
        subdirectory1: pageLog[i].subdirectory1
      };
      if (pageLog[i].subdirectory2) {
        dataToPush["subdirectory2"] = pageLog[i].subdirectory2;
      }
      pageTimeArray.push(dataToPush);
    }
    const pushStudentObject = {};
    pushStudentObject['username'] = student.username;
    pushStudentObject['timeArray'] = pageTimeArray;
    classPageTimes.push(pushStudentObject);
  }
  return classPageTimes;
};

// Gets page times for an entire class, only reports logs of completed modules.
// Optional parameter of modName to further filter page time list.
exports.getClassPageTimes = (req, res, next) => {
  if (!req.user.isInstructor) {
    return res.json({classPageTimes: {}});
  }
  Class.findOne({
    accessCode: req.params.classId,
    teacher: req.user.id,
    deleted: false
  }).populate('students')
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
    let classPageTimes = getClassPageTimes(found_class, req.params.modName);
    res.json({classPageTimes: classPageTimes})
  });
}

exports.getClassFreeplayActions = (req, res, next) => {
  if (!req.user.isInstructor) {
    return res.json({classFreeplayActions: {}});
  }
  Class.findOne({
    accessCode: req.params.classId,
    teacher: req.user.id,
    deleted: false
  }).populate('students')
  .exec(function (err, found_class){
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
    for(const student of found_class.students){
      const actionList = [];
      for(const actions of student.feedAction){
        if(actions.modual === req.params.modName){
          actionList.push(actions);
        }
        outputData[student.username] = actionList;
      }
    }
    res.json({
      classFreeplayActions: outputData
    });
  });
}

// Show info on a class such as: student activity
exports.getReflectionResponses = (req, res, next) => {
  if (!req.user.isInstructor) {
    return res.json({classReflectionResponses: {}});
  }
  Class.findOne({
    accessCode: req.params.classId,
    teacher: req.user.id,
    deleted: false
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
  if (!req.user.isInstructor) {
    req.logout();
    res.redirect('/login');
  }
  //Should never needs these checks (will check on Client Side)
  req.assert('classname', 'Class Name cannot be blank').notEmpty();
  req.assert('accesscode', 'Access Code cannot be blank').notEmpty();
  req.assert('accesscode', 'Access Code must be at least 4 characters long').len(4);

  const errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/classManagement');
  }

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
      accessCode: req.body.accesscode,
      deleted: false
    }, (err, existingClass) => {
      if (err) {
        return next(err);
      }
      if (existingClass) {
        req.flash('errors', { msg: 'Class with that Access Code already exists. Try another Access Code.' });
        return res.redirect('/classManagement');
      }
      new_class.save((err) => {
      if (err) {
        return next(err);
      }
        res.redirect('/classManagement');
      });
    });

  });
};

/**
 * Delete a class
 */
exports.postDeleteClass = async (req, res, next) => {
  if (!req.user.isInstructor) {
    return res.redirect('/login');
  }
  Class.findOne({
    className: req.body.className,
    accessCode: req.body.accessCode,
    teacher: req.user._id,
    deleted: false
  }, async (err, found_class) => {
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
    const promiseArray = [];
    // iterate through each student and update deleted=true, but do not remove them
    for (const studentId of found_class.students) {
      let student = await User.findById(studentId)
      .catch(err => {
        console.log("Did not find student");
        return next(err);
      });
      student.deleted = true;
      promiseArray.push(student.save());
    }
    await Promise.all(promiseArray);
    // mark the class as deleted=true, but do not remove it
    found_class.deleted = true;
    found_class.save((err) => {
      if(err) {
        return next(err);
      }
      res.redirect('/classManagement')
    });
  });
};

exports.addStudentToClass = (req, res, next) => {
  Class.findOne({
    className: req.body.className,
    deleted: false
  }, (err, existingClass) => {
    if(err) {
      return next(err);
    }
    if(!existingClass) {
      req.flash('errors', {msg: `There was an issue finding the class name. Try again, or click "Contact Us" for assistance.`})
      res.redirect(`/viewClass/${req.body.classId}`);
    }
    User.findOne({username: req.body.studentUsername}, (err, student) => {
      if(err){
        return next(err);
      }
      if(!student){
        req.flash('errors', {msg: `No students found with the username '${req.body.studentUsername}'.`})
        res.redirect(`/viewClass/${req.body.classId}`);
      }
      if(student){
        existingClass.students.push(student._id);
        existingClass.save((err) => {
          if (err) {
            return next(err);
          }
          res.redirect(`/viewClass/${req.body.classId}`);
        });
      }
    });
  });
}

exports.removeStudentFromClass = (req, res, next) => {
  if (req.user.isInstructor) {
    Class.findOne({
      accessCode: req.body.accessCode,
      teacher: req.user.id,
      deleted: false
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
      // remove the student from the class
      let studentIndex;
      let studentId; // used later to update student User
      for(const student in found_class.students){
        if(found_class.students[student].username === req.body.username) {
          studentIndex = student;
          studentId = found_class.students[student]._id;
        }
      }
      found_class.students.splice(studentIndex,1);
      found_class.save((err) => {
        if(err) {
          return next(err);
        }
        // student has been removed from the class
        // now, update the student User model to be "deleted" from the class (set "deleted"=true)
        User.findById(studentId)
        .exec(function (err, found_student) {
          if (err) {
            console.log("ERROR");
            console.log(err);
            return next(err);
          }
          if (found_student == null){
            console.log("NULL");
            var myerr = new Error('Student not found!');
            return next(myerr);
          }
          found_student.deleted = true;
          found_student.save((err) => {
            res.redirect(`/viewClass/${req.body.accessCode}`);
          });
        });
      });
    });
  } else {
    res.redirect('/login');
  }
};

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
    accessCode: accessCode,
    deleted: false
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

async function saveUsernameInExistingClass(req, item, existingClass) {
  let duplicateUser = await User.findOne({
    username: item,
    accessCode: req.body.accessCode,
    deleted: false
  })
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

exports.generateStudentAccounts = async (req, res, next) => {
  // get the current class by its name
  Class.findOne({
    accessCode: req.body.accessCode,
    deleted: false
  }, async (err, existingClass) => {

    if(err) {
      return next(err);
    }

    if(!existingClass) {
      req.flash('errors', {msg: `There was an issue finding the class name. Try again, or click "Contact Us" for assistance.`})
      res.redirect(`/viewClass/${req.body.accessCode}`);
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
      res.redirect(`/viewClass/${req.body.accessCode}`);
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
        res.redirect(`/viewClass/${req.body.accessCode}`);
      });
    }
  });
}

function buildHeaderArray(moduleQuestions){
  let headerArray = [
    {id: "col1", title:""},
    {id: "col2", title:"Questions"},
  ]
  for (const question of Object.keys(moduleQuestions)) {
    // Handle each type of question: written, checkbox, and checkboxGrouped
    switch(moduleQuestions[question].type){
      case 'written': {
        const newHeaderObject = {
          id: question,
          title: moduleQuestions[question].prompt
        };
        headerArray.push(newHeaderObject);
        break;
      }
      case 'checkbox': {
        /* We need to make the first column title a copy of the question, and
        the following columns blank for however many checkboxes there will be
        (refer to a sample layout of the .csv file for an example) */
        for (const checkbox of Object.keys(moduleQuestions[question].checkboxLabels)) {
          const checkboxNumber = parseInt(checkbox);
          const newHeaderObject = {
            id: `${question}_${checkbox}`,
            title: (checkboxNumber === 0) ? moduleQuestions[question].prompt : ""
          };
          headerArray.push(newHeaderObject);
        }
      }
      case 'checkboxGrouped': {
        /* We need to make the first column title a copy of the question, and
        the following columns blank for however many checkboxes there will be
        (refer to a sample layout of the .csv file for an example) */
        const groupCount = moduleQuestions[question].groupCount;
        for (let i=0; i<groupCount; i++) {
          for (const checkbox of Object.keys(moduleQuestions[question].checkboxLabels)) {
            const checkboxNumber = parseInt(checkbox);
            const newHeaderObject = {
              id: `${question}_${i}_${checkbox}`,
              title: (i === 0) && (checkboxNumber === 0) ? moduleQuestions[question].prompt : ""
            };
            headerArray.push(newHeaderObject);
          }
        }
      }
    }
  }
  return headerArray;
}

function buildSubHeaderRecords(headerArray, records, moduleQuestions){
  // first record built in this function lists all the checkbox labels
  let labelsRecord = {
    col1: "",
    col2: "checkbox"
  };
  // second record built in this function lists the recommended answers
  let answersRecord = {
    col1: "Username",
    col2: "Recommended Answer"
  };
  // build the rest of the records based on the module questions
  for(const column of headerArray) {
    if(column.id.includes('col')){
      // this is one of the constant columns (not dependent on module questions)
      continue;
    }
    const id = column.id;
    const idSplit = id.split("_");
    const questionNumber = idSplit[0]; // this always exists
    let label1 = idSplit[1] ? idSplit[1] : "";
    let label2 = idSplit[2] ? idSplit[2] : "";
    let buildString = "";
    let correctResponse = "";
    if (label2 !== "") {
      // If label 2 exists, then we can infer that this is a grouped checkbox
      const postNumber = parseInt(label1) + 1;
      const checkboxNumber = parseInt(label2) + 1;
      buildString = `post ${postNumber} (checkbox ${checkboxNumber}) ${moduleQuestions[questionNumber].checkboxLabels[label2]}`;
      correctResponse = moduleQuestions[questionNumber].correctResponses[label1][label2] === "1";
      answersRecord[id] = correctResponse ? "selected" : "not selected";
    } else if (label1 !== "") {
      // If label1 exists and label2 doesn't, then we can infer that this is a standard checkbox
      const checkboxNumber = parseInt(label1) + 1;
      buildString = `(checkbox ${checkboxNumber}) ${moduleQuestions[questionNumber].checkboxLabels[label1]}`
      correctResponse = moduleQuestions[questionNumber].correctResponses[label1] === "1";
      answersRecord[id] = correctResponse ? "selected" : "not selected";
    } else {
      // If there is only a question number, then we can infer that this is an open-ended question
      buildString = "(open-ended)";
      answersRecord[id] = correctResponse;
    }
    labelsRecord[id] = buildString;
  }
  records.push(labelsRecord);
  records.push(answersRecord);
  return records;
}

function buildObjectKeyString(questionNumber, post) {
  let returnString = "";
  if (post) {
    returnString = `${questionNumber}_${post}`;
    return returnString;
  } else {
    return questionNumber;
  }
}

function parseAnswerKeyComparison(responseRequirement, correctAnswer, studentAnswer, customRequirements, questionNumber, post=""){
  let finalAnswerString = "";
  switch(responseRequirement) {
    case "exact": {
      if((studentAnswer === "1") && (correctAnswer === "1")) {
        finalAnswerString = "selected";
      } else if ((studentAnswer === "1") && (correctAnswer === "0")) {
        finalAnswerString = "incorrectly selected";
      } else if ((studentAnswer === "0") && (correctAnswer === "0")) {
        finalAnswerString = "not selected";
      } else if ((studentAnswer === "0") && (correctAnswer === "1")) {
        finalAnswerString = "missed";
      } else {
        finalAnswerString = "";
      }
      return finalAnswerString;
    }
    case "atLeastOne": {
      const customKey = buildObjectKeyString(questionNumber, post);
      if((studentAnswer === "1") && (correctAnswer === "1")) {
        finalAnswerString = "selected";
      } else if ((studentAnswer === "1") && (correctAnswer === "0")) {
        finalAnswerString = "incorrectly selected";
      } else if ((studentAnswer === "0") && (correctAnswer === "0")) {
        finalAnswerString = "not selected";
      } else if ((studentAnswer === "0") && (correctAnswer === "1") && (customRequirements.atLeastOne[customKey])) {
        finalAnswerString = "";
      } else if ((studentAnswer === "0") && (correctAnswer === "1") && (!customRequirements.atLeastOne[customKey])) {
        finalAnswerString = "missed";
      } else {
        finalAnswerString = "";
      }
      return finalAnswerString;
    }
  }
}

function checkAtLeastOneCustomRequirement(questionIdSplit, questionData, response, customRequirements) {
  const questionNumber = questionIdSplit[0];
  if(questionIdSplit.length === 3) {
    if(customRequirements.atLeastOne[`${questionNumber}_${questionIdSplit[2]}`]){
      // already determined true, no need to check again
      return;
    }
  }
  if(customRequirements.atLeastOne[questionNumber]){
    // already determined true, no need to check again
    return;
  }
  switch(questionData.type) {
    case "checkbox": {
      // loop through the response and see if the student selected at least one
      let shiftableResponse = response.checkboxResponse;
      for(let i=response.numberOfCheckboxes-1; i >= 0; i--){
        studentAnswer = shiftableResponse & 1 ? "1" : "0";
        if((studentAnswer === "1") && (questionData.correctResponses[i] === "1")) {
          customRequirements.atLeastOne[questionNumber] = true;
          return;
        }
        shiftableResponse = shiftableResponse >> 1;
      }
      return;
    }
    case "checkboxGrouped": {
      // loop through the response and see if the student selected at least one
      // more complex because we are working with one binary number that
      // represents multiple responses each for different posts
      const checkboxesPerGroup = Object.keys(questionData.checkboxLabels).length;
      for (let postNumber=parseInt(questionData.groupCount)-1; postNumber >= 0; postNumber--) {
        let shiftableResponse = response.checkboxResponse;
        let bitwiseComparison = 1 << (response.numberOfCheckboxes - (checkboxesPerGroup * (postNumber+1)));
        for(let i=checkboxesPerGroup-1; i >= 0; i--){
          studentAnswer = shiftableResponse & bitwiseComparison ? "1" : "0";
          if((studentAnswer === "1") && (questionData.correctResponses[postNumber][i] === "1")) {
            const customKey = `${questionNumber}_${postNumber}`;
            customRequirements.atLeastOne[customKey] = true;
          }
          shiftableResponse = shiftableResponse >> 1;
        }
      }
      return;
    }
  }
}

function parseResponse(questionIdSplit, questionData, response, customRequirements) {
  let studentAnswer = "";
  if(questionData.responseRequirement === "atLeastOne") {
    // There should a better way to do this -
    // this really only needs to be called once per question, not for each column in the header
    checkAtLeastOneCustomRequirement(questionIdSplit, questionData, response, customRequirements);
  }
  // determine the type of response
  switch (questionData.type) {
    case "written": {
      studentAnswer = response.writtenResponse;
      return studentAnswer;
    }
    case "checkbox": {
      /*
      Ex. checkbox
      Q1_2 = splice('_') = ['Q1','2']
      1*0*100 = 5 checkboxes =
      [√]*[ ]*[√][ ][ ]     (note: read boxes from L to R to match orientation on the site)
      number to shift before bitwise comparison = num of checkboxes - check #
      */
      const checkNumberInt = parseInt(questionIdSplit[1]) + 1
      const shiftCount = response.numberOfCheckboxes - checkNumberInt;
      let shiftableResponse = response.checkboxResponse;
      for(let i=0; i<shiftCount; i++){
        shiftableResponse = shiftableResponse >> 1;
      }
      studentAnswer = shiftableResponse & 1 ? "1" : "0";
      // compare the student answer with the recommended answer to get the final response string
      // also take into consideration the response requirement, there are different rules
      const questionNumber = questionIdSplit[0];
      const checkboxNumber = questionIdSplit[1];
      const responseRequirement = questionData.responseRequirement;
      const correctResponse = questionData.correctResponses[checkboxNumber];
      let finalAnswerString = parseAnswerKeyComparison(responseRequirement,correctResponse,studentAnswer,customRequirements,questionNumber);
      return finalAnswerString;
    }
    case "checkboxGrouped":
      /*
      Ex. checkboxGrouped
      Q1_2_2 = splice('_') = ['Q1','2', '2'] = ["question number", "group #", "checkbox #"]
      1010 0*1*00 0000 = 12 checkboxes =
      [√][ ][√][ ]  [ ]*[√]*[ ][ ]  [ ][ ][ ][ ]
      number to shift before bitwise comparison =
      [(# groups - group #) * boxesPerGroup] + [boxesPerGroup - check #]
      [(3 - 2) * 4] + [4 - 2] = 6
      */
      const questionNumber = questionIdSplit[0];
      const groupCount = parseInt(questionData.groupCount);
      const groupNumber = parseInt(questionIdSplit[1]) + 1;
      const boxesPerGroup = Object.keys(questionData.checkboxLabels).length;
      const checkNumber = parseInt(questionIdSplit[2]) + 1;
      const shiftCount = ((groupCount - groupNumber) * boxesPerGroup) + (boxesPerGroup - checkNumber);
      let shiftableResponse = response.checkboxResponse;
      for(let i=0; i<shiftCount; i++){
        shiftableResponse = shiftableResponse >> 1;
      }
      studentAnswer = shiftableResponse & 1 ? "1" : "0";
      // compare the student answer with the recommended answer to get the final response string
      // also take into consideration the response requirement, there are different rules
      const postNumber = questionIdSplit[1];
      const checkboxNumber = questionIdSplit[2];
      const responseRequirement = questionData.responseRequirement;
      const correctResponse = questionData.correctResponses[postNumber][checkboxNumber];
      let finalAnswerString = parseAnswerKeyComparison(responseRequirement,correctResponse,studentAnswer,customRequirements,questionNumber,postNumber);
      return finalAnswerString;
    default:
      // todo: how to handle any strange quesions (i.e. radio, habitsUnique)
      studentAnswer = "";
      return studentAnswer;
  }
}

function filterReflectionActions(modName, reflectionActions){
  let filteredResponseList = [];
  if (reflectionActions.length <= 0){
    return filteredResponseList;
  }
  for(const action of reflectionActions) {
    if(action.modual === modName) {
      filteredResponseList.push(action);
    }
  }
  return filteredResponseList;
}

function findMatchingRequirements(moduleQuestions, requirementToSearch){
  let objectToReturn = {};
  for (const question of Object.keys(moduleQuestions)) {
    if(moduleQuestions[question].responseRequirement === requirementToSearch) {
      if(moduleQuestions[question].type === "checkboxGrouped") {
        // include a new key for each post
        for(let i=0; i<moduleQuestions[question].groupCount; i++){
          const key = `${question}_${i}`
          objectToReturn[key] = false;
        }
      } else {
        objectToReturn[question] = false;
      }
    }
  }
  return objectToReturn;
};

function addClassReflectionRecords(modName, headerArray, records, moduleQuestions, found_class) {

  for (const student of found_class.students) {
    let newRecord = {
      col1: student.username,
      col2: ""
    };
    // These are to keep track of questions where the answer key states that
    // multiple options are correct.
    const atLeastOneRequirement = findMatchingRequirements(moduleQuestions, "atLeastOne");
    const anyAnswerRequirement = findMatchingRequirements(moduleQuestions, "any");
    const customRequirements = {
      atLeastOne: atLeastOneRequirement,
      any: anyAnswerRequirement
    };

    // get responseList with only responses for this module
    // this is an important step because later we search this list using question numbers
    const responseList = filterReflectionActions(modName, student.reflectionAction);
    for (const column of headerArray) {
      if(column.id.includes('col')){
        // this is one of the constant columns (not dependent on module questions)
        continue;
      }
      const id = column.id;
      const idSplit = id.split("_");
      const questionNumber = idSplit[0]; // this always exists
      let label1 = idSplit[1] ? idSplit[1] : "";
      let label2 = idSplit[2] ? idSplit[2] : "";
      let finalResponseString = "";
      if (responseList.length === 0) {
        newRecord[id] = finalResponseString;
        continue;
      }
      let mostRecentAnswerTime = 0; // use this for edge case where student has multiple answers for the same question
      let studentAnswer = "";
      for(const response of responseList) {
        if (response.questionNumber === questionNumber) {
          // check that this is the most recent answer for this question
          if (mostRecentAnswerTime === 0) {
            mostRecentAnswerTime = response.absoluteTimeContinued;
          } else {
            if (response.absoluteTimeContinued <= mostRecentAnswerTime) {
              // this is an old response, skip it
              continue;
            } else {
              mostRecentAnswerTime = response.absoluteTimeContinued;
            }
          }
          finalResponseString = parseResponse(idSplit, moduleQuestions[questionNumber], response, customRequirements);
        }
      }
      newRecord[id] = finalResponseString;
    }
    records.push(newRecord);
  }
  return records;
}

exports.postClassReflectionResponsesCsv = async (req, res, next) => {
  if (!req.user.isInstructor) {
    return res.json({classReflectionResponses: {}});
  }
  // Use reflectionSecionData.json to define the structure of the output csv
  // fs.readFile does not return a promise, so promisify it
  // reference: https://javascript.info/promisify
  const filePath = './public2/json/reflectionSectionData.json';
  let readFilePromise = function(filePath) {
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, (err, data) => {
        if (err) {
          reject(err);
        }
        resolve(data);
      })
    })
  }
  const reflectionJsonBuffer = await readFilePromise(filePath).then(function(data) {
    return data;
  });
  let reflectionJson;
  try {
    reflectionJson = JSON.parse(reflectionJsonBuffer);
  } catch (err) {
    return next(err);
  }
  const moduleQuestions = reflectionJson[req.params.modName];
  // Build the layout of the output csv based on the reflectionJson content
  const headerArray = buildHeaderArray(moduleQuestions);
  const outputFilePath = `public2/downloads/classReflectionResponses_${req.user.username}.csv`
  const csvWriter = createCsvWriter({
      path: outputFilePath,
      header: headerArray
  });
  let records = [];
  records = buildSubHeaderRecords(headerArray, records, moduleQuestions);
  Class.findOne({
    accessCode: req.params.classId,
    teacher: req.user.id,
    deleted: false
  }).populate('students')
  .exec(async function (err, found_class) {
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
    records = addClassReflectionRecords(req.params.modName, headerArray, records, moduleQuestions, found_class);
    await csvWriter.writeRecords(records);
    res.download(outputFilePath, `reflectionResponses_${req.params.classId}.csv`, function(err) {
      if (err) {
        console.log(err);
        return next(err);
      }
      fs.unlink(outputFilePath, function(err) {
        if (err) {
          console.log(err)
          return next(err);
        }
      });
    });
  });
}

exports.postClassTimeReportCsv = async (req, res, next) => {
  if (!req.user.isInstructor) {
    return res.json({classReflectionResponses: {}});
  }
  let headerArray = [
    {id: 'username', title: 'Username'},
    {id: 'name', title: "Name"},
    {id: 'total', title: "Total Time to Complete"},
    {id: '1', title: "Time Spent in the Learn Section (minutes)"},
    {id: '2', title: "Time Spent in the Practice Section (minutes)"},
    {id: '3', title: "Time Spent in the Explore Section (minutes)"},
    {id: '4', title: "Time Spent in the Reflect Section (minutes)"}
  ];
  const timeReportFilepath = `public2/downloads/classTimeReport_${req.user.username}.csv`
  const csvWriter = createCsvWriter({
      path: timeReportFilepath,
      header: headerArray
  });
  Class.findOne({
    accessCode: req.params.classId,
    teacher: req.user.id,
    deleted: false
  }).populate('students')
  .exec(async function (err, found_class) {
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
    let filePath = '';
    switch (req.params.modName) {
      case 'cyberbullying':
      case 'digfoot':
        filePath = "./public2/json/progressDataB.json";
        break;
      default:
        filePath = "./public2/json/progressDataA.json";
        break;
    }
    let readFilePromise = function(filePath) {
      return new Promise((resolve, reject) => {
        fs.readFile(filePath, (err, data) => {
          if (err) {
            reject(err);
          }
          resolve(data);
        })
      })
    }
    const sectionJsonBuffer = await readFilePromise(filePath).then(function(data) {
      return data;
    });
    const sectionJson = JSON.parse(sectionJsonBuffer);
    let records = [];
    // console.log(sectionJson)
    // get class page times
    let classPageTimes = getClassPageTimes(found_class, req.params.modName);
    for(const student of classPageTimes) {
      if(!student.timeArray) {
        continue;
      }
      // use this to get real name, if one has been added
      let user = await User.findOne({
        username: student.username,
        accessCode: req.params.classId,
        deleted: false
      });
      if(user == null){
        console.log("NULL");
        var myerr = new Error('User not found!');
        return next(myerr);
      }
      let newRecord = {
        username: student.username,
        name: user.name,
        total: 0,
        '1': 0,
        '2': 0,
        '3': 0,
        '4': 0
      }
      for(const timeItem of student.timeArray) {
        if(!sectionJson[timeItem.subdirectory1]){
          continue;
        }
        if(sectionJson[timeItem.subdirectory1] === "end"){
          continue;
        }
        const sectionId = sectionJson[timeItem.subdirectory1];
        newRecord[sectionId] += parseFloat(timeItem.timeDuration);
        newRecord.total += parseFloat(timeItem.timeDuration);
      }
      // before pushing the record, round all numbers to nearest int.
      for(let i=1; i<5; i++){
        newRecord[i] = Math.round(newRecord[i]);
      }
      newRecord.total = Math.round(newRecord.total);
      records.push(newRecord);
    }
    await csvWriter.writeRecords(records);
    res.download(timeReportFilepath, `timeReport_${req.params.classId}.csv`, function(err) {
      if (err) {
        console.log(err);
        return next(err);
      }
      fs.unlink(timeReportFilepath, function(err) {
        if(err) {
          console.log(err);
          return next(err);
        }
      });
    });
  });
}
