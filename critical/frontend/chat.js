// Create and append chat widget HTML
function createChatWidget() {
    const chatWidgetHTML = `
        <div class="chat-widget" id="chatWidget">
            <div class="chat-button" id="chatButton">
                <i class="fas fa-robot"></i>
                <span>Ask AI</span>
            </div>
            <div class="chat-container" id="chatContainer">
                <div class="chat-header">
                    <div class="chat-title">
                        <i class="fas fa-robot"></i>
                        <span>Quiz Assistant</span>
                    </div>
                    <button class="minimize-btn" id="minimizeChat">
                        <i class="fas fa-minus"></i>
                    </button>
                </div>
                <div class="chat-messages" id="chatMessages">
                    <div class="message bot">
                        <i class="fas fa-robot bot-avatar"></i>
                        <div class="message-content">
                            Hi! 👋 I'm your quiz assistant. I can help you with:
                            <ul>
                                <li>Quiz strategies</li>
                                <li>Topic explanations</li>
                                <li>Practice tips</li>
                                <li>General guidance</li>
                            </ul>
                            How can I assist you today?
                        </div>
                    </div>
                </div>
                <div class="chat-input">
                    <textarea id="userInput" placeholder="Ask me anything..." rows="1"></textarea>
                    <button id="sendMessage">
                        <i class="fas fa-paper-plane"></i>
                    </button>
                </div>
            </div>
        </div>
    `;

    // Create a div to hold the chat widget
    const chatWidgetContainer = document.createElement('div');
    chatWidgetContainer.innerHTML = chatWidgetHTML;
    document.body.appendChild(chatWidgetContainer.firstElementChild);

    // Initialize chat functionality
    setupChatWidget();
}

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
                "Great question! Our quizzes are designed to help improve your critical thinking skills.",
                "I can explain that topic in more detail. What specific aspect would you like to know about?",
                "Let me help you understand this better. Would you like some examples?",
                "That's a common question! Here's what you need to know...",
                "I'd be happy to help you with quiz strategies. What's your goal?"
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

// Initialize chat widget when the page loads
document.addEventListener('DOMContentLoaded', createChatWidget);
