import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { SessionsService } from './sessions.service';

@Controller('sessions')
@UseGuards(JwtAuthGuard)
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Post()
  create(@Req() req: any, @Body() createSessionDto: CreateSessionDto) {
    const userId = req.user.sub;
    return this.sessionsService.create(userId, createSessionDto);
  }

  @Get()
  findAll(@Req() req: any, @Query() query: any) {
    // For now, trust the query params passed by the client
    return this.sessionsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sessionsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Req() req: any,
    @Param('id') id: string,
    @Body() updateSessionDto: UpdateSessionDto,
  ) {
    const userId = req.user.sub;
    return this.sessionsService.update(id, updateSessionDto, userId);
  }

  @Delete(':id')
  remove(@Req() req: any, @Param('id') id: string) {
    const userId = req.user.sub;
    return this.sessionsService.remove(id, userId);
  }
}
