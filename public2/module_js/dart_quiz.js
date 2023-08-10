// Sources referenced: https://codepen.io/boopalan002/pen/yKZVGa and https://codepen.io/harunpehlivan/pen/bGeOPye and https://www.sitepoint.com/simple-javascript-quiz/
let currentQuestion = 1;
let viewingAnswer = false;
let correctAnswers = 0;
let quizOver = false;
let numQuestions = Object.keys(questionData).length;
// stores selected answers for each question, indexed by the question number ie index.
let selectedAnswer = [];
let questionScores = [];

$(document).ready(function() {    
    console.log("In dart_quiz.js");
    console.log("Question Data: " + questionData);
    console.log("num questions: " + numQuestions);

    // console.log("Solange Data: " + questionData);
    // console.log("after");

    // Display the first question
    displayCurrentQuestion();

    // hide warning and next nav button and disable previous quiz nav button
    $(".quizMessage").hide();
    $(".result").hide();
    $(".avatar-container").hide();
    $("#nextButton").css("filter", "grayscale(100%)");
    $("#nextButton").prop("disabled", true);    

    // $(".preButton").css("filter", "grayscale(100%)");
    // $(".preButton").addClass("disabled");
    // $(this).find(".preButton").attr('disabled', 'disabled');


	$(this).find(".preButton").on("click", function () 
	{		
		
        if (!quizOver) {
			if(currentQuestion == 0) { return false; }
	
			// if(currentQuestion == 1) {
            //     $(".preButton").css("filter", "grayscale(100%)");
            //     $(".preButton").addClass("disabled");
            // }
			
            currentQuestion--; // Since we have already displayed the first question on DOM ready
            if (currentQuestion < numQuestions) {
                displayCurrentQuestion();
            } 					
		} else {
            // quiz is over and clicked the previous button (which is now the try again button)

            resetQuiz();
			// if(viewingAns == 3) { return false; }
			// currentQuestion = 0; viewingAns = 3;
			// viewResults();		
		}
    });



	// On clicking next, display the next question
    $(this).find(".nextButton").on("click", function () {
        if (!quizOver) {
            // let val = $("input[type='radio']:checked").val();
            // console.log("Val: " + val);
            // console.log("Answer: " + questionData[currentQuestion].correctResponse)

            let val;

            // Get user selections 
            if (questionData[currentQuestion].type === "yes_no") {
                val = $("input[type='radio']:checked").val();
            } else if  (questionData[currentQuestion].type === "multi_select") {
                val = [];
                $("input[type='checkbox']:checked").each(function() {
                    val.push($(this).val());
                });
            }
            console.log("Val: " + val);

            // Ensure user selected an answer and then score and add to selected answers array (doing all this now so don't have to iterate through questions again later)
            if (val == undefined) {
                $(document).find(".errorMessage").text("Please select an answer");
                $(document).find(".quizMessage").show();
            } else {
                // Remove warning and Grade the question apporpriately 
                $(document).find(".quizMessage").hide();

                if (questionData[currentQuestion].type === "yes_no") {
                    // simple yes/no question so if correct add 1 point if wrong add 0 points
                    if (val === questionData[currentQuestion].correctResponse) {
                        console.log("Correct Answer!")
                        questionScores[currentQuestion - 1] = 1;
                    } else {
                        questionScores[currentQuestion - 1] = 0;
                    }

                    // question 1 answer stored in array index 0
                    selectedAnswer[currentQuestion - 1] = val;
                    console.log("selectedAnswer: " + selectedAnswer);
                    console.log("questionScores: " + questionScores);
                } else if  (questionData[currentQuestion].type === "multi_select") {
                    // multi select question grading based on how canvas does it: https://canvas.iastate.edu/courses/64978/files/14202040/download?download_frd=1
                    // question is 1 point total. Correct answers are worth 1 / number correct point each. Incorrect answers are worth a negative value of this. Result cannot be negative.
                    const totalOptions = questionData[currentQuestion].correctResponse.length;
                    const correctScore = 1 / totalOptions; // Score for each correct response
                    const incorrectScore = -correctScore;  // Score for each incorrect response
                    
                    let multiScore = 0;
                    
                    for (const response of val) {
                        if (questionData[currentQuestion].correctResponse.includes(response)) {
                            multiScore += correctScore;
                        } else {
                            multiScore += incorrectScore;
                        }
                    }
                    
                    // Ensure the score is not negative
                    multiScore = Math.max(multiScore, 0);
                    
                    console.log(`Total Score: ${multiScore}`);
                    
                    selectedAnswer[currentQuestion - 1] = val;
                    questionScores[currentQuestion - 1] = multiScore;
                    console.log("selectedAnswer: " + selectedAnswer);
                    console.log("questionScores: " + questionScores);

                }


				// Since we have already displayed the first question on DOM ready
				currentQuestion++; 
				if(currentQuestion >= 2) {
                    $(".preButton").css("filter", "none");
                    $(".preButton").removeClass("disabled");
                
                }
				// if (currentQuestion < Object.keys(questionData[currentQuestion].choices).length) 
                // display questions 1-5
                if (currentQuestion <= numQuestions) {
					displayCurrentQuestion();
				} 
				else 
				{
                    $(".choiceList").empty();
                    $(".checkboxChoices").empty();
                    $(".question").empty();
					displayScore();
					$(document).find(".preButton").text("Try Again");
					$(document).find(".nextButton").text("View Answers");
					quizOver = true;
					return false;
				}
			}
					
		}	
		else 
		{ // quiz is over and clicked the next button (which now displays 'Play Again?'
			// quizOver = false; $('#iTimeShow').html('Time Remaining:'); selectedAnswer = [];
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
    if(currentQuestion == 1) {
        $(".preButton").css("filter", "grayscale(100%)");
        $(".preButton").addClass("disabled");
    }

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

    const htmlImageContainer = $(".htmlImage");
    const checkBoxesContainer = $(".checkboxChoices");


    // current question we want to display
    const question = questionData[currentQuestion];

    // Remove all previous question content so we can display the needed question (whether it be a previous one or new one)
    $(".choiceList").empty();
    htmlImageContainer.empty();
    checkBoxesContainer.empty();


    // Set the questionClass text to the current question
    $(".question").text(questionPrompt);

    // Create and append the image element
    // const imageContainer = $(".image");
    // const imageSrc = '/images/identity/challenge/' + question.image;
    // const imageElement = $("<img>").attr("src", imageSrc);
    // imageContainer.append(imageElement);

    // const pugImageSrc = 'include ../../partials/identity/challenge/' + question.partial;
    // const pugImageElement = $("<include>")

    //     http://localhost:3000/quizPartials/identity/challenge/q1.html

    if(question.partial != "none") {
        $.get("/quizPartials/identity/challenge/" + question.partial, function(data) {
            // 'data' contains the content of the Pug template
            htmlImageContainer.html(data);

            // Update the current time if it exists in the partial
            const currentTimeSpan = document.getElementById('current-time');
            if (currentTimeSpan) {
                currentTimeSpan.textContent = currentTime;
            } else {
                console.log("Element with ID 'current-time' not found.");
            }
        });
    } else {
        htmlImageContainer.empty();
    }
    // else if (currentQuestion == 3){
    //     $(document).find(".htmlImage").hide();
    //     const imageContainer = $(".image");
    //     const imageSrc = '/quizPartials/identity/challenge/' + question.partial;
    //     const imageElement = $("<img>").attr("src", imageSrc);
    //     imageContainer.append(imageElement);
    // } else if (currentQuestion == 4){
    //     $(".image").empty();
    //     const imageContainer = $(".image");
    //     $(document).find(".htmlImage").hide();
    //     const imageSrc = '/quizPartials/identity/challenge/' + question.partial;
    //     const imageElement = $("<img>").attr("src", imageSrc);
    //     imageContainer.append(imageElement);
    // }


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
            // console.log("currentQuestion: " + currentQuestion)
            // console.log("choice: " + choice)
            // console.log("choiceKey: " + choiceKey);
            // console.log("selectedAnswer - 1: " + selectedAnswer[currentQuestion - 1])

   
                        
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

            // when going to previous questions, fill in with their previous answers
            if(choiceKey === selectedAnswer[currentQuestion - 1]) {
                document.getElementById(choiceKey).checked = true;
            } 
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
		
	// 	if(selectedAnswer[currentQuestion] == i) {
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
		
	// 	if(selectedAnswer[currentQuestion] == i) {
	// 		$('<li><input type="radio" class="radio-inline" checked="checked"  value=' + i + ' name="dynradio" />' +  ' ' + choice  + '</li>').appendTo(choiceList);
	// 	} else {
	// 		$('<li><input type="radio" class="radio-inline" value=' + i + ' name="dynradio" />' +  ' ' + choice  + '</li>').appendTo(choiceList);
	// 	}
    // }
}


function displayScore() {
    // add up scores
    for (const score of questionScores) {
        correctAnswers += score;
    }


    console.log("In display score!");

    $(document).find(".resultText").text("You got " + correctAnswers + " out of " + numQuestions + " questions correct!");

    const finalScore = correctAnswers / numQuestions;
    // fill: { gradient: ["#32C38B", "#B8E2B6"] } 

    $('.circleResults').circleProgress({
        value: finalScore,
        size: 300,
        fill: "#32C38B"
        }).on('circle-animation-progress', function(event, progress) {
        $(this).find('strong').html(Math.round(100 * finalScore) + '<i>%</i>');
    });

    $(".result").show();
    $(".avatar-container").show();


    for(let i = 0; i <= selectedAnswer.length; i++) {
        console.log("Index: " + i + " selectedAnswer: " + selectedAnswer[i]);
    }    
}

function resetQuiz() {
    $(document).find(".result").hide();
    $(document).find(".avatar-container").hide();

    currentQuestion = 1;
    correctAnswers = 0;
    quizOver = false;
    selectedAnswer = [];
    questionScores = [];
    viewingAnswer = false;
    $(document).find(".preButton").text("Previous Question");
    $(document).find(".nextButton").text("Next Question");


    // Display the first question
    displayCurrentQuestion();
}
