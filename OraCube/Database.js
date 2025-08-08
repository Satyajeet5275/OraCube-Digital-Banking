// Database.js - Backend API Integration for OraCube Banking
// This file handles all API calls to the backend server

class DatabaseService {
    constructor() {
        this.baseURL = 'http://localhost:8080';
        this.endpoints = {
            accountRequest: '/accountRequest/create',
            sendOTP: '/otp/send',
            verifyOTP: '/otp/verify',
            customerDetails: '/customer/get',
            customerAccount: '/account/getCustomer',
            updateCustomerField: '/customer/updateField',
            updateAccountField: '/account/updateField',
            getCustomerEmail: '/customer/getEmail'
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
                },
                mode: 'cors',
                credentials: 'same-origin'
            };

            // Add body for POST/PUT/PATCH requests
            if (data && (method.toUpperCase() === 'POST' || method.toUpperCase() === 'PUT' || method.toUpperCase() === 'PATCH')) {
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
            } else if (error.message.includes('ERR_CONNECTION_REFUSED') || error.message.includes('Failed to fetch')) {
                console.error('🌐 Connection refused - server is not running or unreachable');
                console.error('🔍 Full error details:', error);
                return {
                    success: false,
                    error: 'Server is offline or unreachable. Please check if the backend server is running on localhost:8080',
                    status: 503,
                    isConnectionError: true
                };
            } else if (error.message.includes('CORS') || error.message.includes('cors')) {
                console.error('🚫 CORS error detected');
                return {
                    success: false,
                    error: 'CORS error - backend server needs to enable CORS for browser requests',
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
     * Get Customer Details by Customer ID
     * @param {number} customerId - Customer ID
     * @returns {Promise} - API response with customer details
     */
    async getCustomerDetails(customerId) {
        console.log('👤 Getting customer details for ID:', customerId);
        
        try {
            const response = await this.makeRequest(`${this.endpoints.customerDetails}/${customerId}`, 'GET');
            console.log('👤 ========== CUSTOMER DETAILS RESPONSE ==========');
            console.log('Success:', response.success);
            console.log('Status Code:', response.status);
            console.log('Customer Data:', response.data);
            console.log('Error (if any):', response.error);
            console.log('👤 ===============================================');
            
            if (response.success || response.status === 200) {
                return {
                    success: true,
                    data: response.data,
                    status: response.status || 200
                };
            } else {
                return {
                    success: false,
                    error: response.error || 'Failed to fetch customer details',
                    status: response.status || 500
                };
            }
        } catch (error) {
            console.error('❌ Error fetching customer details:', error);
            return {
                success: false,
                error: error.message || 'Network error fetching customer details',
                status: 500
            };
        }
    }

    /**
     * Get Customer Account Details by Customer ID
     * @param {number} customerId - Customer ID
     * @returns {Promise} - API response with account details
     */
    async getCustomerAccount(customerId) {
        console.log('🏦 Getting customer account details for ID:', customerId);
        
        try {
            const response = await this.makeRequest(`${this.endpoints.customerAccount}/${customerId}`, 'GET');
            console.log('🏦 ========== CUSTOMER ACCOUNT RESPONSE ==========');
            console.log('Success:', response.success);
            console.log('Status Code:', response.status);
            console.log('Account Data:', response.data);
            console.log('Error (if any):', response.error);
            console.log('🏦 ===============================================');
            
            if (response.success || response.status === 200) {
                return {
                    success: true,
                    data: response.data,
                    status: response.status || 200
                };
            } else {
                return {
                    success: false,
                    error: response.error || 'Failed to fetch account details',
                    status: response.status || 500
                };
            }
        } catch (error) {
            console.error('❌ Error fetching account details:', error);
            return {
                success: false,
                error: error.message || 'Network error fetching account details',
                status: 500
            };
        }
    }

    /**
     * Update Customer Field
     * @param {number} customerNo - Customer ID
     * @param {string} fieldName - Exact field name as in database
     * @param {string} value - New value for the field
     * @returns {Promise} - API response with updated customer data
     */
    async updateCustomerField(customerNo, fieldName, value) {
        console.log('🔄 Updating customer field:', fieldName, 'for customer:', customerNo, 'with value:', value);
        
        const requestData = {
            fieldName: fieldName,
            value: value
        };

        console.log('📤 Update Customer Request Data:', requestData);
        
        try {
            const response = await this.makeRequest(`${this.endpoints.updateCustomerField}/${customerNo}`, 'PATCH', requestData);
            console.log('🔄 ========== UPDATE CUSTOMER FIELD RESPONSE ==========');
            console.log('Success:', response.success);
            console.log('Status Code:', response.status);
            console.log('Updated Customer Data:', response.data);
            console.log('Error (if any):', response.error);
            console.log('🔄 ================================================');
            
            if (response.success || response.status === 200) {
                return {
                    success: true,
                    data: response.data,
                    status: response.status || 200
                };
            } else {
                return {
                    success: false,
                    error: response.error || 'Failed to update customer field',
                    status: response.status || 500
                };
            }
        } catch (error) {
            console.error('❌ Error updating customer field:', error);
            return {
                success: false,
                error: error.message || 'Network error updating customer field',
                status: 500
            };
        }
    }

    /**
     * Update Account Field
     * @param {number} accountNo - Account Number
     * @param {string} fieldName - Exact field name as in database
     * @param {string} value - New value for the field
     * @returns {Promise} - API response with updated account data
     */
    async updateAccountField(accountNo, fieldName, value) {
        console.log('🔄 Updating account field:', fieldName, 'for account:', accountNo, 'with value:', value);
        
        const requestData = {
            fieldName: fieldName,
            value: value
        };

        console.log('📤 Update Account Request Data:', requestData);
        
        try {
            const response = await this.makeRequest(`${this.endpoints.updateAccountField}/${accountNo}`, 'PATCH', requestData);
            console.log('🔄 ========== UPDATE ACCOUNT FIELD RESPONSE ==========');
            console.log('Success:', response.success);
            console.log('Status Code:', response.status);
            console.log('Updated Account Data:', response.data);
            console.log('Error (if any):', response.error);
            console.log('🔄 ===============================================');
            
            if (response.success || response.status === 200) {
                return {
                    success: true,
                    data: response.data,
                    status: response.status || 200
                };
            } else {
                return {
                    success: false,
                    error: response.error || 'Failed to update account field',
                    status: response.status || 500
                };
            }
        } catch (error) {
            console.error('❌ Error updating account field:', error);
            return {
                success: false,
                error: error.message || 'Network error updating account field',
                status: 500
            };
        }
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
     * Test server connectivity
     * @returns {Promise} - Connection test result
     */
    async testConnection() {
        console.log('🔍 Testing server connectivity...');
        try {
            const response = await fetch(`${this.baseURL}/health`, {
                method: 'GET',
                mode: 'cors',
                credentials: 'same-origin'
            });
            
            console.log('✅ Server connectivity test passed');
            return {
                success: true,
                status: response.status,
                message: 'Server is reachable'
            };
        } catch (error) {
            console.error('❌ Server connectivity test failed:', error);
            return {
                success: false,
                error: error.message,
                message: 'Server is not reachable - please check if backend is running on localhost:8080'
            };
        }
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
const dbService = new DatabaseService();
console.log('✅ Database Service initialized:', dbService);

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DatabaseService;
}
