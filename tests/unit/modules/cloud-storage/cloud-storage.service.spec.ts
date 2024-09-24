import { Test, TestingModule } from '@nestjs/testing';
import { CloudStorageService } from '@src/modules/cloud-storage/cloud-storage.service';
import { Storage } from '@google-cloud/storage';
import { getImageFullExtension } from '@src/modules/cloud-storage/cloud-storage.helper';
import { ConfigService } from '@nestjs/config';
import { BadRequestException } from '@nestjs/common';

jest.mock('@google-cloud/storage');

describe('CloudStorageService', () => {
  let service: CloudStorageService;
  let mockStorage: jest.Mocked<Storage>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CloudStorageService,
        {
          provide: ConfigService,
          useValue: {
            get: (key: string) => {
              if (key === 'NAME_BUCKET_STATIC_CONTENT') {
                return 'name-bucket';
              }
              return null;
            },
          },
        },
      ],
    }).compile();

    service = module.get<CloudStorageService>(CloudStorageService);
    mockStorage = service['storage'] as jest.Mocked<Storage>;
  });

  describe('getContent', () => {
    it('should return file content', async () => {
      const filename = 'test.jpg';
      const mockFileContent = Buffer.from('mock file content');
      const mockFile = {
        download: jest.fn().mockResolvedValue([mockFileContent]),
      };
      const mockBucket = {
        file: jest.fn().mockReturnValue(mockFile),
      };
      mockStorage.bucket.mockReturnValue(mockBucket as any);

      const result = await service.getContent(filename);

      expect(result).toEqual(mockFileContent);
      expect(mockStorage.bucket).toHaveBeenCalledWith('name-bucket');
      expect(mockBucket.file).toHaveBeenCalledWith(filename);
      expect(mockFile.download).toHaveBeenCalled();
    });
    it('should return an error', async () => {
      const filename = 'test.jpg';
      const mockFile = {
        download: jest.fn().mockRejectedValue(new Error('error')),
      };
      const mockBucket = {
        file: jest.fn().mockReturnValue(mockFile),
      };
      mockStorage.bucket.mockReturnValue(mockBucket as any);
      try {
        await service.getContent(filename);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toEqual('error');
      }
    });
  });

  describe('getExtension', () => {
    it('should return correct content type for jpg', () => {
      const result = service.getExtension('test.jpg');
      expect(result).toBe('image/jpg');
    });

    it('should return correct content type for svg', () => {
      const result = service.getExtension('test.svg');
      expect(result).toBe('image/svg+xml');
    });
  });

  describe('getImageFullExtension', () => {
    it('should return correct format for svg', () => {
      expect(getImageFullExtension('svg')).toBe('image/svg+xml');
    });

    it('should return correct format for other extensions', () => {
      expect(getImageFullExtension('jpg')).toBe('image/jpg');
      expect(getImageFullExtension('png')).toBe('image/png');
    });
  });
});
