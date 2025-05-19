import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EventDocument } from './schemas/event.schema';
import { CreateEventDto } from '@app/dto/event/create-event.dto';
import { UserFromHeader } from '../common/get-user-from-header.decorator';

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
}
