import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from '@src/app.service';
import { version } from '../../package.json';

describe('AppService', () => {
  let service: AppService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppService],
    }).compile();

    service = module.get<AppService>(AppService);
  });

  it('should return a webApp version', () => {
    const res = service.getHealth();
    expect(res).toEqual(`Welcome back version: ${version}`);
  });
});
