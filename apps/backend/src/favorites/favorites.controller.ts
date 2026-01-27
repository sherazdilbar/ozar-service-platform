import { Controller, Get, Post, Delete, Param, UseGuards, Req } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('favorites')
@UseGuards(JwtAuthGuard)
export class FavoritesController {
  constructor(private favoritesService: FavoritesService) {}

  @Get()
  getFavorites(@Req() req) {
    return this.favoritesService.getFavorites(req.user.userId);
  }

  @Post(':proId')
  addFavorite(@Param('proId') proId: string, @Req() req) {
    return this.favoritesService.addFavorite(req.user.userId, proId);
  }

  @Delete(':proId')
  removeFavorite(@Param('proId') proId: string, @Req() req) {
    return this.favoritesService.removeFavorite(req.user.userId, proId);
  }

  @Get('check/:proId')
  isFavorite(@Param('proId') proId: string, @Req() req) {
    return this.favoritesService.isFavorite(req.user.userId, proId);
  }
}
