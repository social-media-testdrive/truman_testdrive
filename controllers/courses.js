/**
 * GET /
 * Courses page.
 */
exports.index = (req, res) => {
  res.render('courses', {
    title: 'Courses'
  });
};


/**
 * GET /courses/:modId/intro
 * Render the intro page for a specific module.
 */
// exports.moduleIntro = (req, res) => {
//   const modId = req.params.modId;
//   const introPath = `${modId}/intro/${modId}_intro`;

//   res.render(introPath, {
//     title: 'Intro'
//   });
// };

/**
 * GET /intro/:modId
 * Render the intro pages for the module.
 */
exports.getIntro = (req, res) => {
  const modId = req.params.modId;
  const pageNum = req.params.page;
  
  const introPage = `${modId}/intro/${modId}_intro${pageNum || ''}`;
  const title = 'Intro';

  res.render(introPage, { title });
};


/**
 * GET /challenge/:modId
 * Render the challenge page for the module.
 */
// exports.getChallenge = async (req, res) => {
//   const modId = req.params.modId;
//   const challengePage = `${modId}/challenge/${modId}_challenge${req.params.page || ''}`;
//   const title = 'Challenge';

//   // You can add additional logic here if needed (e.g., loading quiz data)

//   const currentTime = getCurrentTime();
//   const currentDate = getCurrentDate();

//   res.render(challengePage, { title, currentTime, currentDate });
// };