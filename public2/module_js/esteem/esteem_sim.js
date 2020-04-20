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
    hint: `When Nick sees all these fun activities that his friends are
    doing, he could feel like his life isn’t very interesting. But remember,
    many people post only the most positive and exciting things.`,
    element: '#hint3',
    hintPosition: 'middle-middle'
  },
  {
    hint: `Nick can always take a break from social media. He can connect
    with family and friends in other ways or do a fun activity like riding
    his bike outside.`,
    element: '#hint4',
    hintPosition: 'middle-middle'
  }
]

var stepsList=
[
  {
    element: document.querySelectorAll('#step1')[0],
    intro: `This is the social media timeline of Nick, a middle school
    student. He just got back home from school and is looking at his social
    media feed.
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
