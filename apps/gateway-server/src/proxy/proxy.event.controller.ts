import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ProxyService } from './proxy.service';
import { Request, Response } from 'express';
import { CurrencyType, Role } from '@app/constants';
import { Roles } from '../auth/roles.decorator';
import { ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateEventDto } from '@app/dto/event/create-event.dto';
import { GetEventsDto } from '@app/dto/event/get-events.dto';
import { CreateRewardDto } from '@app/dto/event/create-reward.dto';
import { RewardRequestDto } from '@app/dto/event/reward-request.dto';
import { GetRewardsDto } from '@app/dto/event/get-rewards.dto';
import { GetRewardRequestDto } from '@app/dto/event/get-reward-request.dto';

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
  @ApiOperation({
    summary: '이벤트 서버 헬스 체크',
  })
  @Roles(Role.ADMIN, Role.USER, Role.AUDITOR, Role.OPERATOR)
  proxyEventPing(@Req() req: Request, @Res() res: Response): void {
    this.proxyService.proxyToService(this.eventServiceUrl, req, res);
  }

  @Post('event')
  @Roles(Role.ADMIN, Role.OPERATOR)
  @ApiOperation({
    summary: '이벤트 생성 (관리자, 운영자)',
    description:
      '새로운 이벤트를 생성합니다. 이벤트는 다양한 조건을 포함할 수 있습니다.\n\n' +
      '**EventConditionDto (conditions 배열의 각 요소)**:\n' +
      '각 조건 객체는 다음과 같은 기본 필드를 가집니다:\n' +
      '- **type**: 조건의 종류를 나타내는 열거형 값입니다. (필수)\n' +
      '- **name**: 조건의 이름입니다. (필수, 예: "7일 연속 로그인")\n' +
      '- **description** : 조건에 대한 상세 설명입니다.\n' +
      '- **parameters** (특정 **type**에 따라 필수 파라미터가 존재): 조건 유형에 따라 달라지는 추가 파라미터 객체입니다.\n\n' +
      '**사용 가능한 **conditions**의 **type** 및 해당 **parameters** 상세:**\n\n' +
      '1.  **LOGIN_STREAK**: 연속 로그인 조건\n' +
      '    -   **parameters**:\n' +
      '        -   **days** (number, 필수): 연속으로 로그인해야 하는 일수 (예: **7**)\n\n' +
      '2.  **USER_LEVEL**: 사용자 레벨 달성 조건\n' +
      '    -   **parameters**:\n' +
      '        -   **requiredLevel** (number, 필수): 달성해야 하는 최소 사용자 레벨 (예: **10**)\n\n' +
      '3.  **QUEST_COMPLETED**: 특정 퀘스트 완료 조건\n' +
      '    -   **parameters**:\n' +
      '        -   **questId** (string, 필수): 완료해야 하는 퀘스트의 고유 ID (예: **"daily_login_quest"**)\n\n' +
      '4.  **FRIEND_INVITATION**: 친구 초대 조건\n' +
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
      '```',
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
  @ApiOperation({
    summary: '이벤트 목록 조회 (관리자, 운영자)',
  })
  getEvents(
    @Query() getEventsDto: GetEventsDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    this.proxyService.proxyToService(this.eventServiceUrl, req, res);
  }

  @Get('event/:id')
  @ApiOperation({
    summary: '이벤트 상세 조회(보상 포함) (관리자, 운영자)',
  })
  @Roles(Role.ADMIN, Role.OPERATOR)
  getEventById(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    this.proxyService.proxyToService(this.eventServiceUrl, req, res);
  }

  // POST /event/reward
  @Post('event/reward')
  @Roles(Role.ADMIN, Role.OPERATOR)
  @ApiOperation({
    summary: '이벤트 보상 생성 (관리자, 운영자)',
    description:
      '새로운 보상을 생성합니다. 보상은 특정 이벤트에 연결되며, 아이템 또는 재화 형태일 수 있습니다.\n\n' +
      '**주요 필드 설명:**\n' +
      '- **eventId**: 보상이 속할 이벤트의 고유 ID입니다. (필수)\n' +
      '- **name**: 보상의 이름입니다. (필수, 예: "출석체크 1일차 보상")\n' +
      '- **type**: 보상의 종류를 나타냅니다. (**ITEM** 또는 **CURRENCY**, 필수)\n' +
      '- **isActive**: 보상의 활성화 여부입니다. (필수)\n' +
      '- **validTo** (선택사항): 보상의 유효 기간 마감일입니다. (ISO 8601 날짜 문자열, 예: **"2025-12-31T23:59:59.000Z"**)\n' +
      '- **details**: 보상의 구체적인 내용을 담는 객체입니다. 이 객체의 구조는 **type** 필드 값에 따라 달라집니다. (필수)\n\n' +
      '---\n\n' + // 구분선
      '**details** 객체 상세 (**type**에 따른 구조 변화):**\n\n' +
      '1.  **type: RewardType.ITEM** (아이템 보상)인 경우:**\n' +
      '    **details**는 **ItemRewardDetailDto** 구조를 따릅니다.\n' +
      '    -   **type**: **"ITEM"** (고정값)\n' +
      '    -   **itemCode** (string, 필수): 지급될 아이템의 고유 코드입니다. (예: **"SWORD_001"**)\n' +
      '    -   **itemName** (string, 선택사항): 아이템의 이름입니다. (예: **"강철 검"**)\n' +
      '    -   **quantity** (number, 필수): 지급될 아이템의 수량입니다. (예: **1**)\n\n' +
      '    **예시 (`details` 부분):**\n' +
      '    ```json\n' +
      '    {\n' +
      '      "type": "ITEM",\n' +
      '      "itemCode": "POTION_003",\n' +
      '      "itemName": "최상급 체력 물약",\n' +
      '      "quantity": 5\n' +
      '    }\n' +
      '    ```\n\n' +
      '2.  **type: RewardType.CURRENCY** (재화 보상)인 경우:**\n' +
      '    **details**는 **CurrencyRewardDetailDto** 구조를 따릅니다.\n' +
      '    -   **type**: **"CURRENCY"** (고정값)\n' +
      '    -   **currencyType** (string, 필수): 지급될 재화의 종류입니다. (**' +
      Object.values(CurrencyType).join('**, **') +
      '** 중 하나, 예: **"GOLD"**)\n' +
      '    -   **amount** (number, 필수): 지급될 재화의 양입니다. (예: **1000**)\n\n' +
      '    **예시 (`details` 부분):**\n' +
      '    ```json\n' +
      '    {\n' +
      '      "type": "CURRENCY",\n' +
      '      "currencyType": "GEM",\n' +
      '      "amount": 100\n' +
      '    }\n' +
      '    ```\n\n' +
      '---\n\n' + // 구분선
      '**전체 요청 바디 예시:**\n\n' +
      '*   **아이템 보상 생성 시:**\n' +
      '    ```json\n' +
      '    {\n' +
      '      "eventId": "664564564564564564564564",\n' +
      '      "name": "특별 접속 보상 아이템",\n' +
      '      "type": "ITEM",\n' +
      '      "isActive": true,\n' +
      '      "validTo": "2025-06-30T23:59:59.000Z",\n' +
      '      "details": {\n' +
      '        "type": "ITEM",\n' +
      '        "itemCode": "UNIQUE_ARMOR_01",\n' +
      '        "itemName": "전설의 갑옷 조각",\n' +
      '        "quantity": 1\n' +
      '      }\n' +
      '    }\n' +
      '    ```\n\n' +
      '*   **재화 보상 생성 시:**\n' +
      '    ```json\n' +
      '    {\n' +
      '      "eventId": "664564564564564564564564",\n' +
      '      "name": "이벤트 참여 골드 보상",\n' +
      '      "type": "CURRENCY",\n' +
      '      "isActive": true,\n' +
      '      "details": {\n' +
      '        "type": "CURRENCY",\n' +
      '        "currencyType": "GOLD",\n' +
      '        "amount": 5000\n' +
      '      }\n' +
      '    }\n' +
      '    ```',
  })
  createReward(
    @Body() body: CreateRewardDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    this.proxyService.proxyToService(this.eventServiceUrl, req, res);
  }

  // GET /reward: 보상 목록 조회
  @Get('event/reward')
  @Roles(Role.ADMIN, Role.OPERATOR)
  @ApiOperation({
    summary: '이벤트 보상 목록 조회 (관리자, 운영자)',
  })
  getRewards(
    @Query() getRewardsDto: GetRewardsDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    this.proxyService.proxyToService(this.eventServiceUrl, req, res);
  }

  // GET /reward/:rewardId 특정 보상 목록 조회
  @Get('event/reward/:rewardId')
  @Roles(Role.ADMIN, Role.OPERATOR)
  @ApiOperation({
    summary: '특정 보상 목록 조회 (관리자, 운영자)',
  })
  getRewardById(
    @Param('rewardId') rewardId: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    this.proxyService.proxyToService(this.eventServiceUrl, req, res);
  }

  //post /event/reward-request
  @Post('event/reward-request')
  @Roles(Role.ADMIN, Role.USER)
  @ApiConsumes('application/x-www-form-urlencoded', 'application/json')
  @ApiOperation({
    summary: '보상 요청 (관리자, 유저)',
  })
  createRewardRequest(
    @Body() body: RewardRequestDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    this.proxyService.proxyToService(this.eventServiceUrl, req, res);
  }

  //get /event/reward-request
  @Get('event/reward-request')
  @Roles(Role.ADMIN, Role.AUDITOR)
  @ApiOperation({
    summary: '보상 요청 목록 조회 (관리자, 감사자)',
  })
  getRewardRequests(
    @Query() getRewardRequestsDto: GetRewardRequestDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    this.proxyService.proxyToService(this.eventServiceUrl, req, res);
  }

  //get /event/reward-request/me
  @Get('event/reward-request/me')
  @Roles(Role.ADMIN, Role.USER)
  @ApiOperation({
    summary: '보상 요청 목록 조회 (관리자, 유저)',
  })
  getRewardRequestMe(@Req() req: Request, @Res() res: Response) {
    this.proxyService.proxyToService(this.eventServiceUrl, req, res);
  }
}
