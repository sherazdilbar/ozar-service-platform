import { Controller, Get, Post, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateConversationDto, SendMessageDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('chat')
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Get('conversations')
  async getConversations(@Req() req) {
    const conversations = await this.chatService.getConversations(req.user.userId);
    return { data: conversations };
  }

  @Post('conversations')
  createConversation(@Req() req, @Body() dto: CreateConversationDto) {
    return this.chatService.createConversation(req.user.userId, dto);
  }

  @Get('conversations/:id')
  getConversation(@Param('id') id: string, @Req() req) {
    return this.chatService.getConversation(id, req.user.userId);
  }

  @Get('conversations/:id/messages')
  getMessages(
    @Param('id') id: string,
    @Req() req,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.chatService.getMessages(id, req.user.userId, page, limit);
  }

  @Post('conversations/:id/messages')
  sendMessage(
    @Param('id') id: string,
    @Req() req,
    @Body() dto: SendMessageDto,
  ) {
    return this.chatService.sendMessage(id, req.user.userId, dto);
  }

  @Post('conversations/:id/read')
  markAsRead(@Param('id') id: string, @Req() req) {
    return this.chatService.markAsRead(id, req.user.userId);
  }
}
