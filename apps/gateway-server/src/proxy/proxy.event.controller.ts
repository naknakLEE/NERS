import {
  Body,
  Controller,
  Get,
  Logger,
  Post,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ProxyService } from './proxy.service';
import { Request, Response } from 'express';
import { Role } from '@app/constants';
import { Roles } from '../auth/roles.decorator';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateEventDto } from '@app/dto/event/create-event.dto';
import { GetEventsDto } from '@app/dto/event/get-events.dto';

@Controller()
@ApiTags('Event')
export class ProxyEventController {
  private eventServiceUrl: string;
  private readonly logger = new Logger(ProxyEventController.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly proxyService: ProxyService,
  ) {}

  onModuleInit() {
    this.eventServiceUrl = this.configService.get<string>('EVENT_SERVICE_URL');

    if (!this.eventServiceUrl) {
      this.logger.error(
        'EVENT_SERVICE_URL is not defined in environment variables!',
      );
    }
  }

  @Get('event/ping')
  @Roles(Role.ADMIN, Role.USER, Role.AUDITOR, Role.OPERATOR)
  proxyEventPing(@Req() req: Request, @Res() res: Response): void {
    this.proxyService.proxyToService(this.eventServiceUrl, req, res);
  }

  @Post('event')
  @Roles(Role.ADMIN, Role.OPERATOR)
  @ApiOperation({
    summary: '이벤트 생성',
    description:
      '새로운 이벤트를 생성합니다. 이벤트는 다양한 조건을 포함할 수 있습니다.\n\n' +
      '**EventConditionDto (conditions 배열의 각 요소)**:\n' +
      '각 조건 객체는 다음과 같은 기본 필드를 가집니다:\n' +
      '- **type**: 조건의 종류를 나타내는 열거형 값입니다. (필수)\n' +
      '- **name**: 조건의 이름입니다. (필수, 예: "7일 연속 로그인")\n' +
      '- **description** : 조건에 대한 상세 설명입니다.\n' +
      '- **parameters** (특정 **type**에 따라 필수 파라미터가 존재): 조건 유형에 따라 달라지는 추가 파라미터 객체입니다.\n\n' +
      '**사용 가능한 **conditions**의 **type** 및 해당 **parameters** 상세:**\n\n' +
      '1.  ****LOGIN_STREAK****: 연속 로그인 조건\n' +
      '    -   **parameters**:\n' +
      '        -   **days** (number, 필수): 연속으로 로그인해야 하는 일수 (예: **7**)\n\n' +
      '2.  ****USER_LEVEL****: 사용자 레벨 달성 조건\n' +
      '    -   **parameters**:\n' +
      '        -   **requiredLevel** (number, 필수): 달성해야 하는 최소 사용자 레벨 (예: **10**)\n\n' +
      '3.  ****QUEST_COMPLETED****: 특정 퀘스트 완료 조건\n' +
      '    -   **parameters**:\n' +
      '        -   **questId** (string, 필수): 완료해야 하는 퀘스트의 고유 ID (예: **"daily_login_quest"**)\n\n' +
      '4.  ****FRIEND_INVITATION****: 친구 초대 조건\n' +
      '    -   **parameters**:\n' +
      '        -   **count** (number, 필수): 초대해야 하는 친구의 수 (예: **3**)\n\n' +
      '**요청 바디 예시 (**CreateEventDto**):**\n' +
      '```json\n' +
      '{\n' +
      '  "name": "신규 유저 환영 이벤트",\n' +
      '  "description": "새로 가입하고 레벨 5를 달성하면 보상을 드립니다!",\n' +
      '  "startDate": "2025-01-01T00:00:00.000Z",\n' +
      '  "endDate": "2025-01-31T23:59:59.000Z",\n' +
      '  "status": "ACTIVE",\n' +
      '  "requireAllConditions": false,\n' +
      '  "conditions": [\n' +
      '    {\n' +
      '      "type": "USER_LEVEL",\n' +
      '      "name": "레벨 5 달성",\n' +
      '      "description": "캐릭터 레벨 5 이상 달성",\n' +
      '      "parameters": {\n' +
      '        "requiredLevel": 5\n' +
      '      }\n' +
      '    },\n' +
      '    {\n' +
      '      "type": "LOGIN_STREAK",\n' +
      '      "name": "3일 연속 로그인",\n' +
      '      "parameters": {\n' +
      '        "days": 3\n' +
      '      }\n' +
      '    }\n' +
      '  ]\n' +
      '}\n' +
      '******',
  })
  proxyEventCreate(
    @Body() body: CreateEventDto,
    @Req() req: Request,
    @Res() res: Response,
  ): void {
    this.proxyService.proxyToService(this.eventServiceUrl, req, res);
  }

  @Get('event')
  @Roles(Role.ADMIN, Role.OPERATOR)
  getEvents(
    @Query() getEventsDto: GetEventsDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    this.proxyService.proxyToService(this.eventServiceUrl, req, res);
  }
}
