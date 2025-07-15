import { Controller, Get, Query } from '@nestjs/common';
import { BooksService } from '@modules/contents/providers/books/books.service';
import { ApiGetBooksByMood } from '@modules/contents/providers/books/docs/book-docs';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get('mood')
  @ApiGetBooksByMood()
  async getBooksByMood(@Query('mood') mood: string) {
    return this.booksService.fetchBooksByMood(mood);
  }
}
