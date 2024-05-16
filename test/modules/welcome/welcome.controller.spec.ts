import { WelcomeController } from "@modules/welcome/welcome.controller";
import { WelcomeService } from "@modules/welcome/welcome.service";
import { Test, TestingModule } from "@nestjs/testing";
import { WelcomeServiceMock } from "../../__mocks__/welcome/welcome.service.mock";
import { outputWelcomeMock } from "../../__mocks__/welcome/User.entity.mock";
import { AccessGuard } from "../../../src/middleware/AuthGuard";
import { FindAllUsersPipe } from "@modules/welcome/pipes/find-all-users.pipe";
import { JwtService } from "@nestjs/jwt";
import { BadRequestException, Logger } from "@nestjs/common";

describe("Welcome controller", () => {
    let controller: WelcomeController;
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
          controllers: [WelcomeController],
          providers: [
            JwtService,
            AccessGuard,
            FindAllUsersPipe,
            { provide: WelcomeService, useClass: WelcomeServiceMock },
            {
                provide: Logger,
                useValue: {
                  log: jest.fn(),
                  error: jest.fn(),
                  debug: jest.fn(),
                  warn: jest.fn(),
                  info: jest.fn(),
                  secure: jest.fn(),
                  isLevelEnabled: jest.fn(() => false),
                },
            }
          ],
        }).compile();
    
        controller = module.get<WelcomeController>(WelcomeController);
      });

    it("findAll - should return a array object with no filters", async () => {
       const users = await controller.findAll({})
       expect(users).toBeDefined();
       expect(users).toEqual([outputWelcomeMock]);
    })

    it("findAll - should return a array object with filters", async () => {
        const arrivalDate = {
            startDate: "14/05/2024",
            endDate:"14/05/2024"
        }
        const logger = new Logger()
        const pipe = new FindAllUsersPipe(logger);
        const filter = pipe.transform(arrivalDate);
        const users = await controller.findAll(filter)
        expect(users).toBeDefined();
        expect(users).toEqual([outputWelcomeMock]);
     })

     it("findAll - should throw a BadRequestException error 'Invalid arrivalDate startDate'", async () => {
        const arrivalDate = {
            startDate: "14/05/202",
            endDate:"14/05/2024"
        }
        const logger = new Logger()
        const pipe = new FindAllUsersPipe(logger); 
        try {
            pipe.transform(arrivalDate);
        } catch (error) {
            expect(error).toBeInstanceOf(BadRequestException);
            expect(error.message).toEqual('Invalid arrivalDate startDate');
            expect(error.status).toEqual(400);
        }
     })

     it("findAll - should throw a BadRequestException error 'Invalid arrivalDate endDate'", async () => {
        const arrivalDate = {
            startDate: "14/05/2024",
            endDate:"14/05/202"
        }
        const logger = new Logger()
        const pipe = new FindAllUsersPipe(logger);
        try {
            pipe.transform(arrivalDate);
        } catch (error) {
            expect(error).toBeInstanceOf(BadRequestException);
            expect(error.message).toEqual('Invalid arrivalDate endDate');
            expect(error.status).toEqual(400);
        }
     })
})