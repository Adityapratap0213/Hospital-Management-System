// Database Management using Spreadsheets

// Database structure
const DB = {
    patients: [],
    appointments: [],
    staff: [],
    billing: [],
    activities: []
};

// Initialize the database
function initDatabase() {
    // Load data from localStorage if available
    loadFromLocalStorage();
    
    // If no data exists, create sample data
    if (DB.patients.length === 0) createSampleData();
}

// Load data from localStorage
function loadFromLocalStorage() {
    try {
        // Load each collection from localStorage
        const patients = localStorage.getItem('hms_patients');
        const appointments = localStorage.getItem('hms_appointments');
        const staff = localStorage.getItem('hms_staff');
        const billing = localStorage.getItem('hms_billing');
        const activities = localStorage.getItem('hms_activities');
        
        // Parse JSON data if it exists
        if (patients) DB.patients = JSON.parse(patients);
        if (appointments) DB.appointments = JSON.parse(appointments);
        if (staff) DB.staff = JSON.parse(staff);
        if (billing) DB.billing = JSON.parse(billing);
        if (activities) DB.activities = JSON.parse(activities);
        
        console.log('Data loaded from localStorage');
    } catch (error) {
        console.error('Error loading data from localStorage:', error);
    }
}

// Save data to localStorage
function saveToLocalStorage() {
    try {
        // Save each collection to localStorage
        localStorage.setItem('hms_patients', JSON.stringify(DB.patients));
        localStorage.setItem('hms_appointments', JSON.stringify(DB.appointments));
        localStorage.setItem('hms_staff', JSON.stringify(DB.staff));
        localStorage.setItem('hms_billing', JSON.stringify(DB.billing));
        localStorage.setItem('hms_activities', JSON.stringify(DB.activities));
        
        console.log('Data saved to localStorage');
    } catch (error) {
        console.error('Error saving data to localStorage:', error);
    }
}

// Export database to CSV
function exportToCSV(collection) {
    if (!DB[collection] || DB[collection].length === 0) {
        alert('No data to export');
        return;
    }
    
    // Get the data
    const data = DB[collection];
    
    // Get the headers (keys of the first object)
    const headers = Object.keys(data[0]);
    
    // Create CSV content
    let csvContent = headers.join(',') + '\n';
    
    // Add data rows
    data.forEach(item => {
        const row = headers.map(header => {
            // Handle values that might contain commas or quotes
            let value = item[header];
            if (typeof value === 'string') {
                // Escape quotes and wrap in quotes if contains comma or quote
                if (value.includes('"') || value.includes(',')) {
                    value = '"' + value.replace(/"/g, '""') + '"';
                }
            } else if (value === null || value === undefined) {
                value = '';
            }
            return value;
        }).join(',');
        
        csvContent += row + '\n';
    });
    
    // Create a download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${collection}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Import data from CSV
function importFromCSV(collection, csvText) {
    try {
        // Split the CSV text into lines
        const lines = csvText.split('\n');
        
        // Get the headers from the first line
        const headers = lines[0].split(',');
        
        // Parse the data rows
        const data = [];
        for (let i = 1; i < lines.length; i++) {
            if (lines[i].trim() === '') continue;
            
            const values = parseCSVLine(lines[i]);
            const item = {};
            
            headers.forEach((header, index) => {
                item[header] = values[index];
            });
            
            data.push(item);
        }
        
        // Update the database
        DB[collection] = data;
        
        // Save to localStorage
        saveToLocalStorage();
        
        // Refresh the UI
        refreshUI();
        
        alert(`${data.length} ${collection} imported successfully`);
    } catch (error) {
        console.error('Error importing CSV:', error);
        alert('Error importing CSV. Please check the file format.');
    }
}

// Parse a CSV line handling quoted values
function parseCSVLine(line) {
    const values = [];
    let inQuotes = false;
    let currentValue = '';
    
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        
        if (char === '"') {
            if (inQuotes && i + 1 < line.length && line[i + 1] === '"') {
                // Double quotes inside quotes - add a single quote
                currentValue += '"';
                i++;
            } else {
                // Toggle quotes mode
                inQuotes = !inQuotes;
            }
        } else if (char === ',' && !inQuotes) {
            // End of value
            values.push(currentValue);
            currentValue = '';
        } else {
            // Add character to current value
            currentValue += char;
        }
    }
    
    // Add the last value
    values.push(currentValue);
    
    return values;
}

// Refresh the UI after data changes
function refreshUI() {
    // Refresh all data displays
    loadDashboardData();
    loadPatientsData();
    loadAppointmentsData();
    loadStaffData();
    loadBillingData();
}

// Create sample data for testing
function createSampleData() {
    // Sample patients
    DB.patients = [
        { id: 'p1', name: 'John Smith', age: 45, gender: 'Male', contact: '555-1234', email: 'john@example.com', address: '123 Main St', medicalHistory: 'Hypertension', lastVisit: '2023-05-15' },
        { id: 'p2', name: 'Jane Doe', age: 32, gender: 'Female', contact: '555-5678', email: 'jane@example.com', address: '456 Oak Ave', medicalHistory: 'Diabetes', lastVisit: '2023-06-20' },
        { id: 'p3', name: 'Robert Johnson', age: 58, gender: 'Male', contact: '555-9012', email: 'robert@example.com', address: '789 Pine Rd', medicalHistory: 'Arthritis', lastVisit: '2023-07-05' }
    ];
    
    // Sample staff
    DB.staff = [
        { id: 's1', name: 'Dr. Sarah Wilson', role: 'Doctor', department: 'General Medicine', contact: '555-1111', email: 'sarah@hospital.com', address: '101 Medical Center', status: 'Active' },
        { id: 's2', name: 'Dr. Michael Chen', role: 'Doctor', department: 'Cardiology', contact: '555-2222', email: 'michael@hospital.com', address: '101 Medical Center', status: 'Active' },
        { id: 's3', name: 'Nurse Emily Davis', role: 'Nurse', department: 'General Medicine', contact: '555-3333', email: 'emily@hospital.com', address: '202 Nurse Quarters', status: 'Active' },
        { id: 's4', name: 'Admin Lisa Johnson', role: 'Administrator', department: 'Administration', contact: '555-4444', email: 'lisa@hospital.com', address: '303 Admin Building', status: 'Active' }
    ];
    
    // Sample appointments
    DB.appointments = [
        { id: 'a1', patientId: 'p1', doctorId: 's1', patientName: 'John Smith', doctorName: 'Dr. Sarah Wilson', date: '2023-08-15', time: '09:00', status: 'Completed', reason: 'Regular checkup' },
        { id: 'a2', patientId: 'p2', doctorId: 's2', patientName: 'Jane Doe', doctorName: 'Dr. Michael Chen', date: '2023-08-16', time: '10:30', status: 'Scheduled', reason: 'Heart palpitations' },
        { id: 'a3', patientId: 'p3', doctorId: 's1', patientName: 'Robert Johnson', doctorName: 'Dr. Sarah Wilson', date: '2023-08-17', time: '14:00', status: 'Scheduled', reason: 'Joint pain' }
    ];
    
    // Sample billing
    DB.billing = [
        { id: 'b1', patientId: 'p1', patientName: 'John Smith', date: '2023-08-15', services: [{name: 'Consultation', cost: 100}, {name: 'Blood Test', cost: 75}], subtotal: 175, tax: 8.75, total: 183.75, status: 'Paid' },
        { id: 'b2', patientId: 'p2', patientName: 'Jane Doe', date: '2023-08-16', services: [{name: 'Consultation', cost: 100}, {name: 'ECG', cost: 150}], subtotal: 250, tax: 12.5, total: 262.5, status: 'Pending' }
    ];
    
    // Sample activities
    DB.activities = [
        { time: '2023-08-15 09:15', description: 'Patient John Smith checked in' },
        { time: '2023-08-15 10:30', description: 'Dr. Sarah Wilson completed appointment with John Smith' },
        { time: '2023-08-16 10:45', description: 'New appointment scheduled for Jane Doe' }
    ];
    
    // Save to localStorage
    saveToLocalStorage();
    
    console.log('Sample data created');
}

// Get all patients
function getAllPatients() {
    return DB.patients;
}

// Get patient by ID
function getPatientById(id) {
    return DB.patients.find(patient => patient.id === id);
}

// Add or update patient
function savePatientToDatabase(patient) {
    // If patient has an ID, update existing patient
    if (patient.id) {
        const index = DB.patients.findIndex(p => p.id === patient.id);
        if (index !== -1) {
            DB.patients[index] = patient;
        }
    } else {
        // New patient, generate ID
        patient.id = 'p' + generateId();
        DB.patients.push(patient);
    }
    
    // Save to localStorage
    saveToLocalStorage();
    
    return patient;
}

// Delete patient
function deletePatient(id) {
    const index = DB.patients.findIndex(patient => patient.id === id);
    if (index !== -1) {
        DB.patients.splice(index, 1);
        saveToLocalStorage();
        return true;
    }
    return false;
}

// Get all appointments
function getAllAppointments() {
    return DB.appointments;
}

// Get appointment by ID
function getAppointmentById(id) {
    return DB.appointments.find(appointment => appointment.id === id);
}

// Get today's appointments
function getTodayAppointments() {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    return DB.appointments.filter(appointment => appointment.date === today);
}

// Add or update appointment
function saveAppointmentToDatabase(appointment) {
    // If appointment has an ID, update existing appointment
    if (appointment.id) {
        const index = DB.appointments.findIndex(a => a.id === appointment.id);
        if (index !== -1) {
            DB.appointments[index] = appointment;
        }
    } else {
        // New appointment, generate ID
        appointment.id = 'a' + generateId();
        DB.appointments.push(appointment);
    }
    
    // Save to localStorage
    saveToLocalStorage();
    
    return appointment;
}

// Delete appointment
function deleteAppointment(id) {
    const index = DB.appointments.findIndex(appointment => appointment.id === id);
    if (index !== -1) {
        DB.appointments.splice(index, 1);
        saveToLocalStorage();
        return true;
    }
    return false;
}

// Get all staff
function getAllStaff() {
    return DB.staff;
}

// Get all doctors (staff with role = Doctor)
function getAllDoctors() {
    return DB.staff.filter(staff => staff.role === 'Doctor');
}

// Get staff by ID
function getStaffById(id) {
    return DB.staff.find(staff => staff.id === id);
}

// Add or update staff
function saveStaffToDatabase(staff) {
    // If staff has an ID, update existing staff
    if (staff.id) {
        const index = DB.staff.findIndex(s => s.id === staff.id);
        if (index !== -1) {
            DB.staff[index] = staff;
        }
    } else {
        // New staff, generate ID
        staff.id = 's' + generateId();
        DB.staff.push(staff);
    }
    
    // Save to localStorage
    saveToLocalStorage();
    
    return staff;
}

// Delete staff
function deleteStaff(id) {
    const index = DB.staff.findIndex(staff => staff.id === id);
    if (index !== -1) {
        DB.staff.splice(index, 1);
        saveToLocalStorage();
        return true;
    }
    return false;
}

// Get all billing records
function getAllBilling() {
    return DB.billing;
}

// Get billing by ID
function getBillingById(id) {
    return DB.billing.find(bill => bill.id === id);
}

// Add or update billing
function saveBillingToDatabase(bill) {
    // If bill has an ID, update existing bill
    if (bill.id) {
        const index = DB.billing.findIndex(b => b.id === bill.id);
        if (index !== -1) {
            DB.billing[index] = bill;
        }
    } else {
        // New bill, generate ID
        bill.id = 'b' + generateId();
        DB.billing.push(bill);
    }
    
    // Save to localStorage
    saveToLocalStorage();
    
    return bill;
}

// Delete billing
function deleteBilling(id) {
    const index = DB.billing.findIndex(bill => bill.id === id);
    if (index !== -1) {
        DB.billing.splice(index, 1);
        saveToLocalStorage();
        return true;
    }
    return false;
}

// Get recent activities
function getRecentActivities(limit = 10) {
    return DB.activities.slice(0, limit);
}

// Add activity to database
function addActivityToDatabase(activity) {
    // Add to beginning of array
    DB.activities.unshift(activity);
    
    // Limit the size of activities array
    if (DB.activities.length > 100) {
        DB.activities = DB.activities.slice(0, 100);
    }
    
    // Save to localStorage
    saveToLocalStorage();
    
    return activity;
}

// Get counts for dashboard
function getPatientCount() {
    return DB.patients.length;
}

function getTodayAppointmentCount() {
    return getTodayAppointments().length;
}

function getStaffCount() {
    return DB.staff.length;
}

function getPendingBillCount() {
    return DB.billing.filter(bill => bill.status === 'Pending').length;
}

// Export data to Excel-like format
function exportToExcel(collection) {
    if (!DB[collection] || DB[collection].length === 0) {
        alert('No data to export');
        return;
    }
    
    // Create a workbook with a worksheet for the collection
    const workbook = {
        SheetNames: [collection],
        Sheets: {}
    };
    
    // Get the data
    const data = DB[collection];
    
    // Convert data to worksheet format
    const worksheet = {};
    const range = { s: { c: 0, r: 0 }, e: { c: 0, r: data.length } };
    
    // Get all unique keys from all objects
    const keys = new Set();
    data.forEach(item => {
        Object.keys(item).forEach(key => keys.add(key));
    });
    
    const keysArray = Array.from(keys);
    range.e.c = keysArray.length - 1;
    
    // Add headers
    keysArray.forEach((key, colIndex) => {
        const cellRef = getCellRef(0, colIndex);
        worksheet[cellRef] = { v: key, t: 's' };
    });
    
    // Add data
    data.forEach((item, rowIndex) => {
        keysArray.forEach((key, colIndex) => {
            const cellRef = getCellRef(rowIndex + 1, colIndex);
            const value = item[key];
            
            if (value !== undefined && value !== null) {
                let cellType = 's'; // Default to string
                let cellValue = value;
                
                if (typeof value === 'number') {
                    cellType = 'n';
                } else if (typeof value === 'boolean') {
                    cellType = 'b';
                } else if (value instanceof Date) {
                    cellType = 'd';
                } else if (typeof value === 'object') {
                    cellValue = JSON.stringify(value);
                }
                
                worksheet[cellRef] = { v: cellValue, t: cellType };
            }
        });
    });
    
    // Set worksheet range
    worksheet['!ref'] = `A1:${getCellRef(data.length, keysArray.length - 1)}`;
    
    // Add worksheet to workbook
    workbook.Sheets[collection] = worksheet;
    
    // Convert to CSV for simplicity (since we're not using actual Excel libraries)
    exportToCSV(collection);
}

// Helper function to get cell reference (A1, B2, etc.)
function getCellRef(row, col) {
    const a = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let colRef = '';
    
    if (col < 26) {
        colRef = a[col];
    } else {
        colRef = a[Math.floor(col / 26) - 1] + a[col % 26];
    }
    
    return colRef + (row + 1);
}

// Import data from Excel-like format
function importFromExcel(collection, fileContent) {
    // For simplicity, we'll just use the CSV import function
    importFromCSV(collection, fileContent);
}