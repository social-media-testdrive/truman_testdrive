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
const sass = require('node-sass-middleware');
var schedule = require('node-schedule');

//multer is how we send files (like images) thru web forms
const multer = require('multer');
//Math.random().toString(36)+'00000000000000000').slice(2, 10) + Date.now()

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
 * Load environment variables from .env file, where API keys and passwords are configured.
 */
dotenv.load({ path: '.env' });

/**
 * Controllers (route handlers).
 */
const actorsController = require('./controllers/actors');
const scriptController = require('./controllers/script');
const classController = require('./controllers/class');
const homeController = require('./controllers/home');
const userController = require('./controllers/user');
const notificationController = require('./controllers/notification');
const apiController = require('./controllers/api');
const contactController = require('./controllers/contact');

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
mongoose.connect(process.env.PRO_MONGODB_URI || process.env.PRO_MONGOLAB_URI);
mongoose.connection.on('error', (err) => {
  console.error(err);
  console.log('%s MongoDB connection error. Please make sure MongoDB is running.', chalk.red('✗'));
  process.exit();
});


/**
 * Express configuration.
 */
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(expressStatusMonitor());
//We do compression on our production server using nginx as a reverse proxy
//app.use(compression());
app.use(sass({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public')
}));
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
    maxAge: 7200000
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
app.use((req, res, next) => {
  if ((req.path === '/api/upload') || (req.path === '/post/new') || (req.path === '/account/profile') || (req.path === '/account/signup_info_post')|| (req.path === '/classes')) {
    console.log("Not checking CSRF - out path now");
    //console.log("@@@@@request is " + req);
    next();
  } else {
    lusca.csrf()(req, res, next);
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

var csrf = lusca({ csrf: true });

//helper function just to see what is in the body
function check(req, res, next) {
    console.log("@@@@@@@@@@@@Body is now ");
    console.log(req.body);
    next();
}


//All of our static files that express willl automatically server for us
//in production, we have nginx server this instead to take the load off out Node app
app.use(express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }));
app.use('/semantic',express.static(path.join(__dirname, 'semantic'), { maxAge: 31557600000 }));
app.use(express.static(path.join(__dirname, 'uploads'), { maxAge: 31557600000 }));
app.use(express.static(path.join(__dirname, 'post_pictures'), { maxAge: 31557600000 }));
app.use('/profile_pictures',express.static(path.join(__dirname, 'profile_pictures'), { maxAge: 31557600000 }));

/**
 * Primary app routes.
 */

//main route is the lesson mod selection screen
app.get('/', passportConfig.isAuthenticated, function (req, res) {
  res.render('mods', {
    title: 'Pick a Lesson'
  });
})

// app.get('/results/cyberbullying', passportConfig.isAuthenticated, scriptController.getCyberbullyingResults);

//main route for getting the simulation (Free Play) for a given lesson mod
app.get('/modual/:modId', passportConfig.isAuthenticated, scriptController.getScript);

//post a new user created post
app.post('/post/new', userpostupload.single('picinput'), check, csrf, scriptController.newPost);

app.post('/account/profile', passportConfig.isAuthenticated, useravatarupload.single('picinput'), check, csrf, userController.postUpdateProfile);
//app.post('/api/upload', upload.single('myFile'), apiController.postFileUpload);

//this is the TOS  
app.get('/tos', function (req, res) {
  res.render('tos', {
    title: 'TOS'
  });
})

//presentation Pre Quiz
app.get('/prequiz/presentation',  passportConfig.isAuthenticated, function (req, res) {
  res.render('prequiz_pres', {
    title: 'Pre Quiz'
  });
})
app.post('/prequiz/presentation', passportConfig.isAuthenticated, scriptController.postPreQuiz_Prez);

//cyberbullying Pre Quiz
app.get('/prequiz/cyberbullying',  passportConfig.isAuthenticated, function (req, res) {
  res.render('cyberbullying/cyberbullying-pre-quiz', {
    title: 'Pre Quiz'
  });
})
app.post('/prequiz/cyberbullying', passportConfig.isAuthenticated, scriptController.postPreQuiz_Cyber);

//digital_literacy Pre Quiz
app.get('/prequiz/digital-literacy',  passportConfig.isAuthenticated, function (req, res) {
  res.render('digitalLit-pre-quiz', {
    title: 'Pre Quiz'
  });
})
app.post('/prequiz/digital-literacy', passportConfig.isAuthenticated, scriptController.postPreQuiz_Lit);

//likes Pre Quiz
app.get('/prequiz/likes',  passportConfig.isAuthenticated, function (req, res) {
  res.render('likes-pre-quiz', {
    title: 'Pre Quiz'
  });
})
app.post('/prequiz/likes', passportConfig.isAuthenticated, scriptController.postPreQuiz_Likes);

//Image Pre Quiz
app.get('/prequiz/image',  passportConfig.isAuthenticated, function (req, res) {
  res.render('images-pre', {
    title: 'Pre Quiz'
  });
})
app.post('/prequiz/image', passportConfig.isAuthenticated, scriptController.postPreQuiz_Image);


//Post Presentation
app.get('/postquiz/presentation',  passportConfig.isAuthenticated, function (req, res) {
  res.render('postquiz_pres', {
    title: 'Post Quiz'
  });
})
app.post('/postquiz/presentation', passportConfig.isAuthenticated, scriptController.postPostQuiz_Prez);

//Post Cyberbully
app.get('/postquiz/cyberbullying',  passportConfig.isAuthenticated, function (req, res) {
  res.render('cyberbullying/cyberbullying-post-quiz', {
    title: 'Post Quiz'
  });
})
app.post('/postquiz/cyberbullying', passportConfig.isAuthenticated, scriptController.postPostQuiz_Cyber);

//Post digital_literacy
app.get('/postquiz/digital-literacy',  passportConfig.isAuthenticated, function (req, res) {
  res.render('digitalLit-post-quiz', {
    title: 'Post Quiz'
  });
})
app.post('/postquiz/digital-literacy', passportConfig.isAuthenticated, scriptController.postPostQuiz_Lit);

//Post likes
app.get('/postquiz/likes',  passportConfig.isAuthenticated, function (req, res) {
  res.render('likes-post-quiz', {
    title: 'Post Quiz'
  });
})

//Post quiz Image
app.get('/postquiz/image',  passportConfig.isAuthenticated, function (req, res) {
  res.render('images-post', {
    title: 'Post Quiz'
  });
})
app.post('/postquiz/image', passportConfig.isAuthenticated, scriptController.postPostQuiz_Image);

app.get('/finished',  passportConfig.isAuthenticated, function (req, res) {
  res.render('finished', {
    title: 'Post Exercise'
  });
})

// app.get('/results/:modId', passportConfig.isAuthenticated, scriptController.getResults);
app.get('/postquiz/:modId/results', passportConfig.isAuthenticated, scriptController.getQuizResults);

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

app.get('/tutorial/:modId', function (req, res) {
  res.render(req.param("modId") + '/' + req.param("modId")  +'_tutorial', {
    title: 'Cyberbullying Tutorial'
  });
});

app.get('/sim/:modId', function (req, res) {
  res.render(req.param("modId") + '/' + req.param("modId")+'_sim', {
    title: 'Cyberbullying Guided Activity'
  });
});

app.get('/trans/:modId', function (req, res) {
  res.render(req.param("modId") + '/' + req.param("modId")+'_trans', {
    title: 'Recap'
  });
});

app.get('/trans_script/:modId', function (req, res) {
  res.render(req.param("modId") + '/' + req.param("modId")+'_trans_script', {
    title: 'Recap'
  });
});

app.get('/end/:modId', function (req, res) {
  res.render(req.param("modId") + '/' + req.param("modId")+'_end', {
    title: 'Finished'
  });
});

app.get('/start/:modId', function (req, res) {
  res.render(req.param("modId") + '/' + req.param("modId")+'_start', {
    title: 'Welcome'
  });
});

app.get('/intro/:modId', function (req, res) {
  res.render(req.param("modId") + '/' + req.param("modId")+'_intro', {
    title: 'Welcome'
  });
});
app.get('/tut_guide/:modId', function (req, res) {
  res.render(req.param("modId") + '/' + req.param("modId")+'_tut_guide', {
    title: 'Welcome'
  });
});

app.get('/results/:modId', function (req, res) {
  console.log(req.param("modId") + '/' + req.param("modId")+'_results')
  res.render(req.param("modId") + '/' + req.param("modId")+'_results', {
    title: 'Reflection'
  });
});


//Classes
app.get('/classes', passportConfig.isAuthenticated, classController.getClasses);
app.get('/class/:classId', passportConfig.isAuthenticated, classController.getClass);
app.post('/classes', passportConfig.isAuthenticated, classController.postCreateClass);

//User's Page
app.get('/me', passportConfig.isAuthenticated, userController.getMe);
app.get('/notifications', passportConfig.isAuthenticated, notificationController.getNotifications);


app.get('/login', userController.getLogin);
app.post('/login', userController.postLogin);
app.get('/logout', userController.logout);
//app.get('/forgot', userController.getForgot);
//app.post('/forgot', userController.postForgot);
//app.get('/reset/:token', userController.getReset);
//app.post('/reset/:token', userController.postReset);


app.get('/signup', userController.getSignup);
app.post('/signup', userController.postSignup);

//Instructor junks
app.get('/create_instructor', userController.getSignupInstructor);
app.post('/create_instructor', userController.postSignupInstructor);

app.get('/create_username', userController.getSignupUsername);
app.post('/create_username', userController.postSignupUsername);

//'/create_username_class/'
app.get('/create_username_class/:classId', userController.getSignupUsername);
app.post('/create_username_class/:classId', userController.postSignupUsernameClass);

app.get('/create_password', passportConfig.isAuthenticated, userController.getSignupPassword);
app.post('/create_password', passportConfig.isAuthenticated, userController.postSignupPassword);

app.get('/create_name', passportConfig.isAuthenticated, userController.getSignupName);
app.post('/create_name', passportConfig.isAuthenticated, userController.postSignupName);

app.get('/create_bio', passportConfig.isAuthenticated, userController.getSignupBio);
app.post('/create_bio', passportConfig.isAuthenticated, userController.postSignupBio);

///review/signup
app.get('/review/signup', passportConfig.isAuthenticated, userController.getSignupReview);

//////////////////////////

app.get('/account/signup_info', passportConfig.isAuthenticated, userController.getSignupInfo);
app.post('/account/signup_info_post', passportConfig.isAuthenticated, useravatarupload.single('picinput'), check, csrf, userController.postSignupInfo);

app.post('/account/profile', passportConfig.isAuthenticated, useravatarupload.single('picinput'), check, csrf, userController.postUpdateProfile);

app.get('/account', passportConfig.isAuthenticated, userController.getAccount);

app.get('/user/:userId', passportConfig.isAuthenticated, actorsController.getActor);
app.post('/user', passportConfig.isAuthenticated, actorsController.postBlockOrReport);

app.get('/bell', passportConfig.isAuthenticated, userController.checkBell);

//getScript
//app.get('/feed', passportConfig.isAuthenticated, scriptController.getScript);
app.post('/feed', passportConfig.isAuthenticated, scriptController.postUpdateFeedAction);
app.post('/deleteUserFeedActions', passportConfig.isAuthenticated, scriptController.postDeleteFeedAction);


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
  console.log('%s App is running at http://localhost:%d in %s mode', chalk.green('✓'), app.get('port'), app.get('env')); 
  console.log('  Press CTRL-C to stop\n');
});

module.exports = app;
