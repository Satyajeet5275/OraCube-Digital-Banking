// Customer Login JavaScript with Backend Integration
class CustomerLoginForm {
    constructor() {
        this.customerData = {};
        this.customerEmail = '';
        this.otpTimer = null;
        this.otpTimeLeft = 300; // 5 minutes
        
        this.init();
    }

    // Cookie helper functions
    setCookie(name, value, days = 1) {
        const expires = new Date();
        expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
        const cookieString = `${name}=${encodeURIComponent(JSON.stringify(value))};expires=${expires.toUTCString()};path=/`;
        document.cookie = cookieString;
        console.log(`🍪 ========== SETTING COOKIE ==========`);
        console.log(`🍪 Cookie name: "${name}"`);
        console.log(`🍪 Cookie value:`, value);
        console.log(`🍪 Cookie string: "${cookieString}"`);
        console.log(`🍪 Document.cookie after setting: "${document.cookie}"`);
        console.log(`🍪 ===================================`);
    }

    getCookie(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for(let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) == 0) {
                try {
                    return JSON.parse(decodeURIComponent(c.substring(nameEQ.length, c.length)));
                } catch (e) {
                    return null;
                }
            }
        }
        return null;
    }

    deleteCookie(name) {
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
        console.log(`🗑️ Cookie deleted: ${name}`);
    }

    init() {
        this.initBackgroundAnimation();
        this.hideLoader();
        this.bindEvents();
    }

    // Initialize VANTA.NET background
    initBackgroundAnimation() {
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
                color: 0x10b981,  // Green for customer
                backgroundColor: 0x0a0e1a,
                points: 10.00,
                maxDistance: 22.00,
                spacing: 16.00
            });
        } catch (error) {
            console.log('VANTA animation not available, using fallback');
            this.createFallbackAnimation();
        }
    }

    createFallbackAnimation() {
        const bgElement = document.getElementById('bg-animation');
        if (bgElement) {
            bgElement.innerHTML = `
                <div class="floating-shapes">
                    <div class="shape shape-1"></div>
                    <div class="shape shape-2"></div>
                    <div class="shape shape-3"></div>
                    <div class="shape shape-4"></div>
                </div>
            `;
        }
    }

    hideLoader() {
        setTimeout(() => {
            const loader = document.getElementById('loader');
            if (loader) {
                loader.classList.add('hidden');
                setTimeout(() => loader.remove(), 500);
            }
        }, 1500);
    }

    bindEvents() {
        const self = this;

        // Check if dbService is available
        if (typeof dbService === 'undefined') {
            console.error('❌ dbService not found! Database.js may not have loaded properly.');
            this.showNotification('System error: Database service not available. Please refresh the page.', 'error');
            return;
        }

        console.log('✅ dbService is available for customer login:', dbService);

        // Customer login form submission
        const customerLoginForm = document.getElementById('customerLoginForm');
        if (customerLoginForm) {
            customerLoginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                console.log('🔐 Customer login form submitted');
                self.handleCustomerLogin();
            });
        }

        // Password visibility toggle
        const togglePassword = document.querySelector('.toggle-password');
        const passwordField = document.getElementById('customerPassword');
        if (togglePassword && passwordField) {
            togglePassword.addEventListener('click', function() {
                const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
                passwordField.setAttribute('type', type);
                
                const icon = this.querySelector('i');
                icon.classList.toggle('fa-eye');
                icon.classList.toggle('fa-eye-slash');
            });
        }

        // OTP input handling
        document.addEventListener('input', (e) => {
            if (e.target.matches('.otp-input')) {
                self.handleOtpInput(e);
            }
        });

        // OTP verification button
        const verifyOtpBtn = document.getElementById('customerVerifyOtp');
        if (verifyOtpBtn) {
            verifyOtpBtn.addEventListener('click', () => {
                self.verifyCustomerOTP();
            });
        }

        // OTP resend button
        const resendOtpBtn = document.getElementById('customerResendOtp');
        if (resendOtpBtn) {
            resendOtpBtn.addEventListener('click', () => {
                self.resendCustomerOTP();
            });
        }

        // Modal close on backdrop click
        document.addEventListener('click', (e) => {
            if (e.target.matches('.modal-overlay')) {
                self.closeModal();
            }
        });
    }

    async handleCustomerLogin() {
        console.log('🚀 Starting customer login process...');

        // Get form data
        const custId = document.getElementById('customerId').value.trim();
        const custPass = document.getElementById('customerPassword').value.trim();

        console.log('📝 Login attempt for Customer ID:', custId);

        // Validate input
        const loginData = { custId, custPass };
        const validation = dbService.validateCustomerLoginData(loginData);
        
        if (!validation.isValid) {
            this.showNotification('Please fix the following errors: ' + validation.errors.join(', '), 'error');
            return;
        }

        // Store customer data for later use
        this.customerData = { custId: parseInt(custId), custPass };

        try {
            this.showNotification('Authenticating customer...', 'info');

            // Step 1: Customer Login Authentication
            const loginResponse = await dbService.customerLogin(parseInt(custId), custPass);

            console.log('🔐 ========== CUSTOMER LOGIN RESPONSE ==========');
            console.log('Success:', loginResponse.success);
            console.log('Status Code:', loginResponse.status);
            console.log('Response Data:', loginResponse.data);
            console.log('Error (if any):', loginResponse.error);
            console.log('🔐 ===============================================');

            if (loginResponse.success || loginResponse.status === 200) {
                const loginData = loginResponse.data;
                
                // Check login status
                if (loginData.login === true) {
                    console.log('✅ Customer login successful!');
                    
                    // Customer ID will be stored in cookies during data fetch phase
                    console.log('✅ Customer login successful! Customer ID:', this.customerData.custId);
                    
                    this.showNotification('Login successful! Getting your email for verification...', 'success');
                    
                    // Step 2: Get customer email
                    await this.getCustomerEmailAndSendOTP();
                    
                } else {
                    console.log('❌ Customer login failed');
                    const errorMessage = loginData.details || 'Invalid credentials. Please try again.';
                    this.showNotification(errorMessage, 'error');
                }
            } else {
                console.log('❌ Login request failed');
                const errorMessage = dbService.getErrorMessage(loginResponse.error);
                this.showNotification(errorMessage, 'error');
            }

        } catch (error) {
            console.error('❌ Error during customer login:', error);
            this.showNotification('Login failed. Please try again.', 'error');
        }
    }

    async getCustomerEmailAndSendOTP() {
        try {
            console.log('📧 Getting customer email...');
            this.showNotification('Getting your registered email...', 'info');

            // Get customer email
            const emailResponse = await dbService.getCustomerEmail(this.customerData.custId);

            console.log('📧 ========== GET EMAIL RESPONSE ==========');
            console.log('Success:', emailResponse.success);
            console.log('Status Code:', emailResponse.status);
            console.log('Response Data:', emailResponse.data);
            console.log('Error (if any):', emailResponse.error);
            console.log('📧 ========================================');

            if (emailResponse.success || emailResponse.status === 200) {
                // Extract email from response - handle multiple response formats
                let extractedEmail = emailResponse.data || emailResponse;
                
                console.log('📧 Raw email data received:', extractedEmail);
                
                // Handle different response formats
                if (typeof extractedEmail === 'object') {
                    if (extractedEmail.message) {
                        extractedEmail = extractedEmail.message;
                    } else if (extractedEmail.email) {
                        extractedEmail = extractedEmail.email;
                    } else if (extractedEmail.emailId) {
                        extractedEmail = extractedEmail.emailId;
                    } else if (extractedEmail.data) {
                        extractedEmail = extractedEmail.data;
                    }
                }
                
                // Ensure we have a string
                this.customerEmail = String(extractedEmail).trim();
                
                console.log('📧 Customer email extracted:', this.customerEmail);
                console.log('📧 Email validation check:', this.customerEmail.includes('@'));
                
                if (this.customerEmail && this.customerEmail.includes('@')) {
                    console.log('✅ Valid email found, sending OTP...');
                    // Send OTP to customer email
                    await this.sendOTPToCustomer();
                } else {
                    console.error('❌ Invalid email format:', this.customerEmail);
                    this.showNotification('Invalid email address retrieved. Please contact support.', 'error');
                }
            } else {
                const errorMessage = dbService.getErrorMessage(emailResponse.error);
                this.showNotification('Failed to get customer email: ' + errorMessage, 'error');
            }

        } catch (error) {
            console.error('❌ Error getting customer email:', error);
            this.showNotification('Failed to get customer email. Please try again.', 'error');
        }
    }

    async sendOTPToCustomer() {
        try {
            console.log('📧 Sending OTP to customer email:', this.customerEmail);
            console.log('📧 Email type check:', typeof this.customerEmail);
            console.log('📧 Email content:', JSON.stringify(this.customerEmail));
            
            this.showNotification('Sending OTP to your email...', 'info');

            // Ensure email is a string
            const emailToSend = String(this.customerEmail).trim();
            console.log('📧 Final email for OTP:', emailToSend);

            // Send OTP using existing method
            const otpResponse = await dbService.sendOTP(emailToSend);

            console.log('📧 ========== SEND OTP RESPONSE ==========');
            console.log('Success:', otpResponse.success);
            console.log('Status Code:', otpResponse.status);
            console.log('Response Data:', otpResponse.data);
            console.log('Error (if any):', otpResponse.error);
            console.log('📧 ======================================');

            // Check if OTP was sent successfully (either success=true OR status=200)
            if (otpResponse.success || otpResponse.status === 200) {
                console.log('✅ OTP sent successfully to customer');
                const successMessage = otpResponse.data?.message || 'OTP sent to your email successfully!';
                this.showNotification(successMessage, 'success');
                
                console.log('📱 About to show OTP modal...');
                // Show OTP modal
                this.showOTPModal();
            } else {
                console.log('❌ Failed to send OTP');
                const errorMessage = dbService.getErrorMessage(otpResponse.error);
                this.showNotification('Failed to send OTP: ' + errorMessage, 'error');
            }

        } catch (error) {
            console.error('❌ Error sending OTP to customer:', error);
            this.showNotification('Failed to send OTP. Please try again.', 'error');
        }
    }

    showOTPModal() {
        console.log('📱 === SHOW OTP MODAL DEBUG ===');
        console.log('📱 Function called: showOTPModal');
        
        const modal = document.getElementById('customerOtpModal');
        console.log('📱 Modal element found:', modal);
        console.log('📱 Modal display style:', modal ? modal.style.display : 'Element not found');
        
        if (!modal) {
            console.error('❌ OTP modal element not found in DOM');
            console.log('📱 Available modal elements:', document.querySelectorAll('[id*="modal"]'));
            return;
        }
        
        console.log('📱 Setting modal display to flex...');
        modal.style.display = 'flex';
        modal.style.opacity = '1';
        
        setTimeout(() => {
            console.log('📱 Adding show class to modal...');
            modal.classList.add('show');
            console.log('📱 Modal classes after adding show:', modal.classList.toString());
        }, 10);
        
        // Focus first OTP input
        setTimeout(() => {
            const firstInput = modal.querySelector('.otp-input');
            console.log('📱 First OTP input found:', firstInput);
            if (firstInput) {
                firstInput.focus();
                console.log('📱 Focused on first OTP input');
            }
        }, 300);

        // Start OTP timer
        console.log('📱 Starting OTP timer...');
        this.startOtpTimer();
        
        console.log('✅ OTP modal setup complete');
        console.log('📱 Final modal state - display:', modal.style.display, 'classes:', modal.classList.toString());
    }

    async verifyCustomerOTP() {
        const otpInputs = document.querySelectorAll('.otp-input');
        const enteredOTP = Array.from(otpInputs).map(input => input.value).join('');
        
        if (enteredOTP.length !== 6) {
            this.showNotification('Please enter complete 6-digit OTP', 'error');
            return;
        }

        console.log('🔐 Verifying customer OTP:', enteredOTP, 'for email:', this.customerEmail);
        this.showNotification('Verifying OTP...', 'info');

        try {
            // Verify OTP with backend
            const verifyResponse = await dbService.verifyOTP(this.customerEmail, enteredOTP);
            
            console.log('🔐 ========== CUSTOMER OTP VERIFICATION ==========');
            console.log('Success:', verifyResponse.success);
            console.log('Status Code:', verifyResponse.status);
            console.log('Response Data:', verifyResponse.data);
            console.log('Error (if any):', verifyResponse.error);
            console.log('🔐 ===============================================');
            
            // Check if verification was successful
            let isVerified = false;
            
            if (verifyResponse.success || verifyResponse.status === 200) {
                if (verifyResponse.data && typeof verifyResponse.data.status === 'boolean') {
                    isVerified = verifyResponse.data.status;
                } else if (verifyResponse.data && verifyResponse.data.message) {
                    const message = verifyResponse.data.message.toLowerCase();
                    isVerified = message.includes('verified') || message.includes('success');
                } else {
                    isVerified = verifyResponse.status === 200;
                }
            }
            
            console.log('🔐 Final customer verification result:', isVerified);
            
            if (isVerified) {
                console.log('✅ Customer OTP verified successfully!');
                this.hideOTPModal();
                this.showNotification('OTP verified successfully! Fetching your account details...', 'success');
                
                // Fetch customer and account details before redirecting
                await this.fetchCustomerDataAndRedirect();
                
            } else {
                console.log('❌ Customer OTP verification failed');
                const errorMessage = (verifyResponse.data && verifyResponse.data.message) || 'Invalid OTP. Please try again.';
                this.showNotification(errorMessage, 'error');
                
                // Clear OTP inputs
                otpInputs.forEach(input => input.value = '');
                otpInputs[0].focus();
            }
        } catch (error) {
            console.error('❌ Error verifying customer OTP:', error);
            this.showNotification('Failed to verify OTP. Please try again.', 'error');
            
            // Clear OTP inputs
            otpInputs.forEach(input => input.value = '');
            otpInputs[0].focus();
        }
    }

    async fetchCustomerDataAndRedirect() {
        try {
            console.log('📊 ========== FETCHING CUSTOMER DATA ==========');
            console.log('👤 Customer ID:', this.customerData.custId);
            console.log('👤 Customer ID Type:', typeof this.customerData.custId);
            
            this.showNotification('Loading your account information...', 'info');
            
            // Clear any existing cookies first
            console.log('🧹 Clearing existing cookies...');
            this.deleteCookie('customerData');
            this.deleteCookie('accountData');
            this.deleteCookie('customerID');
            
            // Check cookies are cleared
            console.log('🔍 After clearing - All cookies:', document.cookie);
            
            console.log('🔄 Making API calls to fetch customer and account data...');
            
            // Fetch customer details and account details in parallel
            const [customerResponse, accountResponse] = await Promise.all([
                dbService.getCustomerDetails(this.customerData.custId),
                dbService.getCustomerAccount(this.customerData.custId)
            ]);
            
            console.log('👤 ========== CUSTOMER DATA RESPONSE ==========');
            console.log('Customer Success:', customerResponse.success);
            console.log('Customer Status:', customerResponse.status);
            console.log('Customer Data:', customerResponse.data);
            console.log('Customer Data Type:', typeof customerResponse.data);
            console.log('Customer Error:', customerResponse.error);
            console.log('👤 ==========================================');
            
            console.log('🏦 ========== ACCOUNT DATA RESPONSE ==========');
            console.log('Account Success:', accountResponse.success);
            console.log('Account Status:', accountResponse.status);
            console.log('Account Data:', accountResponse.data);
            console.log('Account Data Type:', typeof accountResponse.data);
            console.log('Account Error:', accountResponse.error);
            console.log('🏦 ==========================================');
            
            // Store customer ID in sessionStorage
            console.log('💾 Setting customer ID in sessionStorage...');
            sessionStorage.setItem('customerID', this.customerData.custId);
            
            // Verify customer ID sessionStorage immediately
            const verifyCustomerID = sessionStorage.getItem('customerID');
            console.log('✅ Customer ID sessionStorage verification:', verifyCustomerID);
            
            // Store customer data in sessionStorage
            if (customerResponse.success && customerResponse.data) {
                console.log('💾 Setting customer data in sessionStorage...');
                console.log('💾 Customer data to store:', JSON.stringify(customerResponse.data, null, 2));
                sessionStorage.setItem('customerData', JSON.stringify(customerResponse.data));
                
                // Verify customer data sessionStorage immediately
                const verifyCustomerData = sessionStorage.getItem('customerData');
                console.log('✅ Customer data sessionStorage verification:', verifyCustomerData);
            } else {
                console.error('❌ Failed to fetch customer data - Response:', customerResponse);
                this.showNotification('Warning: Could not load customer details', 'warning');
            }
            
            // Store account data in sessionStorage
            if (accountResponse.success && accountResponse.data) {
                console.log('💾 Setting account data in sessionStorage...');
                console.log('💾 Account data to store:', JSON.stringify(accountResponse.data, null, 2));
                sessionStorage.setItem('accountData', JSON.stringify(accountResponse.data));
                
                // Verify account data sessionStorage immediately
                const verifyAccountData = sessionStorage.getItem('accountData');
                console.log('✅ Account data sessionStorage verification:', verifyAccountData);
            } else {
                console.error('❌ Failed to fetch account data - Response:', accountResponse);
                this.showNotification('Warning: Could not load account details', 'warning');
            }
            
            // Final verification of all sessionStorage
            console.log('🔍 ========== FINAL SESSION STORAGE VERIFICATION ==========');
            console.log('All sessionStorage items:');
            for (let i = 0; i < sessionStorage.length; i++) {
                const key = sessionStorage.key(i);
                const value = sessionStorage.getItem(key);
                console.log(`💾 ${key}:`, value);
            }
            console.log('🔍 ======================================================');
            
            // Redirect to dashboard
            this.showNotification('Account data loaded! Redirecting to dashboard...', 'success');
            setTimeout(() => {
                console.log('🏠 Redirecting to customer dashboard...');
                window.location.href = 'customer-dashboard.html';
            }, 2000);
            
        } catch (error) {
            console.error('❌ Error fetching customer data:', error);
            console.error('❌ Error stack:', error.stack);
            this.showNotification('Error loading account data. Redirecting anyway...', 'warning');
            
            // Still redirect even if data fetch fails
            setTimeout(() => {
                console.log('🏠 Redirecting to customer dashboard (with error)...');
                window.location.href = 'customer-dashboard.html';
            }, 2000);
        }
    }

    async resendCustomerOTP() {
        try {
            console.log('🔄 Resending OTP to customer email:', this.customerEmail);
            this.showNotification('Resending OTP...', 'info');
            
            const otpResponse = await dbService.sendOTP(this.customerEmail);
            
            console.log('🔄 Resend Customer OTP Response:', otpResponse);
            
            if (otpResponse.success || otpResponse.status === 200) {
                const successMessage = otpResponse.data?.message || 'OTP resent successfully!';
                this.showNotification(successMessage, 'success');
                this.startOtpTimer();
                document.getElementById('customerResendOtp').disabled = true;
                
                // Clear existing OTP inputs
                document.querySelectorAll('.otp-input').forEach(input => input.value = '');
            } else {
                const errorMessage = dbService.getErrorMessage(otpResponse.error);
                this.showNotification(errorMessage, 'error');
            }
        } catch (error) {
            console.error('❌ Error resending customer OTP:', error);
            this.showNotification('Failed to resend OTP. Please try again.', 'error');
        }
    }

    startOtpTimer() {
        this.otpTimeLeft = 300; // 5 minutes
        this.updateOtpTimer();
        
        if (this.otpTimerInterval) {
            clearInterval(this.otpTimerInterval);
        }
        
        this.otpTimerInterval = setInterval(() => {
            this.otpTimeLeft--;
            this.updateOtpTimer();
            
            if (this.otpTimeLeft <= 0) {
                clearInterval(this.otpTimerInterval);
                document.getElementById('customerResendOtp').disabled = false;
                document.getElementById('customerOtpTimer').textContent = '00:00';
                this.showNotification('OTP has expired. Please request a new one.', 'error');
            }
        }, 1000);
    }

    updateOtpTimer() {
        const minutes = Math.floor(this.otpTimeLeft / 60);
        const seconds = this.otpTimeLeft % 60;
        const display = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        const timerElement = document.getElementById('customerOtpTimer');
        if (timerElement) {
            timerElement.textContent = display;
        }
        
        const resendBtn = document.getElementById('customerResendOtp');
        if (resendBtn) {
            resendBtn.disabled = this.otpTimeLeft > 0;
        }
    }

    hideOTPModal() {
        const modal = document.getElementById('customerOtpModal');
        if (modal) {
            modal.classList.remove('show');
            setTimeout(() => {
                modal.style.display = 'none';
            }, 300);
        }
        
        if (this.otpTimerInterval) {
            clearInterval(this.otpTimerInterval);
        }
    }

    closeModal() {
        const modals = document.querySelectorAll('.modal-overlay');
        modals.forEach(modal => {
            modal.classList.remove('show');
            setTimeout(() => {
                modal.style.display = 'none';
            }, 300);
        });
        
        if (this.otpTimerInterval) {
            clearInterval(this.otpTimerInterval);
        }
    }

    handleOtpInput(e) {
        const input = e.target;
        const index = parseInt(input.dataset.index);
        const value = input.value;

        // Only allow digits
        if (!/^\d$/.test(value)) {
            input.value = '';
            return;
        }

        // Move to next input
        if (value && index < 5) {
            const nextInput = document.querySelector(`.otp-input[data-index="${index + 1}"]`);
            if (nextInput) nextInput.focus();
        }

        // Auto-verify when all digits are entered
        const allInputs = document.querySelectorAll('.otp-input');
        const allFilled = Array.from(allInputs).every(inp => inp.value.length === 1);
        
        if (allFilled) {
            const self = this;
            setTimeout(() => self.verifyCustomerOTP(), 500);
        }
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        // Add to document
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => notification.classList.add('show'), 10);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }
}

// Initialize customer login when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('📱 DOM loaded, checking dependencies for customer login...');
    
    if (typeof dbService === 'undefined') {
        console.error('❌ dbService not found! Waiting for Database.js to load...');
        
        setTimeout(() => {
            if (typeof dbService === 'undefined') {
                console.error('❌ Database service failed to load after delay');
                alert('System Error: Database service not available. Please refresh the page.');
                return;
            }
            initializeCustomerLogin();
        }, 1000);
    } else {
        initializeCustomerLogin();
    }
    
    function initializeCustomerLogin() {
        console.log('🚀 Initializing customer login form...');
        console.log('✅ Database service available for customer:', dbService);
        
        try {
            if (typeof CustomerLoginForm !== 'undefined') {
                customerLoginForm = new CustomerLoginForm();
                console.log('✅ Customer login form initialized successfully');
            } else {
                console.error('❌ CustomerLoginForm class not found');
            }
        } catch (error) {
            console.error('❌ Error initializing customer login form:', error);
        }
    }
});

// Global reference for debugging
let customerLoginForm = null;

// Handle browser back button
window.addEventListener('popstate', () => {
    window.location.href = 'home.html';
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.target.matches('input')) {
        e.preventDefault();
        const submitButton = document.querySelector('.customer-login-btn');
        if (submitButton && !e.target.matches('.otp-input')) {
            submitButton.click();
        }
    }
    
    if (e.key === 'Escape') {
        const modal = document.querySelector('.modal-overlay.show');
        if (modal && customerLoginForm) {
            customerLoginForm.closeModal();
        }
    }
    
    // OTP input navigation
    if (e.target.matches('.otp-input')) {
        if (e.key === 'Backspace' && !e.target.value) {
            const index = parseInt(e.target.dataset.index);
            if (index > 0) {
                const prevInput = document.querySelector(`.otp-input[data-index="${index - 1}"]`);
                if (prevInput) {
                    prevInput.focus();
                    prevInput.select();
                }
            }
        }
        
        if (e.key === 'ArrowLeft') {
            const index = parseInt(e.target.dataset.index);
            if (index > 0) {
                const prevInput = document.querySelector(`.otp-input[data-index="${index - 1}"]`);
                if (prevInput) prevInput.focus();
            }
        }
        
        if (e.key === 'ArrowRight') {
            const index = parseInt(e.target.dataset.index);
            if (index < 5) {
                const nextInput = document.querySelector(`.otp-input[data-index="${index + 1}"]`);
                if (nextInput) nextInput.focus();
            }
        }
    }
});

// Add cookie inspector to login page as well
window.showCookieInspector = function() {
    console.log('🔍 ========== COOKIE INSPECTOR (LOGIN PAGE) ==========');
    
    const rawCookies = document.cookie;
    console.log('📋 Raw cookie string:', `"${rawCookies}"`);
    console.log('📋 Cookie string length:', rawCookies.length);
    
    if (rawCookies.length === 0) {
        console.log('❌ NO COOKIES FOUND!');
        return;
    }
    
    // Parse and display each cookie
    const cookieArray = rawCookies.split(';');
    console.log('🍪 Total cookies found:', cookieArray.length);
    
    cookieArray.forEach((cookie, index) => {
        const trimmed = cookie.trim();
        const [name, ...valueParts] = trimmed.split('=');
        const value = valueParts.join('=');
        
        console.log(`🍪 Cookie ${index + 1}: "${name}" = "${value}"`);
    });
    
    console.log('🔍 ================================================');
};
