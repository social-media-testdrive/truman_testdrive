const cdn = "https://dhpd030vnpk29.cloudfront.net/";
const pathArray = window.location.pathname.split('/');

const moduleCards = {
  "accounts":["acctandpasswords.png","Accounts and Passwords"],
  "cyberbullying":["upstander.png","How to Be an Upstander"],
  "digfoot":["digfoot.png","Shaping Your Digital Footprint"],
  "digital-literacy":["news.png","News in Social Media"],
  "habits":["smhabits.png","Healthy Social Media Habits"],
  "phishing":["phishing.png","Scams and Phishing"],
  "presentation":["onlineidentity.png","Online Identities"],
  "privacy":["smprivacy.png","Social Media Privacy"],
  "safe-posting":["privateinfo.png","Is It Private Information?"],
  "targeted":["targetedads.png","Ads on Social Media"],
  "esteem":["esteem.png","The Ups and Downs of Social Media"]
};

function startIntro(){
  window.location.href='/start/' + pathArray[2];
};

$(window).on('load', function(){
  $("#cardImage").attr("src", cdn + moduleCards[pathArray[2]][0]);
  $("#cardTitle").text(moduleCards[pathArray[2]][1]);
;})

$("#learn, #practice, #explore, #reflect").on('click',
  function() {
    $(this).transition('tada');
  }
);
