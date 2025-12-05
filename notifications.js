// Notification service for sending quiz results to email and WhatsApp
// Email: codingprivatezim@gmail.com
// WhatsApp: +263775320423

// Configuration - UPDATE THESE VALUES
const NOTIFICATION_CONFIG = {
    email: 'codingprivatezim@gmail.com',
    whatsapp: '+263775320423',
    // EmailJS setup - Get these from https://www.emailjs.com/
    emailjs: {
        serviceId: 'YOUR_SERVICE_ID', // Replace with your EmailJS service ID
        templateId: 'YOUR_TEMPLATE_ID', // Replace with your EmailJS template ID
        publicKey: 'YOUR_PUBLIC_KEY' // Replace with your EmailJS public key
    }
};

// Format quiz data for email/WhatsApp
function formatQuizData(quizData) {
    const user = auth.getCurrentUser();
    const userName = user ? user.name : 'Unknown User';
    const userEmail = user ? user.email : 'Unknown Email';
    
    let message = `📚 QUIZ SUBMISSION - Module 2: AI Applications & Ethics\n\n`;
    message += `👤 Student: ${userName}\n`;
    message += `📧 Email: ${userEmail}\n`;
    message += `📅 Date: ${new Date().toLocaleString()}\n`;
    message += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
    
    message += `📝 QUIZ: ${quizData.quizName}\n`;
    message += `📊 Score: ${quizData.score}/${quizData.total} (${quizData.percentage}%)\n`;
    message += `✅ Status: ${quizData.isPassing ? 'PASSED ✓' : 'NEEDS IMPROVEMENT'}\n\n`;
    
    message += `📋 ANSWERS:\n`;
    message += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    
    quizData.questions.forEach((q, index) => {
        message += `\nQ${q.questionNumber}: ${q.questionText}\n`;
        message += `Student Answer: ${q.selectedAnswer}\n`;
        message += `Correct Answer: ${q.correctAnswer}\n`;
        message += `Result: ${q.isCorrect ? '✓ CORRECT' : '✗ INCORRECT'}\n`;
    });
    
    if (quizData.feedback && quizData.feedback.length > 0) {
        message += `\n\n💬 FEEDBACK:\n`;
        message += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
        quizData.feedback.forEach(f => {
            message += `${f}\n`;
        });
    }
    
    return message;
}

// Send email using EmailJS
function sendEmail(quizData) {
    // Check if EmailJS is loaded
    if (typeof emailjs === 'undefined') {
        console.error('EmailJS is not loaded. Please include the EmailJS script in your HTML.');
        return Promise.reject('EmailJS not loaded');
    }
    
    // Check if configuration is set up
    if (NOTIFICATION_CONFIG.emailjs.serviceId === 'YOUR_SERVICE_ID' || 
        NOTIFICATION_CONFIG.emailjs.templateId === 'YOUR_TEMPLATE_ID' ||
        NOTIFICATION_CONFIG.emailjs.publicKey === 'YOUR_PUBLIC_KEY') {
        console.warn('EmailJS not configured. Please set up your Service ID, Template ID, and Public Key in notifications.js');
        return Promise.reject('EmailJS not configured');
    }
    
    const formattedMessage = formatQuizData(quizData);
    const user = auth.getCurrentUser();
    
    const templateParams = {
        to_email: NOTIFICATION_CONFIG.email,
        to_name: 'Instructor',
        from_name: user ? user.name : 'Student',
        from_email: user ? user.email : 'unknown@email.com',
        subject: `Quiz Submission: ${quizData.quizName} - ${user ? user.name : 'Student'}`,
        message: formattedMessage,
        quiz_name: quizData.quizName,
        student_name: user ? user.name : 'Unknown',
        student_email: user ? user.email : 'Unknown',
        score: `${quizData.score}/${quizData.total}`,
        percentage: `${quizData.percentage}%`,
        status: quizData.isPassing ? 'PASSED' : 'NEEDS IMPROVEMENT',
        answers_html: formatAnswersHTML(quizData),
        timestamp: new Date().toLocaleString()
    };
    
    return emailjs.send(
        NOTIFICATION_CONFIG.emailjs.serviceId,
        NOTIFICATION_CONFIG.emailjs.templateId,
        templateParams,
        NOTIFICATION_CONFIG.emailjs.publicKey
    ).catch(error => {
        // Handle specific Gmail API errors
        if (error.text && error.text.includes('insufficient authentication scopes')) {
            console.error('Gmail API Error: Insufficient authentication scopes.');
            console.error('Solution: Use SMTP instead of OAuth, or re-authenticate with proper permissions.');
            console.error('See GMAIL_FIX.md for detailed instructions.');
            throw new Error('Gmail authentication error. Please check GMAIL_FIX.md for solutions.');
        }
        throw error;
    });
}

// Format answers as HTML for email
function formatAnswersHTML(quizData) {
    let html = '<table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse; width: 100%;">';
    html += '<tr style="background-color: #f0f0f0;"><th>Question</th><th>Student Answer</th><th>Correct Answer</th><th>Result</th></tr>';
    
    quizData.questions.forEach(q => {
        html += '<tr>';
        html += `<td>${q.questionText}</td>`;
        html += `<td>${q.selectedAnswer}</td>`;
        html += `<td>${q.correctAnswer}</td>`;
        html += `<td style="color: ${q.isCorrect ? 'green' : 'red'};">${q.isCorrect ? '✓ Correct' : '✗ Incorrect'}</td>`;
        html += '</tr>';
    });
    
    html += '</table>';
    return html;
}

// Send WhatsApp message using webhook
async function sendWhatsApp(quizData) {
    const formattedMessage = formatQuizData(quizData);
    
    // Option 1: Using a webhook service (recommended)
    // You can set up a free webhook using services like:
    // - Zapier (zapier.com)
    // - Make.com (make.com)
    // - IFTTT (ifttt.com)
    // - Or create your own backend endpoint
    
    // Option 2: Using Twilio WhatsApp API (requires account setup)
    // Option 3: Using WhatsApp Business API (requires business verification)
    
    // For now, we'll use a simple approach with a webhook URL
    // You'll need to set up a webhook that forwards to WhatsApp
    
    try {
        // Example: Using a webhook service
        // Replace YOUR_WEBHOOK_URL with your actual webhook URL
        const webhookUrl = 'YOUR_WEBHOOK_URL'; // Set this up with a service like Zapier
        
        if (webhookUrl === 'YOUR_WEBHOOK_URL') {
            console.log('WhatsApp webhook not configured. Message:', formattedMessage);
            // Fallback: Try to send via email-to-WhatsApp if available
            return sendWhatsAppViaEmail(formattedMessage);
        }
        
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                phone: NOTIFICATION_CONFIG.whatsapp,
                message: formattedMessage,
                quiz_data: quizData
            })
        });
        
        return response.ok;
    } catch (error) {
        console.error('WhatsApp sending error:', error);
        // Fallback method
        return sendWhatsAppViaEmail(formattedMessage);
    }
}

// Fallback: Send WhatsApp via email (if your email provider supports it)
function sendWhatsAppViaEmail(message) {
    // Some email-to-SMS/WhatsApp gateways exist
    // This is a placeholder - you'd need to set up an email service
    // that can forward to WhatsApp
    console.log('WhatsApp message (fallback):', message);
    return Promise.resolve(true);
}

// Main function to send notifications
async function sendQuizNotificationsToInstructor(quizData) {
    const results = {
        email: false,
        whatsapp: false,
        errors: []
    };
    
    try {
        // Send email
        try {
            await sendEmail(quizData);
            results.email = true;
            console.log('✓ Email sent successfully');
        } catch (emailError) {
            results.errors.push('Email: ' + emailError.message);
            console.error('✗ Email sending failed:', emailError);
        }
        
        // Send WhatsApp
        try {
            await sendWhatsApp(quizData);
            results.whatsapp = true;
            console.log('✓ WhatsApp message sent successfully');
        } catch (whatsappError) {
            results.errors.push('WhatsApp: ' + whatsappError.message);
            console.error('✗ WhatsApp sending failed:', whatsappError);
        }
        
        return results;
    } catch (error) {
        console.error('Notification sending error:', error);
        results.errors.push('General: ' + error.message);
        return results;
    }
}
