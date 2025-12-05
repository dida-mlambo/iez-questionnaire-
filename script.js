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
    
    questions.forEach((question, index) => {
        const inputs = question.querySelectorAll('input[type="radio"]:checked, input[type="checkbox"]:checked');
        const selectedValues = Array.from(inputs).map(input => input.value);
        const correct = correctAnswers[index];
        
        // Handle both single answer (string) and multiple answer (array) cases
        let isCorrect = false;
        if (Array.isArray(correct)) {
            // For checkboxes - check if all correct answers are selected and no incorrect ones
            const correctSet = new Set(correct);
            const selectedSet = new Set(selectedValues);
            isCorrect = correct.length === selectedValues.length && 
                       correct.every(val => selectedSet.has(val)) &&
                       selectedValues.every(val => correctSet.has(val));
        } else {
            // For radio buttons - single answer
            isCorrect = selectedValues.length === 1 && selectedValues[0] === correct;
        }
        
        if (isCorrect) {
            score++;
            feedback.push(`Question ${index + 1}: ✓ Correct`);
        } else {
            feedback.push(`Question ${index + 1}: ✗ Incorrect`);
        }
    });
    
    const percentage = Math.round((score / total) * 100);
    const isPassing = percentage >= 70;
    
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
    `;
    
    // Scroll to result
    resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Final quiz checking function (handles mixed question types)
function checkFinalQuiz() {
    const form = document.getElementById('final-quiz');
    const resultDiv = document.getElementById('final-quiz-result');
    
    let score = 0;
    let total = 5;
    let feedback = [];
    
    // Question 1
    const q1 = form.querySelector('input[name="fq1"]:checked');
    if (q1 && q1.value === 'a') {
        score++;
        feedback.push('Question 1: ✓ Correct');
    } else {
        feedback.push('Question 1: ✗ Incorrect - Drafting formal letters is an appropriate use of AI');
    }
    
    // Question 2
    const q2 = form.querySelector('input[name="fq2"]:checked');
    if (q2 && q2.value === 'b') {
        score++;
        feedback.push('Question 2: ✓ Correct');
    } else {
        feedback.push('Question 2: ✗ Incorrect - Always apply human judgment and investigate further');
    }
    
    // Question 3 (checkboxes)
    const q3 = form.querySelectorAll('input[name="fq3"]:checked');
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
    
    // Question 4
    const q4 = form.querySelector('input[name="fq4"]:checked');
    if (q4 && q4.value === 'false') {
        score++;
        feedback.push('Question 4: ✓ Correct');
    } else {
        feedback.push('Question 4: ✗ Incorrect - AI should enhance, not replace, your professional judgment');
    }
    
    // Question 5
    const q5 = form.querySelector('input[name="fq5"]:checked');
    if (q5 && q5.value === 'b') {
        score++;
        feedback.push('Question 5: ✓ Correct');
    } else {
        feedback.push('Question 5: ✗ Incorrect - Copilot for Microsoft 365 is recommended for enterprise use');
    }
    
    const percentage = Math.round((score / total) * 100);
    const isPassing = percentage >= 70;
    
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
    `;
    
    // Scroll to result
    resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
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


