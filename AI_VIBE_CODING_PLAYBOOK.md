# AI Vibe Coding Playbook
## From Idea to Deployed App - A Beginner's Guide

This guide will walk you through building and deploying a complete web application using AI assistance, even with limited coding experience. Follow each stage carefully.

---

## 🎯 The Process Overview

1. **Generate PRD** - Describe your app to AI
2. **Setup Project** - Create folder and copy PRD
3. **Setup Accounts** - GitHub, Google Cloud, Firebase
4. **Create TODO List** - AI breaks down the work
5. **Build the App** - AI implements everything
6. **Audit & Fix** - AI reviews its own work
7. **Setup Local Development** - View your app locally
8. **Manual Testing** - Test and fix issues
9. **Deploy** - Push to production
10. **Iterate** - Fix any deployment issues

---

## 📋 Stage 1: Generate Your PRD (Product Requirements Document)

### What You'll Do
Open any AI chat (ChatGPT, Claude, etc.) and describe your app idea in detail.

### Prompt Template to Use

```
I want to build an MVP web application. Please create a comprehensive Product Requirements Document (PRD) that an AI engineer can use to build this project.

TECHNOLOGY STACK:
- Frontend: React + Tailwind CSS + Zustand (state management)
- Frontend Hosting: Firebase Hosting
- Backend: NestJS + PostgreSQL + TypeORM
- Backend Hosting: Google Cloud Run + Cloud SQL
- Authentication: Firebase Auth

PROJECT REQUIREMENTS:
This is an MVP (Minimum Viable Product) so:
- Follow clean code principles
- Not enterprise-level complexity yet
- Must be secure
- Keep it simple and functional

MY APP IDEA:
[Describe your app here - be detailed about what users can do]

User Stories:
1. As a [user type], I want to [action] so that [benefit]
2. As a [user type], I want to [action] so that [benefit]
[Add more user stories]

Key Features:
- [Feature 1]
- [Feature 2]
- [Feature 3]
[Add more features]

Data Requirements:
- What information needs to be stored?
- What relationships exist between data?

Please create a PRD that includes:
1. Project Overview
2. User Stories (detailed)
3. Feature Specifications
4. Data Models & Database Schema
5. API Endpoints
6. Frontend Pages & Components
7. Authentication & Authorization Requirements
8. Security Considerations
9. Deployment Requirements
10. Success Criteria

Make it detailed enough that an AI engineer can build this without needing to ask clarifying questions.
```

### What to Save
Copy the entire PRD response and save it - you'll need it in the next step.

---

## 📁 Stage 2: Setup Your Project Folder

### Steps:

1. **Create a new folder** for your project:
   ```bash
   mkdir my-awesome-app
   cd my-awesome-app
   ```

2. **Open the folder in Cursor**:
   - Open Cursor IDE
   - File > Open Folder
   - Select your `my-awesome-app` folder

3. **Create the PRD file**:
   - In Cursor, create a new file called `PRD.md`
   - Paste the PRD content from Stage 1
   - Save the file

---

## 🔧 Stage 3: Setup Required Accounts & Tools

You need to install tools and setup accounts. Don't worry - AI will help you!

### 3A: Install Required Tools

**Prompt to use in Cursor:**

```
I'm on a Mac and need to setup my development environment. Please help me install:
1. Homebrew (if not already installed)
2. Node.js (latest LTS version)
3. pnpm (package manager)
4. GitHub CLI (gh)
5. Google Cloud CLI (gcloud)
6. Firebase CLI

Please provide me with the exact terminal commands to run, one at a time, and explain what each does.
```

**Follow the AI's instructions** - copy each command it gives you and run in Terminal.

### 3B: Setup GitHub

**Prompt to use in Cursor:**

```
I need to setup GitHub for this project. I want to:
1. Create a new repository on GitHub
2. Initialize git in this project
3. Connect this folder to the GitHub repository
4. Make my first commit

Please guide me through this using GitHub CLI (gh). I'm using a personal account.
Provide exact commands and explain each step.
```

### 3C: Setup Google Cloud

**Prompt to use in Cursor:**

```
I need to setup Google Cloud for this project. Please help me:
1. Login to Google Cloud using personal account
2. Create a new project for this app
3. Enable required APIs (Cloud Run, Cloud SQL, Cloud Build)
4. Setup billing (I understand there are costs)
5. Configure authentication

Use gcloud CLI commands. Explain each step clearly.
Make it secure with proper permissions.
```

### 3D: Setup Firebase

**Prompt to use in Cursor:**

```
I need to setup Firebase for this project. Please help me:
1. Login to Firebase using personal account
2. Create a new Firebase project (link to the GCloud project if possible)
3. Enable Firebase Authentication
4. Enable Firebase Hosting
5. Generate the Firebase config for my frontend
6. Create a firebase.json configuration file

Use firebase CLI commands. Explain each step clearly.
```

---

## ✅ Stage 4: Generate Detailed TODO List

Now that everything is setup, let's have AI create a comprehensive task list.

**Prompt to use in Cursor:**

```
Read the PRD.md file in this project. Based on this PRD, create a comprehensive, detailed TODO list for building this entire application.

IMPORTANT REQUIREMENTS:
- Break down every feature into specific, actionable tasks
- Include all setup tasks (project structure, dependencies, configs)
- Include all backend tasks (database, APIs, authentication)
- Include all frontend tasks (pages, components, state management)
- Include integration tasks (connecting frontend to backend)
- Include testing considerations
- Make it detailed enough to protect against context loss
- Number everything clearly
- Group related tasks together

Create the TODO list in a TASKS.md file.
Make each task specific enough that an AI can implement it without ambiguity.
```

**Review the TODO list** - make sure it makes sense with your app idea.

---

## 🔨 Stage 5: Build the Application

Time to build! The AI will work through all the tasks.

**Prompt to use in Cursor:**

```
I want you to implement this entire project by working through the TASKS.md file systematically.

RULES:
1. Work through tasks in order
2. Implement everything fully - NO placeholders or TODO comments
3. Follow the PRD.md specifications exactly
4. Use the tech stack specified (React, Tailwind, Zustand, NestJS, TypeORM, PostgreSQL)
5. Follow clean code principles
6. Add proper error handling
7. Make it secure
8. Create proper folder structure
9. As you complete each task, update TASKS.md to mark it complete

Start with task 1 and continue until all tasks are complete.
Let me know when you've finished all tasks.
```

**What to expect:**
- This will take a while
- The AI will create many files
- You might hit context limits - if that happens, just say "continue" and it will pick up where it left off
- Let it work through everything

---

## 🔍 Stage 6: Audit & Fix

Now have the AI review its own work critically.

**Prompt to use in Cursor:**

```
Perform a comprehensive audit of this entire codebase. Look for:

1. PLACEHOLDER WORK:
   - Any TODO comments
   - Any placeholder text or dummy data
   - Any incomplete implementations
   - Any hardcoded values that should be configurable

2. PRD COMPLIANCE:
   - Compare every feature in PRD.md to actual implementation
   - List any missing features
   - List any features implemented incorrectly

3. ARCHITECTURAL ISSUES:
   - Poor code organization
   - Missing error handling
   - Security vulnerabilities
   - Performance issues
   - State management problems
   - API design issues

4. CODE QUALITY:
   - Inconsistent code style
   - Missing TypeScript types
   - Unused imports or code
   - Poor naming conventions

Create an AUDIT_REPORT.md file with all findings.
Then, fix ALL issues you found. Do not skip anything.
```

**Review the audit report** when done and make sure AI fixed everything.

---

## 💻 Stage 7: Setup Local Development

Time to see your app running!

**Prompt to use in Cursor:**

```
I need to run this application locally on my Mac. Please:

1. Create a detailed LOCAL_DEVELOPMENT.md guide that explains:
   - How to setup the database locally (PostgreSQL)
   - What environment variables are needed
   - How to setup .env files for both frontend and backend
   - How to install dependencies
   - How to run the backend server
   - How to run the frontend development server
   - What URLs to open in the browser
   - How to stop the servers

2. Help me actually start everything:
   - Guide me through each step
   - Give me exact commands to run
   - Tell me what to expect at each step

Make it beginner-friendly. I have limited coding experience.
```

**Follow the guide** - you should be able to see your app in the browser!

---

## 🧪 Stage 8: Manual Testing

Now you test your app and report issues.

### How to Report Issues:

**Take screenshots** of any problems and use this prompt:

```
I found an issue while testing. Here's what's wrong:

ISSUE: [Describe what's not working or what looks wrong]

EXPECTED: [What should happen]

ACTUAL: [What actually happens]

SCREENSHOT: [Paste screenshot]

STEPS TO REPRODUCE:
1. [Step 1]
2. [Step 2]
3. [Step 3]

Please fix this issue.
```

**Repeat this process** for every issue you find until the app works the way you want.

### Things to Test:
- ✅ Can you signup/login?
- ✅ Does each page load?
- ✅ Do all buttons work?
- ✅ Can you create/edit/delete data?
- ✅ Do forms validate properly?
- ✅ Does it look good on mobile?
- ✅ Are error messages helpful?

---

## 🚀 Stage 9: Deploy Everything

Time to put your app on the internet!

**Prompt to use in Cursor:**

```
I need to deploy this application to production. Please:

1. Create a DEPLOYMENT.md guide that explains:
   - How to setup Google Cloud SQL (PostgreSQL) for production
   - How to setup Cloud Run for the backend
   - How to setup Firebase Hosting for the frontend
   - What environment variables are needed in production
   - Security best practices
   - How to manage secrets safely

2. Create deployment scripts:
   - deploy-backend.sh - Single script to deploy backend
   - deploy-frontend.sh - Single script to deploy frontend
   - Make them easy to use (just run the script)

3. Create a setup-production.sh script that:
   - Creates necessary GCloud resources
   - Creates Firebase resources
   - Sets up Cloud SQL database
   - Configures everything securely
   - Is idempotent (safe to run multiple times)

Make everything beginner-friendly with clear instructions.
```

### Deploy Backend First

**Prompt to use:**

```
Walk me through deploying the backend step by step:
1. Running any setup scripts
2. Setting environment variables
3. Running the deploy-backend.sh script
4. Verifying it's working
5. Getting the backend URL

Guide me through each step with exact commands.
```

### Deploy Frontend Second

**Prompt to use:**

```
Walk me through deploying the frontend step by step:
1. Updating frontend config with production backend URL
2. Running the deploy-frontend.sh script
3. Verifying it's working
4. Getting the frontend URL

Guide me through each step with exact commands.
```

---

## 🔄 Stage 10: Fix Deployment Issues

If something doesn't work in production:

**Prompt to use:**

```
My deployed app has an issue:

ISSUE: [Describe the problem]

ENVIRONMENT: Production

LOGS/ERRORS: [Paste any error messages you see]

Please help me:
1. Diagnose the issue
2. Fix it
3. Redeploy if needed

Walk me through the solution step by step.
```

**Common issues:**
- Environment variables not set correctly
- Database connection issues
- CORS errors (frontend can't talk to backend)
- Authentication not working
- Missing API keys

---

## 🎓 Pro Tips

### General Tips
- **Save your work**: Commit to GitHub frequently
  ```bash
  git add .
  git commit -m "Describe what you changed"
  git push
  ```

- **If you get stuck**: Just ask Claude to explain what's happening in simpler terms

- **Context loss**: If Claude seems confused, remind it: "Check the PRD.md and TASKS.md files"

- **Take breaks**: This is a marathon, not a sprint

### Cost Management
- Google Cloud and Firebase have free tiers, but can charge money
- Set up billing alerts in Google Cloud Console
- Shut down resources when not using them (especially Cloud SQL)

### When Things Break
- Don't panic
- Copy the error message
- Paste it to Claude with context
- Ask for a fix

### Learning Along the Way
- Ask Claude to explain things: "Why did we use Zustand here?"
- Review the code it generates: "Explain what this component does"
- Take notes on patterns you see repeatedly

---

## 📚 Helpful Prompts for Common Situations

### "I'm lost, what should I do next?"
```
Looking at my current project state, what is the next step I should take?
Check TASKS.md to see what's completed and what's next.
```

### "This error message doesn't make sense"
```
I got this error: [paste error]

Please:
1. Explain what this error means in simple terms
2. Explain why it happened
3. Tell me how to fix it
4. Implement the fix
```

### "I want to add a new feature"
```
I want to add a new feature to my app: [describe feature]

Please:
1. Update the PRD.md to include this feature
2. Create tasks in TASKS.md for implementing it
3. Implement the feature fully
4. Test it works with existing features
```

### "I want to change how something looks"
```
I want to change [describe what]: [describe how you want it to look]

Please update the styling/layout to match my description.
[Optionally include a screenshot or example]
```

### "How much is this costing me?"
```
Help me understand the costs of running this app:
1. Check what GCloud resources I'm using
2. Estimate monthly costs
3. Suggest ways to reduce costs
4. Show me how to setup billing alerts
```

---

## 🎯 Success Checklist

Before you call it done, make sure:

- [ ] App runs locally without errors
- [ ] All features from PRD are implemented
- [ ] You've tested every user story
- [ ] App is deployed to production
- [ ] Production app works like local version
- [ ] You can login/signup in production
- [ ] Database is working in production
- [ ] No console errors in browser
- [ ] Mobile view looks good
- [ ] Code is committed to GitHub
- [ ] You have deployment scripts that work
- [ ] You understand how to redeploy changes

---

## 🆘 Emergency Prompts

### "Everything is broken, help!"
```
I need to reset and start fresh on [specific part].
Please help me:
1. Identify what's broken
2. Backup any working code
3. Fix or rebuild the broken part
4. Test it works
```

### "I need to undo something"
```
I need to undo recent changes. Please:
1. Show me my recent git commits
2. Help me revert to before [describe what broke things]
3. Explain what we reverted
```

### "I can't deploy"
```
My deployment is failing with this error: [paste error]

Please:
1. Check deployment scripts
2. Check GCloud/Firebase configuration
3. Fix the issue
4. Walk me through deploying again
```

---

## 🎉 You're Ready!

You now have everything you need to build a complete web application with AI assistance. Remember:

- **Take it one step at a time**
- **Don't skip stages**
- **Ask for explanations when confused**
- **Test thoroughly before deploying**
- **Keep your code committed to GitHub**

Good luck, and have fun building! 🚀

---

## 📞 Quick Reference Commands

### Start Local Development
```bash
# Terminal 1 - Backend
cd backend
pnpm install
pnpm dev

# Terminal 2 - Frontend  
cd frontend
pnpm install
pnpm dev
```

### Commit Your Work
```bash
git add .
git commit -m "Description of changes"
git push
```

### Deploy
```bash
# Backend
./deploy-backend.sh

# Frontend
./deploy-frontend.sh
```

### Check Logs
```bash
# Backend logs (Cloud Run)
gcloud run logs tail [service-name]

# Frontend logs (Firebase)
firebase hosting:logs
```

---

**Version:** 1.0  
**Last Updated:** October 2025  
**Tech Stack:** React + Tailwind + Zustand + NestJS + PostgreSQL + Firebase + Google Cloud

