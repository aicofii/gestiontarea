document.addEventListener('DOMContentLoaded', () => {
    const taskListBtn = document.getElementById('taskListBtn');
    const createTaskBtn = document.getElementById('createTaskBtn');
    const manageTaskBtn = document.getElementById('manageTaskBtn');
    const createZoneBtn = document.getElementById('createZoneBtn');
    const taskSummaryBtn = document.getElementById('taskSummaryBtn');
    const employeeBtn = document.getElementById('employeeBtn');
    const summaryList = document.getElementById('summaryList');

    // Load data from localStorage
    const taskManagementRecords = JSON.parse(localStorage.getItem('taskManagementRecords')) || [];
    const completedPhotos = JSON.parse(localStorage.getItem('completedPhotos')) || {};
    const selectedTurno = JSON.parse(localStorage.getItem('selectedTurno')) || '';
    const today = new Date().toISOString().split('T')[0];

    // Function to calculate completion percentage
    const calculateCompletion = (record, taskIndex) => {
        const photos = record.photos || [];
        let completedCount = 0;
        photos.forEach((photo, photoIndex) => {
            const photoKey = `${record.task}_${taskIndex}_${photoIndex}`;
            if (completedPhotos[photoKey]) {
                completedCount++;
            }
        });
        return photos.length > 0 ? Math.round((completedCount / photos.length) * 100) : 0;
    };

    // Render the summary list
    const renderSummary = () => {
        summaryList.innerHTML = '';
        taskManagementRecords.forEach((record, index) => {
            const completion = calculateCompletion(record, index);
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${today}</td>
                <td>${selectedTurno || 'Sin asignar'}</td>
                <td>${record.task}</td>
                <td>${record.zone || 'Sin zona'}</td>
                <td>${completion}%</td>
                <td>
                    <button class="view-btn" data-task="${encodeURIComponent(record.task)}" data-record="${index}">Ver</button>
                </td>
            `;
            summaryList.appendChild(row);
        });
    };

    // Handle view button click
    summaryList.addEventListener('click', (e) => {
        if (e.target.classList.contains('view-btn')) {
            const task = e.target.getAttribute('data-task');
            const record = e.target.getAttribute('data-record');
            window.location.href = `task_details.html?task=${task}&record=${record}`;
        }
    });

    // Sidebar navigation
    taskListBtn.addEventListener('click', () => {
        window.location.href = 'index.html';
    });

    createTaskBtn.addEventListener('click', () => {
        window.location.href = 'index.html';
    });

    manageTaskBtn.addEventListener('click', () => {
        window.location.href = 'TareaList.html';
    });

    createZoneBtn.addEventListener('click', () => {
        window.location.href = 'index.html';
    });

    taskSummaryBtn.addEventListener('click', () => {
        window.location.href = 'resumen.html';
    });

    employeeBtn.addEventListener('click', () => {
        window.location.href = 'employee.html';
    });

    // Render the list on load
    renderSummary();
});