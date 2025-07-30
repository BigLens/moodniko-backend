# **MoodNiko**

**MoodNiko** is a mood-based content generation app designed to support users' current emotional state through personalized content recommendations. Whether you're feeling happy, sad, anxious, or energetic, MoodNiko provides tailored content suggestions to enhance your current mood or help you transition to a more positive state.

---

## **Features**

- **JWT Authentication**: Secure user authentication with JWT tokens
- **User Management**: User registration, login, and profile management
- **Mood-Based Content**: Share your current mood and receive personalized content recommendations that match or uplift your emotional state
- **Diverse Content Types**: Choose from various content types including:
  - Music (via Spotify)
  - Movies and TV Shows (via TMDB)
  - Books (via GOOGLE BOOKS)
  - Podcasts (via Spotify)
- **User Preferences**: Customize your experience with theme, notifications, and content type preferences
- **Supportive Messages**: Receive encouraging words tailored to your current mood
- **Personalized Experience**: Select your preferred content types for more relevant recommendations

---

## **Tech Stack**

- **Backend**: NestJS
- **Database**: PostgreSQL with TypeORM
- **ORM**: TypeORM (for interacting with PostgreSQL)
- **Authentication**: JWT with Passport.js
- **Password Security**: Argon2 for secure password hashing
- **Frontend (Planned)**: React with TailwindCSS

---

## **Installation**

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/moodniko-backend.git
cd moodniko-backend
```

### 2. Install Dependencies

```bash
npm install
```

**Authentication Dependencies Included:**
- `@nestjs/jwt` - JWT token generation and validation
- `@nestjs/passport` - Passport integration with NestJS
- `passport` - Core Passport authentication library
- `passport-jwt` - JWT strategy for Passport
- `argon2` - Secure password hashing

### 3. Set Up Environment Variables

Create a `.env` file at the root directory of the project:

```bash
cp .env.example .env
```

**Required Environment Variables:**

```env
# Application
NODE_ENV=development
PORT=4002
API_PREFIX=api

# Database
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=your_username
DATABASE_PASSWORD=your_password
DATABASE_DATABASE=moodniko
DATABASE_SSL=false

# JWT Authentication
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=1h

# Third-party Services
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
TMDB_API_KEY=your_tmdb_api_key
GOOGLE_BOOKS_API_KEY=your_google_books_api_key
```

### 4. Database Setup

```bash
# Run database migrations
npm run migration:run

# Or if you need to create migrations
npm run migration:generate -- src/database/migrations/InitialMigration
```

### 5. Run the Application

```bash
# Development mode
npm run start:dev

# Production mode
npm run start:prod
```

- Open the browser and go to `http://localhost:4002` to see the backend in action
- Access the API documentation at `http://localhost:4002/api/docs`

---

## **Authentication Setup**

### JWT Configuration

The application uses JWT (JSON Web Tokens) for secure authentication. JWT tokens are automatically generated when users register or login.

**JWT Configuration:**
- **Secret**: Configured via `JWT_SECRET` environment variable
- **Expiration**: Configurable via `JWT_EXPIRES_IN` (default: 1 hour)
- **Algorithm**: HS256 (HMAC SHA256)

### Password Security

User passwords are securely hashed using Argon2, a modern and secure password hashing algorithm.

---

## **Authentication API Usage**

### 1. User Registration

```bash
POST /api/auth/create
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### 2. User Login

```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### 3. Using Authentication Headers

For protected endpoints, include the JWT token in the Authorization header:

```bash
GET /api/moods
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 4. Protected Endpoints

All user-specific endpoints require authentication:

- **Moods**: `GET /api/moods`, `POST /api/moods`, `PUT /api/moods/:id`, `DELETE /api/moods/:id`
- **Saved Content**: `GET /api/contents/saved-contents`, `POST /api/contents/saved-contents`, `DELETE /api/contents/saved-contents/:contentId`
- **User Preferences**: `GET /api/user-preferences`, `PUT /api/user-preferences`
- **Content**: `GET /api/contents` (with mood and type parameters)

### 5. Public Endpoints

These endpoints don't require authentication:

- **Health Check**: `GET /`, `GET /health`
- **Authentication**: `POST /api/auth/create`, `POST /api/auth/login`

---

## **Testing Authentication**

### Running Authentication Tests

```bash
# Run all authentication-related tests
npm test -- --testPathPattern="auth"

# Run specific authentication test files
npm test src/modules/auth/auth.service.spec.ts
npm test src/modules/auth/strategies/jwt.strategy.spec.ts
npm test src/modules/auth/guards/jwt-auth.guard.spec.ts

# Run E2E authentication tests
npm run test:e2e -- --testPathPattern="auth"
```

### Test Utilities

The project includes comprehensive test utilities for authentication:

```typescript
import { TestAuthUtils } from './test/test-utils';

// Generate valid JWT token
const token = TestAuthUtils.generateValidToken();

// Create mock user
const user = TestAuthUtils.createMockUser();

// Create authentication headers
const headers = TestAuthUtils.createAuthHeaders(token);
```

### Authentication Test Coverage

- ✅ Unit tests for authentication service
- ✅ Unit tests for JWT strategy
- ✅ Unit tests for JWT guard
- ✅ Unit tests for user service
- ✅ E2E tests for authentication endpoints
- ✅ E2E tests for protected routes
- ✅ Tests for authentication failures and edge cases

---

## **Environment Variables Documentation**

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `JWT_SECRET` | Secret key for JWT token signing | `your_super_secret_key_here` |
| `JWT_EXPIRES_IN` | JWT token expiration time | `1h`, `7d`, `30m` |
| `DATABASE_HOST` | PostgreSQL database host | `localhost` |
| `DATABASE_PORT` | PostgreSQL database port | `5432` |
| `DATABASE_USERNAME` | Database username | `postgres` |
| `DATABASE_PASSWORD` | Database password | `your_password` |
| `DATABASE_DATABASE` | Database name | `moodniko` |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Application environment | `development` |
| `PORT` | Application port | `4002` |
| `API_PREFIX` | API route prefix | `api` |
| `DATABASE_SSL` | Database SSL connection | `false` |

### Third-Party API Keys

| Variable | Description | Required |
|----------|-------------|----------|
| `SPOTIFY_CLIENT_ID` | Spotify API client ID | Yes |
| `SPOTIFY_CLIENT_SECRET` | Spotify API client secret | Yes |
| `TMDB_API_KEY` | TMDB API key | Yes |
| `GOOGLE_BOOKS_API_KEY` | Google Books API key | Yes |

---

## **Module Documentation**

The content module documentation is available in `src/README.md`. This document provides detailed information about:

- Content recommendation system
- Mood-to-genre mapping
- Third-party service integrations (Spotify, TMDB, Google Books)
- API endpoints and usage

---

## **API Documentation**

Interactive API documentation is available at `http://localhost:4002/api/docs` when the application is running. The documentation includes:

- Authentication endpoints
- Protected route examples
- Request/response schemas
- Error responses
- JWT token usage examples

---

## **Security Features**

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Argon2 for secure password storage
- **Protected Routes**: User-specific endpoints require authentication
- **Input Validation**: Comprehensive request validation
- **Error Handling**: Secure error responses without sensitive data exposure

---

## **Contributing**

If you'd like to contribute to this project, feel free to fork the repository, create a new branch, and submit a pull request. Here are some guidelines to follow:

1. Write clean, maintainable code
2. Add tests for new features (including authentication tests)
3. Follow standard commit message conventions
4. Update relevant documentation
5. Ensure all tests pass before submitting a PR
6. Test authentication flows for new protected endpoints

### Testing Guidelines

- Write unit tests for all authentication components
- Include E2E tests for authentication flows
- Test both successful and failed authentication scenarios
- Verify user context isolation in tests
- Test JWT token validation and expiration

---

## **Support**

For questions or issues related to authentication:

1. Check the API documentation at `/api/docs`
2. Review the test files for usage examples
3. Check the environment variables configuration
4. Ensure all required dependencies are installed

---

## **License**

This project is licensed under the UNLICENSED license.
