document.addEventListener('DOMContentLoaded', () => {
    const taskListBtn = document.getElementById('taskListBtn');
    const createTaskBtn = document.getElementById('createTaskBtn');
    const manageTaskBtn = document.getElementById('manageTaskBtn');
    const createZoneBtn = document.getElementById('createZoneBtn');
    const taskSummaryBtn = document.getElementById('taskSummaryBtn');
    const taskModal = document.getElementById('taskModal');
    const zoneModal = document.getElementById('zoneModal');
    const closeModal = document.getElementById('closeModal');
    const closeZoneModal = document.getElementById('closeZoneModal');
    const taskForm = document.getElementById('taskForm');
    const zoneForm = document.getElementById('zoneForm');
    const taskContainer = document.getElementById('taskContainer');
    const turnoSelect = document.getElementById('turnoSelect');
    const taskDate = document.getElementById('taskDate');

    // Almacenar tareas, zonas y turno en localStorage
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let zones = JSON.parse(localStorage.getItem('zones')) || [];
    let selectedTurno = JSON.parse(localStorage.getItem('selectedTurno')) || '';

    // Actualizar localStorage
    const updateTaskStorage = () => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    };

    const updateZoneStorage = () => {
        localStorage.setItem('zones', JSON.stringify(zones));
    };

    const updateTurnoStorage = () => {
        localStorage.setItem('selectedTurno', JSON.stringify(turnoSelect.value));
    };

    // Inicializar fecha con la fecha actual
    const today = new Date().toISOString().split('T')[0];
    taskDate.value = today;

    // Inicializar turno con el valor almacenado
    if (selectedTurno) {
        turnoSelect.value = selectedTurno;
    }

    // Guardar turno cuando se selecciona
    turnoSelect.addEventListener('change', () => {
        updateTurnoStorage();
    });

    // Cambiar estado de los botones de la barra lateral
    const setActiveButton = (activeBtn) => {
        [taskListBtn, createTaskBtn, manageTaskBtn, createZoneBtn, taskSummaryBtn].forEach(btn => {
            btn.classList.remove('active');
        });
        activeBtn.classList.add('active');
    };

    taskListBtn.addEventListener('click', () => {
        setActiveButton(taskListBtn);
    });

    createTaskBtn.addEventListener('click', () => {
        setActiveButton(createTaskBtn);
        window.location.href = 'CreateTask.html';
    });

    manageTaskBtn.addEventListener('click', () => {
        setActiveButton(manageTaskBtn);
        window.location.href = 'TareaList.html';
    });

    createZoneBtn.addEventListener('click', () => {
        setActiveButton(createZoneBtn);
        window.location.href = 'CreateZone.html';
    });

    taskSummaryBtn.addEventListener('click', () => {
        setActiveButton(taskSummaryBtn);
        window.location.href = 'resumen.html';
    });

    // Cerrar modales
    closeModal.addEventListener('click', () => {
        taskModal.classList.add('hidden');
        taskForm.reset();
    });

    closeZoneModal.addEventListener('click', () => {
        zoneModal.classList.add('hidden');
        zoneForm.reset();
    });

    // Cerrar modales al hacer clic fuera del contenido
    taskModal.addEventListener('click', (e) => {
        if (e.target === taskModal) {
            taskModal.classList.add('hidden');
            taskForm.reset();
        }
    });

    zoneModal.addEventListener('click', (e) => {
        if (e.target === zoneModal) {
            zoneModal.classList.add('hidden');
            zoneForm.reset();
        }
    });

    // Enviar formulario de tarea
    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = document.getElementById('taskTitle').value;
        const desc = document.getElementById('taskDesc').value;

        // Añadir tarea al arreglo
        tasks.push({ title, desc });
        updateTaskStorage();

        // Crear tarjeta de tarea
        const taskCard = document.createElement('div');
        taskCard.classList.add('task-card');
        taskCard.innerHTML = `
            <h3>${title}</h3>
            <p>${desc || 'Sin descripción'}</p>
        `;
        taskCard.addEventListener('click', () => {
            window.location.href = `task_details.html?task=${encodeURIComponent(title)}`;
        });
        taskContainer.appendChild(taskCard);

        // Cerrar modal y reiniciar formulario
        taskModal.classList.add('hidden');
        taskForm.reset();
    });

    // Enviar formulario de zona
    zoneForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = document.getElementById('zoneTitle').value;
        const desc = document.getElementById('zoneDesc').value;

        // Añadir zona al arreglo
        zones.push({ title, desc });
        updateZoneStorage();

        // Cerrar modal y reiniciar formulario
        zoneModal.classList.add('hidden');
        zoneForm.reset();
    });

    // Cargar tareas existentes
    tasks.forEach(task => {
        const taskCard = document.createElement('div');
        taskCard.classList.add('task-card');
        taskCard.innerHTML = `
            <h3>${task.title}</h3>
            <p>${task.desc || 'Sin descripción'}</p>
        `;
        taskCard.addEventListener('click', () => {
            window.location.href = `task_details.html?task=${encodeURIComponent(task.title)}`;
        });
        taskContainer.appendChild(taskCard);
    });
});