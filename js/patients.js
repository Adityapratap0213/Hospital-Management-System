// Patients Management

// Load patients data
function loadPatientsData() {
    const patientsTable = document.getElementById('patients-table');
    if (!patientsTable) return;
    
    const tbody = patientsTable.querySelector('tbody');
    if (!tbody) return;
    
    // Clear existing rows
    tbody.innerHTML = '';
    
    // Get patients from database
    const patients = getAllPatients();
    
    if (patients.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = '<td colspan="7" class="text-center">No patients found</td>';
        tbody.appendChild(row);
        return;
    }
    
    // Add patient rows
    patients.forEach(patient => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${patient.id}</td>
            <td>${patient.name}</td>
            <td>${patient.age}</td>
            <td>${patient.gender}</td>
            <td>${patient.contact}</td>
            <td>${patient.lastVisit || 'N/A'}</td>
            <td class="actions">
                <button class="btn primary view-patient" data-id="${patient.id}"><i class="fas fa-eye"></i></button>
                <button class="btn secondary edit-patient" data-id="${patient.id}"><i class="fas fa-edit"></i></button>
                <button class="btn danger delete-patient" data-id="${patient.id}"><i class="fas fa-trash"></i></button>
            </td>
        `;
        tbody.appendChild(row);
    });
    
    // Add event listeners to action buttons
    setupPatientActionButtons();
}

// Set up patient action buttons
function setupPatientActionButtons() {
    // View patient
    const viewButtons = document.querySelectorAll('.view-patient');
    viewButtons.forEach(button => {
        button.addEventListener('click', function() {
            const patientId = this.getAttribute('data-id');
            viewPatient(patientId);
        });
    });
    
    // Edit patient
    const editButtons = document.querySelectorAll('.edit-patient');
    editButtons.forEach(button => {
        button.addEventListener('click', function() {
            const patientId = this.getAttribute('data-id');
            editPatient(patientId);
        });
    });
    
    // Delete patient
    const deleteButtons = document.querySelectorAll('.delete-patient');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const patientId = this.getAttribute('data-id');
            confirmDeletePatient(patientId);
        });
    });
    
    // Search patients
    const searchInput = document.getElementById('patient-search');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            searchPatients(this.value);
        });
    }
}

// View patient details
function viewPatient(patientId) {
    const patient = getPatientById(patientId);
    if (!patient) {
        alert('Patient not found');
        return;
    }
    
    // Create a modal to display patient details
    const modalContent = `
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <h2>Patient Details</h2>
            <div class="patient-details">
                <p><strong>ID:</strong> ${patient.id}</p>
                <p><strong>Name:</strong> ${patient.name}</p>
                <p><strong>Age:</strong> ${patient.age}</p>
                <p><strong>Gender:</strong> ${patient.gender}</p>
                <p><strong>Contact:</strong> ${patient.contact}</p>
                <p><strong>Email:</strong> ${patient.email || 'N/A'}</p>
                <p><strong>Address:</strong> ${patient.address || 'N/A'}</p>
                <p><strong>Last Visit:</strong> ${patient.lastVisit || 'N/A'}</p>
                <p><strong>Medical History:</strong> ${patient.medicalHistory || 'None'}</p>
            </div>
            <div class="form-actions">
                <button type="button" class="btn secondary close-modal-btn">Close</button>
                <button type="button" class="btn primary edit-from-view" data-id="${patient.id}">Edit</button>
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
        const patientId = this.getAttribute('data-id');
        modalContainer.classList.remove('active');
        editPatient(patientId);
    });
}

// Edit patient
function editPatient(patientId) {
    const patient = getPatientById(patientId);
    if (!patient) {
        alert('Patient not found');
        return;
    }
    
    // Open the patient modal
    openModal('patient-modal', 'Edit Patient');
    
    // Fill the form with patient data
    document.getElementById('patient-name').value = patient.name;
    document.getElementById('patient-age').value = patient.age;
    document.getElementById('patient-gender').value = patient.gender;
    document.getElementById('patient-contact').value = patient.contact;
    document.getElementById('patient-email').value = patient.email || '';
    document.getElementById('patient-address').value = patient.address || '';
    document.getElementById('patient-medical-history').value = patient.medicalHistory || '';
    
    // Store the patient ID in the form for later use
    const form = document.getElementById('patient-form');
    form.setAttribute('data-id', patientId);
}

// Confirm delete patient
function confirmDeletePatient(patientId) {
    const patient = getPatientById(patientId);
    if (!patient) {
        alert('Patient not found');
        return;
    }
    
    if (confirm(`Are you sure you want to delete patient ${patient.name}?`)) {
        deletePatient(patientId);
        addActivity(`Patient ${patient.name} deleted`);
        loadPatientsData();
        updateDashboardStats();
    }
}

// Save patient
function savePatient() {
    const form = document.getElementById('patient-form');
    const patientId = form.getAttribute('data-id');
    
    // Get form values
    const name = document.getElementById('patient-name').value;
    const age = parseInt(document.getElementById('patient-age').value);
    const gender = document.getElementById('patient-gender').value;
    const contact = document.getElementById('patient-contact').value;
    const email = document.getElementById('patient-email').value;
    const address = document.getElementById('patient-address').value;
    const medicalHistory = document.getElementById('patient-medical-history').value;
    
    // Create patient object
    const patient = {
        name,
        age,
        gender,
        contact,
        email,
        address,
        medicalHistory,
        lastVisit: new Date().toISOString().split('T')[0] // Today's date
    };
    
    // If editing, add the ID
    if (patientId) {
        patient.id = patientId;
    }
    
    // Save to database
    const savedPatient = savePatientToDatabase(patient);
    
    // Add activity
    if (patientId) {
        addActivity(`Patient ${savedPatient.name} updated`);
    } else {
        addActivity(`New patient ${savedPatient.name} added`);
    }
    
    // Close the modal
    const modalContainer = document.getElementById('modal-container');
    modalContainer.classList.remove('active');
    document.getElementById('patient-modal').classList.remove('active');
    
    // Refresh the patients table
    loadPatientsData();
    updateDashboardStats();
}

// Search patients
function searchPatients(query) {
    const patientsTable = document.getElementById('patients-table');
    if (!patientsTable) return;
    
    const tbody = patientsTable.querySelector('tbody');
    if (!tbody) return;
    
    // Clear existing rows
    tbody.innerHTML = '';
    
    // Get all patients
    const allPatients = getAllPatients();
    
    // Filter patients based on search query
    const filteredPatients = allPatients.filter(patient => {
        const searchableFields = [
            patient.id,
            patient.name,
            patient.gender,
            patient.contact,
            patient.email,
            patient.address,
            patient.medicalHistory
        ];
        
        return searchableFields.some(field => 
            field && field.toString().toLowerCase().includes(query.toLowerCase())
        );
    });
    
    if (filteredPatients.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = '<td colspan="7" class="text-center">No matching patients found</td>';
        tbody.appendChild(row);
        return;
    }
    
    // Add filtered patient rows
    filteredPatients.forEach(patient => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${patient.id}</td>
            <td>${patient.name}</td>
            <td>${patient.age}</td>
            <td>${patient.gender}</td>
            <td>${patient.contact}</td>
            <td>${patient.lastVisit || 'N/A'}</td>
            <td class="actions">
                <button class="btn primary view-patient" data-id="${patient.id}"><i class="fas fa-eye"></i></button>
                <button class="btn secondary edit-patient" data-id="${patient.id}"><i class="fas fa-edit"></i></button>
                <button class="btn danger delete-patient" data-id="${patient.id}"><i class="fas fa-trash"></i></button>
            </td>
        `;
        tbody.appendChild(row);
    });
    
    // Re-add event listeners to action buttons
    setupPatientActionButtons();
}

// Export patients to CSV
function exportPatientsToCSV() {
    exportToCSV('patients');
}

// Export patients to Excel
function exportPatientsToExcel() {
    exportToExcel('patients');
}