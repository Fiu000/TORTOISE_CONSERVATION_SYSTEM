// DOM Elements
const logoutBtn = document.getElementById('logoutBtn');
const logoutModal = document.getElementById('logoutModal');
const closeModal = document.getElementById('closeModal');
const cancelLogout = document.getElementById('cancelLogout');
const confirmLogout = document.getElementById('confirmLogout');
const navItems = document.querySelectorAll('.nav-item');
const tabContents = document.querySelectorAll('.tab-content');

// Initialize the dashboard
document.addEventListener('DOMContentLoaded', () => {
    console.log('🔌 IOT Staff Dashboard Loaded');

    // Setup navigation
    setupNavigation();

    // Setup logout functionality
    setupLogout();

    // Setup table functionality
    setupTables();

    // Setup charts (if needed)
    setupCharts();

    // Add smooth animations
    setupAnimations();
});

// Navigation setup
function setupNavigation() {
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const targetTab = item.getAttribute('data-tab');
            
            // Remove active class from all nav items and tab contents
            navItems.forEach(nav => nav.classList.remove('active'));
            tabContents.forEach(tab => tab.classList.remove('active'));
            
            // Add active class to clicked nav item and corresponding tab
            item.classList.add('active');
            const targetContent = document.getElementById(targetTab);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });
}

// Logout functionality
function setupLogout() {
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            if (logoutModal) {
                logoutModal.style.display = 'block';
            }
        });
    }

    if (closeModal) {
        closeModal.addEventListener('click', () => {
            if (logoutModal) {
                logoutModal.style.display = 'none';
            }
        });
    }

    if (cancelLogout) {
        cancelLogout.addEventListener('click', () => {
            if (logoutModal) {
                logoutModal.style.display = 'none';
            }
        });
    }

    if (confirmLogout) {
        confirmLogout.addEventListener('click', () => {
            // Clear any stored data
            localStorage.removeItem('userCredentials');
            sessionStorage.clear();
            
            // Redirect to login page
            window.location.href = 'login.html';
        });
    }

    // Close modal when clicking outside
    window.addEventListener('click', (event) => {
        if (event.target === logoutModal) {
            logoutModal.style.display = 'none';
        }
    });
}

// Table functionality
function setupTables() {
    // Device table interactions
    const deviceTable = document.querySelector('#device-table');
    if (deviceTable) {
        setupDeviceTable(deviceTable);
    }

    // Sensor table interactions
    const sensorTable = document.querySelector('#sensor-table');
    if (sensorTable) {
        setupSensorTable(sensorTable);
    }

    // Alert table interactions
    const alertTable = document.querySelector('#alert-table');
    if (alertTable) {
        setupAlertTable(alertTable);
    }
}

function setupDeviceTable(table) {
    const addDeviceBtn = document.querySelector('#addDeviceBtn');
    const deviceForm = document.querySelector('#deviceForm');
    const deviceModal = document.querySelector('#deviceModal');

    if (addDeviceBtn) {
        addDeviceBtn.addEventListener('click', () => {
            if (deviceModal) {
                deviceModal.style.display = 'block';
            }
        });
    }

    if (deviceForm) {
        deviceForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const formData = new FormData(deviceForm);
            const deviceData = {
                name: formData.get('deviceName'),
                type: formData.get('deviceType'),
                location: formData.get('location'),
                status: 'Online',
                lastUpdate: new Date().toLocaleString()
            };

            addDeviceToTable(deviceData);
            
            if (deviceModal) {
                deviceModal.style.display = 'none';
            }
            
            deviceForm.reset();
        });
    }

    // Close modal functionality
    const closeBtns = document.querySelectorAll('.close');
    closeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (deviceModal) {
                deviceModal.style.display = 'none';
            }
        });
    });
}

function addDeviceToTable(deviceData) {
    const tbody = document.querySelector('#device-table tbody');
    if (!tbody) return;

    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td>${deviceData.name}</td>
        <td>${deviceData.type}</td>
        <td>${deviceData.location}</td>
        <td><span class="status-badge status-online">${deviceData.status}</span></td>
        <td>${deviceData.lastUpdate}</td>
        <td>
            <button class="btn btn-primary btn-sm" onclick="editDevice(this)">Edit</button>
            <button class="btn btn-danger btn-sm" onclick="deleteDevice(this)">Delete</button>
        </td>
    `;

    tbody.appendChild(newRow);
}

function setupSensorTable(table) {
    // Sensor table specific functionality
    const searchBox = document.querySelector('#sensorSearch');
    if (searchBox) {
        searchBox.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const rows = table.querySelectorAll('tbody tr');
            
            rows.forEach(row => {
                const text = row.textContent.toLowerCase();
                row.style.display = text.includes(searchTerm) ? '' : 'none';
            });
        });
    }
}

function setupAlertTable(table) {
    // Alert table specific functionality
    const filterSelect = document.querySelector('#alertFilter');
    if (filterSelect) {
        filterSelect.addEventListener('change', (e) => {
            const filterValue = e.target.value;
            const rows = table.querySelectorAll('tbody tr');
            
            rows.forEach(row => {
                const severity = row.querySelector('.status-badge').textContent;
                row.style.display = filterValue === 'all' || severity === filterValue ? '' : 'none';
            });
        });
    }
}

// Chart setup (placeholder for future implementation)
function setupCharts() {
    // This function can be used to initialize charts when needed
    console.log('📊 Charts setup ready');
}

// Animation setup
function setupAnimations() {
    // Add smooth animations to stat cards
    const statCards = document.querySelectorAll('.stat-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    });

    statCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'all 0.6s ease';
        observer.observe(card);
    });
}

// Global functions for table actions
function editDevice(button) {
    const row = button.closest('tr');
    const cells = row.cells;
    
    // Populate modal with current data
    const deviceModal = document.querySelector('#deviceModal');
    const deviceForm = document.querySelector('#deviceForm');
    
    if (deviceForm && deviceModal) {
        deviceForm.querySelector('[name="deviceName"]').value = cells[0].textContent;
        deviceForm.querySelector('[name="deviceType"]').value = cells[1].textContent;
        deviceForm.querySelector('[name="location"]').value = cells[2].textContent;
        
        deviceModal.style.display = 'block';
        
        // Update form submission to edit instead of add
        deviceForm.onsubmit = (e) => {
            e.preventDefault();
            
            const formData = new FormData(deviceForm);
            cells[0].textContent = formData.get('deviceName');
            cells[1].textContent = formData.get('deviceType');
            cells[2].textContent = formData.get('location');
            
            deviceModal.style.display = 'none';
            deviceForm.reset();
            
            // Reset form submission to add new devices
            deviceForm.onsubmit = null;
        };
    }
}

function deleteDevice(button) {
    if (confirm('Are you sure you want to delete this device?')) {
        const row = button.closest('tr');
        row.remove();
    }
}

// Utility functions
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style the notification
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#17a2b8'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        z-index: 3000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Export functions for global access
window.editDevice = editDevice;
window.deleteDevice = deleteDevice;
window.showNotification = showNotification; 