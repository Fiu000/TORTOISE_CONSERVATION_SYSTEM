// DOM Elements
const logoutBtn = document.getElementById('logoutBtn');
const logoutModal = document.getElementById('logoutModal');
const closeModal = document.getElementById('closeModal');
const cancelLogout = document.getElementById('cancelLogout');
const confirmLogout = document.getElementById('confirmLogout');

// Navigation elements
const navItems = document.querySelectorAll('.nav-item');
const tabContents = document.querySelectorAll('.tab-content');

// Sidebar navigation switching
const sidebarItems = document.querySelectorAll('.sidebar-item');
const dashboardTables = document.querySelectorAll('.dashboard-table');

// Add Modal logic
const addModal = document.getElementById('addModal');
const addForm = document.getElementById('addForm');
const addFormFields = document.getElementById('addFormFields');
const addModalTitle = document.getElementById('addModalTitle');
const closeAddModal = document.getElementById('closeAddModal');
const cancelAdd = document.getElementById('cancelAdd');
let currentAddTable = null;
let currentAddDash = null;

function showAddModal(dash, table) {
    currentAddTable = table;
    currentAddDash = dash;
    // Set modal title
    addModalTitle.textContent = 'Add New Entry';
    // Clear previous fields
    addFormFields.innerHTML = '';
    // Get columns
    const ths = table.querySelectorAll('thead th');
    ths.forEach((th, idx) => {
        const label = th.textContent;
        const input = document.createElement('input');
        input.type = 'text';
        input.name = 'col' + idx;
        input.placeholder = label;
        input.required = true;
        input.className = 'modal-input';
        const fieldDiv = document.createElement('div');
        fieldDiv.className = 'modal-field';
        fieldDiv.appendChild(input);
        addFormFields.appendChild(fieldDiv);
    });
    addModal.classList.add('active');
}

if (closeAddModal) closeAddModal.onclick = () => addModal.classList.remove('active');
if (cancelAdd) cancelAdd.onclick = () => addModal.classList.remove('active');

addForm.onsubmit = function(e) {
    e.preventDefault();
    if (!currentAddTable) return;
    const values = Array.from(addForm.querySelectorAll('input')).map(i => i.value);
    const tr = document.createElement('tr');
    values.forEach(val => {
        const td = document.createElement('td');
        td.textContent = val;
        tr.appendChild(td);
    });
    currentAddTable.querySelector('tbody').appendChild(tr);
    addModal.classList.remove('active');
    updateChartForDashboard(currentAddDash);
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Admin Dashboard initialized');
    
    // Setup navigation
    setupNavigation();
    
    // Setup logout functionality
    setupLogout();
    
    // Setup interactive elements
    setupInteractiveElements();
    
    // Load initial data
    loadDashboardData();
    
    // Setup real-time monitoring
    setupRealTimeMonitoring();

    // Sidebar navigation switching
    sidebarItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active from all
            sidebarItems.forEach(i => i.classList.remove('active'));
            dashboardTables.forEach(t => t.classList.remove('active'));
            // Add active to clicked
            this.classList.add('active');
            const dash = this.getAttribute('data-dashboard');
            document.getElementById('dashboard-' + dash).classList.add('active');
        });
    });

    // Live date/time in header
    function updateDateTime() {
        const dt = document.getElementById('currentDatetime');
        if (!dt) return;
        const now = new Date();
        dt.textContent = now.toLocaleString('en-US', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
            hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true
        });
    }
    setInterval(updateDateTime, 1000);
    updateDateTime();

    // Pie chart logic
    const chartConfigs = {
        caretaker: {
            canvas: 'chart-caretaker',
            getData: () => {
                // Pie: Species distribution OR gender ratio
                const table = document.querySelector('#dashboard-caretaker table');
                const species = {}, gender = {};
                Array.from(table.querySelectorAll('tbody tr')).forEach(row => {
                    const sp = row.children[1].textContent;
                    const g = row.children[3].textContent;
                    species[sp] = (species[sp] || 0) + 1;
                    gender[g] = (gender[g] || 0) + 1;
                });
                // Default: show species
                return {
                    labels: Object.keys(species),
                    data: Object.values(species),
                    label: 'Species Distribution'
                };
            },
            colors: ['#228B22', '#32CD32', '#90EE90', '#98FB98', '#b2e0ff']
        },
        maintenance: {
            canvas: 'chart-maintenance',
            getData: () => {
                // Pie: Number of enclosures by habitat type
                const table = document.querySelector('#dashboard-maintenance table');
                const habitats = {};
                Array.from(table.querySelectorAll('tbody tr')).forEach(row => {
                    const h = row.children[2].textContent;
                    habitats[h] = (habitats[h] || 0) + 1;
                });
                return {
                    labels: Object.keys(habitats),
                    data: Object.values(habitats),
                    label: 'Enclosures by Habitat Type'
                };
            },
            colors: ['#228B22', '#32CD32', '#90EE90', '#98FB98', '#b2e0ff']
        },
        breeding: {
            canvas: 'chart-breeding',
            getData: () => {
                // Pie: Hatching success rate categories
                const table = document.querySelector('#dashboard-breeding table');
                const cats = { '0-50%': 0, '51-80%': 0, '81-100%': 0 };
                Array.from(table.querySelectorAll('tbody tr')).forEach(row => {
                    const val = row.children[7].textContent.replace('%','');
                    const num = parseInt(val);
                    if (num <= 50) cats['0-50%']++;
                    else if (num <= 80) cats['51-80%']++;
                    else cats['81-100%']++;
                });
                return {
                    labels: Object.keys(cats),
                    data: Object.values(cats),
                    label: 'Hatching Success Rate'
                };
            },
            colors: ['#ffb347', '#32CD32', '#228B22']
        },
        nutrition: {
            canvas: 'chart-nutrition',
            getData: () => {
                // Pie: Types of diets
                const table = document.querySelector('#dashboard-nutrition table');
                const diets = {};
                Array.from(table.querySelectorAll('tbody tr')).forEach(row => {
                    const d = row.children[2].textContent;
                    diets[d] = (diets[d] || 0) + 1;
                });
                return {
                    labels: Object.keys(diets),
                    data: Object.values(diets),
                    label: 'Diet Types'
                };
            },
            colors: ['#228B22', '#32CD32', '#90EE90', '#98FB98', '#b2e0ff']
        },
        veterinarian: {
            canvas: 'chart-veterinarian',
            getData: () => {
                // Pie: Health Status
                const table = document.querySelector('#dashboard-veterinarian table');
                const status = {};
                Array.from(table.querySelectorAll('tbody tr')).forEach(row => {
                    const s = row.children[2].textContent;
                    status[s] = (status[s] || 0) + 1;
                });
                return {
                    labels: Object.keys(status),
                    data: Object.values(status),
                    label: 'Health Status'
                };
            },
            colors: ['#228B22', '#ffb347', '#dc3545', '#32CD32']
        },
        iot: {
            canvas: 'chart-iot',
            getData: () => {
                // Pie: Sensor locations by type
                const table = document.querySelector('#dashboard-iot table');
                const locs = {};
                Array.from(table.querySelectorAll('tbody tr')).forEach(row => {
                    const l = row.children[1].textContent;
                    locs[l] = (locs[l] || 0) + 1;
                });
                return {
                    labels: Object.keys(locs),
                    data: Object.values(locs),
                    label: 'Sensor Locations'
                };
            },
            colors: ['#228B22', '#32CD32', '#b2e0ff']
        },
        task: {
            canvas: 'chart-task',
            getData: () => {
                // Pie: Task completion status
                const table = document.querySelector('#dashboard-task table');
                const status = {};
                Array.from(table.querySelectorAll('tbody tr')).forEach(row => {
                    const s = row.children[5].textContent;
                    status[s] = (status[s] || 0) + 1;
                });
                return {
                    labels: Object.keys(status),
                    data: Object.values(status),
                    label: 'Task Completion Status'
                };
            },
            colors: ['#228B22', '#ffb347', '#dc3545', '#32CD32']
        }
    };

    const chartInstances = {};
    function updateChartForDashboard(dash) {
        const config = chartConfigs[dash];
        if (!config) return;
        const ctx = document.getElementById(config.canvas).getContext('2d');
        const chartData = config.getData();
        if (chartInstances[dash]) {
            chartInstances[dash].data.labels = chartData.labels;
            chartInstances[dash].data.datasets[0].data = chartData.data;
            chartInstances[dash].update();
        } else {
            chartInstances[dash] = new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: chartData.labels,
                    datasets: [{
                        data: chartData.data,
                        backgroundColor: config.colors,
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: { position: 'bottom' },
                        title: { display: true, text: chartData.label }
                    }
                }
            });
        }
    }
    // Initial chart render for all dashboards
    Object.keys(chartConfigs).forEach(updateChartForDashboard);

    // Table search, add, delete logic for all tables
    const dashboards = [
        'caretaker', 'maintenance', 'breeding', 'nutrition', 'veterinarian', 'iot', 'task'
    ];

    dashboards.forEach(dash => {
        const tableDiv = document.getElementById('dashboard-' + dash);
        if (!tableDiv) return;
        const search = tableDiv.querySelector('.table-search');
        const addBtn = tableDiv.querySelector('.add-btn');
        const deleteBtn = tableDiv.querySelector('.delete-btn');
        const table = tableDiv.querySelector('table');
        const tbody = table.querySelector('tbody');
        let selectedRows = new Set();

        // Search functionality
        if (search) {
            search.addEventListener('input', function() {
                const val = this.value.toLowerCase();
                Array.from(tbody.querySelectorAll('tr')).forEach(row => {
                    const rowText = row.textContent.toLowerCase();
                    row.style.display = rowText.includes(val) ? '' : 'none';
                });
            });
        }

        // Row selection for delete
        tbody.addEventListener('click', function(e) {
            const tr = e.target.closest('tr');
            if (!tr) return;
            tr.classList.toggle('selected');
            if (tr.classList.contains('selected')) {
                selectedRows.add(tr);
            } else {
                selectedRows.delete(tr);
            }
        });

        // Add row (show modal form)
        if (addBtn) {
            addBtn.addEventListener('click', function() {
                showAddModal(dash, table);
            });
        }

        // Delete selected rows
        if (deleteBtn) {
            deleteBtn.addEventListener('click', function() {
                if (selectedRows.size === 0) {
                    alert('Select row(s) to delete by clicking them.');
                    return;
                }
                selectedRows.forEach(tr => tr.remove());
                selectedRows.clear();
                updateChartForDashboard(dash);
            });
        }
    });

    // Highlight selected row
    const style = document.createElement('style');
    style.textContent = `
        .dashboard-table-main tr.selected {
            background: #c8f7c5 !important;
            box-shadow: 0 2px 8px rgba(34,139,34,0.08);
        }
        .dashboard-chart-container {
            width: 100%;
            max-width: 400px;
            margin: 0 auto 1.5rem auto;
            background: #fff;
            border-radius: 20px;
            box-shadow: 0 4px 16px rgba(34,139,34,0.07);
            padding: 1.5rem 1rem 1rem 1rem;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .modal-input {
            width: 100%;
            padding: 0.75rem 1rem;
            border: 1.5px solid #32CD32;
            border-radius: 10px;
            font-size: 1rem;
            margin-bottom: 1rem;
            outline: none;
            transition: border 0.2s;
        }
        .modal-input:focus {
            border-color: #228B22;
            background: #f5f7fa;
        }
    `;
    document.head.appendChild(style);

    // Logout modal logic (reuse existing)
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            if (logoutModal) logoutModal.classList.add('active');
        });
    }
    if (closeModal) {
        closeModal.addEventListener('click', () => {
            if (logoutModal) logoutModal.classList.remove('active');
        });
    }
    if (cancelLogout) {
        cancelLogout.addEventListener('click', () => {
            if (logoutModal) logoutModal.classList.remove('active');
        });
    }
    if (confirmLogout) {
        confirmLogout.addEventListener('click', () => {
            localStorage.removeItem('userCredentials');
            window.location.href = 'login.html?logout=success';
        });
    }
    // Close modal on outside click
    if (logoutModal) {
        logoutModal.addEventListener('click', (e) => {
            if (e.target === logoutModal) logoutModal.classList.remove('active');
        });
    }
    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && logoutModal && logoutModal.classList.contains('active')) {
            logoutModal.classList.remove('active');
        }
        if (e.key === 'Escape' && addModal && addModal.classList.contains('active')) {
            addModal.classList.remove('active');
        }
    });
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
            localStorage.removeItem('adminCredentials');
            
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
                showUserDetailsModal(this);
            } else if (btnText.includes('Send Message')) {
                showMessageModal(this);
            } else if (btnText.includes('Edit')) {
                showEditUserModal(this);
            } else if (btnText.includes('Permissions')) {
                showPermissionsModal(this);
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
                showAddUserModal();
            } else if (this.textContent.includes('Export')) {
                exportLogs();
            } else if (this.textContent.includes('Permissions')) {
                showManagePermissionsModal();
            }
        });
    });
    
    // Setup search functionality
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            filterActivities(searchTerm);
        });
    }
    
    // Setup filter functionality
    const filterSelect = document.querySelector('.filter-select');
    if (filterSelect) {
        filterSelect.addEventListener('change', function() {
            const filterValue = this.value;
            filterByDepartment(filterValue);
        });
    }
    
    // Setup settings form
    const settingsForms = document.querySelectorAll('.settings-card');
    settingsForms.forEach(form => {
        const saveBtn = form.querySelector('.action-btn.primary');
        if (saveBtn) {
            saveBtn.addEventListener('click', function() {
                saveSettings(form);
            });
        }
    });
}

// Load dashboard data
function loadDashboardData() {
    console.log('📊 Loading admin dashboard data...');
    
    // Simulate loading data
    setTimeout(() => {
        updateStats();
        updateDepartmentStatus();
        updateRecentActivities();
        updateUserMonitoring();
    }, 500);
}

// Update statistics
function updateStats() {
    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers.forEach(stat => {
        const finalValue = stat.textContent;
        if (finalValue.includes('%')) {
            const numericValue = parseInt(finalValue);
            animateNumber(stat, 0, numericValue, 1000, '%');
        } else {
            const numericValue = parseInt(finalValue);
            animateNumber(stat, 0, numericValue, 1000);
        }
    });
}

// Animate number counting
function animateNumber(element, start, end, duration, suffix = '') {
    const startTime = performance.now();
    const difference = end - start;
    
    function updateNumber(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const current = Math.floor(start + (difference * progress));
        element.textContent = current + suffix;
        
        if (progress < 1) {
            requestAnimationFrame(updateNumber);
        }
    }
    
    requestAnimationFrame(updateNumber);
}

// Update department status
function updateDepartmentStatus() {
    const departmentCards = document.querySelectorAll('.department-card');
    departmentCards.forEach((card, index) => {
        setTimeout(() => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'all 0.5s ease';
            
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 100);
        }, index * 200);
    });
}

// Update recent activities
function updateRecentActivities() {
    const activityItems = document.querySelectorAll('.activity-item');
    activityItems.forEach((item, index) => {
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

// Update user monitoring
function updateUserMonitoring() {
    const userCards = document.querySelectorAll('.user-card');
    userCards.forEach((card, index) => {
        setTimeout(() => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'all 0.5s ease';
            
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 100);
        }, index * 200);
    });
}

// Filter activities
function filterActivities(searchTerm) {
    const tableRows = document.querySelectorAll('.activity-logs-table tbody tr');
    
    tableRows.forEach(row => {
        const text = row.textContent.toLowerCase();
        if (text.includes(searchTerm)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

// Filter by department
function filterByDepartment(department) {
    const tableRows = document.querySelectorAll('.activity-logs-table tbody tr');
    
    if (!department) {
        tableRows.forEach(row => {
            row.style.display = '';
        });
        return;
    }
    
    tableRows.forEach(row => {
        const deptCell = row.querySelector('td:nth-child(3)');
        if (deptCell && deptCell.textContent.toLowerCase().includes(department.toLowerCase())) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

// Setup real-time monitoring
function setupRealTimeMonitoring() {
    // Simulate real-time updates every 30 seconds
    setInterval(() => {
        updateRealTimeData();
    }, 30000);
}

// Update real-time data
function updateRealTimeData() {
    // Update user status
    updateUserStatus();
    
    // Update activity logs
    addNewActivityLog();
    
    // Update department stats
    updateDepartmentStats();
}

// Update user status
function updateUserStatus() {
    const userStatuses = document.querySelectorAll('.user-status');
    userStatuses.forEach(status => {
        // Simulate random status changes
        if (Math.random() > 0.9) {
            status.textContent = status.textContent === 'Online' ? 'Away' : 'Online';
            status.className = status.textContent === 'Online' ? 'user-status online' : 'user-status away';
        }
    });
}

// Add new activity log
function addNewActivityLog() {
    const tbody = document.querySelector('.activity-logs-table tbody');
    if (tbody) {
        const newRow = document.createElement('tr');
        const activities = [
            { user: 'Dr. Sarah Johnson', dept: 'Veterinary', action: 'Health Check', details: 'Completed routine check for Gaia (T002)' },
            { user: 'Maria Rodriguez', dept: 'Breeding', action: 'Record Update', details: 'Updated incubation parameters' },
            { user: 'Alex Chen', dept: 'IOT Staff', action: 'Sensor Check', details: 'Verified sensor readings in Enclosure B' },
            { user: 'Sarah Wilson', dept: 'Nutrition', action: 'Feeding Log', details: 'Logged afternoon feeding session' }
        ];
        
        const randomActivity = activities[Math.floor(Math.random() * activities.length)];
        const currentTime = new Date().toLocaleTimeString('en-US', { hour12: true, hour: '2-digit', minute: '2-digit' });
        
        newRow.innerHTML = `
            <td>${currentTime}</td>
            <td>${randomActivity.user}</td>
            <td>${randomActivity.dept}</td>
            <td>${randomActivity.action}</td>
            <td>${randomActivity.details}</td>
            <td><span class="status completed">Completed</span></td>
        `;
        
        tbody.insertBefore(newRow, tbody.firstChild);
        
        // Remove old rows if too many
        if (tbody.children.length > 20) {
            tbody.removeChild(tbody.lastChild);
        }
    }
}

// Update department stats
function updateDepartmentStats() {
    const deptStats = document.querySelectorAll('.dept-stats p');
    deptStats.forEach(stat => {
        const text = stat.textContent;
        if (text.includes('Active Cases:') || text.includes('Active Pairs:') || text.includes('Active Tasks:')) {
            const currentValue = parseInt(text.match(/\d+/)[0]);
            const newValue = currentValue + Math.floor(Math.random() * 3) - 1;
            if (newValue >= 0) {
                stat.innerHTML = text.replace(/\d+/, newValue);
            }
        }
    });
}

// Show user details modal
function showUserDetailsModal(button) {
    const userCard = button.closest('.user-card');
    if (userCard) {
        const userName = userCard.querySelector('h3').textContent;
        const userRole = userCard.querySelector('.user-role').textContent;
        showModal(`User Details - ${userName}`, `Detailed information about ${userName} (${userRole})`);
    }
}

// Show message modal
function showMessageModal(button) {
    const userCard = button.closest('.user-card');
    if (userCard) {
        const userName = userCard.querySelector('h3').textContent;
        showModal(`Send Message to ${userName}`, `Send a message to ${userName}`);
    }
}

// Show edit user modal
function showEditUserModal(button) {
    const tableRow = button.closest('tr');
    if (tableRow) {
        const userName = tableRow.cells[1].textContent;
        showModal(`Edit User - ${userName}`, `Edit user information for ${userName}`);
    }
}

// Show permissions modal
function showPermissionsModal(button) {
    const tableRow = button.closest('tr');
    if (tableRow) {
        const userName = tableRow.cells[1].textContent;
        showModal(`Manage Permissions - ${userName}`, `Manage permissions for ${userName}`);
    }
}

// Show add user modal
function showAddUserModal() {
    showModal('Add New User', 'Add a new user to the system');
}

// Show manage permissions modal
function showManagePermissionsModal() {
    showModal('Manage Permissions', 'Manage system-wide permissions');
}

// Export logs
function exportLogs() {
    showModal('Export Logs', 'Export activity logs to CSV format');
}

// Save settings
function saveSettings(form) {
    const saveBtn = form.querySelector('.action-btn.primary');
    const originalText = saveBtn.textContent;
    
    saveBtn.textContent = 'Saving...';
    saveBtn.disabled = true;
    
    setTimeout(() => {
        saveBtn.textContent = 'Saved!';
        setTimeout(() => {
            saveBtn.textContent = originalText;
            saveBtn.disabled = false;
        }, 1000);
    }, 1500);
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
    const cards = document.querySelectorAll('.stat-card, .department-card, .user-card, .dept-activity-card, .report-card, .settings-card');
    
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
    const loadingElements = document.querySelectorAll('.stat-card, .department-card, .activity-item, .user-card');
    
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