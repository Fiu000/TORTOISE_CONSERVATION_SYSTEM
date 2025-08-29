<?php
// Use your existing connection file.
// It should define: $conn = new mysqli(...); with utf8mb4 charset.
include 'dbconnection.php';

// If your dbconnection.php doesn't set charset, you can uncomment the next line:
// if (isset($conn) && $conn instanceof mysqli) { $conn->set_charset('utf8mb4'); }

// Small helper to safely escape HTML
function h($v)
{
    return htmlspecialchars((string)$v, ENT_QUOTES, 'UTF-8');
}

// Simple runner for static SELECTs
function fetch_all(mysqli $conn, string $sql): array
{
    $rows = [];
    $res = $conn->query($sql);
    if ($res) {
        while ($row = $res->fetch_assoc()) {
            $rows[] = $row;
        }
        $res->free();
    }
    return $rows;
}

/* ===== Load data for each dashboard table (schema assumed from your SQL) ===== */
$tortoises = fetch_all($conn, "
    SELECT tortoise_id, species, age, gender, health_status, history_of_care
    FROM tortoises
    ORDER BY tortoise_id
");

$enclosures = fetch_all($conn, "
    SELECT enclosure_id, size_sq_ft, habitat_type, current_occupants,
           last_maintenance_date, next_scheduled_maintenance, temperature, humidity
    FROM enclosures
    ORDER BY enclosure_id
");

$breeding_info = fetch_all($conn, "
    SELECT breeding_pair_id, male_tortoise_id, female_tortoise_id, nesting_date,
           egg_count, incubation_start, incubation_end, hatching_success, observations
    FROM breeding_info
    ORDER BY nesting_date DESC, breeding_pair_id
");

$feeding_data = fetch_all($conn, "
    SELECT tortoise_id, species, diet_type, feeding_time, food_given,
           special_requirements, food_inventory_left
    FROM feeding_data
    ORDER BY tortoise_id, feeding_time
");

$veterinarian_duty = fetch_all($conn, "
    SELECT tortoise_id, checkup_date, health_status, treatment_given,
           vaccination_status, illness_injury_notes
    FROM veterinarian_duty
    ORDER BY checkup_date DESC, tortoise_id
");

$environment_data = fetch_all($conn, "
    SELECT sensor_id, location_type, location_id, temperature, humidity,
           water_quality, last_updated
    FROM environment_data
    ORDER BY last_updated DESC, sensor_id
");

$task_assignments = fetch_all($conn, "
    SELECT task_id, task_type, assigned_to, date_assigned, due_time,
           completion_status, notes
    FROM task_assignments
    ORDER BY date_assigned DESC, task_id
");
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard - Tortoise Conservation Center</title>
    <link rel="stylesheet" href="admin-dashboard-styles.css">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap"
        rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <!-- Chart.js CDN -->
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>

<body>
    <!-- Sidebar Navigation -->
    <aside class="admin-sidebar">
        <div class="sidebar-logo">
            <i class="fas fa-shield-alt"></i>
            <span>Admin</span>
        </div>
        <nav class="sidebar-nav">
            <ul>
                <li class="sidebar-item active" data-dashboard="caretaker"><i class="fas fa-turtle"></i> Tortoise
                    Information</li>
                <li class="sidebar-item" data-dashboard="maintenance"><i class="fas fa-tools"></i> Enclosure Detail</li>
                <li class="sidebar-item" data-dashboard="breeding"><i class="fas fa-egg"></i> Breeding Information</li>
                <li class="sidebar-item" data-dashboard="nutrition"><i class="fas fa-apple-alt"></i> Feeding Data</li>
                <li class="sidebar-item" data-dashboard="veterinarian"><i class="fas fa-user-md"></i> Veterinarian Duty
                </li>
                <li class="sidebar-item" data-dashboard="iot"><i class="fas fa-thermometer-half"></i> Environment Data
                </li>
                <li class="sidebar-item" data-dashboard="task"><i class="fas fa-tasks"></i> Task Assign</li>
            </ul>
        </nav>
    </aside>

    <!-- Main Content -->
    <main class="admin-main">
        <!-- Dashboard Header -->
        <header class="admin-header">
            <div class="header-left">
                <h1>Admin Dashboard</h1>
                <div class="current-datetime" id="currentDatetime"></div>
            </div>
            <div class="header-right">
                <div class="admin-profile">
                    <div class="profile-avatar"><i class="fas fa-user-shield"></i></div>
                    <div class="profile-info">
                        <span class="profile-name">System Administrator</span>
                        <span class="profile-role">Administrator</span>
                    </div>
                </div>
                <button class="logout-btn" id="logoutBtn">
                    <i class="fas fa-sign-out-alt"></i>
                    <span>Logout</span>
                </button>
            </div>
        </header>

        <!-- Dashboard Content Area -->
        <section class="dashboard-content-area">
            <!-- Tortoise Caretaker Dashboard Table -->
            <div class="dashboard-table active" id="dashboard-caretaker">
                <div class="dashboard-chart-container"><canvas id="chart-caretaker"></canvas></div>
                <div class="dashboard-table-header">
                    <h2><i class="fas fa-turtle"></i> Tortoise Information</h2>
                    <div class="table-actions">
                        <input type="text" class="table-search" placeholder="Search...">
                        <button class="table-btn add-btn"><i class="fas fa-plus"></i> Add</button>
                        <button class="table-btn delete-btn"><i class="fas fa-trash"></i> Delete</button>
                    </div>
                </div>
                <div class="dashboard-table-wrapper">
                    <table class="dashboard-table-main">
                        <thead>
                            <tr>
                                <th>Select</th>
                                <th>Tortoise ID</th>
                                <th>Species</th>
                                <th>Age</th>
                                <th>Gender</th>
                                <th>Health Status</th>
                                <th>History of Care</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php if (!empty($tortoises)): ?>
                                <?php foreach ($tortoises as $r): ?>
                                    <tr>
                                        <td><input type="checkbox" class="row-select"></td>
                                        <td><?= h($r['tortoise_id']) ?></td>
                                        <td><?= h($r['species']) ?></td>
                                        <td><?= h($r['age']) ?></td>
                                        <td><?= h($r['gender']) ?></td>
                                        <td><?= h($r['health_status']) ?></td>
                                        <td><?= h($r['history_of_care']) ?></td>
                                        <td><button class="table-btn edit-row-btn"><i class="fas fa-edit"></i> Edit</button></td>
                                    </tr>
                                <?php endforeach; ?>
                            <?php else: ?>
                                <tr>
                                    <td colspan="8" class="empty">No data found.</td>
                                </tr>
                            <?php endif; ?>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Maintenance Staff Dashboard Table -->
            <div class="dashboard-table" id="dashboard-maintenance">
                <div class="dashboard-chart-container"><canvas id="chart-maintenance"></canvas></div>
                <div class="dashboard-table-header">
                    <h2><i class="fas fa-tools"></i> Enclosure Detail</h2>
                    <div class="table-actions">
                        <input type="text" class="table-search" placeholder="Search...">
                        <button class="table-btn add-btn"><i class="fas fa-plus"></i> Add</button>
                        <button class="table-btn delete-btn"><i class="fas fa-trash"></i> Delete</button>
                    </div>
                </div>
                <div class="dashboard-table-wrapper">
                    <table class="dashboard-table-main">
                        <thead>
                            <tr>
                                <th>Select</th>
                                <th>Enclosure ID</th>
                                <th>Size (sq ft)</th>
                                <th>Habitat Type</th>
                                <th>Current Occupants</th>
                                <th>Last Maintenance Date</th>
                                <th>Next Scheduled Maintenance</th>
                                <th>Temperature</th>
                                <th>Humidity</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php if (!empty($enclosures)): ?>
                                <?php foreach ($enclosures as $r): ?>
                                    <tr>
                                        <td><input type="checkbox" class="row-select"></td>
                                        <td><?= h($r['enclosure_id']) ?></td>
                                        <td><?= h($r['size_sq_ft']) ?></td>
                                        <td><?= h($r['habitat_type']) ?></td>
                                        <td><?= h($r['current_occupants']) ?></td>
                                        <td><?= h($r['last_maintenance_date']) ?></td>
                                        <td><?= h($r['next_scheduled_maintenance']) ?></td>
                                        <td><?= h($r['temperature']) ?></td>
                                        <td><?= h($r['humidity']) ?></td>
                                        <td><button class="table-btn edit-row-btn"><i class="fas fa-edit"></i> Edit</button></td>
                                    </tr>
                                <?php endforeach; ?>
                            <?php else: ?>
                                <tr>
                                    <td colspan="10" class="empty">No data found.</td>
                                </tr>
                            <?php endif; ?>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Breeding Manager Dashboard Table -->
            <div class="dashboard-table" id="dashboard-breeding">
                <div class="dashboard-chart-container"><canvas id="chart-breeding"></canvas></div>
                <div class="dashboard-table-header">
                    <h2><i class="fas fa-egg"></i> Breeding Information</h2>
                    <div class="table-actions">
                        <input type="text" class="table-search" placeholder="Search...">
                        <button class="table-btn add-btn"><i class="fas fa-plus"></i> Add</button>
                        <button class="table-btn delete-btn"><i class="fas fa-trash"></i> Delete</button>
                    </div>
                </div>
                <div class="dashboard-table-wrapper">
                    <table class="dashboard-table-main">
                        <thead>
                            <tr>
                                <th>Select</th>
                                <th>Breeding Pair ID</th>
                                <th>Male ID</th>
                                <th>Female ID</th>
                                <th>Nesting Date</th>
                                <th>Egg Count</th>
                                <th>Incubation Start</th>
                                <th>Incubation End</th>
                                <th>Hatching Success (%)</th>
                                <th>Observations</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php if (!empty($breeding_info)): ?>
                                <?php foreach ($breeding_info as $r): ?>
                                    <tr>
                                        <td><input type="checkbox" class="row-select"></td>
                                        <td><?= h($r['breeding_pair_id']) ?></td>
                                        <td><?= h($r['male_tortoise_id']) ?></td>
                                        <td><?= h($r['female_tortoise_id']) ?></td>
                                        <td><?= h($r['nesting_date']) ?></td>
                                        <td><?= h($r['egg_count']) ?></td>
                                        <td><?= h($r['incubation_start']) ?></td>
                                        <td><?= h($r['incubation_end']) ?></td>
                                        <td><?= h($r['hatching_success']) ?></td>
                                        <td><?= h($r['observations']) ?></td>
                                        <td><button class="table-btn edit-row-btn"><i class="fas fa-edit"></i> Edit</button></td>
                                    </tr>
                                <?php endforeach; ?>
                            <?php else: ?>
                                <tr>
                                    <td colspan="11" class="empty">No data found.</td>
                                </tr>
                            <?php endif; ?>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Nutritionist Dashboard Table -->
            <div class="dashboard-table" id="dashboard-nutrition">
                <div class="dashboard-chart-container"><canvas id="chart-nutrition"></canvas></div>
                <div class="dashboard-table-header">
                    <h2><i class="fas fa-apple-alt"></i> Feeding Data</h2>
                    <div class="table-actions">
                        <input type="text" class="table-search" placeholder="Search...">
                        <button class="table-btn add-btn"><i class="fas fa-plus"></i> Add</button>
                        <button class="table-btn delete-btn"><i class="fas fa-trash"></i> Delete</button>
                    </div>
                </div>
                <div class="dashboard-table-wrapper">
                    <table class="dashboard-table-main">
                        <thead>
                            <tr>
                                <th>Select</th>
                                <th>Tortoise ID</th>
                                <th>Species</th>
                                <th>Diet Type</th>
                                <th>Feeding Time</th>
                                <th>Food Given</th>
                                <th>Special Requirements</th>
                                <th>Food Inventory Left</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php if (!empty($feeding_data)): ?>
                                <?php foreach ($feeding_data as $r): ?>
                                    <tr>
                                        <td><input type="checkbox" class="row-select"></td>
                                        <td><?= h($r['tortoise_id']) ?></td>
                                        <td><?= h($r['species']) ?></td>
                                        <td><?= h($r['diet_type']) ?></td>
                                        <td><?= h($r['feeding_time']) ?></td>
                                        <td><?= h($r['food_given']) ?></td>
                                        <td><?= h($r['special_requirements']) ?></td>
                                        <td><?= h($r['food_inventory_left']) ?></td>
                                        <td><button class="table-btn edit-row-btn"><i class="fas fa-edit"></i> Edit</button></td>
                                    </tr>
                                <?php endforeach; ?>
                            <?php else: ?>
                                <tr>
                                    <td colspan="9" class="empty">No data found.</td>
                                </tr>
                            <?php endif; ?>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Veterinarian Dashboard Table -->
            <div class="dashboard-table" id="dashboard-veterinarian">
                <div class="dashboard-chart-container"><canvas id="chart-veterinarian"></canvas></div>
                <div class="dashboard-table-header">
                    <h2><i class="fas fa-user-md"></i> Veterinarian Duty</h2>
                    <div class="table-actions">
                        <input type="text" class="table-search" placeholder="Search...">
                        <button class="table-btn add-btn"><i class="fas fa-plus"></i> Add</button>
                        <button class="table-btn delete-btn"><i class="fas fa-trash"></i> Delete</button>
                    </div>
                </div>
                <div class="dashboard-table-wrapper">
                    <table class="dashboard-table-main">
                        <thead>
                            <tr>
                                <th>Select</th>
                                <th>Tortoise ID</th>
                                <th>Check-up Date</th>
                                <th>Health Status</th>
                                <th>Treatment Given</th>
                                <th>Vaccination Status</th>
                                <th>Illness/Injury Notes</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php if (!empty($veterinarian_duty)): ?>
                                <?php foreach ($veterinarian_duty as $r): ?>
                                    <tr>
                                        <td><input type="checkbox" class="row-select"></td>
                                        <td><?= h($r['tortoise_id']) ?></td>
                                        <td><?= h($r['checkup_date']) ?></td>
                                        <td><?= h($r['health_status']) ?></td>
                                        <td><?= h($r['treatment_given']) ?></td>
                                        <td><?= h($r['vaccination_status']) ?></td>
                                        <td><?= h($r['illness_injury_notes']) ?></td>
                                        <td><button class="table-btn edit-row-btn"><i class="fas fa-edit"></i> Edit</button></td>
                                    </tr>
                                <?php endforeach; ?>
                            <?php else: ?>
                                <tr>
                                    <td colspan="8" class="empty">No data found.</td>
                                </tr>
                            <?php endif; ?>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- IOT Staff Dashboard Table -->
            <div class="dashboard-table" id="dashboard-iot">
                <div class="dashboard-chart-container"><canvas id="chart-iot"></canvas></div>
                <div class="dashboard-table-header">
                    <h2><i class="fas fa-thermometer-half"></i> Environment Data</h2>
                    <div class="table-actions">
                        <input type="text" class="table-search" placeholder="Search...">
                        <button class="table-btn add-btn"><i class="fas fa-plus"></i> Add</button>
                        <button class="table-btn delete-btn"><i class="fas fa-trash"></i> Delete</button>
                    </div>
                </div>
                <div class="dashboard-table-wrapper">
                    <table class="dashboard-table-main">
                        <thead>
                            <tr>
                                <th>Select</th>
                                <th>Sensor ID</th>
                                <th>Location Type</th>
                                <th>Location ID</th>
                                <th>Temperature (°C)</th>
                                <th>Humidity (%)</th>
                                <th>Water Quality (pH)</th>
                                <th>Last Updated</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php if (!empty($environment_data)): ?>
                                <?php foreach ($environment_data as $r): ?>
                                    <tr>
                                        <td><input type="checkbox" class="row-select"></td>
                                        <td><?= h($r['sensor_id']) ?></td>
                                        <td><?= h($r['location_type']) ?></td>
                                        <td><?= h($r['location_id']) ?></td>
                                        <td><?= h($r['temperature']) ?></td>
                                        <td><?= h($r['humidity']) ?></td>
                                        <td><?= h($r['water_quality']) ?></td>
                                        <td><?= h($r['last_updated']) ?></td>
                                        <td><button class="table-btn edit-row-btn"><i class="fas fa-edit"></i> Edit</button></td>
                                    </tr>
                                <?php endforeach; ?>
                            <?php else: ?>
                                <tr>
                                    <td colspan="9" class="empty">No data found.</td>
                                </tr>
                            <?php endif; ?>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Task Manager Dashboard Table -->
            <div class="dashboard-table" id="dashboard-task">
                <div class="dashboard-chart-container"><canvas id="chart-task"></canvas></div>
                <div class="dashboard-table-header">
                    <h2><i class="fas fa-tasks"></i> Task Assign</h2>
                    <div class="table-actions">
                        <input type="text" class="table-search" placeholder="Search...">
                        <button class="table-btn add-btn"><i class="fas fa-plus"></i> Add</button>
                        <button class="table-btn delete-btn"><i class="fas fa-trash"></i> Delete</button>
                    </div>
                </div>
                <div class="dashboard-table-wrapper">
                    <table class="dashboard-table-main">
                        <thead>
                            <tr>
                                <th>Select</th>
                                <th>Task ID</th>
                                <th>Task Type</th>
                                <th>Assigned To</th>
                                <th>Date Assigned</th>
                                <th>Due Time</th>
                                <th>Completion Status</th>
                                <th>Notes</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php if (!empty($task_assignments)): ?>
                                <?php foreach ($task_assignments as $r): ?>
                                    <tr>
                                        <td><input type="checkbox" class="row-select"></td>
                                        <td><?= h($r['task_id']) ?></td>
                                        <td><?= h($r['task_type']) ?></td>
                                        <td><?= h($r['assigned_to']) ?></td>
                                        <td><?= h($r['date_assigned']) ?></td>
                                        <td><?= h($r['due_time']) ?></td>
                                        <td><?= h($r['completion_status']) ?></td>
                                        <td><?= h($r['notes']) ?></td>
                                        <td><button class="table-btn edit-row-btn"><i class="fas fa-edit"></i> Edit</button></td>
                                    </tr>
                                <?php endforeach; ?>
                            <?php else: ?>
                                <tr>
                                    <td colspan="9" class="empty">No data found.</td>
                                </tr>
                            <?php endif; ?>
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    </main>

    <!-- Add Modal (Reusable) -->
    <div class="modal" id="addModal">
        <div class="modal-content">
            <div class="modal-header">
                <h3 id="addModalTitle">Add New Entry</h3>
                <button class="modal-close" id="closeAddModal">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <form id="addForm">
                <div class="modal-body" id="addFormFields">
                    <!-- Dynamic form fields go here -->
                </div>
                <div class="modal-footer">
                    <button type="button" class="modal-btn secondary" id="cancelAdd">Cancel</button>
                    <button type="submit" class="modal-btn primary">Add</button>
                </div>
            </form>
        </div>
    </div>

    <!-- Edit Modal (Reusable) -->
    <div class="modal" id="editModal">
        <div class="modal-content">
            <div class="modal-header">
                <h3 id="editModalTitle">Edit Entry</h3>
                <button class="modal-close" id="closeEditModal">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <form id="editForm">
                <div class="modal-body" id="editFormFields">
                    <!-- Dynamic form fields go here -->
                </div>
                <div class="modal-footer">
                    <button type="button" class="modal-btn secondary" id="cancelEdit">Cancel</button>
                    <button type="submit" class="modal-btn primary">Save</button>
                </div>
            </form>
        </div>
    </div>

    <!-- Logout Confirmation Modal -->
    <div class="modal" id="logoutModal">
        <div class="modal-content">
            <div class="modal-header">
                <h3>Confirm Logout</h3>
                <button class="modal-close" id="closeModal">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <p>Are you sure you want to logout from the Admin Dashboard?</p>
            </div>
            <div class="modal-footer">
                <button class="modal-btn secondary" id="cancelLogout">Cancel</button>
                <button class="modal-btn primary" id="confirmLogout">Logout</button>
            </div>
        </div>
    </div>

    <script src="admin-dashboard-script.js"></script>
</body>

</html>