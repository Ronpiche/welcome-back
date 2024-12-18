import type { SendSmtpEmail, TransactionalEmailsApi } from "@getbrevo/brevo";
import * as Brevo from "@getbrevo/brevo";
import { Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";
import { MailService } from "@src/services/mail/mail.service";
import type { MailRequirement } from "@src/services/mail/mail.types";
import { LoggerMock } from "@tests/unit/__mocks__/logger.mock";
import { createFakeCreateUserDto } from "@tests/unit/factories/dtos/create-user.dto.factory";
import { createFakeWelcomeUser } from "@tests/unit/factories/entities/user.entity.factory";

const transactionalEmailsApiMocks = {
  sendTransacEmail: jest.fn(),
  setApiKey: jest.fn(),
};

jest.mock<typeof import("@getbrevo/brevo")>("@getbrevo/brevo", () => ({
  ...jest.requireActual("@getbrevo/brevo"),
  TransactionalEmailsApi: jest.fn(() => transactionalEmailsApiMocks) as unknown as typeof TransactionalEmailsApi,
  SendSmtpEmail: jest.fn(() => ({})) as unknown as typeof SendSmtpEmail,
}));

describe("Mail Service Service", () => {
  let services: { mail: MailService };
  let mocks: {
    services: {
      config: {
        get: jest.Mock;
      };
      mail: {
        sendMail: jest.SpyInstance;
        getSmtpMailFromRequirement: jest.SpyInstance;
      };
    };
  };

  beforeEach(async() => {
    mocks = {
      services: {
        config: {
          get: jest.fn(),
        },
        mail: {
          sendMail: jest.fn(),
          getSmtpMailFromRequirement: jest.fn(),
        },
      },
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: Logger,
          useClass: LoggerMock,
        },
        {
          provide: ConfigService,
          useValue: mocks.services.config,
        },
        MailService,
      ],
    }).compile();

    services = { mail: module.get<MailService>(MailService) };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("constructor", () => {
    it("should get brevo api key from config when called.", () => {
      expect(mocks.services.config.get).toHaveBeenCalledTimes(1);
      expect(mocks.services.config.get).toHaveBeenCalledWith("BREVO_API_KEY");
    });

    it("should set brevo api key when called.", () => {
      expect(transactionalEmailsApiMocks.setApiKey).toHaveBeenCalledTimes(1);
      expect(transactionalEmailsApiMocks.setApiKey).toHaveBeenCalledWith(Brevo.TransactionalEmailsApiApiKeys.apiKey, mocks.services.config.get("BREVO_API_KEY"));
    });
  });

  describe("sendStepMail", () => {
    beforeEach(() => {
      mocks.services.mail.sendMail = jest.spyOn(services.mail as unknown as { sendMail }, "sendMail").mockResolvedValue(undefined);
    });

    it("should send mail when called.", async() => {
      const user = createFakeWelcomeUser();
      const stepUnlockEmail = {
        subject: "Welcome to the next step",
        body: "Hey John, you've unlocked the next step!",
      };
      const stepId = "456";
      await services.mail.sendStepMail(user, stepUnlockEmail, stepId);
      const dummyMailRequirement: MailRequirement = {
        to: "john@doe.com",
        subject: "Welcome to the next step",
        html: "<p>Hey John, you've unlocked the next step!</p>",
      };

      expect(services.mail["sendMail"]).toHaveBeenCalledTimes(1);
      expect(services.mail["sendMail"]).toHaveBeenCalledWith(dummyMailRequirement);
    });
  });

  describe("inviteNewUserMail", () => {
    beforeEach(() => {
      mocks.services.mail.sendMail = jest.spyOn(services.mail as unknown as { sendMail }, "sendMail").mockResolvedValue(undefined);
    });

    it("should send mail when called.", async() => {
      const createUserDto = createFakeCreateUserDto();
      const password = "password";
      await services.mail.inviteNewUserMail(createUserDto, password);
      const dummyMailRequirement: MailRequirement = {
        to: "john@doe.com",
        subject: "Welcome to the platform",
        html: "<p>Hey John, welcome to the platform!</p>",
      };

      expect(services.mail["sendMail"]).toHaveBeenCalledTimes(1);
      expect(services.mail["sendMail"]).toHaveBeenCalledWith(dummyMailRequirement);
    });
  });

  describe("sendMail", () => {
    beforeEach(() => {
      mocks.services.mail.getSmtpMailFromRequirement = jest.spyOn(services.mail as unknown as { getSmtpMailFromRequirement }, "getSmtpMailFromRequirement").mockReturnValue({});
    });

    it("should get smtp mail from provided requirements when called.", async() => {
      const mailRequirement: MailRequirement = {
        to: "Antoine",
        subject: "Hello",
        html: "<p>Hello</p>",
      };
      await services.mail["sendMail"](mailRequirement);

      expect(mocks.services.mail.getSmtpMailFromRequirement).toHaveBeenCalledTimes(1);
      expect(mocks.services.mail.getSmtpMailFromRequirement).toHaveBeenCalledWith(mailRequirement);
    });

    it("should send transaction email when called.", async() => {
      const mailRequirement: MailRequirement = {
        to: "Antoine",
        subject: "Hello",
        html: "<p>Hello</p>",
      };
      await services.mail["sendMail"](mailRequirement);

      expect(transactionalEmailsApiMocks.sendTransacEmail).toHaveBeenCalledTimes(1);
      expect(transactionalEmailsApiMocks.sendTransacEmail).toHaveBeenCalledWith({});
    });

    it("should throw error when send transaction email fails.", async() => {
      const mailRequirement: MailRequirement = {
        to: "Antoine",
        subject: "Hello",
        html: "<p>Hello</p>",
      };
      const error = new Error("Error while sending email");
      transactionalEmailsApiMocks.sendTransacEmail.mockRejectedValue(error);

      await expect(services.mail["sendMail"](mailRequirement)).rejects.toThrow(error);
    });
  });

  describe("getSmtpMailFromRequirement", () => {
    it("should call getSmtpMailFromRequirement when called.", () => {
      const mailRequirement: MailRequirement = {
        to: "Antoine",
        subject: "Hello",
        html: "<p>Hello</p>",
      };
      services.mail["getSmtpMailFromRequirement"](mailRequirement);

      expect(Brevo.SendSmtpEmail).toHaveBeenCalledTimes(1);
      expect(Brevo.SendSmtpEmail).toHaveBeenCalledWith();
    });

    it("should get smtp mail from provided requirements when called.", () => {
      const mailRequirement: MailRequirement = {
        to: "Antoine",
        subject: "Hello",
        html: "<p>Hello</p>",
      };
      const mail = services.mail["getSmtpMailFromRequirement"](mailRequirement);
      const expectedResult = {
        to: [{ email: mailRequirement.to }],
        sender: {
          name: "Daveo - Welcome",
          email: "welcome@daveo.fr",
        },
        subject: mailRequirement.subject,
        htmlContent: mailRequirement.html,
      };

      expect(mail).toStrictEqual(expectedResult);
    });
  });
});