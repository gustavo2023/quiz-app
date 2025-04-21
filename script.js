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

const getRandomQuestion = (subjectData) => {
  if (
    !subjectData ||
    !subjectData.questions ||
    subjectData.questions.length === 0
  ) {
    console.error("No questions found for the subject:", subjectData?.title);
    return null;
  }

  const questions = subjectData.questions;
  const randomIndex = Math.floor(Math.random() * questions.length);
  return questions[randomIndex];
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

      const subjectData = getSubjectData(selectedSubjectTitle, data);
      if (!subjectData) {
        console.error("Subject data not found for:", selectedSubjectTitle);
        return;
      }

      const randomQuestion = getRandomQuestion(subjectData);
      if (!randomQuestion) return;

      changeDisplayState(quizSetupContainer, "none");
      changeDisplayState(quizQuestionContainer, "flex");
      categoryTitle.textContent = subjectData.title;
      displayQuestionText(randomQuestion);
      displayAnswerOptions(randomQuestion, answerOptionBtns);
    });
  })
  .catch((error) => {
    console.error("Error fetching data:", error);
  });
