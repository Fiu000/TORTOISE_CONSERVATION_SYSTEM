// DOM Elements
const loginForm = document.getElementById('loginForm');
const userIdInput = document.getElementById('userId');
const passwordInput = document.getElementById('password');
const userTypeSelect = document.getElementById('userType');
const togglePasswordBtn = document.querySelector('.toggle-password');
const loginBtn = document.querySelector('.login-btn');
const successMessage = document.getElementById('successMessage');
const rememberMeCheckbox = document.getElementById('rememberMe');

console.log('🔍 DOM Elements found:');
console.log('loginForm:', loginForm);
console.log('userIdInput:', userIdInput);
console.log('passwordInput:', passwordInput);
console.log('userTypeSelect:', userTypeSelect);
console.log('rememberMeCheckbox:', rememberMeCheckbox);
console.log('successMessage:', successMessage);

// User Credentials
const USER_CREDENTIALS = {
    admin: {
        userId: 'Admin 000',
        password: '000',
        userType: 'admin',
        dashboard: 'admin-dashboard.html'
    },
    veterinarian: {
        userId: 'VETERINARIAN111',
        password: '111',
        userType: 'Veterinarian',
        dashboard: 'vet-dashboard.html'
    },
    breedingManager: {
        userId: 'BREEDING MANAGER222',
        password: '222',
        userType: 'breeding manager',
        dashboard: 'breeding-manager-dashboard.html'
    },
    nutritionist: {
        userId: 'NUTRITIONIST333',
        password: '333',
        userType: 'nutritionist',
        dashboard: 'nutritionist-dashboard.html'
    },
    maintainanceStaff: {
        userId: 'MAINTAINANCE STAFF444',
        password: '444',
        userType: 'maintainance staff',
        dashboard: 'maintainance-staff-dashboard.html'
    },
    taskManager: {
        userId: 'TASK MANAGER 555',
        password: '555',
        userType: 'task manager',
        dashboard: 'task-manager-dashboard.html'
    },
    iotStaff: {
        userId: 'IOT STAFF666',
        password: '666',
        userType: 'iot staff',
        dashboard: 'iot-staff-dashboard.html'
    },
    caretaker: {
        userId: 'CARETAKER777',
        password: '777',
        userType: 'caretaker',
        dashboard: 'tortoise-caretaker-dashboard.html'
    }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 DOM loaded - initializing login script...');
    
    // Check if all required elements exist
    if (!loginForm || !userIdInput || !passwordInput || !userTypeSelect || !rememberMeCheckbox || !successMessage) {
        console.error('❌ Some required elements are missing!');
        return;
    }
    
    console.log('✅ All required elements found');
    
    // Setup all functionality
    setupInputEffects();
    setupPasswordToggle();
    setupFormSubmission();
    setupKeyboardNavigation();
    setupFloatingShapes();
    checkLogoutStatus();
    
    console.log('✅ Login script initialization complete');
});

// Setup input focus effects
function setupInputEffects() {
    const inputs = document.querySelectorAll('input, select');
    
    inputs.forEach(input => {
        // Add focus effects
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            if (!this.value) {
                this.parentElement.classList.remove('focused');
            }
        });
        
        // Add input validation effects
        input.addEventListener('input', function() {
            validateInput(this);
        });
        
        // Add keydown effects
        input.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                const nextInput = this.parentElement.nextElementSibling?.querySelector('input, select');
                if (nextInput) {
                    nextInput.focus();
                } else {
                    loginForm.dispatchEvent(new Event('submit'));
                }
            }
        });
    });
}

// Validate input fields
function validateInput(input) {
    const container = input.parentElement;
    const value = input.value.trim();
    
    // Remove existing validation classes
    container.classList.remove('valid', 'invalid');
    
    if (value) {
        // Add validation based on input type
        let isValid = true;
        
        switch (input.type) {
            case 'text':
                isValid = value.length >= 3;
                break;
            case 'password':
                isValid = value.length >= 4; // Changed from 6 to 4 to allow "1234"
                break;
            case 'select-one':
                isValid = value !== '';
                break;
        }
        
        if (isValid) {
            container.classList.add('valid');
            container.classList.remove('invalid');
        } else {
            container.classList.add('invalid');
            container.classList.remove('valid');
        }
    }
}

// Setup password toggle functionality
function setupPasswordToggle() {
    togglePasswordBtn.addEventListener('click', function() {
        const type = passwordInput.type === 'password' ? 'text' : 'password';
        passwordInput.type = type;
        
        const icon = this.querySelector('i');
        icon.className = type === 'password' ? 'fas fa-eye' : 'fas fa-eye-slash';
        
        // Add animation effect
        this.style.transform = 'scale(0.9)';
        setTimeout(() => {
            this.style.transform = 'scale(1)';
        }, 100);
    });
}

// Setup form submission
function setupFormSubmission() {
    console.log('🔧 Setting up form submission...');
    const loginButton = document.getElementById('loginButton');
    console.log('🔍 Login button found:', loginButton);
    
    if (!loginButton) {
        console.error('❌ Login button not found!');
        return;
    }
    
    loginButton.addEventListener('click', function(e) {
        console.log('🚀 Login button clicked!');
        e.preventDefault();
        console.log('🚀 Login button clicked');
        
        // Get form data
        const formData = {
            userId: userIdInput.value.trim(),
            password: passwordInput.value.trim(),
            userType: userTypeSelect.value,
            rememberMe: rememberMeCheckbox.checked
        };
        
        console.log('📝 Form data:', formData);
        
        // Simple validation
        if (!formData.userId || !formData.password || !formData.userType) {
            console.log('❌ Missing required fields');
            showError('Please fill in all required fields');
            return false;
        }
        
        // Check for admin login specifically
        if (formData.userId === 'Admin 000' && 
            formData.password === '000' && 
            formData.userType === 'admin') {
            
            console.log('✅ Admin login detected - redirecting...');
            
            // Store login data if remember me is checked
            if (formData.rememberMe) {
                localStorage.setItem('userCredentials', JSON.stringify({
                    userId: formData.userId,
                    password: formData.password,
                    userType: formData.userType,
                    timestamp: Date.now()
                }));
            } else {
                localStorage.removeItem('userCredentials');
            }
            
            // Show success message briefly then redirect
            showSuccessMessage();
            setTimeout(() => {
                console.log('🔄 Redirecting to admin dashboard...');
                window.location.href = 'admin-dashboard.html';
            }, 1500);
            
            return false;
        }
        
        // Check for veterinarian login specifically
        if (formData.userId === 'VETERINARIAN111' && 
            formData.password === '111' && 
            formData.userType === 'Veterinarian') {
            
            console.log('✅ Veterinarian login detected - redirecting...');
            
            // Store login data if remember me is checked
            if (formData.rememberMe) {
                localStorage.setItem('userCredentials', JSON.stringify({
                    userId: formData.userId,
                    password: formData.password,
                    userType: formData.userType,
                    timestamp: Date.now()
                }));
            } else {
                localStorage.removeItem('userCredentials');
            }
            
            // Show success message briefly then redirect
            showSuccessMessage();
            setTimeout(() => {
                console.log('🔄 Redirecting to veterinarian dashboard...');
                window.location.href = 'vet-dashboard.html';
            }, 1500);
            
            return false;
        }
        
        // Check other credentials
        const validUser = validateUserCredentials(formData);
        if (validUser) {
            console.log('✅ Valid credentials detected for:', validUser.userType);
            console.log('🎯 Redirecting to:', validUser.dashboard);
            
            // Store login data if remember me is checked
            if (formData.rememberMe) {
                localStorage.setItem('userCredentials', JSON.stringify({
                    userId: formData.userId,
                    password: formData.password,
                    userType: formData.userType,
                    timestamp: Date.now()
                }));
            } else {
                localStorage.removeItem('userCredentials');
            }
            
            // Show success message briefly then redirect
            showSuccessMessage();
            setTimeout(() => {
                console.log('🔄 Redirecting to dashboard...');
                window.location.href = validUser.dashboard;
            }, 1500);
        } else {
            console.log('❌ Invalid credentials:', formData);
            // Show error for invalid credentials
            showError('Invalid credentials. Please check your User ID, Password, and User Type.');
        }
        
        return false;
    });
    
    console.log('✅ Form submission setup complete');
}

// Validate form data
function validateForm(data) {
    let isValid = true;
    const errors = [];
    
    console.log('🔍 Validating form data:', data);
    
    // Validate User ID
    if (!data.userId || data.userId.length < 3) {
        errors.push('User ID must be at least 3 characters long');
        isValid = false;
        highlightError(userIdInput);
    }
    
    // Validate Password
    if (!data.password || data.password.length < 3) {
        errors.push('Password must be at least 3 characters long');
        isValid = false;
        highlightError(passwordInput);
    }
    
    // Validate User Type
    if (!data.userType || data.userType === '') {
        errors.push('Please select a user type');
        isValid = false;
        highlightError(userTypeSelect);
    }
    
    // Show errors if any
    if (!isValid) {
        console.log('❌ Form validation errors:', errors);
        showErrors(errors);
    } else {
        console.log('✅ Form validation passed');
    }
    
    return isValid;
}

// Validate user credentials
function validateUserCredentials(data) {
    console.log('🔍 Validating credentials for:', data.userType);
    console.log('📋 All credentials:', USER_CREDENTIALS);
    
    // Check each user type
    for (const [key, credentials] of Object.entries(USER_CREDENTIALS)) {
        console.log('  Checking against:', credentials.userType);
        console.log('  Expected User ID:', credentials.userId, 'Got:', data.userId);
        console.log('  Expected Password:', credentials.password, 'Got:', data.password);
        console.log('  Expected User Type:', credentials.userType, 'Got:', data.userType);
        
        const userIdMatch = data.userId === credentials.userId;
        const passwordMatch = data.password === credentials.password;
        const userTypeMatch = data.userType === credentials.userType;
        
        console.log('  User ID match:', userIdMatch);
        console.log('  Password match:', passwordMatch);
        console.log('  User Type match:', userTypeMatch);
        
        const isValid = userIdMatch && passwordMatch && userTypeMatch;
        
        console.log('  Validation result for', credentials.userType, ':', isValid);
        
        if (isValid) {
            console.log('✅ Found matching credentials for:', credentials.userType);
            return credentials;
        }
    }
    
    console.log('❌ No matching credentials found');
    return null;
}

// Highlight error field
function highlightError(input) {
    const container = input.parentElement;
    container.classList.add('error-shake');
    
    setTimeout(() => {
        container.classList.remove('error-shake');
    }, 500);
}

// Show error messages
function showErrors(errors) {
    // Create error message element
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.innerHTML = `
        <div class="error-icon">
            <i class="fas fa-exclamation-triangle"></i>
        </div>
        <div class="error-content">
            <h4>Please fix the following errors:</h4>
            <ul>
                ${errors.map(error => `<li>${error}</li>`).join('')}
            </ul>
        </div>
    `;
    
    // Insert error message
    loginForm.insertBefore(errorDiv, loginForm.firstChild);
    
    // Remove error message after 5 seconds
    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}

// Show single error message
function showError(message) {
    // Create error notification
    const notification = document.createElement('div');
    notification.className = 'error-notification';
    notification.innerHTML = `
        <i class="fas fa-exclamation-triangle"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}

// Show loading state
function showLoadingState() {
    loginBtn.classList.add('loading');
    loginBtn.disabled = true;
}

// Hide loading state
function hideLoadingState() {
    loginBtn.classList.remove('loading');
    loginBtn.disabled = false;
}

// Show success message
function showSuccessMessage() {
    successMessage.classList.add('show');
    
    // Add confetti effect
    createConfetti();
}

// Create confetti effect
function createConfetti() {
    const colors = ['#228B22', '#32CD32', '#90EE90', '#98FB98'];
    
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.cssText = `
            position: fixed;
            width: ${Math.random() * 10 + 5}px;
            height: ${Math.random() * 10 + 5}px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            left: ${Math.random() * 100}%;
            top: -10px;
            animation: confettiFall ${Math.random() * 3 + 2}s linear forwards;
            z-index: 1000;
            border-radius: 2px;
        `;
        
        document.body.appendChild(confetti);
        
        // Remove confetti after animation
        setTimeout(() => {
            confetti.remove();
        }, 5000);
    }
}

// Setup ripple effects
function setupRippleEffects() {
    const buttons = document.querySelectorAll('button');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

// Check logout status and show welcome back message
function checkLogoutStatus() {
    const urlParams = new URLSearchParams(window.location.search);
    const logoutStatus = urlParams.get('logout');
    
    if (logoutStatus === 'success') {
        // Show welcome back message
        showWelcomeBackMessage();
        
        // Clean up URL
        window.history.replaceState({}, document.title, window.location.pathname);
    }
}

// Show welcome back message
function showWelcomeBackMessage() {
    const welcomeMessage = document.createElement('div');
    welcomeMessage.className = 'welcome-message';
    welcomeMessage.innerHTML = `
        <div class="welcome-content">
            <i class="fas fa-sign-out-alt"></i>
            <h3>Successfully Logged Out</h3>
            <p>Thank you for using the Tortoise Conservation Center Management System</p>
            <div class="welcome-actions">
                <a href="index.html" class="welcome-btn">
                    <i class="fas fa-home"></i>
                    <span>Back to Landing Page</span>
                </a>
            </div>
        </div>
    `;
    
    document.body.appendChild(welcomeMessage);
    
    // Remove message after 5 seconds
    setTimeout(() => {
        welcomeMessage.remove();
    }, 5000);
}

// Setup global keyboard navigation
function setupKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
        // Escape key to go back to landing page
        if (e.key === 'Escape') {
            window.location.href = 'index.html';
        }
        
        // Home key to go back to landing page
        if (e.key === 'Home') {
            window.location.href = 'index.html';
        }
        
        // Ctrl + Backspace to go back to landing page
        if (e.key === 'Backspace' && e.ctrlKey) {
            e.preventDefault();
            window.location.href = 'index.html';
        }
    });
}

// Setup floating shapes animation
function setupFloatingShapes() {
    const shapes = document.querySelectorAll('.shape');
    
    shapes.forEach((shape, index) => {
        // Add random movement
        setInterval(() => {
            const x = Math.random() * 20 - 10;
            const y = Math.random() * 20 - 10;
            shape.style.transform = `translate(${x}px, ${y}px) rotate(${Math.random() * 360}deg)`;
        }, 3000 + index * 500);
    });
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    @keyframes confettiFall {
        to {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
        }
    }
    
    @keyframes error-shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
    
    .error-shake {
        animation: error-shake 0.5s ease;
    }
    
    .error-message {
        background: #ffebee;
        border: 1px solid #f44336;
        border-radius: 10px;
        padding: 15px;
        margin-bottom: 20px;
        display: flex;
        align-items: flex-start;
        gap: 15px;
        animation: slideInDown 0.5s ease;
    }
    
    .error-icon {
        color: #f44336;
        font-size: 1.2rem;
        margin-top: 2px;
    }
    
    .error-content h4 {
        color: #d32f2f;
        margin-bottom: 10px;
        font-size: 1rem;
    }
    
    .error-content ul {
        margin: 0;
        padding-left: 20px;
        color: #d32f2f;
    }
    
    .error-content li {
        margin-bottom: 5px;
        font-size: 0.9rem;
    }
    
    @keyframes slideInDown {
        from {
            opacity: 0;
            transform: translateY(-20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .input-container.valid input,
    .input-container.valid select {
        border-color: #4caf50;
        box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
    }
    
    .input-container.invalid input,
    .input-container.invalid select {
        border-color: #f44336;
        box-shadow: 0 0 0 2px rgba(244, 67, 54, 0.2);
    }
    
    .input-container.focused input,
    .input-container.focused select {
        border-color: #228B22;
        box-shadow: 0 0 0 2px rgba(34, 139, 34, 0.2);
    }
    
    .error-notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: #ff4757;
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 10px 25px rgba(255, 71, 87, 0.3);
        display: flex;
        align-items: center;
        gap: 10px;
        z-index: 1000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
    }
    
    .error-notification.show {
        transform: translateX(0);
    }
    
    .error-notification i {
        font-size: 1.2rem;
    }
    
    .welcome-message {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        padding: 30px;
        border-radius: 20px;
        box-shadow: 0 25px 50px rgba(0, 0, 0, 0.2);
        text-align: center;
        z-index: 2000;
        animation: welcomeSlideIn 0.5s ease;
    }
    
    .welcome-content i {
        font-size: 3rem;
        color: #228B22;
        margin-bottom: 15px;
    }
    
    .welcome-content h3 {
        color: #333;
        font-size: 1.5rem;
        margin-bottom: 10px;
    }
    
    .welcome-content p {
        color: #666;
        margin-bottom: 20px;
    }
    
    .welcome-actions {
        margin-top: 20px;
    }
    
    .welcome-btn {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        background: linear-gradient(135deg, #228B22, #32CD32);
        color: white;
        text-decoration: none;
        padding: 10px 20px;
        border-radius: 25px;
        font-weight: 500;
        transition: all 0.3s ease;
    }
    
    .welcome-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 10px 20px rgba(34, 139, 34, 0.3);
    }
    
    @keyframes welcomeSlideIn {
        from {
            opacity: 0;
            transform: translate(-50%, -60%);
        }
        to {
            opacity: 1;
            transform: translate(-50%, -50%);
        }
    }
`;
document.head.appendChild(style); 

// Export functions for global access
window.showNotification = showNotification;

 