import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EventDocument } from './schemas/event.schema';
import { CreateEventDto } from '@app/dto/event/create-event.dto';
import { UserFromHeader } from '../common/get-user-from-header.decorator';
import { GetEventsDto } from '@app/dto/event/get-events.dto';

@Injectable()
export class EventService {
  private readonly logger = new Logger(EventService.name);
  constructor(
    @InjectModel(Event.name) private eventModel: Model<EventDocument>,
  ) {}

  async createEvent(createEventDto: CreateEventDto, user: UserFromHeader) {
    const newEvent = new this.eventModel({
      ...createEventDto,
      createdBy: user.userId,
    });
    try {
      const savedEvent = await newEvent.save();
      return savedEvent;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('Failed to create event.');
    }
  }
  async getEvents(getEventsDto: GetEventsDto) {
    const { page, pageSize } = getEventsDto;
    const events = await this.eventModel
      .find()
      .skip((page - 1) * pageSize)
      .limit(pageSize);
    return events;
  }

  async getEventById(eventId: string) {
    const event = await this.eventModel.findById(eventId);
    if (!event) {
      throw new NotFoundException(`Event with ID ${eventId} not found`);
    }
    return event;
  }
}
