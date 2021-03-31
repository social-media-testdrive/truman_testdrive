//$(document).ready(function() {
//Before Page load:
//hide news feed before it is all loaded

$('#content').hide();
$('#loading').show();

function changeActiveProgressTo(activeStep){
  if(!$(activeStep).hasClass('progressBarActive')){
    $('#headerStep1, #headerStep2, #headerStep3, #headerStep4').removeClass('progressBarActive');
    $(activeStep).addClass('progressBarActive');
  }
}

$(window).on("load", function () {
  const enableDataCollection = $('meta[name="isDataCollectionEnabled"]').attr('content') === "true";
  //recording the current page
  let pathArray = window.location.pathname.split('/');
  $.post("/pageLog", {
    subdirectory1: pathArray[1],
    subdirectory2: pathArray[2],
    _csrf: $('meta[name="csrf-token"]').attr('content')
  });

  // managing the progress bar in the header
  let pathArrayForHeader = window.location.pathname.split('/');
  let currentPageForHeader = pathArrayForHeader[1];
  let currentModuleForHeader = pathArrayForHeader[2];
  let stepNumber = "";
  let jsonPath = '/json/progressDataA.json';

  switch (currentModuleForHeader) {
    case 'cyberbullying':
    case 'digfoot':
      jsonPath = "/json/progressDataB.json";
      break;
    default:
      jsonPath = "/json/progressDataA.json";
      break;
  }

  $.getJSON(jsonPath, function(data) {
    stepNumber = data[currentPageForHeader];
  }).then(function () {
    switch (stepNumber) {
      case '1':
        changeActiveProgressTo('#headerStep1');
        $('.hideHeader').css('display', 'block');
        break;
      case '2':
        changeActiveProgressTo("#headerStep2");
        $('.hideHeader').css('display', 'block');
        break;
      case '3':
        changeActiveProgressTo("#headerStep3");
        $('.hideHeader').css('display', 'block');
        break;
      case '4':
        changeActiveProgressTo("#headerStep4");
        $('.hideHeader').css('display', 'block');
        break;
      case 'end':
        $('#headerStep1, #headerStep2, #headerStep3, #headerStep4').removeClass('progressBarActive');
        $('.hideHeader').css('display', 'block');
        break;
      default:
        console.log('Progress bar is not visible right now');
        break;
    }
  });

  $('.ui.sticky.sideMenu')
    .sticky({
      context: '#content',
      offset: 90
    })
  ;

/*
Start chat box code
*/
  $('.container.clearfix').each(
    function () {

    let pathArray = window.location.pathname.split('/');
    var chatId = this.id
    console.log("@@@@This is my id: "+chatId);

    var chat = {
      messageToSend: '',
      messageResponses: [
        'OK !!',
        'OK !!',
        'OK !!'
      ],
      init: function () {
        this.cacheDOM();
        this.bindEvents();
        this.render();
      },
      cacheDOM: function () {
        //var chatId = $('.chat-history').closest('.container').attr('id');
        console.log("!!!!this is my: "+this.id);
        //var chatId = $(this).id
        console.log(chatId);
        if(chatId){
          this.$chatHistory = $('#'+chatId +' .chat-history');
          this.$button = $('#'+chatId +' button');
          this.$textarea = $('#'+chatId +' #message-to-send');
          this.$chatHistoryList = this.$chatHistory.find('ul');
          console.log('#'+chatId +' .chat-history');
        }
        else {
          this.$chatHistory = $('.chat-history');
          this.$button = $('button');
          this.$textarea = $('#message-to-send');
          this.$chatHistoryList = this.$chatHistory.find('ul');
          console.log('else');
          console.log(this.$chatHistory);
        }

      },
      bindEvents: function () {
        this.$button.on('click', this.addMessage.bind(this));
        this.$textarea.on('keyup', this.addMessageEnter.bind(this));
      },
      render: function () {
        this.scrollToBottom();
        if (this.messageToSend.trim() !== '') {
          var template = Handlebars.compile($("#message-template").html());
          var context = {
            messageOutput: this.messageToSend,
            time: this.getCurrentTime()
          };

          this.$chatHistoryList.append(template(context));
          this.scrollToBottom();
          this.$textarea.val('');

          // responses
          var templateResponse = Handlebars.compile($("#message-response-template").html());
          var contextResponse = {
            response: this.getRandomItem(this.messageResponses),
            time: this.getCurrentTime()
          };

          setTimeout(function () {
            // this.$chatHistoryList.append(templateResponse(contextResponse));
            this.scrollToBottom();
          }.bind(this), 1500);

          /*
          setTimeout(function () {
            if(pathArray[1] == 'modual' && pathArray[2] == 'safe-posting' ) {
              if($('#chatbox1')){
                // $('#chatbox1').remove();
                var el = $('#chatbox1').detach();
              }
              if($('#chatbox2').is(":hidden")){
              $($('#chatbox2 .chat-history')[0]).slideToggle(300, 'swing');
              $($('#chatbox2 .chat-message')[0]).slideToggle(300, 'swing');
              $($('#chatbox2 .chat-history')[0]).slideToggle(300, 'swing');
              $($('#chatbox2 .chat-message')[0]).slideToggle(300, 'swing');
              $('#chatbox2').slideToggle(300, 'swing');
              }
              this.cacheDOM();
              this.bindEvents();
              $('#loading').after(el);
              // $('#chatbox1').show();


            };
          }.bind(this), 9000);
          */

        }

      },

      addMessage: function () {
        this.messageToSend = this.$textarea.val()
        this.render();
      },
      addMessageEnter: function (event) {
        // enter was pressed
        if (event.keyCode === 13) {
          this.addMessage();
        }
      },
      scrollToBottom: function () {
        if (this.$chatHistory[0]) {
          this.$chatHistory.scrollTop(this.$chatHistory[0].scrollHeight);
        }

      },
      getCurrentTime: function () {
        return new Date().toLocaleTimeString().
          replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3");
      },
      getRandomItem: function (arr) {
        return arr[Math.floor(Math.random() * arr.length)];
      }

    };

    console.log("START OF CHATS!");
    console.log(pathArray);
     if((pathArray[2] == 'safe-posting' ) || (pathArray[2] == 'phishing' )) {
      chat.init();
     };

  });

  //Minimize a chat box
  $('a.chat-minimize').click(function (e) {
     e.preventDefault();
     let chat = $(this).closest('.chat').children('.chat-history');
     chat.slideToggle(300, 'swing');
  });

  //Close a chat box
  $('a.chat-close').click(function (e) {
     e.preventDefault();
     let chat = $(this).closest('.chat');
     chat.fadeOut(300, 'swing');
  });

/*
end chat box code
*/

  //close loading dimmer on load
  $('#loading').hide();
  $('#content').attr('style', 'block');
  $('#content').fadeIn('slow');
  //close messages from flash message
  $('.message .close')
    .on('click', function () {
      $(this)
        .closest('.message')
        .transition('fade')
        ;
    });

  //activate checkboxes
  $('.ui.checkbox')
    .checkbox();

  //get add new reply post modal to show
  $('.reply.button').click(function () {

    let parent = $(this).closest(".ui.fluid.card");
    let postID = parent.attr("postID");

    parent.find("input.newcomment").focus();
  });


  /*
  focus on new comment prompt if clicked
  */
  $("input.newcomment").keyup(function (event) {
    //i.big.send.link.icon
    //$(this).siblings( "i.big.send.link.icon")
    if (event.keyCode === 13) {
      $(this).siblings("i.big.send.link.icon").click();
    }
  });

  //create a new Comment
  $("i.big.send.link.icon").click(function () {
    var text = $(this).siblings("input.newcomment").val();
    var card = $(this).parents(".ui.card");
    var comments = card.find(".ui.comments")
    //no comments area - add it
    console.log("Comments is now " + comments.length)
    if (!comments.length) {
      var buttons = card.find(".three.ui.bottom.attached.icon.buttons")
      buttons.after('<div class="content"><div class="ui comments"></div>');
      var comments = card.find(".ui.comments")
    }
    if (text.trim() !== '') {
      var date = Date.now();
      var ava = $(this).siblings('.ui.label').find('img.ui.avatar.image');
      var ava_img = ava.attr("src");
      var ava_name = ava.attr("name");
      //var postID = card.attr("postID");

      var mess =
        `<div class="comment">
          <a class="avatar">
            <img src="${ava_img}">
          </a>
          <div class="content">
            <a class="author">${ava_name}</a>
            <div class="metadata">
              <span class="date">${humanized_time_span(date)}</span>
            </div>
            <div class="text">${text}</div>
          </div>
        </div>`;
      $(this).siblings("input.newcomment").val('');
      comments.append(mess);

      if (card.attr("type") == 'userPost') {
        $.post("/userPost_feed", {
          postID: postID,
          new_comment: date,
          comment_text: text,
          _csrf: $('meta[name="csrf-token"]').attr('content')
        });
      } else {
        let postID = card.attr('postID');
        switch(currentPageForHeader){
          case 'sim':
          case 'free-play':
          case 'free-play2':
          case 'free-play3':
          case 'free-play4':
            actionType = 'guided activity';
            break;
          case 'tutorial':
            actionType = 'tutorial';
            break;
          default:
            actionType = 'free play';
            break;
        }
        if(actionType === "free play" || enableDataCollection){
          $.post("/feed", {
            actionType: actionType,
            modual: currentModuleForHeader,
            postID: postID,
            new_comment: date,
            comment_text: text,
            _csrf: $('meta[name="csrf-token"]').attr('content')
          });
        }
      }

    }
    try {
      // We store the page's hints on the body for easy access
      document.body.hints.refresh();
    } catch (error) {
      if( !(error instanceof TypeError) ){
        console.error(error);
      }
    }
  });



  //Like a comment
  $('a.like.comment')
    .on('click', function () {

      //if already liked, unlike if pressed
      if ($(this).hasClass("red")) {
        console.log("***********UNLIKE: post");
        //Un read Like Button
        $(this).removeClass("red");

        var comment = $(this).parents(".comment");
        comment.find("i.heart.icon").removeClass("red");

        var label = comment.find("span.num");
        label.html(function (i, val) { return val * 1 - 1 });
      }
      //since not red, this button press is a LIKE action
      else {
        $(this).addClass("red");
        var comment = $(this).parents(".comment");
        comment.find("i.heart.icon").addClass("red");

        var label = comment.find("span.num");
        label.html(function (i, val) { return val * 1 + 1 });

        // var postID = $(this).closest(".ui.fluid.card").attr("postID");
        var commentID = comment.attr("commentID");
        var like = Date.now();
        let postID = $(this).closest(".ui.card").attr("postID");
        let actionType = 'free play';
        switch(currentPageForHeader){
          case 'sim':
          case 'free-play':
          case 'free-play2':
          case 'free-play3':
          case 'free-play4':
            actionType = 'guided activity';
            break;
          case 'tutorial':
            actionType = 'tutorial';
            break;
          default:
            actionType = 'free play';
            break;
        }

        //console.log("#########COMMENT LIKE:  PostID: " + postID + ", Comment ID: " + commentID + " at time " + like);

        if ($(this).closest(".ui.fluid.card").attr("type") == 'userPost')
          $.post("/userPost_feed", {
            postID: postID,
            commentID: commentID,
            like: like,
            _csrf: $('meta[name="csrf-token"]').attr('content')
          });
        else {
          if(actionType === "free play" || enableDataCollection) {
            $.post("/feed", {
              actionType: actionType,
              postID: postID,
              modual: currentModuleForHeader,
              commentID: commentID,
              like: like,
              _csrf: $('meta[name="csrf-token"]').attr('content')
            });
          }
        }
      }

    });

  //flag a comment
  $('a.flag.comment')
    .on('click', function () {

      var comment = $(this).parents(".comment");
      let postID = $(this).closest(".ui.card").attr("postID");
      let actionType = 'free play';
      switch(currentPageForHeader){
        case 'sim':
        case 'free-play':
        case 'free-play2':
        case 'free-play3':
        case 'free-play4':
          actionType = 'guided activity';
          break;
        case 'tutorial':
          actionType = 'tutorial';
          break;
        default:
          actionType = 'free play';
          break;
      }
      var typeID = $(this).closest(".ui.card").attr("type");
      var commentID = comment.attr("commentID");
      comment.replaceWith('<div class="comment" style="background-color:black;color:white"><h5 class="ui inverted header"><span>The admins will review this post further. We are sorry you had this experience.</span></h5></div>');
      var flag = Date.now();

      console.log("#########COMMENT FLAG:  PostID: " + postID + ", Comment ID: " + commentID + "  TYPE is " + typeID + " at time " + flag);

      if (typeID == 'userPost')
        $.post("/userPost_feed", {
          postID: postID,
          commentID: commentID,
          flag: flag,
          _csrf: $('meta[name="csrf-token"]').attr('content')
        });
      else
        if(actionType === "free play" || enableDataCollection) {
          $.post("/feed", {
            actionType: actionType,
            modual: currentModuleForHeader,
            postID: postID,
            commentID: commentID,
            flag: flag,
            _csrf: $('meta[name="csrf-token"]').attr('content')
          });
        }

      introJs().refresh();
      try {
        // We store the page's hints on the body for easy access
        document.body.hints.refresh();
      } catch (error) {
        if( !(error instanceof TypeError) ){
          console.error(error);
        }
      }
    });

  //get add new feed post modal to work
  $("#newpost, a.item.newpost, .editProfilePictureButton").click(function () {
    $(' .ui.small.post.modal').modal('show');
    //lazy load the images in the modal
    $(".lazy").each(function() {
        $(this).attr('src', $(this).attr('data-src'));
    });
  });

  //New Class Button
  $("#new_class.ui.big.green.labeled.icon.button").click(function () {
    $('.ui.small.newclass.modal').modal('show');
  });

  //new post validator (picture and text can not be empty)
  $('.ui.feed.form')
    .form({
      on: 'blur',
      fields: {
        body: {
          identifier: 'body',
          rules: [
            {
              type: 'empty',
              prompt: 'Please add some text'
            }
          ]
        }
      }
    });

  //validate class form
  $('#classform.ui.form')
    .form({
      on: 'blur',
      fields: {
        classname: {
          identifier: 'classname',
          rules: [
            {
              type: 'empty',
              prompt: 'Please include a Class Name'
            }
          ]
        },
        accesscode: {
          identifier: 'accesscode',
          rules: [
            {
              type: 'empty',
              prompt: 'Please add an Access Code'
            }
          ]
        }

      }
    })
    ;

  //Picture Preview on Image Selection
  function readURL(input) {
    if (input.files && input.files[0]) {
      var reader = new FileReader();
      //console.log("Now changing a photo");
      reader.onload = function (e) {
        $('#imgInp').attr('src', e.target.result);
        //console.log("FILE is "+ e.target.result);
      }

      reader.readAsDataURL(input.files[0]);
    }
  }

  $("#picinput").change(function () {
    //console.log("@@@@@ changing a photo");
    readURL(this);
  });

  //add humanized time to all posts
  $('.right.floated.time.meta, .date.sim, .time.notificationTime').each(function () {
    var ms = parseInt($(this).text(), 10);
    let time = new Date(ms);
    $(this).text(humanized_time_span(time));
  });

  //Sign Up Button
  // $('.ui.big.green.labeled.icon.button.signup')
  //   .on('click', function () {
  //     window.location.href = '/signup';
  //   });

  //Cyberbullying to Transition
  $('.cybertrans')
    .on('click', function (e) {
      if ($(this).hasClass('green')) {
        console.log(window.location.pathname)
        let pathArray = window.location.pathname.split('/');
        console.log(pathArray);
        window.location.href = '/trans/' + pathArray[2];
        // window.location.href = '/trans/cyberbullying';
      }
      else {
        e.preventDefault();
        //alert('Please go through each blue dot to proceed further !');
      }

    });

  //cyberbullying to transition 2
  $('.cybertrans2')
    .on('click', function (e) {
      if ($(this).hasClass('green')) {
        console.log(window.location.pathname)
        let pathArray = window.location.pathname.split('/');
        console.log(pathArray);
        window.location.href = '/trans2/' + pathArray[2];
         //window.location.href = '/trans2/privacy';
      }
      else {
        e.preventDefault();
        //alert('Please go through each blue dot to proceed further !');
      }

    });

/*
Start button links
*/

  //Cyberbullying to Transition
  $('.ui.big.green.labeled.icon.button.cybertutorial')
    .on('click', function () {
      console.log(window.location.pathname)
      let pathArray = window.location.pathname.split('/');
      console.log(pathArray);
      window.location.href = '/tutorial/' + pathArray[2];
    });

  //Cyberbullying to Transition (blue button)
  $('.ui.big.blue.labeled.icon.button.cybertutorial')
    .on('click', function () {
      console.log(window.location.pathname)
      let pathArray = window.location.pathname.split('/');
      console.log(pathArray);
      window.location.href = '/tutorial/' + pathArray[2];
    });

  //Cyberbullying to Transition
  $(document).on('click', '.ui.big.labeled.icon.button.cybersim.green', function () {
      console.log(window.location.pathname)
      let pathArray = window.location.pathname.split('/');
      console.log(pathArray);
      window.location.href = '/sim/' + pathArray[2];
    });

    //Cyberbullying to Transition (blue button)
    $(document).on('click', '.ui.big.labeled.icon.button.cybersim.blue', function () {
        console.log(window.location.pathname)
        let pathArray = window.location.pathname.split('/');
        console.log(pathArray);
        window.location.href = '/sim/' + pathArray[2];
      });

  //Cyberbullying to Transition 1
  $(document).on('click', '.ui.big.labeled.icon.button.cybersim1.green', function () {
      console.log(window.location.pathname)
      let pathArray = window.location.pathname.split('/');
      console.log(pathArray);
      window.location.href = '/sim1/' + pathArray[2];
    });

  //Privacy sim2 to Tutorial
  $(document).on('click', '.ui.big.labeled.icon.button.privacytutorial.green', function () {
      console.log(window.location.pathname)
      window.location.href = '/tutorial/privacy';
    });

  //Privacy sim to trans2
  $(document).on('click', '.ui.big.labeled.icon.button.privacytrans2.green', function () {
      console.log(window.location.pathname)
      window.location.href = '/trans2/privacy';
    });

  //To sim2
  $(document).on('click', '.ui.big.labeled.icon.button.cybersim2.green', function () {
      console.log(window.location.pathname)
      let pathArray = window.location.pathname.split('/');
      console.log(pathArray);
      window.location.href = '/sim2/' + pathArray[2];
    });

  //Privacy free-play to settings
  $(document).on('click', '.ui.big.labeled.icon.button.free1.green', function () {
      console.log(window.location.pathname)
      window.location.href = '/free-settings/privacy';
    });

  //Privacy settings to free-play2
  $(document).on('click', '.ui.big.labeled.icon.button.settings1.green', function () {
      console.log(window.location.pathname)
      window.location.href = '/free-play2/privacy';
    });

  //Privacy free-play2 to settings3
  $(document).on('click', '.ui.big.labeled.icon.button.settings3.green', function () {
      console.log(window.location.pathname)
      window.location.href = '/free-settings3/privacy';
    });

  //Privacy settings3 to free-play4
  $(document).on('click', '.ui.big.labeled.icon.button.free4.green', function () {
      console.log(window.location.pathname)
      window.location.href = '/free-play4/privacy';
    });

  //Privacy free-play4 to settings2
  $(document).on('click', '.ui.big.labeled.icon.button.settings2.green', function () {
      console.log(window.location.pathname)
      window.location.href = '/free-settings2/privacy';
    });

  //Privacy settings2 to free3
  $(document).on('click', '.ui.big.labeled.icon.button.free3.green', function () {
      console.log(window.location.pathname)
      window.location.href = '/free-play3/privacy';
    });

  //Privacy free3 to results
  $(document).on('click', '.ui.big.labeled.icon.button.privacyresults.green', function () {
      console.log(window.location.pathname)
      window.location.href = '/results/privacy';
    });


  //Cyberbullying Start to Tutorial
  $('.ui.big.green.labeled.icon.button.cyberstart')
    .on('click', function () {
      window.location.href = '/tutorial/cyberbullying';
    });

  //Cyberbullying to Transition
  $('.ui.big.green.labeled.icon.button.cybertrans_script')
    .on('click', function () {
      window.location.href = '/trans_script/cyberbullying';
    });

  ///modual/:modId
  //Cyberbullying Transition to freeplay
  $('.ui.big.green.labeled.icon.button.cyber_script')
    .on('click', function () {
      console.log(window.location.pathname)
      let pathArray = window.location.pathname.split('/');
      console.log(pathArray);
      window.location.href = '/modual/' + pathArray[2];
    });

  //Cyberbullying Transition to freeplay (blue button)
  $('.ui.big.blue.labeled.icon.button.cyber_script')
    .on('click', function () {
      console.log(window.location.pathname)
      let pathArray = window.location.pathname.split('/');
      console.log(pathArray);
      window.location.href = '/modual/' + pathArray[2];
    });

  //Cyberbullying end play
  $('.ui.big.green.labeled.icon.button.cyberbullying_end')
    .on('click', function () {
      console.log(window.location.pathname)
      let pathArray = window.location.pathname.split('/');
      console.log(pathArray);
      window.location.href = '/end/' + pathArray[2];
    });

  //Sign Up Info Skip Button
  $('button.ui.button.skip')
    .on('click', function () {
      window.location.href = '/info';
    });


  //Pre qiuz for presentation mod (rocket!!!)
  $('.ui.big.green.labeled.icon.button.prepres')
    .on('click', function () {
      window.location.href = '/modual/presentation';
    });

  //Go to Post Quiz (Presentation)
  $('.ui.big.green.labeled.icon.button.prez_post_quiz')
    .on('click', function () {
      window.location.href = '/postquiz/presentation';
    });

  //Go to Post Quiz (ANY)
  $('.ui.big.green.labeled.icon.button.post_quiz')
    .on('click', function () {
      let mod = $(this).attr("mod");
      console.log("Mod is now: " + mod);
      window.location.href = '/postquiz/' + mod + '/wait';
    });


  $('.ui.big.green.labeled.icon.button.finished')
    .on('click', function () {
      window.location.href = '/';
    });


  $('.ui.big.green.labeled.icon.button.finish_lesson')
    .on('click', function () {
      window.location.href = '/';
    });

  //Community Rules Button (rocket!!!)
  $('.ui.big.green.labeled.icon.button.com')
    .on('click', function () {
      window.location.href = '/info'; //maybe go to tour site???
    });

  //Info  (rocket!!!)
  $('.ui.big.green.labeled.icon.button.info')
    .on('click', function () {
      window.location.href = '/'; //maybe go to tour site???
    });

  //More info Skip Button
  $('button.ui.button.skip')
    .on('click', function () {
      window.location.href = '/com'; //maybe go to tour site???
    });

  //Edit button
  $('.ui.editprofile.button')
    .on('click', function () {
      let pathArray = window.location.pathname.split('/');
      window.location.href = '/account/' + pathArray[2];
    });

/*
end button links
*/

  //this is the REPORT User button
  $('button.ui.button.report')
    .on('click', function () {

      var username = $(this).attr("username");

      $('.ui.small.report.modal').modal('show');

      $('.coupled.modal')
        .modal({
          allowMultiple: false
        })
        ;
      // attach events to buttons
      $('.second.modal')
        .modal('attach events', '.report.modal .button')
        ;
      // show first now
      $('.ui.small.report.modal')
        .modal('show')
        ;

    });

  //Report User Form//
  $('form#reportform').submit(function (e) {

    e.preventDefault();
    $.post($(this).attr('action'), $(this).serialize(), function (res) {
      // Do something with the response `res`
      console.log(res);
      // Don't forget to hide the loading indicator!
    });
    //return false; // prevent default action

  });

  //this is the Block User button
  $('button.ui.button.block')
    .on('click', function () {

      var username = $(this).attr("username");
      //Modal for Blocked Users
      $('.ui.small.basic.blocked.modal')
        .modal({
          closable: false,
          onDeny: function () {
            //report user

          },
          onApprove: function () {
            //unblock user
            $.post("/user", { unblocked: username, _csrf: $('meta[name="csrf-token"]').attr('content') });
          }
        })
        .modal('show')
        ;


      console.log("***********Block USER " + username);
      $.post("/user", { blocked: username, _csrf: $('meta[name="csrf-token"]').attr('content') });

    });

  //Block Modal for User that is already Blocked
  $('.ui.on.small.basic.blocked.modal')
    .modal({
      closable: false,
      onDeny: function () {
        //report user

      },
      onApprove: function () {
        //unblock user
        var username = $('button.ui.button.block').attr("username");
        $.post("/user", { unblocked: username, _csrf: $('meta[name="csrf-token"]').attr('content') });

      }
    })
    .modal('show')
    ;

  //this is the LIKE button for posts
  // like a post
  $('.like.button')
    .on('click', function () {
      console.log("CLICK LIKE");
      //if already liked, unlike if pressed
      if ($(this).hasClass("red")) {
        console.log("***********UNLIKE: post");
        $(this).removeClass("red");
        var label = $(this).next("a.ui.basic.red.left.pointing.label.count");
        label.html(function (i, val) { return val * 1 - 1 });
      }
      //since not red, this button press is a LIKE action
      else {
        $(this).addClass("red");
        var label = $(this).next("a.ui.basic.red.left.pointing.label.count");
        label.html(function (i, val) { return val * 1 + 1 });
        //var like = Date.now();
        //console.log("***********LIKE: post " + postID);
        let postID = $(this).closest(".ui.card").attr("postID");
        let actionType = 'free play';
        switch(currentPageForHeader){
          case 'sim':
          case 'sim1':
          case 'sim2':
          case 'sim3':
          case 'free-play':
          case 'free-play2':
          case 'free-play3':
          case 'free-play4':
            actionType = 'guided activity';
            break;
          case 'tutorial':
            actionType = 'tutorial';
            break;
          default:
            actionType = 'free play';
            break;
        }
        let like = Date.now();
        if(actionType === "free play" || enableDataCollection) {
          $.post("/feed", {
            actionType: actionType,
            postID: postID,
            modual: currentModuleForHeader,
            like: like,
            _csrf: $('meta[name="csrf-token"]').attr('content')
          });
        }
      }

    });

  //lazy loading of images
  $('#content .fluid.card .img img, img.ui.avatar.image, a.avatar.image img')
    .visibility({
      type: 'image',
      offset: 0,
      onLoad: function (calculations) {
        $('#content .fluid.card .img img, img.ui.avatar.image, a.avatar.image img').visibility('refresh');
      }
    })
    ;

//this is the Share button
  $('.ui.share.button')
    .on('click', function () {
      $('.ui.small.basic.share.modal')
        .modal('show');
  });

  $(".dimmer.soon").dimmer({
        closable: false
      });


  // flag a post
  $('.flag.button')
    .on('click', function () {
      let flag = Date.now();
      var post = $(this).closest(".ui.card");
      let postID = post.attr("postID");
      let actionType = 'free play';
      switch(currentPageForHeader){
        case 'sim':
        case 'free-play':
        case 'free-play2':
        case 'free-play3':
        case 'free-play4':
          actionType = 'guided activity';
          break;
        case 'tutorial':
          actionType = 'tutorial';
          break;
        default:
          actionType = 'free play';
          break;
      }
      if(actionType === "free play" || enableDataCollection) {
        $.post("/feed", {
          actionType: actionType,
          postID: postID,
          modual: currentModuleForHeader,
          flag: flag,
          _csrf: $('meta[name="csrf-token"]').attr('content')
        });
      }
      console.log("Removing Post content now!");
      post.find(".ui.dimmer.flag").dimmer({
        closable: false
      })
        .dimmer('show');
      //repeat to ensure its closable
      post.find(".ui.dimmer.flag").dimmer({
        closable: true
      })
        .dimmer('show');

      let pathArray = window.location.pathname.split('/');
      let mod = pathArray[2];

      if(mod =="digital-literacy")

      {
        //console.log("CLICKING ON DIG INGO FLAG");
        $('input[type=checkbox]').prop('checked',false);
        if (actionType === 'free play') {
          recordModalInputs('digital-literacy_flagModal');
        } else if (actionType === 'guided activity'){
          recordSimModalInputs('digital-literacy_flagModal');
        }
      }


    });



  introJs().start();


});
