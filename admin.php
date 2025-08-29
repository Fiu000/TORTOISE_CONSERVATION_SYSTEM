<?php
// admin.php - Admin Dashboard with full CRUD against the provided schema
// Requires: config.php (PDO), database imported from database.sql
// Security notes: minimal CSRF protection and prepared statements throughout.

session_start();
if (empty($_SESSION['csrf'])) {
    $_SESSION['csrf'] = bin2hex(random_bytes(32));
}
$csrf = $_SESSION['csrf'];

require __DIR__ . '/config.php';

// --- Section definitions mapping UI -> DB tables/columns --- //
$sections = [
    'overview' => [
        'title' => 'Overview',
        'icon' => 'fas fa-chart-bar',
        // No table, pk, columns, display for overview
    ],
    'caretaker' => [
        'title' => 'Tortoise Information',
        'table' => 'tortoises',
        'pk'    => ['tortoise_id'],
        'columns' => [
            'tortoise_id'    => ['label' => 'Tortoise ID', 'type' => 'text', 'required' => true],
            'species'        => ['label' => 'Species', 'type' => 'text'],
            'age'            => ['label' => 'Age', 'type' => 'number', 'step' => '1'],
            'gender'         => ['label' => 'Gender', 'type' => 'text'],
            'health_status'  => ['label' => 'Health Status', 'type' => 'text'],
            'history_of_care' => ['label' => 'History of Care', 'type' => 'textarea'],
        ],
        'display' => ['tortoise_id', 'species', 'age', 'gender', 'health_status', 'history_of_care'],
        'icon' => 'fas fa-turtle'
    ],
    'maintenance' => [
        'title' => 'Enclosure Detail',
        'table' => 'enclosures',
        'pk'    => ['enclosure_id'],
        'columns' => [
            'enclosure_id' => ['label' => 'Enclosure ID', 'type' => 'text', 'required' => true],
            'size_sq_ft'   => ['label' => 'Size (sq ft)', 'type' => 'number', 'step' => '1'],
            'habitat_type' => ['label' => 'Habitat Type', 'type' => 'text'],
            'current_occupants' => ['label' => 'Current Occupants', 'type' => 'number', 'step' => '1'],
            'last_maintenance_date' => ['label' => 'Last Maintenance Date', 'type' => 'date'],
            'next_scheduled_maintenance' => ['label' => 'Next Scheduled Maintenance', 'type' => 'date'],
            'temperature' => ['label' => 'Temperature (°C)', 'type' => 'number', 'step' => '0.01'],
            'humidity'    => ['label' => 'Humidity (%)', 'type' => 'number', 'step' => '0.01'],
        ],
        'display' => ['enclosure_id', 'size_sq_ft', 'habitat_type', 'current_occupants', 'last_maintenance_date', 'next_scheduled_maintenance', 'temperature', 'humidity'],
        'icon' => 'fas fa-tools'
    ],
    'breeding' => [
        'title' => 'Breeding Information',
        'table' => 'breeding_info',
        'pk'    => ['breeding_pair_id'],
        'columns' => [
            'breeding_pair_id' => ['label' => 'Breeding Pair ID', 'type' => 'text', 'required' => true],
            'male_tortoise_id'   => ['label' => 'Male ID', 'type' => 'text'],
            'female_tortoise_id' => ['label' => 'Female ID', 'type' => 'text'],
            'nesting_date'    => ['label' => 'Nesting Date', 'type' => 'date'],
            'egg_count'       => ['label' => 'Egg Count', 'type' => 'number', 'step' => '1'],
            'incubation_start' => ['label' => 'Incubation Start', 'type' => 'date'],
            'incubation_end'  => ['label' => 'Incubation End', 'type' => 'date'],
            'hatching_success' => ['label' => 'Hatching Success (%)', 'type' => 'number', 'step' => '0.01'],
            'observations'    => ['label' => 'Observations', 'type' => 'textarea'],
        ],
        'display' => ['breeding_pair_id', 'male_tortoise_id', 'female_tortoise_id', 'nesting_date', 'egg_count', 'incubation_start', 'incubation_end', 'hatching_success', 'observations'],
        'icon' => 'fas fa-egg'
    ],
    'nutrition' => [
        'title' => 'Feeding Data',
        'table' => 'feeding_data',
        'pk'    => ['tortoise_id'],
        'columns' => [
            'tortoise_id' => ['label' => 'Tortoise ID', 'type' => 'text', 'required' => true],
            'species'     => ['label' => 'Species', 'type' => 'text'],
            'diet_type'   => ['label' => 'Diet Type', 'type' => 'text'],
            'feeding_time' => ['label' => 'Feeding Time', 'type' => 'time'],
            'food_given'  => ['label' => 'Food Given', 'type' => 'textarea'],
            'special_requirements' => ['label' => 'Special Requirements', 'type' => 'textarea'],
            'food_inventory_left'  => ['label' => 'Food Inventory Left (%)', 'type' => 'number', 'step' => '0.01'],
        ],
        'display' => ['tortoise_id', 'species', 'diet_type', 'feeding_time', 'food_given', 'special_requirements', 'food_inventory_left'],
        'icon' => 'fas fa-apple-alt'
    ],

    'veterinarian' => [
        'title' => 'Veterinarian Duty',
        'table' => 'veterinarian_duty',
        // composite PK:
        'pk'    => ['tortoise_id', 'checkup_date'],
        'columns' => [
            'tortoise_id' => ['label' => 'Tortoise ID', 'type' => 'text', 'required' => true],
            'checkup_date' => ['label' => 'Check-up Date', 'type' => 'date', 'required' => true],
            'health_status' => ['label' => 'Health Status', 'type' => 'text'],
            'treatment_given' => ['label' => 'Treatment Given', 'type' => 'textarea'],
            'vaccination_status' => ['label' => 'Vaccination Status', 'type' => 'text'],
            'illness_injury_notes' => ['label' => 'Illness/Injury Notes', 'type' => 'textarea'],
        ],
        'display' => ['tortoise_id', 'checkup_date', 'health_status', 'treatment_given', 'vaccination_status', 'illness_injury_notes'],
        'icon' => 'fas fa-user-md'
    ],
    'task' => [
        'title' => 'Task Assign',
        'table' => 'task_assignments',
        'pk'    => ['task_id'],
        'columns' => [
            'task_id' => ['label' => 'Task ID', 'type' => 'text', 'required' => true],
            'task_type' => ['label' => 'Task Type', 'type' => 'text'],
            'assigned_to' => ['label' => 'Assigned To', 'type' => 'text'],
            'date_assigned' => ['label' => 'Date Assigned', 'type' => 'date'],
            'due_time'   => ['label' => 'Due Time', 'type' => 'time'],
            'completion_status' => ['label' => 'Completion Status', 'type' => 'text'],
            'notes' => ['label' => 'Notes', 'type' => 'textarea'],
        ],
        'display' => ['task_id', 'task_type', 'assigned_to', 'date_assigned', 'due_time', 'completion_status', 'notes'],
        'icon' => 'fas fa-tasks'
    ],
];

// --- Overview analytics (moved out of $sections array) --- //
try {
    $overviewCounts = [];
    // Standard counts
    foreach (
        [
            'Tortoises' => 'tortoises',
            'Enclosures' => 'enclosures',
            'Breeding Pairs' => 'breeding_info',
            'Feedings' => 'feeding_data',
            'Veterinarian Checkups' => 'veterinarian_duty',
            'Sensor Data' => 'environment_data',
            'Tasks' => 'task_assignments'
        ] as $label => $tbl
    ) {
        try {
            $overviewCounts[$label] = (int)($pdo->query("SELECT COUNT(*) AS c FROM `$tbl`")->fetch()['c'] ?? 0);
        } catch (Throwable $e) {
            $overviewCounts[$label] = 0;
        }
    }

    // 1. Total Feedings This Month
    try {
        $monthFeedings = $pdo->query("SELECT COUNT(*) AS c FROM feeding_data WHERE MONTH(feeding_time) = MONTH(CURDATE()) AND YEAR(feeding_time) = YEAR(CURDATE())")->fetch();
        $overviewCounts['Feedings This Month'] = (int)($monthFeedings['c'] ?? 0);
    } catch (Throwable $e) {
        $overviewCounts['Feedings This Month'] = 0;
    }

    // 2. Average Tortoise Age
    try {
        $avgAge = $pdo->query("SELECT AVG(age) AS avg_age FROM tortoises")->fetch();
        $overviewCounts['Average Tortoise Age'] = $avgAge && $avgAge['avg_age'] !== null ? round($avgAge['avg_age'], 2) : 0;
    } catch (Throwable $e) {
        $overviewCounts['Average Tortoise Age'] = 0;
    }

    // 3. Enclosures Needing Maintenance (next_scheduled_maintenance <= today)
    try {
        $maint = $pdo->query("SELECT COUNT(*) AS c FROM enclosures WHERE next_scheduled_maintenance <= CURDATE()")->fetch();
        $overviewCounts['Enclosures Needing Maintenance'] = (int)($maint['c'] ?? 0);
    } catch (Throwable $e) {
        $overviewCounts['Enclosures Needing Maintenance'] = 0;
    }

    // 4. Most Common Tortoise Species
    try {
        $species = $pdo->query("SELECT species, COUNT(*) AS c FROM tortoises GROUP BY species ORDER BY c DESC LIMIT 1")->fetch();
        $overviewCounts['Most Common Species'] = $species && $species['species'] ? $species['species'] : 'N/A';
    } catch (Throwable $e) {
        $overviewCounts['Most Common Species'] = 'N/A';
    }

    // 5. Average Food Inventory Left (%)
    try {
        $avgInv = $pdo->query("SELECT AVG(food_inventory_left) AS avg_inv FROM feeding_data")->fetch();
        $overviewCounts['Avg Food Inventory Left (%)'] = $avgInv && $avgInv['avg_inv'] !== null ? round($avgInv['avg_inv'], 2) : 0;
    } catch (Throwable $e) {
        $overviewCounts['Avg Food Inventory Left (%)'] = 0;
    }

    // 6. Total Tasks Completed
    try {
        $tasksDone = $pdo->query("SELECT COUNT(*) AS c FROM task_assignments WHERE completion_status = 'Completed'")->fetch();
        $overviewCounts['Tasks Completed'] = (int)($tasksDone['c'] ?? 0);
    } catch (Throwable $e) {
        $overviewCounts['Tasks Completed'] = 0;
    }

    // 7. Sensors with Abnormal Readings (temp < 20 or > 40, humidity < 30 or > 80)
    try {
        $abnormal = $pdo->query("SELECT COUNT(*) AS c FROM environment_data WHERE temperature < 20 OR temperature > 40 OR humidity < 30 OR humidity > 80")->fetch();
        $overviewCounts['Sensors Abnormal'] = (int)($abnormal['c'] ?? 0);
    } catch (Throwable $e) {
        $overviewCounts['Sensors Abnormal'] = 0;
    }

    // 8. Recent Checkups (last 7 days)
    try {
        $recent = $pdo->query("SELECT COUNT(*) AS c FROM veterinarian_duty WHERE checkup_date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)")->fetch();
        $overviewCounts['Checkups (Last 7 Days)'] = (int)($recent['c'] ?? 0);
    } catch (Throwable $e) {
        $overviewCounts['Checkups (Last 7 Days)'] = 0;
    }
} catch (Throwable $e) {
    $overviewCounts = [];
}



$sectionKey = $_GET['section'] ?? 'overview';
if (!isset($sections[$sectionKey])) $sectionKey = 'overview';
$sec = $sections[$sectionKey];

// Only run table-specific logic if this section has a table defined
$hasTable = isset($sec['table']) && !empty($sec['table']);

// CRUD action handler
$action = $_GET['action'] ?? '';
$messages = [];

function buildWhereFromPk(array $pk, array $source)
{
    $where = [];
    $params = [];
    foreach ($pk as $i => $k) {
        $where[] = "`$k` = :pk$i";
        $params[":pk$i"] = $source[$k] ?? null;
    }
    return [implode(" AND ", $where), $params];
}

function fetchSingle(PDO $pdo, $table, array $pkCols, array $ids)
{
    [$where, $p] = buildWhereFromPk($pkCols, array_combine($pkCols, $ids));
    $stmt = $pdo->prepare("SELECT * FROM `$table` WHERE $where LIMIT 1");
    $stmt->execute($p);
    return $stmt->fetch() ?: null;
}

if ($hasTable) {
    // Handle POST create/update
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        if (!hash_equals($_SESSION['csrf'] ?? '', $_POST['csrf'] ?? '')) {
            http_response_code(400);
            die('Invalid CSRF token');
        }

        $table = $sec['table'];
        $cols  = $sec['columns'];
        $pk    = $sec['pk'];

        // collect values
        $data = [];
        foreach ($cols as $name => $meta) {
            // skip auto/readonly (like last_updated)
            if ($table === 'environment_data' && $name === 'last_updated') continue;
            $data[$name] = $_POST[$name] ?? null;
            // normalize empties to null
            if ($data[$name] === '') $data[$name] = null;
        }

        if ($action === 'create') {
            $fields = array_keys($data);
            $placeholders = array_map(fn($f) => ":$f", $fields);
            $sql = "INSERT INTO `$table` (`" . implode('`,`', $fields) . "`) VALUES (" . implode(',', $placeholders) . ")";
            $stmt = $pdo->prepare($sql);
            $stmt->execute(array_combine($placeholders, array_values($data)));
            $messages[] = "Created successfully in $table.";
            header("Location: admin.php?section=$sectionKey&msg=" . urlencode(end($messages)));
            exit;
        } elseif ($action === 'update') {
            // build set
            $set = [];
            $params = [];
            foreach ($data as $k => $v) {
                $set[] = "`$k` = :set_$k";
                $params[":set_$k"] = $v;
            }
            // PK params from GET
            $ids = [];
            foreach ($pk as $k) {
                $ids[] = $_GET[$k] ?? null;
            }
            [$where, $wparams] = buildWhereFromPk($pk, array_combine($pk, $ids));
            $sql = "UPDATE `$table` SET " . implode(', ', $set) . " WHERE $where";
            $stmt = $pdo->prepare($sql);
            $stmt->execute($params + $wparams);
            $messages[] = "Updated successfully in $table.";
            header("Location: admin.php?section=$sectionKey&msg=" . urlencode(end($messages)));
            exit;
        }
    }

    // Handle GET delete
    if ($action === 'delete') {
        if (!hash_equals($_SESSION['csrf'] ?? '', $_GET['csrf'] ?? '')) {
            http_response_code(400);
            die('Invalid CSRF token');
        }
        $table = $sec['table'];
        $pk    = $sec['pk'];
        $ids = [];
        foreach ($pk as $k) {
            $ids[] = $_GET[$k] ?? null;
        }
        [$where, $params] = buildWhereFromPk($pk, array_combine($pk, $ids));
        $stmt = $pdo->prepare("DELETE FROM `$table` WHERE $where");
        $stmt->execute($params);
        header("Location: admin.php?section=$sectionKey&msg=" . urlencode("Deleted successfully from $table."));
        exit;
    }

    // Pagination + search
    $search = trim($_GET['q'] ?? '');
    $page = max(1, (int)($_GET['page'] ?? 1));
    $perPage = 10;
    $offset = ($page - 1) * $perPage;

    // Build list query
    $table = $sec['table'];
    $displayCols = $sec['display'];

    // search across display columns
    $whereSql = '';
    $params = [];
    if ($search !== '') {
        $likes = [];
        foreach ($displayCols as $c) {
            $likes[] = "`$c` LIKE :q";
        }
        $whereSql = "WHERE " . implode(" OR ", $likes);
        $params[':q'] = "%$search%";
    }

    $total = $pdo->prepare("SELECT COUNT(*) as cnt FROM `$table` " . $whereSql);
    $total->execute($params);
    $totalRows = (int)$total->fetch()['cnt'];

    $sql = "SELECT * FROM `$table` " . $whereSql . " ORDER BY " . $displayCols[0] . " LIMIT :lim OFFSET :off";
    $stmt = $pdo->prepare($sql);
    foreach ($params as $k => $v) $stmt->bindValue($k, $v, PDO::PARAM_STR);
    $stmt->bindValue(':lim', $perPage, PDO::PARAM_INT);
    $stmt->bindValue(':off', $offset, PDO::PARAM_INT);
    $stmt->execute();
    $rows = $stmt->fetchAll();

    // For editing, if action=edit, fetch target row
    $editRow = null;
    if ($action === 'edit') {
        $ids = [];
        foreach ($sec['pk'] as $k) {
            $ids[] = $_GET[$k] ?? null;
        }
        $editRow = fetchSingle($pdo, $table, $sec['pk'], $ids);
    }
} else {
    // If no table (e.g., overview), set variables to safe defaults
    $search = '';
    $page = 1;
    $perPage = 10;
    $offset = 0;
    $rows = [];
    $totalRows = 0;
    $editRow = null;
}
// ---------------------------------------------------------------------------
// Overview and Section-specific analytics computations
// Compute high-level counts for each section (overview) and analytics for the
// currently selected section. These metrics will be displayed as cards and
// charts within the dashboard.
try {
    $overviewCounts = [];
    // Compute counts for each table; wrap each query in a try/catch to avoid
    // blowing up if the table doesn't exist.
    foreach (
        [
            'Tortoises' => 'tortoises',
            'Enclosures' => 'enclosures',
            'Breeding Pairs' => 'breeding_info',
            'Feedings' => 'feeding_data',
            'Veterinarian Checkups' => 'veterinarian_duty',
            'Sensor Data' => 'environment_data',
            'Tasks' => 'task_assignments'
        ] as $label => $tbl
    ) {
        try {
            $overviewCounts[$label] = (int)($pdo->query("SELECT COUNT(*) AS c FROM `$tbl`")->fetch()['c'] ?? 0);
        } catch (Throwable $e) {
            $overviewCounts[$label] = 0;
        }
    }
} catch (Throwable $e) {
    $overviewCounts = [];
}

// Prepare section-specific cards and chart data
$sectionCards = [];
$sectionChartData = ['labels' => [], 'values' => [], 'label' => ''];

try {
    switch ($sectionKey) {
        case 'caretaker':
            // Tortoise Information analytics
            $count = (int)($pdo->query("SELECT COUNT(*) AS c FROM tortoises")->fetch()['c'] ?? 0);
            $avgAgeRow = $pdo->query("SELECT AVG(age) AS avg_age FROM tortoises")->fetch();
            $avgAge = $avgAgeRow && $avgAgeRow['avg_age'] !== null ? (float)$avgAgeRow['avg_age'] : 0;
            // Count distinct species
            $uniqueSpecies = (int)($pdo->query("SELECT COUNT(DISTINCT species) AS cnt FROM tortoises")->fetch()['cnt'] ?? 0);
            // Gender distribution
            $genderCounts = [];
            try {
                $stmt = $pdo->query("SELECT gender, COUNT(*) AS c FROM tortoises GROUP BY gender");
                foreach ($stmt->fetchAll() as $row) {
                    $genderCounts[$row['gender'] ?? 'Unknown'] = (int)$row['c'];
                }
            } catch (Throwable $e) {
            }
            $sectionCards = [
                ['label' => 'Total Tortoises', 'value' => $count],
                ['label' => 'Average Age', 'value' => round($avgAge, 2)],
                ['label' => 'Unique Species', 'value' => $uniqueSpecies]
            ];
            $sectionChartData = [
                'labels' => array_keys($genderCounts),
                'values' => array_values($genderCounts),
                'label'  => 'Gender Distribution'
            ];
            break;

        case 'maintenance':
            // Enclosure Detail analytics
            $count = (int)($pdo->query("SELECT COUNT(*) AS c FROM enclosures")->fetch()['c'] ?? 0);
            $avgSizeRow = $pdo->query("SELECT AVG(size_sq_ft) AS avg_size FROM enclosures")->fetch();
            $avgSize = $avgSizeRow && $avgSizeRow['avg_size'] !== null ? (float)$avgSizeRow['avg_size'] : 0;
            $avgOccupantsRow = $pdo->query("SELECT AVG(current_occupants) AS avg_occ FROM enclosures")->fetch();
            $avgOccupants = $avgOccupantsRow && $avgOccupantsRow['avg_occ'] !== null ? (float)$avgOccupantsRow['avg_occ'] : 0;
            $avgTempRow = $pdo->query("SELECT AVG(temperature) AS avg_temp FROM enclosures")->fetch();
            $avgTemp = $avgTempRow && $avgTempRow['avg_temp'] !== null ? (float)$avgTempRow['avg_temp'] : 0;
            $avgHumRow = $pdo->query("SELECT AVG(humidity) AS avg_hum FROM enclosures")->fetch();
            $avgHum = $avgHumRow && $avgHumRow['avg_hum'] !== null ? (float)$avgHumRow['avg_hum'] : 0;
            $habitatCounts = [];
            try {
                $stmt = $pdo->query("SELECT habitat_type, COUNT(*) AS c FROM enclosures GROUP BY habitat_type");
                foreach ($stmt->fetchAll() as $row) {
                    $habitatCounts[$row['habitat_type'] ?? 'Unknown'] = (int)$row['c'];
                }
            } catch (Throwable $e) {
            }
            $sectionCards = [
                ['label' => 'Enclosures', 'value' => $count],
                ['label' => 'Avg Size (sq ft)', 'value' => round($avgSize, 2)],
                ['label' => 'Avg Occupants', 'value' => round($avgOccupants, 2)],
                ['label' => 'Avg Temperature (°C)', 'value' => round($avgTemp, 2)],
                ['label' => 'Avg Humidity (%)', 'value' => round($avgHum, 2)]
            ];
            $sectionChartData = [
                'labels' => array_keys($habitatCounts),
                'values' => array_values($habitatCounts),
                'label'  => 'Habitat Types'
            ];
            break;

        case 'breeding':
            // Breeding Information analytics
            $count = (int)($pdo->query("SELECT COUNT(*) AS c FROM breeding_info")->fetch()['c'] ?? 0);
            $avgEggRow = $pdo->query("SELECT AVG(egg_count) AS avg_egg FROM breeding_info")->fetch();
            $avgEgg = $avgEggRow && $avgEggRow['avg_egg'] !== null ? (float)$avgEggRow['avg_egg'] : 0;
            $avgSuccessRow = $pdo->query("SELECT AVG(hatching_success) AS avg_succ FROM breeding_info")->fetch();
            $avgSuccess = $avgSuccessRow && $avgSuccessRow['avg_succ'] !== null ? (float)$avgSuccessRow['avg_succ'] : 0;
            $successCounts = ['Low (<=50%)' => 0, 'Medium (50-80%)' => 0, 'High (>80%)' => 0];
            try {
                $dist = $pdo->query("SELECT
                    SUM(CASE WHEN hatching_success <= 50 THEN 1 ELSE 0 END) AS low,
                    SUM(CASE WHEN hatching_success > 50 AND hatching_success <= 80 THEN 1 ELSE 0 END) AS medium,
                    SUM(CASE WHEN hatching_success > 80 THEN 1 ELSE 0 END) AS high
                    FROM breeding_info")->fetch(PDO::FETCH_ASSOC);
                $successCounts['Low (<=50%)']    = (int)($dist['low'] ?? 0);
                $successCounts['Medium (50-80%)'] = (int)($dist['medium'] ?? 0);
                $successCounts['High (>80%)']     = (int)($dist['high'] ?? 0);
            } catch (Throwable $e) {
            }
            $sectionCards = [
                ['label' => 'Pairs', 'value' => $count],
                ['label' => 'Avg Egg Count', 'value' => round($avgEgg, 2)],
                ['label' => 'Avg Hatching Success (%)', 'value' => round($avgSuccess, 2)]
            ];
            $sectionChartData = [
                'labels' => array_keys($successCounts),
                'values' => array_values($successCounts),
                'label'  => 'Hatching Success Distribution'
            ];
            break;

        case 'nutrition':
            // Feeding Data analytics
            $count = (int)($pdo->query("SELECT COUNT(*) AS c FROM feeding_data")->fetch()['c'] ?? 0);
            $avgInvRow = $pdo->query("SELECT AVG(food_inventory_left) AS avg_inv FROM feeding_data")->fetch();
            $avgInv = $avgInvRow && $avgInvRow['avg_inv'] !== null ? (float)$avgInvRow['avg_inv'] : 0;
            $uniqueDiet = (int)($pdo->query("SELECT COUNT(DISTINCT diet_type) AS cnt FROM feeding_data")->fetch()['cnt'] ?? 0);
            $dietCounts = [];
            try {
                $stmt = $pdo->query("SELECT diet_type, COUNT(*) AS c FROM feeding_data GROUP BY diet_type");
                foreach ($stmt->fetchAll() as $row) {
                    $dietCounts[$row['diet_type'] ?? 'Unknown'] = (int)$row['c'];
                }
            } catch (Throwable $e) {
            }
            $sectionCards = [
                ['label' => 'Feedings', 'value' => $count],
                ['label' => 'Avg Food Inventory Left (%)', 'value' => round($avgInv, 2)],
                ['label' => 'Unique Diet Types', 'value' => $uniqueDiet]
            ];
            $sectionChartData = [
                'labels' => array_keys($dietCounts),
                'values' => array_values($dietCounts),
                'label'  => 'Diet Type Distribution'
            ];
            break;

        case 'veterinarian':
            // Veterinarian Duty analytics
            $count = (int)($pdo->query("SELECT COUNT(*) AS c FROM veterinarian_duty")->fetch()['c'] ?? 0);
            $uniqueTortoises = (int)($pdo->query("SELECT COUNT(DISTINCT tortoise_id) AS cnt FROM veterinarian_duty")->fetch()['cnt'] ?? 0);
            $vaccRow = $pdo->query("
                SELECT
                    SUM(CASE WHEN vaccination_status = 'Yes' THEN 1 ELSE 0 END) AS yes_count,
                    SUM(CASE WHEN vaccination_status <> 'Yes' OR vaccination_status IS NULL THEN 1 ELSE 0 END) AS no_count
                FROM veterinarian_duty
            ")->fetch(PDO::FETCH_ASSOC);
            $vaccYes = (int)($vaccRow['yes_count'] ?? 0);
            $healthCounts = [];
            try {
                $stmt = $pdo->query("SELECT health_status, COUNT(*) AS c FROM veterinarian_duty GROUP BY health_status");
                foreach ($stmt->fetchAll() as $row) {
                    $healthCounts[$row['health_status'] ?? 'Unknown'] = (int)$row['c'];
                }
            } catch (Throwable $e) {
            }
            $sectionCards = [
                ['label' => 'Checkups', 'value' => $count],
                ['label' => 'Unique Tortoises', 'value' => $uniqueTortoises],
                ['label' => 'Vaccinations Done', 'value' => $vaccYes]
            ];
            $sectionChartData = [
                'labels' => array_keys($healthCounts),
                'values' => array_values($healthCounts),
                'label'  => 'Health Status Distribution'
            ];
            break;

        case 'iot':
            // Environment Data analytics
            $count = (int)($pdo->query("SELECT COUNT(*) AS c FROM environment_data")->fetch()['c'] ?? 0);
            $avgTempRow = $pdo->query("SELECT AVG(temperature) AS avg_temp FROM environment_data")->fetch();
            $avgTemp = $avgTempRow && $avgTempRow['avg_temp'] !== null ? (float)$avgTempRow['avg_temp'] : 0;
            $avgHumRow = $pdo->query("SELECT AVG(humidity) AS avg_hum FROM environment_data")->fetch();
            $avgHum = $avgHumRow && $avgHumRow['avg_hum'] !== null ? (float)$avgHumRow['avg_hum'] : 0;
            $avgWaterRow = $pdo->query("SELECT AVG(water_quality) AS avg_wq FROM environment_data")->fetch();
            $avgWater = $avgWaterRow && $avgWaterRow['avg_wq'] !== null ? (float)$avgWaterRow['avg_wq'] : 0;
            $locCounts = [];
            try {
                $stmt = $pdo->query("SELECT location_type, COUNT(*) AS c FROM environment_data GROUP BY location_type");
                foreach ($stmt->fetchAll() as $row) {
                    $locCounts[$row['location_type'] ?? 'Unknown'] = (int)$row['c'];
                }
            } catch (Throwable $e) {
            }
            $sectionCards = [
                ['label' => 'Sensors', 'value' => $count],
                ['label' => 'Avg Temp (°C)', 'value' => round($avgTemp, 2)],
                ['label' => 'Avg Humidity (%)', 'value' => round($avgHum, 2)],
                ['label' => 'Avg Water Quality (pH)', 'value' => round($avgWater, 2)]
            ];
            $sectionChartData = [
                'labels' => array_keys($locCounts),
                'values' => array_values($locCounts),
                'label'  => 'Sensor Location Types'
            ];
            break;

        case 'task':
            // Task Assign analytics
            $count = (int)($pdo->query("SELECT COUNT(*) AS c FROM task_assignments")->fetch()['c'] ?? 0);
            $uniqueTypes = (int)($pdo->query("SELECT COUNT(DISTINCT task_type) AS cnt FROM task_assignments")->fetch()['cnt'] ?? 0);
            $uniqueAssignees = (int)($pdo->query("SELECT COUNT(DISTINCT assigned_to) AS cnt FROM task_assignments")->fetch()['cnt'] ?? 0);
            $statusCounts = [];
            try {
                $stmt = $pdo->query("SELECT completion_status, COUNT(*) AS c FROM task_assignments GROUP BY completion_status");
                foreach ($stmt->fetchAll() as $row) {
                    $statusCounts[$row['completion_status'] ?? 'Unknown'] = (int)$row['c'];
                }
            } catch (Throwable $e) {
            }
            $sectionCards = [
                ['label' => 'Tasks', 'value' => $count],
                ['label' => 'Unique Task Types', 'value' => $uniqueTypes],
                ['label' => 'Unique Assignees', 'value' => $uniqueAssignees]
            ];
            $sectionChartData = [
                'labels' => array_keys($statusCounts),
                'values' => array_values($statusCounts),
                'label'  => 'Completion Status'
            ];
            break;

        default:
            // no analytics
            break;
    }
} catch (Throwable $e) {
    // On any failure, leave analytics empty
    $sectionCards = [];
    $sectionChartData = ['labels' => [], 'values' => [], 'label' => ''];
}
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard - Tortoise Conservation Center</title>
    <link rel="stylesheet" href="admin-dashboard-styles.css">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <style>
        .flash {
            background: #e6ffed;
            border: 1px solid #b7eb8f;
            padding: .5rem .75rem;
            border-radius: 8px;
            margin: .5rem 0;
        }

        .form-grid {
            display: grid;
            grid-template-columns: repeat(2, minmax(220px, 1fr));
            gap: 12px;
        }

        .form-grid label {
            font-size: .9rem;
            font-weight: 600;
        }

        .form-grid input,
        .form-grid textarea,
        .form-grid select {
            width: 100%;
            padding: .5rem;
            border-radius: 8px;
            border: 1px solid #ccc;
        }

        .pagination {
            margin-top: 12px;
        }

        .pagination a {
            padding: 6px 10px;
            margin: 0 2px;
            border: 1px solid #ddd;
            border-radius: 6px;
            text-decoration: none;
        }

        .pagination strong {
            padding: 6px 10px;
        }

        .btn {
            border: 0;
            padding: .4rem .6rem;
            border-radius: 8px;
            cursor: pointer;
        }

        .btn-primary {
            background: #3b82f6;
            color: white;
        }

        .btn-secondary {
            background: #f3f4f6;
        }

        .btn-danger {
            background: #ef4444;
            color: white;
        }

        /* Overview and analytics styles */
        .overview-section {
            margin-bottom: 20px;
        }

        .overview-cards {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
            gap: 12px;
            margin-bottom: 12px;
        }

        .overview-card {
            background: #f8fafc;
            padding: 12px;
            border-radius: 8px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
            text-align: center;
        }

        .overview-card .value {
            font-size: 1.5rem;
            font-weight: bold;
        }

        .overview-card .label {
            font-size: 0.9rem;
            color: #6b7280;
        }

        .section-analytics {
            margin-bottom: 20px;
        }

        .analytics-cards {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
            gap: 12px;
            margin-bottom: 16px;
        }

        .analytics-card {
            background: #f8fafc;
            padding: 10px;
            border-radius: 8px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
            text-align: center;
        }

        .analytics-card .value {
            font-size: 1.3rem;
            font-weight: bold;
        }

        .analytics-card .label {
            font-size: 0.85rem;
            color: #6b7280;
        }

        .analytics-chart-container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
        }

        .dashboard-chart-container {
            /* Hide original chart container since we have custom analytics */
            display: none;
        }

        .inline-form {
            display: inline;
        }

        .dashboard-table-main td,
        .dashboard-table-main th {
            vertical-align: top;
        }
    </style>
</head>

<body>
    <aside class="admin-sidebar">
        <div class="sidebar-logo">
            <i class="fas fa-shield-alt"></i>
            <span>Admin</span>
        </div>
        <nav class="sidebar-nav">
            <ul>
                <li class="sidebar-item <?= $sectionKey === 'overview' ? 'active' : '' ?>">
                    <a href="?section=overview" style="display:block;color:inherit;text-decoration:none;">
                        <i class="fas fa-chart-bar"></i> Overview
                    </a>
                </li>
                <?php foreach ($sections as $key => $meta): if ($key === 'overview') continue; ?>
                    <li class="sidebar-item <?= $key === $sectionKey ? 'active' : '' ?>">
                        <a href="?section=<?= h($key) ?>" style="display:block;color:inherit;text-decoration:none;">
                            <i class="<?= h($meta['icon']) ?>"></i> <?= h($meta['title']) ?>
                        </a>
                    </li>
                <?php endforeach; ?>
            </ul>
        </nav>
    </aside>

    <main class="admin-main">
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
                <a class="logout-btn" href="?logout=1">
                    <i class="fas fa-sign-out-alt"></i>
                    <span>Logout</span>
                </a>
            </div>
        </header>


        <!-- Overview Section (only show if sectionKey is overview) -->
        <?php if ($sectionKey === 'overview'): ?>
            <section class="overview-section">
                <h2>System Overview</h2>
                <div class="overview-cards">
                    <?php foreach ($overviewCounts as $label => $count): ?>
                        <div class="overview-card">
                            <div class="value"><?= h($count) ?></div>
                            <div class="label"><?= h($label) ?></div>
                        </div>
                    <?php endforeach; ?>
                </div>
                <div class="overview-chart-container" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(400px,1fr));gap:24px;">
                    <div style="text-align:center;">
                        <h4 style="margin-bottom:0.5rem;">Tortoise Species Distribution</h4>
                        <canvas id="speciesChart" width="400" height="400"></canvas>
                    </div>
                    <div style="text-align:center;">
                        <h4 style="margin-bottom:0.5rem;">Monthly Feedings</h4>
                        <canvas id="feedingsChart" width="400" height="400"></canvas>
                    </div>
                    <div style="text-align:center;">
                        <h4 style="margin-bottom:0.5rem;">Enclosure Habitat Types</h4>
                        <canvas id="habitatChart" width="400" height="400"></canvas>
                    </div>
                    <div style="text-align:center;">
                        <h4 style="margin-bottom:0.5rem;">Task Completion Status</h4>
                        <canvas id="tasksChart" width="400" height="400"></canvas>
                    </div>
                    <div style="text-align:center;">
                        <h4 style="margin-bottom:0.5rem;">Sensor Location Types</h4>
                        <canvas id="sensorLocChart" width="400" height="400"></canvas>
                    </div>
                    <div style="text-align:center;">
                        <h4 style="margin-bottom:0.5rem;">Veterinarian Health Status</h4>
                        <canvas id="healthChart" width="400" height="400"></canvas>
                    </div>
                </div>
            </section>
        <?php endif; ?>

        <?php if ($sectionKey !== 'overview'): ?>
            <section class="dashboard-content-area">
                <div class="dashboard-table active">
                    <div class="dashboard-chart-container"><canvas id="chart-caretaker"></canvas></div>
                    <div class="dashboard-table-header">
                        <h2><i class="<?= h($sec['icon']) ?>"></i> <?= h($sec['title']) ?></h2>
                        <div class="table-actions">
                            <form method="get" class="inline-form">
                                <input type="hidden" name="section" value="<?= h($sectionKey) ?>">
                                <input type="text" class="table-search" name="q" value="<?= h($search) ?>" placeholder="Search...">
                                <button class="table-btn">Search</button>
                            </form>
                            <button type="button" class="table-btn add-btn" id="openAddModal"><i class="fas fa-plus"></i> Add</button>
                        </div>
                    </div>

                    <!-- Section Analytics -->
                    <div class="section-analytics">
                        <div class="analytics-cards">
                            <?php foreach ($sectionCards as $card): ?>
                                <div class="analytics-card">
                                    <div class="value"><?= h($card['value']) ?></div>
                                    <div class="label"><?= h($card['label']) ?></div>
                                </div>
                            <?php endforeach; ?>
                        </div>
                        <div class="analytics-chart-container">
                            <canvas id="sectionChart"></canvas>
                        </div>
                    </div>

                    <?php if (isset($_GET['msg'])): ?>
                        <div class="flash"><?= h($_GET['msg']) ?></div>
                    <?php endif; ?>

                    <div class="dashboard-table-wrapper">
                        <table class="dashboard-table-main">
                            <thead>
                                <tr>
                                    <?php foreach ($sec['display'] as $c): ?>
                                        <th><?= h(ucwords(str_replace('_', ' ', $c))) ?></th>
                                    <?php endforeach; ?>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php foreach ($rows as $r): ?>
                                    <tr>
                                        <?php foreach ($sec['display'] as $c): ?>
                                            <td><?= h($r[$c] ?? '') ?></td>
                                        <?php endforeach; ?>
                                        <td>
                                            <?php
                                            // Build PK params for links
                                            $pkParams = [];
                                            foreach ($sec['pk'] as $k) {
                                                $pkParams[$k] = $r[$k];
                                            }
                                            $pkQuery = http_build_query($pkParams);
                                            ?>
                                            <button type="button" class="btn btn-secondary edit-row-btn" data-pk='<?= h(json_encode($pkParams)) ?>' title="Edit"><i class="fas fa-edit"></i></button>
                                            <a class="btn btn-danger" href="?section=<?= h($sectionKey) ?>&action=delete&<?= h($pkQuery) ?>&csrf=<?= h($csrf) ?>" onclick="return confirm('Delete this record?');" title="Delete">
                                                <i class="fas fa-trash"></i>
                                            </a>
                                        </td>
                                    </tr>
                                <?php endforeach; ?>

                                <?php if (empty($rows)): ?>
                                    <tr>
                                        <td colspan="<?= count($sec['display']) + 1 ?>">No records found.</td>
                                    </tr>
                                <?php endif; ?>
                            </tbody>
                        </table>
                    </div>

                    <?php
                    $totalPages = max(1, (int)ceil($totalRows / $perPage));
                    if ($totalPages > 1):
                    ?>
                        <div class="pagination">
                            <?php for ($i = 1; $i <= $totalPages; $i++): ?>
                                <?php if ($i == $page): ?>
                                    <strong><?= $i ?></strong>
                                <?php else: ?>
                                    <a href="?section=<?= h($sectionKey) ?>&q=<?= h($search) ?>&page=<?= $i ?>"><?= $i ?></a>
                                <?php endif; ?>
                            <?php endfor; ?>
                        </div>
                    <?php endif; ?>

                    <!-- Modal for Add/Edit -->
                    <div class="modal" id="crudModal" style="display:none;">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h3 id="crudModalTitle"></h3>
                                <button class="modal-close" id="closeCrudModal">&times;</button>
                            </div>
                            <form method="post" id="crudForm">
                                <input type="hidden" name="csrf" value="<?= h($csrf) ?>">
                                <div class="form-grid" id="crudFormFields">
                                    <!-- Fields will be injected by JS -->
                                </div>
                                <div class="form-actions">
                                    <button type="button" id="cancelCrud">Cancel</button>
                                    <button type="submit" id="saveCrud">Save</button>
                                </div>
                            </form>
                        </div>
                    </div>
                    <script>
                        // Helper to build form fields for Add/Edit
                        function buildCrudFields(columns, values, pk, isEdit) {
                            let html = '';
                            for (const name in columns) {
                                const meta = columns[name];
                                const label = meta.label || name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                                const type = meta.type || 'text';
                                const required = meta.required ? 'required' : '';
                                const step = meta.step ? `step=\"${meta.step}\"` : '';
                                const value = values && values[name] !== undefined ? values[name] : '';
                                const readonly = isEdit && pk.includes(name) ? 'readonly' : '';
                                html += `<div><label for=\"${name}\">${label}${meta.required ? ' *' : ''}</label>`;
                                if (type === 'textarea') {
                                    html += `<textarea id=\"${name}\" name=\"${name}\" rows=\"3\" ${required} ${readonly}>${value}</textarea>`;
                                } else {
                                    html += `<input id=\"${name}\" type=\"${type}\" name=\"${name}\" value=\"${value}\" ${step} ${required} ${readonly}>`;
                                }
                                html += `</div>`;
                            }
                            return html;
                        }

                        // Open Add Modal
                        document.getElementById('openAddModal').onclick = function() {
                            document.getElementById('crudModalTitle').textContent = 'Add New: <?= h($sec['title']) ?>';
                            document.getElementById('crudFormFields').innerHTML = buildCrudFields(<?= json_encode($sec['columns']) ?>, {}, <?= json_encode($sec['pk']) ?>, false);
                            document.getElementById('crudForm').setAttribute('action', '?section=<?= h($sectionKey) ?>&action=create');
                            document.getElementById('crudModal').style.display = 'block';
                        };
                        // Open Edit Modal
                        document.querySelectorAll('.edit-row-btn').forEach(function(btn) {
                            btn.onclick = function() {
                                const pk = JSON.parse(btn.getAttribute('data-pk'));
                                // Find row data in DOM
                                let rowData = {};
                                const tr = btn.closest('tr');
                                let i = 0;
                                <?php foreach ($sec['display'] as $i => $col): ?>
                                    rowData['<?= $col ?>'] = tr.children[<?= $i ?>].textContent.trim();
                                <?php endforeach; ?>
                                document.getElementById('crudModalTitle').textContent = 'Edit: <?= h($sec['title']) ?>';
                                document.getElementById('crudFormFields').innerHTML = buildCrudFields(<?= json_encode($sec['columns']) ?>, rowData, <?= json_encode($sec['pk']) ?>, true);
                                // Build PK query for action
                                let pkQuery = '';
                                for (const k in pk) {
                                    pkQuery += (pkQuery ? '&' : '') + encodeURIComponent(k) + '=' + encodeURIComponent(pk[k]);
                                }
                                document.getElementById('crudForm').setAttribute('action', '?section=<?= h($sectionKey) ?>&action=update' + (pkQuery ? '&' + pkQuery : ''));
                                document.getElementById('crudModal').style.display = 'block';
                            };
                        });
                        // Close/cancel modal
                        document.getElementById('closeCrudModal').onclick = document.getElementById('cancelCrud').onclick = function() {
                            document.getElementById('crudModal').style.display = 'none';
                        };
                    </script>
                </div>
            </section>
        <?php endif; ?>
    </main>

    <script>
        // Current date/time display
        function updateDateTime() {
            const el = document.getElementById('currentDatetime');
            const now = new Date();
            el.textContent = now.toLocaleString();
        }
        setInterval(updateDateTime, 1000);
        updateDateTime();

        // Fetch all analytics data for overview graphs
        <?php
        // Prepare data for all 6 graphs
        // 1. Tortoise Species Distribution
        $speciesData = [];
        try {
            $stmt = $pdo->query("SELECT species, COUNT(*) AS c FROM tortoises GROUP BY species");
            foreach ($stmt->fetchAll() as $row) {
                $speciesData[$row['species'] ?: 'Unknown'] = (int)$row['c'];
            }
        } catch (Throwable $e) {
        }

        // 2. Monthly Feedings (last 12 months)
        $feedingsLabels = [];
        $feedingsValues = [];
        try {
            $stmt = $pdo->query("SELECT DATE_FORMAT(feeding_time, '%Y-%m') AS ym, COUNT(*) AS c FROM feeding_data GROUP BY ym ORDER BY ym DESC LIMIT 12");
            $rows = $stmt->fetchAll();
            $rows = array_reverse($rows);
            foreach ($rows as $row) {
                $feedingsLabels[] = $row['ym'];
                $feedingsValues[] = (int)$row['c'];
            }
        } catch (Throwable $e) {
        }

        // 3. Enclosure Habitat Types
        $habitatData = [];
        try {
            $stmt = $pdo->query("SELECT habitat_type, COUNT(*) AS c FROM enclosures GROUP BY habitat_type");
            foreach ($stmt->fetchAll() as $row) {
                $habitatData[$row['habitat_type'] ?: 'Unknown'] = (int)$row['c'];
            }
        } catch (Throwable $e) {
        }

        // 4. Task Completion Status
        $taskStatusData = [];
        try {
            $stmt = $pdo->query("SELECT completion_status, COUNT(*) AS c FROM task_assignments GROUP BY completion_status");
            foreach ($stmt->fetchAll() as $row) {
                $taskStatusData[$row['completion_status'] ?: 'Unknown'] = (int)$row['c'];
            }
        } catch (Throwable $e) {
        }

        // 5. Sensor Location Types
        $sensorLocData = [];
        try {
            $stmt = $pdo->query("SELECT location_type, COUNT(*) AS c FROM environment_data GROUP BY location_type");
            foreach ($stmt->fetchAll() as $row) {
                $sensorLocData[$row['location_type'] ?: 'Unknown'] = (int)$row['c'];
            }
        } catch (Throwable $e) {
        }

        // 6. Veterinarian Health Status
        $healthStatusData = [];
        try {
            $stmt = $pdo->query("SELECT health_status, COUNT(*) AS c FROM veterinarian_duty GROUP BY health_status");
            foreach ($stmt->fetchAll() as $row) {
                $healthStatusData[$row['health_status'] ?: 'Unknown'] = (int)$row['c'];
            }
        } catch (Throwable $e) {
        }
        ?>
        // Render 6 overview charts
        document.addEventListener('DOMContentLoaded', function() {
            // 1. Tortoise Species Distribution
            new Chart(document.getElementById('speciesChart').getContext('2d'), {
                type: 'pie',
                data: {
                    labels: <?= json_encode(array_keys($speciesData)) ?>,
                    datasets: [{
                        data: <?= json_encode(array_values($speciesData)) ?>,
                        backgroundColor: [
                            '#4dc9f6', '#f67019', '#f53794', '#537bc4', '#acc236', '#166a8f', '#00a950', '#58595b', '#8549ba'
                        ]
                    }]
                },
                options: {
                    responsive: false
                }
            });
            // 2. Monthly Feedings
            new Chart(document.getElementById('feedingsChart').getContext('2d'), {
                type: 'bar',
                data: {
                    labels: <?= json_encode($feedingsLabels) ?>,
                    datasets: [{
                        label: 'Feedings',
                        data: <?= json_encode($feedingsValues) ?>,
                        backgroundColor: '#4dc9f6'
                    }]
                },
                options: {
                    responsive: false
                }
            });
            // 3. Enclosure Habitat Types
            new Chart(document.getElementById('habitatChart').getContext('2d'), {
                type: 'pie',
                data: {
                    labels: <?= json_encode(array_keys($habitatData)) ?>,
                    datasets: [{
                        data: <?= json_encode(array_values($habitatData)) ?>,
                        backgroundColor: [
                            '#f67019', '#f53794', '#537bc4', '#acc236', '#166a8f', '#00a950', '#58595b', '#8549ba', '#4dc9f6'
                        ]
                    }]
                },
                options: {
                    responsive: false
                }
            });
            // 4. Task Completion Status
            new Chart(document.getElementById('tasksChart').getContext('2d'), {
                type: 'doughnut',
                data: {
                    labels: <?= json_encode(array_keys($taskStatusData)) ?>,
                    datasets: [{
                        data: <?= json_encode(array_values($taskStatusData)) ?>,
                        backgroundColor: [
                            '#00a950', '#f67019', '#f53794', '#537bc4', '#acc236', '#166a8f', '#58595b', '#8549ba', '#4dc9f6'
                        ]
                    }]
                },
                options: {
                    responsive: false
                }
            });
            // 5. Sensor Location Types
            new Chart(document.getElementById('sensorLocChart').getContext('2d'), {
                type: 'pie',
                data: {
                    labels: <?= json_encode(array_keys($sensorLocData)) ?>,
                    datasets: [{
                        data: <?= json_encode(array_values($sensorLocData)) ?>,
                        backgroundColor: [
                            '#acc236', '#166a8f', '#00a950', '#58595b', '#8549ba', '#4dc9f6', '#f67019', '#f53794', '#537bc4'
                        ]
                    }]
                },
                options: {
                    responsive: false
                }
            });
            // 6. Veterinarian Health Status
            new Chart(document.getElementById('healthChart').getContext('2d'), {
                type: 'doughnut',
                data: {
                    labels: <?= json_encode(array_keys($healthStatusData)) ?>,
                    datasets: [{
                        data: <?= json_encode(array_values($healthStatusData)) ?>,
                        backgroundColor: [
                            '#f53794', '#537bc4', '#acc236', '#166a8f', '#00a950', '#58595b', '#8549ba', '#4dc9f6', '#f67019'
                        ]
                    }]
                },
                options: {
                    responsive: false
                }
            });
        });
    </script>
</body>

</html>
<?php
// lightweight stats endpoint for the chart (records per section)
if (isset($_GET['stats'])) {
    header('Content-Type: application/json');
    $out = ['labels' => [], 'values' => [], 'label' => 'Records'];
    foreach ($sections as $k => $m) {
        try {
            $count = $pdo->query("SELECT COUNT(*) AS c FROM `{$m['table']}`")->fetch()['c'] ?? 0;
        } catch (Throwable $e) {
            $count = 0;
        }
        $out['labels'][] = $m['title'];
        $out['values'][] = (int)$count;
    }
    echo json_encode($out);
    exit;
}
?>