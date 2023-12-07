/*
 * Module dependencies
 */
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const bodyParser = require('body-parser');
const logger = require('morgan');
const errorHandler = require('errorhandler');
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

// Multer options for user uploading (post images and avatar profile images
// Not currently used in TestDrive
var userpost_options = multer.diskStorage({
    destination: path.join(__dirname, 'uploads/user_post'),
    filename: function(req, file, cb) {
        var lastsix = req.user.id.substr(req.user.id.length - 6);
        var prefix = lastsix + Math.random().toString(36).slice(2, 10);
        cb(null, prefix + file.originalname.replace(/[^A-Z0-9]+/ig, "_"));
    }
});
var useravatar_options = multer.diskStorage({
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
// Notifications not currently used in TestDrive.
// const notificationController = require('./controllers/notification');

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
        maxAge: 1209600000, //336 hours or 2 weeks
        sameSite: 'lax'
    },
    store: MongoStore.create({
        url: process.env.PRO_MONGODB_URI || process.env.PRO_MONGOLAB_URI,
    })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
// Multer multipart/form-data handling needs to occur before the Lusca CSRF check.
// This allows us to not check CSRF when uploading an image file. It's a weird issue that multer and lusca do not play well together.
// Theoretically, the "if" statement is not entered in TestDrive since users never upload image files.
app.use((req, res, next) => {
    if ((req.path === '/post/new') || (req.path === '/account/profile') || (req.path === '/account/signup_info_post' || (req.path === '/classes'))) {
        console.log("Not checking CSRF. Out path now");
        next();
    } else {
        lusca.csrf()(req, res, next);
    }
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
    // const modIds = [
    //     "accounts",
    //     "advancedlit",
    //     "cyberbullying",
    //     "digfoot",
    //     "digital-literacy",
    //     "esteem",
    //     "habits",
    //     "phishing",
    //     "presentation",
    //     "privacy",
    //     "safe-posting",
    //     "targeted"
    // ]
    const data = await fs.readFileAsync(`${__dirname}/public2/json/moduleInfo.json`)
    const modIds = Object.keys(JSON.parse(data.toString()));
    if (modIds.includes(req.params.modId)) {
        next();
    } else {
        const err = new Error('Page Not Found.');
        err.status = 404;
        console.log(err);

        // set locals, only providing error stack in development
        err.stack = req.app.get('env') === 'development' ? err.stack : '';

        res.locals.message = err.message + " Oops! We can't seem to find the page you're looking for.";
        res.locals.error = err;

        // render the error page
        res.status(err.status);
        res.render('error');
    }
}

// All of our static files that express will automatically server for us.
// In production, we have nginx server this instead to take the load off out Node app
app.use(express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }));
app.use(express.static(path.join(__dirname, 'public2'), { maxAge: 31557600000 }));
app.use('/semantic', express.static(path.join(__dirname, 'semantic'), { maxAge: 31557600000 }));
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
// Main route is the module page
app.get('/', passportConfig.isAuthenticated, setHttpResponseHeaders, async function(req, res) {
    const data = await fs.readFileAsync(`${__dirname}/public2/json/moduleInfo.json`)
    const modData = JSON.parse(data.toString());

    res.render('mods', {
        title: 'Pick a Lesson',
        isResearchVersion,
        modData
    });
});

// Render current user's account page, which is module specific (all modules)
app.get('/account/:modId', passportConfig.isAuthenticated, setHttpResponseHeaders, isValidModId, userController.getAccount);

// Render end page (all modules)
app.get('/end/:modId', passportConfig.isAuthenticated, setHttpResponseHeaders, isValidModId, function(req, res) {
    res.render('base_end.pug', {
        title: 'Finished',
        modId: req.params.modId,
        isResearchVersion
    });
});

// Render page with sample targeted ads (food) in the targeted ads module
app.get('/food/targeted', passportConfig.isAuthenticated, setHttpResponseHeaders, function(req, res) {
    res.render('targeted/targeted_food', {
        title: 'Interest Page'
    });
});

// Render Page 1 of the free play section in the privacy module
app.get('/free-play/privacy', passportConfig.isAuthenticated, setHttpResponseHeaders, function(req, res) {
    res.render('privacy/privacy_free-play', {
        title: 'Free-Play'
    });
});

// Render Page 3 of the free play section in the privacy module
app.get('/free-play2/privacy', passportConfig.isAuthenticated, setHttpResponseHeaders, function(req, res) {
    res.render('privacy/privacy_free-play2', {
        title: 'Free-Play 2'
    });
});

// Render Page 7 of the free play section in the privacy module
app.get('/free-play3/privacy', passportConfig.isAuthenticated, setHttpResponseHeaders, function(req, res) {
    res.render('privacy/privacy_free-play3', {
        title: 'Free-Play 3'
    });
});

// Render Page 5 of the free play section in the privacy module
app.get('/free-play4/privacy', passportConfig.isAuthenticated, setHttpResponseHeaders, function(req, res) {
    res.render('privacy/privacy_free-play4', {
        title: 'Free-Play 4'
    });
});

// Render Page 2 of the free play section in the privacy module
app.get('/free-settings/privacy', passportConfig.isAuthenticated, setHttpResponseHeaders, function(req, res) {
    res.render('privacy/privacy_free-play_settings', {
        title: 'Free-Play Settings'
    });
});

// Render Page 6 of the free play section in the privacy module
app.get('/free-settings2/privacy', passportConfig.isAuthenticated, setHttpResponseHeaders, function(req, res) {
    res.render('privacy/privacy_free-play_settings2', {
        title: 'Free-Play Settings 2'
    });
});

// Render Page 4 of the free play section in the privacy module
app.get('/free-settings3/privacy', passportConfig.isAuthenticated, setHttpResponseHeaders, function(req, res) {
    res.render('privacy/privacy_free-play_settings3', {
        title: 'Free-Play Settings 3'
    });
});

// Render page with sample targeted ads (gaming) in the targeted ads module
app.get('/gaming/targeted', passportConfig.isAuthenticated, setHttpResponseHeaders, function(req, res) {
    res.render('targeted/targeted_gaming', {
        title: 'Interest Page'
    });
});

// Render intro page (all modules)
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

// Main route for rendering the free play page for a given module (only 'accounts' and 'privacy' modules do not have this page)
app.get('/modual/:modId', passportConfig.isAuthenticated, setHttpResponseHeaders, isValidModId, scriptController.getScript);

// Render privacy policy page.
app.get('/privacy', setHttpResponseHeaders, function(req, res) {
    res.render('privacy_policy', {
        title: 'Privacy Policy'
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

// Main route for rendering the practice page for a given module.
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

// Render page in the practice section
app.get('/sim1/:modId', passportConfig.isAuthenticated, setHttpResponseHeaders, isValidModId, function(req, res) {
    res.render(req.params.modId + '/' + req.params.modId + '_sim1', {
        title: 'Guided Activity'
    });
});

// Render page in the practice section 
app.get('/sim2/:modId', passportConfig.isAuthenticated, setHttpResponseHeaders, isValidModId, function(req, res) {
    res.render(req.params.modId + '/' + req.params.modId + '_sim2', {
        title: 'Guided Activity'
    });
});

// Render page in the practice section 
app.get('/sim3/:modId', passportConfig.isAuthenticated, setHttpResponseHeaders, isValidModId, function(req, res) {
    res.render(req.params.modId + '/' + req.params.modId + '_sim3', {
        title: 'Guided Activity'
    });
});

// Render page in the practice section
app.get('/sim4/:modId', passportConfig.isAuthenticated, setHttpResponseHeaders, isValidModId, function(req, res) {
    res.render(req.params.modId + '/' + req.params.modId + '_sim4', {
        title: 'Guided Activity'
    });
});

// Render page with sample targeted ads (sports) in the targeted ads module
app.get('/sports/targeted', passportConfig.isAuthenticated, setHttpResponseHeaders, function(req, res) {
    res.render('targeted/targeted_sports', {
        title: 'Interest Page'
    });
});

// Render start page (all modules)
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

// Render transition review page
app.get('/trans/:modId', passportConfig.isAuthenticated, setHttpResponseHeaders, isValidModId, function(req, res) {
    res.render(req.params.modId + '/' + req.params.modId + '_trans', {
        title: 'Review'
    });
});

// Render transition review page
app.get('/trans2/:modId', passportConfig.isAuthenticated, setHttpResponseHeaders, isValidModId, function(req, res) {
    res.render(req.params.modId + '/' + req.params.modId + '_trans2', {
        title: 'Review'
    });
});

// Render transition review page
app.get('/trans_script/:modId', passportConfig.isAuthenticated, setHttpResponseHeaders, isValidModId, function(req, res) {
    res.render(req.params.modId + '/' + req.params.modId + '_trans_script', {
        title: 'Review'
    });
});

// Main route for rendering the learn page for a given module
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

// Render learn page 
app.get('/tutorial2/:modId', passportConfig.isAuthenticated, setHttpResponseHeaders, isValidModId, function(req, res) {
    res.render(req.params.modId + '/' + req.params.modId + '_tutorial2', {
        title: 'Tutorial'
    });
});

// Render tutorial guide page
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
app.get('/user/:userId', passportConfig.isAuthenticated, setHttpResponseHeaders, actorsController.getActor);

/*
 * Account creation & deletion
 */
// Delete guest account, or feedAction of account
app.post('/delete', passportConfig.isAuthenticated, setHttpResponseHeaders, userController.getDeleteAccount);
// Create a new guest account
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
// Delete all recorded feed actions for the current user - currently not used
app.post('/deleteUserFeedActions', passportConfig.isAuthenticated, setHttpResponseHeaders, scriptController.postDeleteFeedAction);
// Post information about a user's reflection answers in the reflection section 
app.post('/reflection', passportConfig.isAuthenticated, setHttpResponseHeaders, scriptController.postReflectionAction);
// Post information about a user's quiz answers in the quiz section
app.post('/quiz', passportConfig.isAuthenticated, setHttpResponseHeaders, scriptController.postQuizAction);
app.post('/postViewQuizExplanations', passportConfig.isAuthenticated, setHttpResponseHeaders, scriptController.postViewQuizExplanations);
// Record user's topic selection for modules with customized freeplay content
app.post('/interest', passportConfig.isAuthenticated, setHttpResponseHeaders, userController.postUpdateInterestSelection);
app.post('/advancedlitInterest', passportConfig.isAuthenticated, setHttpResponseHeaders, userController.postAdvancedlitInterestSelection);
// Routes to get topic selections for modules with customized freeplay content
app.get('/esteemTopic', passportConfig.isAuthenticated, setHttpResponseHeaders, userController.getEsteemTopic);
app.get('/advancedlitTopic', passportConfig.isAuthenticated, setHttpResponseHeaders, userController.getAdvancedlitTopic);
// Routes to facilitate features in the habits module
app.get('/habitsTimer', passportConfig.isAuthenticated, setHttpResponseHeaders, userController.getHabitsTimer);
app.post('/habitsTimer', passportConfig.isAuthenticated, setHttpResponseHeaders, userController.postUpdateHabitsTimer);
app.get('/habitsNotificationTimes', passportConfig.isAuthenticated, setHttpResponseHeaders, scriptController.getNotificationTimes);
// This was for load testing - not sure if it should be deleted
app.get('/testing/:modId', isValidModId, scriptController.getScriptFeed);
// Update user profile information
app.post('/account/profile', passportConfig.isAuthenticated, useravatarupload.single('picinput'), setHttpResponseHeaders, userController.postUpdateProfile);
app.post('/account/profile/:modId', passportConfig.isAuthenticated, useravatarupload.single('picinput'), setHttpResponseHeaders, userController.postUpdateProfile);

/*
 * Recording various user activities if data collection is enabled
 */
if (enableDataCollection) {
    app.post('/pageLog', passportConfig.isAuthenticated, setHttpResponseHeaders, userController.postPageLog);
    app.post('/startPageAction', passportConfig.isAuthenticated, setHttpResponseHeaders, scriptController.postStartPageAction);
    app.post('/introjsStep', passportConfig.isAuthenticated, setHttpResponseHeaders, scriptController.postIntrojsStepAction);
    app.post('/bluedot', passportConfig.isAuthenticated, setHttpResponseHeaders, scriptController.postBlueDotAction);
    app.post('/moduleProgress', passportConfig.isAuthenticated, setHttpResponseHeaders, userController.postUpdateModuleProgress);
    app.post('/accountsAction', passportConfig.isAuthenticated, setHttpResponseHeaders, scriptController.postUpdateUniqueFeedAction);
    app.post('/habitsAction', passportConfig.isAuthenticated, setHttpResponseHeaders, scriptController.postUpdateUniqueFeedAction);
    app.post('/privacyAction', passportConfig.isAuthenticated, setHttpResponseHeaders, scriptController.postUpdateUniqueFeedAction);
    app.post('/chatAction', passportConfig.isAuthenticated, setHttpResponseHeaders, scriptController.postUpdateChatAction);
    app.post('/voiceoverTimer', passportConfig.isAuthenticated, setHttpResponseHeaders, userController.postUpdateVoiceoverTimer);
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
    app.get('/studentReportData/:classId/:username', passportConfig.isAuthenticated, setHttpResponseHeaders, userController.getStudentReportData);
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

/*
 * Error Handler.
 */
// Commented out: Do not have to use https://www.npmjs.com/package/errorhandler for local development
// if (process.env.instanceType === 'test'){
//   app.use(errorHandler()); 
// }
//  else {

// error handler
// COMMENTED OUT FOR NOW -- WILL WORK ON IT LATER; error handler for csrf invalid id error
// app.use(function(err, req, res, next) {
//     if (err.code !== 'EBADCSRFTOKEN') return next(err)

//     // handle CSRF token errors here
//     console.log("CSRF TOKEN ERROR");
//     console.log(err);
//     addCsrf();
//     console.log(res.locals.csrfToken);
//     // res.method = 'GET';
//     // res.url = '/getCSRFToken';
//     // res.send();
//     // // if (jqXHR.status === 403 && jqXHR.responseText.includes('invalid csrf token')) {
//     // const newCsrf = $.get("/getCSRFToken");
//     // //     _logStartPageAction(cat, newCsrf, --retryCount);
//     // // }
//     // console.log(res.locals.csrfToken);
//     // console.log(newCsrf)
//     res.send({ method: 'GET', url: ['/getCSRFToken'] });
// })

// error handler
app.use(function(err, req, res, next) {
    // No routes handled the request and no system error, that means 404 issue.
    // Forward to next middleware to handle it.
    if (!err) return next();

    console.error(err);

    // set locals, only providing error stack and message in development
    // Express app.get('env') returns 'development' if NODE_ENV is not defined
    err.status = err.status || 500;
    err.stack = req.app.get('env') === 'development' ? err.stack : '';
    err.message = req.app.get('env') === 'development' ? err.message : " Oops! Something went wrong.";

    res.locals.message = err.message;
    res.locals.error = err;

    // render the error page
    res.status(err.status);
    res.render('error');
});

// catch 404. 404 should be considered as a default behavior, not a system error.
// Necessary to include because in express, 404 responses are not the result of an error, so the error-handler middleware will not capture them. https://expressjs.com/en/starter/faq.html 
app.use(function(req, res, next) {
    var err = new Error('Page Not Found.');
    err.status = 404;

    console.log(err);

    // set locals, only providing error stack in development
    err.stack = req.app.get('env') === 'development' ? err.stack : '';

    res.locals.message = err.message + " Oops! We can't seem to find the page you're looking for.";
    res.locals.error = err;

    // render the error page
    res.status(err.status);
    res.render('error');
});
// }

/*
 * Start Express server.
 */
app.listen(app.get('port'), () => {
    console.log(`App is running on http://localhost:${app.get('port')} in ${app.get('env')} mode.`);
    console.log('  Press CTRL-C to stop\n');
});

module.exports = app;