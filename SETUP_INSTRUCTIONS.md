# Setup Instructions for Email & WhatsApp Notifications

This guide will help you set up email and WhatsApp notifications for quiz submissions.

## 📧 Email Setup (Using EmailJS)

### Step 1: Create EmailJS Account
1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Sign up for a free account
3. Verify your email address

### Step 2: Add Email Service
1. In EmailJS dashboard, go to **Email Services**
2. Click **Add New Service**
3. Choose your email provider (Gmail, Outlook, etc.)
4. Follow the setup instructions
5. **Copy your Service ID** (you'll need this)

### Step 3: Create Email Template
1. Go to **Email Templates**
2. Click **Create New Template**
3. Use this template structure:

```
Subject: Quiz Submission: {{quiz_name}} - {{student_name}}

Hello,

You have received a new quiz submission:

Student: {{student_name}}
Email: {{student_email}}
Quiz: {{quiz_name}}
Score: {{score}} ({{percentage}}%)
Status: {{status}}

{{answers_html}}

Full Details:
{{message}}

Submitted on: {{timestamp}}
```

4. **Copy your Template ID** (you'll need this)

### Step 4: Get Your Public Key
1. Go to **Account** → **General**
2. Find your **Public Key**
3. **Copy your Public Key**

### Step 5: Update the Code
1. Open `notifications.js`
2. Replace these values:
   - `YOUR_SERVICE_ID` → Your EmailJS Service ID
   - `YOUR_TEMPLATE_ID` → Your EmailJS Template ID
   - `YOUR_PUBLIC_KEY` → Your EmailJS Public Key

3. Open `index.html`
4. Find the line: `// emailjs.init("YOUR_PUBLIC_KEY");`
5. Uncomment it and replace `YOUR_PUBLIC_KEY` with your actual public key:
   ```javascript
   emailjs.init("your-actual-public-key-here");
   ```

## 📱 WhatsApp Setup

You have several options for WhatsApp notifications:

### Option 1: Using Zapier (Recommended - Free)
1. Go to [https://zapier.com/](https://zapier.com/)
2. Sign up for a free account
3. Create a new Zap:
   - **Trigger**: Webhook (Catch Hook)
   - **Action**: WhatsApp (using WhatsApp Business API or a WhatsApp integration)
4. Copy the webhook URL
5. Update `notifications.js`:
   - Replace `YOUR_WEBHOOK_URL` with your Zapier webhook URL

### Option 2: Using Make.com (formerly Integromat)
1. Go to [https://www.make.com/](https://www.make.com/)
2. Sign up for a free account
3. Create a new scenario:
   - **Trigger**: Webhook
   - **Action**: WhatsApp (if available) or Email-to-WhatsApp
4. Copy the webhook URL
5. Update `notifications.js` with the webhook URL

### Option 3: Using Twilio WhatsApp API
1. Go to [https://www.twilio.com/](https://www.twilio.com/)
2. Sign up for an account
3. Get WhatsApp API access (may require approval)
4. Set up a webhook endpoint
5. Update `notifications.js` with your Twilio webhook URL

### Option 4: Simple Email-to-WhatsApp (If Available)
Some email providers offer email-to-WhatsApp forwarding. Check if your email provider supports this.

### Option 5: Custom Backend (Advanced)
Create your own backend endpoint that:
1. Receives quiz data via POST request
2. Sends email using a service like SendGrid, Mailgun, etc.
3. Sends WhatsApp using Twilio or WhatsApp Business API

## 🧪 Testing

1. After setup, test by submitting a quiz
2. Check your email: `codingprivatezim@gmail.com`
3. Check your WhatsApp: `+263775320423`
4. Verify that you receive notifications for both

## 📝 Current Configuration

- **Email**: codingprivatezim@gmail.com
- **WhatsApp**: +263775320423

These are already configured in `notifications.js`. You only need to set up the services (EmailJS and WhatsApp webhook).

## 🔧 Troubleshooting

### Email not working?
- Check EmailJS dashboard for error logs
- Verify your Service ID, Template ID, and Public Key are correct
- Make sure EmailJS script is loaded in the HTML
- Check browser console for errors

### WhatsApp not working?
- Verify your webhook URL is correct
- Check webhook service (Zapier/Make) for errors
- Ensure WhatsApp number format is correct: `+263775320423`
- Check browser console for errors

### Both not working?
- Open browser console (F12)
- Look for error messages
- Verify all scripts are loaded correctly
- Check network tab for failed requests

## 💡 Alternative: Simple Email-Only Setup

If WhatsApp setup is too complex, you can:
1. Set up only EmailJS (email notifications)
2. Configure your email to forward to WhatsApp (if your email provider supports it)
3. Or manually check email and forward important submissions to WhatsApp

## 📞 Support

If you need help with setup, refer to:
- EmailJS Documentation: https://www.emailjs.com/docs/
- Zapier Documentation: https://zapier.com/help
- Make.com Documentation: https://www.make.com/en/help

---

**Note**: The free tiers of these services have limits. For production use with many students, consider upgrading to paid plans.

