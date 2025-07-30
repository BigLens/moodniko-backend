import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { TestAuthUtils } from './test-utils';

describe('AppController (e2e)', () => {
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

  describe('Public Endpoints', () => {
    it('/ (GET) - should return health status without authentication', () => {
      return request(app.getHttpServer())
        .get('/')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('status', 'ok');
          expect(res.body).toHaveProperty('timestamp');
          expect(new Date(res.body.timestamp)).toBeInstanceOf(Date);
        });
    });

    it('/health (GET) - should return health status without authentication', () => {
      return request(app.getHttpServer())
        .get('/health')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('status', 'ok');
        });
    });
  });

  describe('Authentication Tests', () => {
    it('should allow access to public endpoints without authentication', async () => {
      await request(app.getHttpServer()).get('/').expect(200);

      await request(app.getHttpServer()).get('/health').expect(200);
    });

    it('should allow access to public endpoints with valid authentication', async () => {
      await request(app.getHttpServer())
        .get('/')
        .set('Authorization', `Bearer ${validToken}`)
        .expect(200);

      await request(app.getHttpServer())
        .get('/health')
        .set('Authorization', `Bearer ${validToken}`)
        .expect(200);
    });

    it('should allow access to public endpoints with invalid authentication', async () => {
      await request(app.getHttpServer())
        .get('/')
        .set('Authorization', 'Bearer invalid-token')
        .expect(200);

      await request(app.getHttpServer())
        .get('/health')
        .set('Authorization', 'Bearer invalid-token')
        .expect(200);
    });
  });
});
