import { faker } from "@faker-js/faker";
import { plainToInstance } from "class-transformer";
import { Practice } from "@modules/practice/entities/practice.entity";
import type { PracticeVideo } from "@modules/practice/entities/practice-video.entity";
import type { PracticeFeedback } from "@modules/practice/entities/practice-feedback.entity";

type T = Practice;

function createFakePracticeVideo(): PracticeVideo {
  return {
    member: faker.string.uuid(),
    url: faker.internet.url(),
    quote: faker.lorem.sentence(),
  };
}

function createFakePracticeFeedback(): PracticeFeedback {
  return {
    client: faker.string.uuid(),
    benefits: faker.lorem.paragraphs(),
    context: faker.lorem.paragraphs(),
    ourApproach: faker.lorem.paragraphs(),
  };
}

function createFakePractice(practice: Partial<T> = {}): T {
  return plainToInstance<T, T>(Practice, {
    _id: practice._id ?? faker.database.mongodbObjectId(),
    name: practice.name ?? faker.word.noun(),
    summary: practice.summary ?? faker.lorem.sentence(),
    tags: practice.tags ?? faker.helpers.multiple(() => faker.company.buzzNoun()),
    description: practice.description ?? faker.lorem.paragraphs(),
    jobs: practice.jobs ?? faker.helpers.multiple(() => faker.person.jobTitle()),
    videos: practice.videos ?? faker.helpers.multiple(() => createFakePracticeVideo()),
    feedback: practice.feedback ?? createFakePracticeFeedback(),
  });
}

export { createFakePractice };