import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Authentication Guards (e2e)', () => {
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

    it('should allow access to contents endpoint without authentication', async () => {
      await request(app.getHttpServer())
        .get('/contents')
        .query({ mood: 'happy', type: 'movie' })
        .expect(200);
    });
  });

  describe('Protected Endpoints (should require authentication)', () => {
    it('should deny access to mood endpoints without authentication', async () => {
      const response = await request(app.getHttpServer())
        .get('/moods')
        .expect(401);

      expect(response.body).toHaveProperty('statusCode', 401);
      expect(response.body).toHaveProperty('message');
    });

    it('should deny access to saved content endpoints without authentication', async () => {
      const response = await request(app.getHttpServer())
        .get('/contents/saved-contents')
        .expect(401);

      expect(response.body).toHaveProperty('statusCode', 401);
      expect(response.body).toHaveProperty('message');
    });

    it('should deny access to user preferences endpoints without authentication', async () => {
      const response = await request(app.getHttpServer())
        .get('/user/preferences')
        .expect(401);

      expect(response.body).toHaveProperty('statusCode', 401);
      expect(response.body).toHaveProperty('message');
    });

    it('should deny access to mood creation without authentication', async () => {
      const response = await request(app.getHttpServer())
        .post('/moods/create-mood')
        .send({ feeling: 'happy' })
        .expect(401);

      expect(response.body).toHaveProperty('statusCode', 401);
      expect(response.body).toHaveProperty('message');
    });

    it('should deny access to save content without authentication', async () => {
      const response = await request(app.getHttpServer())
        .post('/contents/saved-contents')
        .send({
          contentId: 1,
          mood: 'happy',
        })
        .expect(401);

      expect(response.body).toHaveProperty('statusCode', 401);
      expect(response.body).toHaveProperty('message');
    });

    it('should deny access to update preferences without authentication', async () => {
      const response = await request(app.getHttpServer())
        .put('/user/preferences')
        .send({
          theme: 'dark',
          notificationsEnabled: true,
        })
        .expect(401);

      expect(response.body).toHaveProperty('statusCode', 401);
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('Error Handling for Unauthorized Access', () => {
    it('should return proper error response for invalid token', async () => {
      const response = await request(app.getHttpServer())
        .get('/moods')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);

      expect(response.body).toHaveProperty('statusCode', 401);
      expect(response.body).toHaveProperty('message');
    });

    it('should return proper error response for missing token', async () => {
      const response = await request(app.getHttpServer())
        .get('/moods')
        .expect(401);

      expect(response.body).toHaveProperty('statusCode', 401);
      expect(response.body).toHaveProperty('message');
    });
  });
});
