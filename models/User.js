const bcrypt = require('bcrypt');
const crypto = require('crypto');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// have 2 consts here, and choose which to export depending on the site version
const userSchema = new mongoose.Schema({
  // email: {type: String, default: ""},
  deleted: {type: Boolean, default: false}, // indicates if this account has been "deleted" from a class
  password: String, //hashed and salted
  // passwordResetToken: String,
  // passwordResetExpires: Date,
  username: { type: String, unique: true }, //username, must be unique
  name: {type: String, default: ''}, // Real name associated with account
  active: {type: Boolean, default: true}, //currently active? Not used in TestDrive
  isAdmin: {type: Boolean, default: false}, //is an Admin? (only changed directly in DB)
  isInstructor: {type: Boolean, default: false}, // is this user an Instructor
  isStudent: {type: Boolean, default: false},
  isGuest: {type: Boolean, default: false}, // is this user an Instructor
  //className: {type: String, default: ''}, // which class this user belongs to, if a student
  accessCode: {type: String, default: ''}, //which class this user belongs to, if a student
  completed: {type: Boolean, default: false}, //not used in TestDrive
  reflectionCsv: {type: String, default: ''},
  timeReportCsv: {type: String, default: ''},
  moduleProgress: { // marks the progress of each module: none, started, completed
    accounts: {type: String, default: 'none'},
    advancedlit: {type: String, default: 'none'},
    cyberbullying: {type: String, default: 'none'},
    digfoot: {type: String, default: 'none'},
    digitalliteracy: {type: String, default: 'none'},
    esteem: {type: String, default: 'none'},
    habits: {type: String, default: 'none'},
    phishing: {type: String,default: 'none'},
    presentation: {type: String, default: 'none'},
    privacy: {type: String, default: 'none'},
    safeposting: {type: String, default: 'none'},
    targeted: {type: String, default: 'none'},
  },
  numPosts: { type: Number, default: -1 }, //How many posts has this user created? not including replys
  numReplies: { type: Number, default: -1 }, //How many comments has user made
  //numActorReplies: { type: Number, default: -1 }, //How many times has an actor commented on this user

  lastNotifyVisit: Date, //date user last visited the site

  mturkID: String, //not used in TestDrive

  //Experimental group of this user
  //Not used in TestDrive
  // group: String, //full group type
  // ui: String,    //just UI type (no or ui)
  // notify: String, //notification type (no, low or high)

  // tokens: Array,

  blocked: [String], //actors user has blocked
  reported: [String], //actors user has reported

  targetedAdTopic: [String], //Food, Gaming, or Sports
  esteemTopic: [String], //Food, Gaming, or Sports
  advancedlitTopic: {type: String, default: ""}, //Music, Gaming, or Sports
  habitsTimer: [Number], //How long the user has been on the free-play page each time they visit, use sum of this array to get a total time.
  firstHabitViewTime: { type: Number, default: -1}, //The time that the user first opened the free-play section of the habits module
  //User created posts
  posts: [new Schema({
    type: String, //post, reply, actorReply (in TestDrive, it's always just a post)
    module: String, //Which lesson module does this belong to

    postID: Number,  //number for this post (1,2,3...) reply get -1 maybe should change to a String ID system
    body: {type: String, default: '', trim: true}, //body of post or reply
    picture: String, //picture for post

    // replyID: Number, //use this for User Replies (not used in TestDrive)
    // reply: {type: Schema.ObjectId, ref: 'Script'}, //Actor Post reply is to =>
    //
    // //not used in testDrive
    // actorReplyID: Number, //An Actor reply to a User Post
    // actorReplyOBody: String, //Original Body of User Post
    // actorReplyOPicture: String, //Original Picture of User Post
    // actorReplyORelativeTime: Number,
    // actorAuthor: {type: Schema.ObjectId, ref: 'Actor'},

    //Actor Comments for User Made Posts
    comments: [new Schema({
      actor: {type: Schema.ObjectId, ref: 'Actor'},
      body: {type: String, default: '', trim: true}, //body of comment
      commentID: Number, //ID of the comment
      time: Number,//reletive in millisecons
      absTime: Number,//absolute time in millisecons (time in took place in real world)
      new_comment: {type: Boolean, default: false}, //is new comment
      isUser: {type: Boolean, default: false}, //is this a user comment on their own post
      liked: {type: Boolean, default: false}, //has the user liked it?
      flagged: {type: Boolean, default: false},//is Flagged?
      likes: Number //number of likes this comment has
      }, { versionKey: false })],

    absTime: Date, //absolute date (time in real world), this post took place in
    relativeTime: {type: Number}
  })],

  //logins user made to site
  log: [new Schema({
    time: Date,
    })],

  // //quiz results (new workflow will not have this)
  // quiz: [new Schema({
  //   type: String,
  //   modual: String,
  //   score: Number
  //   })],
  // //evaluation quiz results (not in new workflow, may be added later)
  // eval_quiz: [new Schema({
  //   question: String,
  //   type: String,
  //   modual: String,
  //   val: Number
  //   })],

  //pages user has visited. Not sure if this is used in TestDrive
  pageLog: [new Schema({
    time: Date,
    subdirectory1: String,
    subdirectory2: String
    })],

  //When and why someone reported an actor
  blockAndReportLog: [new Schema({
    time: Date,
    action: String,
    report_issue: String,
    actorName: String
    })],

  //all actions a user can make in a feed
  feedAction: [new Schema({
    post: {type: Schema.ObjectId, ref: 'Script'}, //which post did the user interact with?
    modual: String, //which lesson mod did this take place in?
    postClass: String, //class of the post itself (don't think this is used anymore)
    rereadTimes: Number, //number of times post has been viewed by user (not used in TestDrive)
    startTime: Number, //always the newest startTime (full date in ms) (not used in TestDrive)
    liked: {type: Boolean, default: false}, //did the user like this post in the feed?
    flagged: {type: Boolean, default: false}, //did the user flag this post in the feed?
    readTime : [Number], //array of how long a user read a post. Each read is a new element in this array
    flagTime  : [Date], //same but for flagging
    likeTime  : [Date], //same but for liking
    replyTime  : [Date], //same but for commenting

    // popup modal info
    modal: [new Schema({
      modalName: String,
      modalOpened: {type: Boolean, default: false},
      modalOpenedTime: Number,
      modalViewTime: Number,
      modalCheckboxesCount: Number,
      modalCheckboxesInput: Number
    },{_id: false, versionKey: false })],

    //user created comment on an actor's post (fake post)
    comments: [new Schema({
      comment: {type: Schema.ObjectId},//ID Reference for Script post comment
      liked: {type: Boolean, default: false}, //is liked?
      flagged: {type: Boolean, default: false},//is Flagged?
      flagTime  : [Date], //array of flag times
      likeTime  : [Date], //array of like times

      new_comment: {type: Boolean, default: false}, //is new comment
      new_comment_id: Number,//ID for comment
      comment_body: String, //Original Body of User Post
      absTime: Date,
      commentTime: {type: Number},
      // time: {type: Number}
      },{_id: true, versionKey: false })]
    }, {_id: true, versionKey: false })],

  // start page log data
  startPageAction: [new Schema({
    subdirectory1: String, // which page the user is on
    subdirectory2: String, // which module the user is on
    actionType: {type: String}, // Next or Term
    vocabTerm: {type: String}, // none if actionType is "next"
    absoluteTimestamp: Date // time the actuon occurred in the real world
  }, {_id: true, versionKey: false})],

  // step log data (for any walkthrough-style text bubbles)
  introjsStepAction: [new Schema({
    subdirectory1: String, // which page the user is on
    subdirectory2: String, // which module the user is on
    stepNumber: Number, // which step this action is on (steps start from 0)
    viewDuration: Number, // how long the user was on this step (milliseconds)
    absoluteStartTime: Date // time the step opened in the real world
  }, {_id: true, versionKey: false })],

  // all actions a user can make in the tutorial (not including introjs steps)
  tutorialAction: [new Schema({
    post: String, //which post did the user interact with?
    modual: String, //which lesson mod did this take place in?
    startTime: Number, //always the newest startTime (full date in ms) (not used in TestDrive)
    liked: {type: Boolean, default: false}, //did the user like this post in the feed?
    flagged: {type: Boolean, default: false}, //did the user flag this post in the feed?
    flagTime  : [Date], //same but for flagging
    likeTime  : [Date], //same but for liking
    replyTime  : [Date], //same but for commenting
    comments: [new Schema({
      comment: String,
      liked: {type: Boolean, default: false}, //is liked?
      flagged: {type: Boolean, default: false},//is Flagged?
      flagTime  : [Date], //array of flag times
      likeTime  : [Date], //array of like times

      new_comment: {type: Boolean, default: false}, //is new comment
      new_comment_id: String,//ID for comment
      comment_body: String, //Original Body of User Post
      absTime: Date,
      commentTime: {type: Number},
      // time: {type: Number}
    },{_id: true, versionKey: false })]
  }, {_id: true, versionKey: false })],

  // all actions a user can make in the guided activity (not blue dots)
  guidedActivityAction: [new Schema({
    post: String, //which post did the user interact with?
    modual: String, //which lesson mod did this take place in?
    startTime: Number, //always the newest startTime (full date in ms) (not used in TestDrive)
    liked: {type: Boolean, default: false}, //did the user like this post in the feed?
    flagged: {type: Boolean, default: false}, //did the user flag this post in the feed?
    flagTime  : [Date], //same but for flagging
    likeTime  : [Date], //same but for liking
    replyTime  : [Date], //same but for commenting

    // popup modal info
    modal: [new Schema({
      modalName: String,
      modalOpened: {type: Boolean, default: false},
      modalOpenedTime: Number,
      modalViewTime: Number,
      modalCheckboxesCount: Number,
      modalCheckboxesInput: Number
    },{_id: false, versionKey: false })],

    //user created comment on an actor's post (fake post)
    comments: [new Schema({
      //comment: {type: Schema.ObjectId},//ID Reference for Script post comment
      comment: String,
      liked: {type: Boolean, default: false}, //is liked?
      flagged: {type: Boolean, default: false},//is Flagged?
      flagTime  : [Date], //array of flag times
      likeTime  : [Date], //array of like times

      new_comment: {type: Boolean, default: false}, //is new comment
      new_comment_id: String,//ID for comment
      comment_body: String, //Original Body of User Post
      absTime: Date,
      commentTime: {type: Number},
      // time: {type: Number}
    },{_id: true, versionKey: false })]
  }, {_id: true, versionKey: false })],

  // action in the reflection section
  reflectionAction: [new Schema({
    absoluteTimeContinued: Date, //time that the user left the page by clicking continue
    modual: String, //which lesson mod did this take place in?
    questionNumber: String, // corresponds with reflectionSectionData.json, i.e. 'Q1', 'Q2', 'Q3'...
    prompt: String,
    type: String, // Which type of response this will be: written, checkbox, radio, habitsUnique
    writtenResponse: String,
    radioSelection: String, // this is for the presentation module
    numberOfCheckboxes: Number,
    checkboxResponse: Number,
    checkedActualTime: Boolean, // this is unique to the habits module
  }, {_id: true, versionKey: false })],

  // blue dot action in a guided activity
  blueDotAction: [new Schema({
    subdirectory1: String, // which page the user is on
    subdirectory2: String, // which module the user is on
    dotNumber: Number, // which dot was opened
    absoluteTimeOpened: Date, // date of when the dot was opened
    viewDuration: Number, // how long the user viewed the dot (milliseconds)
    clickedGotIt: Boolean
  }, {_id: true, versionKey: false })],

  //users profile
  profile: {
    name: String,
    location: String,
    bio: String,
    picture: String
  },

  // history of all changes to the user profile
  profileHistory: [new Schema({
    absoluteTimeChanged: Date,
    name: String,
    location: String,
    bio: String,
    picture: String
  }, {_id: true, versionKey: false })],
}, { timestamps: true });

/**
 * Password hash middleware.
 */
userSchema.pre('save', function save(next) {
  const user = this;
  if (!user.isModified('password')) { return next(); }
  bcrypt.genSalt(10, (err, salt) => {
    if (err) { return next(err); }
    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) { return next(err); }
      user.password = hash;
      next();
    });
  });
});

/**
 * Helper method for validating user's password.
 */
userSchema.methods.comparePassword = function comparePassword(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    cb(err, isMatch);
  });
};

/**
 * Add Log to User regardless of when last access was
 */
userSchema.methods.logUser = function logUser(time) {
  if(this.log.length > 0) {
    var log = {};
    log.time = time;
    this.log.push(log);
  }
  else if(this.log.length == 0) {
    var log = {};
    log.time = time;
    this.log.push(log);
  }
  this.save((err) => {
    if (err) {
      return next(err);
    }
  });
};

userSchema.methods.logPage = function logPage(time, subdirectory1, subdirectory2) {
    let log = {};
    log.time = time;
    if(subdirectory1 !== undefined){
      log.subdirectory1 = subdirectory1;
      log.subdirectory2 = subdirectory2;
    } else {
      log.subdirectory1 = "home";
      log.subdirectory2 = "";
    }
    this.pageLog.push(log);
};

/**
 * Helper method for getting all User Posts.
 */
userSchema.methods.getPosts = function getPosts() {
  var temp = [];
  for (var i = 0, len = this.posts.length; i < len; i++) {
    if (this.posts[i].postID >= 0)
     temp.push(this.posts[i]);
  }

  temp.sort(function (a, b) {
    return a.postID - b.postID;
  });

  return temp;

};

/**
 * Helper method for getting all User replies.
 no longer needed in Truman or TestDrive
 */
userSchema.methods.getReplies = function getReplies() {
  var temp = [];
  for (var i = 0, len = this.posts.length; i < len; i++) {
    if (this.posts[i].replyID >= 0)
     temp.push(this.posts[i]);
  }

  temp.sort(function (a, b) {
    return a.postID - b.postID;
  });

  return temp;
};

/**
 * Helper method for getting all User Posts in a lesson mod
 This way posts made in one lesson mod don't show up in another
*/
userSchema.methods.getModPosts = function getModPosts(module) {
  var temp = [];
  for (var i = 0, len = this.posts.length; i < len; i++) {
    if (this.posts[i].postID >= 0 && this.posts[i].module == module)
     temp.push(this.posts[i]);
  }
  //sort to ensure that posts[x].postID == x
  temp.sort(function (a, b) {
    return a.postID - b.postID;
  });

  return temp;
};

/**
 * Helper method for getting all User Replies from Lesson Mod.
 not needed anymore now that we have comments instead of replies
 */
userSchema.methods.getModReplies = function getModReplies(module) {
  var temp = [];
  for (var i = 0, len = this.posts.length; i < len; i++) {
    if (this.posts[i].replyID >= 0 && this.posts[i].module == module)
     temp.push(this.posts[i]);
  }

  temp.sort(function (a, b) {
    return a.postID - b.postID;
  });

  return temp;
};

/**
 * Helper method for getting all User Posts and replies.
 */
userSchema.methods.getPostsAndReplies = function getPostsAndReplies() {
  var temp = [];
  for (var i = 0, len = this.posts.length; i < len; i++) {
    if (this.posts[i].postID >= 0 || this.posts[i].replyID >= 0)
     temp.push(this.posts[i]);
  }

  //sort to ensure that posts[x].postID == x
  temp.sort(function (a, b) {
    return a.absTime - b.absTime;
  });

  return temp;

};

/**
 * Helper method for getting all User Posts and replies for a lesson mod
 not needed now
 */
userSchema.methods.getModPostsAndReplies = function getModPostsAndReplies(module) {
  var temp = [];
  for (var i = 0, len = this.posts.length; i < len; i++) {
    if ((this.posts[i].postID >= 0 || this.posts[i].replyID >= 0) && this.posts[i].module == module)
     temp.push(this.posts[i]);
  }

  //sort to ensure that posts[x].postID == x
  temp.sort(function (a, b) {
    return a.absTime - b.absTime;
  });

  return temp;

};

//Return the user post from its ID
userSchema.methods.getUserPostByID = function(postID) {

  return this.posts.find(x => x.postID == postID);

};

//Return the user pre-quiz result from its ID
userSchema.methods.getUserPreQuizScore = function(modual) {

  return  this.quiz.find(x => ((x.modual == modual) && (x.type == "pre")));

};

//Return the user post-quiz result from its ID
userSchema.methods.getUserPostQuizScore = function(modual) {

  return  this.quiz.find(x => ((x.modual == modual) && (x.type == "post")));

};


//Return the user reply from its ID, not needed now
userSchema.methods.getUserReplyByID = function(replyID) {

  return this.posts.find(x => x.replyID == replyID);

};

//Return the actor reply from its ID - not needed now
userSchema.methods.getActorReplyByID = function(actorReplyID) {

  return this.posts.find(x => x.actorReplyID == actorReplyID);

};

//get user posts within the min/max time period
userSchema.methods.getPostInPeriod = function(min, max, module) {
    //concat posts & reply
    return this.posts.filter(function(item) {
        return (item.relativeTime >= min) && (item.relativeTime <= max) && (item.module == module);
    });
}

/**
 * Helper method for getting user's gravatar.
 */
userSchema.methods.gravatar = function gravatar(size) {
  if (!size) {
    size = 200;
  }
  if (!this.email) {
    return `https://gravatar.com/avatar/?s=${size}&d=retro`;
  }
  const md5 = crypto.createHash('md5').update(this.email).digest('hex');
  return `https://gravatar.com/avatar/${md5}?s=${size}&d=retro`;
};

//TODO: change here, use ternary operator
const User = mongoose.model('User', userSchema);

module.exports = User;
