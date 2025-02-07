document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('errorMessage');
    const togglePassword = document.querySelector('.toggle-password');
    const passwordInput = document.getElementById('password');

    // Toggle password visibility
    togglePassword.addEventListener('click', () => {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        togglePassword.classList.toggle('fa-eye');
        togglePassword.classList.toggle('fa-eye-slash');
    });

    // Handle form submission
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const remember = document.getElementById('remember').checked;

        try {
            // Here you would typically make an API call to your backend
            const response = await mockLoginAPI(email, password);
            
            if (response.success) {
                // Store user data in localStorage
                if (remember) {
                    localStorage.setItem('userEmail', email);
                }
                localStorage.setItem('userToken', response.token);
                localStorage.setItem('userName', response.user.name);
                
                // Redirect to home page
                window.location.href = 'index.html';
            } else {
                showError(response.message);
            }
        } catch (error) {
            showError('An error occurred. Please try again.');
        }
    });

    // Mock login API call (replace with actual API call)
    async function mockLoginAPI(email, password) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Mock validation
        if (email === 'test@example.com' && password === 'password') {
            return {
                success: true,
                token: 'mock-jwt-token',
                user: {
                    name: 'Test User',
                    email: email
                }
            };
        }

        return {
            success: false,
            message: 'Invalid email or password'
        };
    }

    // Show error message
    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.opacity = '1';
        setTimeout(() => {
            errorMessage.style.opacity = '0';
        }, 3000);
    }

    // Handle social login buttons
    const googleBtn = document.querySelector('.social-btn.google');
    const githubBtn = document.querySelector('.social-btn.github');

    googleBtn.addEventListener('click', () => {
        // Implement Google OAuth login
        console.log('Google login clicked');
    });

    githubBtn.addEventListener('click', () => {
        // Implement GitHub OAuth login
        console.log('GitHub login clicked');
    });

    // Auto-fill email if remembered
    const rememberedEmail = localStorage.getItem('userEmail');
    if (rememberedEmail) {
        document.getElementById('email').value = rememberedEmail;
        document.getElementById('remember').checked = true;
    }
});
