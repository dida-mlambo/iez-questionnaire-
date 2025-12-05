// Serverless function to send WhatsApp messages via Twilio
// Deploy this to Vercel, Netlify, or similar platform

// For Vercel: Place this file in /api/send-whatsapp.js
// For Netlify: Place this file in /netlify/functions/send-whatsapp.js

exports.handler = async (event, context) => {
    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        const data = JSON.parse(event.body);
        const twilio = require('twilio');
        
        // Your Twilio credentials (store as environment variables)
        const accountSid = process.env.TWILIO_ACCOUNT_SID;
        const authToken = process.env.TWILIO_AUTH_TOKEN;
        const fromNumber = process.env.TWILIO_WHATSAPP_NUMBER; // Format: whatsapp:+14155238886
        const toNumber = process.env.YOUR_WHATSAPP_NUMBER; // Format: whatsapp:+263775320423
        
        const client = twilio(accountSid, authToken);
        
        // Format the message
        const message = formatQuizMessage(data);
        
        // Send WhatsApp message
        const messageResult = await client.messages.create({
            from: fromNumber,
            to: toNumber,
            body: message
        });
        
        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*', // Allow CORS
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            body: JSON.stringify({
                success: true,
                messageSid: messageResult.sid,
                status: messageResult.status
            })
        };
    } catch (error) {
        console.error('Error sending WhatsApp:', error);
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                success: false,
                error: error.message
            })
        };
    }
};

// Format quiz data as WhatsApp message
function formatQuizMessage(data) {
    const user = data.student_name || 'Unknown Student';
    const email = data.student_email || 'Unknown Email';
    const quizName = data.quiz_name || 'Quiz';
    const score = data.score || '0/0';
    const percentage = data.percentage || '0%';
    const status = data.status || 'UNKNOWN';
    
    let message = `📚 *QUIZ SUBMISSION*\n\n`;
    message += `👤 *Student:* ${user}\n`;
    message += `📧 *Email:* ${email}\n`;
    message += `📝 *Quiz:* ${quizName}\n`;
    message += `📊 *Score:* ${score} (${percentage})\n`;
    message += `✅ *Status:* ${status}\n\n`;
    message += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
    message += `*ANSWERS:*\n\n`;
    
    if (data.quiz_data && data.quiz_data.questions) {
        data.quiz_data.questions.forEach((q, index) => {
            message += `*Q${q.questionNumber}:* ${q.questionText}\n`;
            message += `Answer: ${q.selectedAnswer}\n`;
            message += `Correct: ${q.correctAnswer}\n`;
            message += `Result: ${q.isCorrect ? '✓ CORRECT' : '✗ INCORRECT'}\n\n`;
        });
    }
    
    message += `\n📅 *Submitted:* ${new Date().toLocaleString()}`;
    
    return message;
}

// For Vercel deployment, use this format:
// module.exports = async (req, res) => { ... }

