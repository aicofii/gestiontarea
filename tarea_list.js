document.addEventListener('DOMContentLoaded', () => {
    const taskListBtn = document.getElementById('taskListBtn');
    const createTaskBtn = document.getElementById('createTaskBtn');
    const manageTaskBtn = document.getElementById('manageTaskBtn');
    const createZoneBtn = document.getElementById('createZoneBtn');
    const taskSummaryBtn = document.getElementById('taskSummaryBtn');
    const employeeBtn = document.getElementById('employeeBtn');
    const createTaskButton = document.getElementById('createTaskButton');
    const taskZoneList = document.getElementById('taskZoneList');

    // Load tasks, zones, and records from localStorage
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let zones = JSON.parse(localStorage.getItem('zones')) || [];
    let taskManagementRecords = JSON.parse(localStorage.getItem('taskManagementRecords')) || [];

    // Update localStorage
    const updateTaskStorage = () => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    };

    const updateZoneStorage = () => {
        localStorage.setItem('zones', JSON.stringify(zones));
    };

    const updateRecordsStorage = () => {
        localStorage.setItem('taskManagementRecords', JSON.stringify(taskManagementRecords));
    };

    // Function to render the list
    const renderList = () => {
        taskZoneList.innerHTML = '';

        // Render task records
        taskManagementRecords.forEach((record, index) => {
            const task = tasks.find(t => t.title === record.task);
            const zoneTitle = record.zone || 'Sin zona';
            const description = task ? task.desc || 'Sin descripción' : record.requirements || 'Sin descripción';

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>Tarea</td>
                <td><a href="task_details.html?task=${encodeURIComponent(record.task)}&record=${index}">${record.task}</a></td>
                <td>${zoneTitle}</td>
                <td>${description}</td>
                <td>
                    <button class="edit-btn" data-type="record" data-index="${index}">Editar</button>
                    <button class="delete-btn" data-type="record" data-index="${index}">Eliminar</button>
                </td>
            `;
            taskZoneList.appendChild(row);
        });
    };

    // Handle deletion
    taskZoneList.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-btn')) {
            const type = e.target.getAttribute('data-type');
            const index = e.target.getAttribute('data-index');
            if (type === 'record') {
                taskManagementRecords.splice(index, 1);
                updateRecordsStorage();
            }
            renderList();
        }
    });

    // Handle editing (redirect to task_management.html with record index)
    taskZoneList.addEventListener('click', (e) => {
        if (e.target.classList.contains('edit-btn')) {
            const type = e.target.getAttribute('data-type');
            const index = e.target.getAttribute('data-index');
            window.location.href = `task_management.html?type=${type}&index=${index}`;
        }
    });

    // Navigation
    taskListBtn.addEventListener('click', () => {
        window.location.href = 'index.html';
    });

    createTaskBtn.addEventListener('click', () => {
        window.location.href = 'index.html';
    });

    createZoneBtn.addEventListener('click', () => {
        window.location.href = 'index.html';
    });

    createTaskButton.addEventListener('click', () => {
        window.location.href = 'task_management.html';
    });

    taskSummaryBtn.addEventListener('click', () => {
        window.location.href = 'resumen.html';
    });

    employeeBtn.addEventListener('click', () => {
        window.location.href = 'employee.html';
    });

    // Render the list on load
    renderList();
});