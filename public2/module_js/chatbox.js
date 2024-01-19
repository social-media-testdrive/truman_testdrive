$(window).on("load", function() {
    const pathArray = window.location.pathname.split('/');

    $('.container.clearfix').each(function() {
        const chatId = this.id;
        const chat = {
            messageToSend: '',
            messageResponses: [
                'OK !!',
                'OK !!',
                'OK !!'
            ],
            init: function() {
                this.cacheDOM();
                this.bindEvents();
                this.render();
            },
            cacheDOM: function() {
                if (chatId) {
                    this.$chatHistory = $('#' + chatId + ' .chat-history');
                    this.$button = $('#' + chatId + ' button');
                    this.$textarea = $('#' + chatId + ' #message-to-send');
                    this.$chatHistoryList = this.$chatHistory.find('ul');
                } else {
                    this.$chatHistory = $('.chat-history');
                    this.$button = $('button');
                    this.$textarea = $('#message-to-send');
                    this.$chatHistoryList = this.$chatHistory.find('ul');
                }
            },
            bindEvents: function() {
                this.$button.on('click', this.addMessage.bind(this));
                this.$textarea.on('keyup', this.addMessageEnter.bind(this));
            },
            render: function() {
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

                    // Reponses. Commented out. Template also removed from chatBox.pug.
                    // var templateResponse = Handlebars.compile($("#message-response-template").html());
                    // var contextResponse = {
                    //     response: this.getRandomItem(this.messageResponses),
                    //     time: this.getCurrentTime()
                    // };

                    setTimeout(function() {
                        this.scrollToBottom();
                    }.bind(this), 1500);
                }
            },

            addMessage: function() {
                this.messageToSend = this.$textarea.val();

                $.post("/chatAction", {
                    message: this.$textarea.val(),
                    absTime: Date.now(),
                    chatId: (chatId) ? chatId : 'chatbox1',
                    subdirectory1: pathArray[1],
                    subdirectory2: pathArray[2],
                    _csrf: $('meta[name="csrf-token"]').attr('content')
                });
                this.render();
            },

            addMessageEnter: function(event) {
                // enter was pressed
                if (event.keyCode === 13) {
                    this.addMessage();
                }
            },

            scrollToBottom: function() {
                if (this.$chatHistory[0]) {
                    this.$chatHistory.scrollTop(this.$chatHistory[0].scrollHeight);
                }
            },

            getCurrentTime: function() {
                return new Date().toLocaleTimeString().
                replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3");
            },

            getRandomItem: function(arr) {
                return arr[Math.floor(Math.random() * arr.length)];
            }
        };

        if ((pathArray[2] == 'safe-posting') || (pathArray[2] == 'phishing')) {
            chat.init();
        };
    });

    //Minimize a chat box
    $('a.chat-minimize').click(function(e) {
        e.preventDefault();
        let chat = $(this).closest('.chat').children('.chat-history');
        chat.slideToggle(300, 'swing');
        var chatId = $(this).closest('.container.clearfix')[0].id;

        $.post("/chatAction", {
            absTime: Date.now(),
            chatId: (chatId) ? chatId : 'chatbox1',
            subdirectory2: pathArray[2],
            subdirectory1: pathArray[1],
            minimized: true,
            _csrf: $('meta[name="csrf-token"]').attr('content')
        });
    });

    //Close a chat box
    $('a.chat-close').click(function(e) {
        e.preventDefault();
        let chat = $(this).closest('.chat');
        chat.fadeOut(300, 'swing');
        var chatId = $(this).closest('.container.clearfix')[0].id;

        $.post("/chatAction", {
            absTime: Date.now(),
            chatId: (chatId) ? chatId : 'chatbox1',
            subdirectory2: pathArray[2],
            subdirectory1: pathArray[1],
            closed: true,
            _csrf: $('meta[name="csrf-token"]').attr('content')
        });
    });
});