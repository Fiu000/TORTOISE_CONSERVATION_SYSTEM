// DOM Elements
const logoutBtn = document.getElementById('logoutBtn');
const logoutModal = document.getElementById('logoutModal');
const closeModal = document.getElementById('closeModal');
const cancelLogout = document.getElementById('cancelLogout');
const confirmLogout = document.getElementById('confirmLogout');

// Navigation elements
const navItems = document.querySelectorAll('.nav-item');
const tabContents = document.querySelectorAll('.tab-content');

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Veterinarian Dashboard initialized');
    
    // Setup navigation
    setupNavigation();
    
    // Setup logout functionality
    setupLogout();
    
    // Setup interactive elements
    setupInteractiveElements();
    
    // Load initial data
    loadDashboardData();
});

// Setup navigation functionality
function setupNavigation() {
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            // Remove active class from all nav items and tab contents
            navItems.forEach(nav => nav.classList.remove('active'));
            tabContents.forEach(tab => tab.classList.remove('active'));
            
            // Add active class to clicked nav item and corresponding tab
            this.classList.add('active');
            const targetTabContent = document.getElementById(targetTab);
            if (targetTabContent) {
                targetTabContent.classList.add('active');
            }
            
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
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            if (logoutModal) {
                logoutModal.classList.add('active');
            }
        });
    }
    
    if (closeModal) {
        closeModal.addEventListener('click', () => {
            if (logoutModal) {
                logoutModal.classList.remove('active');
            }
        });
    }
    
    if (cancelLogout) {
        cancelLogout.addEventListener('click', () => {
            if (logoutModal) {
                logoutModal.classList.remove('active');
            }
        });
    }
    
    if (confirmLogout) {
        confirmLogout.addEventListener('click', () => {
            // Clear any stored data
            localStorage.removeItem('userCredentials');
            localStorage.removeItem('vetCredentials');
            
            // Redirect to login page with logout parameter
            window.location.href = 'login.html?logout=success';
        });
    }
    
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

// Setup interactive elements
function setupInteractiveElements() {
    // Setup action buttons
    const actionBtns = document.querySelectorAll('.action-btn');
    actionBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Add click animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
            
            // Handle different button types
            const btnText = this.textContent.trim();
            if (btnText.includes('View Details')) {
                showDetailsModal(this);
            } else if (btnText.includes('Update')) {
                showUpdateModal(this);
            } else if (btnText.includes('Schedule')) {
                showScheduleModal(this);
            } else if (btnText.includes('Assign')) {
                showAssignModal(this);
            }
        });
    });
    
    // Setup alert action buttons
    const alertActions = document.querySelectorAll('.alert-action');
    alertActions.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Add click animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
            
            // Handle alert actions
            const alertCard = this.closest('.alert-card');
            if (alertCard) {
                const alertTitle = alertCard.querySelector('h3').textContent;
                showAlertDetailsModal(alertTitle);
            }
        });
    });
    
    // Setup table buttons
    const tableBtns = document.querySelectorAll('.table-btn');
    tableBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Add click animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
            
            // Handle table button actions
            if (this.classList.contains('add-btn')) {
                showAddRecordModal();
            }
        });
    });
    
    // Setup search functionality
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            filterRecords(searchTerm);
        });
    }
}

// Load dashboard data
function loadDashboardData() {
    console.log('📊 Loading dashboard data...');
    
    // Simulate loading data
    setTimeout(() => {
        updateStats();
        updateAlerts();
        updateSchedule();
    }, 500);
}

// Update statistics
function updateStats() {
    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers.forEach(stat => {
        const finalValue = parseInt(stat.textContent);
        animateNumber(stat, 0, finalValue, 1000);
    });
}

// Animate number counting
function animateNumber(element, start, end, duration) {
    const startTime = performance.now();
    const difference = end - start;
    
    function updateNumber(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const current = Math.floor(start + (difference * progress));
        element.textContent = current;
        
        if (progress < 1) {
            requestAnimationFrame(updateNumber);
        }
    }
    
    requestAnimationFrame(updateNumber);
}

// Update alerts
function updateAlerts() {
    const alerts = document.querySelectorAll('.alert-card');
    alerts.forEach((alert, index) => {
        setTimeout(() => {
            alert.style.opacity = '0';
            alert.style.transform = 'translateY(20px)';
            alert.style.transition = 'all 0.5s ease';
            
            setTimeout(() => {
                alert.style.opacity = '1';
                alert.style.transform = 'translateY(0)';
            }, 100);
        }, index * 200);
    });
}

// Update schedule
function updateSchedule() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach((item, index) => {
        setTimeout(() => {
            item.style.opacity = '0';
            item.style.transform = 'translateX(-20px)';
            item.style.transition = 'all 0.5s ease';
            
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateX(0)';
            }, 100);
        }, index * 150);
    });
}

// Filter records
function filterRecords(searchTerm) {
    const tableRows = document.querySelectorAll('.records-table tbody tr');
    
    tableRows.forEach(row => {
        const text = row.textContent.toLowerCase();
        if (text.includes(searchTerm)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

// Show details modal
function showDetailsModal(button) {
    const card = button.closest('.card, .treatment-card, .enclosure-card, .breeding-card, .nutrition-card, .environmental-card, .task-card');
    if (card) {
        const title = card.querySelector('h3').textContent;
        showModal(`Details for ${title}`, `Detailed information about ${title} will be displayed here.`);
    }
}

// Show update modal
function showUpdateModal(button) {
    const card = button.closest('.card, .treatment-card, .enclosure-card, .breeding-card, .nutrition-card, .environmental-card, .task-card');
    if (card) {
        const title = card.querySelector('h3').textContent;
        showModal(`Update ${title}`, `Update form for ${title} will be displayed here.`);
    }
}

// Show schedule modal
function showScheduleModal(button) {
    showModal('Schedule Appointment', 'Schedule an appointment for vaccination or health check.');
}

// Show assign modal
function showAssignModal(button) {
    showModal('Assign Task', 'Assign this task to a staff member.');
}

// Show alert details modal
function showAlertDetailsModal(alertTitle) {
    showModal(`Alert Details - ${alertTitle}`, `Detailed information about the alert: ${alertTitle}`);
}

// Show add record modal
function showAddRecordModal() {
    showModal('Add New Record', 'Add a new health record for a tortoise.');
}

// Generic modal function
function showModal(title, content) {
    // Create modal HTML
    const modalHTML = `
        <div class="modal active" id="infoModal">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${title}</h3>
                    <button class="modal-close" onclick="closeInfoModal()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <p>${content}</p>
                </div>
                <div class="modal-footer">
                    <button class="modal-btn secondary" onclick="closeInfoModal()">Close</button>
                </div>
            </div>
        </div>
    `;
    
    // Add modal to body
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Close modal when clicking outside
    const modal = document.getElementById('infoModal');
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeInfoModal();
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeInfoModal();
        }
    });
}

// Close info modal
function closeInfoModal() {
    const modal = document.getElementById('infoModal');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.remove();
        }, 300);
    }
}

// Add hover effects to cards
document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.stat-card, .alert-card, .enclosure-card, .breeding-card, .nutrition-card, .treatment-card, .environmental-card, .task-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
});

// Add loading animations
function addLoadingAnimation() {
    const loadingElements = document.querySelectorAll('.stat-card, .alert-card, .timeline-item');
    
    loadingElements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            element.style.transition = 'all 0.5s ease';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// Initialize loading animation
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(addLoadingAnimation, 100);
});

// Add keyboard navigation
document.addEventListener('keydown', function(e) {
    // Tab navigation
    if (e.key === 'Tab') {
        const activeElement = document.activeElement;
        if (activeElement && activeElement.classList.contains('nav-item')) {
            activeElement.style.outline = '2px solid #228B22';
        }
    }
    
    // Enter key to activate nav items
    if (e.key === 'Enter') {
        const activeElement = document.activeElement;
        if (activeElement && activeElement.classList.contains('nav-item')) {
            activeElement.click();
        }
    }
    
    // Escape key to close modals
    if (e.key === 'Escape') {
        const activeModal = document.querySelector('.modal.active');
        if (activeModal) {
            if (activeModal.id === 'logoutModal') {
                logoutModal.classList.remove('active');
            } else {
                closeInfoModal();
            }
        }
    }
});

// Add accessibility features
document.addEventListener('DOMContentLoaded', function() {
    // Add ARIA labels
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach((item, index) => {
        item.setAttribute('tabindex', '0');
        item.setAttribute('role', 'tab');
        item.setAttribute('aria-selected', index === 0 ? 'true' : 'false');
    });
    
    // Add focus management
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach((tab, index) => {
        tab.setAttribute('role', 'tabpanel');
        tab.setAttribute('aria-labelledby', `nav-item-${index}`);
    });
    
    // Add screen reader announcements
    const announceToScreenReader = (message) => {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'sr-only';
        announcement.textContent = message;
        document.body.appendChild(announcement);
        
        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 1000);
    };
    
    // Announce tab changes
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const tabName = this.querySelector('span').textContent;
            announceToScreenReader(`Switched to ${tabName} tab`);
        });
    });
});

// Add screen reader only class
const srOnlyStyles = `
    .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
    }
`;

const srStyleSheet = document.createElement('style');
srStyleSheet.textContent = srOnlyStyles;
document.head.appendChild(srStyleSheet);

// Export functions for global access
window.closeInfoModal = closeInfoModal; 