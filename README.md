# Hospital Management System

## Overview
This Hospital Management System is a web-based application that uses a spreadsheet-like database to manage hospital operations. It provides modules for patient management, appointment scheduling, staff management, billing, and reporting.

## Images

<img width="1919" height="903" alt="image" src="https://github.com/user-attachments/assets/e94da218-8833-4fc3-afa1-bd8b49dbce47" />

<img width="1916" height="903" alt="image" src="https://github.com/user-attachments/assets/d735f70e-4628-4f55-8fb6-7e6d66e375f4" />

<img width="1919" height="907" alt="image" src="https://github.com/user-attachments/assets/65149b42-3961-470c-9d44-4fbc1a1577e2" />

<img width="1919" height="911" alt="image" src="https://github.com/user-attachments/assets/24d749aa-593a-4d55-9f9b-9995cc8235a8" />

<img width="1918" height="895" alt="image" src="https://github.com/user-attachments/assets/df2ab7ee-faf4-415e-a4d4-f6e1bd7d6c68" />

<img width="1919" height="910" alt="image" src="https://github.com/user-attachments/assets/29cb81d8-ef85-42c0-9da7-781746d0a712" />

## Features

### Dashboard
- Overview of hospital statistics  
- Recent activities  
- Quick access to all modules  

### Patient Management
- Add, edit, and delete patient records  
- View patient history  
- Search patients by name, ID, or other criteria  
- Export patient data to CSV/Excel  

### Appointment Scheduling
- Schedule new appointments  
- View appointments by day, week, or month  
- Filter appointments by doctor, patient, or status  
- Send appointment reminders  
- Export appointment data to CSV/Excel  

### Staff Management
- Manage doctors, nurses, and administrative staff  
- Track staff schedules  
- Assign staff to departments  
- Export staff data to CSV/Excel  

### Billing and Payments
- Generate bills for services  
- Track payment status  
- Generate invoices  
- Export billing data to CSV/Excel  

### Reporting
- Generate various reports (patient, appointment, billing, staff, financial)  
- Visualize data with charts  
- Export reports to CSV/Excel  
- Print reports  

## Technical Details

### Database
The system uses a spreadsheet-like database implemented with JavaScript objects and localStorage. This approach allows for:
- Easy data management without requiring a server  
- Data persistence between sessions  
- Import/export functionality with CSV/Excel  

### Technologies Used
- HTML5  
- CSS3  
- JavaScript (ES6+)  
- LocalStorage for data persistence  

## Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)

### Installation
1. Clone or download the repository
2. Open `index.html` in your web browser

### Initial Setup
On first run, the system will create a sample database with:
- Demo patients  
- Sample appointments  
- Staff records  
- Billing examples  

You can clear this data and start fresh by clicking the **"Reset Database"** button in the settings.

## Usage

### Navigation
Use the sidebar menu to navigate between different modules:
- Dashboard  
- Patients  
- Appointments  
- Staff  
- Billing  
- Reports  

### Data Management
- Add new records using the **"Add"** button in each module  
- Edit records by clicking the edit icon  
- Delete records by clicking the delete icon  
- Search records using the search bar  
- Export data using the export buttons  

### Reports
1. Go to the Reports module  
2. Select the report type  
3. Choose the date range and other filters  
4. Click **"Generate Report"**  
5. View, print, or export the report  

## Data Security
All data is stored locally in your browser's localStorage. This means:
- Data doesn't leave your computer  
- No internet connection is required after initial load  
- Data persists between sessions  
- Clearing browser data will erase the database  

## Limitations
- localStorage has a size limit (usually 5–10MB)  
- Data is not synchronized between devices  
- Not suitable for multi-user environments without modifications  

## Future Enhancements
- Cloud synchronization  
- Multi-user support  
- Mobile application  
- Integration with medical devices  
- Prescription management  
- Inventory management  

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments
- Icons by [Font Awesome](https://fontawesome.com)  
- Inspired by modern healthcare management systems
