// Sources referenced: https://codepen.io/boopalan002/pen/yKZVGa and https://codepen.io/harunpehlivan/pen/bGeOPye and https://www.sitepoint.com/simple-javascript-quiz/
let currentQuestion = 1;
let viewingAnswer = false;
let correctAnswers = 0;
let quizOver = false;
// stores selected answers for each question, indexed by the question number ie index.
var iSelectedAnswer = [];

$(document).ready(function() {
    // console.log("In dart_quiz.js");
    // console.log("Solange Data: " + questionData);
    // console.log("after");

    // Display the first question
    displayCurrentQuestion();
    $(this).find(".quizMessage").hide();
    $(this).find(".preButton").attr('disabled', 'disabled');



	// On clicking next, display the next question
    $(this).find(".nextButton").on("click", function () {
        if (!quizOver) {
            let val = $("input[type='radio']:checked").val();
            console.log("Val: " + val);
            // if (questionData[currentQuestion].type === "yes_no") {
            //     let temp = questionData[currentQuestion].correctResponse
            // } else if  (questionData[currentQuestion].type === "yes_no") {
            
            // }
            // console.log("Temp: " + temp);

            if (val == undefined) 
			{
                $(document).find(".quizMessage").text("Please select an answer");
                $(document).find(".quizMessage").show();
            } 
			else 
			{
                $(document).find(".quizMessage").hide();
                // keep track of correct, need to account for question type
				// if (val == questionData[currentQuestion].correctResponse) {
				// 	correctAnswers++;
				// }
				// iSelectedAnswer[currentQuestion] = val;

				// Since we have already displayed the first question on DOM ready
				currentQuestion++; 
				if(currentQuestion >= 1) {
					  $('.preButton').prop("disabled", false);
				}
				// if (currentQuestion < Object.keys(questionData[currentQuestion].choices).length) 
                // display questions 1-5
                if (currentQuestion <= Object.keys(questionData).length) {
					displayCurrentQuestion();
				} 
				// else 
				// {
				// 	displayScore();
				// 	$('#iTimeShow').html('Quiz Time Completed!');
				// 	$('#timer').html("You scored: " + correctAnswers + " out of: " + questions.length);
				// 	c=185;
				// 	$(document).find(".preButton").text("View Answer");
				// 	$(document).find(".nextButton").text("Play Again?");
				// 	quizOver = true;
				// 	return false;
					
				// }
			}
					
		}	
		else 
		{ // quiz is over and clicked the next button (which now displays 'Play Again?'
			// quizOver = false; $('#iTimeShow').html('Time Remaining:'); iSelectedAnswer = [];
			// $(document).find(".nextButton").text("Next Question");
			// $(document).find(".preButton").text("Previous Question");
			//  $(".preButton").attr('disabled', 'disabled');
			// resetQuiz();
			// viewingAns = 1;
			// displayCurrentQuestion();
			// hideScore();
		}
    });
    

});


// This displays the current question AND the choices
function displayCurrentQuestion() 
{
    window.scrollTo(0, 0);
    console.log("In display current Question");
    console.log("Current Question: " + currentQuestion);
    // let question = questionData[1].prompt;

    let questionPrompt = questionData[currentQuestion].prompt;
    // console.log("Question: " + question);
    // let questionClass = $(document).find(".quizContainer > .question");
    let choiceList = $(document).find(".quizContainer > .choiceList");
    console.log("Choice List: " + choiceList)
    // let numChoices = Object.keys(questionData[currentQuestion].choices).length;
    // console.log("Num Choices: " + numChoices);

    // current question we want to display
    const question = questionData[currentQuestion];

    // Remove all previous choices
    // $(".choiceList .ui.radio.checkbox").remove();
    $(".choiceList").empty();

    // Set the questionClass text to the current question
    $(".question").text(questionPrompt);

    // Create and append the image element
    // const imageContainer = $(".image");
    // const imageSrc = '/images/identity/challenge/' + question.image;
    // const imageElement = $("<img>").attr("src", imageSrc);
    // imageContainer.append(imageElement);

    const htmlImageContainer = $(".htmlImage");
    // const pugImageSrc = 'include ../../partials/identity/challenge/' + question.partial;
    // const pugImageElement = $("<include>")

    //     http://localhost:3000/quizPartials/identity/challenge/q1.html

    // later have all html, no pngs
    if(currentQuestion == 1 || currentQuestion == 2) {
        $.get("/quizPartials/identity/challenge/" + question.partial, function(data) {
            // 'data' contains the content of the Pug template
            htmlImageContainer.html(data);

            // htmlImageContainer.append(data);
        });
    } else if (currentQuestion == 3){
        $(document).find(".htmlImage").hide();
        const imageContainer = $(".image");
        const imageSrc = '/quizPartials/identity/challenge/' + question.partial;
        const imageElement = $("<img>").attr("src", imageSrc);
        imageContainer.append(imageElement);
    } else if (currentQuestion == 4){
        $(".image").empty();
        const imageContainer = $(".image");
        $(document).find(".htmlImage").hide();
        const imageSrc = '/quizPartials/identity/challenge/' + question.partial;
        const imageElement = $("<img>").attr("src", imageSrc);
        imageContainer.append(imageElement);

    }


    let choiceContainer;
    if (questionData[currentQuestion].type === "yes_no") {
        choiceContainer = $(".choiceList");
    } else if  (questionData[currentQuestion].type === "multi_select") {
        choiceContainer = $(".checkboxChoices");
    }

    if (question) {
        const choices = question.choices;
        Object.keys(choices).forEach((choiceKey) => {
            const choice = choices[choiceKey];
    
            const checkboxDiv = document.createElement("div");    
            const input = document.createElement("input");

            if (questionData[currentQuestion].type === "yes_no") {
                checkboxDiv.classList.add("ui", "radio", "checkbox");
                input.type = "radio";
            } else if  (questionData[currentQuestion].type === "multi_select") {
                checkboxDiv.classList.add("ui", "checkbox", "listChoices");
                input.type = "checkbox";
                $(".choiceList").attr("style", "");

            }
            input.name = "q" + currentQuestion; // Use the specified question ID
            input.id = choiceKey;
            input.value = choiceKey;
    
            const labelElement = document.createElement("label");
            labelElement.textContent = choice.text;
    
            checkboxDiv.append(input);
            checkboxDiv.append(labelElement);
            
            choiceContainer.append(checkboxDiv);
        });
    }
    

    // const choiceContainer = document.getElementById("raised-container"); // Replace with the actual ID of the container element

    // const qid = "1"; // Replace with the actual question ID
    
    // for (const questionKey in questionData) {
    //     if (questionData.hasOwnProperty(questionKey)) {
    //         const question = questionData[questionKey];
    //         Object.keys(question.choices).forEach((choiceKey) => {
    //             const choice = question.choices[choiceKey];
    
    //             const checkboxDiv = document.createElement("div");
    //             checkboxDiv.classList.add("ui", "radio", "checkbox");
    
    //             const input = document.createElement("input");
    //             input.type = "radio";
    //             input.name = `question_${qid}_${questionKey}`; // Include question key in the name
    //             input.value = choiceKey;
    
    //             const labelElement = document.createElement("label");
    //             labelElement.textContent = choice.text;
    
    //             checkboxDiv.appendChild(input);
    //             checkboxDiv.appendChild(labelElement);
    
    //             choiceContainer.appendChild(checkboxDiv);
    //         });
    //     }
    // }
    


    // let choice;

    // for (i = 0; i < numChoices; i++) 
	// {
    //     choice = questionData[currentQuestion].choices[i];
		
	// 	if(iSelectedAnswer[currentQuestion] == i) {
	// 		$('<li><input type="radio" class="radio-inline" checked="checked"  value=' + i + ' name="dynradio" />' +  ' ' + choice  + '</li>').appendTo(choiceList);
	// 	} else {
	// 		$('<li><input type="radio" class="radio-inline" value=' + i + ' name="dynradio" />' +  ' ' + choice  + '</li>').appendTo(choiceList);
	// 	}
    // }

    console.log("End of display current Question");

    
    // var question = questions[currentQuestion].question;
    // var questionClass = $(document).find(".quizContainer > .question");
    // var choiceList = $(document).find(".quizContainer > .choiceList");
    // var numChoices = questions[currentQuestion].choices.length;
    // // Set the questionClass text to the current question
    // $(questionClass).text(question);
    // // Remove all current <li> elements (if any)
    // $(choiceList).find("li").remove();
    // var choice;
	
	
    // for (i = 0; i < numChoices; i++) 
	// {
    //     choice = questions[currentQuestion].choices[i];
		
	// 	if(iSelectedAnswer[currentQuestion] == i) {
	// 		$('<li><input type="radio" class="radio-inline" checked="checked"  value=' + i + ' name="dynradio" />' +  ' ' + choice  + '</li>').appendTo(choiceList);
	// 	} else {
	// 		$('<li><input type="radio" class="radio-inline" value=' + i + ' name="dynradio" />' +  ' ' + choice  + '</li>').appendTo(choiceList);
	// 	}
    // }
}
