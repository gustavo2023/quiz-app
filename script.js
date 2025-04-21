const body = document.body;
const themeToggleBtn = document.querySelector('.switch input[type="checkbox"]');
const currentTheme = localStorage.getItem("theme");
const quizSetupContainer = document.querySelector(".quiz-setup-container");
const quizQuestionContainer = document.querySelector(
  ".quiz-question-container"
);
const quizResultContainer = document.querySelector(".quiz-result-container");
const subjectOptionInputs = document.querySelectorAll(".subject-option-input");
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

const changeDisplayState = (element) => {
  element.style.display = element.style.display === "none" ? "flex" : "none";
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

const getRandomQuestion = (subjectTitle, data) => {
  // Find the subject object that matches the selected title
  const subjectData = data.subjects.find(
    (subject) => subject.title === subjectTitle
  );

  if (!subjectData || !subjectData.questions || subjectData.questions.length === 0) {
    console.error("No questions found for the selected subject:", subjectTitle);
    return null;
  }

  const questions = subjectData.questions;
  const randomIndex = Math.floor(Math.random() * questions.length);
  // Return the question at the random index
  return questions[randomIndex];
};

fetch("./data.json")
  .then((response) => {
    if (!response.ok) throw new Error("Failed to fetch data");
    return response.json();
  })
  .then((data) => {
    // TODO: Use the fetched data to populate the quiz setup
  })
  .catch((error) => {
    console.error("Error fetching data:", error);
  });
