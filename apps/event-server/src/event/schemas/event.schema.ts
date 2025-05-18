import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type EventDocument = HydratedDocument<Event>;

export enum EventStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  COMPLETED = 'completed',
}

@Schema({ timestamps: true, toJSON: { virtuals: true } })
export class Event {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;

  @Prop({ required: true, enum: EventStatus })
  status: EventStatus;

  @Prop({ required: true, type: Object })
  conditions: object;

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  createdBy: Types.ObjectId;
}

export const EventSchema = SchemaFactory.createForClass(Event);
