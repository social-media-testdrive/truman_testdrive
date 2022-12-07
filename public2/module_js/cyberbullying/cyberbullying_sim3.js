const nextPageURL = 'trans_script';


const stepsList = [
  {
    element: '#step1',
    intro: `You have one last friend request!`,
    position: 'right',
    scrollTo: 'tooltip',
    audioFile: ['']
  },
  {
    element: '#step2',
    // intro: `You have recently seen that some people keep saying mean
    // things about Dylan. A group of friends from school are bullying
    // Dylan on social media.`,
    intro: `A user named Harmony Anderson who has requested to be your friend.`,
    position: 'right',
    scrollTo: 'tooltip',
    audioFile: ['CUSML.6.3.1.mp3']
  },
  {
    element: '#step3',
    // intro: `<b>Cyberbullying</b> is when someone posts or shares
    // negative things about someone else online. <br>The <b>bully</b> may
    // use digital devices, sites, or apps. The bully often does this again
    // and again to the same person.`,
    intro: `Lets investigate her account to see who she is.`,
    position: 'right',
    scrollTo: 'tooltip',
    audioFile: ['CUSML.6.3.2.mp3']
  },
  {
    element: '#harmony-page',
    intro: `Harmony is an example of a <b>troll</b> we attributed to the Russian Internet Research Agency in March 2020 and worked with Twitter to have her suspended.`,
    position: 'right',
    scrollTo: 'tooltip',
    audioFile: ['CUSML.6.3.3.mp3']
  },
  {
    element: '#harmony-pic',
    intro: `Harmony poses as a <b>young woman</b>. This is a common tactic of internet trolls and bots. They sell disinformation in the same way advertisers sell their products`,
    position: 'left',
    scrollTo: 'tooltip',
    audioFile: ['CUSML.6.3.5.mp3']
  },
  {
    element: '#twitterNav',
    intro: `Notice harmony's profile statistics. Unlike Elvis, it seems like she actually has a lot of followers.`,
    position: 'top',
    scrollTo: 'tooltip',
    audioFile: ['CUSML.6.3.6.mp3']
  },
  {
    element: '#harmony-page',
    intro: `Check out her list of followers by pressing on "Followers" and you'll notice that they all look like bots. <b>Bots</b> are made to follow and like eachother's content. Then click the "X" in the top right corner to exit out of the menu.`,
    position: 'right',
    scrollTo: 'tooltip',
    audioFile: ['CUSML.6.3.6.mp3']
  },
  {
    element: '#opinion',
    intro: `She has very <b>strong political opinions</b> and sets herself up in direct <b>opposition</b> to an extreme version of people on the other side of the political divide. Harmony’s goal is to make us more disgusted with one another and make meaningful compromise more difficult.`,
    position: 'right',
    scrollTo: 'tooltip',
    audioFile: ['CUSML.6.3.7.mp3']
  },
  {
    element: '#postButtons',
    intro: `Unwitting legitimate accounts react to the content posted by the troll accounts, e.g., re-sharing it or interacting directly with them. This will turn the <b>disinformation seeds planted</b> by the malicious actor into an <b>organic disinformation campaign</b> where content is shared by both troll accounts and legitimate users`,
    position: 'right',
    scrollTo: 'tooltip',
    audioFile: ['CUSML.6.3.6.mp3']
  },
  {
    element: '#decline',
    intro: `This is a troll, you should decline this request`,
    position: 'right',
    scrollTo: 'tooltip',
    audioFile: ['CUSML.6.3.6.mp3']
  }
];
