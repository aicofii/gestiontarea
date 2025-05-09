document.addEventListener('DOMContentLoaded', () => {
    const taskListBtn = document.getElementById('taskListBtn');
    const createTaskBtn = document.getElementById('createTaskBtn');
    const manageTaskBtn = document.getElementById('manageTaskBtn');
    const createZoneBtn = document.getElementById('createZoneBtn');
    const taskSummaryBtn = document.getElementById('taskSummaryBtn');
    const employeeBtn = document.getElementById('employeeBtn');
    const summaryList = document.getElementById('summaryList');
    const filterBtn = document.getElementById('filterBtn');
    const filterPanel = document.getElementById('filterPanel');
    const closeFilterPanel = document.getElementById('closeFilterPanel');
    const filterForm = document.getElementById('filterForm');
    const employeeFilter = document.getElementById('employeeFilter');
    const dateFilter = document.getElementById('dateFilter');

    // Load data from localStorage
    const taskManagementRecords = JSON.parse(localStorage.getItem('taskManagementRecords')) || [];
    const completedPhotos = JSON.parse(localStorage.getItem('completedPhotos')) || {};
    const employees = JSON.parse(localStorage.getItem('employees')) || [];
    const today = new Date().toISOString().split('T')[0];

    // Populate employee filter dropdown
    const populateEmployeeFilter = () => {
        employeeFilter.innerHTML = '<option value="">-- Todos los empleados --</option>';
        employees.forEach(employee => {
            const option = document.createElement('option');
            option.value = `${employee.name} ${employee.surname}`;
            option.textContent = `${employee.name} ${employee.surname}`;
            employeeFilter.appendChild(option);
        });
    };

    // Function to calculate completion percentage for a specific employee and date
    const calculateCompletion = (record, taskIndex, employee, date) => {
        const photos = record.photos || [];
        let completedCount = 0;
        photos.forEach((photo, photoIndex) => {
            const photoKey = `${record.task}_${taskIndex}_${photoIndex}_${employee}_${date}`;
            if (completedPhotos[photoKey]) {
                completedCount++;
            }
        });
        return photos.length > 0 ? Math.round((completedCount / photos.length) * 100) : 0;
    };

    // Render the summary list
    const renderSummary = (employeeFilterValue = '', dateFilterValue = '') => {
        summaryList.innerHTML = '';
        taskManagementRecords.forEach((record, index) => {
            employees.forEach(employee => {
                const employeeName = `${employee.name} ${employee.surname}`;
                // Apply filters
                if (employeeFilterValue && employeeName !== employeeFilterValue) return;
                const date = dateFilterValue || today;
                if (dateFilterValue && date !== dateFilterValue) return;

                const completion = calculateCompletion(record, index, employeeName, date);
                // Calculate points: use record.points if available, otherwise completion / 10 with one decimal place
                const points = record.points !== undefined ? record.points : (completion / 10).toFixed(1);

                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${date}</td>
                    <td>${employeeName}</td>
                    <td>${record.task}</td>
                    <td>${record.zone || 'Sin zona'}</td>
                    <td>${completion}%</td>
                    <td>${points}</td> <!-- New Points column -->
                    <td>
                        <button class="view-btn" data-task="${encodeURIComponent(record.task)}" data-record="${index}">Ver</button>
                    </td>
                `;
                summaryList.appendChild(row);
            });
        });
    };

    // Handle filter panel toggle
    filterBtn.addEventListener('click', () => {
        filterPanel.classList.toggle('active');
    });

    closeFilterPanel.addEventListener('click', () => {
        filterPanel.classList.remove('active');
    });

    // Handle filter form submission
    filterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const employeeFilterValue = employeeFilter.value;
        const dateFilterValue = dateFilter.value;
        renderSummary(employeeFilterValue, dateFilterValue);
        filterPanel.classList.remove('active');
    });

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

    // Initialize
    populateEmployeeFilter();
    renderSummary();
});