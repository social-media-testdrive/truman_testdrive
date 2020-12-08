function setActiveMenuItem(){
  const subdirectory1 = window.location.pathname.split('/')[1];
  $('.teacherDashboardMenu .item[href$=' + subdirectory1 + ']').addClass('active');
}

$(window).on('load', function(){
  setActiveMenuItem();
  $('.ui.dropdown').dropdown();
})
