function adjustContentMargin(){
  let contentMargin;
  if($('.teacherDashboardMobileMenu').is(':visible')) {
    // if mobile menu is visible, add margin to the top of the content column
    $('.dashboardContentColumn').css('margin-left', 'initial');
    contentMargin = parseInt($('.teacherDashboardMobileMenu').css('height'));
    $('.dashboardContentColumn').css('margin-top', contentMargin);
  } else if ($('.teacherDashboardMenu').is(':visible')) {
    // if standard menu is visible, add margin (if needed) to the left of the content column
    $('.dashboardContentColumn').css('margin-top', 'initial');
    let marginValue = parseInt($('.ui.vertically.padded.grid.container').css('margin-right'));
    let menuWidth = parseInt($('.teacherDashboardMenu').css('width'));
    if(menuWidth > marginValue) {
      console.log('true')
      contentMargin = menuWidth - marginValue;
      $('.dashboardContentColumn').css('margin-left', contentMargin);
    }
  }
}

function setActiveMenuItem(){
  const subdirectory1 = window.location.pathname.split('/')[1];
  if(subdirectory1 === 'viewClass'){
    $('.teacherDashboardMenu .item[href$="classManagement"]').addClass('active');
    $('.teacherDashboardMobileMenu .item[href$="classManagement"]').addClass('active');
  } else {
    $('.teacherDashboardMenu .item[href$=' + subdirectory1 + ']').addClass('active');
    $('.teacherDashboardMobileMenu .item[href$=' + subdirectory1 + ']').addClass('active');
  }
}

$(window).on('load', function(){
  adjustContentMargin();
  $('.dashboardContentColumn').removeClass('hiddenVisibility')
  // $('.teacherDashboardMobileMenu .item').popup({
  //   position: 'bottom center'
  // })
  setActiveMenuItem();
  $('.ui.dropdown').dropdown();
  $.get(`/classIdList`, function(data){
    const classIdList = data.classIdList;
    for (const id of classIdList) {
     $(`<div class="item" data-value="${id}">${id}</div>`).appendTo( $('.ui.selection.dropdown[name="classSelection"] .menu') )
    }
  });
});

$(window).on('resize', function(){
  adjustContentMargin();
});
