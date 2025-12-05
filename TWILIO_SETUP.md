# Twilio WhatsApp Integration Setup Guide

This guide will help you connect Twilio WhatsApp to receive quiz answers from your website.

## 📱 Your WhatsApp Number
**+263775320423**

## 🚀 Quick Setup Options

### Option 1: Using Zapier/Make.com (Easiest - No Coding)

This is the easiest way if you don't want to set up a backend server.

#### Using Zapier:
1. **Sign up**: Go to https://zapier.com/ (free account available)
2. **Create a Zap**:
   - **Trigger**: Webhooks by Zapier → Catch Hook
   - **Action**: Twilio → Send WhatsApp Message
3. **Get Webhook URL**: Copy the webhook URL from Zapier
4. **Configure Twilio**:
   - Connect your Twilio account in Zapier
   - Set recipient: `+263775320423`
   - Map the message field from webhook data
5. **Update notifications.js**:
   - Replace `YOUR_BACKEND_WEBHOOK_URL` with your Zapier webhook URL

#### Using Make.com (formerly Integromat):
1. **Sign up**: Go to https://www.make.com/ (free account available)
2. **Create a Scenario**:
   - **Module 1**: Webhooks → Custom webhook
   - **Module 2**: Twilio → Send WhatsApp Message
3. **Get Webhook URL**: Copy from Make.com
4. **Update notifications.js** with the webhook URL

---

### Option 2: Using Serverless Function (Vercel/Netlify) - Recommended

This gives you full control and is free to host.

#### Step 1: Get Twilio Credentials

1. **Sign up for Twilio**: https://www.twilio.com/
2. **Get your credentials** from Twilio Console:
   - Account SID
   - Auth Token
   - WhatsApp Number (format: `whatsapp:+14155238886`)

#### Step 2: Set Up WhatsApp Sandbox (For Testing)

1. In Twilio Console → **Messaging** → **Try it out** → **Send a WhatsApp message**
2. Follow instructions to join the sandbox
3. Send the join code to the Twilio WhatsApp number
4. Once joined, you can receive messages

#### Step 3: Deploy to Vercel (Free)

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Deploy your site**:
   ```bash
   cd ~/ai-module-website
   vercel
   ```

3. **Set Environment Variables** in Vercel Dashboard:
   - `TWILIO_ACCOUNT_SID` = Your Twilio Account SID
   - `TWILIO_AUTH_TOKEN` = Your Twilio Auth Token
   - `TWILIO_WHATSAPP_NUMBER` = Your Twilio WhatsApp number (format: `whatsapp:+14155238886`)
   - `YOUR_WHATSAPP_NUMBER` = `whatsapp:+263775320423`

4. **Get your function URL**:
   - After deployment, you'll get a URL like: `https://your-site.vercel.app/api/send-whatsapp`
   - Copy this URL

5. **Update notifications.js**:
   - Replace `YOUR_BACKEND_WEBHOOK_URL` with your Vercel function URL

#### Step 4: Test

1. Submit a quiz on your website
2. Check your WhatsApp: `+263775320423`
3. You should receive the quiz submission

---

### Option 3: Using Netlify Functions

Similar to Vercel, but using Netlify:

1. **Deploy to Netlify**:
   - Go to https://www.netlify.com/
   - Connect your GitHub repository
   - Netlify will auto-deploy

2. **Set Environment Variables** in Netlify:
   - Go to Site settings → Environment variables
   - Add the same variables as Vercel

3. **Move the function**:
   - Move `api/send-whatsapp.js` to `netlify/functions/send-whatsapp.js`
   - Update the function format (see Netlify docs)

4. **Get function URL** and update notifications.js

---

## 📝 Update Your Code

After setting up your webhook/backend, update `notifications.js`:

```javascript
twilio: {
    webhookUrl: 'https://your-webhook-url.com/api/send-whatsapp', // Your actual URL
    // ... other config
}
```

## 🧪 Testing

1. Open browser console (F12)
2. Submit a quiz
3. Check console for success/error messages
4. Check your WhatsApp: `+263775320423`

## 🔒 Security Notes

- **Never put Twilio credentials in frontend code**
- Always use a backend/serverless function
- Store credentials as environment variables
- Use HTTPS for all webhook URLs

## 💰 Twilio Pricing

- **Sandbox**: Free for testing (limited)
- **Production**: Pay per message (very affordable)
- Check Twilio pricing: https://www.twilio.com/pricing

## 🆘 Troubleshooting

### Messages not arriving?
1. Check Twilio Console for error logs
2. Verify your WhatsApp number format: `whatsapp:+263775320423`
3. Check webhook URL is correct
4. Verify environment variables are set

### Webhook errors?
1. Check browser console for errors
2. Verify CORS is enabled on your backend
3. Check backend logs for errors

### Still having issues?
- Check Twilio Console → Logs
- Verify your Twilio account is active
- Make sure WhatsApp sandbox is set up correctly

---

## 📞 Quick Reference

- **Your WhatsApp**: +263775320423
- **Twilio Dashboard**: https://console.twilio.com/
- **Zapier**: https://zapier.com/
- **Make.com**: https://www.make.com/
- **Vercel**: https://vercel.com/
- **Netlify**: https://www.netlify.com/

---

**Recommended**: Start with **Zapier** (Option 1) for the easiest setup, then move to serverless functions if you need more control.
