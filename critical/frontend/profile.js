document.addEventListener('DOMContentLoaded', () => {
    // Initialize user data
    loadUserData();
    setupTabNavigation();
    setupCharts();
    loadRecentActivity();
    setupLogout();
    setupSettingsForm();
});

function loadUserData() {
    // Get user data from localStorage
    const userName = localStorage.getItem('userName') || 'Guest User';
    const userEmail = localStorage.getItem('userEmail') || 'guest@example.com';

    // Update profile header
    document.getElementById('userName').textContent = userName;
    document.getElementById('userEmail').textContent = userEmail;

    // Load mock statistics
    document.getElementById('quizScore').textContent = '850';
    document.getElementById('userRank').textContent = '#42';
    document.getElementById('completedQuizzes').textContent = '24';
    document.getElementById('achievementCount').textContent = '12';
}

function setupTabNavigation() {
    const menuItems = document.querySelectorAll('.menu-item[data-tab]');
    const tabContents = document.querySelectorAll('.tab-content');

    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            // Remove active class from all menu items and tabs
            menuItems.forEach(i => i.classList.remove('active'));
            tabContents.forEach(t => t.classList.remove('active'));

            // Add active class to clicked item and corresponding tab
            item.classList.add('active');
            const tabId = item.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });
}

function setupCharts() {
    // Performance Chart
    const performanceCtx = document.getElementById('performanceChart').getContext('2d');
    new Chart(performanceCtx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Quiz Performance',
                data: [65, 72, 68, 75, 82, 85],
                borderColor: '#4a90e2',
                tension: 0.4,
                fill: true,
                backgroundColor: 'rgba(74, 144, 226, 0.1)'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100
                }
            }
        }
    });

    // Category Chart
    const categoryCtx = document.getElementById('categoryChart').getContext('2d');
    new Chart(categoryCtx, {
        type: 'radar',
        data: {
            labels: ['Logic', 'Analysis', 'Problem Solving', 'Decision Making', 'Creative Thinking'],
            datasets: [{
                label: 'Your Skills',
                data: [85, 75, 82, 78, 88],
                backgroundColor: 'rgba(74, 144, 226, 0.2)',
                borderColor: '#4a90e2',
                pointBackgroundColor: '#4a90e2'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                r: {
                    beginAtZero: true,
                    max: 100
                }
            }
        }
    });

    // Weekly Progress Chart
    const weeklyCtx = document.getElementById('weeklyChart').getContext('2d');
    new Chart(weeklyCtx, {
        type: 'bar',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Quizzes Completed',
                data: [4, 3, 5, 2, 4, 6, 3],
                backgroundColor: '#4a90e2'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 10
                }
            }
        }
    });
}

function loadRecentActivity() {
    const activityList = document.getElementById('activityList');
    const activities = [
        {
            type: 'quiz',
            title: 'Completed Logic Quiz',
            score: 85,
            time: '2 hours ago'
        },
        {
            type: 'achievement',
            title: 'Earned "Quick Thinker" Badge',
            description: 'Complete 5 quizzes in under 15 minutes',
            time: '1 day ago'
        },
        {
            type: 'rank',
            title: 'Reached Top 50',
            description: 'Global Ranking',
            time: '2 days ago'
        }
    ];

    activities.forEach(activity => {
        const activityItem = document.createElement('div');
        activityItem.className = 'activity-item';
        activityItem.innerHTML = `
            <div class="activity-icon">
                <i class="fas fa-${activity.type === 'quiz' ? 'check-circle' : 
                               activity.type === 'achievement' ? 'trophy' : 'chart-line'}"></i>
            </div>
            <div class="activity-details">
                <h4>${activity.title}</h4>
                ${activity.score ? `<p>Score: ${activity.score}%</p>` : 
                  activity.description ? `<p>${activity.description}</p>` : ''}
                <span class="activity-time">${activity.time}</span>
            </div>
        `;
        activityList.appendChild(activityItem);
    });
}

function setupLogout() {
    const logoutBtn = document.getElementById('logoutBtn');
    logoutBtn.addEventListener('click', () => {
        // Clear user data from localStorage
        localStorage.removeItem('userToken');
        localStorage.removeItem('userName');
        localStorage.removeItem('userEmail');

        // Redirect to login page
        window.location.href = 'login.html';
    });
}

function setupSettingsForm() {
    const profileForm = document.getElementById('profileSettingsForm');
    const displayName = document.getElementById('displayName');
    const settingsEmail = document.getElementById('settingsEmail');
    const userBio = document.getElementById('userBio');

    // Load current values
    displayName.value = localStorage.getItem('userName') || '';
    settingsEmail.value = localStorage.getItem('userEmail') || '';
    userBio.value = localStorage.getItem('userBio') || '';

    // Handle form submission
    profileForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Save to localStorage
        localStorage.setItem('userName', displayName.value);
        localStorage.setItem('userEmail', settingsEmail.value);
        localStorage.setItem('userBio', userBio.value);

        // Update profile header
        document.getElementById('userName').textContent = displayName.value;
        document.getElementById('userEmail').textContent = settingsEmail.value;

        // Show success message
        alert('Profile updated successfully!');
    });

    // Handle preferences
    const emailNotifications = document.getElementById('emailNotifications');
    const darkMode = document.getElementById('darkMode');

    emailNotifications.checked = localStorage.getItem('emailNotifications') === 'true';
    darkMode.checked = localStorage.getItem('darkMode') === 'true';

    emailNotifications.addEventListener('change', () => {
        localStorage.setItem('emailNotifications', emailNotifications.checked);
    });

    darkMode.addEventListener('change', () => {
        localStorage.setItem('darkMode', darkMode.checked);
        if (darkMode.checked) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    });
}
