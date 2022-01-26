const pathArray = window.location.pathname.split('/');

// const moduleCards = {
//   "accounts":["acctandpasswords.png","Accounts and Passwords"],
//   "advancedlit":["advancednews.png", "Responding to Breaking News!"],
//   "cyberbullying":["upstander.png","How to Be an Upstander"],
//   "digfoot":["digfoot.png","Shaping Your Digital Footprint"],
//   "digital-literacy":["news.png","News in Social Media"],
//   "habits":["smhabits.png","Healthy Social Media Habits"],
//   "phishing":["phishing.png","Scams and Phishing"],
//   "presentation":["onlineidentity.png","Online Identities"],
//   "privacy":["smprivacy.png","Social Media Privacy"],
//   "safe-posting":["privateinfo.png","Is It Private Information?"],
//   "targeted":["targetedads.png","Ads on Social Media"],
//   "esteem":["esteem.png","The Ups and Downs of Social Media"],
//   "esteem-esp":["esteem.png","Los Altibajos de las Redes Sociales"]
// };

// This function is called when the "Click here to get started!" button is clicked
function startIntro(){
  // check if data collection is enabled
  const enableDataCollection = $('meta[name="isDataCollectionEnabled"]').attr('content') === "true";
  if (enableDataCollection) {
    // update the user's module progress to "started"
    const modNameNoDashes = pathArray[2].replace('-','');
    /* modname must have any dashes removed to match the schema. This should be
    changed because it is inconsistent - dashes are fine in every other case. */
    $.post("/moduleProgress", {
      module: modNameNoDashes,
      status: 'started',
      _csrf: $('meta[name="csrf-token"]').attr('content')
    }).then(function(){
      window.location.href='/start/' + pathArray[2];
    })
  } else {
    window.location.href='/start/' + pathArray[2];
  }
};

$(window).on('load', function() {
  // Update the image and the title on the card
  const cdn = "https://dhpd030vnpk29.cloudfront.net/";
  const moduleName = pathArray[2];
  $.getJSON('/json/moduleInfo.json', function(data) {
    $("#cardImage").attr("src", cdn + data[moduleName]["image"]);
    $("#cardTitle").text(data[moduleName]["title"]);
  });
  // Add animation to the tabs on click
  $("#learn, #practice, #explore, #reflect").on('click', function() {
      $(this).transition('tada');
  });
});
