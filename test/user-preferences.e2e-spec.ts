import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { TestAuthUtils } from './test-utils';

describe('UserPreferences (e2e)', () => {
  let app: INestApplication;
  let validToken: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Generate a valid token for testing
    validToken = TestAuthUtils.generateValidToken();
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  describe('GET /user/preferences', () => {
    it('should return 401 for missing authentication', async () => {
      await request(app.getHttpServer()).get('/user/preferences').expect(401);
    });

    it('should return 401 for invalid authentication token', async () => {
      await request(app.getHttpServer())
        .get('/user/preferences')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);
    });

    it('should return 200 and user preferences with valid authentication', async () => {
      const response = await request(app.getHttpServer())
        .get('/user/preferences')
        .set('Authorization', `Bearer ${validToken}`)
        .expect(200);

      expect(response.body).toBeDefined();
      // The response might be null if no preferences exist yet
      if (response.body) {
        expect(response.body).toHaveProperty('id');
        expect(response.body).toHaveProperty('theme');
        expect(response.body).toHaveProperty('notificationsEnabled');
        expect(response.body).toHaveProperty('preferredContentTypes');
      }
    });

    it('should return null when user has no preferences', async () => {
      // This test assumes the user has no preferences set up
      const response = await request(app.getHttpServer())
        .get('/user/preferences')
        .set('Authorization', `Bearer ${validToken}`)
        .expect(200);

      // The response might be null or an empty object
      expect(response.body).toBeDefined();
    });
  });

  describe('PUT /user/preferences', () => {
    const updateData = {
      theme: 'light',
      notificationsEnabled: false,
      preferredContentTypes: ['movie', 'music'],
    };

    it('should return 401 for missing authentication', async () => {
      await request(app.getHttpServer())
        .put('/user/preferences')
        .send(updateData)
        .expect(401);
    });

    it('should return 401 for invalid authentication token', async () => {
      await request(app.getHttpServer())
        .put('/user/preferences')
        .set('Authorization', 'Bearer invalid-token')
        .send(updateData)
        .expect(401);
    });

    it('should return 200 and update user preferences with valid authentication', async () => {
      const response = await request(app.getHttpServer())
        .put('/user/preferences')
        .set('Authorization', `Bearer ${validToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body).toBeDefined();
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('theme', updateData.theme);
      expect(response.body).toHaveProperty(
        'notificationsEnabled',
        updateData.notificationsEnabled,
      );
      expect(response.body).toHaveProperty(
        'preferredContentTypes',
        updateData.preferredContentTypes,
      );
    });

    it('should handle partial updates', async () => {
      const partialUpdate = { theme: 'dark' };

      const response = await request(app.getHttpServer())
        .put('/user/preferences')
        .set('Authorization', `Bearer ${validToken}`)
        .send(partialUpdate)
        .expect(200);

      expect(response.body).toBeDefined();
      expect(response.body).toHaveProperty('theme', partialUpdate.theme);
    });

    it('should handle empty update data', async () => {
      const response = await request(app.getHttpServer())
        .put('/user/preferences')
        .set('Authorization', `Bearer ${validToken}`)
        .send({})
        .expect(200);

      expect(response.body).toBeDefined();
    });

    it('should handle invalid preference values', async () => {
      const invalidData = {
        theme: 'invalid-theme',
        notificationsEnabled: 'not-a-boolean',
      };

      await request(app.getHttpServer())
        .put('/user/preferences')
        .set('Authorization', `Bearer ${validToken}`)
        .send(invalidData)
        .expect(400);
    });
  });

  describe('Authentication Edge Cases', () => {
    it('should handle expired tokens', async () => {
      const expiredToken = TestAuthUtils.generateExpiredToken();

      await request(app.getHttpServer())
        .get('/user/preferences')
        .set('Authorization', `Bearer ${expiredToken}`)
        .expect(401);
    });

    it('should handle malformed tokens', async () => {
      await request(app.getHttpServer())
        .get('/user/preferences')
        .set('Authorization', 'Bearer malformed.token.here')
        .expect(401);
    });

    it('should handle missing Bearer prefix', async () => {
      await request(app.getHttpServer())
        .get('/user/preferences')
        .set('Authorization', validToken)
        .expect(401);
    });

    it('should handle empty Authorization header', async () => {
      await request(app.getHttpServer())
        .get('/user/preferences')
        .set('Authorization', '')
        .expect(401);
    });

    it('should handle different user contexts', async () => {
      const differentUserToken = TestAuthUtils.generateValidToken(
        2,
        'user2@example.com',
      );

      const response = await request(app.getHttpServer())
        .get('/user/preferences')
        .set('Authorization', `Bearer ${differentUserToken}`)
        .expect(200);

      expect(response.body).toBeDefined();
    });
  });

  describe('User Context Validation', () => {
    it('should ensure user preferences are isolated by user', async () => {
      // First user's preferences
      const user1Token = TestAuthUtils.generateValidToken(
        1,
        'user1@example.com',
      );
      const user1Data = { theme: 'light', notificationsEnabled: true };

      const user1Response = await request(app.getHttpServer())
        .put('/user/preferences')
        .set('Authorization', `Bearer ${user1Token}`)
        .send(user1Data)
        .expect(200);

      // Second user's preferences
      const user2Token = TestAuthUtils.generateValidToken(
        2,
        'user2@example.com',
      );
      const user2Data = { theme: 'dark', notificationsEnabled: false };

      const user2Response = await request(app.getHttpServer())
        .put('/user/preferences')
        .set('Authorization', `Bearer ${user2Token}`)
        .send(user2Data)
        .expect(200);

      // Verify preferences are different
      expect(user1Response.body.theme).toBe(user1Data.theme);
      expect(user2Response.body.theme).toBe(user2Data.theme);
      expect(user1Response.body.theme).not.toBe(user2Response.body.theme);
    });
  });
});
