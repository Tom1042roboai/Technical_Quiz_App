class QuizApp {
    constructor() {
        this.questions = [];
        this.currentQuestionIndex = 0;
        this.userAnswers = [];
        this.timer = null;
        this.timeLeft = 0;
        this.selectedTopics = [];
        this.isQuizActive = false;
        
        this.initializeQuiz();
    }
    
    async initializeQuiz() {
        // Get selected topics from localStorage
        this.selectedTopics = JSON.parse(localStorage.getItem('selectedTopics') || '[]');
        
        if (this.selectedTopics.length === 0) {
            alert('No topics selected. Redirecting to homepage.');
            window.location.href = 'index.html';
            return;
        }
        
        // Load questions from all parts
        await this.loadQuestions();
        
        // Filter and randomize questions
        this.prepareQuizQuestions();
        
        // Start the quiz
        this.startQuiz();
    }
    
    async loadQuestions() {
        try {
            // Create a mapping from topic names to file names
            const topicFileMap = {
                'Machine Learning': 'Machine_Learning.json',
                'Deep Learning': 'Deep_Learning.json',
                'Reinforcement Learning': 'Reinforcement_Learning.json',
                'Robotics': 'Robotics.json',
                'Data Structure and Algorithms': 'Data_Structure_and_Algorithms.json',
                'Object Oriented programming': 'Object_Oriented_Programming.json',
                'Python': 'Python.json',
                'Numpy': 'Numpy.json',
                'Pytorch': 'Pytorch.json',
                'C++': 'Cpp.json',
                'Distributed Systems': 'Distributed_Systems.json',
                'Maths': 'Maths.json'
            };
            
            // Only load files for selected topics
            const topicsToLoad = this.selectedTopics.filter(topic => topicFileMap[topic]);
            
            if (topicsToLoad.length === 0) {
                throw new Error('No valid topic files found for selected topics');
            }
            
            const responses = await Promise.all(
                topicsToLoad.map(topic => fetch(`./${topicFileMap[topic]}`))
            );
            
            const data = await Promise.all(responses.map(r => r.json()));
            
            // Store questions by topic
            this.allQuestions = {};
            topicsToLoad.forEach((topicName, index) => {
                this.allQuestions[topicName] = data[index];
            });
            
        } catch (error) {
            console.error('Error loading questions:', error);
            alert('Error loading questions. Please try again.');
            window.location.href = 'index.html';
        }
    }
    
    prepareQuizQuestions() {
        const availableQuestions = [];
        
        // Collect questions from all topics in the allQuestions object
        for (const topic in this.allQuestions) {
            if (this.selectedTopics.includes(topic)) {
                const topicQuestions = this.allQuestions[topic];
                // Convert to array if it's an object
                const questionsArray = Array.isArray(topicQuestions) ? topicQuestions : Object.values(topicQuestions);
                
                questionsArray.forEach(question => {
                    if (question && question.question) {
                        availableQuestions.push({
                            ...question,
                            topic: topic
                        });
                    }
                });
            }
        }
        
        // Shuffle questions randomly
        this.questions = this.shuffleArray(availableQuestions);
        
        // Limit to 96 questions or available questions (whichever is smaller)
        this.questions = this.questions.slice(0, Math.min(96, this.questions.length));
    }
    
    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
    
    startQuiz() {
        this.isQuizActive = true;
        this.displayQuestion();
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        // Quit button
        document.getElementById('quitBtn').addEventListener('click', () => {
            if (confirm('Are you sure you want to quit the quiz?')) {
                this.endQuiz();
            }
        });
    }
    
    displayQuestion() {
        if (this.currentQuestionIndex >= this.questions.length) {
            this.endQuiz();
            return;
        }
        
        const question = this.questions[this.currentQuestionIndex];
        
        // Update question counter
        document.getElementById('questionCounter').textContent = 
            `Question ${this.currentQuestionIndex + 1} of ${this.questions.length}`;
        
        // Update progress bar
        const progress = ((this.currentQuestionIndex) / this.questions.length) * 100;
        document.getElementById('progressFill').style.width = `${progress}%`;
        
        // Display question
        document.getElementById('questionText').textContent = question.question;
        document.getElementById('topicBadge').textContent = question.topic;
        
        // Create a copy of options and shuffle them
        const shuffledOptions = [...question.options];
        
        // Get the correct answer (handle both "answer" and "correct" index formats)
        let correctAnswerText;
        if (question.answer) {
            correctAnswerText = question.answer;
        } else if (typeof question.correct === 'number') {
            correctAnswerText = question.options[question.correct];
        } else {
            correctAnswerText = question.options[0]; // fallback
        }
        
        // Shuffle the options array
        for (let i = shuffledOptions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledOptions[i], shuffledOptions[j]] = [shuffledOptions[j], shuffledOptions[i]];
        }
        
        // Store the correct answer and shuffled options
        this.correctAnswer = correctAnswerText;
        this.shuffledOptions = shuffledOptions;
        
        // Display shuffled options and set up event listeners
        const optionBtns = document.querySelectorAll('.option-btn');
        optionBtns.forEach((btn, index) => {
            if (index < shuffledOptions.length) {
                btn.textContent = shuffledOptions[index];
                btn.className = 'option-btn';
                btn.style.display = 'block';
                btn.disabled = false;
                
                // Remove existing listeners and add new one
                btn.replaceWith(btn.cloneNode(true));
            } else {
                btn.style.display = 'none';
            }
        });
        
        // Re-attach event listeners after cloning
        document.querySelectorAll('.option-btn').forEach((btn, index) => {
            if (index < shuffledOptions.length) {
                btn.addEventListener('click', () => this.selectAnswer(index));
            }
        });
        
        // Reset quiz state
        this.isQuizActive = true;
        
        // Start timer
        this.startTimer(question.time_limit || 15); // Default to 15 seconds if not specified
    }
    
    startTimer(seconds) {
        this.timeLeft = seconds;
        document.getElementById('timer').textContent = `${this.timeLeft}s`;
        
        this.timer = setInterval(() => {
            this.timeLeft--;
            document.getElementById('timer').textContent = `${this.timeLeft}s`;
            
            if (this.timeLeft <= 0) {
                this.selectAnswer(-1); // No answer selected
            }
        }, 1000);
    }
    
    selectAnswer(selectedIndex) {
        if (!this.isQuizActive) return;
        
        clearInterval(this.timer);
        this.isQuizActive = false;
        
        const question = this.questions[this.currentQuestionIndex];
        const optionBtns = document.querySelectorAll('.option-btn');
        
        // Disable all buttons
        optionBtns.forEach(btn => {
            btn.disabled = true;
        });
        
        // Find the index of the correct answer in the shuffled options
        const correctAnswerText = question.answer;
        const selectedAnswerText = selectedIndex >= 0 ? this.shuffledOptions[selectedIndex] : 'Skipped';
        const isCorrect = selectedIndex >= 0 && selectedAnswerText === correctAnswerText;
        
        // Mark correct and incorrect answers
        optionBtns.forEach((btn, index) => {
            if (index < this.shuffledOptions.length) {
                const optionText = this.shuffledOptions[index];
                if (optionText === correctAnswerText) {
                    btn.classList.add('correct');
                } else if (index === selectedIndex) {
                    btn.classList.add('incorrect');
                }
            }
        });
        
        // Store user's answer
        this.userAnswers.push({
            question: question.question,
            userAnswer: selectedAnswerText,
            correctAnswer: correctAnswerText,
            isCorrect: isCorrect,
            explanation: question.explanation || 'No explanation available',
            topic: question.topic || 'General'
        });
        
        // Store the current question and options for review
        this.userAnswers[this.userAnswers.length - 1].options = [...this.shuffledOptions];
        
        // Move to next question after 2 seconds
        setTimeout(() => {
            this.currentQuestionIndex++;
            if (this.currentQuestionIndex < this.questions.length) {
                this.displayQuestion();
            } else {
                this.endQuiz();
            }
        }, 2000);
    }
    
    endQuiz() {
        this.isQuizActive = false;
        clearInterval(this.timer);
        
        // Store results in localStorage
        localStorage.setItem('quizResults', JSON.stringify({
            answers: this.userAnswers,
            selectedTopics: this.selectedTopics,
            totalQuestions: this.questions.length,
            completedAt: new Date().toISOString()
        }));
        
        // Navigate to results page
        window.location.href = 'results.html';
    }
}

// Initialize quiz when page loads
document.addEventListener('DOMContentLoaded', () => {
    new QuizApp();
});
