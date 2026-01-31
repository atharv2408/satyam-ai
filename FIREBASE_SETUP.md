# Firebase Database Setup Guide

Follow these steps to enable Firestore in your Firebase Console.

## 1. Create Firestore Database
1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Select your project **satyam-ai-3889c**.
3. In the left sidebar, click on **Build** > **Firestore Database**.
4. Click on **Create database**.
5. **Database ID**: Leave as `(default)`.
6. **Location**: Select a location close to your users (e.g., `asia-south1` for Mumbai, or `us-central1`).
7. **Security Rules**: Select **Start in production mode**.
   - We have already defined `firestore.rules` in the codebase which you can copy-paste later, or deploy using Firebase CLI.
8. Click **Create**.

## 2. Apply Security Rules
1. Once the database is created, go to the **Rules** tab in the Firestore dashboard.
2. Copy the content of the `firestore.rules` file from your project.
3. Paste it into the Rules editor in the console.
4. Click **Publish**.

## 3. Enable Authentication (If not already enabled)
1. In the left sidebar, click on **Build** > **Authentication**.
2. Click **Get started**.
3. Enable **Email/Password** provider (or any others you plan to use).
4. **Important**: Our security rules depend on `request.auth`, so users must be logged in to read/write their data.

## 4. Verification
1. Run your frontend application.
2. Log in.
3. Open the browser developer console (F12).
4. Run the test function (instructions will be provided in the app or you can use the `testFirestore.js` utility).
