# DART Learn

The DART Learn is a a web-based online learning platform with learning modules based on the DART Curriculum. Each learning module will be dedicated to one topic of online deception, starting with a 60-second video to give a motivational, engaging, and simple overview of the topic, aimed at our older adult demographic. Longer video tutorials given by the domain experts in our team, reading materials and resource links will also be provided for users who would want to spend more time on the learning platform. Our goal is to deliver a dynamic, interactive, and contextually meaningful learner-centered environment designed for older adults with their input.

This current iteration is to practise building the DART Learn.

Special thanks to Sahat Yalkabov and his [Hackathon Starter](https://github.com/sahat/hackathon-starter) project, which provided the basic organization for this project.

# Live Demo
- [Primary Testing Server: dart.socialsandbox.xyz](https://dart.socialsandbox.xyz/)
- [Secondary Testing Server: dart-test.socialsandbox.xyz](https://dart-test.socialsandbox.xyz/)

# Install DART
To install DART in local, please follow this tutorial: https://docs.google.com/document/d/1li4ZuqGzivha9MD24sF4sVXoqHNllKCR97BJCRThvXY/edit?usp=sharing

# Tech Stack
Node.js, Express.js, Passport.js, Pug, Fomantic UI (community fork of Semantic UI), CSS, jQuery, MongoDB, AWS Lightsail, Polly, Lambda, and S3 Bucket

# Platform Features

The platform is designed around a modular structure, offering a mix of interactive content types for each learning module (aka "mission") including videos, reading materials, quizzes, and activities across various sections. The sections for each mission are generally: Challenges (prequiz), Concepts, Consequences, Techniques, Protection, Reporting, Practice, and Evaluation (postquiz).

The learning modules utilize a single-page app filled with different reusuable [templates](#page-templates). Templates are designed for desktop and tablet compatibility.

User Profile and Account Management: User profiles with email, username, password, badges, certificates, and progress tracking. Also guest logins for users to start learning without making an account. User can also "Continue with Google" to make account and then later create password or unlink/link to account. Note: Google OAuth is currently in testing mode so only approved google emails are able to log in this way

*Features like email verification, account recovery, guest-to-full-account conversion, and auto account merging (if user created account with google and then tries to create new profile with the gmail instead of giving error telling user to log in with google and set password it will set password for previously created account) slated for future development. 

*New developers should focus on understanding the modular content structure and reusable templates.* 

# Page Templates

[Templates Doc](https://docs.google.com/document/d/1C4lpmU7KJUgfArYm283H2awNoaDJdBx93WfDHMsQBUQ/edit#heading=h.ern9rmkx3vrt)

Includes responsive templates for learn pages, emails, text messages, interactive activities, and quiz questions.
*currently just pictures of these pages but will add the code directly to it later

# Codebase Structure

The codebase is structured following the Model-View-Controller design (MVC) pattern. The **Model** folder contains the structure of the database where all the information about users are stored. The **View** is the presentation layer implemented using the templating engines like pug. The **Controllers** act as the intermediaries between models and views handling incoming requests (login, taking a module, updating profile details, etc) and deciding which view to render in response.

Note: All folders besides the ones below are legacy from Social Media Testdrive

| Name                     | Description                                                |
|--------------------------|------------------------------------------------------------|
| public/                  | Static assets (css, js, json, img, fonts, etc)             |
| views/                   | Contains all of the pages                                 |
| views/account/           | Account access pages like login, sign up, forgot password, profile |
| views/module-content/    | Pages for each learning module |
| views/partials/          | Header, footer, and flash message, and navigation bar pug partials |
| views/ui_layout.pug      | Template general dart pages [pug extend](https://pugjs.org/language/inheritance.html) ie pages outside of modules with DART icon header |
| views/module_layout.pug         | Template learning module pages [pug extend](https://pugjs.org/language/inheritance.html).    |
| views/home.pug           | Site home page.                                        |
| app.js                   | The main application file. Where the express routes are.    |
| .env               | Environment-specific configuration values, such as database credentials, API keys, and other sensitive data   |
| .gitignore               | Specifies intentionally untracked files that Git should ignore   |
| app.js                   | The main application file. Where the express routes are.    |
| package.json             | NPM dependencies.                                          |
| package-lock.json        | Contains exact versions of NPM dependencies in package.json.|

# Important Static Assets

| Name                     | Description                                                |
|--------------------------|------------------------------------------------------------|
| public/                  | Static assets (css, js, json, img, fonts, etc)             |
| public/css/dart.css    | CSS rules for entire site                        |
| public/css/font-size.css    | CSS rules for site font for entire site                       |
| public/css/module.css    | CSS rules for learning modules                      |
| public/css/dart_quiz.css    | CSS rules for quizzes                    |
| public/css/account-access.css    | CSS rules for account access pages                  |
| public/css/nav_buttons.css    | CSS rules for buttons                    |
| public/css/certificate.css    | CSS rules for module certificates                   |
| public/css/example-emails.css    | CSS rules for example emails templates originally made for idetity theft module                  |
| public/css/identity_theft_explor.css    | CSS rules for idetity theft practice email simulation                  |
| public/module_js/     | Scripts for modules                 |
| public/module_js/module_quiz     | Scripts for quiz template used throughout site                 |
| public/module_js/identity-theft.js    | Main script for single page module and voice over functionality. Need to rename and seperate concerns later             |
| public/fonts     | Site font otfs                   |
| public/images     | Client-side images here.                           |
| public/json     | JSON for module quizzes & narration speech marks for text-to-speech highlighting                        |
| public/pdf     | Module Learning Materials                      |
| public/quizPartials     | html email or text examples for quiz questions                    |
| public/sound     | sound effect for badge unlocks & activities                  |


# Client-side Libraries
- [Fomantic UI](https://fomantic-ui.com/) - Styling, components, and icons
- [jQuery](https://jquery.com/) - JS library to interact with HTML elements
- [jQuery Circle Progress](https://kottenator.github.io/jquery-circle-progress/) - Circular progress bars
- [Video.js](https://videojs.com/) - Video player
- [Slick.js](https://kenwheeler.github.io/slick/) - Responsive slider carousel used in module pages
- [Html2pdf.js](https://ekoopmans.github.io/html2pdf.js/) - Used to enable dowloading of dynamically generated html certificates

# List of Packages
| Package                         | Description                                                             |
| ------------------------------- | ------------------------------------------------------------------------|
| @node-rs/bcrypt                 | ???                                                                    |
| async                           | ???                                                                    |
| aws-sdk                         | ???                                                                    |
| axios                           | HTTP client                                                            |
| bcrypt                           | ???                                                                   |
| bluebird                           | ???                                                                 |
| body-parser                     | Node.js body parsing middleware.                                       |
| chalk                         | ???                                                                      |
| chart.js                     | ???                                                                       |
| cheerio                         | ??? Scrape web pages using jQuery-style syntax.                        |
| compression                     | Node.js compression middleware.                                        |
| connect-mongo                   | MongoDB session store for Express.                                     |
| cookie-session                  | ???                                                                    |
| csurf                           | ???                                                                    |
| csv-write-stream                           | ???                                                                    |
| csv-writer                           | ???                                                                    |
| csvtojson                           | ???                                                                    |
| dotenv                          | Loads environment variables from .env file.                             |
| express                         | Node.js web framework.                                                  |
| express-flash                   | Provides flash messages for Express.                                    |
| express-rate-limit              | ??? Rate limiting middleware for abuse protection.                          |
| express-session                 | Simple session middleware for Express.                                  |
| express-validator                           | ???                                                                    |
| fomantic-ui                           | ???                                                                    |
| jshint                           | ???                                                                    |
| errorhandler                           | ???                                                                    |
| lodash                          | ??? A utility library for working with arrays, numbers, objects, strings.   |
| lusca                           | ??? CSRF middleware.                                                        |
| mailchecker                     | Verifies that an email address is valid and not a disposable address.   |
| mocha                           | ??? Test framework.                                                         |
| moment                          | ??? Parse, validate, compute dates and times.                               |
| mongoose                        | MongoDB ODM.                                                            |
| morgan                          | ??? HTTP request logger middleware for node.js.                             |
| nocache                          | Middleware to turn off caching                                                                    |
| node-schedule                           | ???                                                                    |
| nodemailer                      | ??? Node.js library for sending emails.                                     |
| passport                        | Simple and elegant authentication library for node.js.                  |
| passport-google-oauth           | Sign-in with Google plugin.                                             |
| passport-oauth                  | Allows you to set up your own OAuth 1.0a and OAuth 2.0 strategies.      |
| passport-oauth2         | ???      |
| passport-oauth2-refresh         | A library to refresh OAuth 2.0 access tokens using refresh tokens.      |
| pug                             | Template engine for Express.                                            |
| twit                           | ???                                                                    |
| ua-parser-js                           | ???                                                                    |
| useragent                           | ???                                                                    |
| validator                       | ??? A library of string validators and sanitizers.                          |

# Tutorials

## Dartutor
[Git repository](https://github.com/jossTripoli/dartutor?tab=readme-ov-file) -  Basic node app with weekly tutorials to learn technology to work on DART Learn platform created for Fall 2023 RAs

## Quiz Generation

Create a JSON file and name it after the section you're creating. Put the files in main -> public -> json -> [module-name]. 

All questions will be 1 of 3 types. Fill in the json template with the your specific question's info. 

Note: For the progress key you will need to cacluate this value. For challenge and evaluation sections it is just 100 divided by the number of questions. For the sections count the total number of pages including each quiz question in this count. Then divide 100 by this number to determine the increment.

### 2 options
Can be used for true/false, yes/no, real/scam, etc
```
"1": {
      "progress": 20,
      "type": "yes_no",
      "partial": "q4.html",
      "prompt": "4. Is this email a scam?",
      "choices": {
        "yes": {
          "text": "Yes"
        },
        "no": {
          "text": "No"
        }
      },
      "explanation": "<h1>The correct answer is Yes. This email is a scam.</h1><p>There are three main warning signs that this email is a scam. First, this email does not address a person by name. Second, this email asks you to click on a link to update your account information. Third, this email claims some fraudulent transactions on your account without providing specific details, creating a sense of threat to get you to click on the provided link.</p>",
      "correctResponse": "yes"
  },

```

### 4 options multiple choice:
```
  "7": {
      "progress": 50,
      "type": "abcd",
      "partial": "none",
      "prompt": "7. What makes a password complex and secure?",
      "choices": {
          "a": {
              "text": "A. Less than 5 characters"
          },
          "b": {
              "text": "B. Including your first name"
          },
          "c": {
              "text": "C. More than 8 characters, including numbers and symbols"
          },
          "d": {
              "text": "D. Including your date of birth"
          }
      },
      "explanation": "<h1>The correct answer is C.</h1><p>A strong password should be long (at least 8 characters), include a mix of uppercase and lowercase letters, numbers, and special characters to protect against potential hacking attempts.</p>",
      "correctResponse": "c"
  },
```

### 5 options multi-select: 
```
  "4": {
      "progress": 8.3333,
      "type": "multi_select",
      "partial": "none",
      "prompt": "1. Select all sensitive personal information that can be used for identity theft.",
      "choices": {
          "0": {
              "text": "A. Dietary Preferences",
              "explanation": "This information is generally not considered sensitive enough to be used for identity theft. It's a personal preference rather than a unique identifier."
          },
          "1": {
              "text": "B. Mother’s maiden name",
              "explanation": "Because mother’s maiden name is often used as a common security question to access accounts or reset passwords, identity theft scammers can use your mother's maiden name to access your sensitive information and accounts."
          },
          "2": {
              "text": "C. Full name",
              "explanation": "Identity theft scammers can use your full name to impersonate you in situations such as opening accounts, making purchases, or attempting to gain access to your personal information."
          },
          "3": {
              "text": "D. Home address",
              "explanation": "Identity theft scammers can use your home address to commit fraud, such as applying for credit cards or loans in your name, redirecting mails, or engaging in scams that target your physical residence."
          },
          "4": {
              "text": "E. Date of birth",
              "explanation": "Your date of birth can be a key piece of information for identity theft scammers to carry out malicious activities, such as applying for credit, opening accounts, or committing fraud, as it helps them establish your identity."
          }
      },
      "correctResponse": ["1", "2", "3", "4"],
      "theAnswers": "B, C, D, E"
  },
```
## Voiceover Generation

Run this [python function](https://github.com/jossTripoli/gen-text-to-speech/blob/main/aws_lambda/main/LambdaHandler.py) in AWS Lambda being sure to give it full access to polly and s3 bucket (configuartion -> permissions -> click the role name -> add permissions -> add policies). Replace the variables "bucket_name" with your bucket, "folder" with the name of the folder in the bucket, and "text_source" with your text. Then run it (you can click test in the lambda ui to do this) and it will create the voice over mp3s and speech marks for the three avatars and save it into the s3 bucket.

## Highlighting Speech JSON Creation

Clone this [python program for formating AWS speechmark JSON](https://github.com/jossTripoli/formatPollyJson)

Download the agent daring speech marks from the AWS bucket for the page you are working on. Open the file and copy the text into format_daring.py for the "original_string" variable. Then run the program by doing: 
```
python format_daring.py
```

Next open the generated daring.json and copy it to your modules narration.json for the page's daring JSON. Copy the id's for each pug element to the corresponding words to fill in the "element" values (for titles the id should be on the title span itself while for all other text it should be on the parent element). They will be in the format "narrate-pageNumber-pageName". When you're done this run locally to ensure the sync is good. Most of the times it is great but I've found some words the speech marks are a little off. Like for the word "number" I will subtract 200ms to fix it. 

When the daring JSON is perfect copy it into first.json. Then download the Intrepid and Valiant JSON and copy them into format_auto_intrepid_valiant.py as the "intrepid_string" and "valiant__string". Then run the program by doing: 
```
python format_auto_intrepid_valiant.py
```

Copy the json from intrepid.json and valiant.json into narration.json for the page's intrepid and valiant JSON and you're good!
