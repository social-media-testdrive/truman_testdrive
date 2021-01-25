function setActiveMenuItem(){
  const subdirectory1 = window.location.pathname.split('/')[1];
  if(subdirectory1 === 'viewClass'){
    $('.teacherDashboardMenu .item[href$="classManagement"]').addClass('active');
  } else {
    $('.teacherDashboardMenu .item[href$=' + subdirectory1 + ']').addClass('active');
  }
}

$(window).on('load', function(){

  setActiveMenuItem();

  $('.ui.dropdown').dropdown();
  $.get(`/classIdList`, function(data){
    const classIdList = data.classIdList;
    for (const id of classIdList) {
     $(`<div class="item" data-value="${id}">${id}</div>`).appendTo( $('.ui.selection.dropdown[name="classSelection"] .menu') )
    }
  });
})
