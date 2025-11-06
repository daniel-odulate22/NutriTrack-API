# NutriTrack API (Backend)

This is the official backend API for NutriTrack, a mobile and web app designed to help Nigerians track their nutrition, log local foods, and receive smart suggestions based on their fitness goals.

This server is built with **Node.js**, **Express**, and **MongoDB**.

---

## 🌟 Key Features

* **JWT Authentication**: Secure user registration (`/register`) and login (`/login`) using JSON Web Tokens.
* **Protected Routes**: Middleware protects all sensitive app endpoints, ensuring only logged-in users can access their data.
* **Meal Logging (CRUD)**: A full "Create, Read, Delete" system for logging meals (`/api/meals/log`, `/api/meals/me`, `/api/meals/:id`).
* **Custom Food Database**: A pre-seeded database (`foods` collection) containing 25+ common Nigerian and general foods with full nutritional data.
* **Smart Suggestions**: An endpoint (`/api/suggestions`) that reads a user's `goal` (e.g., "weight\_loss") and returns a filtered list of food suggestions.
* **Profile Management**: A route (`/api/users/me`) to update a user's profile information, like their name or fitness goal.
* **Community & AI**:
    * `GET /api/tips/random`: Provides static, pre-loaded tips from the database.
    * `POST /api/ai/get-advice`: Integrates with the Google Gemini API to provide smart, AI-powered advice.

---

## 🛠️ Tech Stack

* **Runtime**: Node.js
* **Framework**: Express.js
* **Database**: MongoDB (using Mongoose)
* **Authentication**: JSON Web Tokens (JWT)
* **AI**: Google Generative AI (Gemini)
* **Utilities**: `bcryptjs` (password hashing), `dotenv` (environment variables), `cors` (cross-origin requests), `nodemon` (live-reload development).

---

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

* [Node.js](https://nodejs.org/) (which includes `npm`)
* A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account (for your database)
* A [Google AI Studio](https://aistudio.google.com/) API Key (for the Gemini AI)

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/your-username/nutritrack-api.git](https://github.com/your-username/nutritrack-api.git)
    cd nutritrack-api
    ```

2.  **Install NPM packages:**
    ```bash
    npm install
    ```

3.  **Create your Environment File:**
    Create a file named `.env` in the root of the project. This file holds all your secret keys.

4.  **Populate your `.env` file:**
    Copy the following and paste it into your `.env` file, replacing the values with your own keys.

    ```env
    # Your MongoDB connection string from Atlas
    DB_CONNECTION_STRING=mongodb+srv://your-user:your-password@cluster0.xxxxx.mongodb.net/
    
    # A long, random string used to sign your JWTs
    JWT_SECRET=thisIsAReallyStrongSecretKey123!
    
    # Your API key from Google AI Studio
    GEMINI_API_KEY=your-gemini-api-key-goes-here
    ```

---

## 👟 Running the Project

### 1. Run the Development Server
This command uses `nodemon` to start your server, which will automatically restart every time you save a file.
```bash
npm run dev