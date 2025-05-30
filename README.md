# **MoodNiko**

**MoodNiko** is an interactive mental health app designed to help users track their mood and find personalized content that can uplift and support them. Whether it's reading a book, listening to a podcast, watching a movie, or more, **MoodNiko** provides content recommendations based on your mood and preferences.

---

## **Features**

- **Mood Tracking**: Users can input their current mood and receive tailored content recommendations.
- **Personalized Content**: Based on the user's mood, MoodNiko suggests content like books, movies, music, and podcasts to help improve their well-being.
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

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/moodniko-backend.git
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

- Create a `.env` file at the root directory of the project.

```bash
cp .env.example .env
```

Required environment variables:

```
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/moodniko

# JWT
JWT_SECRET=your_jwt_secret

# Third-party Services
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
TMDB_API_KEY=your_tmdb_api_key
```

### 4. Run the Application

```bash
npm run start:dev
```

- Open the browser and go to `http://localhost:4002` to see the backend in action.
- Access the API documentation at `http://localhost:4002/api/docs`

---

## **Module Documentation**

Detailed documentation for each module is available in the `docs` directory:

- Content Module: `docs/modules/content.md`
- Auth Module: `docs/modules/auth.md`
- Mood Module: `docs/modules/mood.md`

---

## **Contributing**

If you'd like to contribute to this project, feel free to fork the repository, create a new branch, and submit a pull request. Here are some guidelines to follow:

1. Write clean, maintainable code
2. Add tests for new features
3. Follow standard commit message conventions
4. Update relevant documentation
5. Ensure all tests pass before submitting a PR

---

## **License**

This project is licensed under the MIT License - see the LICENSE file for details.
