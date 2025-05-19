import { Controller, Get, Query } from '@nestjs/common';
import { BooksService } from './books.service';
import { ApiGetBooksByMood } from './docs/book-docs';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get('mood')
  @ApiGetBooksByMood()
  async getBooksByMood(@Query('mood') mood: string) {
    return this.booksService.fetchBooksByMood(mood);
  }
}
