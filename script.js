// Healthcare Management System - Main JavaScript File

// Global variables and initialization
let currentPage = 1;
let itemsPerPage = 10;
let currentFilter = 'all';
let currentEditId = null;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeDatabase();
    initializePage();
    loadSampleData();
    updateStatistics();
});

// Database Management
class HealthcareDatabase {
    constructor() {
        this.keys = {
            patients: 'healthcare_patients',
            doctors: 'healthcare_doctors',
            appointments: 'healthcare_appointments',
            contacts: 'healthcare_contacts'
        };
    }

    // Generic database operations
    getAll(key) {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : [];
    }

    save(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    }

    add(key, item) {
        const data = this.getAll(key);
        data.push(item);
        this.save(key, data);
        return item;
    }

    update(key, id, updatedItem) {
        const data = this.getAll(key);
        const index = data.findIndex(item => item.id === id);
        if (index !== -1) {
            data[index] = { ...data[index], ...updatedItem };
            this.save(key, data);
            return data[index];
        }
        return null;
    }

    delete(key, id) {
        const data = this.getAll(key);
        const filteredData = data.filter(item => item.id !== id);
        this.save(key, filteredData);
        return filteredData.length < data.length;
    }

    getById(key, id) {
        const data = this.getAll(key);
        return data.find(item => item.id === id);
    }

    search(key, searchTerm, fields) {
        const data = this.getAll(key);
        return data.filter(item => {
            return fields.some(field => {
                const value = item[field]?.toString().toLowerCase() || '';
                return value.includes(searchTerm.toLowerCase());
            });
        });
    }
}

// Initialize database instance
const db = new HealthcareDatabase();

// Initialize the database
function initializeDatabase() {
    // Initialize with empty arrays if not exists
    Object.values(db.keys).forEach(key => {
        if (!localStorage.getItem(key)) {
            localStorage.setItem(key, JSON.stringify([]));
        }
    });
}

// Load sample data for demonstration
function loadSampleData() {
    const patients = db.getAll(db.keys.patients);
    const doctors = db.getAll(db.keys.doctors);
    const appointments = db.getAll(db.keys.appointments);

    // Only load sample data if database is empty
    if (patients.length === 0) {
        const samplePatients = [
            {
                id: 'P001',
                firstName: 'John',
                lastName: 'Smith',
                dateOfBirth: '1985-03-15',
                gender: 'male',
                phone: '+1-555-0101',
                email: 'john.smith@email.com',
                address: '123 Main St, Health City, HC 12345',
                status: 'active',
                bloodType: 'A+',
                allergies: 'Pollen',
                conditions: 'Hypertension',
                medications: 'Lisinopril 10mg',
                emergencyName: 'Jane Smith',
                emergencyRelationship: 'Spouse',
                emergencyPhone: '+1-555-0102',
                emergencyEmail: 'jane.smith@email.com',
                createdAt: new Date().toISOString(),
                lastUpdated: new Date().toISOString()
            },
            {
                id: 'P002',
                firstName: 'Sarah',
                lastName: 'Johnson',
                dateOfBirth: '1990-07-22',
                gender: 'female',
                phone: '+1-555-0103',
                email: 'sarah.johnson@email.com',
                address: '456 Oak Ave, Health City, HC 12345',
                status: 'active',
                bloodType: 'O+',
                allergies: '',
                conditions: '',
                medications: '',
                emergencyName: 'Mike Johnson',
                emergencyRelationship: 'Father',
                emergencyPhone: '+1-555-0104',
                emergencyEmail: 'mike.johnson@email.com',
                createdAt: new Date().toISOString(),
                lastUpdated: new Date().toISOString()
            },
            {
                id: 'P003',
                firstName: 'Michael',
                lastName: 'Brown',
                dateOfBirth: '1978-12-03',
                gender: 'male',
                phone: '+1-555-0105',
                email: 'michael.brown@email.com',
                address: '789 Pine St, Health City, HC 12345',
                status: 'inactive',
                bloodType: 'B+',
                allergies: 'Shellfish',
                conditions: 'Diabetes Type 2',
                medications: 'Metformin 500mg',
                emergencyName: 'Lisa Brown',
                emergencyRelationship: 'Wife',
                emergencyPhone: '+1-555-0106',
                emergencyEmail: 'lisa.brown@email.com',
                createdAt: new Date().toISOString(),
                lastUpdated: new Date().toISOString()
            }
        ];

        samplePatients.forEach(patient => db.add(db.keys.patients, patient));
    }

    if (doctors.length === 0) {
        const sampleDoctors = [
            {
                id: 'D001',
                firstName: 'Dr. Emily',
                lastName: 'Davis',
                dateOfBirth: '1980-05-10',
                gender: 'female',
                phone: '+1-555-0201',
                email: 'emily.davis@hospital.com',
                address: '321 Hospital Blvd, Health City, HC 12345',
                status: 'active',
                specialty: 'cardiology',
                experience: 15,
                licenseNumber: 'MD12345',
                qualification: 'MD',
                education: 'Harvard Medical School, Johns Hopkins Residency',
                certifications: 'Board Certified Cardiologist',
                biography: 'Dr. Davis specializes in preventive cardiology and cardiac imaging.',
                availableDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
                startTime: '09:00',
                endTime: '17:00',
                consultationDuration: 30,
                roomNumber: 'Room 205',
                createdAt: new Date().toISOString(),
                lastUpdated: new Date().toISOString()
            },
            {
                id: 'D002',
                firstName: 'Dr. James',
                lastName: 'Wilson',
                dateOfBirth: '1975-09-18',
                gender: 'male',
                phone: '+1-555-0202',
                email: 'james.wilson@hospital.com',
                address: '654 Medical Dr, Health City, HC 12345',
                status: 'active',
                specialty: 'pediatrics',
                experience: 20,
                licenseNumber: 'MD12346',
                qualification: 'MD',
                education: 'Yale Medical School, Children\'s Hospital Fellowship',
                certifications: 'Board Certified Pediatrician',
                biography: 'Dr. Wilson has been caring for children and families for over 20 years.',
                availableDays: ['monday', 'tuesday', 'wednesday', 'friday', 'saturday'],
                startTime: '08:30',
                endTime: '16:30',
                consultationDuration: 20,
                roomNumber: 'Room 102',
                createdAt: new Date().toISOString(),
                lastUpdated: new Date().toISOString()
            },
            {
                id: 'D003',
                firstName: 'Dr. Maria',
                lastName: 'Garcia',
                dateOfBirth: '1988-11-25',
                gender: 'female',
                phone: '+1-555-0203',
                email: 'maria.garcia@hospital.com',
                address: '987 Care Ln, Health City, HC 12345',
                status: 'active',
                specialty: 'internal',
                experience: 8,
                licenseNumber: 'MD12347',
                qualification: 'MD',
                education: 'Stanford Medical School, Internal Medicine Residency',
                certifications: 'Board Certified Internist',
                biography: 'Dr. Garcia focuses on comprehensive adult healthcare and chronic disease management.',
                availableDays: ['monday', 'wednesday', 'thursday', 'friday'],
                startTime: '10:00',
                endTime: '18:00',
                consultationDuration: 45,
                roomNumber: 'Room 301',
                createdAt: new Date().toISOString(),
                lastUpdated: new Date().toISOString()
            }
        ];

        sampleDoctors.forEach(doctor => db.add(db.keys.doctors, doctor));
    }

    if (appointments.length === 0) {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const nextWeek = new Date(today);
        nextWeek.setDate(nextWeek.getDate() + 7);

        const sampleAppointments = [
            {
                id: 'A001',
                patientId: 'P001',
                patientName: 'John Smith',
                doctorId: 'D001',
                doctorName: 'Dr. Emily Davis',
                date: today.toISOString().split('T')[0],
                time: '10:30',
                type: 'consultation',
                duration: 30,
                priority: 'normal',
                status: 'scheduled',
                reason: 'Regular cardiac checkup',
                notes: 'Follow up on recent test results',
                createdAt: new Date().toISOString(),
                lastUpdated: new Date().toISOString()
            },
            {
                id: 'A002',
                patientId: 'P002',
                patientName: 'Sarah Johnson',
                doctorId: 'D002',
                doctorName: 'Dr. James Wilson',
                date: tomorrow.toISOString().split('T')[0],
                time: '14:00',
                type: 'check-up',
                duration: 20,
                priority: 'high',
                status: 'confirmed',
                reason: 'Annual physical examination',
                notes: 'Routine checkup, check vaccination status',
                createdAt: new Date().toISOString(),
                lastUpdated: new Date().toISOString()
            },
            {
                id: 'A003',
                patientId: 'P003',
                patientName: 'Michael Brown',
                doctorId: 'D003',
                doctorName: 'Dr. Maria Garcia',
                date: nextWeek.toISOString().split('T')[0],
                time: '11:15',
                type: 'follow-up',
                duration: 45,
                priority: 'normal',
                status: 'scheduled',
                reason: 'Diabetes management review',
                notes: 'Review blood sugar logs and adjust medication',
                createdAt: new Date().toISOString(),
                lastUpdated: new Date().toISOString()
            }
        ];

        sampleAppointments.forEach(appointment => db.add(db.keys.appointments, appointment));
    }
}

// Utility Functions
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function formatTime(timeString) {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
}

function calculateAge(dateOfBirth) {
    const today = new Date();
    const birth = new Date(dateOfBirth);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
    }
    
    return age;
}

function showNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style the notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 16px 24px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 3000;
        transform: translateX(100%);
        transition: transform 300ms ease-out;
        ${type === 'success' ? 'background: #2F855A;' : ''}
        ${type === 'error' ? 'background: #C53030;' : ''}
        ${type === 'warning' ? 'background: #D69E2E;' : ''}
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Update statistics across all pages
function updateStatistics() {
    // Update home page statistics
    const patients = db.getAll(db.keys.patients);
    const doctors = db.getAll(db.keys.doctors);
    const appointments = db.getAll(db.keys.appointments);
    
    const totalPatientsEl = document.getElementById('total-patients');
    const totalDoctorsEl = document.getElementById('total-doctors');
    const todayAppointmentsEl = document.getElementById('today-appointments');
    
    if (totalPatientsEl) totalPatientsEl.textContent = patients.length;
    if (totalDoctorsEl) totalDoctorsEl.textContent = doctors.length;
    
    if (todayAppointmentsEl) {
        const today = new Date().toISOString().split('T')[0];
        const todayAppts = appointments.filter(apt => apt.date === today).length;
        todayAppointmentsEl.textContent = todayAppts;
    }
    
    // Update patients page statistics
    const totalPatientsCountEl = document.getElementById('totalPatients');
    const activePatientsCountEl = document.getElementById('activePatients');
    const newThisMonthEl = document.getElementById('newThisMonth');
    
    if (totalPatientsCountEl) {
        totalPatientsCountEl.textContent = patients.length;
        const activePatients = patients.filter(p => p.status === 'active').length;
        if (activePatientsCountEl) activePatientsCountEl.textContent = activePatients;
        
        const thisMonth = new Date();
        thisMonth.setDate(1);
        const newThisMonth = patients.filter(p => 
            new Date(p.createdAt) >= thisMonth
        ).length;
        if (newThisMonthEl) newThisMonthEl.textContent = newThisMonth;
    }
    
    // Update doctors page statistics
    const totalDoctorsCountEl = document.getElementById('totalDoctors');
    const activeDoctorsCountEl = document.getElementById('activeDoctors');
    const specialtiesCountEl = document.getElementById('specialtiesCount');
    
    if (totalDoctorsCountEl) {
        totalDoctorsCountEl.textContent = doctors.length;
        const activeDoctors = doctors.filter(d => d.status === 'active').length;
        if (activeDoctorsCountEl) activeDoctorsCountEl.textContent = activeDoctors;
        
        const specialties = new Set(doctors.map(d => d.specialty));
        if (specialtiesCountEl) specialtiesCountEl.textContent = specialties.size;
    }
    
    // Update appointments page statistics
    const todayAppointmentsCountEl = document.getElementById('todayAppointments');
    const weekAppointmentsEl = document.getElementById('weekAppointments');
    const pendingAppointmentsEl = document.getElementById('pendingAppointments');
    const completedAppointmentsEl = document.getElementById('completedAppointments');
    
    if (todayAppointmentsCountEl) {
        const today = new Date().toISOString().split('T')[0];
        const todayAppts = appointments.filter(apt => apt.date === today).length;
        todayAppointmentsCountEl.textContent = todayAppts;
        
        const weekEnd = new Date();
        weekEnd.setDate(weekEnd.getDate() + 7);
        const weekAppts = appointments.filter(apt => {
            const aptDate = new Date(apt.date);
            return aptDate <= weekEnd && aptDate >= new Date();
        }).length;
        if (weekAppointmentsEl) weekAppointmentsEl.textContent = weekAppts;
        
        const pendingAppts = appointments.filter(apt => 
            apt.status === 'scheduled' || apt.status === 'confirmed'
        ).length;
        if (pendingAppointmentsEl) pendingAppointmentsEl.textContent = pendingAppts;
        
        const completedAppts = appointments.filter(apt => apt.status === 'completed').length;
        if (completedAppointmentsEl) completedAppointmentsEl.textContent = completedAppts;
    }
}

// Page-specific initialization
function initializePage() {
    const currentPath = window.location.pathname;
    
    if (currentPath.includes('patients')) {
        initializePatientsPage();
    } else if (currentPath.includes('doctors')) {
        initializeDoctorsPage();
    } else if (currentPath.includes('appointments')) {
        initializeAppointmentsPage();
        // Verify appointment modal function is available
        console.log('Appointment functions available:', typeof openAppointmentModal === 'function');
    } else if (currentPath.includes('contact')) {
        initializeContactPage();
    }
}

// Patients Page Functions
function initializePatientsPage() {
    loadPatientsTable();
    populatePatientFilters();
    setupPatientSearch();
    setupPatientForm();
}

function loadPatientsTable(filteredData = null) {
    const tableBody = document.getElementById('patientsTableBody');
    if (!tableBody) return;
    
    let patients = filteredData || db.getAll(db.keys.patients);
    
    // Apply current filters
    const statusFilter = document.getElementById('statusFilter')?.value;
    const ageFilter = document.getElementById('ageFilter')?.value;
    
    if (statusFilter) {
        patients = patients.filter(p => p.status === statusFilter);
    }
    
    if (ageFilter) {
        patients = patients.filter(p => {
            const age = calculateAge(p.dateOfBirth);
            switch (ageFilter) {
                case '0-18': return age >= 0 && age <= 18;
                case '19-35': return age >= 19 && age <= 35;
                case '36-50': return age >= 36 && age <= 50;
                case '51+': return age >= 51;
                default: return true;
            }
        });
    }
    
    // Pagination
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedPatients = patients.slice(startIndex, endIndex);
    
    // Clear table
    tableBody.innerHTML = '';
    
    // Add rows
    paginatedPatients.forEach(patient => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><input type="checkbox" value="${patient.id}"></td>
            <td>${patient.id}</td>
            <td>${patient.firstName} ${patient.lastName}</td>
            <td>${calculateAge(patient.dateOfBirth)}</td>
            <td>${patient.phone}</td>
            <td>${patient.email}</td>
            <td><span class="status-badge status-${patient.status}">${patient.status}</span></td>
            <td>${formatDate(new Date().toISOString())}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-sm btn-secondary" onclick="viewPatient('${patient.id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-primary" onclick="editPatient('${patient.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-secondary" onclick="deletePatient('${patient.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        tableBody.appendChild(row);
    });
    
    // Update pagination info
    updatePagination(patients.length);
}

function populatePatientFilters() {
    // Already populated in HTML
}

function setupPatientSearch() {
    const searchInput = document.getElementById('patientSearch');
    const statusFilter = document.getElementById('statusFilter');
    const ageFilter = document.getElementById('ageFilter');
    
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value;
            if (searchTerm) {
                const results = db.search(db.keys.patients, searchTerm, ['firstName', 'lastName', 'id', 'phone']);
                loadPatientsTable(results);
            } else {
                loadPatientsTable();
            }
        });
    }
    
    if (statusFilter) {
        statusFilter.addEventListener('change', loadPatientsTable);
    }
    
    if (ageFilter) {
        ageFilter.addEventListener('change', loadPatientsTable);
    }
}

function setupPatientForm() {
    const form = document.getElementById('patientForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            savePatient();
        });
    }
}

function openPatientModal(patientId = null) {
    const modal = document.getElementById('patientModal');
    const title = document.getElementById('patientModalTitle');
    const form = document.getElementById('patientForm');
    
    currentEditId = patientId;
    
    if (patientId) {
        title.textContent = 'Edit Patient';
        loadPatientForm(patientId);
    } else {
        title.textContent = 'Add New Patient';
        form.reset();
        document.getElementById('patientId').value = generatePatientId();
    }
    
    modal.style.display = 'flex';
    switchTab('personal');
}

function closePatientModal() {
    const modal = document.getElementById('patientModal');
    modal.style.display = 'none';
    currentEditId = null;
}

function loadPatientForm(patientId) {
    const patient = db.getById(db.keys.patients, patientId);
    if (!patient) return;
    
    // Populate form fields
    Object.keys(patient).forEach(key => {
        const field = document.getElementById(key) || document.querySelector(`[name="${key}"]`);
        if (field) {
            if (field.type === 'checkbox') {
                field.checked = patient[key];
            } else {
                field.value = patient[key] || '';
            }
        }
    });
}

function savePatient() {
    const form = document.getElementById('patientForm');
    const formData = new FormData(form);
    const patientData = Object.fromEntries(formData.entries());
    
    // Add timestamps
    patientData.lastUpdated = new Date().toISOString();
    
    if (currentEditId) {
        // Update existing patient
        const updated = db.update(db.keys.patients, currentEditId, patientData);
        if (updated) {
            showNotification('Patient updated successfully');
            loadPatientsTable();
            updateStatistics();
        } else {
            showNotification('Error updating patient', 'error');
        }
    } else {
        // Add new patient
        patientData.createdAt = new Date().toISOString();
        patientData.id = document.getElementById('patientId').value;
        
        db.add(db.keys.patients, patientData);
        showNotification('Patient added successfully');
        loadPatientsTable();
        updateStatistics();
    }
    
    closePatientModal();
}

function generatePatientId() {
    const patients = db.getAll(db.keys.patients);
    const existingIds = patients.map(p => p.id);
    let counter = existingIds.length + 1;
    
    while (existingIds.includes(`P${counter.toString().padStart(3, '0')}`)) {
        counter++;
    }
    
    return `P${counter.toString().padStart(3, '0')}`;
}

function viewPatient(patientId) {
    const patient = db.getById(db.keys.patients, patientId);
    if (!patient) return;
    
    const modal = document.getElementById('viewPatientModal');
    const content = document.getElementById('viewPatientContent');
    
    content.innerHTML = `
        <div class="patient-details">
            <div class="detail-section">
                <h3>Personal Information</h3>
                <div class="detail-grid">
                    <div class="detail-item">
                        <strong>Patient ID:</strong> ${patient.id}
                    </div>
                    <div class="detail-item">
                        <strong>Name:</strong> ${patient.firstName} ${patient.lastName}
                    </div>
                    <div class="detail-item">
                        <strong>Age:</strong> ${calculateAge(patient.dateOfBirth)}
                    </div>
                    <div class="detail-item">
                        <strong>Gender:</strong> ${patient.gender}
                    </div>
                    <div class="detail-item">
                        <strong>Phone:</strong> ${patient.phone}
                    </div>
                    <div class="detail-item">
                        <strong>Email:</strong> ${patient.email}
                    </div>
                    <div class="detail-item">
                        <strong>Address:</strong> ${patient.address}
                    </div>
                    <div class="detail-item">
                        <strong>Status:</strong> <span class="status-badge status-${patient.status}">${patient.status}</span>
                    </div>
                </div>
            </div>
            
            <div class="detail-section">
                <h3>Medical Information</h3>
                <div class="detail-grid">
                    <div class="detail-item">
                        <strong>Blood Type:</strong> ${patient.bloodType || 'Not specified'}
                    </div>
                    <div class="detail-item">
                        <strong>Allergies:</strong> ${patient.allergies || 'None'}
                    </div>
                    <div class="detail-item">
                        <strong>Conditions:</strong> ${patient.conditions || 'None'}
                    </div>
                    <div class="detail-item">
                        <strong>Medications:</strong> ${patient.medications || 'None'}
                    </div>
                </div>
            </div>
            
            <div class="detail-section">
                <h3>Emergency Contact</h3>
                <div class="detail-grid">
                    <div class="detail-item">
                        <strong>Name:</strong> ${patient.emergencyName || 'Not specified'}
                    </div>
                    <div class="detail-item">
                        <strong>Relationship:</strong> ${patient.emergencyRelationship || 'Not specified'}
                    </div>
                    <div class="detail-item">
                        <strong>Phone:</strong> ${patient.emergencyPhone || 'Not specified'}
                    </div>
                    <div class="detail-item">
                        <strong>Email:</strong> ${patient.emergencyEmail || 'Not specified'}
                    </div>
                </div>
            </div>
        </div>
    `;
    
    modal.style.display = 'flex';
}

function closeViewPatientModal() {
    document.getElementById('viewPatientModal').style.display = 'none';
}

function editPatient(patientId) {
    openPatientModal(patientId);
}

function deletePatient(patientId) {
    if (confirm('Are you sure you want to delete this patient?')) {
        if (db.delete(db.keys.patients, patientId)) {
            showNotification('Patient deleted successfully');
            loadPatientsTable();
            updateStatistics();
        } else {
            showNotification('Error deleting patient', 'error');
        }
    }
}

function exportPatients() {
    const patients = db.getAll(db.keys.patients);
    const csv = [
        ['Patient ID', 'First Name', 'Last Name', 'Age', 'Gender', 'Phone', 'Email', 'Status'],
        ...patients.map(p => [
            p.id,
            p.firstName,
            p.lastName,
            calculateAge(p.dateOfBirth),
            p.gender,
            p.phone,
            p.email,
            p.status
        ])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'patients.csv';
    a.click();
    URL.revokeObjectURL(url);
    
    showNotification('Patients exported successfully');
}

// Doctors Page Functions
function initializeDoctorsPage() {
    loadDoctorsTable();
    setupDoctorSearch();
    setupDoctorForm();
}

function loadDoctorsTable(filteredData = null) {
    const tableBody = document.getElementById('doctorsTableBody');
    if (!tableBody) return;
    
    let doctors = filteredData || db.getAll(db.keys.doctors);
    
    // Apply current filters
    const specialtyFilter = document.getElementById('specialtyFilter')?.value;
    const statusFilter = document.getElementById('statusFilter')?.value;
    
    if (specialtyFilter) {
        doctors = doctors.filter(d => d.specialty === specialtyFilter);
    }
    
    if (statusFilter) {
        doctors = doctors.filter(d => d.status === statusFilter);
    }
    
    // Pagination
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedDoctors = doctors.slice(startIndex, endIndex);
    
    // Clear table
    tableBody.innerHTML = '';
    
    // Add rows
    paginatedDoctors.forEach(doctor => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><input type="checkbox" value="${doctor.id}"></td>
            <td>${doctor.id}</td>
            <td>${doctor.firstName} ${doctor.lastName}</td>
            <td>${doctor.specialty}</td>
            <td>${doctor.phone}</td>
            <td>${doctor.email}</td>
            <td><span class="status-badge status-${doctor.status}">${doctor.status}</span></td>
            <td>${doctor.experience} years</td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-sm btn-secondary" onclick="viewDoctor('${doctor.id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-primary" onclick="editDoctor('${doctor.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-secondary" onclick="deleteDoctor('${doctor.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        tableBody.appendChild(row);
    });
    
    // Update pagination info
    updatePagination(doctors.length);
}

function setupDoctorSearch() {
    const searchInput = document.getElementById('doctorSearch');
    const specialtyFilter = document.getElementById('specialtyFilter');
    const statusFilter = document.getElementById('statusFilter');
    
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value;
            if (searchTerm) {
                const results = db.search(db.keys.doctors, searchTerm, ['firstName', 'lastName', 'id', 'specialty', 'licenseNumber']);
                loadDoctorsTable(results);
            } else {
                loadDoctorsTable();
            }
        });
    }
    
    if (specialtyFilter) {
        specialtyFilter.addEventListener('change', loadDoctorsTable);
    }
    
    if (statusFilter) {
        statusFilter.addEventListener('change', loadDoctorsTable);
    }
}

function setupDoctorForm() {
    const form = document.getElementById('doctorForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            saveDoctor();
        });
    }
}

function openDoctorModal(doctorId = null) {
    const modal = document.getElementById('doctorModal');
    const title = document.getElementById('doctorModalTitle');
    const form = document.getElementById('doctorForm');
    
    currentEditId = doctorId;
    
    if (doctorId) {
        title.textContent = 'Edit Doctor';
        loadDoctorForm(doctorId);
    } else {
        title.textContent = 'Add New Doctor';
        form.reset();
        document.getElementById('doctorId').value = generateDoctorId();
    }
    
    modal.style.display = 'flex';
    switchTab('personal');
}

function closeDoctorModal() {
    document.getElementById('doctorModal').style.display = 'none';
    currentEditId = null;
}

function loadDoctorForm(doctorId) {
    const doctor = db.getById(db.keys.doctors, doctorId);
    if (!doctor) return;
    
    // Populate form fields
    Object.keys(doctor).forEach(key => {
        const field = document.getElementById(key) || document.querySelector(`[name="${key}"]`);
        if (field) {
            if (field.type === 'checkbox') {
                field.checked = doctor[key];
            } else {
                field.value = doctor[key] || '';
            }
        }
    });
    
    // Handle available days checkboxes
    if (doctor.availableDays) {
        doctor.availableDays.forEach(day => {
            const checkbox = document.querySelector(`[name="availableDays"][value="${day}"]`);
            if (checkbox) checkbox.checked = true;
        });
    }
}

function saveDoctor() {
    const form = document.getElementById('doctorForm');
    const formData = new FormData(form);
    const doctorData = Object.fromEntries(formData.entries());
    
    // Handle checkboxes for available days
    const availableDays = Array.from(document.querySelectorAll('[name="availableDays"]:checked'))
        .map(cb => cb.value);
    doctorData.availableDays = availableDays;
    
    // Add timestamps
    doctorData.lastUpdated = new Date().toISOString();
    
    if (currentEditId) {
        // Update existing doctor
        const updated = db.update(db.keys.doctors, currentEditId, doctorData);
        if (updated) {
            showNotification('Doctor updated successfully');
            loadDoctorsTable();
            updateStatistics();
        } else {
            showNotification('Error updating doctor', 'error');
        }
    } else {
        // Add new doctor
        doctorData.createdAt = new Date().toISOString();
        doctorData.id = document.getElementById('doctorId').value;
        
        db.add(db.keys.doctors, doctorData);
        showNotification('Doctor added successfully');
        loadDoctorsTable();
        updateStatistics();
    }
    
    closeDoctorModal();
}

function generateDoctorId() {
    const doctors = db.getAll(db.keys.doctors);
    const existingIds = doctors.map(d => d.id);
    let counter = existingIds.length + 1;
    
    while (existingIds.includes(`D${counter.toString().padStart(3, '0')}`)) {
        counter++;
    }
    
    return `D${counter.toString().padStart(3, '0')}`;
}

function viewDoctor(doctorId) {
    const doctor = db.getById(db.keys.doctors, doctorId);
    if (!doctor) return;
    
    const modal = document.getElementById('viewDoctorModal');
    const content = document.getElementById('viewDoctorContent');
    
    content.innerHTML = `
        <div class="doctor-details">
            <div class="detail-section">
                <h3>Personal Information</h3>
                <div class="detail-grid">
                    <div class="detail-item">
                        <strong>Doctor ID:</strong> ${doctor.id}
                    </div>
                    <div class="detail-item">
                        <strong>Name:</strong> ${doctor.firstName} ${doctor.lastName}
                    </div>
                    <div class="detail-item">
                        <strong>Age:</strong> ${calculateAge(doctor.dateOfBirth)}
                    </div>
                    <div class="detail-item">
                        <strong>Gender:</strong> ${doctor.gender}
                    </div>
                    <div class="detail-item">
                        <strong>Phone:</strong> ${doctor.phone}
                    </div>
                    <div class="detail-item">
                        <strong>Email:</strong> ${doctor.email}
                    </div>
                    <div class="detail-item">
                        <strong>Address:</strong> ${doctor.address}
                    </div>
                    <div class="detail-item">
                        <strong>Status:</strong> <span class="status-badge status-${doctor.status}">${doctor.status}</span>
                    </div>
                </div>
            </div>
            
            <div class="detail-section">
                <h3>Professional Information</h3>
                <div class="detail-grid">
                    <div class="detail-item">
                        <strong>Specialty:</strong> ${doctor.specialty}
                    </div>
                    <div class="detail-item">
                        <strong>Experience:</strong> ${doctor.experience} years
                    </div>
                    <div class="detail-item">
                        <strong>License Number:</strong> ${doctor.licenseNumber}
                    </div>
                    <div class="detail-item">
                        <strong>Qualification:</strong> ${doctor.qualification}
                    </div>
                    <div class="detail-item">
                        <strong>Room:</strong> ${doctor.roomNumber}
                    </div>
                </div>
            </div>
            
            <div class="detail-section">
                <h3>Schedule</h3>
                <div class="detail-grid">
                    <div class="detail-item">
                        <strong>Available Days:</strong> ${doctor.availableDays ? doctor.availableDays.join(', ') : 'Not specified'}
                    </div>
                    <div class="detail-item">
                        <strong>Hours:</strong> ${formatTime(doctor.startTime)} - ${formatTime(doctor.endTime)}
                    </div>
                    <div class="detail-item">
                        <strong>Consultation Duration:</strong> ${doctor.consultationDuration} minutes
                    </div>
                </div>
            </div>
            
            <div class="detail-section">
                <h3>Education & Training</h3>
                <p>${doctor.education || 'Not specified'}</p>
                
                <h4>Certifications</h4>
                <p>${doctor.certifications || 'Not specified'}</p>
                
                <h4>Biography</h4>
                <p>${doctor.biography || 'Not specified'}</p>
            </div>
        </div>
    `;
    
    modal.style.display = 'flex';
}

function closeViewDoctorModal() {
    document.getElementById('viewDoctorModal').style.display = 'none';
}

function editDoctor(doctorId) {
    openDoctorModal(doctorId);
}

function deleteDoctor(doctorId) {
    if (confirm('Are you sure you want to delete this doctor?')) {
        if (db.delete(db.keys.doctors, doctorId)) {
            showNotification('Doctor deleted successfully');
            loadDoctorsTable();
            updateStatistics();
        } else {
            showNotification('Error deleting doctor', 'error');
        }
    }
}

function exportDoctors() {
    const doctors = db.getAll(db.keys.doctors);
    const csv = [
        ['Doctor ID', 'First Name', 'Last Name', 'Specialty', 'Experience', 'Phone', 'Email', 'Status'],
        ...doctors.map(d => [
            d.id,
            d.firstName,
            d.lastName,
            d.specialty,
            d.experience,
            d.phone,
            d.email,
            d.status
        ])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'doctors.csv';
    a.click();
    URL.revokeObjectURL(url);
    
    showNotification('Doctors exported successfully');
}

// Appointments Page Functions
function initializeAppointmentsPage() {
    loadAppointmentsTable();
    generateCalendar();
    setupAppointmentForm();
    setupAppointmentFilters();
    setupAppointmentButtons();
}

function setupAppointmentButtons() {
    // Set up click handlers for appointment buttons
    const scheduleBtn = document.getElementById('scheduleAppointmentBtn');
    if (scheduleBtn) {
        scheduleBtn.addEventListener('click', function() {
            console.log('Schedule appointment button clicked');
            openAppointmentModal();
        });
    }
}

function loadAppointmentsTable(filteredData = null) {
    const tableBody = document.getElementById('appointmentsTableBody');
    if (!tableBody) return;
    
    let appointments = filteredData || db.getAll(db.keys.appointments);
    
    // Apply current filters
    if (currentFilter === 'today') {
        const today = new Date().toISOString().split('T')[0];
        appointments = appointments.filter(apt => apt.date === today);
    } else if (currentFilter === 'upcoming') {
        const today = new Date().toISOString().split('T')[0];
        appointments = appointments.filter(apt => apt.date > today);
    } else if (currentFilter === 'past') {
        const today = new Date().toISOString().split('T')[0];
        appointments = appointments.filter(apt => apt.date < today);
    }
    
    // Sort by date and time
    appointments.sort((a, b) => {
        const dateCompare = new Date(a.date) - new Date(b.date);
        if (dateCompare === 0) {
            return a.time.localeCompare(b.time);
        }
        return dateCompare;
    });
    
    // Clear table
    tableBody.innerHTML = '';
    
    // Add rows
    appointments.forEach(appointment => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${appointment.id}</td>
            <td>${appointment.patientName}</td>
            <td>${appointment.doctorName}</td>
            <td>${formatDate(appointment.date)}</td>
            <td>${formatTime(appointment.time)}</td>
            <td>${appointment.type}</td>
            <td><span class="status-badge status-${appointment.status}">${appointment.status}</span></td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-sm btn-secondary" onclick="viewAppointment('${appointment.id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-primary" onclick="editAppointment('${appointment.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-secondary" onclick="deleteAppointment('${appointment.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function setupAppointmentFilters() {
    // Filter tabs are handled by filterAppointments function
}

function filterAppointments(filter) {
    currentFilter = filter;
    
    // Update active tab
    document.querySelectorAll('.filter-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelector(`[data-filter="${filter}"]`).classList.add('active');
    
    // Reload table with filter
    loadAppointmentsTable();
}

function generateCalendar() {
    const calendarDays = document.getElementById('calendarDays');
    const currentMonthYear = document.getElementById('currentMonthYear');
    
    if (!calendarDays || !currentMonthYear) return;
    
    const today = new Date();
    const currentDate = new Date(today.getFullYear(), today.getMonth(), 1);
    
    // Update month/year display
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                       'July', 'August', 'September', 'October', 'November', 'December'];
    currentMonthYear.textContent = `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
    
    // Clear calendar
    calendarDays.innerHTML = '';
    
    // Get first day of month and number of days
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const daysInPrevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate();
    
    // Add days from previous month
    for (let i = firstDay - 1; i >= 0; i--) {
        const day = daysInPrevMonth - i;
        const dayElement = createCalendarDay(day, currentDate.getMonth() - 1, currentDate.getFullYear(), true);
        calendarDays.appendChild(dayElement);
    }
    
    // Add days from current month
    for (let day = 1; day <= daysInMonth; day++) {
        const isToday = day === today.getDate() && currentDate.getMonth() === today.getMonth() && 
                       currentDate.getFullYear() === today.getFullYear();
        const dayElement = createCalendarDay(day, currentDate.getMonth(), currentDate.getFullYear(), false, isToday);
        calendarDays.appendChild(dayElement);
    }
    
    // Fill remaining spaces with next month days
    const totalCells = calendarDays.children.length;
    const remainingCells = 42 - totalCells; // 6 weeks * 7 days
    for (let day = 1; day <= remainingCells; day++) {
        const dayElement = createCalendarDay(day, currentDate.getMonth() + 1, currentDate.getFullYear(), true);
        calendarDays.appendChild(dayElement);
    }
}

function createCalendarDay(day, month, year, otherMonth = false, isToday = false) {
    const dayElement = document.createElement('div');
    dayElement.className = `calendar-day ${otherMonth ? 'other-month' : ''} ${isToday ? 'today' : ''}`;
    
    const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    
    // Check for appointments on this day
    const appointments = db.getAll(db.keys.appointments);
    const dayAppointments = appointments.filter(apt => apt.date === dateString);
    
    dayElement.innerHTML = `
        <div class="calendar-day-number">${day}</div>
        ${dayAppointments.length > 0 ? `<div class="calendar-day-appointments">${dayAppointments.length} apt</div>` : ''}
    `;
    
    // Add click handler to show appointments for this day
    if (!otherMonth) {
        dayElement.addEventListener('click', () => {
            showAppointmentsForDate(dateString);
        });
    }
    
    return dayElement;
}

function showAppointmentsForDate(date) {
    const appointments = db.getAll(db.keys.appointments).filter(apt => apt.date === date);
    // You could implement a modal to show appointments for the selected date
    console.log('Appointments for', date, appointments);
}

function previousMonth() {
    // Implementation for calendar navigation
    console.log('Previous month');
}

function nextMonth() {
    // Implementation for calendar navigation
    console.log('Next month');
}

function goToToday() {
    generateCalendar();
}

function setupAppointmentForm() {
    console.log('Setting up appointment form...');
    
    const form = document.getElementById('appointmentForm');
    if (form) {
        console.log('Form found, setting up submit handler...');
        
        // Remove existing listeners to avoid duplicates
        const newForm = form.cloneNode(true);
        form.parentNode.replaceChild(newForm, form);
        
        newForm.addEventListener('submit', function(e) {
            console.log('Form submitted via event listener');
            e.preventDefault();
            e.stopPropagation();
            saveAppointment();
            return false;
        });
        
        // Also add click handler to submit button as backup
        const submitBtn = document.getElementById('saveAppointmentBtn');
        if (submitBtn) {
            submitBtn.addEventListener('click', function(e) {
                console.log('Submit button clicked');
                e.preventDefault();
                e.stopPropagation();
                
                // Trigger form submission
                if (newForm.checkValidity()) {
                    newForm.dispatchEvent(new Event('submit'));
                } else {
                    // Show validation messages
                    newForm.reportValidity();
                }
                return false;
            });
            console.log('Submit button handler added');
        } else {
            console.warn('Submit button not found');
        }
        
        console.log('Form event handlers set up successfully');
    } else {
        console.error('Appointment form not found');
    }
    
    // Populate patient and doctor dropdowns
    console.log('Populating dropdowns...');
    populateAppointmentDropdowns();
    console.log('Appointment form setup complete');
}

function populateAppointmentDropdowns() {
    console.log('Populating appointment dropdowns...');
    
    const patientSelect = document.getElementById('patientId');
    const doctorSelect = document.getElementById('doctorId');
    
    // Clear existing options first (except the first placeholder option)
    if (patientSelect) {
        const currentPatientOptions = patientSelect.querySelectorAll('option:not(:first-child)');
        currentPatientOptions.forEach(option => option.remove());
        
        const patients = db.getAll(db.keys.patients);
        console.log('Found patients:', patients.length);
        
        if (patients.length === 0) {
            console.warn('No patients found in database');
            const option = document.createElement('option');
            option.value = '';
            option.textContent = 'No patients available - Please add patients first';
            option.disabled = true;
            patientSelect.appendChild(option);
        } else {
            patients.forEach(patient => {
                const option = document.createElement('option');
                option.value = patient.id;
                option.textContent = `${patient.firstName} ${patient.lastName} (${patient.id})`;
                patientSelect.appendChild(option);
            });
            console.log('Patient dropdown populated with', patients.length, 'patients');
        }
    } else {
        console.error('Patient dropdown not found');
    }
    
    if (doctorSelect) {
        const currentDoctorOptions = doctorSelect.querySelectorAll('option:not(:first-child)');
        currentDoctorOptions.forEach(option => option.remove());
        
        const doctors = db.getAll(db.keys.doctors);
        console.log('Found doctors:', doctors.length);
        
        if (doctors.length === 0) {
            console.warn('No doctors found in database');
            const option = document.createElement('option');
            option.value = '';
            option.textContent = 'No doctors available - Please add doctors first';
            option.disabled = true;
            doctorSelect.appendChild(option);
        } else {
            doctors.forEach(doctor => {
                const option = document.createElement('option');
                option.value = doctor.id;
                option.textContent = `${doctor.firstName} ${doctor.lastName} - ${doctor.specialty}`;
                doctorSelect.appendChild(option);
            });
            console.log('Doctor dropdown populated with', doctors.length, 'doctors');
        }
    } else {
        console.error('Doctor dropdown not found');
    }
    
    console.log('Dropdown population completed');
}

// Function to manually refresh dropdowns
function refreshAppointmentDropdowns() {
    console.log('Manually refreshing appointment dropdowns...');
    populateAppointmentDropdowns();
    showNotification('Dropdowns refreshed successfully', 'success');
}

function openAppointmentModal(appointmentId = null) {
    console.log('Opening appointment modal, ID:', appointmentId);
    
    try {
        const modal = document.getElementById('appointmentModal');
        const title = document.getElementById('appointmentModalTitle');
        
        if (!modal) {
            console.error('Modal element not found');
            alert('Error: Modal element not found');
            return;
        }
        
        if (!title) {
            console.error('Modal title element not found');
            alert('Error: Modal title not found');
            return;
        }
        
        currentEditId = appointmentId;
        
        if (appointmentId) {
            title.textContent = 'Edit Appointment';
            loadAppointmentForm(appointmentId);
        } else {
            title.textContent = 'Schedule New Appointment';
            
            // Reset form
            const form = document.getElementById('appointmentForm');
            if (form) {
                form.reset();
            }
            
            // Generate new appointment ID
            const appointmentIdField = document.getElementById('appointmentId');
            if (appointmentIdField) {
                appointmentIdField.value = generateAppointmentId();
            } else {
                console.warn('Appointment ID field not found');
            }
            
            // Set default date to today
            const dateField = document.getElementById('appointmentDate');
            if (dateField) {
                const today = new Date().toISOString().split('T')[0];
                dateField.value = today;
            } else {
                console.warn('Date field not found');
            }
            
            // Set default time to current time (rounded to nearest 30 minutes)
            const timeField = document.getElementById('appointmentTime');
            if (timeField) {
                const now = new Date();
                const minutes = now.getMinutes();
                const roundedMinutes = minutes < 30 ? 0 : 30;
                const timeString = `${String(now.getHours()).padStart(2, '0')}:${String(roundedMinutes).padStart(2, '0')}`;
                timeField.value = timeString;
            } else {
                console.warn('Time field not found');
            }
            
            // Set default duration to 30 minutes
            const durationField = document.getElementById('duration');
            if (durationField) {
                durationField.value = '30';
            }
        }
        
        // Populate dropdowns with patients and doctors
        populateAppointmentDropdowns();
        
        // Show modal
        modal.style.display = 'flex';
        console.log('Modal displayed successfully');
        
    } catch (error) {
        console.error('Error opening appointment modal:', error);
        alert('Error opening appointment form. Please check the console for details.');
    }
}

function closeAppointmentModal() {
    document.getElementById('appointmentModal').style.display = 'none';
    currentEditId = null;
}

function loadAppointmentForm(appointmentId) {
    const appointment = db.getById(db.keys.appointments, appointmentId);
    if (!appointment) return;
    
    // Populate form fields
    Object.keys(appointment).forEach(key => {
        const field = document.getElementById(key) || document.querySelector(`[name="${key}"]`);
        if (field) {
            field.value = appointment[key] || '';
        }
    });
}

function saveAppointment() {
    console.log('saveAppointment function called');
    
    try {
        const form = document.getElementById('appointmentForm');
        if (!form) {
            console.error('Appointment form not found');
            showNotification('Error: Form not found', 'error');
            return;
        }
        
        console.log('Form found, extracting data...');
        const formData = new FormData(form);
        const appointmentData = Object.fromEntries(formData.entries());
        
        console.log('Form data:', appointmentData);
        
        // Validate required fields
        const requiredFields = ['patientId', 'doctorId', 'appointmentDate', 'appointmentTime', 'appointmentType', 'duration', 'priority', 'status'];
        const missingFields = [];
        
        for (const field of requiredFields) {
            if (!appointmentData[field] || appointmentData[field].trim() === '') {
                missingFields.push(field);
            }
        }
        
        if (missingFields.length > 0) {
            console.error('Missing required fields:', missingFields);
            showNotification(`Please fill in all required fields: ${missingFields.join(', ')}`, 'error');
            return;
        }
        
        // Get patient and doctor names
        const patient = db.getById(db.keys.patients, appointmentData.patientId);
        const doctor = db.getById(db.keys.doctors, appointmentData.doctorId);
        
        if (!patient) {
            console.error('Selected patient not found');
            showNotification('Error: Selected patient not found', 'error');
            return;
        }
        
        if (!doctor) {
            console.error('Selected doctor not found');
            showNotification('Error: Selected doctor not found', 'error');
            return;
        }
        
        appointmentData.patientName = `${patient.firstName} ${patient.lastName}`;
        appointmentData.doctorName = `${doctor.firstName} ${doctor.lastName}`;
        
        console.log('Patient and doctor validation passed');
        
        // Add timestamps
        appointmentData.lastUpdated = new Date().toISOString();
        
        if (currentEditId) {
            console.log('Updating existing appointment:', currentEditId);
            // Update existing appointment
            const updated = db.update(db.keys.appointments, currentEditId, appointmentData);
            if (updated) {
                console.log('Appointment updated successfully');
                showNotification('Appointment updated successfully');
                loadAppointmentsTable();
                updateStatistics();
            } else {
                console.error('Error updating appointment in database');
                showNotification('Error updating appointment', 'error');
            }
        } else {
            console.log('Creating new appointment');
            // Add new appointment
            appointmentData.createdAt = new Date().toISOString();
            appointmentData.id = document.getElementById('appointmentId').value;
            
            if (!appointmentData.id) {
                console.error('Appointment ID not generated');
                showNotification('Error: Appointment ID not generated', 'error');
                return;
            }
            
            console.log('Saving appointment with ID:', appointmentData.id);
            db.add(db.keys.appointments, appointmentData);
            showNotification('Appointment scheduled successfully');
            loadAppointmentsTable();
            updateStatistics();
            generateCalendar();
        }
        
        console.log('Closing modal...');
        closeAppointmentModal();
        console.log('Appointment saved successfully');
        
    } catch (error) {
        console.error('Error in saveAppointment function:', error);
        showNotification('An error occurred while saving the appointment. Please check the console for details.', 'error');
    }
}

function generateAppointmentId() {
    const appointments = db.getAll(db.keys.appointments);
    const existingIds = appointments.map(a => a.id);
    let counter = existingIds.length + 1;
    
    while (existingIds.includes(`A${counter.toString().padStart(3, '0')}`)) {
        counter++;
    }
    
    return `A${counter.toString().padStart(3, '0')}`;
}

// Test function for appointment functionality
function testAppointmentForm() {
    console.log('Testing appointment form functionality...');
    
    // Check if form exists
    const form = document.getElementById('appointmentForm');
    if (!form) {
        console.error('Form not found');
        return false;
    }
    
    // Check if required elements exist
    const requiredElements = [
        'appointmentId', 'patientId', 'doctorId', 'appointmentDate', 
        'appointmentTime', 'appointmentType', 'duration', 'priority', 'status'
    ];
    
    for (const elementId of requiredElements) {
        const element = document.getElementById(elementId);
        if (!element) {
            console.error(`Required element not found: ${elementId}`);
            return false;
        }
    }
    
    // Check if saveAppointment function exists
    if (typeof saveAppointment !== 'function') {
        console.error('saveAppointment function not found');
        return false;
    }
    
    // Test dropdown population
    console.log('Testing dropdown population...');
    populateAppointmentDropdowns();
    
    // Check patient dropdown
    const patientSelect = document.getElementById('patientId');
    const patientOptions = patientSelect ? patientSelect.querySelectorAll('option').length : 0;
    console.log(`Patient dropdown has ${patientOptions} options`);
    
    // Check doctor dropdown
    const doctorSelect = document.getElementById('doctorId');
    const doctorOptions = doctorSelect ? doctorSelect.querySelectorAll('option').length : 0;
    console.log(`Doctor dropdown has ${doctorOptions} options`);
    
    // Check if we have data in database
    const patients = db.getAll(db.keys.patients);
    const doctors = db.getAll(db.keys.doctors);
    console.log(`Database has ${patients.length} patients and ${doctors.length} doctors`);
    
    if (patients.length === 0) {
        console.warn('No patients in database! You may need to add some first.');
        console.log('Loading sample data...');
        loadSampleData();
        // Test again after loading
        populateAppointmentDropdowns();
        console.log('Sample data loaded. Please test again.');
    }
    
    if (doctors.length === 0) {
        console.warn('No doctors in database! You may need to add some first.');
    }
    
    console.log('All tests completed!');
    showNotification('Form test completed. Check console for details.', 'success');
    return true;
}

function viewAppointment(appointmentId) {
    const appointment = db.getById(db.keys.appointments, appointmentId);
    if (!appointment) return;
    
    const modal = document.getElementById('viewAppointmentModal');
    const content = document.getElementById('viewAppointmentContent');
    
    content.innerHTML = `
        <div class="appointment-details">
            <div class="detail-section">
                <h3>Appointment Information</h3>
                <div class="detail-grid">
                    <div class="detail-item">
                        <strong>Appointment ID:</strong> ${appointment.id}
                    </div>
                    <div class="detail-item">
                        <strong>Patient:</strong> ${appointment.patientName}
                    </div>
                    <div class="detail-item">
                        <strong>Doctor:</strong> ${appointment.doctorName}
                    </div>
                    <div class="detail-item">
                        <strong>Date:</strong> ${formatDate(appointment.date)}
                    </div>
                    <div class="detail-item">
                        <strong>Time:</strong> ${formatTime(appointment.time)}
                    </div>
                    <div class="detail-item">
                        <strong>Duration:</strong> ${appointment.duration} minutes
                    </div>
                    <div class="detail-item">
                        <strong>Type:</strong> ${appointment.type}
                    </div>
                    <div class="detail-item">
                        <strong>Priority:</strong> ${appointment.priority}
                    </div>
                    <div class="detail-item">
                        <strong>Status:</strong> <span class="status-badge status-${appointment.status}">${appointment.status}</span>
                    </div>
                </div>
            </div>
            
            <div class="detail-section">
                <h3>Visit Details</h3>
                <div class="detail-grid">
                    <div class="detail-item">
                        <strong>Reason:</strong> ${appointment.reason || 'Not specified'}
                    </div>
                    <div class="detail-item">
                        <strong>Notes:</strong> ${appointment.notes || 'None'}
                    </div>
                </div>
            </div>
        </div>
    `;
    
    modal.style.display = 'flex';
}

function closeViewAppointmentModal() {
    document.getElementById('viewAppointmentModal').style.display = 'none';
}

function editAppointment(appointmentId) {
    openAppointmentModal(appointmentId);
}

function deleteAppointment(appointmentId) {
    if (confirm('Are you sure you want to delete this appointment?')) {
        if (db.delete(db.keys.appointments, appointmentId)) {
            showNotification('Appointment deleted successfully');
            loadAppointmentsTable();
            updateStatistics();
            generateCalendar();
        } else {
            showNotification('Error deleting appointment', 'error');
        }
    }
}

function exportAppointments() {
    const appointments = db.getAll(db.keys.appointments);
    const csv = [
        ['Appointment ID', 'Patient', 'Doctor', 'Date', 'Time', 'Type', 'Status', 'Duration'],
        ...appointments.map(a => [
            a.id,
            a.patientName,
            a.doctorName,
            a.date,
            a.time,
            a.type,
            a.status,
            a.duration
        ])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'appointments.csv';
    a.click();
    URL.revokeObjectURL(url);
    
    showNotification('Appointments exported successfully');
}

// Contact Page Functions
function initializeContactPage() {
    const contactForm = document.getElementById('contactForm');
    const faqItems = document.querySelectorAll('.faq-item');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleContactForm();
        });
    }
    
    // Setup FAQ accordion
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            item.classList.toggle('active');
        });
    });
}

function handleContactForm() {
    const form = document.getElementById('contactForm');
    const formData = new FormData(form);
    const contactData = Object.fromEntries(formData.entries());
    
    // Save contact form submission
    contactData.submittedAt = new Date().toISOString();
    contactData.id = `C${Date.now()}`;
    
    // Add to contacts database
    db.add(db.keys.contacts, contactData);
    
    showNotification('Thank you for your message! We will get back to you soon.');
    form.reset();
}

// Modal and Tab Functions
function switchTab(tabName) {
    // Hide all tab contents
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.style.display = 'none';
    });
    
    // Remove active class from all tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab content
    const targetTab = document.getElementById(tabName + 'Tab');
    if (targetTab) {
        targetTab.style.display = 'block';
    }
    
    // Add active class to clicked tab button
    const activeBtn = event?.target;
    if (activeBtn) {
        activeBtn.classList.add('active');
    }
}

// Pagination Functions
function updatePagination(totalItems) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);
    
    // Update showing info
    const showingFrom = document.getElementById('showingFrom');
    const showingTo = document.getElementById('showingTo');
    const totalCount = document.getElementById('totalCount') || document.getElementById('totalPatientsCount') || document.getElementById('totalDoctorsCount');
    const currentPageEl = document.getElementById('currentPage');
    const totalPagesEl = document.getElementById('totalPages');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    if (showingFrom) showingFrom.textContent = startItem;
    if (showingTo) showingTo.textContent = endItem;
    if (totalCount) totalCount.textContent = totalItems;
    if (currentPageEl) currentPageEl.textContent = currentPage;
    if (totalPagesEl) totalPagesEl.textContent = totalPages;
    
    if (prevBtn) prevBtn.disabled = currentPage === 1;
    if (nextBtn) nextBtn.disabled = currentPage === totalPages;
}

function previousPage() {
    if (currentPage > 1) {
        currentPage--;
        reloadCurrentTable();
    }
}

function nextPage() {
    currentPage++;
    reloadCurrentTable();
}

function reloadCurrentTable() {
    const currentPath = window.location.pathname;
    
    if (currentPath.includes('patients')) {
        loadPatientsTable();
    } else if (currentPath.includes('doctors')) {
        loadDoctorsTable();
    } else if (currentPath.includes('appointments')) {
        loadAppointmentsTable();
    }
}

// Utility Functions
function toggleSelectAll() {
    const selectAllCheckbox = document.getElementById('selectAllPatients') || document.getElementById('selectAllDoctors');
    const checkboxes = document.querySelectorAll('tbody input[type="checkbox"]');
    
    checkboxes.forEach(checkbox => {
        checkbox.checked = selectAllCheckbox.checked;
    });
}

// Test function to verify appointment modal
window.testAppointmentModal = function() {
    console.log('Testing appointment modal...');
    openAppointmentModal();
};

// Export functions for global access
window.openPatientModal = openPatientModal;
window.closePatientModal = closePatientModal;
window.viewPatient = viewPatient;
window.closeViewPatientModal = closeViewPatientModal;
window.editPatient = editPatient;
window.deletePatient = deletePatient;
window.exportPatients = exportPatients;

window.openDoctorModal = openDoctorModal;
window.closeDoctorModal = closeDoctorModal;
window.viewDoctor = viewDoctor;
window.closeViewDoctorModal = closeViewDoctorModal;
window.editDoctor = editDoctor;
window.deleteDoctor = deleteDoctor;
window.exportDoctors = exportDoctors;

window.openAppointmentModal = openAppointmentModal;
window.closeAppointmentModal = closeAppointmentModal;
window.viewAppointment = viewAppointment;
window.closeViewAppointmentModal = closeViewAppointmentModal;
window.editAppointment = editAppointment;
window.deleteAppointment = deleteAppointment;
window.exportAppointments = exportAppointments;

window.switchTab = switchTab;
window.previousPage = previousPage;
window.nextPage = nextPage;
window.toggleSelectAll = toggleSelectAll;
window.filterAppointments = filterAppointments;
window.previousMonth = previousMonth;
window.nextMonth = nextMonth;
window.goToToday = goToToday;