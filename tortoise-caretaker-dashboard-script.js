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
    console.log('🐢 Tortoise Caretaker Dashboard Loaded');

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
    // Care records table interactions
    const careTable = document.querySelector('#care-table');
    if (careTable) {
        setupCareTable(careTable);
    }

    // Feeding table interactions
    const feedingTable = document.querySelector('#feeding-table');
    if (feedingTable) {
        setupFeedingTable(feedingTable);
    }

    // Maintenance table interactions
    const maintenanceTable = document.querySelector('#maintenance-table');
    if (maintenanceTable) {
        setupMaintenanceTable(maintenanceTable);
    }

    // Health table interactions
    const healthTable = document.querySelector('#health-table');
    if (healthTable) {
        setupHealthTable(healthTable);
    }

    // Tasks table interactions
    const tasksTable = document.querySelector('#tasks-table');
    if (tasksTable) {
        setupTasksTable(tasksTable);
    }

    // Reports table interactions
    const reportsTable = document.querySelector('#reports-table');
    if (reportsTable) {
        setupReportsTable(reportsTable);
    }
}

function setupCareTable(table) {
    const addCareRecordBtn = document.querySelector('#addCareRecordBtn');
    const searchBox = table.parentElement.querySelector('.search-box input');
    const filterSelect = table.parentElement.querySelector('.filter-select');

    if (addCareRecordBtn) {
        addCareRecordBtn.addEventListener('click', () => {
            showNotification('Add Care Record functionality would open a modal here', 'info');
        });
    }

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

    if (filterSelect) {
        filterSelect.addEventListener('change', (e) => {
            const filterValue = e.target.value;
            const rows = table.querySelectorAll('tbody tr');
            
            rows.forEach(row => {
                const species = row.cells[1].textContent.toLowerCase();
                row.style.display = filterValue === 'all' || species === filterValue ? '' : 'none';
            });
        });
    }
}

function setupFeedingTable(table) {
    const addFeedingBtn = document.querySelector('#addFeedingBtn');

    if (addFeedingBtn) {
        addFeedingBtn.addEventListener('click', () => {
            showNotification('Add Feeding functionality would open a modal here', 'info');
        });
    }
}

function setupMaintenanceTable(table) {
    const addMaintenanceBtn = document.querySelector('#addMaintenanceBtn');

    if (addMaintenanceBtn) {
        addMaintenanceBtn.addEventListener('click', () => {
            showNotification('Add Maintenance Task functionality would open a modal here', 'info');
        });
    }
}

function setupHealthTable(table) {
    const addObservationBtn = document.querySelector('#addObservationBtn');

    if (addObservationBtn) {
        addObservationBtn.addEventListener('click', () => {
            showNotification('Add Health Observation functionality would open a modal here', 'info');
        });
    }
}

function setupTasksTable(table) {
    const addTaskBtn = document.querySelector('#addTaskBtn');

    if (addTaskBtn) {
        addTaskBtn.addEventListener('click', () => {
            showNotification('Add Task functionality would open a modal here', 'info');
        });
    }
}

function setupReportsTable(table) {
    const generateReportBtn = document.querySelector('#generateReportBtn');

    if (generateReportBtn) {
        generateReportBtn.addEventListener('click', () => {
            showNotification('Generate Report functionality would create a new report', 'success');
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

    // Add animations to quick action buttons
    const quickActionBtns = document.querySelectorAll('.quick-action-btn');
    quickActionBtns.forEach((btn, index) => {
        btn.style.opacity = '0';
        btn.style.transform = 'translateY(20px)';
        btn.style.transition = 'all 0.6s ease';
        
        setTimeout(() => {
            btn.style.opacity = '1';
            btn.style.transform = 'translateY(0)';
        }, 200 * (index + 1));
    });
}

// Quick action button functionality
document.addEventListener('DOMContentLoaded', () => {
    const quickActionBtns = document.querySelectorAll('.quick-action-btn');
    
    quickActionBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const action = btn.querySelector('span').textContent;
            
            switch(action) {
                case 'Add Care Record':
                    showNotification('Opening Add Care Record form...', 'info');
                    break;
                case 'View Schedule':
                    showNotification('Opening Schedule view...', 'info');
                    break;
                case 'Report Issue':
                    showNotification('Opening Issue Report form...', 'info');
                    break;
                case 'Generate Report':
                    showNotification('Generating report...', 'success');
                    break;
                default:
                    showNotification('Action clicked: ' + action, 'info');
            }
        });
    });
});

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
window.showNotification = showNotification; 