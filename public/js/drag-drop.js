
/*
Drag and drop vocabulary game 
Sources/Code: https://www.youtube.com/watch?v=twq9WHgUhQc
*/

//Get every list item that can be dragged 
const draggableListItems = document.querySelectorAll('.draggable-list li');

const endMessage = document.getElementById('endMessage'); 

//When you start dragging a phrase you are going to have to know its ID so that we can match it 


let selectedId;  // Current phrase being dragged 
let droppedOnId; // Phrase you dropped on

// Counter for correct phrases (Once we have 3 we won the game)
let matchingCounter = 0; 

// Need an eventListener to do matching (6 items * 3 event listeners = 18 event listeners)
addEventListeners();


//Get the id of the currect phrase being dragged 
function dragStart(){
    selectedId = this.id; //this.id refers to the element being dragged 
    console.log(selectedId);
}

// Whenever we are in the valid drop zone, we want to give that item a class list of over 
function dragEnter(){
    this.classList.add('over'); 
}

//Whenever we are not in a valid drop zone get rid of the over 
function dragLeave(){
    this.classList.remove('over'); 
}

// Prevent the default behavior of not allowing the drop 
function dragOver(ev){
    ev.preventDefault(); 
}

function dragDrop(){
    droppedOnId = this.id; //this.id refers to the target, not the element being dragged
    console.log(droppedOnId);

    if(checkForMatch(selectedId, droppedOnId)){ 
        //If you get it right, you want to hide both 
        document.getElementById(selectedId).style.display = 'none';
        document.getElementById(droppedOnId).style.display = 'none';
        matchingCounter++; 
    }

    //Check if we have a win 

    if(matchingCounter === 3){
        endMessage.style.display = 'block'; // Wjen we win, render the endMessage 
    }
      
    //Whenever you drop an item, you need to change the color 
    this.classList.remove('over'); //Change the color 
}


function checkForMatch(selected, droppedOn){
    switch(selected){
        case 't1': 
        //If the dragged term matches the one you dropped on, return true. Else, return false
            return droppedOn === 'd1' ? true : false;  

        case 't2': 
            return droppedOn === 'd2' ? true : false;   

        case 't3': 
            return droppedOn === 'd3' ? true : false;   
        
        default: 
            return false; 
    }
}

function playAgain(){
    console.log("playing again"); 
    matchingCounter = 0; 
    endMessage.style.display = 'none'; 
    //When you win, they are going to be hidden, so show them again 
    draggableListItems.forEach(item =>{
        document.getElementById(item.id).style.display = 'block'; 
    })
}

function addEventListeners() {
    draggableListItems.forEach (item => {
// Events from JS Drag and Drop API
        // Triggered when a draggable element starts being dragged
        item.addEventListener('dragstart', dragStart); 

        // Triggered when a draggable element enters a drop target
        item.addEventListener('dragenter', dragEnter); 

        // Triggered when a draggable element is dropped onto a drop target
        item.addEventListener('drop', dragDrop); 

        // Triggered when a draggable element is being dragged over a drop target
        item.addEventListener('dragover', dragOver);

        // Triggered when a draggable element leaves a drop target
        item.addEventListener('dragleave', dragLeave);

    })
}