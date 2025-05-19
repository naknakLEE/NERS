import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Req,
  Res,
  Logger,
  Get,
  Query,
} from '@nestjs/common';
import { ApiConsumes } from '@nestjs/swagger';
import { EventService } from './event.service';
import { CreateEventDto } from '@app/dto/event/create-event.dto';
import {
  UserFromHeader,
  GetUserFromHeader,
} from '../common/get-user-from-header.decorator';
import { Role } from '@app/constants';
import { GetEventsDto } from '@app/dto/event/get-events.dto';
import { CreateEventUseCase } from './application/use-cases/create-event.use-case';

@Controller()
export class EventController {
  private readonly logger = new Logger(EventController.name);
  constructor(
    private readonly eventService: EventService,
    private readonly createEventUseCase: CreateEventUseCase,
  ) {}

  @Post()
  @ApiConsumes('application/json')
  createEvent(@Body() createEventDto: CreateEventDto) {
    const user = {
      userId: '1',
      role: Role.ADMIN,
      username: 'test',
    };
    return this.createEventUseCase.execute(createEventDto, user);
  }

  // GET /events: 이벤트 목록 조회
  @Get()
  getEvents(@Query() getEventsDto: GetEventsDto) {
    return this.eventService.getEvents(getEventsDto);
  }

  // GET /events/:eventId: 이벤트 상세 조회
  @Get(':eventId')
  getEventById(@Param('eventId') eventId: string) {
    return this.eventService.getEventById(eventId);
  }

  // PATCH /events/:eventId: 이벤트 수정
}
