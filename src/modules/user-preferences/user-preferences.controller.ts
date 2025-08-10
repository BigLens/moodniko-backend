import {
  Controller,
  Get,
  Put,
  Post,
  Delete,
  Body,
  Request,
  UseGuards,
  Param,
  Query,
} from '@nestjs/common';
import { UserPreferencesService } from './user-preferences.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  UserPreferencesApiTags,
  GetUserPreferencesDocs,
  UpdateUserPreferencesDocs,
} from './docs/user-preferences.docs';
import {
  GetMoodPreferencesDocs,
  UpdateMoodPreferencesDocs,
  CreateCustomMoodCategoryDocs,
  DeleteCustomMoodCategoryDocs,
  GetContentRecommendationsForMoodDocs,
  ResetMoodPreferencesDocs,
} from './docs/mood-preferences.docs';
import { ApiBearerAuth } from '@nestjs/swagger';
import {
  UpdateMoodPreferencesDto,
  CreateMoodCategoryDto,
  MoodIntensityRequestDto,
} from './dto/mood-preference.dto';

@UseGuards(JwtAuthGuard)
@Controller('user/preferences')
@UserPreferencesApiTags()
@ApiBearerAuth('JWT-auth')
export class UserPreferencesController {
  constructor(private readonly prefsService: UserPreferencesService) {}

  // Existing basic preference endpoints
  @Get()
  @GetUserPreferencesDocs()
  async getPreferences(@Request() req) {
    return this.prefsService.findByUserId(req.user.userId);
  }

  @Put()
  @UpdateUserPreferencesDocs()
  async updatePreferences(@Request() req, @Body() body) {
    return this.prefsService.createOrUpdate(req.user.userId, body);
  }

  // New mood-specific preference endpoints
  @Get('mood')
  @GetMoodPreferencesDocs()
  async getMoodPreferences(@Request() req, @Query('mood') mood?: string) {
    return this.prefsService.getMoodPreferences(req.user.userId, mood);
  }

  @Put('mood')
  @UpdateMoodPreferencesDocs()
  async updateMoodPreferences(
    @Request() req,
    @Body() moodPreferencesDto: UpdateMoodPreferencesDto,
  ) {
    return this.prefsService.updateMoodPreferences(
      req.user.userId,
      moodPreferencesDto,
    );
  }

  @Post('mood/categories')
  @CreateCustomMoodCategoryDocs()
  async createCustomMoodCategory(
    @Request() req,
    @Body() categoryDto: CreateMoodCategoryDto,
  ) {
    return this.prefsService.createCustomMoodCategory(
      req.user.userId,
      categoryDto,
    );
  }

  @Delete('mood/categories/:categoryName')
  @DeleteCustomMoodCategoryDocs()
  async deleteCustomMoodCategory(
    @Request() req,
    @Param('categoryName') categoryName: string,
  ) {
    return this.prefsService.deleteCustomMoodCategory(
      req.user.userId,
      categoryName,
    );
  }

  @Post('mood/recommendations')
  @GetContentRecommendationsForMoodDocs()
  async getContentRecommendationsForMood(
    @Request() req,
    @Body() moodIntensityRequest: MoodIntensityRequestDto,
  ) {
    return this.prefsService.getContentRecommendationsForMood(
      req.user.userId,
      moodIntensityRequest,
    );
  }

  @Delete('mood/reset')
  @ResetMoodPreferencesDocs()
  async resetMoodPreferences(@Request() req, @Query('mood') mood?: string) {
    return this.prefsService.resetMoodPreferences(req.user.userId, mood);
  }
}
