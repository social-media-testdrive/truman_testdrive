const User = require('../models/User');
const Class = require('../models/Class.js');
const passport = require('passport');
const fs = require('fs');

// const Notification = require('../models/Notification.js');

//create random id for guest accounts
function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
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
    // commented out by Anna
    // if (req.user) {
    //   return res.redirect('/');
    // }
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
    //req.assert('email', 'Email is not valid').isEmail();
    req.assert('instructor_password', 'Password cannot be blank').notEmpty();
    req.assert('instructor_username', 'Username cannot be blank').notEmpty();
    //req.sanitize('email').normalizeEmail({ remove_dots: false });

    const errors = req.validationErrors();

    if (errors) {
        req.flash('errors', errors);
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
    if (req.user.isStudent) {
        const classCode = req.user.accessCode;
        req.logout();
        req.session.regenerate(function() {
            res.redirect(`/classLogin/${classCode}`);
        })
    } else {
        req.logout();
        req.session.regenerate(function() {
            res.redirect('/login');
        })
    }
};

/**
 * GET /guest/:modId
 * Create a new local guest account.
 */
exports.getGuest = (req, res, next) => {
    if (req.params.modId === "delete") {
        // avoiding a specific user behavior that causes 500 errors
        res.send({
            result: "failure"
        });
    }
    const user = new User({
        password: "thinkblue",
        username: "guest" + makeid(10),
        group: 'no:no',
        active: true,
        ui: 'no', //ui or no
        notify: 'no', //no, low or high
        isGuest: true,
        lastNotifyVisit: Date.now()
    });

    user.profile.name = "Guest";
    user.profile.location = "Guest Town";
    user.profile.bio = '';
    user.profile.picture = 'avatar-icon.svg';
    //console.log("New Guest is now: "+ user.profile.name);

    User.findOne({ username: req.body.username }, (err, existingUser) => {
        if (err) { return next(err); }
        if (existingUser) {
            req.flash('errors', { msg: 'Account with that Username already exists.' });
            return res.redirect('/guest/' + req.params.modId);
        }
        user.save((err) => {
            if (err) { return next(err); }
            req.logIn(user, (err) => {
                if (err) {
                    return next(err);
                }
                var temp = req.session.passport; // {user: 1}
                req.session.regenerate(function(err) {
                    //req.session.passport is now undefined
                    req.session.passport = temp;
                    req.session.save(function(err) {
                        return res.redirect('/intro/' + req.params.modId);
                    });
                });

            });
        });
    });
};

/*
 * GET /account/:modId
 * Update profile page.
 */
exports.getAccount = (req, res) => {
    res.render('account/profile', {
        title: 'Account Management',
        mod: req.params.modId
    });
};

/*
 * GET /me/:modId
 * Profile page.
 */
exports.getMe = (req, res) => {
    User.findById(req.user.id)
        .populate({
            path: 'posts.reply',
            model: 'Script',
            populate: {
                path: 'actor',
                model: 'Actor'
            }
        })
        .exec(function(err, user) {
            if (err) {
                return next(err);
            }
            var allPosts = user.getPostsAndReplies();
            res.render('me', { posts: allPosts });
        });
};

/**
 * POST /pageLog
 * Post a pageLog
 */
exports.postPageLog = (req, res, next) => {
    User.findById(req.user.id, (err, user) => {
        if (err) { return next(err); }
        user.logPage(Date.now(), req.body.subdirectory1, req.body.subdirectory2);
        user.save((err) => {
            if (err) {
                return next(err);
            }
            res.set('Content-Type', 'application/json; charset=UTF-8');
            res.send({ result: "success" });
        });
    });
};

/*
 * GET /habitsTimer
 * Get the timestamp information for the habits module.
 */
exports.getHabitsTimer = (req, res) => {
    User.findById(req.user.id).exec(function(err, user) {
        var startTime = user.firstHabitViewTime;
        var totalTimeViewedHabits = 0;
        if (user.habitsTimer) {
            for (var i = 0; i < user.habitsTimer.length; i++) {
                totalTimeViewedHabits = totalTimeViewedHabits + user.habitsTimer[i];
            }
        }
        res.set('Content-Type', 'application/json; charset=UTF-8');
        res.json({
            startTime: startTime,
            totalTimeViewedHabits: totalTimeViewedHabits
        });
    });
};

/*
 * POST /updateName
 * Update profile information with name input by an instructor
 */
exports.postName = (req, res, next) => {
    User.findOne({
        accessCode: req.body.accessCode,
        username: req.body.username
    }).exec(function(err, student) {
        if (err) {
            console.log("ERROR");
            console.log(err);
            return next(err);
        }
        if (student == null) {
            console.log("NULL");
            var myerr = new Error('Student not found!');
            return next(myerr);
        }
        student.name = req.body.name;
        student.save((err) => {
            if (err) {
                return next(err);
            }
            res.redirect(`/viewClass/${req.body.accessCode}`);
        });
    });
};

/**
 * POST /interest
 * Update user with the topic the user selected in the current module.
 */
exports.postUpdateInterestSelection = (req, res, next) => {
    User.findById(req.user.id, (err, user) => {
        if (err) {
            return next(err);
        }
        let userTopic = user.targetedAdTopic;
        switch (req.body.subdirectory2) {
            case 'targeted':
                userTopic = user.targetedAdTopic;
                break;
            case 'esteem':
                userTopic = user.esteemTopic;
                break;
        }
        if (userTopic) {
            // this is NOT the first topic selected
            userTopic.push(req.body.chosenTopic);
        } else {
            // this IS the first topic selected
            userTopic = [req.body.chosenTopic];
        }
        user.save((err) => {
            if (err) {
                return next(err);
            }
            res.set('Content-Type', 'application/json; charset=UTF-8');
            res.send({ result: "success" });
        });
    });
};

/**
 * GET /esteemTopic
 * Get the topic the user selected in the esteem module.
 */
exports.getEsteemTopic = (req, res) => {
    User.findById(req.user.id).exec(function(err, user) {
        let selectedTopic = user.esteemTopic[user.esteemTopic.length - 1];
        res.set('Content-Type', 'application/json; charset=UTF-8');
        res.send({ esteemTopic: selectedTopic });
    });
};

/**
 * POST /advancedlitTopic
 * Update Update user with the topic the user selected in the advancedlit module.
 */
exports.postAdvancedlitInterestSelection = (req, res, next) => {
    User.findById(req.user.id, (err, user) => {
        if (err) {
            return next(err);
        }
        user.advancedlitTopic = req.body.chosenTopic || '';
        user.save((err) => {
            if (err) {
                return next(err);
            }
            res.set('Content-Type', 'application/json; charset=UTF-8');
            res.send({ result: "success" });
        });
    });
};

/**
 * GET /advancedlitTopic
 * Get the topic the user selected in the advancedlit module.
 */
exports.getAdvancedlitTopic = (req, res) => {
    User.findById(req.user.id).exec(function(err, user) {
        let selectedTopic = user.advancedlitTopic;
        res.set('Content-Type', 'application/json; charset=UTF-8');
        res.json({ advancedlitTopic: selectedTopic });
    });
};

/**
 * POST /habitsTimer
 * Update the timestamp information for the habits module.
 */
exports.postUpdateHabitsTimer = (req, res, next) => {
    User.findById(req.user.id, (err, user) => {
        if (err) { return next(err); }
        if (req.body.habitsTimer) { //we are adding another view time to the array
            if (user.habitsTimer) {
                user.habitsTimer.push(req.body.habitsTimer);
            } else {
                user.habitsTimer = [req.body.habitsTimer];
            }
        }
        if (req.body.habitsStart) { //we are trying to record when the user first opened the free-play section
            if (user.firstHabitViewTime == -1) { //only write this value if there's no value written yet, since user can revisit the feed
                user.firstHabitViewTime = req.body.habitsStart;
            }
        }
        user.save((err) => {
            if (err) {
                return next(err);
            }
            res.set('Content-Type', 'application/json; charset=UTF-8');
            if (req.body.habitsStart) {
                res.json({ url: '/modual/habits' });
            } else {
                res.send({ result: "success" });
            }
        });
    });
};

/**
 * POST /voiceoverTimer
 * Update the durations voiceover is turned on
 */
exports.postUpdateVoiceoverTimer = (req, res, next) => {
    User.findById(req.user.id, (err, user) => {
        if (err) { return next(err); }
        if (req.body.voiceoverTimer) { //we are adding another voiceover duration to the array
            if (user.voiceoverTimer) {
                user.voiceoverTimer.push(req.body.voiceoverTimer);
            } else {
                user.voiceoverTimer = [req.body.voiceoverTimer];
            }
        }

        user.save((err) => {
            if (err) {
                return next(err);
            }
            res.set('Content-Type', 'application/json; charset=UTF-8');
            res.send({ result: "success" });
        });
    });
};

/**
 * POST /moduleProgress
 * Update module progress
 */
exports.postUpdateModuleProgress = (req, res, next) => {
    User.findById(req.user.id, (err, user) => {
        if (err) {
            return next(err);
        }
        const modName = req.body.module;
        /* modname must have any dashes removed to match the schema. This should be
        changed because it is inconsistent - dashes are fine in every other case. */
        const modNameNoDashes = modName.replace('-', '');
        // Once marked completed, do not update status again.
        if (user.moduleProgress[modNameNoDashes] !== 'completed') {
            user.moduleProgress[modNameNoDashes] = req.body.status;
        }
        user.moduleProgressTimestamps[modName] = Date.now();
        user.save((err) => {
            if (err) {
                return next(err);
            }
            res.set('Content-Type', 'application/json; charset=UTF-8');
            res.send({ result: "success" });
        });
    });
};

function pushVisibleModule(assignedModule, moduleStatus, visibleModules) {
    const visibleModule = {
        name: assignedModule,
        status: moduleStatus
    }
    visibleModules.push(visibleModule);
    return;
}

/*
Specific to the outcome evaluation (Study 3) in October 2022.

There is 1 module, 1 extended freeplay assigned to each student.
The extended freeplay is treated as a module.
They need to become available sequentially on the homepage, as they are completed.

Look through each of the assigned modules for the currently logged in student,
and then return a list of all the modules that should be visible on the homepage
at the time of the request. A module may be in this list if:

- It is the first module in the sequence,
- It has been started/completed,
- It is the "active" module,
- It is "upcoming" to be completed.

Statuses:

"active":
This is the module the student should complete at this time. Only one module
should ever be active at a time. It is possible that no modules are active.

"upcoming":
The other remaining modules will be displayed as "upcoming". The module that is
"upcoming" will become clickable once the previous module has been completed, or if it 
is the extended freeplay, after 7 days or *168* hours has passed since the previous
module was completed. The "upcoming" module may have a preview
until then, so it is included in the list of visible modules.

"completed":
The module has been completed. This will always be visible.

"started"
The module has started. This will always be visible.
Outcome Evaluation #3: There is no time limit to completing the module.
*/
exports.getVisibleModules = (req, res, next) => {
    let visibleModules = [];
    if (!req.user.isStudent) {
        return res.send(visibleModules);
    }
    // iterate through the assigned modules in order, 1-4.
    for (let i = 1; i <= 4; i++) {
        const assignedModuleKey = `module${i}`;
        const assignedModule = req.user.assignedModules[assignedModuleKey];
        // check the status of this module from the db (none/started/completed).
        // recall that user.moduleProgress properties are modNames without dashes.
        const assignedModuleNoDashes = assignedModule.replace('-', '');
        const moduleStatus = req.user.moduleProgress[assignedModuleNoDashes];
        if (moduleStatus === "completed") {
            // Automatically add this module to the list of displayed modules.
            // Use the status "completed".
            pushVisibleModule(assignedModule, moduleStatus, visibleModules);
        } else if (moduleStatus === "started") {
            pushVisibleModule(assignedModule, moduleStatus, visibleModules);
        } else {
            // This module has not been started.
            if (i === 1) {
                // This is the first module, which can be automatically added to the list of displayed modules.
                // Mark the status as "active", since this is the module the student
                // should see as available.
                // If the user is in the control group, they will see the first module. If not, they will not see it.
                if (!req.user.control) {
                    pushVisibleModule(assignedModule, "active", visibleModules);
                }
            } else {
                // If the user is in the control group, they should automatically see the survey.
                if (req.user.control && i === 2) {
                    pushVisibleModule(assignedModule, "active", visibleModules);
                    continue;
                }

                // Not started, and not the first module.
                // Need to check if previous module has been completed.
                const prevAssignedModKey = `module${i-1}`
                const prevAssignedModule = req.user.assignedModules[prevAssignedModKey];
                const prevAssignedModuleNoDashes = prevAssignedModule.replace('-', '');
                const prevAssignedModuleStatus = req.user.moduleProgress[prevAssignedModuleNoDashes];
                const prevModStatusChangeTime = req.user.moduleProgressTimestamps[prevAssignedModule];

                if (prevAssignedModuleStatus === "completed") {
                    // If the previous module has been completed, this module should be active. 
                    // If it is the last module (extended-fp),
                    // Wait 7 days since the completion of the last module before making it active.
                    const currentTime = Date.now();
                    if (assignedModule === "extended-fp" && (currentTime - prevModStatusChangeTime) < 604800000) {
                        pushVisibleModule(assignedModule, "upcoming", visibleModules);
                    } else {
                        pushVisibleModule(assignedModule, "active", visibleModules);
                    }
                } else {
                    pushVisibleModule(assignedModule, "upcoming", visibleModules);
                }
            }
        }
    }
    return res.send(visibleModules);
}

exports.getSurveyParameters = (req, res, next) => {
    if (req.user.isStudent) {
        const surveyParameters = {
            classCode: req.user.accessCode,
            username: req.user.username,
            module: req.user.assignedModules.module1
        }
        return res.send(surveyParameters);
    } else {
        // indicates that there should not be a survey link for this account.
        const surveyParameters = false;
        return res.send(surveyParameters);
    }
}

/*
 * POST /postUpdateNewBadge
 * Save a new badge earned by the current user
 */
exports.postUpdateNewBadge = (req, res, next) => {
    User.findById(req.user.id, (err, user) => {
        if (err) {
            return next(err);
        }
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
        user.save((err) => {
            if (err) {
                return next(err);
            }
            return res.sendStatus(200);
        });
    });
}

/**
 * GET /studentReportData/:classId/:username
 * Get the data used to populate the student report page on the teacher dashboard
 */
exports.getStudentReportData = (req, res, next) => {
    if (!req.user.isInstructor) {
        return res.json({ studentPageTimes: {} });
    }
    User.findOne({
        accessCode: req.params.classId,
        username: req.params.username,
        deleted: false
    }).exec(function(err, student) {
        if (err) {
            console.log("ERROR");
            console.log(err);
            return next(err);
        }
        if (student == null) {
            console.log("NULL");
            var myerr = new Error('Student not found!');
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
    });
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
 * POST /account/profile/:modId
 * Update profile information.
 */
exports.postUpdateProfile = (req, res, next) => {
    const errors = req.validationErrors();

    if (errors) {
        req.flash('errors', errors);
        return res.redirect('/account/' + req.param("modId"));
    }

    User.findById(req.user.id, (err, user) => {
        if (err) {
            return next(err);
        }
        user.profile.name = req.body.name || '';
        user.profile.location = req.body.location || '';
        user.profile.bio = req.body.bio || '';
        user.profile.picture = req.body.profilePhoto;

        // log the change in profileHistory if data collection is enabled
        if (req.body.enableDataCollection === "true") {
            let cat = new Object();
            cat.absoluteTimeChanged = Date.now();
            cat.name = req.body.name || '';
            cat.location = req.body.location || '';
            cat.bio = req.body.bio || '';
            cat.picture = req.body.profilePhoto || '';
            user.profileHistory.push(cat);
        }

        user.save((err) => {
            if (err) {
                if (err.code === 11000) {
                    req.flash('errors', {
                        msg: `The email address you have entered is already associated with
            an account.`
                    });
                    res.redirect('/modual/' + req.param("modId"));
                }
                return next(err);
            }
            res.redirect('/modual/' + req.param("modId"));
        });
    });
};

/**
 * POST /delete
 * Delete user account.
 */
exports.getDeleteAccount = (req, res, next) => {
    // Is this a guest account?
    if (typeof req.user.isGuest !== 'undefined' && req.user.isGuest) {
        User.remove({ _id: req.user.id }, (err) => {
            if (err) {
                return next(err);
            }
            req.logout();
            res.send({
                result: "success"
            });
        });
    } else {
        User.findById(req.user.id, (err, user) => {
            //somehow user does not exist here
            if (err) {
                return next(err);
            }
            user.feedAction = [];
            user.save((err) => {
                if (err) {
                    if (err.code === 11000) {
                        req.flash('errors', { msg: 'Something in delete feedAction went crazy. You should never see this.' });
                        return res.redirect('/');
                    }
                    return next(err);
                }
                res.set('Content-Type', 'application/json; charset=UTF-8');
                res.send({ result: "success" });
            });
        });
    }
};