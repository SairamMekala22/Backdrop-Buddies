// Check authentication status on page load
document.addEventListener('DOMContentLoaded', () => {
    checkAuthStatus();
    updateNavigation();
    setupEventListeners();
    setupChatWidget();
});

function checkAuthStatus() {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    
    if (token && username) {
        // User is logged in
        updateUIForLoggedInUser(username);
    } else {
        // User is not logged in
        updateUIForLoggedOutUser();
    }
}

function updateUIForLoggedInUser(username) {
    const loginBtn = document.getElementById('loginBtn');
    const profileBtn = document.getElementById('profileBtn');
    
    if (loginBtn) {
        loginBtn.innerHTML = '<i class="fas fa-sign-out-alt"></i> Logout';
        loginBtn.href = '#';
        loginBtn.addEventListener('click', handleLogout);
    }
    
    if (profileBtn) {
        profileBtn.style.display = 'block';
        profileBtn.innerHTML = `<i class="fas fa-user"></i> ${username}`;
    }

    // Enable all auth-required elements
    document.querySelectorAll('.auth-required').forEach(elem => {
        elem.style.display = 'block';
    });
}

function updateUIForLoggedOutUser() {
    const loginBtn = document.getElementById('loginBtn');
    const profileBtn = document.getElementById('profileBtn');
    
    if (loginBtn) {
        loginBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Login';
        loginBtn.href = 'login.html';
    }
    
    if (profileBtn) {
        profileBtn.style.display = 'none';
    }

    // Disable auth-required elements
    document.querySelectorAll('.auth-required').forEach(elem => {
        if (!elem.id.includes('login')) {
            elem.style.display = 'none';
        }
    });
}

function handleLogout() {
    // Clear local storage
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    
    // Update UI
    updateUIForLoggedOutUser();
    
    // Show logout message
    showNotification('Logged out successfully!', 'success');
    
    // Redirect to login page after a short delay
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 1500);
}

function updateNavigation() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const loginBtn = document.getElementById('loginBtn');
    const navProfile = document.querySelector('.nav-profile');
    const navUsername = document.getElementById('navUsername');

    if (isLoggedIn) {
        // Hide login button and show profile
        if (loginBtn) loginBtn.style.display = 'none';
        if (navProfile) navProfile.style.display = 'block';
        if (navUsername) {
            const username = localStorage.getItem('username');
            navUsername.textContent = username || 'User';
        }
    } else {
        // Show login button and hide profile
        if (loginBtn) loginBtn.style.display = 'block';
        if (navProfile) navProfile.style.display = 'none';
    }
}

function setupEventListeners() {
    // Logout button handler
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('token');
            localStorage.removeItem('username');
            localStorage.removeItem('userEmail');
            localStorage.removeItem('isLoggedIn');
            window.location.href = 'login.html';
        });
    }

    // Add click listeners for game mode buttons
    document.querySelectorAll('.play-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            if (!localStorage.getItem('token')) {
                e.preventDefault();
                showNotification('Please login to play!', 'warning');
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 1500);
            }
        });
    });
}

// Update navigation when storage changes (e.g., when logging in/out in another tab)
window.addEventListener('storage', (e) => {
    if (e.key === 'isLoggedIn' || e.key === 'username') {
        updateNavigation();
    }
});

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Add to document
    document.body.appendChild(notification);
    
    // Remove after animation
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Add this to styles.css
const style = document.createElement('style');
style.textContent = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 2rem;
        border-radius: 5px;
        background: white;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
    }
    
    .notification.success {
        background: #2ecc71;
        color: white;
    }
    
    .notification.warning {
        background: #f1c40f;
        color: white;
    }
    
    .notification.error {
        background: #e74c3c;
        color: white;
    }
    
    .notification.fade-out {
        animation: fadeOut 0.3s ease-out forwards;
    }
    
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes fadeOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;

document.head.appendChild(style);

// Chat Widget Functionality
function setupChatWidget() {
    const chatButton = document.getElementById('chatButton');
    const chatContainer = document.getElementById('chatContainer');
    const minimizeChat = document.getElementById('minimizeChat');
    const sendMessage = document.getElementById('sendMessage');
    const userInput = document.getElementById('userInput');
    const chatMessages = document.getElementById('chatMessages');

    // Toggle chat window
    chatButton.addEventListener('click', () => {
        chatContainer.classList.add('active');
        chatButton.style.display = 'none';
    });

    // Minimize chat window
    minimizeChat.addEventListener('click', () => {
        chatContainer.classList.remove('active');
        chatButton.style.display = 'flex';
    });

    // Send message
    sendMessage.addEventListener('click', () => {
        sendUserMessage();
    });

    // Send message on Enter (but create new line on Shift+Enter)
    userInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendUserMessage();
        }
    });

    // Auto-resize textarea
    userInput.addEventListener('input', () => {
        userInput.style.height = 'auto';
        userInput.style.height = (userInput.scrollHeight) + 'px';
    });

    function sendUserMessage() {
        const message = userInput.value.trim();
        if (!message) return;

        // Add user message
        addMessage(message, 'user');

        // Clear input
        userInput.value = '';
        userInput.style.height = 'auto';

        // Show typing indicator
        showTypingIndicator();

        // Simulate AI response
        setTimeout(() => {
            removeTypingIndicator();
            const responses = [
                "I can help you with that! Let me know what specific questions you have about the quiz.",
                "That's interesting! Would you like to know more about our quiz categories?",
                "I understand. Have you tried our practice quizzes yet?",
                "Great question! Our quizzes are designed to help improve your critical thinking skills."
            ];
            const response = responses[Math.floor(Math.random() * responses.length)];
            addMessage(response, 'bot');
        }, 1500);
    }

    function addMessage(content, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        
        if (type === 'bot') {
            messageDiv.innerHTML = `
                <i class="fas fa-robot bot-avatar"></i>
                <div class="message-content">${content}</div>
            `;
        } else {
            messageDiv.innerHTML = `
                <div class="message-content">${content}</div>
            `;
        }

        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message bot typing-indicator';
        typingDiv.innerHTML = `
            <i class="fas fa-robot bot-avatar"></i>
            <div class="message-content typing">
                <span></span>
                <span></span>
                <span></span>
            </div>
        `;
        chatMessages.appendChild(typingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function removeTypingIndicator() {
        const typingIndicator = chatMessages.querySelector('.typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }
}
