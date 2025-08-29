-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 16, 2025 at 01:53 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `tortoise`
--

-- --------------------------------------------------------

--
-- Table structure for table `breeding_info`
--

CREATE TABLE `breeding_info` (
  `breeding_pair_id` varchar(10) NOT NULL,
  `male_tortoise_id` varchar(10) DEFAULT NULL,
  `female_tortoise_id` varchar(10) DEFAULT NULL,
  `nesting_date` date DEFAULT NULL,
  `egg_count` int(11) DEFAULT NULL,
  `incubation_start` date DEFAULT NULL,
  `incubation_end` date DEFAULT NULL,
  `hatching_success` decimal(5,2) DEFAULT NULL,
  `observations` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `breeding_info`
--

INSERT INTO `breeding_info` (`breeding_pair_id`, `male_tortoise_id`, `female_tortoise_id`, `nesting_date`, `egg_count`, `incubation_start`, `incubation_end`, `hatching_success`, `observations`) VALUES
('BP001', 'T001', 'T002', '2024-03-15', 12, '2024-03-16', '2024-07-14', 80.00, 'Healthy eggs, good pairing'),
('BP002', 'T003', 'T004', '2024-03-20', 8, '2024-03-21', '2024-07-19', 75.00, 'Monitoring incubation closely'),
('BP003', 'T005', 'T006', '2024-04-05', 10, '2024-04-06', '2024-08-05', 85.00, 'Eggs in stable condition'),
('BP004', 'T007', 'T008', '2024-04-10', 9, '2024-04-11', '2024-08-09', 78.00, 'Good pairing, eggs growing well'),
('BP005', 'T009', 'T010', '2024-04-15', 11, '2024-04-16', '2024-08-14', 82.00, 'Eggs seem healthy, no issues'),
('BP006', 'T002', 'T003', '2024-05-01', 13, '2024-05-02', '2024-09-01', 79.00, 'Regular checks, no concerns'),
('BP007', 'T004', 'T005', '2024-05-10', 14, '2024-05-11', '2024-09-10', 83.00, 'Eggs progressing well'),
('BP008', 'T006', 'T007', '2024-05-20', 10, '2024-05-21', '2024-09-20', 77.00, 'Under observation, slight concerns'),
('BP009', 'T008', 'T009', '2024-06-01', 15, '2024-06-02', '2024-10-01', 85.00, 'Eggs healthy, incubation stable'),
('BP010', 'T010', 'T001', '2024-06-05', 9, '2024-06-06', '2024-10-05', 81.00, 'Monitoring for any health issues');

-- --------------------------------------------------------

--
-- Table structure for table `enclosures`
--

CREATE TABLE `enclosures` (
  `enclosure_id` varchar(10) NOT NULL,
  `size_sq_ft` int(11) DEFAULT NULL,
  `habitat_type` varchar(50) DEFAULT NULL,
  `current_occupants` int(11) DEFAULT NULL,
  `last_maintenance_date` date DEFAULT NULL,
  `next_scheduled_maintenance` date DEFAULT NULL,
  `temperature` decimal(5,2) DEFAULT NULL,
  `humidity` decimal(5,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `enclosures`
--

INSERT INTO `enclosures` (`enclosure_id`, `size_sq_ft`, `habitat_type`, `current_occupants`, `last_maintenance_date`, `next_scheduled_maintenance`, `temperature`, `humidity`) VALUES
('E001', 500, 'Galapagos Habitat', 8, '2024-03-01', '2024-04-01', 25.00, 65.00),
('E002', 400, 'Aldabra Habitat', 6, '2024-03-10', '2024-04-10', 28.00, 70.00),
('E003', 600, 'Leopard Habitat', 5, '2024-03-15', '2024-04-15', 26.00, 60.00),
('E004', 450, 'Sulcata Habitat', 7, '2024-03-18', '2024-04-18', 27.00, 68.00),
('E005', 350, 'Indian Star Habitat', 4, '2024-03-20', '2024-04-20', 24.00, 62.00),
('E006', 500, 'Hermann Habitat', 6, '2024-03-25', '2024-04-25', 25.50, 64.00),
('E007', 550, 'Aldabra Habitat', 8, '2024-03-30', '2024-04-30', 29.00, 75.00),
('E008', 450, 'Galapagos Habitat', 6, '2024-03-22', '2024-04-22', 26.50, 67.00),
('E009', 700, 'Leopard Habitat', 7, '2024-03-12', '2024-04-12', 27.50, 72.00),
('E010', 600, 'Sulcata Habitat', 9, '2024-03-05', '2024-04-05', 28.00, 70.00);

-- --------------------------------------------------------

--
-- Table structure for table `environment_data`
--

CREATE TABLE `environment_data` (
  `sensor_id` varchar(10) NOT NULL,
  `location_type` varchar(50) DEFAULT NULL,
  `location_id` varchar(10) DEFAULT NULL,
  `temperature` decimal(5,2) DEFAULT NULL,
  `humidity` decimal(5,2) DEFAULT NULL,
  `water_quality` decimal(5,2) DEFAULT NULL,
  `last_updated` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `environment_data`
--

INSERT INTO `environment_data` (`sensor_id`, `location_type`, `location_id`, `temperature`, `humidity`, `water_quality`, `last_updated`) VALUES
('S001', 'Enclosure', 'E001', 25.00, 65.00, 7.20, '2024-03-21 03:00:00'),
('S002', 'Incubator', 'I001', 29.00, 80.00, 7.00, '2024-03-21 02:45:00'),
('S003', 'Enclosure', 'E002', 27.50, 70.00, 6.90, '2024-03-20 04:00:00'),
('S004', 'Incubator', 'I002', 30.00, 75.00, 7.30, '2024-03-22 05:00:00'),
('S005', 'Enclosure', 'E003', 26.00, 68.00, 7.10, '2024-03-23 03:15:00'),
('S006', 'Enclosure', 'E004', 28.50, 72.00, 7.40, '2024-03-24 08:30:00'),
('S007', 'Incubator', 'I003', 29.50, 80.00, 7.20, '2024-03-25 07:00:00'),
('S008', 'Enclosure', 'E005', 25.50, 65.00, 7.10, '2024-03-26 04:45:00'),
('S009', 'Incubator', 'I004', 30.50, 75.00, 7.30, '2024-03-27 03:30:00'),
('S010', 'Enclosure', 'E006', 27.00, 70.00, 7.20, '2024-03-28 06:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `feeding_data`
--

CREATE TABLE `feeding_data` (
  `tortoise_id` varchar(10) NOT NULL,
  `species` varchar(50) DEFAULT NULL,
  `diet_type` varchar(20) DEFAULT NULL,
  `feeding_time` time DEFAULT NULL,
  `food_given` text DEFAULT NULL,
  `special_requirements` text DEFAULT NULL,
  `food_inventory_left` decimal(5,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `feeding_data`
--

INSERT INTO `feeding_data` (`tortoise_id`, `species`, `diet_type`, `feeding_time`, `food_given`, `special_requirements`, `food_inventory_left`) VALUES
('T001', 'Galapagos', 'Herbivore', '08:00:00', 'Grasses, Fruits', 'None', 85.00),
('T002', 'Aldabra', 'Herbivore', '02:00:00', 'Leaves, Flowers', 'Calcium supplement', 70.00),
('T003', 'Sulcata', 'Herbivore', '09:00:00', 'Cacti, Grass', 'None', 80.00),
('T004', 'Leopard', 'Omnivore', '10:00:00', 'Mixed Greens, Insects', 'None', 90.00),
('T005', 'Indian Star', 'Herbivore', '08:30:00', 'Vegetables, Fruits', 'Vitamin D supplement', 75.00),
('T006', 'Hermann', 'Omnivore', '11:00:00', 'Leafy Greens, Insects', 'Calcium supplement', 85.00),
('T007', 'Aldabra', 'Herbivore', '07:00:00', 'Grasses, Fruits', 'None', 78.00),
('T008', 'Galapagos', 'Herbivore', '08:00:00', 'Cacti, Flowers', 'None', 90.00),
('T009', 'Sulcata', 'Herbivore', '10:30:00', 'Grasses, Vegetables', 'None', 80.00),
('T010', 'Indian Star', 'Herbivore', '09:30:00', 'Fruits, Vegetables', 'None', 95.00);

-- --------------------------------------------------------

--
-- Table structure for table `task_assignments`
--

CREATE TABLE `task_assignments` (
  `task_id` varchar(10) NOT NULL,
  `task_type` varchar(50) DEFAULT NULL,
  `assigned_to` varchar(100) DEFAULT NULL,
  `date_assigned` date DEFAULT NULL,
  `due_time` time DEFAULT NULL,
  `completion_status` varchar(20) DEFAULT NULL,
  `notes` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `task_assignments`
--

INSERT INTO `task_assignments` (`task_id`, `task_type`, `assigned_to`, `date_assigned`, `due_time`, `completion_status`, `notes`) VALUES
('TK001', 'Feeding', 'Sarah Wilson', '2024-03-20', '08:00:00', 'Completed', 'All tortoises fed'),
('TK002', 'Medical Check-up', 'Dr. Johnson', '2024-03-21', '10:00:00', 'In Progress', 'Atlas under observation'),
('TK003', 'Feeding', 'John Doe', '2024-03-22', '09:00:00', 'Completed', 'Feeding done for all'),
('TK004', 'Habitat Maintenance', 'Emily Clark', '2024-03-23', '11:00:00', 'Completed', 'Enclosure E001 cleaned'),
('TK005', 'Medical Check-up', 'Dr. Taylor', '2024-03-24', '08:30:00', 'In Progress', 'Checking on tortoises health'),
('TK006', 'Feeding', 'Linda Brown', '2024-03-25', '07:00:00', 'Completed', 'All tortoises fed'),
('TK007', 'Breeding Pair Monitoring', 'James White', '2024-03-26', '12:00:00', 'In Progress', 'Monitoring breeding pair BP001'),
('TK008', 'Habitat Maintenance', 'Alice Green', '2024-03-27', '03:00:00', 'In Progress', 'Enclosure E002 repairs ongoing'),
('TK009', 'Feeding', 'Sarah Wilson', '2024-03-28', '09:30:00', 'Completed', 'Food given to all tortoises'),
('TK010', 'Medical Check-up', 'Dr. Johnson', '2024-03-29', '08:00:00', 'In Progress', 'Medical checks for Tortoise ID T009');

-- --------------------------------------------------------

--
-- Table structure for table `tortoises`
--

CREATE TABLE `tortoises` (
  `tortoise_id` varchar(10) NOT NULL,
  `species` varchar(50) DEFAULT NULL,
  `age` int(11) DEFAULT NULL,
  `gender` varchar(10) DEFAULT NULL,
  `health_status` varchar(20) DEFAULT NULL,
  `history_of_care` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tortoises`
--

INSERT INTO `tortoises` (`tortoise_id`, `species`, `age`, `gender`, `health_status`, `history_of_care`) VALUES
('T001', 'Galapagos', 45, 'Male', 'Healthy', 'Routine checkups, no major issues'),
('T002', 'Aldabra', 38, 'Female', 'Monitoring', 'Weight loss observed, under monitoring'),
('T003', 'Sulcata', 25, 'Male', 'Healthy', 'Vaccinated, regular feeding'),
('T004', 'Leopard', 50, 'Female', 'Healthy', 'Routine checkups, no major issues'),
('T005', 'Indian Star', 28, 'Male', 'Healthy', 'Vaccinated, regular feeding'),
('T006', 'Hermann', 32, 'Female', 'Monitoring', 'Observation for skin condition'),
('T007', 'Aldabra', 40, 'Male', 'Healthy', 'Routine checkups, no major issues'),
('T008', 'Galapagos', 60, 'Female', 'Healthy', 'Routine checkups, no major issues'),
('T009', 'Sulcata', 22, 'Male', 'Healthy', 'Regular feeding, good health'),
('T010', 'Indian Star', 35, 'Female', 'Healthy', 'Vaccinated, routine checkups');

-- --------------------------------------------------------

--
-- Table structure for table `veterinarian_duty`
--

CREATE TABLE `veterinarian_duty` (
  `tortoise_id` varchar(10) NOT NULL,
  `checkup_date` date NOT NULL,
  `health_status` varchar(20) DEFAULT NULL,
  `treatment_given` text DEFAULT NULL,
  `vaccination_status` varchar(20) DEFAULT NULL,
  `illness_injury_notes` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `veterinarian_duty`
--

INSERT INTO `veterinarian_duty` (`tortoise_id`, `checkup_date`, `health_status`, `treatment_given`, `vaccination_status`, `illness_injury_notes`) VALUES
('T001', '2024-03-20', 'Healthy', 'Routine checkup', 'Up to date', 'None'),
('T002', '2024-03-18', 'Monitoring', 'Weight monitoring', 'Due next month', 'Weight loss observed'),
('T003', '2024-03-22', 'Healthy', 'Routine checkup', 'Up to date', 'None'),
('T004', '2024-03-15', 'Healthy', 'Routine checkup', 'Up to date', 'None'),
('T005', '2024-03-25', 'Healthy', 'Vaccination', 'Up to date', 'None'),
('T006', '2024-03-28', 'Monitoring', 'Skin treatment', 'Due next month', 'Skin condition observation'),
('T007', '2024-03-30', 'Healthy', 'Routine checkup', 'Up to date', 'None'),
('T008', '2024-04-01', 'Healthy', 'Routine checkup', 'Up to date', 'None'),
('T009', '2024-04-02', 'Healthy', 'Vaccination', 'Up to date', 'None'),
('T010', '2024-04-05', 'Monitoring', 'Routine checkup', 'Due next month', 'Healthy, but monitoring');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `breeding_info`
--
ALTER TABLE `breeding_info`
  ADD PRIMARY KEY (`breeding_pair_id`),
  ADD KEY `male_tortoise_id` (`male_tortoise_id`),
  ADD KEY `female_tortoise_id` (`female_tortoise_id`);

--
-- Indexes for table `enclosures`
--
ALTER TABLE `enclosures`
  ADD PRIMARY KEY (`enclosure_id`);

--
-- Indexes for table `environment_data`
--
ALTER TABLE `environment_data`
  ADD PRIMARY KEY (`sensor_id`);

--
-- Indexes for table `feeding_data`
--
ALTER TABLE `feeding_data`
  ADD PRIMARY KEY (`tortoise_id`);

--
-- Indexes for table `task_assignments`
--
ALTER TABLE `task_assignments`
  ADD PRIMARY KEY (`task_id`);

--
-- Indexes for table `tortoises`
--
ALTER TABLE `tortoises`
  ADD PRIMARY KEY (`tortoise_id`);

--
-- Indexes for table `veterinarian_duty`
--
ALTER TABLE `veterinarian_duty`
  ADD PRIMARY KEY (`tortoise_id`,`checkup_date`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `breeding_info`
--
ALTER TABLE `breeding_info`
  ADD CONSTRAINT `breeding_info_ibfk_1` FOREIGN KEY (`male_tortoise_id`) REFERENCES `tortoises` (`tortoise_id`),
  ADD CONSTRAINT `breeding_info_ibfk_2` FOREIGN KEY (`female_tortoise_id`) REFERENCES `tortoises` (`tortoise_id`);

--
-- Constraints for table `feeding_data`
--
ALTER TABLE `feeding_data`
  ADD CONSTRAINT `feeding_data_ibfk_1` FOREIGN KEY (`tortoise_id`) REFERENCES `tortoises` (`tortoise_id`);

--
-- Constraints for table `veterinarian_duty`
--
ALTER TABLE `veterinarian_duty`
  ADD CONSTRAINT `veterinarian_duty_ibfk_1` FOREIGN KEY (`tortoise_id`) REFERENCES `tortoises` (`tortoise_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
