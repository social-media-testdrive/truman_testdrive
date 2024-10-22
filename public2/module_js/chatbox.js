$(window).on("load", function() {
    const pathArray = window.location.pathname.split('/');
    $('.chat').each(function() {
        const chatId = this.id;
        const chat = {
            messageToSend: '',
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
                    const template = Handlebars.compile($("#message-template").html());
                    const context = {
                        messageOutput: this.messageToSend,
                        time: this.getCurrentTime()
                    };

                    this.$chatHistoryList.append(template(context));
                    this.scrollToBottom();
                    this.$textarea.val('');

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
            }
        };
        chat.init();
    });

    // Minimize a chat box
    $('.chat-minimize, .chat-header').click(function(e) {
        e.stopImmediatePropagation();
        const chat = $(this).closest('.chat').children('.chat-history');
        chat.slideToggle(300, 'swing');
        const chatId = $(this).closest('.chat')[0].id;

        $.post("/chatAction", {
            absTime: Date.now(),
            chatId: (chatId) ? chatId : 'chatbox1',
            subdirectory2: pathArray[2],
            subdirectory1: pathArray[1],
            minimized: true,
            _csrf: $('meta[name="csrf-token"]').attr('content')
        });
    });

    // Close a chat box
    $('.chat-close').click(function(e) {
        // Prevent user from closing the chat box
        if (pathArray[1] == "modual") {
            e.preventDefault();
            e.stopImmediatePropagation();
            $(this).closest('.chat').transition('fade down');
        } else {
            e.stopImmediatePropagation();
            const chat = $(this).closest('.chat').children('.chat-history');
            chat.slideToggle(300, 'swing');
        }
        const chatId = $(this).closest('.chat')[0].id;

        $.post("/chatAction", {
            absTime: Date.now(),
            chatId: (chatId) ? chatId : 'chatbox1',
            subdirectory2: pathArray[2],
            subdirectory1: pathArray[1],
            closed: true,
            _csrf: $('meta[name="csrf-token"]').attr('content')
        });
    });

    // This prevents the user from moving to the next step when they press the "Enter" key in the chat in safe-posting. 
    window.addEventListener('keydown', function(event) {
        if (event.key === 'Enter' && event.target.id == 'message-to-send') {
            event.stopImmediatePropagation();
        }
    }, true);
});