const crypto = require('crypto');
const bcrypt = require('@node-rs/bcrypt');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  avatar: { type: String, default: "Daring" },
  avatarImgnp: { type: String, default: "/images/agent-daring.png" },
  rolePlay: String,
  password: String,
  passwordResetToken: String,
  passwordResetExpires: Date,
  emailVerificationToken: String,
  emailVerified: { type: Boolean, default: false },
//   newsletterConsent: { type: Boolean, default: false },
  narration: {
    mute: { type: Boolean, default: false },
    speed: { type: Number, default: 1 },
    wordHighlighting: { type: Boolean, default: true },
    sentenceHighlighting: { type: Boolean, default: true },
  },
  badges: [
    {
      module: { type: String, required: true },
      section: { type: String, required: true },
      type: { type: String, required: true },
      name: { type: String, required: true },
      imageUrl: { type: String, required: true },
      earnedAt: { type: Date, required: true, default: Date.now },
    } 
  ],

  // snapchat: String,
  // facebook: String,
  // twitter: String,
  google: String,
  
  // github: String,
  // linkedin: String,
  // steam: String,
  // twitch: String,
  // quickbooks: String,
  tokens: Array,

  moduleProgress: { // marks the progress of each module
    identity: {
        percent: { type: Number, default: 0 }, // percent complete
        link: { type: String, default: '/course-player?module=identity&section=challenge&page=intro' }, // link to the last page the user was on in module
        challengeAttempts: [{
            timestamp: { type: Date, default: Date.now },
            scoreTotal: { type: Number, default: 0 },
            correctAnswers: { type: Number, default: 0 },
            questionScores: [{ type: Number }],
            questionChoices: Schema.Types.Mixed,
        }],
        conceptsAttempts: [{
            timestamp: { type: Date, default: Date.now },
            scoreTotal: { type: Number, default: 0 },
            correctAnswers: { type: Number, default: 0 },
            questionScores: [{ type: Number }],
            questionChoices: Schema.Types.Mixed,
        }],
        consequencesAttempts: [{
            timestamp: { type: Date, default: Date.now },
            scoreTotal: { type: Number, default: 0 },
            correctAnswers: { type: Number, default: 0 },
            questionScores: [{ type: Number }],
            questionChoices: Schema.Types.Mixed,
        }],
        techniquesAttempts: [{
            timestamp: { type: Date, default: Date.now },
            scoreTotal: { type: Number, default: 0 },
            correctAnswers: { type: Number, default: 0 },
            questionScores: [{ type: Number }],
            questionChoices: Schema.Types.Mixed,
        }],
        protectionAttempts: [{
            timestamp: { type: Date, default: Date.now },
            scoreTotal: { type: Number, default: 0 },
            correctAnswers: { type: Number, default: 0 },
            questionScores: [{ type: Number }],
            questionChoices: Schema.Types.Mixed,
        }],
        reportingAttempts: [{
            timestamp: { type: Date, default: Date.now },
            scoreTotal: { type: Number, default: 0 },
            correctAnswers: { type: Number, default: 0 },
            questionScores: [{ type: Number }],
            questionChoices: Schema.Types.Mixed,
        }],
        evaluationAttempts: [{
            timestamp: { type: Date, default: Date.now },
            scoreTotal: { type: Number, default: 0 },
            correctAnswers: { type: Number, default: 0 },
            questionScores: [{ type: Number }],
            questionChoices: Schema.Types.Mixed,
        }],
    },       
    romance: {
        percent: { type: Number, default: 0 }, // percent complete
        link: { type: String, default: '/course-player?module=romance&section=challenge&page=intro' }, // link to the last page the user was on in module
        challengeAttempts: [{
            timestamp: { type: Date, default: Date.now },
            scoreTotal: { type: Number, default: 0 },
            correctAnswers: { type: Number, default: 0 },
            questionScores: [{ type: Number }],
            questionChoices: Schema.Types.Mixed,
        }],
        conceptsAttempts: [{
            timestamp: { type: Date, default: Date.now },
            scoreTotal: { type: Number, default: 0 },
            correctAnswers: { type: Number, default: 0 },
            questionScores: [{ type: Number }],
            questionChoices: Schema.Types.Mixed,
        }],
        consequencesAttempts: [{
            timestamp: { type: Date, default: Date.now },
            scoreTotal: { type: Number, default: 0 },
            correctAnswers: { type: Number, default: 0 },
            questionScores: [{ type: Number }],
            questionChoices: Schema.Types.Mixed,
        }],
        techniquesAttempts: [{
            timestamp: { type: Date, default: Date.now },
            scoreTotal: { type: Number, default: 0 },
            correctAnswers: { type: Number, default: 0 },
            questionScores: [{ type: Number }],
            questionChoices: Schema.Types.Mixed,
        }],
        fakeAttempts: [{
            timestamp: { type: Date, default: Date.now },
            scoreTotal: { type: Number, default: 0 },
            correctAnswers: { type: Number, default: 0 },
            questionScores: [{ type: Number }],
            questionChoices: Schema.Types.Mixed,
        }],
        contactAttempts: [{
            timestamp: { type: Date, default: Date.now },
            scoreTotal: { type: Number, default: 0 },
            correctAnswers: { type: Number, default: 0 },
            questionScores: [{ type: Number }],
            questionChoices: Schema.Types.Mixed,
        }],
        requestsAttempts: [{
            timestamp: { type: Date, default: Date.now },
            scoreTotal: { type: Number, default: 0 },
            correctAnswers: { type: Number, default: 0 },
            questionScores: [{ type: Number }],
            questionChoices: Schema.Types.Mixed,
        }],
        protectionAttempts: [{
            timestamp: { type: Date, default: Date.now },
            scoreTotal: { type: Number, default: 0 },
            correctAnswers: { type: Number, default: 0 },
            questionScores: [{ type: Number }],
            questionChoices: Schema.Types.Mixed,
        }],
        reportingAttempts: [{
            timestamp: { type: Date, default: Date.now },
            scoreTotal: { type: Number, default: 0 },
            correctAnswers: { type: Number, default: 0 },
            questionScores: [{ type: Number }],
            questionChoices: Schema.Types.Mixed,
        }],
        practiceChoices: {
            choice1: {type: String, default: 'none'},
            choice2: {type: String, default: 'none'},
            choice3: {type: String, default: 'none'},
            choice4: {type: String, default: 'none'},
            choice5: {type: String, default: 'none'},
            choice6: {type: String, default: 'none'},
            choice7: {type: String, default: 'none'},
            score: {type: Number, default: 0 },
        },
        evaluationAttempts: [{
            timestamp: { type: Date, default: Date.now },
            scoreTotal: { type: Number, default: 0 },
            correctAnswers: { type: Number, default: 0 },
            questionScores: [{ type: Number }],
            questionChoices: Schema.Types.Mixed,
        }],
    },    
    grandparent: {
        percent: { type: Number, default: 0 }, // percent complete
        link: { type: String, default: '/course-player?module=grandparent&section=challenge&page=intro' }, // link to the last page the user was on in module
        challengeAttempts: [{
            timestamp: { type: Date, default: Date.now },
            scoreTotal: { type: Number, default: 0 },
            correctAnswers: { type: Number, default: 0 },
            questionScores: [{ type: Number }],
            questionChoices: Schema.Types.Mixed,
        }],
        conceptsAttempts: [{
            timestamp: { type: Date, default: Date.now },
            scoreTotal: { type: Number, default: 0 },
            correctAnswers: { type: Number, default: 0 },
            questionScores: [{ type: Number }],
            questionChoices: Schema.Types.Mixed,
        }],
        consequencesAttempts: [{
            timestamp: { type: Date, default: Date.now },
            scoreTotal: { type: Number, default: 0 },
            correctAnswers: { type: Number, default: 0 },
            questionScores: [{ type: Number }],
            questionChoices: Schema.Types.Mixed,
        }],
        techniquesAttempts: [{
            timestamp: { type: Date, default: Date.now },
            scoreTotal: { type: Number, default: 0 },
            correctAnswers: { type: Number, default: 0 },
            questionScores: [{ type: Number }],
            questionChoices: Schema.Types.Mixed,
        }],
        protectionAttempts: [{
            timestamp: { type: Date, default: Date.now },
            scoreTotal: { type: Number, default: 0 },
            correctAnswers: { type: Number, default: 0 },
            questionScores: [{ type: Number }],
            questionChoices: Schema.Types.Mixed,
        }],
        signsAttempts: [{
            timestamp: { type: Date, default: Date.now },
            scoreTotal: { type: Number, default: 0 },
            correctAnswers: { type: Number, default: 0 },
            questionScores: [{ type: Number }],
            questionChoices: Schema.Types.Mixed,
        }],
        evaluationAttempts: [{
            timestamp: { type: Date, default: Date.now },
            scoreTotal: { type: Number, default: 0 },
            correctAnswers: { type: Number, default: 0 },
            questionScores: [{ type: Number }],
            questionChoices: Schema.Types.Mixed,
        }],
    },             
    tech: {
        percent: { type: Number, default: 0 }, // percent complete
        link: { type: String, default: '/course-player?module=tech&section=challenge&page=intro' }, // link to the last page the user was on in module
        challengeAttempts: [{
            timestamp: { type: Date, default: Date.now },
            scoreTotal: { type: Number, default: 0 },
            correctAnswers: { type: Number, default: 0 },
            questionScores: [{ type: Number }],
            questionChoices: Schema.Types.Mixed,
        }],
        conceptsAttempts: [{
            timestamp: { type: Date, default: Date.now },
            scoreTotal: { type: Number, default: 0 },
            correctAnswers: { type: Number, default: 0 },
            questionScores: [{ type: Number }],
            questionChoices: Schema.Types.Mixed,
        }],
        consequencesAttempts: [{
            timestamp: { type: Date, default: Date.now },
            scoreTotal: { type: Number, default: 0 },
            correctAnswers: { type: Number, default: 0 },
            questionScores: [{ type: Number }],
            questionChoices: Schema.Types.Mixed,
        }],
        techniquesAttempts: [{
            timestamp: { type: Date, default: Date.now },
            scoreTotal: { type: Number, default: 0 },
            correctAnswers: { type: Number, default: 0 },
            questionScores: [{ type: Number }],
            questionChoices: Schema.Types.Mixed,
        }],
        protectionAttempts: [{
            timestamp: { type: Date, default: Date.now },
            scoreTotal: { type: Number, default: 0 },
            correctAnswers: { type: Number, default: 0 },
            questionScores: [{ type: Number }],
            questionChoices: Schema.Types.Mixed,
        }],
        signsAttempts: [{
            timestamp: { type: Date, default: Date.now },
            scoreTotal: { type: Number, default: 0 },
            correctAnswers: { type: Number, default: 0 },
            questionScores: [{ type: Number }],
            questionChoices: Schema.Types.Mixed,
        }],
        evaluationAttempts: [{
            timestamp: { type: Date, default: Date.now },
            scoreTotal: { type: Number, default: 0 },
            correctAnswers: { type: Number, default: 0 },
            questionScores: [{ type: Number }],
            questionChoices: Schema.Types.Mixed,
        }],
    },             

    phishing: {
        percent: { type: Number, default: 0 }, // percent complete
        link: { type: String, default: '/course-player?module=phishing&section=challenge&page=intro' }, // link to the last page the user was on in module
        prequiz: { type: Number, default: 0},
        submodOne: { type: Number, default: 0 },
        submodTwo: { type: Number, default: 0 },
        submodThree: { type: Number, default: 0 },
        postquiz: { type: Number, default: 0 },
    },           
    sales: {
        percent: { type: Number, default: 0 }, // percent complete
        link: { type: String, default: '/course-player?module=sales&section=challenge&page=intro' }, // link to the last page the user was on in module
        prequiz: { type: Number, default: 0},
        submodOne: { type: Number, default: 0 },
        submodTwo: { type: Number, default: 0 },
        submodThree: { type: Number, default: 0 },
        postquiz: { type: Number, default: 0 },
    },          
  },
  modulePageAccessLog: [{   
      type: String,
  }],
  moduleStatus: {
    identity: {
        intro: { type: Number, default: 0 }, 
        challenge: { type: Number, default: 0 },  
        concepts: { type: Number, default: 0 }, 
        consequences: { type: Number, default: 0 }, 
        techniques: { type: Number, default: 0 }, 
        protection: { type: Number, default: 0 }, 
        reporting: { type: Number, default: 0 }, 
        practice: { type: Number, default: 0 }, 
        evaluation: { type: Number, default: 0 }, 
    },     
    romance: {
        intro: { type: Number, default: 0 }, 
        challenge: { type: Number, default: 0 },  
        concepts: { type: Number, default: 0 }, 
        consequences: { type: Number, default: 0 }, 
        techniques: { type: Number, default: 0 }, 
        fake: { type: Number, default: 0 }, 
        contact: { type: Number, default: 0 }, 
        requests: { type: Number, default: 0 }, 
        protection: { type: Number, default: 0 }, 
        practice: { type: Number, default: 0 }, 
        evaluation: { type: Number, default: 0 }, 
    },    
    grandparent: {
        intro: { type: Number, default: 0 }, 
        challenge: { type: Number, default: 0 },  
        concepts: { type: Number, default: 0 }, 
        consequences: { type: Number, default: 0 }, 
        techniques: { type: Number, default: 0 }, 
        protection: { type: Number, default: 0 }, 
        flags: { type: Number, default: 0 }, 
        practice: { type: Number, default: 0 }, 
        evaluation: { type: Number, default: 0 }, 
    },     
    tech: {
        intro: { type: Number, default: 0 }, 
        challenge: { type: Number, default: 0 },  
        concepts: { type: Number, default: 0 }, 
        consequences: { type: Number, default: 0 }, 
        techniques: { type: Number, default: 0 }, 
        protection: { type: Number, default: 0 }, 
        signs: { type: Number, default: 0 }, 
        practice: { type: Number, default: 0 }, 
        evaluation: { type: Number, default: 0 }, 
    }
  },
  modulePageTimes: { // marks the progress of each module
    identity: {
        intro_Times: [{
            page: String, 
            startTime: Date, 
            endTime: Date, 
            durationMilliseconds: Number,
            durationFormatted: String
        }],
        intro2_Times: [{
            page: String, 
            startTime: Date, 
            endTime: Date, 
            durationMilliseconds: Number,
            durationFormatted: String
        }],
        challenge_Times: [{
            page: String, 
            startTime: Date, 
            endTime: Date, 
            durationMilliseconds: Number,
            durationFormatted: String
        }],
        challenge2_Times: [{
            page: String, 
            startTime: Date, 
            endTime: Date, 
            durationMilliseconds: Number,
            durationFormatted: String
        }],
        challenge3_Times: [{
            page: String, 
            startTime: Date, 
            endTime: Date, 
            durationMilliseconds: Number,
            durationFormatted: String
        }],
        sub_learn_Times: [{
            page: String, 
            startTime: Date, 
            endTime: Date, 
            durationMilliseconds: Number,
            durationFormatted: String
        }],
        sub_learn2_Times: [{
            page: String, 
            startTime: Date, 
            endTime: Date, 
            durationMilliseconds: Number,
            durationFormatted: String
        }],
        sub_learn3_Times: [{
            page: String, 
            startTime: Date, 
            endTime: Date, 
            durationMilliseconds: Number,
            durationFormatted: String
        }],
        sub_learn4_Times: [{
            page: String, 
            startTime: Date, 
            endTime: Date, 
            durationMilliseconds: Number,
            durationFormatted: String
        }],
        sub_learn5_Times: [{
            page: String, 
            startTime: Date, 
            endTime: Date, 
            durationMilliseconds: Number,
            durationFormatted: String
        }],
        sub_learn6_Times: [{
            page: String, 
            startTime: Date, 
            endTime: Date, 
            durationMilliseconds: Number,
            durationFormatted: String
        }],
        sub_learn7_Times: [{
            page: String, 
            startTime: Date, 
            endTime: Date, 
            durationMilliseconds: Number,
            durationFormatted: String
        }],
        sub_learn8_Times: [{
            page: String, 
            startTime: Date, 
            endTime: Date, 
            durationMilliseconds: Number,
            durationFormatted: String
        }],
        sub2_learn_Times: [{
            page: String, 
            startTime: Date, 
            endTime: Date, 
            durationMilliseconds: Number,
            durationFormatted: String
        }],
        sub2_learn2_Times: [{
            page: String, 
            startTime: Date, 
            endTime: Date, 
            durationMilliseconds: Number,
            durationFormatted: String
        }],
        sub2_learn3_Times: [{
            page: String, 
            startTime: Date, 
            endTime: Date, 
            durationMilliseconds: Number,
            durationFormatted: String
        }],
        sub2_learn4_Times: [{
            page: String, 
            startTime: Date, 
            endTime: Date, 
            durationMilliseconds: Number,
            durationFormatted: String
        }],
        sub2_learn5_Times: [{
            page: String, 
            startTime: Date, 
            endTime: Date, 
            durationMilliseconds: Number,
            durationFormatted: String
        }],
        sub2_learn6_Times: [{
            page: String,
            startTime: Date,
            endTime: Date,
            durationMilliseconds: Number,
            durationFormatted: String
        }],
        sub2_learn7_Times: [{
            page: String,
            startTime: Date,
            endTime: Date,
            durationMilliseconds: Number,
            durationFormatted: String
        }],
        sub2_learn8_Times: [{
            page: String,
            startTime: Date,
            endTime: Date,
            durationMilliseconds: Number,
            durationFormatted: String
        }],
        sub2_learn9_Times: [{
            page: String,
            startTime: Date,
            endTime: Date,
            durationMilliseconds: Number,
            durationFormatted: String
        }],
        sub2_learn10_Times: [{
            page: String,
            startTime: Date,
            endTime: Date,
            durationMilliseconds: Number,
            durationFormatted: String
        }],
        sub2_learn11_Times: [{
            page: String,
            startTime: Date,
            endTime: Date,
            durationMilliseconds: Number,
            durationFormatted: String
        }],
        sub2_learn12_Times: [{
            page: String,
            startTime: Date,
            endTime: Date,
            durationMilliseconds: Number,
            durationFormatted: String
        }],
        sub2_learn13_Times: [{
            page: String,
            startTime: Date,
            endTime: Date,
            durationMilliseconds: Number,
            durationFormatted: String
        }],
        sub2_learn14_Times: [{
            page: String,
            startTime: Date,
            endTime: Date,
            durationMilliseconds: Number,
            durationFormatted: String
        }],
        sub2_learn15_Times: [{
            page: String,
            startTime: Date,
            endTime: Date,
            durationMilliseconds: Number,
            durationFormatted: String
        }],
        sub2_learn16_Times: [{
            page: String,
            startTime: Date,
            endTime: Date,
            durationMilliseconds: Number,
            durationFormatted: String
        }],
        sub3_learn_Times: [{
            page: String,
            startTime: Date,
            endTime: Date,
            durationMilliseconds: Number,
            durationFormatted: String
        }],
        sub3_learn2_Times: [{
            page: String,
            startTime: Date,
            endTime: Date,
            durationMilliseconds: Number,
            durationFormatted: String
        }],
        sub3_learn3_Times: [{
            page: String,
            startTime: Date,
            endTime: Date,
            durationMilliseconds: Number,
            durationFormatted: String
        }],
        sub3_activity_Times: [{
            page: String,
            startTime: Date,
            endTime: Date,
            durationMilliseconds: Number,
            durationFormatted: String
        }],
        sub3_learn4_Times: [{
            page: String,
            startTime: Date,
            endTime: Date,
            durationMilliseconds: Number,
            durationFormatted: String
        }],
        sub3_learn5_Times: [{
            page: String,
            startTime: Date,
            endTime: Date,
            durationMilliseconds: Number,
            durationFormatted: String
        }],
        sub3_learn6_Times: [{
            page: String,
            startTime: Date,
            endTime: Date,
            durationMilliseconds: Number,
            durationFormatted: String
        }],
        sub3_learn7_Times: [{
            page: String,
            startTime: Date,
            endTime: Date,
            durationMilliseconds: Number,
            durationFormatted: String
        }],
        sub3_learn8_Times: [{
            page: String,
            startTime: Date,
            endTime: Date,
            durationMilliseconds: Number,
            durationFormatted: String
        }],
        sub3_learn9_Times: [{
            page: String,
            startTime: Date,
            endTime: Date,
            durationMilliseconds: Number,
            durationFormatted: String
        }],
        sub3_learn10_Times: [{
            page: String,
            startTime: Date,
            endTime: Date,
            durationMilliseconds: Number,
            durationFormatted: String
        }],
        sub3_learn11_Times: [{
            page: String,
            startTime: Date,
            endTime: Date,
            durationMilliseconds: Number,
            durationFormatted: String
        }],
        sub3_learn12_Times: [{
            page: String,
            startTime: Date,
            endTime: Date,
            durationMilliseconds: Number,
            durationFormatted: String
        }],
        sub3_learn13_Times: [{
            page: String,
            startTime: Date,
            endTime: Date,
            durationMilliseconds: Number,
            durationFormatted: String
        }],
        explore_Times: [{
            page: String, 
            startTime: Date, 
            endTime: Date, 
            durationMilliseconds: Number,
            durationFormatted: String
        }],
        explore2_Times: [{
            page: String, 
            startTime: Date, 
            endTime: Date, 
            durationMilliseconds: Number,
            durationFormatted: String
        }],
        explore3_Times: [{
            page: String, 
            startTime: Date, 
            endTime: Date, 
            durationMilliseconds: Number,
            durationFormatted: String
        }],
        explore4_Times: [{
            page: String, 
            startTime: Date, 
            endTime: Date, 
            durationMilliseconds: Number,
            durationFormatted: String
        }],
        evaluation_Times: [{
            page: String, 
            startTime: Date, 
            endTime: Date, 
            durationMilliseconds: Number,
            durationFormatted: String
        }],
        evaluation2_Times: [{
            page: String, 
            startTime: Date, 
            endTime: Date, 
            durationMilliseconds: Number,
            durationFormatted: String
        }],
        reflect_Times: [{
            page: String,
            startTime: Date,
            endTime: Date,
            durationMilliseconds: Number,
            durationFormatted: String
        }],
        certificate_Times: [{
            page: String,
            startTime: Date,
            endTime: Date,
            durationMilliseconds: Number,
            durationFormatted: String
        }],
    },       
    romance: [{ page: String, startTime: Date, endTime: Date, duration: Number }],
    phishing: [{ page: String, startTime: Date, endTime: Date, duration: Number }],
    grandparent: [{ page: String, startTime: Date, endTime: Date, duration: Number }],
    sales: [{ page: String, startTime: Date, endTime: Date, duration: Number }],

    // identity: [{
    //     page: { type: String, default: 'pageURL' },
    //     startTime: { type: Date, default: Date.now },
    //     endTime: { type: Date, default: Date.now },
    //     duration: { type: Number, default: 0 },
    // }],      
    // romance: [{
    //     page: { type: String, default: 'pageURL' },
    //     startTime: { type: Date, default: Date.now },
    //     endTime: { type: Date, default: Date.now },
    //     duration: { type: Number, default: 0 },
    // }],       
    // phishing: [{
    //     page: { type: String, default: 'pageURL' },
    //     startTime: { type: Date, default: Date.now },
    //     endTime: { type: Date, default: Date.now },
    //     duration: { type: Number, default: 0 },
    // }],      
    // grandparent: [{
    //     page: { type: String, default: 'pageURL' },
    //     startTime: { type: Date, default: Date.now },
    //     endTime: { type: Date, default: Date.now },
    //     duration: { type: Number, default: 0 },
    // }],   
    // sales: [{
    //     page: { type: String, default: 'pageURL' },
    //     startTime: { type: Date, default: Date.now },
    //     endTime: { type: Date, default: Date.now },
    //     duration: { type: Number, default: 0 },
    // }],   
  },

  // profile: {
  //   name: String,
  //   gender: String,
  //   location: String,
  //   website: String,
  //   picture: String
  // }
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
 * Helper method for getting user's gravatar.
 */
// userSchema.methods.gravatar = function gravatar(size) {
//   if (!size) {
//     size = 200;
//   }
//   if (!this.email) {
//     return `https://gravatar.com/avatar/00000000000000000000000000000000?s=${size}&d=retro`;
//   }
//   const md5 = crypto.createHash('md5').update(this.email).digest('hex');
//   return `https://gravatar.com/avatar/${md5}?s=${size}&d=retro`;
// };

const User = mongoose.model('User', userSchema);

module.exports = User;
