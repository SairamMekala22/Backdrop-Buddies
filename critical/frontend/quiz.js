// Quiz state
let currentQuestionIndex = 0;
let score = 0;
let timeLeft = 90;
let timer = null;
let questions = [];

// Critical thinking questions database
const criticalThinkingQuestions = [
    {
        question: "A bat and a ball cost $1.10 in total. The bat costs $1.00 more than the ball. How much does the ball cost?",
        options: ["$0.10", "$0.05", "$1.00", "$0.15"],
        correct: 1,
        explanation: "If the ball costs $0.05 and the bat costs $1.05 (which is $1.00 more than the ball), then together they cost $1.10.",
        category: "Mathematical Reasoning",
        difficulty: "medium"
    },
    {
        question: "If it takes 5 machines 5 minutes to make 5 widgets, how long would it take 100 machines to make 100 widgets?",
        options: ["100 minutes", "5 minutes", "20 minutes", "25 minutes"],
        correct: 1,
        explanation: "This is a rate problem. The time remains constant because the ratio of machines to widgets stays the same.",
        category: "Logical Reasoning",
        difficulty: "hard"
    },
    {
        question: "In a lake, there is a patch of lily pads. Every day, the patch doubles in size. If it takes 48 days for the patch to cover the entire lake, how long would it take for the patch to cover half of the lake?",
        options: ["24 days", "47 days", "46 days", "32 days"],
        correct: 1,
        explanation: "Since the patch doubles each day, it would take one day before the end (day 47) for it to be half the size.",
        category: "Pattern Recognition",
        difficulty: "hard"
    },
    {
        question: "If you're running a race and you pass the person in second place, what position are you in?",
        options: ["First place", "Second place", "Third place", "Cannot be determined"],
        correct: 1,
        explanation: "If you pass the person in second place, you take their position - second place.",
        category: "Logical Reasoning",
        difficulty: "medium"
    },
    {
        question: "A farmer has 17 sheep, all but 9 die. How many sheep are left?",
        options: ["8", "9", "0", "17"],
        correct: 1,
        explanation: "The phrase 'all but 9' means that 9 sheep survived.",
        category: "Language Logic",
        difficulty: "medium"
    },
    {
        question: "If you have a cube painted red on all sides and cut it into 27 smaller cubes (3x3x3), how many small cubes will have exactly one face painted red?",
        options: ["6", "12", "9", "8"],
        correct: 2,
        explanation: "The middle cube of each face will have one red side, making 6 cubes. The edge centers will have one red side too, making 3 more cubes.",
        category: "Spatial Reasoning",
        difficulty: "hard"
    },
    {
        question: "Three people check into a hotel room that costs $30. They each pay $10. Later, the hotel clerk realizes the room only costs $25 and sends the bellboy to return $5. The bellboy decides to keep $2 and give each person $1 back. Now each person paid $9 (total $27) and the bellboy has $2. What happened to the other $1?",
        options: [
            "The money was lost",
            "This is a trick question - the math is wrong",
            "The bellboy stole it",
            "There is no missing dollar"
        ],
        correct: 1,
        explanation: "This is a misdirection. The $27 paid and $2 kept by bellboy shouldn't be added. The actual math is: $25 (room) + $2 (bellboy) = $27.",
        category: "Critical Analysis",
        difficulty: "hard"
    },
    {
        question: "If a doctor gives you 3 pills and tells you to take one every half hour, how long would it take to finish all the pills?",
        options: ["1.5 hours", "1 hour", "2 hours", "2.5 hours"],
        correct: 1,
        explanation: "First pill at 0 minutes, second at 30 minutes, third at 60 minutes (1 hour) = total 1 hour.",
        category: "Time Logic",
        difficulty: "medium"
    },
    {
        question: "In a certain town, 5% of all accidents involve bicycles. If there are 160 accidents involving bicycles, how many total accidents were there?",
        options: ["800", "3200", "1600", "2400"],
        correct: 1,
        explanation: "If 160 is 5%, then 100% would be 160 × 20 = 3200 accidents.",
        category: "Mathematical Reasoning",
        difficulty: "medium"
    },
    {
        question: "If all Zorks are Yinks, and some Yinks are Wags, which statement must be true?",
        options: [
            "All Wags are Zorks",
            "Some Zorks are Wags",
            "All Yinks are Zorks",
            "None of the above"
        ],
        correct: 3,
        explanation: "Just because all Zorks are Yinks and some Yinks are Wags, we cannot definitively conclude any of the first three statements.",
        category: "Logical Deduction",
        difficulty: "hard"
    }
];

// DOM elements
const startScreen = document.getElementById('start-screen');
const questionScreen = document.getElementById('question-screen');
const resultScreen = document.getElementById('result-screen');
const startButton = document.getElementById('start-quiz');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options');
const scoreElement = document.getElementById('score');
const timeElement = document.getElementById('time');
const currentQuestionElement = document.getElementById('currentQuestion');
const finalScoreElement = document.getElementById('final-score');
const correctAnswersElement = document.getElementById('correct-answers');
const timeTakenElement = document.getElementById('time-taken');
const tryAgainButton = document.getElementById('try-again');
const prevButton = document.getElementById('prev-question');
const nextButton = document.getElementById('next-question');

// Track user answers
let userAnswers = [];
let answeredQuestions = new Set();

// Shuffle array function
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Start quiz
async function startQuiz() {
    // Reset quiz state
    currentQuestionIndex = 0;
    score = 0;
    timeLeft = 90;
    userAnswers = new Array(criticalThinkingQuestions.length).fill(null);
    answeredQuestions.clear();
    
    // Shuffle and get questions
    questions = shuffleArray([...criticalThinkingQuestions]);
    
    // Update UI
    startScreen.style.display = 'none';
    questionScreen.style.display = 'block';
    resultScreen.style.display = 'none';
    scoreElement.textContent = score;
    
    // Start timer
    startTimer();
    
    // Show first question
    showQuestion();
    updateNavigationButtons();
}

// Show question
function showQuestion() {
    const question = questions[currentQuestionIndex];
    questionText.textContent = `[${question.category}] ${question.question}`;
    currentQuestionElement.textContent = currentQuestionIndex + 1;
    
    // Clear previous options
    optionsContainer.innerHTML = '';
    
    // Add options
    question.options.forEach((option, index) => {
        const optionButton = document.createElement('button');
        optionButton.className = 'option';
        if (userAnswers[currentQuestionIndex] === index) {
            optionButton.classList.add(index === question.correct ? 'correct' : 'wrong');
        }
        optionButton.textContent = option;
        optionButton.addEventListener('click', () => selectOption(index));
        
        // Disable if already answered
        if (answeredQuestions.has(currentQuestionIndex)) {
            optionButton.style.pointerEvents = 'none';
        }
        
        optionsContainer.appendChild(optionButton);
    });
    
    // Show explanation if question was answered
    if (answeredQuestions.has(currentQuestionIndex)) {
        const explanationDiv = document.createElement('div');
        explanationDiv.className = 'explanation';
        explanationDiv.innerHTML = `<p><strong>Explanation:</strong> ${question.explanation}</p>`;
        optionsContainer.appendChild(explanationDiv);
    }
    
    updateNavigationButtons();
}

// Update navigation buttons
function updateNavigationButtons() {
    prevButton.disabled = currentQuestionIndex === 0;
    nextButton.disabled = currentQuestionIndex === questions.length - 1 || 
                         !answeredQuestions.has(currentQuestionIndex);
}

// Select option
function selectOption(selectedIndex) {
    if (answeredQuestions.has(currentQuestionIndex)) return;
    
    const question = questions[currentQuestionIndex];
    const options = document.querySelectorAll('.option');
    
    // Disable all options
    options.forEach(option => option.style.pointerEvents = 'none');
    
    // Show correct/wrong
    options[selectedIndex].classList.add(selectedIndex === question.correct ? 'correct' : 'wrong');
    options[question.correct].classList.add('correct');
    
    // Store user's answer
    userAnswers[currentQuestionIndex] = selectedIndex;
    answeredQuestions.add(currentQuestionIndex);
    
    // Show explanation
    const explanationDiv = document.createElement('div');
    explanationDiv.className = 'explanation';
    explanationDiv.innerHTML = `<p><strong>Explanation:</strong> ${question.explanation}</p>`;
    optionsContainer.appendChild(explanationDiv);
    
    // Update score
    if (selectedIndex === question.correct) {
        const difficultyBonus = {
            'easy': 5,
            'medium': 8,
            'hard': 10
        };
        score += difficultyBonus[question.difficulty] || 5;
        scoreElement.textContent = score;
    }
    
    updateNavigationButtons();
}

// Navigation functions
function goToPreviousQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        showQuestion();
    }
}

function goToNextQuestion() {
    if (currentQuestionIndex < questions.length - 1 && answeredQuestions.has(currentQuestionIndex)) {
        currentQuestionIndex++;
        showQuestion();
    }
}

// Start timer
function startTimer() {
    timer = setInterval(() => {
        timeLeft--;
        timeElement.textContent = timeLeft;
        
        if (timeLeft <= 0) {
            endQuiz();
        }
    }, 1000);
}

// End quiz
function endQuiz() {
    clearInterval(timer);
    
    // Show result screen
    questionScreen.style.display = 'none';
    resultScreen.style.display = 'block';
    
    // Calculate percentage score
    const maxPossibleScore = questions.reduce((total, q) => {
        const difficultyBonus = {
            'easy': 5,
            'medium': 8,
            'hard': 10
        };
        return total + difficultyBonus[q.difficulty];
    }, 0);
    
    const percentage = Math.round((score / maxPossibleScore) * 100);
    
    // Update result stats
    finalScoreElement.textContent = `${score} (${percentage}%)`;
    correctAnswersElement.textContent = questions.filter((q, index) => {
        const selectedOption = document.querySelectorAll('.option')[index]?.classList.contains('correct');
        return selectedOption;
    }).length;
    timeTakenElement.textContent = 90 - timeLeft;
}

// Event listeners
startButton.addEventListener('click', startQuiz);
tryAgainButton.addEventListener('click', startQuiz);
prevButton.addEventListener('click', goToPreviousQuestion);
nextButton.addEventListener('click', goToNextQuestion);
