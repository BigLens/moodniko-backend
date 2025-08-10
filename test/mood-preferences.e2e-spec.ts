import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { TestAuthUtils } from './test-utils';

describe('Mood Preferences (e2e)', () => {
  let app: INestApplication;
  let validToken: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    validToken = TestAuthUtils.generateValidToken();
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  describe('GET /user/preferences/mood', () => {
    it('should return 401 for missing authentication', async () => {
      await request(app.getHttpServer())
        .get('/user/preferences/mood')
        .expect(401);
    });

    it('should return 200 and all mood preferences with valid authentication', async () => {
      const response = await request(app.getHttpServer())
        .get('/user/preferences/mood')
        .set('Authorization', `Bearer ${validToken}`)
        .expect(200);

      expect(response.body).toBeDefined();
      if (response.body) {
        expect(response.body).toHaveProperty('moodPreferences');
        expect(response.body).toHaveProperty('moodIntensitySettings');
        expect(response.body).toHaveProperty('customMoodCategories');
        expect(response.body).toHaveProperty('defaultIntensityLevels');
        expect(response.body).toHaveProperty('enableMoodIntensity');
        expect(response.body).toHaveProperty('enableCustomMoodCategories');
      }
    });

    it('should return specific mood preferences when mood query parameter is provided', async () => {
      const response = await request(app.getHttpServer())
        .get('/user/preferences/mood?mood=happy')
        .set('Authorization', `Bearer ${validToken}`)
        .expect(200);

      expect(response.body).toBeDefined();
      if (response.body) {
        expect(response.body).toHaveProperty('mood');
        expect(response.body.mood).toBe('happy');
      }
    });
  });

  describe('PUT /user/preferences/mood', () => {
    const moodPreferencesData = {
      mood: 'happy',
      moodPreference: {
        intensityLevels: [1, 2, 3, 4, 5],
        preferredContentTypes: ['comedy', 'pop'],
        customCategories: ['uplifting'],
        defaultPreferences: {
          contentTypes: ['comedy', 'pop'],
          intensityThreshold: 3,
        },
      },
      intensitySettings: {
        minIntensity: 1,
        maxIntensity: 5,
        contentMappings: {
          comedy: { minIntensity: 1, maxIntensity: 5, priority: 1 },
          pop: { minIntensity: 1, maxIntensity: 5, priority: 2 },
        },
      },
    };

    it('should return 401 for missing authentication', async () => {
      await request(app.getHttpServer())
        .put('/user/preferences/mood')
        .send(moodPreferencesData)
        .expect(401);
    });

    it('should return 200 and update mood preferences with valid authentication', async () => {
      const response = await request(app.getHttpServer())
        .put('/user/preferences/mood')
        .set('Authorization', `Bearer ${validToken}`)
        .send(moodPreferencesData)
        .expect(200);

      expect(response.body).toBeDefined();
      if (response.body) {
        expect(response.body).toHaveProperty('moodPreferences');
        expect(response.body.moodPreferences).toHaveProperty('happy');
        expect(response.body).toHaveProperty('moodIntensitySettings');
        expect(response.body.moodIntensitySettings).toHaveProperty('happy');
      }
    });

    it('should handle partial mood preference updates', async () => {
      const partialUpdate = {
        mood: 'sad',
        moodPreference: {
          intensityLevels: [1, 2, 3],
          preferredContentTypes: ['drama', 'classical'],
          customCategories: ['melancholic'],
          defaultPreferences: {
            contentTypes: ['drama', 'classical'],
            intensityThreshold: 2,
          },
        },
      };

      const response = await request(app.getHttpServer())
        .put('/user/preferences/mood')
        .set('Authorization', `Bearer ${validToken}`)
        .send(partialUpdate)
        .expect(200);

      expect(response.body).toBeDefined();
    });

    it('should handle general mood settings updates', async () => {
      const generalSettings = {
        defaultIntensityLevels: 10,
        enableMoodIntensity: false,
        enableCustomMoodCategories: true,
        customMoodCategories: ['energetic', 'calm', 'focused'],
      };

      const response = await request(app.getHttpServer())
        .put('/user/preferences/mood')
        .set('Authorization', `Bearer ${validToken}`)
        .send(generalSettings)
        .expect(200);

      expect(response.body).toBeDefined();
      if (response.body) {
        expect(response.body.defaultIntensityLevels).toBe(10);
        expect(response.body.enableMoodIntensity).toBe(false);
        expect(response.body.enableCustomMoodCategories).toBe(true);
        expect(response.body.customMoodCategories).toEqual([
          'energetic',
          'calm',
          'focused',
        ]);
      }
    });
  });

  describe('POST /user/preferences/mood/categories', () => {
    const categoryData = {
      categoryName: 'energetic',
      description: 'High energy moods',
      relatedMoods: ['happy', 'excited', 'motivated'],
    };

    it('should return 401 for missing authentication', async () => {
      await request(app.getHttpServer())
        .post('/user/preferences/mood/categories')
        .send(categoryData)
        .expect(401);
    });

    it('should return 201 and create custom mood category with valid authentication', async () => {
      const response = await request(app.getHttpServer())
        .post('/user/preferences/mood/categories')
        .set('Authorization', `Bearer ${validToken}`)
        .send(categoryData)
        .expect(201);

      expect(response.body).toBeDefined();
      if (response.body) {
        expect(response.body).toHaveProperty('customMoodCategories');
        expect(response.body.customMoodCategories).toContain('energetic');
      }
    });

    it('should handle duplicate category creation', async () => {
      // First creation
      await request(app.getHttpServer())
        .post('/user/preferences/mood/categories')
        .set('Authorization', `Bearer ${validToken}`)
        .send(categoryData)
        .expect(201);

      // Duplicate creation should fail
      await request(app.getHttpServer())
        .post('/user/preferences/mood/categories')
        .set('Authorization', `Bearer ${validToken}`)
        .send(categoryData)
        .expect(400);
    });
  });

  describe('DELETE /user/preferences/mood/categories/:categoryName', () => {
    it('should return 401 for missing authentication', async () => {
      await request(app.getHttpServer())
        .delete('/user/preferences/mood/categories/test-category')
        .expect(401);
    });

    it('should return 200 and delete custom mood category with valid authentication', async () => {
      // First create a category
      const categoryData = { categoryName: 'test-category' };
      await request(app.getHttpServer())
        .post('/user/preferences/mood/categories')
        .set('Authorization', `Bearer ${validToken}`)
        .send(categoryData)
        .expect(201);

      // Then delete it
      const response = await request(app.getHttpServer())
        .delete('/user/preferences/mood/categories/test-category')
        .set('Authorization', `Bearer ${validToken}`)
        .expect(200);

      expect(response.body).toBeDefined();
    });

    it('should return 404 when trying to delete non-existent category', async () => {
      await request(app.getHttpServer())
        .delete('/user/preferences/mood/categories/non-existent-category')
        .set('Authorization', `Bearer ${validToken}`)
        .expect(404);
    });
  });

  describe('POST /user/preferences/mood/recommendations', () => {
    const recommendationRequest = {
      mood: 'happy',
      intensity: 4,
      preferredContentTypes: ['comedy', 'pop'],
    };

    it('should return 401 for missing authentication', async () => {
      await request(app.getHttpServer())
        .post('/user/preferences/mood/recommendations')
        .send(recommendationRequest)
        .expect(401);
    });

    it('should return 200 and get content recommendations with valid authentication', async () => {
      const response = await request(app.getHttpServer())
        .post('/user/preferences/mood/recommendations')
        .set('Authorization', `Bearer ${validToken}`)
        .send(recommendationRequest)
        .expect(200);

      expect(response.body).toBeDefined();
      if (response.body) {
        expect(response.body).toHaveProperty('contentTypes');
        expect(response.body).toHaveProperty('intensity');
        expect(response.body).toHaveProperty('mood');
        expect(response.body).toHaveProperty('isDefault');
        expect(response.body.intensity).toBe(4);
        expect(response.body.mood).toBe('happy');
      }
    });

    it('should handle recommendations without specific content types', async () => {
      const basicRequest = {
        mood: 'sad',
        intensity: 2,
      };

      const response = await request(app.getHttpServer())
        .post('/user/preferences/mood/recommendations')
        .set('Authorization', `Bearer ${validToken}`)
        .send(basicRequest)
        .expect(200);

      expect(response.body).toBeDefined();
      expect(response.body.mood).toBe('sad');
      expect(response.body.intensity).toBe(2);
    });
  });

  describe('DELETE /user/preferences/mood/reset', () => {
    it('should return 401 for missing authentication', async () => {
      await request(app.getHttpServer())
        .delete('/user/preferences/mood/reset')
        .expect(401);
    });

    it('should return 200 and reset all mood preferences with valid authentication', async () => {
      const response = await request(app.getHttpServer())
        .delete('/user/preferences/mood/reset')
        .set('Authorization', `Bearer ${validToken}`)
        .expect(200);

      expect(response.body).toBeDefined();
      if (response.body) {
        expect(response.body).toHaveProperty('moodPreferences');
        expect(response.body).toHaveProperty('moodIntensitySettings');
        expect(response.body).toHaveProperty('customMoodCategories');
        expect(response.body).toHaveProperty('defaultIntensityLevels');
        expect(response.body).toHaveProperty('enableMoodIntensity');
        expect(response.body).toHaveProperty('enableCustomMoodCategories');
      }
    });

    it('should reset specific mood preferences when mood query parameter is provided', async () => {
      const response = await request(app.getHttpServer())
        .delete('/user/preferences/mood/reset?mood=happy')
        .set('Authorization', `Bearer ${validToken}`)
        .expect(200);

      expect(response.body).toBeDefined();
    });
  });

  describe('User Context Validation', () => {
    it('should ensure mood preferences are isolated by user', async () => {
      const user1Token = TestAuthUtils.generateValidToken(
        1,
        'user1@example.com',
      );
      const user1Data = {
        mood: 'happy',
        moodPreference: {
          intensityLevels: [1, 2, 3, 4, 5],
          preferredContentTypes: ['comedy'],
          customCategories: ['uplifting'],
          defaultPreferences: {
            contentTypes: ['comedy'],
            intensityThreshold: 3,
          },
        },
      };

      await request(app.getHttpServer())
        .put('/user/preferences/mood')
        .set('Authorization', `Bearer ${user1Token}`)
        .send(user1Data)
        .expect(200);

      const user2Token = TestAuthUtils.generateValidToken(
        2,
        'user2@example.com',
      );
      const user2Data = {
        mood: 'happy',
        moodPreference: {
          intensityLevels: [1, 2, 3],
          preferredContentTypes: ['drama'],
          customCategories: ['melancholic'],
          defaultPreferences: {
            contentTypes: ['drama'],
            intensityThreshold: 2,
          },
        },
      };

      const user2Response = await request(app.getHttpServer())
        .put('/user/preferences/mood')
        .set('Authorization', `Bearer ${user2Token}`)
        .send(user2Data)
        .expect(200);

      expect(
        user2Response.body.moodPreferences.happy.preferredContentTypes,
      ).toEqual(['drama']);
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid mood preference data', async () => {
      const invalidData = {
        mood: 'happy',
        moodPreference: {
          intensityLevels: 'invalid', // Should be array
          preferredContentTypes: 'invalid', // Should be array
          customCategories: 'invalid', // Should be array
          defaultPreferences: {
            contentTypes: 'invalid', // Should be array
            intensityThreshold: 'invalid', // Should be number
          },
        },
      };

      await request(app.getHttpServer())
        .put('/user/preferences/mood')
        .set('Authorization', `Bearer ${validToken}`)
        .send(invalidData)
        .expect(400);
    });

    it('should handle invalid category data', async () => {
      const invalidCategoryData = {
        categoryName: '', // Empty name
        description: 123, // Should be string
        relatedMoods: 'invalid', // Should be array
      };

      await request(app.getHttpServer())
        .post('/user/preferences/mood/categories')
        .set('Authorization', `Bearer ${validToken}`)
        .send(invalidCategoryData)
        .expect(400);
    });

    it('should handle invalid recommendation request', async () => {
      const invalidRequest = {
        mood: '', // Empty mood
        intensity: 'invalid', // Should be number
        preferredContentTypes: 'invalid', // Should be array
      };

      await request(app.getHttpServer())
        .post('/user/preferences/mood/recommendations')
        .set('Authorization', `Bearer ${validToken}`)
        .send(invalidRequest)
        .expect(400);
    });
  });
});
