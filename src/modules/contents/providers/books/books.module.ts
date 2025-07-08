import { Module } from '@nestjs/common';
import { BooksService } from '@modules/contents/providers/books/books.service';
import { HttpModule } from '@nestjs/axios';
import { BooksController } from '@modules/contents/providers/books/books.controller';

@Module({
  imports: [HttpModule],
  controllers: [BooksController],
  providers: [BooksService],
  exports: [BooksService],
})
export class BooksModule {}
