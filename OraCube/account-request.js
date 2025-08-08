// Account Request Page JavaScript
class AccountRequestForm {
    constructor() {
        this.currentStep = 1;
        this.totalSteps = 5;
        this.formData = {};
        this.otpTimer = null;
        this.otpTimeLeft = 300; // 5 minutes
        this.isSubmitting = false; // Prevent double submission
        this.otpSent = false; // Track if OTP was sent
        
        this.init();
    }

    init() {
        this.hideLoader();
        this.initBackgroundAnimation();
        this.bindEvents();
        this.updateProgress();
        this.setDateConstraints();
    }

    // Initialize VANTA.NET background with pink theme
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
                color: 0xff1b8e, // Pink color
                backgroundColor: 0x0a0e1a,
                points: 10.00,
                maxDistance: 25.00,
                spacing: 18.00,
                showDots: true
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

    setDateConstraints() {
        // Set date of birth constraint - user must be at least 18 years old
        const dobInput = document.getElementById('dob');
        if (dobInput) {
            const today = new Date();
            const eighteenYearsAgo = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
            
            // Format date as YYYY-MM-DD for HTML date input
            const maxDate = eighteenYearsAgo.toISOString().split('T')[0];
            
            dobInput.setAttribute('max', maxDate);
            
            // Also set a reasonable minimum date (e.g., 100 years ago)
            const hundredYearsAgo = new Date(today.getFullYear() - 100, today.getMonth(), today.getDate());
            const minDate = hundredYearsAgo.toISOString().split('T')[0];
            dobInput.setAttribute('min', minDate);
            
            console.log('✅ Date constraints set:');
            console.log('   Min date (100 years ago):', minDate);
            console.log('   Max date (18 years ago):', maxDate);
            
            // Add validation event listener
            dobInput.addEventListener('input', (e) => {
                this.validateAge(e.target.value);
            });
        }
    }

    validateAge(selectedDate) {
        if (!selectedDate) return;
        
        const birthDate = new Date(selectedDate);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        
        // Calculate exact age
        const exactAge = monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate()) 
            ? age - 1 
            : age;
        
        const dobInput = document.getElementById('dob');
        const errorDiv = document.getElementById('dobError') || this.createAgeErrorDiv();
        
        if (exactAge < 18) {
            dobInput.classList.add('error');
            errorDiv.textContent = `You must be at least 18 years old to open an account. Your current age: ${exactAge} years.`;
            errorDiv.style.display = 'block';
            return false;
        } else {
            dobInput.classList.remove('error');
            errorDiv.style.display = 'none';
            return true;
        }
    }

    createAgeErrorDiv() {
        const dobInput = document.getElementById('dob');
        const errorDiv = document.createElement('div');
        errorDiv.id = 'dobError';
        errorDiv.className = 'error-message';
        errorDiv.style.color = '#e74c3c';
        errorDiv.style.fontSize = '0.9rem';
        errorDiv.style.marginTop = '0.5rem';
        errorDiv.style.display = 'none';
        
        dobInput.parentNode.appendChild(errorDiv);
        return errorDiv;
    }

    bindEvents() {
        const self = this; // Store reference to this
        
        // Navigation buttons
        document.addEventListener('click', (e) => {
            console.log('Click event:', e.target);
            
            // Check if clicked element or its parent has the button class
            const target = e.target.closest('.btn-next, .btn-prev, .btn-submit, #verifyOtp, #resendOtp');
            
            if (target) {
                console.log('Button clicked:', target.className);
                e.preventDefault();
                
                if (target.matches('.btn-next')) {
                    self.nextStep();
                } else if (target.matches('.btn-prev')) {
                    self.prevStep();
                } else if (target.matches('.btn-submit')) {
                    console.log('Submit button detected!');
                    self.submitForm();
                } else if (target.matches('#verifyOtp')) {
                    self.verifyOTP();
                } else if (target.matches('#resendOtp')) {
                    self.resendOTP();
                }
            }
        });

        // Account type selection
        document.addEventListener('click', (e) => {
            if (e.target.closest('.account-option')) {
                self.selectAccountType(e.target.closest('.account-option'));
            }
        });

        // Form validation on input change
        document.addEventListener('input', (e) => {
            if (e.target.matches('input, select, textarea')) {
                self.validateField(e.target);
            }
        });

        // OTP input handling
        document.addEventListener('input', (e) => {
            if (e.target.matches('.otp-input')) {
                self.handleOtpInput(e);
            }
        });

        // Same address checkbox
        window.copyAddress = () => {
            const checkbox = document.getElementById('sameAddress');
            const residential = document.getElementById('residentialAddress').value;
            const permanent = document.getElementById('permanentAddress');
            
            if (checkbox.checked) {
                permanent.value = residential;
            } else {
                permanent.value = '';
            }
        };

        // Modal close on backdrop click
        document.addEventListener('click', (e) => {
            if (e.target.matches('.modal')) {
                self.closeModal();
            }
        });

        // Direct submit button handler as backup
        setTimeout(() => {
            const submitBtn = document.querySelector('.btn-submit');
            if (submitBtn) {
                console.log('Adding direct event listener to submit button');
                submitBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    console.log('Direct submit handler called');
                    self.submitForm();
                });
            } else {
                console.log('Submit button not found for direct listener');
            }
        }, 1000);
    }

    selectAccountType(option) {
        // Remove selection from all options
        document.querySelectorAll('.account-option').forEach(opt => {
            opt.classList.remove('selected');
        });

        // Add selection to clicked option
        option.classList.add('selected');

        // Set the hidden input value
        const accountType = option.dataset.type;
        document.getElementById('accountType').value = accountType;

        // Remove any previous error state
        const formGroup = option.closest('.form-group');
        formGroup.classList.remove('error');
        const errorEl = formGroup.querySelector('.error-message');
        if (errorEl) errorEl.remove();
    }

    validateField(field) {
        const formGroup = field.closest('.form-group');
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        // Remove previous error states
        formGroup.classList.remove('error', 'success');
        const errorEl = formGroup.querySelector('.error-message');
        if (errorEl) errorEl.remove();

        // Required field validation
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'This field is required';
        }

        // Specific field validations
        if (value && field.type === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
        }

        if (value && field.name === 'mobileNo') {
            const mobileRegex = /^[0-9]{10}$/;
            if (!mobileRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid 10-digit mobile number';
            }
        }

        if (value && field.name === 'aadharNo') {
            const aadharRegex = /^[0-9]{12}$/;
            if (!aadharRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid 12-digit Aadhar number';
            }
        }

        if (value && field.name === 'panNo') {
            const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
            if (!panRegex.test(value.toUpperCase())) {
                isValid = false;
                errorMessage = 'Please enter a valid PAN number (e.g., ABCDE1234F)';
            }
        }

        // Show validation result
        if (!isValid) {
            formGroup.classList.add('error');
            const errorEl = document.createElement('div');
            errorEl.className = 'error-message';
            errorEl.textContent = errorMessage;
            formGroup.appendChild(errorEl);
        } else if (value) {
            formGroup.classList.add('success');
        }

        return isValid;
    }

    validateStep(step) {
        const stepElement = document.getElementById(`step${step}`);
        const requiredFields = stepElement.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        // Special validation for step 1 - check age requirement
        if (step === 1) {
            const dobInput = document.getElementById('dob');
            if (dobInput && dobInput.value) {
                if (!this.validateAge(dobInput.value)) {
                    isValid = false;
                }
            }
        }

        return isValid;
    }

    collectStepData(step) {
        const stepElement = document.getElementById(`step${step}`);
        const formElements = stepElement.querySelectorAll('input, select, textarea');
        
        formElements.forEach(element => {
            this.formData[element.name] = element.value;
        });
    }

    nextStep() {
        if (!this.validateStep(this.currentStep)) {
            this.showNotification('Please fill in all required fields correctly', 'error');
            return;
        }

        this.collectStepData(this.currentStep);

        if (this.currentStep < this.totalSteps) {
            this.currentStep++;
            this.showStep(this.currentStep);
            this.updateProgress();
        }
    }

    prevStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
            this.showStep(this.currentStep);
            this.updateProgress();
        }
    }

    showStep(step) {
        // Hide all steps
        document.querySelectorAll('.form-step').forEach(stepEl => {
            stepEl.classList.remove('active');
        });

        // Show current step
        const currentStepEl = document.getElementById(`step${step}`);
        if (currentStepEl) {
            currentStepEl.classList.add('active');
        }

        // Update step indicators
        document.querySelectorAll('.progress-step').forEach((stepEl, index) => {
            stepEl.classList.remove('active', 'completed');
            if (index + 1 === step) {
                stepEl.classList.add('active');
            } else if (index + 1 < step) {
                stepEl.classList.add('completed');
            }
        });

        // Update navigation buttons
        this.updateNavigationButtons(step);

        // Show review data if on step 5
        if (step === 5) {
            this.showReviewData();
        }
    }

    updateNavigationButtons(step) {
        const prevBtn = document.querySelector('.btn-prev');
        const nextBtn = document.querySelector('.btn-next');
        const submitBtn = document.querySelector('.btn-submit');

        if (step === 1) {
            if (prevBtn) prevBtn.style.visibility = 'hidden';
        } else {
            if (prevBtn) prevBtn.style.visibility = 'visible';
        }

        if (step === 5) {
            if (nextBtn) nextBtn.style.display = 'none';
            if (submitBtn) submitBtn.style.display = 'flex';
        } else {
            if (nextBtn) nextBtn.style.display = 'flex';
            if (submitBtn) submitBtn.style.display = 'none';
        }
    }

    showReviewData() {
        const sections = {
            reviewPersonal: ['title', 'firstName', 'middleName', 'lastName', 'dob'],
            reviewContact: ['mobileNo', 'email', 'residentialAddress', 'permanentAddress'],
            reviewIdentity: ['aadharNo', 'panNo'],
            reviewFinancial: ['occupation', 'annualIncome', 'accountType']
        };

        Object.keys(sections).forEach(sectionId => {
            const container = document.getElementById(sectionId);
            if (container) {
                container.innerHTML = '';
                
                sections[sectionId].forEach(fieldName => {
                    const value = this.formData[fieldName] || document.querySelector(`[name="${fieldName}"]`)?.value || '';
                    if (value) {
                        const reviewItem = document.createElement('div');
                        reviewItem.className = 'review-item';
                        
                        const label = this.getFieldLabel(fieldName);
                        const displayValue = this.formatDisplayValue(fieldName, value);
                        
                        reviewItem.innerHTML = `
                            <span class="review-label">${label}</span>
                            <span class="review-value">${displayValue}</span>
                        `;
                        
                        container.appendChild(reviewItem);
                    }
                });
            }
        });
    }

    getFieldLabel(fieldName) {
        const labels = {
            title: 'Title',
            firstName: 'First Name',
            middleName: 'Middle Name',
            lastName: 'Last Name',
            dob: 'Date of Birth',
            mobileNo: 'Mobile Number',
            email: 'Email Address',
            residentialAddress: 'Residential Address',
            permanentAddress: 'Permanent Address',
            aadharNo: 'Aadhar Number',
            panNo: 'PAN Number',
            occupation: 'Occupation',
            annualIncome: 'Annual Income',
            accountType: 'Account Type'
        };
        return labels[fieldName] || fieldName;
    }

    formatDisplayValue(fieldName, value) {
        if (fieldName === 'accountType') {
            return value.charAt(0).toUpperCase() + value.slice(1) + ' Account';
        }
        if (fieldName === 'annualIncome') {
            const incomeRanges = {
                '100000': 'Below ₹1,00,000',
                '300000': '₹1,00,000 - ₹3,00,000',
                '500000': '₹3,00,000 - ₹5,00,000',
                '750000': '₹5,00,000 - ₹7,50,000',
                '1000000': '₹7,50,000 - ₹10,00,000',
                '1500000': 'Above ₹10,00,000'
            };
            return incomeRanges[value] || value;
        }
        if (fieldName === 'aadharNo') {
            return '**** **** ' + value.slice(-4);
        }
        if (fieldName === 'panNo') {
            return value.slice(0, 3) + '***' + value.slice(-2);
        }
        return value;
    }


    showOTPModal() {
        console.log('📱 ========== SHOW OTP MODAL DEBUG ==========');
        console.log('📱 showOTPModal called');
        const modal = document.getElementById('otpModal');
        console.log('📱 Modal element:', modal);
        
        if (!modal) {
            console.error('❌ OTP modal not found');
            return;
        }
        
        console.log('📱 Setting modal styles...');
        modal.style.display = 'flex';
        modal.style.opacity = '1';
        modal.style.zIndex = '10000';
        modal.style.position = 'fixed';
        modal.style.top = '0';
        modal.style.left = '0';
        modal.style.width = '100%';
        modal.style.height = '100%';
        modal.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        
        setTimeout(() => {
            modal.classList.add('show');
            console.log('📱 Added show class to modal');
        }, 10);
        
        // Focus first OTP input
        setTimeout(() => {
            const firstInput = modal.querySelector('.otp-input');
            if (firstInput) {
                firstInput.focus();
                console.log('📱 Focused on first OTP input');
            } else {
                console.log('❌ First OTP input not found');
            }
        }, 300);

        // Start OTP timer
        this.startOtpTimer();
        
        console.log('📱 OTP modal setup complete');
        console.log('📱 =======================================');
    }

    // Remove generateOTP method - now handled by backend
    // Method moved to backend OTP service

    startOtpTimer() {
        this.otpTimeLeft = 300; // 5 minutes
        this.updateOtpTimer();
        
        // Clear any existing timer
        if (this.otpTimerInterval) {
            clearInterval(this.otpTimerInterval);
        }
        
        this.otpTimerInterval = setInterval(() => {
            this.otpTimeLeft--;
            this.updateOtpTimer();
            
            if (this.otpTimeLeft <= 0) {
                clearInterval(this.otpTimerInterval);
                document.getElementById('resendOtp').disabled = false;
                document.getElementById('otpTimer').textContent = '00:00';
                this.showNotification('OTP has expired. Please request a new one.', 'error');
            }
        }, 1000);
    }

    updateOtpTimer() {
        const minutes = Math.floor(this.otpTimeLeft / 60);
        const seconds = this.otpTimeLeft % 60;
        const display = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        const timerElement = document.getElementById('otpTimer');
        if (timerElement) {
            timerElement.textContent = display;
        }
        
        // Enable/disable resend button based on timer
        const resendBtn = document.getElementById('resendOtp');
        if (resendBtn) {
            resendBtn.disabled = this.otpTimeLeft > 0;
        }
    }

    async verifyOTP() {
        const otpInputs = document.querySelectorAll('.otp-input');
        const enteredOTP = Array.from(otpInputs).map(input => input.value).join('');
        
        if (enteredOTP.length !== 6) {
            this.showNotification('Please enter complete 6-digit OTP', 'error');
            return;
        }

        // Show loading notification
        this.showNotification('Verifying OTP...', 'info');
        console.log('🔐 Verifying OTP:', enteredOTP, 'for email:', this.formData.email);

        try {
            // Verify OTP with backend
            const verifyResponse = await dbService.verifyOTP(this.formData.email, enteredOTP);
            
            console.log('🔐 ========== OTP VERIFICATION RESPONSE ==========');
            console.log('Success:', verifyResponse.success);
            console.log('Status Code:', verifyResponse.status);
            console.log('Response Data:', verifyResponse.data);
            console.log('Error (if any):', verifyResponse.error);
            console.log('🔐 ===============================================');
            
            // Check if verification was successful
            // Handle both JSON response {status: true/false} and plain text responses
            let isVerified = false;
            
            if (verifyResponse.success || verifyResponse.status === 200) {
                // Check if response has status field
                if (verifyResponse.data && typeof verifyResponse.data.status === 'boolean') {
                    isVerified = verifyResponse.data.status;
                } else if (verifyResponse.data && verifyResponse.data.message) {
                    // Check if message indicates success
                    const message = verifyResponse.data.message.toLowerCase();
                    isVerified = message.includes('verified') || message.includes('success');
                } else {
                    // If no clear status, assume success if HTTP 200
                    isVerified = verifyResponse.status === 200;
                }
            }
            
            console.log('🔐 Final verification result:', isVerified);
            
            if (isVerified) {
                console.log('✅ OTP verified successfully!');
                // OTP verified successfully
                this.hideOTPModal();
                this.showNotification('OTP verified successfully! Creating account request...', 'success');
                
                // Create account request after OTP verification
                await this.createAccountRequest();
                
            } else {
                console.log('❌ OTP verification failed');
                // OTP verification failed
                const errorMessage = (verifyResponse.data && verifyResponse.data.message) || 'Invalid OTP. Please try again.';
                this.showNotification(errorMessage, 'error');
                
                // Clear OTP inputs
                otpInputs.forEach(input => input.value = '');
                otpInputs[0].focus();
            }
        } catch (error) {
            console.error('❌ Error verifying OTP:', error);
            this.showNotification('Failed to verify OTP. Please try again.', 'error');
            
            // Clear OTP inputs
            otpInputs.forEach(input => input.value = '');
            otpInputs[0].focus();
        }
    }

    // Method removed - redirect now handled directly in verifyOTP

    async resendOTP() {
        try {
            this.showNotification('Resending OTP...', 'info');
            
            // Resend OTP with backend
            const otpResponse = await dbService.sendOTP(this.formData.email);
            
            console.log('🔄 Resend OTP Response:', otpResponse);
            
            // Check if OTP was sent successfully (either success=true OR status=200)
            if (otpResponse.success || otpResponse.status === 200) {
                const successMessage = otpResponse.data?.message || 'OTP resent successfully!';
                this.showNotification(successMessage, 'success');
                this.startOtpTimer();
                document.getElementById('resendOtp').disabled = true;
                
                // Clear existing OTP inputs
                document.querySelectorAll('.otp-input').forEach(input => input.value = '');
            } else {
                const errorMessage = dbService.getErrorMessage(otpResponse.error);
                this.showNotification(errorMessage, 'error');
            }
        } catch (error) {
            console.error('Error resending OTP:', error);
            this.showNotification('Failed to resend OTP. Please try again.', 'error');
        }
    }

    hideOTPModal() {
        const modal = document.getElementById('otpModal');
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
        
        if (this.otpTimerInterval) {
            clearInterval(this.otpTimerInterval);
        }
    }

    async finalSubmitForm() {
        try {
            // Show loading
            this.showNotification('Submitting your request...', 'info');
            
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Generate reference number
            const referenceNumber = 'ACC-' + new Date().getFullYear() + '-' + Math.floor(Math.random() * 1000000);
            document.getElementById('referenceNumber').textContent = referenceNumber;
            
            // Show success modal
            this.showSuccessModal();
            
            // Auto redirect to home after 5 seconds
            setTimeout(() => {
                window.location.href = 'home.html';
            }, 5000);
            
        } catch (error) {
            console.error('Error submitting form:', error);
            this.showNotification('Failed to submit request. Please try again.', 'error');
        }
    }

    showSuccessModal() {
        const modal = document.getElementById('successModal');
        modal.style.display = 'flex';
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);
    }

    closeModal() {
        // Close any open modal
        const modals = document.querySelectorAll('.modal');
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

    async submitForm() {
        console.log('📝 ========== SUBMIT FORM CALLED ==========');
        console.log('📝 submitForm called - Step 1: Starting form submission');
        
        // Prevent double submission
        if (this.isSubmitting) {
            console.log('🚫 Submission already in progress, ignoring duplicate call');
            return;
        }
        
        this.isSubmitting = true;
        console.log('🔒 Setting isSubmitting = true');
        
        // Check if dbService is available
        if (typeof dbService === 'undefined') {
            console.error('❌ dbService is not defined! Database.js may not have loaded properly.');
            this.showNotification('System error: Database service not available. Please refresh the page.', 'error');
            return;
        }
        
        console.log('✅ Step 2: dbService is available:', dbService);
        
        // Validate terms acceptance
        const termsAccepted = document.getElementById('termsAccepted');
        if (!termsAccepted.checked) {
            console.log('❌ Step 3: Terms not accepted');
            this.showNotification('Please accept the Terms & Conditions to proceed.', 'error');
            return;
        }

        console.log('✅ Step 3: Terms accepted');

        // Collect form data
        this.collectFormData();
        console.log('📝 Step 4: Collected form data:', this.formData);
        
        // Validate form data
        const validation = dbService.validateAccountRequestData(this.formData);
        console.log('🔍 Step 5: Validation result:', validation);
        
        if (!validation.isValid) {
            console.log('❌ Step 5: Validation failed:', validation.errors);
            this.showNotification('Please fix the following errors: ' + validation.errors.join(', '), 'error');
            return;
        }

        console.log('✅ Step 5: Validation passed');

        // Send OTP to user's email
        console.log('📧 Step 6: Starting OTP flow...');
        this.showNotification('Sending OTP to your email...', 'info');
        
        try {
            console.log('📧 Step 6a: Calling sendOTP for email:', this.formData.email);
            const otpResponse = await dbService.sendOTP(this.formData.email);
            
            console.log('📧 Step 6b: Complete OTP Response:', otpResponse);
            
            // Check if OTP was sent successfully (either success=true OR status=200)
            if (otpResponse.success || otpResponse.status === 200) {
                console.log('✅ Step 7: OTP sent successfully, opening modal...');
                this.otpSent = true; // Set OTP sent flag
                console.log('✅ Setting otpSent = true');
                
                // Show success message based on response
                const successMessage = otpResponse.data?.message || 'OTP sent to your email successfully!';
                this.showNotification(successMessage, 'success');
                
                // Always open OTP modal after successful send
                console.log('📧 Step 8: About to call showOTPModal()...');
                this.showOTPModal();
                console.log('📧 Step 8: showOTPModal() called');
            } else {
                console.log('❌ Step 7: OTP send failed:', otpResponse);
                const errorMessage = dbService.getErrorMessage(otpResponse.error);
                this.showNotification(errorMessage, 'error');
            }
        } catch (error) {
            console.error('❌ Step 6: Error sending OTP:', error);
            this.showNotification('Failed to send OTP. Please try again.', 'error');
        }
        
        console.log('📝 ========== SUBMIT FORM COMPLETED ==========');
        this.isSubmitting = false; // Reset submission flag
        console.log('🔓 Setting isSubmitting = false');
    }

    collectFormData() {
        const formInputs = document.querySelectorAll('input, select, textarea');
        formInputs.forEach(input => {
            if (input.name && input.value) {
                this.formData[input.name] = input.value;
            }
        });
        
        // Get selected account type
        const selectedAccount = document.querySelector('.account-option.selected');
        if (selectedAccount) {
            this.formData.accountType = selectedAccount.dataset.type;
        }
        
        console.log('Form data collected:', this.formData);
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

    // OTP input handling
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
            setTimeout(() => self.verifyOTP(), 500);
        }
    }

    async createAccountRequest() {
        console.log('🏦 ========== CREATE ACCOUNT REQUEST CALLED ==========');
        console.log('🏦 OTP Sent Flag:', this.otpSent);
        
        if (!this.otpSent) {
            console.error('❌ SECURITY VIOLATION: createAccountRequest called without OTP verification!');
            this.showNotification('Security Error: Please verify OTP first.', 'error');
            return;
        }
        
        try {
            console.log('🏦 Starting account creation process...');
            this.showNotification('Creating your account request...', 'info');
            
            // Re-collect form data to ensure we have the latest values
            this.collectFormData();
            console.log('🏦 Form data before sending:', JSON.stringify(this.formData, null, 2));
            
            // Validate that we have required fields
            const requiredFields = ['title', 'firstName', 'lastName', 'email', 'mobileNo', 'aadharNo', 'panNo', 'dob', 'accountType'];
            const missingFields = requiredFields.filter(field => !this.formData[field]);
            
            if (missingFields.length > 0) {
                console.error('❌ Missing required fields:', missingFields);
                this.showNotification('Missing required fields: ' + missingFields.join(', '), 'error');
                return;
            }
            
            // Create account request with backend
            console.log('🏦 Calling dbService.createAccountRequest...');
            const accountResponse = await dbService.createAccountRequest(this.formData);
            
            console.log('🏦 ========== ACCOUNT CREATION RESPONSE ==========');
            console.log('Success:', accountResponse.success);
            console.log('Status Code:', accountResponse.status);
            console.log('Response Data:', accountResponse.data);
            console.log('Error (if any):', accountResponse.error);
            console.log('🏦 ===============================================');
            
            // Check success condition more thoroughly
            if (accountResponse.success === true || accountResponse.status === 200 || accountResponse.status === 201) {
                console.log('✅ Account request created successfully!');
                this.showNotification('Account request created successfully! Redirecting to home page...', 'success');
                
                // Show success details if available
                if (accountResponse.data) {
                    console.log('📄 Account Creation Details:', accountResponse.data);
                }
                
                // Hide OTP modal if still visible
                this.hideOTPModal();
                
                // Redirect to home page after 3 seconds
                console.log('🏠 Setting up redirect to home page in 3 seconds...');
                setTimeout(() => {
                    console.log('🏠 Redirecting to home page now...');
                    window.location.href = 'home.html';
                }, 3000);
                
            } else {
                console.error('❌ Account creation failed:');
                console.error('- Success flag:', accountResponse.success);
                console.error('- Status code:', accountResponse.status);
                console.error('- Error details:', accountResponse.error);
                
                const errorMessage = dbService.getErrorMessage(accountResponse.error) || 'Failed to create account request. Please try again.';
                this.showNotification(errorMessage, 'error');
            }
            
        } catch (error) {
            console.error('❌ Exception in createAccountRequest:', error);
            console.error('Error stack:', error.stack);
            this.showNotification('Failed to create account request. Please try again.', 'error');
        }
    }
}

// Initialize form when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('📱 DOM loaded, checking dependencies...');
    
    // Check if dbService is available
    if (typeof dbService === 'undefined') {
        console.error('❌ dbService not found! Waiting for Database.js to load...');
        
        // Wait a bit for Database.js to load and try again
        setTimeout(() => {
            if (typeof dbService === 'undefined') {
                console.error('❌ Database service failed to load after delay');
                alert('System Error: Database service not available. Please refresh the page.');
                return;
            }
            initializeForm();
        }, 1000);
    } else {
        initializeForm();
    }
    
    function initializeForm() {
        console.log('🚀 Initializing account request form...');
        console.log('✅ Database service available:', dbService);
        
        try {
            if (typeof AccountRequestForm !== 'undefined') {
                accountForm = new AccountRequestForm();
                console.log('✅ Account request form initialized successfully');
            } else {
                console.error('❌ AccountRequestForm class not found');
            }
        } catch (error) {
            console.error('❌ Error initializing account request form:', error);
        }
    }
});

// Add error handling for neural network
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
});

// Global reference for debugging
let accountForm = null;

// Handle browser back button
window.addEventListener('popstate', () => {
    // Optional: Handle browser navigation
    window.location.href = 'home.html';
});

// Handle page unload (warn about unsaved data)
window.addEventListener('beforeunload', (e) => {
    if (accountForm && accountForm.currentStep > 1) {
        e.preventDefault();
        e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
        return 'You have unsaved changes. Are you sure you want to leave?';
    }
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.target.matches('input:not(.otp-input), select, textarea')) {
        e.preventDefault();
        const nextButton = document.querySelector('.btn-next:not([disabled])');
        if (nextButton) {
            nextButton.click();
        }
    }
    
    if (e.key === 'Escape') {
        const modal = document.querySelector('.modal.show');
        if (modal && accountForm) {
            accountForm.closeModal();
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
