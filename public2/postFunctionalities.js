let pathArrayForHeader;
let currentPageForHeader;
let currentModuleForHeader;

function addHumanizedTimeToPost() {
  const target = $(this);
  const ms = parseInt(target.text(), 10);
  const time = new Date(ms);
  date_formats = {
    past: [
      { ceiling: 2, text: "Hace $seconds segundo" },
      { ceiling: 60, text: "Hace $seconds segundos" },
      { ceiling: 120, text: "Hace $minutes minuto" },
      { ceiling: 3600, text: "Hace $minutes minutos" },
      { ceiling: 7200, text: "Hace $hours hora" },
      { ceiling: 86400, text: "Hace $hours horas" },
      { ceiling: 172800, text: "Hace $days día" },
      { ceiling: 2629744, text: "Hace $days días" },
      { ceiling: 31556926, text: "Hace $months meses" },
      { ceiling: null, text: "Hace $years años" },
    ],
    future: [
      { ceiling: 2, text: "En $seconds segundo" },
      { ceiling: 60, text: "En $seconds segundos" },
      { ceiling: 120, text: "En $minutes minuto" },
      { ceiling: 3600, text: "En $minutes minutos" },
      { ceiling: 7200, text: "En $hours hora" },
      { ceiling: 86400, text: "En $hours horas" },
      { ceiling: 172800, text: "Hace $days día" },
      { ceiling: 2629744, text: "En $days días" },
      { ceiling: 31556926, text: "En $months meses" },
      { ceiling: null, text: "En $years años" },
    ],
  };

  target.text(humanized_time_span(time, Date.now(), date_formats));
}

function getActionType(currentPage) {
  let actionType = "free play";
  switch (currentPage) {
    case "sim":
    case "sim1":
    case "sim2":
    case "sim3":
    case "sim4":
    case "free-play":
    case "free-play2":
    case "free-play3":
    case "free-play4":
      actionType = "guided activity";
      break;
    case "tutorial":
      actionType = "tutorial";
      break;
    default:
      actionType = "free play";
      break;
  }
  return actionType;
}

// ****** actions on main post *******

function likePost(e) {
    const enableDataCollection = e.data.enableDataCollection;
    const target = $(e.target).closest('.ui.like.button');
    const label = target.closest('.ui.like.button').next("a.ui.basic.red.left.pointing.label.count");
    const postID = target.closest(".ui.fluid.card").attr("postID");
    const currDate = Date.now();

    // Determine if the comment is being LIKED or UNLIKED based on the initial
    // button color. Red = UNLIKE, Not Red = LIKE.
    if (target.hasClass("red")) { //Unlike Post
        target.removeClass("red");
        label.html(function(i, val) { return val * 1 - 1 });
    } else { // Like post
        target.addClass("red");
        label.html(function(i, val) { return val * 1 + 1 });

        // Store information about the action
        let pathArrayForHeader = window.location.pathname.split("/");
        let currentPageForHeader = pathArrayForHeader[1];
        let currentModuleForHeader = pathArrayForHeader[2];
        const actionType = getActionType(currentPageForHeader);
        if (actionType === "free play" || enableDataCollection) {
            $.post("/feed", {
                actionType: actionType,
                postID: postID,
                modual: currentModuleForHeader,
                like: currDate,
                _csrf: $('meta[name="csrf-token"]').attr('content')
            });
        }
    }
} 

function flagPost(e) {
    const enableDataCollection = e.data.enableDataCollection;
    const target = $(e.target);
    const post = target.closest(".ui.card, .ui.fluid.card"); // Combined both selectors
    const postID = post.attr("postID");
    const flag = Date.now();
    
    // Get path information (from HEAD version)
    const pathArrayForHeader = window.location.pathname.split("/");
    const currentPageForHeader = pathArrayForHeader[1];
    const currentModuleForHeader = pathArrayForHeader[2];
    const actionType = getActionType(currentPageForHeader);

    if (actionType === "free play" || enableDataCollection) {
        $.post("/feed", {
            actionType: actionType,
            postID: postID,
            modual: currentModuleForHeader,
            flag: flag,
            _csrf: $('meta[name="csrf-token"]').attr("content"),
        });
    }

    // Combined dimmer handling from both versions
    post.find(".ui.dimmer.flag")
        .dimmer({
            closable: false
        })
        .dimmer("show")
        .dimmer({
            closable: true  // From second version
        })
        .dimmer("show");

    // Digital-literacy specific handling (combined)
    if (currentModuleForHeader == "digital-literacy") {
        $(".ui.modal input[type=checkbox]").prop("checked", false);
        if (actionType === "free play" && post.attr("isArticle") !== undefined) {
            recordModalInputs("digital-literacy_flagModal");
        } else if (actionType === "guided activity") {
            recordSimModalInputs("digital-literacy_flagModal");
        }
    }

    if (currentModuleForHeader === "cyberbullying" &&
        (postID === "cyberbullying_sim_post3" ||
         postID === "cyberbullying_sim_post4")) {
        clickPost = true; //see cyberbullying_sim.pug for initialization and comments
        $("#confirmContinueCheck").hide();
    }
}

function sharePost(e) {
    $('.ui.small.basic.share.modal').modal('show');
    const enableDataCollection = e.data.enableDataCollection;
    const target = $(e.target);
    const share = Date.now();
    const post = target.closest(".ui.card");
    const postID = post.attr("postID");
    const actionType = getActionType(currentPageForHeader);
    let pathArrayForHeader = window.location.pathname.split("/");
    let currentPageForHeader = pathArrayForHeader[1];
    let currentModuleForHeader = pathArrayForHeader[2];

    if (actionType === "free play" || enableDataCollection) {
        $.post("/feed", {
            actionType: actionType,
            postID: postID,
            modual: currentModuleForHeader,
            share: share,
            _csrf: $('meta[name="csrf-token"]').attr('content')
        });
    }
}

// ****** actions on a comment *******

async function addNewComment(event) {
  const enableDataCollection =
    $('meta[name="isDataCollectionEnabled"]').attr("content") === "true";
  let pathArrayForHeader = window.location.pathname.split("/");
  let currentPageForHeader = pathArrayForHeader[1];
  let currentModuleForHeader = pathArrayForHeader[2];
  let target = $(event.target);
  if (!target.hasClass("link")) {
    target = target.siblings(".link");
  }
  const text = target.siblings("input.newcomment").val();
  const card = target.parents(".ui.fluid.card");
  let comments = card.find(".ui.comments");

  // no comments area - add it
  if (!comments.length) {
    const buttons = card.find(".three.ui.bottom.attached.icon.buttons");
    buttons.after('<div class="content"><div class="ui comments"></div>');
    comments = card.find(".ui.comments");
  }
  if (text.trim() !== "") {
    const date = Date.now();
    const ava = target.siblings(".ui.label").find("img.ui.avatar.image");
    const ava_img = ava.attr("src");
    const ava_name = ava.attr("name");
    const postID = card.attr("postID");

    const date_formats = {
      past: [
        { ceiling: 2, text: "Hace $seconds segundo" },
        { ceiling: 60, text: "Hace $seconds segundos" },
        { ceiling: 120, text: "Hace $minutes minuto" },
        { ceiling: 3600, text: "Hace $minutes minutos" },
        { ceiling: 7200, text: "Hace $hours hora" },
        { ceiling: 86400, text: "Hace $hours horas" },
        { ceiling: 172800, text: "Hace $days día" },
        { ceiling: 2629744, text: "Hace $days días" },
        { ceiling: 31556926, text: "Hace $months meses" },
        { ceiling: null, text: "Hace $years años" },
      ],
    };

    const time_units = [
      [31556926, "years"],
      [2629744, "months"],
      [172800, "days"],
      [86400, "day"],
      [7200, "hours"],
      [3600, "hour"],
      [120, "minutes"],
      [60, "minute"],
      [2, "seconds"],
      [1, "second"],
    ];

    const time_ago_text = humanized_time_span(
      date,
      null,
      date_formats,
      time_units
    );

    const mess = `<div class="comment">
            <a class="avatar"> <img src="${ava_img}"> </a>
            <div class="content">
              <a class="author">${ava_name}</a>
              <div class="metadata">
                <span class="date">${time_ago_text}</span>
                <i class="heart icon"></i> 0 Likes
              </div>
              <div class="text">${text}</div>
            </div>
          </div>`;
    target.siblings("input.newcomment").val("");
    comments.append(mess);
    if (card.attr("type") == "userPost") {
      await $.post("/userPost_feed", {
        postID: postID,
        new_comment: date,
        comment_text: text,
        _csrf: $('meta[name="csrf-token"]').attr("content"),
      });
    } else {
      let actionType = getActionType(currentPageForHeader);
      if (actionType === "free play" || enableDataCollection) {
        $.post("/feed", {
          actionType: actionType,
          modual: currentModuleForHeader,
          postID: postID,
          new_comment: date,
          comment_text: text,
          _csrf: $('meta[name="csrf-token"]').attr("content"),
        });
      }
    }
    try {
      document.body.hints.refresh();
    } catch (error) {
      if (!(error instanceof TypeError)) {
        console.error(error);
      }
    }
    if (
      currentModuleForHeader === "cyberbullying" &&
      (postID === "cyberbullying_sim_post1" ||
        postID === "cyberbullying_sim_post3" ||
        postID === "cyberbullying_sim_post4")
    ) {
      clickPost = true;
      $("#confirmContinueCheck").hide();
    }
  }
}

function likeComment(e) {
    const enableDataCollection = e.data.enableDataCollection;
    const target = $(e.target);
    const comment = target.parents('.comment');
    const label = comment.find('span.num');

    const postID = target.closest(".ui.fluid.card").attr("postID");
    const commentID = comment.attr('commentID');
    const like = Date.now();

    // Determine if the comment is being LIKED or UNLIKED based on the initial
    // button color. Red = UNLIKE, Not Red = LIKE.
    if (target.hasClass('red')) {
        target.removeClass('red');
        comment.find('i.heart.icon').removeClass('red');
        target.html('Like');
        // Decrease the like count by 1
        label.html(function(i, val) { return val * 1 - 1 });
    } else {
        target.addClass('red');
        comment.find('i.heart.icon').addClass('red');
        target.html('Unlike');
        // Increase the like count by 1
        label.html(function(i, val) { return val * 1 + 1 });

        const actionType = getActionType(currentPageForHeader);

        if (actionType === "free play" || enableDataCollection) {
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

function flagComment(e) {
  const enableDataCollection = e.data.enableDataCollection;
  const comment = $(this).parents(".comment");
  const postID = $(this).closest(".ui.fluid.card").attr("postID");
  const typeID = $(this).closest(".ui.card").attr("type");
  const commentID = comment.attr("commentID");
  const flag = Date.now();
  let pathArrayForHeader = window.location.pathname.split("/");
  let currentPageForHeader = pathArrayForHeader[1];
  let currentModuleForHeader = pathArrayForHeader[2];
  let actionType = getActionType(currentPageForHeader);
  
  comment.replaceWith(
    `<div class='comment' style='background-color:black;color:white;'>
      <h5 class='ui inverted header'>
        <span>
        Los administradores de TestDrive revisaran este comentario pronto. Lamentamos que hayas tenido esta experiencia.
        </span>
      </h5>
    </div>`
  );

  if (typeID == "userPost") {
    $.post("/userPost_feed", {
      postID: postID,
      commentID: commentID,
      flag: flag,
      _csrf: $('meta[name="csrf-token"]').attr("content"),
    });
  } else {
    if (actionType === "free play" || enableDataCollection) {
      $.post("/feed", {
        actionType: actionType,
        modual: currentModuleForHeader,
        postID: postID,
        commentID: commentID,
        flag: flag,
        _csrf: $('meta[name="csrf-token"]').attr("content"),
      });
    }
  }
  
  try {
    // We store the page's hints on the body for easy access
    document.body.hints.refresh();
  } catch (error) {
    if (!(error instanceof TypeError)) {
      console.error(error);
    }
  }
  
  if (currentModuleForHeader === "cyberbullying" &&
      (commentID === "cyberbullying_sim_post4_comment1" ||
       commentID === "cyberbullying_sim_post1_comment1")) {
    clickPost = true; //see cyberbullying_sim.pug for initialization and comments
    $("#confirmContinueCheck").hide();
  }
}

$(window).on("load", () => {
  const enableDataCollection =
    $('meta[name="isDataCollectionEnabled"]').attr("content") === "true";
  let pathArrayForHeader = window.location.pathname.split('/');
  let currentPageForHeader = pathArrayForHeader[1];
  let currentModuleForHeader = pathArrayForHeader[2];
  
  // add humanized time to all posts
  $(".right.floated.time.meta, .date.sim, .time.notificationTime").each(
    addHumanizedTimeToPost
  );

  // Focus new comment element if "Reply" button is clicked
  $(".reply.button").click(function () {
    const parent = $(this).closest(".ui.fluid.card");
    parent.find("input.newcomment").focus();
  });

  // Press enter to submit a comment
  // Note that this listener has to be added to the window and
  // specified for the capture phase of the event loop so that
  // it precedes intro.js's own event handler and prevents it
  // from running (and thus advancing the intro when what we
  // really want is simply to add a comment).
  // See here for a good explanation of the capture phase:
  // https://signalvnoise.com/posts/3137-using-event-capturing-to-improve-basecamp-page-load-times
  window.addEventListener(
    "keydown",
    function (event) {
      if (event.key === "Enter" && event.target.className == "newcomment") {
        event.stopImmediatePropagation();
        event.preventDefault();
        $(event.target).parents(".ui.form").siblings("i.big.send.link.icon").click();
      }
    },
    true
  );

  // create a new comment
  $("i.big.send.link.icon").click({ enableDataCollection }, addNewComment);

  // like a post
  $(".like.button").click({ enableDataCollection }, likePost);

  // like a comment
  $("a.like.comment").click({ enableDataCollection }, likeComment);

  // Only enable flagging and sharing functionality when not in tutorial pages
  if (currentPageForHeader !== "tutorial") {
    // flag a post
    $(".flag.button").on("click", { enableDataCollection }, flagPost);
    
    // flag a comment
    $("a.flag.comment").click({ enableDataCollection }, flagComment);
    
    // share a post
    $(".ui.share.button").on("click", { enableDataCollection }, sharePost);
  }
});
