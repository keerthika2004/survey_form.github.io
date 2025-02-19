// Initialize Sortable.js for drag-and-drop question reordering
const surveyContainer = document.getElementById('survey-container');

// Sortable feature to reorder questions
Sortable.create(surveyContainer, {
  animation: 150,
  handle: '.question',
  ghostClass: 'sortable-ghost'
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
    <input type="text" class="question-text" value="New Question" />
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
    optionsContainer.innerHTML = `
      <input type="text" value="Option 1" class="option-input" />
      <input type="text" value="Option 2" class="option-input" />
    `;
    addOptionButton.style.display = 'inline-block';
  } else {
    optionsContainer.innerHTML = '';
    addOptionButton.style.display = 'none';
  }
}

// Add a new option for single-pick questions
function addOption(button) {
  const optionsContainer = button.closest('.question').querySelector('.options-container');
  const currentOptions = optionsContainer.querySelectorAll('.option-input').length;

  if (currentOptions >= 5) {
    alert("You can only add a maximum of 5 options.");
    return;
  }

  const newOption = document.createElement('input');
  newOption.type = 'text';
  newOption.value = `Option ${currentOptions + 1}`;
  newOption.classList.add('option-input');
  optionsContainer.appendChild(newOption);
}

// Save the survey
function saveSurvey() {
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

  const surveyTitle = prompt("Enter a title for your survey:");
  const surveys = JSON.parse(localStorage.getItem('surveys')) || [];

  surveys.push({
    id: Date.now(),
    title: surveyTitle,
    data: surveyData
  });

  localStorage.setItem('surveys', JSON.stringify(surveys));

  alert('Survey saved successfully!');
  window.location.href = 'index.html'; // Redirect to main page after saving
}

