document.addEventListener('DOMContentLoaded', () => {
    const taskListBtn = document.getElementById('taskListBtn');
    const createTaskBtn = document.getElementById('createTaskBtn');
    const manageTaskBtn = document.getElementById('manageTaskBtn');
    const createZoneBtn = document.getElementById('createZoneBtn');
    const taskSummaryBtn = document.getElementById('taskSummaryBtn');
    const employeeBtn = document.getElementById('employeeBtn');
    const createTaskButton = document.getElementById('createTaskButton');
    const taskList = document.getElementById('taskList');
    const taskModal = document.getElementById('taskModal');
    const closeModal = document.getElementById('closeModal');
    const taskForm = document.getElementById('taskForm');

    // Load tasks from localStorage
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    // Update localStorage
    const updateTaskStorage = () => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    };

    // Function to render the task list
    const renderTaskList = () => {
        taskList.innerHTML = '';
        tasks.forEach((task, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${task.title}</td>
                <td>${task.desc || 'Sin descripción'}</td>
                <td>
                    <button class="edit-btn" data-index="${index}">Editar</button>
                    <button class="delete-btn" data-index="${index}">Eliminar</button>
                </td>
            `;
            taskList.appendChild(row);
        });
    };

    // Handle create task button
    createTaskButton.addEventListener('click', () => {
        taskModal.classList.remove('hidden');
        document.getElementById('taskTitle').focus();
        taskForm.dataset.editIndex = ''; // Clear edit index for new task
    });

    // Handle modal close
    closeModal.addEventListener('click', () => {
        taskModal.classList.add('hidden');
        taskForm.reset();
    });

    // Close modal on click outside
    taskModal.addEventListener('click', (e) => {
        if (e.target === taskModal) {
            taskModal.classList.add('hidden');
            taskForm.reset();
        }
    });

    // Handle task form submission
    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = document.getElementById('taskTitle').value;
        const desc = document.getElementById('taskDesc').value;
        const editIndex = taskForm.dataset.editIndex;

        if (editIndex) {
            // Update existing task
            tasks[editIndex] = { title, desc };
        } else {
            // Add new task
            tasks.push({ title, desc });
        }

        updateTaskStorage();
        renderTaskList();

        // Close modal and reset form
        taskModal.classList.add('hidden');
        taskForm.reset();
        taskForm.dataset.editIndex = '';
    });

    // Handle edit and delete buttons
    taskList.addEventListener('click', (e) => {
        const index = e.target.getAttribute('data-index');
        if (e.target.classList.contains('edit-btn')) {
            const task = tasks[index];
            document.getElementById('taskTitle').value = task.title;
            document.getElementById('taskDesc').value = task.desc || '';
            taskModal.classList.remove('hidden');
            taskForm.dataset.editIndex = index;
            document.getElementById('taskTitle').focus();
        } else if (e.target.classList.contains('delete-btn')) {
            tasks.splice(index, 1);
            updateTaskStorage();
            renderTaskList();
        }
    });

    // Sidebar navigation
    taskListBtn.addEventListener('click', () => {
        window.location.href = 'index.html';
    });

    createTaskBtn.addEventListener('click', () => {
        window.location.href = 'CreateTask.html';
    });

    createZoneBtn.addEventListener('click', () => {
        window.location.href = 'CreateZone.html';
    });

    manageTaskBtn.addEventListener('click', () => {
        window.location.href = 'TareaList.html';
    });

    taskSummaryBtn.addEventListener('click', () => {
        window.location.href = 'resumen.html';
    });

    employeeBtn.addEventListener('click', () => {
        window.location.href = 'employee.html';
    });

    // Render the list on load
    renderTaskList();
});