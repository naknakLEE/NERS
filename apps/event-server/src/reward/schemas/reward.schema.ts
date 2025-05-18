import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum RewardType {
  ITEM = 'ITEM',
  CURRENCY = 'CURRENCY',
  COUPON = 'COUPON',
}

export enum CurrencyType {
  MESO = 'MESO',
  MAPLE_POINT = 'MAPLE_POINT',
  PLAY_POINT = 'PLAY_POINT',
  MILEAGE = 'MILEAGE',
}

export interface ItemRewardDetails {
  itemCode: string;
  itemName?: string;
  quantity: number;
}

export interface CurrencyRewardDetails {
  currencyType: CurrencyType;
  amount: number;
}

export interface CouponRewardDetails {
  couponCode?: string;
  couponName: string;
  description?: string;
  discountRate?: number;
  discountAmount?: number;
  validTo?: Date;
}

export type RewardDocument = Reward & Document;

@Schema({ timestamps: true, collection: 'rewards' })
export class Reward {
  @Prop({ type: Types.ObjectId, ref: 'Event', required: true, index: true })
  eventId: Types.ObjectId;

  @Prop({ required: true, trim: true, type: String })
  name: string; // 보상 이름 (예: "매일 출석 보상 - 1000 포인트", "특별 접속 이벤트 - 레전드리 무기 상자")

  @Prop({ required: true, enum: RewardType, type: String })
  type: RewardType;

  @Prop({ type: Object, required: true })
  details:
    | ItemRewardDetails
    | CurrencyRewardDetails
    | CouponRewardDetails
    | Record<string, any>;

  @Prop({ required: true, type: Number, min: -1 }) // -1 is unlimited
  totalQuantity: number;

  @Prop({ required: true, type: Number, default: 0 })
  remainingQuantity: number;

  @Prop({ default: true, type: Boolean })
  isActive: boolean;

  @Prop({ type: Date })
  validTo?: Date;
}

export const RewardSchema = SchemaFactory.createForClass(Reward);

RewardSchema.index({ eventId: 1, type: 1 });

RewardSchema.pre<RewardDocument>('save', function (next) {
  if (this.isNew && this.totalQuantity !== -1 && this.remainingQuantity === 0) {
    this.remainingQuantity = this.totalQuantity;
  }
  next();
});
