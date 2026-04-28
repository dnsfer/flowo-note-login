const labelPickerBtn = document.querySelector("#label-picker-btn");
const labelPopup = document.querySelector("#label-popup");

// Abre/fecha o popup
labelPickerBtn.addEventListener("click", () => {
  labelPopup.classList.toggle("hidden");
});

// Fecha ao clicar fora
document.addEventListener("click", (e) => {
  if (!e.target.closest("#label-picker-wrapper")) {
    labelPopup.classList.add("hidden");
  }
});

// Na criação do card, pega as etiquetas marcadas
addNoteBtn.addEventListener("click", () => {
  const texto = noteContent.value.trim();
  if (!texto) return;

  const selecionadas = [...document.querySelectorAll("#label-popup input:checked")];
  const labelsHTML = selecionadas.map(cb => 
    `<span class="label-tag ${cb.value}">${cb.labels[0].textContent.trim()}</span>`
  ).join("");

  const note = document.createElement("div");
  note.classList.add("note");
  note.innerHTML = `
    <div class="note-labels">${labelsHTML}</div>
    <textarea placeholder="Anote sua tarefa?">${texto}</textarea>
    <div class="note-footer">
      <i class="bi bi-pin-angle-fill"></i>
      <i class="bi bi-x-lg"></i>
      <i class="bi bi-stickies"></i>
    </div>
  `;

  notesContainer.appendChild(note);
  noteContent.value = "";

  // Desmarca os checkboxes e fecha o popup
  selecionadas.forEach(cb => cb.checked = false);
  labelPopup.classList.add("hidden");
})