import { Model } from 'mongoose';
import {
  ConflictException,
  NotFoundException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Reward } from '../../domain/entites/reward.entity';
import { RewardDocument } from '../../schemas/reward.schema';
import { CreateRewardDto } from '@app/dto/event/create-reward.dto';
import { UserFromHeader } from '../../../common/get-user-from-header.decorator';
import { RewardTypeVO } from '../../domain/value-objects/reward-type.vo';
import {
  RewardDetail,
  RewardDetailsVO,
} from '../../domain/value-objects/reward-details.vo';
import { Event } from '../../../event/domain/entites/event.entity';
import { EventDocument } from '../../../event/schemas/event.schema';
@Injectable()
export class CreateRewardUseCase {
  private readonly logger = new Logger(CreateRewardUseCase.name);
  constructor(
    @InjectModel(Reward.name) private rewardModel: Model<RewardDocument>,
    @InjectModel(Event.name) private eventModel: Model<EventDocument>,
  ) {}

  async execute(createRewardDto: CreateRewardDto, user: UserFromHeader) {
    const event = await this.eventModel.findById(createRewardDto.eventId);
    if (!event) {
      throw new NotFoundException(
        `Event with ID ${createRewardDto.eventId} not found`,
      );
    }

    const reward = await this.rewardModel.findOne({
      eventId: createRewardDto.eventId,
    });
    if (reward) {
      throw new ConflictException(
        `Reward with name ${createRewardDto.name} already exists`,
      );
    }
    const rewardEntity = Reward.createNew({
      eventId: createRewardDto.eventId,
      name: createRewardDto.name,
      type: RewardTypeVO.fromEnum(createRewardDto.type),
      details: RewardDetailsVO.create(createRewardDto.details as RewardDetail),
      isActive: true,
    });
    const newReward = new this.rewardModel(rewardEntity.toJson());
    return newReward.save();
  }
}
