class StepEmail {
  subject: string;

  body: string;
}

class SubStep {
  _id: string;

  isCompleted: boolean;
}

export class Step {
  _id: string;

  cutAt: number;

  maxDays: number;

  minDays: number;

  unlockEmail?: StepEmail;

  completionEmail?: StepEmail;

  completionEmailManager?: StepEmail;

  subStep: SubStep[];
}