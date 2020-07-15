const nextPageURL = 'modual';
const stepsList = [
  {
    intro: `Now you get to explore the TestDrive timeline! You can read
    what others have posted, respond, or make your own posts.`
  },
  {
    intro: `As you look through the timeline, see if you can find
    features that grab your attention and think about what you can do to
    build healthy social media habits.`
  }
];

function additionalOnBeforeExit() {
  freePlayPageViewTimer = Date.now();
  //record this date as the start of the habits timeline
  const jqhxr = $.post("/habitsTimer", {
    habitsStart: freePlayPageViewTimer,
    _csrf : $('meta[name="csrf-token"]').attr('content')
  });
  jqhxrArray.push(jqhxr);
}
