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

});


// This displays the current question AND the choices
function displayCurrentQuestion() 
{
    console.log("In display current Question");
    console.log("Current Question: " + currentQuestion);
    // let question = questionData[1].prompt;

    let questionPrompt = questionData[currentQuestion].prompt;
    // console.log("Question: " + question);
    // let questionClass = $(document).find(".quizContainer > .question");
    // let choiceList = $(document).find(".quizContainer > .choiceList");
    // let numChoices = Object.keys(questionData[currentQuestion].choices).length;
    // console.log("Num Choices: " + numChoices);

    // current question we want to display
    const question = questionData[currentQuestion];


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
    $.get("/quizPartials/identity/challenge/" + question.partial, function(data) {
        // 'data' contains the content of the Pug template
        htmlImageContainer.append(data);
    });

    // Remove all current <li> elements (if any)
    // $(choiceList).find("li").remove();

    const choiceContainer = $(".choiceList");

    if (question) {
        const choices = question.choices;
        Object.keys(choices).forEach((choiceKey) => {
            const choice = choices[choiceKey];
    
            const checkboxDiv = document.createElement("div");
            checkboxDiv.classList.add("ui", "radio", "checkbox");
    
            const input = document.createElement("input");
            input.type = "radio";
            input.name = currentQuestion; // Use the specified question ID
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
