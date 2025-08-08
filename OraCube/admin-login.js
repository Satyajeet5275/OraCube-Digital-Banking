// Admin Login JavaScript
let adminTimerInterval;

document.addEventListener('DOMContentLoaded', function() {
    // Initialize background animation
    initBackgroundAnimation();
    
    // Hide loader after everything is loaded
    setTimeout(hideLoader, 1500);
    
    // Setup admin login form
    setupAdminLoginForm();
    
    // Initialize animations
    initAnimations();
});

// Hide the loader
function hideLoader() {
    const loader = document.getElementById('loader');
    if (loader) {
        loader.classList.add('hidden');
        setTimeout(() => {
            loader.style.display = 'none';
        }, 500);
    }
}

// Background Animation
function initBackgroundAnimation() {
    try {
        VANTA.NET({
            el: "#bg-animation",
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.00,
            minWidth: 200.00,
            scale: 1.00,
            scaleMobile: 1.00,
            color: 0xe74c3c,
            backgroundColor: 0x0a0e1a,
            points: 8.00,
            maxDistance: 25.00,
            spacing: 18.00
        });
    } catch (error) {
        console.log('VANTA animation not available, using fallback');
        createFallbackAnimation();
    }
}

function createFallbackAnimation() {
    const bgElement = document.getElementById('bg-animation');
    bgElement.innerHTML = `
        <div class="floating-shapes">
            <div class="shape shape-1"></div>
            <div class="shape shape-2"></div>
            <div class="shape shape-3"></div>
            <div class="shape shape-4"></div>
        </div>
    `;
}

// Setup admin login form
function setupAdminLoginForm() {
    const adminLoginForm = document.getElementById('adminLoginForm');
    const togglePassword = document.querySelector('.toggle-password');
    const passwordField = document.getElementById('adminPassword');
    
    // Password visibility toggle
    if (togglePassword) {
        togglePassword.addEventListener('click', function() {
            const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordField.setAttribute('type', type);
            
            const icon = this.querySelector('i');
            icon.classList.toggle('fa-eye');
            icon.classList.toggle('fa-eye-slash');
        });
    }
    
    // Form submission
    adminLoginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        handleAdminLogin();
    });
    
    // Real-time validation
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('blur', validateAdminField);
        input.addEventListener('input', clearAdminFieldError);
    });
    
    // Auto-format access code
    const accessCodeInput = document.getElementById('accessCode');
    accessCodeInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 8) {
            value = value.substring(0, 8);
        }
        e.target.value = value;
    });
}

// Handle admin login
function handleAdminLogin() {
    const adminId = document.getElementById('adminId').value.trim();
    const adminPassword = document.getElementById('adminPassword').value;
    const secureSession = document.getElementById('secureSession').checked;

    // Validate inputs
    if (!validateAdminLoginInputs(adminId, adminPassword)) {
        return;
    }

    // Show loading state
    const loginBtn = document.querySelector('.admin-login-btn');
    const originalText = loginBtn.innerHTML;
    loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Authenticating...';
    loginBtn.disabled = true;

    // Remove previous error below password if any
    removeAdminLoginErrorBelowPassword();

    // AJAX login to Spring Boot backend
    fetch('http://localhost:8080/admin/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: adminId,
            password: adminPassword
        })
    })
    .then(async response => {
        loginBtn.innerHTML = originalText;
        loginBtn.disabled = false;
        if (response.ok) {
            const email = 'eshan.bandekar@gmail.com';
            window.adminEmail = email;
            showAdminTwoFactorModal();
            const dbService = new DatabaseService1();
            const otpResult = await dbService.sendOTP(email);

            if (!otpResult.success) {
                showAdminError('Failed to send OTP: ' + otpResult.error);
            }
        } else {
            const errorMsg = await response.text();
            showAdminLoginErrorBelowPassword(errorMsg || 'Invalid credentials');
            shakeAdminLoginCard();
        }
    })
    .catch(() => {
        loginBtn.innerHTML = originalText;
        loginBtn.disabled = false;
        showAdminLoginErrorBelowPassword('Unable to connect to server. Please try again.');
        shakeAdminLoginCard();
    });
}

// Show error below password field (not as notification)
function showAdminLoginErrorBelowPassword(message) {
    removeAdminLoginErrorBelowPassword();
    const passwordGroup = document.getElementById('adminPassword').closest('.form-group');
    let errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.style.marginTop = '0.5rem';
    errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
    passwordGroup.appendChild(errorDiv);
    document.getElementById('adminPassword').classList.add('error');
}

function removeAdminLoginErrorBelowPassword() {
    const passwordGroup = document.getElementById('adminPassword').closest('.form-group');
    if (!passwordGroup) return;
    const errorDiv = passwordGroup.querySelector('.field-error');
    if (errorDiv) errorDiv.remove();
    document.getElementById('adminPassword').classList.remove('error');
}

// Validate admin login inputs
function validateAdminLoginInputs(adminId, adminPassword) {
    let isValid = true;
    
    if (!adminId) {
        showAdminFieldError(document.getElementById('adminId'), 'Administrator ID is required');
        isValid = false;
    }
    
    if (!adminPassword) {
        showAdminFieldError(document.getElementById('adminPassword'), 'Password is required');
        isValid = false;
    }
    
    return isValid;
}

// Demo admin credential check
function isValidAdminCredentials(adminId, adminPassword, accessCode) {
    // Demo credentials for testing
    const validAdminCredentials = [
        { adminId: 'admin001', password: 'AdminPass123', accessCode: '12345678' },
        { adminId: 'superadmin', password: 'SecureAdmin456', accessCode: '87654321' },
        { adminId: 'bankadmin', password: 'BankAdmin789', accessCode: '11223344' }
    ];
    
    return validAdminCredentials.some(cred => 
        cred.adminId === adminId && 
        cred.password === adminPassword && 
        cred.accessCode === accessCode
    );
}

// Show admin 2FA modal
function showAdminTwoFactorModal() {
    const modal = document.getElementById('adminTwoFactorModal');
    modal.style.display = 'flex';
    
    // Generate and display OTP (demo)
    const demoOtp = generateAdminDemoOtp();
    console.log('Demo Admin 2FA Code:', demoOtp);
    
    // Focus first OTP input
    const firstOtpInput = modal.querySelector('.otp-input');
    if (firstOtpInput) {
        firstOtpInput.focus();
    }
    
    // Start countdown timer
    startAdminCountdownTimer();
}

// Generate demo admin OTP
function generateAdminDemoOtp() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// Start admin countdown timer
function startAdminCountdownTimer() {
    let timeLeft = 180; // 3 minutes for admin
    const timerElement = document.getElementById('adminOtpTimer');
    const resendBtn = document.getElementById('adminResendBtn');
    
    adminTimerInterval = setInterval(() => {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timerElement.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        if (timeLeft <= 0) {
            clearInterval(adminTimerInterval);
            timerElement.textContent = 'Expired';
            resendBtn.style.display = 'block';
        }
        
        timeLeft--;
    }, 1000);
}

// Handle admin OTP input
function handleAdminOtpInput(input, index) {
    const value = input.value;
    
    // Only allow numbers
    if (!/^\d$/.test(value)) {
        input.value = '';
        return;
    }
    
    // Move to next input
    if (value && index < 5) {
        const nextInput = input.parentElement.children[index + 1];
        if (nextInput) {
            nextInput.focus();
        }
    }
    
    // Auto-verify when all inputs are filled
    const allInputs = document.querySelectorAll('#adminTwoFactorModal .otp-input');
    const otpValue = Array.from(allInputs).map(inp => inp.value).join('');
    
    if (otpValue.length === 6) {
        setTimeout(() => verifyAdminTwoFactor(), 500);
    }
}

// Handle admin OTP backspace
function handleAdminOtpKeydown(event, index) {
    if (event.key === 'Backspace' && !event.target.value && index > 0) {
        const prevInput = event.target.parentElement.children[index - 1];
        if (prevInput) {
            prevInput.focus();
        }
    }
}

async function verifyAdminTwoFactor() {
    const otpInputs = document.querySelectorAll('#adminTwoFactorModal .otp-input');
    const enteredOtp = Array.from(otpInputs).map(input => input.value).join('');
    if (enteredOtp.length !== 6) {
        showAdminError('Please enter the complete 6-digit verification code');
        return;
    }

    const verifyBtn = document.querySelector('.verify-admin-btn');
    const originalText = verifyBtn.innerHTML;
    verifyBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Verifying...';
    verifyBtn.disabled = true;

    const dbService = new DatabaseService1();
    const adminEmail = "eshan.bandekar@gmail.com";

    try {
        const verifyResult = await dbService.verifyOTP(adminEmail, enteredOtp);
        if (verifyResult.success && verifyResult.data.status === true) {
            closeAdminTwoFactorModal();
            showAdminSuccessModal();
        } else {
            throw new Error(verifyResult.error || 'Invalid verification code');
        }
    } catch (error) {
        verifyBtn.innerHTML = originalText;
        verifyBtn.disabled = false;
        showAdminError(error.message);
        shakeAdminOtpInputs();
    }
}

// Resend admin OTP
function resendAdminOtp() {
    // Clear current OTP inputs
    document.querySelectorAll('#adminTwoFactorModal .otp-input').forEach(input => {
        input.value = '';
    });
    
    // Generate new demo OTP
    const newOtp = generateAdminDemoOtp();
    console.log('New Demo Admin 2FA Code:', newOtp);
    
    // Hide resend button and restart timer
    document.getElementById('adminResendBtn').style.display = 'none';
    startAdminCountdownTimer();
    
    showAdminSuccess('New verification code sent successfully!');
}

// Close admin 2FA modal
function closeAdminTwoFactorModal() {
    document.getElementById('adminTwoFactorModal').style.display = 'none';
    clearInterval(adminTimerInterval);
    
    // Clear OTP inputs
    document.querySelectorAll('#adminTwoFactorModal .otp-input').forEach(input => {
        input.value = '';
    });
}

// Show admin success modal
function showAdminSuccessModal() {
    const modal = document.getElementById('adminSuccessModal');
    const sessionTimeElement = document.getElementById('sessionTime');
    
    // Set current time
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
    });
    sessionTimeElement.textContent = timeString;
    
    modal.style.display = 'flex';
    
    showAdminSuccess('Admin access granted! Welcome to the administrator panel.');
}

// Admin field validation
function validateAdminField(event) {
    const field = event.target;
    const value = field.value.trim();
    
    clearAdminFieldError(event);
    
    if (field.hasAttribute('required') && !value) {
        showAdminFieldError(field, 'This field is required');
        return false;
    }
    
    // Specific validations
    if (field.id === 'adminId' && value && value.length < 3) {
        showAdminFieldError(field, 'Administrator ID must be at least 3 characters');
        return false;
    }
    
    if (field.id === 'adminPassword' && value && value.length < 8) {
        showAdminFieldError(field, 'Password must be at least 8 characters');
        return false;
    }
    
    if (field.id === 'accessCode' && value && !/^\d{8}$/.test(value)) {
        showAdminFieldError(field, 'Access code must be exactly 8 digits');
        return false;
    }
    
    return true;
}

function clearAdminFieldError(event) {
    const field = event.target;
    const formGroup = field.closest('.form-group');
    const errorElement = formGroup.querySelector('.field-error');
    
    if (errorElement) {
        errorElement.remove();
    }
    
    field.classList.remove('error');
}

function showAdminFieldError(field, message) {
    field.classList.add('error');
    
    const formGroup = field.closest('.form-group');
    let errorElement = formGroup.querySelector('.field-error');
    
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        formGroup.appendChild(errorElement);
    }
    
    errorElement.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
}

// Utility functions
function showAdminError(message) {
    showAdminNotification(message, 'error');
}

function showAdminSuccess(message) {
    showAdminNotification(message, 'success');
}

function showAdminNotification(message, type) {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notif => notif.remove());
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Add to body
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Auto hide after 5 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 5000);
}

function shakeAdminLoginCard() {
    const loginCard = document.querySelector('.admin-login-card');
    loginCard.classList.add('shake');
    setTimeout(() => {
        loginCard.classList.remove('shake');
    }, 600);
}

function shakeAdminOtpInputs() {
    const otpContainer = document.querySelector('#adminTwoFactorModal .otp-input-container');
    otpContainer.classList.add('shake');
    setTimeout(() => {
        otpContainer.classList.remove('shake');
    }, 600);
}

function redirectToAdminDashboard() {
    sessionStorage.setItem("isAdminLoggedIn", "true");
    console.log("Login Status (set):", sessionStorage.getItem("isAdminLoggedIn"));

    showAdminNotification('Redirecting to Admin Dashboard...', 'success');
    setTimeout(() => {
        window.location.href = 'admin-dashboard.html';
    }, 2000);
}

// Initialize animations
function initAnimations() {
    // Animate admin login card entrance
    const adminLoginCard = document.querySelector('.admin-login-card');
    setTimeout(() => {
        adminLoginCard.style.animation = 'slideInUp 0.8s ease forwards';
    }, 300);
    
    // Animate security features
    const featureItems = document.querySelectorAll('.feature-item');
    featureItems.forEach((item, index) => {
        setTimeout(() => {
            item.style.animation = `slideInLeft 0.6s ease ${0.5 + (index * 0.2)}s forwards`;
        }, 500);
    });
}

// Keyboard navigation
document.addEventListener('keydown', function(e) {
    // ESC to close modals
    if (e.key === 'Escape') {
        const twoFactorModal = document.getElementById('adminTwoFactorModal');
        const successModal = document.getElementById('adminSuccessModal');
        
        if (twoFactorModal.style.display === 'flex') {
            closeAdminTwoFactorModal();
        } else if (successModal.style.display === 'flex') {
            successModal.style.display = 'none';
        }
    }
    
    // Enter to submit forms
    if (e.key === 'Enter') {
        const activeElement = document.activeElement;
        
        // In admin 2FA modal
        if (document.getElementById('adminTwoFactorModal').style.display === 'flex') {
            if (activeElement.classList.contains('otp-input')) {
                e.preventDefault();
                verifyAdminTwoFactor();
            }
            return;
        }
        
        // In admin success modal
        if (document.getElementById('adminSuccessModal').style.display === 'flex') {
            e.preventDefault();
            redirectToAdminDashboard();
            return;
        }
        
        // In admin login form
        if (activeElement.tagName === 'INPUT' && activeElement.form) {
            e.preventDefault();
            handleAdminLogin();
        }
    }
});

// Auto-logout timer for security (demo)
let autoLogoutTimer;

function startAutoLogoutTimer() {
    // 30 minutes for admin sessions
    const timeoutDuration = 30 * 60 * 1000;
    
    autoLogoutTimer = setTimeout(() => {
        showAdminNotification('Session expired for security. Please login again.', 'error');
        setTimeout(() => {
            window.location.reload();
        }, 3000);
    }, timeoutDuration);
}

// Reset auto-logout timer on activity
function resetAutoLogoutTimer() {
    clearTimeout(autoLogoutTimer);
    startAutoLogoutTimer();
}

// Activity listeners for auto-logout
document.addEventListener('mousedown', resetAutoLogoutTimer);
document.addEventListener('keydown', resetAutoLogoutTimer);
document.addEventListener('scroll', resetAutoLogoutTimer);

// Security features hover effects
document.addEventListener('DOMContentLoaded', function() {
    const featureItems = document.querySelectorAll('.feature-item');
    
    featureItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
});
