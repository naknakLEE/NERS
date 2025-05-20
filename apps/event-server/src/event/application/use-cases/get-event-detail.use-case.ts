import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { Event } from '../../domain/entites/event.entity';
import { EventDocument } from '../../schemas/event.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Reward } from '../../../reward/domain/entites/reward.entity';
import { RewardDocument } from '../../../reward/schemas/reward.schema';
import { EventStatusVO } from '../../domain/value-objects/event-status.vo';
import {
  ConditionDetail,
  EventConditionsVO,
} from '../../domain/value-objects/event-conditions.vo';
import { RewardTypeVO } from '../../../reward/domain/value-objects/reward-type.vo';
import {
  RewardDetail,
  RewardDetailsVO,
} from '../../../reward/domain/value-objects/reward-details.vo';
@Injectable()
export class GetEventDetailUseCase {
  private readonly logger = new Logger(GetEventDetailUseCase.name);
  constructor(
    @InjectModel(Event.name) private eventModel: Model<EventDocument>,
    @InjectModel(Reward.name) private rewardModel: Model<RewardDocument>,
  ) {}

  async execute(eventId: string) {
    const event = await this.eventModel.findById(eventId);
    if (!event) {
      throw new NotFoundException(`Event with ID ${eventId} not found`);
    }

    const eventEntity = Event.createNew({
      id: event._id.toString(),
      name: event.name,
      description: event.description,
      startDate: event.startDate,
      endDate: event.endDate,
      status: EventStatusVO.fromEnum(event.status),
      conditions: EventConditionsVO.create(
        event.conditions as ConditionDetail[],
      ),
      createdBy: event.createdBy.toString(),
    });

    const reward = await this.rewardModel.findOne({ eventId: eventId });
    if (reward) {
      const rewardEntity = Reward.createNew({
        id: reward._id.toString(),
        eventId: reward.eventId.toString(),
        name: reward.name,
        type: RewardTypeVO.fromEnum(reward.type),
        details: RewardDetailsVO.create(reward.details as RewardDetail),
        isActive: reward.isActive,
        validTo: reward?.validTo,
      });
      return {
        ...eventEntity.toJson(),
        rewards: rewardEntity.toJson(),
      };
    }

    return eventEntity.toJson();
  }
}
