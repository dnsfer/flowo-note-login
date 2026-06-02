// ELEMENTOS
const notesContainer = document.querySelector("#notes-container");
const noteContent = document.querySelector("#note-content");
const addNoteBtn = document.querySelector(".add-note");
const labelPickerBtn = document.querySelector("#label-picker-btn");
const labelPopup = document.querySelector("#label-popup");
// DARK MODE
const themeToggle = document.querySelector("#theme-toggle");
const icon = themeToggle.querySelector("i");
const priorityToggle = document.querySelector("#priority-toggle");
const priorityList = document.querySelector("#priority-list");
const editPopup = document.querySelector("#edit-popup");
const editTextarea = document.querySelector("#edit-textarea");
let editingId = null;
let selectedLabel = null;

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
      <i class="bi bi-trash3"></i>
    </div>
  `;

  element.querySelector(".bi-trash3").addEventListener("click", () => {
    deleteNote(id, element);
  });

  const pinIcon = document.createElement("i");
  pinIcon.classList.add("bi", "bi-pin-angle-fill");
  element.appendChild(pinIcon);

  element.querySelector(".bi-pin-angle-fill").addEventListener("click", () => {
    toggleFixNote(id);
  });

  element.addEventListener("click", (e) => {
    if (
      e.target.closest(".bi-trash3") ||
      e.target.closest(".bi-pin-angle-fill")
    )
      return;
    openEditPopup(id, content);
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

  const labelsHTML = selectedLabel
    ? `<span class="label-tag ${selectedLabel.value}">${selectedLabel.text}</span>`
    : "";

  const noteObject = {
    id: generateId(),
    content: texto,
    fixed: false,
    labels: selectedLabel ? [selectedLabel] : [],
  };

  const notes = getNotes();
  notes.push(noteObject);
  saveNotes(notes);

  fixedRender();

  noteContent.value = "";
  selectedLabel = null;
  labelPickerBtn.innerHTML = `<i class="bi bi-tag-fill"></i> Etiquetas`;
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

function deleteNote(id, element) {
  const notes = JSON.parse(localStorage.getItem("notes") || "[]");
  const updatedNotes = notes.filter((note) => String(note.id) !== String(id));
  saveNotes(updatedNotes);

  element.remove();
}

priorityList.querySelectorAll("li").forEach((li) => {
  li.addEventListener("click", () => {
    priorityToggle.innerHTML = `${li.textContent} <i class="bi bi-chevron-down"></i>`;
    priorityToggle.dataset.selected = li.dataset.value;

    priorityList.classList.add("hidden");
  });
});

function openEditPopup(id, content) {
  editingId = id;
  editTextarea.value = content;
  editPopup.classList.remove("hidden");
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

priorityToggle.addEventListener("click", () => {
  priorityList.classList.toggle("hidden");
});

document.querySelector("#edit-cancel").addEventListener("click", () => {
  editPopup.classList.add("hidden");
});

editPopup.addEventListener("click", (e) => {
  if (!e.target.closest("#edit-popup-content")) {
    editPopup.classList.add("hidden");
  }
});

labelPopup.querySelectorAll("li").forEach((li) => {
  li.addEventListener("click", () => {
    labelPopup
      .querySelectorAll("li")
      .forEach((l) => l.classList.remove("selected"));
    li.classList.add("selected");
    selectedLabel = { value: li.dataset.value, text: li.textContent.trim() };
    labelPopup.classList.add("hidden");
    labelPickerBtn.innerHTML = `<i class="bi bi-tag-fill"></i> ${li.textContent.trim()}`;
  });
});

document.querySelector("#exports-notes").addEventListener("click", () => {
  const notes = getNotes();

  const header = "Conteúdo,Etiqueta,Fixado";

  const rows = notes.map((note) => {
    const conteudo = `"${note.content.replace(/"/g, '""')}"`;
    const etiqueta =
      note.labels.length > 0 ? note.labels[0].text : "Sem etiqueta";
    const fixado = note.fixed ? "Sim" : "Não";

    return `${conteudo}, ${etiqueta}, ${fixado}`;
  });

  const csv = [header, ...rows].join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "flowo-notes.csv";
  link.click();

  URL.revokeObjectURL(url);
});

document.querySelector("#edit-save").addEventListener("click", () => {
  const notes = getNotes();
  const targetNote = notes.find((n) => n.id === editingId);

  targetNote.content = editTextarea.value.trim();

  const selectedValue = priorityToggle.dataset.selected;
  const selectedText = selectedValue
    ? priorityList.querySelector(`[data-value="${selectedValue}"]`).textContent
    : null;

  targetNote.labels = selectedValue
    ? [{ value: selectedValue, text: selectedText }]
    : targetNote.labels;

  saveNotes(notes);
  fixedRender();
  editPopup.classList.add("hidden");
});
// Inicialização
initTheme();
fixedRender();
