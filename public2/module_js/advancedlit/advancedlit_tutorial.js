const nextPageURL = 'sim';

const stepsList = [
  {
    element: '#step1',
    intro: `What should you do when you see a <b>breaking news</b> story
    on social media? Here are some ways to see if the news article is
    reliable.`,
    position: "right",
    scrollTo: 'tooltip'
  },
  {
    element: '#step2',
    intro: `Check to see if the article is clearly labeled as an opinion
    piece or a news article. Reliable articles will clearly distinguish
    between opinion and news.`,
    position: "right",
    scrollTo: "tooltip"
  },
  {
    element: '#step3',
    intro: `When you read an article, verify and <b>fact-check</b> the
    information. Reliable articles explain how and where their information
    was gathered, and provide links to relevant sources.`,
    position: "left",
    scrollTo: "tooltip"
  },
  {
    element: '#step3B',
    intro: `Breaking news stories develop over time, so the first reports
    might not have all the information.`,
    position: "right",
    scrollTo: "tooltip"
  },
  {
    element: "#step4",
    intro: `Even if an article looks reliable, you should check with at
    least one additional source. Is the story being reported by other news
    sites?`,
    position: "right",
    scrollTo: "tooltip"
  },
  {
    element: "#step5",
    intro: `Even if an article looks reliable, you should check with at
    least one additional source. Is the story being reported by other news
    sites?`,
    position: "right",
    scrollTo: "tooltip"
  },
  {
    element: '#step1',
    intro: `Don’t share a news article that isn’t accurate or doesn’t have
    all the information. It can be harmful to form opinions and make
    decisions based on false news.`,
    position: "right",
    scrollTo: "tooltip"
  }
];

function changeActiveTab(newActiveTab) {
  $('.ui.tab').removeClass('active');
  switch (newActiveTab) {
    case 'home':
      $('.ui.tab[data-tab="one"]').addClass('active');
      break;
    case 'article':
      $('.ui.tab[data-tab="two"]').addClass('active');
      break;
    case 'search':
      $('.ui.tab[data-tab="three"]').addClass('active');
      break;
    default:
      $('.ui.tab[data-tab="one"]').addClass('active');
      break;
  }
};

// this function is for defining any custom functionality that should be
// added to the onbeforechange listener
function additionalOnBeforeChange (jqThis) {
  let currentStep = jqThis[0]._currentStep;
  if(currentStep === 0){
    changeActiveTab('home');
  } else if ((1 <= currentStep) && (currentStep < 5) ){
    changeActiveTab('article');
  } else if ((currentStep) >= 5 && (currentStep < 6)) {
    changeActiveTab('search');
  } else if  (currentStep >= 6 ) {
    changeActiveTab('home');
  }
};
