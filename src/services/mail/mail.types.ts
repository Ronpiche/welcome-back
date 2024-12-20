type MailRequirement = {
  to: string;
  subject: string;
  html: string;
};

type CommonMailData = {
  appName: string;
  appUrl: string;
  userFirstName: string;
  userLastName: string;
};

type InviteNewUserMailData = CommonMailData & {
  email: string;
  password: string;
};

type StepMailData = CommonMailData & {
  managerFirstName: string;
  managerLastName: string;
  stepId: string;
};

type MailTemplateName = "new-user" | "step-1" | "step-2" | "step-3" | "step-4";

export type {
  MailRequirement,
  CommonMailData,
  InviteNewUserMailData,
  StepMailData,
  MailTemplateName,
};