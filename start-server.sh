#!/bin/bash

echo "Starting Tortoise Conservation System PHP Server..."
echo ""
echo "Server will be available at: http://localhost:8000"
echo "Press Ctrl+C to stop the server"
echo ""

# Check if PHP is installed
if ! command -v php &> /dev/null; then
    echo "ERROR: PHP is not installed or not in PATH"
    echo "Please install PHP and add it to your system PATH"
    exit 1
fi

# Create logs directory if it doesn't exist
mkdir -p logs

# Start PHP development server
php -S localhost:8000 -t . -c php.ini
