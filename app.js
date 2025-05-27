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
const multer = require('multer');
const fs = require('fs');
const util = require('util');
fs.readFileAsync = util.promisify(fs.readFile);


/**
 * Load environment variables from .env file.
 */
dotenv.config({ path: '.env' });

// Multer options for user uploading (post images and avatar profile) images.
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
        maxAge: 1209600000, //24 hours
        sameSite: 'lax'
    },
    store: MongoStore.create({
        mongoUrl: process.env.PRO_MONGODB_URI || process.env.PRO_MONGOLAB_URI,
    })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use((req, res, next) => {
    lusca.csrf()(req, res, next);
});

// Security settings in our http header
app.use(lusca.xframe('SAMEORIGIN'));
app.use(lusca.xssProtection(true));
app.disable('x-powered-by');

app.use((req, res, next) => {
    res.locals.user = req.user;
    next();
});

app.use((req, res, next) => {
    // After successful login, redirect back to the intended page
    if (!req.user &&
        req.path !== '/login' &&
        req.path !== '/signup' &&
        req.path !== '/bell' &&
        !req.path.match(/^\/auth/) &&
        !req.path.match(/\./)) {
        req.session.returnTo = req.originalUrl;
    } else if (req.user && req.path == "/account") {
        req.session.returnTo = req.path;
    }
    next();
});

function setHttpResponseHeaders(req, res, next) {
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
    const modIds = [
        "accounts", "accounts-esp",
        "advancedlit", "advancedlit-esp",
        "cyberbullying",
        "digfoot", "digfoot-esp",
        "digital-literacy", "digital-literacy-esp",
        "esteem", "esteem-esp",
        "habits", "habits-esp",
        "phishing", "phishing-esp",
        "presentation", "presentation-esp",
        "privacy", "privacy-esp",
        "safe-posting",
        "targeted", "targeted-esp"
    ];
    
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

// All static files that express will automatically serve
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
 */
// Main route is the module page
app.get('/', passportConfig.isAuthenticated, setHttpResponseHeaders, function(req, res) {
    res.render('mods-esp', {
        title: 'Elige una lección',
        isResearchVersion
    });
});

// Render current user's account page
app.get('/account/:modId', passportConfig.isAuthenticated, setHttpResponseHeaders, isValidModId, userController.getAccount);

// Render end page
app.get('/end/:modId', passportConfig.isAuthenticated, setHttpResponseHeaders, isValidModId, function(req, res) {
    if (req.params.modId === "accounts" || req.params.modId === "privacy") {
        res.render(req.params.modId + "/" + req.params.modId + "_end", {
            title: "Finished",
            isResearchVersion,
        });
    } else if (
        req.params.modId === "esteem-esp" ||
        req.params.modId === "habits-esp" ||
        req.params.modId === "digfoot-esp" ||
        req.params.modId === "privacy-esp" ||
        req.params.modId === "accounts-esp" ||
        req.params.modId === "digital-literacy-esp" ||
        req.params.modId === "phishing-esp" ||
        req.params.modId === "targeted-esp" ||
        req.params.modId === "advancedlit-esp" ||
        req.params.modId === "presentation-esp"
    ) {
        res.render("base_end-esp.pug", {
            title: "Terminado",
            isResearchVersion,
        });
    } else {
        res.render("base_end.pug", {
            title: "Finished",
            isResearchVersion,
        });
    }
});

// Render interest pages for targeted ads module
app.get('/food/targeted', passportConfig.isAuthenticated, setHttpResponseHeaders, function(req, res) {
    res.render("targeted/targeted_food", { title: "Interest Page" });
});
app.get('/food/targeted-esp', passportConfig.isAuthenticated, setHttpResponseHeaders, function(req, res) {
    res.render("targeted-esp/targeted-esp_food", { title: "Interest Page" });
});
app.get('/gaming/targeted', passportConfig.isAuthenticated, setHttpResponseHeaders, function(req, res) {
    res.render("targeted/targeted_gaming", { title: "Interest Page" });
});
app.get('/gaming/targeted-esp', passportConfig.isAuthenticated, setHttpResponseHeaders, function(req, res) {
    res.render("targeted-esp/targeted-esp_gaming", { title: "Interest Page" });
});
app.get('/sports/targeted', passportConfig.isAuthenticated, setHttpResponseHeaders, function(req, res) {
    res.render("targeted/targeted_sports", { title: "Interest Page" });
});
app.get('/sports/targeted-esp', passportConfig.isAuthenticated, setHttpResponseHeaders, function(req, res) {
    res.render("targeted-esp/targeted-esp_sports", { title: "Interest Page" });
});

// Render free play pages for privacy module
app.get('/free-play/privacy', passportConfig.isAuthenticated, setHttpResponseHeaders, function(req, res) {
    res.render("privacy/privacy_free-play", { title: "Free-Play" });
});
app.get('/free-play2/privacy', passportConfig.isAuthenticated, setHttpResponseHeaders, function(req, res) {
    res.render("privacy/privacy_free-play2", { title: "Free-Play 2" });
});
app.get('/free-play3/privacy', passportConfig.isAuthenticated, setHttpResponseHeaders, function(req, res) {
    res.render("privacy/privacy_free-play3", { title: "Free-Play 3" });
});
app.get('/free-play4/privacy', passportConfig.isAuthenticated, setHttpResponseHeaders, function(req, res) {
    res.render("privacy/privacy_free-play4", { title: "Free-Play 4" });
});
app.get('/free-settings/privacy', passportConfig.isAuthenticated, setHttpResponseHeaders, function(req, res) {
    res.render("privacy/privacy_free-play_settings", { title: "Free-Play Settings" });
});
app.get('/free-settings2/privacy', passportConfig.isAuthenticated, setHttpResponseHeaders, function(req, res) {
    res.render("privacy/privacy_free-play_settings2", { title: "Free-Play Settings 2" });
});
app.get('/free-settings3/privacy', passportConfig.isAuthenticated, setHttpResponseHeaders, function(req, res) {
    res.render("privacy/privacy_free-play_settings3", { title: "Free-Play Settings 3" });
});

// Spanish versions of privacy free play pages
app.get('/free-play/privacy-esp', passportConfig.isAuthenticated, setHttpResponseHeaders, function(req, res) {
    res.render("privacy-esp/privacy-esp_free-play", { title: "Free-Play" });
});
app.get('/free-play2/privacy-esp', passportConfig.isAuthenticated, setHttpResponseHeaders, function(req, res) {
    res.render("privacy-esp/privacy-esp_free-play2", { title: "Free-Play 2" });
});
app.get('/free-play3/privacy-esp', passportConfig.isAuthenticated, setHttpResponseHeaders, function(req, res) {
    res.render("privacy-esp/privacy-esp_free-play3", { title: "Free-Play 3" });
});
app.get('/free-play4/privacy-esp', passportConfig.isAuthenticated, setHttpResponseHeaders, function(req, res) {
    res.render("privacy-esp/privacy-esp_free-play4", { title: "Free-Play 4" });
});
app.get('/free-settings/privacy-esp', passportConfig.isAuthenticated, setHttpResponseHeaders, function(req, res) {
    res.render("privacy-esp/privacy-esp_free-play_settings", { title: "Free-Play Settings" });
});
app.get('/free-settings2/privacy-esp', passportConfig.isAuthenticated, setHttpResponseHeaders, function(req, res) {
    res.render("privacy-esp/privacy-esp_free-play_settings2", { title: "Free-Play Settings 2" });
});
app.get('/free-settings3/privacy-esp', passportConfig.isAuthenticated, setHttpResponseHeaders, function(req, res) {
    res.render("privacy-esp/privacy-esp_free-play_settings3", { title: "Free-Play Settings 3" });
});

// Render intro page
app.get('/intro/:modId', passportConfig.isAuthenticated, setHttpResponseHeaders, isValidModId, function(req, res) {
    if (req.params.modId === "delete") {
        res.redirect('/');
    } else if (
        req.params.modId === "esteem-esp" ||
        req.params.modId === "habits-esp" ||
        req.params.modId === "digfoot-esp" ||
        req.params.modId === "privacy-esp" ||
        req.params.modId === "accounts-esp" ||
        req.params.modId === "digital-literacy-esp" ||
        req.params.modId === "phishing-esp" ||
        req.params.modId === "targeted-esp" ||
        req.params.modId === "advancedlit-esp" ||
        req.params.modId === "presentation-esp"
    ) {
        res.render("base_intro-esp.pug", {
            title: "Bienvenidos"
        });
    } else {
        res.render("base_intro.pug", {
            title: "Welcome"
        });
    }
});

// Render user's profile page
app.get('/me/:modId', passportConfig.isAuthenticated, setHttpResponseHeaders, isValidModId, userController.getMe);

// Main route for free play page
app.get('/modual/:modId', passportConfig.isAuthenticated, setHttpResponseHeaders, isValidModId, scriptController.getScript);

// Render privacy policy
app.get('/privacy', setHttpResponseHeaders, function(req, res) {
    res.render("privacy_policy", {
        title: "Privacy Policy"
    });
});

// Render reflection page
app.get('/results/:modId', passportConfig.isAuthenticated, setHttpResponseHeaders, isValidModId, async function(req, res) {
    if (
        req.params.modId === "esteem-esp" ||
        req.params.modId === "habits-esp" ||
        req.params.modId === "digfoot-esp" ||
        req.params.modId === "privacy-esp" ||
        req.params.modId === "accounts-esp" ||
        req.params.modId === "digital-literacy-esp" ||
        req.params.modId === "phishing-esp" ||
        req.params.modId === "targeted-esp" ||
        req.params.modId === "advancedlit-esp" ||
        req.params.modId === "presentation-esp"
    ) {
        const data = await fs.readFileAsync(`${__dirname}/public2/json/esp-reflectionSectionData.json`);
        const reflectionData = JSON.parse(data.toString());
        res.render(req.params.modId + "/" + req.params.modId + "_results", {
            title: "Reflexionar",
            reflectionData,
        });
    } else {
        let reflectionData;
        const data = await fs.readFileAsync(`${__dirname}/public2/json/reflectionSectionData.json`);
        reflectionData = JSON.parse(data.toString());

        res.render(req.params.modId + "/" + req.params.modId + "_results", {
            title: "Reflection",
            reflectionData,
        });
    }
});

// Render quiz page
app.get('/quiz/:modId', passportConfig.isAuthenticated, setHttpResponseHeaders, isValidModId, async function(req, res) {
    let quizData;
    const data = await fs.readFileAsync(`${__dirname}/public2/json/quizSectionData.json`);
    quizData = JSON.parse(data.toString())[req.params.modId];

    res.render("base_quiz.pug", {
        title: "Quiz",
        quizData,
    });
});

// Render practice page
app.get('/sim/:modId', passportConfig.isAuthenticated, setHttpResponseHeaders, isValidModId, function(req, res) {
    if (req.params.modId === "safe-posting") {
        res.set({
            'Content-Security-Policy': "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://dhpd030vnpk29.cloudfront.net https://cdnjs.cloudflare.com/ http://cdnjs.cloudflare.com/ https://www.googletagmanager.com https://www.google-analytics.com;" +
                "default-src 'self' https://www.google-analytics.com;" +
                "style-src 'self' 'unsafe-inline' https://dhpd030vnpk29.cloudfront.net https://cdnjs.cloudflare.com/ https://fonts.googleapis.com;" +
                "img-src 'self' https://dhpd030vnpk29.cloudfront.net https://www.googletagmanager.com https://www.google-analytics.com;" +
                "media-src https://dhpd030vnpk29.cloudfront.net;" +
                "font-src 'self' https://fonts.gstatic.com  https://cdnjs.cloudflare.com/ data:"
        });
    }
    res.render(req.params.modId + "/" + req.params.modId + "_sim", {
        title: "Guided Activity"
    });
});

// Additional practice pages
app.get('/sim1/:modId', passportConfig.isAuthenticated, setHttpResponseHeaders, isValidModId, function(req, res) {
    res.render(req.params.modId + "/" + req.params.modId + "_sim1", { title: "Guided Activity" });
});
app.get('/sim2/:modId', passportConfig.isAuthenticated, setHttpResponseHeaders, isValidModId, function(req, res) {
    res.render(req.params.modId + "/" + req.params.modId + "_sim2", { title: "Guided Activity" });
});
app.get('/sim3/:modId', passportConfig.isAuthenticated, setHttpResponseHeaders, isValidModId, function(req, res) {
    res.render(req.params.modId + "/" + req.params.modId + "_sim3", { title: "Guided Activity" });
});
app.get('/sim4/:modId', passportConfig.isAuthenticated, setHttpResponseHeaders, isValidModId, function(req, res) {
    res.render(req.params.modId + "/" + req.params.modId + "_sim4", { title: "Guided Activity" });
});

// Render start page
app.get('/start/:modId', passportConfig.isAuthenticated, setHttpResponseHeaders, isValidModId, function(req, res) {
    if (req.params.modId === "delete") {
        res.redirect('/');
    } else {
        res.render(req.params.modId + "/" + req.params.modId + "_start", {
            title: "Learn"
        });
    }
});

// Render transition pages
app.get('/trans/:modId', passportConfig.isAuthenticated, setHttpResponseHeaders, isValidModId, function(req, res) {
    res.render(req.params.modId + "/" + req.params.modId + "_trans", { title: "Review" });
});
app.get('/trans2/:modId', passportConfig.isAuthenticated, setHttpResponseHeaders, isValidModId, function(req, res) {
    res.render(req.params.modId + "/" + req.params.modId + "_trans2", { title: "Review" });
});
app.get('/trans_script/:modId', passportConfig.isAuthenticated, setHttpResponseHeaders, isValidModId, function(req, res) {
    res.render(req.params.modId + "/" + req.params.modId + "_trans_script", { title: "Review" });
});

// Render tutorial pages
app.get('/tutorial/:modId', passportConfig.isAuthenticated, setHttpResponseHeaders, isValidModId, function(req, res) {
    if (req.params.modId === "safe-posting") {
        res.set({
            'Content-Security-Policy': "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://dhpd030vnpk29.cloudfront.net https://cdnjs.cloudflare.com/ http://cdnjs.cloudflare.com/ https://www.googletagmanager.com https://www.google-analytics.com;" +
                "default-src 'self' https://www.google-analytics.com;" +
                "style-src 'self' 'unsafe-inline' https://dhpd030vnpk29.cloudfront.net https://cdnjs.cloudflare.com/ https://fonts.googleapis.com;" +
                "img-src 'self' https://dhpd030vnpk29.cloudfront.net https://www.googletagmanager.com https://www.google-analytics.com;" +
                "media-src https://dhpd030vnpk29.cloudfront.net;" +
                "font-src 'self' https://fonts.gstatic.com  https://cdnjs.cloudflare.com/ data:"
        });
    }
    res.render(req.params.modId + "/" + req.params.modId + "_tutorial", { title: "Tutorial" });
});
app.get('/tutorial2/:modId', passportConfig.isAuthenticated, setHttpResponseHeaders, isValidModId, function(req, res) {
    res.render(req.params.modId + "/" + req.params.modId + "_tutorial2", { title: "Tutorial" });
});
app.get('/tut_guide/:modId', passportConfig.isAuthenticated, setHttpResponseHeaders, isValidModId, function(req, res) {
    if (req.params.modId === "safe-posting") {
        res.set({
            'Content-Security-Policy': "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://dhpd030vnpk29.cloudfront.net https://cdnjs.cloudflare.com/ http://cdnjs.cloudflare.com/ https://www.googletagmanager.com https://www.google-analytics.com;" +
                "default-src 'self' https://www.google-analytics.com;" +
                "style-src 'self' 'unsafe-inline' https://dhpd030vnpk29.cloudfront.net https://cdnjs.cloudflare.com/ https://fonts.googleapis.com;" +
                "img-src 'self' https://dhpd030vnpk29.cloudfront.net https://www.googletagmanager.com https://www.google-analytics.com;" +
                "media-src https://dhpd030vnpk29.cloudfront.net;" +
                "font-src 'self' https://fonts.gstatic.com  https://cdnjs.cloudflare.com/ data:"
        });
    }
    res.render(req.params.modId + "/" + req.params.modId + "_tut_guide", { title: "Tutorial" });
});

// Render actor profile page
app.get('/user/:userId', passportConfig.isAuthenticated, setHttpResponseHeaders, actorsController.getActor);

/*
 * Account creation & deletion
 */
app.post('/delete', passportConfig.isAuthenticated, setHttpResponseHeaders, userController.getDeleteAccount);
app.get('/guest/:modId', setHttpResponseHeaders, userController.getGuest);

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
app.post('/post/new', setHttpResponseHeaders, scriptController.newPost);
app.post('/feed', passportConfig.isAuthenticated, setHttpResponseHeaders, scriptController.postUpdateFeedAction);
app.post('/reflection', passportConfig.isAuthenticated, setHttpResponseHeaders, scriptController.postReflectionAction);
app.post('/quiz', passportConfig.isAuthenticated, setHttpResponseHeaders, scriptController.postQuizAction);
app.post('/postViewQuizExplanations', passportConfig.isAuthenticated, setHttpResponseHeaders, scriptController.postViewQuizExplanations);
app.post('/interest', passportConfig.isAuthenticated, setHttpResponseHeaders, userController.postUpdateInterestSelection);
app.post('/advancedlitInterest', passportConfig.isAuthenticated, setHttpResponseHeaders, userController.postAdvancedlitInterestSelection);
app.get('/esteemTopic', passportConfig.isAuthenticated, setHttpResponseHeaders, userController.getEsteemTopic);
app.get('/advancedlitTopic', passportConfig.isAuthenticated, setHttpResponseHeaders, userController.getAdvancedlitTopic);
app.get('/habitsTimer', passportConfig.isAuthenticated, setHttpResponseHeaders, userController.getHabitsTimer);
app.post('/habitsTimer', passportConfig.isAuthenticated, setHttpResponseHeaders, userController.postUpdateHabitsTimer);
app.get('/habitsNotificationTimes', passportConfig.isAuthenticated, setHttpResponseHeaders, scriptController.getNotificationTimes);
app.post('/account/profile/:modId', passportConfig.isAuthenticated, setHttpResponseHeaders, userController.postUpdateProfile);

/*
 * Data collection routes
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

    // Teacher dashboard pages
    app.get('/classOverview', passportConfig.isAuthenticated, setHttpResponseHeaders, function(req, res) {
        res.render('teacherDashboard/classOverview', { title: 'Class Overview' });
    });
    app.get('/moduleOverview', passportConfig.isAuthenticated, setHttpResponseHeaders, function(req, res) {
        res.render('teacherDashboard/moduleOverview', { title: 'Module Overview' });
    });
    app.get('/studentReport', passportConfig.isAuthenticated, setHttpResponseHeaders, function(req, res) {
        res.render('teacherDashboard/studentReport', { title: 'Student Report' });
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

    // Learner dashboard pages
    app.get('/learningAchievement', passportConfig.isAuthenticated, setHttpResponseHeaders, function(req, res) {
        res.render('learnerDashboard/learningAchievement', { title: 'My Learning Achievement' });
    });
    app.get('/learningMap', passportConfig.isAuthenticated, setHttpResponseHeaders, function(req, res) {
        res.render('learnerDashboard/learningMap', { title: 'Learning Map' });
    });
    app.get('/moduleCompletion', passportConfig.isAuthenticated, setHttpResponseHeaders, function(req, res) {
        res.render('learnerDashboard/moduleCompletion', { title: 'Module Completion' });
    });
}

/**
 * Error Handler.
 */
app.use((req, res, next) => {
    const err = new Error('Page Not Found');
    err.status = 404;
    err.stack = req.app.get('env') === 'development' ? err.stack : '';
    res.locals.message = err.message + " Oops! We can't seem to find the page you're look for.";
    res.locals.error = err;
    res.status(err.status);
    console.log(err);
    res.render('error');
});

app.use((err, req, res) => {
    err.status = err.status || 500;
    err.stack = req.app.get('env') === 'development' ? err.stack : '';
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

