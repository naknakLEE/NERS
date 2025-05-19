import { GetRewardHistoryDto } from '@app/dto/event/get-reward-history.dto';
import { RewardRequestDto } from '@app/dto/event/reward-request.dto';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import {
  RewardRequest,
  RewardRequestDocument,
} from './schemas/reward-request.schema';
import { FilterQuery } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserFromHeader } from '../common/get-user-from-header.decorator';
import { Reward } from '../reward/schemas/reward.schema';
import { RewardDocument } from '../reward/schemas/reward.schema';
import { EventDocument } from '../event/schemas/event.schema';
import { EventConditionType } from '@app/dto/event/condition/condition-type.enum';

interface MockUserActivityData {
  loginStreak?: number;
  level?: number;
  completedQuests?: string[];
  invitedFriends?: number;
  items?: { [itemId: string]: number };
  actionCounts?: { [actionId: string]: number };
}

@Injectable()
export class RewardRequestService {
  private readonly logger = new Logger(RewardRequestService.name);

  constructor(
    @InjectModel(RewardRequest.name)
    private rewardRequestModel: Model<RewardRequestDocument>,
    @InjectModel(Reward.name)
    private rewardModel: Model<RewardDocument>,
    @InjectModel(Event.name)
    private eventModel: Model<EventDocument>,
  ) {}

  async requestReward(dto: RewardRequestDto, user: UserFromHeader) {
    const { userId } = user;
    const { eventId } = dto;

    const event = await this.eventModel.findById(eventId);
    if (!event) {
      throw new NotFoundException(`Event with ID ${eventId} not found`);
    }

    const existingQuery: FilterQuery<RewardRequestDocument> = {
      userId,
      eventId,
      status: { $in: ['APPROVED', 'CLAIMED'] },
    };

    const existingRequest =
      await this.rewardRequestModel.findOne(existingQuery);

    if (existingRequest) {
      this.logger.warn(
        `Duplicate reward request attempt: User ${userId}, Event ${eventId}`,
      );

      throw new ConflictException(
        'Reward has already been claimed or requested for this event.',
      );
    }

    const reward = await this.rewardModel.findOne({ eventId });
    if (!reward) {
      throw new BadRequestException('Event not found.');
    }

    const meetsConditions = await this.checkEventConditions(userId, event);
    if (!meetsConditions) {
      const newRequestDoc = new this.rewardRequestModel({
        userId,
        eventId,
        rewardId: reward._id,
        status: 'REJECTED_CONDITION',
      });
      await newRequestDoc.save();
      throw new BadRequestException('Conditions for the reward are not met.');
    }

    const newRequestDoc = new this.rewardRequestModel({
      userId,
      eventId,
      rewardId: reward._id,
      status: 'APPROVED',
      claimedAt: new Date(),
    });

    try {
      await newRequestDoc.save();
      return newRequestDoc;
    } catch (dbError) {
      this.logger.error(
        `Error saving reward request: ${dbError.message}`,
        dbError.stack,
      );
      throw new InternalServerErrorException(
        'Failed to process reward request due to a server error.',
      );
    }
  }

  async checkEventConditions(
    userId: string,
    event: EventDocument,
  ): Promise<{ metConditions: boolean }> {
    if (
      !event.conditions ||
      (Array.isArray(event.conditions) && event.conditions.length === 0) ||
      Object.keys(event.conditions).length === 0
    ) {
      this.logger.log(
        `Event ${event._id} has no specific conditions. Assuming met.`,
      );
      return {
        metConditions: true,
      };
    }

    const userActivityData = await this.getMockUserActivityData(userId, event);

    let allConditionsMet = true;
    const conditionsToCheck = Array.isArray(event.conditions)
      ? event.conditions
      : [event.conditions];

    for (const condition of conditionsToCheck) {
      if (!condition.type) {
        this.logger.warn(
          `Condition for event ${event._id} is missing a 'type'. Skipping.`,
        );
        continue;
      }

      let conditionMetThisIteration = false;
      switch (condition.type) {
        case 'LOGIN_STREAK':
          conditionMetThisIteration =
            (userActivityData.loginStreak || 0) >= (condition.days || 1);

          break;
        case 'USER_LEVEL':
          conditionMetThisIteration =
            (userActivityData.level || 0) >= (condition.requiredLevel || 1);

          break;
        case 'QUEST_COMPLETED':
          conditionMetThisIteration = (
            userActivityData.completedQuests || []
          ).includes(condition.questId);

          break;
        case 'FRIEND_INVITATION':
          conditionMetThisIteration =
            (userActivityData.invitedFriends || 0) >= (condition.count || 1);

          break;

        default:
          this.logger.warn(
            `Unknown condition type: ${condition.type} for event ${event._id}`,
          );
          conditionMetThisIteration = false;
      }

      if (!conditionMetThisIteration) {
        allConditionsMet = false;
        break;
      }
    }

    return { metConditions: allConditionsMet };
  }

  private async getMockUserActivityData(
    userId: string,
    event: EventDocument,
  ): Promise<MockUserActivityData> {
    this.logger.debug(
      `Fetching MOCK user activity data for User: ${userId}, Event: ${event.name}`,
    );
    if (userId === 'user_met_all_conditions') {
      return {
        loginStreak: 10,
        level: 150,
        completedQuests: ['maple_world_savior_quest', 'another_quest'],
        invitedFriends: 5,
        items: { star_candy: 20 },
        actionCounts: { MONSTER_KILL: 150 },
      };
    } else if (userId === 'user_low_level') {
      return { level: 10 };
    }
    return {
      loginStreak: Math.floor(Math.random() * 10),
      level: Math.floor(Math.random() * 200),
      completedQuests: Math.random() > 0.5 ? ['some_quest'] : [],
    };
  }

  async getUserRewardRequestHistory(request: GetRewardHistoryDto) {
    return this.rewardRequestModel.find(request);
  }
}
