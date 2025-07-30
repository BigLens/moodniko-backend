import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Authentication Protection (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Public Endpoints (should be accessible without authentication)', () => {
    it('should allow access to health endpoint without authentication', async () => {
      await request(app.getHttpServer()).get('/health').expect(200);
    });

    it('should allow access to login endpoint without authentication', async () => {
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123',
        })
        .expect(401); // Should return 401 for invalid credentials, not 403 (forbidden)
    });

    it('should allow access to register endpoint without authentication', async () => {
      await request(app.getHttpServer())
        .post('/auth/create')
        .send({
          email: 'newuser@example.com',
          password: 'password123',
        })
        .expect(201); // Should return 201 for successful registration
    });

    it('should allow access to contents endpoint without authentication', async () => {
      await request(app.getHttpServer())
        .get('/contents')
        .query({ mood: 'happy', type: 'movie' })
        .expect(200);
    });
  });

  describe('Protected Endpoints (should require authentication)', () => {
    it('should deny access to mood endpoints without authentication', async () => {
      await request(app.getHttpServer()).get('/moods').expect(401);
    });

    it('should deny access to saved content endpoints without authentication', async () => {
      await request(app.getHttpServer())
        .get('/contents/saved-contents')
        .expect(401);
    });

    it('should deny access to user preferences endpoints without authentication', async () => {
      await request(app.getHttpServer()).get('/user/preferences').expect(401);
    });

    it('should deny access to mood creation without authentication', async () => {
      await request(app.getHttpServer())
        .post('/moods/create-mood')
        .send({ feeling: 'happy' })
        .expect(401);
    });

    it('should deny access to save content without authentication', async () => {
      await request(app.getHttpServer())
        .post('/contents/saved-contents')
        .send({
          contentId: 1,
          mood: 'happy',
        })
        .expect(401);
    });

    it('should deny access to update preferences without authentication', async () => {
      await request(app.getHttpServer())
        .put('/user/preferences')
        .send({
          theme: 'dark',
          notificationsEnabled: true,
        })
        .expect(401);
    });
  });

  describe('Protected Endpoints with Valid Authentication', () => {
    let authToken: string;

    beforeAll(async () => {
      // Create a test user and get authentication token
      const registerResponse = await request(app.getHttpServer())
        .post('/auth/create')
        .send({
          email: 'testuser@example.com',
          password: 'password123',
        })
        .expect(201);

      authToken = registerResponse.body.accessToken;
    });

    it('should allow access to mood endpoints with valid authentication', async () => {
      await request(app.getHttpServer())
        .get('/moods')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
    });

    it('should allow access to saved content endpoints with valid authentication', async () => {
      await request(app.getHttpServer())
        .get('/contents/saved-contents')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
    });

    it('should allow access to user preferences endpoints with valid authentication', async () => {
      await request(app.getHttpServer())
        .get('/user/preferences')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
    });

    it('should allow mood creation with valid authentication', async () => {
      await request(app.getHttpServer())
        .post('/moods/create-mood')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ feeling: 'happy' })
        .expect(201);
    });

    it('should allow saving content with valid authentication', async () => {
      // First, we need to create some content to save
      const contentResponse = await request(app.getHttpServer())
        .get('/contents')
        .query({ mood: 'happy', type: 'movie' })
        .expect(200);

      if (contentResponse.body.length > 0) {
        await request(app.getHttpServer())
          .post('/contents/saved-contents')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            contentId: contentResponse.body[0].id,
            mood: 'happy',
          })
          .expect(201);
      }
    });

    it('should allow updating preferences with valid authentication', async () => {
      await request(app.getHttpServer())
        .put('/user/preferences')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          theme: 'dark',
          notificationsEnabled: true,
        })
        .expect(200);
    });
  });

  describe('Error Handling for Unauthorized Access', () => {
    it('should return proper 401 status for unauthorized access', async () => {
      const response = await request(app.getHttpServer())
        .get('/moods')
        .expect(401);

      expect(response.body).toHaveProperty('statusCode', 401);
      expect(response.body).toHaveProperty('message');
      // Note: The actual response format may vary, so we only check for required fields
    });

    it('should return proper error response for invalid token', async () => {
      const response = await request(app.getHttpServer())
        .get('/moods')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);

      expect(response.body).toHaveProperty('statusCode', 401);
      expect(response.body).toHaveProperty('message');
    });
  });
});
