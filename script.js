// DOM elements
const body = document.body;
const themeToggleBtn = document.querySelector('.switch input[type="checkbox"]');
const currentTheme = localStorage.getItem("theme");
const quizSetupContainer = document.querySelector(".quiz-setup-container");
const quizQuestionContainer = document.querySelector(
  ".quiz-question-container"
);
const quizResultContainer = document.querySelector(".quiz-result-container");
const subjectOptionInputs = document.querySelectorAll(".subject-option-input");
const startBtn = document.querySelector(".start-btn");
const categoryTitle = document.querySelector(".category");
const answerOptionBtns = document.querySelectorAll(".answer-btn");
const questionTextElement = document.querySelector(".question");
const timeSpan = document.querySelector(".time");
const currentQuestionSpan = document.querySelector(".current-question");
const nextBtn = document.querySelector(".next-question-btn");

let currentQuestionIndex = 0;
let score = 0;
let currentSubjectData = null; // Store data for the selected subject
let availableQuestions = []; // Store questions not yet asked
let currentQuestion = null; // Store the current question object
let answerSelected = false; // Flag to prevent multiple selections

const applyTheme = (theme) => {
  if (theme === "dark") {
    body.classList.add("dark-mode");
    themeToggleBtn.checked = true;
  } else {
    body.classList.remove("dark-mode");
    themeToggleBtn.checked = false;
  }
};

if (currentTheme) {
  applyTheme(currentTheme);
} else {
  applyTheme("light"); // Default to light theme if no preference is set
}

themeToggleBtn.addEventListener("change", () => {
  const newTheme = body.classList.contains("dark-mode") ? "light" : "dark";
  applyTheme(newTheme);
  localStorage.setItem("theme", newTheme);
});

const changeDisplayState = (element, state) => {
  element.style.display = state;
};

const getSelectedSubject = () => {
  let selectedSubject = null;

  subjectOptionInputs.forEach((input) => {
    if (input.checked) {
      selectedSubject = input.dataset.title;
    }
  });
  return selectedSubject;
};

const getSubjectData = (subjectTitle, data) => {
  return data.subjects.find((subject) => subject.title === subjectTitle);
};

const displayQuestionText = (question) => {
  if (!question || !question.question) {
    console.error("Invalid question object for displayQuestionText");
    questionTextElement.textContent = "Error loading question.";
    return;
  }
  questionTextElement.textContent = question.question;
};

const displayAnswerOptions = (question, buttons) => {
  if (!question || !question.options || !buttons) {
    console.error("Invalid arguments for displayAnswerOptions");
    return;
  }

  buttons.forEach((button, index) => {
    button.style.display = "block"; // Ensure buttons are visible
    if (question.options[index]) {
      button.textContent = question.options[index];
    } else {
      button.style.display = "none"; // Hide button if no option text
    }
  });
};

const disableAnswerButtons = () => {
  answerOptionBtns.forEach((btn) => (btn.disabled = true));
};

const checkAnswer = (selectedButton) => {
  if (answerSelected) return; // Prevent further action if an answer was already selected
  answerSelected = true; // Mark that an answer has been selected for this question

  const selectedAnswer = selectedButton.textContent;
  const correctAnswer = currentQuestion.correct;

  disableAnswerButtons(); // Disable all buttons immediately after selection
  nextBtn.disabled = false; // Enable the next button

  if (selectedAnswer === correctAnswer) {
    selectedButton.classList.add("correct");
    score++; // Increment score only if correct
  } else {
    selectedButton.classList.add("incorrect");
    // Find and highlight the correct answer button
    answerOptionBtns.forEach((btn) => {
      if (btn.textContent === correctAnswer) {
        btn.classList.add("correct");
      }
    });
  }
};

const displayNextQuestion = () => {
  // Reset styles and states for answer buttons before displaying the next question
  answerOptionBtns.forEach((btn) => {
    btn.classList.remove("correct", "incorrect", "selected"); // Ensure all feedback classes are removed
    btn.disabled = false; // Re-enable buttons for the next question
  });
  nextBtn.disabled = true; // Disable the next button until an answer is selected
  answerSelected = false; // Reset the selection flag for the new question

  if (availableQuestions.length === 0) {
    changeDisplayState(quizQuestionContainer, "none");
    changeDisplayState(quizResultContainer, "flex"); // Example: Show results
    // TODO: Display final score and results
    console.log("Quiz Finished! Score:", score); // Placeholder for results display
    return;
  }

  currentQuestionIndex++;
  currentQuestionSpan.textContent = currentQuestionIndex;

  const randomIndex = Math.floor(Math.random() * availableQuestions.length);
  currentQuestion = availableQuestions.splice(randomIndex, 1)[0]; // Store current question and remove it

  if (!currentQuestion) {
    console.error("Failed to get the next question.");
    return;
  }

  displayQuestionText(currentQuestion);
  displayAnswerOptions(currentQuestion, answerOptionBtns);
};

const startQuiz = (data) => {
  const selectedSubjectTitle = getSelectedSubject();
  if (!selectedSubjectTitle) {
    alert("Please select a subject to start the quiz.");
    return;
  }

  currentSubjectData = getSubjectData(selectedSubjectTitle, data); // Store subject data
  if (!currentSubjectData || !currentSubjectData.questions) {
    console.error(
      "Subject data or questions not found for:",
      selectedSubjectTitle
    );
    return;
  }

  // Initialize quiz state
  availableQuestions = [...currentSubjectData.questions]; // Copy questions
  currentQuestionIndex = 0; // Reset index for the new quiz
  score = 0; // Reset score

  changeDisplayState(quizSetupContainer, "none");
  changeDisplayState(quizQuestionContainer, "flex");
  categoryTitle.textContent = currentSubjectData.title;

  // Display the first question
  displayNextQuestion();
};

fetch("./data.json")
  .then((response) => {
    if (!response.ok) throw new Error("Failed to fetch data");
    return response.json();
  })
  .then((data) => {
    startBtn.addEventListener("click", () => startQuiz(data));

    // Add event listeners to answer buttons
    answerOptionBtns.forEach((button) => {
      button.addEventListener("click", () => checkAnswer(button));
    });

    nextBtn.addEventListener("click", displayNextQuestion);
  })
  .catch((error) => {
    console.error("Error fetching data:", error);
  });
