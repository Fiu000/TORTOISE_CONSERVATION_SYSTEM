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
    console.log('🔧 Maintenance Staff Dashboard Loaded');
    
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

// Setup navigation between tabs
function setupNavigation() {
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            // Remove active class from all nav items and tab contents
            navItems.forEach(nav => nav.classList.remove('active'));
            tabContents.forEach(tab => tab.classList.remove('active'));
            
            // Add active class to clicked nav item and corresponding tab
            this.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
            
            // Add click animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    });
}

// Setup logout functionality
function setupLogout() {
    logoutBtn.addEventListener('click', () => {
        logoutModal.classList.add('active');
    });
    
    closeModal.addEventListener('click', () => {
        logoutModal.classList.remove('active');
    });
    
    cancelLogout.addEventListener('click', () => {
        logoutModal.classList.remove('active');
    });
    
    confirmLogout.addEventListener('click', () => {
        // Clear any stored credentials
        localStorage.removeItem('userCredentials');
        
        // Redirect to login page with logout parameter
        window.location.href = 'login.html?logout=success';
    });
    
    // Close modal when clicking outside
    logoutModal.addEventListener('click', (e) => {
        if (e.target === logoutModal) {
            logoutModal.classList.remove('active');
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && logoutModal.classList.contains('active')) {
            logoutModal.classList.remove('active');
        }
    });
}

// Setup table functionality
function setupTables() {
    // Repairs table functionality
    const repairsSearch = document.getElementById('repairsSearch');
    const addRepairBtn = document.getElementById('addRepairBtn');
    const deleteSelectedRepairsBtn = document.getElementById('deleteSelectedRepairsBtn');
    const selectAllRepairs = document.getElementById('selectAllRepairs');
    const repairsTable = document.getElementById('repairsTable');
    
    if (repairsSearch) {
        repairsSearch.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const rows = repairsTable.querySelectorAll('tbody tr');
            
            rows.forEach(row => {
                const text = row.textContent.toLowerCase();
                row.style.display = text.includes(searchTerm) ? '' : 'none';
            });
        });
    }
    
    if (selectAllRepairs) {
        selectAllRepairs.addEventListener('change', function() {
            const checkboxes = repairsTable.querySelectorAll('tbody input[type="checkbox"]');
            checkboxes.forEach(checkbox => {
                checkbox.checked = this.checked;
            });
        });
    }
    
    if (addRepairBtn) {
        addRepairBtn.addEventListener('click', () => {
            showAddRepairModal();
        });
    }
    
    if (deleteSelectedRepairsBtn) {
        deleteSelectedRepairsBtn.addEventListener('click', () => {
            const selectedRows = repairsTable.querySelectorAll('tbody input[type="checkbox"]:checked');
            if (selectedRows.length > 0) {
                if (confirm(`Are you sure you want to delete ${selectedRows.length} selected repair request(s)?`)) {
                    selectedRows.forEach(checkbox => {
                        checkbox.closest('tr').remove();
                    });
                }
            } else {
                alert('Please select at least one repair request to delete.');
            }
        });
    }
    
    // Setup delete row buttons
    const deleteRowBtns = document.querySelectorAll('.delete-row-btn');
    deleteRowBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            if (confirm('Are you sure you want to delete this repair request?')) {
                this.closest('tr').remove();
            }
        });
    });
}

// Show add repair modal
function showAddRepairModal() {
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Add Repair Request</h3>
                <button class="modal-close" id="closeAddRepairModal">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <form id="addRepairForm">
                <div class="modal-body">
                    <label>Location</label>
                    <input type="text" id="modalLocation" required>
                    <label>Issue Description</label>
                    <textarea id="modalIssue" rows="3" required></textarea>
                    <label>Priority</label>
                    <select id="modalPriority" required>
                        <option value="">Select Priority</option>
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                    </select>
                    <label>Assigned To</label>
                    <select id="modalAssignedTo" required>
                        <option value="">Select Staff Member</option>
                        <option value="Mike Johnson">Mike Johnson</option>
                        <option value="John Smith">John Smith</option>
                        <option value="Sarah Johnson">Sarah Johnson</option>
                    </select>
                </div>
                <div class="modal-footer">
                    <button type="button" class="modal-btn secondary" id="cancelAddRepair">Cancel</button>
                    <button type="submit" class="modal-btn primary">Add</button>
                </div>
            </form>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Setup modal functionality
    const closeBtn = modal.querySelector('#closeAddRepairModal');
    const cancelBtn = modal.querySelector('#cancelAddRepair');
    const form = modal.querySelector('#addRepairForm');
    
    closeBtn.addEventListener('click', () => modal.remove());
    cancelBtn.addEventListener('click', () => modal.remove());
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = {
            location: modal.querySelector('#modalLocation').value,
            issue: modal.querySelector('#modalIssue').value,
            priority: modal.querySelector('#modalPriority').value,
            assignedTo: modal.querySelector('#modalAssignedTo').value
        };
        
        // Add new row to table
        addRepairRow(formData);
        
        // Close modal
        modal.remove();
    });
}

// Add new repair row to table
function addRepairRow(data) {
    const tbody = document.querySelector('#repairsTable tbody');
    const newRow = document.createElement('tr');
    
    const requestId = '#' + 'REP' + String(tbody.children.length + 1).padStart(3, '0');
    
    newRow.innerHTML = `
        <td><input type="checkbox" class="row-select"></td>
        <td>${requestId}</td>
        <td>${data.location}</td>
        <td>${data.issue}</td>
        <td><span class="priority ${data.priority.toLowerCase()}">${data.priority}</span></td>
        <td><span class="status-badge pending">Pending</span></td>
        <td>${data.assignedTo}</td>
        <td>
            <button class="table-btn delete-row-btn"><i class="fas fa-trash"></i></button>
        </td>
    `;
    
    tbody.appendChild(newRow);
    
    // Setup delete button for new row
    const deleteBtn = newRow.querySelector('.delete-row-btn');
    deleteBtn.addEventListener('click', function() {
        if (confirm('Are you sure you want to delete this repair request?')) {
            this.closest('tr').remove();
        }
    });
}

// Setup charts (placeholder for future implementation)
function setupCharts() {
    // This function can be expanded to include charts for maintenance statistics
    console.log('📊 Maintenance charts setup ready for implementation');
}

// Setup animations
function setupAnimations() {
    // Add hover effects to cards
    const cards = document.querySelectorAll('.stat-card, .enclosure-card, .equipment-card, .cleaning-task-card, .inspection-card, .report-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Add click effects to buttons
    const buttons = document.querySelectorAll('.action-btn, .view-report-btn, .update-status-btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    });
}

// Utility function to format dates
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Utility function to calculate days between dates
function daysBetween(date1, date2) {
    const oneDay = 24 * 60 * 60 * 1000;
    const firstDate = new Date(date1);
    const secondDate = new Date(date2);
    return Math.round(Math.abs((firstDate - secondDate) / oneDay));
}

// Auto-refresh functionality for real-time data
function setupAutoRefresh() {
    // Refresh stats every 5 minutes
    setInterval(() => {
        updateStats();
    }, 300000);
}

// Update dashboard stats
function updateStats() {
    // This function can be expanded to fetch real-time data from a backend
    console.log('🔄 Updating maintenance dashboard stats...');
}

// Initialize auto-refresh
setupAutoRefresh();

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + K to focus search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.querySelector('input[type="text"]');
        if (searchInput) {
            searchInput.focus();
        }
    }
    
    // Escape to close modals
    if (e.key === 'Escape') {
        const activeModal = document.querySelector('.modal.active');
        if (activeModal) {
            activeModal.classList.remove('active');
        }
    }
    
    // Number keys to switch tabs
    if (e.key >= '1' && e.key <= '8') {
        const tabIndex = parseInt(e.key) - 1;
        const navItems = document.querySelectorAll('.nav-item');
        if (navItems[tabIndex]) {
            navItems[tabIndex].click();
        }
    }
});

// Add loading states for better UX
function showLoading(element) {
    element.style.opacity = '0.6';
    element.style.pointerEvents = 'none';
}

function hideLoading(element) {
    element.style.opacity = '1';
    element.style.pointerEvents = 'auto';
}

// Add success/error notifications
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-triangle'}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Add CSS for notifications
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: white;
        color: #333;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        display: flex;
        align-items: center;
        gap: 10px;
        z-index: 1000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
    }
    
    .notification.show {
        transform: translateX(0);
    }
    
    .notification.success {
        border-left: 4px solid #28a745;
    }
    
    .notification.error {
        border-left: 4px solid #dc3545;
    }
    
    .notification i {
        font-size: 1.2rem;
    }
    
    .notification.success i {
        color: #28a745;
    }
    
    .notification.error i {
        color: #dc3545;
    }
`;
document.head.appendChild(notificationStyles);

console.log('🎯 Maintenance Staff Dashboard Script Loaded Successfully'); 