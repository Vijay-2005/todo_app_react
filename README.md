# React Todo List Application

A modern, responsive Todo List application built with React and Firebase, featuring user authentication and real-time data storage.

![Todo List App](https://via.placeholder.com/800x400?text=Todo+List+App)

## Features

- **User Authentication**
  - Email and password registration: Create a new account with email verification
  - Login functionality: Secure access to your personal todos
  - Email verification: Ensures valid user emails and enhances security
  - Password reset capability: Recover access when passwords are forgotten
  
- **Todo Management**
  - Create new todos with title and description: Easily organize your tasks
  - Delete existing todos: Remove completed or unwanted tasks
  - View all todos in a clean, organized interface: Intuitive task management
  - Search functionality to filter todos: Quickly find specific tasks
  
- **User Experience**
  - Responsive design works on all devices: Use on desktop, tablet, or mobile
  - Modern UI with smooth animations and transitions: Enjoyable and intuitive interface
  - Offline capability with localStorage caching: Continue working even without internet
  - Real-time updates: Changes sync immediately across devices
  
- **Security**
  - Protected routes for authenticated users: Prevent unauthorized access
  - Firebase security rules: Ensure data privacy and integrity at the database level
  - Integration with Spring Boot backend API secured with Firebase token verification

## Technologies Used

- **Frontend**
  - React.js (with Hooks): For building the interactive UI components and managing state
  - React Router for navigation: Enables seamless page transitions without full reloads
  - Bootstrap 5 for responsive design: Provides consistent styling across different screen sizes
  - Custom CSS for styling: Adds unique visual elements and animations
  - Font Awesome for icons: Enhances UI with recognizable icons

- **Backend & Database**
  - Spring Boot backend API: Provides REST endpoints for persistent todos
  - MySQL database: Stores all todo data securely
  - Firebase Authentication: Handles user registration, login, and security
  
- **Deployment**
  - Vercel for frontend hosting: Provides fast, global CDN distribution
  - Render for backend hosting: Reliable cloud hosting for the Spring Boot API

## Backend Health Monitoring

The Spring Boot backend includes a health check endpoint that can be used with monitoring services to keep the application running on Render's free tier.

### Health Check Endpoint

```
GET /health
```

This endpoint returns a simple "OK" response and can be pinged regularly to prevent the application from being spun down due to inactivity.

### UptimeRobot Configuration

To keep your backend running 24/7 on Render's free tier:

1. Create a free account at [UptimeRobot](https://uptimerobot.com/)
2. Add a new HTTP(s) monitor with your backend URL:
   ```
   https://your-backend-url.onrender.com/health
   ```
3. Set the monitoring interval to 5 minutes
4. This will prevent Render from spinning down your backend due to inactivity

## Getting Started

### Prerequisites

- Node.js (v14 or later recommended): Required to run the React application
- npm or yarn: Package managers for installing dependencies
- Firebase account: Required for authentication and database services

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/todos-list.git
   cd todos-list
   ```
   This downloads the codebase to your local machine and navigates to the project directory.

2. Install dependencies
   ```bash
   npm install
   # or
   yarn install
   ```
   This installs all required packages defined in package.json.

3. Create a Firebase project
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project by clicking "Add project" and following the setup wizard
   - Set up Authentication with Email/Password method:
     - Click "Authentication" > "Sign-in method" > Enable Email/Password
   - Create a Firestore database:
     - Click "Firestore Database" > "Create database" > Choose mode (start in test mode for development)

4. Create a `.env` file in the root directory with your Firebase configuration
   ```
   REACT_APP_FIREBASE_API_KEY=your-api-key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your-auth-domain
   REACT_APP_FIREBASE_PROJECT_ID=your-project-id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your-storage-bucket
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
   REACT_APP_FIREBASE_APP_ID=your-app-id
   REACT_APP_API_BASE_URL=your-backend-api-url
   ```
   You can find Firebase values in your Firebase project settings > General > Your apps > SDK setup and configuration.

5. Start the development server
   ```bash
   npm start
   # or
   yarn start
   ```
   This launches the app in development mode with hot reloading enabled.

6. Open [http://localhost:3000](http://localhost:3000) to view the app in the browser
   The page will automatically reload when you make changes to the code.

### Firebase Configuration

In the `src/auth/firebaseConfig.js` file, ensure your Firebase configuration is properly set up:

```javascript
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
```
This initializes Firebase in your application using environment variables for security.

## Project Structure
crazy