document.addEventListener('DOMContentLoaded', function() {
    const dartieImages = document.querySelectorAll('.dart_image');
    const character = localStorage.getItem('character');
  
    let charName = "Dartie";
    if (character == 'Daring_PT_Determined.png') {
      charName = "Daring";
    } else if (character == 'Dartie_Happy_3.png') {
      charName = "Dartie";
    } else if (character == 'Intrepid_PT_Determined.png') {
      charName = "Intrepid";
    } else if (character == 'Valiant_PT_Determined.png') {
      charName = "Valiant";
    } else {
      charName = "Dartie";
    }
  
    if (character) {
      dartieImages.forEach(function(image) {
        image.src = "/profile_pictures/" + character;
      });
      document.getElementById("name").innerHTML = charName;
    }
  });