import { Test, TestingModule } from '@nestjs/testing';
import { CloudStorageController } from '@src/modules/cloud-storage/cloud-storage.controller';
import { CloudStorageService } from '@src/modules/cloud-storage/cloud-storage.service';
import { StreamableFile } from '@nestjs/common';
import { Response } from 'express';

describe('CloudStorageController', () => {
  let controller: CloudStorageController;
  let service: CloudStorageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CloudStorageController],
      providers: [
        {
          provide: CloudStorageService,
          useValue: {
            getContent: jest.fn(),
            getExtension: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<CloudStorageController>(CloudStorageController);
    service = module.get<CloudStorageService>(CloudStorageService);
  });

  describe('getFile', () => {
    it('should return a StreamableFile', async () => {
      const filename = 'test.jpg';
      const mockFile = Buffer.from('mock file content');
      const mockContentType = 'image/jpeg';

      jest.spyOn(service, 'getContent').mockResolvedValue(mockFile);
      jest.spyOn(service, 'getExtension').mockReturnValue(mockContentType);

      const mockResponse = {
        set: jest.fn(),
      } as unknown as Response;

      const result = await controller.getFile(filename, mockResponse);

      expect(result).toBeInstanceOf(StreamableFile);
      expect(service.getContent).toHaveBeenCalledWith(filename);
      expect(service.getExtension).toHaveBeenCalledWith(filename);
      expect(mockResponse.set).toHaveBeenCalledWith('Content-Type', mockContentType);
    });
  });
});
