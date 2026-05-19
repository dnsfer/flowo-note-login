// ELEMENTOS
const notesContainer = document.querySelector("#notes-container");
const noteContent = document.querySelector("#note-content");
const addNoteBtn = document.querySelector(".add-note");
const labelPickerBtn = document.querySelector("#label-picker-btn");
const labelPopup = document.querySelector("#label-popup");

// DARK MODE
const themeToggle = document.querySelector("#theme-toggle");
const icon = themeToggle.querySelector("i");

// FUNÇÕES
function getNotes() {
  return JSON.parse(localStorage.getItem("notes") || "[]");
}
function generateId() {
  return Date.now().toString().slice(-6);
  //Pegar somente o final do ID escolhido.
}

function createNote(id, content, labelsHTML, fixed = false) {
  const element = document.createElement("div");
  element.classList.add("note");
  if (fixed) element.classList.add("fixed");
  element.dataset.id = id;

  element.innerHTML = `
    <div class="note-labels">${labelsHTML}</div>
    <textarea placeholder="Anote sua tarefa?">${content}</textarea>
    <div class="note-icons">
      
      <i class="bi bi-stickies"></i>
      <i class="bi bi-trash3"></i>
    </div>
  `;

  element.querySelector(".bi-trash3").addEventListener("click", () => {
    deleteNote(id, element);
  });

  const pinIcon = document.createElement("i");

  pinIcon.classList.add(...["bi", "bi-pin-angle-fill"]);

  element.appendChild(pinIcon);

  element.querySelector(".bi-pin-angle-fill").addEventListener("click", () => {
    toggleFixNote(id);
  });

  return element;
}

function toggleFixNote(id) {
  const notes = getNotes();
  const targetNote = notes.find((n) => n.id === id);
  targetNote.fixed = !targetNote.fixed;
  saveNotes(notes);
  fixedRender();

  
}

function addNote() {
  const texto = noteContent.value.trim();
  if (!texto) return;

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

  const noteObject = {
    id: generateId(),
    content: texto,
    fixed: false,
    labels: selecionadas.map((cb) => ({
      value: cb.value,
      text: cb.labels[0].textContent.trim(),
    })),
  };
  // Preenche o Array na LocalStorage
  const notes = JSON.parse(localStorage.getItem("notes") || "[]");
  notes.push(noteObject);
  saveNotes(notes);

  const noteElement = createNote(noteObject.id, noteObject.content, labelsHTML);
  notesContainer.appendChild(noteElement);

  noteContent.value = "";
  selecionadas.forEach((cb) => (cb.checked = false));
  labelPopup.classList.add("hidden");
}

function saveNotes(notes) {
  localStorage.setItem("notes", JSON.stringify(notes));
}

function fixedRender() {
  notesContainer.innerHTML = "";

  const notes = getNotes();

  const fixedSorted = [
    ...notes.filter((n) => n.fixed),
    ...notes.filter((n) => !n.fixed),
  ];

  fixedSorted.forEach((note) => {
    const labelsHTML = note.labels
      .map((l) => `<span class="label-tag ${l.value}">${l.text}</span>`)
      .join("");

    const el = createNote(note.id, note.content, labelsHTML, note.fixed);
    notesContainer.appendChild(el);
  });
}
// DARK MODED
function initTheme() {
  const savedTheme = localStorage.getItem("theme") || "";
  document.documentElement.dataset.theme = savedTheme;
  icon.className = savedTheme === "dark" ? "bi bi-sun-fill" : "bi bi-moon-fill";
}

function toggleTheme() {
  const isDark = document.documentElement.dataset.theme === "dark";
  const newTheme = isDark ? "" : "dark";

  document.documentElement.dataset.theme = newTheme;
  icon.className = isDark ? "bi bi-moon-fill" : "bi bi-sun-fill";
  localStorage.setItem("theme", newTheme);
}

function loadNotes() {
  const notes = JSON.parse(localStorage.getItem("notes") || "[]");

  notes.forEach((note) => {
    const labelsHTML = note.labels
      .map(
        (label) => `<span class="label-tag ${label.value}">${label.text}</span>`
      )
      .join("");

    const noteElement = createNote(note.id, note.content, labelsHTML);
    notesContainer.appendChild(noteElement);
  });
}

function deleteNote(id, element) {
  const notes = JSON.parse(localStorage.getItem("notes") || "[]");
  const updatedNotes = notes.filter((note) => String(note.id) !== String(id));
  saveNotes(updatedNotes);

  element.remove();
}
// EVENTOS
addNoteBtn.addEventListener("click", () => addNote());

themeToggle.addEventListener("click", () => toggleTheme());

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

// Inicialização
initTheme();
fixedRender();
