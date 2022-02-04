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
  if($('.results_print').hasClass('green')){
    $(".insertPrint").empty();
    $(".insertPrint").css('display','block');

    $(".insertPrint").append("<br><h4>¿Cuántas de estas características de diseño llamativas notaste?</h4>");
    $(".checkOne").clone().removeClass('reflectionPromptSegment').appendTo(".insertPrint");

    $(".insertPrint").append("<br><h4>¿Cuántos minutos piensas que pasaste en el feed de TestDrive?</h4>");
    var responseTwo = document.getElementById("habitsesp_responseTwo").value;
    $(".insertPrint").append(responseTwo);

    if($('.ui.statistics').is(":visible")){
      $(".insertPrint").append("<br><h4>Actual time spent:</h4>");
      var actualTimeMinutes = $('#habitsActivityTotalTimeMinutes').text();
      var actualTimeSeconds = $('#habitsActivityTotalTimeSeconds').text();
      var stringToAppend = `${actualTimeMinutes} minutes and ${actualTimeSeconds} seconds`
      $('.insertPrint').append(stringToAppend);
    }

    $(".insertPrint").append("<br><h4>¿Qué hiciste cuando viste un anuncio o una publicacción patrocinada?</h4>");
    $(".checkTwo").clone().removeClass('reflectionPromptSegment').appendTo(".insertPrint");

    $(".insertPrint").append("<h4>¿Por qué es importante establecer hábitos saludables de las redes sociales?</h4>");
    var responseFour = document.getElementById("habitsesp_responseFour").value;
    $(".insertPrint").append(responseFour);

    window.print();

    $(".insertPrint").css('display','none');
  } else {
    if($('.voiceover_reflection1').next('.reflectionPromptSegment').is(':hidden')){
      showWarning('.startPromptsWarning');
    } else {
      showWarning('.openAllPromptsWarning');
    }
  }
}
