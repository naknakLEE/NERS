import { Injectable, Logger } from '@nestjs/common';
import { Model } from 'mongoose';
import { Event } from '../../domain/entites/event.entity';
import { EventDocument } from '../../schemas/event.schema';
import { GetEventsDto } from '@app/dto/event/get-events.dto';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class GetAllEventUseCase {
  private readonly logger = new Logger(GetAllEventUseCase.name);
  constructor(
    @InjectModel(Event.name) private eventModel: Model<EventDocument>,
  ) {}

  async execute(getEventsDto: GetEventsDto) {
    const { page, pageSize } = getEventsDto;
    const events = await this.eventModel
      .find()
      .skip((page - 1) * pageSize)
      .limit(pageSize);
    return events;
  }
}
