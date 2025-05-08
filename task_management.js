document.addEventListener('DOMContentLoaded', () => {
    const taskListBtn = document.getElementById('taskListBtn');
    const createTaskBtn = document.getElementById('createTaskBtn');
    const manageTaskBtn = document.getElementById('manageTaskBtn');
    const createZoneBtn = document.getElementById('createZoneBtn');
    const taskSummaryBtn = document.getElementById('taskSummaryBtn');
    const taskSelect = document.getElementById('taskSelect');
    const zoneSelect = document.getElementById('zoneSelect');
    const sortOrder = document.getElementById('sortOrder');
    const requirements = document.getElementById('requirements');
    const photoInput = document.getElementById('photoInput');
    const photoPreview = document.getElementById('photoPreview');
    const managementForm = document.getElementById('managementForm');
    const saveButton = document.getElementById('saveButton');

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

    // Populate task dropdown
    tasks.forEach(task => {
        const option = document.createElement('option');
        option.value = task.title;
        option.textContent = task.title;
        taskSelect.appendChild(option);
    });

    // Populate zone dropdown
    zones.forEach(zone => {
        const option = document.createElement('option');
        option.value = zone.title;
        option.textContent = zone.title;
        zoneSelect.appendChild(option);
    });

    // Populate sort order dropdown
    for (let i = 1; i <= 10; i++) { // Allow up to 10 for flexibility
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        sortOrder.appendChild(option);
    }

    // Function to render photos in preview
    const renderPhotos = (photos) => {
        photoPreview.innerHTML = '';
        photos.forEach((photo, index) => {
            const photoItem = document.createElement('div');
            photoItem.classList.add('photo-item');
            photoItem.innerHTML = `
                <div class="photo-wrapper">
                    <img src="${photo.src}" alt="Uploaded photo">
                    <button class="delete-photo-btn" data-index="${index}">×</button>
                </div>
                <textarea placeholder="Descripción de la foto">${photo.description || ''}</textarea>
            `;
            photoPreview.appendChild(photoItem);
        });
        validateForm(); // Revalidate form after rendering photos
    };

    // Handle new photo uploads
    let existingPhotos = [];
    photoInput.addEventListener('change', () => {
        Array.from(photoInput.files).forEach(file => {
            const reader = new FileReader();
            reader.onload = (e) => {
                existingPhotos.push({ src: e.target.result, description: '' });
                renderPhotos(existingPhotos);
            };
            reader.readAsDataURL(file);
        });
        photoInput.value = ''; // Clear input to allow re-uploading same photos
    });

    // Handle photo deletion
    photoPreview.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-photo-btn')) {
            const index = e.target.getAttribute('data-index');
            existingPhotos.splice(index, 1);
            renderPhotos(existingPhotos);
        }
    });

    // Validate form and enable/disable save button
    const validateForm = () => {
        const isValid = taskSelect.value && zoneSelect.value && sortOrder.value;
        saveButton.disabled = !isValid;
    };

    taskSelect.addEventListener('change', validateForm);
    zoneSelect.addEventListener('change', validateForm);
    sortOrder.addEventListener('change', validateForm);

    // Handle editing from TareaList.html
    const urlParams = new URLSearchParams(window.location.search);
    const type = urlParams.get('type');
    const index = urlParams.get('index');
    if (type === 'record' && index) {
        const record = taskManagementRecords[index];
        taskSelect.value = record.task;
        zoneSelect.value = record.zone || '';
        sortOrder.value = record.sortOrder || '';
        requirements.value = record.requirements || '';
        existingPhotos = record.photos ? [...record.photos] : [];
        renderPhotos(existingPhotos);
    }

    // Validate form on page load
    validateForm();

    // Handle form submission
    managementForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Update photo descriptions
        const photoItems = photoPreview.querySelectorAll('.photo-item');
        existingPhotos.forEach((photo, i) => {
            photo.description = photoItems[i].querySelector('textarea').value;
        });

        const record = {
            task: taskSelect.value,
            zone: zoneSelect.value,
            sortOrder: parseInt(sortOrder.value),
            requirements: requirements.value,
            photos: existingPhotos
        };

        // If editing, update existing record
        if (type === 'record' && index) {
            taskManagementRecords[index] = record;
        } else {
            // New record
            taskManagementRecords.push(record);
            // Update task description if task exists
            const taskIndex = tasks.findIndex(t => t.title === record.task);
            if (taskIndex !== -1) {
                tasks[taskIndex].desc = record.requirements;
            }
        }

        updateTaskStorage();
        updateRecordsStorage();

        // Reset form
        managementForm.reset();
        photoPreview.innerHTML = '';
        existingPhotos = [];
        saveButton.disabled = true;

        // Redirect to TareaList.html
        window.location.href = 'TareaList.html';
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
});