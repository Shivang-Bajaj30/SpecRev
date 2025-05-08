document.addEventListener('DOMContentLoaded', function() {
    // Get form elements if they exist
    const loginForm = document.querySelector('#loginForm');
    const signupForm = document.querySelector('#signupForm');
    const passwordInput = document.querySelector('input[type="password"]');
    const strengthBar = document.querySelector('.strength-bar');
    const strengthText = document.querySelector('.strength-text');
    
    
    if (passwordInput && strengthBar && strengthText) {
        passwordInput.addEventListener('input', function() {
            const password = this.value;
            const strength = checkPasswordStrength(password);
            
            // Reset classes
            strengthBar.classList.remove('weak', 'medium', 'strong', 'very-strong');
            
            if (password.length === 0) {
                strengthBar.style.width = '0';
                strengthText.textContent = 'Password strength';
            } else if (strength < 30) {
                strengthBar.classList.add('weak');
                strengthText.textContent = 'Weak password';
            } else if (strength < 60) {
                strengthBar.classList.add('medium');
                strengthText.textContent = 'Medium password';
            } else if (strength < 80) {
                strengthBar.classList.add('strong');
                strengthText.textContent = 'Strong password';
            } else {
                strengthBar.classList.add('very-strong');
                strengthText.textContent = 'Very strong password';
            }
        });
    }
    
    // Handle form submissions
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // In a real app, you would handle login API call here
            // For demo, just show an alert
            alert('Login functionality would be implemented here');
        });
    }
    
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // In a real app, you would handle signup API call here
            // For demo, just show an alert
            alert('Signup functionality would be implemented here');
        });
    }
    
    // Password strength calculator
    function checkPasswordStrength(password) {
        let strength = 0;
        
        // Length check
        if (password.length >= 8) {
            strength += 25;
        }
        
        // Checks for different character types
        if (/[A-Z]/.test(password)) {
            strength += 15; // Has uppercase
        }
        
        if (/[a-z]/.test(password)) {
            strength += 15; // Has lowercase
        }
        
        if (/[0-9]/.test(password)) {
            strength += 15; // Has numbers
        }
        
        if (/[^A-Za-z0-9]/.test(password)) {
            strength += 20; // Has special characters
        }
        
        // Penalize for common patterns
        if (/(\w)\1{2,}/.test(password)) {
            strength -= 10; // Repeated characters
        }
        
        if (/^(password|123456|qwerty)/i.test(password)) {
            strength -= 30; // Common password patterns
        }
        
        return Math.max(0, Math.min(100, strength)); // Clamp between 0-100
    }
}); 