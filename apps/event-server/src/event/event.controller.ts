import {
  Controller,
  Post,
  Body,
  Param,
  Logger,
  Get,
  Query,
} from '@nestjs/common';
import { ApiConsumes } from '@nestjs/swagger';
import { CreateEventDto } from '@app/dto/event/create-event.dto';
import {
  UserFromHeader,
  GetUserFromHeader,
} from '../common/get-user-from-header.decorator';
import { Role } from '@app/constants';
import { GetEventsDto } from '@app/dto/event/get-events.dto';
import { CreateEventUseCase } from './application/use-cases/create-event.use-case';
import { GetAllEventUseCase } from './application/use-cases/get-all-event.use-cast';
import { GetEventDetailUseCase } from './application/use-cases/get-event-detail.use-case';
@Controller()
export class EventController {
  private readonly logger = new Logger(EventController.name);
  constructor(
    private readonly createEventUseCase: CreateEventUseCase,
    private readonly getAllEventUseCase: GetAllEventUseCase,
    private readonly getEventDetailUseCase: GetEventDetailUseCase,
  ) {}

  @Post()
  @ApiConsumes('application/json')
  createEvent(
    @Body() createEventDto: CreateEventDto,
    @GetUserFromHeader() user: UserFromHeader,
  ) {
    return this.createEventUseCase.execute(createEventDto, user);
  }

  // GET /events: 이벤트 목록 조회
  @Get()
  getEvents(@Query() getEventsDto: GetEventsDto) {
    return this.getAllEventUseCase.execute(getEventsDto);
  }

  // GET /events/:eventId: 이벤트 상세 조회
  @Get(':eventId')
  getEventById(@Param('eventId') eventId: string) {
    return this.getEventDetailUseCase.execute(eventId);
  }
}
