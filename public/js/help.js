document.addEventListener("DOMContentLoaded", function () {
  var disclaimerButton = document.getElementById("help-button");
  var disclaimerContainer = document.getElementById("help-container");
  var dartieImg = document.getElementById("dartie-img");

  var isMenuOpen = false;
  let isFadingOut = false;


  disclaimerButton.addEventListener("click", function () {
    if (!isMenuOpen) {
      disclaimerContainer.style.height = "100px";
      // dartieImg.style.display = 'block';

      if (!isFadingOut) {
        isFadingOut = true;
        dartieImg.style.display = "block";
        setTimeout(function () {
            dartieImg.style.opacity = 100;
            isFadingOut = false;
        }, 10);

        isMenuOpen = true;
       }
    } else {
      disclaimerContainer.style.height = "0px";
      // dartieImg.style.display = "none";

      if (!isFadingOut) {
        isFadingOut = true;

        dartieImg.style.opacity = 0;
        setTimeout(function () {
            dartieImg.style.display = "none";
            isFadingOut = false;
        }, 1000);
        isMenuOpen = false;
      }
    }
  });
});
