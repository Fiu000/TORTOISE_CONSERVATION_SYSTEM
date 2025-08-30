// DOM Elements
const signupForm = document.getElementById('signupForm');
const signupButton = document.getElementById('signupButton');
const successMessage = document.getElementById('successMessage');

// Input Elements
const firstNameInput = document.getElementById('firstName');
const lastNameInput = document.getElementById('lastName');
const emailInput = document.getElementById('email');
const phoneInput = document.getElementById('phone');
const userIdInput = document.getElementById('userId');
const userTypeSelect = document.getElementById('userType');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirmPassword');
const organizationInput = document.getElementById('organization');
const locationInput = document.getElementById('location');
const agreeTermsCheckbox = document.getElementById('agreeTerms');
const newsletterCheckbox = document.getElementById('newsletter');

// Password Toggle Buttons
const passwordToggles = document.querySelectorAll('.toggle-password');

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    initializeForm();
    setupEventListeners();
    setupPasswordToggles();
    setupInputAnimations();
});

// Initialize form functionality
function initializeForm() {
    console.log('🚀 Signup page initialized');
    
    // Check for saved form data
    const savedData = localStorage.getItem('signupFormData');
    if (savedData) {
        const formData = JSON.parse(savedData);
        populateForm(formData);
    }
}

// Setup event listeners
function setupEventListeners() {
    // Form submission
    signupForm.addEventListener('submit', handleFormSubmission);
    
    // Real-time validation
    setupRealTimeValidation();
    
    // Auto-save form data
    setupAutoSave();
    
    // Input focus effects
    setupInputFocusEffects();
}

// Setup password toggle functionality
function setupPasswordToggles() {
    passwordToggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            const input = this.previousElementSibling;
            const icon = this.querySelector('i');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });
}

// Setup input animations
function setupInputAnimations() {
    const inputs = document.querySelectorAll('.input-container input, .input-container select');
    
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            if (!this.value) {
                this.parentElement.classList.remove('focused');
            }
        });
        
        // Check if input has value on load
        if (input.value) {
            input.parentElement.classList.add('focused');
        }
    });
}

// Setup real-time validation
function setupRealTimeValidation() {
    // Email validation
    emailInput.addEventListener('input', function() {
        validateEmail(this.value);
    });
    
    // Password validation
    passwordInput.addEventListener('input', function() {
        validatePassword(this.value);
        validatePasswordMatch();
    });
    
    confirmPasswordInput.addEventListener('input', function() {
        validatePasswordMatch();
    });
    
    // User ID validation
    userIdInput.addEventListener('input', function() {
        validateUserId(this.value);
    });
    
    // Phone validation
    phoneInput.addEventListener('input', function() {
        validatePhone(this.value);
    });
}

// Setup auto-save functionality
function setupAutoSave() {
    const inputs = document.querySelectorAll('input, select');
    
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            saveFormData();
        });
        
        input.addEventListener('change', function() {
            saveFormData();
        });
    });
}

// Setup input focus effects
function setupInputFocusEffects() {
    const inputContainers = document.querySelectorAll('.input-container');
    
    inputContainers.forEach(container => {
        const input = container.querySelector('input, select');
        const icon = container.querySelector('i');
        
        input.addEventListener('focus', function() {
            container.classList.add('focused');
            icon.style.color = '#32CD32';
        });
        
        input.addEventListener('blur', function() {
            container.classList.remove('focused');
            icon.style.color = '#228B22';
        });
    });
}

// Handle form submission
function handleFormSubmission(event) {
    event.preventDefault();
    
    console.log('📝 Form submission started');
    
    // Validate form
    if (!validateForm()) {
        console.log('❌ Form validation failed');
        return;
    }
    
    // Show loading state
    showLoadingState();
    
    // Simulate form processing
    setTimeout(() => {
        // Collect form data
        const formData = collectFormData();
        
        // Save user data (in a real app, this would be sent to a server)
        saveUserData(formData);
        
        // Clear saved form data
        localStorage.removeItem('signupFormData');
        
        // Show success message
        showSuccessMessage();
        
        console.log('✅ Account created successfully');
    }, 2000);
}

// Validate form
function validateForm() {
    let isValid = true;
    
    // Required fields validation
    const requiredFields = [
        { field: firstNameInput, name: 'First Name' },
        { field: lastNameInput, name: 'Last Name' },
        { field: emailInput, name: 'Email' },
        { field: phoneInput, name: 'Phone' },
        { field: userIdInput, name: 'User ID' },
        { field: userTypeSelect, name: 'User Type' },
        { field: passwordInput, name: 'Password' },
        { field: confirmPasswordInput, name: 'Confirm Password' },
        { field: organizationInput, name: 'Organization' },
        { field: locationInput, name: 'Location' }
    ];
    
    requiredFields.forEach(({ field, name }) => {
        if (!field.value.trim()) {
            showFieldError(field, `${name} is required`);
            isValid = false;
        } else {
            clearFieldError(field);
        }
    });
    
    // Email validation
    if (emailInput.value && !validateEmail(emailInput.value)) {
        isValid = false;
    }
    
    // Password validation
    if (passwordInput.value && !validatePassword(passwordInput.value)) {
        isValid = false;
    }
    
    // Password match validation
    if (!validatePasswordMatch()) {
        isValid = false;
    }
    
    // User ID validation
    if (userIdInput.value && !validateUserId(userIdInput.value)) {
        isValid = false;
    }
    
    // Phone validation
    if (phoneInput.value && !validatePhone(phoneInput.value)) {
        isValid = false;
    }
    
    // Terms agreement validation
    if (!agreeTermsCheckbox.checked) {
        showFieldError(agreeTermsCheckbox, 'You must agree to the terms and conditions');
        isValid = false;
    } else {
        clearFieldError(agreeTermsCheckbox);
    }
    
    return isValid;
}

// Validate email
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(email);
    
    if (!isValid && email) {
        showFieldError(emailInput, 'Please enter a valid email address');
    } else {
        clearFieldError(emailInput);
    }
    
    return isValid;
}

// Validate password
function validatePassword(password) {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    let isValid = true;
    let errorMessage = '';
    
    if (password.length < minLength) {
        errorMessage += `Password must be at least ${minLength} characters long. `;
        isValid = false;
    }
    
    if (!hasUpperCase) {
        errorMessage += 'Password must contain at least one uppercase letter. ';
        isValid = false;
    }
    
    if (!hasLowerCase) {
        errorMessage += 'Password must contain at least one lowercase letter. ';
        isValid = false;
    }
    
    if (!hasNumbers) {
        errorMessage += 'Password must contain at least one number. ';
        isValid = false;
    }
    
    if (!hasSpecialChar) {
        errorMessage += 'Password must contain at least one special character. ';
        isValid = false;
    }
    
    if (!isValid && password) {
        showFieldError(passwordInput, errorMessage.trim());
    } else {
        clearFieldError(passwordInput);
    }
    
    return isValid;
}

// Validate password match
function validatePasswordMatch() {
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;
    
    if (confirmPassword && password !== confirmPassword) {
        showFieldError(confirmPasswordInput, 'Passwords do not match');
        return false;
    } else {
        clearFieldError(confirmPasswordInput);
        return true;
    }
}

// Validate user ID
function validateUserId(userId) {
    const userIdRegex = /^[a-zA-Z0-9_]{4,20}$/;
    const isValid = userIdRegex.test(userId);
    
    if (!isValid && userId) {
        showFieldError(userIdInput, 'User ID must be 4-20 characters long and contain only letters, numbers, and underscores');
    } else {
        clearFieldError(userIdInput);
    }
    
    return isValid;
}

// Validate phone
function validatePhone(phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    const isValid = phoneRegex.test(phone.replace(/\s/g, ''));
    
    if (!isValid && phone) {
        showFieldError(phoneInput, 'Please enter a valid phone number');
    } else {
        clearFieldError(phoneInput);
    }
    
    return isValid;
}

// Show field error
function showFieldError(field, message) {
    const container = field.closest('.input-container') || field.closest('.checkbox-container');
    if (!container) return;
    
    // Remove existing error
    clearFieldError(field);
    
    // Create error element
    const errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    errorElement.textContent = message;
    errorElement.style.cssText = `
        color: #dc3545;
        font-size: 0.8rem;
        margin-top: 0.25rem;
        animation: slideIn 0.3s ease;
    `;
    
    // Add error to container
    container.appendChild(errorElement);
    container.style.borderColor = '#dc3545';
}

// Clear field error
function clearFieldError(field) {
    const container = field.closest('.input-container') || field.closest('.checkbox-container');
    if (!container) return;
    
    const errorElement = container.querySelector('.field-error');
    if (errorElement) {
        errorElement.remove();
    }
    
    container.style.borderColor = '';
}

// Show loading state
function showLoadingState() {
    signupButton.classList.add('loading');
    signupButton.disabled = true;
}

// Hide loading state
function hideLoadingState() {
    signupButton.classList.remove('loading');
    signupButton.disabled = false;
}

// Collect form data
function collectFormData() {
    return {
        firstName: firstNameInput.value.trim(),
        lastName: lastNameInput.value.trim(),
        email: emailInput.value.trim(),
        phone: phoneInput.value.trim(),
        userId: userIdInput.value.trim(),
        userType: userTypeSelect.value,
        password: passwordInput.value,
        organization: organizationInput.value.trim(),
        location: locationInput.value.trim(),
        newsletter: newsletterCheckbox.checked,
        timestamp: new Date().toISOString()
    };
}

// Save form data to localStorage
function saveFormData() {
    const formData = {
        firstName: firstNameInput.value,
        lastName: lastNameInput.value,
        email: emailInput.value,
        phone: phoneInput.value,
        userId: userIdInput.value,
        userType: userTypeSelect.value,
        organization: organizationInput.value,
        location: locationInput.value,
        newsletter: newsletterCheckbox.checked
    };
    
    localStorage.setItem('signupFormData', JSON.stringify(formData));
}

// Populate form with saved data
function populateForm(data) {
    if (data.firstName) firstNameInput.value = data.firstName;
    if (data.lastName) lastNameInput.value = data.lastName;
    if (data.email) emailInput.value = data.email;
    if (data.phone) phoneInput.value = data.phone;
    if (data.userId) userIdInput.value = data.userId;
    if (data.userType) userTypeSelect.value = data.userType;
    if (data.organization) organizationInput.value = data.organization;
    if (data.location) locationInput.value = data.location;
    if (data.newsletter) newsletterCheckbox.checked = data.newsletter;
    
    // Trigger focus effects for filled fields
    const inputs = document.querySelectorAll('.input-container input, .input-container select');
    inputs.forEach(input => {
        if (input.value) {
            input.parentElement.classList.add('focused');
        }
    });
}

// Save user data (simulate server save)
function saveUserData(formData) {
    // In a real application, this would send data to a server
    console.log('💾 Saving user data:', formData);
    
    // For demo purposes, save to localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    users.push(formData);
    localStorage.setItem('users', JSON.stringify(users));
}

// Show success message
function showSuccessMessage() {
    hideLoadingState();
    successMessage.classList.add('show');
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        successMessage.classList.remove('show');
    }, 5000);
}

// Add CSS animation for error messages
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

// Console logging for debugging
console.log('🎯 Signup script loaded successfully'); 