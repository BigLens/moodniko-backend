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
import {
  MoodApiTags,
  CreateMoodDocs,
  GetAllMoodsDocs,
  GetMoodByIdDocs,
  UpdateMoodDocs,
  DeleteMoodDocs,
} from './docs/mood.docs';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('moods')
@UseGuards(JwtAuthGuard)
@MoodApiTags()
@ApiBearerAuth('JWT-auth')
export class MoodController {
  constructor(private moodService: MoodService) {}

  @Post('create-mood')
  @CreateMoodDocs()
  async createMood(@Body() dto: MoodDto, @Request() req) {
    return this.moodService.createMood(dto, req.user);
  }

  @Get()
  @GetAllMoodsDocs()
  async findAllMood(@Request() req) {
    return this.moodService.findAllMood(req.user);
  }

  @Get(':id')
  @GetMoodByIdDocs()
  async findMoodById(@Param('id') id: number, @Request() req) {
    return this.moodService.findMoodById(id, req.user);
  }

  @Patch(':id')
  @UpdateMoodDocs()
  async updateMood(
    @Param('id') id: number,
    @Body() dto: MoodDto,
    @Request() req,
  ) {
    return this.moodService.updateMood(id, dto, req.user);
  }

  @Delete(':id')
  @DeleteMoodDocs()
  async deleteMood(@Param('id') id: number, @Request() req) {
    return this.moodService.deleteMood(id, req.user);
  }
}
