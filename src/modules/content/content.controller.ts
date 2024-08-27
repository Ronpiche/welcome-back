import { Controller, Get, Post, Body, Param, Put, UseInterceptors, ClassSerializerInterceptor } from '@nestjs/common';
import { ContentService } from './content.service';
import { ContentEntity } from './entities/content.entity';
import { IsPublic } from '@src/decorators/isPublic';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';
import { ApiBody, ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { FirestoreDocumentType } from '@src/configs/types/Firestore.types';

@Controller('content')
@ApiTags('Content')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Post()
  @UseInterceptors(ClassSerializerInterceptor)
  @IsPublic(true)
  @ApiOperation({
    summary: 'Create content',
    description: 'return the content to display the text on Welcome',
  })
  @ApiBody({ schema: { example: { 'on-boarding': {} } } })
  @ApiOkResponse({ type: ContentEntity })
  create(@Body() createContentDto: CreateContentDto): Promise<FirestoreDocumentType> {
    return this.contentService.create(createContentDto);
  }

  @Get(':id')
  @IsPublic(true)
  @ApiOperation({
    summary: 'find content by id',
    description: 'return the content by id',
  })
  @ApiQuery({ name: 'id', type: String, required: true, example: '123e4567' })
  @ApiOkResponse({ type: ContentEntity })
  findOne(@Param('id') id: string): Promise<FirestoreDocumentType> {
    return this.contentService.findOne(id);
  }

  @Put(':id')
  @IsPublic(true)
  @ApiOperation({
    summary: 'Update content',
    description: 'return the content updated to display the text on Welcome',
  })
  @ApiBody({ schema: { example: { 'on-boarding': {} } } })
  @ApiOkResponse({ type: ContentEntity })
  update(@Param('id') id: string, @Body() updateContentDto: UpdateContentDto): Promise<FirestoreDocumentType> {
    return this.contentService.update(id, updateContentDto);
  }
}
