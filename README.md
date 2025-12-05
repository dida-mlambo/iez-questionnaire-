# Module 2: AI Applications & Ethics - Interactive Learning Website

This website contains all the content and interactive questionnaires for Module 2: AI Applications & Ethics for the Engineering Secretariat.

## Features

- **User Authentication**: Login and registration system to secure access to the module
- **Complete Module Content**: All four parts of the module with detailed notes and examples
- **Interactive Quizzes**: Multiple choice questions throughout each section
- **Ethical Dilemma Scenarios**: Interactive scenarios for students to reflect on
- **Personal Action Plan**: Students can create and save their action plans
- **Final Assessment**: Comprehensive quiz covering all module content
- **Modern, Responsive Design**: Beautiful UI that works on all devices

## How to Use

1. **Access the Website**: Visit the website URL (or open `login.html` locally)
   
2. **Create an Account**:
   - Click on the "Register" tab
   - Enter your full name, email address, and password (minimum 6 characters)
   - Confirm your password
   - Click "Create Account"
   - You'll be redirected to the login page

3. **Login**:
   - Enter your email and password
   - Click "Login" to access the module content
   - If you're not logged in, you'll be automatically redirected to the login page

4. **Navigate Through Content**: 
   - Scroll through each part of the module
   - Read all the content and notes
   - Complete the quizzes as you go
   - Use the "Logout" button in the header to sign out

3. **Complete Quizzes**:
   - Each part has a "Check Your Understanding" quiz
   - Select your answers and click "Submit Answers"
   - You'll receive immediate feedback with your score

4. **Ethical Dilemma Activity**:
   - In Part 3, you'll find two ethical scenarios
   - Type your thoughts in the text areas provided
   - Reflect on the ethical implications

5. **Create Your Action Plan**:
   - In Part 4, fill in your personal action plan
   - Click "Save Action Plan" to save it locally
   - Your plan will be saved in your browser's local storage

6. **Final Assessment**:
   - Complete the final assessment at the end
   - You need at least 70% to pass
   - Review your answers and feedback

## File Structure

```
ai-module-website/
├── index.html      # Main HTML file with all content (requires login)
├── login.html      # Login and registration page
├── styles.css      # Styling and design
├── script.js       # Interactive functionality and authentication checks
├── auth.js         # Authentication module (login, register, logout)
└── README.md       # This file
```

## Content Sections

### Part 1: Recap & Introduction (10 minutes)
- Quick recap of AI family tree
- Learning objectives
- Quiz 1

### Part 2: AI Applications in Secretariat Operations (60 minutes)
- A. Communication & Document Creation
- B. Information & Meeting Management
- C. Strategic & Member Support
- Quiz 2

### Part 3: The Essential Ethical & Risk Framework (50 minutes)
- Four Key Risks & Mitigations
- Interactive Ethical Dilemma scenarios
- Quiz 3

### Part 4: Synthesis & Action Plan (10 minutes)
- Key takeaways
- Personal action plan form
- Look ahead to next module

### Final Module Assessment
- Comprehensive quiz covering all content
- Mixed question types (multiple choice, checkboxes, true/false)

## Technical Details

- **No Server Required**: This is a static website that runs entirely in the browser
- **Client-Side Authentication**: User accounts and sessions are stored in browser's local storage
- **Local Storage**: User accounts, action plans, and session data are saved in the browser's local storage
- **Password Security**: Passwords are hashed before storage (note: for production use, implement proper server-side authentication)
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Modern CSS**: Uses gradients, animations, and smooth transitions
- **JavaScript**: Handles quiz scoring, form validation, authentication, and local storage

## Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Any modern browser that supports ES6 JavaScript

## Notes for Instructors

- All quiz answers are validated client-side
- Students can retake quizzes as many times as needed
- Action plans are saved locally (not sent to a server)
- The website can be hosted on any web server or used locally

## Customization

To customize the content:
1. Edit `index.html` to modify text content
2. Edit `styles.css` to change colors, fonts, or layout
3. Edit `script.js` to modify quiz logic or add features

## Support

For questions or issues, please refer to the module materials or contact your instructor.

---

**Module 2: AI Applications & Ethics | Zimbabwe Institution of Engineers**

