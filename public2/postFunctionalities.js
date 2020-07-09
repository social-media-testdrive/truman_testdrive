function addHumanizedTimeToPost(){
  let target = $(this);
  var ms = parseInt(target.text(), 10);
  let time = new Date(ms);
  target.text(humanized_time_span(time));
}

// ****** actions on main post *******

function likePost(){
  let target = $(event.target);
  console.log("CLICK LIKE");
  //if already liked, unlike if pressed
  if (target.hasClass("red")) {
    console.log("***********UNLIKE: post");
    target.removeClass("red");
    var label = $(this).next("a.ui.basic.red.left.pointing.label.count");
    label.html(function (i, val) { return val * 1 - 1 });
  }
  //since not red, this button press is a LIKE action
  else {
    target.addClass("red");
    var label = $(this).next("a.ui.basic.red.left.pointing.label.count");
    label.html(function (i, val) { return val * 1 + 1 });
    var postID = $(this).closest(".ui.fluid.card.dim").attr("postID");
    //var like = Date.now();
    console.log("***********LIKE: post " + postID);
    $.post("/feed", { postID: postID, like: 1, _csrf: $('meta[name="csrf-token"]').attr('content') });

  }
};

function flagPost(){
  var post = $(this).closest(".ui.fluid.card.dim");
  var postID = post.attr("postID");
  console.log("***********FLAG: post " + postID);
  $.post("/feed", {
    postID: postID,
    flag: 1,
    _csrf: $('meta[name="csrf-token"]').attr('content')
  });
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
    console.log("CLICKING ON DIG INGO FLAG")
    $('input[type=checkbox]').prop('checked',false);
    $('.ui.small.info.flag.modal').modal('show');
  }
};

function sharePost(){
  $('.ui.small.basic.share.modal').modal('show');
};

// ***********************************

// ****** actions on a comment *******

async function addNewComment(event) {
  let target = $(event.target);
  if (!target.hasClass('link')) {
    target = target.siblings('.link');
  }
  const text = target.siblings('input.newcomment').val();
  const card = target.parents('.ui.fluid.card');
  let comments = card.find('.ui.comments');
  // no comments area - add it
  console.log(`Comments is now ${comments.length}`);
  if (!comments.length) {
    console.log('Adding new Comments sections');
    const buttons = card.find('.three.ui.bottom.attached.icon.buttons');
    buttons.after('<div class="content"><div class="ui comments"></div>');
    comments = card.find('.ui.comments');
  }
  if (text.trim() !== '') {
    console.log(text);
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
          <div class="actions">
            <a class="like">Like</a>
            <a class="flag">Flag</a>
          </div>
        </div>
      </div>`
    );
    target.siblings('input.newcomment').val('');
    comments.append(mess);
    console.log(
      `######### NEW COMMENTS:  PostID:  ${postID}, new_comment time` +
      ` is ${date} and text is ${text}`
    );

    if (card.attr('type') == 'userPost')
      await $.post('/userPost_feed', {
        postID: postID,
        new_comment: date,
        comment_text: text,
        _csrf: $('meta[name="csrf-token"]').attr('content')
      });
    else
      await $.post('/feed', {
        postID: postID,
        new_comment: date,
        comment_text: text,
        _csrf: $('meta[name="csrf-token"]').attr('content')
      });

    // We store the page's hints on the body for easy access
    document.body.hints.refresh();
  }
}

function likeComment(event) {
  const target = $(event.target);
  //if already liked, unlike if pressed
  if (target.hasClass('red')) {
    //console.log('***********UNLIKE: post');
    //Un read Like Button
    target.removeClass('red');

    const comment = target.parents('.comment');
    comment.find('i.heart.icon').removeClass('red');

    const label = comment.find('span.num');
    label.html(function (i, val) { return val * 1 - 1 });
  }
  //since not red, this button press is a LIKE action
  else {
    target.addClass('red');
    const comment = target.parents('.comment');
    comment.find('i.heart.icon').addClass('red');

    const label = comment.find('span.num');
    label.html(function (i, val) { return val * 1 + 1 });

    const postID = target.closest('.ui.fluid.card').attr('postID');
    const commentID = comment.attr('commentID');
    const like = Date.now();
    //console.log('#########COMMENT LIKE:  PostID: ' + postID + ', Comment ID: ' + commentID + ' at time ' + like);

    if (target.closest('.ui.fluid.card').attr('type') == 'userPost')
      $.post('/userPost_feed', {
        postID: postID,
        commentID: commentID,
        like: like,
        _csrf: $('meta[name="csrf-token"]').attr('content')
      });
    else
      $.post('/feed', {
        postID: postID,
        commentID: commentID,
        like: like,
        _csrf: $('meta[name="csrf-token"]').attr('content')
      });
  }
}

function flagComment() {
  const comment = $(this).parents('.comment');
  const postID = $(this).closest('.ui.fluid.card').attr('postID');
  const typeID = $(this).closest('.ui.fluid.card').attr('type');
  const commentID = comment.attr('commentID');
  comment.replaceWith(
    `<div class='comment' style='background-color:black;color:white'>
    <h5 class='ui inverted header'><span>The admins will review this post
    further. We are sorry you had this experience.</span></h5></div>`);
  const flag = Date.now();

  // console.log('#########COMMENT FLAG:  PostID: ' + postID + ', Comment ID: ' + commentID + '  TYPE is ' + typeID + ' at time ' + flag);

  if (typeID == 'userPost') {
    $.post('/userPost_feed', {
      postID,
      commentID,
      flag,
      _csrf: $('meta[name="csrf-token"]').attr('content')
    });
  } else {
    $.post('/feed', {
      postID,
      commentID,
      flag,
      _csrf: $('meta[name="csrf-token"]').attr('content')
    });
  }

  document.body.hints.refresh();
}

// **********************************


$(window).on('load', () => {
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
  $('.like.button').on('click', likePost);

  // create a new Comment
  $('i.big.send.link.icon').click(addNewComment);

  // like a comment
  $('a.like.comment').click(likeComment);

  // flag a comment
  $('a.flag.comment').click(flagComment);


  // only enable certain functionality when not in a tutorial page
  // TODO: double check with Yoon that this is intended behavior
  let pathArray = window.location.pathname.split('/');
  let currentPage = pathArray[1];
  if(currentPage !== "tutorial"){

    // flag a post
    $('.flag.button').on('click', flagPost);

    // share a post
    $('.ui.share.button').on('click', sharePost);

  }

});
