// Authentication check and initialization - redirect to login if not authenticated
window.addEventListener('DOMContentLoaded', function() {
    // Check authentication first
    if (!auth.isAuthenticated()) {
        window.location.href = 'login.html';
        return;
    }
    
    // Display user info
    const currentUser = auth.getCurrentUser();
    if (currentUser) {
        const welcomeMsg = document.getElementById('welcome-message');
        if (welcomeMsg) {
            welcomeMsg.textContent = `Welcome, ${currentUser.name}!`;
        }
    }
    
    // Load saved action plan
    const savedPlan = localStorage.getItem('aiModuleActionPlan');
    if (savedPlan) {
        try {
            const plan = JSON.parse(savedPlan);
            const applicationField = document.getElementById('application');
            const principleField = document.getElementById('principle');
            if (applicationField) applicationField.value = plan.application || '';
            if (principleField) principleField.value = plan.principle || '';
        } catch (e) {
            console.error('Error loading saved action plan:', e);
        }
    }
    
    // Add smooth scroll behavior for better UX
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add animation on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all sections
    document.querySelectorAll('.part').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });
});

// Quiz checking function
function checkQuiz(quizId, correctAnswers) {
    const form = document.getElementById(quizId);
    const resultDiv = document.getElementById(quizId + '-result');
    const questions = form.querySelectorAll('.question');
    
    let score = 0;
    let total = correctAnswers.length;
    let feedback = [];
    let quizData = {
        quizName: getQuizName(quizId),
        questions: [],
        score: 0,
        total: total,
        percentage: 0,
        isPassing: false,
        feedback: []
    };
    
    questions.forEach((question, index) => {
        const questionText = question.querySelector('p strong') ? 
            question.querySelector('p strong').textContent : 
            `Question ${index + 1}`;
        const inputs = question.querySelectorAll('input[type="radio"]:checked, input[type="checkbox"]:checked');
        const selectedValues = Array.from(inputs).map(input => {
            const label = input.closest('label');
            return label ? label.textContent.trim() : input.value;
        });
        const selectedAnswer = selectedValues.join(', ');
        const correct = correctAnswers[index];
        
        // Handle both single answer (string) and multiple answer (array) cases
        let isCorrect = false;
        let correctAnswerText = '';
        
        if (Array.isArray(correct)) {
            // For checkboxes - check if all correct answers are selected and no incorrect ones
            const correctSet = new Set(correct);
            const selectedSet = new Set(Array.from(inputs).map(input => input.value));
            isCorrect = correct.length === selectedValues.length && 
                       correct.every(val => selectedSet.has(val)) &&
                       Array.from(inputs).every(input => correctSet.has(input.value));
            
            // Get correct answer text
            const correctLabels = Array.from(question.querySelectorAll('label')).filter(label => {
                const input = label.querySelector('input');
                return input && correct.includes(input.value);
            }).map(label => label.textContent.trim().replace(/^\w+\s+/, ''));
            correctAnswerText = correctLabels.join(', ');
        } else {
            // For radio buttons - single answer
            isCorrect = inputs.length === 1 && inputs[0].value === correct;
            
            // Get correct answer text
            const correctLabel = Array.from(question.querySelectorAll('label')).find(label => {
                const input = label.querySelector('input');
                return input && input.value === correct;
            });
            correctAnswerText = correctLabel ? correctLabel.textContent.trim().replace(/^\w+\s+/, '') : correct;
        }
        
        if (isCorrect) {
            score++;
            feedback.push(`Question ${index + 1}: ✓ Correct`);
        } else {
            feedback.push(`Question ${index + 1}: ✗ Incorrect`);
        }
        
        quizData.questions.push({
            questionNumber: index + 1,
            questionText: questionText,
            selectedAnswer: selectedAnswer,
            correctAnswer: correctAnswerText,
            isCorrect: isCorrect
        });
    });
    
    const percentage = Math.round((score / total) * 100);
    const isPassing = percentage >= 70;
    
    quizData.score = score;
    quizData.percentage = percentage;
    quizData.isPassing = isPassing;
    quizData.feedback = feedback;
    
    resultDiv.className = 'quiz-result show ' + (isPassing ? 'success' : 'error');
    resultDiv.innerHTML = `
        <h4>Results: ${score}/${total} (${percentage}%)</h4>
        <ul style="list-style: none; padding: 0; margin-top: 10px;">
            ${feedback.map(f => `<li>${f}</li>`).join('')}
        </ul>
        ${isPassing ? 
            '<p style="margin-top: 15px; font-weight: bold;">Great job! You understand the key concepts.</p>' : 
            '<p style="margin-top: 15px; font-weight: bold;">Please review the material and try again.</p>'
        }
        <p style="margin-top: 15px; font-size: 0.9em; color: #666;">📧 Your answers have been sent to your instructor.</p>
    `;
    
    // Send notifications
    sendQuizNotifications(quizData);
    
    // Scroll to result
    resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Helper function to get quiz name
function getQuizName(quizId) {
    const quizNames = {
        'quiz1': 'Part 1: Recap & Introduction',
        'quiz2': 'Part 2: AI Applications',
        'quiz3': 'Part 3: Ethical & Risk Framework',
        'final-quiz': 'Final Module Assessment'
    };
    return quizNames[quizId] || 'Quiz';
}

// Final quiz checking function (handles mixed question types)
function checkFinalQuiz() {
    const form = document.getElementById('final-quiz');
    const resultDiv = document.getElementById('final-quiz-result');
    
    let score = 0;
    let total = 5;
    let feedback = [];
    let quizData = {
        quizName: 'Final Module Assessment',
        questions: [],
        score: 0,
        total: total,
        percentage: 0,
        isPassing: false,
        feedback: []
    };
    
    // Question 1
    const q1 = form.querySelector('input[name="fq1"]:checked');
    const q1Label = q1 ? q1.closest('label').textContent.trim() : 'No answer';
    const q1Correct = q1 && q1.value === 'a';
    if (q1Correct) {
        score++;
        feedback.push('Question 1: ✓ Correct');
    } else {
        feedback.push('Question 1: ✗ Incorrect - Drafting formal letters is an appropriate use of AI');
    }
    quizData.questions.push({
        questionNumber: 1,
        questionText: 'Which of the following is an appropriate use of AI for secretariat operations?',
        selectedAnswer: q1Label,
        correctAnswer: 'Drafting a formal letter to a ministry',
        isCorrect: q1Correct
    });
    
    // Question 2
    const q2 = form.querySelector('input[name="fq2"]:checked');
    const q2Label = q2 ? q2.closest('label').textContent.trim() : 'No answer';
    const q2Correct = q2 && q2.value === 'b';
    if (q2Correct) {
        score++;
        feedback.push('Question 2: ✓ Correct');
    } else {
        feedback.push('Question 2: ✗ Incorrect - Always apply human judgment and investigate further');
    }
    quizData.questions.push({
        questionNumber: 2,
        questionText: 'What should you do if AI identifies a trend in membership data?',
        selectedAnswer: q2Label,
        correctAnswer: 'Apply human judgment and investigate further',
        isCorrect: q2Correct
    });
    
    // Question 3 (checkboxes)
    const q3 = form.querySelectorAll('input[name="fq3"]:checked');
    const q3Labels = Array.from(q3).map(cb => cb.closest('label').textContent.trim());
    const q3Values = Array.from(q3).map(cb => cb.value);
    const correctQ3 = ['bias', 'privacy', 'hallucination', 'transparency'];
    const correctSet = new Set(correctQ3);
    const selectedSet = new Set(q3Values);
    const isQ3Correct = correctQ3.length === q3Values.length && 
                       correctQ3.every(val => selectedSet.has(val)) &&
                       q3Values.every(val => correctSet.has(val));
    
    if (isQ3Correct) {
        score++;
        feedback.push('Question 3: ✓ Correct');
    } else {
        feedback.push('Question 3: ✗ Incorrect - The four key risks are: Bias & Fairness, Privacy & Data Security, Hallucination & Accuracy, and Transparency & Accountability');
    }
    quizData.questions.push({
        questionNumber: 3,
        questionText: 'What are the four key ethical risks discussed in this module? (Select all that apply)',
        selectedAnswer: q3Labels.join(', ') || 'No answer',
        correctAnswer: 'Bias & Fairness, Privacy & Data Security, Hallucination & Accuracy, Transparency & Accountability',
        isCorrect: isQ3Correct
    });
    
    // Question 4
    const q4 = form.querySelector('input[name="fq4"]:checked');
    const q4Label = q4 ? q4.closest('label').textContent.trim() : 'No answer';
    const q4Correct = q4 && q4.value === 'false';
    if (q4Correct) {
        score++;
        feedback.push('Question 4: ✓ Correct');
    } else {
        feedback.push('Question 4: ✗ Incorrect - AI should enhance, not replace, your professional judgment');
    }
    quizData.questions.push({
        questionNumber: 4,
        questionText: 'True or False: AI can be used as a replacement for your professional judgment.',
        selectedAnswer: q4Label,
        correctAnswer: 'False',
        isCorrect: q4Correct
    });
    
    // Question 5
    const q5 = form.querySelector('input[name="fq5"]:checked');
    const q5Label = q5 ? q5.closest('label').textContent.trim() : 'No answer';
    const q5Correct = q5 && q5.value === 'b';
    if (q5Correct) {
        score++;
        feedback.push('Question 5: ✓ Correct');
    } else {
        feedback.push('Question 5: ✗ Incorrect - Copilot for Microsoft 365 is recommended for enterprise use');
    }
    quizData.questions.push({
        questionNumber: 5,
        questionText: 'Which tool is recommended for enterprise use with data protection?',
        selectedAnswer: q5Label,
        correctAnswer: 'Copilot for Microsoft 365',
        isCorrect: q5Correct
    });
    
    const percentage = Math.round((score / total) * 100);
    const isPassing = percentage >= 70;
    
    quizData.score = score;
    quizData.percentage = percentage;
    quizData.isPassing = isPassing;
    quizData.feedback = feedback;
    
    resultDiv.className = 'quiz-result show ' + (isPassing ? 'success' : 'error');
    resultDiv.innerHTML = `
        <h4>Final Assessment Results: ${score}/${total} (${percentage}%)</h4>
        <ul style="list-style: none; padding: 0; margin-top: 10px;">
            ${feedback.map(f => `<li>${f}</li>`).join('')}
        </ul>
        ${isPassing ? 
            '<p style="margin-top: 15px; font-weight: bold; font-size: 1.2em;">Congratulations! You have successfully completed Module 2!</p>' : 
            '<p style="margin-top: 15px; font-weight: bold;">Please review the material and try again. You need at least 70% to pass.</p>'
        }
        <p style="margin-top: 15px; font-size: 0.9em; color: #666;">📧 Your answers have been sent to your instructor.</p>
    `;
    
    // Send notifications
    sendQuizNotifications(quizData);
    
    // Scroll to result
    resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Function to send quiz notifications (wrapper for notifications.js)
function sendQuizNotifications(quizData) {
    if (typeof sendQuizNotificationsToInstructor !== 'undefined') {
        sendQuizNotificationsToInstructor(quizData);
    } else {
        console.log('Notification service not loaded. Quiz data:', quizData);
    }
}

// Save action plan function
function saveActionPlan() {
    const application = document.getElementById('application').value.trim();
    const principle = document.getElementById('principle').value.trim();
    const resultDiv = document.getElementById('action-plan-result');
    
    if (!application || !principle) {
        alert('Please fill in both fields before saving your action plan.');
        return;
    }
    
    // Save to localStorage
    const actionPlan = {
        application: application,
        principle: principle,
        date: new Date().toLocaleDateString()
    };
    
    localStorage.setItem('aiModuleActionPlan', JSON.stringify(actionPlan));
    
    resultDiv.className = 'action-plan-result show';
    resultDiv.innerHTML = `
        <h4>✓ Action Plan Saved Successfully!</h4>
        <p><strong>AI Application:</strong> ${application}</p>
        <p><strong>Ethical Principle:</strong> ${principle}</p>
        <p style="margin-top: 10px; font-size: 0.9em; color: #666;">Your action plan has been saved. You can view it anytime by checking your browser's local storage.</p>
    `;
    
    // Scroll to result
    resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}


