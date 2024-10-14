// for json file reading
const fs = require("fs");
const util = require("util");
const User = require("../models/User");

/**
 * GET /about/:page?/:modId
 * Render the about pages for the modules.
 */
exports.getAbout = (req, res) => {
  const modId = req.params.modId;

  const introPage = `module-content/${modId}/about.pug`;
  const title = "About";

  res.render(introPage, { title });
};

/**
 * GET /about/:page?/:modId
 * Render the about pages for the modules.
 */
exports.getReferences = (req, res) => {
  const modId = req.params.modId;

  const introPage = `module-content/${modId}/references.pug`;
  const title = "References";

  res.render(introPage, { title });
};

// Handler for '/getModule' route
exports.getModule = async (req, res) => {
  // const module = req.query.module;
  // const page = req.query.page;
  const { module, section, page } = req.query;
  console.log("**module: " + module);
  console.log("section: " + section);
  console.log("page: " + page);
  let numPages;

  // each quiz question is being counted as a page too so we need to add those
  if (section === "challenge") {
    // intro, 5 quiz questions, takeaways
    numPages = 7;
    if (module === "medication") {
      numPages = 5;
    }
  } else if (section === "concepts") {
    if (module === "identity") {
      numPages = 10;
    } else if (module === "romance") {
      numPages = 11;
    } else if (module === "grandparent") {
      numPages = 9;
    } else if (module === "tech") {
      numPages = 11;
    } else if (module === "medication") {
      numPages = 14;
    }
  } else if (section === "consequences") {
    numPages = 8;
    if (module === "tech") {
      numPages = 10;
    }
  } else if (section === "fake") {
    numPages = 12;
  } else if (section === "contact") {
    numPages = 16;
  } else if (section === "requests") {
    numPages = 13;
  } else if (section === "techniques") {
    numPages = 12;

    if (module === "tech") {
      numPages = 13;
    } else if (module === "medication") {
      numPages = 13;
    }
  } else if (section === "signs") {
    numPages = 19;

    if (module === "tech") {
      numPages = 14;
    }else if (module === "medication") {
      numPages = 12;
    }
  } else if (section === "protection") {
    if (module === "identity") {
      numPages = 10;
    } else if (module === "romance") {
      numPages = 12;
    } else if (module === "grandparent") {
      numPages = 15;
    } else if (module === "tech") {
      numPages = 18;
    } else if (module === "medication") {
      numPages = 17;
    }
  } else if (section === "reporting") {
    numPages = 9;
  } else if (section === "practice") {
    if (module === "grandparent" || module === "medication") {
      numPages = 8;
    } else {
      numPages = 12;
    }
  } else if (section === "evaluation") {
    if (module === "identity") {
      numPages = 12;
    } else if (module === "romance") {
      numPages = 12;
    } else if (module === "grandparent") {
      numPages = 12;
    } else if (module === "tech") {
      numPages = 12;
    } else if (module === "medication") {
      numPages = 12;
    }
  }

  const modulePage = `module-content/${module}/${section}.pug`;

  const currentTime = getCurrentTime();
  const currentDate = getCurrentDate();
  const futureDate = getFutureDate();

  const data = await fs.readFileAsync(
    `${__dirname}/../public/json/` + module + `/` + section + `.json`
  );
  quizData = JSON.parse(data.toString());

  // make it for all sections array json object later
  const narration_data = await fs.readFileAsync(
    `${__dirname}/../public/json/` + module + `/narration.json`
  );
  const fullJson = JSON.parse(narration_data.toString());
  // provide speech marks for complete single page app module section
  speechMarks = fullJson[section];

  if (section === "practice") {
    console.log("YOOO This is the practice section");
    const currentDate = new Date();
    const currentTime = getCurrentTime();

    const oneDayAgo = new Date(currentDate.getTime() - 24 * 60 * 60 * 1000);
    const twoDaysAgo = new Date(
      currentDate.getTime() - 24 * 2 * 60 * 60 * 1000
    );
    const threeDaysAgo = new Date(
      currentDate.getTime() - 24 * 3 * 60 * 60 * 1000
    );
    const fourDaysAgo = new Date(
      currentDate.getTime() - 24 * 4 * 60 * 60 * 1000
    );

    const emails = [
      {
        index: 0,
        sender: "Agent Intrepid",
        subject: "Great Job!",
        date: currentTime,
        from: "<intrepid@gmail.com>",
        content:
          "<p>Hello, </p><p>Just wanted to let you know you're doing great!</p><p>Best,</p><p>Agent Intrepid<button class='ui green button hideme warning-button intrepid-1'>Review point</button></p>",
        replyHeader: "good",
        replyContent:
          "Replying is okay because this email is legitimate and can be trusted.",
        blockHeader: "warning",
        blockContent:
          "Blocking the sender is not needed for this email because it comes from a legitimate source and can be trusted.",
        reportHeader: "warning",
        reportContent:
          "Reporting as a scam is not needed for this email because it comes from a legitimate source and can be trusted.",
        deleteHeader: "warning",
        deleteContent:
          "Deleting is not needed for this email because it comes from a legitimate source and can be trusted.",
      },
      {
        index: 1,
        sender: "Walmart",
        subject: "URGENT!",
        date: formatDate(oneDayAgo),
        from: "<walmrt@gmail.com>",
        content:
          "<p>Hi customer. This is an URGENT message! <button class='ui red button hideme warning-button walmart-2'>WARNING</button></p><p>Your payment was declined on a recent purchase. Resubmit your credit card details at this link below within 24 hours.</p><p>Click here NOW! <a class='fakeLink' onclick='linkClick()'>http://jdksj6879sh.com</a><button class='ui red button hideme warning-button walmart-3'>WARNING</button></p>",
        replyHeader: "warning",
        replyContent:
          "This email is indicative of an identity theft scam. Replying to the email is dangerous! The safe options would be to block sender, report scam, or delete the email. We can look into why this is a scam.",
        blockHeader: "good",
        blockContent:
          "Blocking this sender is correct because this email is indicative of an identity theft scam. You could also report or delete the email.",
        reportHeader: "good",
        reportContent:
          "Reporting this email is correct because this email is indicative of an identity theft scam. You could also block the sender or delete the email.",
        deleteHeader: "good",
        deleteContent:
          "Deleting this email is correct because this email is indicative of an identity theft scam. You could also block the sender or report it as a scam.",
      },
      {
        index: 2,
        sender: "irs gov",
        subject: "Identity Verification",
        date: formatDate(oneDayAgo),
        from: "<irsgov@gmail.com>",
        content:
          "<p>Dear Tax Payer,<button class='ui red button hideme warning-button irs-2'>WARNING</button></p><p>We’ve noticed your account information is missing or incorrect. We need to verify your account information to file your Tax Refund.</p><p>Please follow <a class='fakeLink' onclick='linkClick()'>this link</a> to verify your info.<button class='ui red button hideme warning-button irs-3'>WARNING</button></p><p>Thanks,</p><p>IRS Team</p><img src='/images/irs.png' alt='irs logo' width='50px'>",
        replyHeader: "warning",
        replyContent:
          "This email is indicative of an identity theft scam. Replying to the email is dangerous! The safe options would be to block sender, report scam, or delete the email. We can look into why this is a scam.",
        blockHeader: "good",
        blockContent:
          "Blocking this sender is correct because this email is indicative of an identity theft scam. You could also report or delete the email.",
        reportHeader: "good",
        reportContent:
          "Reporting this email is correct because this email is indicative of an identity theft scam. You could also block the sender or delete the email.",
        deleteHeader: "good",
        deleteContent:
          "Deleting this email is correct because this email is indicative of an identity theft scam. You could also block the sender or report it as a scam.",
      },
      {
        index: 3,
        sender: "Dropbox",
        subject: "New Sign In Detected",
        date: formatDate(twoDaysAgo),
        from: "<no-reply@dropbox.com>",
        content:
          "<img class='ui tiny centered image' src='/images/Dropbox_logo.svg' /><br /><p>We noticed you logged into dropbox using <b> Chrome on Windows 10 </b> 12:39 PM GMT-04:00 from <b> Orlando Florida, USA. </b><button class='ui green button hideme warning-button dropbox-2'>Review point</button></p><p><b> Note: </b> Your location may be inaccurate since it was estimated using your IP address.</p><p>You can check on this and other login events by visiting your <a class='fakeLink' onclick='linkClick()'>account page</a></p><p>Happy Dropboxing!</p><p>The Dropbox Team</p><p>P.S. Learn how to <a class='fakeLink' onclick='linkClick()'>protect your account</a></p>",
        replyHeader: "good",
        replyContent:
          "Replying is okay because this email is legitimate and can be trusted. We can look into why this is not a scam.",
        blockHeader: "warning",
        blockContent:
          "Blocking the sender is not needed for this email because it comes from a legitimate source and can be trusted. We can look into why this is not a scam.",
        reportHeader: "warning",
        reportContent:
          "Reporting as a scam is not needed for this email because it comes from a legitimate source and can be trusted. We can look into why this is not a scam.",
        deleteHeader: "warning",
        deleteContent:
          "Deleting is not needed for this email because it comes from a legitimate source and can be trusted. We can look into why this is not a scam.",
      },
      {
        index: 4,
        sender: "NCCUstudent",
        subject: "Re: Hi-- Favor",
        date: formatDate(twoDaysAgo),
        from: "<nccustudent@gmail.com>",
        content:
          "<p>How are you doing? Hope you and your family are safe and healthy? I was wondering if I can get a quick favor from you.<button class='ui red button hideme warning-button nccu-2'>WARNING</button></p><p>I am sorry for any inconvenience this will cost you, i am suposed to call you but my phone is bad. I got bad news this morning that I lost a childhood friend to the deadly COVID-19. I want to support the struggling family with a small donation. So, I was going to ask if you could kindly help e send out a donation to them anytime you can today, I’ll refund as soon as I get back.</p><p>I want to donate $500. Can you help me get the donation sent directly to their Cash App account?<button class='ui red button hideme warning-button nccu-3'>WARNING</button></p><p>Thanks, God Bless you.</p><p>Joe Bren</p>",
        replyHeader: "warning",
        replyContent:
          "This email is indicative of an identity theft scam. Replying to the email is dangerous! The safe options would be to block sender, report scam, or delete the email. We can look into why this is a scam.",
        blockHeader: "good",
        blockContent:
          "Blocking this sender is correct because this email is indicative of an identity theft scam. You could also report or delete the email.",
        reportHeader: "good",
        reportContent:
          "Reporting this email is correct because this email is indicative of an identity theft scam. You could also block the sender or delete the email.",
        deleteHeader: "good",
        deleteContent:
          "Deleting this email is correct because this email is indicative of an identity theft scam. You could also block the sender or report it as a scam.",
      },
      {
        index: 5,
        sender: "iPhone 14",
        subject: "Congrats!",
        date: formatDate(threeDaysAgo),
        from: "<4kbug82ob@hotmail.com>",
        content:
          "<div id='iphone-email'><div class='ui basic center aligned segment'><h1 class='iphone-header font'> iPhone 14 Tester</h1><h2 class='font' id='congrats'> Congratulations</h2><h3 class='font'> YOU HAVE BEEN SELECTED TO GET OUR EXCLUSIVE REWARD</h3><h3 class='font'> You simply need to answer a few Quick questions regarding your experience with us to get a brand- new <span class='pink-text font'> iPhone 14 Pro</span></h3><br /><br /><button class='ui big font button fakeLink' id='confirmButton' onclick='linkClick()'>CONTINUE FOR FREE &gt;&gt;</button><br /><br /></div></div><button class='ui red button hideme warning-button iphone-2'>WARNING</button>",
        replyHeader: "warning",
        replyContent:
          "This email is indicative of an identity theft scam. Replying to the email is dangerous! The safe options would be to block sender, report scam, or delete the email. We can look into why this is a scam.",
        blockHeader: "good",
        blockContent:
          "Blocking this sender is correct because this email is indicative of an identity theft scam. You could also report or delete the email.",
        reportHeader: "good",
        reportContent:
          "Reporting this email is correct because this email is indicative of an identity theft scam. You could also block the sender or delete the email.",
        deleteHeader: "good",
        deleteContent:
          "Deleting this email is correct because this email is indicative of an identity theft scam. You could also block the sender or report it as a scam.",
      },
      {
        index: 6,
        sender: "Amazon",
        subject: "Password Assistance",
        date: formatDate(fourDaysAgo),
        from: "<account-update@amazon.com>",
        content:
          "<div id='amazon-header'><img class='ui medium image' id='amazon-logo' src='/images/Amazon_logo.svg' /><h3 id='amazon-assistance'> Password Assistance</h3></div><br /><p>To verify your identity, please use the following code:</p><h1 id='amazon-code'>456459 <button class='ui green button hideme warning-button amazon-2'>Review point</button></h1><p>Amazon takes your account security very seriously. Amazon will never email you to disclose or verify your Amazon password, credit card, or banking account number. If you receive a suspicious email with a link to update your account information, do not click the link - instead, report the email to Amazon for investigation.</p><p>We hope to see you again soon.</p>",
        replyHeader: "good",
        replyContent:
          "Replying is okay because this email is legitimate and can be trusted. We can look into why this is not a scam.",
        blockHeader: "warning",
        blockContent:
          "Blocking the sender is not needed for this email because it comes from a legitimate source and can be trusted. We can look into why this is not a scam.",
        reportHeader: "warning",
        reportContent:
          "Reporting as a scam is not needed for this email because it comes from a legitimate source and can be trusted. We can look into why this is not a scam.",
        deleteHeader: "warning",
        deleteContent:
          "Deleting is not needed for this email because it comes from a legitimate source and can be trusted. We can look into why this is not a scam.",
      },
    ];

    res.render(modulePage, {
      module,
      section,
      page,
      numPages,
      quizData,
      speechMarks,
      currentTime,
      currentDate,
      futureDate,
      emails,
    });
  } else {
    res.render(modulePage, {
      module,
      section,
      page,
      numPages,
      quizData,
      speechMarks,
      currentTime,
      currentDate,
      futureDate,
    });
  }
};

/**
 * POST /completeModuleStatus
 */
exports.completeModuleStatus = async (req, res, next) => {
  console.log("POST /completeModuleStatus *********************");
  try {
    const { modId, section } = req.body;
    console.log("backend modId: " + modId);
    console.log("backend section: " + section);
    const existingUser = await User.findOne({ email: req.user.email });

    if (existingUser) {
      existingUser.moduleStatus[modId][section] = 100;
      await existingUser.save();

      //  also manually update the current session so dont have to do extra requests or log in/out

      req.session.passport.user.moduleStatus[modId][section] =
        existingUser.moduleStatus[modId][section];

      // Save the session
      req.session.save((err) => {
        if (err) {
          return next(err);
        }

        // Redirect or send a success response
        console.log("session saved");
      });

      res.status(200).json({ message: "Module status updated successfully." });
    } else {
      res.status(404).json({ message: "User not found." });
    }
  } catch (err) {
    next(err);
  }
};

exports.getModuleStatus = async (req, res, next) => {
  console.log("GET /ModuleStatus ");
  try {
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      const holdModules = existingUser.moduleStatus;
      let result = [];

      for (let moduleName in holdModules) {
        if (holdModules.hasOwnProperty(moduleName)) {
          let module = holdModules[moduleName];
          let total = Object.keys(module).length;
          let progress = Object.values(module).filter(
            (value) => value === 100
          ).length;
          if (progress > 0) {
            result.push({
              moduleName,
              total,
              progress,
            });
          }
        }
      }

      res.status(200).json(result);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    next(err);
  }
};

// time helper functions

// get time for phone text message like: 12:48 PM
// actually have 32 minutes in the past
function getCurrentTime() {
  // get time 5 - 240 minutes ago
  const now = new Date();
  const randomMinutes = Math.floor(Math.random() * (240 - 5 + 1)) + 5; // Generate a random number between 5 and 240
  const pastTime = new Date(now.getTime() - randomMinutes * 60 * 1000); // Subtract random minutes in milliseconds
  // const options = { hour: 'numeric', minute: '2-digit', hour12: true };
  const estOptions = {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "America/New_York",
  };
  return pastTime.toLocaleString("en-US", estOptions);
}

// get date for emails like: 8/10/2023
function getCurrentDate() {
  const now = new Date();
  const options = {
    month: "numeric",
    day: "numeric",
    year: "numeric",
    timeZone: "America/New_York",
  };
  return now.toLocaleString("en-US", options);
}

function getFutureDate() {
  // get date a week from the current date for the scam quiz emails
  // for example if currentDate is 8/19/2023 this function will return 8/26/2023
  const today = new Date();
  const oneWeekLater = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

  const options = {
    month: "numeric",
    day: "numeric",
    year: "numeric",
    timeZone: "America/New_York",
  };
  return oneWeekLater.toLocaleString("en-US", options);
}

// get date for explore emails like: Aug 10
function formatDate(date) {
  const options = { month: "short", day: "numeric" };
  return date.toLocaleDateString("en-US", options);
}
