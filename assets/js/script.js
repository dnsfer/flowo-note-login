// ELEMENTOS
const addNoteBtn = document.querySelector(".add-note");

const noteContent = document.querySelector("#note-content");

const notesContainer = document.querySelector("#notes-container");

const labelPickerBtn = document.querySelector("#label-picker-btn");

const labelPopup = document.querySelector("#label-popup");

// DARK MODE
const themeToggle = document.querySelector("#theme-toggle");
const icon = themeToggle.querySelector("i");

// Abre/fecha o popup
labelPickerBtn.addEventListener("click", (e) => {
  e.stopPropagation(); // ✅ impede fechar imediatamente
  labelPopup.classList.toggle("hidden");
});

// Fecha ao clicar fora
document.addEventListener("click", (e) => {
  if (!e.target.closest("#label-picker-wrapper")) {
    labelPopup.classList.add("hidden");
  }
});

// Cria o card ao clicar em "+"
addNoteBtn.addEventListener("click", () => {
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

  const note = document.createElement("div");
  note.classList.add("note");
  note.innerHTML = `
    <div class="note-labels">${labelsHTML}</div>
    <textarea placeholder="Anote sua tarefa?">${texto}</textarea>
    <i class="bi bi-pin-angle-fill"></i>
    <i class="bi bi-x-lg"></i>
    <i class="bi bi-stickies"></i>
  `;

  notesContainer.appendChild(note);
  noteContent.value = "";
  selecionadas.forEach((cb) => (cb.checked = false));
  labelPopup.classList.add("hidden");
});
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


