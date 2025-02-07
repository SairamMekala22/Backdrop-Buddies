// Modal functionality
const loginBtn = document.getElementById('loginBtn');
const loginModal = document.getElementById('loginModal');
const closeBtn = document.querySelector('.close');
const loginForm = document.getElementById('loginForm');

// Open modal
loginBtn.addEventListener('click', () => {
    loginModal.style.display = 'flex';
});

// Close modal
closeBtn.addEventListener('click', () => {
    loginModal.style.display = 'none';
});

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === loginModal) {
        loginModal.style.display = 'none';
    }
});

// Handle login form submission
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    // Add your login logic here
    console.log('Login submitted');
    loginModal.style.display = 'none';
});

// Play buttons animation
const playBtns = document.querySelectorAll('.play-btn');
playBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        btn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            btn.style.transform = 'scale(1)';
        }, 100);
        
        // Add your game mode logic here
        const mode = btn.parentElement.querySelector('h2').textContent;
        console.log(`Starting ${mode}`);
    });
});

// Profile button functionality
const profileBtn = document.getElementById('profileBtn');
profileBtn.addEventListener('click', () => {
    // Add your profile page logic here
    console.log('Opening profile');
});

// Leaderboard button functionality
const leaderboardBtn = document.getElementById('leaderboardBtn');
leaderboardBtn.addEventListener('click', () => {
    // Add your leaderboard logic here
    console.log('Opening leaderboard');
});

// AI Chat Configuration
const AI_ENDPOINT = 'https://api.openai.com/v1/chat/completions';
const AI_MODEL = 'gpt-3.5-turbo';
const OPENAI_API_KEY = 'YOUR_OPENAI_API_KEY'; // Replace with your OpenAI API key

// AI Mentor Chat Functionality
const aiMentorButton = document.getElementById('aiMentorButton');
const chatContainer = document.getElementById('chatContainer');
const minimizeChat = document.getElementById('minimizeChat');
const chatMessages = document.getElementById('chatMessages');
const userInput = document.getElementById('userInput');
const sendMessage = document.getElementById('sendMessage');

// Store chat history
let chatHistory = [{
    role: 'system',
    content: `You are an AI mentor for a gaming platform that includes Story Mode, Quiz Mode, and Game Mode. 
    You help users navigate the platform, provide gaming tips, and answer questions about the different modes. 
    Keep responses concise, friendly, and gaming-focused.`
}];

// Toggle chat window
aiMentorButton.addEventListener('click', () => {
    chatContainer.style.display = chatContainer.style.display === 'none' ? 'block' : 'none';
});

// Minimize chat
minimizeChat.addEventListener('click', () => {
    chatContainer.style.display = 'none';
});

// Display message in chat
function displayMessage(message, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user-message' : 'ai-message'}`;
    
    if (!isUser) {
        messageDiv.innerHTML = `
            <i class="fas fa-robot"></i>
            <div class="message-content">${message}</div>
        `;
    } else {
        messageDiv.innerHTML = `
            <div class="message-content">${message}</div>
        `;
    }
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Show loading indicator
function showLoading() {
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'message ai-message loading';
    loadingDiv.innerHTML = `
        <i class="fas fa-robot"></i>
        <div class="message-content">
            <div class="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    `;
    chatMessages.appendChild(loadingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return loadingDiv;
}

// Get AI response
async function getAIResponse(userMessage) {
    try {
        // Add user message to chat history
        chatHistory.push({
            role: 'user',
            content: userMessage
        });

        const response = await axios.post(AI_ENDPOINT, {
            model: AI_MODEL,
            messages: chatHistory,
            temperature: 0.7,
            max_tokens: 150
        }, {
            headers: {
                'Authorization': `Bearer ${OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        const aiMessage = response.data.choices[0].message.content;
        
        // Add AI response to chat history
        chatHistory.push({
            role: 'assistant',
            content: aiMessage
        });

        // Keep chat history at a reasonable size
        if (chatHistory.length > 10) {
            chatHistory = [
                chatHistory[0], // Keep the system message
                ...chatHistory.slice(-9) // Keep the last 9 messages
            ];
        }

        return aiMessage;
    } catch (error) {
        console.error('Error getting AI response:', error);
        return "I apologize, but I'm having trouble connecting right now. Please try again in a moment.";
    }
}

// Send message function
async function sendUserMessage(message) {
    // Display user message
    displayMessage(message, true);
    
    // Show loading indicator
    const loadingDiv = showLoading();
    
    // Get and display AI response
    const aiResponse = await getAIResponse(message);
    loadingDiv.remove();
    displayMessage(aiResponse, false);
}

// Handle send message button click
sendMessage.addEventListener('click', async () => {
    const message = userInput.value.trim();
    if (message) {
        userInput.value = '';
        await sendUserMessage(message);
    }
});

// Handle enter key press
userInput.addEventListener('keypress', async (e) => {
    if (e.key === 'Enter') {
        const message = userInput.value.trim();
        if (message) {
            userInput.value = '';
            await sendUserMessage(message);
        }
    }
});
