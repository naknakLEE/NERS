import { IsEnum, IsNotEmpty } from 'class-validator';
import { EventConditionType } from './condition-type.enum';

export abstract class EventConditionBaseDto {
  @IsEnum(EventConditionType)
  @IsNotEmpty()
  type: EventConditionType;
}
