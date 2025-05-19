import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { EventStatusEnum } from '../domain/value-objects/event-status.vo';

export type EventDocument = HydratedDocument<Event>;

@Schema({ timestamps: true, toJSON: { virtuals: true } })
export class Event {
  @Prop({ type: String, default: () => new Types.ObjectId() })
  _id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;

  @Prop({ required: true, enum: EventStatusEnum, type: String })
  status: EventStatusEnum;

  @Prop({ required: true, type: Object })
  conditions: object;

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  createdBy: Types.ObjectId;
}

export const EventSchema = SchemaFactory.createForClass(Event);
