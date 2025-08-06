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
    console.log('🥬 Nutritionist Dashboard Loaded');
    
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
    // Inventory table functionality
    const inventorySearch = document.getElementById('inventorySearch');
    const addInventoryBtn = document.getElementById('addInventoryBtn');
    const deleteSelectedInventoryBtn = document.getElementById('deleteSelectedInventoryBtn');
    const selectAllInventory = document.getElementById('selectAllInventory');
    const inventoryTable = document.getElementById('inventoryTable');
    
    if (inventorySearch) {
        inventorySearch.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const rows = inventoryTable.querySelectorAll('tbody tr');
            
            rows.forEach(row => {
                const text = row.textContent.toLowerCase();
                row.style.display = text.includes(searchTerm) ? '' : 'none';
            });
        });
    }
    
    if (selectAllInventory) {
        selectAllInventory.addEventListener('change', function() {
            const checkboxes = inventoryTable.querySelectorAll('tbody input[type="checkbox"]');
            checkboxes.forEach(checkbox => {
                checkbox.checked = this.checked;
            });
        });
    }
    
    if (addInventoryBtn) {
        addInventoryBtn.addEventListener('click', () => {
            showAddInventoryModal();
        });
    }
    
    if (deleteSelectedInventoryBtn) {
        deleteSelectedInventoryBtn.addEventListener('click', () => {
            const selectedRows = inventoryTable.querySelectorAll('tbody input[type="checkbox"]:checked');
            if (selectedRows.length > 0) {
                if (confirm(`Are you sure you want to delete ${selectedRows.length} selected item(s)?`)) {
                    selectedRows.forEach(checkbox => {
                        checkbox.closest('tr').remove();
                    });
                }
            } else {
                alert('Please select at least one item to delete.');
            }
        });
    }
    
    // Setup delete row buttons
    const deleteRowBtns = document.querySelectorAll('.delete-row-btn');
    deleteRowBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            if (confirm('Are you sure you want to delete this item?')) {
                this.closest('tr').remove();
            }
        });
    });
}

// Show add inventory modal
function showAddInventoryModal() {
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Add Inventory Item</h3>
                <button class="modal-close" id="closeAddInventoryModal">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <form id="addInventoryForm">
                <div class="modal-body">
                    <label>Food Item</label>
                    <input type="text" id="modalFoodItem" required>
                    <label>Category</label>
                    <select id="modalCategory" required>
                        <option value="">Select Category</option>
                        <option value="Vegetables">Vegetables</option>
                        <option value="Fruits">Fruits</option>
                        <option value="Grasses">Grasses</option>
                        <option value="Supplements">Supplements</option>
                        <option value="Protein">Protein</option>
                    </select>
                    <label>Quantity</label>
                    <input type="number" id="modalQuantity" min="1" required>
                    <label>Unit</label>
                    <select id="modalUnit" required>
                        <option value="">Select Unit</option>
                        <option value="kg">Kilograms (kg)</option>
                        <option value="g">Grams (g)</option>
                        <option value="l">Liters (l)</option>
                        <option value="pieces">Pieces</option>
                    </select>
                    <label>Expiry Date</label>
                    <input type="date" id="modalExpiryDate" required>
                </div>
                <div class="modal-footer">
                    <button type="button" class="modal-btn secondary" id="cancelAddInventory">Cancel</button>
                    <button type="submit" class="modal-btn primary">Add</button>
                </div>
            </form>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Setup modal functionality
    const closeBtn = modal.querySelector('#closeAddInventoryModal');
    const cancelBtn = modal.querySelector('#cancelAddInventory');
    const form = modal.querySelector('#addInventoryForm');
    
    closeBtn.addEventListener('click', () => modal.remove());
    cancelBtn.addEventListener('click', () => modal.remove());
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = {
            foodItem: modal.querySelector('#modalFoodItem').value,
            category: modal.querySelector('#modalCategory').value,
            quantity: modal.querySelector('#modalQuantity').value,
            unit: modal.querySelector('#modalUnit').value,
            expiryDate: modal.querySelector('#modalExpiryDate').value
        };
        
        // Add new row to table
        addInventoryRow(formData);
        
        // Close modal
        modal.remove();
    });
}

// Add new inventory row to table
function addInventoryRow(data) {
    const tbody = document.querySelector('#inventoryTable tbody');
    const newRow = document.createElement('tr');
    
    // Determine status based on expiry date
    const expiryDate = new Date(data.expiryDate);
    const today = new Date();
    const daysUntilExpiry = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
    
    let status = 'Good';
    if (daysUntilExpiry <= 7) {
        status = 'Expiring Soon';
    } else if (daysUntilExpiry <= 0) {
        status = 'Expired';
    }
    
    newRow.innerHTML = `
        <td><input type="checkbox" class="row-select"></td>
        <td>${data.foodItem}</td>
        <td>${data.category}</td>
        <td>${data.quantity}</td>
        <td>${data.unit}</td>
        <td>${data.expiryDate}</td>
        <td><span class="status-badge ${status.toLowerCase().replace(' ', '-')}">${status}</span></td>
        <td>
            <button class="table-btn delete-row-btn"><i class="fas fa-trash"></i></button>
        </td>
    `;
    
    tbody.appendChild(newRow);
    
    // Setup delete button for new row
    const deleteBtn = newRow.querySelector('.delete-row-btn');
    deleteBtn.addEventListener('click', function() {
        if (confirm('Are you sure you want to delete this item?')) {
            this.closest('tr').remove();
        }
    });
}

// Setup charts (placeholder for future implementation)
function setupCharts() {
    // This function can be expanded to include charts for nutrition statistics
    console.log('📊 Nutrition charts setup ready for implementation');
}

// Setup animations
function setupAnimations() {
    // Add hover effects to cards
    const cards = document.querySelectorAll('.stat-card, .schedule-card, .diet-plan-card, .log-card, .health-card, .supplement-card, .report-card');
    
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
    console.log('🔄 Updating nutrition dashboard stats...');
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
    
    .status-badge.expiring-soon {
        background: #fff3cd;
        color: #856404;
    }
    
    .status-badge.expired {
        background: #f8d7da;
        color: #721c24;
    }
`;
document.head.appendChild(notificationStyles);

console.log('🎯 Nutritionist Dashboard Script Loaded Successfully'); 