$('#checkTime').on('click', function(){
  $.get( "/habitsTimer", function( data ) {
    var activityDisplayTimeMinutes = Math.floor(data.totalTimeViewedHabits/60000);
    var activityDisplayTimeSeconds = Math.floor((data.totalTimeViewedHabits % 60000) / 1000);
    $('#habitsActivityTotalTimeMinutes').html(activityDisplayTimeMinutes);
    $('#habitsActivityTotalTimeSeconds').html(activityDisplayTimeSeconds);
    $('#undoHide').show();
    $('.ui.statistics').show();
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

  if($('.ui.statistics').is(":visible")){
    $(".insertPrint").append("<br><h4>Actual time spent:</h4>");
    var actualTimeMinutes = $('#habitsActivityTotalTimeMinutes').text();
    var actualTimeSeconds = $('#habitsActivityTotalTimeSeconds').text();
    var stringToAppend = `${actualTimeMinutes} minutes and ${actualTimeSeconds} seconds`
    $('.insertPrint').append(stringToAppend);
  }

  $(".insertPrint").append("<br><h4>What did you do when you saw an advertisement or a sponsored post?</h4>");
  $(".checkTwo").clone().appendTo(".insertPrint");

  $(".insertPrint").append("<h4>Why is it important to build healthy social media habits?</h4>");
  var responseFour = document.getElementById("habits_responseFour").value;
  $(".insertPrint").append(responseFour);

  window.print();

  $(".insertPrint").css('display','none');
}
