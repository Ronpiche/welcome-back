import { BadRequestException, Injectable } from '@nestjs/common';
import { FIRESTORE_COLLECTIONS } from '@src/configs/types/Firestore.types';
import { FirestoreService } from '@src/services/firestore/firestore.service';
import { ContentEntity } from './entities/content.entity';
import { CreateContentDto } from './dto/create-content.dto';
import { instanceToPlain } from 'class-transformer';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ContentService {
  constructor(private readonly firestore: FirestoreService) {}

  async create(createContentDto: CreateContentDto): Promise<ContentEntity> {
    const contentToCreate: Record<string, any> = instanceToPlain(createContentDto);
    if (!contentToCreate || Object.keys(contentToCreate).length === 0) {
      throw new BadRequestException('This content is empty');
    }
    contentToCreate._id = uuidv4();
    const content: ContentEntity = {
      id: contentToCreate._id,
      data: await this.firestore.saveDocument(FIRESTORE_COLLECTIONS.WELCOME_CONTENT, contentToCreate),
    };

    return content;
  }

  async findOne(id: string): Promise<ContentEntity> {
    const content: ContentEntity = {
      id: id,
      data: await this.firestore.getDocument(FIRESTORE_COLLECTIONS.WELCOME_CONTENT, id),
    };

    return content;
  }

  async update(id: string, updateContentDto: Record<string, any>): Promise<ContentEntity> {
    const contentToUpdate: Record<string, any> = instanceToPlain(updateContentDto);
    const content: ContentEntity = {
      id: id,
      data: await this.firestore.updateDocument(FIRESTORE_COLLECTIONS.WELCOME_CONTENT, id, contentToUpdate),
    };
    return content;
  }
}
