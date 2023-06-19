document.addEventListener('DOMContentLoaded', function() {
    const dartieImg = document.getElementById('dart_image1');
    const character = localStorage.getItem('character');

    if (character) {
      dartieImg.src = "/profile_pictures/" + character;
    }
  }
  );