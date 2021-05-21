$(window).on("load", function () {

  $('.container.clearfix').each(function () {

    let pathArray = window.location.pathname.split('/');
    var chatId = this.id

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
        } else {
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
});
