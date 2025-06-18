# **MoodNiko**

**MoodNiko** is a mood-based content generation app designed to support users' current emotional state through personalized content recommendations. Whether you're feeling happy, sad, anxious, or energetic, MoodNiko provides tailored content suggestions to enhance your current mood or help you transition to a more positive state.

---

## **Features**

- **Mood-Based Content**: Share your current mood and receive personalized content recommendations that match or uplift your emotional state
- **Diverse Content Types**: Choose from various content types including:
  - Music (via Spotify)
  - Movies and TV Shows (via TMDB)
  - Books (via GOOGLE BOOKS)
  - Podcasts (via Spotify)
- **Supportive Messages**: Receive encouraging words tailored to your current mood
- **Personalized Experience**: Select your preferred content types for more relevant recommendations

---

## **Tech Stack**

- **Backend**: NestJS
- **Database**: PostgreSQL with TypeORM
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

## **Documentation**

### **Module Documentation**

The content module documentation is available in `src/README.md`. This document provides detailed information about:

- Content recommendation system
- Mood-to-genre mapping
- Third-party service integrations (Spotify, TMDB, Google Books)
- API endpoints and usage

### **Database Documentation**

Comprehensive database documentation is available in the `docs/database/` directory:

- **[Database Overview](docs/database/README.md)** - General database design principles and guidelines
- **[Current Schema](docs/database/current-schema.md)** - Current database structure and relationships
- **[Saved Contents Schema](docs/database/saved-contents-schema.md)** - Detailed documentation for the saved_contents table

The database follows PostgreSQL best practices with:

- Snake_case naming conventions
- Proper indexing for performance
- Foreign key constraints for data integrity
- Migration-based schema management

---

## **Contributing**

If you'd like to contribute to this project, feel free to fork the repository, create a new branch, and submit a pull request. Here are some guidelines to follow:

1. Write clean, maintainable code
2. Add tests for new features
3. Follow standard commit message conventions
4. Update relevant documentation
5. Ensure all tests pass before submitting a PR
