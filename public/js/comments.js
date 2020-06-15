function addNewComment(event){
  let target = $(event.target);
  if(!target.hasClass('link')){
    target = target.siblings('.link');
  }
  const text = target.siblings("input.newcomment").val();
  const card = target.parents(".ui.fluid.card");
  let comments = card.find(".ui.comments")
  //no comments area - add it
  console.log(`Comments is now ${comments.length}`)
  if (!comments.length) {
    console.log("Adding new Comments sections")
    const buttons = card.find(".three.ui.bottom.attached.icon.buttons")
    buttons.after('<div class="content"><div class="ui comments"></div>');
    comments = card.find(".ui.comments")
  }
  if (text.trim() !== '') {
    console.log(text)
    const date = Date.now();
    const ava = target.siblings('.ui.label').find('img.ui.avatar.image');
    const ava_img = ava.attr("src");
    const ava_name = ava.attr("name");
    const postID = card.attr("postID");

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
    target.siblings("input.newcomment").val('');
    comments.append(mess);
    console.log(
      `######### NEW COMMENTS:  PostID:  ${postID}, new_comment time`+
      ` is ${date} and text is ${text}`
    );

    if (card.attr("type") == 'userPost')
      $.post("/userPost_feed", {
        postID: postID,
        new_comment: date,
        comment_text: text,
        _csrf: $('meta[name="csrf-token"]').attr('content')
      });
    else
      $.post("/feed", {
        postID: postID,
        new_comment: date,
        comment_text: text,
        _csrf: $('meta[name="csrf-token"]').attr('content')
      });
  }
}

function likeComment(event){
  const target = $(event.target);
  //if already liked, unlike if pressed
  if (target.hasClass("red")) {
    //console.log("***********UNLIKE: post");
    //Un read Like Button
    target.removeClass("red");

    const comment = target.parents(".comment");
    comment.find("i.heart.icon").removeClass("red");

    const label = comment.find("span.num");
    label.html(function (i, val) { return val * 1 - 1 });
  }
  //since not red, this button press is a LIKE action
  else {
    target.addClass("red");
    const comment = target.parents(".comment");
    comment.find("i.heart.icon").addClass("red");

    const label = comment.find("span.num");
    label.html(function (i, val) { return val * 1 + 1 });

    const postID = target.closest(".ui.fluid.card").attr("postID");
    const commentID = comment.attr("commentID");
    const like = Date.now();
    //console.log("#########COMMENT LIKE:  PostID: " + postID + ", Comment ID: " + commentID + " at time " + like);

    if (target.closest(".ui.fluid.card").attr("type") == 'userPost')
      $.post("/userPost_feed", {
        postID: postID,
        commentID: commentID,
        like: like,
        _csrf: $('meta[name="csrf-token"]').attr('content')
      });
    else
      $.post("/feed", {
        postID: postID,
        commentID: commentID,
        like: like,
        _csrf: $('meta[name="csrf-token"]').attr('content')
      });
  }
}

function flagComment(){
  const comment = $(this).parents(".comment");
  const postID = $(this).closest(".ui.fluid.card").attr("postID");
  const typeID = $(this).closest(".ui.fluid.card").attr("type");
  const commentID = comment.attr("commentID");
  comment.replaceWith(
    `<div class="comment" style="background-color:black;color:white">
    <h5 class="ui inverted header"><span>The admins will review this post
    further. We are sorry you had this experience.</span></h5></div>`);
  const flag = Date.now();

  //console.log("#########COMMENT FLAG:  PostID: " + postID + ", Comment ID: " + commentID + "  TYPE is " + typeID + " at time " + flag);

  if (typeID == 'userPost')
    $.post("/userPost_feed", { postID: postID, commentID: commentID, flag: flag, _csrf: $('meta[name="csrf-token"]').attr('content') });
  else
    $.post("/feed", { postID: postID, commentID: commentID, flag: flag, _csrf: $('meta[name="csrf-token"]').attr('content') });

  introJs().refresh();
}

$(window).on("load", function () {

  /*
  focus on new comment prompt if clicked
  */
  $('.reply.button').click(function () {
    let parent = $(this).closest(".ui.fluid.card");
    let postID = parent.attr("postID");

    parent.find("input.newcomment").focus();
  });

  // click enter to submit a comment
  $("input.newcomment").keyup(function (event) {
    if (event.keyCode === 13) {
      addNewComment(event);
    }
  });

  //create a new Comment
  $("i.big.send.link.icon").click(addNewComment);

  //Like a comment
  $('a.like.comment').click(likeComment);

  //flag a comment
  $('a.flag.comment').click(flagComment);

});
