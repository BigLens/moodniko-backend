# Authentication Guide

This guide explains how to use JWT authentication with the MoodNiko API.

## Overview

The MoodNiko API uses JWT (JSON Web Tokens) for authentication. Most endpoints require a valid JWT token to access user-specific data.

## Getting Started

### 1. Register a New User

```http
POST /auth/create
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "yourPassword123"
}
```

**Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com"
  }
}
```

### 2. Login with Existing User

```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "yourPassword123"
}
```

**Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com"
  }
}
```

## Using JWT Tokens

### Authorization Header

For all protected endpoints, include the JWT token in the Authorization header:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Example Protected Request

```http
GET /moods
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

Response:
[
  {
    "id": 1,
    "feeling": "happy",
    "userId": 1,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
]
```

## Protected Endpoints

The following endpoints require authentication:

### Mood Management
- `POST /moods/create-mood` - Create a new mood entry
- `GET /moods` - Get all user moods
- `GET /moods/:id` - Get specific mood by ID
- `PATCH /moods/:id` - Update mood by ID
- `DELETE /moods/:id` - Delete mood by ID

### Saved Content Management
- `POST /contents/saved-contents` - Save content for a mood
- `GET /contents/saved-contents` - Get all saved content
- `GET /contents/saved-contents/:id` - Get specific saved content
- `DELETE /contents/saved-contents/:contentId` - Remove saved content
- `DELETE /contents/saved-contents/by-id/:id` - Remove saved content by ID

### User Preferences
- `GET /user/preferences` - Get user preferences
- `PUT /user/preferences` - Update user preferences

## Public Endpoints

The following endpoints do not require authentication:

### Authentication
- `POST /auth/login` - User login
- `POST /auth/create` - User registration

### Content Discovery
- `GET /contents` - Get content recommendations
- `GET /movies` - Get movie recommendations
- `GET /spotify/mood` - Get Spotify content
- `GET /books/mood` - Get book recommendations

### Health Checks
- `GET /health` - Application health status
- `GET /health/ready` - Readiness check
- `GET /health/live` - Liveness check

## Error Responses

### 401 Unauthorized

When a JWT token is missing, invalid, or expired:

```json
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Unauthorized"
}
```

**Common causes:**
- Missing Authorization header
- Invalid JWT token format
- Expired JWT token
- Invalid JWT signature

### 400 Bad Request

When request data is invalid:

```json
{
  "statusCode": 400,
  "message": ["email must be an email", "password should not be empty"],
  "error": "Bad Request"
}
```

### 404 Not Found

When a resource is not found:

```json
{
  "statusCode": 404,
  "message": "Mood not found",
  "error": "Not Found"
}
```

## Token Expiration

JWT tokens expire after **24 hours** by default. When a token expires, you'll receive a 401 Unauthorized response. To continue using the API, you'll need to login again to get a new token.

## Security Best Practices

1. **Store tokens securely** - Don't store JWT tokens in localStorage for production apps
2. **Use HTTPS** - Always use HTTPS in production to protect token transmission
3. **Token refresh** - Implement token refresh logic for better user experience
4. **Logout properly** - Clear tokens on logout to prevent unauthorized access

## Example Usage

### JavaScript/TypeScript

```javascript
// Login
const loginResponse = await fetch('/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123'
  })
});

const { accessToken } = await loginResponse.json();

// Use token for protected requests
const moodsResponse = await fetch('/moods', {
  headers: {
    'Authorization': `Bearer ${accessToken}`
  }
});

const moods = await moodsResponse.json();
```

### cURL

```bash
# Login
curl -X POST http://localhost:4002/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# Use token for protected request
curl -X GET http://localhost:4002/moods \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Testing Authentication

You can test authentication using the Swagger UI at `/api/docs`. The Swagger UI includes an "Authorize" button where you can enter your JWT token to test protected endpoints directly in the browser. 