// All of the data for the various articles and their "search results"
// Consider creating a json file for all of this? Or if there's some other solution
const music = {
    article1: {
      buttonText: 'Search about "article 1"',
      headline: 'Music Article 1 Headline',
      subHeadline: 'Music article 1 sub headline',
      author: 'Author: Jane Doe',
      date: '5 May 2020',
      image: 'https://dhpd030vnpk29.cloudfront.net/post_pictures/playing-piano_se.jpg',
      block1: `This is the first paragraph of music article 1.`,
      block2: 'This is the second paragraph of music article 1.',
      block3: 'This is the third paragraph of music article 1.'
    },
    search1:{
      searchTitle: 'Search results for music article 1',
      item1: {
        url: 'resultURL1.com',
        title: 'Article Title 1',
        text: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. In
        rhoncus ex sit amet efficitur gravida. Sed maximus orci vitae congue
        maximus. Nam at auctor velit, vitae fermentum diam.`
      },
      item2: {
        url: 'resultURL2.com',
        title: 'Article Title 2',
        text: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. In
        rhoncus ex sit amet efficitur gravida. Sed maximus orci vitae congue
        maximus. Nam at auctor velit, vitae fermentum diam.`
      },
      item3: {
        url: 'resultURL3.com',
        title: 'Article Title 3',
        text: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. In
        rhoncus ex sit amet efficitur gravida. Sed maximus orci vitae congue
        maximus. Nam at auctor velit, vitae fermentum diam.`
      },
      item4: {
        url: 'resultURL4.com',
        title: 'Article Title 4',
        text: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. In
        rhoncus ex sit amet efficitur gravida. Sed maximus orci vitae congue
        maximus. Nam at auctor velit, vitae fermentum diam.`
      }
    },
    article2: {
      buttonText: 'Search about "article 2"',
      headline: 'Music Article 2 Headline',
      subHeadline: 'Music article 2 sub headline',
      author: 'Author: John Smith',
      date: '20 May 2020',
      image: 'https://dhpd030vnpk29.cloudfront.net/post_pictures/acoustic_se.jpg',
      block1: 'This is the first paragraph of music article 2.',
      block2: 'This is the second paragraph of music article 2.',
      block3: 'This is the third paragraph of music article 2.'
    },
    search2:{
      searchTitle: 'Search results for music article 2',
      item1: {
        url: 'resultURL1.com',
        title: 'Article Title 1',
        text: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. In
        rhoncus ex sit amet efficitur gravida. Sed maximus orci vitae congue
        maximus. Nam at auctor velit, vitae fermentum diam.`
      },
      item2: {
        url: 'resultURL2.com',
        title: 'Article Title 2',
        text: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. In
        rhoncus ex sit amet efficitur gravida. Sed maximus orci vitae congue
        maximus. Nam at auctor velit, vitae fermentum diam.`
      },
      item3: {
        url: 'resultURL3.com',
        title: 'Article Title 3',
        text: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. In
        rhoncus ex sit amet efficitur gravida. Sed maximus orci vitae congue
        maximus. Nam at auctor velit, vitae fermentum diam.`
      },
      item4: {
        url: 'resultURL4.com',
        title: 'Article Title 4',
        text: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. In
        rhoncus ex sit amet efficitur gravida. Sed maximus orci vitae congue
        maximus. Nam at auctor velit, vitae fermentum diam.`
      }
    },
    article3: {
      buttonText: 'Search about "article 3"',
      headline: 'Music Article 3 Headline',
      subHeadline: 'Music article 3 sub headline',
      author: 'Author: John Doe',
      date: '22 May 2020',
      image: 'https://dhpd030vnpk29.cloudfront.net/post_pictures/friends_music_se.jpg',
      block1: 'This is the first paragraph of music article 3.',
      block2: 'This is the second paragraph of music article 3.',
      block3: 'This is the third paragraph of music article 3.'
    },
    search3:{
      searchTitle: 'Search results for music article 3',
      item1: {
        url: 'resultURL1.com',
        title: 'Article Title 1',
        text: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. In
        rhoncus ex sit amet efficitur gravida. Sed maximus orci vitae congue
        maximus. Nam at auctor velit, vitae fermentum diam.`
      },
      item2: {
        url: 'resultURL2.com',
        title: 'Article Title 2',
        text: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. In
        rhoncus ex sit amet efficitur gravida. Sed maximus orci vitae congue
        maximus. Nam at auctor velit, vitae fermentum diam.`
      },
      item3: {
        url: 'resultURL3.com',
        title: 'Article Title 3',
        text: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. In
        rhoncus ex sit amet efficitur gravida. Sed maximus orci vitae congue
        maximus. Nam at auctor velit, vitae fermentum diam.`
      },
      item4: {
        url: 'resultURL4.com',
        title: 'Article Title 4',
        text: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. In
        rhoncus ex sit amet efficitur gravida. Sed maximus orci vitae congue
        maximus. Nam at auctor velit, vitae fermentum diam.`
      }
    },
};

const sports = {
    article1: {
      buttonText: 'Search about "article 1"',
      headline: 'sports Article 1 Headline',
      subHeadline: 'sports article 1 sub headline',
      author: 'Author: Jane Doe',
      date: '5 May 2020',
      image: 'https://dhpd030vnpk29.cloudfront.net/post_pictures/outdoors_se.jpg',
      block1: 'This is the first paragraph of sports article 1.',
      block2: 'This is the second paragraph of sports article 1.',
      block3: 'This is the third paragraph of sports article 1.'
    },
    search1:{
      searchTitle: 'Search results for sports article 1',
      item1: {
        url: 'resultURL1.com',
        title: 'Article Title 1',
        text: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. In
        rhoncus ex sit amet efficitur gravida. Sed maximus orci vitae congue
        maximus. Nam at auctor velit, vitae fermentum diam.`
      },
      item2: {
        url: 'resultURL2.com',
        title: 'Article Title 2',
        text: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. In
        rhoncus ex sit amet efficitur gravida. Sed maximus orci vitae congue
        maximus. Nam at auctor velit, vitae fermentum diam.`
      },
      item3: {
        url: 'resultURL3.com',
        title: 'Article Title 3',
        text: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. In
        rhoncus ex sit amet efficitur gravida. Sed maximus orci vitae congue
        maximus. Nam at auctor velit, vitae fermentum diam.`
      },
      item4: {
        url: 'resultURL4.com',
        title: 'Article Title 4',
        text: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. In
        rhoncus ex sit amet efficitur gravida. Sed maximus orci vitae congue
        maximus. Nam at auctor velit, vitae fermentum diam.`
      }
    },
    article2: {
      buttonText: 'Search about "article 2"',
      headline: 'sports Article 2 Headline',
      subHeadline: 'sports article 2 sub headline',
      author: 'Author: John Smith',
      date: '20 May 2020',
      image: 'https://dhpd030vnpk29.cloudfront.net/post_pictures/baseball_se.jpg',
      block1: 'This is the first paragraph of sports article 2.',
      block2: 'This is the second paragraph of sports article 2.',
      block3: 'This is the third paragraph of sports article 2.'
    },
    search2:{
      searchTitle: 'Search results for sports article 2',
      item1: {
        url: 'resultURL1.com',
        title: 'Article Title 1',
        text: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. In
        rhoncus ex sit amet efficitur gravida. Sed maximus orci vitae congue
        maximus. Nam at auctor velit, vitae fermentum diam.`
      },
      item2: {
        url: 'resultURL2.com',
        title: 'Article Title 2',
        text: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. In
        rhoncus ex sit amet efficitur gravida. Sed maximus orci vitae congue
        maximus. Nam at auctor velit, vitae fermentum diam.`
      },
      item3: {
        url: 'resultURL3.com',
        title: 'Article Title 3',
        text: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. In
        rhoncus ex sit amet efficitur gravida. Sed maximus orci vitae congue
        maximus. Nam at auctor velit, vitae fermentum diam.`
      },
      item4: {
        url: 'resultURL4.com',
        title: 'Article Title 4',
        text: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. In
        rhoncus ex sit amet efficitur gravida. Sed maximus orci vitae congue
        maximus. Nam at auctor velit, vitae fermentum diam.`
      }
    },
    article3: {
      buttonText: 'Search about "article 3"',
      headline: 'sports Article 3 Headline',
      subHeadline: 'sports article 3 sub headline',
      author: 'Author: John Doe',
      date: '22 May 2020',
      image: 'https://dhpd030vnpk29.cloudfront.net/post_pictures/football_se.jpg',
      block1: 'This is the first paragraph of sports article 3.',
      block2: 'This is the second paragraph of sports article 3.',
      block3: 'This is the third paragraph of music article 3.'
    },
    search3:{
      searchTitle: 'Search results for sports article 3',
      item1: {
        url: 'resultURL1.com',
        title: 'Article Title 1',
        text: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. In
        rhoncus ex sit amet efficitur gravida. Sed maximus orci vitae congue
        maximus. Nam at auctor velit, vitae fermentum diam.`
      },
      item2: {
        url: 'resultURL2.com',
        title: 'Article Title 2',
        text: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. In
        rhoncus ex sit amet efficitur gravida. Sed maximus orci vitae congue
        maximus. Nam at auctor velit, vitae fermentum diam.`
      },
      item3: {
        url: 'resultURL3.com',
        title: 'Article Title 3',
        text: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. In
        rhoncus ex sit amet efficitur gravida. Sed maximus orci vitae congue
        maximus. Nam at auctor velit, vitae fermentum diam.`
      },
      item4: {
        url: 'resultURL4.com',
        title: 'Article Title 4',
        text: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. In
        rhoncus ex sit amet efficitur gravida. Sed maximus orci vitae congue
        maximus. Nam at auctor velit, vitae fermentum diam.`
      }
    },
};

const gaming = {
    article1: {
      buttonText: 'Search about "article 1"',
      headline: 'gaming Article 1 Headline',
      subHeadline: 'gaming article 1 sub headline',
      author: 'Author: Jane Doe',
      date: '5 May 2020',
      image: 'https://dhpd030vnpk29.cloudfront.net/post_pictures/computer-game_se.jpg',
      block1: 'This is the first paragraph of gaming article 1.',
      block2: 'This is the second paragraph of gaming article 1.',
      block3: 'This is the third paragraph of gaming article 1.'
    },
    search1:{
      searchTitle: 'Search results for gaming article 1',
      item1: {
        url: 'resultURL1.com',
        title: 'Article Title 1',
        text: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. In
        rhoncus ex sit amet efficitur gravida. Sed maximus orci vitae congue
        maximus. Nam at auctor velit, vitae fermentum diam.`
      },
      item2: {
        url: 'resultURL2.com',
        title: 'Article Title 2',
        text: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. In
        rhoncus ex sit amet efficitur gravida. Sed maximus orci vitae congue
        maximus. Nam at auctor velit, vitae fermentum diam.`
      },
      item3: {
        url: 'resultURL3.com',
        title: 'Article Title 3',
        text: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. In
        rhoncus ex sit amet efficitur gravida. Sed maximus orci vitae congue
        maximus. Nam at auctor velit, vitae fermentum diam.`
      },
      item4: {
        url: 'resultURL4.com',
        title: 'Article Title 4',
        text: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. In
        rhoncus ex sit amet efficitur gravida. Sed maximus orci vitae congue
        maximus. Nam at auctor velit, vitae fermentum diam.`
      }
    },
    article2: {
      buttonText: 'Search about "article 2"',
      headline: 'gaming Article 2 Headline',
      subHeadline: 'gaming article 2 sub headline',
      author: 'Author: John Smith',
      date: '20 May 2020',
      image: 'https://dhpd030vnpk29.cloudfront.net/post_pictures/nintendo_se.jpg',
      block1: 'This is the first paragraph of gaming article 2.',
      block2: 'This is the second paragraph of gaming article 2.',
      block3: 'This is the third paragraph of gaming article 2.'
    },
    search2:{
      searchTitle: 'Search results for gaming article 1',
      item1: {
        url: 'resultURL1.com',
        title: 'Article Title 1',
        text: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. In
        rhoncus ex sit amet efficitur gravida. Sed maximus orci vitae congue
        maximus. Nam at auctor velit, vitae fermentum diam.`
      },
      item2: {
        url: 'resultURL2.com',
        title: 'Article Title 2',
        text: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. In
        rhoncus ex sit amet efficitur gravida. Sed maximus orci vitae congue
        maximus. Nam at auctor velit, vitae fermentum diam.`
      },
      item3: {
        url: 'resultURL3.com',
        title: 'Article Title 3',
        text: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. In
        rhoncus ex sit amet efficitur gravida. Sed maximus orci vitae congue
        maximus. Nam at auctor velit, vitae fermentum diam.`
      },
      item4: {
        url: 'resultURL4.com',
        title: 'Article Title 4',
        text: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. In
        rhoncus ex sit amet efficitur gravida. Sed maximus orci vitae congue
        maximus. Nam at auctor velit, vitae fermentum diam.`
      }
    },
    article3: {
      buttonText: 'Search about "article 3"',
      headline: 'gaming Article 3 Headline',
      subHeadline: 'gaming article 3 sub headline',
      author: 'Author: John Doe',
      date: '22 May 2020',
      image: 'https://dhpd030vnpk29.cloudfront.net/post_pictures/xbox_se.jpg',
      block1: 'This is the first paragraph of gaming article 3.',
      block2: 'This is the second paragraph of gaming article 3.',
      block3: 'This is the third paragraph of gaming article 3.'
    },
    search3:{
      searchTitle: 'Search results for gaming article 3',
      item1: {
        url: 'resultURL1.com',
        title: 'Article Title 1',
        text: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. In
        rhoncus ex sit amet efficitur gravida. Sed maximus orci vitae congue
        maximus. Nam at auctor velit, vitae fermentum diam.`
      },
      item2: {
        url: 'resultURL2.com',
        title: 'Article Title 2',
        text: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. In
        rhoncus ex sit amet efficitur gravida. Sed maximus orci vitae congue
        maximus. Nam at auctor velit, vitae fermentum diam.`
      },
      item3: {
        url: 'resultURL3.com',
        title: 'Article Title 3',
        text: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. In
        rhoncus ex sit amet efficitur gravida. Sed maximus orci vitae congue
        maximus. Nam at auctor velit, vitae fermentum diam.`
      },
      item4: {
        url: 'resultURL4.com',
        title: 'Article Title 4',
        text: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. In
        rhoncus ex sit amet efficitur gravida. Sed maximus orci vitae congue
        maximus. Nam at auctor velit, vitae fermentum diam.`
      }
    },
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
      $(this).find('.searchButtonText').text(topic[dataTabAttribute].buttonText);
      $(this).find('.articleHeading').text(topic[dataTabAttribute].headline);
      $(this).find('.articleSubheading').text(topic[dataTabAttribute].subHeadline);
      $(this).find('.articleAuthor').text(topic[dataTabAttribute].author);
      $(this).find('.articleDate').text('Published:' + topic[dataTabAttribute].date);
      $(this).find('.fullArticleImage').attr("src",topic[dataTabAttribute].image);
      $(this).find('.articleBlock1').text(topic[dataTabAttribute].block1);
      $(this).find('.articleBlock2').text(topic[dataTabAttribute].block2);
      $(this).find('.articleBlock3').text(topic[dataTabAttribute].block3);
    }
    if( (dataTabAttribute === "search1") || (dataTabAttribute === "search2") || (dataTabAttribute === "search3") ){
      $(this).find('.searchTitle').text(topic[dataTabAttribute].searchTitle);
      $(this).find('.searchItem').each(function(){
        let itemNumber = $(this).attr('data-itemNumber');
        $(this).find('.url').text(topic[dataTabAttribute][itemNumber].url);
        $(this).find('.title').text(topic[dataTabAttribute][itemNumber].title);
        $(this).find('.text').text(topic[dataTabAttribute][itemNumber].text);
      })
    }
  });
});
