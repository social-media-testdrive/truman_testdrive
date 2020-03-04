var info_text = 'No Information Found';
let post_info_description = new Map([
    ['WWW.NEWSNETWORK.COM.CO','News Network provides the most up to date local and national news.'],
    ['WWW.NYTIMES.COM','The New York Times (sometimes abbreviated as the NYT and NYTimes) is an American newspaper based in New York City with worldwide influence and readership. Founded in 1851, the paper has won 125 Pulitzer Prizes, more than any other newspaper. The Times is ranked 17th in the world by circulation and 2nd in the U.S.'],
    ['WWW.NPR.ORG','National Public Radio (NPR, stylized as npr) is an American privately and publicly funded non-profit membership media organization based in Washington, D.C.']
    ]);

$('.ui.accordion').accordion();
function startIntro(){
  var hints;
  var literacy_counter = 0;
  clickCount = 0;
  var intro = introJs().setOptions({ 'hidePrev': true, 'hideNext': true, 'exitOnOverlayClick': false, 'showBullets':false, 'showStepNumbers':false, 'scrollToElement':true, 'doneLabel':'Done &#10003' });
    intro.setOptions({
      steps: [
        {
          intro: "Click on the blue dots&nbsp;<a role='button' tabindex='0' class='introjs-hint'><div class='introjs-hint-dot'></div><div class='introjs-hint-pulse'></div></a> &nbsp; &nbsp; &nbsp;to learn more..."
        }

      ]
    });
  intro.start().onexit(function() {

    hints = introJs().addHints();

    hints.onhintclick(function() {
        clickCount++;
        if(clickCount > 2){
          //show the guidance message, user probably doesn't know to click "got it"
          if($('#removeHidden').is(":hidden")){
            $('#removeHidden').transition('fade');
          } else {
            $('#removeHidden').transition('bounce');
          }
        }
    });

    hints.onhintclose(function(e) {
     literacy_counter++;
     clickCount = 0;
     if($('#removeHidden').is(":visible")){
       $('#removeHidden').transition('fade');
     }
     if(literacy_counter == 2) {
       endIntro();
       }
    });

    //showing the "Need some help?" guidance message after a total of 40 seconds per dot
    setInterval(function(){
      if($('#removeHidden').is(":hidden")){
        if(literacy_counter != 2){
          //user does not know to click blue dots
          $('#removeHidden').transition('fade');
        }
      }
    },80000);
  });
};

$(window).on("load", function() {startIntro();});

function endIntro(){
  var intro = introJs().setOptions({ 'hidePrev': true, 'hideNext': true, 'exitOnOverlayClick': false, 'showBullets':false,'showStepNumbers':false, 'scrollToElement':true, 'doneLabel':'Done &#10003' });
    intro.setOptions({
      steps: [
        {
          intro: "Now let’s review what we learned."
        }
      ]
    });
    intro.start().onexit(function() {
    window.location.href='/trans/safe-posting';
  });
};

function openPost(){
  $('#next_steps').modal('show');
}

//get add new feed post modal to work
$(".info_button").click(function () {
  var clickedId = '#' + $(this).attr('id');
  info_header = $(clickedId).next()[0].innerText;
  info_text = post_info_description.get(info_header.toString().trim()) || 'No Information Found';
  document.getElementById('post_info_body').innerHTML = info_text;
  $('#info_modal').modal('show');
});
