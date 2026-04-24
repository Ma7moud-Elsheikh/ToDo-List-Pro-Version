// ======================
// STATE
// ======================
let state = {
    todos: [],
    editingId: null
};

if (localStorage.getItem('myTasks')) {
    state.todos = JSON.parse(localStorage.getItem('myTasks'));
}

// ======================
// ELEMENTS
// ======================
const todo_list = document.querySelector('#todo_list');
const todo_input = document.querySelector('#todo_input');
const todo_add = document.querySelector('#todo_add');
const todo_update = document.querySelector('#todo_update');

// ======================
// INIT
// ======================
renderTodos();

// ======================
// ADD TODO
// ======================
function addTodo() {
    let value = todo_input.value.trim();

    if (!value) {
        toast('Enter a ToDo', 'warning');
        return;
    }

    let exists = state.todos.some((todo) => todo.name.toLowerCase() === value.toLowerCase());

    if (exists) {
        toast('Task already exists', 'info');
        return;
    }

    let newTodo = {
        id: Date.now(),
        name: value,
        completed: false
    };

    state.todos.push(newTodo);

    todo_input.value = '';
    localStorage.setItem('myTasks', JSON.stringify(state.todos));
    renderTodos();

    toast('Task added successfully', 'success');
}

// ======================
// RENDER
// ======================
function renderTodos() {
    let html = '';

    state.todos.forEach((todo) => {
        html += `
        <li class="todo-item d-flex align-items-center justify-content-between">

            <span class="todo_item ${todo.completed ? 'completed' : ''}">
                ${todo.name}
            </span>

            <div class="actions">
                <button class="btn-action complete" data-id="${todo.id}">
                    <i class="fa-regular fa-circle-check"></i>
                </button>

                <button class="btn-action edit" data-id="${todo.id}">
                    <i class="fa-solid fa-pen-to-square"></i>
                </button>

                <button class="btn-action delete" data-id="${todo.id}">
                    <i class="fa-solid fa-trash-can"></i>
                </button>
            </div>
        </li>
        `;
    });

    todo_list.innerHTML = html || `<li class="text-center">No ToDos Added</li>`;
}

// ======================
// EVENT DELEGATION
// ======================
todo_list.addEventListener('click', function (e) {
    const button = e.target.closest('.btn-action');
    if (!button) return;

    const id = Number(button.dataset.id);

    if (button.classList.contains('delete')) {
        deleteTodo(id);
    }

    if (button.classList.contains('edit')) {
        startEdit(id);
    }

    if (button.classList.contains('complete')) {
        toggleComplete(id);
    }
});

// ======================
// TOGGLE COMPLETE
// ======================
function toggleComplete(id) {
    state.todos = state.todos.map((todo) => {
        if (todo.id === id) {
            return { ...todo, completed: !todo.completed };
        }
        return todo;
    });

    localStorage.setItem('myTasks', JSON.stringify(state.todos));
    renderTodos();
}

// ======================
// EDIT
// ======================
function startEdit(id) {
    const todo = state.todos.find((t) => t.id === id);

    if (!todo) return;

    todo_input.value = todo.name;
    state.editingId = id;

    todo_add.classList.add('d-none');
    todo_update.classList.remove('d-none');
}

// ======================
// UPDATE
// ======================
function updateTodo() {
    let value = todo_input.value.trim();

    if (!value) {
        toast('Enter a value', 'warning');
        return;
    }

    state.todos = state.todos.map((todo) => {
        if (todo.id === state.editingId) {
            return { ...todo, name: value };
        }
        return todo;
    });

    state.editingId = null;

    todo_input.value = '';
    todo_add.classList.remove('d-none');
    todo_update.classList.add('d-none');

    localStorage.setItem('myTasks', JSON.stringify(state.todos));
    renderTodos();

    toast('Task updated successfully', 'success');
}

// ======================
// DELETE
// ======================
let pendingDeleteId = null;
function deleteTodo(id) {
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to undo this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'Cancel',
        background: '#111827',
        color: '#e5e7eb',
        borderRadius: '12px',
        showClass: {
            popup: 'animate__animated animate__zoomIn'
        },
        hideClass: {
            popup: 'animate__animated animate__zoomOut'
        }
    }).then((result) => {
        if (result.isConfirmed) {
            state.todos = state.todos.filter((todo) => todo.id !== id);

            localStorage.setItem('myTasks', JSON.stringify(state.todos));

            renderTodos();

            Swal.fire({
                title: 'Deleted!',
                text: 'Task has been removed.',
                icon: 'success',
                timer: 1500,
                showConfirmButton: false,
                background: '#111827',
                color: '#e5e7eb'
            });
        }
    });
}

// ======================
// TOAST
// ======================
function toast(text, type = 'default') {
    const colors = {
        success: 'linear-gradient(135deg, #22c55e, #16a34a)',
        error: 'linear-gradient(135deg, #ef4444, #dc2626)',
        info: 'linear-gradient(135deg, #3b82f6, #2563eb)',
        warning: 'linear-gradient(135deg, #f59e0b, #d97706)'
    };

    Toastify({
        text,
        duration: 2000,
        gravity: 'top',
        position: 'center',
        style: {
            background: colors[type] || '#333',
            borderRadius: '12px',
            padding: '12px 20px'
        }
    }).showToast();
}

// ======================
// EVENTS
// ======================
todo_add.addEventListener('click', addTodo);
todo_update.addEventListener('click', updateTodo);

todo_input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        if (state.editingId) {
            updateTodo();
        } else {
            addTodo();
        }
    }
});
