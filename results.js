class ResultsApp {
    constructor() {
        this.results = null;
        this.initializeResults();
    }
    
    initializeResults() {
        // Get quiz results from localStorage
        this.results = JSON.parse(localStorage.getItem('quizResults'));
        
        if (!this.results) {
            alert('No quiz results found. Redirecting to homepage.');
            window.location.href = 'index.html';
            return;
        }
        
        this.displayResults();
        this.setupEventListeners();
    }
    
    displayResults() {
        this.displayScoreSummary();
        this.displayTopicBreakdown();
        this.displayQuestionReview();
    }
    
    displayScoreSummary() {
        const correctAnswers = this.results.answers.filter(answer => answer.isCorrect).length;
        const totalQuestions = this.results.answers.length;
        const percentage = Math.round((correctAnswers / totalQuestions) * 100);
        
        document.getElementById('scoreText').textContent = `${correctAnswers}/${totalQuestions}`;
        document.getElementById('percentageText').textContent = `${percentage}%`;
    }
    
    displayTopicBreakdown() {
        const topicStats = {};
        
        // Calculate stats for each topic
        this.results.answers.forEach(answer => {
            if (!topicStats[answer.topic]) {
                topicStats[answer.topic] = {
                    correct: 0,
                    total: 0
                };
            }
            topicStats[answer.topic].total++;
            if (answer.isCorrect) {
                topicStats[answer.topic].correct++;
            }
        });
        
        const topicStatsContainer = document.getElementById('topicStats');
        topicStatsContainer.innerHTML = '';
        
        Object.entries(topicStats).forEach(([topic, stats]) => {
            const percentage = Math.round((stats.correct / stats.total) * 100);
            const statElement = document.createElement('div');
            statElement.className = 'topic-stat';
            statElement.innerHTML = `
                <div class="topic-name">${topic}</div>
                <div class="topic-score">${stats.correct}/${stats.total} (${percentage}%)</div>
            `;
            topicStatsContainer.appendChild(statElement);
        });
    }
    
    displayQuestionReview() {
        const questionsContainer = document.getElementById('questionsList');
        questionsContainer.innerHTML = '';
        
        this.results.answers.forEach((answer, index) => {
            const questionElement = document.createElement('div');
            questionElement.className = 'question-item';
            
            questionElement.innerHTML = `
                <div class="question-header" onclick="toggleQuestion(${index})">
                    <div class="question-info">
                        <span class="question-number">Q${index + 1}</span>
                        <span class="question-text">${answer.question}</span>
                    </div>
                    <div class="question-status-container">
                        <span class="question-status ${answer.isCorrect ? 'correct' : 'incorrect'}">
                            ${answer.isCorrect ? '✓ Correct' : '✗ Incorrect'}
                        </span>
                        <span class="toggle-icon">+</span>
                    </div>
                </div>
                <div class="question-details" id="details-${index}" style="display: none;">
                    <div class="answer-summary">
                        <div class="user-answer">
                            <strong>Your Answer:</strong> 
                            <span class="${answer.isCorrect ? 'correct-text' : 'incorrect-text'}">${answer.userAnswer}</span>
                        </div>
                        <div class="correct-answer">
                            <strong>Correct Answer:</strong> 
                            <span class="correct-text">${answer.correctAnswer}</span>
                        </div>
                    </div>
                    <div class="options-container">
                        ${answer.options ? answer.options.map((option, i) => {
                            let optionClass = 'answer-option';
                            let icon = '';
                            
                            if (option === answer.correctAnswer) {
                                optionClass += ' correct-answer';
                                icon = ' ✓';
                            }
                            if (option === answer.userAnswer && option !== answer.correctAnswer) {
                                optionClass += ' user-incorrect';
                                icon = ' ✗';
                            } else if (option === answer.userAnswer) {
                                optionClass += ' user-selected';
                            }
                            
                            return `<div class="${optionClass}">
                                ${String.fromCharCode(65 + i)}. ${option}${icon}
                            </div>`;
                        }).join('') : ''}
                    </div>
                    ${answer.explanation ? `
                    <div class="explanation">
                        <strong>💡 Explanation:</strong> ${answer.explanation}
                    </div>` : ''}
                </div>
            `;
            
            questionsContainer.appendChild(questionElement);
        });
    }
    
    setupEventListeners() {
        document.getElementById('retakeBtn').addEventListener('click', () => {
            // Clear previous results and go back to homepage
            localStorage.removeItem('quizResults');
            window.location.href = 'index.html';
        });
        
        document.getElementById('homeBtn').addEventListener('click', () => {
            window.location.href = 'index.html';
        });
    }
}

// Global function to toggle question details
function toggleQuestion(index) {
    const details = document.getElementById(`details-${index}`);
    const toggleIcon = document.querySelector(`[onclick="toggleQuestion(${index})"] .toggle-icon`);
    
    if (details.style.display === 'none' || details.style.display === '') {
        details.style.display = 'block';
        if (toggleIcon) toggleIcon.textContent = '-';
    } else {
        details.style.display = 'none';
        if (toggleIcon) toggleIcon.textContent = '+';
    }
}

// Initialize results when page loads
document.addEventListener('DOMContentLoaded', () => {
    new ResultsApp();
});
