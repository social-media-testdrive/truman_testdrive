const Class = require('../models/Class.js');
const User = require('../models/User');
const CSVToJSON = require("csvtojson");
const fs = require('fs');
const validator = require('validator');
const createCsvStringifier = require('csv-writer').createObjectCsvStringifier;

/**
 * GET /classManagement
 * Render the class management page in the teacher dashboard
 */
exports.getClasses = (req, res) => {
    if (!req.user.isInstructor) {
        res.redirect('/');
    }
    Class.find({ teacher: req.user.id, deleted: false })
        .then((classes) => {
            //classes is array with all classes for this instructor
            res.render('teacherDashboard/classManagement', { classes: classes });
        })
        .catch((err) => done(err));
}

/**
 * GET /classSize/:classId
 * Return how many students there are in a specified class
 */
exports.getClassSize = (req, res, next) => {
    if (!req.user.isInstructor) {
        res.redirect('/');
    }
    Class.findOne({
            accessCode: req.params.classId,
            teacher: req.user.id,
            deleted: false
        })
        .then((found_class) => {
            if (!found_class) {
                const myerr = new Error('Class not found!');
                return next(myerr);
            }
            const studentCount = found_class.students.length;
            res.set('Content-Type', 'application/json; charset=UTF-8');
            res.json({ studentCount: studentCount });
        })
        .catch((err) => done(err));
}

/*
 * GET /viewClass/:classId
 * Render the page to view a single class owned by the current instructor
 */
exports.getClass = (req, res, next) => {
    if (!req.user.isInstructor) {
        res.redirect('/');
    }
    Class.findOne({
            accessCode: req.params.classId,
            teacher: req.user.id,
            deleted: false
        })
        .populate('students')
        .then((found_class) => {
            if (!found_class) {
                const myerr = new Error('Class not found!');
                return next(myerr);
            }
            res.render('teacherDashboard/viewClass', { found_class: found_class });
        })
        .catch((err) => done(err));
}

/**
 * GET /classUsernames/:classId
 * Get list of usernames for all students in a class
 */
exports.getClassUsernames = (req, res, next) => {
    if (!req.user.isInstructor) {
        return res.json({ classUsernames: [] });
    }
    Class.findOne({
            accessCode: req.params.classId,
            teacher: req.user.id,
            deleted: false
        })
        .populate('students')
        .then((found_class) => {
            if (!found_class) {
                const myerr = new Error('Class not found!');
                return next(myerr);
            }
            const usernameArray = found_class.map(student => student.username);
            res.set('Content-Type', 'application/json; charset=UTF-8');
            res.json({ classUsernames: usernameArray });
        })
        .catch((err) => done(err));
}

/*
 * GET /classIdList
 * Get a list of all the classes (accessCodes) owned by the current instructor
 */
exports.getClassIdList = (req, res, next) => {
    if (!req.user.isInstructor) {
        return res.status(400).send("Bad Request");
    }
    Class.find({
            teacher: req.user.id,
            deleted: false
        })
        .then((classes) => {
            const outputData = classes.map(classObj => classObj.accessCode);
            res.set('Content-Type', 'application/json; charset=UTF-8');
            res.json({ classIdList: outputData });
        })
        .catch((err) => done(err));
}

/**
 * GET /moduleProgress/:classId
 * Get the module progress status for all students in a class
 */
exports.getModuleProgress = (req, res, next) => {
    if (!req.user.isInstructor) {
        return res.json({ classModuleProgress: {} });
    }
    Class.findOne({
            accessCode: req.params.classId,
            teacher: req.user.id,
            deleted: false
        })
        .populate('students')
        .then((found_class) => {
            if (!found_class) {
                const myerr = new Error('Class not found!');
                return next(myerr);
            }
            const outputData = {};
            for (const student of found_class.students) {
                const modProgressObj = student.moduleProgress.toObject();
                const username = student.username;
                outputData[username] = modProgressObj;
            }
            res.set('Content-Type', 'application/json; charset=UTF-8');
            res.json({ classModuleProgress: outputData });
        })
        .catch((err) => done(err));
}

function getClassPageTimes(found_class, modName) {
    let classPageTimes = [];
    for (const student of found_class.students) {
        const pageLog = student.pageLog;
        let pageTimeArray = [];
        for (let i = 0, l = pageLog.length - 1; i < l; i++) {
            // if a modName is specified, skip pageLog entries that are not for that modName
            if (modName) {
                if (pageLog[i].subdirectory2 !== modName) {
                    continue;
                }
            }
            // if the student has not completed the module yet, skip any pageLogs for that module
            if (pageLog[i].subdirectory2) {
                const modNameNoDashes = pageLog[i].subdirectory2.replace('-', '');
                if (student.moduleProgress[modNameNoDashes] !== "completed") {
                    continue;
                }
            }
            // convert from ms to minutes
            let timeDurationOnPage = (pageLog[i + 1].time - pageLog[i].time) / 60000;
            // skip any page times that are longer than 30 minutes
            if (timeDurationOnPage > 30) {
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
        const pushStudentObject = {
            "username": student.username,
            "timeArray": pageTimeArray
        };
        classPageTimes.push(pushStudentObject);
    }
    return classPageTimes;
}

/**
 * GET /classPageTimes/:classId/:modName
 * Gets page times for an entire class, only reports logs of completed modules.
 * Optional parameter of modName to further filter page time list.
 */
exports.getClassPageTimes = (req, res, next) => {
    if (!req.user.isInstructor) {
        return res.json({ classPageTimes: {} });
    }
    Class.findOne({
            accessCode: req.params.classId,
            teacher: req.user.id,
            deleted: false
        })
        .populate('students')
        .then((found_class) => {
            if (!found_class) {
                const myerr = new Error('Class not found!');
                return next(myerr);
            }
            let classPageTimes = getClassPageTimes(found_class, req.params.modName);
            res.set('Content-Type', 'application/json; charset=UTF-8');
            res.json({ classPageTimes: classPageTimes });
        })
        .catch((err) => done(err));
}

/**
 * GET /classFreeplayActions/:classId/:modName
 * Get the feedAction data within the specified module for each student in the class.
 */
exports.getClassFreeplayActions = (req, res, next) => {
    if (!req.user.isInstructor) {
        return res.json({ classFreeplayActions: {} });
    }
    Class.findOne({
            accessCode: req.params.classId,
            teacher: req.user.id,
            deleted: false
        })
        .populate('students')
        .then((found_class) => {
            if (!found_class) {
                const myerr = new Error('Class not found!');
                return next(myerr);
            }
            const outputData = {};
            for (const student of found_class.students) {
                const actionList = student.feedAction.filter(action => action.modual === req.params.modName);
                outputData[student.username] = actionList;
            }
            res.set('Content-Type', 'application/json; charset=UTF-8');
            res.json({ classFreeplayActions: outputData });
        })
        .catch((err) => done(err));
}

/**
 * GET /classReflectionResponses/:classId
 * Get all of the reflection responses for each student in the class.
 */
exports.getReflectionResponses = (req, res, next) => {
    if (!req.user.isInstructor) {
        return res.json({ classReflectionResponses: {} });
    }
    Class.findOne({
            accessCode: req.params.classId,
            teacher: req.user.id,
            deleted: false
        })
        .populate('students')
        .then((found_class) => {
            if (!found_class) {
                const myerr = new Error('Class not found!');
                return next(myerr);
            }
            const outputData = {};
            for (const student of found_class.students) {
                const reflectionActions = student.reflectionAction.toObject();
                const username = student.username;
                outputData[username] = reflectionActions;
            }
            res.set('Content-Type', 'application/json; charset=UTF-8');
            res.json({ reflectionResponses: outputData });
        })
        .catch((err) => done(err));
}

/**
 * POST /class/create
 * Update/Create Instructor's class
 */
exports.postCreateClass = async(req, res, next) => {
    if (!req.user.isInstructor) {
        req.logout((err) => {
            if (err) console.log('Error : Failed to logout.', err);
            req.session.destroy((err) => {
                if (err) console.log('Error : Failed to destroy the session during logout.', err);
                req.user = null;
                res.redirect('/login');
            });
        });
    }
    const validationErrors = [];
    if (validator.isEmpty(req.body.classname)) validationErrors.push({ msg: 'Class Name cannot be blank.' });
    if (validator.isEmpty(req.body.accesscode)) validationErrors.push({ msg: 'Access Code cannot be blank.' });
    if (!validator.isLength(req.body.accesscode, { min: 4 })) validationErrors.push({ msg: 'Access Code must be at least 4 characters long.' });

    if (validationErrors.length) {
        req.flash('errors', validationErrors);
        return res.redirect('/classManagement');
    }

    try {
        const user = await User.findById(req.user.id).exec();
        const new_class = new Class({
            className: req.body.classname,
            teacher: user,
            accessCode: req.body.accesscode
        });
        const existingClass = await Class.findOne({
            accessCode: req.body.accesscode,
            deleted: false
        }).exec();

        if (existingClass) {
            req.flash('errors', { msg: 'Class with that Access Code already exists. Try another Access Code.' });
            return res.redirect('/classManagement');
        } else {
            await new_class.save();
            res.redirect('/classManagement');
        }
    } catch (err) {
        next(err);
    }
}

/**
 * POST /deleteClass
 * Mark a class as "deleted", but do not actually remove it from the database.
 * The class should gerernally be treated as though it is deleted on the front
 * end - it should not appear in charts, downloadable csvs, class lists, etc. This
 * behavior was specifically requested by the researchers.
 */
exports.postDeleteClass = async(req, res, next) => {
    if (!req.user.isInstructor) {
        return res.redirect('/login');
    }
    try {
        const found_class = await Class.findOne({
                className: req.body.className,
                accessCode: req.body.accessCode,
                teacher: req.user._id,
                deleted: false
            })
            .exec();
        if (!found_class) {
            const myerr = new Error('Class not found!');
            return next(myerr);
        }
        const promiseArray = [];
        // iterate through each student and update deleted=true, but do not remove them
        for (const studentId of found_class.students) {
            let student = await User.findById(studentId).exec();
            student.deleted = true;
            promiseArray.push(student.save());
        }
        await Promise.all(promiseArray);
        found_class.deleted = true;
        await found_class.save();
        res.redirect('/classManagement')

    } catch (err) {
        next(err);
    }
}

/**
 * POST /removeStudentFromClass
 * Remove a student from the specified class and mark the student as "deleted" in the
 * database, but do not actually remove the account from the database.
 * The account should gerernally be treated as though it is deleted on the front
 * end - it should not appear in charts, downloadable csvs, class lists, etc. This
 * behavior was specifically requested by the researchers.
 */
exports.removeStudentFromClass = async(req, res, next) => {
    if (!req.user.isInstructor) {
        return res.redirect('/login');
    }
    try {
        const found_class = Class.findOne({
                accessCode: req.body.accessCode,
                teacher: req.user.id,
                deleted: false
            })
            .populate('students')
            .exec();
        if (!found_class) {
            const myerr = new Error('Class not found!');
            return next(myerr);
        }
        // remove the student from the class
        let studentIndex;
        let studentId; // used later to update student User
        for (const student in found_class.students) {
            if (found_class.students[student].username === req.body.username) {
                studentIndex = student;
                studentId = found_class.students[student]._id;
            }
        }
        found_class.students.splice(studentIndex, 1);
        await found_class.save();

        const found_student = User.findById(studentId).exec();
        if (!found_student) {
            const myerr = new Error('Student not found!');
            return next(myerr);
        }
        found_student.deleted = true;
        await found_student.save();
        res.redirect(`/viewClass/${req.body.accessCode}`);
    } catch (err) {
        next(err)
    }
}

// Function copied directly from the MDN web docs:
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
// The maximum is exclusive and the minimum is inclusive
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

// getUniqueUsername is a recursive function that will call itself until it
// generates a username that both (1) does not exist in the db and (2) is not in
// the array of usernames to add in this batch.
async function getUniqueUsername(accessCode, adjectiveArray, nounArray, usernameArray) {
    // While we aren't worried about efficiency, there is the issue that this will
    // miss frequently as more accounts are created.
    let adjective = adjectiveArray[getRandomInt(0, adjectiveArray.length)];
    let noun = nounArray[getRandomInt(0, nounArray.length)];
    let username = `${adjective}${noun}`;
    let result = await User.findOne({
            username: username,
            accessCode: accessCode,
            deleted: false
        })
        .exec();
    if (result !== null) {
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
        start: Date.now(),
        isStudent: true,
        accessCode: req.body.accessCode,
        profile: {
            name: 'Student',
            location: '',
            bio: '',
            picture: 'avatar-icon.svg'
        }
    });
    try {
        await user.save();
        existingClass.students.push(user._id);
    } catch (err) {
        next(err);
    }
}

/**
 * POST /generateStudentAccounts
 * Generate the specified number of student accounts. Each username must be unique.
 */
exports.generateStudentAccounts = async(req, res, next) => {
    try {
        const existingClass = await Class.findOne({
            accessCode: req.body.accessCode,
            deleted: false
        }).exec();

        if (!existingClass) {
            req.flash('errors', { msg: `There was an issue finding the class name. Try again, or click "Contact Us" for assistance.` })
            res.redirect(`/viewClass/${req.body.accessCode}`);
        }


        const adjectives = await CSVToJSON({
            noheader: true,
            output: 'csv'
        }).fromFile('privateFiles/UsernameAdjectiveComponents.csv');
        const adjectiveArray = adjectives[0];

        const nouns = await CSVToJSON({
            noheader: true,
            output: 'csv'
        }).fromFile('privateFiles/UsernameNounComponents.csv');
        const nounArray = nouns[0];

        // How many accounts could we possibly have in one class?
        // 214 x 180 = 38,520
        // No instructor could possibly need that many, so we will place an arbitrary limit of 300.
        const currentClassSize = existingClass.students.length;
        const requestedNumberOfAccounts = parseInt(req.body.numberOfAccounts);
        const maximumClassSize = 300;
        if ((currentClassSize + requestedNumberOfAccounts) > maximumClassSize) {
            // Inform that this is too many accounts for one class.
            req.flash('errors', {
                msg: `Each class can only have a maximum of ${maximumClassSize} students.`
            });
            res.redirect(`/viewClass/${req.body.accessCode}`);
        } else {
            let usernameArray = [];
            for (let i = 0; i < requestedNumberOfAccounts; i++) {
                await getUniqueUsername(req.body.accessCode, adjectiveArray, nounArray, usernameArray);
            }
            // async.each is waiting for each call to getUsername to return and runs callback for each of those
            let promiseArray = [];
            for (let username of usernameArray) {
                promiseArray.push(saveUsernameInExistingClass(req, username, existingClass));
            }
            await Promise.all(promiseArray);
            await existingClass.save();
            res.redirect(`/viewClass/${req.body.accessCode}`);
        }
    } catch (err) {
        next(err);
    }
}

/*
 * The following funtcions are all helper functions for creating the reflection
 * response csv.
 */

function buildHeaderArray(moduleQuestions) {
    let headerArray = [
        { id: "col1", title: "" },
        { id: "col2", title: "Questions" },
    ]
    for (const question of Object.keys(moduleQuestions)) {
        // Handle each type of question: written, checkbox, and checkboxGrouped
        switch (moduleQuestions[question].type) {
            case 'written':
                {
                    const newHeaderObject = {
                        id: question,
                        title: moduleQuestions[question].prompt
                    };
                    headerArray.push(newHeaderObject);
                    break;
                }
            case 'checkbox':
                {
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
            case 'checkboxGrouped':
                {
                    /* We need to make the first column title a copy of the question, and
                    the following columns blank for however many checkboxes there will be
                    (refer to a sample layout of the .csv file for an example) */
                    const groupCount = moduleQuestions[question].groupCount;
                    for (let i = 0; i < groupCount; i++) {
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

function buildSubHeaderRecords(headerArray, records, moduleQuestions) {
    // first record built in this function lists all the checkbox labels
    let labelsRecord = {
        col1: "",
        col2: ""
    };
    // second record built in this function lists the recommended answers
    let answersRecord = {
        col1: "",
        col2: "Recommended Answer"
    };
    // build the rest of the records based on the module questions
    for (const column of headerArray) {
        if (column.id.includes('col')) {
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

function parseAnswerKeyComparison(responseRequirement, correctAnswer, studentAnswer, customRequirements, questionNumber, post = "") {
    let finalAnswerString = "";
    switch (responseRequirement) {
        case "exact":
            {
                if ((studentAnswer === "1") && (correctAnswer === "1")) {
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
        case "atLeastOne":
            {
                const customKey = buildObjectKeyString(questionNumber, post);
                if ((studentAnswer === "1") && (correctAnswer === "1")) {
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
    if (questionIdSplit.length === 3) {
        if (customRequirements.atLeastOne[`${questionNumber}_${questionIdSplit[2]}`]) {
            // already determined true, no need to check again
            return;
        }
    }
    if (customRequirements.atLeastOne[questionNumber]) {
        // already determined true, no need to check again
        return;
    }
    switch (questionData.type) {
        case "checkbox":
            {
                // loop through the response and see if the student selected at least one
                let shiftableResponse = response.checkboxResponse;
                for (let i = response.numberOfCheckboxes - 1; i >= 0; i--) {
                    studentAnswer = shiftableResponse & 1 ? "1" : "0";
                    if ((studentAnswer === "1") && (questionData.correctResponses[i] === "1")) {
                        customRequirements.atLeastOne[questionNumber] = true;
                        return;
                    }
                    shiftableResponse = shiftableResponse >> 1;
                }
                return;
            }
        case "checkboxGrouped":
            {
                // loop through the response and see if the student selected at least one
                // more complex because we are working with one binary number that
                // represents multiple responses each for different posts
                const checkboxesPerGroup = Object.keys(questionData.checkboxLabels).length;
                for (let postNumber = parseInt(questionData.groupCount) - 1; postNumber >= 0; postNumber--) {
                    let shiftableResponse = response.checkboxResponse;
                    let bitwiseComparison = 1 << (response.numberOfCheckboxes - (checkboxesPerGroup * (postNumber + 1)));
                    for (let i = checkboxesPerGroup - 1; i >= 0; i--) {
                        studentAnswer = shiftableResponse & bitwiseComparison ? "1" : "0";
                        if ((studentAnswer === "1") && (questionData.correctResponses[postNumber][i] === "1")) {
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
    if (questionData.responseRequirement === "atLeastOne") {
        // There should a better way to do this -
        // this really only needs to be called once per question, not for each column in the header
        checkAtLeastOneCustomRequirement(questionIdSplit, questionData, response, customRequirements);
    }
    // determine the type of response
    switch (questionData.type) {
        case "written":
            {
                studentAnswer = response.writtenResponse;
                return studentAnswer;
            }
        case "checkbox":
            {
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
                for (let i = 0; i < shiftCount; i++) {
                    shiftableResponse = shiftableResponse >> 1;
                }
                studentAnswer = shiftableResponse & 1 ? "1" : "0";
                // compare the student answer with the recommended answer to get the final response string
                // also take into consideration the response requirement, there are different rules
                const questionNumber = questionIdSplit[0];
                const checkboxNumber = questionIdSplit[1];
                const responseRequirement = questionData.responseRequirement;
                const correctResponse = questionData.correctResponses[checkboxNumber];
                let finalAnswerString = parseAnswerKeyComparison(responseRequirement, correctResponse, studentAnswer, customRequirements, questionNumber);
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
            for (let i = 0; i < shiftCount; i++) {
                shiftableResponse = shiftableResponse >> 1;
            }
            studentAnswer = shiftableResponse & 1 ? "1" : "0";
            // compare the student answer with the recommended answer to get the final response string
            // also take into consideration the response requirement, there are different rules
            const postNumber = questionIdSplit[1];
            const checkboxNumber = questionIdSplit[2];
            const responseRequirement = questionData.responseRequirement;
            const correctResponse = questionData.correctResponses[postNumber][checkboxNumber];
            let finalAnswerString = parseAnswerKeyComparison(responseRequirement, correctResponse, studentAnswer, customRequirements, questionNumber, postNumber);
            return finalAnswerString;
        default:
            // todo: how to handle any strange quesions (i.e. radio, habitsUnique)
            studentAnswer = "";
            return studentAnswer;
    }
}

function filterReflectionActions(modName, reflectionActions) {
    let filteredResponseList = [];
    if (reflectionActions.length <= 0) {
        return filteredResponseList;
    }
    for (const action of reflectionActions) {
        if (action.modual === modName) {
            filteredResponseList.push(action);
        }
    }
    return filteredResponseList;
}

function findMatchingRequirements(moduleQuestions, requirementToSearch) {
    let objectToReturn = {};
    for (const question of Object.keys(moduleQuestions)) {
        if (moduleQuestions[question].responseRequirement === requirementToSearch) {
            if (moduleQuestions[question].type === "checkboxGrouped") {
                // include a new key for each post
                for (let i = 0; i < moduleQuestions[question].groupCount; i++) {
                    const key = `${question}_${i}`
                    objectToReturn[key] = false;
                }
            } else {
                objectToReturn[question] = false;
            }
        }
    }
    return objectToReturn;
}

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
            if (column.id.includes('col')) {
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
            for (const response of responseList) {
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

/**
 * POST /downloadReflectionResponses/:classId/:modName
 * Create and download a csv with the class's reflection responses for this
 * module. The responses are compared against an answer key where applicable.
 */
exports.postClassReflectionResponsesCsv = async(req, res, next) => {
    if (!req.user.isInstructor) {
        return res.status(400).send('Bad Request')
    }
    try {
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
        let reflectionJson = JSON.parse(reflectionJsonBuffer);

        const moduleQuestions = reflectionJson[req.params.modName];
        // Build the layout of the output csv based on the reflectionJson content
        const headerArray = buildHeaderArray(moduleQuestions);
        const outputFilePath = `public2/downloads/classReflectionResponses_${req.user.username}.csv`
        let csvOutputString = "";
        let csvStringifier = createCsvStringifier({
            header: headerArray
        });
        let records = [];
        records = buildSubHeaderRecords(headerArray, records, moduleQuestions);
        const found_class = await Class.findOne({
                accessCode: req.params.classId,
                teacher: req.user.id,
                deleted: false
            }).populate('students')
            .exec();
        if (!found_class) {
            const myerr = new Error('Class not found!');
            return next(myerr);
        }
        records = addClassReflectionRecords(req.params.modName, headerArray, records, moduleQuestions, found_class);
        csvOutputString = csvStringifier.getHeaderString() + csvStringifier.stringifyRecords(records);
        res.setHeader('Content-disposition', `attachment; filename=classReflectionResults_${req.user.username}.csv`);
        res.set('Content-Type', 'text/csv');
        res.status(200).send(csvOutputString);
    } catch (err) {
        return next(err);
    }
}

/**
 * POST /postClassTimeReportCsv/:classId/:modName
 * Create and download a cav with the class's time report data for this module.
 */
exports.postClassTimeReportCsv = async(req, res, next) => {
    if (!req.user.isInstructor) {
        return res.json({ classReflectionResponses: {} });
    }
    try {
        let headerArray = [
            "Username",
            "Name",
            "Total Time to Complete",
            "Time Spent in the Learn Section (minutes)",
            "Time Spent in the Practice Section (minutes)",
            "Time Spent in the Explore Section (minutes)",
            "Time Spent in the Reflect Section (minutes)"
        ];

        let csvString = headerArray.join(',') + '\n';

        const found_class = Class.findOne({
                accessCode: req.params.classId,
                teacher: req.user.id,
                deleted: false
            })
            .populate('students')
            .exec();

        if (!found_class) {
            const myerr = new Error('Class not found!');
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
        for (const student of classPageTimes) {
            if (!student.timeArray) {
                continue;
            }
            // use this to get real name, if one has been added
            let user = await User.findOne({
                username: student.username,
                accessCode: req.params.classId,
                deleted: false
            }).exec();
            if (user == null) {
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
            for (const timeItem of student.timeArray) {
                if (!sectionJson[timeItem.subdirectory1]) {
                    continue;
                }
                if (sectionJson[timeItem.subdirectory1] === "end") {
                    continue;
                }
                const sectionId = sectionJson[timeItem.subdirectory1];
                newRecord[sectionId] += parseFloat(timeItem.timeDuration);
                newRecord.total += parseFloat(timeItem.timeDuration);
            }
            // before pushing the record, round all numbers to nearest int.
            for (let i = 1; i < 5; i++) {
                newRecord[i] = Math.round(newRecord[i]);
            }
            newRecord.total = Math.round(newRecord.total);
            records.push([newRecord.username, newRecord.name, newRecord.total, newRecord['1'], newRecord['2'], newRecord['3'], newRecord['4']]);
        }
        csvString += records.join('\n');
        res.setHeader('Content-disposition', `attachment; filename=classTimeReport_${req.user.username}.csv`);
        res.set('Content-Type', 'text/csv');
        res.status(200).send(csvString);
    } catch (err) {
        next(err);
    }
}

/**
 * GET /studentReportData/:classId/:username
 * Get the data used to populate the student report page on the teacher dashboard.
 */
exports.getStudentReportData = async(req, res, next) => {
    if (!req.user.isInstructor) {
        return res.json({ studentPageTimes: {} });
    }
    try {
        const student = await User.findOne({
            accessCode: req.params.classId,
            username: req.params.username,
            deleted: false
        }).exec();
        if (!student) {
            const myerr = new Error('Student not found!');
            return next(myerr);
        }
        // get progress on each module
        // add dashes to the keys that usually have them
        let moduleProgress = {};
        moduleProgress["safe-posting"] = student.moduleProgress['safeposting'];
        moduleProgress["digital-literacy"] = student.moduleProgress['digitalliteracy'];
        for (const key of Object.keys(student.moduleProgress)) {
            if (key !== "digitalliteracy" && key !== "safeposting")
                moduleProgress[key] = student.moduleProgress[key];
        }

        // get page times
        const pageLog = student.pageLog;
        let pageTimeArray = [];
        for (let i = 0, l = pageLog.length - 1; i < l; i++) {
            // convert from ms to minutes
            let timeDurationOnPage = (pageLog[i + 1].time - pageLog[i].time) / 60000;
            // skip any page times longer than 30 minutes
            if (timeDurationOnPage > 30) {
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

        // get freeplay actions
        const freeplayActions = student.feedAction;

        res.set('Content-Type', 'application/json; charset=UTF-8');
        res.json({
            pageTimes: pageTimeArray,
            moduleProgress: moduleProgress,
            freeplayActions: freeplayActions
        });
    } catch (err) {
        next(err);
    }
}