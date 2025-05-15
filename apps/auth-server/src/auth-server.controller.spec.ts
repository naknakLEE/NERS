import { Test, TestingModule } from '@nestjs/testing';
import { AuthServerController } from './auth-server.controller';

describe('AuthServerController', () => {
  let authServerController: AuthServerController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AuthServerController],
    }).compile();

    authServerController = app.get<AuthServerController>(AuthServerController);
  });

  describe('root', () => {
    it('should return "pong"', () => {
      expect(authServerController.ping()).toBe('pong');
    });
  });
});
