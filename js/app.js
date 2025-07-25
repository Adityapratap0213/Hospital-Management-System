// Main Application JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the application
    initApp();
});

// Initialize the application
function initApp() {
    // Set up navigation
    setupNavigation();
    
    // Set up modal functionality
    setupModals();
    
    // Initialize database
    initDatabase();
    
    // Load initial data
    loadDashboardData();
    loadPatientsData();
    loadAppointmentsData();
    loadStaffData();
    loadBillingData();
    
    // Set up event listeners for action buttons
    setupActionButtons();
}

// Set up navigation between pages
function setupNavigation() {
    const navLinks = document.querySelectorAll('nav a');
    const pages = document.querySelectorAll('.page');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links and pages
            navLinks.forEach(link => link.classList.remove('active'));
            pages.forEach(page => page.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Show the corresponding page
            const pageId = this.getAttribute('data-page');
            document.getElementById(pageId).classList.add('active');
        });
    });
}

// Set up modal functionality
function setupModals() {
    const modalContainer = document.getElementById('modal-container');
    const modals = document.querySelectorAll('.modal');
    const closeButtons = document.querySelectorAll('.close-modal, .close-modal-btn');
    
    // Close modal when clicking the X or Cancel button
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            modalContainer.classList.remove('active');
            modals.forEach(modal => modal.classList.remove('active'));
        });
    });
    
    // Close modal when clicking outside the modal content
    modalContainer.addEventListener('click', function(e) {
        if (e.target === modalContainer) {
            modalContainer.classList.remove('active');
            modals.forEach(modal => modal.classList.remove('active'));
        }
    });
}

// Set up action buttons
function setupActionButtons() {
    // Patient actions
    const addPatientBtn = document.getElementById('add-patient-btn');
    if (addPatientBtn) {
        addPatientBtn.addEventListener('click', function() {
            openModal('patient-modal', 'Add New Patient');
            document.getElementById('patient-form').reset();
        });
    }
    
    // Appointment actions
    const addAppointmentBtn = document.getElementById('add-appointment-btn');
    if (addAppointmentBtn) {
        addAppointmentBtn.addEventListener('click', function() {
            openModal('appointment-modal', 'Schedule Appointment');
            document.getElementById('appointment-form').reset();
            populatePatientDropdown('appointment-patient');
            populateDoctorDropdown('appointment-doctor');
        });
    }
    
    // Staff actions
    const addStaffBtn = document.getElementById('add-staff-btn');
    if (addStaffBtn) {
        addStaffBtn.addEventListener('click', function() {
            openModal('staff-modal', 'Add Staff Member');
            document.getElementById('staff-form').reset();
        });
    }
    
    // Billing actions
    const addBillBtn = document.getElementById('add-bill-btn');
    if (addBillBtn) {
        addBillBtn.addEventListener('click', function() {
            openModal('billing-modal', 'Create New Bill');
            document.getElementById('billing-form').reset();
            populatePatientDropdown('billing-patient');
            setupBillingCalculation();
        });
    }
    
    // Add service button in billing form
    const addServiceBtn = document.getElementById('add-service-btn');
    if (addServiceBtn) {
        addServiceBtn.addEventListener('click', function() {
            addServiceRow();
        });
    }
    
    // Set up form submissions
    setupFormSubmissions();
}

// Open a modal with a specific title
function openModal(modalId, title) {
    const modalContainer = document.getElementById('modal-container');
    const modal = document.getElementById(modalId);
    const modalTitle = document.getElementById(`${modalId}-title`);
    
    if (modalTitle && title) {
        modalTitle.textContent = title;
    }
    
    modalContainer.classList.add('active');
    modal.classList.add('active');
}

// Set up form submissions
function setupFormSubmissions() {
    // Patient form
    const patientForm = document.getElementById('patient-form');
    if (patientForm) {
        patientForm.addEventListener('submit', function(e) {
            e.preventDefault();
            savePatient();
        });
    }
    
    // Appointment form
    const appointmentForm = document.getElementById('appointment-form');
    if (appointmentForm) {
        appointmentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveAppointment();
        });
    }
    
    // Staff form
    const staffForm = document.getElementById('staff-form');
    if (staffForm) {
        staffForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveStaff();
        });
    }
    
    // Billing form
    const billingForm = document.getElementById('billing-form');
    if (billingForm) {
        billingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveBill();
        });
    }
}

// Load dashboard data
function loadDashboardData() {
    // Update statistics
    updateDashboardStats();
    
    // Load recent activity
    loadRecentActivity();
}

// Update dashboard statistics
function updateDashboardStats() {
    const totalPatients = document.getElementById('total-patients');
    const todayAppointments = document.getElementById('today-appointments');
    const totalStaff = document.getElementById('total-staff');
    const pendingBills = document.getElementById('pending-bills');
    
    // Get counts from database
    const patientCount = getPatientCount();
    const todayAppointmentCount = getTodayAppointmentCount();
    const staffCount = getStaffCount();
    const pendingBillCount = getPendingBillCount();
    
    // Update the UI
    if (totalPatients) totalPatients.textContent = patientCount;
    if (todayAppointments) todayAppointments.textContent = todayAppointmentCount;
    if (totalStaff) totalStaff.textContent = staffCount;
    if (pendingBills) pendingBills.textContent = pendingBillCount;
}

// Load recent activity
function loadRecentActivity() {
    const activityLog = document.getElementById('activity-log');
    if (!activityLog) return;
    
    // Get recent activities from database
    const activities = getRecentActivities();
    
    if (activities.length === 0) {
        activityLog.innerHTML = '<p>No recent activities</p>';
        return;
    }
    
    // Clear existing content
    activityLog.innerHTML = '';
    
    // Add activities to the log
    activities.forEach(activity => {
        const activityItem = document.createElement('p');
        activityItem.textContent = `${activity.time} - ${activity.description}`;
        activityLog.appendChild(activityItem);
    });
}

// Add a service row to the billing form
function addServiceRow() {
    const servicesContainer = document.getElementById('services-container');
    if (!servicesContainer) return;
    
    const serviceItem = document.createElement('div');
    serviceItem.className = 'service-item';
    serviceItem.innerHTML = `
        <input type="text" class="service-name" placeholder="Service name" required>
        <input type="number" class="service-cost" placeholder="Cost" required>
        <button type="button" class="btn remove-service"><i class="fas fa-times"></i></button>
    `;
    
    servicesContainer.appendChild(serviceItem);
    
    // Add event listener to the remove button
    const removeBtn = serviceItem.querySelector('.remove-service');
    removeBtn.addEventListener('click', function() {
        servicesContainer.removeChild(serviceItem);
        updateBillingTotals();
    });
    
    // Add event listener to update totals when cost changes
    const costInput = serviceItem.querySelector('.service-cost');
    costInput.addEventListener('input', updateBillingTotals);
}

// Set up billing calculation
function setupBillingCalculation() {
    // Add event listener to tax input
    const taxInput = document.getElementById('billing-tax');
    if (taxInput) {
        taxInput.addEventListener('input', updateBillingTotals);
    }
    
    // Initialize with one service row
    const servicesContainer = document.getElementById('services-container');
    if (servicesContainer && servicesContainer.children.length === 0) {
        addServiceRow();
    }
    
    // Initialize totals
    updateBillingTotals();
}

// Update billing totals
function updateBillingTotals() {
    const subtotalInput = document.getElementById('billing-subtotal');
    const taxInput = document.getElementById('billing-tax');
    const totalInput = document.getElementById('billing-total');
    const costInputs = document.querySelectorAll('.service-cost');
    
    if (!subtotalInput || !taxInput || !totalInput) return;
    
    // Calculate subtotal
    let subtotal = 0;
    costInputs.forEach(input => {
        const cost = parseFloat(input.value) || 0;
        subtotal += cost;
    });
    
    // Calculate tax and total
    const taxRate = parseFloat(taxInput.value) || 0;
    const taxAmount = subtotal * (taxRate / 100);
    const total = subtotal + taxAmount;
    
    // Update inputs
    subtotalInput.value = subtotal.toFixed(2);
    totalInput.value = total.toFixed(2);
}

// Populate patient dropdown
function populatePatientDropdown(dropdownId) {
    const dropdown = document.getElementById(dropdownId);
    if (!dropdown) return;
    
    // Clear existing options except the first one
    while (dropdown.options.length > 1) {
        dropdown.remove(1);
    }
    
    // Get patients from database
    const patients = getAllPatients();
    
    // Add patient options
    patients.forEach(patient => {
        const option = document.createElement('option');
        option.value = patient.id;
        option.textContent = patient.name;
        dropdown.appendChild(option);
    });
}

// Populate doctor dropdown
function populateDoctorDropdown(dropdownId) {
    const dropdown = document.getElementById(dropdownId);
    if (!dropdown) return;
    
    // Clear existing options except the first one
    while (dropdown.options.length > 1) {
        dropdown.remove(1);
    }
    
    // Get doctors from database (staff with role = Doctor)
    const doctors = getAllDoctors();
    
    // Add doctor options
    doctors.forEach(doctor => {
        const option = document.createElement('option');
        option.value = doctor.id;
        option.textContent = doctor.name;
        dropdown.appendChild(option);
    });
}

// Add activity to the log
function addActivity(description) {
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateString = now.toLocaleDateString();
    
    const activity = {
        time: `${dateString} ${timeString}`,
        description: description
    };
    
    // Add to database
    addActivityToDatabase(activity);
    
    // Refresh the activity log if it's visible
    loadRecentActivity();
}

// Format date for display
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString();
}

// Format time for display
function formatTime(timeString) {
    return timeString;
}

// Generate a unique ID
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}