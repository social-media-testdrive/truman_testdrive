/*
 * Module dependencies
 */
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const bodyParser = require('body-parser');
const logger = require('morgan');
const lusca = require('lusca');
const dotenv = require('dotenv');
const flash = require('express-flash');
const path = require('path');
const mongoose = require('mongoose');
const passport = require('passport');
const multer = require('multer'); //Not used in TestDrive. Multer is used to send files (like images) through web forms.
const fs = require('fs');
const util = require('util');
fs.readFileAsync = util.promisify(fs.readFile);

/**
 * Load environment variables from .env file.
 */
dotenv.config({ path: '.env' });

// Multer options for user uploading (post images and avatar profile) images.
// Not used in TestDrive.
const userpost_options = multer.diskStorage({
    destination: path.join(__dirname, 'uploads/user_post'),
    filename: function(req, file, cb) {
        var lastsix = req.user.id.substr(req.user.id.length - 6);
        var prefix = lastsix + Math.random().toString(36).slice(2, 10);
        cb(null, prefix + file.originalname.replace(/[^A-Z0-9]+/ig, "_"));
    }
});
const useravatar_options = multer.diskStorage({
    destination: path.join(__dirname, 'uploads/user_avatar'),
    filename: function(req, file, cb) {
        var prefix = req.user.id + Math.random().toString(36).slice(2, 10);
        cb(null, prefix + file.originalname.replace(/[^A-Z0-9]+/ig, "_"));
    }
});
const userpostupload = multer({ storage: userpost_options });
const useravatarupload = multer({ storage: useravatar_options });

/**
 * Controllers (route handlers).
 */
const activityController = require('./controllers/activity');
const actorsController = require('./controllers/actors');
const scriptController = require('./controllers/script');
const classController = require('./controllers/class');
const userController = require('./controllers/user');

/**
 * API keys and Passport configuration.
 */
const passportConfig = require('./config/passport');

/**
 * Create Express server.
 */
const app = express();

/**
 * Connect to MongoDB.
 */
mongoose.connect(process.env.PRO_MONGODB_URI || process.env.PRO_MONGOLAB_URI);
mongoose.connection.on('error', (err) => {
    console.error(err);
    console.log('%s MongoDB connection error. Please make sure MongoDB is running.');
    process.exit();
});

/*
 * Express configuration.
 */
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
//We do compression on our production server using nginx as a reverse proxy
//app.use(compression());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Define our session.
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET,
    cookie: {
        path: '/',
        httpOnly: true,
        secure: false,
        maxAge: 1209600000 //24 hours
    },
    store: MongoStore.create({
        mongoUrl: process.env.PRO_MONGODB_URI,
    })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use((req, res, next) => {
    lusca.csrf()(req, res, next);
});

//secruity settings in our http header
app.use(lusca.xframe('SAMEORIGIN'));
app.use(lusca.xssProtection(true));
app.disable('x-powered-by');

app.use((req, res, next) => {
    res.locals.user = req.user;
    res.locals.cdn = process.env.CDN;
    next();
});

app.use((req, res, next) => {
    // After successful login, redirect back to the intended page
    if (!req.user &&
        req.path !== '/login' &&
        req.path !== '/classLogin/:accessCode' &&
        !req.path.match(/\./)) {
        req.session.returnTo = req.originalUrl;
    }
    next();
});

function setHttpResponseHeaders(req, res, next) {
    // TODO: rework chatbox so that 'unsafe-eval' in script-src is not required.
    res.set({
        'Cache-Control': 'no-cache, no-store',
        'Expires': '0',
        'Pragma': 'no-cache',
        'Content-Type': 'text/html; charset=UTF-8',
        'Content-Security-Policy': "script-src 'self' 'unsafe-inline' https://dhpd030vnpk29.cloudfront.net https://cdnjs.cloudflare.com/ http://cdnjs.cloudflare.com/ https://www.googletagmanager.com https://www.google-analytics.com;" +
            "default-src 'self' https://www.google-analytics.com;" +
            "style-src 'self' 'unsafe-inline' https://dhpd030vnpk29.cloudfront.net https://cdnjs.cloudflare.com/ https://fonts.googleapis.com;" +
            "img-src 'self' https://dhpd030vnpk29.cloudfront.net https://www.googletagmanager.com https://www.google-analytics.com;" +
            "media-src https://dhpd030vnpk29.cloudfront.net;" +
            "font-src 'self' https://fonts.gstatic.com  https://cdnjs.cloudflare.com/ data:"
    });
    next();
}

async function isValidModId(req, res, next) {
    const data = await fs.readFileAsync(`${__dirname}/public2/json/moduleInfo.json`);
    const modIds = Object.keys(JSON.parse(data.toString()));
    if (modIds.includes(req.params.modId)) {
        next();
    } else {
        const err = new Error('Page Not Found.');
        err.status = 404;
        console.log(err);

        // Set locals, only providing error stack in development.
        err.stack = req.app.get('env') === 'development' ? err.stack : '';

        res.locals.message = err.message + " Oops! We can't seem to find the page you're looking for.";
        res.locals.error = err;

        // Render the error page.
        res.status(err.status);
        res.render('error');
    }
}

// All of our static files that express will automatically serve for us.
// In production, we have nginx server this instead to take the load off out Node app.
app.use(express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }));
app.use(express.static(path.join(__dirname, 'public2'), { maxAge: 31557600000 }));
app.use(express.static(path.join(__dirname, 'uploads'), { maxAge: 31557600000 }));
app.use(express.static(path.join(__dirname, 'post_pictures'), { maxAge: 31557600000 }));
app.use('/profile_pictures', express.static(path.join(__dirname, 'profile_pictures'), { maxAge: 31557600000 }));

const isResearchVersion = process.env.isResearchVersion === 'true';
const enableDataCollection = process.env.enableDataCollection === 'true';
const enableShareActivityData = process.env.enableShareActivityData === 'true';
const enableTeacherDashboard = process.env.enableTeacherDashboard === 'true';
const enableLearnerDashboard = process.env.enableLearnerDashboard === 'true';

/*
 * Primary app routes.
 * (In alphabetical order)
 */
// Main route is the module page.
app.get('/', passportConfig.isAuthenticated, setHttpResponseHeaders, async function(req, res) {
    const data = await fs.readFileAsync(`${__dirname}/public2/json/moduleInfo.json`);
    const modData = JSON.parse(data.toString());

    res.render('mods', {
        title: 'Pick a Lesson',
        isResearchVersion,
        modData
    });
});

// Render current user's account page, which is module specific (all modules).
app.get('/account/:modId', passportConfig.isAuthenticated, setHttpResponseHeaders, isValidModId, userController.getAccount);

// Render end page (all modules).
app.get('/end/:modId', passportConfig.isAuthenticated, setHttpResponseHeaders, isValidModId, function(req, res) {
    res.render('base_end.pug', {
        title: 'Finished',
        modId: req.params.modId,
        isResearchVersion
    });
});

// Render intro page (all modules).
app.get('/intro/:modId', passportConfig.isAuthenticated, setHttpResponseHeaders, isValidModId, function(req, res) {
    if (req.params.modId === "delete") { // anticipating a specific user behavior that causes 500 errors
        res.redirect('/');
    } else {
        res.render('base_intro.pug', {
            title: 'Welcome'
        });
    }
});

// Render user's profile page, which is module-specific.
app.get('/me/:modId', passportConfig.isAuthenticated, setHttpResponseHeaders, isValidModId, userController.getMe);

// Render the free play page (only 'accounts' and 'privacy' modules do not have this page).
app.get('/modual/:modId', passportConfig.isAuthenticated, setHttpResponseHeaders, isValidModId, scriptController.getScript);

// Render privacy policy page.
app.get('/privacy', setHttpResponseHeaders, function(req, res) {
    res.render('privacy_policy', {
        title: 'Privacy Policy'
    });
});

// Render the quiz page (all modules).
app.get('/quiz/:modId', passportConfig.isAuthenticated, setHttpResponseHeaders, isValidModId, async function(req, res) {
    let quizData;
    const data = await fs.readFileAsync(`${__dirname}/public2/json/quizSectionData.json`);
    quizData = JSON.parse(data.toString())[req.params.modId];

    res.render('base_quiz.pug', {
        title: 'Quiz',
        quizData,
    });
});

// Render the reflection page (all modules).
app.get('/results/:modId', passportConfig.isAuthenticated, setHttpResponseHeaders, isValidModId, async function(req, res) {
    let reflectionData;
    const data = await fs.readFileAsync(`${__dirname}/public2/json/reflectionSectionData.json`)
    reflectionData = JSON.parse(data.toString())[req.params.modId];

    res.render('base_results', {
        title: 'Reflection',
        mod: req.params.modId,
        reflectionData
    });
});

// Render the practice page (all modules).
app.get('/sim/:modId', passportConfig.isAuthenticated, setHttpResponseHeaders, isValidModId, function(req, res) {
    if (req.params.modId === 'safe-posting') {
        res.set({
            'Content-Security-Policy': "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://dhpd030vnpk29.cloudfront.net https://cdnjs.cloudflare.com/ http://cdnjs.cloudflare.com/ https://www.googletagmanager.com https://www.google-analytics.com;" +
                "default-src 'self' https://www.google-analytics.com;" +
                "style-src 'self' 'unsafe-inline' https://dhpd030vnpk29.cloudfront.net https://cdnjs.cloudflare.com/ https://fonts.googleapis.com;" +
                "img-src 'self' https://dhpd030vnpk29.cloudfront.net https://www.googletagmanager.com https://www.google-analytics.com;" +
                "media-src https://dhpd030vnpk29.cloudfront.net;" +
                "font-src 'self' https://fonts.gstatic.com  https://cdnjs.cloudflare.com/ data:"
        });
    }
    res.render(req.params.modId + '/' + req.params.modId + '_sim', {
        title: 'Guided Activity'
    });
});

// Render the practice page.
app.get('/sim1/:modId', passportConfig.isAuthenticated, setHttpResponseHeaders, isValidModId, function(req, res) {
    res.render(req.params.modId + '/' + req.params.modId + '_sim1', {
        title: 'Guided Activity'
    });
});

// Render the practice page.
app.get('/sim2/:modId', passportConfig.isAuthenticated, setHttpResponseHeaders, isValidModId, function(req, res) {
    res.render(req.params.modId + '/' + req.params.modId + '_sim2', {
        title: 'Guided Activity'
    });
});

// Render the practice page.
app.get('/sim3/:modId', passportConfig.isAuthenticated, setHttpResponseHeaders, isValidModId, function(req, res) {
    res.render(req.params.modId + '/' + req.params.modId + '_sim3', {
        title: 'Guided Activity'
    });
});

// Render the practice page.
app.get('/sim4/:modId', passportConfig.isAuthenticated, setHttpResponseHeaders, isValidModId, function(req, res) {
    res.render(req.params.modId + '/' + req.params.modId + '_sim4', {
        title: 'Guided Activity'
    });
});

// Render the start page (all modules).
app.get('/start/:modId', passportConfig.isAuthenticated, setHttpResponseHeaders, isValidModId, async function(req, res) {
    if (req.params.modId === "delete") { // anticipating a specific user behavior that causes 500 errors
        res.redirect('/');
    } else {
        let startData;
        const data = await fs.readFileAsync(`${__dirname}/public2/json/startSectionData.json`)
        startData = JSON.parse(data.toString())[req.params.modId];

        res.render('base_start', {
            title: 'Learn',
            mod: req.params.modId,
            startData
        });
    }
});

// Render the transition review page (all modules).
app.get('/trans/:modId', passportConfig.isAuthenticated, setHttpResponseHeaders, isValidModId, async function(req, res) {
    let transData;
    const data = await fs.readFileAsync(`${__dirname}/public2/json/transSectionData.json`);
    transData = JSON.parse(data.toString())[req.params.modId];

    res.render('base_trans.pug', {
        title: 'Review',
        transData,
    });
});

// Render the transition review page (only 'esteem' and 'targeted' modules have this page).
app.get('/trans2/:modId', passportConfig.isAuthenticated, setHttpResponseHeaders, isValidModId, function(req, res) {
    res.render('base_trans2', {
        title: 'Review',
        mod: req.params.modId
    });
});

// Render transition review page (only 'accounts' and 'privacy' modules do not have this page).
app.get('/trans_script/:modId', passportConfig.isAuthenticated, setHttpResponseHeaders, isValidModId, function(req, res) {
    res.render('base_trans_script', {
        title: 'Review',
        mod: req.params.modId,
    });
});

// Render the learn page (all modules).
app.get('/tutorial/:modId', passportConfig.isAuthenticated, setHttpResponseHeaders, isValidModId, function(req, res) {
    if (req.params.modId === 'safe-posting') {
        res.set({
            'Content-Security-Policy': "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://dhpd030vnpk29.cloudfront.net https://cdnjs.cloudflare.com/ http://cdnjs.cloudflare.com/ https://www.googletagmanager.com https://www.google-analytics.com;" +
                "default-src 'self'  https://www.google-analytics.com;" +
                "style-src 'self' 'unsafe-inline' https://dhpd030vnpk29.cloudfront.net https://cdnjs.cloudflare.com/ https://fonts.googleapis.com;" +
                "img-src 'self' https://dhpd030vnpk29.cloudfront.net  https://www.googletagmanager.com https://www.google-analytics.com;" +
                "media-src https://dhpd030vnpk29.cloudfront.net;" +
                "font-src 'self' https://fonts.gstatic.com  https://cdnjs.cloudflare.com/ data:"
        });
    }
    res.render(req.params.modId + '/' + req.params.modId + '_tutorial', {
        title: 'Tutorial'
    });
});

// Render learn page (only 'accounts' module has this page)
app.get('/tutorial2/:modId', passportConfig.isAuthenticated, setHttpResponseHeaders, isValidModId, function(req, res) {
    res.render(req.params.modId + '/' + req.params.modId + '_tutorial2', {
        title: 'Tutorial'
    });
});

// Render tutorial guide page (only 'cyberbullying', 'digital-literacy', 'phishing', 'privacy', 'safe-posting', 'targeted' modules).
app.get('/tut_guide/:modId', passportConfig.isAuthenticated, setHttpResponseHeaders, isValidModId, function(req, res) {
    if (req.params.modId === 'safe-posting') {
        res.set({
            'Content-Security-Policy': "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://dhpd030vnpk29.cloudfront.net https://cdnjs.cloudflare.com/ http://cdnjs.cloudflare.com/  https://www.googletagmanager.com https://www.google-analytics.com;" +
                "default-src 'self' https://www.google-analytics.com;" +
                "style-src 'self' 'unsafe-inline' https://dhpd030vnpk29.cloudfront.net https://cdnjs.cloudflare.com/ https://fonts.googleapis.com;" +
                "img-src 'self' https://dhpd030vnpk29.cloudfront.net  https://www.googletagmanager.com https://www.google-analytics.com;" +
                "media-src https://dhpd030vnpk29.cloudfront.net;" +
                "font-src 'self' https://fonts.gstatic.com  https://cdnjs.cloudflare.com/ data:"
        });
    }
    res.render(req.params.modId + '/' + req.params.modId + '_tut_guide', {
        title: 'Tutorial'
    });
});

// Render the profile page for the given actor
app.get('/user/:actorId', passportConfig.isAuthenticated, setHttpResponseHeaders, actorsController.getActor);
/*
 * More primary app routes are continued at the very end because elsewise, those routes will be entered before the below ones.
 */

/*
 * Account creation & deletion
 */
// Delete guest account, or feedAction of account.
app.post('/delete', passportConfig.isAuthenticated, setHttpResponseHeaders, userController.getDeleteAccount);
// Create a new guest account.
app.get('/guest/:modId', setHttpResponseHeaders, isValidModId, userController.getGuest);

/*
 * Logins (only used on research site)
 */
if (isResearchVersion) {
    app.get('/login', setHttpResponseHeaders, userController.getLogin);
    app.get('/classLogin/:accessCode', setHttpResponseHeaders, userController.getClassLogin);
    app.post('/instructorLogin', setHttpResponseHeaders, userController.postInstructorLogin);
    app.post('/studentLogin/:accessCode', setHttpResponseHeaders, userController.postStudentLogin);
    app.get('/logout', setHttpResponseHeaders, userController.logout);
}

/*
 * Key functionalities
 */
// Post a new user-created post
app.post('/post/new', setHttpResponseHeaders, scriptController.newPost);
// Post information about a user action on a post in a freeplay feed section
app.post('/feed', passportConfig.isAuthenticated, setHttpResponseHeaders, scriptController.postUpdateFeedAction);
// Post information about a user's reflection answers in the reflection section 
app.post('/reflection', passportConfig.isAuthenticated, setHttpResponseHeaders, scriptController.postReflectionAction);
// Post information about a user's quiz answers in the quiz section
app.post('/quiz', passportConfig.isAuthenticated, setHttpResponseHeaders, scriptController.postQuizAction);
app.post('/postViewQuizExplanations', passportConfig.isAuthenticated, setHttpResponseHeaders, scriptController.postViewQuizExplanations);
// Record user's topic selection for modules with customized freeplay content
app.post('/interest', passportConfig.isAuthenticated, setHttpResponseHeaders, userController.postUpdateInterestSelection);
// Routes to get topic selections for modules with customized freeplay content
app.get('/esteemTopic', passportConfig.isAuthenticated, setHttpResponseHeaders, userController.getEsteemTopic);
// Routes to facilitate features in the habits module
app.get('/habitsTimer', passportConfig.isAuthenticated, setHttpResponseHeaders, userController.getHabitsTimer);
app.post('/habitsTimer', passportConfig.isAuthenticated, setHttpResponseHeaders, userController.postUpdateHabitsTimer);
app.get('/habitsNotificationTimes', passportConfig.isAuthenticated, setHttpResponseHeaders, scriptController.getNotificationTimes);
// Update user profile information
app.post('/account/profile/:modId', passportConfig.isAuthenticated, setHttpResponseHeaders, userController.postUpdateProfile);

/*
 * Recording various user activities if data collection is enabled
 */
if (enableDataCollection) {
    app.post('/pageLog', passportConfig.isAuthenticated, setHttpResponseHeaders, userController.postPageLog);
    app.post('/startPageAction', passportConfig.isAuthenticated, setHttpResponseHeaders, scriptController.postStartPageAction);
    app.post('/introjsStep', passportConfig.isAuthenticated, setHttpResponseHeaders, scriptController.postIntrojsStepAction);
    app.post('/bluedot', passportConfig.isAuthenticated, setHttpResponseHeaders, scriptController.postBlueDotAction);
    app.post('/accountsAction', passportConfig.isAuthenticated, setHttpResponseHeaders, scriptController.postUpdateUniqueFeedAction);
    app.post('/habitsAction', passportConfig.isAuthenticated, setHttpResponseHeaders, scriptController.postUpdateUniqueFeedAction);
    app.post('/privacyAction', passportConfig.isAuthenticated, setHttpResponseHeaders, scriptController.postUpdateUniqueFeedAction);
    app.post('/chatAction', passportConfig.isAuthenticated, setHttpResponseHeaders, scriptController.postUpdateChatAction);
    app.post('/voiceoverTimer', passportConfig.isAuthenticated, setHttpResponseHeaders, userController.postUpdateVoiceoverTimer);
    app.post('/moduleProgress', passportConfig.isAuthenticated, setHttpResponseHeaders, userController.postUpdateModuleProgress);
}

/*
 * Recording specific user activities if the user selects to share their activity data
 */
if (enableShareActivityData) {
    app.post('/postActivityData', passportConfig.isAuthenticated, setHttpResponseHeaders, activityController.postActivityData);
    app.post('/postDeleteActivityData', passportConfig.isAuthenticated, setHttpResponseHeaders, activityController.postDeleteActivityData);
}

/*
 * Teacher dashboard
 */
if (enableTeacherDashboard) {
    app.get('/classIdList', passportConfig.isAuthenticated, setHttpResponseHeaders, classController.getClassIdList);
    app.get('/classManagement', passportConfig.isAuthenticated, setHttpResponseHeaders, classController.getClasses);
    app.get('/viewClass/:classId', passportConfig.isAuthenticated, setHttpResponseHeaders, classController.getClass);
    app.get('/classSize/:classId', passportConfig.isAuthenticated, setHttpResponseHeaders, classController.getClassSize);
    app.get('/classUsernames/:classId', passportConfig.isAuthenticated, setHttpResponseHeaders, classController.getClassUsernames);
    app.get('/classPageTimes/:classId', passportConfig.isAuthenticated, setHttpResponseHeaders, classController.getClassPageTimes);
    app.get('/classPageTimes/:classId/:modName', passportConfig.isAuthenticated, setHttpResponseHeaders, classController.getClassPageTimes);
    app.get('/moduleProgress/:classId', passportConfig.isAuthenticated, setHttpResponseHeaders, classController.getModuleProgress);
    app.get('/classReflectionResponses/:classId', passportConfig.isAuthenticated, setHttpResponseHeaders, classController.getReflectionResponses);
    app.get('/classFreeplayActions/:classId/:modName', passportConfig.isAuthenticated, setHttpResponseHeaders, classController.getClassFreeplayActions);
    app.get('/studentReportData/:classId/:username', passportConfig.isAuthenticated, setHttpResponseHeaders, classController.getStudentReportData);
    app.get('/singlePost/:postId', passportConfig.isAuthenticated, setHttpResponseHeaders, scriptController.getSinglePost);
    app.post('/downloadReflectionResponses/:classId/:modName', passportConfig.isAuthenticated, setHttpResponseHeaders, classController.postClassReflectionResponsesCsv);
    app.post('/postClassTimeReportCsv/:classId/:modName', passportConfig.isAuthenticated, setHttpResponseHeaders, classController.postClassTimeReportCsv);
    app.post('/createNewClass', passportConfig.isAuthenticated, setHttpResponseHeaders, classController.postCreateClass);
    app.post('/deleteClass', passportConfig.isAuthenticated, setHttpResponseHeaders, classController.postDeleteClass);
    app.post('/removeStudentFromClass', passportConfig.isAuthenticated, setHttpResponseHeaders, classController.removeStudentFromClass);
    app.post('/generateStudentAccounts', passportConfig.isAuthenticated, setHttpResponseHeaders, classController.generateStudentAccounts);
    app.post('/updateName', passportConfig.isAuthenticated, setHttpResponseHeaders, userController.postName);

    // The class overview page on the teacher dashboard
    app.get('/classOverview', passportConfig.isAuthenticated, setHttpResponseHeaders, function(req, res) {
        res.render('teacherDashboard/classOverview', {
            title: 'Class Overview'
        });
    });

    // The module overview page on the teacher dashboard
    app.get('/moduleOverview', passportConfig.isAuthenticated, setHttpResponseHeaders, function(req, res) {
        res.render('teacherDashboard/moduleOverview', {
            title: 'Module Overview'
        });
    });

    // The student report page on the teacher dashboard
    app.get('/studentReport', passportConfig.isAuthenticated, setHttpResponseHeaders, function(req, res) {
        res.render('teacherDashboard/studentReport', {
            title: 'Student Report'
        });
    });
}

/*
 * Learner dashboard
 */
if (enableLearnerDashboard) {
    app.get('/getLearnerGeneralModuleData', passportConfig.isAuthenticated, setHttpResponseHeaders, userController.getLearnerGeneralModuleData);
    app.get('/getLearnerSectionTimeData', passportConfig.isAuthenticated, setHttpResponseHeaders, userController.getLearnerSectionTimeData);
    app.get('/getLearnerEarnedBadges', passportConfig.isAuthenticated, setHttpResponseHeaders, userController.getLearnerEarnedBadges);
    app.post('/postUpdateNewBadge', passportConfig.isAuthenticated, setHttpResponseHeaders, userController.postUpdateNewBadge);

    // The learning achievement page on the learner dashboard
    app.get('/learningAchievement', passportConfig.isAuthenticated, setHttpResponseHeaders, function(req, res) {
        res.render('learnerDashboard/learningAchievement', {
            title: 'My Learning Achievement'
        });
    });

    // The learning map page on the learner dashboard
    app.get('/learningMap', passportConfig.isAuthenticated, setHttpResponseHeaders, function(req, res) {
        res.render('learnerDashboard/learningMap', {
            title: 'Learning Map'
        });
    });

    // The module completion page on the learner dashboard
    app.get('/moduleCompletion', passportConfig.isAuthenticated, setHttpResponseHeaders, function(req, res) {
        res.render('learnerDashboard/moduleCompletion', {
            title: 'Module Completion'
        });
    });
}

// Render page with sample targeted ads (food, gaming, sports) in the targeted ads module.
app.get('/:page/targeted', passportConfig.isAuthenticated, setHttpResponseHeaders, function(req, res) {
    const validPages = [
        'food',
        'gaming',
        'sports'
    ]
    if (!validPages.includes(req.params.page)) {
        const err = new Error('Page Not Found.');
        err.status = 404;
        console.log(err);

        // Set locals, only providing error stack in development.
        err.stack = req.app.get('env') === 'development' ? err.stack : '';

        res.locals.message = err.message + " Oops! We can't seem to find the page you're looking for.";
        res.locals.error = err;

        // Render the error page.
        res.status(err.status);
        res.render('error');
    } else {
        res.render('targeted/targeted_' + req.params.page, {
            title: 'Interest Page'
        });
    }
});

// Render free play pages in the privacy module.
app.get('/:page/privacy', passportConfig.isAuthenticated, setHttpResponseHeaders, function(req, res) {
    const validFreePlayPages = [
        'free-play', // Page 1 of the free play section in the privacy module
        'free-play2', // Page 3 of the free play section in the privacy module
        'free-play3', // Page 7 of the free play section in the privacy module
        'free-play4', // Page 5 of the free play section i the privacy module
        'free-settings', // Page 2 of the free play section in the privacy module
        'free-settings2', // Page 6 of the free play section in the privacy module
        'free-settings3' // Page 4 of the free play section in the privacy module
    ]
    if (!validFreePlayPages.includes(req.params.page)) {
        const err = new Error('Page Not Found.');
        err.status = 404;
        console.log(err);

        // Set locals, only providing error stack in development.
        err.stack = req.app.get('env') === 'development' ? err.stack : '';

        res.locals.message = err.message + " Oops! We can't seem to find the page you're looking for.";
        res.locals.error = err;

        // Render the error page.
        res.status(err.status);
        res.render('error');
    } else {
        const urlDigit = req.params.page.match(/\d+/);
        const pageType = req.params.page.startsWith('free-play') ? 'free-play' : 'free-play_settings'
        const page = 'privacy_' + pageType + (urlDigit ? urlDigit[0].toString() : "");
        res.render('privacy/' + page, {
            title: 'Free-Play ' + (pageType == 'free-play_settings' ? "Settings " : "") + (urlDigit ? urlDigit[0].toString() : "")
        })
    }
});

/**
 * Error Handler.
 */
app.use((req, res, next) => {
    const err = new Error('Page Not Found');
    err.status = 404;
    err.stack = req.app.get('env') === 'development' ? err.stack : ''; // Only provide error stack in development.

    res.locals.message = err.message + " Oops! We can't seem to find the page you're look for.";
    res.locals.error = err;

    res.status(err.status);
    console.log(err);
    res.render('error');

});

app.use((err, req, res) => {
    err.status = err.status || 500;
    err.stack = req.app.get('env') === 'development' ? err.stack : ''; // Only provide error stack in development.
    err.message = req.app.get('env') === 'development' ? err.message : " Oops! Something went wrong.";

    res.locals.message = err.message;
    res.locals.error = err;

    res.status(err.status);
    res.render('error');
});

/*
 * Start Express server.
 */
app.listen(app.get('port'), () => {
    console.log(`App is running on http://localhost:${app.get('port')} in ${app.get('env')} mode.`);
    console.log('  Press CTRL-C to stop\n');
});

module.exports = app;