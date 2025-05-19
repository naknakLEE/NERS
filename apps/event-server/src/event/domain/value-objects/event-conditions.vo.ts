import { EventConditionParams } from '@app/constants';
import { EventConditionType } from '@app/dto/event/condition/condition-type.enum';

export interface ILoginStreakCondition extends EventConditionParams {
  type: EventConditionType.LOGIN_STREAK;
  parameters: {
    days: number;
  };
}

export interface IUserLevelCondition extends EventConditionParams {
  type: EventConditionType.USER_LEVEL;
  parameters: {
    requiredLevel: number;
  };
}

export interface IQuestCompletedCondition extends EventConditionParams {
  type: EventConditionType.QUEST_COMPLETED;
  parameters: {
    questId: string;
  };
}

export interface IFriendInvitationCondition extends EventConditionParams {
  type: EventConditionType.FRIEND_INVITATION;
  parameters: {
    count: number;
  };
}

export type ConditionDetail =
  | ILoginStreakCondition
  | IUserLevelCondition
  | IQuestCompletedCondition
  | IFriendInvitationCondition;

export class EventConditionsVO {
  private readonly _values: ReadonlyArray<ConditionDetail>;

  private constructor(conditions: ConditionDetail[]) {
    if (!Array.isArray(conditions)) {
      throw new Error('Conditions must be an array.');
    }

    // 각 조건 항목에 대한 유효성 검사 (Enum 값 확인 등)
    conditions.forEach((condition) => {
      if (
        !condition.type ||
        !Object.values(EventConditionType).includes(
          condition.type as EventConditionType,
        )
      ) {
        throw new Error(
          `Each condition must have a valid "type" from EventConditionType. Received: ${condition.type}`,
        );
      }
      // 타입별 추가 유효성 검사 가능 (예: LOGIN_STREAK 타입이면 days 필드가 있는지)
      switch (condition.type) {
        case EventConditionType.LOGIN_STREAK:
          if (
            typeof (condition as ILoginStreakCondition).parameters.days !==
              'number' ||
            (condition as ILoginStreakCondition).parameters.days <= 0
          ) {
            throw new Error(
              'LOGIN_STREAK condition must have a positive "days" number.',
            );
          }
          break;
        case EventConditionType.USER_LEVEL:
          if (
            typeof (condition as IUserLevelCondition).parameters
              .requiredLevel !== 'number' ||
            (condition as IUserLevelCondition).parameters.requiredLevel <= 0
          ) {
            throw new Error(
              'USER_LEVEL condition must have a positive "requiredLevel" number.',
            );
          }
          break;
        case EventConditionType.QUEST_COMPLETED:
          if (
            typeof (condition as IQuestCompletedCondition).parameters
              .questId !== 'string'
          ) {
            throw new Error(
              'QUEST_COMPLETED condition must have a valid "questId" string.',
            );
          }
          break;
        case EventConditionType.FRIEND_INVITATION:
          if (
            typeof (condition as IFriendInvitationCondition).parameters
              .count !== 'number' ||
            (condition as IFriendInvitationCondition).parameters.count <= 0
          ) {
            throw new Error(
              'FRIEND_INVITATION condition must have a positive "count" number.',
            );
          }
          break;
      }
    });

    this._values = Object.freeze([...conditions]);
  }

  public static create(conditions: ConditionDetail[]): EventConditionsVO {
    return new EventConditionsVO(conditions);
  }

  get values(): ReadonlyArray<ConditionDetail> {
    return this._values;
  }

  public isEmpty(): boolean {
    return this._values.length === 0;
  }
}
