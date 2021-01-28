function adjustContentMargin(){
  let marginValue = parseInt($('.ui.vertically.padded.grid.container').css('margin-right'));
  let menuWidth = parseInt($('.teacherDashboardMenu').css('width'));
  if(menuWidth > marginValue) {
    console.log('true')
    let contentOffset = menuWidth - marginValue;
    $('.dashboardContentColumn').css('margin-left', contentOffset);
  }
}

function setActiveMenuItem(){
  const subdirectory1 = window.location.pathname.split('/')[1];
  if(subdirectory1 === 'viewClass'){
    $('.teacherDashboardMenu .item[href$="classManagement"]').addClass('active');
  } else {
    $('.teacherDashboardMenu .item[href$=' + subdirectory1 + ']').addClass('active');
  }
}

$(window).on('load', function(){
  adjustContentMargin();
  $('.dashboardContentColumn').removeClass('hiddenVisibility')
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
