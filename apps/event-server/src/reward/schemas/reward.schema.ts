import { CurrencyType, RewardType } from '@app/constants';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export interface ItemRewardDetails {
  itemCode: string;
  itemName?: string;
  quantity: number;
}

export interface CurrencyRewardDetails {
  currencyType: CurrencyType;
  amount: number;
}

export type RewardDocument = Reward & Document;

@Schema({ timestamps: true, collection: 'rewards' })
export class Reward {
  @Prop({ type: String, default: () => new Types.ObjectId() })
  _id: string;

  @Prop({ type: Types.ObjectId, ref: 'Event', required: true, index: true })
  eventId: Types.ObjectId;

  @Prop({ required: true, trim: true, type: String })
  name: string;

  @Prop({ required: true, enum: RewardType, type: String })
  type: RewardType;

  @Prop({ type: Object, required: true })
  details: ItemRewardDetails | CurrencyRewardDetails | Record<string, any>;

  @Prop({ default: true, type: Boolean })
  isActive: boolean;

  @Prop({ type: Date })
  validTo?: Date;
}

export const RewardSchema = SchemaFactory.createForClass(Reward);

RewardSchema.index({ eventId: 1, type: 1 });
