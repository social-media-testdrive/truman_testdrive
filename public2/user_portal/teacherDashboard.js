let pathArray = window.location.pathname.split('/');
const subdirectory1 = pathArray[1]; // idenify the current page
const subdirectory2 = pathArray[2]; // idenify the current module

$('.teacherDashboardMenu .item').each(function(){
  $(this).removeClass('active');
})

switch(subdirectory1){
  case 'class':
  case 'classes':
    $('.teacherDashboardMenu').find('.item[data-value="1"]').addClass('active');
    break;
}
