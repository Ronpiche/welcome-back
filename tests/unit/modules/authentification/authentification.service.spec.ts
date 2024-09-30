import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";
import { AuthentificationService } from "@modules/authentification/authentification.service";
import { GipService } from "@src/services/gip/gip.service";
import { GipServiceMock } from "@tests/unit/__mocks__/gip.service.mock";
import {
  authentificationUserOutput,
  signInMock,
  signUpMock,
} from "@tests/unit/__mocks__/authentification/authentification.entities.mock";
import { BadRequestException, NotFoundException, UnauthorizedException } from "@nestjs/common";

describe("AuthentificationService", () => {
  let service: AuthentificationService;

  beforeEach(async() => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthentificationService, { provide: GipService, useClass: GipServiceMock }],
    }).compile();

    service = module.get<AuthentificationService>(AuthentificationService);
  });

  describe("signinService", () => {
    it("should return an user credential from firebase", async() => {
      jest.spyOn(service["gipService"], "signInGIP").mockImplementation().mockResolvedValue(authentificationUserOutput);
      const user = await service.signIn(signInMock);
      expect(user).toEqual(authentificationUserOutput);
    });

    it("should throw an error, if gipService return an error", async() => {
      jest.spyOn(service["gipService"], "signInGIP").mockImplementation().mockRejectedValue(new UnauthorizedException("internal server error"));
      try {
        await service.signIn(signInMock);
      } catch (error) {
        expect(error.message).toBe("internal server error");
        expect(error).toBeInstanceOf(UnauthorizedException);
      }
    });
  });

  describe("signupService", () => {
    it("should return a newly created user from firebase", async() => {
      jest.spyOn(service["gipService"], "signUpGIP").mockImplementation().mockResolvedValue(undefined);
      const user = await service.signUp(signUpMock);
      expect(user).toBeUndefined();
    });

    it("should throw an error, if gipService return an error", async() => {
      jest.spyOn(service["gipService"], "signUpGIP").mockImplementation().mockRejectedValue(new NotFoundException("User not found"));
      try {
        await service.signUp(signUpMock);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe("User not found");
      }
    });

    it("should throw an error, if these password are not the same", async() => {
      jest.spyOn(service["gipService"], "signUpGIP").mockImplementation();
      signUpMock.copy_password = "test@1234";
      try {
        await service.signUp(signUpMock);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe("These passwords are not the same");
      }
    });
  });
});