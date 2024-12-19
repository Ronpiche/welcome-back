import { faker } from "@faker-js/faker";
import { plainToInstance } from "class-transformer";
import { CreatePracticeDto } from "@modules/practice/dto/create-practice.dto";
import type { PracticeVideoDto } from "@src/modules/practice/dto/practice-video.dto";
import type { PracticeFeedbackDto } from "@src/modules/practice/dto/practice-feedback.dto";

type T = CreatePracticeDto;

function createFakePracticeVideoDto(): PracticeVideoDto {
  return {
    member: faker.string.uuid(),
    url: faker.internet.url(),
    quote: faker.lorem.sentence(),
  };
}

function createFakePracticeFeedbackDto(): PracticeFeedbackDto {
  return {
    client: faker.string.uuid(),
    benefits: faker.lorem.paragraphs(),
    context: faker.lorem.paragraphs(),
    ourApproach: faker.lorem.paragraphs(),
  };
}

function createFakeCreatePracticeDto(createPracticeDto: Partial<T> = {}): T {
  return plainToInstance<T, T>(CreatePracticeDto, {
    name: createPracticeDto.name ?? faker.word.noun(),
    summary: createPracticeDto.summary ?? faker.lorem.sentence(),
    tags: createPracticeDto.tags ?? faker.helpers.multiple(() => faker.company.buzzNoun()),
    description: createPracticeDto.description ?? faker.lorem.paragraphs(),
    jobs: createPracticeDto.jobs ?? faker.helpers.multiple(() => faker.person.jobTitle()),
    videos: createPracticeDto.videos ?? faker.helpers.multiple(() => createFakePracticeVideoDto()),
    feedback: createPracticeDto.feedback ?? createFakePracticeFeedbackDto(),
  });
}

export { createFakeCreatePracticeDto };