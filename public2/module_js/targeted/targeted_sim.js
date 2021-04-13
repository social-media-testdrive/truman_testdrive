var stepsList = [
  {
    element: '#blueDotStep',
    intro: `Click "Next" to begin!`,
    position: 'right',
    scrollTo: 'tooltip',
    audioFile: ['']
  },
  {
    element: '#blueDotStep',
    intro: `This is the social media timeline of Hannah, a middle school student.
    One of Hannah’s favorite hobbies is playing the guitar.`,
    scrollTo: 'tooltip',
    position: 'right',
    audioFile: ['CUSML.2.5.1.mp3']
  },
  {
    element: '#blueDotStep',
    intro: `Recently, she has been watching guitar tutorials on YouTube and
    looking up cool guitar brands on Google.`,
    scrollTo: 'tooltip',
    position: 'right',
    audioFile: ['CUSML.2.5.2.mp3']
  },
  {
    element: '#blueDotStep',
    intro: `In this activity, you will see how targeted advertisements work.
    Click on "Done" and then look for the blue dots&nbsp;&nbsp;<a role='button' tabindex='0' class='introjs-hint'>
    <div class='introjs-hint-dot'></div><div class='introjs-hint-pulse'></div></a>
    &nbsp; &nbsp; &nbsp; &nbsp; to learn more...`,
    scrollTo: 'tooltip',
    position: 'right',
    audioFile: ['CUSML.2.5.3.mp3']
  }

];

var hintsList = [
  {
    hint: `This is a sponsored post from a guitar company. You can see that the
    post looks very similar to other social media posts.`,
    element: '#hint1',
    hintPosition: 'middle-middle',
    audioFile: ['CUSML.2.5.4.mp3']
  },
  {
    hint: `Try clicking the three dots and then “Why am I seeing this ad?” to
    learn more about how the website decided to show you the advertisement.`,
    element: '#hint2',
    hintPosition: 'bottom-right',
    audioFile: ['CUSML.2.5.5.mp3']
  },
  {
    hint: `One way you can tell that this post is an advertisement is by looking
    for words like “AD,” “Advertisement,” “Promoted,” or “Sponsored.”`,
    element: '#hint3',
    hintPosition: 'middle-right',
    audioFile: ['CUSML.2.5.6.mp3']
  },
  {
    hint: `This looks like another sponsored post! Click the three dots and then
    click “Hide ad” if you don’t want to see the advertisement, or “Report ad”
    if it is inappropriate.`,
    element: '#hint4',
    hintPosition: 'bottom-right',
    audioFile: ['CUSML.2.5.7.mp3']
  },
  {
    hint: `Remember, you can always ignore the advertisement!`,
    element: '#hint5',
    hintPosition: 'middle-middle',
    audioFile: ['CUSML.2.5.8.mp3']
  }
];

function eventsAfterHints(){
  //Activate the dropdown
  $('.ui.dropdown.icon.item').dropdown({
    duration: 300
  });

  $('.ui.accordion').accordion();

  //Adding functionality to the dropdown
  $('.ui.dropdown.icon.item')
  .dropdown({
    onChange: function() {
      var dropdownSelection = $(this).data().value
      if(dropdownSelection == 0){
        $(".inverted.dimmer").css("background-color","rgba(211,211,211,0.95)");
        //hide the post
        $('input[type=checkbox]').prop('checked',false);
        var post = $(this).closest(".ui.fluid.card.dim");
        var postID = post.attr("postID");
        console.log("***********HIDE: post " + postID);
        post.find(".ui.inverted.dimmer.notflag").dimmer({
          closable: false
        }).dimmer('show')
        //repeat to ensure its closable
        post.find(".ui.inverted.dimmer.notflag").dimmer({
          closable: true
        })
          .dimmer('show');
        $.post("/feed", {
          actionType: 'guided activity',
          postID: postID,
          flag: Date.now(),
          modual: 'targeted',
          _csrf: $('meta[name="csrf-token"]').attr('content')
        });
        //open hide ad Modal
        recordSimModalInputs('targeted_hideAdModal');

      } else if (dropdownSelection == 1){
        //flag the post
        var post = $(this).closest(".ui.fluid.card.dim");
        var postID = post.attr("postID");
        console.log("***********FLAG: post " + postID);
        post.find(".ui.dimmer.flag").dimmer({
          closable: false
        })
          .dimmer('show');
        //repeat to ensure its closable
        post.find(".ui.dimmer.flag").dimmer({
          closable: true
        })
          .dimmer('show');
        $.post("/feed", {
          actionType: 'guided activity',
          postID: postID,
          flag: Date.now(),
          modual: 'targeted',
          _csrf: $('meta[name="csrf-token"]').attr('content')
        });
      } else if (dropdownSelection == 2){
        //get the company name to dynamically use in the modal
        var companyName = $(this).closest(".ui.fluid.card.dim").find("#companyName").text();
        //open info modal
        $("#whyAmISeeingThisAdModal .content").html(
          "<p>Hannah is seeing this ad because <b>"+companyName+"</b> wanted to reach people interested in <b>guitars</b>.</p>" +
          "<p>This is based on what Hannah does on TestDrive, such as pages she has visited and search terms she has clicked on.</p>"+
          "<br>" +
          "<div class='actions'>" +
          "<div class='ui positive right labeled icon button'>Done" +
          "<i class='checkmark icon'></i></div></div>"
        );
        recordSimModalInputs('targeted_whySeeingAdModal');

      }
    }
  });
};
