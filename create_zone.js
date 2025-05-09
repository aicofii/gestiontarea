document.addEventListener('DOMContentLoaded', () => {
    const taskListBtn = document.getElementById('taskListBtn');
    const createTaskBtn = document.getElementById('createTaskBtn');
    const manageTaskBtn = document.getElementById('manageTaskBtn');
    const createZoneBtn = document.getElementById('createZoneBtn');
    const taskSummaryBtn = document.getElementById('taskSummaryBtn');
    const employeeBtn = document.getElementById('employeeBtn');
    const createZoneButton = document.getElementById('createZoneButton');
    const zoneList = document.getElementById('zoneList');
    const zoneModal = document.getElementById('zoneModal');
    const closeZoneModal = document.getElementById('closeZoneModal');
    const zoneForm = document.getElementById('zoneForm');

    // Load zones from localStorage
    let zones = JSON.parse(localStorage.getItem('zones')) || [];

    // Update localStorage
    const updateZoneStorage = () => {
        localStorage.setItem('zones', JSON.stringify(zones));
    };

    // Function to render the zone list
    const renderZoneList = () => {
        zoneList.innerHTML = '';
        zones.forEach((zone, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${zone.title}</td>
                <td>${zone.desc || 'Sin descripción'}</td>
                <td>
                    <button class="edit-btn" data-index="${index}">Editar</button>
                    <button class="delete-btn" data-index="${index}">Eliminar</button>
                </td>
            `;
            zoneList.appendChild(row);
        });
    };

    // Handle create zone button
    createZoneButton.addEventListener('click', () => {
        zoneModal.classList.remove('hidden');
        document.getElementById('zoneTitle').focus();
        zoneForm.dataset.editIndex = ''; // Clear edit index for new zone
    });

    // Handle modal close
    closeZoneModal.addEventListener('click', () => {
        zoneModal.classList.add('hidden');
        zoneForm.reset();
    });

    // Close modal on click outside
    zoneModal.addEventListener('click', (e) => {
        if (e.target === zoneModal) {
            zoneModal.classList.add('hidden');
            zoneForm.reset();
        }
    });

    // Handle zone form submission
    zoneForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = document.getElementById('zoneTitle').value;
        const desc = document.getElementById('zoneDesc').value;
        const editIndex = zoneForm.dataset.editIndex;

        if (editIndex) {
            // Update existing zone
            zones[editIndex] = { title, desc };
        } else {
            // Add new zone
            zones.push({ title, desc });
        }

        updateZoneStorage();
        renderZoneList();

        // Close modal and reset form
        zoneModal.classList.add('hidden');
        zoneForm.reset();
        zoneForm.dataset.editIndex = '';
    });

    // Handle edit and delete buttons
    zoneList.addEventListener('click', (e) => {
        const index = e.target.getAttribute('data-index');
        if (e.target.classList.contains('edit-btn')) {
            const zone = zones[index];
            document.getElementById('zoneTitle').value = zone.title;
            document.getElementById('zoneDesc').value = zone.desc || '';
            zoneModal.classList.remove('hidden');
            zoneForm.dataset.editIndex = index;
            document.getElementById('zoneTitle').focus();
        } else if (e.target.classList.contains('delete-btn')) {
            zones.splice(index, 1);
            updateZoneStorage();
            renderZoneList();
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
    renderZoneList();
});