const nextPageURL = 'sim2';

const stepsList = [
    {
      element: '#step1',
      intro: `Click "Next" to begin!`,
      position: 'right',
      scrollTo: 'tooltip',
    //   audioFile: ['']
    },
    {
      element: '#step2',
      intro: `You were looking through your friend requests on social media and Woah! It looks like Elvis Pres1ey has requested to be your friend!`,
      position: 'right',
      scrollTo: 'tooltip'
    //   audioFile: ['CUSML.6.3.1.mp3']
    },
    {
      element: '#step2',
      intro: `A <b>troll</b> is a fake social media account, often created to spread misleading information or scam people.`,
      position: 'right',
      scrollTo: 'tooltip'
    //   audioFile: ['CUSML.6.3.3.mp3']
    },
    {
      element: '#step2',
      intro: `This Elvis account is an example of a <b>troll</b>. Lets look at the red flags you should be aware of to help you identify him as a troll`,
      position: 'right',
      scrollTo: 'tooltip'
    //   audioFile: ['CUSML.6.3.3.mp3']
    },
    {
        element: '#mutual',
        intro: `First notice that you have no <b>mutual friends</b>. You should be careful of accepting friend requests like this especially if you don't know them in real life as it is difficult to know what a random person's intention is in friending you.`,
        position: 'right',
        scrollTo: 'tooltip'
        // audioFile: ['CUSML.6.3.3.mp3']
      },
      {
        element: '.approveDeclineBtns',
        intro: `Accepting a friend request allows them to <b>access</b> more information about you and your current network of friends so it is important that you <b>look further</b> into these requests before making a decision about accepting them. Lets go to his public profile page and investigate!`,
        position: 'right',
        scrollTo: 'tooltip'
        // audioFile: ['CUSML.6.3.3.mp3']
      },
    {
      element: '#step2',
      intro: `Click their request so that you can go to their account and learn more about them!`,
      position: 'right',
      // myBeforeChangeFunction: function() { 
      //   alert('this is a before change loaded function');
      // },
      // myChangeFunction: function() { 
      //     alert('this is a change loaded function');
      // },
      // onbeforechange: function(){
      //   console.log("before change");

      //   let showProfilePage = document.getElementById("harmony-page");
      //   showProfilePage.style.visibility = "visible";

      //   let hideRequest = document.getElementById("step1");
      //   hideRequest.style.display = "none";
      // },
      // onchange: function(){
      //   console.log("onchange");
      // },
      scrollTo: 'tooltip'
    //   audioFile: ['CUSML.6.3.3.mp3']
    },
    {
    element: '#harmony-pic',
    intro: `They pose as a well known <b>celebrity</b>. Scammers often pretend to be celebrities you look up to and trust in an attempt to manipulate you`,
    position: 'left',
    myBeforeChangeFunction: function() { 
      let showProfilePage = document.getElementById("harmony-page");
      showProfilePage.style.display = "block";

      let hideRequest = document.getElementById("step1");
      hideRequest.style.display = "none";    
    },
    scrollTo: 'tooltip',
    //   audioFile: ['CUSML.6.3.5.mp3']
    },
    {
      element: '.populatedBio',
      intro: `The troll’s account is <b>populated</b> with data that makes them look believable and fit the <b>narrative</b> that the malicious actor wants to push (e.g. a famous musician).`,
      position: 'left',
      scrollTo: 'tooltip'             
    //   audioFile: ['CUSML.6.3.4.mp3']
    },
    {
        element: '#userName',
        intro: `Paying attention to the the <b>spelling</b> throughout the profile can help you identify a troll. The celebrity's real name is usually taken so trolls will use slight variations in the name to bypass this. Here the number one is used instead of the letter "L".`,
        position: 'left',
        scrollTo: 'tooltip',             
        // audioFile: ['CUSML.6.3.4.mp3']
      },
    {
      element: '#twitterNav',
      intro: `Notice his profile statistics. He has a <b>lot of messages</b> for only being on Twitter for one months! Also, the <b>ratio</b> of following to followers is off. You would expect a celebrity to have more followers since they're famous.`,
      position: 'top',
      scrollTo: 'tooltip'
    //   audioFile: ['CUSML.6.3.6.mp3']
    },
    {
      element: '#opinion',
      intro: `He has very suspicious posts where he is trying to get people to click a link. You should <b>not click links</b> found on social media unless you're 100% sure they're safe as they can be malicious.`,
      position: 'right',
      scrollTo: 'tooltip'
    //   audioFile: ['CUSML.6.3.7.mp3']
    },
    {
      element: '#postButtons',
      intro: `Lastly, the message has few likes, reshares, and comments which is a sign that this isn't a real person with authentic connections as they have thousands of followers but very little <b>engagement</b>.`,
      position: 'right',
      scrollTo: 'tooltip'
    //   audioFile: ['CUSML.6.3.6.mp3']
    },
    {
      element: '#backBtn',
      intro: `We've seen enough to know this is a troll you will want to avoid! <b>Press the back button</b> to return to the friend request where you will be able to respond to it.`,
      position: 'right',
      scrollTo: 'tooltip'
    //   audioFile: ['CUSML.6.3.6.mp3']
    },
    {
      element: '#decline',
      intro: `Decline this request.<br><br> <em>Press the <b>decline</b> button to continue</em>`,
      position: 'right',
      myBeforeChangeFunction: function() { 
        let showProfilePage = document.getElementById("harmony-page");
        showProfilePage.style.display = "none";
  
        let hideRequest = document.getElementById("step1");
        hideRequest.style.display = "block";    
      },
      scrollTo: 'element',         
    }
  ];

  