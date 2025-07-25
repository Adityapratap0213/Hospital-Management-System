// Appointments Management

// Load appointments data
function loadAppointmentsData() {
    const appointmentsTable = document.getElementById('appointments-table');
    if (!appointmentsTable) return;
    
    const tbody = appointmentsTable.querySelector('tbody');
    if (!tbody) return;
    
    // Clear existing rows
    tbody.innerHTML = '';
    
    // Get appointments from database
    const appointments = getAllAppointments();
    
    if (appointments.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = '<td colspan="7" class="text-center">No appointments found</td>';
        tbody.appendChild(row);
        return;
    }
    
    // Add appointment rows
    appointments.forEach(appointment => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${appointment.id}</td>
            <td>${appointment.patientName}</td>
            <td>${appointment.doctorName}</td>
            <td>${formatDate(appointment.date)}</td>
            <td>${appointment.time}</td>
            <td>
                <span class="status-badge ${appointment.status.toLowerCase()}">${appointment.status}</span>
            </td>
            <td class="actions">
                <button class="btn primary view-appointment" data-id="${appointment.id}"><i class="fas fa-eye"></i></button>
                <button class="btn secondary edit-appointment" data-id="${appointment.id}"><i class="fas fa-edit"></i></button>
                <button class="btn danger delete-appointment" data-id="${appointment.id}"><i class="fas fa-trash"></i></button>
            </td>
        `;
        tbody.appendChild(row);
    });
    
    // Add event listeners to action buttons
    setupAppointmentActionButtons();
    
    // Add CSS for status badges if not already added
    addStatusBadgeStyles();
}

// Add CSS for status badges
function addStatusBadgeStyles() {
    // Check if styles are already added
    if (document.getElementById('status-badge-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'status-badge-styles';
    style.textContent = `
        .status-badge {
            display: inline-block;
            padding: 0.25rem 0.5rem;
            border-radius: 1rem;
            font-size: 0.8rem;
            font-weight: 500;
            text-align: center;
        }
        .status-badge.scheduled {
            background-color: #3498db;
            color: white;
        }
        .status-badge.completed {
            background-color: #2ecc71;
            color: white;
        }
        .status-badge.cancelled {
            background-color: #e74c3c;
            color: white;
        }
        .status-badge.pending {
            background-color: #f39c12;
            color: white;
        }
    `;
    document.head.appendChild(style);
}

// Set up appointment action buttons
function setupAppointmentActionButtons() {
    // View appointment
    const viewButtons = document.querySelectorAll('.view-appointment');
    viewButtons.forEach(button => {
        button.addEventListener('click', function() {
            const appointmentId = this.getAttribute('data-id');
            viewAppointment(appointmentId);
        });
    });
    
    // Edit appointment
    const editButtons = document.querySelectorAll('.edit-appointment');
    editButtons.forEach(button => {
        button.addEventListener('click', function() {
            const appointmentId = this.getAttribute('data-id');
            editAppointment(appointmentId);
        });
    });
    
    // Delete appointment
    const deleteButtons = document.querySelectorAll('.delete-appointment');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const appointmentId = this.getAttribute('data-id');
            confirmDeleteAppointment(appointmentId);
        });
    });
    
    // Search appointments
    const searchInput = document.getElementById('appointment-search');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            searchAppointments(this.value);
        });
    }
}

// View appointment details
function viewAppointment(appointmentId) {
    const appointment = getAppointmentById(appointmentId);
    if (!appointment) {
        alert('Appointment not found');
        return;
    }
    
    // Create a modal to display appointment details
    const modalContent = `
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <h2>Appointment Details</h2>
            <div class="appointment-details">
                <p><strong>ID:</strong> ${appointment.id}</p>
                <p><strong>Patient:</strong> ${appointment.patientName}</p>
                <p><strong>Doctor:</strong> ${appointment.doctorName}</p>
                <p><strong>Date:</strong> ${formatDate(appointment.date)}</p>
                <p><strong>Time:</strong> ${appointment.time}</p>
                <p><strong>Status:</strong> <span class="status-badge ${appointment.status.toLowerCase()}">${appointment.status}</span></p>
                <p><strong>Reason for Visit:</strong> ${appointment.reason || 'Not specified'}</p>
            </div>
            <div class="form-actions">
                <button type="button" class="btn secondary close-modal-btn">Close</button>
                <button type="button" class="btn primary edit-from-view" data-id="${appointment.id}">Edit</button>
            </div>
        </div>
    `;
    
    // Create a temporary modal
    const tempModal = document.createElement('div');
    tempModal.className = 'modal active';
    tempModal.innerHTML = modalContent;
    
    // Show the modal
    const modalContainer = document.getElementById('modal-container');
    modalContainer.innerHTML = '';
    modalContainer.appendChild(tempModal);
    modalContainer.classList.add('active');
    
    // Set up close button
    const closeButton = tempModal.querySelector('.close-modal');
    closeButton.addEventListener('click', function() {
        modalContainer.classList.remove('active');
    });
    
    const closeModalBtn = tempModal.querySelector('.close-modal-btn');
    closeModalBtn.addEventListener('click', function() {
        modalContainer.classList.remove('active');
    });
    
    // Set up edit button
    const editButton = tempModal.querySelector('.edit-from-view');
    editButton.addEventListener('click', function() {
        const appointmentId = this.getAttribute('data-id');
        modalContainer.classList.remove('active');
        editAppointment(appointmentId);
    });
}

// Edit appointment
function editAppointment(appointmentId) {
    const appointment = getAppointmentById(appointmentId);
    if (!appointment) {
        alert('Appointment not found');
        return;
    }
    
    // Open the appointment modal
    openModal('appointment-modal', 'Edit Appointment');
    
    // Populate patient and doctor dropdowns
    populatePatientDropdown('appointment-patient');
    populateDoctorDropdown('appointment-doctor');
    
    // Fill the form with appointment data
    document.getElementById('appointment-patient').value = appointment.patientId;
    document.getElementById('appointment-doctor').value = appointment.doctorId;
    document.getElementById('appointment-date').value = appointment.date;
    document.getElementById('appointment-time').value = appointment.time;
    document.getElementById('appointment-reason').value = appointment.reason || '';
    
    // Add status field if editing
    let statusField = document.getElementById('appointment-status');
    if (!statusField) {
        const reasonField = document.getElementById('appointment-reason');
        const statusContainer = document.createElement('div');
        statusContainer.className = 'form-group';
        statusContainer.innerHTML = `
            <label for="appointment-status">Status</label>
            <select id="appointment-status" required>
                <option value="Scheduled">Scheduled</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
                <option value="Pending">Pending</option>
            </select>
        `;
        reasonField.parentNode.insertBefore(statusContainer, reasonField.nextSibling);
        statusField = document.getElementById('appointment-status');
    }
    
    statusField.value = appointment.status;
    
    // Store the appointment ID in the form for later use
    const form = document.getElementById('appointment-form');
    form.setAttribute('data-id', appointmentId);
}

// Confirm delete appointment
function confirmDeleteAppointment(appointmentId) {
    const appointment = getAppointmentById(appointmentId);
    if (!appointment) {
        alert('Appointment not found');
        return;
    }
    
    if (confirm(`Are you sure you want to delete the appointment for ${appointment.patientName} with ${appointment.doctorName}?`)) {
        deleteAppointment(appointmentId);
        addActivity(`Appointment for ${appointment.patientName} with ${appointment.doctorName} deleted`);
        loadAppointmentsData();
        updateDashboardStats();
    }
}

// Save appointment
function saveAppointment() {
    const form = document.getElementById('appointment-form');
    const appointmentId = form.getAttribute('data-id');
    
    // Get form values
    const patientId = document.getElementById('appointment-patient').value;
    const doctorId = document.getElementById('appointment-doctor').value;
    const date = document.getElementById('appointment-date').value;
    const time = document.getElementById('appointment-time').value;
    const reason = document.getElementById('appointment-reason').value;
    
    // Get patient and doctor names
    const patient = getPatientById(patientId);
    const doctor = getStaffById(doctorId);
    
    if (!patient || !doctor) {
        alert('Invalid patient or doctor selection');
        return;
    }
    
    // Get status (if editing)
    const statusField = document.getElementById('appointment-status');
    const status = statusField ? statusField.value : 'Scheduled';
    
    // Create appointment object
    const appointment = {
        patientId,
        doctorId,
        patientName: patient.name,
        doctorName: doctor.name,
        date,
        time,
        reason,
        status
    };
    
    // If editing, add the ID
    if (appointmentId) {
        appointment.id = appointmentId;
    }
    
    // Save to database
    const savedAppointment = saveAppointmentToDatabase(appointment);
    
    // Add activity
    if (appointmentId) {
        addActivity(`Appointment for ${savedAppointment.patientName} with ${savedAppointment.doctorName} updated`);
    } else {
        addActivity(`New appointment scheduled for ${savedAppointment.patientName} with ${savedAppointment.doctorName}`);
    }
    
    // Close the modal
    const modalContainer = document.getElementById('modal-container');
    modalContainer.classList.remove('active');
    document.getElementById('appointment-modal').classList.remove('active');
    
    // Refresh the appointments table
    loadAppointmentsData();
    updateDashboardStats();
}

// Search appointments
function searchAppointments(query) {
    const appointmentsTable = document.getElementById('appointments-table');
    if (!appointmentsTable) return;
    
    const tbody = appointmentsTable.querySelector('tbody');
    if (!tbody) return;
    
    // Clear existing rows
    tbody.innerHTML = '';
    
    // Get all appointments
    const allAppointments = getAllAppointments();
    
    // Filter appointments based on search query
    const filteredAppointments = allAppointments.filter(appointment => {
        const searchableFields = [
            appointment.id,
            appointment.patientName,
            appointment.doctorName,
            appointment.date,
            appointment.time,
            appointment.status,
            appointment.reason
        ];
        
        return searchableFields.some(field => 
            field && field.toString().toLowerCase().includes(query.toLowerCase())
        );
    });
    
    if (filteredAppointments.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = '<td colspan="7" class="text-center">No matching appointments found</td>';
        tbody.appendChild(row);
        return;
    }
    
    // Add filtered appointment rows
    filteredAppointments.forEach(appointment => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${appointment.id}</td>
            <td>${appointment.patientName}</td>
            <td>${appointment.doctorName}</td>
            <td>${formatDate(appointment.date)}</td>
            <td>${appointment.time}</td>
            <td>
                <span class="status-badge ${appointment.status.toLowerCase()}">${appointment.status}</span>
            </td>
            <td class="actions">
                <button class="btn primary view-appointment" data-id="${appointment.id}"><i class="fas fa-eye"></i></button>
                <button class="btn secondary edit-appointment" data-id="${appointment.id}"><i class="fas fa-edit"></i></button>
                <button class="btn danger delete-appointment" data-id="${appointment.id}"><i class="fas fa-trash"></i></button>
            </td>
        `;
        tbody.appendChild(row);
    });
    
    // Re-add event listeners to action buttons
    setupAppointmentActionButtons();
}

// Export appointments to CSV
function exportAppointmentsToCSV() {
    exportToCSV('appointments');
}

// Export appointments to Excel
function exportAppointmentsToExcel() {
    exportToExcel('appointments');
}