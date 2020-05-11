var hintsList=
[
  {
    hint: `Nick’s best friends Liam and Vanessa have posted that they are
    hanging out but Nick was not invited. How would Nick feel after seeing
    this post? Click on the post to think about how Nick would feel.`,
    element: '#hint1',
    hintPosition: 'middle-middle'
  },
  {
    hint: `Nick could feel upset and sad that he is missing out. This is a
    red flag feeling. What could Nick do to make himself feel better? Click
    on the post to think about things that Nick could do.`,
    element: '#hint2',
    hintPosition: 'middle-right'
  },
  {
    hint: `Seeing everything his friends are posting might make Nick feel like
    his life isn't as interesting or fun. But it's important to remember that a
    lot of people just post the positive and exciting things going on in their
    lives.`,
    element: '#hint3',
    hintPosition: 'middle-middle'
  },
  {
    hint: `Nick can always take a break from social media. He can meet up with
    friends and family or do something else he enjoys, like riding his bike.`,
    element: '#hint4',
    hintPosition: 'middle-middle'
  }
]

var stepsList=
[
  {
    element: '#step1',
    intro: `This is Nick's social media timeline. He just got back from school
    and is checking out his feed.
    Click on the blue dots&nbsp;<a role='button' tabindex='0'
    class='introjs-hint'><div class='introjs-hint-dot'></div><div class=
    'introjs-hint-pulse'></div></a> &nbsp; &nbsp; &nbsp;to learn more...`,
    position: "left",
    scrollTo: 'tooltip'
  }

]

function eventsAfterHints(){
  $('.ui.fluid.card.test img').on('click', function(){
    $('.ui.accordion').accordion('open', 0);
    $('.ui.accordion').accordion('close', 1);
    $('input[type=checkbox]').prop('checked',false);
    $('#esteem_post_modal').modal('show');
  });

  $('#nextButton').on('click', function () {
    $('#modSection2').click();
  });
};
