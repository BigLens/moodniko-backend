import { Controller, Get, Query } from '@nestjs/common';
import { BooksService } from './books.service';
import { ContentEntity } from '@modules/contents/model/content.entity';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get()
  async getBooksByMood(@Query('mood') mood: string): Promise<ContentEntity[]> {
    return this.booksService.fetchBooksByMood(mood);
  }
}
