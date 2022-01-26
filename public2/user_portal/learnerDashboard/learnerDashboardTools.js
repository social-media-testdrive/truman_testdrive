function adjustContentMargin(){
  let contentMargin;
  if($('.learnerDashboardMobileMenu').is(':visible')) {
    // if mobile menu is visible, add margin to the top of the content column
    $('.dashboardContentColumn').css('margin-left', 'initial');
    contentMargin = parseInt($('.learnerDashboardMobileMenu').css('height'));
    $('.dashboardContentColumn').css('margin-top', contentMargin);
  } else if ($('.learnerDashboardMenu').is(':visible')) {
    // if standard menu is visible, add margin (if needed) to the left of the content column
    $('.dashboardContentColumn').css('margin-top', 'initial');
    let marginValue = parseInt($('.ui.vertically.padded.grid.container').css('margin-right'));
    let menuWidth = parseInt($('.learnerDashboardMenu').css('width'));
    if(menuWidth > marginValue) {
      contentMargin = menuWidth - marginValue;
      $('.dashboardContentColumn').css('margin-left', contentMargin);
    }
  }
}

function setActiveMenuItem(){
  const subdirectory1 = window.location.pathname.split('/')[1];
  $('.learnerDashboardMenu .item[href$=' + subdirectory1 + ']').addClass('active');
  $('.learnerDashboardMobileMenu .item[href$=' + subdirectory1 + ']').addClass('active');

}

$(window).on('load', function(){
  adjustContentMargin();
  $('.dashboardContentColumn').removeClass('hiddenVisibility')
  setActiveMenuItem();
});

$(window).on('resize', function(){
  adjustContentMargin();
});
