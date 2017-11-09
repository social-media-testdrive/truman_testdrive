//$(document).ready(function() {

//Before Page load:
$('#content').hide();
$('#loading').show();

$(window).on("load", function() {

  //close loading dimmer on load
  $('#loading').hide();
  $('#content').attr('style', 'block');
  $('#content').fadeIn('slow');
  //close messages from flash message 
  $('.message .close')
  .on('click', function() {
    $(this)
      .closest('.message')
      .transition('fade')
    ;
  });

  //check bell
  if (!(top.location.pathname === '/login' || top.location.pathname === '/signup'))
  {
      
    $.getJSON( "/bell", function( json ) {
      
      if (json.result)
      {
        $("i.big.alarm.icon").replaceWith( '<i class="big icons"><i class="red alarm icon"></i><i class="corner yellow lightning icon"></i></i>' );
      }

   });
}

  //make checkbox work
  $('.ui.checkbox')
  .checkbox();

  //get add new reply post modal to show
  $('.reply.button').click(function () {
    
    let postID = $(this).closest( ".ui.fluid.card.dim" ).attr( "postID" );
    //let mod = $(this).closest( ".ui.fluid.card.dim" ).attr( "module" );
    $('#replyInput').attr("value", postID);
    //$('#replyModule').attr("value", mod);

    $(' .ui.small.reply.modal').modal('show');
});

  //get add new feed post modal to work
  $("#newpost, a.item.newpost").click(function () {
    $(' .ui.small.post.modal').modal('show');
});

  //new post validator (picture and text can not be empty)
  $('.ui.feed.form')
  .form({
    on: 'blur',
    fields: {
      body: {
        identifier  : 'body',
        rules: [
          {
            type   : 'empty',
            prompt : 'Please add some text your picture'
          }
        ]
      },
      picinput: {
        identifier  : 'picinput',
        rules: [
          {
            type: 'empty',
            prompt : 'Please click on Camera Icon to add a photo'
          }
        ]
      }
    }
  });

  $('.ui.reply.form')
  .form({
    on: 'blur',
    fields: {
      body: {
        identifier  : 'body',
        rules: [
          {
            type   : 'empty',
            prompt : 'Please add some text for your reply'
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
    
    $("#picinput").change(function(){
        //console.log("@@@@@ changing a photo");
        readURL(this);
    });

//add humanized time to all posts
$('.right.floated.time.meta, .date').each(function() {
    var ms = parseInt($(this).text(), 10);
    let time = new Date(ms);
    $(this).text(humanized_time_span(time)); 
});

  //Sign Up Button
  $('.ui.big.green.labeled.icon.button.signup')
  .on('click', function() {
    window.location.href='/signup';
  });

  //Sign Up Info Skip Button
  $('button.ui.button.skip')
  .on('click', function() {
    window.location.href='/info';
  });


//Pre qiuz for presentation mod (rocket!!!)
  $('.ui.big.green.labeled.icon.button.prepres')
  .on('click', function() {
    window.location.href='/modual/presentation'; 
  });

//Go to Post Quiz (Presentation)
  $('.ui.big.green.labeled.icon.button.prez_post_quiz')
  .on('click', function() {
    window.location.href='/postquiz/presentation'; 
  });

  //Go to Post Quiz (ANY)
  $('.ui.big.green.labeled.icon.button.post_quiz')
  .on('click', function() {
    let mod = $(this).attr( "mod" );
    console.log("Mod is now: "+mod);
    window.location.href='/postquiz/'+mod+'/wait'; 
  });


  $('.ui.big.green.labeled.icon.button.finished')
  .on('click', function() {
    window.location.href='/'; 
  });


  $('.ui.big.green.labeled.icon.button.finish_lesson')
  .on('click', function() {
    window.location.href='/'; 
  });

  //Community Rules Button (rocket!!!)
  $('.ui.big.green.labeled.icon.button.com')
  .on('click', function() {
    window.location.href='/info'; //maybe go to tour site???
  });

  //Info  (rocket!!!)
  $('.ui.big.green.labeled.icon.button.info')
  .on('click', function() {
    window.location.href='/'; //maybe go to tour site???
  });

  //More info Skip Button
  $('button.ui.button.skip')
  .on('click', function() {
    window.location.href='/com'; //maybe go to tour site???
  });

  //Edit button
  $('.ui.editprofile.button')
  .on('click', function() {
    window.location.href='/account';
  });

  //this is the REPORT User button
  $('button.ui.button.report')
  .on('click', function() {

    var username = $(this).attr( "username" );

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
  $('form#reportform').submit(function(e){

    e.preventDefault();
    $.post($(this).attr('action'), $(this).serialize(), function(res){
        // Do something with the response `res`
        console.log(res);
        // Don't forget to hide the loading indicator!
    });
    //return false; // prevent default action

});

  //this is the Block User button
  $('button.ui.button.block')
  .on('click', function() {

    var username = $(this).attr( "username" );
    //Modal for Blocked Users
    $('.ui.small.basic.blocked.modal')
      .modal({
        closable  : false,
        onDeny    : function(){ 
          //report user
          
        },
        onApprove : function() {
          //unblock user
          $.post( "/user", { unblocked: username, _csrf : $('meta[name="csrf-token"]').attr('content') } );
        }
      })
      .modal('show')
    ;

    
    console.log("***********Block USER "+username);
    $.post( "/user", { blocked: username, _csrf : $('meta[name="csrf-token"]').attr('content') } );

  });

  //Block Modal for User that is already Blocked
  $('.ui.on.small.basic.blocked.modal')
  .modal({
    closable  : false,
    onDeny    : function(){ 
      //report user
      
    },
    onApprove : function() {
      //unblock user
      var username = $('button.ui.button.block').attr( "username" );
      $.post( "/user", { unblocked: username, _csrf : $('meta[name="csrf-token"]').attr('content') } );

    }
  })
  .modal('show')
;

  //this is the LIKE button
  $('.like.button')
  .on('click', function() {

    //if already liked, unlike if pressed
    if ( $( this ).hasClass( "red" ) ) {
        console.log("***********UNLIKE: post");
        $( this ).removeClass("red");
        var label = $(this).next("a.ui.basic.red.left.pointing.label.count");
        label.html(function(i, val) { return val*1-1 });
    }
    //since not red, this button press is a LIKE action
    else{
      $(this).addClass("red");
      var label = $(this).next("a.ui.basic.red.left.pointing.label.count");
      label.html(function(i, val) { return val*1+1 });
      var postID = $(this).closest( ".ui.fluid.card.dim" ).attr( "postID" );
      //var like = Date.now();
      console.log("***********LIKE: post "+postID);
      $.post( "/feed", { postID: postID, like: 1, _csrf : $('meta[name="csrf-token"]').attr('content') } );

    }

  });

  //this is the FLAG button
  $('.flag.button')
  .on('click', function() {

     var post = $(this).closest( ".ui.fluid.card.dim");
     var postID = post.attr( "postID" );
     console.log("***********FLAG: post "+postID);
     $.post( "/feed", { postID: postID, flag: 1, _csrf : $('meta[name="csrf-token"]').attr('content') } );
     console.log("Removing Post content now!");
     post.find(".ui.dimmer.flag").dimmer({
                   closable: false
                  })
                  .dimmer('show');
      //repeat to ensure its closable             
      post.find(".ui.dimmer.flag").dimmer({
                   closable: false
                  })
                  .dimmer('show');
    

  });

});