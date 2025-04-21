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
let totalQuestions = 0; // Total questions for the subject

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
    if (question.options[index]) {
      button.textContent = question.options[index];
    } else {
      button.style.display = "none";
    }
  });
};

const displayNextQuestion = () => {
  if (availableQuestions.length === 0) {
    console.log("Quiz finished!"); // Placeholder for showing results
    // Optionally disable the next button or show results screen
    changeDisplayState(quizQuestionContainer, "none");
    // changeDisplayState(quizResultContainer, 'flex'); // Example: Show results
    return;
  }

  currentQuestionIndex++;
  // Update to only show the current question number
  currentQuestionSpan.textContent = currentQuestionIndex;

  // Select and remove a random question from the available list
  const randomIndex = Math.floor(Math.random() * availableQuestions.length);
  const currentQuestion = availableQuestions.splice(randomIndex, 1)[0]; // Get the question and remove it

  if (!currentQuestion) {
    console.error("Failed to get the next question.");
    return;
  }

  displayQuestionText(currentQuestion);
  displayAnswerOptions(currentQuestion, answerOptionBtns);
};

fetch("./data.json")
  .then((response) => {
    if (!response.ok) throw new Error("Failed to fetch data");
    return response.json();
  })
  .then((data) => {
    startBtn.addEventListener("click", () => {
      const selectedSubjectTitle = getSelectedSubject();
      if (!selectedSubjectTitle) {
        alert("Please select a subject to start the quiz.");
        return;
      }

      currentSubjectData = getSubjectData(selectedSubjectTitle, data); // Store subject data
      if (!currentSubjectData || !currentSubjectData.questions) {
        console.error("Subject data or questions not found for:", selectedSubjectTitle);
        return;
      }

      // Initialize quiz state
      availableQuestions = [...currentSubjectData.questions]; // Copy questions
      totalQuestions = availableQuestions.length;
      currentQuestionIndex = 0; // Reset index for the new quiz
      score = 0; // Reset score

      changeDisplayState(quizSetupContainer, "none");
      changeDisplayState(quizQuestionContainer, "flex");
      categoryTitle.textContent = currentSubjectData.title;

      // Display the first question
      displayNextQuestion();
    });

    // Add event listener for the next button
    nextBtn.addEventListener("click", displayNextQuestion);
  })
  .catch((error) => {
    console.error("Error fetching data:", error);
  });
