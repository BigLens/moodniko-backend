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

describe('ContentsController (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;

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
    it('should return 200 and content for valid movie request', async () => {
      const mockMovies = [mockContentEntity(ContentType.MOVIE)];
      mockMoviesService.fetchMoviesByMood.mockResolvedValue(mockMovies);

      const response = await request(app.getHttpServer())
        .get('/contents')
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

    it('should return 200 and content for valid music request', async () => {
      const mockMusic = [mockContentEntity(ContentType.MUSIC)];
      mockSpotifyService.fetchContentByMood.mockResolvedValue(mockMusic);

      const response = await request(app.getHttpServer())
        .get('/contents')
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

    it('should return 200 and content for valid podcast request', async () => {
      const mockPodcasts = [mockContentEntity(ContentType.PODCAST)];
      mockSpotifyService.fetchContentByMood.mockResolvedValue(mockPodcasts);

      const response = await request(app.getHttpServer())
        .get('/contents')
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

    it('should return 200 and content for valid book request', async () => {
      const mockBooks = [mockContentEntity(ContentType.BOOK)];
      mockBooksService.fetchBooksByMood.mockResolvedValue(mockBooks);

      const response = await request(app.getHttpServer())
        .get('/contents')
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

    it('should return 400 for missing mood parameter', async () => {
      await request(app.getHttpServer())
        .get('/contents')
        .query({ type: ContentType.MOVIE })
        .expect(400);
    });

    it('should return 400 for missing type parameter', async () => {
      await request(app.getHttpServer())
        .get('/contents')
        .query({ mood: 'happy' })
        .expect(400);
    });

    it('should return 400 for invalid content type', async () => {
      await request(app.getHttpServer())
        .get('/contents')
        .query({ mood: 'happy', type: 'INVALID' })
        .expect(400);
    });

    it('should return 500 when service throws error', async () => {
      mockMoviesService.fetchMoviesByMood.mockRejectedValue(
        new Error('Service error'),
      );

      await request(app.getHttpServer())
        .get('/contents')
        .query({ mood: 'happy', type: ContentType.MOVIE })
        .expect(500);
    });

    it('should return empty array when no content is found', async () => {
      mockMoviesService.fetchMoviesByMood.mockResolvedValue([]);

      const response = await request(app.getHttpServer())
        .get('/contents')
        .query({ mood: 'happy', type: ContentType.MOVIE })
        .expect(200);

      expect(response.body).toEqual([]);
    });

    it('should validate response matches ContentEntity shape', async () => {
      const mockMovie = mockContentEntity(ContentType.MOVIE);
      mockMoviesService.fetchMoviesByMood.mockResolvedValue([mockMovie]);

      const response = await request(app.getHttpServer())
        .get('/contents')
        .query({ mood: 'happy', type: ContentType.MOVIE })
        .expect(200);

      const content = response.body[0];
      expect(content).toHaveProperty('id');
      expect(content).toHaveProperty('externalId');
      expect(content).toHaveProperty('title');
      expect(content).toHaveProperty('description');
      expect(content).toHaveProperty('imageUrl');
      expect(content).toHaveProperty('type');
      expect(content).toHaveProperty('moodtag');
      expect(content).toHaveProperty('createdAt');
      expect(content).toHaveProperty('updatedAt');
    });
  });
});
