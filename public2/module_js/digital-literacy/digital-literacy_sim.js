var stepsList = [
  {
    element: '#step1',
    intro: `Click "Next" to begin!`,
    position: 'left',
    scrollTo: 'tooltip',
    audioFile: ['']
  },
  {
    element: '#step1',
    intro: `In this activity, let's look at the signs of fake news on social
    media. See if you can spot the clues!`,
    position:'left',
    scrollTo:'tooltip',
    audioFile: ['CUSML.5.6.1.mp3']
  },
  {
    element: '#step1',
    intro: `Click on "Done" and then look for the blue dots&nbsp;&nbsp;<a role='button' tabindex='0'
    class='introjs-hint'><div class='introjs-hint-dot'></div><div
    class='introjs-hint-pulse'></div></a> &nbsp; &nbsp; &nbsp; &nbsp; to learn more...`,
    position:'left',
    scrollTo:'tooltip',
    audioFile: ['CUSML.5.6.2.mp3']
  }
];

var hintsList=
[
  {
    hint: `Be sure to check the article's website. This one is suspicious
    because of the '.com.co,' a sure sign it's trying to imitate a credible
    site. Also note the spelling errors in the URL.`,
    element: '#hint1',
    hintPosition: 'top-left',
    audioFile: ['CUSML.5.6.3.mp3']
  },
  {
    hint: `You can see that the headline uses shocking language and has a wild
    image to get people to click on it. This is an example of a clickbait
    headline.`,
    element: '#hint2',
    hintPosition: 'middle-right',
    audioFile: ['CUSML.5.6.4.mp3']
  },
  {
    hint: `After analyzing the headline and image, be sure to click on the
    article link to read the article more closely.`,
    element: '#hint3',
    audioFile: ['CUSML.5.6.5.mp3']
  },
  {
    hint: `If you decide the article is fake news, you can flag the post to
    report it. Don’t share the article!`,
    element: '#hint4',
    audioFile: ['CUSML.5.6.6.mp3']
  }
];

var clickedArticle = false;

var info_text = 'No Information Found';
let post_info_description = new Map([
    ['WWW.NEWSNETWORK.COM.CO','News Network provides the most up to date local and national news.'],
    ['WWW.NYTIMES.COM','The New York Times (sometimes abbreviated as the NYT and NYTimes) is an American newspaper based in New York City with worldwide influence and readership. Founded in 1851, the paper has won 125 Pulitzer Prizes, more than any other newspaper. The Times is ranked 17th in the world by circulation and 2nd in the U.S.'],
    ['WWW.NPR.ORG','National Public Radio (NPR, stylized as npr) is an American privately and publicly funded non-profit membership media organization based in Washington, D.C.']
    ]);

$('.ui.accordion').accordion();

function eventsAfterHints(){

  $('.img.post, .newsArticleTitleContainer, .description').on('click', function(){
    // update clickedArticle.
    clickedArticle = true;
    $('#clickArticleLinkWarning').hide();
    if(closedHints == numberOfHints) {
      $("#cyberTransButton").addClass("green");
    }
    recordSimModalInputs('digital-literacy_articleModal');
  });

  $(".info_button").click(function (e) {
    var clickedId = '#' + $(this).attr('id');
    let info_header = $(clickedId).next()[0].innerText;
    let info_text = post_info_description.get(info_header.toString().trim()) || 'No Information Found';
    document.getElementById('post_info_body').innerHTML = info_text;
    recordSimModalInputs('digital-literacy_infoModal');
    e.stopPropagation();
  });

  $('.flag.button').on('click', function(){
    $('input[type=checkbox]').prop('checked',false);
    recordSimModalInputs('digital-literacy_flagModal');
  })
}

function customErrorCheck(){
  if(closedHints != numberOfHints){
    //show the message normally the first time
    if($('#clickAllDotsWarning').is(":hidden")){
      $('#clickAllDotsWarning').transition('fade');
      $('#cyberTransButton').css("margin-bottom", "10em");
    }else{
      //otherwise, bounce the message to draw attention to it
      $('#clickAllDotsWarning').transition('bounce');
    }
  }
  if(!clickedArticle){
    $('#clickArticleLinkWarning').show();
  }
}

function customOnHintCloseFunction() {
   closedHints++;
   clickedHints = 0;
   if($('#removeHidden').is(":visible")){
     $('#removeHidden').transition('fade');
     if($('#clickAllDotsWarning').is(":hidden")){
       $('#cyberTransButton').css("margin-bottom", "4em");
     }
   }
   if(closedHints == numberOfHints) {
     if($('#clickAllDotsWarning').is(':visible')){
       $('#clickAllDotsWarning').transition('fade');
       $('#cyberTransButton').css("margin-bottom", "4em");
     }
     if(clickedArticle){
       $("#cyberTransButton").addClass("green");
     }
   }
}
