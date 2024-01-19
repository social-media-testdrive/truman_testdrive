const User = require('../models/User');
const Class = require('../models/Class.js');
const passport = require('passport');
const validator = require('validator');
const fs = require('fs');

//create random id for guest accounts
function makeid(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

/**
 * GET /login
 * Login page.
 * Route only exists if isResearchVersion = true.
 */
exports.getLogin = (req, res) => {
    if (req.user) {
        return res.redirect('/');
    }
    res.render('account/login', {
        title: 'Login'
    });
};

/**
 * GET /classLogin/:accessCode
 * Login page for a student in a class.
 * Route only exists if isResearchVersion = true.
 */
exports.getClassLogin = (req, res) => {
    if (req.user) {
        return res.redirect('/');
    }
    res.render('account/classLogin', {
        title: 'Class Login',
        accessCode: req.params.accessCode
    });
};

/**
 * POST /studentLogin/:accessCode
 * Sign in using username.
 * Route only exists if isResearchVersion = true.
 */
exports.postStudentLogin = (req, res, next) => {
    //req.assert('email', 'Email is not valid').isEmail();
    // commented out by Anna
    //req.assert('password', 'Password cannot be blank').notEmpty();
    req.assert('username', 'Please enter your username.').notEmpty();
    //req.sanitize('email').normalizeEmail({ remove_dots: false });

    const errors = req.validationErrors();

    if (errors) {
        req.flash('errors', errors);
        return res.redirect(`/classLogin/${req.params.accessCode}`);
    }

    passport.authenticate('student-local', (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            req.flash('errors', info);
            return res.redirect(`/classLogin/${req.params.accessCode}`);
        }
        if (!(user.active)) {
            //console.log("FINAL");
            req.flash('final', { msg: '' });
            return res.redirect(`/classLogin/${req.params.accessCode}`);
        }
        req.logIn(user, (err) => {
            if (err) { return next(err); }
            //req.flash('success', { msg: 'Success! You are logged in.' });
            var temp = req.session.passport; // {user: 1}
            req.session.regenerate(function(err) {
                //req.session.passport is now undefined
                req.session.passport = temp;
                req.session.save(function(err) {
                    user.logUser(Date.now());
                    return res.redirect('/');
                });
            });
        });
    })(req, res, next);
};

/**
 * POST /instructorLogin
 * Sign in using username and password.
 * Route only exists if isResearchVersion = true.
 */
exports.postInstructorLogin = (req, res, next) => {
    const validationErrors = [];
    if (validator.isEmpty(req.body.instructor_password)) validationErrors.push({ msg: 'Username cannot be blank.' });
    if (validator.isEmpty(req.body.instructor_username)) validationErrors.push({ msg: 'Password cannot be blank.' });

    if (validationErrors.length) {
        req.flash('errors', validationErrors);
        return res.redirect('/login');
    }

    passport.authenticate('instructor-local', (err, user, info) => {
        if (err) { return next(err); }
        if (!user) {
            req.flash('errors', info);
            return res.redirect('/login');
        }
        if (!(user.active)) {
            //console.log("FINAL");
            req.flash('final', { msg: '' });
            return res.redirect('/login');
        }
        req.logIn(user, (err) => {
            if (err) { return next(err); }
            // regenerate the session
            var temp = req.session.passport; // {user: 1}
            req.session.regenerate(function(err) {
                //req.session.passport is now undefined
                req.session.passport = temp;
                req.session.save(function(err) {
                    user.logUser(Date.now());
                    if (req.user.isStudent) {
                        return res.redirect('/');
                    } else if (req.user.isInstructor) {
                        return res.redirect('/classManagement');
                    } else {
                        return res.redirect('/');
                    }
                });
            });
        });
    })(req, res, next);
};

/**
 * GET /logout
 * Log out.
 */
exports.logout = (req, res) => {
    const classCode = req.user.isStudent ? req.user.accessCode : null;
    req.logout((err) => {
        if (err) console.log('Error : Failed to logout.', err);
        req.session.destroy((err) => {
            if (err) console.log('Error : Failed to destroy the session during logout.', err);
            req.user = null;
            if (classCode) {
                res.redirect(`/classLogin/${classCode}`);
            } else {
                res.redirect('/');
            }
        });
    });
};

/**
 * GET /guest/:modId
 * Create a new local guest account.
 */
exports.getGuest = async(req, res, next) => {
    if (req.params.modId === "delete") {
        // avoiding a specific user behavior that causes 500 errors
        res.send({
            result: "failure"
        });
    }
    const currDate = Date.now();
    try {
        const user = new User({
            username: "guest" + makeid(10),
            password: "thinkblue",
            active: true,
            isGuest: true,
            lastNotifyVisit: currDate,
            profile: {
                name: "Guest",
                location: "Guest Town",
                bio: "",
                picture: "avatar-icon.svg"
            }
        });

        const existingUser = await User.findOne({ username: req.body.username }).exec();
        if (existingUser) {
            req.flash('errors', { msg: 'An account with that Username already exists.' });
            return res.redirect('/guest/' + req.params.modId);
        } else {
            await user.save();
            req.logIn(user, (err) => {
                if (err) {
                    return next(err);
                }
                user.logUser(currDate);
                res.redirect('/intro/' + req.params.modId);
            });
        }
    } catch (err) {
        next(err);
    }
};

/*
 * GET /account/:modId
 * Update Your Profile page.
 */
exports.getAccount = (req, res) => {
    res.render('account/profile', {
        title: 'Account Management',
        mod: req.params.modId
    });
};

/**
 * POST /account/profile/:modId
 * Update profile information.
 */
exports.postUpdateProfile = async(req, res, next) => {
    const validationErrors = [];
    if (validator.isEmpty(req.body.name)) validationErrors.push({ msg: 'Name cannot be blank.' });
    if (validationErrors.length) {
        req.flash('errors', validationErrors);
        return res.redirect('/login');
    }

    try {
        const user = await User.findById(req.user.id).exec();
        user.profile.name = req.body.name || '';
        user.profile.location = req.body.location || '';
        user.profile.bio = req.body.bio || '';
        user.profile.picture = req.body.profilePhoto;

        if (req.body.enableDataCollection === "true") {
            let cat = {
                absoluteTimeChanged: Date.now(),
                name: req.body.name || '',
                location: req.body.location || '',
                bio: req.body.bio || '',
                picture: req.body.profilePhoto || ''
            }
            user.profileHistory.push(cat);
        }

        await user.save();
        res.redirect('/modual/' + req.params.modId);
    } catch (err) {
        next(err);
    }
};

/*
 * GET /me/:modId
 * Profile page.
 */
exports.getMe = async(req, res) => {
    try {
        const user = await User.findById(req.user.id).exec();
        const userPosts = user.getPosts(req.params.modId);
        res.render('me', { posts: userPosts, title: user.profile.name || 'My Profile' });
    } catch (err) {
        next(err);
    }
};

/**
 * POST /pageLog
 * Post a pageLog.
 */
exports.postPageLog = async(req, res, next) => {
    try {
        const user = await User.findById(req.user.id).exec();
        user.logPage(Date.now(), req.body.subdirectory1, req.body.subdirectory2);
        res.set('Content-Type', 'application/json; charset=UTF-8');
        res.send({ result: "success" });
    } catch (err) {
        next(err);
    }
};

/*
 * GET /habitsTimer
 * Get the timestamp information for the habits module.
 */
exports.getHabitsTimer = async(req, res) => {
    try {
        const user = await User.findById(req.user.id).exec();
        const startTime = user.firstHabitViewTime;
        let totalTimeViewedHabits = 0;
        if (user.habitsTimer) {
            for (const time of user.habitsTimer) {
                totalTimeViewedHabits += time;
            }
        }
        res.set('Content-Type', 'application/json; charset=UTF-8');
        res.json({
            startTime: startTime,
            totalTimeViewedHabits: totalTimeViewedHabits
        });
    } catch (err) {
        next(err);
    }
};

/*
 * POST /updateName
 * Update profile information with name input by an instructor.
 */
exports.postName = async(req, res, next) => {
    try {
        const student = await User
            .findOne({
                accessCode: req.body.accessCode,
                username: req.body.username
            }).exec();
        if (!student) {
            const myerr = new Error('Student not found!');
            return next(myerr);
        }
        student.name = req.body.name;
        await student.save();
        res.redirect(`/viewClass/${req.body.accessCode}`);
    } catch (err) {
        next(err);
    }
}

/**
 * POST /interest
 * Update user with the topic the user selected in the current module.
 */
exports.postUpdateInterestSelection = async(req, res, next) => {
    try {
        const user = await User.findById(req.user.id).exec();
        let userTopic;
        switch (req.body.subdirectory2) {
            case 'targeted':
                userTopic = user.targetedAdTopic;
                break;
            case 'esteem':
                userTopic = user.esteemTopic;
                break;
        }
        userTopic.push(req.body.chosenTopic);
        await user.save();
        res.set('Content-Type', 'application/json; charset=UTF-8');
        res.send({ result: "success" });
    } catch (err) {
        next(err);
    }
};

/**
 * GET /esteemTopic
 * Get the topic the user selected in the esteem module.
 */
exports.getEsteemTopic = async(req, res) => {
    try {
        const user = await User.findById(req.user.id).exec();
        const selectedTopic = user.esteemTopic[user.esteemTopic.length - 1];
        res.set('Content-Type', 'application/json; charset=UTF-8');
        res.send({ esteemTopic: selectedTopic });
    } catch (err) {
        next(err);
    }
};


/**
 * POST /habitsTimer
 * Update the timestamp information for the habits module.
 */
exports.postUpdateHabitsTimer = async(req, res, next) => {
    try {
        const user = await User.findById(req.user.id).exec();
        user.habitsTimer.push(req.body.habitsTimer);
        if (req.body.habitsStart) { //we are trying to record when the user first opened the free-play section
            if (user.firstHabitViewTime == -1) { //only write this value if there's no value written yet, since user can revisit the feed
                user.firstHabitViewTime = req.body.habitsStart;
            }
        }
        await user.save();
        res.set('Content-Type', 'application/json; charset=UTF-8');
        if (req.body.habitsStart) {
            res.json({ url: '/modual/habits' });
        } else {
            res.send({ result: "success" });
        }
    } catch (err) {
        next(err);
    }
};

/**
 * POST /voiceoverTimer
 * Update the durations voiceover is turned on.
 */
exports.postUpdateVoiceoverTimer = async(req, res, next) => {
    try {
        const user = await User.findById(req.user.id).exec();
        user.voiceoverTimer.push(req.body.voiceoverTimer);
        await user.save();
        res.set('Content-Type', 'application/json; charset=UTF-8');
        res.send({ result: "success" });
    } catch (err) {
        next(err);
    };
}

/**
 * POST /moduleProgress
 * Update module progress.
 */
exports.postUpdateModuleProgress = async(req, res, next) => {
    try {
        const user = await User.findById(req.user.id).exec();
        // Once marked completed, do not update status again.
        if (user.moduleProgress[req.body.module] !== 'completed') {
            user.moduleProgress[req.body.module] = req.body.status;
        }
        await user.save();
        res.set('Content-Type', 'application/json; charset=UTF-8');
        res.send({ result: "success" });
    } catch (err) {
        next(err);
    }
};

/*
 * POST /postUpdateNewBadge
 * Save a new badge earned by the current user.
 */
exports.postUpdateNewBadge = async(req, res, next) => {
    try {
        const user = await User.findById(req.user.id).exec();
        // check if the user already has earned this badge
        for (const badge of user.earnedBadges) {
            if (badge.badgeId === req.body.badgeId) {
                return res.sendStatus(200);
            }
        }
        // otherwise, create a new badge using the info in the request body
        const newBadge = {
            badgeId: req.body.badgeId,
            badgeTitle: req.body.badgeTitle,
            badgeImage: req.body.badgeImage,
            dateEarned: Date.now()
        }
        user.earnedBadges.push(newBadge);
        await user.save();
        return res.sendStatus(200);
    } catch (err) {
        next(err);
    }
}

// Helper function to get the Date the user last accessed the given module
function getDateLastAccessed(pageLog, modName) {
    /*
    New pageLog item added each time a user opens a page.
    pageLog: [new Schema({
      time: Date,
      subdirectory1: String,
      subdirectory2: String
    })]
    */
    let lastAccessed = 0;
    for (const page of pageLog) {
        if (page.subdirectory2 === modName) {
            if (page.time > lastAccessed) {
                lastAccessed = page.time;
            }
        }
    }
    return lastAccessed;
}

/**
 * GET /getLearnerGeneralModuleData
 * Get general data needed to populate the learner dashboard
 */
exports.getLearnerGeneralModuleData = (req, res, next) => {
    if (!req.user.isStudent) {
        return res.status(400).send('Bad Request')
    }
    let moduleStatuses = {};
    // get a list of module names, with dashes added where needed
    let allModNames = [];
    for (const modName of Object.keys(req.user.moduleProgress.toJSON())) {
        /*
        from the User model:
        moduleProgress: { // marks the progress of each module: none, started, completed
          accounts: {type: String, default: 'none'},
          ...
          targeted: {type: String, default: 'none'}
        },
        */
        if (modName === "digitalliteracy") {
            allModNames.push('digital-literacy');
        } else if (modName === "safeposting") {
            allModNames.push('safe-posting');
        } else {
            allModNames.push(modName);
        }
    }
    for (const modName of allModNames) {
        const modNameNoDashes = modName.replace('-', ''); // modNames in user.moduleProgress do not have dashes where they usually do
        moduleStatuses[modName] = {};
        moduleStatuses[modName]['status'] = req.user.moduleProgress[modNameNoDashes];
        moduleStatuses[modName]['lastAccessed'] = getDateLastAccessed(req.user.pageLog, modName);
        moduleStatuses[modName]['likes'] = 0;
        moduleStatuses[modName]['flags'] = 0;
        moduleStatuses[modName]['replies'] = 0;
        // get timeline action counts
        for (const post of req.user.feedAction) {
            // ignore posts that aren't in the relevant module
            if (post.modual !== modName) {
                continue;
            }
            if (post.liked) {
                moduleStatuses[modName].likes++;
            }
            if (post.flagged) {
                moduleStatuses[modName].flags++;
            }
            for (const comment of post.comments) {
                if (comment.new_comment) {
                    moduleStatuses[modName].replies++;
                }
            }
        }
    }
    res.set('Content-Type', 'application/json; charset=UTF-8');
    res.send(moduleStatuses);
}

// Helper function to get the data from the given .json file
async function getSectionJsonFromFile(filePath) {
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
    let sectionJson;
    try {
        sectionJson = JSON.parse(sectionJsonBuffer);
    } catch (err) {
        return next(err);
    }
    return sectionJson;
}

/**
 * GET /getLearnerSectionTimeData
 * Get the time data needed to populate the learner dashboard
 */
exports.getLearnerSectionTimeData = async(req, res, next) => {
    if (!req.user.isStudent) {
        return res.status(400).send('Bad Request')
    }
    const pageLog = req.user.pageLog;
    /*
    New pageLog item added each time a user opens a page.
    pageLog: [new Schema({
      time: Date,
      subdirectory1: String,
      subdirectory2: String
    })]
    */

    let allSectionTimeData = {
            'accounts': { 'learn': 0, 'explore': 0, 'practice': 0, 'reflect': 0 },
            'advancedlit': { 'learn': 0, 'explore': 0, 'practice': 0, 'reflect': 0 },
            'cyberbullying': { 'learn': 0, 'explore': 0, 'practice': 0, 'reflect': 0 },
            'digfoot': { 'learn': 0, 'explore': 0, 'practice': 0, 'reflect': 0 },
            'digital-literacy': { 'learn': 0, 'explore': 0, 'practice': 0, 'reflect': 0 },
            'esteem': { 'learn': 0, 'explore': 0, 'practice': 0, 'reflect': 0 },
            'habits': { 'learn': 0, 'explore': 0, 'practice': 0, 'reflect': 0 },
            'phishing': { 'learn': 0, 'explore': 0, 'practice': 0, 'reflect': 0 },
            'presentation': { 'learn': 0, 'explore': 0, 'practice': 0, 'reflect': 0 },
            'privacy': { 'learn': 0, 'explore': 0, 'practice': 0, 'reflect': 0 },
            'safe-posting': { 'learn': 0, 'explore': 0, 'practice': 0, 'reflect': 0 },
            'targeted': { 'learn': 0, 'explore': 0, 'practice': 0, 'reflect': 0 }
        }
        // First, need to get the mappings between module pages and section numbers
    const sectionDataA = await getSectionJsonFromFile("./public2/json/progressDataA.json");
    const sectionDataB = await getSectionJsonFromFile("./public2/json/progressDataB.json");
    /* Short example of the data in progressDataA and progressDataB:
      {
        "start": "1",
        "sim": "2",
        "trans_script": "3",
        "modual": "3",
        "results": "4",
        "end": "end"
      }
      where the key corresponds to page name, value corresponds to a section number
      1 = "learn" section
      2 = "practice" section
      3 = "explore" section
      4 = "reflect" section
    */
    for (const modName of Object.keys(allSectionTimeData)) {
        // if module has not been completed, skip it
        const modNameNoDashes = modName.replace('-', '');
        // modNames in user.moduleProgress do not have dashes where they usually do
        if (req.user.moduleProgress[modNameNoDashes] !== "completed") {
            continue;
        }
        // select the corresponding sectionData, A or B, to use depending on the module
        let sectionJson = {};
        switch (modName) {
            case 'cyberbullying':
            case 'digfoot':
                sectionJson = sectionDataB;
                break;
            default:
                sectionJson = sectionDataA;
                break;
        }
        for (let i = 0, l = pageLog.length - 1; i < l; i++) {
            // skip pageLog entries that are not for the specified module
            if ((!pageLog[i].subdirectory2) || (pageLog[i].subdirectory2 !== modName)) {
                continue;
            }
            // convert from ms to minutes
            let timeDurationOnPage = (pageLog[i + 1].time - pageLog[i].time) / 60000;
            // skip any page times that are longer than 30 minutes
            if (timeDurationOnPage > 30) {
                continue;
            }
            // add the page time to the appropriate section's total time:
            const sectionNumber = sectionJson[pageLog[i].subdirectory1];
            if (sectionNumber === "1") {
                allSectionTimeData[modName].learn += timeDurationOnPage;
            } else if (sectionNumber === "2") {
                allSectionTimeData[modName].practice += timeDurationOnPage;
            } else if (sectionNumber === "3") {
                allSectionTimeData[modName].explore += timeDurationOnPage;
            } else if (sectionNumber === "4") {
                allSectionTimeData[modName].reflect += timeDurationOnPage;
            } else {
                continue;
            }
        }
        // round each number using Math.round (note that this is inconsistent with
        // the teacher dashbord time displays, which all round using Math.floor)
        for (const section of Object.keys(allSectionTimeData[modName])) {
            allSectionTimeData[modName][section] = Math.round(allSectionTimeData[modName][section]);
        }
    }
    res.set('Content-Type', 'application/json; charset=UTF-8');
    res.send(allSectionTimeData);
}

/**
 * GET /getLearnerEarnedBadges
 * Get the list of badges earned by the current user.
 */
exports.getLearnerEarnedBadges = (req, res, next) => {
    if (!req.user.isStudent) {
        return res.status(400).send('Bad Request')
    }
    let earnedBadges = [];
    for (const badge of req.user.earnedBadges) {
        /*
        earnedBadges: [new Schema({
          badgeId: String,
          badgeTitle: String,
          badgeImage: String,
          dateEarned: Date
        })],
        */
        const badgeInfo = {
            title: badge.badgeTitle,
            image: badge.badgeImage
        };
        earnedBadges.push(badgeInfo);
    }
    res.set('Content-Type', 'application/json; charset=UTF-8');;
    res.send(earnedBadges);
}

/**
 * POST /delete
 * Delete user account.
 */
exports.getDeleteAccount = async(req, res, next) => {
    // Is this a guest account?
    if (typeof req.user.isGuest !== 'undefined' && req.user.isGuest) {
        await User.deleteOne({ _id: req.user.id }).exec();
        req.logout((err) => {
            if (err) console.log('Error : Failed to logout.', err);
            req.session.destroy((err) => {
                if (err) console.log('Error : Failed to destroy the session during logout.', err);
                req.user = null;
                res.send({
                    result: "success"
                });
            });
        });
    } else {
        const user = await User.findById(req.user.id).exec();

        user.feedAction = [];
        await user.save();
        res.set('Content-Type', 'application/json; charset=UTF-8');
        res.send({ result: "success" });
    }
};