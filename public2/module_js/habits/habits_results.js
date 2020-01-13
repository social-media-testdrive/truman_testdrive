$('#checkTime').on('click', function(){
  $.get( "/habitsTimer", function( data ) {
    var activityDisplayTime = (data.totalTimeViewedHabits)/60000;
    activityDisplayTime = Math.round( activityDisplayTime * 10 ) / 10; //round to 1 decimal place
    $('#habitsActivityTotalTime').html(activityDisplayTime);
    $('#undoHide').show();
    $('.ui.horizontal.statistic').show();
  });
})

function onPrint(){

  $(".insertPrint").empty();
  $(".insertPrint").css('display','block');

  $(".insertPrint").append("<br><h4>How many of these attention-grabbing design features did you notice?</h4>");
  $(".checkOne").clone().appendTo(".insertPrint");
  
  $(".insertPrint").append("<br><h4>How many minutes do you think you spent on the TestDrive timeline?</h4>");
  var responseTwo = document.getElementById("habits_responseTwo").value;
  $(".insertPrint").append(responseTwo);
  if($('.ui.horizontal.statistic').is(":visible")){
    $(".insertPrint").append("<br><h4>Actual time spent:</h4>");
    var actualTime = $('#habitsActivityTotalTime').text();
    $(".insertPrint").append(actualTime);
  }

  $(".insertPrint").append("<br><h4>What did you do when you saw an advertisement or a sponsored post?</h4>");
  $(".checkTwo").clone().appendTo(".insertPrint");

  $(".insertPrint").append("<h4>Why is it important to build healthy social media habits?</h4>");
  var responseFour = document.getElementById("habits_responseFour").value;
  $(".insertPrint").append(responseFour);

  window.print();

  $(".insertPrint").css('display','none');
}
