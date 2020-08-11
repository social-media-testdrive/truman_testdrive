var stepsList = [
  {
    element: document.querySelectorAll('#step1')[0],
    intro: `Now that you have learned about different privacy settings, let’s
    practice how to change them!`,
    scrollTo:'tooltip',
    position:'left'
  },
  {
    element: document.querySelectorAll('#step1')[0],
    intro: `Click on "Done" and then look for the blue dots&nbsp;<a role='button' tabindex='0'
    class='introjs-hint'><div class='introjs-hint-dot'></div><div
    class='introjs-hint-pulse'></div></a> &nbsp; &nbsp; &nbsp;
    to learn more!`,
    scrollTo:'tooltip',
    position:'left'
  }
];

var hintsList = [
  {
    hint: `If your account is on a “<i>Public</i>” setting, everyone on the
    internet can access your account and see what you post. Right now, it is set
    as a public account.`,
    element: '#hint1',
    hintPosition: 'top-middle'
  },
  {
    hint: `Let’s try changing it to “<i>Private</i>” so that only people you
    approve would be able to see your posts. Slide the button over so
    “<i>Private account</i>” is selected.`,
    element: '#hint2',
    hintPosition: 'bottom-middle'
  },
  {
    hint: `This is where you can change who can contact you on the social media
    site. Try changing the settings to “<i>Friends</i>” or “<i>Friends of
    Friends</i>” so that strangers cannot comment on your posts or send you
    friend requests.`,
    element: '#hint3',
    hintPosition: 'top-middle'
  },
  {
    hint: `Use this setting to control how you share your location information.
    Right now, it is set so that you are putting your location on every post.`,
    element: '#hint4',
    hintPosition: 'middle-middle'
  },
  {
    hint: `You can try turning this off entirely, or restricting who can see
    your location information.`,
    element: '#hint5',
    hintPosition: 'middle-middle'
  }
];

$('.ui.dropdown').dropdown('set selected', '0');
