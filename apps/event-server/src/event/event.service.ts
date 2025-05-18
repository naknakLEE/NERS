import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EventDocument } from './schemas/event.schema';

@Injectable()
export class EventService {
  private readonly logger = new Logger(EventService.name);
  constructor(
    @InjectModel(Event.name) private eventModel: Model<EventDocument>,
  ) {}

  async createEvent(createEventDto: CreateEventDto) {
    const newEvent = new this.eventModel(createEventDto);
    try {
      const savedEvent = await newEvent.save();
      return savedEvent;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('Failed to create event.');
    }
  }
}
