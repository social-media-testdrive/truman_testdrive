$(document).ready(function() {
  // Flag to check if the transition has occurred
  var isTransitioned = false; 

  function revealVillain() {
    if (!isTransitioned) {
      $('.villain-image').hide();
      $('.villain-reveal').transition('horizontal flip');
      isTransitioned = true; // Set flag to true after transition
    }
  }

  // Trigger the reveal on hover
  $('.villain-container').hover(revealVillain);

  // Also trigger the reveal on click for mobile compatibility
  $('.villain-container').click(revealVillain);
});