// ELEMENTOS
const notesContainer = document.querySelector("#notes-container");
const noteContent = document.querySelector("#note-content");
const addNoteBtn = document.querySelector(".add-note");
const labelPickerBtn = document.querySelector("#label-picker-btn");
const labelPopup = document.querySelector("#label-popup");

// DARK MODE
const themeToggle = document.querySelector("#theme-toggle");
const icon = themeToggle.querySelector("i");

// Abre/fecha o popup
labelPickerBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  labelPopup.classList.toggle("hidden");
});

// Fecha ao clicar fora
document.addEventListener("click", (e) => {
  if (!e.target.closest("#label-picker-wrapper")) {
    labelPopup.classList.add("hidden");
  }
});

// FUNÇÕES
function generateId() {
  return Math.floor(Math.random() * 5000);
}

function createNote(id, content, labelsHTML) {
  const element = document.createElement("div");
  element.classList.add("note");
  element.dataset.id = id;

  element.innerHTML = `
  <span class="note-id">#${id}</span>
    <div class="note-labels">${labelsHTML}</div>
    <textarea placeholder="Anote sua tarefa?">${content}</textarea>
    <i class="bi bi-pin-angle-fill"></i>
    <i class="bi bi-x-lg"></i>
    <i class="bi bi-stickies"></i>
  `;

  return element;
}

function addNote() {
  const texto = noteContent.value.trim();
  if (!texto) return;

  const noteObject = {
    id: generateId(),
    content: texto,
    fixed: false,
  };

  const selecionadas = [
    ...document.querySelectorAll("#label-popup input:checked"),
  ];
  const labelsHTML = selecionadas
    .map(
      (cb) =>
        `<span class="label-tag ${
          cb.value
        }">${cb.labels[0].textContent.trim()}</span>`
    )
    .join("");

  const noteElement = createNote(noteObject.id, noteObject.content, labelsHTML);
  notesContainer.appendChild(noteElement);

  noteContent.value = "";
  selecionadas.forEach((cb) => (cb.checked = false));
  labelPopup.classList.add("hidden");
}

// EVENTOS
addNoteBtn.addEventListener("click", () => addNote());

// DARK MODE
const savedTheme = localStorage.getItem("theme") || "";
document.documentElement.dataset.theme = savedTheme;
icon.className = savedTheme === "dark" ? "bi bi-sun-fill" : "bi bi-moon-fill";

themeToggle.addEventListener("click", () => {
  const isDark = document.documentElement.dataset.theme === "dark";
  const newTheme = isDark ? "" : "dark";

  document.documentElement.dataset.theme = newTheme;
  icon.className = isDark ? "bi bi-moon-fill" : "bi bi-sun-fill";
  localStorage.setItem("theme", newTheme);
});
