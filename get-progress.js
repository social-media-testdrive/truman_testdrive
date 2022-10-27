const User = require('./models/User.js');
const Class = require('./models/Class.js');
const mongoose = require('mongoose');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const dotenv = require('dotenv');
dotenv.config({ path: '.env' });

// Console.log color shortcuts
const color_start = '\x1b[33m%s\x1b[0m'; // yellow
const color_success = '\x1b[32m%s\x1b[0m'; // green
const color_error = '\x1b[31m%s\x1b[0m'; // red

// establish initial Mongoose connection
mongoose.connect(process.env.PRO_MONGODB_URI, { useNewUrlParser: true });
// listen for errors after establishing initial connection
const db = mongoose.connection;
db.on('error', (err) => {
    console.error(err);
    console.log('%s MongoDB connection error.');
    process.exit(1);
});

const moduleDictionary = {
    'accounts': 'Accounts and Passwords',
    'advancedlit': 'Responding to Breaking News!',
    'cyberbullying': 'How to be an Upstander',
    'digfoot': 'Shaping your Digital Footprint',
    'digital-literacy': 'News in Social Media',
    'esteem': 'The Ups and Downs of Social Media',
    'habits': 'Healthy Social Media Habits',
    'phishing': 'Scams and Phishing',
    'presentation': 'Online Identities',
    'privacy': 'Social Media Privacy',
    'safe-posting': 'Is it Private Information?',
    'targeted': 'Ads on Social Media',
    'survey-1': 'Knowledge Assessment Survey',
    'extended-fp': 'Behavioral Assessment Timeline',
    'survey-2': 'Behavioral Assessment Survey'
}

/*
  Finds the name of the class this user belongs to via their class access code.
*/
async function getClassNameForUser(user) {
    const classObject = await Class.findOne({ accessCode: user.accessCode }).exec();
    const className = classObject.className;
    return className;
};

async function getDataExport() {
    // STUDY 3 ACCESS CODES:
    const study3_accessCodes = ["mab8W8zT", "sB6sfy3K", "4mAhRk6A", "8oJHaBHo", "hJiUa8SQ", "ddE5BVqr", "ifUqpu2V", "EV4QC2mF", "6LAQ5bN7", "xeab2MSG"]

    console.log(`Successfully connected to db.`)
    console.log(`Starting the data export script...`)
    const currentDate = new Date();
    const outputFilename = `outomeEvaluation-studyProgress` +
        `.${currentDate.getMonth()+1}-${currentDate.getDate()}-${currentDate.getFullYear()}` +
        `.${currentDate.getHours()}-${currentDate.getMinutes()}-${currentDate.getSeconds()}`;
    const outputFilepath = `outputFiles/studyProgress/${outputFilename}.csv`;
    const csvWriter = createCsvWriter({
        path: outputFilepath,
        header: [
            { id: 'class_name', title: 'Class Name' },
            { id: 'access_code', title: 'Access Code' },
            { id: 'username', title: 'Username' },
            { id: 'login', title: 'Most Recent Login' },
            { id: 'C/E', title: 'Control/Experimental' },

            { id: 'module', title: 'Module' },
            { id: 'status_1', title: 'Status' },
            { id: 'date_1', title: 'Date' },

            { id: 'status_2', title: 'Knowledge Assessment Survey' },
            { id: 'date_2', title: 'Date' },

            { id: 'status_3', title: 'Behavioral Assessment Timeline' },
            { id: 'date_3', title: 'Date' },

            { id: 'status_4', title: 'Behavioral Assessment Survey' },
            { id: 'date_4', title: 'Date' },
        ]
    });
    const records = [];
    const users = await User.find({ isStudent: true }).exec();
    // For each student found by the query
    for (const user of users) {
        const className = await getClassNameForUser(user);
        const accessCode = user.accessCode;
        const username = user.username;
        const control = user.control ? "Control" : "Experimental";

        // only do a data export of students in study 2 - Fall 
        if (!study3_accessCodes.includes(accessCode)) {
            continue;
        }

        const record = {
            class_name: className,
            access_code: accessCode,
            username: username,
            'C/E': control
        };

        if (user.log.length !== 0) {
            record.login = user.log[user.log.length - 1].time.toDateString();
        };

        // For each module this user has been assigned (4 modules total)
        for (let i = 1; i <= 4; i++) {
            const assignedModule = user.assignedModules[`module${i}`];

            let assignedModule_NoHyphen = assignedModule.replace('-', '');
            if (i == 1) {
                record[`module`] = moduleDictionary[assignedModule];
            }

            const status = user.moduleProgress[assignedModule_NoHyphen];
            record[`status_${i}`] = status !== "none" ? status : "";
            record[`date_${i}`] = status !== "none" ? user.moduleProgressTimestamps[assignedModule].toDateString() : "";
        }
        records.push(record);
    }
    await csvWriter.writeRecords(records);
    console.log(color_success, `...Data export completed.\nFile exported to: ${outputFilepath}`);
    console.log('Closing db connection.')
    db.close();
}

getDataExport();