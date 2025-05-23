
// 🔒 Comprobación de autenticación al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    firebase.auth().onAuthStateChanged(function(user) {
        const localUser = localStorage.getItem('currentUser');
        if (!user && !localUser) {
            // No hay usuario logueado, redirigir al login
            window.location.href = 'login.html';
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const taskListBtn = document.getElementById('taskListBtn');
    const createTaskBtn = document.getElementById('createTaskBtn');
    const manageTaskBtn = document.getElementById('manageTaskBtn');
    const createZoneBtn = document.getElementById('createZoneBtn');
    const taskSummaryBtn = document.getElementById('taskSummaryBtn');
    const employeeBtn = document.getElementById('employeeBtn');
    const loginBtn = document.getElementById('loginBtn');
    const taskModal = document.getElementById('taskModal');
    const zoneModal = document.getElementById('zoneModal');
    const closeModal = document.getElementById('closeModal');
    const closeZoneModal = document.getElementById('closeZoneModal');
    const taskForm = document.getElementById('taskForm');
    const zoneForm = document.getElementById('zoneForm');
    const taskContainer = document.getElementById('taskContainer');
    const turnoSelect = document.getElementById('turnoSelect');
    const taskDate = document.getElementById('taskDate');
    const employeePhoto = document.getElementById('employeePhoto');

    // Almacenar tareas, zonas, turno y fecha en localStorage
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let zones = JSON.parse(localStorage.getItem('zones')) || [];
    let selectedTurno = JSON.parse(localStorage.getItem('selectedTurno')) || '';
    let employees = JSON.parse(localStorage.getItem('employees')) || [];
    let selectedDate = JSON.parse(localStorage.getItem('selectedDate')) || '';

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

    const updateDateStorage = () => {
        localStorage.setItem('selectedDate', JSON.stringify(taskDate.value));
    };

    // Resetear completados si la fecha ha cambiado
    const checkAndResetCompletions = () => {
        const today = new Date().toISOString().split('T')[0];
        if (selectedDate && selectedDate !== today) {
            localStorage.setItem('completedPhotos', JSON.stringify({}));
        }
        selectedDate = today;
        updateDateStorage();
    };

    // Inicializar fecha con la fecha actual
    const today = new Date().toISOString().split('T')[0];
    taskDate.value = today;
    checkAndResetCompletions();

    // Inicializar turno con el valor almacenado
    if (selectedTurno) {
        turnoSelect.value = selectedTurno;
    }

    // Populate turnoSelect with employees
    const updateTurnoSelect = () => {
        turnoSelect.innerHTML = '<option value="">-- Selecciona un empleado --</option>';
        employees.forEach(employee => {
            const option = document.createElement('option');
            option.value = `${employee.name} ${employee.surname}`;
            option.textContent = `${employee.name} ${employee.surname}`;
            turnoSelect.appendChild(option);
        });
        if (selectedTurno) {
            turnoSelect.value = selectedTurno;
            updateEmployeePhoto();
        }
    };

    // Update employee photo based on selected turno
    const updateEmployeePhoto = () => {
        const selectedEmployee = employees.find(emp => `${emp.name} ${emp.surname}` === turnoSelect.value);
        if (selectedEmployee && selectedEmployee.photo) {
            employeePhoto.src = selectedEmployee.photo;
            employeePhoto.style.display = 'block';
        } else {
            employeePhoto.src = '';
            employeePhoto.style.display = 'none';
        }
    };

    // Guardar turno, fecha y verificar reset cuando cambian
    turnoSelect.addEventListener('change', () => {
        updateTurnoStorage();
        updateEmployeePhoto();
    });

    taskDate.addEventListener('change', () => {
        checkAndResetCompletions();
        updateDateStorage();
    });

    // Cambiar estado de los botones de la barra lateral
    const setActiveButton = (activeBtn) => {
        [taskListBtn, createTaskBtn, manageTaskBtn, createZoneBtn, taskSummaryBtn, employeeBtn, loginBtn].forEach(btn => {
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

    employeeBtn.addEventListener('click', () => {
        setActiveButton(employeeBtn);
        window.location.href = 'employee.html';
    });

    loginBtn.addEventListener('click', () => {
        setActiveButton(loginBtn);
        window.location.href = 'login.html';
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

    // Inicializar turnoSelect y foto
    updateTurnoSelect();
});