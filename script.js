// Initialize Sortable.js for drag-and-drop question reordering
const surveyContainer = document.getElementById('survey-container');

// Sortable feature to reorder questions
document.addEventListener('DOMContentLoaded', () => {
  new Sortable(surveyContainer, {
    animation: 150,  // Smooth animation
    ghostClass: 'sortable-ghost',  // Class applied to the dragged element
    handle: '.drag-handle',  // Drag handle class
  });
});

// Add a new question
function addQuestion() {
  const questionCount = document.querySelectorAll('.question').length;

  if (questionCount >= 15) {
    alert("You can only add a maximum of 15 questions.");
    return;
  }

  const newQuestion = document.createElement('div');
  newQuestion.classList.add('question');
  newQuestion.innerHTML = `
    <span class="drag-handle">⇅</span>  <!-- Drag handle for moving -->
    <input type="text" class="question-text" placeholder="New Question" />
    <select class="question-type" onchange="changeQuestionType(this)">
      <option value="scale">1-5 Scale</option>
      <option value="single">Single Pick</option>
    </select>
    <div class="options-container"></div>
    <button class="delete-question" onclick="deleteQuestion(this)">Delete</button>
    <button class="add-option" onclick="addOption(this)" style="display:none;">Add Option</button>
  `;

  surveyContainer.appendChild(newQuestion);
}

// Change question type (scale/single-pick)
function changeQuestionType(selectElement) {
  const questionDiv = selectElement.parentElement;
  const optionsContainer = questionDiv.querySelector('.options-container');
  const addOptionButton = questionDiv.querySelector('.add-option');
  const questionType = selectElement.value;

  if (questionType === 'single') {
    // Create two default options with placeholders for "Single Pick" type
    optionsContainer.innerHTML = `
      <div class="option-container">
        <input type="text" class="option-input" value="Option 1" data-placeholder="Option 1" />
      </div>
      <div class="option-container">
        <input type="text" class="option-input" value="Option 2" data-placeholder="Option 2" />
      </div>
    `;

    // Apply placeholder behavior (focus/blur) to default options
    optionsContainer.querySelectorAll('.option-input').forEach(optionInput => {
      handlePlaceholder(optionInput);  // Add focus/blur behavior
    });

    addOptionButton.style.display = 'inline-block';  // Show "Add Option" button
  } else {
    optionsContainer.innerHTML = '';  // Clear options for "scale" type
    addOptionButton.style.display = 'none';  // Hide "Add Option" button
  }
}

function handlePlaceholder(input) {
  // When the input is focused, clear the placeholder if it's the same as the current value
  input.addEventListener('focus', function() {
    if (input.value === input.dataset.placeholder) {
      input.value = '';  // Clear the field
    }
  });

  // When the input loses focus, if it's empty, reset the placeholder
  input.addEventListener('blur', function() {
    if (input.value.trim() === '') {
      input.value = input.dataset.placeholder;  // Reset placeholder if the field is empty
    }
  });

  // Initially, if the value is empty, set the placeholder text as the value
  if (input.value.trim() === '') {
    input.value = input.dataset.placeholder;
  }
}


function addOption(button) {
  const optionsContainer = button.closest('.question').querySelector('.options-container');
  const currentOptions = optionsContainer.querySelectorAll('.option-input').length;
  if (currentOptions >= 5) {
    alert("You can only add a maximum of 5 options.");
    return;
  }

  const newOption = document.createElement('input');
  newOption.type = 'text';
  newOption.placeholder = `Option ${currentOptions + 1}`;  // Set placeholder
  newOption.classList.add('option-input');
  newOption.dataset.placeholder = `Option ${currentOptions + 1}`;

  // Add event listeners for focus and blur to handle placeholder behavior
  handlePlaceholder(newOption);

  const deleteButton = document.createElement('button');
  deleteButton.classList.add('delete-option');
  deleteButton.innerText = 'Delete Option';
  deleteButton.onclick = function() {
    deleteOption(this);
  };

  const optionContainer = document.createElement('div');
  optionContainer.classList.add('option-container');
  optionContainer.appendChild(newOption);
  optionContainer.appendChild(deleteButton);

  optionsContainer.appendChild(optionContainer);
}


// Delete an individual option from a "Single Pick" question
function deleteOption(button) {
  const optionDiv = button.parentElement;
  optionDiv.remove();
}

// Delete a question
function deleteQuestion(button) {
  const questionDiv = button.parentElement;
  questionDiv.remove();
}

// Save the survey
function saveSurvey() {
  const urlParams = new URLSearchParams(window.location.search);
  const surveyId = urlParams.get('id');  // Get the survey ID from the URL

  const questions = document.querySelectorAll('.question');
  const surveyData = [];

  questions.forEach((question) => {
    const questionText = question.querySelector('.question-text').value;
    const questionType = question.querySelector('.question-type').value;
    const options = Array.from(question.querySelectorAll('.option-input')).map(option => option.value);

    surveyData.push({
      text: questionText,
      type: questionType,
      options: options
    });
  });

  const surveys = JSON.parse(localStorage.getItem('surveys')) || [];

  if (surveyId) {
    // Update the existing survey
    const surveyIndex = surveys.findIndex(survey => survey.id === Number(surveyId));
    if (surveyIndex !== -1) {
      surveys[surveyIndex].data = surveyData;
    }
  } else {
    // Create a new survey if no ID is present
    const surveyTitle = prompt("Enter a title for your survey:");
    surveys.push({
      id: Date.now(),
      title: surveyTitle,
      data: surveyData
    });
  }

  localStorage.setItem('surveys', JSON.stringify(surveys));

  alert('Survey saved successfully!');
  window.location.href = 'index.html';  // Redirect to main page after saving
}

function sendSurvey() {
  const questions = document.querySelectorAll('.question');
  let surveyData = "";

  // Collect the survey data
  questions.forEach((question, index) => {
    const questionText = question.querySelector('.question-text').value;
    const questionType = question.querySelector('.question-type').value;
    const options = Array.from(question.querySelectorAll('.option-input')).map(option => option.value);

    surveyData += `Question ${index + 1}: ${questionText}\nType: ${questionType}\n`;

    if (questionType === 'single') {
      surveyData += `Options:\n ${options.join(',\n')}\n`;
    }

    surveyData += '\n';
  });

  // Populate the hidden form input with the survey data
  document.getElementById('survey-body').value = surveyData;

  // Submit the form programmatically to Formspree
  document.getElementById('survey-form').submit();
}


//submit the survey
/*function sendSurvey() {
  const questions = document.querySelectorAll('.question');
  let surveyData = "";

  questions.forEach((question, index) => {
    const questionText = question.querySelector('.question-text').value;
    const questionType = question.querySelector('.question-type').value;
    const options = Array.from(question.querySelectorAll('.option')).map(option => option.querySelector('input').value);
    
    surveyData += `Question ${index + 1}: ${questionText}\nType: ${questionType}\n`;

    if (questionType === 'single') {
      surveyData += `Options: ${options.join(', ')}\n`;
    }

    surveyData += '\n';
  });

  // Use a mailto: link to open the email client
  const email = "vkr.games.play@gmail.com"; // Replace with the email address you want to send to
  const subject = "Survey Results";
  const body = encodeURIComponent(surveyData);

  window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${body}`;
}
*/
/*function sendSurvey() {
  const questions = document.querySelectorAll('.question');
  let surveyData = "";

  questions.forEach((question, index) => {
    // Get the question text and type
    const questionText = question.querySelector('.question-text').value;
    const questionType = question.querySelector('.question-type').value;

    // Add the question number, text, and type
    surveyData += `Question ${index + 1}: ${questionText}\nType: ${questionType}\n`;

    // If it's a single-pick question, retrieve and format the options
    if (questionType === 'single') {
      const options = Array.from(question.querySelectorAll('.option-input')).map(option => option.value);
      surveyData += `Options:\n${options.map(option => ` ${option}`).join(',\n')}\n`; // Each option on a new line
    }

    surveyData += '\n';  // Add a blank line between questions
  });

  // Open Gmail in the browser with the pre-filled subject and body
  const email = "info@swoopt.app"; // Replace with the recipient email address
  const subject = "Survey Results";
  const body = encodeURIComponent(surveyData);

  // Open Gmail in the browser with the pre-filled subject and body
  window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${body}`;
}
*/


