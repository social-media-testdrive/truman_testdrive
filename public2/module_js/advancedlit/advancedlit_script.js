/* All of the data for the various articles and their "search results"

Consider creating a json file for all of this.
Could also consider using .csv file like for allposts, but doesn't seem worth it
with so little data. Consider this option if we need more articles to facilitate
topic customization. */

const articleData = {
    article1: {
      buttonText: 'Search about "article 1"',
      headline: 'Music Article 1 Headline',
      subHeadline: 'Music article 1 sub headline',
      author: 'Author: Jane Doe',
      date: '5 May 2020',
      image: 'https://dhpd030vnpk29.cloudfront.net/post_pictures/playing-piano_se.jpg',
      block1: `This is the first paragraph of article 1.`,
      block2: 'This is the second paragraph of article 1.',
      block3: 'This is the third paragraph of article 1.'
    },
    article2: {
      buttonText: 'Search about "article 2"',
      headline: 'Article 2 Headline',
      subHeadline: 'Article 2 sub headline',
      author: 'Author: John Smith',
      date: '20 May 2020',
      image: 'https://dhpd030vnpk29.cloudfront.net/post_pictures/acoustic_se.jpg',
      block1: 'This is the first paragraph of article 2.',
      block2: 'This is the second paragraph of article 2.',
      block3: 'This is the third paragraph of article 2.'
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
    search:{
      searchTitle: 'Search results',
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
      },
      item5: {
        url: 'resultURL5.com',
        title: 'Article Title 5',
        text: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. In
        rhoncus ex sit amet efficitur gravida. Sed maximus orci vitae congue
        maximus. Nam at auctor velit, vitae fermentum diam.`
      }
    }
};

// #############################################################################

let articleNumber = 1;
// scrolling to the correct article when returning to the timeline tab
$('.ui.card, .ui.button.articleTab, .ui.button.timelineTab, .ui.button.searchTab').tab({
  onLoad: function(tabPath){
    let endOfString = tabPath.substr(tabPath.length - 1);
    if ((endOfString === '1')
    || (endOfString === '2')
    || (endOfString === '3')){
      articleNumber = tabPath.substr(tabPath.length - 1);
      $(document).scrollTop(0);
    } else {
      $('.ui.card[data-tab="article'+articleNumber+'"]')[0].scrollIntoView();
    }
  }
});


$('.ui.tab').each(function(){
  let dataTabAttribute = ($(this).closest('.ui.tab').attr('data-tab'));

  if( (dataTabAttribute === "article1")
  || (dataTabAttribute === "article2")
  || (dataTabAttribute === "article3") ){
    $(this).find('.searchButtonText').text(articleData[dataTabAttribute].buttonText);
    $(this).find('.articleHeading').text(articleData[dataTabAttribute].headline);
    $(this).find('.articleSubheading').text(articleData[dataTabAttribute].subHeadline);
    $(this).find('.articleAuthor').text(articleData[dataTabAttribute].author);
    $(this).find('.articleDate').text('Published:' + articleData[dataTabAttribute].date);
    $(this).find('.fullArticleImage').attr("src",articleData[dataTabAttribute].image);
    $(this).find('.articleBlock1').text(articleData[dataTabAttribute].block1);
    $(this).find('.articleBlock2').text(articleData[dataTabAttribute].block2);
    $(this).find('.articleBlock3').text(articleData[dataTabAttribute].block3);
  }
  if( (dataTabAttribute === "search1")
  || (dataTabAttribute === "search2")
  || (dataTabAttribute === "search3")){
    $(this).find('.searchTitle').text(articleData['search'].searchTitle);
    $(this).find('.searchItem').each(function(){
      let itemNumber = $(this).attr('data-itemNumber');
      $(this).find('.url').text(articleData['search'][itemNumber].url);
      $(this).find('.title').text(articleData['search'][itemNumber].title);
      $(this).find('.text').text(articleData['search'][itemNumber].text);
    })
  }
});
