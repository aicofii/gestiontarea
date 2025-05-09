document.addEventListener('DOMContentLoaded', () => {
    const taskListBtn = document.getElementById('taskListBtn');
    const createTaskBtn = document.getElementById('createTaskBtn');
    const manageTaskBtn = document.getElementById('manageTaskBtn');
    const createZoneBtn = document.getElementById('createZoneBtn');
    const taskSummaryBtn = document.getElementById('taskSummaryBtn');
    const employeeBtn = document.getElementById('employeeBtn');
    const createEmployeeButton = document.getElementById('createEmployeeButton');
    const employeeList = document.getElementById('employeeList');
    const employeeModal = document.getElementById('employeeModal');
    const closeModal = document.getElementById('closeModal');
    const employeeForm = document.getElementById('employeeForm');

    // Load employees from localStorage
    let employees = JSON.parse(localStorage.getItem('employees')) || [];

    // Update localStorage
    const updateEmployeeStorage = () => {
        localStorage.setItem('employees', JSON.stringify(employees));
    };

    // Function to render the employee list
    const renderEmployeeList = () => {
        employeeList.innerHTML = '';
        employees.forEach((employee, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${employee.name} ${employee.surname}</td>
                <td>
                    <button class="edit-btn" data-index="${index}">Editar</button>
                    <button class="delete-btn" data-index="${index}">Eliminar</button>
                </td>
            `;
            employeeList.appendChild(row);
        });
    };

    // Handle create employee button
    createEmployeeButton.addEventListener('click', () => {
        employeeModal.classList.remove('hidden');
        document.getElementById('employeeName').focus();
        employeeForm.dataset.editIndex = ''; // Clear edit index for new employee
    });

    // Handle modal close
    closeModal.addEventListener('click', () => {
        employeeModal.classList.add('hidden');
        employeeForm.reset();
    });

    // Close modal on click outside
    employeeModal.addEventListener('click', (e) => {
        if (e.target === employeeModal) {
            employeeModal.classList.add('hidden');
            employeeForm.reset();
        }
    });

    // Handle employee form submission
    employeeForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('employeeName').value;
        const surname = document.getElementById('employeeSurname').value;
        const photoInput = document.getElementById('employeePhoto');
        const editIndex = employeeForm.dataset.editIndex;

        const reader = new FileReader();
        const processForm = () => {
            const employeeData = {
                name,
                surname,
                photo: reader.result || (editIndex && employees[editIndex].photo) || ''
            };

            if (editIndex) {
                // Update existing employee
                employees[editIndex] = employeeData;
            } else {
                // Add new employee
                employees.push(employeeData);
            }

            updateEmployeeStorage();
            renderEmployeeList();
            updateTurnoSelect();

            // Close modal and reset form
            employeeModal.classList.add('hidden');
            employeeForm.reset();
            employeeForm.dataset.editIndex = '';
        };

        if (photoInput.files.length > 0) {
            reader.onload = processForm;
            reader.readAsDataURL(photoInput.files[0]);
        } else {
            processForm();
        }
    });

    // Handle edit and delete buttons
    employeeList.addEventListener('click', (e) => {
        const index = e.target.getAttribute('data-index');
        if (e.target.classList.contains('edit-btn')) {
            const employee = employees[index];
            document.getElementById('employeeName').value = employee.name;
            document.getElementById('employeeSurname').value = employee.surname;
            employeeModal.classList.remove('hidden');
            employeeForm.dataset.editIndex = index;
            document.getElementById('employeeName').focus();
        } else if (e.target.classList.contains('delete-btn')) {
            employees.splice(index, 1);
            updateEmployeeStorage();
            renderEmployeeList();
            updateTurnoSelect();
        }
    });

    // Update turnoSelect in index.html
    const updateTurnoSelect = () => {
        const turnoSelect = document.getElementById('turnoSelect');
        if (turnoSelect) {
            turnoSelect.innerHTML = '<option value="">-- Selecciona un empleado --</option>';
            employees.forEach(employee => {
                const option = document.createElement('option');
                option.value = `${employee.name} ${employee.surname}`;
                option.textContent = `${employee.name} ${employee.surname}`;
                turnoSelect.appendChild(option);
            });
        }
    };

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
    renderEmployeeList();
});