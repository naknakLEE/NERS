import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { Event } from '../../domain/entites/event.entity';
import { EventDocument } from '../../schemas/event.schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class GetEventDetailUseCase {
  private readonly logger = new Logger(GetEventDetailUseCase.name);
  constructor(
    @InjectModel(Event.name) private eventModel: Model<EventDocument>,
  ) {}

  async execute(eventId: string) {
    const event = await this.eventModel.findById(eventId);
    if (!event) {
      throw new NotFoundException(`Event with ID ${eventId} not found`);
    }
    return event;
  }
}
