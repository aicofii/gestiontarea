document.addEventListener('DOMContentLoaded', () => {
    // Sidebar navigation
    const taskListBtn = document.getElementById('taskListBtn');
    const createTaskBtn = document.getElementById('createTaskBtn');
    const createZoneBtn = document.getElementById('createZoneBtn');
    const manageTaskBtn = document.getElementById('manageTaskBtn');
    const taskSummaryBtn = document.getElementById('taskSummaryBtn');
    const employeeBtn = document.getElementById('employeeBtn');

    taskListBtn.addEventListener('click', () => {
        window.location.href = 'TareaList.html';
    });
    createTaskBtn.addEventListener('click', () => {
        window.location.href = 'CreateTask.html';
    });
    createZoneBtn.addEventListener('click', () => {
        window.location.href = 'CreateZone.html';
    });
    manageTaskBtn.addEventListener('click', () => {
        window.location.href = 'task_management.html';
    });
    taskSummaryBtn.addEventListener('click', () => {
        window.location.href = 'resumen.html';
    });
    employeeBtn.addEventListener('click', () => {
        window.location.href = 'employee.html';
    });

    // Populate selects with saved data
    const taskSelect = document.getElementById('taskSelect');
    const zoneSelect = document.getElementById('zoneSelect');
    const sortOrderSelect = document.getElementById('sortOrder');

    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => {
        const opt = document.createElement('option');
        opt.value = task.title;
        opt.textContent = task.title;
        taskSelect.appendChild(opt);
    });

    const zones = JSON.parse(localStorage.getItem('zones')) || [];
    zones.forEach(zone => {
        const opt = document.createElement('option');
        opt.value = zone.title;
        opt.textContent = zone.title;
        zoneSelect.appendChild(opt);
    });

    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    orders.forEach(order => {
        const opt = document.createElement('option');
        opt.value = order.value || order.title || order;
        opt.textContent = order.label || order.title || order;
        sortOrderSelect.appendChild(opt);
    });

    // Handle form submission
    const managementForm = document.getElementById('managementForm');
    managementForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const selectedTask = taskSelect.value;
        const selectedZone = zoneSelect.value;
        const selectedOrder = sortOrderSelect.value;
        const requirements = document.getElementById('requirements').value;

        // Handle photos
        const photoInput = document.getElementById('photoInput');
        const photos = Array.from(photoInput.files).map(file => URL.createObjectURL(file));

        let records = JSON.parse(localStorage.getItem('taskManagementRecords')) || [];
        const urlParams = new URLSearchParams(window.location.search);
        const type = urlParams.get('type');
        const index = urlParams.get('index');
        const newRecord = { task: selectedTask, zone: selectedZone, order: selectedOrder, requirements, photos };

        if (type === 'record' && index !== null) {
            records[index] = newRecord;
        } else {
            records.push(newRecord);
        }

        localStorage.setItem('taskManagementRecords', JSON.stringify(records));
        window.location.href = 'TareaList.html';
    });

    // Photo preview
    const photoInput = document.getElementById('photoInput');
    const photoPreview = document.getElementById('photoPreview');
    photoInput.addEventListener('change', (e) => {
        photoPreview.innerHTML = '';
        Array.from(e.target.files).forEach(file => {
            const reader = new FileReader();
            reader.onload = (ev) => {
                const img = document.createElement('img');
                img.src = ev.target.result;
                img.style.width = '100px';
                img.style.margin = '5px';
                photoPreview.appendChild(img);
            };
            reader.readAsDataURL(file);
        });
    });
});
