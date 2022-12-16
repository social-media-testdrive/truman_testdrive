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
    intro: `A user named Harmony Anderson has requested to be your friend.`,
    position: 'right',
    scrollTo: 'tooltip',
    // audioFile: ['CUSML.6.3.1.mp3']
  },
  {
    element: '#step3',
    // intro: `<b>trolls</b> is when someone posts or shares
    // negative things about someone else online. <br>The <b>bully</b> may
    // use digital devices, sites, or apps. The bully often does this again
    // and again to the same person.`,
    intro: `Lets investigate her account to see who she is. <b>Click the request</b> to continue to her profile page.`,
    position: 'right',
    scrollTo: 'tooltip',
    // audioFile: ['CUSML.6.3.2.mp3']
  },
  {
    element: '#harmony-page',
    intro: `Harmony is an example of a <b>troll</b> we attributed to the Russian Internet Research Agency in March 2020 and worked with Twitter to have her suspended.`,
    position: 'right',
    myBeforeChangeFunction: function() { 
      let showProfilePage = document.getElementById("harmony-page");
      showProfilePage.style.display = "block";

      let hideRequest = document.getElementById("step1");
      hideRequest.style.display = "none";    
    },
    scrollTo: 'tooltip',
    // audioFile: ['CUSML.6.3.3.mp3']
  },
  {
    element: '#harmony-pic',
    intro: `Harmony poses as a <b>young woman</b>. This is a common tactic of internet trolls and bots. They sell disinformation in the same way advertisers sell their products`,
    position: 'left',
    scrollTo: 'tooltip',
    // audioFile: ['CUSML.6.3.5.mp3']
  },
  {
    element: '#twitterNav',
    intro: `Notice harmony's profile statistics. Unlike Elvis, it seems like she actually has a lot of followers.`,
    position: 'top',
    scrollTo: 'tooltip',
    // audioFile: ['CUSML.6.3.6.mp3']
  },
  {
    element: '#harmony-page',
    intro: `Let's dive deeper and look further into her followers list by <b>pressing on "Followers"</b>.`,
    position: 'right',
    scrollTo: 'tooltip',
    // audioFile: ['CUSML.6.3.6.mp3']
  },
  {
    element: '#harmony-page',
    intro: `All her followers look like bots. <b>Bots</b> are made to follow and like eachother's content. Now let's close the follower list by <b>clicking the "X"</b> in the top right corner.`,
    position: 'right',
    scrollTo: 'tooltip',
    // audioFile: ['CUSML.6.3.6.mp3']
  },
  {
    element: '#opinion',
    intro: `Look at what she posts, she has very <b>strong political opinions</b> and sets herself up in direct <b>opposition</b> to an extreme version of people on the other side of the political divide. Harmony’s goal is to make us more disgusted with one another and make meaningful compromise more difficult.`,
    position: 'right',
    scrollTo: 'tooltip',
    // audioFile: ['CUSML.6.3.7.mp3']
  },
  {
    element: '#postButtons',
    intro: `Unwitting legitimate accounts react to the content posted by the troll accounts, e.g., re-sharing it or interacting directly with them. This will turn the <b>disinformation seeds planted</b> by the malicious actor into an <b>organic disinformation campaign</b> where content is shared by both troll accounts and legitimate users`,
    position: 'right',
    scrollTo: 'tooltip',
    // audioFile: ['CUSML.6.3.6.mp3']
  },
  {
    element: '#backBtn',
    intro: `We've seen enough to know this is a <b>troll</b> you will want to avoid! <b>Press the arrow button</b> to return to the friend request.`,
    position: 'left',
    scrollTo: 'tooltip'
  //   audioFile: ['CUSML.6.3.6.mp3']
  },
  {
    element: '#decline',
    intro: `Decline this request to complete our practice.<br><br> <em>Press the <b>Decline</b> button</em>`,
    position: 'right',
    myBeforeChangeFunction: function() { 
      let showProfilePage = document.getElementById("harmony-page");
      showProfilePage.style.display = "none";

      let hideRequest = document.getElementById("step1");
      hideRequest.style.display = "block";    
    },
    scrollTo: 'tooltip',
    // audioFile: ['CUSML.6.3.6.mp3']
  }
];
