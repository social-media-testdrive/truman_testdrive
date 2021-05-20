function addHumanizedTimeToPost(){
  let target = $(this);
  var ms = parseInt(target.text(), 10);
  let time = new Date(ms);
  target.text(humanized_time_span(time));
}

function getActionType(currentPage){
  let actionType = 'free play';
  switch(currentPage){
    case 'sim':
    case 'sim1':
    case 'sim2':
    case 'sim3':
    case 'sim4':
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
  return actionType;
}

// ****** actions on main post *******

function likePost(e){
  const enableDataCollection = e.data.enableDataCollection;
  let target = $(event.target);
  // Determine if the comment is being LIKED or UNLIKED based on the initial
  // button color. Red = UNLIKE, Not Red = LIKE.
  if (target.closest('.ui.like.button').hasClass("red")) {
    // Since the button was already red, this button press is an UNLIKE action.
    // Remove red color from like button and decrease the displayed like count
    target.closest('.ui.like.button').removeClass("red");
    const label = $(this).closest('.ui.like.button')
      .next("a.ui.basic.red.left.pointing.label.count");
    label.html(function (i, val) { return val * 1 - 1 });
  } else {
    // Since the button was not red, this button press is a LIKE action
    // Add red color to like button and increase the displayed like count
    target.closest('.ui.like.button').addClass("red");
    var label = $(this).next("a.ui.basic.red.left.pointing.label.count");
    label.html(function (i, val) { return val * 1 + 1 });
    // Store information about the action
    let pathArrayForHeader = window.location.pathname.split('/');
    let currentPageForHeader = pathArrayForHeader[1];
    let currentModuleForHeader = pathArrayForHeader[2];
    let postID = $(this).closest(".ui.card").attr("postID");
    let actionType = getActionType(currentPageForHeader);
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
};

function flagPost(e){
  const enableDataCollection = e.data.enableDataCollection;
  let flag = Date.now();
  var post = $(this).closest(".ui.card");
  let postID = post.attr("postID");
  let pathArrayForHeader = window.location.pathname.split('/');
  let currentPageForHeader = pathArrayForHeader[1];
  let currentModuleForHeader = pathArrayForHeader[2];
  let actionType = getActionType(currentPageForHeader);
  if(actionType === "free play" || enableDataCollection) {
    $.post("/feed", {
      actionType: actionType,
      postID: postID,
      modual: currentModuleForHeader,
      flag: flag,
      _csrf: $('meta[name="csrf-token"]').attr('content')
    });
  }
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
};

function sharePost(){
  $('.ui.small.basic.share.modal').modal('show');
};

// ***********************************

// ****** actions on a comment *******

async function addNewComment(event) {
  const enableDataCollection = $('meta[name="isDataCollectionEnabled"]').attr('content') === "true";
  let pathArrayForHeader = window.location.pathname.split('/');
  let currentPageForHeader = pathArrayForHeader[1];
  let currentModuleForHeader = pathArrayForHeader[2];
  let target = $(event.target);
  if (!target.hasClass('link')) {
    target = target.siblings('.link');
  }
  const text = target.siblings('input.newcomment').val();
  const card = target.parents('.ui.fluid.card');
  let comments = card.find('.ui.comments');
  // no comments area - add it
  if (!comments.length) {
    const buttons = card.find('.three.ui.bottom.attached.icon.buttons');
    buttons.after('<div class="content"><div class="ui comments"></div>');
    comments = card.find('.ui.comments');
  }
  if (text.trim() !== '') {
    const date = Date.now();
    const ava = target.siblings('.ui.label').find('img.ui.avatar.image');
    const ava_img = ava.attr('src');
    const ava_name = ava.attr('name');
    const postID = card.attr('postID');

    const mess = (
      `<div class="comment">
        <a class="avatar"> <img src="${ava_img}"> </a>
        <div class="content">
          <a class="author">${ava_name}</a>
          <div class="metadata">
            <span class="date">${humanized_time_span(date)}</span>
            <i class="heart icon"></i> 0 Likes
          </div>
          <div class="text">${text}</div>
        </div>
      </div>`
    );
    target.siblings('input.newcomment').val('');
    comments.append(mess);
    if (card.attr('type') == 'userPost') {
      await $.post('/userPost_feed', {
        postID: postID,
        new_comment: date,
        comment_text: text,
        _csrf: $('meta[name="csrf-token"]').attr('content')
      });
    } else {
      let actionType = getActionType(currentPageForHeader);
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
    try {
      // We store the page's hints on the body for easy access
      document.body.hints.refresh();
    } catch (error) {
      if( !(error instanceof TypeError) ){
        console.error(error);
      }
    }
  }
}

function likeComment(e) {
  const enableDataCollection = e.data.enableDataCollection;
  const target = $(event.target);
  // Determine if the comment is being LIKED or UNLIKED based on the initial
  // button color. Red = UNLIKE, Not Red = LIKE.
  if (target.hasClass('red')) {
    // Since the button was already red, this button press is an UNLIKE action.
    // Remove red color from Like Button and heart icon
    target.removeClass('red');
    const comment = target.parents('.comment');
    comment.find('i.heart.icon').removeClass('red');
    // Decrease the like count by 1
    const label = comment.find('span.num');
    label.html(function (i, val) { return val * 1 - 1 });
  } else {
    // Since the button was not red, this button press is a LIKE action
    // Add red color to heart icon
    target.addClass('red');
    const comment = target.parents('.comment');
    comment.find('i.heart.icon').addClass('red');
    // Increase the like count by 1
    const label = comment.find('span.num');
    label.html(function (i, val) { return val * 1 + 1 });
    // Get information about the post/comment/timestamp
    const postID = $(this).closest('.ui.card').attr("postID");
    const commentID = comment.attr('commentID');
    const like = Date.now();
    let pathArrayForHeader = window.location.pathname.split('/');
    let currentPageForHeader = pathArrayForHeader[1];
    let currentModuleForHeader = pathArrayForHeader[2];
    let actionType = getActionType(currentPageForHeader);
    if ($(this).closest(".ui.fluid.card").attr("type") == 'userPost') {
      $.post("/userPost_feed", {
        postID: postID,
        commentID: commentID,
        like: like,
        _csrf: $('meta[name="csrf-token"]').attr('content')
      });
    } else {
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
}

function flagComment(e) {
  const enableDataCollection = e.data.enableDataCollection;
  const comment = $(this).parents('.comment');
  const postID = $(this).closest('.ui.fluid.card').attr('postID');
  const typeID = $(this).closest(".ui.card").attr("type");
  const commentID = comment.attr('commentID');
  const flag = Date.now();
  let pathArrayForHeader = window.location.pathname.split('/');
  let currentPageForHeader = pathArrayForHeader[1];
  let currentModuleForHeader = pathArrayForHeader[2];
  let actionType = getActionType(currentPageForHeader);
  comment.replaceWith(
    `<div class='comment' style='background-color:black;color:white;'>
      <h5 class='ui inverted header'>
        <span>
          The admins will review this post further. We are sorry you had this experience.
        </span>
      </h5>
    </div>`);

  if (typeID == 'userPost') {
    $.post("/userPost_feed", {
      postID: postID,
      commentID: commentID,
      flag: flag,
      _csrf: $('meta[name="csrf-token"]').attr('content')
    });
  } else {
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
  }
  try {
    // We store the page's hints on the body for easy access
    document.body.hints.refresh();
  } catch (error) {
    if( !(error instanceof TypeError) ){
      console.error(error);
    }
  }
}

// **********************************


$(window).on('load', () => {
  const enableDataCollection = $('meta[name="isDataCollectionEnabled"]').attr('content') === "true";
  /*
  focus on new comment prompt if clicked
  */
  $('.reply.button').click(function () {
    let parent = $(this).closest('.ui.fluid.card');
    // let postID = parent.attr('postID');

    parent.find('input.newcomment').focus();
  });

  // press enter to submit a comment
  // Note that this listener has to be added to the window and
  // specified for the capture phase of the event loop so that
  // it precedes intro.js's own event handler and prevents it
  // from running (and thus advancing the intro when what we
  // really want is simply to add a comment).
  // See here for a good explanation of the capture phase:
  // https://signalvnoise.com/posts/3137-using-event-capturing-to-improve-basecamp-page-load-times
  window.addEventListener('keydown', function (event) {
    // console.log(event.target);
    if (event.keyCode === 13 && event.target.className == 'newcomment') {
      event.stopImmediatePropagation();
      addNewComment(event);
    }
  }, true);

  // add humanized time to all posts
  $('.right.floated.time.meta, .date.sim, .time.notificationTime').each(addHumanizedTimeToPost);

  // like a post
  $('.like.button').click({enableDataCollection}, likePost);

  // create a new Comment
  $('i.big.send.link.icon').click({enableDataCollection},addNewComment);

  // like a comment
  $('a.like.comment').click({enableDataCollection},likeComment);

  // flag a comment
  $('a.flag.comment').click({enableDataCollection},flagComment);


  // only enable certain functionality when not in a tutorial page
  // TODO: double check with Yoon that this is intended behavior
  let pathArray = window.location.pathname.split('/');
  let currentPage = pathArray[1];
  if(currentPage !== "tutorial"){

    // flag a post
    $('.flag.button').on('click', {enableDataCollection}, flagPost);

    // share a post
    $('.ui.share.button').on('click', sharePost);

  }

});
