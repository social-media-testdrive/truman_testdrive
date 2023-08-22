const express = require('express');
const _ = require('lodash');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const bodyParser = require('body-parser');
const logger = require('morgan');
const errorHandler = require('errorhandler');
const lusca = require('lusca');
const dotenv = require('dotenv');
const flash = require('express-flash');
const path = require('path');
const mongoose = require('mongoose');
const passport = require('passport');
const expressValidator = require('express-validator');
//multer is how we send files (like images) thru web forms
const multer = require('multer');
//const csrf = require('csurf');
const fs = require('fs');
const util = require('util');
const cookieSession = require('cookie-session');
fs.readFileAsync = util.promisify(fs.readFile);
const User = require('./models/User');


/*
 * Dependencies that were listed but don't appear to be used
 */
// const chalk = require('chalk');
// const compression = require('compression');
// var schedule = require('node-schedule');
// const aws = require('aws-sdk');


/*
 * Load environment variables from .env file, where API keys and passwords are configured.
 */
dotenv.config({ path: '.env' });

const GoogleStrategy = require('passport-google-oauth2').Strategy;

passport.serializeUser((user , done) => {
    done(null , user);
})
passport.deserializeUser(function(user, done) {
    done(null, user);
});


/*
aws.config.update({
  secretAccessKey: process.env.AWS_SECRET,
  accessKeyId: process.env.AWS_ACCESS,
  region: "us-east-2"
});
*/

//multer options for basic files
var m_options = multer.diskStorage({
    destination: path.join(__dirname, 'uploads'),
    filename: function(req, file, cb) {
        var prefix = req.user.id + Math.random().toString(36).slice(2, 10);
        cb(null, prefix + file.originalname.replace(/[^A-Z0-9]+/ig, "_"));
    }
});

//multer options for uploading a post (user created post)
var userpost_options = multer.diskStorage({
    destination: path.join(__dirname, 'uploads/user_post'),
    filename: function(req, file, cb) {
        var lastsix = req.user.id.substr(req.user.id.length - 6);
        var prefix = lastsix + Math.random().toString(36).slice(2, 10);
        cb(null, prefix + file.originalname.replace(/[^A-Z0-9]+/ig, "_"));
    }
});

//multer options for uploading a user profile image
var useravatar_options = multer.diskStorage({
    destination: path.join(__dirname, 'uploads/user_post'),
    filename: function(req, file, cb) {
        var prefix = req.user.id + Math.random().toString(36).slice(2, 10);
        cb(null, prefix + file.originalname.replace(/[^A-Z0-9]+/ig, "_"));
    }
});

//const upload = multer({ dest: path.join(__dirname, 'uploads') });
const upload = multer({ storage: m_options });
const userpostupload = multer({ storage: userpost_options });
const useravatarupload = multer({ storage: useravatar_options });


/*
 * Controllers (route handlers).
 */
const activityController = require('./controllers/activity');
const actorsController = require('./controllers/actors');
const scriptController = require('./controllers/script');
const classController = require('./controllers/class');
const userController = require('./controllers/user');
// Notifications not currently used in TestDrive.
// const notificationController = require('./controllers/notification');

/*
 * API keys and Passport configuration.
 */
const passportConfig = require('./config/passport');

// set up route middleware
//va = csrf();

/*
 * Create Express server.
 */
const app = express();

/*
// Connect to MongoDB.

mongoose.Promise = global.Promise;

mongoose.connect(process.env.MONGODB_URI || process.env.MONGOLAB_URI);
mongoose.connect(process.env.PRO_MONGODB_URI || process.env.PRO_MONGOLAB_URI, { useNewUrlParser: true });
mongoose.connection.on('error', (err) => {
  console.error(err);
  console.log('%s MongoDB connection error. Please make sure MongoDB is running.', chalk.red('✗'));
  process.exit();
});
*/

/*
 * Connect to MongoDB.
 */
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect(process.env.PRO_MONGODB_URI || process.env.PRO_MONGOLAB_URI);
mongoose.connection.on('error', (err) => {
    console.error(err);
    //console.log('%s MongoDB connection error. Please make sure MongoDB is running.', chalk.red('✗'));
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
/*
app.use(sass({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public')
}));
*/
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());
// Define our session.
app.use(session({
    resave: false,
    saveUninitialized: true,
    rolling: false,
    cookie: {
        path: '/',
        httpOnly: true,
        secure: false,
        maxAge: 1209600000,
        sameSite: 'lax'
    },
    secret: process.env.SESSION_SECRET,
    store: new MongoStore({
        url: process.env.PRO_MONGODB_URI || process.env.PRO_MONGOLAB_URI,
        autoReconnect: true,
        clear_interval: 3600
    })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//this allows us to no check CSRF when uploading an image. Its a weird issue that
//multer and lusca no not play well together
/*app.use((req, res, next) => {
    if ((req.path === '/api/upload') || (req.path === '/post/new') || (req.path === '/account/profile') || (req.path === '/account/signup_info_post') || (req.path === '/classes')) {
        //console.log("Not checking CSRF - out path now");
        //console.log("@@@@@request is " + req);
        //console.log("@@@@@file is " + req.file);
        //console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
        next();
    } else {
        //lusca.csrf()(req, res, next);
        next();
    }
});*/

//secruity settings in our http header
app.use(lusca.xframe('SAMEORIGIN'));
app.use(lusca.xssProtection(true));

app.use((req, res, next) => {
    res.locals.user = req.user;
    next();
});

app.use(session({
    secret: 'secret', // change this to a secret key
    resave: true,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

app.get('/x', (req, res) => {
    res.send("<button><a href='/auth'>Login With Google</a></button>")
});

// google Auth &&&&&&MOVE to confih/passport.js
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID, 
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/callback", // Your base URL + path.
    passReqToCallback:true
  },
  function(request, accessToken, refreshToken, profile, done) {
    return done(null, profile);
  }
));


app.get('/auth', passport.authenticate('google', { 
    scope: ['email', 'profile']    
}
)
);

// Auth Callback
app.get('/auth/callback',
    passport.authenticate('google', {
        successRedirect: '/auth/callback/success',
        failureRedirect: '/auth/callback/failure'
    })
);

// Success 
app.get('/auth/callback/success', (req, res, next) => {
    if (!req.user) {
        res.redirect('/auth/callback/failure');
    } else {
        const user = new User({
            username: req.user.email,
            password: "thinkblue",
            group: 'no:no',
            active: true,
            ui: 'no', //ui or no
            notify: 'no', //no, low or high
            lastNotifyVisit: Date.now(),
        });
        console.log(req.user.displayName)
        user.profile.name = req.user.given_name;
        user.profile.location = "New York";
        user.profile.bio = 'There is no input or content provided by this person.';
        user.profile.picture = 'avatar-icon.svg';

        User.findOne({ username: req.user.email }, (err, existingUser) => {
            if (err) { return next(err); }
            if (existingUser) {
                console.log("existingUser")
                console.log(existingUser)
                req.logIn(existingUser, (err) => {
                    if (err) {
                        return next(err);
                    }
                    var temp = req.session.passport; // {user: 1}
                    req.session.regenerate(function(err) {
                        //req.session.passport is now undefined
                        req.session.passport = temp;
                        req.session.save(function(err) {
                        
                            return res.redirect('/selection');
                        });
                    });
                });
            }else{
            user.save((err) => {
                console.log("not existingUser")
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
                            return res.redirect('/selection');
                        });
                    });
                    
                });
            });
        }
        });
    }
});


// failure
app.get('/auth/callback/failure', (req, res) => {
    res.send("Error");
});
///////Everything above as well

app.use((req, res, next) => {
    // After successful login, redirect back to the intended page
    if (!req.user &&
        req.path !== '/login' &&
        req.path !== '//up' &&
        req.path !== '/bell' &&
        !req.path.match(/^\/auth/) &&
        !req.path.match(/\./)) {
        //console.log("@@@@@path is now");
        //console.log(req.path);
        req.session.returnTo = req.path;
    } else if (req.user &&
        req.path == '/account') {
        //console.log("!!!!!!!path is now");
        //console.log(req.path);
        req.session.returnTo = req.path;
    }
    next();
});

//var csrf = lusca({ csrf: true });

//helper function just to see what is in the body
function check(req, res, next) {
    // console.log("@@@@@@@@@@@@Body is now ");
    // console.log(req.body);
    next();
}

/*functio(req, res, next) {
    res.locals.csrfToken = req.csrfToken();
    next();
}*/

function setHttpResponseHeaders(req, res, next) {
    // TODO: rework chatbox so that 'unsafe-eval' in script-src is not required.
    next();
}

// function updateSessionUserData(req, updatedUser) {

// });


function isValidModId(req, res, next) {
    const modIds = [
        "trolls",
        "identity",
        "temp"
    ]
    if (modIds.includes(req.params.modId)) {
        next();
    } else {
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

//Needs to be in controllers/user.js
function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

/**create one time link */

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//get from database or something like it
const allowedUUIDs = [];


//test your UUID (access token)
function checkSingleAccess(requestUUID) {
  const uuids = Object.values(allowedUUIDs);
  console.log(uuids)
  const index = uuids.indexOf(requestUUID);
  const UUIDExists = index > -1;
  let deletedEmail = UUIDExists;
  
  if(UUIDExists){
    //remove from array, or your database
    //allowedUUIDs.splice(index, 1);
    for (let email in allowedUUIDs) {
        if (allowedUUIDs[email] === requestUUID) {
          
          delete allowedUUIDs[email];
          deletedEmail = email;
          break;
        }
      }
  }
  //console.log(deletedEmail)
  //console.log(UUIDExists);

  return deletedEmail;
}

/**
     let quizData;
    const data = await fs.readFileAsync(`${__dirname}/public2/json/quizSectionData.json`);
    quizData = JSON.parse(data.toString())[req.params.modId];

    res.render('base_quiz.pug', {
        title: 'Quiz',
        quizData,
    });

 */
//set a path parameter with :uuid
app.use('/temporary-link/:uuid', function(req, res, next) {
  //get your path parameter
  const requestUUID = req.params.uuid;
  //test if allowed
  const email = checkSingleAccess(requestUUID)
  if(email){
    //res.send(`UUID ${requestUUID} allowed` );
    res.render('changePassword.pug', {
        title: 'changePassword',
        email,
    });

  }else{
    //if not build an error
    const errorResponse = `404. This temporary link is no longer avaliable`;
    res.status(403, errorResponse);
    res.send(errorResponse);
  }
});
///Everything above as well

module.exports = app;

/*
 * Primary app routes.
 * (In alphabetical order)
 */

function isValidModId(req, res, next) {
    const modIds = [
        "trolls",
        "identity",
        "temp"
    ]

    if (modIds.includes(req.params.modId)) {
        next();
    } else {
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
    }
}
// Main route is the module page
app.get('/', passportConfig.isAuthenticated, setHttpResponseHeaders, function(req, res) {
    res.render('mods', {
        title: 'Pick a Lesson',
        isResearchVersion
    });
});



// Get current csrf token; COMMENTED OUT FOR NOW-- will work on it later
// app.get('/getCSRFToken', passportConfig.isAuthenticated, setHttpResponseHeaders, function(req, res) {
//     console.log(res.locals.csrfToken)
//     res.send(res.locals.csrfToken);
// });

// Render current user's account page, which is module specific (all modules)
app.get('/account', passportConfig.isAuthenticated, setHttpResponseHeaders, userController.getAccount);

// Render end page (all modules)
app.get('/end/:modId', passportConfig.isAuthenticated, setHttpResponseHeaders, isValidModId, function(req, res) {
    res.render('base_end.pug', {
        title: 'Finished',
        modId: req.params.modId,
        isResearchVersion
    });
});

app.get('/explore_page', passportConfig.isAuthenticated, setHttpResponseHeaders, function(req, res) {
    res.render('explore_page.pug', {
        title: 'explore_page',
    });
});


// Render selection
app.get('/selection', passportConfig.isAuthenticated, setHttpResponseHeaders, function(req, res) {
    res.render('account/selection', {
        title: 'Selection'
    });
});

// Render character intro
app.get('/character', passportConfig.isAuthenticated, setHttpResponseHeaders, function(req, res) {
    res.render('account/character_intro', {
        title: 'Hello'
    });
});

// Render accessibility page
app.get('/accessibility', passportConfig.isAuthenticated, setHttpResponseHeaders, function(req, res) {
    res.render('accessibility.pug', {
        title: 'Accessibility'
    });
});


// Render selection
app.get('/edit_profile', passportConfig.isAuthenticated, setHttpResponseHeaders, function(req, res) {
    res.render('account/edit_profile', {
        title: 'edit_profile'
    });
});

app.get('/gmail', passportConfig.isAuthenticated, setHttpResponseHeaders, function(req, res) {
    res.render('account/gmail', {
        title: 'gmail'
    });
});

app.get('/mail1', passportConfig.isAuthenticated, setHttpResponseHeaders, function(req, res) {
    res.render('account/mail1', {
        title: 'mail1'
    });
});

app.get('/mail2', passportConfig.isAuthenticated, setHttpResponseHeaders, function(req, res) {
    res.render('account/mail2', {
        title: 'mail2'
    });
});

app.get('/mail3', passportConfig.isAuthenticated, setHttpResponseHeaders, function(req, res) {
    res.render('account/mail3', {
        title: 'mail3'
    });
});

app.get('/mail4', passportConfig.isAuthenticated, setHttpResponseHeaders, function(req, res) {
    res.render('account/mail4', {
        title: 'mail4'
    });
});

app.get('/mail5', passportConfig.isAuthenticated, setHttpResponseHeaders, function(req, res) {
    res.render('account/mail5', {
        title: 'mail5'
    });
});

app.get('/mail6', passportConfig.isAuthenticated, setHttpResponseHeaders, function(req, res) {
    res.render('account/mail6', {
        title: 'mail5'
    });
});

app.get('/post_quiz', passportConfig.isAuthenticated, setHttpResponseHeaders, function(req, res) {
    res.render('account/post_quiz', {
        title: 'post_quiz'
    });
});

app.get('/post_quiz2', passportConfig.isAuthenticated, setHttpResponseHeaders, function(req, res) {
    res.render('account/post_quiz2', {
        title: 'post_quiz2'
    });
});
app.get('/post_quiz3', passportConfig.isAuthenticated, setHttpResponseHeaders, function(req, res) {
    res.render('account/post_quiz3', {
        title: 'post_quiz3'
    });
});
app.get('/post_quiz4', passportConfig.isAuthenticated, setHttpResponseHeaders, function(req, res) {
    res.render('account/post_quiz4', {
        title: 'post_quiz4'
    });
});
app.get('/post_quiz5', passportConfig.isAuthenticated, setHttpResponseHeaders, function(req, res) {
    res.render('account/post_quiz5', {
        title: 'post_quiz5'
    });
});
app.get('/post_quiz6', passportConfig.isAuthenticated, setHttpResponseHeaders, function(req, res) {
    res.render('account/post_quiz6', {
        title: 'post_quiz6'
    });
});
app.get('/post_quiz7', passportConfig.isAuthenticated, setHttpResponseHeaders, function(req, res) {
    res.render('account/post_quiz7', {
        title: 'post_quiz7'
    });
});
app.get('/post_quiz8', passportConfig.isAuthenticated, setHttpResponseHeaders, function(req, res) {
    res.render('account/post_quiz8', {
        title: 'post_quiz7'
    });
});
app.get('/post_quiz9', passportConfig.isAuthenticated, setHttpResponseHeaders, function(req, res) {
    res.render('account/post_quiz9', {
        title: 'post_quiz9'
    });
});
app.get('/post_quiz10', passportConfig.isAuthenticated, setHttpResponseHeaders, function(req, res) {
    res.render('account/post_quiz10', {
        title: 'post_quiz10'
    });
});
app.get('/post_quiz11', passportConfig.isAuthenticated, setHttpResponseHeaders, function(req, res) {
    res.render('account/post_quiz11', {
        title: 'post_quiz11'
    });
});
app.get('/post_quiz12', passportConfig.isAuthenticated, setHttpResponseHeaders, function(req, res) {
    res.render('account/post_quiz12', {
        title: 'post_quiz12'
    });
});
app.get('/exploration_begin', passportConfig.isAuthenticated, setHttpResponseHeaders, function(req, res) {
    res.render('account/exploration_begin', {
        title: 'exploration_begin'
    });
});
// Render facilitator login page (all modules)
app.get('/facilitatorLogin', setHttpResponseHeaders, function(req, res) {
    res.render('facilitatorLogin.pug', {
        title: 'Facilitator Login'
    });
});

//forgot password
app.get('/forgotPassword', setHttpResponseHeaders, function(req, res) {
    res.render('forgotPassword.pug', {
        title: 'forgotPassword'
    })
})

// ******************* Summer 2023 Render All Module Pages ****************************

// Render intro page (all modules)
// - For example for identity the route is: /intro/identity
app.get('/intro/:modId', passportConfig.isAuthenticated, setHttpResponseHeaders, isValidModId, function(req, res) {
    /* Renders the intro page for the module
    The modules are in the *views* folder 
    Then the intro page is in the module's *intro* folder
    So for the identity module the path to the intro pug file is: identity/intro/identity_intro */
    res.render(req.params.modId + '/intro/' + req.params.modId + '_intro', {
        title: 'Intro'
    });
});

app.get('/intro2/:modId', passportConfig.isAuthenticated, setHttpResponseHeaders, isValidModId, function(req, res) {
    res.render(req.params.modId + '/intro/' + req.params.modId + '_intro2', {
        title: 'Intro'
    });
});

app.get('/intro3/:modId', passportConfig.isAuthenticated, setHttpResponseHeaders, isValidModId, function(req, res) {
    res.render(req.params.modId + '/intro/' + req.params.modId + '_intro3', {
        title: 'Intro'
    });
});

app.get('/intro4/:modId', passportConfig.isAuthenticated, setHttpResponseHeaders, isValidModId, function(req, res) {
    res.render(req.params.modId + '/intro/' + req.params.modId + '_intro4', {
        title: 'Intro'
    });
});

app.get('/intro5/:modId', passportConfig.isAuthenticated, setHttpResponseHeaders, isValidModId, function(req, res) {
    res.render(req.params.modId + '/intro/' + req.params.modId + '_intro5', {
        title: 'Intro'
    });
});




// Render challenge / prequiz (all modules) ******************************
app.get('/challenge/:modId', passportConfig.isAuthenticated, setHttpResponseHeaders, isValidModId, function(req, res) {
    res.render(req.params.modId + '/challenge/' + req.params.modId + '_challenge', {
        title: 'Challenge'
    });
});

// get time for phone text message like: 12:48 PM 
function getCurrentTime() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const meridiem = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
    return `${formattedHours}:${formattedMinutes} ${meridiem}`;
}

// get date for emails like: 8/10/2023
function getCurrentDate() {
    const now = new Date();
    const month = now.getMonth() + 1; // Months are 0-based, so adding 1
    const day = now.getDate();
    const year = now.getFullYear();
    return `${month}/${day}/${year}`;
}

function getFutureDate() {
    // get date a week from the current date for the scam quiz emails 
    // for example if currentDate is 8/19/2023 this function will return 8/26/2023
    const today = new Date();
    const oneWeekLater = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000); // Adding 7 days in milliseconds
    
    const month = String(oneWeekLater.getMonth() + 1).padStart(2, '0');
    const day = String(oneWeekLater.getDate()).padStart(2, '0');
    const year = oneWeekLater.getFullYear();
    
    // make string in MM/DD/YYYY format
    return `${month}/${day}/${year}`;  
}
  

app.get('/challenge2/:modId', passportConfig.isAuthenticated, setHttpResponseHeaders, isValidModId, async function(req, res) {
    let quizData;
    let currentSection = "challenge"
    let backLink = "/challenge/identity"
    let nextLink = "/challenge3/identity"
    const data = await fs.readFileAsync(`${__dirname}/public2/json/` +  req.params.modId + `/challenge.json`);
    quizData = JSON.parse(data.toString());

    const currentTime = getCurrentTime();
    const currentDate = getCurrentDate();
    req.params.modId 
    res.render('dart-quiz-template.pug', {
        title: 'Challenge',
        quizData,
        currentSection,
        backLink,
        nextLink,
        currentTime,
        currentDate
    });
});

app.get('/challenge3/:modId', passportConfig.isAuthenticated, setHttpResponseHeaders, isValidModId, function(req, res) {
    res.render(req.params.modId + '/challenge/' + req.params.modId + '_challenge3', {
        title: 'Challenge'
    });
});

app.get('/challenge4/:modId', passportConfig.isAuthenticated, setHttpResponseHeaders, isValidModId, function(req, res) {
    res.render(req.params.modId + '/challenge/' + req.params.modId + '_challenge4', {
        title: 'Challenge'
    });
});

app.get('/challenge5/:modId', passportConfig.isAuthenticated, setHttpResponseHeaders, isValidModId, function(req, res) {
    res.render(req.params.modId + '/challenge/' + req.params.modId + '_challenge5', {
        title: 'Challenge'
    });
});

app.get('/challenge6/:modId', passportConfig.isAuthenticated, setHttpResponseHeaders, isValidModId, function(req, res) {
    res.render(req.params.modId + '/challenge/' + req.params.modId + '_challenge6', {
        title: 'Challenge'
    });
});

app.get('/challenge7/:modId', passportConfig.isAuthenticated, setHttpResponseHeaders, isValidModId, function(req, res) {
    res.render(req.params.modId + '/challenge/' + req.params.modId + '_challenge', {
        title: 'Challenge'
    });
});

app.get('/challenge8/:modId', passportConfig.isAuthenticated, setHttpResponseHeaders, isValidModId, function(req, res) {
    res.render(req.params.modId + '/challenge/' + req.params.modId + '_evaluate8', {
        title: 'challenge'
    });
});

// Render learn submod 1 (all modules) ******************************
app.get('/submod/learn/:modId', passportConfig.isAuthenticated, setHttpResponseHeaders, isValidModId, function(req, res) {
    res.render(req.params.modId + '/learn/submod/' + req.params.modId + '_sub_learn', {
        title: 'Learn'
    });
});

app.get('/submod/learn2/:modId', passportConfig.isAuthenticated, setHttpResponseHeaders, isValidModId, function(req, res) {
    res.render(req.params.modId + '/learn/submod/' + req.params.modId + '_sub_learn2', {
        title: 'Learn'
    });
});

app.get('/submod/learn3/:modId', passportConfig.isAuthenticated, setHttpResponseHeaders, isValidModId, function(req, res) {
    res.render(req.params.modId + '/learn/submod/' + req.params.modId + '_sub_learn3', {
        title: 'Learn'
    });
});

app.get('/submod/learn4/:modId', passportConfig.isAuthenticated, setHttpResponseHeaders, isValidModId, function(req, res) {
    res.render(req.params.modId + '/learn/submod/' + req.params.modId + '_sub_learn4', {
        title: 'Learn'
    });
});

app.get('/submod/learn5/:modId', passportConfig.isAuthenticated, setHttpResponseHeaders, isValidModId, function(req, res) {
    res.render(req.params.modId + '/learn/submod/' + req.params.modId + '_sub_learn5', {
        title: 'Learn'
    });
});

app.get('/submod/learn6/:modId', passportConfig.isAuthenticated, setHttpResponseHeaders, isValidModId, async function(req, res) {
    let quizData;
    let currentSection = "submodOne"
    let backLink = "/submod/learn5/identity"
    let nextLink = "/submod/learn7/identity"
    const data = await fs.readFileAsync(`${__dirname}/public2/json/` +  req.params.modId + `/submod.json`);
    quizData = JSON.parse(data.toString());

    const currentTime = getCurrentTime();
    const currentDate = getCurrentDate();
    req.params.modId 
    res.render('dart-quiz-template.pug', {
        title: 'Quiz',
        quizData,
        currentSection,
        backLink,
        nextLink,
        currentTime,
        currentDate
    });
});

app.get('/submod/learn7/:modId', passportConfig.isAuthenticated, setHttpResponseHeaders, isValidModId, function(req, res) {
    res.render(req.params.modId + '/learn/submod/' + req.params.modId + '_sub_learn7', {
        title: 'Learn'
    });
});

app.get('/submod/learn8/:modId', passportConfig.isAuthenticated, setHttpResponseHeaders, isValidModId, function(req, res) {
    res.render(req.params.modId + '/learn/submod/' + req.params.modId + '_sub_learn8', {
        title: 'Learn'
    });
});

app.get('/submod/learn9/:modId', passportConfig.isAuthenticated, setHttpResponseHeaders, isValidModId, function(req, res) {
    res.render(req.params.modId + '/learn/submod/' + req.params.modId + '_sub_learn9', {
        title: 'Learn'
    });
});

app.get('/submod/learn10/:modId', passportConfig.isAuthenticated, setHttpResponseHeaders, isValidModId, function(req, res) {
    res.render(req.params.modId + '/learn/submod/' + req.params.modId + '_sub_learn10', {
        title: 'Learn'
    });
});

// Render learn submod 2 (all modules) ******************************
app.get('/submod2/learn/:modId', passportConfig.isAuthenticated, setHttpResponseHeaders, isValidModId, function(req, res) {
    res.render(req.params.modId + '/learn/submod2/' + req.params.modId + '_sub2_learn', {
        title: 'Learn'
    });
});

app.get('/submod2/learn2/:modId', passportConfig.isAuthenticated, setHttpResponseHeaders, isValidModId, function(req, res) {
    res.render(req.params.modId + '/learn/submod2/' + req.params.modId + '_sub2_learn2', {
        title: 'Learn'
    });
});

app.get('/submod2/learn3/:modId', passportConfig.isAuthenticated, setHttpResponseHeaders, isValidModId, function(req, res) {
    res.render(req.params.modId + '/learn/submod2/' + req.params.modId + '_sub2_learn3', {
        title: 'Learn'
    });
});

app.get('/submod2/learn4/:modId', passportConfig.isAuthenticated, setHttpResponseHeaders, isValidModId, function(req, res) {
    res.render(req.params.modId + '/learn/submod2/' + req.params.modId + '_sub2_learn4', {
        title: 'Learn'
    });
});

app.get('/submod2/learn5/:modId', passportConfig.isAuthenticated, setHttpResponseHeaders, isValidModId, function(req, res) {
    res.render(req.params.modId + '/learn/submod2/' + req.params.modId + '_sub2_learn5', {
        title: 'Learn'
    });
});

app.get('/submod2/learn6/:modId', passportConfig.isAuthenticated, setHttpResponseHeaders, isValidModId, function(req, res) {
    res.render(req.params.modId + '/learn/submod2/' + req.params.modId + '_sub2_learn6', {
        title: 'Learn'
    });
});

app.get('/submod2/learn7/:modId', passportConfig.isAuthenticated, setHttpResponseHeaders, isValidModId, function(req, res) {
    res.render(req.params.modId + '/learn/submod2/' + req.params.modId + '_sub2_learn7', {
        title: 'Learn'
    });
});

app.get('/submod2/learn8/:modId', passportConfig.isAuthenticated, setHttpResponseHeaders, isValidModId, function(req, res) {
    res.render(req.params.modId + '/learn/submod2/' + req.params.modId + '_sub2_learn8', {
        title: 'Learn'
    });
});

app.get('/submod2/learn9/:modId', passportConfig.isAuthenticated, setHttpResponseHeaders, isValidModId, function(req, res) {
    res.render(req.params.modId + '/learn/submod2/' + req.params.modId + '_sub2_learn9', {
        title: 'Learn'
    });
});

app.get('/submod2/learn10/:modId', passportConfig.isAuthenticated, setHttpResponseHeaders, isValidModId, function(req, res) {
    res.render(req.params.modId + '/learn/submod2/' + req.params.modId + '_sub2_learn10', {
        title: 'Learn'
    });
});

app.get('/submod2/learn11/:modId', passportConfig.isAuthenticated, setHttpResponseHeaders, isValidModId, function(req, res) {
    res.render(req.params.modId + '/learn/submod2/' + req.params.modId + '_sub2_learn11', {
        title: 'Learn'
    });
});

app.get('/submod2/learn12/:modId', passportConfig.isAuthenticated, setHttpResponseHeaders, isValidModId, function(req, res) {
    res.render(req.params.modId + '/learn/submod2/' + req.params.modId + '_sub2_learn12', {
        title: 'Learn'
    });
});

app.get('/submod2/learn13/:modId', passportConfig.isAuthenticated, setHttpResponseHeaders, isValidModId, function(req, res) {
    res.render(req.params.modId + '/learn/submod2/' + req.params.modId + '_sub2_learn13', {
        title: 'Learn'
    });
});

app.get('/submod2/learn14/:modId', passportConfig.isAuthenticated, setHttpResponseHeaders, isValidModId, async function(req, res) {
    let quizData;
    let currentSection = "submodTwo"
    let backLink = "/submod2/learn13/identity"
    let nextLink = "/submod2/learn15/identity"
    const data = await fs.readFileAsync(`${__dirname}/public2/json/` +  req.params.modId + `/submodTwo.json`);
    quizData = JSON.parse(data.toString());

    const currentTime = getCurrentTime();
    const currentDate = getCurrentDate();
    const futureDate = getFutureDate();

    req.params.modId 
    res.render('dart-quiz-template.pug', {
        title: 'Quiz',
        quizData,
        currentSection,
        backLink,
        nextLink,
        currentTime,
        currentDate,
        futureDate
    });
});

app.get('/submod2/learn15/:modId', passportConfig.isAuthenticated, setHttpResponseHeaders, isValidModId, async function(req, res) {
    res.render(req.params.modId + '/learn/submod2/' + req.params.modId + '_sub2_learn15', {
        title: 'Learn'
    });
});

app.get('/submod2/learn16/:modId', passportConfig.isAuthenticated, setHttpResponseHeaders, isValidModId, function(req, res) {
    res.render(req.params.modId + '/learn/submod2/' + req.params.modId + '_sub2_learn16', {
        title: 'Learn'
    });
});

// Render learn submod 3 (all modules) ******************************
app.get('/submod3/learn/:modId', passportConfig.isAuthenticated, setHttpResponseHeaders, isValidModId, function(req, res) {
    res.render(req.params.modId + '/learn/submod3/' + req.params.modId + '_sub3_learn', {
        title: 'Learn'
    });
});

app.get('/submod3/learn2/:modId', passportConfig.isAuthenticated, setHttpResponseHeaders, isValidModId, function(req, res) {
    res.render(req.params.modId + '/learn/submod3/' + req.params.modId + '_sub3_learn2', {
        title: 'Learn'
    });
});

app.get('/submod3/learn3/:modId', passportConfig.isAuthenticated, setHttpResponseHeaders, isValidModId, function(req, res) {
    res.render(req.params.modId + '/learn/submod3/' + req.params.modId + '_sub3_learn3', {
        title: 'Learn'
    });
});

app.get('/submod3/learn4/:modId', passportConfig.isAuthenticated, setHttpResponseHeaders, isValidModId, function(req, res) {
    res.render(req.params.modId + '/learn/submod3/' + req.params.modId + '_sub3_learn4', {
        title: 'Learn'
    });
});

app.get('/submod3/learn5/:modId', passportConfig.isAuthenticated, setHttpResponseHeaders, isValidModId, function(req, res) {
    res.render(req.params.modId + '/learn/submod3/' + req.params.modId + '_sub3_learn5', {
        title: 'Learn'
    });
});

app.get('/submod3/learn6/:modId', passportConfig.isAuthenticated, setHttpResponseHeaders, isValidModId, function(req, res) {
    res.render(req.params.modId + '/learn/submod3/' + req.params.modId + '_sub3_learn6', {
        title: 'Learn'
    });
});

app.get('/submod3/learn7/:modId', passportConfig.isAuthenticated, setHttpResponseHeaders, isValidModId, function(req, res) {
    res.render(req.params.modId + '/learn/submod3/' + req.params.modId + '_sub3_learn7', {
        title: 'Learn'
    });
});

app.get('/submod3/learn8/:modId', passportConfig.isAuthenticated, setHttpResponseHeaders, isValidModId, function(req, res) {
    res.render(req.params.modId + '/learn/submod3/' + req.params.modId + '_sub3_learn8', {
        title: 'Learn'
    });
});

app.get('/submod3/learn9/:modId', passportConfig.isAuthenticated, setHttpResponseHeaders, isValidModId, function(req, res) {
    res.render(req.params.modId + '/learn/submod3/' + req.params.modId + '_sub3_learn9', {
        title: 'Learn'
    });
});

app.get('/submod3/learn10/:modId', passportConfig.isAuthenticated, setHttpResponseHeaders, isValidModId, function(req, res) {
    res.render(req.params.modId + '/learn/submod3/' + req.params.modId + '_sub3_learn10', {
        title: 'Learn'
    });
});


// Render explore (all modules) ******************************
app.get('/explore/:modId', passportConfig.isAuthenticated, setHttpResponseHeaders, isValidModId, function(req, res) {
    res.render(req.params.modId + '/explore/' + req.params.modId + '_explore', {
        title: 'Explore'
    });
});

function formatDate(date) {
    const options = { month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

app.get('/explore2/:modId', passportConfig.isAuthenticated, setHttpResponseHeaders, isValidModId, function(req, res) {
    res.render(req.params.modId + '/explore/' + req.params.modId + '_explore2', {
        title: 'Explore'
    });
});

app.get('/explore3/:modId', passportConfig.isAuthenticated, setHttpResponseHeaders, isValidModId, function(req, res) {
    const currentDate = new Date();
    const currentTime = getCurrentTime();

    const oneDayAgo = new Date(currentDate.getTime() - 24 * 60 * 60 * 1000);
    const twoDaysAgo = new Date(currentDate.getTime() - 24 * 2 * 60 * 60 * 1000);
    const threeDaysAgo = new Date(currentDate.getTime() - 24 * 3 * 60 * 60 * 1000);
    const fourDaysAgo = new Date(currentDate.getTime() - 24 * 4 * 60 * 60 * 1000);

    const emails = [
      { index: 0, sender: "Agent Intrepid", subject: "Example email", date: currentTime, from:"<intrepid@gmail.com>", content: "<p>Hello, </p><p>Just wanted to let you know you're doing great!</p><p>Best,</p><p>Agent Intrepid</p>", replyHeader: "warning", replyContent: "This email is indicative of an identity theft scam. Replying to the email is dangerous! The safe options would be to block sender, report scam, or delete the email. We can look into why this is a scam.", blockHeader: "good", blockContent: "Blocking this sender is correct because this email is indicative of an identity theft scam. You could also report or delete the email.", reportHeader: "good", reportContent: "Reporting this email is correct because this email is indicative of an identity theft scam. You could also block the sender or delete the email.", deleteHeader: "good", deleteContent: "Deleting this email is correct because this email is indicative of an identity theft scam. You could also block the sender or report it as a scam." },
      { index: 1, sender: "Walmart", subject: "URGENT!", date: formatDate(oneDayAgo), from:"<walmrt@gmail.com>", content: "<p>Hi customer. This is an URGENT message!</p><p>Your payment was declined on a recent purchase. Resubmit your credit card details at this link below within 24 hours.</p><p>Click here NOW! <a class='fakeLink' onclick='linkClick()'>http://jdksj6879sh.com</a></p>", replyHeader: "warning", replyContent: "This email is indicative of an identity theft scam. Replying to the email is dangerous! The safe options would be to block sender, report scam, or delete the email. We can look into why this is a scam.", blockHeader: "good", blockContent: "Blocking this sender is correct because this email is indicative of an identity theft scam. You could also report or delete the email.", reportHeader: "good", reportContent: "Reporting this email is correct because this email is indicative of an identity theft scam. You could also block the sender or delete the email.", deleteHeader: "good", deleteContent: "Deleting this email is correct because this email is indicative of an identity theft scam. You could also block the sender or report it as a scam." },
      { index: 2, sender: "irs gov", subject: "Identity Verification", date: formatDate(oneDayAgo), from:"<irsgov@gmail.com>", content: "<p>Dear Tax Payer,</p><p>We’ve noticed your account information is missing orincorrect. We need to verify your account information to file your Tax Refund.</p><p>Please follow <a class='fakeLink' onclick='linkClick()'>this link</a> to verify your info.</p><p>Thanks,</p><p>IRS Team <br> 2016 IRS All right reserved.</p><img src='/images/irs.png' alt='irs logo' width='50px'><p>IMPORTANT NOTE: If you receive this message in spam or junk it is a result of your network provider.</p>", replyHeader: "warning", replyContent: "This email is indicative of an identity theft scam. Replying to the email is dangerous! The safe options would be to block sender, report scam, or delete the email. We can look into why this is a scam.", blockHeader: "good", blockContent: "Blocking this sender is correct because this email is indicative of an identity theft scam. You could also report or delete the email.", reportHeader: "good", reportContent: "Reporting this email is correct because this email is indicative of an identity theft scam. You could also block the sender or delete the email.", deleteHeader: "good", deleteContent: "Deleting this email is correct because this email is indicative of an identity theft scam. You could also block the sender or report it as a scam."},
      { index: 3, sender: "Dropbox", subject: "New Sign In Detected", date: formatDate(twoDaysAgo), from:"<irsgov@gmail.com>", content: "<img src='/images/dropbox.png' alt='dropbox email screenshot'>", replyHeader: "good", replyContent: "Replying is okay because this email is legitimate and can be trusted. We can look into why this is not a scam.", blockHeader: "warning", blockContent: "Blocking the sender is not needed for this email because it comes from a legitimate source and can be trusted. We can look into why this is not a scam.", reportHeader: "warning", reportContent: "Reporting as a scam is not needed for this email because it comes from a legitimate source and can be trusted. We can look into why this is not a scam.", deleteHeader: "warning", deleteContent: "Deleting is not needed for this email because it comes from a legitimate source and can be trusted. We can look into why this is not a scam." },
      { index: 4, sender: "NCCUstudent", subject: "Re: Hi-- Favor", date: formatDate(twoDaysAgo), from:"<joeBren@gmail.com>", content: "<p>How are you doing? Hope you and your family are safe and healthy? I was wondering if I can get a quick favor from you.</p><p>I am sorry for any inconvenience this will cost you, i am suposed to call you but my phone is bad. I got bad news this morning that I lost a childhood friend to the deadly COIVID-19. I want to support the struggling family with a small donation. So, I was going to ask if you could kindly help e send out a donation to them anytime you can today, I’ll refund as soon as I get back.</p><p>I want to donate $500. Can you help me get the donation sent directly to their Cash App account?</p><p>Thanks, God Bless you.</p><p>Joe Bren</p>", replyHeader: "warning", replyContent: "This email is indicative of an identity theft scam. Replying to the email is dangerous! The safe options would be to block sender, report scam, or delete the email. We can look into why this is a scam.", blockHeader: "good", blockContent: "Blocking this sender is correct because this email is indicative of an identity theft scam. You could also report or delete the email.", reportHeader: "good", reportContent: "Reporting this email is correct because this email is indicative of an identity theft scam. You could also block the sender or delete the email.", deleteHeader: "good", deleteContent: "Deleting this email is correct because this email is indicative of an identity theft scam. You could also block the sender or report it as a scam." },
      { index: 5, sender: "iPhone 14", subject: "Congrats!", date: formatDate(threeDaysAgo), from:"<4kbug82ob@hotmail.com>", content: "<img src='/images/iphone.png' alt='iphone email screenshot'>", replyHeader: "warning", replyContent: "This email is indicative of an identity theft scam. Replying to the email is dangerous! The safe options would be to block sender, report scam, or delete the email. We can look into why this is a scam.", blockHeader: "good", blockContent: "Blocking this sender is correct because this email is indicative of an identity theft scam. You could also report or delete the email.", reportHeader: "good", reportContent: "Reporting this email is correct because this email is indicative of an identity theft scam. You could also block the sender or delete the email.", deleteHeader: "good", deleteContent: "Deleting this email is correct because this email is indicative of an identity theft scam. You could also block the sender or report it as a scam." },
      { index: 6, sender: "Amazon", subject: "Password Assistance", date: formatDate(fourDaysAgo), from:"<account-update@amazon.com>", content: "<img src='/images/amazon.png' alt='amazon email screenshot'>", replyHeader: "good", replyContent: "Replying is okay because this email is legitimate and can be trusted. We can look into why this is not a scam.", blockHeader: "warning", blockContent: "Blocking the sender is not needed for this email because it comes from a legitimate source and can be trusted. We can look into why this is not a scam.", reportHeader: "warning", reportContent: "Reporting as a scam is not needed for this email because it comes from a legitimate source and can be trusted. We can look into why this is not a scam.", deleteHeader: "warning", deleteContent: "Deleting is not needed for this email because it comes from a legitimate source and can be trusted. We can look into why this is not a scam." },
    ];  

    res.render(req.params.modId + '/explore/' + req.params.modId + '_explore3', {
        title: 'Explore',
        emails
    });
});

app.get('/explore4/:modId', passportConfig.isAuthenticated, setHttpResponseHeaders, isValidModId, function(req, res) {
    res.render(req.params.modId + '/explore/' + req.params.modId + '_explore4', {
        title: 'Explore'
    });
});

app.get('/explore5/:modId', passportConfig.isAuthenticated, setHttpResponseHeaders, isValidModId, function(req, res) {
    res.render(req.params.modId + '/explore/' + req.params.modId + '_explore5', {
        title: 'Explore'
    });
});

// Render evaluate (all modules) ******************************
app.get('/evaluate/:modId', passportConfig.isAuthenticated, setHttpResponseHeaders, isValidModId, async function(req, res) {
    let quizData;
    let currentSection = "evaluate"
    let backLink = "/explore4/identity"
    let nextLink = "/evaluate2/identity"
    const data = await fs.readFileAsync(`${__dirname}/public2/json/` +  req.params.modId + `/evaluate.json`);
    quizData = JSON.parse(data.toString());

    const currentTime = getCurrentTime();
    const currentDate = getCurrentDate();
    const futureDate = getFutureDate();

    req.params.modId 
    res.render('dart-quiz-template.pug', {
        title: 'Evaluate',
        quizData,
        currentSection,
        backLink,
        nextLink,
        currentTime,
        currentDate,
        futureDate
    });
});

app.get('/evaluate/:modId', passportConfig.isAuthenticated, setHttpResponseHeaders, isValidModId, function(req, res) {
    res.render(req.params.modId + '/evaluate/' + req.params.modId + '_evaluate', {
        title: 'Evaluate'
    });
});

app.get('/evaluate2/:modId', passportConfig.isAuthenticated, setHttpResponseHeaders, isValidModId, function(req, res) {
    res.render(req.params.modId + '/evaluate/' + req.params.modId + '_evaluate2', {
        title: 'Evaluate'
    });
});

app.get('/submod2/learn14/:modId', passportConfig.isAuthenticated, setHttpResponseHeaders, isValidModId, async function(req, res) {
    let quizData;
    let currentSection = "submodTwo"
    let backLink = "/challenge4/identity"
    let nextLink = "/submod2/learn15/identity"
    const data = await fs.readFileAsync(`${__dirname}/public2/json/` +  req.params.modId + `/submodTwo.json`);
    quizData = JSON.parse(data.toString());

    const currentTime = getCurrentTime();
    const currentDate = getCurrentDate();
    const futureDate = getFutureDate();

    req.params.modId 
    res.render(req.params.modId + '/evaluate/' + req.params.modId + '_evaluate', {
    title: 'Evaluate',
        quizData,
        currentSection,
        backLink,
        nextLink,
        currentTime,
        currentDate,
        futureDate
    });
});

// Render reflect (all modules) ******************************
app.get('/reflect/:modId', passportConfig.isAuthenticated, setHttpResponseHeaders, isValidModId, function(req, res) {
    res.render(req.params.modId + '/reflect/' + req.params.modId + '_reflect', {
        title: 'Reflect'
    });
});

// app.get('/learn11/:modId', passportConfig.isAuthenticated, setHttpResponseHeaders, isValidModId, function(req, res) {
//     res.render(req.params.modId + '/learn/' + req.params.modId + '_learn11', {
//         title: 'Learn'
//     });
// });

// app.get('/learn12/:modId', passportConfig.isAuthenticated, setHttpResponseHeaders, isValidModId, function(req, res) {
//     res.render(req.params.modId + '/learn/' + req.params.modId + '_learn12', {
//         title: 'Learn'
//     });
// });

// app.get('/learn13/:modId', passportConfig.isAuthenticated, setHttpResponseHeaders, isValidModId, function(req, res) {
//     res.render(req.params.modId + '/learn/' + req.params.modId + '_learn13', {
//         title: 'Learn'
//     });
// });

// app.get('/learn14/:modId', passportConfig.isAuthenticated, setHttpResponseHeaders, isValidModId, function(req, res) {
//     res.render(req.params.modId + '/learn/' + req.params.modId + '_learn14', {
//         title: 'Learn'
//     });
// });

// app.get('/learn15/:modId', passportConfig.isAuthenticated, setHttpResponseHeaders, isValidModId, function(req, res) {
//     res.render(req.params.modId + '/learn/' + req.params.modId + '_learn15', {
//         title: 'Learn'
//     });
// });

// app.get('/learn16/:modId', passportConfig.isAuthenticated, setHttpResponseHeaders, isValidModId, function(req, res) {
//     res.render(req.params.modId + '/learn/' + req.params.modId + '_learn16', {
//         title: 'Learn'
//     });
// });

// app.get('/learn17/:modId', passportConfig.isAuthenticated, setHttpResponseHeaders, isValidModId, function(req, res) {
//     res.render(req.params.modId + '/learn/' + req.params.modId + '_learn17', {
//         title: 'Learn'
//     });
// });

// app.get('/learn18/:modId', passportConfig.isAuthenticated, setHttpResponseHeaders, isValidModId, function(req, res) {
//     res.render(req.params.modId + '/learn/' + req.params.modId + '_learn18', {
//         title: 'Learn'
//     });
// });

// app.get('/learn19/:modId', passportConfig.isAuthenticated, setHttpResponseHeaders, isValidModId, function(req, res) {
//     res.render(req.params.modId + '/learn/' + req.params.modId + '_learn19', {
//         title: 'Learn'
//     });
// });

// app.get('/learn20/:modId', passportConfig.isAuthenticated, setHttpResponseHeaders, isValidModId, function(req, res) {
//     res.render(req.params.modId + '/learn/' + req.params.modId + '_learn20', {
//         title: 'Learn'
//     });
// });





// Render facilitator login page (all modules)
app.get('/facilitatorHome', passportConfig.isAuthenticated, setHttpResponseHeaders, function(req, res) {
    res.render('facilitatorHome.pug', {
        title: 'Facilitator Home'
    });
});

// Render student login page (all modules)
app.get('/studentLogin', setHttpResponseHeaders, function(req, res) {
    res.render('studentLogin.pug', {
        title: 'Student Login'
    });
});

app.get('/studentLogin_error', setHttpResponseHeaders, function(req, res) {
    res.render('studentLogin_error.pug', {
        title: 'Student Login'
    });
});

// Render create student page (all modules)
app.get('/createStudent', setHttpResponseHeaders, function(req, res) {
    res.render('createStudent.pug', {
        title: 'Create Student'
    });
});

app.get('/createStudent_error', setHttpResponseHeaders, function(req, res) {
    res.render('createStudent_error.pug', {
        title: 'Create Student'
    });
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

// Render terms and conditions page.
app.get('/terms', setHttpResponseHeaders, function(req, res) {
    res.render('terms', {
        title: 'Terms'
    });
});


// Render the reflection page (all modules).
app.get('/results/:modId', passportConfig.isAuthenticated, setHttpResponseHeaders, isValidModId, async function(req, res) {
    let reflectionData;
    const data = await fs.readFileAsync(`${__dirname}/public2/json/reflectionSectionData.json`)
    reflectionData = JSON.parse(data.toString());

    res.render(req.params.modId + '/' + req.params.modId + '_results', {
        title: 'Reflection',
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


// Render start page (all modules)
app.get('/start/:modId', passportConfig.isAuthenticated, setHttpResponseHeaders, isValidModId, function(req, res) {
    if (req.params.modId === "delete") { // anticipating a specific user behavior that causes 500 errors
        res.redirect('/');
    } else {
        res.render(req.params.modId + '/' + req.params.modId + '_start', {
            title: 'Learn'
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
    res.render(req.params.modId + '/' + req.params.modId + '_tutorial', {
        title: 'Tutorial'
    });
});

// Render explore page
app.get('/Saeed_Ahmed/:modId', passportConfig.isAuthenticated, setHttpResponseHeaders, isValidModId, function(req, res) {
    res.render(req.params.modId + '/' + req.params.modId + '_Saeed_Ahmed', {
        title: 'Explore'
    });
});

app.get('/AmyG/:modId', passportConfig.isAuthenticated, setHttpResponseHeaders, isValidModId, function(req, res) {
    res.render(req.params.modId + '/' + req.params.modId + '_AmyG', {
        title: 'Explore'
    });
});

app.get('/BlueLiveMatter1/:modId', passportConfig.isAuthenticated, setHttpResponseHeaders, isValidModId, function(req, res) {
    res.render(req.params.modId + '/' + req.params.modId + '_BlueLiveMatter1', {
        title: 'Explore'
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

app.post('/chatbot', check, setHttpResponseHeaders, userController.postChatbotConnect);

// app.get('/moduleprogress/:modId', check, setHttpResponseHeaders, userController.getModuleProgress);

app.post('/postModuleProgress', check, setHttpResponseHeaders, userController.postModuleProgress);

app.post('/postQuizScore', check, setHttpResponseHeaders, userController.postQuizScore);

app.post('/postIdentityTheftPreQuizScore', check, setHttpResponseHeaders, userController.postIdentityTheftPreQuizScore);

app.post('/postIdentityTheftModOneQuizScore', check, setHttpResponseHeaders, userController.postIdentityTheftModOneQuizScore);

app.post('/postIdentityTheftModTwoQuizScore', check, setHttpResponseHeaders, userController.postIdentityTheftModTwoQuizScore);

app.post('/postIdentityTheftModThreeQuizScore', check, setHttpResponseHeaders, userController.postIdentityTheftModThreeQuizScore);

app.post('/postIdentityTheftModOneConfidenceRating', check, setHttpResponseHeaders, userController.postIdentityTheftModOneConfidenceRating);

app.post('/postIdentityTheftModTwoConfidenceRating', check, setHttpResponseHeaders, userController.postIdentityTheftModTwoConfidenceRating);

app.post('/postIdentityTheftModThreeConfidenceRating', check, setHttpResponseHeaders, userController.postIdentityTheftModThreeConfidenceRating);

app.post('/postIdentityTheftPostQuizScore', check, setHttpResponseHeaders, userController.postIdentityTheftPostQuizScore);

/**nodemailer */
const nodemailer = require("nodemailer");
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user:"DartLehigh@gmail.com",
    pass: "cmtkjdyfebzhddbw"
  }
});

/**end of nodemailer */
/*
 * Logins (only used on research site)
 */
if (isResearchVersion) {
    app.post('/forgotPassword', check, setHttpResponseHeaders, function(req, res) {
        const new_token = generateUUID()
        transporter.sendMail({
            from: 'DartLehigh@gmail.com',
            to: req.body.username,
            subject: "hello here is the link for resetting password",
            text: "please enter the following link to reset your password: https://dart.socialsandbox.xyz/temporary-link/"+new_token,
          });
          allowedUUIDs[req.body.username] = new_token;
          console.log(allowedUUIDs)
          
          
          return res.redirect('/studentLogin');
    });
    app.post('/changePassword', check, setHttpResponseHeaders, function(req, res) {
        console.log("password changing")
        req.assert('password', 'Password cannot be blank').notEmpty();
        console.log(req.body.password)
        console.log(req.body.username)
        User.findOne({ username: req.body.username }, (err, user) => {
            user.password = req.body.password;
            
            user.save((err) => {
                if (err) {
                    return next(err);
                }
                console.log("password changed")
            });
            return res.redirect('/login');
        })
    });

            /**
                req.logIn(user, (err) => {
                    if (err) {
                        return next(err);
                    }
                    var temp = req.session.passport; // {user: 1}
                    req.session.regenerate(function(err) {
                        //req.session.passport is now undefined
                        req.session.passport = temp;
                        req.session.save(function(err) {
                            return res.redirect('/selection');
                        });
                    });
    
                });
             */
    app.get('/login', setHttpResponseHeaders, userController.getLogin);
    app.get('/classLogin/:accessCode', setHttpResponseHeaders, userController.getClassLogin);
    app.post('/instructorLogin', check, setHttpResponseHeaders, userController.postInstructorLogin);
    app.post('/facilitatorLogin', check, setHttpResponseHeaders, userController.postFacilitatorLogin);
    app.post('/studentLogin', check, setHttpResponseHeaders, userController.postStudentLogin);
    app.post('/guestLogin', check, setHttpResponseHeaders, userController.postGuestLogin);
    app.post('/createStudent', check, setHttpResponseHeaders, userController.postCreateStudent);
    // app.post('/studentLogin/:accessCode', check, setHttpResponseHeaders, userController.postStudentLogin);
    app.get('/logout', setHttpResponseHeaders, userController.logout);
    app.get('/getGuest', setHttpResponseHeaders, userController.getGuest);

}

/*
 * Key functionalities
 */
// Post a new user-created post
app.post('/post/new', check, setHttpResponseHeaders, scriptController.newPost);
// Post information about a user action on a post in a freeplay feed section
app.post('/feed', passportConfig.isAuthenticated, check, setHttpResponseHeaders, scriptController.postUpdateFeedAction);
// Delete all recorded feed actions for the current user - currently not used
app.post('/deleteUserFeedActions', passportConfig.isAuthenticated, setHttpResponseHeaders, scriptController.postDeleteFeedAction);
// Post information about a user's reflection answers in the reflection section 
app.post('/reflection', passportConfig.isAuthenticated, check, setHttpResponseHeaders, scriptController.postReflectionAction);
// Post information about a user's quiz answers in the quiz section
app.post('/quiz', passportConfig.isAuthenticated, check, setHttpResponseHeaders, scriptController.postQuizAction);
app.post('/postViewQuizExplanations', passportConfig.isAuthenticated, check, setHttpResponseHeaders, scriptController.postViewQuizExplanations);
// Record user's topic selection for modules with customized freeplay content
app.post('/interest', passportConfig.isAuthenticated, check, setHttpResponseHeaders, userController.postUpdateInterestSelection);
app.post('/advancedlitInterest', passportConfig.isAuthenticated, check, setHttpResponseHeaders, userController.postAdvancedlitInterestSelection);
// Routes to get topic selections for modules with customized freeplay content
app.get('/esteemTopic', passportConfig.isAuthenticated, setHttpResponseHeaders, userController.getEsteemTopic);
app.get('/advancedlitTopic', passportConfig.isAuthenticated, setHttpResponseHeaders, userController.getAdvancedlitTopic);
// This was for load testing - not sure if it should be deleted
app.get('/testing/:modId', isValidModId, scriptController.getScriptFeed);
// Update user profile information
app.post('/account/profile', passportConfig.isAuthenticated, useravatarupload.single('picinput'), check, setHttpResponseHeaders, userController.postUpdateProfile);
app.post('/account/profile/:modId', passportConfig.isAuthenticated, useravatarupload.single('picinput'), check, setHttpResponseHeaders, userController.postUpdateProfile);



/*
 * Recording various user activities if data collection is enabled
 */
if (enableDataCollection) {
    app.post('/pageLog', passportConfig.isAuthenticated, check, setHttpResponseHeaders, userController.postPageLog);
    app.post('/startPageAction', passportConfig.isAuthenticated, check, setHttpResponseHeaders, scriptController.postStartPageAction);
    app.post('/introjsStep', passportConfig.isAuthenticated, check, setHttpResponseHeaders, scriptController.postIntrojsStepAction);
    app.post('/bluedot', passportConfig.isAuthenticated, check, setHttpResponseHeaders, scriptController.postBlueDotAction);
    app.post('/moduleProgress', passportConfig.isAuthenticated, check, setHttpResponseHeaders, userController.postUpdateModuleProgress);
    app.post('/accountsAction', passportConfig.isAuthenticated, check, setHttpResponseHeaders, scriptController.postUpdateUniqueFeedAction);
    app.post('/habitsAction', passportConfig.isAuthenticated, check, setHttpResponseHeaders, scriptController.postUpdateUniqueFeedAction);
    app.post('/privacyAction', passportConfig.isAuthenticated, check, setHttpResponseHeaders, scriptController.postUpdateUniqueFeedAction);
    app.post('/chatAction', passportConfig.isAuthenticated, check, setHttpResponseHeaders, scriptController.postUpdateChatAction);
    app.post('/voiceoverTimer', passportConfig.isAuthenticated, check, setHttpResponseHeaders, userController.postUpdateVoiceoverTimer);
}

/*
 * Recording specific user activities if the user selects to share their activity data
 */
if (enableShareActivityData) {
    app.post('/postActivityData', passportConfig.isAuthenticated, check, setHttpResponseHeaders, activityController.postActivityData);
    app.post('/postDeleteActivityData', passportConfig.isAuthenticated, check, setHttpResponseHeaders, activityController.postDeleteActivityData);
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
    app.post('/downloadReflectionResponses/:classId/:modName', passportConfig.isAuthenticated, check, setHttpResponseHeaders, classController.postClassReflectionResponsesCsv);
    app.post('/postClassTimeReportCsv/:classId/:modName', passportConfig.isAuthenticated, check, setHttpResponseHeaders, classController.postClassTimeReportCsv);
    app.post('/createNewClass', passportConfig.isAuthenticated, check, setHttpResponseHeaders, classController.postCreateClass);
    app.post('/deleteClass', passportConfig.isAuthenticated, check, setHttpResponseHeaders, classController.postDeleteClass);
    app.post('/removeStudentFromClass', passportConfig.isAuthenticated, check, setHttpResponseHeaders, classController.removeStudentFromClass);
    app.post('/generateStudentAccounts', passportConfig.isAuthenticated, check, setHttpResponseHeaders, classController.generateStudentAccounts);
    app.post('/updateName', passportConfig.isAuthenticated, check, setHttpResponseHeaders, userController.postName);

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
    app.post('/postUpdateNewBadge', passportConfig.isAuthenticated, check, setHttpResponseHeaders, userController.postUpdateNewBadge);

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
//   ();
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
    // console.log('%s App is running at http://localhost:%d in %s mode', chalk.green('✓'), app.get('port'), app.get('env'));
    console.log('  Press CTRL-C to stop\n');
});

module.exports = app;
