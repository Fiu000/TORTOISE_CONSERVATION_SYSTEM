# Tortoise Conservation System

A comprehensive management system for tortoise conservation facilities, designed to handle various aspects of tortoise care, breeding, health monitoring, and facility management.

## Features

- **Multi-Role Dashboard System**: Separate dashboards for different staff roles
- **Health Monitoring**: Comprehensive health tracking and veterinary care management
- **Breeding Management**: Breeding program coordination and genetic tracking
- **Task Management**: Staff task assignment and progress tracking
- **IoT Integration**: Sensor data monitoring and environmental control
- **Maintenance Tracking**: Facility maintenance and equipment management
- **Nutrition Management**: Dietary planning and feeding schedules
- **Database Management**: Centralized data storage and retrieval

## Staff Roles

1. **Admin Dashboard** - System administration and oversight
2. **Veterinarian Dashboard** - Medical care and health monitoring
3. **Tortoise Caretaker Dashboard** - Daily care and feeding
4. **Breeding Manager Dashboard** - Breeding program management
5. **Nutritionist Dashboard** - Dietary planning and nutrition
6. **Maintenance Staff Dashboard** - Facility maintenance
7. **IoT Staff Dashboard** - Technology and sensor management
8. **Task Manager Dashboard** - Task coordination and tracking

## PHP Server Extension

This project now includes a comprehensive PHP server extension for backend functionality and API endpoints.

### New PHP Components

- **Configuration Management** (`config.php`) - Centralized application settings
- **Database Layer** (`database.php`) - Advanced database connection and query management
- **API Structure** (`api/`) - RESTful API endpoints for all system functions
- **Server Scripts** - Easy server startup scripts for different platforms

### Quick Start with PHP

#### Prerequisites
- PHP 7.4 or higher
- MySQL/MariaDB server
- Composer (for dependency management)

#### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd TORTOISE_CONSERVATION_SYSTEM
   ```

2. **Install PHP dependencies**
   ```bash
   composer install
   ```

3. **Configure database**
   - Update database settings in `config.php`
   - Import the database schema from `database.sql`

4. **Start the PHP server**

   **Windows:**
   ```bash
   start-server.bat
   ```

   **Linux/Mac:**
   ```bash
   chmod +x start-server.sh
   ./start-server.sh
   ```

   **Manual start:**
   ```bash
   php -S localhost:8000 -t . -c php.ini
   ```

5. **Access the system**
   - Main application: http://localhost:8000
   - API endpoints: http://localhost:8000/api/
   - Health check: http://localhost:8000/api/health

### API Endpoints

The system provides RESTful API endpoints for all major functions:

- `GET /api/health` - System health and status
- `GET /api/tortoises` - Tortoise information
- `GET /api/users` - User management
- `GET /api/tasks` - Task management
- `GET /api/breeding` - Breeding program data
- `GET /api/nutrition` - Nutrition and feeding data
- `GET /api/veterinary` - Medical and health data
- `GET /api/maintenance` - Facility maintenance data
- `GET /api/iot` - IoT sensor data

### Configuration

Key configuration files:

- `config.php` - Application settings and constants
- `php.ini` - PHP server configuration
- `.htaccess` - Apache server configuration
- `composer.json` - PHP dependency management

### Database Connection

The system uses an improved database connection class with:

- Connection pooling and management
- Prepared statements for security
- Transaction support
- Error handling and logging
- Automatic reconnection

### File Structure

```
TORTOISE_CONSERVATION_SYSTEM/
├── api/                          # API endpoints
│   ├── index.php                # API router
│   └── endpoints/               # Individual endpoint handlers
│       ├── health.php           # Health check
│       ├── tortoises.php        # Tortoise management
│       ├── users.php            # User management
│       └── ...                  # Other endpoints
├── config.php                   # Application configuration
├── database.php                 # Database connection class
├── db_connection.php            # Legacy database connection
├── php.ini                      # PHP configuration
├── .htaccess                    # Apache configuration
├── composer.json                # PHP dependencies
├── start-server.bat             # Windows server startup
├── start-server.sh              # Unix server startup
├── logs/                        # Application logs
├── uploads/                     # File uploads
└── ...                          # HTML/CSS/JS files
```

## Development

### Adding New API Endpoints

1. Create a new file in `api/endpoints/`
2. Handle the appropriate HTTP methods
3. Use the `apiResponse()` and `apiError()` helper functions
4. Add the endpoint to the router in `api/index.php`

### Database Operations

Use the Database class for all database operations:

```php
$db = Database::getInstance();

// Fetch data
$tortoises = $db->fetchAll("SELECT * FROM tortoises");

// Insert data
$id = $db->insert("INSERT INTO tortoises (name, species) VALUES (?, ?)", ['Tommy', 'Galapagos']);

// Update data
$affected = $db->update("UPDATE tortoises SET status = ? WHERE id = ?", ['healthy', $id]);
```

### Error Handling

The system includes comprehensive error handling:

- Database connection errors
- Query execution errors
- API validation errors
- File upload errors
- Logging to `logs/php_errors.log`

## Security Features

- SQL injection prevention with prepared statements
- XSS protection headers
- CSRF protection
- File upload validation
- Secure session management
- Input sanitization and validation

## Performance Optimization

- OPcache enabled for PHP performance
- Database connection pooling
- File compression and caching
- Optimized database queries
- Memory management

## Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check database credentials in `config.php`
   - Ensure MySQL service is running
   - Verify database exists

2. **Permission Denied**
   - Ensure `logs/` and `uploads/` directories are writable
   - Check file permissions on server startup scripts

3. **PHP Extensions Missing**
   - Install required PHP extensions: mysqli, json, curl
   - Use `composer install` to check dependencies

4. **Port Already in Use**
   - Change port in server startup scripts
   - Check for other services using port 8000

### Logs

Check the following log files for debugging:

- `logs/php_errors.log` - PHP errors and warnings
- Apache error logs (if using Apache)
- Browser developer console for frontend issues

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Create an issue in the repository
- Check the troubleshooting section
- Review the API documentation

---

**Note**: This system is designed for educational and conservation purposes. Ensure compliance with local wildlife regulations and best practices when implementing in production environments. 