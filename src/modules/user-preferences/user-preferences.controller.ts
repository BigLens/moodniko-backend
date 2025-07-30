import { Controller, Get, Put, Body, Request, UseGuards } from '@nestjs/common';
import { UserPreferencesService } from './user-preferences.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  UserPreferencesApiTags,
  GetUserPreferencesDocs,
  UpdateUserPreferencesDocs,
} from './docs/user-preferences.docs';
import { ApiBearerAuth } from '@nestjs/swagger';

@UseGuards(JwtAuthGuard)
@Controller('user/preferences')
@UserPreferencesApiTags()
@ApiBearerAuth('JWT-auth')
export class UserPreferencesController {
  constructor(private readonly prefsService: UserPreferencesService) {}

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
}
