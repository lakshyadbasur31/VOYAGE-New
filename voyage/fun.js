const appState = {
    currentPage: 'welcome',
    currentStep: 1,
    userData: {
        userType: '',
        email: '',
        password: '',
        fullName: '',
        phoneNumber: '',
        countryCode: '+91',
        guideDescription: '',
        termsAgreed: false,
        marketingOptIn: false
    },
    passwordStrength: 0
};
function showPage(pageId) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // Show requested page
    const page = document.getElementById(pageId);
    if (page) {
        page.classList.add('active');
        appState.currentPage = pageId;
    }
}

function goToSignup() {
    showPage('signup-page');
    showStep(1);
}

function goToLogin() {
    showPage('login-page');
}

function goToHome() {
    showPage('home-page');
    initializeHome();
}
function showStep(stepNumber) {
    // Hide all steps
    document.querySelectorAll('[id^="step-"]').forEach(step => {
        step.style.display = 'none';
    });
    
    // Show requested step
    const step = document.getElementById(`step-${stepNumber}`);
    if (step) {
        step.style.display = 'block';
        appState.currentStep = stepNumber;
    }
}

function nextStep() {
    // Validate current step before proceeding
    if (validateCurrentStep()) {
        showStep(appState.currentStep + 1);
    }
}

function previousStep() {
    if (appState.currentStep > 1) {
        showStep(appState.currentStep - 1);
    }
}
function validateEmail() {
    const email = document.getElementById('email').value;
    const emailError = document.getElementById('email-error');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!email) {
        emailError.textContent = '';
        return false;
    }
    
    if (!emailRegex.test(email)) {
        emailError.textContent = 'Please enter a valid email address';
        return false;
    }
    
    emailError.textContent = '';
    appState.userData.email = email;
    return true;
}

function validatePassword() {
    const password = document.getElementById('password').value;
    
    // Check each requirement
    const requirements = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        number: /[0-9]/.test(password),
        special: /[!@#$%^&*]/.test(password)
    };
    
    // Update requirement indicators
    updateRequirement('req-length', requirements.length);
    updateRequirement('req-uppercase', requirements.uppercase);
    updateRequirement('req-number', requirements.number);
    updateRequirement('req-special', requirements.special);
    
    // Calculate strength
    const metRequirements = Object.values(requirements).filter(Boolean).length;
    let strength = 0;
    let strengthClass = '';
    let strengthText = '';
    
    if (metRequirements >= 4) {
        strength = 100;
        strengthClass = 'strong';
        strengthText = 'Strong password';
    } else if (metRequirements >= 3) {
        strength = 66;
        strengthClass = 'medium';
        strengthText = 'Medium strength';
    } else if (metRequirements >= 1) {
        strength = 33;
        strengthClass = 'weak';
        strengthText = 'Weak password';
    }
    
    // Update strength indicator
    const strengthFill = document.getElementById('strength-fill');
    const strengthTextEl = document.getElementById('strength-text');
    
    strengthFill.style.width = strength + '%';
    strengthFill.className = 'strength-fill ' + strengthClass;
    strengthTextEl.textContent = strengthText;
    
    appState.passwordStrength = metRequirements;
    appState.userData.password = password;
    
    return metRequirements === 4;
}

function updateRequirement(id, isMet) {
    const element = document.getElementById(id);
    const check = element.querySelector('.check');
    
    if (isMet) {
        element.classList.add('met');
        check.textContent = '✓';
    } else {
        element.classList.remove('met');
        check.textContent = '○';
    }
}
function selectUserType(type) {
    appState.userData.userType = type;
    
    // Update UI to show selection
    document.querySelectorAll('.user-type-card').forEach(card => {
        card.classList.remove('selected');
    });
    event.currentTarget.classList.add('selected');
    
    // Show/hide guide-specific fields
    const guideBioSection = document.getElementById('guide-bio-section');
    if (guideBioSection) {
        guideBioSection.style.display = type === 'guide' ? 'block' : 'none';
    }
    
    // Automatically move to next step after selection
    setTimeout(() => {
        nextStep();
    }, 500);
}
function togglePassword() {
    const passwordInput = document.getElementById('password');
    const toggleBtn = document.querySelector('.toggle-password');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleBtn.textContent = '🙈';
    } else {
        passwordInput.type = 'password';
        toggleBtn.textContent = '👁️';
    }
}
function handleSignupSubmit(event) {
    event.preventDefault();
    
    // Collect all form data
    appState.userData.fullName = document.getElementById('fullName').value;
    appState.userData.phoneNumber = document.getElementById('phoneNumber').value;
    appState.userData.countryCode = document.getElementById('countryCode').value;
    appState.userData.termsAgreed = document.getElementById('termsAgreed').checked;
    appState.userData.marketingOptIn = document.getElementById('marketingOptIn').checked;
    
    if (appState.userData.userType === 'guide') {
        appState.userData.guideDescription = document.getElementById('guideDescription').value;
    }
    
    // Validate terms agreement
    if (!appState.userData.termsAgreed) {
        alert('Please agree to the Terms of Service and Privacy Policy');
        return;
    }
    
    // Show loading state
    const submitBtn = event.target.querySelector('button[type="submit"]');
    submitBtn.textContent = 'Creating account...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        console.log('User registered:', appState.userData);
        showPage('success-page');
        
        // Update success page with user name
        const successPage = document.getElementById('success-page');
        successPage.querySelector('p').textContent = 
            `Hi ${appState.userData.fullName}, your account has been created successfully.`;
    }, 1500);
}
function validateCurrentStep() {
    switch(appState.currentStep) {
        case 1:
            if (!appState.userData.userType) {
                alert('Please select your account type');
                return false;
            }
            return true;
            
        case 2:
            if (!validateEmail()) {
                alert('Please enter a valid email address');
                return false;
            }
            if (appState.passwordStrength < 4) {
                alert('Please create a stronger password meeting all requirements');
                return false;
            }
            return true;
            
        case 3:
            const fullName = document.getElementById('fullName').value;
            if (!fullName) {
                alert('Please enter your full name');
                return false;
            }
            return true;
            
        default:
            return true;
    }
}
// Initialize event listeners when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Profile form submission
    const profileForm = document.getElementById('profile-form');
    if (profileForm) {
        profileForm.addEventListener('submit', handleSignupSubmit);
    }
    
    // Email input validation
    const emailInput = document.getElementById('email');
    if (emailInput) {
        emailInput.addEventListener('blur', validateEmail);
    }
    
    // Password input validation
    const passwordInput = document.getElementById('password');
    if (passwordInput) {
        passwordInput.addEventListener('input', validatePassword);
    }
});
