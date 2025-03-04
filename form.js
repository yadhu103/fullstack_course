// 1. Email Validation Function
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  // 2. Password Strength Checker
  function checkPasswordStrength(password) {
    // Check if password is at least 8 characters
    const isLongEnough = password.length >= 8;
    
    // Check if password contains at least one number
    const hasNumber = /\d/.test(password);
    
    // Check if password contains at least one uppercase letter
    const hasUppercase = /[A-Z]/.test(password);
    
    // Check if password contains at least one special character
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
    
    // Return true only if all conditions are met
    return isLongEnough && hasNumber && hasUppercase && hasSpecialChar;
  }
  
  // 3. Prevent Form Submission if Validation Fails
  function validateForm(event) {
    // Get all required input fields
    const requiredFields = document.querySelectorAll('[required]');
    let isValid = true;
    
    // Check each field
    for (const field of requiredFields) {
      if (!field.value.trim()) {
        // Show error message or add error class
        field.classList.add('error');
        
        // Display an error message
        const errorElement = document.getElementById(`${field.id}-error`);
        if (errorElement) {
          errorElement.textContent = 'This field is required';
          errorElement.style.display = 'block';
        }
        
        isValid = false;
      } else {
        // Perform specific validation based on field type
        let fieldIsValid = true;
        const errorElement = document.getElementById(`${field.id}-error`);
        
        if (field.type === 'email' || field.dataset.type === 'email') {
          fieldIsValid = validateEmail(field.value);
          if (!fieldIsValid && errorElement) {
            errorElement.textContent = 'Please enter a valid email address';
            errorElement.style.display = 'block';
          }
        } else if (field.type === 'password' || field.dataset.type === 'password') {
          fieldIsValid = checkPasswordStrength(field.value);
          if (!fieldIsValid && errorElement) {
            errorElement.textContent = 'Password must be at least 8 characters and include a number, uppercase letter, and special character';
            errorElement.style.display = 'block';
          }
        } else if (field.dataset.type === 'phone') {
          fieldIsValid = validatePhoneNumber(field.value);
          if (!fieldIsValid && errorElement) {
            errorElement.textContent = 'Please enter a 10-digit phone number';
            errorElement.style.display = 'block';
          }
        }
        
        if (!fieldIsValid) {
          field.classList.add('error');
          field.classList.remove('valid');
          isValid = false;
        }
      }
    }
    
    // Prevent form from submitting if validation fails
    if (!isValid) {
      event.preventDefault();
      // Focus on the first invalid field
      document.querySelector('.error').focus();
    }
    
    return isValid;
  }
  
  // 4. Phone Number Validation
  function validatePhoneNumber(phone) {
    // Remove any non-digit characters
    const digitsOnly = phone.replace(/\D/g, '');
    
    // Check if the result has exactly 10 digits
    return digitsOnly.length === 10;
  }
  
  // 5. Real-Time Validation
  function setupRealTimeValidation() {
    // Get all input fields that need validation
    const inputFields = document.querySelectorAll('.validate-input');
    
    inputFields.forEach(input => {
      // Add event listener for input event (fires when user types)
      input.addEventListener('input', function() {
        let isValid = true;
        const errorElement = document.getElementById(`${this.id}-error`);
        
        if (!this.value.trim()) {
          // Empty field handling
          if (this.hasAttribute('required')) {
            isValid = false;
            if (errorElement) {
              errorElement.textContent = 'This field is required';
            }
          }
        } else {
          // Specific validation based on input type
          if (this.type === 'email' || this.dataset.type === 'email') {
            isValid = validateEmail(this.value);
            if (!isValid && errorElement) {
              errorElement.textContent = 'Please enter a valid email address';
            }
          } else if (this.type === 'password' || this.dataset.type === 'password') {
            isValid = checkPasswordStrength(this.value);
            if (!isValid && errorElement) {
              errorElement.textContent = 'Password must be at least 8 characters and include a number, uppercase letter, and special character';
            }
          } else if (this.dataset.type === 'phone') {
            isValid = validatePhoneNumber(this.value);
            if (!isValid && errorElement) {
              errorElement.textContent = 'Please enter a 10-digit phone number';
            }
          }
        }
        
        // Update visual feedback
        if (isValid) {
          this.classList.remove('error');
          this.classList.add('valid');
          if (errorElement) errorElement.style.display = 'none';
        } else {
          this.classList.remove('valid');
          this.classList.add('error');
          if (errorElement) errorElement.style.display = 'block';
        }
      });
      
      // Also check on blur (when user leaves the field)
      input.addEventListener('blur', function() {
        // Trigger validation only if field is not empty or is required
        if (this.value.trim() || this.hasAttribute('required')) {
          // Create and dispatch an input event to reuse the same validation logic
          const inputEvent = new Event('input', { bubbles: true });
          this.dispatchEvent(inputEvent);
        }
      });
    });
  }
  
  // Initialize Form Validation
  function initFormValidation() {
    const form = document.getElementById('myForm');
    
    // Set up real-time validation
    setupRealTimeValidation();
    
    // Handle form submission
    form.addEventListener('submit', function(event) {
      const isValid = validateForm(event);
      
      if (isValid) {
        // For demo purposes, prevent actual submission and show success
        event.preventDefault();
        alert('Form submitted successfully!');
        // In a real app, you'd submit the form or make an AJAX call
        // form.submit();
      }
    });
  }