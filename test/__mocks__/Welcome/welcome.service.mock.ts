import { outputWelcomeMock } from "./User.entity.mock";

export class WelcomeServiceMock {
    findAll = jest.fn().mockResolvedValue([outputWelcomeMock]);
}