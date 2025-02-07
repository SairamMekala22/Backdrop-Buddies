const API_URL = 'http://localhost:3000/api';
const globalBtn = document.getElementById('globalBtn');
const personalBtn = document.getElementById('personalBtn');
const globalLeaderboard = document.getElementById('globalLeaderboard');
const personalLeaderboard = document.getElementById('personalLeaderboard');
const globalScores = document.getElementById('globalScores');
const personalScores = document.getElementById('personalScores');

// Filter and sort controls
const timeFrameSelect = document.createElement('select');
timeFrameSelect.innerHTML = `
    <option value="all">All Time</option>
    <option value="today">Today</option>
    <option value="week">This Week</option>
    <option value="month">This Month</option>
`;

const sortBySelect = document.createElement('select');
sortBySelect.innerHTML = `
    <option value="score">Highest Score</option>
    <option value="accuracy">Best Accuracy</option>
    <option value="speed">Fastest Time</option>
`;

const filterControls = document.createElement('div');
filterControls.className = 'filter-controls';
filterControls.innerHTML = `
    <div class="filter-group">
        <label>Time Period:</label>
        ${timeFrameSelect.outerHTML}
    </div>
    <div class="filter-group">
        <label>Sort By:</label>
        ${sortBySelect.outerHTML}
    </div>
`;

document.querySelector('#globalLeaderboard h2').after(filterControls);

// Add event listeners to filters
timeFrameSelect.addEventListener('change', loadGlobalScores);
sortBySelect.addEventListener('change', loadGlobalScores);

// Switch between global and personal leaderboards
globalBtn.addEventListener('click', () => {
    globalBtn.classList.add('active');
    personalBtn.classList.remove('active');
    globalLeaderboard.classList.remove('hidden');
    personalLeaderboard.classList.add('hidden');
    loadGlobalScores();
});

personalBtn.addEventListener('click', () => {
    if (!localStorage.getItem('username')) {
        alert('Please log in to view your scores');
        return;
    }
    personalBtn.classList.add('active');
    globalBtn.classList.remove('active');
    personalLeaderboard.classList.remove('hidden');
    globalLeaderboard.classList.add('hidden');
    loadPersonalScores();
});

// Format time in seconds to MM:SS
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// Format date to readable string
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
}

// Load global leaderboard
async function loadGlobalScores() {
    const timeFrame = timeFrameSelect.value;
    const sortBy = sortBySelect.value;
    
    try {
        const response = await fetch(
            `${API_URL}/scores?timeFrame=${timeFrame}&sortBy=${sortBy}`
        );
        const data = await response.json();
        const { scores, stats } = data;
        
        // Update stats
        const statsHTML = `
            <div class="global-stats">
                <div class="stat-item">
                    <span class="stat-label">Average Score</span>
                    <span class="stat-value">${Math.round(stats.avgScore)}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Average Accuracy</span>
                    <span class="stat-value">${Math.round(stats.avgAccuracy)}%</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Total Players</span>
                    <span class="stat-value">${stats.totalPlayers}</span>
                </div>
            </div>
        `;
        
        document.querySelector('.global-stats')?.remove();
        document.querySelector('#globalLeaderboard h2').after(
            createElementFromHTML(statsHTML)
        );
        
        // Update scores
        globalScores.innerHTML = scores.map((score, index) => `
            <div class="score-row ${index < 3 ? 'rank-' + (index + 1) : ''}">
                <span>${index + 1}</span>
                <span>${score.username}</span>
                <span>${score.score}</span>
                <span>${Math.round(score.accuracy)}%</span>
                <span>${formatTime(score.timeTaken)}</span>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading global scores:', error);
        globalScores.innerHTML = '<div class="error">Error loading scores. Please try again later.</div>';
    }
}

// Load personal scores and achievements
async function loadPersonalScores() {
    const username = localStorage.getItem('username');
    if (!username) return;

    try {
        const [scoresResponse, achievementsResponse, analyticsResponse] = await Promise.all([
            fetch(`${API_URL}/scores/${username}`),
            fetch(`${API_URL}/achievements/${username}`),
            fetch(`${API_URL}/analytics/${username}`)
        ]);
        
        const { scores, stats, globalRank } = await scoresResponse.json();
        const { achievements, progress } = await achievementsResponse.json();
        const analytics = await analyticsResponse.json();
        
        // Update personal stats
        const statsHTML = `
            <div class="personal-stats">
                <div class="stat-group">
                    <div class="stat-item">
                        <span class="stat-label">Global Rank</span>
                        <span class="stat-value">#${globalRank}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Highest Score</span>
                        <span class="stat-value">${Math.round(stats.highestScore)}</span>
                    </div>
                </div>
                <div class="stat-group">
                    <div class="stat-item">
                        <span class="stat-label">Average Score</span>
                        <span class="stat-value">${Math.round(stats.avgScore)}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Average Accuracy</span>
                        <span class="stat-value">${Math.round(stats.avgAccuracy)}%</span>
                    </div>
                </div>
                <div class="stat-group">
                    <div class="stat-item">
                        <span class="stat-label">Total Games</span>
                        <span class="stat-value">${stats.totalGames}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Questions Answered</span>
                        <span class="stat-value">${stats.totalQuestions}</span>
                    </div>
                </div>
            </div>
            
            <div class="analytics-section">
                <h3>Performance Analytics</h3>
                <div class="analytics-tabs">
                    <button class="tab-btn active" data-tab="category">By Category</button>
                    <button class="tab-btn" data-tab="difficulty">By Difficulty</button>
                    <button class="tab-btn" data-tab="time">By Time of Day</button>
                    <button class="tab-btn" data-tab="progress">Progress</button>
                </div>
                
                <div class="tab-content active" id="category-tab">
                    <div class="stat-cards">
                        ${analytics.categoryStats.map(stat => `
                            <div class="stat-card">
                                <h4>${stat._id || 'Unknown'}</h4>
                                <div class="stat-details">
                                    <div>Score: ${Math.round(stat.avgScore)}</div>
                                    <div>Accuracy: ${Math.round(stat.avgAccuracy)}%</div>
                                    <div>Games: ${stat.gamesPlayed}</div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="tab-content" id="difficulty-tab">
                    <div class="stat-cards">
                        ${analytics.difficultyStats.map(stat => `
                            <div class="stat-card">
                                <h4>${stat._id || 'Unknown'}</h4>
                                <div class="stat-details">
                                    <div>Score: ${Math.round(stat.avgScore)}</div>
                                    <div>Accuracy: ${Math.round(stat.avgAccuracy)}%</div>
                                    <div>Games: ${stat.gamesPlayed}</div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="tab-content" id="time-tab">
                    <div class="stat-cards">
                        ${analytics.timeStats.map(stat => `
                            <div class="stat-card">
                                <h4>${stat._id}</h4>
                                <div class="stat-details">
                                    <div>Score: ${Math.round(stat.avgScore)}</div>
                                    <div>Accuracy: ${Math.round(stat.avgAccuracy)}%</div>
                                    <div>Games: ${stat.gamesPlayed}</div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="tab-content" id="progress-tab">
                    <div class="improvement-stats">
                        <div class="improvement-item ${analytics.improvement.score > 0 ? 'positive' : 'negative'}">
                            <span class="improvement-label">Score Improvement</span>
                            <span class="improvement-value">${analytics.improvement.score}%</span>
                        </div>
                        <div class="improvement-item ${analytics.improvement.accuracy > 0 ? 'positive' : 'negative'}">
                            <span class="improvement-label">Accuracy Improvement</span>
                            <span class="improvement-value">${analytics.improvement.accuracy}%</span>
                        </div>
                        <div class="improvement-item ${analytics.improvement.speed > 0 ? 'positive' : 'negative'}">
                            <span class="improvement-label">Speed Improvement</span>
                            <span class="improvement-value">${analytics.improvement.speed}%</span>
                        </div>
                    </div>
                    <div id="progress-chart"></div>
                </div>
            </div>
            
            <div class="achievements">
                <h3>Achievements</h3>
                <div class="achievement-list">
                    ${Object.entries(achievements).map(([key, achieved]) => `
                        <div class="achievement ${achieved ? 'achieved' : 'locked'}">
                            <span class="achievement-icon">${achieved ? '🏆' : '🔒'}</span>
                            <span class="achievement-name">${formatAchievementName(key)}</span>
                            ${progress[key] ? `
                                <div class="achievement-progress">
                                    <div class="progress-bar" style="width: ${(progress[key].current / progress[key].required) * 100}%"></div>
                                    <span class="progress-text">${progress[key].current}/${progress[key].required}</span>
                                </div>
                            ` : ''}
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        
        document.querySelector('.personal-stats')?.remove();
        document.querySelector('.analytics-section')?.remove();
        document.querySelector('.achievements')?.remove();
        document.querySelector('#personalLeaderboard h2').after(
            createElementFromHTML(statsHTML)
        );
        
        // Initialize tabs
        initializeTabs();
        
        // Create progress chart
        createProgressChart(analytics.progressStats);
        
        // Update scores
        personalScores.innerHTML = scores.map(score => `
            <div class="score-row">
                <span>${formatDate(score.date)}</span>
                <span>${score.score}</span>
                <span>${score.correctAnswers}</span>
                <span>${score.totalQuestions}</span>
                <span>${formatTime(score.timeTaken)}</span>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading personal scores:', error);
        personalScores.innerHTML = '<div class="error">Error loading your scores. Please try again later.</div>';
    }
}

function initializeTabs() {
    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs and content
            tabs.forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked tab and its content
            tab.classList.add('active');
            document.getElementById(`${tab.dataset.tab}-tab`).classList.add('active');
        });
    });
}

function createProgressChart(progressStats) {
    // Implementation would go here using a charting library like Chart.js
    // For now, we'll just show the data in a table
    const chartContainer = document.getElementById('progress-chart');
    chartContainer.innerHTML = `
        <table class="progress-table">
            <thead>
                <tr>
                    <th>Period</th>
                    <th>Average Score</th>
                    <th>Average Accuracy</th>
                    <th>Games Played</th>
                </tr>
            </thead>
            <tbody>
                ${progressStats.map(stat => `
                    <tr>
                        <td>Week ${stat._id.week}, ${stat._id.year}</td>
                        <td>${Math.round(stat.avgScore)}</td>
                        <td>${Math.round(stat.avgAccuracy)}%</td>
                        <td>${stat.gamesPlayed}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

function formatAchievementName(key) {
    const names = {
        perfectScore: 'Perfect Score',
        speedDemon: 'Speed Demon',
        consistent: 'Consistency King',
        veteran: 'Quiz Veteran',
        highScorer: 'High Scorer',
        mathWhiz: 'Math Whiz',
        logicMaster: 'Logic Master',
        patternPro: 'Pattern Pro',
        quickThinker: 'Quick Thinker',
        marathon: 'Marathon Runner',
        perfectStreak: 'Perfect Streak',
        accuracyStreak: 'Accuracy Streak',
        dailyChallenger: 'Daily Challenger',
        improvement: 'Rising Star'
    };
    return names[key] || key;
}

// Helper functions
function createElementFromHTML(htmlString) {
    const div = document.createElement('div');
    div.innerHTML = htmlString.trim();
    return div.firstChild;
}

// Initial load
loadGlobalScores();
if (localStorage.getItem('username')) {
    loadPersonalScores();
}
