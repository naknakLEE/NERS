import { Test, TestingModule } from '@nestjs/testing';
import { EventServerController } from './event-server.controller';

describe('EventServerController', () => {
  let eventServerController: EventServerController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [EventServerController],
    }).compile();

    eventServerController = app.get<EventServerController>(EventServerController);
  });

  describe('root', () => {
    it('should return "pong"', () => {
      expect(eventServerController.ping()).toBe('pong');
    });
  });
});
