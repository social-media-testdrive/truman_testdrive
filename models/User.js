const bcrypt = require('@node-rs/bcrypt');
const crypto = require('crypto');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
    username: { type: String, unique: true }, // Username, must be unique. In Public TestDrive, this is randomly generated.
    name: { type: String, default: '' }, // Used in Research TestDrive; real name associated with account.
    // email: {type: String, default: ""},
    deleted: { type: Boolean, default: false }, // Used in Research TestDrive, indicates if user has been "deleted" from a class.
    password: String, // hashed and salted. Passwords are only set for Research TestDrive, teacher accounts. Else, random.
    active: { type: Boolean, default: true }, // Used in Research TestDrive, indicates if the user is active. 
    isAdmin: { type: Boolean, default: false }, // Indicates if user is an Administrator. This value is only changed directly in the database.
    isInstructor: { type: Boolean, default: false }, // Used in Research TestDrive, indicates if user is an Instructor
    isStudent: { type: Boolean, default: false }, // Used in Research TestDrive, indicates if user is a Student
    isGuest: { type: Boolean, default: false }, // Indicates if user is a Guest. All Public TestDrive users are guests.
    // className: {type: String, default: ''}, // Used in Research TestDrive; which class this user belongs to, if a student
    accessCode: { type: String, default: '' }, // Used in Research TestDrive; AccessCode identifying which class this user belongs to, if a student
    reflectionCsv: { type: String, default: '' },
    timeReportCsv: { type: String, default: '' },
    moduleProgress: { // Used in Research TestDrive, marks the progress of each module: "none", "started", "completed".
        accounts: { type: String, default: 'none' },
        advancedlit: { type: String, default: 'none' },
        cyberbullying: { type: String, default: 'none' },
        digfoot: { type: String, default: 'none' },
        digitalliteracy: { type: String, default: 'none' },
        esteem: { type: String, default: 'none' },
        habits: { type: String, default: 'none' },
        phishing: { type: String, default: 'none' },
        presentation: { type: String, default: 'none' },
        privacy: { type: String, default: 'none' },
        safeposting: { type: String, default: 'none' },
        targeted: { type: String, default: 'none' },
    },
    earnedBadges: [new Schema({ // List of badges earned by the user, see testdriveBadges.json file.
        badgeId: String,
        badgeTitle: String,
        badgeImage: String,
        dateEarned: Date
    })],
    numPosts: { type: Number, default: -1 }, // Indicates the number of posts the user has created.
    numComments: { type: Number, default: -1 }, // Indicates the number of comments the user has created.

    lastNotifyVisit: Date, // The absolute date (time) that the user last visited the site. 

    // blocked: [String], // List of usernames of actors that the user has blocked, Not used in TestDrive
    // reported: [String], // List of usernames of actors that the user has reported, Not used in TestDrive

    targetedAdTopic: [String], // List of interests that the user selected in targeted module: "Food", "Gaming", or "Sports". Order: Least recently selected to most recently selected.
    esteemTopic: [String], // List of interests that the user selected in the esteem module: "Food", "Gaming", or "Sports". Order: Least recently selected to most recently selected.
    habitsTimer: [Number], // List of time durations (in milliseconds), indicating how long the user has been on the free-play page in the habits module. Use sum of this array to get a total time.
    firstHabitViewTime: { type: Number, default: -1 }, // The absolute date (time) that the user first opened the free-play section of the habits module.
    voiceoverTimer: [Number], // List of time durations (in milliseconds), indicating how long the voiceover is on. Use the sum of this array to get a total time.
    viewQuizExplanations: [new Schema({ // Indicates if the user has clicked to view quiz answer explanations.
        module: String, // Indicates which module the action is completed in.
        click: Boolean, // Indicates if the user clicked to view explanations.
        absoluteTime: Date, // The absolute date (time) that the user clicked to view explanations.
    })],

    // User-made posts
    posts: [new Schema({
        type: String, // In TestDrive, this value is always "user_post".
        module: String, // Indicates which module the post is made in.

        postID: Number, // ID for this post (0, 1,2,3...)
        body: { type: String, default: '', trim: true }, // Body of post caption
        picture: String, // Picture selected

        absTime: Date, // The absolute date (time) that the user made the post.
        relativeTime: { type: Number } // The relative time (relative to when the user's account was created) that the user made the post, in milliseconds.
    })],

    // List of absolute dates, indicating when a user has logged in.
    log: [new Schema({
        time: Date,
    })],

    // List of pages that the user has visisted.
    pageLog: [new Schema({
        time: Date, // The absolute date (time) that the user visited the page.
        subdirectory1: String,
        subdirectory2: String
    })],

    // Start Page Actions
    startPageAction: [new Schema({
        subdirectory1: String, // Indicates which page the user is on. This value is always "start".
        subdirectory2: String, // Indicates which module the action is completed in.
        actionType: { type: String }, // Indicates the type of action; values: "next_showLearnSection", "next_showKeyIdeas", "KeyIdea".
        vocabTerm: { type: String }, // Indicates which vocab term was clicked. Value is null if actionType is "next_".
        absoluteTimestamp: Date // The absolute date (time) that the user clicked button.
    }, { _id: true, versionKey: false })],

    // IntroJsStep Actions: (the walkthrough-style text bubbles)
    introjsStepAction: [new Schema({
        subdirectory1: String, // Indicates which page the user is on.
        subdirectory2: String, // Indicates which module the action is completed in.
        stepNumber: Number, // Indicates which step the user clicked (steps start from 0).
        viewDuration: Number, // Time duration indicating how long the user was on this step, in milliseconds.
        absoluteStartTime: Date // The absolute date (time) that the step first opened/ appeared.
    }, { _id: true, versionKey: false })],

    // Blue Dot Actions
    blueDotAction: [new Schema({
        subdirectory1: String, // Indicates which page the user is on.
        subdirectory2: String, // Indicates which module the action is completed in.
        dotNumber: Number, // Indicates which dot was opened.
        viewDuration: Number, // Time duration indicating how long the user viewed the dot, in milliseconds.
        absoluteTimeOpened: Date, // The absolute date (time) that the dot was opened.
        clickedGotIt: Boolean // Indicates if the blue dot was closed via clicking "Got it". If false, blue dot was closed by clicking outside of the prompt.
    }, { _id: true, versionKey: false })],

    // Only used in the 'accounts' module (in the sim , sim2 section), to record user's input in form fields.
    accountsAction: [new Schema({
        subdirectory1: String, // Indicates which page the user is on.
        subdirectory2: String, // Indicates which module the action is completed in. This value is always "accounts". 
        inputField: String, // Indicates which field the action corresponds to. 
        inputText: String, // Value of field input (for /sim/accounts page, it is the actual value, for /sim2/accounts page, it is "true" or "false", indicating if they provided an input. This is to avoid collecting student information.)
        passwordStrength: String, // Indicates password strength. Value is null if inputField is not "password".
        absoluteTimestamp: Date // The absolute date (time) that the user clicked "Let's Continue", which logs the answers.
    }, { _id: true, versionKey: false })],

    // Only used in 'habits' module (in the sim3, sim4, modual sections), to record user's clicks and settings.
    habitsAction: [new Schema({
        subdirectory1: String, // Indicates which page the user is on.
        subdirectory2: String, // Indicates which module the action is completed in. This value is always "habits". 
        actionType: String, // clickNotificationsTab, clickSettingsTab, clickMyActivityTab, setPauseNotifications,  setDailyReminder, togglePauseNotifications, clickNotificationPopup, clickNotificationItem
        setValue: String, // Value that was set (only used when actionType is setPauseNotifications, setDailyReminder, togglePauseNotifications)
        absoluteTimestamp: Date // The absolute date (time) that the user did action.
    }, { _id: true, versionKey: false })],

    // Only used in 'privacy' module (in the tutorial, sim section), to record user's input in form fields.
    privacyAction: [new Schema({
        subdirectory1: String, // Indicates which page the user is on.
        subdirectory2: String, // Indicates which module the action is completed in. This value is always "privacy". 
        inputField: String, // Indicates which input field.
        inputText: String, // Value that was set.
        absoluteTimestamp: Date // The aboslute date (time) the user did action.
    }, { _id: true, versionKey: false })],

    // Only used in 'safe-posting' module, to record user's actions with chatboxes.
    chatAction: [new Schema({
        chatId: String, // Indicates which chat the user interacted with.
        subdirectory1: String, // Indicates which page the user is on.
        subdirectory2: String, // Indicates which module the action is completed in.
        messages: [new Schema({
            message: String, // Body (text) of message
            absTime: Date, // The absolute date (time) the message was sent
        }, { _id: true, versionKey: false })],
        minimized: { type: Boolean, default: false }, // Indicates if the module was miminized.
        closed: { type: Boolean, default: false }, // Indicates if the module was closed.
        minimizedTime: [Date], // Array of absolute dates (times) for when chat minimization was clicked.
        closedTime: Date, // The absolute date (time) the chat was closed
    }, { _id: true, versionKey: false })],

    // Actions done on posts in the 'tutorial' section of modules.
    tutorialAction: [new Schema({
        post: String, // Indicates which post the user interacted with. Format is: "${module}_tutorial_post${#}".
        modual: String, // Indicates which module the action is completed in.
        liked: { type: Boolean, default: false }, // Indicates if the user liked the post.
        flagged: { type: Boolean, default: false }, // Indicates if the user flagged the post. Functionality is disabled in tutorial sections, so this value is always false.
        shared: { type: Boolean, default: false }, // Indicates if the user shared the post. Functionality is disabled in tutorial sections, so this value is always false.
        likeTime: [Date], // Array of absolute dates (times) of when the user liked the post.
        flagTime: [Date], // Array of absolute dates (times) of when the user flagged the post. Should always be empty.
        shareTime: [Date], // Array of asbsolute dates (times) of when the user shared the post. Should always be empty.
        replyTime: [Date], // Array of absolute dates (times) of when the user made a comment on the post.

        comments: [new Schema({
            comment: String, // Indicates which comment the user interacted with. Format is: "${module}_tutorial_post${#}_comment${#}". Empty if comment is a user comment.
            liked: { type: Boolean, default: false }, // Indicates if the user liked the comment.
            flagged: { type: Boolean, default: false }, // Indicates if the user liked the comment. Functionality is disabled in tutorial sections, so this value is always false.
            likeTime: [Date], // Array of absolute dates (times) of when the user liked the comment.
            flagTime: [Date], // Array of absolute dates (times) of when the user flagged the comment. Should always be empty.

            new_comment: { type: Boolean, default: false }, // Indicates if the comment is a user comment.
            new_comment_id: String, // ID of user comment. Starts with 0.
            comment_body: String, // Body (text) of user comment.
            absTime: Date, // The absolute date (time) of when the user made the comment.
        }, { _id: true, versionKey: false })]
    }, { _id: true, versionKey: false })],

    // Actions done on posts in the 'guided activity' section of modules.
    guidedActivityAction: [new Schema({
        post: String, // Indicates which post the user interacted with. Format is: "${module}_sim_post${#}".
        modual: String, // Indicates which module the action is completed in.
        liked: { type: Boolean, default: false }, // Indicates if the user liked the post.
        flagged: { type: Boolean, default: false }, // Indicates if the user flagged the post. Functionality is disabled in tutorial sections, so this value is always false.
        shared: { type: Boolean, default: false }, // Indicates if the user shared the post. Functionality is disabled in tutorial sections, so this value is always false.
        likeTime: [Date], // Array of absolute dates (times) of when the user liked the post.
        flagTime: [Date], // Array of absolute dates (times) of when the user flagged the post. Should always be empty.
        shareTime: [Date], // Array of asbsolute dates (times) of when the user shared the post. Should always be empty.
        replyTime: [Date], // Array of absolute dates (times) of when the user made a comment on the post.

        modal: [new Schema({
            modalName: String, // Name of the modal opened
            modalOpened: { type: Boolean, default: false }, // Indicates if modal was opened.
            modalOpenedTime: Date, // The absolute date (time) of when the modal was opened.
            modalViewTime: Number, // The duration (how long) the modal was open, in milliseconds.
            modalCheckboxesCount: Number, // Indicates how many checkboxes are present in the modal.
            modalCheckboxesInput: Number, // Number which, when converted to binary format, corresponds to which checkboxes were checked in the modal.
            modalDropdownCount: Number, // Indicates how many accordion triangles are present in the modal.
            modalDropdownClick: Number // Number which, when converted to binary format, corresponds to Which accordion triangles were clicked in the modal.
        }, { _id: false, versionKey: false })],

        comments: [new Schema({
            comment: String, // Indicates which comment the user interacted with. Format is: "${module}_sim_post${#}_comment${#}". Empty if comment is a user comment.
            liked: { type: Boolean, default: false }, // Indicates if the user liked the comment.
            flagged: { type: Boolean, default: false }, // Indicates if the user liked the comment. Functionality is disabled in tutorial sections, so this value is always false.
            likeTime: [Date], // Array of absolute dates (times) of when the user liked the comment.
            flagTime: [Date], // Array of absolute dates (times) of when the user flagged the comment. Should always be empty.

            new_comment: { type: Boolean, default: false }, // Indicates if the comment is a user comment.
            new_comment_id: String, // ID of user comment. Starts with 0.
            comment_body: String, // Body (text) of user comment.
            absTime: Date, // The absolute date (time) of when the user made the comment.
        }, { _id: true, versionKey: false })]
    }, { _id: true, versionKey: false })],

    // Actions done on posts in the 'free play' section of modules.
    feedAction: [new Schema({
        post: { type: Schema.ObjectId, ref: 'Script' }, // Indicates which post the user interacted with. ObjectId references object in Scripts or object in user.posts.
        modual: String, // Indicates which module the action is completed in.
        liked: { type: Boolean, default: false }, // Indicates if the user liked the post.
        flagged: { type: Boolean, default: false }, // Indicates if the user flagged the post. Functionality is disabled in tutorial sections, so this value is always false.
        shared: { type: Boolean, default: false }, // Indicates if the user shared the post. Functionality is disabled in tutorial sections, so this value is always false.
        likeTime: [Date], // Array of absolute dates (times) of when the user liked the post.
        flagTime: [Date], // Array of absolute dates (times) of when the user flagged the post. Should always be empty.
        shareTime: [Date], // Array of asbsolute dates (times) of when the user shared the post. Should always be empty.
        replyTime: [Date], // Array of absolute dates (times) of when the user made a comment on the post.

        modal: [new Schema({
            modalName: String, // Name of the modal opened
            modalOpened: { type: Boolean, default: false }, // Indicates if modal was opened.
            modalOpenedTime: Date, // The absolute date (time) of when the modal was opened.
            modalViewTime: Number, // The duration (how long) the modal was open, in milliseconds.
            modalCheckboxesCount: Number, // Indicates how many checkboxes are present in the modal.
            modalCheckboxesInput: Number, // Number which, when converted to binary format, corresponds to which checkboxes were checked in the modal.
            modalDropdownCount: Number, // Indicates how many accordion triangles are present in the modal.
            modalDropdownClick: Number // Number which, when converted to binary format, corresponds to Which accordion triangles were clicked in the modal.
        }, { _id: false, versionKey: false })],

        comments: [new Schema({
            comment: String, // Indicates which comment the user interacted with. Format is: "${module}_sim_post${#}_comment${#}". Empty if comment is a user comment.
            liked: { type: Boolean, default: false }, // Indicates if the user liked the comment.
            flagged: { type: Boolean, default: false }, // Indicates if the user liked the comment. Functionality is disabled in tutorial sections, so this value is always false.
            likeTime: [Date], // Array of absolute dates (times) of when the user liked the comment.
            flagTime: [Date], // Array of absolute dates (times) of when the user flagged the comment. Should always be empty.

            new_comment: { type: Boolean, default: false }, // Indicates if the comment is a user comment.
            new_comment_id: String, // ID of user comment. Starts with 0.
            comment_body: String, // Body (text) of user comment.
            comment_index: Number, // Index of comment on post
            absTime: Date, // The absolute date (time) of when the user made the comment.
        }, { _id: true, versionKey: false })]
    }, { _id: true, versionKey: false })],

    // Submission in the 'reflection' section
    reflectionAction: [new Schema({
        absoluteTimeContinued: Date, // The absolute date (time) that the user left the page by clicking "Continue".
        modual: String, // Indicates which module the action is completed in.
        attemptDuration: Number, // The duration (how long) the user took for the reflection submission/attempt, in milliseconds.
        answers: [new Schema({
            questionNumber: String, // Indicates which question. See reflectionSectionData.json, i.e. 'Q1', 'Q2', 'Q3'.
            prompt: String, // Body (text) of the question prompt.
            type: String, // Indicates the type of response: 'written', 'checkbox', 'radio', 'habitsUnique'
            writtenResponse: String, // Body (text) of user's response.
            radioSelection: String, // Radio selection (only used in 'presentation' module) of user's response.
            numberOfCheckboxes: Number, // Indicates how many checkboxes are present in the question.
            checkboxResponse: Number, // Number which, when converted to binary format, corresponds to which checkboxes were checked in the user's response.
            checkedActualTime: Boolean, // Indicates if user checked their time in free play section. This is unique to the 'habits' module.
        }, { _id: false, versionKey: false })],
    }, { _id: true, versionKey: false })],

    // Submission in the 'quiz' section
    quizAction: [new Schema({
        absoluteTimeContinued: Date, // The absolute date (time) that the user submitted their answers by clicking "Check My Answers".
        modual: String, // Indicates which module the action is completed in.
        attemptNumber: Number, // Indicates which quiz attempt (i.e. 0, 1, 2)
        attemptDuration: Number, // The duration (how long) the user took for the quiz attempt, in milliesconds.
        answers: [new Schema({
            questionNumber: String, // Indicates which question. See quizSectionData.json, i.e. 'Q1', 'Q2', 'Q3'.
            prompt: String, // Body (text) of the question prompt.
            radioSelectionIndex: Number, // Radio selection of user's response.
            radioSelection: String, // Body (text) of the radio selection of user's response.
        }, { _id: false, versionKey: false })],
        numCorrect: Number // The number of questions the user answered correctly in attempt.
    }, { _id: true, versionKey: false })],

    // User profile
    profile: {
        name: { type: String, default: '', trim: true },
        location: { type: String, default: '', trim: true },
        bio: { type: String, default: '', trim: true },
        picture: { type: String, default: '', trim: true }
    },

    // List (history) of all changes to the user profile
    profileHistory: [new Schema({
        absoluteTimeChanged: Date, // The absolute date (time) the profile was changed
        name: String, // Value of the new profile name
        location: String, // Value of the new location
        bio: String, // Value of the new bio
        picture: String // Value of the new picture
    }, { _id: true, versionKey: false })],
}, { timestamps: true });

/**
 * Password hash middleware.
 */
userSchema.pre('save', async function save(next) {
    const user = this;
    if (!user.isModified('password')) { return next(); }
    try {
        user.password = await bcrypt.hash(user.password, 10);
        next();
    } catch (err) {
        next(err);
    }
});

/**
 * Helper method for validating user's password.
 */
userSchema.methods.comparePassword = async function comparePassword(candidatePassword, cb) {
    try {
        cb(null, await bcrypt.verify(candidatePassword, this.password));
    } catch (err) {
        cb(err);
    }
};

/**
 * Helper method to log when a user has logged in.
 */
userSchema.methods.logUser = async function logUser(time) {
    try {
        this.log.push({
            time: time
        });
        await this.save();
    } catch (err) {
        console.log(err);
    }
};

/**
 * Helper method to log the pages the user has visited. 
 */
userSchema.methods.logPage = async function logPage(time, subdirectory1, subdirectory2) {
    try {
        this.pageLog.push({
            time: time,
            subdirectory1: subdirectory1 ? subdirectory1 : "home",
            subdirectory2: subdirectory2 ? subdirectory2 : ""
        });
        await this.save();
    } catch (err) {
        console.log(err);
    }
};

/**
 * Helper method for getting all User Posts.
 */
userSchema.methods.getPosts = function getPosts(module) {
    let ret = this.posts.filter(post => post.module == module);
    ret.sort(function(a, b) {
        return b.relativeTime - a.relativeTime;
    });
    return ret;
};

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

const User = mongoose.model('User', userSchema);
module.exports = User;