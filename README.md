# **MoodMate**

**MoodMate** is an interactive mental health app designed to help users track their mood and find personalized content that can uplift and support them. Whether it's reading a book, listening to a podcast, watching a movie, or more, **MoodMate** provides content recommendations based on your mood and preferences.

---

## **Features**

- **Mood Tracking**: Users can input their current mood and receive tailored content recommendations.
- **Personalized Content**: Based on the user’s mood, MoodMate suggests content like books, movies, music, and podcasts to help improve their well-being.
- **Soothing Messages**: After tracking their mood, users are greeted with calming and encouraging words.
- **User Preferences**: Users can choose their favorite ways to unwind and receive relevant recommendations.

---

## **Tech Stack**

- **Backend**: NestJS
- **Database**: PostgreSQL with TypeORM
- **Authentication**: JWT (JSON Web Tokens)
- **ORM**: TypeORM (for interacting with PostgreSQL)
- **Frontend (Planned)**: React with TailwindCSS

---

## **Installation**

1. **Clone the repository**:

   ```bash
   git clone https://github.com/your-username/moodmate-backend.git
   cd moodmate-backend

2. **Install dependencies**:

   ```
   npm install

3. **Set up environment variables**:

Create a .env file and fill in the following:

   ```
   DATABASE_URL=your-database-url
   JWT_SECRET=your-jwt-secret

4. **Run the application**:

    ```
    npm run start:dev

Open your browser and go to http://localhost:4001 to see the backend in action

Endpoints:

POST /auth/signup: Sign up a new user.

POST /auth/signin: Sign in a user.

GET /mood: Get personalized content recommendations based on the user's mood.

Contributing

If you'd like to contribute to this project, feel free to fork the repository, create a new branch, and submit a pull request. Here are some guidelines to follow:

Write clean, maintainable code.

Add tests for new features.

Follow standard commit message conventions.
