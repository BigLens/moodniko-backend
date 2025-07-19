import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { MoodService } from '@modules/mood/mood.service';
import { MoodDto } from '@modules/mood/dto/mood.dto';
import { JwtAuthGuard } from '@modules/auth/guards/jwt-auth.guard';

@Controller('moods')
@UseGuards(JwtAuthGuard)
export class MoodController {
  constructor(private moodService: MoodService) {}

  @Post('create-mood')
  async createMood(@Body() dto: MoodDto, @Request() req) {
    return this.moodService.createMood(dto, req.user);
  }

  @Get()
  async findAllMood(@Request() req) {
    return this.moodService.findAllMood(req.user);
  }

  @Get(':id')
  async findMoodById(@Param('id') id: number, @Request() req) {
    return this.moodService.findMoodById(id, req.user);
  }

  @Patch(':id')
  async updateMood(
    @Param('id') id: number,
    @Body() dto: MoodDto,
    @Request() req,
  ) {
    return this.moodService.updateMood(id, dto, req.user);
  }

  @Delete(':id')
  async deleteMood(@Param('id') id: number, @Request() req) {
    return this.moodService.deleteMood(id, req.user);
  }
}
