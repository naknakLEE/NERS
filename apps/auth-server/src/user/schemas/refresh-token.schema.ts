// src/auth/schemas/refresh-token.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type RefreshTokenDocument = RefreshToken & Document;

@Schema({ timestamps: true })
export class RefreshToken {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true, type: String, unique: true })
  token: string;

  @Prop({ required: true, type: Date })
  expiresAt: Date;

  @Prop({ default: false, type: Boolean })
  isRevoked: boolean;
}

export const RefreshTokenSchema = SchemaFactory.createForClass(RefreshToken);
