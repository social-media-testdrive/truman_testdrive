const music = {
    article1: {
      headline: 'Music Article 1 Headline',
      subHeadline: 'Music article 1 sub headline',
      author: 'Author: Jane Doe',
      block1: 'This is the first sentence of music article 1.',
      block2: 'This is the second sentence of music article 1.',
      block3: 'This is the third sentence of music article 1.'
    },
    article2: {
      headline: 'Music Article 2 Headline',
      subHeadline: 'Music article 2 sub headline',
      author: 'Author: John Smith',
      block1: 'This is the first sentence of music article 2.',
      block2: 'This is the second sentence of music article 2.',
      block3: 'This is the third sentence of music article 2.'
    },
    article3: {
      headline: 'Music Article 3 Headline',
      subHeadline: 'Music article 3 sub headline',
      author: 'Author: John Doe',
      block1: 'This is the first sentence of music article 3.',
      block2: 'This is the second sentence of music article 3.',
      block3: 'This is the third sentence of music article 3.'
    }
};

const sports = {
    article1: {
      headline: 'sports Article 1 Headline',
      subHeadline: 'sports article 1 sub headline',
      author: 'Author: Jane Doe',
      block1: 'This is the first sentence of sports article 1.',
      block2: 'This is the second sentence of sports article 1.',
      block3: 'This is the third sentence of sports article 1.'
    },
    article2: {
      headline: 'sports Article 2 Headline',
      subHeadline: 'sports article 2 sub headline',
      author: 'Author: John Smith',
      block1: 'This is the first sentence of sports article 2.',
      block2: 'This is the second sentence of sports article 2.',
      block3: 'This is the third sentence of sports article 2.'
    },
    article3: {
      headline: 'sports Article 3 Headline',
      subHeadline: 'sports article 3 sub headline',
      author: 'Author: John Doe',
      block1: 'This is the first sentence of sports article 3.',
      block2: 'This is the second sentence of sports article 3.',
      block3: 'This is the third sentence of music article 3.'
    }
};

const gaming = {
    article1: {
      headline: 'gaming Article 1 Headline',
      subHeadline: 'gaming article 1 sub headline',
      author: 'Author: Jane Doe',
      block1: 'This is the first sentence of gaming article 1.',
      block2: 'This is the second sentence of gaming article 1.',
      block3: 'This is the third sentence of gaming article 1.'
    },
    article2: {
      headline: 'gaming Article 2 Headline',
      subHeadline: 'gaming article 2 sub headline',
      author: 'Author: John Smith',
      block1: 'This is the first sentence of gaming article 2.',
      block2: 'This is the second sentence of gaming article 2.',
      block3: 'This is the third sentence of gaming article 2.'
    },
    article3: {
      headline: 'gaming Article 3 Headline',
      subHeadline: 'gaming article 3 sub headline',
      author: 'Author: John Doe',
      block1: 'This is the first sentence of gaming article 3.',
      block2: 'This is the second sentence of gaming article 3.',
      block3: 'This is the third sentence of gaming article 3.'
    }
};


// #############################################################################
let articleNumber = 1;
let topic = music;
// scrolling to the correct article when returning to the timeline tab
$('.ui.card, .ui.button.articleTab, .ui.button.timelineTab, .ui.button.searchTab').tab({
  onLoad: function(tabPath){
    let endOfString = tabPath.substr(tabPath.length - 1);
    if ((endOfString === '1') || (endOfString === '2') || (endOfString === '3')){
      articleNumber = tabPath.substr(tabPath.length - 1);
      $(document).scrollTop(0);
    } else {
      $('.ui.card[data-tab="article'+articleNumber+'"]')[0].scrollIntoView();
    }
  }
});

$.get( "/advancedlitTopic", function( data ) {
  switch(data.advancedlitTopic){
    case 'Music':
      topic = music;
      break;
    case 'Gaming':
      topic = gaming;
      break;
    case 'Sports':
      topic = sports;
      break;
    default:
      topic = music;
      break;
  }
}).then(function(){
  // filling in the correct content for each article and 'search result'
  $('.ui.tab').each(function(){
    let dataTabAttribute = ($(this).closest('.ui.tab').attr('data-tab'));
    if( (dataTabAttribute === "article1") || (dataTabAttribute === "article2") || (dataTabAttribute === "article3") ){
      $(this).find('.articleHeading').text(topic[dataTabAttribute].headline);
      $(this).find('.articleSubheading').text(topic[dataTabAttribute].subHeadline);
      $(this).find('.articleAuthor').text(topic[dataTabAttribute].author);
      $(this).find('.articleBlock1').text(topic[dataTabAttribute].block1);
    }
    if( (dataTabAttribute === "search1") || (dataTabAttribute === "search2") || (dataTabAttribute === "search3") ){
      // fill in for search data later
    }
  });
});
