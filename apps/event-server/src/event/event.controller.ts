import { Controller, Post, Body, Patch, Param } from '@nestjs/common';
import { ApiConsumes } from '@nestjs/swagger';
import { EventService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';

@Controller()
export class EventController {
  constructor(private readonly eventService: EventService) {}

  // POST /events: 이벤트 생성
  @Post()
  @ApiConsumes('application/x-www-form-urlencoded', 'application/json')
  createEvent(@Body() createEventDto: CreateEventDto) {
    return this.eventService.createEvent(createEventDto);
  }

  // GET /events: 이벤트 목록 조회

  // GET /events/:eventId: 이벤트 상세 조회

  // PATCH /events/:eventId: 이벤트 수정
}
