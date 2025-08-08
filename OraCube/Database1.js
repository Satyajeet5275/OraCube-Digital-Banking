// Database.js - Backend API Integration for OraCube Banking
// This file handles all API calls to the backend server

class DatabaseService1 {
    constructor() {
        this.baseURL = 'http://localhost:8080';
        this.endpoints = {
            accountRequest: '/accountRequest/create',
            sendOTP: '/otp/send',
            verifyOTP: '/otp/verify',
            sendMail:'/mail/send'
        };
    }

    /**
     * Make HTTP request to backend API
     * @param {string} endpoint - API endpoint
     * @param {string} method - HTTP method (GET, POST, PUT, DELETE)
     * @param {Object} data - Request body data
     * @returns {Promise} - API response
     */
    async makeRequest(endpoint, method = 'GET', data = null) {
        try {
            const url = `${this.baseURL}${endpoint}`;
            
            const config = {
                method: method.toUpperCase(),
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            };

            // Add body for POST/PUT requests
            if (data && (method.toUpperCase() === 'POST' || method.toUpperCase() === 'PUT')) {
                config.body = JSON.stringify(data);
                console.log('📤 Request body JSON:', config.body);
            }

            console.log(`🚀 Making ${method} request to: ${url}`);
            console.log('📤 Request config:', config);

            // Add timeout to the fetch request
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 20000); // 20 second timeout
            
            config.signal = controller.signal;

            const response = await fetch(url, config);
            clearTimeout(timeoutId); // Clear timeout on successful response
            
            console.log('📨 Response status:', response.status);
            console.log('📨 Response headers:', Object.fromEntries(response.headers.entries()));

            // Check if response is ok
            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ API Error:', errorText);
                throw new Error(`HTTP ${response.status}: ${errorText}`);
            }

            // Get response text first
            const responseText = await response.text();
            console.log('📄 Raw response text:', responseText);

            let result;
            try {
                // Try to parse as JSON
                result = JSON.parse(responseText);
                console.log('✅ Parsed JSON response:', result);
            } catch (jsonError) {
                console.log('📝 Response is not JSON, treating as plain text');
                // If not JSON, create a simple object with the text
                result = {
                    message: responseText.trim(),
                    success: true
                };
            }
            
            return {
                success: true,
                data: result,
                status: response.status
            };

        } catch (error) {
            console.error('❌ API Request failed:', error);
            
            // Handle different types of errors
            if (error.name === 'AbortError') {
                console.error('🕐 Request timed out after 20 seconds');
                return {
                    success: false,
                    error: 'Request timeout - server may be unavailable',
                    status: 408
                };
            } else if (error.message.includes('Failed to fetch')) {
                console.error('🌐 Network error - server may be down');
                return {
                    success: false,
                    error: 'Network error - please check if backend server is running on localhost:8080',
                    status: 503
                };
            } else {
                console.error('🚨 Unexpected error:', error.message);
                return {
                    success: false,
                    error: error.message,
                    status: error.status || 500
                };
            }
        }
    }

    /**
     * Send OTP to user's email
     * @param {string} emailID - User's email address
     * @returns {Promise} - API response
     */
    async sendOTP(emailID) {
        console.log('📧 Sending OTP to email:', emailID);
        
        const requestData = {
            emailID: emailID
        };

        const response = await this.makeRequest(this.endpoints.sendOTP, 'POST', requestData);
        console.log('📧 Send OTP Response:', response);
        return response;
    }

    /**
     * Verify OTP entered by user
     * @param {string} emailID - User's email address
     * @param {string} otp - 6-digit OTP entered by user
     * @returns {Promise} - API response with verification status
     */
    async verifyOTP(emailID, otp) {
        console.log('🔐 Verifying OTP for email:', emailID, 'OTP:', otp);
        
        const requestData = {
            emailID: emailID,
            otp: otp
        };

        const response = await this.makeRequest(this.endpoints.verifyOTP, 'POST', requestData);
        console.log('🔐 Verify OTP Response:', response);
        return response;
    }

    /**
     * Send a custom email to a user
     * @param {string} emailID - Recipient's email address
     * @param {string} customerId - (Optional) Customer ID (only if approved)
     * @param {string} password - (Optional) Plain password (only if approved)
     * @param {boolean} approved - Whether the request is approved
     * @param {string} rejectionReason - Reason for rejection (only if rejected)
     * @param {string} txnPassword - (Optional) Transactional password (only if approved)
     * @returns {Promise} - API response
     */
    async sendMail(emailID, customerId = '', password = '', approved = true, rejectionReason = '',txnPassword = '') {
        let subject = 'Account Request Update - Oracle Bank';
        let msg = '';

        if (approved) {
            msg = `Dear Customer,\n\nCongratulations! Your account request has been approved.\n\nHere are your login credentials:\nCustomer ID: ${customerId}\nLogin Password: ${password}\nTransaction Password: ${txnPassword}\n\nPlease keep this information secure.\n\nThank you,\nOracle Bank.`;
        } else {
            msg = `Dear Customer,\n\nWe regret to inform you that your account request has been rejected.\nReason: ${rejectionReason}\n\nFor further queries, feel free to contact us.\n\nRegards,\nOracle Bank.`;
        }

        const requestBody = {
            emailID: emailID,
            subject: subject,
            msg: msg
        };

        console.log('📨 Sending mail with body:', requestBody);

        const response = await this.makeRequest(this.endpoints.sendMail, 'POST', requestBody);
        console.log('📨 Send Mail Response:', response);
        return response;
    }

    /**
     * Create account request after OTP verification
     * @param {Object} formData - Complete form data from account request form
     * @returns {Promise} - API response
     */
    async createAccountRequest(formData) {
        console.log('🏦 Creating account request with data:', formData);
        
        // Trim occupation field to maximum 10 characters for database constraint
        const occupation = formData.occupation ? String(formData.occupation).substring(0, 10) : '';
        console.log('🏦 Original occupation:', formData.occupation, 'Trimmed to:', occupation);
        
        // Transform form data to match backend expected format - EXACT JSON FORMAT
        const requestData = {
            "title": String(formData.title || '').trim(),
            "firstName": String(formData.firstName || '').trim(),
            "middleName": String(formData.middleName || '').trim(),
            "lastName": String(formData.lastName || '').trim(),
            "mobileNo": String(formData.mobileNo || '').trim(),
            "email": String(formData.email || '').trim(),
            "aadharNo": String(formData.aadharNo || '').trim(),
            "panNo": String(formData.panNo || '').trim(),
            "dob": String(formData.dob || '').trim(),
            "residentialAddress": String(formData.residentialAddress || '').trim(),
            "permanentAddress": String(formData.permanentAddress || '').trim(),
            "occupation": occupation,
            "annualIncome": parseFloat(formData.annualIncome) || 0.0,
            "accountType": String(formData.accountType || 'SAVINGS').toUpperCase()
        };

        console.log('🏦 ========== REQUEST DETAILS ==========');
        console.log('🌐 URL:', `${this.baseURL}${this.endpoints.accountRequest}`);
        console.log('📤 Method: POST');
        console.log('📄 Content-Type: application/json');
        console.log('📦 JSON Payload:', JSON.stringify(requestData, null, 2));
        console.log('🏦 =====================================');
        
        try {
            // Add timeout to prevent infinite pending
            const timeoutPromise = new Promise((_, reject) => {
                setTimeout(() => reject(new Error('Request timeout after 30 seconds')), 30000);
            });
            
            const requestPromise = this.makeRequest(this.endpoints.accountRequest, 'POST', requestData);
            
            console.log('🚀 Sending POST request to:', `${this.baseURL}${this.endpoints.accountRequest}`);
            
            const response = await Promise.race([requestPromise, timeoutPromise]);
            
            console.log('🏦 ========== RESPONSE RECEIVED ==========');
            console.log('📨 Raw Response:', response);
            console.log('🏦 ===================================');
            
            // Handle different response formats
            if (response.success === true || response.status === 200 || response.status === 201) {
                console.log('✅ Account request API call successful');
                return {
                    success: true,
                    data: response.data || response,
                    status: response.status || 200
                };
            } else {
                console.log('❌ Account request API call failed');
                return {
                    success: false,
                    error: response.error || response.message || 'Account request failed',
                    status: response.status || 500
                };
            }
        } catch (error) {
            console.error('❌ Exception in createAccountRequest:', error);
            return {
                success: false,
                error: error.message || 'Network error creating account request',
                status: 500
            };
        }
    }

    /**
     * Customer Login Authentication
     * @param {number} custId - Customer ID
     * @param {string} custPass - Customer Password
     * @returns {Promise} - API response
     */
    async customerLogin(custId, custPass) {
        console.log('🔐 Customer Login Request - ID:', custId);
        
        const requestData = {
            custId: parseInt(custId),
            custPass: custPass
        };

        console.log('📤 Customer Login Request Data:', requestData);
        const response = await this.makeRequest('/customer/login', 'POST', requestData);
        console.log('🔐 Customer Login Response:', response);
        return response;
    }

    /**
     * Get Customer Email by Customer ID
     * @param {number} customerId - Customer ID
     * @returns {Promise} - API response with email
     */
    async getCustomerEmail(customerId) {
        console.log('📧 Getting customer email for ID:', customerId);
        
        const response = await this.makeRequest(`/customer/getEmail/${customerId}`, 'GET');
        console.log('📧 Customer Email Response:', response);
        return response;
    }

    /**
     * Validate form data before sending to backend
     * @param {Object} formData - Form data to validate
     * @returns {Object} - Validation result
     */
    validateAccountRequestData(formData) {
        const errors = [];

        // Required fields validation
        const requiredFields = [
            'title', 'firstName', 'lastName', 'mobileNo', 'email',
            'aadharNo', 'panNo', 'dob', 'residentialAddress',
            'permanentAddress', 'occupation', 'annualIncome', 'accountType'
        ];

        requiredFields.forEach(field => {
            if (!formData[field] || formData[field].toString().trim() === '') {
                errors.push(`${field} is required`);
            }
        });

        // Email validation
        if (formData.email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                errors.push('Invalid email format');
            }
        }

        // Mobile number validation (10 digits)
        if (formData.mobileNo) {
            const mobileRegex = /^[0-9]{10}$/;
            if (!mobileRegex.test(formData.mobileNo)) {
                errors.push('Mobile number must be 10 digits');
            }
        }

        // Aadhar validation (12 digits)
        if (formData.aadharNo) {
            const aadharRegex = /^[0-9]{12}$/;
            if (!aadharRegex.test(formData.aadharNo)) {
                errors.push('Aadhar number must be 12 digits');
            }
        }

        // PAN validation (format: ABCDE1234F)
        if (formData.panNo) {
            const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
            if (!panRegex.test(formData.panNo.toUpperCase())) {
                errors.push('Invalid PAN format');
            }
        }

        // Annual income validation (should be a number)
        if (formData.annualIncome) {
            const income = parseFloat(formData.annualIncome);
            if (isNaN(income) || income < 0) {
                errors.push('Annual income must be a valid positive number');
            }
        }

        // Account type validation
        if (formData.accountType) {
            const validAccountTypes = ['savings', 'current', 'premium'];
            if (!validAccountTypes.includes(formData.accountType.toLowerCase())) {
                errors.push('Invalid account type');
            }
        }

        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }

    /**
     * Validate customer login data before sending to backend
     * @param {Object} loginData - Login data to validate
     * @returns {Object} - Validation result
     */
    validateCustomerLoginData(loginData) {
        const errors = [];

        // Customer ID validation
        if (!loginData.custId || loginData.custId.toString().trim() === '') {
            errors.push('Customer ID is required');
        } else {
            const custId = parseInt(loginData.custId);
            if (isNaN(custId) || custId <= 0) {
                errors.push('Customer ID must be a valid number');
            }
        }

        // Password validation
        if (!loginData.custPass || loginData.custPass.trim() === '') {
            errors.push('Password is required');
        } else if (loginData.custPass.length < 6) {
            errors.push('Password must be at least 6 characters long');
        }

        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }

    /**
     * Handle network errors and show user-friendly messages
     * @param {Object} error - Error object from API call
     * @returns {string} - User-friendly error message
     */
    getErrorMessage(error) {
        if (!error) return 'An unknown error occurred';

        // Network connectivity issues
        if (error.includes('Failed to fetch') || error.includes('NetworkError')) {
            return 'Unable to connect to server. Please check your internet connection.';
        }

        // Server errors
        if (error.includes('HTTP 500')) {
            return 'Server error. Please try again later.';
        }

        if (error.includes('HTTP 404')) {
            return 'Service not found. Please contact support.';
        }

        if (error.includes('HTTP 400')) {
            return 'Invalid request. Please check your input data.';
        }

        if (error.includes('HTTP 401')) {
            return 'Authentication failed. Please try again.';
        }

        if (error.includes('HTTP 403')) {
            return 'Access denied. You do not have permission to perform this action.';
        }

        // Return original error if no specific case matches
        return error;
    }
}

// Create global instance
console.log('🚀 Initializing Database Service...');
const dbService = new DatabaseService1();
console.log('✅ Database Service initialized:', dbService);

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DatabaseService1;
}
