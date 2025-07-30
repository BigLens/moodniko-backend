import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { AppConfigService } from '../src/config/config.service';

describe('Configuration (e2e)', () => {
  let app: INestApplication;
  let configService: AppConfigService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    configService = moduleFixture.get<AppConfigService>(AppConfigService);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Configuration Service', () => {
    it('should load JWT configuration', () => {
      expect(configService.jwtExpiresIn).toBeDefined();
      expect(typeof configService.jwtExpiresIn).toBe('string');
    });

    it('should load database configuration', () => {
      expect(configService.databaseHost).toBeDefined();
      expect(configService.databasePort).toBeDefined();
      expect(configService.databaseUsername).toBeDefined();
      expect(configService.databaseName).toBeDefined();
    });

    it('should load app configuration', () => {
      expect(configService.port).toBeDefined();
      expect(typeof configService.port).toBe('number');
      expect(configService.nodeEnv).toBeDefined();
      expect(typeof configService.nodeEnv).toBe('string');
    });

    it('should load third party configuration', () => {
      expect(configService.spotifyClientId).toBeDefined();
      expect(configService.tmdbApiKey).toBeDefined();
      expect(configService.googleBooksApiKey).toBeDefined();
    });

    it('should have default values for optional configurations', () => {
      expect(configService.jwtExpiresIn).toBe('24h');
      expect(configService.databaseType).toBe('postgres');
      expect(configService.port).toBe(4002);
      expect(['development', 'test', 'production']).toContain(
        configService.nodeEnv,
      );
    });

    it('should have valid database port', () => {
      expect(configService.databasePort).toBeGreaterThan(0);
      expect(configService.databasePort).toBeLessThan(65536);
    });
  });

  describe('Environment Validation', () => {
    it('should validate required environment variables', () => {
      // This test will pass if the required environment variables are set
      // or if the validation is properly handled
      expect(() => {
        configService.validateEnvironment();
      }).not.toThrow();
    });
  });
});
