document.addEventListener('click', function(event) {
    const target = event.target;
    if (target.classList.contains('highlightable')) {

        //- remove hints
        $('.clickHere').removeClass('clickHere');
        $('.dark-blue-square').css('background-color', '#E1F2F4');
        $('#avatar-image').attr('src', avatarImage);

        //- check if correct
        if (target.classList.contains('correct-line')) {
            console.log("Correct!");

            // Increment score
            const scoreElement = document.querySelector('p.points');

            const currentScore = parseInt(scoreElement.innerText.split(' / ')[0]);
            const newScore = Math.min(currentScore + 1, 5); // Ensure the score doesn't exceed 5
            scoreElement.innerText = `${newScore} / 5`;

            //- const scoreElement = document.querySelector('p.points');
            //- let score = parseInt(scoreElement.innerText);
            //- score += 1;
            //- scoreElement.innerText = score;

            // highlight green
            target.style.backgroundColor = '#8FED8F';
            target.style.textDecoration = 'line-through';

            // Remove the 'highlightable' class to prevent further clicks
            target.classList.remove('highlightable');
            target.classList.remove('correct-line');

        }

        //- const text = target.innerText.trim();
        //- console.log("Clicked on:", text);
        const idNumber = target.id.split('-')[1];
        //- console.log("Clicked on:", idNumber);

        
        let textResponse;
        switch (parseInt(idNumber)) {
            case 1:
                textResponse = "Good thinking, but sharing that you're a wife and mother isn't typically sensitive information. It's a common detail many share without compromising their security. Stay vigilant and keep looking!";
                break;  
            case 2: 
                textResponse = "Correct! Mrs. Johnson should remove her maiden name from her profile. This is a common security question used by banks and other institutions to verify your identity. If a scammer knows your maiden name, they can use it to gain access to your accounts.";
                break;
            case 3:
                textResponse = "Correct! Mrs. Johnson should remove her date of birth from her profile. Your date of birth is a key piece of information used in various verification processes. Keeping it hidden protects you from potential fraud.";
                break;
            case 4:
                textResponse = "Correct! Mrs. Johnson should remove her email from her profile. Emails are a gateway to many of your online accounts. Not sharing it publicly reduces the risk of phishing attacks and unauthorized access.";
                break;
            case 5:
                textResponse = "This is a common expression, no personal information is being revealed here. Stay vigilant and keep looking!";
                break;
            case 7:
                textResponse = "Correct! Mrs. Johnson should remove her phone number from her profile. A phone number can be used for scams or unauthorized verifications. Keeping it off public profiles boosts your privacy and security. If you need to share your phone number, do so privately.";
                break;
            case 8:
                textResponse = "Sharing that her husband's first name is 'Mark' is generally safe, as it doesn't directly identify her and it is a common and generic first name. It alone is unlikely to put her at risk for identity theft. Stay vigilant and keep looking!";
                break;
            case 11:
                textResponse = "Correct! Mrs. Johnson should remove her bank account information from her profile. Keeping this information hidden is a major step in preventing financial identity theft.";
                break;
            default:
                textResponse = "This statement does not reveal any personal information. Stay vigilant and keep looking!";
        }
        $('#instruction-text').html(textResponse);
        //- if(idNumber === '1') {
        //-     $('#instruction-text').html("Correct! Mrs. Johnson should remove her maiden name from her profile. This is a common security question used by banks and other institutions to verify your identity. If a scammer knows your maiden name, they can use it to gain access to your accounts.");
        //- } else if ()

    }
});

document.getElementById('hint-button').addEventListener('click', function() {
    console.log("Hint button clicked");
    //- const correctSentence = document.querySelector('.correct-line.highlightable');
    //- const instructionText = document.getElementById('instruction-text');
    const correctSentence = $('.correct-line.highlightable').first();
    const instructionText = $('#instruction-text');

    if (correctSentence.length) {

        let theID = correctSentence.attr('id');
        const idNumber = theID.split('-')[1];

        let textResponse;
        switch (parseInt(idNumber)) {
            case 2: 
                textResponse = "Look, Mrs. Johnson's maiden name! I could use this to crack her security questions and get into her account!";
                break;
            case 3:
                textResponse = "Look, Mrs. Johnson's date of birth! I could use this to verify her identity and steal her information!";
                break;
            case 4:
                textResponse = "Look, Mrs. Johnson's email address! I could start sending her phishing links and spam!";
                break;
            case 7:
                textResponse = "Look, Mrs. Johnson's phone number! I could use this to call her and trick her into revealing sensitive information!";
                break;
            case 11:
                textResponse = "Look, Mrs. Johnson's bank account information! I could use this to steal her money!";
                break;
            default:
                textResponse = "Darn! I don't see any personal information left that I can steal. You win this time, Agent " + userName + "!";
        }
        console.log("idNumber:", idNumber);
    
        correctSentence.addClass('clickHere');
        correctSentence.css('background-color', '#FF6C6C');
        $('.dark-blue-square').css('background-color', '#FF6C6C');
        $('#avatar-image').attr('src', '/images/villainHint.png');
        $('#instruction-text').html(textResponse);
    } else {
        $('#avatar-image').attr('src', '/images/villainHint.png');
        $('.dark-blue-square').css('background-color', '#FF6C6C');
        $('#instruction-text').html("Darn! I don't see any personal information left that I can steal. You win this time, Agent " + userName + "!");
    }


});
