// Reports Management

// Initialize reports module
function initReports() {
    setupReportGenerators();
    setupReportExport();
}

// Setup report generators
function setupReportGenerators() {
    const generateReportBtn = document.getElementById('generate-report-btn');
    if (generateReportBtn) {
        generateReportBtn.addEventListener('click', generateReport);
    }
    
    // Setup report type change handler
    const reportTypeSelect = document.getElementById('report-type');
    if (reportTypeSelect) {
        reportTypeSelect.addEventListener('change', function() {
            updateReportOptions(this.value);
        });
        
        // Initialize report options based on default selection
        updateReportOptions(reportTypeSelect.value);
    }
}

// Update report options based on report type
function updateReportOptions(reportType) {
    const dateRangeContainer = document.getElementById('date-range-container');
    const specificOptionsContainer = document.getElementById('specific-options-container');
    
    if (!dateRangeContainer || !specificOptionsContainer) return;
    
    // Always show date range
    dateRangeContainer.style.display = 'block';
    
    // Clear specific options
    specificOptionsContainer.innerHTML = '';
    
    // Add specific options based on report type
    switch (reportType) {
        case 'patient':
            specificOptionsContainer.innerHTML = `
                <div class="form-group">
                    <label for="patient-filter">Patient</label>
                    <select id="patient-filter" class="form-control">
                        <option value="all">All Patients</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="patient-data">Include Data</label>
                    <div class="checkbox-group">
                        <label><input type="checkbox" name="patient-data" value="appointments" checked> Appointments</label>
                        <label><input type="checkbox" name="patient-data" value="billing" checked> Billing</label>
                    </div>
                </div>
            `;
            populatePatientDropdown('patient-filter');
            break;
            
        case 'appointment':
            specificOptionsContainer.innerHTML = `
                <div class="form-group">
                    <label for="appointment-status">Status</label>
                    <select id="appointment-status" class="form-control">
                        <option value="all">All Statuses</option>
                        <option value="scheduled">Scheduled</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="appointment-doctor">Doctor</label>
                    <select id="appointment-doctor" class="form-control">
                        <option value="all">All Doctors</option>
                    </select>
                </div>
            `;
            populateDoctorDropdown('appointment-doctor');
            break;
            
        case 'billing':
            specificOptionsContainer.innerHTML = `
                <div class="form-group">
                    <label for="billing-status">Status</label>
                    <select id="billing-status" class="form-control">
                        <option value="all">All Statuses</option>
                        <option value="paid">Paid</option>
                        <option value="pending">Pending</option>
                        <option value="overdue">Overdue</option>
                        <option value="partial">Partial Payment</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="billing-amount">Amount Range</label>
                    <div class="range-inputs">
                        <input type="number" id="billing-min" class="form-control" placeholder="Min">
                        <span>to</span>
                        <input type="number" id="billing-max" class="form-control" placeholder="Max">
                    </div>
                </div>
            `;
            break;
            
        case 'staff':
            specificOptionsContainer.innerHTML = `
                <div class="form-group">
                    <label for="staff-role">Role</label>
                    <select id="staff-role" class="form-control">
                        <option value="all">All Roles</option>
                        <option value="doctor">Doctor</option>
                        <option value="nurse">Nurse</option>
                        <option value="receptionist">Receptionist</option>
                        <option value="admin">Administrator</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="staff-data">Include Data</label>
                    <div class="checkbox-group">
                        <label><input type="checkbox" name="staff-data" value="appointments" checked> Appointments</label>
                        <label><input type="checkbox" name="staff-data" value="schedule" checked> Schedule</label>
                    </div>
                </div>
            `;
            break;
            
        case 'financial':
            specificOptionsContainer.innerHTML = `
                <div class="form-group">
                    <label for="financial-type">Report Type</label>
                    <select id="financial-type" class="form-control">
                        <option value="revenue">Revenue</option>
                        <option value="services">Services</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="financial-grouping">Group By</label>
                    <select id="financial-grouping" class="form-control">
                        <option value="day">Day</option>
                        <option value="week">Week</option>
                        <option value="month">Month</option>
                    </select>
                </div>
            `;
            break;
    }
    
    // Add CSS for range inputs if not already added
    if (!document.getElementById('range-inputs-style')) {
        const style = document.createElement('style');
        style.id = 'range-inputs-style';
        style.textContent = `
            .range-inputs {
                display: flex;
                align-items: center;
                gap: 10px;
            }
            .range-inputs span {
                margin: 0 5px;
            }
            .checkbox-group {
                display: flex;
                flex-direction: column;
                gap: 5px;
            }
        `;
        document.head.appendChild(style);
    }
}

// Generate report
function generateReport() {
    const reportType = document.getElementById('report-type').value;
    const startDate = document.getElementById('start-date').value;
    const endDate = document.getElementById('end-date').value;
    
    if (!startDate || !endDate) {
        alert('Please select a date range');
        return;
    }
    
    // Get report data based on type
    let reportData;
    let reportTitle;
    
    switch (reportType) {
        case 'patient':
            reportData = generatePatientReport(startDate, endDate);
            reportTitle = 'Patient Report';
            break;
            
        case 'appointment':
            reportData = generateAppointmentReport(startDate, endDate);
            reportTitle = 'Appointment Report';
            break;
            
        case 'billing':
            reportData = generateBillingReport(startDate, endDate);
            reportTitle = 'Billing Report';
            break;
            
        case 'staff':
            reportData = generateStaffReport(startDate, endDate);
            reportTitle = 'Staff Report';
            break;
            
        case 'financial':
            reportData = generateFinancialReport(startDate, endDate);
            reportTitle = 'Financial Report';
            break;
            
        default:
            alert('Invalid report type');
            return;
    }
    
    // Display the report
    displayReport(reportTitle, reportData);
}

// Generate patient report
function generatePatientReport(startDate, endDate) {
    const patientFilter = document.getElementById('patient-filter').value;
    const includeAppointments = document.querySelector('input[name="patient-data"][value="appointments"]').checked;
    const includeBilling = document.querySelector('input[name="patient-data"][value="billing"]').checked;
    
    // Get all patients or specific patient
    let patients = [];
    if (patientFilter === 'all') {
        patients = getAllPatients();
    } else {
        const patient = getPatientById(patientFilter);
        if (patient) {
            patients = [patient];
        }
    }
    
    // Filter data by date range
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);
    
    // Prepare report data
    const reportData = {
        summary: {
            totalPatients: patients.length,
            newPatients: 0,
            activePatients: 0
        },
        patients: [],
        charts: []
    };
    
    // Process each patient
    patients.forEach(patient => {
        const patientData = {
            id: patient.id,
            name: patient.name,
            contact: patient.contact,
            age: calculateAge(patient.dob),
            gender: patient.gender,
            appointments: [],
            billing: []
        };
        
        // Check if patient was added in the date range
        const patientAddedDate = new Date(patient.addedDate || patient.registrationDate);
        if (patientAddedDate >= startDateObj && patientAddedDate <= endDateObj) {
            reportData.summary.newPatients++;
        }
        
        // Include appointments if requested
        if (includeAppointments) {
            const appointments = getAllAppointments().filter(app => 
                app.patientId === patient.id &&
                new Date(app.date) >= startDateObj &&
                new Date(app.date) <= endDateObj
            );
            
            patientData.appointments = appointments;
            
            // If patient has appointments in the date range, consider them active
            if (appointments.length > 0) {
                reportData.summary.activePatients++;
            }
        }
        
        // Include billing if requested
        if (includeBilling) {
            const billingRecords = getAllBilling().filter(bill => 
                bill.patientId === patient.id &&
                new Date(bill.date) >= startDateObj &&
                new Date(bill.date) <= endDateObj
            );
            
            patientData.billing = billingRecords;
        }
        
        reportData.patients.push(patientData);
    });
    
    // Generate charts data
    reportData.charts.push({
        type: 'pie',
        title: 'Patient Gender Distribution',
        data: generateGenderDistributionData(reportData.patients)
    });
    
    reportData.charts.push({
        type: 'bar',
        title: 'Patient Age Distribution',
        data: generateAgeDistributionData(reportData.patients)
    });
    
    return reportData;
}

// Generate appointment report
function generateAppointmentReport(startDate, endDate) {
    const statusFilter = document.getElementById('appointment-status').value;
    const doctorFilter = document.getElementById('appointment-doctor').value;
    
    // Get all appointments
    let appointments = getAllAppointments();
    
    // Filter by date range
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);
    
    appointments = appointments.filter(app => {
        const appDate = new Date(app.date);
        return appDate >= startDateObj && appDate <= endDateObj;
    });
    
    // Filter by status if specified
    if (statusFilter !== 'all') {
        appointments = appointments.filter(app => app.status.toLowerCase() === statusFilter);
    }
    
    // Filter by doctor if specified
    if (doctorFilter !== 'all') {
        appointments = appointments.filter(app => app.doctorId === doctorFilter);
    }
    
    // Prepare report data
    const reportData = {
        summary: {
            totalAppointments: appointments.length,
            completed: appointments.filter(app => app.status.toLowerCase() === 'completed').length,
            scheduled: appointments.filter(app => app.status.toLowerCase() === 'scheduled').length,
            cancelled: appointments.filter(app => app.status.toLowerCase() === 'cancelled').length
        },
        appointments: appointments,
        charts: []
    };
    
    // Generate charts data
    reportData.charts.push({
        type: 'pie',
        title: 'Appointment Status Distribution',
        data: [
            { label: 'Completed', value: reportData.summary.completed },
            { label: 'Scheduled', value: reportData.summary.scheduled },
            { label: 'Cancelled', value: reportData.summary.cancelled }
        ]
    });
    
    reportData.charts.push({
        type: 'line',
        title: 'Appointments Over Time',
        data: generateAppointmentsOverTimeData(appointments, startDateObj, endDateObj)
    });
    
    return reportData;
}

// Generate billing report
function generateBillingReport(startDate, endDate) {
    const statusFilter = document.getElementById('billing-status').value;
    const minAmount = parseFloat(document.getElementById('billing-min').value) || 0;
    const maxAmount = parseFloat(document.getElementById('billing-max').value) || Number.MAX_SAFE_INTEGER;
    
    // Get all billing records
    let billingRecords = getAllBilling();
    
    // Filter by date range
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);
    
    billingRecords = billingRecords.filter(bill => {
        const billDate = new Date(bill.date);
        return billDate >= startDateObj && billDate <= endDateObj;
    });
    
    // Filter by status if specified
    if (statusFilter !== 'all') {
        billingRecords = billingRecords.filter(bill => bill.status.toLowerCase() === statusFilter);
    }
    
    // Filter by amount range
    billingRecords = billingRecords.filter(bill => {
        return bill.total >= minAmount && bill.total <= maxAmount;
    });
    
    // Calculate totals
    const totalAmount = billingRecords.reduce((sum, bill) => sum + bill.total, 0);
    const paidAmount = billingRecords
        .filter(bill => bill.status.toLowerCase() === 'paid')
        .reduce((sum, bill) => sum + bill.total, 0);
    const pendingAmount = billingRecords
        .filter(bill => bill.status.toLowerCase() === 'pending' || bill.status.toLowerCase() === 'overdue')
        .reduce((sum, bill) => sum + bill.total, 0);
    
    // Prepare report data
    const reportData = {
        summary: {
            totalBills: billingRecords.length,
            totalAmount: totalAmount,
            paidAmount: paidAmount,
            pendingAmount: pendingAmount,
            paid: billingRecords.filter(bill => bill.status.toLowerCase() === 'paid').length,
            pending: billingRecords.filter(bill => bill.status.toLowerCase() === 'pending').length,
            overdue: billingRecords.filter(bill => bill.status.toLowerCase() === 'overdue').length,
            partial: billingRecords.filter(bill => bill.status.toLowerCase() === 'partial').length
        },
        billingRecords: billingRecords,
        charts: []
    };
    
    // Generate charts data
    reportData.charts.push({
        type: 'pie',
        title: 'Billing Status Distribution',
        data: [
            { label: 'Paid', value: reportData.summary.paid },
            { label: 'Pending', value: reportData.summary.pending },
            { label: 'Overdue', value: reportData.summary.overdue },
            { label: 'Partial', value: reportData.summary.partial }
        ]
    });
    
    reportData.charts.push({
        type: 'bar',
        title: 'Revenue Over Time',
        data: generateRevenueOverTimeData(billingRecords, startDateObj, endDateObj)
    });
    
    return reportData;
}

// Generate staff report
function generateStaffReport(startDate, endDate) {
    const roleFilter = document.getElementById('staff-role').value;
    const includeAppointments = document.querySelector('input[name="staff-data"][value="appointments"]').checked;
    const includeSchedule = document.querySelector('input[name="staff-data"][value="schedule"]').checked;
    
    // Get all staff members
    let staffMembers = getAllStaff();
    
    // Filter by role if specified
    if (roleFilter !== 'all') {
        staffMembers = staffMembers.filter(staff => staff.role.toLowerCase() === roleFilter);
    }
    
    // Filter data by date range
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);
    
    // Prepare report data
    const reportData = {
        summary: {
            totalStaff: staffMembers.length,
            doctors: staffMembers.filter(staff => staff.role.toLowerCase() === 'doctor').length,
            nurses: staffMembers.filter(staff => staff.role.toLowerCase() === 'nurse').length,
            receptionists: staffMembers.filter(staff => staff.role.toLowerCase() === 'receptionist').length,
            admins: staffMembers.filter(staff => staff.role.toLowerCase() === 'admin').length
        },
        staffMembers: [],
        charts: []
    };
    
    // Process each staff member
    staffMembers.forEach(staff => {
        const staffData = {
            id: staff.id,
            name: staff.name,
            role: staff.role,
            contact: staff.contact,
            email: staff.email,
            appointments: [],
            schedule: []
        };
        
        // Include appointments if requested and staff is a doctor
        if (includeAppointments && staff.role.toLowerCase() === 'doctor') {
            const appointments = getAllAppointments().filter(app => 
                app.doctorId === staff.id &&
                new Date(app.date) >= startDateObj &&
                new Date(app.date) <= endDateObj
            );
            
            staffData.appointments = appointments;
        }
        
        // Include schedule if requested
        if (includeSchedule) {
            // This would require a schedule database, which we don't have yet
            // For now, we'll leave it empty
            staffData.schedule = [];
        }
        
        reportData.staffMembers.push(staffData);
    });
    
    // Generate charts data
    reportData.charts.push({
        type: 'pie',
        title: 'Staff Role Distribution',
        data: [
            { label: 'Doctors', value: reportData.summary.doctors },
            { label: 'Nurses', value: reportData.summary.nurses },
            { label: 'Receptionists', value: reportData.summary.receptionists },
            { label: 'Administrators', value: reportData.summary.admins }
        ]
    });
    
    // If we have doctors with appointments, add a chart for appointment load
    if (includeAppointments) {
        const doctorsWithAppointments = reportData.staffMembers
            .filter(staff => staff.role.toLowerCase() === 'doctor' && staff.appointments.length > 0);
            
        if (doctorsWithAppointments.length > 0) {
            reportData.charts.push({
                type: 'bar',
                title: 'Doctor Appointment Load',
                data: doctorsWithAppointments.map(doctor => ({
                    label: doctor.name,
                    value: doctor.appointments.length
                }))
            });
        }
    }
    
    return reportData;
}

// Generate financial report
function generateFinancialReport(startDate, endDate) {
    const reportType = document.getElementById('financial-type').value;
    const groupBy = document.getElementById('financial-grouping').value;
    
    // Get all billing records
    let billingRecords = getAllBilling();
    
    // Filter by date range
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);
    
    billingRecords = billingRecords.filter(bill => {
        const billDate = new Date(bill.date);
        return billDate >= startDateObj && billDate <= endDateObj;
    });
    
    // Prepare report data
    const reportData = {
        summary: {
            totalRevenue: billingRecords.reduce((sum, bill) => sum + bill.total, 0),
            paidRevenue: billingRecords
                .filter(bill => bill.status.toLowerCase() === 'paid')
                .reduce((sum, bill) => sum + bill.total, 0),
            pendingRevenue: billingRecords
                .filter(bill => bill.status.toLowerCase() !== 'paid')
                .reduce((sum, bill) => sum + bill.total, 0),
            totalBills: billingRecords.length
        },
        billingRecords: billingRecords,
        charts: []
    };
    
    // Generate charts based on report type
    if (reportType === 'revenue') {
        reportData.charts.push({
            type: 'line',
            title: 'Revenue Over Time',
            data: generateRevenueOverTimeData(billingRecords, startDateObj, endDateObj, groupBy)
        });
        
        reportData.charts.push({
            type: 'pie',
            title: 'Revenue Status',
            data: [
                { label: 'Paid', value: reportData.summary.paidRevenue },
                { label: 'Pending', value: reportData.summary.pendingRevenue }
            ]
        });
    } else if (reportType === 'services') {
        reportData.charts.push({
            type: 'bar',
            title: 'Revenue by Service',
            data: generateRevenueByServiceData(billingRecords)
        });
    }
    
    return reportData;
}

// Display report
function displayReport(title, reportData) {
    // Create a modal to display the report
    const modalContent = `
        <div class="modal-content report-modal">
            <span class="close-modal">&times;</span>
            <h2>${title}</h2>
            
            <div class="report-container">
                <div class="report-summary">
                    <h3>Summary</h3>
                    <div class="summary-cards">
                        ${generateSummaryCards(reportData.summary)}
                    </div>
                </div>
                
                <div class="report-charts">
                    <h3>Charts</h3>
                    <div class="charts-container">
                        ${reportData.charts.map((chart, index) => `
                            <div class="chart-container">
                                <h4>${chart.title}</h4>
                                <div id="chart-${index}" class="chart"></div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="report-data">
                    <h3>Data</h3>
                    <div class="data-container">
                        ${generateReportDataTable(reportData)}
                    </div>
                </div>
            </div>
            
            <div class="form-actions">
                <button type="button" class="btn secondary close-modal-btn">Close</button>
                <button type="button" class="btn primary export-report-btn">Export Report</button>
                <button type="button" class="btn print-report-btn"><i class="fas fa-print"></i> Print</button>
            </div>
        </div>
    `;
    
    // Create a temporary modal
    const tempModal = document.createElement('div');
    tempModal.className = 'modal active';
    tempModal.innerHTML = modalContent;
    
    // Add styles for report
    const style = document.createElement('style');
    style.textContent = `
        .report-modal {
            max-width: 90%;
            width: 1200px;
            max-height: 90vh;
            overflow-y: auto;
        }
        .report-container {
            display: flex;
            flex-direction: column;
            gap: 2rem;
        }
        .summary-cards {
            display: flex;
            flex-wrap: wrap;
            gap: 1rem;
            margin-top: 1rem;
        }
        .summary-card {
            background-color: #f8f9fa;
            border-radius: 8px;
            padding: 1rem;
            min-width: 150px;
            flex: 1;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .summary-card h4 {
            margin: 0 0 0.5rem 0;
            color: #555;
            font-size: 0.9rem;
        }
        .summary-card p {
            margin: 0;
            font-size: 1.5rem;
            font-weight: bold;
            color: #2c3e50;
        }
        .charts-container {
            display: flex;
            flex-wrap: wrap;
            gap: 2rem;
            margin-top: 1rem;
        }
        .chart-container {
            flex: 1;
            min-width: 300px;
            background-color: #fff;
            border-radius: 8px;
            padding: 1rem;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .chart {
            height: 300px;
            width: 100%;
        }
        .data-container {
            margin-top: 1rem;
            overflow-x: auto;
        }
        .report-table {
            width: 100%;
            border-collapse: collapse;
        }
        .report-table th, .report-table td {
            padding: 0.75rem;
            text-align: left;
            border-bottom: 1px solid #eee;
        }
        .report-table th {
            background-color: #f8f9fa;
            font-weight: bold;
        }
        @media print {
            .modal-content {
                box-shadow: none;
            }
            .form-actions {
                display: none;
            }
            .close-modal {
                display: none;
            }
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
    
    // Set up export button
    const exportButton = tempModal.querySelector('.export-report-btn');
    exportButton.addEventListener('click', function() {
        exportReport(title, reportData);
    });
    
    // Set up print button
    const printButton = tempModal.querySelector('.print-report-btn');
    printButton.addEventListener('click', function() {
        window.print();
    });
    
    // Render charts
    setTimeout(() => {
        renderCharts(reportData.charts);
    }, 100);
}

// Generate summary cards
function generateSummaryCards(summary) {
    let cards = '';
    
    for (const [key, value] of Object.entries(summary)) {
        // Format the key for display
        const formattedKey = key
            .replace(/([A-Z])/g, ' $1') // Add space before capital letters
            .replace(/^./, str => str.toUpperCase()) // Capitalize first letter
            .replace(/([a-z])([A-Z])/g, '$1 $2'); // Add space between camelCase
        
        // Format the value
        let formattedValue = value;
        if (typeof value === 'number') {
            // If it looks like money (contains 'amount', 'revenue', etc.)
            if (key.toLowerCase().includes('amount') || 
                key.toLowerCase().includes('revenue') || 
                key.toLowerCase().includes('total') && key.toLowerCase().includes('bill')) {
                formattedValue = '$' + value.toFixed(2);
            }
        }
        
        cards += `
            <div class="summary-card">
                <h4>${formattedKey}</h4>
                <p>${formattedValue}</p>
            </div>
        `;
    }
    
    return cards;
}

// Generate report data table
function generateReportDataTable(reportData) {
    // Determine what type of data we have
    if (reportData.patients && reportData.patients.length > 0) {
        return generatePatientTable(reportData.patients);
    } else if (reportData.appointments && reportData.appointments.length > 0) {
        return generateAppointmentTable(reportData.appointments);
    } else if (reportData.billingRecords && reportData.billingRecords.length > 0) {
        return generateBillingTable(reportData.billingRecords);
    } else if (reportData.staffMembers && reportData.staffMembers.length > 0) {
        return generateStaffTable(reportData.staffMembers);
    }
    
    return '<p>No data available</p>';
}

// Generate patient table
function generatePatientTable(patients) {
    return `
        <table class="report-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Age</th>
                    <th>Gender</th>
                    <th>Contact</th>
                    <th>Appointments</th>
                    <th>Billing</th>
                </tr>
            </thead>
            <tbody>
                ${patients.map(patient => `
                    <tr>
                        <td>${patient.id}</td>
                        <td>${patient.name}</td>
                        <td>${patient.age}</td>
                        <td>${patient.gender}</td>
                        <td>${patient.contact}</td>
                        <td>${patient.appointments ? patient.appointments.length : 0}</td>
                        <td>${patient.billing ? '$' + patient.billing.reduce((sum, bill) => sum + bill.total, 0).toFixed(2) : '$0.00'}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

// Generate appointment table
function generateAppointmentTable(appointments) {
    return `
        <table class="report-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Patient</th>
                    <th>Doctor</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Status</th>
                    <th>Type</th>
                </tr>
            </thead>
            <tbody>
                ${appointments.map(appointment => `
                    <tr>
                        <td>${appointment.id}</td>
                        <td>${appointment.patientName}</td>
                        <td>${appointment.doctorName}</td>
                        <td>${formatDate(appointment.date)}</td>
                        <td>${appointment.time}</td>
                        <td>${appointment.status}</td>
                        <td>${appointment.type}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

// Generate billing table
function generateBillingTable(billingRecords) {
    return `
        <table class="report-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Patient</th>
                    <th>Date</th>
                    <th>Services</th>
                    <th>Total</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                ${billingRecords.map(bill => `
                    <tr>
                        <td>${bill.id}</td>
                        <td>${bill.patientName}</td>
                        <td>${formatDate(bill.date)}</td>
                        <td>${formatServices(bill.services)}</td>
                        <td>$${bill.total.toFixed(2)}</td>
                        <td>${bill.status}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

// Generate staff table
function generateStaffTable(staffMembers) {
    return `
        <table class="report-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Role</th>
                    <th>Contact</th>
                    <th>Email</th>
                    <th>Appointments</th>
                </tr>
            </thead>
            <tbody>
                ${staffMembers.map(staff => `
                    <tr>
                        <td>${staff.id}</td>
                        <td>${staff.name}</td>
                        <td>${staff.role}</td>
                        <td>${staff.contact}</td>
                        <td>${staff.email}</td>
                        <td>${staff.appointments ? staff.appointments.length : 0}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

// Render charts
function renderCharts(charts) {
    // This function would use a charting library like Chart.js
    // For now, we'll just create placeholder elements
    charts.forEach((chart, index) => {
        const chartElement = document.getElementById(`chart-${index}`);
        if (!chartElement) return;
        
        // Create a placeholder for the chart
        chartElement.innerHTML = `
            <div class="chart-placeholder">
                <p>Chart: ${chart.title}</p>
                <p>Type: ${chart.type}</p>
                <p>Data: ${JSON.stringify(chart.data)}</p>
            </div>
        `;
    });
    
    // Add placeholder styles
    const style = document.createElement('style');
    style.textContent = `
        .chart-placeholder {
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            background-color: #f8f9fa;
            border-radius: 8px;
            padding: 1rem;
            text-align: center;
        }
        .chart-placeholder p {
            margin: 0.5rem 0;
        }
    `;
    document.head.appendChild(style);
}

// Export report
function exportReport(title, reportData) {
    // Create CSV content
    let csvContent = `"${title}\n"`;
    
    // Add summary
    csvContent += '\n"Summary"\n';
    for (const [key, value] of Object.entries(reportData.summary)) {
        const formattedKey = key
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, str => str.toUpperCase())
            .replace(/([a-z])([A-Z])/g, '$1 $2');
            
        csvContent += `"${formattedKey}","${value}"\n`;
    }
    
    // Add data
    if (reportData.patients && reportData.patients.length > 0) {
        csvContent += '\n"Patients"\n';
        csvContent += '"ID","Name","Age","Gender","Contact","Appointments","Billing"\n';
        
        reportData.patients.forEach(patient => {
            csvContent += `"${patient.id}","${patient.name}","${patient.age}","${patient.gender}","${patient.contact}","${patient.appointments ? patient.appointments.length : 0}","${patient.billing ? patient.billing.reduce((sum, bill) => sum + bill.total, 0).toFixed(2) : '0.00'}"\n`;
        });
    } else if (reportData.appointments && reportData.appointments.length > 0) {
        csvContent += '\n"Appointments"\n';
        csvContent += '"ID","Patient","Doctor","Date","Time","Status","Type"\n';
        
        reportData.appointments.forEach(appointment => {
            csvContent += `"${appointment.id}","${appointment.patientName}","${appointment.doctorName}","${formatDate(appointment.date)}","${appointment.time}","${appointment.status}","${appointment.type}"\n`;
        });
    } else if (reportData.billingRecords && reportData.billingRecords.length > 0) {
        csvContent += '\n"Billing Records"\n';
        csvContent += '"ID","Patient","Date","Total","Status"\n';
        
        reportData.billingRecords.forEach(bill => {
            csvContent += `"${bill.id}","${bill.patientName}","${formatDate(bill.date)}","${bill.total.toFixed(2)}","${bill.status}"\n`;
        });
    } else if (reportData.staffMembers && reportData.staffMembers.length > 0) {
        csvContent += '\n"Staff Members"\n';
        csvContent += '"ID","Name","Role","Contact","Email","Appointments"\n';
        
        reportData.staffMembers.forEach(staff => {
            csvContent += `"${staff.id}","${staff.name}","${staff.role}","${staff.contact}","${staff.email}","${staff.appointments ? staff.appointments.length : 0}"\n`;
        });
    }
    
    // Create a download link
    const encodedUri = encodeURI('data:text/csv;charset=utf-8,' + csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${title.replace(/\s+/g, '_')}_${formatDateForFilename(new Date())}.csv`);
    document.body.appendChild(link);
    
    // Trigger download and remove link
    link.click();
    document.body.removeChild(link);
}

// Format date for filename
function formatDateForFilename(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Setup report export
function setupReportExport() {
    const exportCsvBtn = document.getElementById('export-csv-btn');
    if (exportCsvBtn) {
        exportCsvBtn.addEventListener('click', function() {
            exportReportToCSV();
        });
    }
    
    const exportExcelBtn = document.getElementById('export-excel-btn');
    if (exportExcelBtn) {
        exportExcelBtn.addEventListener('click', function() {
            exportReportToExcel();
        });
    }
}

// Export report to CSV
function exportReportToCSV() {
    // Get current report type
    const reportType = document.getElementById('report-type').value;
    exportToCSV(reportType);
}

// Export report to Excel
function exportReportToExcel() {
    // Get current report type
    const reportType = document.getElementById('report-type').value;
    exportToExcel(reportType);
}

// Helper functions for chart data generation

// Generate gender distribution data
function generateGenderDistributionData(patients) {
    const genderCounts = {
        'Male': 0,
        'Female': 0,
        'Other': 0
    };
    
    patients.forEach(patient => {
        const gender = patient.gender || 'Other';
        if (genderCounts.hasOwnProperty(gender)) {
            genderCounts[gender]++;
        } else {
            genderCounts['Other']++;
        }
    });
    
    return Object.entries(genderCounts).map(([label, value]) => ({ label, value }));
}

// Generate age distribution data
function generateAgeDistributionData(patients) {
    const ageGroups = {
        '0-18': 0,
        '19-35': 0,
        '36-50': 0,
        '51-65': 0,
        '65+': 0
    };
    
    patients.forEach(patient => {
        const age = patient.age || 0;
        
        if (age <= 18) {
            ageGroups['0-18']++;
        } else if (age <= 35) {
            ageGroups['19-35']++;
        } else if (age <= 50) {
            ageGroups['36-50']++;
        } else if (age <= 65) {
            ageGroups['51-65']++;
        } else {
            ageGroups['65+']++;
        }
    });
    
    return Object.entries(ageGroups).map(([label, value]) => ({ label, value }));
}

// Generate appointments over time data
function generateAppointmentsOverTimeData(appointments, startDate, endDate) {
    // Group appointments by date
    const appointmentsByDate = {};
    
    // Create date range
    const dateRange = getDatesInRange(startDate, endDate);
    dateRange.forEach(date => {
        appointmentsByDate[formatDate(date)] = 0;
    });
    
    // Count appointments by date
    appointments.forEach(appointment => {
        const date = formatDate(appointment.date);
        if (appointmentsByDate.hasOwnProperty(date)) {
            appointmentsByDate[date]++;
        }
    });
    
    return Object.entries(appointmentsByDate).map(([label, value]) => ({ label, value }));
}

// Generate revenue over time data
function generateRevenueOverTimeData(billingRecords, startDate, endDate, groupBy = 'day') {
    // Group billing records by date
    const revenueByDate = {};
    
    // Create date range based on grouping
    let dateRange;
    if (groupBy === 'day') {
        dateRange = getDatesInRange(startDate, endDate);
        dateRange.forEach(date => {
            revenueByDate[formatDate(date)] = 0;
        });
        
        // Sum revenue by date
        billingRecords.forEach(bill => {
            const date = formatDate(bill.date);
            if (revenueByDate.hasOwnProperty(date)) {
                revenueByDate[date] += bill.total;
            }
        });
    } else if (groupBy === 'week') {
        // Group by week
        const weekMap = {};
        
        billingRecords.forEach(bill => {
            const billDate = new Date(bill.date);
            const weekStart = getWeekStart(billDate);
            const weekKey = formatDate(weekStart);
            
            if (!weekMap[weekKey]) {
                weekMap[weekKey] = 0;
            }
            
            weekMap[weekKey] += bill.total;
        });
        
        // Sort weeks
        const sortedWeeks = Object.keys(weekMap).sort((a, b) => new Date(a) - new Date(b));
        sortedWeeks.forEach(week => {
            revenueByDate[`Week of ${week}`] = weekMap[week];
        });
    } else if (groupBy === 'month') {
        // Group by month
        const monthMap = {};
        
        billingRecords.forEach(bill => {
            const billDate = new Date(bill.date);
            const monthKey = `${billDate.getFullYear()}-${String(billDate.getMonth() + 1).padStart(2, '0')}`;
            const monthLabel = `${getMonthName(billDate.getMonth())} ${billDate.getFullYear()}`;
            
            if (!monthMap[monthLabel]) {
                monthMap[monthLabel] = 0;
            }
            
            monthMap[monthLabel] += bill.total;
        });
        
        // Sort months
        const sortedMonths = Object.keys(monthMap).sort((a, b) => {
            const [aMonth, aYear] = a.split(' ');
            const [bMonth, bYear] = b.split(' ');
            
            if (aYear !== bYear) {
                return parseInt(aYear) - parseInt(bYear);
            }
            
            return getMonthIndex(aMonth) - getMonthIndex(bMonth);
        });
        
        sortedMonths.forEach(month => {
            revenueByDate[month] = monthMap[month];
        });
    }
    
    return Object.entries(revenueByDate).map(([label, value]) => ({ label, value }));
}

// Generate revenue by service data
function generateRevenueByServiceData(billingRecords) {
    // Group by service
    const serviceRevenue = {};
    
    billingRecords.forEach(bill => {
        if (bill.services && bill.services.length > 0) {
            bill.services.forEach(service => {
                if (!serviceRevenue[service.name]) {
                    serviceRevenue[service.name] = 0;
                }
                
                serviceRevenue[service.name] += service.cost;
            });
        }
    });
    
    // Sort services by revenue (descending)
    const sortedServices = Object.entries(serviceRevenue)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10) // Top 10 services
        .map(([label, value]) => ({ label, value }));
    
    return sortedServices;
}

// Helper functions

// Get dates in range
function getDatesInRange(startDate, endDate) {
    const dates = [];
    let currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
        dates.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return dates;
}

// Get week start date
function getWeekStart(date) {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Adjust for Sunday
    return new Date(date.setDate(diff));
}

// Get month name
function getMonthName(monthIndex) {
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    return months[monthIndex];
}

// Get month index
function getMonthIndex(monthName) {
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    return months.indexOf(monthName);
}

// Calculate age from date of birth
function calculateAge(dob) {
    if (!dob) return 0;
    
    const birthDate = new Date(dob);
    const today = new Date();
    
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    
    return age;
}