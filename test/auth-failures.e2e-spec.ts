import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { JwtService } from '@nestjs/jwt';

describe('Authentication Failures (e2e)', () => {
  let app: INestApplication;
  let jwtService: JwtService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    jwtService = moduleFixture.get<JwtService>(JwtService);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Login Failures', () => {
    it('should return 401 for non-existent user', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123',
        })
        .expect(401);

      expect(response.body).toHaveProperty('statusCode', 401);
      expect(response.body).toHaveProperty('message', 'Invalid credentials');
      expect(response.body).toHaveProperty('error', 'Unauthorized');
    });

    it('should return 401 for wrong password', async () => {
      // First create a user
      await request(app.getHttpServer())
        .post('/auth/create')
        .send({
          email: 'wrong-password@example.com',
          password: 'correct-password',
        })
        .expect(201);

      // Try to login with wrong password
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'wrong-password@example.com',
          password: 'wrong-password',
        })
        .expect(401);

      expect(response.body).toHaveProperty('statusCode', 401);
      expect(response.body).toHaveProperty('message', 'Invalid credentials');
      expect(response.body).toHaveProperty('error', 'Unauthorized');
    });

    it('should return 400 for invalid email format', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'invalid-email-format',
          password: 'password123',
        })
        .expect(400);

      expect(response.body).toHaveProperty('statusCode', 400);
      expect(response.body).toHaveProperty('message');
      expect(Array.isArray(response.body.message)).toBe(true);
    });

    it('should return 400 for missing email', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          password: 'password123',
        })
        .expect(400);

      expect(response.body).toHaveProperty('statusCode', 400);
      expect(response.body).toHaveProperty('message');
    });

    it('should return 400 for missing password', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'test@example.com',
        })
        .expect(400);

      expect(response.body).toHaveProperty('statusCode', 400);
      expect(response.body).toHaveProperty('message');
    });

    it('should return 400 for empty email', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: '',
          password: 'password123',
        })
        .expect(400);

      expect(response.body).toHaveProperty('statusCode', 400);
      expect(response.body).toHaveProperty('message');
    });

    it('should return 400 for empty password', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: '',
        })
        .expect(400);

      expect(response.body).toHaveProperty('statusCode', 400);
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('Registration Failures', () => {
    it('should return 409 for duplicate email', async () => {
      const userData = {
        email: 'duplicate@example.com',
        password: 'password123',
      };

      // Create first user
      await request(app.getHttpServer())
        .post('/auth/create')
        .send(userData)
        .expect(201);

      // Try to create second user with same email
      const response = await request(app.getHttpServer())
        .post('/auth/create')
        .send(userData)
        .expect(409);

      expect(response.body).toHaveProperty('statusCode', 409);
      expect(response.body).toHaveProperty('message', 'Email already in use');
      expect(response.body).toHaveProperty('error', 'Conflict');
    });

    it('should return 400 for invalid email format during registration', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/create')
        .send({
          email: 'invalid-email',
          password: 'password123',
        })
        .expect(400);

      expect(response.body).toHaveProperty('statusCode', 400);
      expect(response.body).toHaveProperty('message');
    });

    it('should return 400 for missing required fields during registration', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/create')
        .send({
          email: 'test@example.com',
          // missing password
        })
        .expect(400);

      expect(response.body).toHaveProperty('statusCode', 400);
      expect(response.body).toHaveProperty('message');
    });

    it('should return 400 for weak password', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/create')
        .send({
          email: 'test@example.com',
          password: '123', // too short
        })
        .expect(400);

      expect(response.body).toHaveProperty('statusCode', 400);
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('JWT Token Failures', () => {
    it('should return 401 for missing Authorization header', async () => {
      const response = await request(app.getHttpServer())
        .get('/moods')
        .expect(401);

      expect(response.body).toHaveProperty('statusCode', 401);
      expect(response.body).toHaveProperty('message', 'Unauthorized');
      expect(response.body).toHaveProperty('error', 'Unauthorized');
    });

    it('should return 401 for invalid Authorization format', async () => {
      const response = await request(app.getHttpServer())
        .get('/moods')
        .set('Authorization', 'InvalidFormat token')
        .expect(401);

      expect(response.body).toHaveProperty('statusCode', 401);
      expect(response.body).toHaveProperty('message', 'Unauthorized');
    });

    it('should return 401 for malformed JWT token', async () => {
      const response = await request(app.getHttpServer())
        .get('/moods')
        .set('Authorization', 'Bearer malformed.token.here')
        .expect(401);

      expect(response.body).toHaveProperty('statusCode', 401);
      expect(response.body).toHaveProperty('message', 'Unauthorized');
    });

    it('should return 401 for expired JWT token', async () => {
      // Create a token that expires in 1 second
      const expiredToken = jwtService.sign(
        { sub: '1', email: 'test@example.com' },
        { expiresIn: '1s' },
      );

      // Wait for token to expire
      await new Promise((resolve) => setTimeout(resolve, 1100));

      const response = await request(app.getHttpServer())
        .get('/moods')
        .set('Authorization', `Bearer ${expiredToken}`)
        .expect(401);

      expect(response.body).toHaveProperty('statusCode', 401);
      expect(response.body).toHaveProperty('message', 'Unauthorized');
    });

    it('should return 401 for token with invalid signature', async () => {
      const response = await request(app.getHttpServer())
        .get('/moods')
        .set(
          'Authorization',
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwiaWF0IjoxNjE2MjM5MDIyfQ.invalid-signature',
        )
        .expect(401);

      expect(response.body).toHaveProperty('statusCode', 401);
      expect(response.body).toHaveProperty('message', 'Unauthorized');
    });

    it('should return 401 for token with missing payload fields', async () => {
      const invalidToken = jwtService.sign(
        { email: 'test@example.com' }, // missing sub
        { secret: 'test-secret' },
      );

      const response = await request(app.getHttpServer())
        .get('/moods')
        .set('Authorization', `Bearer ${invalidToken}`)
        .expect(401);

      expect(response.body).toHaveProperty('statusCode', 401);
      expect(response.body).toHaveProperty('message', 'Unauthorized');
    });

    it('should return 401 for empty token', async () => {
      const response = await request(app.getHttpServer())
        .get('/moods')
        .set('Authorization', 'Bearer ')
        .expect(401);

      expect(response.body).toHaveProperty('statusCode', 401);
      expect(response.body).toHaveProperty('message', 'Unauthorized');
    });

    it('should return 401 for token with only whitespace', async () => {
      const response = await request(app.getHttpServer())
        .get('/moods')
        .set('Authorization', 'Bearer   ')
        .expect(401);

      expect(response.body).toHaveProperty('statusCode', 401);
      expect(response.body).toHaveProperty('message', 'Unauthorized');
    });
  });

  describe('Protected Endpoint Failures', () => {
    it('should return 401 for mood endpoints without authentication', async () => {
      const response = await request(app.getHttpServer())
        .get('/moods')
        .expect(401);

      expect(response.body).toHaveProperty('statusCode', 401);
      expect(response.body).toHaveProperty('message', 'Unauthorized');
    });

    it('should return 401 for saved content endpoints without authentication', async () => {
      const response = await request(app.getHttpServer())
        .get('/contents/saved-contents')
        .expect(401);

      expect(response.body).toHaveProperty('statusCode', 401);
      expect(response.body).toHaveProperty('message', 'Unauthorized');
    });

    it('should return 401 for user preferences endpoints without authentication', async () => {
      const response = await request(app.getHttpServer())
        .get('/user/preferences')
        .expect(401);

      expect(response.body).toHaveProperty('statusCode', 401);
      expect(response.body).toHaveProperty('message', 'Unauthorized');
    });

    it('should return 401 for mood creation without authentication', async () => {
      const response = await request(app.getHttpServer())
        .post('/moods/create-mood')
        .send({ feeling: 'happy' })
        .expect(401);

      expect(response.body).toHaveProperty('statusCode', 401);
      expect(response.body).toHaveProperty('message', 'Unauthorized');
    });

    it('should return 401 for save content without authentication', async () => {
      const response = await request(app.getHttpServer())
        .post('/contents/saved-contents')
        .send({
          contentId: 1,
          mood: 'happy',
        })
        .expect(401);

      expect(response.body).toHaveProperty('statusCode', 401);
      expect(response.body).toHaveProperty('message', 'Unauthorized');
    });

    it('should return 401 for update preferences without authentication', async () => {
      const response = await request(app.getHttpServer())
        .put('/user/preferences')
        .send({
          theme: 'dark',
          notificationsEnabled: true,
        })
        .expect(401);

      expect(response.body).toHaveProperty('statusCode', 401);
      expect(response.body).toHaveProperty('message', 'Unauthorized');
    });
  });

  describe('Request Validation Failures', () => {
    it('should return 400 for malformed JSON in login request', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .set('Content-Type', 'application/json')
        .send('{"email": "test@example.com", "password": "password"') // Missing closing brace
        .expect(400);

      expect(response.body).toHaveProperty('statusCode', 400);
    });

    it('should return 400 for malformed JSON in registration request', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/create')
        .set('Content-Type', 'application/json')
        .send('{"email": "test@example.com", "password": "password"') // Missing closing brace
        .expect(400);

      expect(response.body).toHaveProperty('statusCode', 400);
    });

    it('should return 413 for oversized request body', async () => {
      const largeBody = {
        email: 'a'.repeat(10000) + '@example.com',
        password: 'password',
      };

      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send(largeBody)
        .expect(413); // Payload Too Large

      expect(response.body).toHaveProperty('statusCode', 413);
    });

    it('should return 400 for invalid content type', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .set('Content-Type', 'text/plain')
        .send('email=test@example.com&password=password')
        .expect(400);

      expect(response.body).toHaveProperty('statusCode', 400);
    });
  });

  describe('Edge Cases', () => {
    it('should handle very long email addresses', async () => {
      const longEmail = 'a'.repeat(100) + '@example.com';
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: longEmail,
          password: 'password123',
        })
        .expect(401); // Should fail due to non-existent user

      expect(response.body).toHaveProperty('statusCode', 401);
    });

    it('should handle special characters in email', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'test+tag@example.com',
          password: 'password123',
        })
        .expect(401); // Should fail due to non-existent user

      expect(response.body).toHaveProperty('statusCode', 401);
    });

    it('should handle unicode characters in email', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'tëst@exämple.com',
          password: 'password123',
        })
        .expect(401); // Should fail due to non-existent user

      expect(response.body).toHaveProperty('statusCode', 401);
    });

    it('should handle SQL injection attempts', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: "'; DROP TABLE users; --",
          password: 'password123',
        })
        .expect(400); // Should fail validation

      expect(response.body).toHaveProperty('statusCode', 400);
    });

    it('should handle XSS attempts', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: '<script>alert("xss")</script>@example.com',
          password: 'password123',
        })
        .expect(400); // Should fail validation

      expect(response.body).toHaveProperty('statusCode', 400);
    });
  });
});
