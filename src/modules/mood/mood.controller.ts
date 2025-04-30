import { Controller, Post, Get, Body, Param, Patch, Delete } from '@nestjs/common';
import { MoodService } from '@modules/mood/mood.service';
import { MoodDto } from '@modules/mood/dto/mood.dto';

@Controller('moods')
export class MoodController {
  constructor(private moodService: MoodService) {}

  @Post('create-mood')
  async createMood(@Body() dto: MoodDto) {
    return this.moodService.createMood(dto);
  }

  @Get()
  async findAllMood() {
    return this.moodService.findAllMood();
  }

  @Get(':id')
  async findMoodById(@Param('id') id: number) {
    return this.moodService.findMoodById(id);
  }

  @Patch(':id')
  async updateMood(@Param('id') id: number, @Body() dto: MoodDto) {
    return this.moodService.updateMood(id, dto);
  }

  @Delete(':id')
  async deleteMood(@Param('id') id: number) {
    return this.moodService.deleteMood(id);
  }
}
