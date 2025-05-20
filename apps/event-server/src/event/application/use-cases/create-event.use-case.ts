import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Event } from '../../domain/entites/event.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { EventDocument } from '../../schemas/event.schema';
import {
  CreateEventDto,
  EventConditionDto,
} from '@app/dto/event/create-event.dto';
import { UserFromHeader } from '../../../common/get-user-from-header.decorator';
import {
  ConditionDetail,
  EventConditionsVO,
} from '../../domain/value-objects/event-conditions.vo';
import { Logger } from '@nestjs/common';
import { EventStatusVO } from '../../domain/value-objects/event-status.vo';
@Injectable()
export class CreateEventUseCase {
  private readonly logger = new Logger(CreateEventUseCase.name);
  constructor(
    @InjectModel(Event.name) private eventModel: Model<EventDocument>,
  ) {}

  private mapEventConditionDtosToDetails(
    dtos: EventConditionDto[],
  ): ConditionDetail[] {
    return dtos.map((dto) => dto as ConditionDetail);
  }

  async execute(createEventDto: CreateEventDto, user: UserFromHeader) {
    const event = Event.createNew({
      name: createEventDto.name,
      description: createEventDto.description,
      startDate: createEventDto.startDate,
      endDate: createEventDto.endDate,
      status: EventStatusVO.fromEnum(createEventDto.status),
      conditions: EventConditionsVO.create(
        this.mapEventConditionDtosToDetails(createEventDto.conditions),
      ),
      createdBy: user.userId,
    });
    const newEvent = new this.eventModel({
      name: event.name,
      description: event.description,
      startDate: event.startDate,
      endDate: event.endDate,
      status: event.status,
      conditions: event.conditions.values,
      createdBy: event.createdBy,
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
