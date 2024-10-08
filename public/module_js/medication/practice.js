function setupPractice() {
    document.querySelectorAll('.ui.button[data-choice]').forEach(button => {
        button.addEventListener('click', function () {
            const choice = this.getAttribute('data-choice');

            console.log("The user choose path: ", choice);

            if(choice == "addiction") {
                console.log("INider")
                window.location.href = "course-player?module=medication&section=practice&page=activity2";

            } else if(choice == "aging") {
                window.location.href = "course-player?module=medication&section=practice&page=activity3";

            } 
            
        });
      });              
    
}
