let todos = JSON.parse(localStorage.getItem('todos')) || [];

let currentEditingId = null;

function toggleTheme() {
    const html = document.documentElement;
    const isDark = html.getAttribute('data-theme') === 'dark';
    html.setAttribute('data-theme', isDark ? 'light' : 'dark');
    const themeToggle = document.querySelector('.theme-toggle');
    themeToggle.textContent = isDark ? '🌙' : '☀️';
}

function handleNewTodo(event) {
    if (event.key === 'Enter' && event.target.value.trim()) {
        const newTodo = {
            id: Date.now(),
            title: event.target.value.trim(),
            person: '',
            description: '',
            status: 'todo',
            date: new Date().toLocaleDateString()
        };

        todos.push(newTodo);
        saveTodos();
        renderTodos();
        event.target.value = '';
    }
}

function handleDragStart(event) {
    event.dataTransfer.setData('text/plain', event.target.dataset.id);
    event.target.classList.add('dragging');
}

function handleDragEnd(event) {
    event.target.classList.remove('dragging');
}

function handleDragOver(event) {
    event.preventDefault();
    event.currentTarget.classList.add('drag-over');
}

function handleDragLeave(event) {
    event.currentTarget.classList.remove('drag-over');
}

function handleDrop(event, status) {
    event.preventDefault();
    const id = parseInt(event.dataTransfer.getData('text/plain'));
    const todo = todos.find(t => t.id === id);
    if (todo) {
        todo.status = status;
        saveTodos();
        renderTodos();
    }
    event.currentTarget.classList.remove('drag-over');
}

function deleteTodo(id) {
    todos = todos.filter(todo => todo.id !== id);
    saveTodos();
    renderTodos();
}

function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

function renderTodos() {
    const lists = {
        todo: document.getElementById('todoList'),
        making: document.getElementById('makingList'),
        completed: document.getElementById('completedList')
    };

    Object.values(lists).forEach(list => list.innerHTML = '');

    todos.forEach(todo => {
        const todoElement = `
            <li class="todo-item" 
                draggable="true" 
                data-id="${todo.id}"
                ondragstart="handleDragStart(event)"
                ondragend="handleDragEnd(event)">
                <div class="todo-item-header">
                    <div>
                        <span>${todo.title}</span>
                        ${todo.person ? `<div class="todo-person">👤 ${todo.person}</div>` : ''}
                    </div>
                    <div class="todo-actions">
                        <button onclick="openEditModal(${todo.id})">✏️</button>
                        <button onclick="deleteTodo(${todo.id})">🗑️</button>
                    </div>
                </div>
                ${todo.description ? `
                    <div class="todo-item-body">
                        <div class="todo-description">${todo.description}</div>
                    </div>
                ` : ''}
                <small style="display: block; font-size: 0.8rem; color: var(--accent);">
                    ${todo.date}
                </small>
            </li>
        `;
        lists[todo.status].innerHTML += todoElement;
    });
}

function openEditModal(id) {
    const todo = todos.find(t => t.id === id);
    if (todo) {
        currentEditingId = id;
        document.getElementById('editTitle').value = todo.title;
        document.getElementById('editPerson').value = todo.person || '';
        document.getElementById('editDescription').value = todo.description || '';

        const modal = document.getElementById('editModal');
        modal.classList.add('active');
    }
}

function closeModal() {
    const modal = document.getElementById('editModal');
    modal.classList.remove('active');
    currentEditingId = null;
}

function saveEdit() {
    if (currentEditingId) {
        const todo = todos.find(t => t.id === currentEditingId);
        if (todo) {
            todo.title = document.getElementById('editTitle').value.trim();
            todo.person = document.getElementById('editPerson').value.trim();
            todo.description = document.getElementById('editDescription').value.trim();

            saveTodos();
            renderTodos();
            closeModal();
        }
    }
}

// Inicialização
renderTodos();

// Verificar preferência de tema do sistema
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.documentElement.setAttribute('data-theme', 'dark');
    document.querySelector('.theme-toggle').textContent = '☀️';
}

// Fechar modal quando clicar fora dele
window.onclick = function (event) {
    const modal = document.getElementById('editModal');
    if (event.target === modal) {
        closeModal();
    }
}