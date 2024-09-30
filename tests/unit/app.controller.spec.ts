import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";
import { AppController } from "@src/app.controller";
import { AppService } from "@src/app.service";
import { version } from "../../package.json";

describe("AuthentificationController", () => {
  let controller: AppController;

  beforeEach(async() => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    controller = module.get<AppController>(AppController);
  });

  describe("AppController", () => {
    it("should return a webApp version", () => {
      const res = controller.getHealth();
      expect(res).toBe(`Welcome back version: ${version}`);
    });
  });
});