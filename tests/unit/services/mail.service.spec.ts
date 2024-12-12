import { Test } from "@nestjs/testing";
import { Logger } from "@nestjs/common";
import { MailService } from "@src/services/mail/mail.service";
import type { CreateUserDto } from "@src/modules/welcome/dto/input/create-user.dto";
import SendGrid from "@sendgrid/mail";
import { ConfigService } from "@nestjs/config";
import { Practice } from "@src/modules/welcome/types/user.enum";

jest.mock("@sendgrid/mail");

const createUserDto: CreateUserDto = {
  note: "",
  email: "john.doe@127.0.0.1",
  signupDate: "2022-04-24 22:00:00",
  firstName: "John",
  lastName: "Doe",
  agency: "Any",
  practices: [Practice.DATA],
  hrReferent: {
    firstName: "Joe",
    lastName: "Bloggs",
    email: "joe.bloggs@127.0.0.1",
  },
  arrivalDate: "2023-02-01 22:00:00",
};

describe("MailService", () => {
  let service: MailService;

  beforeEach(async() => {
    const module = await Test.createTestingModule({
      providers: [
        MailService,
        ConfigService,
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
        },
      ],
    }).compile();

    service = module.get<MailService>(MailService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("send mail", () => {
    it("should call sendMail when we invite a new user to join the app.", async() => {
      const spy = jest.spyOn(service as any, "sendMail");
      await service.inviteNewUserMail(createUserDto, "motDePasse");
      expect(spy).toHaveBeenCalled();
      expect(SendGrid.send).toHaveBeenCalled();
    });
  });
});