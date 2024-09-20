import { ContentServiceMock } from '@tests/unit/__mocks__/content/content.service.mock';
import { Test, TestingModule } from '@nestjs/testing';
import { ContentController } from '@src/modules/content/content.controller';
import { ContentService } from '@src/modules/content/content.service';
import { ContentEntity } from '@src/modules/content/entities/content.entity';

describe('ContentController', () => {
  let controller: ContentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContentController],
      providers: [{ provide: ContentService, useClass: ContentServiceMock }],
    }).compile();

    controller = module.get<ContentController>(ContentController);
  });

  it('should create a content', async () => {
    const res: ContentEntity = (await controller.create({})) as ContentEntity;
    expect(res.id).toEqual('test-id');
    expect(res.data).toBeDefined();
  });

  it('should find one content', async () => {
    const res: ContentEntity = (await controller.findOne('azerty')) as ContentEntity;
    expect(res.id).toEqual('test-id');
    expect(res.data).toBeDefined();
  });

  it('should update a content', async () => {
    const res: ContentEntity = (await controller.update('azerty', {})) as ContentEntity;
    expect(res.id).toEqual('test-id');
    expect(res.data).toBeDefined();
  });
});
