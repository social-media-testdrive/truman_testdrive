const hintsList = [
  {
    element: '#hint1',
    hint: `Some social media sites also have a page where you can track the time
    you have spent using the site or app. You can even set daily time limit
    reminders!`,
    hintPosition: "middle-middle",
    audioFile: ['CUSML.10.4.10.mp3']
  },
  {
    element: '#hint2',
    hint: `It’s important to be mindful of how much time you spend on social
    media. Think about how to balance social media use with the time you spend
    on other activities, like hanging out with your friends face-to-face!`,
    hintPosition: "middle-middle",
    audioFile: ['CUSML.10.4.11.mp3']
  },
  {
    element: '#hint3',
    hint: `Signs that you need a break from social media might include things
    like missing time with family or friends, feeling sad, anxious, or tired, or
    struggling to stay on top of homework and chores.`,
    hintPosition: "middle-middle",
    audioFile: ['CUSML.10.4.12.mp3']
  },
  {
    element: '#reminderTimeSelectField',
    hint: `Take a break or disconnect if you think you have been using it too
    much!`,
    hintPosition: "middle-middle",
    audioFile: ['CUSML.10.4.13.mp3']
  }
];

//activating a normal dropdown (the one used in the habits module activity page)
$('.ui.selection.dropdown').dropdown();
