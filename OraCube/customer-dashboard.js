// Customer Dashboard JavaScript

// Initialize Database Service (using global dbService from Database.js)
let customerProfile = {};
let accountInfo = {};
let currentCustomerID = null;

// Cookie helper functions
function setCookie(name, value, days = 1) {
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${encodeURIComponent(JSON.stringify(value))};expires=${expires.toUTCString()};path=/`;
    console.log(`🍪 Cookie set: ${name}`);
}

function getCookie(name) {
    console.log(`🔍 getCookie called for: "${name}"`);
    console.log(`🔍 Full cookie string: "${document.cookie}"`);

    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    console.log(`🔍 Cookie array:`, ca);

    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        console.log(`🔍 Checking cookie ${i}: "${c}"`);

        if (c.indexOf(nameEQ) == 0) {
            const cookieValue = c.substring(nameEQ.length, c.length);
            console.log(`🔍 Found cookie "${name}", raw value: "${cookieValue}"`);

            try {
                const decodedValue = decodeURIComponent(cookieValue);
                console.log(`🔍 Decoded value: "${decodedValue}"`);

                const parsedValue = JSON.parse(decodedValue);
                console.log(`✅ Successfully parsed cookie "${name}":`, parsedValue);
                return parsedValue;
            } catch (e) {
                console.error(`❌ Error parsing cookie "${name}":`, e);
                console.error(`❌ Cookie value was: "${cookieValue}"`);
                return null;
            }
        }
    }
    console.log(`⚠️ Cookie "${name}" not found`);
    return null;
}

function deleteCookie(name) {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
    console.log(`🗑️ Cookie deleted: ${name}`);
}

// Initialize database service when DOM loads
document.addEventListener('DOMContentLoaded', function () {
    console.log('🚀 ========== DASHBOARD INITIALIZATION ==========');

    // IMMEDIATELY PRINT SESSION STORAGE ON PAGE RELOAD
    console.log('💾 ========== SESSION STORAGE ON PAGE RELOAD ==========');
    console.log('🔄 Page reloaded at:', new Date().toLocaleString());
    console.log('💾 SessionStorage length:', sessionStorage.length);

    if (sessionStorage.length === 0) {
        console.log('❌ NO SESSION STORAGE FOUND ON RELOAD!');
        console.log('❌ This means either:');
        console.log('   1. User came directly to dashboard without login');
        console.log('   2. SessionStorage was cleared');
        console.log('   3. Browser doesn\'t support sessionStorage');
    } else {
        console.log('✅ Found', sessionStorage.length, 'items in sessionStorage');
        console.log('💾 All sessionStorage items on reload:');

        // Show every single item in sessionStorage
        for (let i = 0; i < sessionStorage.length; i++) {
            const key = sessionStorage.key(i);
            const value = sessionStorage.getItem(key);
            console.log(`💾 Item ${i + 1}: "${key}"`);
            console.log(`   Raw Value: "${value}"`);
            console.log(`   Value Length: ${value ? value.length : 0} characters`);

            // Try to parse if it looks like JSON
            if (value && (value.startsWith('{') || value.startsWith('['))) {
                try {
                    const parsed = JSON.parse(value);
                    console.log(`   ✅ Parsed Object:`, parsed);
                    console.log(`   📊 Object Type:`, typeof parsed);
                    if (typeof parsed === 'object' && parsed !== null) {
                        console.log(`   🔑 Object Keys:`, Object.keys(parsed));
                    }
                } catch (e) {
                    console.log(`   ❌ JSON Parse Error:`, e.message);
                }
            }
            console.log('   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        }
    }

    // Check our specific required items
    console.log('🎯 ========== CHECKING REQUIRED SESSION ITEMS ==========');
    const requiredItems = ['customerID', 'customerData', 'accountData'];

    requiredItems.forEach((itemName, index) => {
        console.log(`🔍 Checking required item ${index + 1}: "${itemName}"`);
        const value = sessionStorage.getItem(itemName);

        if (value) {
            console.log(`   ✅ "${itemName}" FOUND!`);
            console.log(`   📏 Length: ${value.length} characters`);

            if (itemName === 'customerID') {
                console.log(`   📊 Customer ID Value: "${value}"`);
            } else {
                try {
                    const parsed = JSON.parse(value);
                    console.log(`   📊 Parsed ${itemName}:`, parsed);
                } catch (e) {
                    console.log(`   ❌ Could not parse ${itemName}:`, e.message);
                }
            }
        } else {
            console.log(`   ❌ "${itemName}" NOT FOUND!`);
        }
        console.log('   ─────────────────────────────────────────────────────────');
    });

    console.log('💾 ========== END SESSION STORAGE REPORT ==========');

    console.log('🔍 Checking DatabaseService availability...');

    // Check if Database service is available
    if (typeof DatabaseService === 'undefined') {
        console.error('❌ DatabaseService not available! Database.js may not have loaded.');
        showErrorMessage('System error: Database service not available. Please refresh the page.');
        return;
    }

    // Use the global dbService instance from Database.js
    if (typeof dbService === 'undefined') {
        console.error('❌ Global dbService not available! Database.js may not have loaded properly.');
        showErrorMessage('System error: Database service not available. Please refresh the page.');
        return;
    }

    console.log('✅ Using global database service:', dbService);

    // DETAILED SESSION STORAGE DEBUGGING
    console.log('🔍 ========== SESSION STORAGE DEBUGGING ==========');
    console.log('💾 SessionStorage length:', sessionStorage.length);

    // Show all sessionStorage items
    console.log('💾 All sessionStorage items:');
    for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        const value = sessionStorage.getItem(key);
        console.log(`💾 ${key}:`, value);
    }

    // Check specific items
    const sessionCustomerID = sessionStorage.getItem('customerID');
    const sessionCustomerData = sessionStorage.getItem('customerData');
    const sessionAccountData = sessionStorage.getItem('accountData');

    console.log('💾 Customer ID from session:', sessionCustomerID);
    console.log('💾 Customer Data from session:', sessionCustomerData);
    console.log('💾 Account Data from session:', sessionAccountData);
    console.log('🔍 ==========================================');

    // Get customer ID from sessionStorage (not cookies!)
    currentCustomerID = sessionCustomerID;
    console.log('👤 Retrieved customer ID from cookie:', currentCustomerID);
    console.log('👤 Customer ID type:', typeof currentCustomerID);

    // Get customer data from cookies  
    const rawCustomerData = getCookie('customerData');
    console.log('👤 Retrieved customer data from cookie:', rawCustomerData);
    console.log('👤 Customer data type:', typeof rawCustomerData);

    // Get account data from cookies
    const rawAccountData = getCookie('accountData');
    console.log('  Retrieved account data from cookie:', rawAccountData);
    console.log('  Account data type:', typeof rawAccountData);

    console.log('🔍 ==========================================');

    if (!currentCustomerID) {
        console.error('❌ No customer ID found in cookies. Redirecting to login...');
        console.error('❌ This means either:');
        console.error('   1. User came directly to dashboard without login');
        console.error('   2. Cookies were not set during login');
        console.error('   3. Cookies expired or were deleted');
        showErrorMessage('Session expired. Please login again.');
        setTimeout(() => {
            window.location.href = 'customer-login.html';
        }, 2000);
        return;
    }

    console.log('✅ Customer ID found, proceeding with dashboard initialization...');

    // Refresh data from session storage to ensure everything is current
    console.log('🔄 Refreshing data from session storage...');
    refreshDataFromSessionStorage();

    // Initialize dashboard
    initializeDashboard();

    // Initialize animations  
    initAnimations();

    // Setup event listeners
    setupEventListeners();

    // IMMEDIATELY LOAD AND DISPLAY SESSION DATA
    console.log('🚀 ========== IMMEDIATE SESSION DATA LOADING ==========');
    refreshDataFromSessionStorage();

    // Load real data from backend - make this async
    loadDashboardData().then(() => {
        console.log('🎉 Dashboard data loading completed');
        // Hide loader after data is loaded
        setTimeout(hideLoader, 1000);
    }).catch((error) => {
        console.error('❌ Failed to load dashboard data:', error);
        showErrorMessage('Failed to load dashboard data. Please refresh the page.');
        setTimeout(hideLoader, 1000);
    });
});

// Show error message to user
function showErrorMessage(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification notification-error';
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-exclamation-circle"></i>
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

// Initialize dashboard
function initializeDashboard() {
    // Create animated particles
    createParticles();

    // Set current time greeting
    updateGreeting();

    // Start real-time updates
    startRealTimeUpdates();
}

// Create floating particles
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = 15;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';

        // Random size and position
        const size = Math.random() * 4 + 2;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 6 + 's';
        particle.style.animationDuration = (Math.random() * 3 + 3) + 's';

        particlesContainer.appendChild(particle);
    }
}

// Update greeting based on time
function updateGreeting() {
    const welcomeText = document.querySelector('.welcome-text');
    const hour = new Date().getHours();
    let greeting = 'Good morning';
    let icon = 'fa-sun';

    if (hour >= 12 && hour < 17) {
        greeting = 'Good afternoon';
        icon = 'fa-sun';
    } else if (hour >= 17 || hour < 6) {
        greeting = 'Good evening';
        icon = 'fa-moon';
    }

    // Get customer name - handle multiple sources
    let customerName = 'Guest';

    if (customerProfile && customerProfile.firstName) {
        customerName = customerProfile.firstName;
        console.log('✅ Using customer name from customerProfile:', customerName);
    } else {
        // Try to get from session storage directly
        try {
            const sessionCustomerData = sessionStorage.getItem('customerData');
            if (sessionCustomerData) {
                const parsedData = JSON.parse(sessionCustomerData);
                if (parsedData.firstName) {
                    customerName = parsedData.firstName;
                    console.log('✅ Using customer name from session storage:', customerName);
                }
            }
        } catch (e) {
            console.warn('⚠️ Could not get customer name from session storage:', e);
        }
    }

    console.log('🕒 Updating greeting with name:', customerName);
    welcomeText.innerHTML = `<i class="fas ${icon} icon-with-margin"></i>${greeting}, ${customerName}!`;
}

// Show specific section
function showSection(sectionId) {
    console.log(`🔄 ========== SHOWING SECTION: ${sectionId} ==========`);

    // Hide all sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });

    // Remove active class from all nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });

    // Show selected section
    const selectedSection = document.getElementById(sectionId);
    if (selectedSection) {
        selectedSection.classList.add('active');
        console.log(`✅ Section ${sectionId} activated successfully`);
    } else {
        console.error(`❌ Section ${sectionId} not found!`);
    }

    // Add active class to clicked nav link
    if (event && event.target) {
        const navLink = event.target.closest('.nav-link');
        if (navLink) {
            navLink.classList.add('active');
        } else {
            // If the clicked element is not within a nav-link, find the corresponding nav-link
            const targetNavLink = document.querySelector(`[onclick="showSection('${sectionId}', event)"]`);
            if (targetNavLink) {
                targetNavLink.classList.add('active');
            }
        }
    }

    // Load section-specific data
    console.log(`🔄 Loading data for section: ${sectionId}`);
    loadSectionData(sectionId);

    // Smooth scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Load section-specific data
function loadSectionData(sectionId) {
    switch (sectionId) {
        case 'dashboard':
            loadCustomerProfile();
            animateCardsOnLoad();
            break;
        case 'accounts':
            loadAccountInfo();
            animateCardsOnLoad();
            break;
        case 'profile':
            console.log('📝 Profile section selected - calling populateProfileForm()');
            populateProfileForm();
            animateCardsOnLoad();
            break;
        case 'update-details':
            loadUpdateDetailsData();
            animateCardsOnLoad();
            break;
        case 'cards':
            animateCardsOnLoad();
            break;
        case 'statements':
            animateCardsOnLoad();
            break;
        case 'support':
            animateCardsOnLoad();
            break;
        case 'managePayees':
            animateCardsOnLoad();
            // Initialize payee section
            renderPayeeList();
            updatePayeeDropdowns();
            hideAddPayeeForm(); // Ensure form is hidden initially
            break;
        default:
            animateCardsOnLoad();
            break;
    }
}

// Animate cards on section load
function animateCardsOnLoad() {
    const cards = document.querySelectorAll('.card, .info-card, .action-card, .account-card, .statement-card, .support-card, .update-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px) scale(0.95)';

        setTimeout(() => {
            card.style.transition = 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) scale(1)';
        }, index * 150);
    });
}

// Load dashboard data
// Load dashboard data from backend API
async function loadDashboardData() {
    console.log('📊 ========== DASHBOARD DATA LOADING START ==========');
    console.log('📊 Customer ID:', currentCustomerID);
    console.log('📊 Step 1: Getting data from sessionStorage...');

    try {
        // Show loading message
        showLoadingMessage('Loading your account information...');

        // STEP 1: Try to get data from sessionStorage (fetched during login)
        console.log('💾 Step 1.1: Getting customerData from sessionStorage...');
        const sessionCustomerData = sessionStorage.getItem('customerData');
        console.log('💾 Step 1.2: Getting accountData from sessionStorage...');
        const sessionAccountData = sessionStorage.getItem('accountData');

        console.log('💾 ========== SESSION STORAGE RETRIEVAL RESULTS ==========');
        console.log('💾 Customer data result:', sessionCustomerData);
        console.log('💾 Customer data is null?', sessionCustomerData === null);
        console.log('💾 Customer data is undefined?', sessionCustomerData === undefined);
        console.log('💾 Customer data length:', sessionCustomerData ? sessionCustomerData.length : 0);

        console.log('💾 Account data result:', sessionAccountData);
        console.log('💾 Account data is null?', sessionAccountData === null);
        console.log('💾 Account data is undefined?', sessionAccountData === undefined);
        console.log('💾 Account data length:', sessionAccountData ? sessionAccountData.length : 0);
        console.log('💾 ===============================================');

        let dataLoadedFromSession = false;

        // STEP 2: Process customer data if available
        console.log('📊 Step 2: Processing customer data...');
        if (sessionCustomerData) {
            try {
                console.log('✅ Step 2.1: Customer data found in sessionStorage');
                customerProfile = JSON.parse(sessionCustomerData);
                console.log('✅ Step 2.2: Customer profile parsed:', customerProfile);
                console.log('🔍 Customer profile data type:', typeof customerProfile);
                if (typeof customerProfile === 'object' && customerProfile !== null) {
                    console.log('🔍 Customer profile keys:', Object.keys(customerProfile));
                }
                console.log('✅ Step 2.3: Calling loadCustomerProfile()...');
                loadCustomerProfile();
                console.log('✅ Step 2.4: loadCustomerProfile() completed');
                dataLoadedFromSession = true;
            } catch (parseError) {
                console.error('❌ Step 2.X: Error parsing sessionStorage customer data:', parseError);
                console.error('❌ Raw customer data was:', sessionCustomerData);
            }
        } else {
            console.log('⚠️ Step 2.X: No customer data found in sessionStorage');
        }

        // STEP 3: Process account data if available
        console.log('📊 Step 3: Processing account data...');
        if (sessionAccountData) {
            try {
                console.log('✅ Step 3.1: Account data found in sessionStorage');
                accountInfo = JSON.parse(sessionAccountData);
                console.log('✅ Step 3.2: Account info parsed:', accountInfo);
                console.log('🔍 Account info data type:', typeof accountInfo);
                if (typeof accountInfo === 'object' && accountInfo !== null) {
                    console.log('🔍 Account info keys:', Object.keys(accountInfo));
                }
                console.log('✅ Step 3.3: Calling loadAccountInfo()...');
                loadAccountInfo();
                console.log('✅ Step 3.4: loadAccountInfo() completed');
                dataLoadedFromSession = true;
            } catch (parseError) {
                console.error('❌ Step 3.X: Error parsing sessionStorage account data:', parseError);
                console.error('❌ Raw account data was:', sessionAccountData);
            }
        } else {
            console.log('⚠️ Step 3.X: No account data found in sessionStorage');
        }

        // STEP 4: Check if we have all data from sessionStorage
        console.log('📊 Step 4: Checking if all data loaded from sessionStorage...');
        console.log('📊 Data loaded from session?', dataLoadedFromSession);
        console.log('📊 Has customer data?', !!sessionCustomerData);
        console.log('📊 Has account data?', !!sessionAccountData);

        if (dataLoadedFromSession && sessionCustomerData && sessionAccountData) {
            console.log('✅ Step 4.1: All data loaded successfully from sessionStorage! Finishing...');
            hideLoadingMessage();
            console.log('📊 ========== DASHBOARD DATA LOADING COMPLETE (SESSION) ==========');
            return;
        }

        // STEP 5: FALLBACK - Make API calls if sessionStorage data is missing
        console.log('📊 Step 5: SessionStorage data missing or incomplete, making API calls as fallback...');
        console.log('⚠️ Reason: sessionCustomerData =', !!sessionCustomerData, ', sessionAccountData =', !!sessionAccountData);
        console.log('⚠️ Cookie data missing or incomplete, making API calls as fallback...');
        console.log('🔗 Customer Details URL:', `http://localhost:8080/customer/get/${currentCustomerID}`);
        console.log('🔗 Account Details URL:', `http://localhost:8080/account/getCustomer/${currentCustomerID}`);

        try {
            // Fetch customer details and account details in parallel
            const [customerResponse, accountResponse] = await Promise.all([
                dbService.getCustomerDetails(currentCustomerID),
                dbService.getCustomerAccount(currentCustomerID)
            ]);

            console.log('👤 ========== FALLBACK CUSTOMER RESPONSE ==========');
            console.log('Customer Response:', customerResponse);
            console.log('👤 ===============================================');

            console.log('🏦 ========== FALLBACK ACCOUNT RESPONSE ==========');
            console.log('Account Response:', accountResponse);
            console.log('🏦 ===============================================');

            // Handle customer details fallback
            if (!sessionCustomerData && customerResponse.success) {
                customerProfile = customerResponse.data;
                console.log('✅ Customer profile loaded from API fallback:', customerProfile);
                loadCustomerProfile();

                // Store in sessionStorage for consistency
                sessionStorage.setItem('customerData', JSON.stringify(customerProfile));
            }

            // Handle account details fallback
            if (!sessionAccountData && accountResponse.success) {
                accountInfo = accountResponse.data;
                console.log('✅ Account info loaded from API fallback:', accountInfo);
                loadAccountInfo();

                // Store in sessionStorage for consistency
                sessionStorage.setItem('accountData', JSON.stringify(accountInfo));
            }

        } catch (apiError) {
            console.error('❌ API fallback failed:', apiError);

            // Check if it's a connection error specifically
            if (apiError.message && apiError.message.includes('ERR_CONNECTION_REFUSED')) {
                console.log('🔌 Server connection refused - backend is not running');
                console.log('  Tip: Make sure your backend server is running on localhost:8080');
            } else if (apiError.message && apiError.message.includes('Failed to fetch')) {
                console.log('🌐 Network error - server appears to be offline');
            } else {
                console.log(' 🔄 Server appears to be offline, using offline mode...');
            }

            // Check if we have partial session data to work with
            if (sessionCustomerData || sessionAccountData) {
                console.log('📦 Using partial session data in offline mode');

                if (sessionCustomerData) {
                    try {
                        customerProfile = JSON.parse(sessionCustomerData);
                        loadCustomerProfile();
                        console.log('✅ Customer profile loaded from session (offline mode)');
                    } catch (e) {
                        console.error('❌ Error parsing session customer data:', e);
                    }
                }

                if (sessionAccountData) {
                    try {
                        accountInfo = JSON.parse(sessionAccountData);
                        loadAccountInfo();
                        console.log('✅ Account info loaded from session (offline mode)');
                    } catch (e) {
                        console.error('❌ Error parsing session account data:', e);
                    }
                }
            } else {
                // No session data available, show offline message
                console.log('⚠️ No session data available, showing offline message');
                showOfflineMode();
            }
        }

        // Hide loading message
        hideLoadingMessage();

    } catch (error) {
        console.error('❌ Exception in loadDashboardData:', error);
        console.error('❌ Error stack:', error.stack);
        showErrorMessage('Error loading dashboard data. Please refresh the page.');
        hideLoadingMessage();
    }

    console.log('📊 ========== DASHBOARD DATA LOADING COMPLETE ==========');
}

// Show loading message
function showLoadingMessage(message) {
    const loader = document.getElementById('loader');
    if (loader) {
        const loadingText = loader.querySelector('.loading-text');
        if (loadingText) {
            loadingText.textContent = message;
        }
        loader.style.display = 'flex';
    }
}

// Hide loading message
function hideLoadingMessage() {
    const loader = document.getElementById('loader');
    if (loader) {
        loader.style.display = 'none';
    }
}

// Show offline mode
function showOfflineMode() {
    console.log('🔌 Showing offline mode interface');

    // Hide loader first
    hideLoadingMessage();

    // Show a user-friendly offline message
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
        const offlineHTML = `
            <div class="offline-mode-container" style="
                text-align: center; 
                padding: 40px; 
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                border-radius: 15px;
                margin: 20px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            ">
                <div style="font-size: 3rem; margin-bottom: 20px;">🔌</div>
                <h2 style="margin-bottom: 15px; color: #fff;">Offline Mode</h2>
                <p style="margin-bottom: 20px; font-size: 1.1rem; opacity: 0.9;">
                    Unable to connect to the server. You can still view your cached account information.
                </p>
                <button onclick="location.reload()" style="
                    background: rgba(255,255,255,0.2);
                    border: 2px solid rgba(255,255,255,0.3);
                    color: white;
                    padding: 12px 24px;
                    border-radius: 25px;
                    cursor: pointer;
                    font-size: 1rem;
                    transition: all 0.3s ease;
                " onmouseover="this.style.background='rgba(255,255,255,0.3)'" 
                   onmouseout="this.style.background='rgba(255,255,255,0.2)'">
                    <i class="fas fa-sync-alt"></i> Try Again
                </button>
            </div>
        `;

        // Insert offline mode at the top of main content
        mainContent.insertAdjacentHTML('afterbegin', offlineHTML);
    }

    // Still try to load any available session data
    refreshDataFromSessionStorage();
}

// Load customer profile information
function loadCustomerProfile() {
    try {
        console.log('📝 ========== LOADING CUSTOMER PROFILE ==========');
        console.log('📝 Customer profile data received:', customerProfile);
        console.log('📝 Customer profile type:', typeof customerProfile);

        if (!customerProfile || typeof customerProfile !== 'object') {
            console.error('❌ Invalid customer profile data:', customerProfile);

            // Fallback: try to get directly from session storage
            console.log('🔄 Attempting to load customer profile from sessionStorage as fallback...');
            try {
                const sessionCustomerData = sessionStorage.getItem('customerData');
                if (sessionCustomerData) {
                    customerProfile = JSON.parse(sessionCustomerData);
                    console.log('✅ Successfully loaded customer profile from sessionStorage:', customerProfile);
                } else {
                    console.error('❌ No customer data found in sessionStorage either');
                    return;
                }
            } catch (e) {
                console.error('❌ Error parsing customer data from session storage:', e);
                return;
            }
        }

        console.log('📝 Customer profile keys:', Object.keys(customerProfile));

        // Log each field we're trying to access
        console.log('📝 firstName:', customerProfile.firstName);
        console.log('📝 middleName:', customerProfile.middleName);
        console.log('📝 lastName:', customerProfile.lastName);
        console.log('📝 email:', customerProfile.email);
        console.log('📝 customerId:', customerProfile.customerId);
        console.log('📝 customerID (alt):', customerProfile.customerID);

        // Update profile header
        const fullName = `${customerProfile.firstName || ''} ${customerProfile.middleName || ''} ${customerProfile.lastName || ''}`.trim();
        console.log('📝 Constructed full name:', fullName);

        const customerFullNameElement = document.getElementById('customerFullName');
        const customerEmailElement = document.getElementById('customerEmail');

        console.log('📝 DOM Element Check:');
        console.log('📝 customerFullName element:', customerFullNameElement);
        console.log('📝 customerEmail element:', customerEmailElement);

        if (customerFullNameElement) {
            customerFullNameElement.textContent = fullName;
            console.log('✅ Updated customerFullName element with:', fullName);
        } else {
            console.error('❌ customerFullName element not found!');
            console.error('❌ Available elements with customer in ID:');
            document.querySelectorAll('[id*="customer"]').forEach(el => {
                console.error(`   - ${el.id}: ${el.tagName}`);
            });
        }

        if (customerEmailElement) {
            customerEmailElement.textContent = customerProfile.email || '';
            console.log('✅ Updated customerEmail element with:', customerProfile.email);
        } else {
            console.error('❌ customerEmail element not found!');
        }

        // Update personal information with detailed logging
        // Get account number from session storage or accountInfo for Account Request ID
        let accountNumber = '';

        // First try to get from accountInfo global variable
        if (accountInfo && accountInfo.accountNo) {
            accountNumber = accountInfo.accountNo;
            console.log('📝 Got account number from accountInfo:', accountNumber);
        } else {
            // Fallback: try to get directly from session storage
            try {
                const sessionAccountData = sessionStorage.getItem('accountData');
                if (sessionAccountData) {
                    const parsedAccountData = JSON.parse(sessionAccountData);
                    if (parsedAccountData && parsedAccountData.accountNo) {
                        accountNumber = parsedAccountData.accountNo;
                        console.log('📝 Got account number from sessionStorage:', accountNumber);
                    }
                }
            } catch (e) {
                console.error('❌ Error parsing account data from session storage:', e);
            }
        }

        console.log('📝 Final account number for Account Request ID:', accountNumber);

        const fieldsToUpdate = [
            { id: 'customerID', value: customerProfile.customerId || customerProfile.customerID || '', label: 'Customer ID' },
            { id: 'accountRequestID', value: accountNumber || '', label: 'Account Request ID' },
            { id: 'customerTitle', value: customerProfile.title || '', label: 'Title' },
            { id: 'firstName', value: customerProfile.firstName || '', label: 'First Name' },
            { id: 'middleName', value: customerProfile.middleName || '', label: 'Middle Name' },
            { id: 'lastName', value: customerProfile.lastName || '', label: 'Last Name' },
            { id: 'customerDOB', value: customerProfile.dob || '', label: 'Date of Birth' },
            { id: 'mobileNumber', value: customerProfile.mobileNo || '', label: 'Mobile Number' },
            { id: 'emailAddress', value: customerProfile.email || '', label: 'Email Address' },
            { id: 'residentialAddress', value: customerProfile.residentialAddress || '', label: 'Residential Address' },
            { id: 'permanentAddress', value: customerProfile.permanentAddress || '', label: 'Permanent Address' },
            { id: 'aadharNumber', value: customerProfile.aadharNo || '', label: 'Aadhar Number' },
            { id: 'panNumber', value: customerProfile.panNo || '', label: 'PAN Number' },
            { id: 'occupation', value: customerProfile.occupation || '', label: 'Occupation' }
        ];

        fieldsToUpdate.forEach(field => {
            const element = document.getElementById(field.id);
            if (element) {
                element.textContent = field.value;
                console.log(`✅ Updated ${field.label} (${field.id}) with: "${field.value}"`);
            } else {
                console.error(`❌ Element not found: ${field.id} for ${field.label}`);
            }
        });

        // Format annual income with currency
        const annualIncome = customerProfile.annualIncome || 0;
        const formattedIncome = `₹${annualIncome.toLocaleString('en-IN')}`;
        const annualIncomeElement = document.getElementById('annualIncome');
        if (annualIncomeElement) {
            annualIncomeElement.textContent = formattedIncome;
            console.log('✅ Updated annual income with:', formattedIncome);
        } else {
            console.error('❌ annualIncome element not found');
        }

        console.log('✅ Customer profile updated in UI successfully');
        console.log('📝 ==========================================');

        // Update greeting with customer name
        console.log('📝 Updating greeting after profile load...');
        updateGreeting();

        // Add loading animation
        animateProfileLoad();

        // Populate profile form with customer data
        console.log('📝 Calling populateProfileForm() after profile load...');
        populateProfileForm();

    } catch (error) {
        console.error('❌ Error loading customer profile:', error);
        showErrorMessage('Error displaying customer profile information');
    }
}

// Populate profile form with customer data from sessionStorage
function populateProfileForm() {
    try {
        console.log('📝 ========== POPULATING PROFILE FORM ==========');
        console.log('📝 Customer profile data:', customerProfile);

        if (!customerProfile || typeof customerProfile !== 'object') {
            console.error('❌ Invalid customer profile data for form population:', customerProfile);
            return;
        }

        // Map of form field IDs to customer profile data
        const formFieldMappings = [
            { id: 'profileFirstName', value: customerProfile.firstName || '', label: 'First Name' },
            { id: 'profileLastName', value: customerProfile.lastName || '', label: 'Last Name' },
            { id: 'profileEmail', value: customerProfile.email || '', label: 'Email' },
            { id: 'profilePhone', value: customerProfile.mobileNo || '', label: 'Phone' },
            { id: 'profileAddress', value: customerProfile.residentialAddress || '', label: 'Address' }
        ];

        // Populate each form field
        formFieldMappings.forEach(field => {
            const element = document.getElementById(field.id);
            if (element) {
                // Check if it's a textarea or input
                if (element.tagName.toLowerCase() === 'textarea') {
                    element.value = field.value;
                } else {
                    element.value = field.value;
                }
                console.log(`✅ Populated ${field.label} (${field.id}) with: "${field.value}"`);
            } else {
                console.error(`❌ Profile form element not found: ${field.id} for ${field.label}`);
            }
        });

        console.log('✅ Profile form populated successfully');
        console.log('📝 ==========================================');

    } catch (error) {
        console.error('❌ Error populating profile form:', error);
        showErrorMessage('Error loading profile form data');
    }
}

// Load account information
function loadAccountInfo() {
    try {
        console.log('🏦 Loading account information data:', accountInfo);

        // Format balance in Indian Rupee format
        const formattedBalance = formatIndianCurrency(accountInfo.balance || 0);

        // Update account details
        document.getElementById('accountNumber').textContent = accountInfo.accountNo || '';
        document.getElementById('accountTypeDisplay').textContent = accountInfo.accountType || '';
        document.getElementById('accountApplicationDate').textContent = accountInfo.applicationDate || '';
        document.getElementById('accountStatus').textContent = accountInfo.status || '';
        document.getElementById('currentBalance').textContent = formattedBalance;

        // Set IFSC code (static for now)
        const ifscElement = document.getElementById('ifscCode');
        if (ifscElement) {
            ifscElement.textContent = 'ORAC0001234';
        }

        // Update balance in multiple places
        const balanceElements = document.querySelectorAll('#accountBalance');
        balanceElements.forEach(element => {
            if (element) {
                element.textContent = formattedBalance;
            }
        });

        console.log('✅ Account information updated in UI');

        // Add loading animation
        animateAccountLoad();
    } catch (error) {
        console.error('Error loading account info:', error);
    }
}

// Format currency in Indian format
function formatIndianCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

// Animate profile loading
function animateProfileLoad() {
    const profileElements = document.querySelectorAll('.detail-item');
    profileElements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';

        setTimeout(() => {
            element.style.transition = 'all 0.5s ease-out';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, index * 100);
    });

    // Animate identification cards after profile elements
    setTimeout(() => {
        animateIdentificationCards();
    }, profileElements.length * 100 + 200);
}

// Enhanced animations for identification cards
function animateIdentificationCards() {
    const cards = document.querySelectorAll('.id-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px) rotateX(15deg)';

        setTimeout(() => {
            card.style.transition = 'all 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) rotateX(0)';
        }, (index + 1) * 300);
    });
}

// Animate account loading
function animateAccountLoad() {
    const accountElements = document.querySelectorAll('.feature-item');
    accountElements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateX(-20px)';

        setTimeout(() => {
            element.style.transition = 'all 0.5s ease-out';
            element.style.opacity = '1';
            element.style.transform = 'translateX(0)';
        }, index * 150);
    });
}

// Load recent transactions
function loadRecentTransactions() {
    const container = document.getElementById('recentTransactions');
    if (!container) return;

    const transactions = [
        {
            id: 'TXN001',
            type: 'deposit',
            description: 'Salary Deposit',
            amount: '+$3,500.00',
            date: 'Today, 09:30 AM',
            account: 'Checking ****7892',
            icon: 'fa-arrow-down',
            color: 'success'
        },
        {
            id: 'TXN002',
            type: 'withdrawal',
            description: 'ATM Withdrawal',
            amount: '-$200.00',
            date: 'Yesterday, 02:15 PM',
            account: 'Checking ****7892',
            icon: 'fa-arrow-up',
            color: 'error'
        },
        {
            id: 'TXN003',
            type: 'transfer',
            description: 'Transfer to Savings',
            amount: '-$500.00',
            date: 'Dec 28, 11:45 AM',
            account: 'Checking ****7892',
            icon: 'fa-exchange-alt',
            color: 'warning'
        },
        {
            id: 'TXN004',
            type: 'payment',
            description: 'Electric Bill Payment',
            amount: '-$89.50',
            date: 'Dec 27, 04:20 PM',
            account: 'Checking ****7892',
            icon: 'fa-bolt',
            color: 'error'
        }
    ];

    container.innerHTML = transactions.map(transaction => `
        <div class="transaction-item glass" onclick="viewTransactionDetails('${transaction.id}')">
            <div class="transaction-icon ${transaction.color}">
                <i class="fas ${transaction.icon}"></i>
            </div>
            <div class="transaction-info">
                <div class="transaction-description">${transaction.description}</div>
                <div class="transaction-details">${transaction.account} • ${transaction.date}</div>
            </div>
            <div class="transaction-amount ${transaction.color}">
                ${transaction.amount}
            </div>
        </div>
    `).join('');

    // Add CSS for transaction items if not already present
    if (!document.querySelector('#transactionStyles')) {
        const style = document.createElement('style');
        style.id = 'transactionStyles';
        style.textContent = `
            .transaction-item {
                display: flex;
                align-items: center;
                padding: 1rem;
                margin-bottom: 0.5rem;
                border-radius: 12px;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            .transaction-item:hover {
                transform: translateX(5px);
                background: rgba(16, 185, 129, 0.1);
            }
            
            .transaction-icon {
                width: 40px;
                height: 40px;
                border-radius: 10px;
                display: flex;
                align-items: center;
                justify-content: center;
                margin-right: 1rem;
                font-size: 1.1rem;
            }
            
            .transaction-icon.success {
                background: rgba(16, 185, 129, 0.2);
                color: var(--success);
            }
            
            .transaction-icon.error {
                background: rgba(239, 68, 68, 0.2);
                color: var(--error);
            }
            
            .transaction-icon.warning {
                background: rgba(245, 158, 11, 0.2);
                color: var(--warning);
            }
            
            .transaction-info {
                flex: 1;
            }
            
            .transaction-description {
                font-weight: 600;
                color: var(--text-primary);
                margin-bottom: 0.25rem;
            }
            
            .transaction-details {
                font-size: 0.85rem;
                color: var(--text-secondary);
            }
            
            .transaction-amount {
                font-weight: 700;
                font-size: 1.1rem;
            }
            
            .transaction-amount.success {
                color: var(--success);
            }
            
            .transaction-amount.error {
                color: var(--error);
            }
            
            .transaction-amount.warning {
                color: var(--warning);
            }
        `;
        document.head.appendChild(style);
    }
}

// Placeholder functions for removed features
function loadTransactions() {
    showNotification('Transaction history feature has been removed from this portal.', 'info');
}

function processTransfer() {
    showNotification('Transfer feature has been removed from this portal.', 'info');
}

function downloadTransactions() {
    showNotification('Transaction download feature has been removed from this portal.', 'info');
}

function switchTransferTab() {
    showNotification('Transfer feature has been removed from this portal.', 'info');
}

function filterTransactions() {
    showNotification('Transaction filter feature has been removed from this portal.', 'info');
}

// Mobile menu toggle
function toggleMobileMenu() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('mobile-open');
}

// Balance visibility toggle
function toggleBalanceVisibility() {
    const balanceAmount = document.getElementById('accountBalance');
    const toggleIcon = document.getElementById('balanceToggleIcon');

    if (balanceAmount.textContent.includes('*')) {
        const formattedBalance = formatIndianCurrency(accountInfo.balance);
        balanceAmount.textContent = formattedBalance;
        toggleIcon.className = 'fas fa-eye';
    } else {
        balanceAmount.textContent = '₹****,***';
        toggleIcon.className = 'fas fa-eye-slash';
    }
}

// Quick action functions
function quickTransfer(accountType) {
    showNotification('Transfer feature has been removed from this portal.', 'info');
}

function viewAccountDetails(accountType) {
    showNotification('Viewing account details...', 'info');
    showSection('accounts');
}

function payBills() {
    showNotification('Bill payment feature coming soon!', 'info');
}

function mobileDeposit() {
    showNotification('Mobile deposit feature coming soon!', 'info');
}

function findATM() {
    showNotification('ATM locator feature coming soon!', 'info');
}

function processTransfer() {
    showNotification('Transfer feature has been removed from this portal.', 'info');
}

// Profile Management Functions
function editProfile() {
    showNotification('Profile editing feature will be available soon!', 'info');
}

function refreshAccountInfo() {
    showNotification('Refreshing account information...', 'info');

    // Simulate data refresh
    setTimeout(() => {
        loadAccountInfo();
        showNotification('Account information updated successfully!', 'success');
    }, 1500);
}

function changeTransactionPassword() {
    const currentPassword = prompt('Enter current transaction password:');
    if (currentPassword) {
        const newPassword = prompt('Enter new transaction password:');
        if (newPassword && newPassword.length >= 4) {
            const confirmPassword = prompt('Confirm new transaction password:');
            if (confirmPassword === newPassword) {
                showNotification('Transaction password updated successfully!', 'success');
            } else {
                showNotification('Passwords do not match!', 'error');
            }
        } else {
            showNotification('Password must be at least 4 characters long!', 'error');
        }
    }
}

// Support functions
function startChat() {
    showNotification('Starting live chat...', 'info');
}

function callSupport() {
    showNotification('Dialing customer support...', 'info');
}

function emailSupport() {
    showNotification('Opening email client...', 'info');
}

// Profile functions
function saveProfile() {
    showNotification('Profile updated successfully!', 'success');
}

// Card functions
function lockCard() {
    showNotification('Card locked successfully', 'success');
}

function cardSettings() {
    showNotification('Card settings opened', 'info');
}

// Other functions
function requestNewAccount() {
    showNotification('New account request submitted', 'success');
}

function requestNewCard() {
    showNotification('New card request submitted', 'success');
}

function downloadTransactions() {
    showNotification('Downloading transaction history...', 'info');
}

function filterTransactions() {
    showNotification('Transaction filters applied', 'info');
}

function generateStatement() {
    showNotification('Generating account statement...', 'info');
}

function viewStatement() {
    showNotification('Opening statement...', 'info');
}

function downloadStatement() {
    showNotification('Downloading statement...', 'info');
}

function viewTransactionDetails(transactionId) {
    showNotification(`Viewing details for transaction ${transactionId}`, 'info');
}

// Quick actions
function showQuickPay() {
    showNotification('Quick Pay feature coming soon!', 'info');
}

function showNotifications() {
    showNotification('You have 3 new notifications', 'info');
}

function showProfile() {
    showSection('profile');
}

// Logout function
function customerLogout() {
    if (confirm('Are you sure you want to logout?')) {
        showNotification('Logging out...', 'info');
        setTimeout(() => {
            window.location.href = 'customer-login.html';
        }, 1500);
    }
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notif => notif.remove());

    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;

    let icon = 'fa-info-circle';
    if (type === 'success') icon = 'fa-check-circle';
    if (type === 'error') icon = 'fa-exclamation-circle';
    if (type === 'warning') icon = 'fa-exclamation-triangle';

    notification.innerHTML = `
        <i class="fas ${icon}"></i>
        <span>${message}</span>
    `;

    // Add to body
    document.body.appendChild(notification);

    // Add notification styles if not present
    if (!document.querySelector('#notificationStyles')) {
        const style = document.createElement('style');
        style.id = 'notificationStyles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 1rem 1.5rem;
                background: var(--glass);
                border: 1px solid var(--border);
                border-radius: 12px;
                backdrop-filter: blur(20px);
                color: var(--text-primary);
                z-index: 10000;
                display: flex;
                align-items: center;
                gap: 0.75rem;
                transform: translateX(100%);
                transition: all 0.3s ease;
                max-width: 400px;
                box-shadow: var(--shadow);
            }
            
            .notification.show {
                transform: translateX(0);
            }
            
            .notification.success {
                border-color: var(--success);
                background: rgba(16, 185, 129, 0.1);
            }
            
            .notification.error {
                border-color: var(--error);
                background: rgba(239, 68, 68, 0.1);
            }
            
            .notification.warning {
                border-color: var(--warning);
                background: rgba(245, 158, 11, 0.1);
            }
            
            .notification.info {
                border-color: var(--accent-primary);
                background: rgba(16, 185, 129, 0.1);
            }
        `;
        document.head.appendChild(style);
    }

    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);

    // Auto hide after 4 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 4000);
}

// Initialize animations
function initAnimations() {
    // Animate cards on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'slideIn 0.6s ease forwards';
            }
        });
    }, observerOptions);

    // Observe all cards and sections
    document.querySelectorAll('.account-card, .quick-action-btn, .section-card').forEach(element => {
        observer.observe(element);
    });
}

// Real-time updates
function startRealTimeUpdates() {
    // Update time every minute
    setInterval(updateGreeting, 60000);

    // Simulate balance updates (for demo)
    setInterval(() => {
        const balanceElement = document.getElementById('totalBalance');
        if (balanceElement && !balanceElement.textContent.includes('*')) {
            // Small random fluctuation for demo
            const currentBalance = 12847.93;
            const fluctuation = (Math.random() - 0.5) * 10;
            const newBalance = currentBalance + fluctuation;
            balanceElement.textContent = `$${newBalance.toFixed(2)}`;
        }
    }, 30000);
}

// Setup event listeners
function setupEventListeners() {
    // Close mobile menu when clicking outside
    document.addEventListener('click', (event) => {
        const sidebar = document.getElementById('sidebar');
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');

        if (sidebar.classList.contains('mobile-open') &&
            !sidebar.contains(event.target) &&
            !mobileMenuBtn.contains(event.target)) {
            sidebar.classList.remove('mobile-open');
        }
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (event) => {
        // Alt + D for dashboard
        if (event.altKey && event.key === 'd') {
            event.preventDefault();
            showSection('dashboard');
        }

        // Alt + T for transfer
        if (event.altKey && event.key === 't') {
            event.preventDefault();
            showSection('transfer');
        }

        // Alt + H for transaction history
        if (event.altKey && event.key === 'h') {
            event.preventDefault();
            showSection('transactions');
        }

        // Escape to close mobile menu
        if (event.key === 'Escape') {
            const sidebar = document.getElementById('sidebar');
            sidebar.classList.remove('mobile-open');
        }
    });
}

// Load account details
function loadAccountDetails() {
    // This would typically fetch data from an API
    console.log('Loading detailed account information...');
}

// Initialize when page loads
window.addEventListener('load', function () {
    // Final setup after all resources are loaded
    setTimeout(() => {
        document.querySelector('.customer-container').style.opacity = '1';
    }, 100);
});

// Update Details Management - Comprehensive OTP-based Update System
let currentEditField = '';
let currentEditFieldName = '';
let currentEditValue = '';
let newEditValue = '';
let currentUpdateType = ''; // 'customer' or 'account'
let isUpdateInProgress = false; // Flag to track if update is in progress
let otpTimer = null;
let otpTimeLeft = 300; // 5 minutes in seconds
let fieldMappings = {}; // Field mappings for DB field names
let accountFieldMappings = {}; // Account field mappings for DB field names

// Initialize field mappings for database field names
function initializeFieldMappings() {
    // Customer fields that can be updated
    fieldMappings = {
        'title': 'title',
        'firstName': 'firstName',
        'middleName': 'middleName',
        'lastName': 'lastName',
        'mobile': 'mobileNo',
        'email': 'email',
        'residential': 'residentialAddress',
        'permanent': 'permanentAddress',
        'occupation': 'occupation',
        'income': 'annualIncome'
        // Note: dob, aadhar, pan, customerId are protected fields
    };

    // Account fields that can be updated  
    accountFieldMappings = {
        'accountType': 'accountType',
        'status': 'status',
        'transactionPassword': 'transactionPassword'
        // Note: accountNo, balance, applicationDate are protected fields
    };

    console.log('🔧 Field mappings initialized');
    console.log('👤 Customer fields:', fieldMappings);
    console.log('🏦 Account fields:', accountFieldMappings);
}

// Open edit modal
function openEditModal(field, fieldName) {
    console.log('📝 ========== OPENING EDIT MODAL ==========');
    console.log('📝 Field:', field, 'Field Name:', fieldName);

    // Initialize field mappings to determine update type
    initializeFieldMappings();

    // Determine if this is a customer or account field
    if (fieldMappings[field]) {
        currentUpdateType = 'customer';
        console.log('👤 Customer field detected');
    } else if (accountFieldMappings[field]) {
        currentUpdateType = 'account';
        console.log('🏦 Account field detected');
    } else {
        console.error('❌ Unknown field type:', field);
        showNotification('Invalid field selected for update', 'error');
        return;
    }

    currentEditField = field;
    currentEditFieldName = fieldName;
    currentEditValue = document.getElementById(`edit-${field}`).textContent.trim();

    console.log('📝 Update type:', currentUpdateType);
    console.log('📝 Current value:', currentEditValue);

    document.getElementById('editModalTitle').textContent = `Edit ${fieldName}`;
    document.getElementById('editFieldLabel').textContent = fieldName;
    document.getElementById('editFieldInput').value = currentEditValue;

    // Show modal with animation
    const modal = document.getElementById('editModal');
    modal.style.display = 'flex';
    setTimeout(() => {
        modal.classList.add('active');
    }, 10);

    // Focus on input
    setTimeout(() => {
        document.getElementById('editFieldInput').focus();
    }, 300);

    console.log('📝 Edit modal opened successfully');
}

// Close edit modal
function closeEditModal() {
    console.log('📝 Closing edit modal');
    const modal = document.getElementById('editModal');
    modal.classList.remove('active');
    setTimeout(() => {
        modal.style.display = 'none';

        // Only clear values if update is not in progress
        if (!isUpdateInProgress) {
            currentEditField = '';
            currentEditFieldName = '';
            currentEditValue = '';
            newEditValue = '';
            currentUpdateType = '';
        }
    }, 300);
}

// Send OTP for update - Step 1: Validate and send OTP
async function sendOTPForUpdate() {
    console.log('🔐 ========== STARTING UPDATE PROCESS ==========');

    // Set update in progress flag
    isUpdateInProgress = true;

    newEditValue = document.getElementById('editFieldInput').value.trim();

    if (!newEditValue) {
        showNotification('Please enter a valid value', 'error');
        isUpdateInProgress = false; // Reset flag on error
        return;
    }

    if (newEditValue === currentEditValue) {
        showNotification('No changes detected', 'info');
        isUpdateInProgress = false; // Reset flag on no change
        return;
    }

    console.log('🔐 Field to update:', currentEditField);
    console.log('🔐 Current value:', currentEditValue);
    console.log('🔐 New value:', newEditValue);
    console.log('🔐 Customer email:', customerProfile.email);

    // Validate that we have customer data
    if (!customerProfile || !customerProfile.email) {
        showNotification('Customer data not available. Please refresh the page.', 'error');
        return;
    }

    // Close edit modal
    closeEditModal();

    // Show loading notification
    showNotification('Sending OTP to your registered email...', 'info');

    try {
        // Send OTP to customer's email
        console.log('📧 Sending OTP to:', customerProfile.email);
        const otpResponse = await dbService.sendOTP(customerProfile.email);

        console.log('📧 ========== OTP SEND RESPONSE ==========');
        console.log('Success:', otpResponse.success);
        console.log('Status:', otpResponse.status);
        console.log('Data:', otpResponse.data);
        console.log('Error:', otpResponse.error);
        console.log('📧 ===================================');

        if (otpResponse.success || otpResponse.status === 200) {
            console.log('✅ OTP sent successfully');
            const successMessage = otpResponse.data?.message || 'OTP sent to your email successfully!';
            showNotification(successMessage, 'success');

            // Show OTP modal after successful send
            setTimeout(() => {
                showOTPModal();
            }, 400);
        } else {
            console.log('❌ Failed to send OTP');
            const errorMessage = dbService.getErrorMessage(otpResponse.error);
            showNotification('Failed to send OTP: ' + errorMessage, 'error');
        }

    } catch (error) {
        console.error('❌ Error sending OTP:', error);
        showNotification('Failed to send OTP. Please try again.', 'error');
    }
}

// Show OTP modal
function showOTPModal() {
    console.log('📱 ========== SHOWING OTP MODAL ==========');
    const modal = document.getElementById('otpModal');
    modal.style.display = 'flex';
    setTimeout(() => {
        modal.classList.add('active');
    }, 10);

    // Update email address in OTP modal
    const emailElement = document.getElementById('otpEmail');
    if (emailElement) {
        emailElement.textContent = customerProfile.email;
    }

    // Clear previous OTP inputs
    document.querySelectorAll('.otp-input').forEach(input => {
        input.value = '';
        input.classList.remove('filled');
    });

    // Start OTP timer
    startOTPTimer();

    // Focus on first OTP input
    setTimeout(() => {
        document.querySelector('.otp-input').focus();
    }, 300);
}

// Close OTP modal
function closeOTPModal() {
    const modal = document.getElementById('otpModal');
    modal.classList.remove('active');
    setTimeout(() => {
        modal.style.display = 'none';
        clearOTPTimer();
    }, 300);
}

// Start OTP timer
function startOTPTimer() {
    otpTimeLeft = 300; // Reset to 5 minutes
    updateTimerDisplay();

    otpTimer = setInterval(() => {
        otpTimeLeft--;
        updateTimerDisplay();

        if (otpTimeLeft <= 0) {
            clearOTPTimer();
            showNotification('OTP expired. Please request a new one.', 'error');
            closeOTPModal();
        }
    }, 1000);
}

// Clear OTP timer
function clearOTPTimer() {
    if (otpTimer) {
        clearInterval(otpTimer);
        otpTimer = null;
    }
}

// Update timer display
function updateTimerDisplay() {
    const minutes = Math.floor(otpTimeLeft / 60);
    const seconds = otpTimeLeft % 60;
    const display = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    document.getElementById('otpTimer').textContent = display;

    // Change color when time is running out
    const timerElement = document.getElementById('otpTimer');
    if (otpTimeLeft <= 60) {
        timerElement.style.color = 'var(--error)';
        timerElement.style.animation = 'timerPulse 0.5s infinite';
    } else {
        timerElement.style.color = 'var(--warning)';
        timerElement.style.animation = 'timerPulse 1s infinite';
    }
}

// Handle OTP input
function handleOTPInput(input, index) {
    const value = input.value;

    // Only allow numbers
    if (!/^\d$/.test(value)) {
        input.value = '';
        return;
    }

    // Add filled class
    if (value) {
        input.classList.add('filled');

        // Move to next input
        if (index < 5) {
            const nextInput = document.querySelectorAll('.otp-input')[index + 1];
            nextInput.focus();
        }
    } else {
        input.classList.remove('filled');
    }

    // Auto-verify when all fields are filled
    const allInputs = document.querySelectorAll('.otp-input');
    const allFilled = Array.from(allInputs).every(inp => inp.value.length === 1);

    if (allFilled) {
        setTimeout(() => {
            verifyOTPAndUpdate();
        }, 500);
    }
}

// Handle OTP input keydown (for backspace)
function handleOTPKeydown(event, index) {
    if (event.key === 'Backspace' && !event.target.value && index > 0) {
        const prevInput = document.querySelectorAll('.otp-input')[index - 1];
        prevInput.focus();
        prevInput.value = '';
        prevInput.classList.remove('filled');
    }
}

// Add keydown listeners to OTP inputs
document.addEventListener('DOMContentLoaded', function () {
    const otpInputs = document.querySelectorAll('.otp-input');
    otpInputs.forEach((input, index) => {
        input.addEventListener('keydown', (e) => handleOTPKeydown(e, index));
    });
});

// Verify OTP and update - Step 2: Verify OTP and update field
async function verifyOTPAndUpdate() {
    console.log('🔐 ========== VERIFYING OTP AND UPDATING ==========');
    console.log('🔐 Before OTP verification - Update Type:', currentUpdateType);
    console.log('🔐 Before OTP verification - Field:', currentEditField);
    console.log('🔐 Before OTP verification - New Value:', newEditValue);
    console.log('🔐 Before OTP verification - Update in progress:', isUpdateInProgress);

    const otpInputs = document.querySelectorAll('.otp-input');
    const otp = Array.from(otpInputs).map(input => input.value).join('');

    if (otp.length !== 6) {
        showNotification('Please enter complete OTP', 'error');
        return;
    }

    console.log('🔐 Entered OTP:', otp);
    console.log('🔐 Customer email:', customerProfile.email);

    // Show loading state
    const verifyBtn = document.querySelector('.verify-btn-primary');
    const originalText = verifyBtn.innerHTML;
    verifyBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Verifying...';
    verifyBtn.disabled = true;

    try {
        // Step 1: Verify OTP with backend
        console.log('📧 Verifying OTP with backend...');
        const verifyResponse = await dbService.verifyOTP(customerProfile.email, otp);

        console.log('🔐 ========== OTP VERIFICATION RESPONSE ==========');
        console.log('Raw verifyResponse:', verifyResponse);
        console.log('Success:', verifyResponse.success);
        console.log('Status:', verifyResponse.status);
        console.log('Status type:', typeof verifyResponse.status);
        console.log('Data:', verifyResponse.data);
        console.log('Data type:', typeof verifyResponse.data);
        console.log('Data status (if nested):', verifyResponse.data ? verifyResponse.data.status : 'N/A');
        console.log('Data message (if nested):', verifyResponse.data ? verifyResponse.data.message : 'N/A');
        console.log('Error:', verifyResponse.error);
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
        } else if (verifyResponse.data && verifyResponse.data.status === true) {
            // Handle case where API returns status: true directly in data
            isVerified = true;
        } else if (verifyResponse.status === true) {
            // Handle case where API returns status: true directly in response
            isVerified = true;
        } else if (verifyResponse.message && verifyResponse.message.toLowerCase().includes('verified')) {
            // Handle case where message is directly in response
            isVerified = true;
        }

        console.log('🔐 Final verification result:', isVerified);

        if (isVerified) {
            console.log('✅ OTP verified successfully! Proceeding to update field...');
            console.log('🔐 Just before performFieldUpdate - Update Type:', currentUpdateType);
            console.log('🔐 Just before performFieldUpdate - Field:', currentEditField);
            console.log('🔐 Just before performFieldUpdate - New Value:', newEditValue);
            console.log('🔐 Just before performFieldUpdate - Update in progress:', isUpdateInProgress);

            // Step 2: Update the field after successful OTP verification
            await performFieldUpdate();

        } else {
            console.log('❌ OTP verification failed');
            // Reset button state
            verifyBtn.innerHTML = originalText;
            verifyBtn.disabled = false;

            // Reset update flag on OTP failure
            isUpdateInProgress = false;

            const errorMessage = (verifyResponse.data && verifyResponse.data.message) || 'Invalid OTP. Please try again.';
            showNotification(errorMessage, 'error');

            // Shake OTP inputs and clear them
            otpInputs.forEach(input => {
                input.style.animation = 'shake 0.5s ease-in-out';
                input.classList.remove('filled');
                input.value = '';
            });

            setTimeout(() => {
                otpInputs.forEach(input => {
                    input.style.animation = '';
                });
                otpInputs[0].focus();
            }, 500);
        }

    } catch (error) {
        console.error('❌ Error verifying OTP:', error);

        // Reset update flag on error
        isUpdateInProgress = false;

        // Reset button state
        verifyBtn.innerHTML = originalText;
        verifyBtn.disabled = false;

        showNotification('Failed to verify OTP. Please try again.', 'error');

        // Clear OTP inputs
        otpInputs.forEach(input => input.value = '');
        otpInputs[0].focus();
    }
}

// Perform field update after OTP verification - Step 3: Update the field
async function performFieldUpdate() {
    console.log('🔄 ========== PERFORMING FIELD UPDATE ==========');
    console.log('🔄 Update Type:', currentUpdateType);
    console.log('🔄 Field:', currentEditField);
    console.log('🔄 New Value:', newEditValue);
    console.log('🔄 Update in progress flag:', isUpdateInProgress);

    // Additional debugging
    console.log('🔄 Debug - currentEditField type:', typeof currentEditField);
    console.log('🔄 Debug - currentEditField length:', currentEditField ? currentEditField.length : 'N/A');
    console.log('🔄 Debug - currentEditField value:', `"${currentEditField}"`);

    // Validate required fields before proceeding
    if (!currentEditField || currentEditField.trim() === '') {
        console.error('❌ currentEditField is empty or null');
        showNotification('Field information is missing. Please try again.', 'error');
        isUpdateInProgress = false;
        return;
    }

    if (!currentUpdateType || currentUpdateType.trim() === '') {
        console.error('❌ currentUpdateType is empty or null');
        showNotification('Update type information is missing. Please try again.', 'error');
        isUpdateInProgress = false;
        return;
    }

    if (!newEditValue && newEditValue !== '') {
        console.error('❌ newEditValue is null or undefined');
        showNotification('New value information is missing. Please try again.', 'error');
        isUpdateInProgress = false;
        return;
    }

    // Test server connectivity before proceeding - Skip for now to avoid errors
    // const connectivity = await testServerConnectivity();
    // if (!connectivity.connected) {
    //     showNotification('Server is not reachable. Please try again later.', 'error');
    //     isUpdateInProgress = false;
    //     return;
    // }

    try {
        showNotification('Updating your information...', 'info');

        let updateResponse;

        if (currentUpdateType === 'customer') {
            // Update customer field
            console.log('👤 Updating customer field...');

            // Initialize field mappings
            initializeFieldMappings();

            // Debug field mappings
            console.log('🔧 Customer field mappings after init:', fieldMappings);
            console.log('🔧 Available customer fields:', Object.keys(fieldMappings));
            console.log('🔧 Looking for field:', currentEditField);

            // Get the database field name
            const dbFieldName = fieldMappings[currentEditField];

            if (!dbFieldName) {
                console.error('❌ No database mapping found for customer field:', currentEditField);
                console.error('❌ Available fields are:', Object.keys(fieldMappings));
                showNotification('Invalid customer field selected for update', 'error');
                isUpdateInProgress = false;
                return;
            }

            console.log('🔄 Customer database field name:', dbFieldName);
            console.log('🔄 Customer ID:', currentCustomerID);
            console.log('🔄 New value to send:', newEditValue);
            console.log('🔄 Value type:', typeof newEditValue);

            // Validate data before sending request
            if (!currentCustomerID) {
                console.error('❌ Customer ID is missing');
                showNotification('Customer ID is missing. Please refresh the page.', 'error');
                isUpdateInProgress = false;
                return;
            }

            updateResponse = await dbService.updateCustomerField(currentCustomerID, dbFieldName, newEditValue);

        } else if (currentUpdateType === 'account') {
            // Update account field
            console.log('🏦 Updating account field...');

            // Get account number from accountInfo
            if (!accountInfo || !accountInfo.accountNo) {
                console.error('❌ Account information not available');
                showNotification('Account information not available. Please refresh the page.', 'error');
                return;
            }

            // Get the database field name
            const dbFieldName = accountFieldMappings[currentEditField];

            if (!dbFieldName) {
                console.error('❌ No database mapping found for account field:', currentEditField);
                showNotification('Invalid account field selected for update', 'error');
                return;
            }

            console.log('🔄 Account database field name:', dbFieldName);
            console.log('🔄 Account Number:', accountInfo.accountNo);
            console.log('🔄 New value to send:', newEditValue);
            console.log('🔄 Value type:', typeof newEditValue);

            // Validate data before sending request
            if (!accountInfo.accountNo) {
                console.error('❌ Account number is missing');
                showNotification('Account number is missing. Please refresh the page.', 'error');
                isUpdateInProgress = false;
                return;
            }

            updateResponse = await dbService.updateAccountField(accountInfo.accountNo, dbFieldName, newEditValue);

        } else {
            console.error('❌ Invalid update type:', currentUpdateType);
            showNotification('Invalid update type', 'error');
            return;
        }

        console.log('🔄 ========== UPDATE FIELD RESPONSE ==========');
        console.log('Raw response object:', updateResponse);
        console.log('Success:', updateResponse.success);
        console.log('Status:', updateResponse.status);
        console.log('Status type:', typeof updateResponse.status);
        console.log('Updated Data:', updateResponse.data);
        console.log('Data type:', typeof updateResponse.data);
        console.log('Data status (if nested):', updateResponse.data ? updateResponse.data.status : 'N/A');
        console.log('Data message (if nested):', updateResponse.data ? updateResponse.data.message : 'N/A');
        console.log('Error:', updateResponse.error);
        console.log('🔄 ========================================');

        // Check multiple conditions for success
        const isSuccess = updateResponse.success || 
                         updateResponse.status === 200 || 
                         updateResponse.status === true ||
                         (updateResponse.data && updateResponse.data.status === true) ||
                         (updateResponse.data && updateResponse.data.status === 200) ||
                         (updateResponse.data && updateResponse.data.message && 
                          updateResponse.data.message.toLowerCase().includes('success'));

        console.log('🔍 Final success evaluation:', isSuccess);

        if (isSuccess) {
            console.log('✅ Field updated successfully!');

            // Determine the actual updated data
            let updatedData = updateResponse.data;
            
            // If the data contains the status and message (like OTP response format)
            // but no actual user data, we need to fetch fresh data
            if (updatedData && updatedData.status === true && updatedData.message && !updatedData.customerId && !updatedData.accountNo) {
                console.log('📝 Response contains confirmation but no user data. Will fetch fresh data instead.');
                updatedData = null; // This will trigger fresh data fetch below
            }

            // Update session storage with new data
            if (updatedData && (updatedData.customerId || updatedData.accountNo)) {
                console.log('💾 Updating sessionStorage with new data...');

                if (currentUpdateType === 'customer') {
                    // Update customer data in sessionStorage
                    sessionStorage.setItem('customerData', JSON.stringify(updateResponse.data));

                    // Update global customerProfile object
                    customerProfile = updateResponse.data;
                    console.log('💾 Updated customerProfile:', customerProfile);

                } else if (currentUpdateType === 'account') {
                    // For account updates, the response includes the full account with nested customer
                    if (updateResponse.data.customer) {
                        // Update customer data from the nested customer object
                        sessionStorage.setItem('customerData', JSON.stringify(updateResponse.data.customer));
                        customerProfile = updateResponse.data.customer;
                        console.log('💾 Updated customerProfile from account response:', customerProfile);
                    }

                    // Update account data (remove nested customer to avoid duplication)
                    const accountData = { ...updateResponse.data };
                    delete accountData.customer; // Remove nested customer object

                    sessionStorage.setItem('accountData', JSON.stringify(accountData));
                    accountInfo = accountData;
                    console.log('💾 Updated accountInfo:', accountInfo);
                }
            } else {
                console.log('📝 No user data in response or incomplete data - will fetch fresh data');
            }

            // Close OTP modal
            clearOTPTimer();
            closeOTPModal();

            // Show success modal after short delay
            setTimeout(() => {
                updateUIWithNewValue();
                showSuccessModal(`${currentEditFieldName} updated successfully!`);

                // Reset update flag and clear fields after successful update
                isUpdateInProgress = false;
                currentEditField = '';
                currentEditFieldName = '';
                currentEditValue = '';
                newEditValue = '';
                currentUpdateType = '';

                // Refresh all sections with new data - Force refresh regardless
                setTimeout(() => {
                    console.log('🔄 Force refreshing all data...');
                    loadCustomerProfile();
                    populateProfileForm();
                    loadUpdateDetailsData();
                    loadAccountInfo(); // Refresh account info if it was updated
                }, 1000);
            }, 400);

        } else {
            console.log('❌ Field update failed');
            console.log('❌ Update response details:');
            console.log('  - Success:', updateResponse.success);
            console.log('  - Status:', updateResponse.status);
            console.log('  - Error:', updateResponse.error);
            console.log('  - Data:', updateResponse.data);

            const errorMessage = updateResponse.error || 'Unknown error occurred';
            showNotification('Failed to update information: ' + errorMessage, 'error');

            // Reset update flag on failure
            isUpdateInProgress = false;

            // Close OTP modal
            clearOTPTimer();
            closeOTPModal();
        }

    } catch (error) {
        console.error('❌ Error updating field:', error);
        showNotification('Failed to update information. Please try again.', 'error');

        // Reset update flag on error
        isUpdateInProgress = false;

        // Close OTP modal
        clearOTPTimer();
        closeOTPModal();
    }
}

// Update UI with new value
function updateUIWithNewValue() {
    console.log('🎨 Updating UI with new value...');
    console.log('🎨 Update Type:', currentUpdateType);
    console.log('🎨 Field:', currentEditField);
    console.log('🎨 New Value:', newEditValue);

    // Update the field in the update details section
    const editElement = document.getElementById(`edit-${currentEditField}`);
    if (editElement) {
        editElement.textContent = newEditValue;
        console.log('✅ Updated edit element:', currentEditField, 'with value:', newEditValue);

        // Add highlight effect
        editElement.style.backgroundColor = '#e8f5e8';
        editElement.style.transition = 'all 0.3s ease';

        setTimeout(() => {
            editElement.style.backgroundColor = '';
        }, 2000);
    }

    // Update corresponding fields in dashboard if they exist
    if (currentUpdateType === 'customer') {
        const dashboardMappings = {
            'firstName': 'firstName',
            'middleName': 'middleName',
            'lastName': 'lastName',
            'mobile': 'mobileNumber',
            'email': 'emailAddress',
            'residential': 'residentialAddress',
            'permanent': 'permanentAddress',
            'occupation': 'occupation',
            'income': 'annualIncome'
        };

        const dashboardElementId = dashboardMappings[currentEditField];
        if (dashboardElementId) {
            const dashboardElement = document.getElementById(dashboardElementId);
            if (dashboardElement) {
                dashboardElement.textContent = newEditValue;
                console.log('✅ Updated dashboard element:', dashboardElementId, 'with value:', newEditValue);
            }
        }

        // Update the data in customerProfile
        switch (currentEditField) {
            case 'title':
                customerProfile.title = newEditValue;
                break;
            case 'firstName':
                customerProfile.firstName = newEditValue;
                break;
            case 'middleName':
                customerProfile.middleName = newEditValue;
                break;
            case 'lastName':
                customerProfile.lastName = newEditValue;
                break;
            case 'mobile':
                customerProfile.mobileNo = newEditValue;
                break;
            case 'email':
                customerProfile.email = newEditValue;
                break;
            case 'residential':
                customerProfile.residentialAddress = newEditValue;
                break;
            case 'permanent':
                customerProfile.permanentAddress = newEditValue;
                break;
            case 'occupation':
                customerProfile.occupation = newEditValue;
                break;
            case 'income':
                customerProfile.annualIncome = newEditValue;
                break;
        }


        // Update field value (Legacy function - now handled by updateUIWithNewValue)
        function updateFieldValue() {
            console.log('📝 Legacy updateFieldValue called - using new implementation');
            updateUIWithNewValue();
        }

        // Update the data in customerProfile if needed
        switch (currentEditField) {
            case 'title':
                customerProfile.title = newEditValue;
                break;
            case 'firstName':
                customerProfile.firstName = newEditValue;
                break;
            case 'middleName':
                customerProfile.middleName = newEditValue;
                break;
            case 'lastName':
                customerProfile.lastName = newEditValue;
                break;
            case 'dob':
                customerProfile.dob = newEditValue;
                break;
            case 'mobile':
                customerProfile.mobileNo = newEditValue;
                break;
            case 'email':
                customerProfile.email = newEditValue;
                break;
            case 'residential':
                customerProfile.residentialAddress = newEditValue;
                break;
            case 'permanent':
                customerProfile.permanentAddress = newEditValue;
                break;
            case 'occupation':
                customerProfile.occupation = newEditValue;
                break;
            case 'income':
                customerProfile.annualIncome = newEditValue;
                break;
        }

    } else if (currentUpdateType === 'account') {
        const accountDashboardMappings = {
            'accountType': 'accountTypeDisplay',
            'status': 'accountStatus'
        };

        const dashboardElementId = accountDashboardMappings[currentEditField];
        if (dashboardElementId) {
            const dashboardElement = document.getElementById(dashboardElementId);
            if (dashboardElement) {
                dashboardElement.textContent = newEditValue;
                console.log('✅ Updated account dashboard element:', dashboardElementId, 'with value:', newEditValue);
            }
        }

        // Update the data in accountInfo
        switch (currentEditField) {
            case 'accountType':
                accountInfo.accountType = newEditValue;
                break;
            case 'status':
                accountInfo.status = newEditValue;
                break;
        }
    }

    // Add update animation
    const fieldElement = document.getElementById(`edit-${currentEditField}`);
    if (fieldElement) {
        fieldElement.style.background = 'rgba(34, 197, 94, 0.2)';
        fieldElement.style.transform = 'scale(1.05)';
        fieldElement.style.transition = 'all 0.3s ease';

        setTimeout(() => {
            fieldElement.style.background = '';
            fieldElement.style.transform = '';
        }, 1000);
    }

    console.log('✅ UI updated successfully with new value');
}

// Resend OTP - Enhanced with backend integration
async function resendOTP() {
    console.log('🔄 ========== RESENDING OTP ==========');

    // Validate that we have customer data
    if (!customerProfile || !customerProfile.email) {
        showNotification('Customer data not available. Please refresh the page.', 'error');
        return;
    }

    // Show loading state
    const resendBtn = document.querySelector('.resend-btn-secondary');
    const originalText = resendBtn.innerHTML;
    resendBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    resendBtn.disabled = true;

    try {
        console.log('📧 Resending OTP to:', customerProfile.email);
        showNotification('Resending OTP...', 'info');

        const otpResponse = await dbService.sendOTP(customerProfile.email);

        console.log('🔄 ========== RESEND OTP RESPONSE ==========');
        console.log('Success:', otpResponse.success);
        console.log('Status:', otpResponse.status);
        console.log('Data:', otpResponse.data);
        console.log('Error:', otpResponse.error);
        console.log('🔄 =====================================');

        if (otpResponse.success || otpResponse.status === 200) {
            const successMessage = otpResponse.data?.message || 'OTP resent successfully!';
            showNotification(successMessage, 'success');

            // Restart timer
            startOTPTimer();

            // Clear OTP inputs
            document.querySelectorAll('.otp-input').forEach(input => {
                input.value = '';
                input.classList.remove('filled');
            });

            // Focus first input
            setTimeout(() => {
                document.querySelector('.otp-input').focus();
            }, 100);
        } else {
            const errorMessage = dbService.getErrorMessage(otpResponse.error);
            showNotification(errorMessage, 'error');
        }

    } catch (error) {
        console.error('❌ Error resending OTP:', error);
        showNotification('Failed to resend OTP. Please try again.', 'error');
    } finally {
        // Reset button state
        resendBtn.innerHTML = originalText;
        resendBtn.disabled = false;
    }
}

// Show success modal - Enhanced with custom message
function showSuccessModal(message = null) {
    console.log('🎉 ========== SHOWING SUCCESS MODAL ==========');

    const successMessageElement = document.getElementById('successMessage');
    if (message) {
        successMessageElement.textContent = message;
    } else {
        const fieldName = currentEditFieldName || 'Information';
        successMessageElement.textContent = `Your ${fieldName.toLowerCase()} has been updated successfully.`;
    }

    const modal = document.getElementById('successModal');
    modal.style.display = 'flex';
    setTimeout(() => {
        modal.classList.add('active');
    }, 10);
}

// Close success modal
function closeSuccessModal() {
    const modal = document.getElementById('successModal');
    modal.classList.remove('active');
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);
}

// Load update details data
function loadUpdateDetailsData() {
    try {
        console.log('📝 ========== LOADING UPDATE DETAILS DATA ==========');
        console.log('👤 Customer Profile:', customerProfile);
        console.log('🏦 Account Info:', accountInfo);

        // Load all current customer values into edit fields
        if (customerProfile && typeof customerProfile === 'object') {
            document.getElementById('edit-customerId').textContent = customerProfile.customerId || customerProfile.customerID || '';
            document.getElementById('edit-title').textContent = customerProfile.title || '';
            document.getElementById('edit-firstName').textContent = customerProfile.firstName || '';
            document.getElementById('edit-middleName').textContent = customerProfile.middleName || '';
            document.getElementById('edit-lastName').textContent = customerProfile.lastName || '';
            document.getElementById('edit-dob').textContent = customerProfile.dob || '';
            document.getElementById('edit-mobile').textContent = customerProfile.mobileNo || '';
            document.getElementById('edit-email').textContent = customerProfile.email || '';
            document.getElementById('edit-residential').textContent = customerProfile.residentialAddress || '';
            document.getElementById('edit-permanent').textContent = customerProfile.permanentAddress || '';
            document.getElementById('edit-occupation').textContent = customerProfile.occupation || '';

            // Format annual income
            const annualIncome = customerProfile.annualIncome || 0;
            const formattedIncome = `₹${annualIncome.toLocaleString('en-IN')}`;
            document.getElementById('edit-income').textContent = formattedIncome;

            document.getElementById('edit-aadhar').textContent = customerProfile.aadharNo || '';
            document.getElementById('edit-pan').textContent = customerProfile.panNo || '';

            console.log('✅ Customer profile fields populated in update details');
        } else {
            // Fallback: try to get directly from session storage
            console.warn('⚠️ Customer profile not available from global variable, trying sessionStorage...');
            try {
                const sessionCustomerData = sessionStorage.getItem('customerData');
                if (sessionCustomerData) {
                    const parsedCustomerData = JSON.parse(sessionCustomerData);
                    if (parsedCustomerData && typeof parsedCustomerData === 'object') {
                        document.getElementById('edit-customerId').textContent = parsedCustomerData.customerId || parsedCustomerData.customerID || '';
                        document.getElementById('edit-title').textContent = parsedCustomerData.title || '';
                        document.getElementById('edit-firstName').textContent = parsedCustomerData.firstName || '';
                        document.getElementById('edit-middleName').textContent = parsedCustomerData.middleName || '';
                        document.getElementById('edit-lastName').textContent = parsedCustomerData.lastName || '';
                        document.getElementById('edit-dob').textContent = parsedCustomerData.dob || '';
                        document.getElementById('edit-mobile').textContent = parsedCustomerData.mobileNo || '';
                        document.getElementById('edit-email').textContent = parsedCustomerData.email || '';
                        document.getElementById('edit-residential').textContent = parsedCustomerData.residentialAddress || '';
                        document.getElementById('edit-permanent').textContent = parsedCustomerData.permanentAddress || '';
                        document.getElementById('edit-occupation').textContent = parsedCustomerData.occupation || '';

                        // Format annual income
                        const annualIncome = parsedCustomerData.annualIncome || 0;
                        const formattedIncome = `₹${annualIncome.toLocaleString('en-IN')}`;
                        document.getElementById('edit-income').textContent = formattedIncome;

                        document.getElementById('edit-aadhar').textContent = parsedCustomerData.aadharNo || '';
                        document.getElementById('edit-pan').textContent = parsedCustomerData.panNo || '';
                        console.log('✅ Customer profile fields populated from sessionStorage fallback');
                    }
                }
            } catch (e) {
                console.error('❌ Error parsing customer data from session storage for update details:', e);
            }
        }

        // Load all current account values into edit fields
        if (accountInfo && typeof accountInfo === 'object') {
            document.getElementById('edit-accountNo').textContent = accountInfo.accountNo || '';
            document.getElementById('edit-accountType').textContent = accountInfo.accountType || '';
            document.getElementById('edit-status').textContent = accountInfo.status || '';

            console.log('✅ Account info fields populated in update details');
        } else {
            // Fallback: try to get directly from session storage
            console.warn('⚠️ Account info not available from global variable, trying sessionStorage...');
            try {
                const sessionAccountData = sessionStorage.getItem('accountData');
                if (sessionAccountData) {
                    const parsedAccountData = JSON.parse(sessionAccountData);
                    if (parsedAccountData && typeof parsedAccountData === 'object') {
                        document.getElementById('edit-accountNo').textContent = parsedAccountData.accountNo || '';
                        document.getElementById('edit-accountType').textContent = parsedAccountData.accountType || '';
                        document.getElementById('edit-status').textContent = parsedAccountData.status || '';
                        console.log('✅ Account info fields populated from sessionStorage fallback');
                    }
                }
            } catch (e) {
                console.error('❌ Error parsing account data from session storage for update details:', e);
            }
        }

        // Animate cards
        animateUpdateCards();

        console.log('✅ Update details data loaded successfully');
        console.log('📝 ==========================================');

    } catch (error) {
        console.error('❌ Error loading update details:', error);
        showErrorMessage('Error loading update details', 'error');
    }
}

// Animate update cards
function animateUpdateCards() {
    const cards = document.querySelectorAll('.update-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';

        setTimeout(() => {
            card.style.transition = 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 200);
    });
}

// Add shake animation to CSS
const shakeStyle = document.createElement('style');
shakeStyle.innerHTML = `
@keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    75% { transform: translateX(5px); }
}
`;
document.head.appendChild(shakeStyle);

// Debug function to show current session storage values
function debugSessionStorage() {
    console.log('🔍 ========== SESSION STORAGE DEBUG ==========');
    console.log('📊 SessionStorage length:', sessionStorage.length);

    // Check specific required items
    const requiredItems = ['customerID', 'customerData', 'accountData'];

    requiredItems.forEach((itemName) => {
        const value = sessionStorage.getItem(itemName);
        console.log(`📊 ${itemName}:`, value);

        if (value && (itemName === 'customerData' || itemName === 'accountData')) {
            try {
                const parsed = JSON.parse(value);
                console.log(`📊 ${itemName} parsed:`, parsed);
            } catch (e) {
                console.error(`❌ Error parsing ${itemName}:`, e);
            }
        }
    });

    // Show global variables
    console.log('🌐 Global customerProfile:', customerProfile);
    console.log('🌐 Global customerProfile.customerId:', customerProfile?.customerId);
    console.log('🌐 Global customerProfile.customerID:', customerProfile?.customerID);
    console.log('🌐 Global accountInfo:', accountInfo);
    console.log('🌐 Global currentCustomerID:', currentCustomerID);
    console.log('🔍 ==========================================');
}

// Call debug function to help troubleshoot
window.debugSessionStorage = debugSessionStorage;

// Function to manually refresh data from session storage
function refreshDataFromSessionStorage() {
    console.log('🔄 ========== REFRESHING DATA FROM SESSION STORAGE ==========');

    try {
        // Get customer data from session storage
        const sessionCustomerData = sessionStorage.getItem('customerData');
        if (sessionCustomerData) {
            customerProfile = JSON.parse(sessionCustomerData);
            console.log('✅ Refreshed customer profile from sessionStorage:', customerProfile);
        } else {
            console.warn('⚠️ No customer data found in sessionStorage');
        }

        // Get account data from session storage  
        const sessionAccountData = sessionStorage.getItem('accountData');
        if (sessionAccountData) {
            accountInfo = JSON.parse(sessionAccountData);
            console.log('✅ Refreshed account info from sessionStorage:', accountInfo);
        } else {
            console.warn('⚠️ No account data found in sessionStorage');
        }

        // Get customer ID from session storage
        const sessionCustomerID = sessionStorage.getItem('customerID');
        if (sessionCustomerID) {
            currentCustomerID = sessionCustomerID;
            console.log('✅ Refreshed customer ID from sessionStorage:', currentCustomerID);
        } else {
            console.warn('⚠️ No customer ID found in sessionStorage');
        }

        // Reload all UI components
        loadCustomerProfile();
        loadAccountInfo();
        loadUpdateDetailsData();

        console.log('✅ Data refresh completed');
        console.log('🔄 ==========================================');

    } catch (error) {
        console.error('❌ Error refreshing data from session storage:', error);
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const payeeSelect = document.getElementById('payeeSelect');
    let payeeList = [];
    let selectedPayee = null;
    // PAYEE TRANSFER: Validation and submission logic
    window.processPayeeTransfer = async function () {

        const payeeAmount = document.getElementById('payeeAmount');
        const payeeRemark = document.getElementById('payeeRemark');
        const payeeTransferBtn = document.getElementById('payeeTransferBtn');
        const payeeSelect = document.getElementById('payeeSelect');
        const paymentMethod = document.getElementById('paymentMethod');
        const payeeRemarkError = document.getElementById('payeeRemarkError');
        if (!payeeAmount || !payeeRemark || !payeeTransferBtn || !payeeSelect || !paymentMethod || !payeeRemarkError) return;
        const amount = payeeAmount.value.replace(/[^0-9.]/g, '');
        const remarks = payeeRemark.value.trim();
        // Get payee object from payeeList using selected value
        const payee = payeeList.find(p => String(p.payeeId) === payeeSelect.value);
        const payeeId = payee ? payee.payeeId : null;
        const paymentMethodValue = paymentMethod.value;
        // Validate all fields
        let hasError = false;
        if (!payeeId || !payee) {
            payeeSelect.classList.add('input-error');
            hasError = true;
        } else {
            payeeSelect.classList.remove('input-error');
        }
        if (!paymentMethodValue) {
            paymentMethod.classList.add('input-error');
            hasError = true;
        } else {
            paymentMethod.classList.remove('input-error');
        }
        if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
            payeeAmount.classList.add('input-error');
            hasError = true;
        } else {
            payeeAmount.classList.remove('input-error');
        }
        if (!remarks) {
            payeeRemarkError.textContent = 'Remarks are required';
            payeeRemarkError.style.display = 'block';
            payeeRemark.classList.add('input-error');
            payeeRemark.focus();
            hasError = true;
        } else {
            payeeRemarkError.textContent = '';
            payeeRemarkError.style.display = 'none';
            payeeRemark.classList.remove('input-error');
        }
        if (hasError) {
            payeeTransferBtn.disabled = true;
            return;
        }
        // Show password modal
        showPayeeTransferPasswordModal({
            payeeId,
            amount,
            paymentMethod: paymentMethodValue,
            remarks
        });
    }

    // Show glassmorphic modal for password entry
    function showPayeeTransferPasswordModal(transferData) {
        let modal = document.getElementById('payeeTransferPasswordModal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'payeeTransferPasswordModal';
            modal.className = 'glass-modal-overlay';
            modal.innerHTML = `
        <div class="glass-modal">
          <div class="glass-modal-icon"><i class="fas fa-lock"></i></div>
          <div class="glass-modal-title">Enter Transaction Password</div>
          <div class="glass-modal-desc">Please enter your transaction password to proceed with the transfer.</div>
          <div class="password-input-wrapper" style="position:relative;width:100%;margin-bottom:1.2rem;">
            <input type="password" id="payeeTransferPasswordInput" class="form-control password-input-bright" placeholder="Transaction Password" style="width:100%;padding:0.9rem 2.8rem 0.9rem 1.1rem;border-radius:1rem;font-size:1.08rem;background:rgba(255,255,255,0.18);color:#fff;font-weight:700;border:2px solid #1dbf73;outline:none;transition:border 0.2s,box-shadow 0.2s;">
            <button id="togglePasswordVisibility" tabindex="0" aria-label="Show/Hide Password" style="position:absolute;right:0.8rem;top:50%;transform:translateY(-50%);background:none;border:none;outline:none;cursor:pointer;color:#1dbf73;font-size:1.25rem;z-index:2;">
              <i class="fas fa-eye"></i>
            </button>
          </div>
          <div class="glass-modal-actions">
            <button class="modern-btn confirm-btn" id="confirmPayeeTransferBtn"><i class="fas fa-arrow-up"></i> Transfer</button>
            <button class="modern-btn cancel-btn" id="cancelPayeeTransferBtn"><i class="fas fa-times"></i> Cancel</button>
          </div>
        </div>
      `;
            document.body.appendChild(modal);
        }
        modal.style.display = '';
        setTimeout(() => { modal.classList.add('show'); }, 10);
        const passwordInput = document.getElementById('payeeTransferPasswordInput');
        passwordInput.value = '';
        passwordInput.focus();
        // Toggle password visibility
        const toggleBtn = document.getElementById('togglePasswordVisibility');
        let visible = false;
        toggleBtn.onclick = function () {
            visible = !visible;
            passwordInput.type = visible ? 'text' : 'password';
            toggleBtn.innerHTML = `<i class="fas fa-eye${visible ? '-slash' : ''}"></i>`;
        };
        toggleBtn.onkeydown = function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleBtn.click();
            }
        };
        passwordInput.onfocus = function () {
            passwordInput.style.border = '2px solid #43ea7a';
            passwordInput.style.boxShadow = '0 0 0 2px #43ea7a55';
        };
        passwordInput.onblur = function () {
            passwordInput.style.border = '2px solid #1dbf73';
            passwordInput.style.boxShadow = 'none';
        };
        document.getElementById('confirmPayeeTransferBtn').onclick = function () {
            const password = passwordInput.value;
            if (!password) {
                passwordInput.style.border = '2px solid #e53935';
                passwordInput.style.boxShadow = '0 0 0 2px #e5393555';
                passwordInput.focus();
                return;
            }
            modal.classList.remove('show');
            setTimeout(() => { modal.style.display = 'none'; }, 300);
            processPayeeTransferWithPassword(transferData, password);
        };
        document.getElementById('cancelPayeeTransferBtn').onclick = function () {
            modal.classList.remove('show');
            setTimeout(() => { modal.style.display = 'none'; }, 300);
        };
    }

    // Actual transfer with password
    async function processPayeeTransferWithPassword(transferData, transactionPassword) {
        const payeeTransferBtn = document.getElementById('payeeTransferBtn');
        payeeTransferBtn.disabled = true;
        payeeTransferBtn.innerHTML = '<span class="btn-icon-text"><i class="fas fa-spinner fa-spin"></i> Processing...</span>';
        const customerId = '101';
        const accountNumber = '200001';
        const url = `http://localhost:8080/api/${customerId}/${accountNumber}/payee-transfer/${transferData.payeeId}`;
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount: parseFloat(transferData.amount),
                    paymentMethod: transferData.paymentMethod,
                    remarks: transferData.remarks,
                    transactionPassword
                })
            });
            let data;
            try { data = await response.json(); } catch (e) { data = null; }
            if (typeof removeBankTransferAnimation === 'function') removeBankTransferAnimation();
            if (response.ok && data && (data.status === 'SUCCESS' || data.status === 'COMPLETED')) {
                if (typeof showBankTransferAnimation === 'function') {
                    await showBankTransferAnimation('Rs Money added');
                }
                if (typeof removeBankTransferAnimation === 'function') removeBankTransferAnimation();
                if (typeof showPayeeTransferToast === 'function') {
                    // Show the same animation as self deposit, but display only the formatted amount (e.g., '1,000.00 added')
                    let oldAnim = document.getElementById('payeeTransferAnim');
                    if (oldAnim) oldAnim.remove();
                    let anim = document.createElement('div');
                    anim.id = 'payeeTransferAnim';
                    anim.className = 'selfdeposit-anim';
                    // Format amount with commas and 2 decimals
                    let formattedAmount = '';
                    if (transferData && transferData.amount) {
                        let num = Number(transferData.amount);
                        if (!isNaN(num)) {
                            formattedAmount = num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                        }
                    }
                    anim.innerHTML = '<span class="selfdeposit-rupee"><i class="fas fa-rupee-sign"></i></span>' +
                        `<span class="selfdeposit-anim-text">${formattedAmount} transfered</span>`;
                    document.body.appendChild(anim);
                    setTimeout(() => {
                        anim.classList.add('show');
                    }, 10);
                    setTimeout(() => {
                        anim.classList.remove('show');
                        setTimeout(() => { anim.remove(); }, 500);
                    }, 2200);
                }
                // Clear form
                document.getElementById('payeeAmount').value = '';
                document.getElementById('payeeRemark').value = '';
                document.getElementById('payeeSelect').value = '';
                document.getElementById('paymentMethod').value = '';
                payeeTransferBtn.innerHTML = '<span class="btn-icon-text"><i class="fas fa-key"></i> Enter Password</span>';
                payeeTransferBtn.disabled = true;
            } else {
                showPayeeTransferToast('Transfer failed. Please try again.', 'error');
                payeeTransferBtn.innerHTML = '<span class="btn-icon-text"><i class="fas fa-key"></i> Enter Password</span>';
                payeeTransferBtn.disabled = false;
            }
        } catch (e) {
            if (typeof removeBankTransferAnimation === 'function') removeBankTransferAnimation();
            showPayeeTransferToast('Transfer failed. Please try again.', 'error');
            payeeTransferBtn.innerHTML = '<span class="btn-icon-text"><i class="fas fa-key"></i> Enter Password</span>';
            payeeTransferBtn.disabled = false;
        }
    }

    // Glassmorphic modal styles for payee transfer password
    const payeeTransferModalStyle = document.createElement('style');
    payeeTransferModalStyle.innerHTML = `
    .glass-modal-overlay {
      position: fixed;
      inset: 0;
      z-index: 99999;
      background: rgba(30,40,60,0.32);
      backdrop-filter: blur(16px) saturate(1.3);
      -webkit-backdrop-filter: blur(16px) saturate(1.3);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.4s;
      pointer-events: all;
      opacity: 0;
      pointer-events: none;
    }
    .glass-modal-overlay.show {
      opacity: 1;
      pointer-events: all;
      transition: opacity 0.3s;
    }
    .glass-modal {
      background: linear-gradient(120deg, rgba(30,40,60,0.98) 60%, rgba(52,211,153,0.18) 100%);
      border-radius: 32px;
      box-shadow: 0 8px 32px 0 rgba(30,40,60,0.22), 0 0 8px 2px rgba(52,211,153,0.13);
      padding: 2.2rem 2.5rem 1.7rem 2.5rem;
      min-width: 320px;
      min-height: 160px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 1.2rem;
      position: relative;
      opacity: 1;
      animation: fadeInScale 0.5s cubic-bezier(.4,0,.2,1);
    }
    .glass-modal-icon {
      font-size: 2.5rem;
      color: #43ea7a;
      margin-bottom: 0.5rem;
      filter: drop-shadow(0 2px 8px #1dbf73cc);
    }
    .glass-modal-title {
      font-size: 1.45rem;
      font-weight: 800;
      color: #fff;
      letter-spacing: 0.01em;
      opacity: 1;
      text-align: center;
      margin-bottom: 0.2rem;
      text-shadow: 0 2px 8px #1dbf7333, 0 0 2px #fff0;
    }
    .glass-modal-desc {
      font-size: 1.13rem;
      color: #e6ffe6;
      text-align: center;
      margin-bottom: 0.7rem;
      font-weight: 600;
      text-shadow: 0 1px 6px #1dbf7333, 0 0 2px #fff0;
    }
    .password-input-bright {
      background: rgba(255,255,255,0.18) !important;
      color: #fff !important;
      font-weight: 700 !important;
      border: 2px solid #1dbf73 !important;
      box-shadow: 0 2px 10px 0 rgba(67,234,122,0.13);
      letter-spacing: 0.04em;
      transition: border 0.2s, box-shadow 0.2s;
    }
    .password-input-bright:focus {
      border: 2px solid #43ea7a !important;
      box-shadow: 0 0 0 2px #43ea7a55 !important;
      background: rgba(67,234,122,0.09) !important;
      color: #fff !important;
    }
    .glass-modal-actions {
      display: flex;
      gap: 1.2rem;
      justify-content: center;
      margin-top: 0.5rem;
    }
    .glass-modal .modern-btn {
      min-width: 120px;
      font-size: 1.08rem;
      border-radius: 1rem;
      font-weight: 700;
      box-shadow: 0 2px 10px 0 rgba(67,234,122,0.13);
    }
    #togglePasswordVisibility {
      color: #43ea7a;
      background: none;
      border: none;
      outline: none;
      font-size: 1.25rem;
      cursor: pointer;
      transition: color 0.2s;
    }
    #togglePasswordVisibility:focus {
      color: #fff;
      outline: 2px solid #43ea7a;
    }
    @media (max-width: 700px) {
      .glass-modal {
        padding: 1.1rem 0.7rem 1.1rem 0.7rem;
        min-width: 0;
        min-height: 100px;
        border-radius: 18px;
      }
    }
  `;
    document.head.appendChild(payeeTransferModalStyle);

    // Enable/disable Payee Transfer button based on input validity
    function togglePayeeButtonState() {
        const payeeTransferBtn = document.getElementById('payeeTransferBtn');
        const paymentMethod = document.getElementById('paymentMethod');
        const payeeAmount = document.getElementById('payeeAmount');
        const payeeRemark = document.getElementById('payeeRemark');
        let valid = true;
        // Validate payee selected
        if (!payeeSelect.value || !payeeList.find(p => p.payeeId == payeeSelect.value)) valid = false;
        // Validate payment method
        if (!paymentMethod.value) valid = false;
        // Validate amount
        const amount = payeeAmount.value.replace(/[^0-9.]/g, '');
        if (!amount || isNaN(amount) || parseFloat(amount) <= 0) valid = false;
        // Validate remarks
        if (!payeeRemark.value.trim()) valid = false;
        payeeTransferBtn.disabled = !valid;
    }

    // Attach input listeners for validation
    document.getElementById('payeeAmount')?.addEventListener('input', togglePayeeButtonState);
    document.getElementById('payeeRemark')?.addEventListener('input', togglePayeeButtonState);
    document.getElementById('paymentMethod')?.addEventListener('change', togglePayeeButtonState);
    payeeSelect?.addEventListener('change', togglePayeeButtonState);

    // Make togglePayeeButtonState globally accessible for inline HTML event handlers
    window.togglePayeeButtonState = togglePayeeButtonState;

    async function fetchPayees() {
        try {
            const customerData = JSON.parse(sessionStorage.getItem("customerData")) || {};
            const customerId = customerData.customerId || '101';  // fallback to working ID

            const accountData = JSON.parse(sessionStorage.getItem("accountData")) || {};
            const accountNo = accountData.accountNo || '200001';  // fallback to working account
            
            const res = await fetch(`http://localhost:8080/api/payees/${customerId}/${accountNo}/payees`);
            if (!res.ok) throw new Error('Failed to fetch payees');
            payeeList = await res.json();
            payeeSelect.innerHTML = '<option value="">-- Select Payee --</option>';
            if (Array.isArray(payeeList) && payeeList.length > 0) {
                payeeList.forEach((payee) => {
                    const option = document.createElement('option');
                    option.value = payee.payeeId;
                    option.textContent = `${payee.payeeName} - ${payee.payeeAccountNumber}`;
                    payeeSelect.appendChild(option);
                });
            } else {
                payeeSelect.innerHTML = '<option value="">No payees found</option>';
            }
            // After fetching, re-validate button state
            togglePayeeButtonState();
        } catch (e) {
            console.error('Error fetching payees:', e);
            payeeSelect.innerHTML = '<option value="">No payees found</option>';
            showPayeeTransferToast('Could not fetch payees. Please try again.', 'error');
            togglePayeeButtonState();
        }
    }

    payeeSelect?.addEventListener('mousedown', function () {
        fetchPayees();
    });

    payeeSelect?.addEventListener('change', function () {
        const payeeId = Number(this.value);
        selectedPayee = payeeList.find(p => p.payeeId === payeeId) || null;
    });

    // Initial state
    togglePayeeButtonState();

    // --- Manage Payee Table: Fetch and render payees ---
    // async function fetchAndRenderPayeeTable() {
    //     // Just call the main renderPayeeList function
    //     await renderPayeeList();
    // }

async function fetchAndRenderPayeeTable() {
    // Just call the main renderPayeeList function
    await renderPayeeList();
}

    // Delete payee with confirmation
    window.deletePayeeConfirm = function (payeeId, payeeName) {
        showDeleteConfirmModal(payeeId, payeeName, event);
    };

    // Custom glassmorphic confirmation modal for delete
    function showDeleteConfirmModal(payeeId, payeeName, evt) {
        // Remove any existing modal
        let old = document.getElementById('deleteConfirmModal');
        if (old) old.remove();
        let modal = document.createElement('div');
        modal.id = 'deleteConfirmModal';
        modal.style.position = 'fixed';
        modal.style.top = '0';
        modal.style.left = '0';
        modal.style.width = '100vw';
        modal.style.height = '100vh';
        modal.style.background = 'rgba(20,24,32,0.32)';
        modal.style.backdropFilter = 'blur(2.5px)';
        modal.style.zIndex = '100000';
        modal.style.display = 'flex';
        modal.style.alignItems = 'center';
        modal.style.justifyContent = 'center';
        modal.innerHTML = `
    <div style="background:rgba(30,40,60,0.92);backdrop-filter:blur(18px);border-radius:22px;box-shadow:0 8px 32px 0 rgba(30,40,60,0.18);padding:2.2rem 2.5rem 2rem 2.5rem;min-width:320px;max-width:92vw;display:flex;flex-direction:column;align-items:center;">
      <div style='font-size:1.18rem;font-weight:700;color:#fff;margin-bottom:0.7rem;text-align:center;'>Delete Payee?</div>
      <div style='font-size:1.04rem;color:#f8bbbb;font-weight:500;margin-bottom:1.5rem;text-align:center;'>Are you sure you want to delete payee <span style="color:#fff;font-weight:700">'${payeeName}'</span>?</div>
      <div style='display:flex;gap:1.2rem;'>
        <button id='deletePayeeModalDeleteBtn' style='background:linear-gradient(90deg,#e53935 60%,#b71c1c 100%);color:#fff;font-weight:700;font-size:1.05rem;border:none;border-radius:12px;padding:0.7rem 2.2rem;box-shadow:0 2px 12px 0 rgba(229,57,53,0.13);cursor:pointer;transition:background 0.2s;'>Delete</button>
        <button id='deletePayeeModalCancelBtn' style='background:rgba(255,255,255,0.13);color:#fff;font-weight:600;font-size:1.05rem;border:none;border-radius:12px;padding:0.7rem 2.2rem;box-shadow:0 2px 8px 0 rgba(30,40,60,0.10);cursor:pointer;transition:background 0.2s;'>Cancel</button>
      </div>
    </div>
  `;
        document.body.appendChild(modal);
        // Focus Delete button for accessibility
        setTimeout(() => {
            document.getElementById('deletePayeeModalDeleteBtn')?.focus();
        }, 50);
        // Button handlers
        document.getElementById('deletePayeeModalDeleteBtn').onclick = function () {
            // Fade out row before deleting (if event and button exist)
            let btn = evt?.target?.closest('button') || null;
            let row = btn ? btn.closest('tr') : null;
            modal.remove();
            if (row) {
                row.style.transition = 'opacity 0.5s';
                row.style.opacity = '0.2';
                setTimeout(() => {
                    deletePayee(payeeId, row);
                }, 400);
            } else {
                deletePayee(payeeId);
            }
        };
        document.getElementById('deletePayeeModalCancelBtn').onclick = function () {
            modal.remove();
        };
        // Dismiss modal on outside click
        modal.onclick = function (e) {
            if (e.target === modal) modal.remove();
        };
        // Dismiss on Escape key
        document.addEventListener('keydown', function escListener(ev) {
            if (ev.key === 'Escape') {
                modal.remove();
                document.removeEventListener('keydown', escListener);
            }
        });
    }

    async function deletePayee(payeeId) {
        // Use the same customerId and senderAccountNumber as in fetchPayees
        const customerId = '101';
        const senderAccountNumber = '200001';
        try {
            const res = await fetch(`http://localhost:8080/api/payees/${customerId}/${senderAccountNumber}/delete/${payeeId}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Failed to delete payee');
            // If row is provided, remove it after fade
            if (arguments.length > 1 && arguments[1]) {
                const row = arguments[1];
                setTimeout(() => {
                    row.remove();
                    // Optionally, refresh table to ensure sync
                    renderPayeeList();
                }, 100);
            } else {
                renderPayeeList();
            }
        } catch (e) {
            showDeleteErrorToast('Could not delete payee.');
        }
        // Custom toast for delete errors
        function showDeleteErrorToast(message) {
            // Remove any existing toast
            let old = document.getElementById('deleteErrorToast');
            if (old) old.remove();
            let toast = document.createElement('div');
            toast.id = 'deleteErrorToast';
            toast.textContent = message;
            toast.style.position = 'fixed';
            toast.style.top = '2.2rem';
            toast.style.right = '2.2rem';
            toast.style.zIndex = '99999';
            toast.style.background = 'linear-gradient(90deg,#e53935 60%,#b71c1c 100%)';
            toast.style.color = '#fff';
            toast.style.fontWeight = '700';
            toast.style.fontSize = '1.08rem';
            toast.style.borderRadius = '16px';
            toast.style.boxShadow = '0 4px 18px 0 rgba(229,57,53,0.18)';
            toast.style.padding = '1.1rem 2.2rem';
            toast.style.opacity = '0';
            toast.style.pointerEvents = 'none';
            toast.style.transition = 'opacity 0.3s, transform 0.3s';
            toast.style.transform = 'translateY(-24px)';
            document.body.appendChild(toast);
            setTimeout(() => {
                toast.style.opacity = '1';
                toast.style.pointerEvents = 'all';
                toast.style.transform = 'translateY(0)';
            }, 10);
            setTimeout(() => {
                toast.style.opacity = '0';
                toast.style.transform = 'translateY(-24px)';
                setTimeout(() => { toast.remove(); }, 400);
            }, 2600);
        }
    }

    // Show payee table when Manage Payee section is opened
    window.showSection = (function (origShowSection) {
        return function (section) {
            if (typeof origShowSection === 'function') origShowSection(section);
            if (section === 'managePayee') {
                renderPayeeList();
            }
        };
    })(window.showSection);

    // Also fetch payees on page load if Manage Payee is visible
    if (document.getElementById('managePayee')?.classList.contains('active')) {
        renderPayeeList();
    }
});

// Define showPayeeTransferToast globally for payee transfer notifications
function showPayeeTransferToast(message, type) {
    // Simple toast implementation (replace with your own if needed)
    let toast = document.createElement('div');
    toast.className = 'payee-transfer-toast';
    if (type === 'error') toast.classList.add('payee-transfer-toast-error');
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => { toast.classList.add('show'); }, 10);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => { toast.remove(); }, 400);
    }, 2600);
}


//statements
let miniStatementData = [];
let detailedStatementData = [];
document.addEventListener("DOMContentLoaded", function () {
    loadMiniStatement();
    loadbalance();
});
function loadMiniStatement() {


    const accountData = JSON.parse(sessionStorage.getItem("accountData")) || {};
    const accountNo = accountData.accountNo;
    const count = 10;
    // Update the HTML with the dynamic account number
    const accNumElem = document.getElementById("accNum");
    if (accNumElem) {
        accNumElem.textContent = accountNo;
    }
    // Set balance date
    const dateElem = document.getElementById('balanceDate');
    if (dateElem) {
        dateElem.textContent = new Date().toLocaleDateString('en-IN', {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        });
    }
    // Now make the API call
    fetch(`http://localhost:8080/api/statements/${accountNo}/latest?count=${count}`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to fetch mini statement");
            }
            return response.json();
        })
        .then(data => {
            miniStatementData = data;
            renderMiniStatement(data);
        })
        .catch(error => console.error("API fetch error:", error));
}
function loadbalance() {
    const accountNo = document.getElementById("accNum").textContent.trim();
    fetch(`http://localhost:8080/account/get/${accountNo}`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to fetch balance");
            }
            return response.json();
        })
        .then(data => {
            // Available Balance
            const balanceElem = document.getElementById("availBal");
            if (balanceElem) {
                balanceElem.textContent = `INR ${Number(data.balance).toLocaleString('en-IN', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                })}`;
            }
            console.log("Available Balance Value:", data.balance);
            // Effective Available Balance :white_check_mark:
            const effBalanceElem = document.getElementById("effAvailBal");
            if (effBalanceElem) {
                effBalanceElem.textContent = `INR ${Number(data.balance).toLocaleString('en-IN', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                })}`;
            }
            console.log("Effective Balance Value:", data.balance);
        })
        .catch(error => {
            console.error("Error loading available balance:", error);
        });
}
function downloadMiniStatement() {
    const selectedFormat = document.getElementById("downloadStmt").value;
    if (selectedFormat === "csv") {
        downloadMiniStatementCSV();
    } else if (selectedFormat === "pdf") {
        // You can call your PDF function here if you have one:
        alert("PDF download not implemented yet!");
    } else {
        alert("Please select a valid format!");
    }
}
function downloadMiniStatementCSV() {
    const accountNo = document.getElementById("accNum").textContent.trim();
    if (!miniStatementData || miniStatementData.length === 0) {
        alert("No mini statement data found. Please load it first.");
        return;
    }
    const csvRows = [];
    csvRows.push([
        "Transaction ID",
        "Transaction Date",
        "Payment Method",
        "Remarks",
        "Type"
    ].join(","));
    miniStatementData.forEach((txn, index) => {
        csvRows.push([
            index + 1,
            txn.transactionDate,
            `"${txn.remarks}"`,
            txn.transactionType,
            txn.amount
        ].join(","));
    });
    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("href", url);
    a.setAttribute("download", `mini_statement_${accountNo}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}
function renderMiniStatement(data) {
    const tbody = document.getElementById('miniStatementBody');
    if (!tbody) return;
    tbody.innerHTML = data.map((row, index) => `
    <tr>
      <td>${index + 1}</td>
      <td>${row.transactionDate}</td>
      <td style="text-align:left;">${row.remarks}</td>
      <td>
        <span style="color:${row.transactionType === 'Credit' ? 'var(--success)' : 'var(--error)'};font-weight:700;">
          ${row.transactionType === 'Credit' ? 'Cr.' : 'Dr.'}
        </span>
      </td>
      <td>${Number(row.amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
    </tr>
  `).join('');
}
// Download mini statement as PDF/CSV (CSV implemented)
// function downloadMiniStatement() {
//     const type = document.getElementById('downloadStmt').value;
//     if (type === 'pdf') {
//         showNotification("PDF export is coming soon.", "info");
//     } else {
//         // CSV Export
//         let csv = "Serial,Date,Remark,CR/DR,Amount (INR)\n";
//         miniStatementData.forEach(r =>
//             csv += `${r.serial},${r.date},"${r.remark}",${r.crdr},${r.amt}\n`
//         );
//         const link = document.createElement('a');
//         link.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
//         link.download = "mini-statement.csv";
//         document.body.appendChild(link);
//         link.click();
//         link.remove();
//         showNotification("CSV file downloaded.", "success");
//     }
// }
// Render detailed statement table
function renderDetailedStatement() {
    const accountData = JSON.parse(sessionStorage.getItem("accountData")) || {};
    const accountNo = accountData.accountNo;
    const fromDate = document.getElementById("detailedStartDate").value;
    const toDate = document.getElementById("detailedEndDate").value;
    if (!fromDate || !toDate) {
        alert("Please select a valid date range.");
        return;
    }
    
    if (!accountNo) {
        console.error("No account number found");
        return;
    }
    
    fetch(`http://localhost:8080/api/statements/${accountNo}/range?from=${fromDate}T00:00:00&to=${toDate}T23:59:59`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to fetch detailed statement");
            }
            return response.json();
        })
        .then(data => {
            detailedStatementData = data;
            buildDetailedStatementTable(data);
        })
        .catch(error => {
            console.error("Error loading detailed statement:", error);
            // Show empty table with error message
            const tableBody = document.querySelector('#detailedStatementTable tbody');
            if (tableBody) {
                tableBody.innerHTML = `
                    <tr>
                        <td colspan="6" style="text-align: center; padding: 2rem; color: #ff6b6b;">
                            No statements found for this date range
                        </td>
                    </tr>
                `;
            }
        });
}
function loadAccountSummary() {
    const customerData = JSON.parse(sessionStorage.getItem("customerData")) || {};
    const customerId = customerData.customerId;
    const firstName = customerData.firstName;

    const accountData = JSON.parse(sessionStorage.getItem("accountData")) || {};
    const accountNo = accountData.accountNo;
    const accHolderDiv = document.getElementById("accholder");
    accHolderDiv.textContent = `${accountNo} (INR) - ${firstName}`;
}
loadAccountSummary(); // Call it!
function buildDetailedStatementTable(data) {
    const tbody = document.getElementById("detailedStatementBody");
    tbody.innerHTML = "";
    if (!data || data.length === 0) {
        tbody.innerHTML = "<tr><td colspan='8'>No transactions found for the selected period.</td></tr>";
        return;
    }
    data.forEach((txn, index) => {
        tbody.innerHTML += `
      <tr>
        <td>${index + 1}</td>
        <td>${txn.transactionDate}</td>
        <td style="text-align:left;">${txn.remarks}</td>
        <td>${txn.transactionType === 'Debit' ? Number(txn.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 }) : "-"}</td>
        <td>${txn.transactionType === 'Credit' ? Number(txn.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 }) : "-"}</td>
        <td>${txn.balanceAfterTxn ? Number(txn.balanceAfterTxn).toLocaleString('en-IN', { minimumFractionDigits: 2 }) : "-"}</td>
      </tr>
    `;
    });
}
// Switch between statement tabs
function switchStatementTab(tabElement, tabName) {
    document.querySelectorAll('.tab-link').forEach(tab => tab.classList.remove('active'));
    tabElement.classList.add('active');
    // Show/hide content for each tab if needed
    if (tabName === 'detailed') {
        document.getElementById('detailedTabContent').style.display = 'block';
    } else {
        document.getElementById('detailedTabContent').style.display = 'none';
        showNotification(`${tabName.replace('-', ' ')} view is under construction.`, 'info');
    }
}
// Go to detailed statement section
function gotoDetailedStatement() {
    showSection('detailedStatement');
}
// Go back to mini statement section
function goBackToMiniStatement() {
    showSection('miniStatement');
}
// Initialize detailed statement table if present
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('detailedStatementBody')) {
        renderDetailedStatement();
    }
});
document.getElementById('periodDropdown').addEventListener('change', function () {
    if (this.value) {
        this.classList.add('selected');
    } else {
        this.classList.remove('selected');
    }
});
function loadAccountHolderSpan() {
    const customerData = JSON.parse(sessionStorage.getItem("customerData")) || {};
    const customerId = customerData.customerId;
    
    if (!customerId) {
        console.warn('No customer ID found, using default account holder');
        const accountHolderSpan = document.getElementById('accountHolderSpan');
        if (accountHolderSpan) {
            accountHolderSpan.textContent = 'Account Holder';
        }
        return;
    }
    
    fetch(`http://localhost:8080/api/account/summary/${customerId}`)
        .then(res => {
            if (!res.ok) {
                throw new Error("Failed to fetch account summary");
            }
            return res.json();
        })
        .then(data => {
            const span = document.getElementById("nameaccholder");
            if (span) {
                span.textContent = `${data.accountNo} - ${data.accountHolderName}`;
            }
        })
        .catch(err => console.error("Failed to load account summary for span", err));
}
window.addEventListener("DOMContentLoaded", () => {
    loadAccountHolderSpan();
});
function loadLast10DetailedTransactions() {
    const accountData = JSON.parse(sessionStorage.getItem("accountData")) || {};
    const accountNo = accountData.accountNo;
    fetch(`http://localhost:8080/api/statements/${accountNo}/latest?count=10`)
        .then(res => {
            if (!res.ok) throw new Error("Failed to fetch last 10 transactions");
            return res.json();
        })
        .then(data => {
            console.log("Last 10 transactions:", data);
            buildDetailedStatementTable(data);
        })
        .catch(err => console.error("Error fetching last 10 transactions:", err));
}
function handlePeriodSelection() {
    const accountData = JSON.parse(sessionStorage.getItem("accountData")) || {};
    const accountNo = accountData.accountNo;
    const period = document.getElementById("periodDropdown").value;
    let apiUrl = "";
    if (period === "lastweek") {
        apiUrl = `http://localhost:8080/api/statements/${accountNo}/last-week`;
    } else if (period === "last6months") {
        apiUrl = `http://localhost:8080/api/statements/${accountNo}/last-six-months`;
    } else {
        alert("Please select a valid period.");
        return;
    }
    fetch(apiUrl)
        .then(res => res.json())
        .then(data => {
            console.log("Period transactions:", data);
            buildDetailedStatementTable(data);
        })
        .catch(err => console.error("Error fetching period transactions:", err));
}
function handleTransactionTypeSelection() {
    const type = document.getElementById('transactionTypeDropdown').value;
    const accountData = JSON.parse(sessionStorage.getItem("accountData")) || {};
    const accountNo = accountData.accountNo;
    if (!type) {
        alert("Please select Credit or Debit");
        return;
    }
    fetch(`http://localhost:8080/api/statements/${accountNo}/type/${type}`)
        .then(res => res.json())
        .then(data => {
            console.log("Transactions by Type:", data);
            buildDetailedStatementTable(data);
        })
        .catch(err => console.error("Failed to fetch transactions by type", err));
}


//Fund Transfer ---------------------------------------------
// Enable Deposit button only when amount is filled and valid
function toggleDepositButtonState() {
    var amountInput = document.getElementById('selfDepositAmount');
    var btn = document.getElementById('selfDepositBtn');
    if (!amountInput || !btn) return;
    var value = amountInput.value.replace(/[^0-9.]/g, '');
    var isValid = value && !isNaN(value) && parseFloat(value) > 0;
    btn.disabled = !isValid;
}

// Handle Self Deposit submission
async function processSelfDeposit() {
    var amountInput = document.getElementById('selfDepositAmount');
    var remarksInput = document.getElementById('selfDepositRemark');
    var btn = document.getElementById('selfDepositBtn');
    var remarkError = document.getElementById('remarkError');
    if (!amountInput || !btn || !remarksInput || !remarkError) return;
    var amount = amountInput.value.replace(/[^0-9.]/g, '');
    var remarks = remarksInput.value.trim();
    // Validate amount
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
        showSelfDepositToast('Please enter a valid amount.', 'error');
        return;
    }
    // Validate remarks (required)
    if (!remarks) {
        remarkError.textContent = 'Remarks are required.';
        remarkError.style.display = 'block';
        remarksInput.classList.add('input-error');
        remarksInput.focus();
        return;
    } else {
        remarkError.textContent = '';
        remarkError.style.display = 'none';
        remarksInput.classList.remove('input-error');
    }
    btn.disabled = true;
    btn.innerHTML = '<span class="btn-icon-text"><i class="fas fa-spinner fa-spin"></i> Processing...</span>';
    // Show transfer animation and blur
    await showBankTransferAnimation();
    // After animation, do the fetch
    let result = null;
    let isSuccess = false;
    try {
        const customerData = JSON.parse(sessionStorage.getItem("customerData")) || {};
        const customerId = customerData.customerId;

        const accountData = JSON.parse(sessionStorage.getItem("accountData")) || {};
        const accountNo = accountData.accountNo;

        const response = await fetch(`http://localhost:8080/api/${customerId}/${accountNo}/self-deposit`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                amount: parseFloat(amount),
                paymentMethod: 'SELF_DEPOSIT',
                remarks: remarks
            })
        });
        let data;
        try { data = await response.json(); } catch (e) { data = null; }
        if (response.ok) {
            isSuccess = true;
            result = `Deposit successful! ₹${parseFloat(amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} added to your account.`;
        } else {
            result = 'Something went wrong. Please try again.';
        }
    } catch (e) {
        result = 'Something went wrong. Please try again.';
    }
    // Show top-right animation
    showSelfDepositToast(result, isSuccess ? 'success' : 'error');
    // Remove blur and enable UI
    removeBankTransferAnimation();
    // Clear form if success
    if (isSuccess) {
        amountInput.value = '';
        remarksInput.value = '';
    }
    btn.innerHTML = '<span class="btn-icon-text"><i class="fas fa-arrow-down"></i> Deposit</span>';
    toggleDepositButtonState();
    // Add error style for Remarks field if not present
    if (!document.getElementById('remarkErrorStyle')) {
        const style = document.createElement('style');
        style.id = 'remarkErrorStyle';
        style.innerHTML = `
        .remark-error {
            color: #e53935;
            font-size: 0.98rem;
            margin-top: 0.18rem;
            margin-left: 0.1rem;
            font-weight: 600;
            letter-spacing: 0.01em;
            animation: fadeInText 0.4s;
        }
        .input-error {
            border: 1.5px solid #e53935 !important;
            background: rgba(229,57,53,0.07) !important;
        }
      `;
        document.head.appendChild(style);
    }
}
// Show immersive bank transfer animation with blur overlay
function showBankTransferAnimation() {
    return new Promise(resolve => {
        // Prevent duplicate overlays
        if (document.getElementById('bankTransferOverlay')) {
            document.getElementById('bankTransferOverlay').remove();
        }
        // Blur everything
        let overlay = document.createElement('div');
        overlay.id = 'bankTransferOverlay';
        overlay.className = 'bank-transfer-overlay';
        overlay.innerHTML = `
                <div class="bank-transfer-anim glass">
                    <div class="bank-logos">
                        <span class="bank-logo sender bank-logo-sender"><i class="fas fa-university"></i></span>
                        <div class="money-flow-track">
                            <span class="money-coin gold-coin">₹</span>
                            <span class="money-coin gold-coin">₹</span>
                            <span class="money-coin gold-coin">₹</span>
                        </div>
                        <span class="bank-logo receiver bank-logo-receiver"><i class="fas fa-university"></i></span>
                    </div>
                    <div class="bank-transfer-label">Transferring Money...</div>
                </div>
            `;
        document.body.appendChild(overlay);
        setTimeout(() => {
            overlay.classList.add('show');
        }, 10);
        // Animate for 5 seconds
        setTimeout(() => {
            resolve();
        }, 5000);
    });
}

// Remove the bank transfer overlay and blur
function removeBankTransferAnimation() {
    let overlay = document.getElementById('bankTransferOverlay');
    if (overlay) {
        overlay.classList.remove('show');
        setTimeout(() => {
            if (overlay) overlay.remove();
        }, 400);
    }
}

function showSelfDepositToast(message, type) {
    // Instead of toast, show animation if success
    let oldAnim = document.getElementById('selfDepositAnim');
    if (oldAnim) oldAnim.remove();
    if (type === 'success') {
        // Try to extract amount from the message if possible
        let amount = '';
        // If message contains ₹ or Rs and a number, extract it
        let match = message && message.match(/[₹Rs\s]*([\d,]+(?:\.\d{1,2})?)/i);
        if (match && match[1]) {
            amount = match[1].replace(/,/g, '');
            // Format with commas and 2 decimals
            let num = Number(amount);
            if (!isNaN(num)) {
                amount = num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            }
        }
        let anim = document.createElement('div');
        anim.id = 'selfDepositAnim';
        anim.className = 'selfdeposit-anim';
        anim.innerHTML = '<span class="selfdeposit-rupee"><i class="fas fa-rupee-sign"></i></span>' +
            `<span class="selfdeposit-anim-text">${amount} added</span>`;
        document.body.appendChild(anim);
        setTimeout(() => {
            anim.classList.add('show');
        }, 10);
        setTimeout(() => {
            anim.classList.remove('show');
            setTimeout(() => { anim.remove(); }, 500);
        }, 2200);
    } else {
        // fallback for error
        let old = document.getElementById('selfDepositToast');
        if (old) old.remove();
        let toast = document.createElement('div');
        toast.id = 'selfDepositToast';
        toast.className = 'selfdeposit-toast selfdeposit-toast-' + type;
        toast.innerHTML = message;
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => { toast.remove(); }, 400);
        }, 3500);
    }
}

// Initialize state on DOMContentLoaded
document.addEventListener('DOMContentLoaded', function () {
    toggleDepositButtonState();
});



// Manage Payee --------------------------------------


function showAddPayeeForm() {
    const form = document.getElementById('addPayeeForm');
    const btn = document.getElementById('showAddPayeeBtn');
    
    if (form) {
        form.style.display = 'flex';
        form.scrollIntoView({ behavior: 'smooth' });
    }
    if (btn) btn.style.display = 'none';
}

function hideAddPayeeForm() {
    const form = document.getElementById('addPayeeForm');
    const btn = document.getElementById('showAddPayeeBtn');
    
    if (form) form.style.display = 'none';
    if (btn) btn.style.display = 'block';
}
function getPayees() {
    // This function is now just a placeholder since we fetch from API
    return [];
}

function savePayees(payees) {
    // This function is now just a placeholder since we save to API
    console.log('savePayees called - using API now');
}

async function renderPayeeList() {
    const payeeListBody = document.getElementById('payeeListBody');
    if (!payeeListBody) return;
    
    // Show loading state
    payeeListBody.innerHTML = `
        <tr>
            <td colspan="5" style="text-align: center; padding: 2rem; color: #666;">
                <i class="fas fa-spinner fa-spin" style="font-size: 1.5rem; margin-bottom: 1rem; display: block;"></i>
                Loading payees...
            </td>
        </tr>
    `;
    
    try {
        // Get customer and account data
        const customerData = JSON.parse(sessionStorage.getItem("customerData")) || {};
        const customerId = customerData.customerId || '101';

        const accountData = JSON.parse(sessionStorage.getItem("accountData")) || {};
        const accountNo = accountData.accountNo || '200001';
        
        // Fetch payees from API
        const response = await fetch(`http://localhost:8080/api/payees/${customerId}/${accountNo}/payees`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch payees');
        }
        
        const payees = await response.json();
        console.log('Fetched payees:', payees);
        console.log('First payee structure:', payees[0]);
        
        if (!Array.isArray(payees) || payees.length === 0) {
            payeeListBody.innerHTML = `
                <tr>
                    <td colspan="5" style="text-align: center; padding: 2rem; color: #666;">
                        <i class="fas fa-users" style="font-size: 2rem; margin-bottom: 1rem; display: block;"></i>
                        No payees added yet. Click "Add New Payee" to get started.
                    </td>
                </tr>
            `;
            return;
        }
        
        // Render payees in table with flexible field mapping
        payeeListBody.innerHTML = payees.map((payee) => `
            <tr>
                <td>${payee.payeeName || payee.name || payee.payee_name || 'N/A'}</td>
                <td>${payee.payeeAccountNumber || payee.accountNumber || payee.account_number || payee.payee_account_number || 'N/A'}</td>
                <td>${payee.bankName || payee.bank || payee.bank_name || 'N/A'}</td>
                <td>${payee.ifscCode || payee.ifsc || payee.ifsc_code || 'N/A'}</td>
                <td>
                    <button onclick="deletePayeeFromAPI(${payee.payeeId || payee.id || payee.payee_id})" class="delete-payee-btn" title="Delete Payee">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
        
    } catch (error) {
        console.error('Error fetching payees:', error);
        payeeListBody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align: center; padding: 2rem; color: #ff6b6b;">
                    <i class="fas fa-exclamation-triangle" style="font-size: 1.5rem; margin-bottom: 1rem; display: block;"></i>
                    Error loading payees. Please try again.
                </td>
            </tr>
        `;
    }
}

async function updatePayeeDropdowns() {
    try {
        // Get customer and account data
        const customerData = JSON.parse(sessionStorage.getItem("customerData")) || {};
        const customerId = customerData.customerId || '101';

        const accountData = JSON.parse(sessionStorage.getItem("accountData")) || {};
        const accountNo = accountData.accountNo || '200001';
        
        // Fetch payees from API
        const response = await fetch(`http://localhost:8080/api/payees/${customerId}/${accountNo}/payees`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch payees');
        }
        
        const payees = await response.json();
        const dropdown = document.getElementById('transferPayeeSelect');
        
        if (!dropdown) return;
        
        // Clear existing options except the first one
        dropdown.innerHTML = '<option value="">-- Select Payee --</option>';
        
        // Add payee options
        if (Array.isArray(payees) && payees.length > 0) {
            payees.forEach(payee => {
                const option = document.createElement('option');
                option.value = payee.payeeId || payee.id || payee.payee_id;
                option.textContent = `${payee.payeeName || payee.name || payee.payee_name} - ${payee.payeeAccountNumber || payee.accountNumber || payee.account_number || payee.payee_account_number}`;
                dropdown.appendChild(option);
            });
        }
        
    } catch (error) {
        console.error('Error updating payee dropdowns:', error);
        const dropdown = document.getElementById('transferPayeeSelect');
        if (dropdown) {
            dropdown.innerHTML = '<option value="">Error loading payees</option>';
        }
    }
}

async function deletePayeeFromAPI(payeeId) {
    console.log('Delete payee clicked with ID:', payeeId);
    
    if (!confirm('Are you sure you want to delete this payee?')) {
        return;
    }
    
    try {
        // Get customer and account data
        const customerData = JSON.parse(sessionStorage.getItem("customerData")) || {};
        const customerId = customerData.customerId || '101';

        const accountData = JSON.parse(sessionStorage.getItem("accountData")) || {};
        const senderAccountNumber = accountData.accountNo || '200001';
        
        console.log('Calling delete API with:', { customerId, senderAccountNumber, payeeId });
        
        // Make API call to delete payee
        const response = await fetch(`http://localhost:8080/api/payees/${customerId}/${senderAccountNumber}/delete/${payeeId}`, {
            method: 'DELETE'
        });
        
        console.log('Delete response status:', response.status);
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to delete payee: ${errorText}`);
        }
        
        // Show success message
        showAddPayeeToast('Payee deleted successfully!', 'success');
        
        // Refresh payee list and dropdown
        await renderPayeeList();
        await updatePayeeDropdowns();
        
    } catch (error) {
        console.error('Error deleting payee:', error);
        showAddPayeeToast(`Could not delete payee: ${error.message}`, 'error');
    }
}

// Make function globally accessible
window.deletePayeeFromAPI = deletePayeeFromAPI;

function deletePayee(index) {
    // Legacy function - kept for compatibility but redirects to API version
    console.warn('deletePayee(index) is deprecated, use deletePayeeFromAPI(payeeId)');
}
async function addPayee(e) {
    e.preventDefault();
    
    // Get form elements with correct IDs from HTML
    const payeeName = document.getElementById('payeeName').value.trim();
    const payeeAccountNumber = document.getElementById('payeeAccount').value.trim();
    const bankName = document.getElementById('payeeBank').value.trim();
    const ifscCode = document.getElementById('payeeIFSC').value.trim();
    const nickname = document.getElementById('payeeNickname').value.trim();
    
    // Validation
    if (!payeeName || !payeeAccountNumber || !bankName || !ifscCode || !nickname) {
        showAddPayeeToast('Please fill all required fields!', 'error');
        return;
    }
    
    const submitBtn = document.querySelector('#addPayeeForm button[type="submit"]');
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Adding...';
    }
    
    try {
        // Get customer and account data from session storage
        const customerData = JSON.parse(sessionStorage.getItem("customerData")) || {};
        const customerId = customerData.customerId || '101';  // fallback to working ID

        const accountData = JSON.parse(sessionStorage.getItem("accountData")) || {};
        const senderAccountNumber = accountData.accountNo || '200001';  // fallback to working account
        
        // Create payee payload
        const payload = {
            payeeName: payeeName,
            payeeAccountNumber: payeeAccountNumber,
            bankName: bankName,
            ifscCode: ifscCode,
            nickname: nickname
        };
        
        console.log('Adding payee with payload:', payload);
        
        // Make API call to add payee
        const response = await fetch(`http://localhost:8080/api/payees/${customerId}/${senderAccountNumber}/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to add payee: ${errorText}`);
        }
        
        // Get response data
        let responseData;
        try {
            responseData = await response.json();
        } catch (e) {
            responseData = { success: true };
        }
        
        console.log('Add payee response:', responseData);
        
        // Reset form and hide it
        document.getElementById('addPayeeForm').reset();
        hideAddPayeeForm();
        
        // Show success message
        showAddPayeeToast('Payee added successfully!', 'success');
        
        // Refresh payee list and dropdown
        await renderPayeeList();
        await updatePayeeDropdowns();
        
    } catch (err) {
        console.error('Error adding payee:', err);
        showAddPayeeToast(`Could not add payee: ${err.message}`, 'error');
    } finally {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-plus"></i> Add Payee';
        }
    }
}
// Show Add Payee Toast
function showAddPayeeToast(message, type) {
    let old = document.getElementById('addPayeeToast');
    if (old) old.remove();
    let toast = document.createElement('div');
    toast.id = 'addPayeeToast';
    toast.textContent = message;
    toast.style.position = 'fixed';
    toast.style.top = '2.2rem';
    toast.style.right = '2.2rem';
    toast.style.zIndex = '99999';
    toast.style.background = type === 'success'
        ? 'linear-gradient(90deg,#1DBF73 60%,#158F5C 100%)'
        : 'linear-gradient(90deg,#E53935 60%,#B71C1C 100%)';
    toast.style.color = '#fff';
    toast.style.fontWeight = '700';
    toast.style.fontSize = '1.08rem';
    toast.style.borderRadius = '16px';
    toast.style.boxShadow = '0 4px 18px 0 rgba(16,185,129,0.18)';
    toast.style.padding = '1.1rem 2.2rem';
    toast.style.opacity = '0';
    toast.style.pointerEvents = 'none';
    toast.style.transition = 'opacity 0.3s, transform 0.3s';
    toast.style.transform = 'translateY(-24px)';
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '1';
        toast.style.pointerEvents = 'all';
        toast.style.transform = 'translateY(0)';
    }, 10);
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(-24px)';
        setTimeout(() => { toast.remove(); }, 400);
    }, 2600);
}
// Initial render for payee list when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Initialize payee functionality after a short delay to ensure DOM is ready
    setTimeout(() => {
        if (document.getElementById('payeeListBody')) {
            renderPayeeList();
            updatePayeeDropdowns();
        }
    }, 100);
});
// Section switching logic
function showSection(sectionId) {
    // Show only the selected section, hide others
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(sec => {
        sec.classList.remove('active');
        sec.style.display = 'none';
    });
    const target = document.getElementById(sectionId);
    if (target) {
        target.classList.add('active');
        target.style.display = '';
    }
    // Update sidebar active link
    document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
    const nav = Array.from(document.querySelectorAll('.nav-link')).find(link => link.getAttribute('onclick') && link.getAttribute('onclick').includes(sectionId));
    if (nav) nav.classList.add('active');
    // Hide add payee form only if leaving managePayee section and form exists
    if (sectionId !== 'managePayee') {
        hideAddPayeeForm();
    }
}

console.log('JS loaded');
// --- Payee Transfer Functionality ---
async function fetchPayeesForTransfer() {
    try {
    const customerData = JSON.parse(sessionStorage.getItem("customerData")) || {};
    const customerId = customerData.customerId;

    const accountData = JSON.parse(sessionStorage.getItem("accountData")) || {};
    const accountNo = accountData.accountNo;
        const res = await fetch(`http://localhost:8080/api/payees/${customerId}/${accountNo}/payees`);
        if (!res.ok) throw new Error('Failed to fetch payees');
        const payees = await res.json();
        const select = document.getElementById('transferPayeeSelect');
        select.innerHTML = '<option value="">-- Select Payee --</option>';
        payees.forEach(payee => {
            const opt = document.createElement('option');
            opt.value = payee.payeeId;
            opt.textContent = payee.payeeName;
            select.appendChild(opt);
        });
    } catch (err) {
        document.getElementById('transferMessage').innerHTML = `<span style='color:#e74c3c;'>Error loading payees. Please try again.</span>`;
    }
}
function validateTransferForm() {
    const payee = document.getElementById('transferPayeeSelect').value;
    const method = document.getElementById('paymentMethod').value;
    const amount = document.getElementById('transferAmount').value;
    const remark = document.getElementById('transferRemark').value.trim();
    const btn = document.getElementById('transferBtn');
    btn.disabled = !(payee && method && amount && parseFloat(amount) > 0 && remark);
}
document.addEventListener('DOMContentLoaded', function () {
    fetchPayeesForTransfer();
    ['transferPayeeSelect', 'paymentMethod', 'transferAmount', 'transferRemark'].forEach(id => {
        document.getElementById(id).addEventListener('input', validateTransferForm);
    });
    // Attach submit handler for payee transfer form
    document.getElementById('payeeTransferForm').addEventListener('submit', submitPayeeTransfer);
});
async function submitPayeeTransfer(e) {
    console.log('submitPayeeTransfer called');
    e.preventDefault();
    
    // Get form data
    const payeeId = document.getElementById('transferPayeeSelect').value;
    const paymentMethod = document.getElementById('paymentMethod').value;
    const amount = document.getElementById('transferAmount').value;
    const remark = document.getElementById('transferRemark').value.trim();
    
    // Validate form data
    if (!payeeId || !paymentMethod || !amount || !remark) {
        showPayeeTransferToast('Please fill all required fields', 'error');
        return;
    }
    
    // Show password modal
    showTransactionPasswordModal(payeeId, amount, paymentMethod, remark);
}

function showTransactionPasswordModal(payeeId, amount, paymentMethod, remark) {
    // Remove any existing modal
    let existingModal = document.getElementById('transactionPasswordModal');
    if (existingModal) existingModal.remove();
    
    // Create modal
    let modal = document.createElement('div');
    modal.id = 'transactionPasswordModal';
    modal.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
        background: rgba(20,24,32,0.8); backdrop-filter: blur(4px);
        z-index: 100000; display: flex; align-items: center; justify-content: center;
    `;
    
    modal.innerHTML = `
        <div style="background:rgba(30,40,60,0.95);backdrop-filter:blur(20px);border-radius:20px;
                    box-shadow:0 10px 40px rgba(0,0,0,0.3);padding:2.5rem;min-width:350px;max-width:90vw;">
            <div style="text-align:center;margin-bottom:2rem;">
                <h3 style="color:#fff;margin:0 0 0.5rem 0;font-size:1.4rem;">Enter Transaction Password</h3>
                <p style="color:#b6c2d1;margin:0;font-size:0.95rem;">Amount: <strong>₹${amount}</strong></p>
            </div>
            
            <div style="margin-bottom:2rem;">
                <input type="password" id="transactionPassword" placeholder="Transaction Password" 
                       style="width:100%;padding:1rem;border:2px solid rgba(255,255,255,0.1);
                              border-radius:12px;background:rgba(255,255,255,0.05);color:#fff;
                              font-size:1rem;outline:none;box-sizing:border-box;"
                       maxlength="6">
            </div>
            
            <div style="display:flex;gap:1rem;justify-content:center;">
                <button id="confirmTransferBtn" style="background:linear-gradient(135deg,#4CAF50,#45a049);
                        color:#fff;border:none;padding:0.8rem 1.5rem;border-radius:10px;
                        font-weight:600;cursor:pointer;font-size:1rem;">
                    <i class="fas fa-check"></i> Confirm Transfer
                </button>
                <button id="cancelTransferBtn" style="background:rgba(255,255,255,0.1);
                        color:#fff;border:none;padding:0.8rem 1.5rem;border-radius:10px;
                        font-weight:600;cursor:pointer;font-size:1rem;">
                    Cancel
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Focus password input
    setTimeout(() => {
        document.getElementById('transactionPassword')?.focus();
    }, 100);
    
    // Button handlers
    document.getElementById('confirmTransferBtn').onclick = async function() {
        const password = document.getElementById('transactionPassword').value;
        if (!password) {
            alert('Please enter transaction password');
            return;
        }
        modal.remove();
        await processPayeeTransferWithPassword(payeeId, amount, paymentMethod, remark, password);
    };
    
    document.getElementById('cancelTransferBtn').onclick = function() {
        modal.remove();
    };
    
    // Close on outside click
    modal.onclick = function(e) {
        if (e.target === modal) modal.remove();
    };
    
    // Close on Escape key
    document.addEventListener('keydown', function escListener(e) {
        if (e.key === 'Escape') {
            modal.remove();
            document.removeEventListener('keydown', escListener);
        }
    });
}

async function processPayeeTransferWithPassword(payeeId, amount, paymentMethod, remark, transactionPassword) {
    // Get customer and account data
    const customerData = JSON.parse(sessionStorage.getItem("customerData")) || {};
    const customerId = customerData.customerId || '101';
    const accountData = JSON.parse(sessionStorage.getItem("accountData")) || {};
    const accountNo = accountData.accountNo || '200001';
    
    const btn = document.getElementById('transferBtn');
    const msgDiv = document.getElementById('transferMessage');
    
    // Show processing state
    if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    }
    if (msgDiv) msgDiv.innerHTML = '';
    
    try {
        console.log('Making payee transfer API call with password');
        
        // Prepare request body as per your specification
        const requestBody = {
            amount: parseFloat(amount),
            paymentMethod: paymentMethod,
            remarks: remark,
            transactionPassword: transactionPassword
        };
        
        console.log('Request body:', requestBody);
        
        // Make API call with correct URL format
        const response = await fetch(`http://localhost:8080/api/${customerId}/${accountNo}/payee-transfer/${payeeId}`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });
        
        console.log('Transfer response status:', response.status);
        
        let responseText = await response.text();
        let data = null;
        try {
            data = responseText ? JSON.parse(responseText) : null;
        } catch (e) {
            console.log('Response is not JSON:', responseText);
        }
        
        console.log('Payee Transfer API response data:', data);
        
        if (response.ok) {
            let details = '';
            if (data && typeof data === 'object') {
                details = `<br><span style='font-size:0.97em;color:#b6c2d1;'>Txn ID: <b>${data.transactionId || 'N/A'}</b> | Amount: <b>₹${data.amount || amount}</b> | Status: <b>${data.status || 'Success'}</b></span>`;
            }
            
            showPayeeTransferToast(`Transfer successful!${details}`, 'success');
            
            // Clear form
            document.getElementById('payeeTransferForm').reset();
            
        } else {
            const errorMsg = data?.message || data?.error || responseText || 'Transfer failed';
            throw new Error(errorMsg);
        }
        
    } catch (error) {
        console.error('Error in payee transfer:', error);
        showPayeeTransferToast(`Transfer failed: ${error.message}`, 'error');
    } finally {
        // Reset button state
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = '<i class="fas fa-paper-plane"></i> Transfer';
        }
    }
}

// LocalStorage for demo; replace with backend in production
function getPayees() {
    return JSON.parse(localStorage.getItem('payees') || '[]');
}
function savePayees(payees) {
    localStorage.setItem('payees', JSON.stringify(payees));
}
function renderPayeeList() {
    // Global error handler for debugging
    window.onerror = function (message, source, lineno, colno, error) {
        console.error('Global JS Error:', message, 'at', source + ':' + lineno + ':' + colno, error);
    };
    const tbody = document.getElementById('payeeListBody');
    const payees = getPayees();
    tbody.innerHTML = '';
    if (payees.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:#b6c2d1;">No payees added yet.</td></tr>';
        return;
    }
    payees.forEach((payee, idx) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
                    <td>${payee.name}</td>
                    <td>${payee.account}</td>
                    <td>${payee.bank}</td>
                    <td>${payee.ifsc}</td>
                    <td><button class="delete-payee-btn" onclick="deletePayee(${idx})"><i class="fas fa-trash"></i> Delete</button></td>
                `;
        tbody.appendChild(tr);
    });
}

// Make function available globally for debugging
window.refreshDataFromSessionStorage = refreshDataFromSessionStorage;