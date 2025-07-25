// Staff Management

// Load staff data
function loadStaffData() {
    const staffTable = document.getElementById('staff-table');
    if (!staffTable) return;
    
    const tbody = staffTable.querySelector('tbody');
    if (!tbody) return;
    
    // Clear existing rows
    tbody.innerHTML = '';
    
    // Get staff from database
    const staff = getAllStaff();
    
    if (staff.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = '<td colspan="7" class="text-center">No staff members found</td>';
        tbody.appendChild(row);
        return;
    }
    
    // Add staff rows
    staff.forEach(member => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${member.id}</td>
            <td>${member.name}</td>
            <td>${member.role}</td>
            <td>${member.department}</td>
            <td>${member.contact}</td>
            <td>
                <span class="status-badge ${member.status.toLowerCase()}">${member.status}</span>
            </td>
            <td class="actions">
                <button class="btn primary view-staff" data-id="${member.id}"><i class="fas fa-eye"></i></button>
                <button class="btn secondary edit-staff" data-id="${member.id}"><i class="fas fa-edit"></i></button>
                <button class="btn danger delete-staff" data-id="${member.id}"><i class="fas fa-trash"></i></button>
            </td>
        `;
        tbody.appendChild(row);
    });
    
    // Add event listeners to action buttons
    setupStaffActionButtons();
    
    // Add CSS for status badges if not already added
    addStaffStatusBadgeStyles();
}

// Add CSS for status badges
function addStaffStatusBadgeStyles() {
    // Check if styles are already added
    if (document.getElementById('staff-status-badge-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'staff-status-badge-styles';
    style.textContent = `
        .status-badge.active {
            background-color: #2ecc71;
            color: white;
        }
        .status-badge.inactive {
            background-color: #95a5a6;
            color: white;
        }
        .status-badge.onleave {
            background-color: #f39c12;
            color: white;
        }
    `;
    document.head.appendChild(style);
}

// Set up staff action buttons
function setupStaffActionButtons() {
    // View staff
    const viewButtons = document.querySelectorAll('.view-staff');
    viewButtons.forEach(button => {
        button.addEventListener('click', function() {
            const staffId = this.getAttribute('data-id');
            viewStaff(staffId);
        });
    });
    
    // Edit staff
    const editButtons = document.querySelectorAll('.edit-staff');
    editButtons.forEach(button => {
        button.addEventListener('click', function() {
            const staffId = this.getAttribute('data-id');
            editStaff(staffId);
        });
    });
    
    // Delete staff
    const deleteButtons = document.querySelectorAll('.delete-staff');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const staffId = this.getAttribute('data-id');
            confirmDeleteStaff(staffId);
        });
    });
    
    // Search staff
    const searchInput = document.getElementById('staff-search');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            searchStaff(this.value);
        });
    }
}

// View staff details
function viewStaff(staffId) {
    const staff = getStaffById(staffId);
    if (!staff) {
        alert('Staff member not found');
        return;
    }
    
    // Create a modal to display staff details
    const modalContent = `
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <h2>Staff Details</h2>
            <div class="staff-details">
                <p><strong>ID:</strong> ${staff.id}</p>
                <p><strong>Name:</strong> ${staff.name}</p>
                <p><strong>Role:</strong> ${staff.role}</p>
                <p><strong>Department:</strong> ${staff.department}</p>
                <p><strong>Contact:</strong> ${staff.contact}</p>
                <p><strong>Email:</strong> ${staff.email || 'N/A'}</p>
                <p><strong>Address:</strong> ${staff.address || 'N/A'}</p>
                <p><strong>Status:</strong> <span class="status-badge ${staff.status.toLowerCase()}">${staff.status}</span></p>
            </div>
            <div class="form-actions">
                <button type="button" class="btn secondary close-modal-btn">Close</button>
                <button type="button" class="btn primary edit-from-view" data-id="${staff.id}">Edit</button>
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
        const staffId = this.getAttribute('data-id');
        modalContainer.classList.remove('active');
        editStaff(staffId);
    });
}

// Edit staff
function editStaff(staffId) {
    const staff = getStaffById(staffId);
    if (!staff) {
        alert('Staff member not found');
        return;
    }
    
    // Open the staff modal
    openModal('staff-modal', 'Edit Staff Member');
    
    // Fill the form with staff data
    document.getElementById('staff-name').value = staff.name;
    document.getElementById('staff-role').value = staff.role;
    document.getElementById('staff-department').value = staff.department;
    document.getElementById('staff-contact').value = staff.contact;
    document.getElementById('staff-email').value = staff.email || '';
    document.getElementById('staff-address').value = staff.address || '';
    
    // Add status field if editing
    let statusField = document.getElementById('staff-status');
    if (!statusField) {
        const addressField = document.getElementById('staff-address');
        const statusContainer = document.createElement('div');
        statusContainer.className = 'form-group';
        statusContainer.innerHTML = `
            <label for="staff-status">Status</label>
            <select id="staff-status" required>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="OnLeave">On Leave</option>
            </select>
        `;
        addressField.parentNode.insertBefore(statusContainer, addressField.nextSibling);
        statusField = document.getElementById('staff-status');
    }
    
    statusField.value = staff.status;
    
    // Store the staff ID in the form for later use
    const form = document.getElementById('staff-form');
    form.setAttribute('data-id', staffId);
}

// Confirm delete staff
function confirmDeleteStaff(staffId) {
    const staff = getStaffById(staffId);
    if (!staff) {
        alert('Staff member not found');
        return;
    }
    
    if (confirm(`Are you sure you want to delete staff member ${staff.name}?`)) {
        deleteStaff(staffId);
        addActivity(`Staff member ${staff.name} deleted`);
        loadStaffData();
        updateDashboardStats();
    }
}

// Save staff
function saveStaff() {
    const form = document.getElementById('staff-form');
    const staffId = form.getAttribute('data-id');
    
    // Get form values
    const name = document.getElementById('staff-name').value;
    const role = document.getElementById('staff-role').value;
    const department = document.getElementById('staff-department').value;
    const contact = document.getElementById('staff-contact').value;
    const email = document.getElementById('staff-email').value;
    const address = document.getElementById('staff-address').value;
    
    // Get status (if editing)
    const statusField = document.getElementById('staff-status');
    const status = statusField ? statusField.value : 'Active';
    
    // Create staff object
    const staff = {
        name,
        role,
        department,
        contact,
        email,
        address,
        status
    };
    
    // If editing, add the ID
    if (staffId) {
        staff.id = staffId;
    }
    
    // Save to database
    const savedStaff = saveStaffToDatabase(staff);
    
    // Add activity
    if (staffId) {
        addActivity(`Staff member ${savedStaff.name} updated`);
    } else {
        addActivity(`New staff member ${savedStaff.name} added`);
    }
    
    // Close the modal
    const modalContainer = document.getElementById('modal-container');
    modalContainer.classList.remove('active');
    document.getElementById('staff-modal').classList.remove('active');
    
    // Refresh the staff table
    loadStaffData();
    updateDashboardStats();
}

// Search staff
function searchStaff(query) {
    const staffTable = document.getElementById('staff-table');
    if (!staffTable) return;
    
    const tbody = staffTable.querySelector('tbody');
    if (!tbody) return;
    
    // Clear existing rows
    tbody.innerHTML = '';
    
    // Get all staff
    const allStaff = getAllStaff();
    
    // Filter staff based on search query
    const filteredStaff = allStaff.filter(member => {
        const searchableFields = [
            member.id,
            member.name,
            member.role,
            member.department,
            member.contact,
            member.email,
            member.address,
            member.status
        ];
        
        return searchableFields.some(field => 
            field && field.toString().toLowerCase().includes(query.toLowerCase())
        );
    });
    
    if (filteredStaff.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = '<td colspan="7" class="text-center">No matching staff members found</td>';
        tbody.appendChild(row);
        return;
    }
    
    // Add filtered staff rows
    filteredStaff.forEach(member => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${member.id}</td>
            <td>${member.name}</td>
            <td>${member.role}</td>
            <td>${member.department}</td>
            <td>${member.contact}</td>
            <td>
                <span class="status-badge ${member.status.toLowerCase()}">${member.status}</span>
            </td>
            <td class="actions">
                <button class="btn primary view-staff" data-id="${member.id}"><i class="fas fa-eye"></i></button>
                <button class="btn secondary edit-staff" data-id="${member.id}"><i class="fas fa-edit"></i></button>
                <button class="btn danger delete-staff" data-id="${member.id}"><i class="fas fa-trash"></i></button>
            </td>
        `;
        tbody.appendChild(row);
    });
    
    // Re-add event listeners to action buttons
    setupStaffActionButtons();
}

// Export staff to CSV
function exportStaffToCSV() {
    exportToCSV('staff');
}

// Export staff to Excel
function exportStaffToExcel() {
    exportToExcel('staff');
}