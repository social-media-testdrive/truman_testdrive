// Sources referenced: https://codepen.io/boopalan002/pen/yKZVGa and https://codepen.io/harunpehlivan/pen/bGeOPye and https://www.sitepoint.com/simple-javascript-quiz/
let currentQuestion = 1;
let viewingAnswer = false;
let correctAnswers = 0;
let quizOver = false;
let numQuestions = Object.keys(questionData).length;
// stores selected answers for each question, indexed by the question number ie index.
let selectedAnswer = [];
let questionScores = [];
let attempts = 0;
let scoreTotal = 0;

let this_js_script = $('script[src*=dart_quiz]');
let currentSection = this_js_script.attr('current-section');   
let nextLink = this_js_script.attr('next-link');   
console.log("**currentSection: " + currentSection);
console.log("**nextLink: " + nextLink);

$(document).ready(function() {    
    console.log("In dart_quiz.js");
    // console.log("explanation data example:" + questionData[1].choices[3].explanation);
    // console.log("Question Data: " + questionData);
    // console.log("num questions: " + numQuestions);

    // console.log("Solange Data: " + questionData);
    // console.log("after");

    // Display the first question
    displayCurrentQuestion();

    // hide warning and next nav button and disable previous quiz nav button
    $(".viewAnswers").hide();
    $(".quizMessage").hide();
    $(".explanationCorrectMulti").hide();
    $(".explanationIncorrectMulti").hide();
    $(".explanationCorrectYesNo").hide();
    $(".explanationIncorrectYesNo").hide();
    
    $(".result").hide();
    $(".avatar-container").hide();
    $("#nextButton").hide();
    // $("#nextButton").css("filter", "grayscale(100%)");
    // $("#nextButton").prop("disabled", true);    

    // $(".preButton").css("filter", "grayscale(100%)");
    // $(".preButton").addClass("disabled");
    // $(this).find(".preButton").attr('disabled', 'disabled');


	$(this).find(".preButton").on("click", function () {		
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
            attempts++;
            viewingAnswer = false;
            resetQuiz();
		}

        // If viewing answer reset the show explanation button if going back to previous question
        if(viewingAnswer) {
            $(".explainButtonIncorrect a, .explainButtonCorrect a").text("Show Explanations");
            $(".explainButtonIncorrect i, .explainButtonCorrect i").removeClass("down caret icon").addClass("right caret icon");
            $(".showExplaination").remove();
        }
    });


	// On clicking next, display the next question
    $(this).find(".nextButton").on("click", function () {
        if (!quizOver) {
            // let val = $("input[type='radio']:checked").val();
            // console.log("Val: " + val);
            // console.log("Answer: " + questionData[currentQuestion].correctResponse)

            // if on last question, change next button text to "complete quiz"
            if(currentQuestion === numQuestions - 1) {
                $(".nextButton").text("Submit Quiz");
            }

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
            // console.log("Val: " + val);

            // Ensure user selected an answer and then score and add to selected answers array (doing all this now so don't have to iterate through questions again later)
            if (val == undefined || val.length === 0) {
                $(".errorMessage").text("Please select an answer");
                $(".quizMessage").show();
            } else {
                // Remove warning and Grade the question apporpriately 
                $(".quizMessage").hide();

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
                    multiScore = Number(multiScore.toFixed(2));

                    
                    console.log(`Total Score: ${multiScore}`);
                    console.log(typeof multiScore);

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
                    $(".explanationCorrectMulti").hide();
                    $(".explanationIncorrectMulti").hide();
                    $(".explanationCorrectYesNo").hide();
                    $(".explanationIncorrectYesNo").hide();
                    $(".quizMessage").hide();
					displayScore();
					$(".preButton").text("Try Again");
                    $(".nextButton").text("Complete Quiz");

					// $(".nextButton").text("View Answers");
					quizOver = true;
					return false;
				}
			}
					
		}	
		else { // quiz is over and clicked the next button (which now displays 'Complete Quiz')
            // save info into database
            // window.location.href = "/challenge3/identity";
            // let correctAnswers = 0;
            // let scoreTotal = 40;
            // let selectedAnswer = ['yes', 'no', 'yes', 'no', [1,2,3,4]];
            // let questionScores = [0, 0, 1, 1, 0];
            let modID = "identity";
            console.log("Posting quiz attempt to database!");
            console.log("ScoreTotal is: " + scoreTotal);
            // const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

            fetch('/postQuizScore', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                //data to be sent in the request body
                body: JSON.stringify({
                    "modID": modID,
                    "scoreTotal": scoreTotal,
                    "selectedAnswer": selectedAnswer,
                    "questionScores": questionScores,
                    "nextLink": nextLink,
                    "currentSection": currentSection,
                })
            })
            .then(response => {
                if (response.ok) {
                    // Request was successful
                    console.log('Quiz attempt posted successfully!');
                    // Now can navigate to the next page
                    window.location.href = nextLink;
                } else {
                    // Handle error response
                    console.error('Failed to post quiz attempt');
                }
            })
            .catch(error => {
                // Handle network or fetch error
                console.error(error);
            });
		}


        // If viewing answer reset the show explanation button when going to next question
        if(viewingAnswer) {
            $(".explainButtonIncorrect a, .explainButtonCorrect a").text("Show Explanations");
            $(".explainButtonIncorrect i, .explainButtonCorrect i").removeClass("down caret icon").addClass("right caret icon");
            $(".showExplaination").remove();
        }
    });
    
	$(this).find(".viewAnswers").on("click", function () {
        // console.log("View Answers Clicked!");
        viewingAnswer = true;

        // disable ability to change selectedAnswers
        $(".choiceList").css("pointer-events", "none");
        $(".checkboxChoices").css("pointer-events", "none");

        resetQuiz();
    });

    $(this).find(".explainButtonIncorrect, .explainButtonCorrect").on("click", function () {
        console.log("Show explanations clicked!");
    
        // Toggle button for show/hide functionality
        let currentButtonText = $(this).find("a").text();
        const iconElement = $(this).find("i");
    
        if (currentButtonText === "Show Explanations") {
            // Toggle button to hide and add explanations
            $(this).find("a").text("Hide Explanations");
            iconElement.removeClass("right caret icon").addClass("down caret icon");
    
            // Dynamically add explanations
            $(".checkboxChoices .ui.checkbox.listChoices").each(function() {
                const checkbox = $(this);
                checkbox.addClass("addShadow");
                const explanationDiv = $("<div>").addClass("explanation showExplanationContainer")
                    .addClass(getExplanationColor(checkbox)).append(
                        $("<div>").addClass("ui message showExplaination")
                            .addClass(getExplanationColor(checkbox)).append(
                                $("<h2>").addClass("ui header").append(getExplanationTitle(checkbox))
                            ).append(
                                $("<p>").addClass(getExplanationColor(checkbox) + "Explanation")
                                    .text(getExplanationText(checkbox))
                            )
                    );
                explanationDiv.insertAfter(checkbox);
            });
    
            // Scroll to the top of the page so user can see the explanations
            window.scrollTo(0, 0);
        } else {
            // Toggle button to show and remove explanations
            $(this).find("a").text("Show Explanations");
            iconElement.removeClass("down caret icon").addClass("right caret icon");
            $(".showExplaination").remove();
        }
    
        function getExplanationColor(checkbox) {
            if (checkbox.hasClass("missedChoice") || checkbox.hasClass("incorrectChoice")) {
                return "red";
            } else {
                return "green";
            }
        }
    
        function getExplanationTitle(checkbox) {
            if (checkbox.hasClass("missedChoice")) {
                return "This should have been selected";
            } else if (checkbox.hasClass("incorrectChoice")) {
                return "This should <u>not</u> have been selected";
            } else {
                return "Correct";
            }
        }
    
        function getExplanationText(checkbox) {
            // *debugging to see everything in the inspect element console instead of just [object Object]
            // for (const property in checkbox) {
            //     console.log(property, checkbox[property]);
            // }
            const inputElement = checkbox.find("input");
            const checkboxValue = inputElement.val();
            return questionData[currentQuestion].choices[checkboxValue].explanation;
        }
    });
});

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
    // let questionClass = $(".quizContainer > .question");
    let choiceList = $(".quizContainer > .choiceList");
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
    $(".explanationCorrectMulti").hide();
    $(".explanationIncorrectMulti").hide();
    $(".explanationCorrectYesNo").hide();
    $(".explanationIncorrectYesNo").hide();

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
        $.get("/quizPartials/identity/" + currentSection + "/" + question.partial, function(data) {
            // 'data' contains the content of the Pug template
            htmlImageContainer.html(data);

            // Update the current time if it exists in the partial
            const currentTimeSpan = document.getElementById('current-time');
            const currentDateSpan = document.getElementById('current-date');
            const futureDateSpan = document.getElementById('future-date');
            const userNameSpan = document.getElementById('user-name');
            const userEmailSpan = document.getElementById('user-email');

            if (currentTimeSpan) {
                currentTimeSpan.textContent = currentTime;
            } 

            if (currentDateSpan) {
                currentDateSpan.textContent = currentDate;
            } 

            if (futureDateSpan) {
                futureDateSpan.textContent = futureDate;
            } 

            if (userNameSpan) {
                userNameSpan.textContent = username;
            } 

            if (userEmailSpan) {
                userEmailSpan.textContent = email;
            } 
        });
    } else {
        htmlImageContainer.empty();
    }
    // else if (currentQuestion == 3){
    //     $(".htmlImage").hide();
    //     const imageContainer = $(".image");
    //     const imageSrc = '/quizPartials/identity/challenge/' + question.partial;
    //     const imageElement = $("<img>").attr("src", imageSrc);
    //     imageContainer.append(imageElement);
    // } else if (currentQuestion == 4){
    //     $(".image").empty();
    //     const imageContainer = $(".image");
    //     $(".htmlImage").hide();
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
            
            let labelElement;
            if(questionData[currentQuestion].type === "yes_no") {
                labelElement = document.createElement("label");
                labelElement.textContent = choice.text;
            } else if  (questionData[currentQuestion].type === "multi_select") {
                // make label a p element so we can style it for multiline text for the long multi-select question prompts
                labelElement = document.createElement("label");
                const choiceText = document.createElement("p");
                choiceText.textContent = choice.text;
                labelElement.appendChild(choiceText);
            }


            checkboxDiv.append(input);
            checkboxDiv.append(labelElement);
            
            choiceContainer.append(checkboxDiv);

            // when going to previous questions, fill in with their previous answers
            if (questionData[currentQuestion].type === "yes_no") {
                if(choiceKey === selectedAnswer[currentQuestion - 1] && viewingAnswer === false) { 
                    document.getElementById(choiceKey).checked = true;
                } 
            } else if  (questionData[currentQuestion].type === "multi_select") {
                // console.log("**********************JAYZUS**********************")
                // console.log("choiceKey: " + choiceKey);
                // console.log("selectedAnswer[currentQuestion - 1]: " + selectedAnswer[currentQuestion - 1]);

                // check that previous answers exist
                if(selectedAnswer[currentQuestion - 1] != undefined) {
                    // console.log("PREVIOUSE ANSWERS EXIST")
                    // console.log("selectedAnswer[currentQuestion - 1]: " + selectedAnswer[currentQuestion - 1]);
                    // console.log("choiceKey: " + choiceKey);
                    // console.log("selectedAnswer[currentQuestion - 1].includes(choiceKey): " + selectedAnswer[currentQuestion - 1].includes(choiceKey));
                    
                    // check that the current checkbox choice to display is in the string of previously selected checkboxes
                    if(selectedAnswer[currentQuestion - 1].includes(choiceKey)) {
                        document.getElementById(choiceKey).checked = true;
                    }

                    // functionality to add mark the graded multi select question 
                    // when viewing answers is true, also add class to make green/red 
                    if(viewingAnswer === true) {
                        if(selectedAnswer[currentQuestion - 1].includes(choiceKey) && questionData[currentQuestion].correctResponse.includes(choiceKey)) {
                            // if user selected it and its a correct choice
                            let correctChoice = document.getElementById(choiceKey).parentNode;
                            correctChoice.classList.add("correctChoice");
                            let labelElement = $(correctChoice).find("label"); 
                            $('<i class="check circle green icon gradedIcon"></i>').prependTo(labelElement);
                            // console.log("CORRECT CHOICE: " + choiceKey);
                        } else if (selectedAnswer[currentQuestion - 1].includes(choiceKey)) {
                            // if user selected it and its a incorrect choice
                            let wrongChoice = document.getElementById(choiceKey).parentNode;
                            wrongChoice.classList.add("incorrectChoice");
                            let labelElement = $(wrongChoice).find("label"); 
                            $('<i class="times circle red icon gradedIcon"></i>').prependTo(labelElement);
                        }else if (questionData[currentQuestion].correctResponse.includes(choiceKey)) {
                            // if its a correct choice the user did not select, mark it missed
                            let missedChoice = document.getElementById(choiceKey).parentNode;
                            missedChoice.classList.add("missedChoice");
                            let labelElement = $(missedChoice).find("label"); // Use missedChoice here
                            $('<i class="times circle red icon gradedIcon"></i>').prependTo(labelElement);
                            // console.log("Missed CHOICE: " + choiceKey);
                        }
                    }

                }

                // var selectedAnswersArray = selectedAnswer[currentQuestion - 1].split(',').map(function(item) {
                //     // parse the string number to base 10 integers
                //     return parseInt(item, 10);
                // });
                
                // console.log("The arrary!!!: " + selectedAnswersArray); // Output: [2, 7, 4]
                // console.log(selectedAnswersArray[0]); 



                // if(choiceKey === selectedAnswer[currentQuestion - 1] && viewingAnswer === false) { 
                //     console.log("YO IN HERE FOR MULTISELECT")
                //     $("input[type='checkbox']:checked").each(function() {
                //         let temp = $(this).val();
                //         console.log("the value is: " + temp);
                //         document.getElementById(temp).checked = true;
                //     });
                // } 
            }
        });

        
        if(viewingAnswer === true) {
            // console.log("We have to be viewing the answer");
            // for(let i = 0; i <= selectedAnswer.length; i++) {
            //     console.log("Index: " + i + " selectedAnswer: " + selectedAnswer[i]);
            // }    
            // for(let i = 0; i <= questionScores.length; i++) {
            //     console.log("Index: " + i + " questionScores: " + questionScores[i]);
            // }   
            if(questionData[currentQuestion].type === "yes_no") {
                // fill in the user's selected answer to this question
                if(selectedAnswer[currentQuestion - 1] != undefined) {
                    document.getElementById(selectedAnswer[currentQuestion - 1]).checked = true;
                } 
                console.log("Current selected answer: " + selectedAnswer[currentQuestion - 1])


                // console.log("WHATTTTT: " +  questionData[currentQuestion].choices.yes.explanation);
                // Fill in the explanation 
                if(questionScores[currentQuestion - 1] === 1) {
                    document.getElementById(selectedAnswer[currentQuestion - 1]).parentNode.classList.add("correctChoice");
                    $(".correctScore").text("Score: " + questionScores[currentQuestion - 1] + "/1");
                    // selectedAnswer[currentQuestion - 1] is yes or no
                    $(".correctExplanation").html(questionData[currentQuestion].explanation);
                    $(".explanationCorrectYesNo").show();
                } else if(questionScores[currentQuestion - 1] === 0) {
                    document.getElementById(selectedAnswer[currentQuestion - 1]).parentNode.classList.add("incorrectChoice");
                    $(".incorrectScore").text("Score: " + questionScores[currentQuestion - 1] + "/1");
                    $(".incorrectExplanation").html(questionData[currentQuestion].explanation);
                    // $(".incorrectExplanation").text(questionData[currentQuestion].choices[selectedAnswer[currentQuestion - 1]].explanation);
                    $(".explanationIncorrectYesNo").show();
                } 
            } else if (questionData[currentQuestion].type === "multi_select") {
                if(questionScores[currentQuestion - 1] === 1) {
                    $(".correctScore").text("Score: " + questionScores[currentQuestion - 1] + "/1");                

                    // let userAnswerLetters = convertSelectedAnswerToLetters(selectedAnswer[currentQuestion - 1]);
                    // $(".yourAnswers").text("You answered: " + userAnswerLetters);
                    // $(".theAnswers").text("The correct answers are: " + questionData[currentQuestion].theAnswers);
                    $(".explanationCorrectMulti").show();
                } else {
                    $(".incorrectScore").text("Score: " + questionScores[currentQuestion - 1] + "/1");

                    // console.log("BEYONCE THE Selected answer now is: " + selectedAnswer[currentQuestion - 1]);
                    // convert object into string of user choices like: ["2","3","5"]


                    let userAnswerLetters = convertSelectedAnswerToLetters(selectedAnswer[currentQuestion - 1]);
                    // console.log("userAnswerLetters: " + userAnswerLetters);


                    $(".yourAnswers").text("You answered: " + userAnswerLetters);
                    $(".theAnswers").text("The correct answers are: " + questionData[currentQuestion].theAnswers);
                    $(".explanationIncorrectMulti").show();
                } 

            }
        }
    }
    
    console.log("End of display current Question");
}

// change user's selected answers to the corresponding letters. E.g. if they chose multiselect options "0,1,3,4,5" it would return "A, B, D, E, F"
function convertSelectedAnswerToLetters(userAnswersObj) {
    const userAnswers = JSON.stringify(userAnswersObj);
    // console.log(typeof userAnswers);
    // console.log("AFTER STRINGIFY userAnswers: " + userAnswers);

    // remove the brackets and quotes from the string so its like: 2,3,5
    var cleanedString = userAnswers.replace(/["\[\]]/g, '');
    // console.log("cleanedString: " + cleanedString);

    const mapping = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"; // A corresponds to 0, B corresponds to 1, and so on
    const numbersArray = cleanedString.split(',').map(Number);
    
    const lettersArray = numbersArray.map(number => mapping[number]);
    const result = lettersArray.join(', ');
    return result;
}


function displayScore() {
    // add up scores
    for (const score of questionScores) {
        correctAnswers += score;
    }


    let cleanScore = 0;

    // only show 2 decimal places if the score is a decimal
    if(correctAnswers % 1 === 0) {
        cleanScore = correctAnswers;
    } else {
        cleanScore = (correctAnswers).toFixed(2)
    }

    $(".resultText").text("You got " + cleanScore + " out of " + numQuestions + " questions correct!");

    scoreTotal = (correctAnswers / numQuestions).toFixed(2);
    // fill: { gradient: ["#32C38B", "#B8E2B6"] } 

    $('.circleResults').circleProgress({
        value: scoreTotal,
        size: 300,
        fill: "#32C38B"
        }).on('circle-animation-progress', function(event, progress) {
        $(this).find('strong').html(Math.round(100 * scoreTotal) + '<i>%</i>');
    });

    $(".result").show();

    // don't let user view answers on the challenge prequiz
    if(currentSection !== "challenge") {
        $(".viewAnswers").show();
    }
    
    $(".avatar-container").show();


    for(let i = 0; i <= selectedAnswer.length; i++) {
        console.log("Index: " + i + " selectedAnswer: " + selectedAnswer[i]);
    }    
}

function resetQuiz() {
    $(".result").hide();
    $(".avatar-container").hide();
    $(".viewAnswers").hide();
    $(".preButton").text("Previous Question");
    $(".nextButton").text("Next Question");
    currentQuestion = 1;
    correctAnswers = 0;
    quizOver = false;

    // only clear selectedAnswer if not viewing answers
    if(viewingAnswer === false) {
        selectedAnswer = [];
        questionScores = [];    
        $(".choiceList").css("pointer-events", "auto");
        $(".checkboxChoices").css("pointer-events", "auto");
    }

    // viewingAnswer = false;
    // Display the first question
    displayCurrentQuestion();
}
