document.addEventListener('DOMContentLoaded', () => {
    const zoneContainer = document.getElementById('zoneContainer');
    const taskTitleElement = document.getElementById('taskTitle');
    const photoPreview = document.getElementById('photoPreview');
    const photoModal = document.getElementById('photoModal');
    const enlargedPhoto = document.getElementById('enlargedPhoto');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const completeBtn = document.getElementById('completeBtn');

    // Get task title from URL
    const urlParams = new URLSearchParams(window.location.search);
    const taskTitle = urlParams.get('task');
    taskTitleElement.textContent = `Tarea: ${taskTitle || 'Sin título'}`;

    // Load zones, task management records, and completed photos from localStorage
    const zones = JSON.parse(localStorage.getItem('zones')) || [];
    const taskManagementRecords = JSON.parse(localStorage.getItem('taskManagementRecords')) || [];
    let completedPhotos = JSON.parse(localStorage.getItem('completedPhotos')) || {};

    // Update localStorage for completed photos
    const updateCompletedPhotosStorage = () => {
        localStorage.setItem('completedPhotos', JSON.stringify(completedPhotos));
    };

    // Filter and sort records for this task by sortOrder
    const taskRecords = taskManagementRecords
        .filter(record => record.task === taskTitle)
        .sort((a, b) => a.sortOrder - b.sortOrder);

    // Display associated zones
    if (taskRecords.length > 0) {
        taskRecords.forEach((record, index) => {
            const zone = zones.find(z => z.title === record.zone);
            const zoneCard = document.createElement('div');
            zoneCard.classList.add('zone-card');
            zoneCard.setAttribute('data-record-index', index);
            zoneCard.innerHTML = `
                <h3>${record.zone || 'Sin zona'}</h3>
                <p>${zone ? zone.desc || 'Sin descripción' : 'Sin descripción'}</p>
            `;
            zoneContainer.appendChild(zoneCard);

            // Add click handler to show photos for this zone
            zoneCard.addEventListener('click', () => {
                showPhotos(record, index);
                document.querySelectorAll('.zone-card').forEach(card => card.classList.remove('selected'));
                zoneCard.classList.add('selected');
            });
        });

        // Show requirements for the first record by default
        const firstRecord = taskRecords[0];
        if (firstRecord && firstRecord.requirements) {
            const requirementsCard = document.createElement('div');
            requirementsCard.classList.add('zone-card');
            requirementsCard.innerHTML = `
                <h3>Descripción de Requisitos</h3>
                <p>${firstRecord.requirements || 'Sin descripción'}</p>
            `;
            zoneContainer.appendChild(requirementsCard);
        }

        // Show photos for the first record by default
        showPhotos(firstRecord, 0);
    } else {
        const noZoneMessage = document.createElement('p');
        noZoneMessage.textContent = 'No hay zonas asociadas con esta tarea.';
        zoneContainer.appendChild(noZoneMessage);
        photoPreview.innerHTML = '<p>No hay fotos asociadas con esta tarea.</p>';
    }

    // Function to show photos for a specific record
    function showPhotos(record, recordIndex) {
        photoPreview.innerHTML = '';
        const taskPhotos = record && record.photos ? record.photos : [];
        if (taskPhotos.length > 0) {
            taskPhotos.forEach((photo, photoIndex) => {
                const photoItem = document.createElement('div');
                photoItem.classList.add('photo-item');
                const photoKey = `${taskTitle}_${recordIndex}_${photoIndex}`;
                if (completedPhotos[photoKey]) {
                    photoItem.classList.add('completed');
                }
                photoItem.innerHTML = `
                    <img src="${photo.src}" alt="Task photo">
                    <textarea readonly>${photo.description || 'Sin descripción'}</textarea>
                `;
                photoItem.querySelector('img').addEventListener('click', () => {
                    enlargedPhoto.src = photo.src;
                    photoModal.classList.remove('hidden');
                    // Handle complete button click
                    completeBtn.onclick = () => {
                        completedPhotos[photoKey] = true;
                        updateCompletedPhotosStorage();
                        photoItem.classList.add('completed');
                        photoModal.classList.add('hidden');
                    };
                });
                photoPreview.appendChild(photoItem);
            });
        } else {
            photoPreview.innerHTML = '<p>No hay fotos asociadas con esta zona.</p>';
        }
    }

    // Close modal on return button click
    closeModalBtn.addEventListener('click', () => {
        photoModal.classList.add('hidden');
    });
});