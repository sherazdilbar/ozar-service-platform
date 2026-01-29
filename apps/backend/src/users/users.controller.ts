import {
  Controller,
  Get,
  Put,
  Body,
  UseGuards,
  Request,
  Post,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UsersService } from './users.service';
import { UploadService } from '../upload/upload.service';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly uploadService: UploadService,
  ) {}

  @Get('me')
  async getProfile(@Request() req) {
    return this.usersService.findById(req.user.userId);
  }

  @Put('me')
  async updateProfile(
    @Request() req,
    @Body() data: { firstName?: string; lastName?: string; phone?: string; bio?: string; avatar?: string },
  ) {
    return this.usersService.updateProfile(req.user.userId, data);
  }

  @Post('me/avatar')
  @UseInterceptors(FileInterceptor('file'))
  async uploadAvatar(@Request() req, @UploadedFile() file: Express.Multer.File) {
    const avatarUrl = await this.uploadService.uploadImage(file);
    const user = await this.usersService.updateAvatar(req.user.userId, avatarUrl);
    return { user, avatarUrl };
  }
}
