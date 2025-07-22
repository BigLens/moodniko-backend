import { Controller, Get, Put, Body, Request, UseGuards } from '@nestjs/common';
import { UserPreferencesService } from './user-preferences.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('user/preferences')
export class UserPreferencesController {
  constructor(private readonly prefsService: UserPreferencesService) {}

  @Get()
  async getPreferences(@Request() req) {
    return this.prefsService.findByUserId(req.user.userId);
  }

  @Put()
  async updatePreferences(@Request() req, @Body() body) {
    return this.prefsService.createOrUpdate(req.user.userId, body);
  }
}
