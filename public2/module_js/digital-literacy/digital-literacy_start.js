
  //functions  to animate any unclicked labels, used for error messaging
  function animateUnclickedLabels1() {
    if($('#source_info').is(":hidden")){
      $('#sourceLabel').transition('bounce');
    }
    if($('#credible_info').is(":hidden")){
      $('#credibleLabel').transition('bounce');
    }
    if($('#news_info').is(":hidden")){
      $('#newsLabel').transition('bounce');
    }
    if($('#clickbait_info').is(":hidden")){
      $('#clickbaitLabel').transition('bounce');
    }
  };

  function animateUnclickedLabels2() {
    if($('#influence_info').is(":hidden")){
      $('#influenceLabel').transition('bounce');
    }
    if($('#money_info').is(":hidden")){
      $('#moneyLabel').transition('bounce');
    }
  };

  //Old code, did my best to read and comment

  var incomplete_activities = ($('#key_ideas').is(":hidden") ||  $('#influence_info').is(":hidden") || $('#money_info').is(":hidden"));

  $('#ideas_next').on('click', function () {
    $('#clickNextWarning').hide();
    $('#key_ideas').show();
    $('#key_ideas').transition('jiggle');
  });

  $('#money').on('click', function () {
      $('#money_info').show();
      $('#money').transition('tada');
      if(!($('#influence_info').is(":hidden") || $('#money_info').is(":hidden"))){
        $("#clickLabelsWarning").hide();
        $('.ui.labeled.icon.button').addClass('green');
      }
  });

  $('#influence').on('click', function () {
      $('#influence_info').show();
      $('#influence').transition('tada');
      if(!($('#influence_info').is(":hidden") || $('#money_info').is(":hidden"))){
        $("#clickLabelsWarning").hide();
        $('.ui.labeled.icon.button').addClass('green');
      }
  });

  $('#source').on('click', function () {
      $('#source_info').show();
      $('#source').transition('tada');
      if(!($('#key_ideas').is(":hidden") ||  $('#credible_info').is(":hidden") ||
           $('#news_info').is(":hidden") ||  $('#news_info').is(":hidden")
           ||  $('#clickbait_info').is(":hidden")))
      {
        $("#clickLabelsWarning").hide();
        $('.ui.labeled.icon.button').addClass('green');
      }
  });

  $('#credible').on('click', function () {
      $('#credible_info').show();
      $('#credible').transition('tada');
      if(!($('#key_ideas').is(":hidden") ||  $('#credible_info').is(":hidden") ||
           $('#news_info').is(":hidden") ||  $('#news_info').is(":hidden")
           ||  $('#clickbait_info').is(":hidden")))
      {
        $("#clickLabelsWarning").hide();
        $('.ui.labeled.icon.button').addClass('green');
      }
  });

  $('#news').on('click', function () {
      $('#news_info').show();
      $('#news').transition('tada');
      if(!($('#key_ideas').is(":hidden") ||  $('#credible_info').is(":hidden") ||
           $('#news_info').is(":hidden") ||  $('#news_info').is(":hidden")
           ||  $('#clickbait_info').is(":hidden")))
      {
        $("#clickLabelsWarning").hide();
        $('.ui.labeled.icon.button').addClass('green');
      }
  });

  $('#clickbait').on('click', function () {
      $('#clickbait_info').show();
      $('#clickbait').transition('tada');
      if(!($('#key_ideas').is(":hidden") ||  $('#credible_info').is(":hidden") ||
           $('#news_info').is(":hidden") ||  $('#news_info').is(":hidden")
           ||  $('#clickbait_info').is(":hidden")))
      {
        $("#clickLabelsWarning").hide();
        $('.ui.labeled.icon.button').addClass('green');
      }
  });


  function startIntro(){

    if($("#key_ideas").is(":hidden") && $("#question").is(":not(:visible)")){
      $("#clickNextWarning").show();
      $("#ideas_next").transition("bounce");
    }

     if(($('.ui.raised.segment').is(":hidden") &&  $('#key_ideas').is(":hidden") &&  $('#question').is(":visible")))
      {
          if(!($('#question').is(":hidden") ||  $('#influence_info').is(":hidden") || $('#money_info').is(":hidden"))){
            $('#clickLabelsWarning').hide();
            window.location.href='/tutorial/digital-literacy';
          } else {
            $('#clickLabelsWarning').show();
            animateUnclickedLabels2();
          }
      } else if(($('#key_ideas').is(":hidden") ||  $('#credible_info').is(":hidden") || $('#news_info').is(":hidden") ||  $('#news_info').is(":hidden") ||  $('#clickbait_info').is(":hidden"))){
        if($("#key_ideas").is(":not(:hidden)")){
          $('#clickLabelsWarning').show();
          animateUnclickedLabels1();
        }
      } else {
        $('#learn').hide();
        $('#key_ideas').hide();
        $('#question').show();
        $('.ui.labeled.icon.button').removeClass('green');

      }
    };
