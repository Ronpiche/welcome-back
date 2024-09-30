import type { Step } from "@modules/step/entities/step.entity";

export const stepEntityMock: Step = {
  _id: "0",
  cutAt: 0,
  minDays: 30,
  maxDays: 90,
  unlockEmail: {
    subject: "Test",
    body: "1234",
  },
  subStep: [
    {
      _id: "1",
      isCompleted: false,
    },
  ],
};