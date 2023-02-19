const form = document.querySelector('form');
const input = document.querySelector('input[type="text"]');
const ul = document.querySelector('ul');

let items = loadItemsFromLocalStorage() || [];

// Call the updateList() function when the page is loaded
updateList();

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (text !== '') {
    // Check for duplicate tasks
    const existingItem = items.find((item) => item.text === text);
    if (existingItem) {
      alert('Така задача вже існує!');
      return;
    }

    const item = {
      id: Date.now(),
      text: text,
      done: false,
    };
    items.push(item);
    input.value = '';
    saveItemsToLocalStorage(items);
    updateList();
  }
});

function updateList() {
  ul.innerHTML = '';
  for (const item of items) {
    const li = document.createElement('li');
    li.innerHTML = `
      <span class="text${item.done ? ' done' : ''}">${item.text}</span>
      <div>
        <button type="button" data-id="${
          item.id
        }" class="edit">Редагувати</button>
        <button type="button" data-id="${
          item.id
        }" class="delete">Видалити</button>
        <button type="button" data-id="${item.id}" class="done">${
      item.done ? 'Виконано' : 'Не виконано'
    }</button>
      </div>
    `;
    ul.appendChild(li);
  }

  ul.addEventListener('click', (e) => {
    if (e.target.matches('button.edit')) {
      const id = parseInt(e.target.dataset.id);
      const item = items.find((item) => item.id === id);
      if (item) {
        const span = e.target.parentElement.previousElementSibling;
        const text = span.textContent;
        span.innerHTML = `
          <input type="text" class="edit" value="${text}">
          <button type="button" class="save" data-id="${id}">Зберегти</button>
        `;
      }
    } else if (e.target.matches('button.save')) {
      const id = parseInt(e.target.dataset.id);
      const item = items.find((item) => item.id === id);
      if (item) {
        const input = e.target.parentElement.querySelector('input.edit');
        const text = input.value.trim();
        if (text !== '') {
          item.text = text;
          saveItemsToLocalStorage(items);
          updateList();
        }
      }
    } else if (e.target.matches('button.delete')) {
      const id = parseInt(e.target.dataset.id);
      items = items.filter((item) => item.id !== id);
      saveItemsToLocalStorage(items);
      updateList();
    } else if (e.target.matches('button.done')) {
      const id = parseInt(e.target.dataset.id);
      const item = items.find((item) => item.id === id);
      if (item) {
        const doneButton = e.target;
        item.done = !item.done;

        // Adds a class to the Done!
        if (
          e.target.textContent === 'Не виконано' ||
          e.target.textContent === 'Виконано!'
        ) {
          e.target.classList.toggle('сompleted');
        }
        //
        doneButton.innerText = item.done ? 'Виконано!' : 'Не виконано';
        const text = doneButton.parentElement.previousElementSibling;
        text.classList.toggle('done', item.done);
        saveItemsToLocalStorage(items);
      }
    }
  });
}

function saveItemsToLocalStorage(items) {
  localStorage.setItem('todo-items', JSON.stringify(items));
}

function loadItemsFromLocalStorage() {
  return JSON.parse(localStorage.getItem('todo-items'));
}
