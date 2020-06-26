/* Could consider using .csv file like for allposts, but doesn't seem worth
it with so little data. Consider this option if we need more articles to
facilitate topic customization. */

// #############################################################################


$(window).on("load", function () {

  let jsonPath = '/json/advancedlit_articleData.json';

  $.getJSON(jsonPath).then(function(articleData){
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

  });
});

// #############################################################################

let articleNumber = 1;
// scrolling to the correct article when returning to the timeline tab
$('.ui.card .img.articleTab, .ui.button.articleTab, .ui.button.timelineTab, .ui.button.searchTab').tab({
  alwaysRefresh: true,
  onLoad: function(tabPath){
    console.log(tabPath);
    let endOfString = tabPath.substr(tabPath.length - 1);
    if ((endOfString === '1')
    || (endOfString === '2')
    || (endOfString === '3')){
      articleNumber = tabPath.substr(tabPath.length - 1);
      $(document).scrollTop(0);
    } else {
      $('.ui.card .img[data-tab="article'+articleNumber+'"]')[0].scrollIntoView();
      // lazy loading of images (needs to be duplicated here from main.js so that
      // it works after changing tabs)
      $('#content .fluid.card .img img, img.ui.avatar.image, a.avatar.image img')
        .visibility({
          type: 'image',
          offset: 0,
          onLoad: function (calculations) {
            console.log("@@@@@@@ Real Image @@@@@@@@@");
            $('#content .fluid.card .img img, img.ui.avatar.image, a.avatar.image img').visibility('refresh');
          }
        });
    }


  }
});
