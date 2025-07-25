// Billing Management

// Load billing data
function loadBillingData() {
    const billingTable = document.getElementById('billing-table');
    if (!billingTable) return;
    
    const tbody = billingTable.querySelector('tbody');
    if (!tbody) return;
    
    // Clear existing rows
    tbody.innerHTML = '';
    
    // Get billing records from database
    const billingRecords = getAllBilling();
    
    if (billingRecords.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = '<td colspan="7" class="text-center">No billing records found</td>';
        tbody.appendChild(row);
        return;
    }
    
    // Add billing rows
    billingRecords.forEach(bill => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${bill.id}</td>
            <td>${bill.patientName}</td>
            <td>${formatDate(bill.date)}</td>
            <td>${formatServices(bill.services)}</td>
            <td>$${bill.total.toFixed(2)}</td>
            <td>
                <span class="status-badge ${bill.status.toLowerCase()}">${bill.status}</span>
            </td>
            <td class="actions">
                <button class="btn primary view-bill" data-id="${bill.id}"><i class="fas fa-eye"></i></button>
                <button class="btn secondary edit-bill" data-id="${bill.id}"><i class="fas fa-edit"></i></button>
                <button class="btn danger delete-bill" data-id="${bill.id}"><i class="fas fa-trash"></i></button>
            </td>
        `;
        tbody.appendChild(row);
    });
    
    // Add event listeners to action buttons
    setupBillingActionButtons();
    
    // Add CSS for status badges if not already added
    addBillingStatusBadgeStyles();
}

// Format services for display
function formatServices(services) {
    if (!services || services.length === 0) return 'None';
    
    if (services.length === 1) {
        return services[0].name;
    }
    
    return `${services[0].name} + ${services.length - 1} more`;
}

// Add CSS for status badges
function addBillingStatusBadgeStyles() {
    // Check if styles are already added
    if (document.getElementById('billing-status-badge-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'billing-status-badge-styles';
    style.textContent = `
        .status-badge.paid {
            background-color: #2ecc71;
            color: white;
        }
        .status-badge.pending {
            background-color: #f39c12;
            color: white;
        }
        .status-badge.partial {
            background-color: #3498db;
            color: white;
        }
        .status-badge.overdue {
            background-color: #e74c3c;
            color: white;
        }
    `;
    document.head.appendChild(style);
}

// Set up billing action buttons
function setupBillingActionButtons() {
    // View bill
    const viewButtons = document.querySelectorAll('.view-bill');
    viewButtons.forEach(button => {
        button.addEventListener('click', function() {
            const billId = this.getAttribute('data-id');
            viewBill(billId);
        });
    });
    
    // Edit bill
    const editButtons = document.querySelectorAll('.edit-bill');
    editButtons.forEach(button => {
        button.addEventListener('click', function() {
            const billId = this.getAttribute('data-id');
            editBill(billId);
        });
    });
    
    // Delete bill
    const deleteButtons = document.querySelectorAll('.delete-bill');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const billId = this.getAttribute('data-id');
            confirmDeleteBill(billId);
        });
    });
    
    // Search bills
    const searchInput = document.getElementById('bill-search');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            searchBills(this.value);
        });
    }
}

// View bill details
function viewBill(billId) {
    const bill = getBillingById(billId);
    if (!bill) {
        alert('Bill not found');
        return;
    }
    
    // Create a modal to display bill details
    const modalContent = `
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <h2>Bill Details</h2>
            <div class="bill-details">
                <div class="bill-header">
                    <div>
                        <h3>Invoice #${bill.id}</h3>
                        <p>Date: ${formatDate(bill.date)}</p>
                    </div>
                    <div>
                        <p><strong>Status:</strong> <span class="status-badge ${bill.status.toLowerCase()}">${bill.status}</span></p>
                    </div>
                </div>
                
                <div class="bill-patient">
                    <h4>Patient Information</h4>
                    <p>${bill.patientName}</p>
                </div>
                
                <div class="bill-services">
                    <h4>Services</h4>
                    <table class="bill-services-table">
                        <thead>
                            <tr>
                                <th>Service</th>
                                <th>Cost</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${bill.services.map(service => `
                                <tr>
                                    <td>${service.name}</td>
                                    <td>$${service.cost.toFixed(2)}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
                
                <div class="bill-summary">
                    <div class="bill-total-row">
                        <span>Subtotal:</span>
                        <span>$${bill.subtotal.toFixed(2)}</span>
                    </div>
                    <div class="bill-total-row">
                        <span>Tax (${(bill.tax / bill.subtotal * 100).toFixed(1)}%):</span>
                        <span>$${bill.tax.toFixed(2)}</span>
                    </div>
                    <div class="bill-total-row total">
                        <span>Total:</span>
                        <span>$${bill.total.toFixed(2)}</span>
                    </div>
                </div>
            </div>
            <div class="form-actions">
                <button type="button" class="btn secondary close-modal-btn">Close</button>
                <button type="button" class="btn primary edit-from-view" data-id="${bill.id}">Edit</button>
                <button type="button" class="btn print-bill" data-id="${bill.id}"><i class="fas fa-print"></i> Print</button>
            </div>
        </div>
    `;
    
    // Create a temporary modal
    const tempModal = document.createElement('div');
    tempModal.className = 'modal active';
    tempModal.innerHTML = modalContent;
    
    // Add styles for bill details
    const style = document.createElement('style');
    style.textContent = `
        .bill-details {
            padding: 1rem 0;
        }
        .bill-header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 1.5rem;
            padding-bottom: 1rem;
            border-bottom: 1px solid #eee;
        }
        .bill-patient {
            margin-bottom: 1.5rem;
        }
        .bill-services {
            margin-bottom: 1.5rem;
        }
        .bill-services-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 0.5rem;
        }
        .bill-services-table th,
        .bill-services-table td {
            padding: 0.5rem;
            text-align: left;
            border-bottom: 1px solid #eee;
        }
        .bill-summary {
            margin-top: 1.5rem;
            border-top: 1px solid #eee;
            padding-top: 1rem;
        }
        .bill-total-row {
            display: flex;
            justify-content: space-between;
            padding: 0.5rem 0;
        }
        .bill-total-row.total {
            font-weight: bold;
            font-size: 1.2rem;
            border-top: 1px solid #eee;
            padding-top: 1rem;
            margin-top: 0.5rem;
        }
    `;
    tempModal.appendChild(style);
    
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
        const billId = this.getAttribute('data-id');
        modalContainer.classList.remove('active');
        editBill(billId);
    });
    
    // Set up print button
    const printButton = tempModal.querySelector('.print-bill');
    printButton.addEventListener('click', function() {
        printBill(billId);
    });
}

// Print bill
function printBill(billId) {
    const bill = getBillingById(billId);
    if (!bill) return;
    
    // Create a printable version of the bill
    const printContent = `
        <div class="print-bill">
            <div class="print-header">
                <h1>Hospital Management System</h1>
                <h2>Invoice #${bill.id}</h2>
            </div>
            
            <div class="print-info">
                <div class="print-date">
                    <p><strong>Date:</strong> ${formatDate(bill.date)}</p>
                    <p><strong>Status:</strong> ${bill.status}</p>
                </div>
                <div class="print-patient">
                    <h3>Patient Information</h3>
                    <p>${bill.patientName}</p>
                </div>
            </div>
            
            <div class="print-services">
                <h3>Services</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Service</th>
                            <th>Cost</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${bill.services.map(service => `
                            <tr>
                                <td>${service.name}</td>
                                <td>$${service.cost.toFixed(2)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
            
            <div class="print-summary">
                <div class="print-total-row">
                    <span>Subtotal:</span>
                    <span>$${bill.subtotal.toFixed(2)}</span>
                </div>
                <div class="print-total-row">
                    <span>Tax (${(bill.tax / bill.subtotal * 100).toFixed(1)}%):</span>
                    <span>$${bill.tax.toFixed(2)}</span>
                </div>
                <div class="print-total-row total">
                    <span>Total:</span>
                    <span>$${bill.total.toFixed(2)}</span>
                </div>
            </div>
            
            <div class="print-footer">
                <p>Thank you for choosing our hospital.</p>
                <p>For any inquiries, please contact us at 555-HOSPITAL.</p>
            </div>
        </div>
    `;
    
    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
            <head>
                <title>Invoice #${bill.id}</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        margin: 0;
                        padding: 20px;
                        color: #333;
                    }
                    .print-bill {
                        max-width: 800px;
                        margin: 0 auto;
                    }
                    .print-header {
                        text-align: center;
                        margin-bottom: 30px;
                    }
                    .print-header h1 {
                        margin-bottom: 10px;
                        color: #2c3e50;
                    }
                    .print-info {
                        display: flex;
                        justify-content: space-between;
                        margin-bottom: 30px;
                    }
                    .print-services table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-bottom: 30px;
                    }
                    .print-services th, .print-services td {
                        padding: 10px;
                        text-align: left;
                        border-bottom: 1px solid #ddd;
                    }
                    .print-summary {
                        margin-top: 20px;
                        border-top: 1px solid #ddd;
                        padding-top: 20px;
                    }
                    .print-total-row {
                        display: flex;
                        justify-content: space-between;
                        padding: 5px 0;
                    }
                    .print-total-row.total {
                        font-weight: bold;
                        font-size: 1.2em;
                        border-top: 1px solid #ddd;
                        padding-top: 10px;
                        margin-top: 10px;
                    }
                    .print-footer {
                        margin-top: 50px;
                        text-align: center;
                        font-size: 0.9em;
                        color: #777;
                    }
                    @media print {
                        body {
                            padding: 0;
                        }
                    }
                </style>
            </head>
            <body>
                ${printContent}
                <script>
                    window.onload = function() {
                        window.print();
                        window.setTimeout(function() {
                            window.close();
                        }, 500);
                    }
                </script>
            </body>
        </html>
    `);
    printWindow.document.close();
}

// Edit bill
function editBill(billId) {
    const bill = getBillingById(billId);
    if (!bill) {
        alert('Bill not found');
        return;
    }
    
    // Open the billing modal
    openModal('billing-modal', 'Edit Bill');
    
    // Populate patient dropdown
    populatePatientDropdown('billing-patient');
    
    // Fill the form with bill data
    document.getElementById('billing-patient').value = bill.patientId;
    document.getElementById('billing-date').value = bill.date;
    document.getElementById('billing-status').value = bill.status;
    document.getElementById('billing-tax').value = (bill.tax / bill.subtotal * 100).toFixed(1);
    
    // Clear existing service items
    const servicesContainer = document.getElementById('services-container');
    servicesContainer.innerHTML = '';
    
    // Add service items
    bill.services.forEach(service => {
        const serviceItem = document.createElement('div');
        serviceItem.className = 'service-item';
        serviceItem.innerHTML = `
            <input type="text" class="service-name" placeholder="Service name" value="${service.name}" required>
            <input type="number" class="service-cost" placeholder="Cost" value="${service.cost}" required>
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
    });
    
    // Update totals
    updateBillingTotals();
    
    // Store the bill ID in the form for later use
    const form = document.getElementById('billing-form');
    form.setAttribute('data-id', billId);
}

// Confirm delete bill
function confirmDeleteBill(billId) {
    const bill = getBillingById(billId);
    if (!bill) {
        alert('Bill not found');
        return;
    }
    
    if (confirm(`Are you sure you want to delete bill #${bill.id} for ${bill.patientName}?`)) {
        deleteBilling(billId);
        addActivity(`Bill #${bill.id} for ${bill.patientName} deleted`);
        loadBillingData();
        updateDashboardStats();
    }
}

// Save bill
function saveBill() {
    const form = document.getElementById('billing-form');
    const billId = form.getAttribute('data-id');
    
    // Get form values
    const patientId = document.getElementById('billing-patient').value;
    const date = document.getElementById('billing-date').value;
    const status = document.getElementById('billing-status').value;
    const taxRate = parseFloat(document.getElementById('billing-tax').value) || 0;
    const subtotal = parseFloat(document.getElementById('billing-subtotal').value) || 0;
    const total = parseFloat(document.getElementById('billing-total').value) || 0;
    
    // Get patient name
    const patient = getPatientById(patientId);
    if (!patient) {
        alert('Invalid patient selection');
        return;
    }
    
    // Get services
    const services = [];
    const serviceItems = document.querySelectorAll('.service-item');
    serviceItems.forEach(item => {
        const name = item.querySelector('.service-name').value;
        const cost = parseFloat(item.querySelector('.service-cost').value) || 0;
        
        if (name && cost > 0) {
            services.push({ name, cost });
        }
    });
    
    if (services.length === 0) {
        alert('Please add at least one service');
        return;
    }
    
    // Calculate tax
    const tax = subtotal * (taxRate / 100);
    
    // Create bill object
    const bill = {
        patientId,
        patientName: patient.name,
        date,
        services,
        subtotal,
        tax,
        total,
        status
    };
    
    // If editing, add the ID
    if (billId) {
        bill.id = billId;
    }
    
    // Save to database
    const savedBill = saveBillingToDatabase(bill);
    
    // Add activity
    if (billId) {
        addActivity(`Bill #${savedBill.id} for ${savedBill.patientName} updated`);
    } else {
        addActivity(`New bill #${savedBill.id} created for ${savedBill.patientName}`);
    }
    
    // Close the modal
    const modalContainer = document.getElementById('modal-container');
    modalContainer.classList.remove('active');
    document.getElementById('billing-modal').classList.remove('active');
    
    // Refresh the billing table
    loadBillingData();
    updateDashboardStats();
}

// Search bills
function searchBills(query) {
    const billingTable = document.getElementById('billing-table');
    if (!billingTable) return;
    
    const tbody = billingTable.querySelector('tbody');
    if (!tbody) return;
    
    // Clear existing rows
    tbody.innerHTML = '';
    
    // Get all bills
    const allBills = getAllBilling();
    
    // Filter bills based on search query
    const filteredBills = allBills.filter(bill => {
        const searchableFields = [
            bill.id,
            bill.patientName,
            bill.date,
            bill.status,
            bill.total.toString()
        ];
        
        // Also search in services
        if (bill.services) {
            bill.services.forEach(service => {
                searchableFields.push(service.name);
            });
        }
        
        return searchableFields.some(field => 
            field && field.toString().toLowerCase().includes(query.toLowerCase())
        );
    });
    
    if (filteredBills.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = '<td colspan="7" class="text-center">No matching bills found</td>';
        tbody.appendChild(row);
        return;
    }
    
    // Add filtered bill rows
    filteredBills.forEach(bill => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${bill.id}</td>
            <td>${bill.patientName}</td>
            <td>${formatDate(bill.date)}</td>
            <td>${formatServices(bill.services)}</td>
            <td>$${bill.total.toFixed(2)}</td>
            <td>
                <span class="status-badge ${bill.status.toLowerCase()}">${bill.status}</span>
            </td>
            <td class="actions">
                <button class="btn primary view-bill" data-id="${bill.id}"><i class="fas fa-eye"></i></button>
                <button class="btn secondary edit-bill" data-id="${bill.id}"><i class="fas fa-edit"></i></button>
                <button class="btn danger delete-bill" data-id="${bill.id}"><i class="fas fa-trash"></i></button>
            </td>
        `;
        tbody.appendChild(row);
    });
    
    // Re-add event listeners to action buttons
    setupBillingActionButtons();
}

// Export billing to CSV
function exportBillingToCSV() {
    exportToCSV('billing');
}

// Export billing to Excel
function exportBillingToExcel() {
    exportToExcel('billing');
}