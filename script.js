// Initialize SortableJS on the survey container
const surveyContainer = document.getElementById('survey-container');  // Make sure this is the correct ID
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
  
    // Limit questions to 15
    if (questionCount >= 15) {
      alert("You can only add a maximum of 15 questions.");
      return;
    }
  
    const newQuestion = document.createElement('div');
    newQuestion.classList.add('question');
    newQuestion.setAttribute('data-type', 'scale'); // default question type
  
    newQuestion.innerHTML = `
      <span class="drag-handle">⇅</span>
      <input type="text" class="question-text" value="New Question" />
      <select class="question-type" onchange="changeQuestionType(this)">
        <option value="scale">1-5 Scale</option>
        <option value="single">Single Pick</option>
      </select>
      <div class="options-container"></div>
      <button class="delete-question" onclick="deleteQuestion(this)">Delete</button>
      <button class="add-option" onclick="addOption(this)" style="display:none;">Add Option</button> <!-- Hidden initially -->
    `;
  
    surveyContainer.appendChild(newQuestion);
  }
  

// Change the question type
function changeQuestionType(selectElement) {
  const questionDiv = selectElement.parentElement;
  const optionsContainer = questionDiv.querySelector('.options-container');
  const addOptionButton = questionDiv.querySelector('.add-option');
  const questionType = selectElement.value;

  if (questionType === 'single') {
    optionsContainer.innerHTML = `
      <input type="text" value="Option 1" class="option" />
      <input type="text" value="Option 2" class="option" />
    `;
    addOptionButton.style.display = 'inline-block'; // Show "Add Option" button
  } else {
    optionsContainer.innerHTML = ''; // Remove options for scale question
    addOptionButton.style.display = 'none';
  }
}

// Add an option to the "Single Pick" question
function addOption(button) {
  const optionsContainer = button.closest('.question').querySelector('.options-container');
  const currentOptions = optionsContainer.querySelectorAll('.option').length;

  // Limit to 5 options
  if (currentOptions >= 5) {
    alert("You can only add a maximum of 5 options.");
    return;
  }

  const newOption = document.createElement('input');
  newOption.type = 'text';
  newOption.value = `Option ${currentOptions + 1}`;
  newOption.classList.add('option');
  optionsContainer.appendChild(newOption);
}

// Delete a question
function deleteQuestion(button) {
  const questionDiv = button.parentElement;
  questionDiv.remove();
}

// Prepare and serialize the survey data
// Prepare and format the survey data
function prepareSurveyData() {
    const questions = document.querySelectorAll('.question');
    let formattedSurveyData = '';
  
    questions.forEach((question, index) => {
      const questionText = question.querySelector('.question-text').value;
      const questionType = question.querySelector('.question-type').value;
      let optionsText = '';
  
      if (questionType === 'single') {
        // Collect options for single pick questions
        const options = Array.from(question.querySelectorAll('.option')).map(option => option.value);
        optionsText = `   Options: ${options.join(', ')}`;
      }
  
      formattedSurveyData += `${index + 1}. ${questionText}\n   Type: ${questionType}\n${optionsText}\n\n`;
    });
  
    // Put the formatted survey data into the hidden textarea
    const surveyDataField = document.getElementById('surveyData');
    surveyDataField.value = formattedSurveyData.trim(); // Trim to remove trailing newline
  }
  
