class StepEmail {
  subject: string;
  body: string;
}

export class Step {
  _id: string;
  cutAt: number;
  maxDays: number;
  minDays: number;
  unlockEmail?: StepEmail;
  completionEmail?: StepEmail;
  completionEmailManager?: StepEmail;
}
