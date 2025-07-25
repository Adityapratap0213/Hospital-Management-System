// Main Application Script

// Initialize the application when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the database
    initDatabase();
    
    // Initialize directory structure
    if (typeof initDirectoryStructure === 'function') {
        initDirectoryStructure();
    }
    
    // Initialize the application
    initApp();
    
    // Load the dashboard by default
    loadModule('dashboard');
    
    // Set up navigation
    setupNavigation();
    
    // Set up global event listeners
    setupGlobalEventListeners();
});

// Set up navigation
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links
            navLinks.forEach(link => link.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Get the module name from the data attribute
            const module = this.getAttribute('data-module');
            
            // Load the module
            loadModule(module);
        });
    });
}

// Load a module
function loadModule(moduleName) {
    const mainContent = document.getElementById('main-content');
    
    // Show loading indicator
    mainContent.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> Loading...</div>';
    
    // Determine which HTML file to load based on the module name
    let htmlFile;
    
    switch(moduleName) {
        case 'dashboard':
            htmlFile = 'dashboard.html';
            break;
        case 'patients':
            htmlFile = 'patients.html';
            break;
        case 'appointments':
            htmlFile = 'appointments.html';
            break;
        case 'staff':
            htmlFile = 'staff.html';
            break;
        case 'billing':
            htmlFile = 'billing.html';
            break;
        case 'reports':
            htmlFile = 'reports.html';
            break;
        default:
            htmlFile = 'dashboard.html';
    }
    
    // Fetch the HTML file
    fetch(htmlFile)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to load ${htmlFile}`);
            }
            return response.text();
        })
        .then(html => {
            // Update the main content
            mainContent.innerHTML = html;
            
            // Initialize module-specific functionality
            initializeModule(moduleName);
            
            // Update the page title
            updatePageTitle(moduleName);
            
            // Add to browser history
            updateBrowserHistory(moduleName);
        })
        .catch(error => {
            console.error('Error loading module:', error);
            mainContent.innerHTML = `<div class="error"><i class="fas fa-exclamation-triangle"></i> Error loading module: ${error.message}</div>`;
        });
}

// Initialize module-specific functionality
function initializeModule(moduleName) {
    switch(moduleName) {
        case 'dashboard':
            // Update dashboard statistics
            updateDashboardStats();
            // Load recent activities
            loadRecentActivities();
            break;
        case 'patients':
            // Load patient data
            loadPatientData();
            break;
        case 'appointments':
            // Load appointment data
            loadAppointmentData();
            break;
        case 'staff':
            // Load staff data
            loadStaffData();
            break;
        case 'billing':
            // Load billing data
            loadBillingData();
            break;
        case 'reports':
            // Reports module is initialized by its own script
            break;
    }
}

// Update the page title
function updatePageTitle(moduleName) {
    // Format the module name (capitalize first letter)
    const formattedName = moduleName.charAt(0).toUpperCase() + moduleName.slice(1);
    document.title = `${formattedName} | Hospital Management System`;
}

// Update browser history
function updateBrowserHistory(moduleName) {
    // Create a URL with the module as a query parameter
    const url = new URL(window.location.href);
    url.searchParams.set('module', moduleName);
    
    // Update the browser history
    window.history.pushState({ module: moduleName }, '', url);
}

// Handle browser back/forward buttons
window.addEventListener('popstate', function(event) {
    if (event.state && event.state.module) {
        loadModule(event.state.module);
        
        // Update active nav link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => link.classList.remove('active'));
        
        const activeLink = document.querySelector(`.nav-link[data-module="${event.state.module}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }
});

// Set up global event listeners
function setupGlobalEventListeners() {
    // Close modal when clicking outside of it
    const modalContainer = document.getElementById('modal-container');
    modalContainer.addEventListener('click', function(e) {
        if (e.target === this) {
            this.classList.remove('active');
            
            // Hide all modals
            const modals = document.querySelectorAll('.modal');
            modals.forEach(modal => modal.classList.remove('active'));
        }
    });
    
    // Set up global close modal buttons
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('close-modal') || e.target.classList.contains('close-modal-btn')) {
            modalContainer.classList.remove('active');
            
            // Hide all modals
            const modals = document.querySelectorAll('.modal');
            modals.forEach(modal => modal.classList.remove('active'));
        }
    });
    
    // Handle initial URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const moduleParam = urlParams.get('module');
    
    if (moduleParam) {
        // Load the specified module
        loadModule(moduleParam);
        
        // Update active nav link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => link.classList.remove('active'));
        
        const activeLink = document.querySelector(`.nav-link[data-module="${moduleParam}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }
}

// Check if the app is being run locally
function isRunningLocally() {
    return window.location.protocol === 'file:';
}

// Handle fetch errors for local files
function handleLocalFetch(htmlFile) {
    // For local development, we'll use a different approach
    // since fetch doesn't work with file:// protocol
    const xhr = new XMLHttpRequest();
    
    return new Promise((resolve, reject) => {
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                if (xhr.status === 200 || xhr.status === 0) {
                    resolve(xhr.responseText);
                } else {
                    reject(new Error(`Failed to load ${htmlFile}`));
                }
            }
        };
        
        xhr.open('GET', htmlFile, true);
        xhr.send();
    });
}