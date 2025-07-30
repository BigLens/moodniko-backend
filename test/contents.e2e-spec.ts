import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContentsModule } from '@modules/contents/contents.module';
import { MoviesService } from '@modules/contents/providers/movies/movies.service';
import { SpotifyService } from '@modules/contents/providers/spotify/spotify.service';
import { BooksService } from '@modules/contents/providers/books/books.service';
import { ContentType } from '@modules/contents/enum/content.enum';
import { ContentEntity } from '@modules/contents/model/content.entity';
import { testDatabaseConfig } from './test-database.config';
import { DataSource } from 'typeorm';
import { TestAuthUtils } from './test-utils';

describe('ContentsController (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let validToken: string;

  const mockContentEntity = (type: ContentType): ContentEntity => ({
    id: 1,
    externalId: 'test-id',
    title: 'Test Content',
    description: 'Test Description',
    imageUrl: 'http://test.com/image.jpg',
    type,
    moodtag: 'happy',
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  const mockMoviesService = {
    fetchMoviesByMood: jest.fn(),
  };

  const mockSpotifyService = {
    fetchContentByMood: jest.fn(),
  };

  const mockBooksService = {
    fetchBooksByMood: jest.fn(),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot(testDatabaseConfig), ContentsModule],
    })
      .overrideProvider(MoviesService)
      .useValue(mockMoviesService)
      .overrideProvider(SpotifyService)
      .useValue(mockSpotifyService)
      .overrideProvider(BooksService)
      .useValue(mockBooksService)
      .compile();

    app = moduleFixture.createNestApplication();
    dataSource = moduleFixture.get<DataSource>(DataSource);
    await app.init();

    // Generate a valid token for testing
    validToken = TestAuthUtils.generateValidToken();
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }
    if (app) {
      await app.close();
    }
  });

  describe('GET /contents', () => {
    it('should return 200 and content for valid movie request with authentication', async () => {
      const mockMovies = [mockContentEntity(ContentType.MOVIE)];
      mockMoviesService.fetchMoviesByMood.mockResolvedValue(mockMovies);

      const response = await request(app.getHttpServer())
        .get('/contents')
        .set('Authorization', `Bearer ${validToken}`)
        .query({ mood: 'happy', type: ContentType.MOVIE })
        .expect(200);

      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: 1,
            externalId: 'test-id',
            title: 'Test Content',
            description: 'Test Description',
            imageUrl: 'http://test.com/image.jpg',
            type: ContentType.MOVIE,
            moodtag: 'happy',
          }),
        ]),
      );
      expect(mockMoviesService.fetchMoviesByMood).toHaveBeenCalledWith('happy');
    });

    it('should return 200 and content for valid music request with authentication', async () => {
      const mockMusic = [mockContentEntity(ContentType.MUSIC)];
      mockSpotifyService.fetchContentByMood.mockResolvedValue(mockMusic);

      const response = await request(app.getHttpServer())
        .get('/contents')
        .set('Authorization', `Bearer ${validToken}`)
        .query({ mood: 'happy', type: ContentType.MUSIC })
        .expect(200);

      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: 1,
            externalId: 'test-id',
            title: 'Test Content',
            description: 'Test Description',
            imageUrl: 'http://test.com/image.jpg',
            type: ContentType.MUSIC,
            moodtag: 'happy',
          }),
        ]),
      );
      expect(mockSpotifyService.fetchContentByMood).toHaveBeenCalledWith(
        'happy',
        expect.any(String),
      );
    });

    it('should return 200 and content for valid podcast request with authentication', async () => {
      const mockPodcasts = [mockContentEntity(ContentType.PODCAST)];
      mockSpotifyService.fetchContentByMood.mockResolvedValue(mockPodcasts);

      const response = await request(app.getHttpServer())
        .get('/contents')
        .set('Authorization', `Bearer ${validToken}`)
        .query({ mood: 'happy', type: ContentType.PODCAST })
        .expect(200);

      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: 1,
            externalId: 'test-id',
            title: 'Test Content',
            description: 'Test Description',
            imageUrl: 'http://test.com/image.jpg',
            type: ContentType.PODCAST,
            moodtag: 'happy',
          }),
        ]),
      );
      expect(mockSpotifyService.fetchContentByMood).toHaveBeenCalledWith(
        'happy',
        expect.any(String),
      );
    });

    it('should return 200 and content for valid book request with authentication', async () => {
      const mockBooks = [mockContentEntity(ContentType.BOOK)];
      mockBooksService.fetchBooksByMood.mockResolvedValue(mockBooks);

      const response = await request(app.getHttpServer())
        .get('/contents')
        .set('Authorization', `Bearer ${validToken}`)
        .query({ mood: 'happy', type: ContentType.BOOK })
        .expect(200);

      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: 1,
            externalId: 'test-id',
            title: 'Test Content',
            description: 'Test Description',
            imageUrl: 'http://test.com/image.jpg',
            type: ContentType.BOOK,
            moodtag: 'happy',
          }),
        ]),
      );
      expect(mockBooksService.fetchBooksByMood).toHaveBeenCalledWith('happy');
    });

    it('should return 401 for missing authentication', async () => {
      await request(app.getHttpServer())
        .get('/contents')
        .query({ mood: 'happy', type: ContentType.MOVIE })
        .expect(401);
    });

    it('should return 401 for invalid authentication token', async () => {
      await request(app.getHttpServer())
        .get('/contents')
        .set('Authorization', 'Bearer invalid-token')
        .query({ mood: 'happy', type: ContentType.MOVIE })
        .expect(401);
    });

    it('should return 400 for missing mood parameter with authentication', async () => {
      await request(app.getHttpServer())
        .get('/contents')
        .set('Authorization', `Bearer ${validToken}`)
        .query({ type: ContentType.MOVIE })
        .expect(400);
    });

    it('should return 400 for missing type parameter with authentication', async () => {
      await request(app.getHttpServer())
        .get('/contents')
        .set('Authorization', `Bearer ${validToken}`)
        .query({ mood: 'happy' })
        .expect(400);
    });

    it('should return 400 for invalid content type with authentication', async () => {
      await request(app.getHttpServer())
        .get('/contents')
        .set('Authorization', `Bearer ${validToken}`)
        .query({ mood: 'happy', type: 'INVALID' })
        .expect(400);
    });

    it('should return 500 when service throws error with authentication', async () => {
      mockMoviesService.fetchMoviesByMood.mockRejectedValue(
        new Error('Service error'),
      );

      await request(app.getHttpServer())
        .get('/contents')
        .set('Authorization', `Bearer ${validToken}`)
        .query({ mood: 'happy', type: ContentType.MOVIE })
        .expect(500);
    });
  });
});
