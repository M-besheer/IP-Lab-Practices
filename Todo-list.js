
class Task {
    constructor(description) {
        this.description = description;
        this.isCompleted = false; // Tasks start as not done
        this.id = Date.now(); // Useful for finding the task later
        this.createdAt = new Date(); // Timestamp for when the task was created
    }
}

class TodoModel {
    constructor() {
        this.tasks = JSON.parse(localStorage.getItem('todos')) || []; 
    }
    _commit(tasks) {
        localStorage.setItem('todos', JSON.stringify(tasks));
    }
    addTask(description) {
        const newTask = new Task(description);
        this.tasks.push(newTask);
        // Save the updated list!
        this._commit(this.tasks); 
    }
    deleteTask(id) { 
        this.tasks = this.tasks.filter(task => task.id !== id);
        this._commit(this.tasks); 
    }
    editTask(id, newDescription) {
        const task = this.tasks.find(task => task.id === id);
        if (task) {
            task.description = newDescription;
            this._commit(this.tasks); 
        }
    }
    toggleTask(id) {
        const task = this.tasks.find(task => task.id === id);
        if (task) {
            task.isCompleted = !task.isCompleted;
            this._commit(this.tasks); 
        }
    }
    toggleAll() {
        this.tasks.forEach(task => {task.isCompleted = !task.isCompleted; });
        this._commit(this.tasks); 
    }
    deleteAll() {
        this.tasks = []; // Clear the array of tasks
        this._commit(this.tasks); 
    }
}

class TodoView {
    constructor() {
        // Grab our main elements
        this.todoList = document.getElementById('todoList');
        this.input = document.getElementById('todoInput');
        this.addBtn = document.querySelector('.input-group button');

        this.deleteAll = document.getElementById('deleteAllBtn');
        this.toggleAll = document.getElementById('toggleAllBtn');
        this.filterCompleted = document.getElementById('filterCompletedBtn');
        this.filterIncomplete = document.getElementById('filterIncompleteBtn');
        this.filterAll = document.getElementById('filterAllBtn');

        this.modal = document.getElementById('editModal');
        this.editInput = document.getElementById('editInput');
        this.saveEditBtn = document.getElementById('saveEditBtn');
        this.cancelEditBtn = document.getElementById('cancelEditBtn');


        
        // A temporary memory slot for the ID being edited
        this.currentEditId = null;
    }

    // 1. The Draw Function: It just takes an array and draws it.
    displayTasks(tasks) {
        this.todoList.innerHTML = ''; // Clear the board
        tasks.sort((a, b) => a.description.localeCompare(b.description));
        tasks.forEach(task => {
            const li = document.createElement('li');
            li.id = task.id; // Attach the ID directly to the HTML element
            li.className = task.isCompleted ? 'completed' : '';
            
            li.innerHTML = `
                <div class="task-content">
                    <input type="checkbox" ${task.isCompleted ? 'checked' : ''}>
                    <span>${task.description}</span>
                </div>
                <div class="task-buttons">
                    <button class="delete-btn">Delete</button>
                    <button class="Edit-btn">Edit</button>
                </div>
            `;
            
            this.todoList.appendChild(li);
        });
    }

    // 2. The Binders: These listen for UI actions and pass them to the Controller
    bindAddTask(handler) {
        // Listen for the Add button click
        this.addBtn.addEventListener('click', () => {
            if (this.input.value.trim()) {
                handler(this.input.value.trim());
                this.input.value = ''; // Clear the input field
            }
        });

        // Listen for the Enter key
        this.input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && this.input.value.trim()) {
                handler(this.input.value.trim());
                this.input.value = '';
            }
        });
    }
    bindDeleteTask(handler) {
        this.todoList.addEventListener('click', event => {
            // TRAFFIC COP: Did they click the delete button?
            if (event.target.className === 'delete-btn') {
                // Grab the ID from the parent <li> and send it to the Controller
                const id = parseInt(event.target.closest('li').id);
                handler(id);
            }
        });
    }

    bindEditTask(handler) {
        this.todoList.addEventListener('click', event => {
            if (event.target.className === 'Edit-btn') {
                const li = event.target.closest('li');
                this.currentEditId = parseInt(li.id); // Remember the ID!

                // Put the old text in the input box and show the modal
                this.editInput.value = li.querySelector('.task-content span').textContent;
                this.modal.classList.remove('hidden');
                
                if (newText && newText.trim()) {
                    handler(this.currentEditId, newText.trim());
                }
            }
        });

        // 2. Listen for the Save button click inside the modal
    this.saveEditBtn.addEventListener('click', () => {
        if (this.editInput.value.trim() && this.currentEditId !== null) {
            // Use the walkie-talkie! Send the ID and new text to the Controller
            handler(this.currentEditId, this.editInput.value.trim());
            
            // Clean up: hide modal and clear the memory slot
            this.modal.classList.add('hidden');
            this.currentEditId = null;
        }
    });

    // 3. Listen for the Cancel button
    this.cancelEditBtn.addEventListener('click', () => {
        this.modal.classList.add('hidden');
        this.currentEditId = null;
    });
    }

    bindToggleTask(handler) {
        this.todoList.addEventListener('click', event => {
            // THE SHIELD: If they clicked the delete button, DO NOTHING.
            // Let the bindDeleteTask function handle it!
            // THE SHIELD: Now protects BOTH buttons from accidental toggles
            if (event.target.classList.contains('delete-btn') || 
                event.target.classList.contains('Edit-btn')) {
                return; 
            }

            // Otherwise, find the <li> that holds whatever they clicked (text, blank space, etc.)
            const li = event.target.closest('li');
            
            // If they actually clicked inside a task row...
            if (li) {
                const id = parseInt(li.id);
                handler(id); // Send the ID to the Controller to toggle the state
            }
        });
    }

    bindToggleAll(handler) {
        this.toggleAll.addEventListener('click', () => {
            handler(); // No ID needed, just toggle all!
        });
    }

    bindDeleteAll(handler) {
        this.deleteAll.addEventListener('click', () => {
            handler(); // No ID needed, just delete all!
        });
    }

    bindFilterCompleted(handler) {
        this.filterCompleted.addEventListener('click', () => {
            handler('completed'); // Tell the Controller to filter completed tasks
        });
    }

    bindFilterIncomplete(handler) {
        this.filterIncomplete.addEventListener('click', () => {
            handler('incomplete'); // Tell the Controller to filter incomplete tasks
        });
    }

    bindFilterAll(handler) {
        this.filterAll.addEventListener('click', () => {
            handler('all'); // Tell the Controller to show all tasks
        });
    }


}

class TodoController {
    constructor(model, view) {
        this.model = model;
        this.view = view;

        // 1. Display any initial tasks on load
        this.view.displayTasks(this.model.tasks);

        // 2. Bind the View's listeners to the Controller's functions
        this.view.bindAddTask(this.handleAddAction);
        this.view.bindDeleteTask(this.handleDeleteAction);
        this.view.bindEditTask(this.handleEditAction);
        this.view.bindToggleTask(this.handleToggleAction);
        this.view.bindToggleAll(this.handleToggleAllAction);
        this.view.bindDeleteAll(this.handleDeleteAllAction);
        this.view.bindFilterCompleted(this.handleFilterCompletedAction);
        this.view.bindFilterIncomplete(this.handleFilterIncompleteAction);
        this.view.bindFilterAll(this.handleFilterAllAction);

    }

    // --- The Handlers ---
    // We use arrow functions so 'this' always refers to the Controller

    handleAddAction = (taskText) => {
        this.model.addTask(taskText); // Tell the Model to save it
        this.view.displayTasks(this.model.tasks); // Tell the View to redraw
    };

    handleDeleteAction = (id) => {
        this.model.deleteTask(id); // Tell the Model to delete it
        this.view.displayTasks(this.model.tasks); // Tell the View to redraw
    };
    handleEditAction = (id, newText) => {
        this.model.editTask(id, newText); // Tell the Model to edit it
        this.view.displayTasks(this.model.tasks); // Tell the View to redraw
    }

    handleToggleAction = (id) => {
        this.model.toggleTask(id); // Tell the Model to flip the status
        this.view.displayTasks(this.model.tasks); // Tell the View to redraw
    };

    handleToggleAllAction = () => {
        this.model.toggleAll(); // Tell the Model to flip all statuses
        this.view.displayTasks(this.model.tasks); // Redraw the View
    }

    handleDeleteAllAction = () => {
        this.model.deleteAll(); // Tell the Model to clear all tasks
        this.view.displayTasks(this.model.tasks); // Redraw the View
    }

    handleFilterCompletedAction = () => {
        const completedTasks = this.model.tasks.filter(task => task.isCompleted);
        this.view.displayTasks(completedTasks); // Show only completed tasks
    }

    handleFilterIncompleteAction = () => {
        const incompleteTasks = this.model.tasks.filter(task => !task.isCompleted);
        this.view.displayTasks(incompleteTasks); // Show only incomplete tasks
    }

    handleFilterAllAction = () => {
        this.view.displayTasks(this.model.tasks); // Show all tasks
    }
}

// Initialize the app!
const app = new TodoController(new TodoModel(), new TodoView());