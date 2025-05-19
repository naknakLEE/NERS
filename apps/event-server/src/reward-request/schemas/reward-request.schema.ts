import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Event } from '../../event/schemas/event.schema';
import { Reward } from '../../reward/schemas/reward.schema';
import { User } from 'apps/auth-server/src/account/infrastructure/repositories/schemas/user.schema';

export enum RewardRequestStatus {
  APPROVED = 'APPROVED', // 조건 충족, 보상 지급 승인됨
  REJECTED_CONDITION = 'REJECTED_CONDITION',
  REJECTED_DUPLICATE = 'REJECTED_DUPLICATE',
  REJECTED_EVENT_INACTIVE = 'REJECTED_EVENT_INACTIVE',
  REJECTED_NO_REWARD = 'REJECTED_NO_REWARD',
  FAILED_SERVER_ERROR = 'FAILED_SERVER_ERROR',
}

export type RewardRequestDocument = RewardRequest & Document;

@Schema({ timestamps: true })
export class RewardRequest {
  @Prop({ type: String, default: () => new Types.ObjectId() })
  _id: string;

  @Prop({ type: Types.ObjectId, ref: User.name, required: true, index: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: Event.name, required: true, index: true })
  eventId: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: Reward.name,
    required: true,
    index: true,
  })
  rewardId: Types.ObjectId;

  @Prop({
    type: String,
    enum: Object.values(RewardRequestStatus),
    index: true,
  })
  status: RewardRequestStatus;

  @Prop({ type: Date, default: Date.now }) // 요청이 시스템에 기록된 시간
  requestedAt: Date;

  @Prop({ type: Date, required: false }) // 요청이 최종 처리된 시간 (승인, 거절 등)
  processedAt?: Date;

  @Prop({ type: Date, required: false }) // 사용자가 보상을 실제로 수령한 시간
  claimedAt?: Date;
}

export const RewardRequestSchema = SchemaFactory.createForClass(RewardRequest);

RewardRequestSchema.index({ userId: 1, eventId: 1 });
