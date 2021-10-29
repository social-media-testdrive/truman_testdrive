/**
 * Module dependencies.
 */
const express = require('express');
const _ = require('lodash');
const compression = require('compression');
const session = require('express-session');
const bodyParser = require('body-parser');
const logger = require('morgan');
const chalk = require('chalk');
const errorHandler = require('errorhandler');
const lusca = require('lusca');
const dotenv = require('dotenv');
const MongoStore = require('connect-mongo')(session);
const flash = require('express-flash');
const path = require('path');
const mongoose = require('mongoose');
const passport = require('passport');
const expressValidator = require('express-validator');
const expressStatusMonitor = require('express-status-monitor');
var schedule = require('node-schedule');
const aws = require('aws-sdk');
//multer is how we send files (like images) thru web forms
const multer = require('multer');
const csrf = require('csurf')

/**
 * Load environment variables from .env file, where API keys and passwords are configured.
 */
dotenv.config({ path: '.env' });

/*
aws.config.update({
  secretAccessKey: process.env.AWS_SECRET,
  accessKeyId: process.env.AWS_ACCESS,
  region: "us-east-2"
});
*/

//multer options for basic files
var m_options = multer.diskStorage({ destination : path.join(__dirname, 'uploads') ,
  filename: function (req, file, cb) {
    var prefix = req.user.id + Math.random().toString(36).slice(2, 10);
    cb(null, prefix + file.originalname.replace(/[^A-Z0-9]+/ig, "_"));
  }
});

//multer options for uploading a post (user created post)
var userpost_options = multer.diskStorage({ destination : path.join(__dirname, 'uploads/user_post') ,
  filename: function (req, file, cb) {
    var lastsix = req.user.id.substr(req.user.id.length - 6);
    var prefix = lastsix + Math.random().toString(36).slice(2, 10);
    cb(null, prefix + file.originalname.replace(/[^A-Z0-9]+/ig, "_"));
  }
});

//multer options for uploading a user profile image
var useravatar_options = multer.diskStorage({ destination : path.join(__dirname, 'uploads/user_post') ,
  filename: function (req, file, cb) {
    var prefix = req.user.id + Math.random().toString(36).slice(2, 10);
    cb(null, prefix + file.originalname.replace(/[^A-Z0-9]+/ig, "_"));
  }
});

//const upload = multer({ dest: path.join(__dirname, 'uploads') });
const upload= multer({ storage: m_options });
const userpostupload= multer({ storage: userpost_options });
const useravatarupload= multer({ storage: useravatar_options });


/**
 * Controllers (route handlers).
 */
const actorsController = require('./controllers/actors');
const scriptController = require('./controllers/script');
const classController = require('./controllers/class');
const userController = require('./controllers/user');
const notificationController = require('./controllers/notification');

/**
 * API keys and Passport configuration.
 */
const passportConfig = require('./config/passport');

// set up route middleware
var csrfProtection = csrf();

/**
 * Create Express server.
 */
const app = express();

/**
 * Connect to MongoDB.

mongoose.Promise = global.Promise;

//mongoose.connect(process.env.MONGODB_URI || process.env.MONGOLAB_URI);
mongoose.connect(process.env.PRO_MONGODB_URI || process.env.PRO_MONGOLAB_URI, { useNewUrlParser: true });
mongoose.connection.on('error', (err) => {
  console.error(err);
  console.log('%s MongoDB connection error. Please make sure MongoDB is running.', chalk.red('✗'));
  process.exit();
});

/**
 * Connect to MongoDB.
 */
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useNewUrlParser', true);
mongoose.connect(process.env.MONGODB_URI || process.env.MONGOLAB_URI);
mongoose.connection.on('error', (err) => {
  console.error(err);
  //console.log('%s MongoDB connection error. Please make sure MongoDB is running.', chalk.red('✗'));
  process.exit();
});


/**
 * Express configuration.
 */
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
//app.use(expressStatusMonitor());
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
//defines our session
app.use(session({
  resave: true,
  saveUninitialized: true,
  rolling: false,
  cookie: {
    path: '/',
    httpOnly: true,
    secure: false,
    maxAge: 1209600000
  },
  secret: process.env.SESSION_SECRET,
  store: new MongoStore({
    url: process.env.MONGODB_URI || process.env.MONGOLAB_URI,
    autoReconnect: true,
    clear_interval: 3600
  })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());


//this allows us to no check CSRF when uploading an image. Its a weird issue that
//multer and lusca no not play well together
app.use((req, res, next) => {
  if ((req.path === '/api/upload') || (req.path === '/post/new') || (req.path === '/account/profile') || (req.path === '/account/signup_info_post')|| (req.path === '/classes')) {
    //console.log("Not checking CSRF - out path now");
    //console.log("@@@@@request is " + req);
    //console.log("@@@@@file is " + req.file);
    //console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
    next();
  } else {
    //lusca.csrf()(req, res, next);
    next();
  }
});

//secruity settings in our http header
app.use(lusca.xframe('SAMEORIGIN'));
app.use(lusca.xssProtection(true));


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

function addCsrf(req, res, next) {
  res.locals.csrfToken = req.csrfToken();
  next();
}


//All of our static files that express willl automatically server for us
//in production, we have nginx server this instead to take the load off out Node app
app.use(express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }));
app.use(express.static(path.join(__dirname, 'public2'), { maxAge: 31557600000 }));
app.use('/semantic',express.static(path.join(__dirname, 'semantic'), { maxAge: 31557600000 }));
app.use(express.static(path.join(__dirname, 'uploads'), { maxAge: 31557600000 }));
app.use('/post_pictures',express.static(path.join(__dirname, 'post_pictures'), { maxAge: 31557600000 }));
app.use('/profile_pictures',express.static(path.join(__dirname, 'profile_pictures'), { maxAge: 31557600000 }));

/**
 * Primary app routes.
 */

// create Guest account
 app.get('/guest/:modId', userController.getGuest);

//main route is the lesson mod selection screen
app.get('/', function (req, res) {
  res.render('mods-esp', {
    title: 'Escoge una lección'
  });
})

// // Spanish lesson mod selection screen
// app.get('/esp', function (req, res) {
//   res.render('mods-esp', {
//     title: 'Escoge una lección'
//   });
// })

// app.get('/results/cyberbullying', passportConfig.isAuthenticated, scriptController.getCyberbullyingResults);

//main route for getting the simulation (Free Play) for a given lesson mod
app.get('/modual/:modId', passportConfig.isAuthenticated, csrfProtection, addCsrf, scriptController.getScript);

app.get('/esteemTopic', passportConfig.isAuthenticated, userController.getEsteemTopic);
app.get('/advancedlitTopic', passportConfig.isAuthenticated, userController.getAdvancedlitTopic);

app.get('/habitsTimer', passportConfig.isAuthenticated, userController.getHabitsTimer);
app.get('/habitsNotificationTimes', passportConfig.isAuthenticated, scriptController.getNotificationTimes);

//THIS IS FOR LOAD TESTING
app.get('/testing/:modId', scriptController.getScriptFeed);

//post a new user created post s3_upload
//app.post('/post/new', userpostupload.single('picinput'), check, csrf, scriptController.newPost);
app.post('/post/new', check, csrfProtection, scriptController.newPost);

//app.post('/account/profile', passportConfig.isAuthenticated, useravatarupload.single('picinput'), check, csrf, userController.postUpdateProfile);
app.post('/account/profile', passportConfig.isAuthenticated, useravatarupload.single('picinput'), check, csrfProtection, userController.postUpdateProfile);

//app.post('/api/upload', upload.single('myFile'), apiController.postFileUpload);

//this is the TOS
app.get('/tos', function (req, res) {
  res.render('tos', {
    title: 'TOS'
  });
})

app.get('/finished',  passportConfig.isAuthenticated, function (req, res) {
  res.render('finished', {
    title: 'Post Exercise'
  });
})

app.get('/:sec/:modId/wait', passportConfig.isAuthenticated, scriptController.getWait);

app.get('/com', function (req, res) {
  res.render('com', {
    title: 'Community Rules'
  });
});

app.get('/privacy', function (req, res) {
  res.render('pp', {
    title: 'Privacy Policy'
  });
});

app.get('/info', passportConfig.isAuthenticated, function (req, res) {
  res.render('info', {
    title: 'User Docs'
  });
});

//test page
app.get('/test_comment', function (req, res) {
  res.render('test', {
    title: 'Test Comments'
  });
});

//test a simulation (tutorial or guided activity)
app.get('/test_sim', function (req, res) {
  res.render('test_sim', {
    title: 'Test Sim'
  });
});

app.get('/tutorial/:modId',passportConfig.isAuthenticated, csrfProtection, addCsrf, function (req, res) {
  res.render(req.param("modId") + '/' + req.param("modId")  +'_tutorial', {
    title: 'Tutorial'
  });
});

app.get('/tutorial2/:modId',passportConfig.isAuthenticated, csrfProtection, addCsrf, function (req, res) {
  res.render(req.param("modId") + '/' + req.param("modId")  +'_tutorial2', {
    title: 'Tutorial'
  });
});

app.get('/sim/:modId', passportConfig.isAuthenticated, csrfProtection, addCsrf, function (req, res) {
  res.render(req.param("modId") + '/' + req.param("modId")+'_sim', {
    title: 'Guided Activity'
  });
});

app.get('/sim1/:modId',passportConfig.isAuthenticated, csrfProtection, addCsrf, function (req, res) {
  res.render(req.param("modId") + '/' + req.param("modId")+'_sim1', {
    title: 'Guided Activity'
  });
});

app.get('/sim2/:modId', passportConfig.isAuthenticated, csrfProtection, addCsrf, function (req, res) {
  res.render(req.param("modId") + '/' + req.param("modId")+'_sim2', {
    title: 'Guided Activity'
  });
});

app.get('/sim3/:modId', passportConfig.isAuthenticated, csrfProtection, addCsrf, function (req, res) {
  res.render(req.param("modId") + '/' + req.param("modId")+'_sim3', {
    title: 'Guided Activity'
  });
});

app.get('/sim4/:modId', passportConfig.isAuthenticated, csrfProtection, addCsrf, function (req, res) {
  res.render(req.param("modId") + '/' + req.param("modId")+'_sim4', {
    title: 'Guided Activity'
  });
});

app.get('/trans/:modId', passportConfig.isAuthenticated, csrfProtection, addCsrf, function (req, res) {
  res.render(req.param("modId") + '/' + req.param("modId")+'_trans', {
    title: 'Recap'
  });
});

app.get('/trans2/:modId', passportConfig.isAuthenticated, csrfProtection, addCsrf, function (req, res) {
  res.render(req.param("modId") + '/' + req.param("modId")+'_trans2', {
    title: 'Recap'
  });
});

app.get('/trans_script/:modId', passportConfig.isAuthenticated, csrfProtection, addCsrf, function (req, res) {
  res.render(req.param("modId") + '/' + req.param("modId")+'_trans_script', {
    title: 'Recap'
  });
});

app.get('/free-play/privacy', passportConfig.isAuthenticated, csrfProtection, addCsrf, function (req, res) {
  res.render('privacy/privacy_free-play', {
    title: 'Free-Play'
  });
});

app.get('/free-play2/privacy', passportConfig.isAuthenticated, csrfProtection, addCsrf, function (req, res) {
  res.render('privacy/privacy_free-play2', {
    title: 'Free-Play 2'
  });
});

app.get('/free-play3/privacy', passportConfig.isAuthenticated, csrfProtection, addCsrf, function (req, res) {
  res.render('privacy/privacy_free-play3', {
    title: 'Free-Play 3'
  });
});

app.get('/free-play4/privacy', passportConfig.isAuthenticated, csrfProtection, addCsrf, function (req, res) {
  res.render('privacy/privacy_free-play4', {
    title: 'Free-Play 4'
  });
});

app.get('/free-settings/privacy', passportConfig.isAuthenticated, csrfProtection, addCsrf, function (req, res) {
  res.render('privacy/privacy_free-play_settings', {
    title: 'Free-Play Settings'
  });
});

app.get('/free-settings2/privacy', passportConfig.isAuthenticated, csrfProtection, addCsrf, function (req, res) {
  res.render('privacy/privacy_free-play_settings2', {
    title: 'Free-Play Settings 2'
  });
});

app.get('/free-settings3/privacy', passportConfig.isAuthenticated, csrfProtection, addCsrf, function (req, res) {
  res.render('privacy/privacy_free-play_settings3', {
    title: 'Free-Play Settings 3'
  });
});

app.get('/end/:modId', passportConfig.isAuthenticated, csrfProtection, addCsrf, function (req, res) {
  if((req.param("modId") === 'accounts') || (req.param("modId") === 'privacy')){
    res.render(req.param("modId") + '/' + req.param("modId")+'_end', {
      title: 'Finished'
    });
  } else if ((req.param("modId") === 'esteem-esp')) {
    res.render('base_end-esp.pug', {
      title: 'Finished'
    });
  }
  else {
    res.render('base_end.pug', {
      title: 'Finished'
    });
  }
});

app.get('/start/:modId', passportConfig.isAuthenticated, function (req, res) {
  if (req.param("modId") === "delete") {   // anticipating a specific user behavior that causes 500 errors
    res.redirect('/');
  } else {
    res.render(req.param("modId") + '/' + req.param("modId")+'_start', {
      title: 'Welcome'
    });
  }
});

app.get('/intro/:modId', passportConfig.isAuthenticated,function (req, res) {
  if (req.param("modId") === "delete") {   // anticipating a specific user behavior that causes 500 errors
    res.redirect('/');
  } else if ((req.param("modId") === 'esteem-esp')) {
    res.render('base_intro-esp.pug', {
      title: 'Finished'
    });
  } else {
    res.render('base_intro.pug', {
      title: 'Welcome'
    });
  }
});

app.get('/tut_guide/:modId', passportConfig.isAuthenticated, csrfProtection, addCsrf, function (req, res) {
  res.render(req.param("modId") + '/' + req.param("modId")+'_tut_guide', {
    title: 'Welcome'
  });
});

app.get('/results/:modId', passportConfig.isAuthenticated, function (req, res) {
  //console.log(req.param("modId") + '/' + req.param("modId")+'_results')
  res.render(req.param("modId") + '/' + req.param("modId")+'_results', {
    title: 'Reflection'
  });
});

//For privacy settings page that doesnt do anything
app.get('/settings/privacy', passportConfig.isAuthenticated, csrfProtection, addCsrf, function (req, res) {
  //console.log('privacy/privacy_settings')
  res.render('privacy/privacy_settings', {
    title: 'Privacy Settings'
  });
});

//The interest pages for the targeted ads Module
app.get('/food/targeted', passportConfig.isAuthenticated, function (req, res) {
  //console.log('privacy/privacy_settings')
  res.render('targeted/targeted_food', {
    title: 'Food Interest Page'
  });
});

app.get('/sports/targeted', passportConfig.isAuthenticated, function (req, res) {
  //console.log('privacy/privacy_settings')
  res.render('targeted/targeted_sports', {
    title: 'Sports Interest Page'
  });
});

app.get('/gaming/targeted', passportConfig.isAuthenticated, function (req, res) {
  //console.log('privacy/privacy_settings')
  res.render('targeted/targeted_gaming', {
    title: 'Gaming Interest Page'
  });
});


// Classes not used in TestDrive
app.get('/classes', passportConfig.isAuthenticated, classController.getClasses);
app.get('/class/:classId', passportConfig.isAuthenticated, classController.getClass);
app.post('/classes', passportConfig.isAuthenticated, classController.postCreateClass);

// User's Page (this IS used in TestDrive)
app.get('/me/:modId', passportConfig.isAuthenticated, userController.getMe);
// Notifications are not used in TestDrive
app.get('/notifications', passportConfig.isAuthenticated, notificationController.getNotifications);

// Account management not used in TestDrive
app.get('/login', userController.getLogin);
app.post('/login', userController.postLogin);
app.get('/logout', userController.logout);
//app.get('/forgot', userController.getForgot);
//app.post('/forgot', userController.postForgot);
//app.get('/reset/:token', userController.getReset);
//app.post('/reset/:token', userController.postReset);

// Account management not used in TestDrive
app.get('/signup', userController.getSignup);
app.post('/signup', userController.postSignup);

// Instructor accounts not used in TestDrive
app.get('/create_instructor', userController.getSignupInstructor);
app.post('/create_instructor', userController.postSignupInstructor);

// Account management not used in TestDrive
app.get('/create_username', userController.getSignupUsername);
app.post('/create_username', userController.postSignupUsername);

// Account management not used in TestDrive
app.get('/create_username_class/:classId', userController.getSignupUsername);
app.post('/create_username_class/:classId', userController.postSignupUsernameClass);

// Account management not used in TestDrive
app.get('/create_password', passportConfig.isAuthenticated, userController.getSignupPassword);
app.post('/create_password', passportConfig.isAuthenticated, userController.postSignupPassword);

// Account management not used in TestDrive
app.get('/create_name', passportConfig.isAuthenticated, userController.getSignupName);
app.post('/create_name', passportConfig.isAuthenticated, userController.postSignupName);

// Account management not used in TestDrive
app.get('/create_bio', passportConfig.isAuthenticated, userController.getSignupBio);
app.post('/create_bio', passportConfig.isAuthenticated, userController.postSignupBio);

// Review not used in TestDrive
app.get('/review/signup', passportConfig.isAuthenticated, userController.getSignupReview);

//////////////////////////

// This is not used in TestDrive, but is accessible through the URL.
app.get('/account/signup_info', passportConfig.isAuthenticated, csrfProtection, addCsrf, userController.getSignupInfo);
//app.post('/account/signup_info_post', passportConfig.isAuthenticated, useravatarupload.single('picinput'), check, csrf, userController.postSignupInfo);
app.post('/account/signup_info_post', passportConfig.isAuthenticated, useravatarupload.single('picinput'), check, csrfProtection, userController.postSignupInfo);

//app.post('/account/profile/:modId', passportConfig.isAuthenticated, useravatarupload.single('picinput'), check, csrf, userController.postUpdateProfile);

// Profile customization
app.post('/account/profile/:modId', passportConfig.isAuthenticated, useravatarupload.single('picinput'), check, csrfProtection, userController.postUpdateProfile);
app.get('/account/:modId', passportConfig.isAuthenticated, csrfProtection, addCsrf, userController.getAccount);

// Bot profile pages
app.get('/user/:userId', passportConfig.isAuthenticated, csrfProtection, addCsrf, actorsController.getActor);
app.post('/user', passportConfig.isAuthenticated, check, csrfProtection, actorsController.postBlockOrReport);

// Notifications not used in TestDrive
app.get('/bell', passportConfig.isAuthenticated, userController.checkBell);

//getScript
//app.get('/feed', passportConfig.isAuthenticated, scriptController.getScript);

// Posting actions on posts within the free-play timeline
app.post('/feed', passportConfig.isAuthenticated, check, csrfProtection, scriptController.postUpdateFeedAction);
// This is not used in TestDrive
app.post('/deleteUserFeedActions', passportConfig.isAuthenticated, scriptController.postDeleteFeedAction);
// Updating interest selections in various modules
app.post('/interest', passportConfig.isAuthenticated, check, csrfProtection, userController.postUpdateInterestSelection);
app.post('/esteemInterest', passportConfig.isAuthenticated, check, csrfProtection, userController.postEsteemInterestSelection);
app.post('/habitsTimer', passportConfig.isAuthenticated, check, csrfProtection, userController.postUpdateHabitsTimer);
//postDeleteAccount
app.post('/delete', passportConfig.isAuthenticated, check, csrfProtection, userController.getDeleteAccount);
//app.get('/delete', passportConfig.isAuthenticated, check, csrfProtection, userController.getDeleteAccount);
/**
 * Error Handler.
 */
app.use(errorHandler());

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

/**
 * Start Express server.
 */
app.listen(app.get('port'), () => {
  //console.log('%s App is running at http://localhost:%d in %s mode', chalk.green('✓'), app.get('port'), app.get('env')); 
  //console.log('  Press CTRL-C to stop\n');
});

module.exports = app;
