// Initialize the sortable feature
const surveyContainer = document.getElementById('survey-container');
Sortable.create(surveyContainer, {
  animation: 150,
  handle: '.question', // Draggable by the question box
  ghostClass: 'sortable-ghost' // Class to apply to the placeholder
});

// EmailJS configuration
const serviceID = 'service_6yfw8qv'; // Replace with your EmailJS Service ID
const templateID = 'template_ldqfqhn'; // Replace with your EmailJS Template ID
const publicKey = '0MTm12EYVQEsfhyLs'; // Replace with your EmailJS Public Key

// Initialize EmailJS with the public key
emailjs.init(publicKey);

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
    // Add input fields for single pick options (default 2 options)
    optionsContainer.innerHTML = `
      <input type="text" value="Option 1" class="option" />
      <input type="text" value="Option 2" class="option" />
    `;
    addOptionButton.style.display = 'inline-block'; // Show "Add Option" button
  } else {
    // Remove extra options for scale question
    optionsContainer.innerHTML = '';
    addOptionButton.style.display = 'none'; // Hide "Add Option" button
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

// Collect survey data and send via email
function sendSurvey() {
  const questions = document.querySelectorAll('.question');
  const surveyData = [];

  questions.forEach((question) => {
    const questionText = question.querySelector('.question-text').value;
    const questionType = question.querySelector('.question-type').value;
    const options = Array.from(question.querySelectorAll('.option')).map(option => option.value);

    // Validate for "Single Pick" question (at least 2 options and no more than 5)
    if (questionType === 'single' && (options.length < 2 || options.length > 5)) {
      alert("You must provide at least 2 options and no more than 5 for single pick questions.");
      return;
    }

    surveyData.push({
      text: questionText,
      type: questionType,
      options: questionType === 'single' ? options : []
    });
  });

  // Prepare email data to send via EmailJS
  const emailData = {
    to_email: "vkr.games.play@gmail.com",  // Destination email
    from_name: "Survey Creator",  // Static or can be dynamic (use {{from_name}} in the template)
    from_email: "user@example.com",  // You can dynamically capture the user's email
    reply_to: "user@example.com",   // Optional, if you'd like to reply to the survey creator
    message: JSON.stringify(surveyData),  // Survey data as JSON string
    email: "vkr.games.play@gmail.com"  // This is for internal use (set destination email)
  };

  emailjs.send('your_service_id', 'your_template_id', {
    to_email: 'vkr.games.play@gmail.com',
    message: 'Test email'
  })
  .then(response => console.log(response))
  .catch(error => console.log(error));

  // Send the survey data via email using EmailJS
//   emailjs.send(serviceID, templateID, emailData)
//     .then((response) => {
//       alert('Survey sent successfully!');
//     })
//     .catch((error) => {
//       alert('Error sending survey: ' + error);
//     });
}
