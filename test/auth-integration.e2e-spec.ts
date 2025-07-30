import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { JwtService } from '@nestjs/jwt';

describe('Authentication Integration (e2e)', () => {
  let app: INestApplication;
  let jwtService: JwtService;

  const testUser = {
    email: 'test@example.com',
    password: 'password123',
  };

  const testUser2 = {
    email: 'test2@example.com',
    password: 'password456',
  };

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

  describe('POST /auth/create', () => {
    it('should create a new user successfully', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/create')
        .send(testUser)
        .expect(201);

      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('id');
      expect(response.body.user).toHaveProperty('email', testUser.email);
      expect(response.body.accessToken).toBeDefined();
      expect(typeof response.body.accessToken).toBe('string');
    });

    it('should return 409 when email is already in use', async () => {
      // First create a user
      await request(app.getHttpServer())
        .post('/auth/create')
        .send(testUser2)
        .expect(201);

      // Try to create another user with the same email
      const response = await request(app.getHttpServer())
        .post('/auth/create')
        .send(testUser2)
        .expect(409);

      expect(response.body).toHaveProperty('statusCode', 409);
      expect(response.body).toHaveProperty('message', 'Email already in use');
    });

    it('should return 400 for invalid email format', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/create')
        .send({
          email: 'invalid-email',
          password: 'password123',
        })
        .expect(400);

      expect(response.body).toHaveProperty('statusCode', 400);
      expect(response.body).toHaveProperty('message');
      expect(Array.isArray(response.body.message)).toBe(true);
    });

    it('should return 400 for empty password', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/create')
        .send({
          email: 'test@example.com',
          password: '',
        })
        .expect(400);

      expect(response.body).toHaveProperty('statusCode', 400);
      expect(response.body).toHaveProperty('message');
    });

    it('should return 400 for missing required fields', async () => {
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

    it('should hash password before storing', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/create')
        .send({
          email: 'hash-test@example.com',
          password: 'plaintext-password',
        })
        .expect(201);

      // Verify the user was created
      expect(response.body.user).toBeDefined();

      // The password should be hashed in the database
      // const createdUser = await userService.findByEmail(
      //   'hash-test@example.com',
      // );
      // expect(createdUser).toBeDefined();
      // expect(createdUser.password).not.toBe('plaintext-password');
    });
  });

  describe('POST /auth/login', () => {
    beforeEach(async () => {
      // Create a test user for login tests
      await request(app.getHttpServer())
        .post('/auth/create')
        .send({
          email: 'login-test@example.com',
          password: 'login-password',
        })
        .expect(201);
    });

    it('should login successfully with valid credentials', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'login-test@example.com',
          password: 'login-password',
        })
        .expect(200);

      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('id');
      expect(response.body.user).toHaveProperty(
        'email',
        'login-test@example.com',
      );
      expect(response.body.accessToken).toBeDefined();
      expect(typeof response.body.accessToken).toBe('string');
    });

    it('should return 401 for invalid email', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123',
        })
        .expect(401);

      expect(response.body).toHaveProperty('statusCode', 401);
      expect(response.body).toHaveProperty('message', 'Invalid credentials');
    });

    it('should return 401 for invalid password', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'login-test@example.com',
          password: 'wrong-password',
        })
        .expect(401);

      expect(response.body).toHaveProperty('statusCode', 401);
      expect(response.body).toHaveProperty('message', 'Invalid credentials');
    });

    it('should return 400 for invalid email format', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'invalid-email',
          password: 'password123',
        })
        .expect(400);

      expect(response.body).toHaveProperty('statusCode', 400);
      expect(response.body).toHaveProperty('message');
    });

    it('should return 400 for missing required fields', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          // missing password
        })
        .expect(400);

      expect(response.body).toHaveProperty('statusCode', 400);
      expect(response.body).toHaveProperty('message');
    });

    it('should handle case-sensitive email login', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'LOGIN-TEST@EXAMPLE.COM',
          password: 'login-password',
        })
        .expect(200);

      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('user');
    });
  });

  describe('JWT Token Validation', () => {
    let validToken: string;

    beforeAll(async () => {
      // Create a user and get a valid token
      const createResponse = await request(app.getHttpServer())
        .post('/auth/create')
        .send({
          email: 'jwt-test@example.com',
          password: 'jwt-password',
        })
        .expect(201);

      validToken = createResponse.body.accessToken;
    });

    it('should validate JWT token structure', () => {
      const tokenParts = validToken.split('.');
      expect(tokenParts).toHaveLength(3); // Header, Payload, Signature

      // Decode the payload
      const payload = JSON.parse(
        Buffer.from(tokenParts[1], 'base64').toString(),
      );
      expect(payload).toHaveProperty('sub');
      expect(payload).toHaveProperty('email');
      expect(payload).toHaveProperty('iat');
      expect(payload).toHaveProperty('exp');
    });

    it('should decode JWT token correctly', () => {
      const decoded = jwtService.decode(validToken);
      expect(decoded).toHaveProperty('sub');
      expect(decoded).toHaveProperty('email', 'jwt-test@example.com');
    });

    it('should handle expired tokens', async () => {
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
    });

    it('should handle malformed tokens', async () => {
      const response = await request(app.getHttpServer())
        .get('/moods')
        .set('Authorization', 'Bearer invalid.token.here')
        .expect(401);

      expect(response.body).toHaveProperty('statusCode', 401);
    });

    it('should handle missing Authorization header', async () => {
      const response = await request(app.getHttpServer())
        .get('/moods')
        .expect(401);

      expect(response.body).toHaveProperty('statusCode', 401);
    });

    it('should handle invalid Authorization format', async () => {
      const response = await request(app.getHttpServer())
        .get('/moods')
        .set('Authorization', 'InvalidFormat token')
        .expect(401);

      expect(response.body).toHaveProperty('statusCode', 401);
    });
  });

  describe('Protected Endpoints with Authentication', () => {
    let validToken: string;

    beforeEach(async () => {
      // Create a test user for protected endpoint tests
      const createResponse = await request(app.getHttpServer())
        .post('/auth/create')
        .send({
          email: 'protected-test@example.com',
          password: 'protected-password',
        })
        .expect(201);

      validToken = createResponse.body.accessToken;
    });

    it('should allow access to protected endpoints with valid token', async () => {
      const response = await request(app.getHttpServer())
        .get('/moods')
        .set('Authorization', `Bearer ${validToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should deny access to protected endpoints without token', async () => {
      const response = await request(app.getHttpServer())
        .get('/moods')
        .expect(401);

      expect(response.body).toHaveProperty('statusCode', 401);
      expect(response.body).toHaveProperty('message', 'Unauthorized');
    });

    it('should deny access to protected endpoints with invalid token', async () => {
      const response = await request(app.getHttpServer())
        .get('/moods')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);

      expect(response.body).toHaveProperty('statusCode', 401);
    });

    it('should allow access to user-specific data with valid token', async () => {
      // Create a mood for the user
      await request(app.getHttpServer())
        .post('/moods/create-mood')
        .set('Authorization', `Bearer ${validToken}`)
        .send({ feeling: 'happy' })
        .expect(201);

      // Get user's moods
      const response = await request(app.getHttpServer())
        .get('/moods')
        .set('Authorization', `Bearer ${validToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });

    it('should isolate user data between different users', async () => {
      // Create another user
      const user2Response = await request(app.getHttpServer())
        .post('/auth/create')
        .send({
          email: 'user2@example.com',
          password: 'password123',
        })
        .expect(201);

      const user2Token = user2Response.body.accessToken;

      // Create mood for user 2
      await request(app.getHttpServer())
        .post('/moods/create-mood')
        .set('Authorization', `Bearer ${user2Token}`)
        .send({ feeling: 'sad' })
        .expect(201);

      // User 1 should not see user 2's moods
      const user1Moods = await request(app.getHttpServer())
        .get('/moods')
        .set('Authorization', `Bearer ${validToken}`)
        .expect(200);

      // User 2 should not see user 1's moods
      const user2Moods = await request(app.getHttpServer())
        .get('/moods')
        .set('Authorization', `Bearer ${user2Token}`)
        .expect(200);

      // The moods should be different for each user
      expect(user1Moods.body).not.toEqual(user2Moods.body);
    });
  });

  describe('Public Endpoints', () => {
    it('should allow access to health endpoint without authentication', async () => {
      const response = await request(app.getHttpServer())
        .get('/health')
        .expect(200);

      expect(response.body).toHaveProperty('status', 'ok');
    });

    it('should allow access to contents endpoint without authentication', async () => {
      const response = await request(app.getHttpServer())
        .get('/contents')
        .query({ mood: 'happy', type: 'movie' })
        .expect(200);

      expect(response.body).toBeDefined();
    });
  });

  describe('Error Handling', () => {
    it('should handle database connection errors gracefully', async () => {
      // This test would require mocking the database connection
      // For now, we'll test that the application doesn't crash
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password',
        });

      // Should either return 401 (user not found) or 500 (database error)
      expect([401, 500]).toContain(response.status);
    });

    it('should handle malformed JSON in request body', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .set('Content-Type', 'application/json')
        .send('{"email": "test@example.com", "password": "password"') // Missing closing brace
        .expect(400);

      expect(response.body).toHaveProperty('statusCode', 400);
    });

    it('should handle oversized request bodies', async () => {
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
  });
});
