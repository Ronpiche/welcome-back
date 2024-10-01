import { generateStepDates } from "@modules/step/step.utils";
import { Step } from "@modules/step/entities/step.entity";

const COUNTRY = "FR";

describe("calculateEmailDate", () => {
  it("should throw an error for start date > end date", () => {
    const startDate = new Date("2024-01-01");
    const endDate = new Date("2023-12-31");

    expect(() => generateStepDates(startDate, endDate, [new Step()], COUNTRY)).toThrow();
  });

  it("should handle number of steps", () => {
    const startDate = new Date("2024-01-01");
    const endDate = new Date("2024-01-30");

    const result1 = generateStepDates(startDate, endDate, [new Step()], COUNTRY);
    const result2 = generateStepDates(startDate, endDate, [new Step(), new Step(), new Step(), new Step()], COUNTRY);

    expect(result1).toHaveLength(1);
    expect(result2).toHaveLength(4);
  });

  it("should handle cutAt correctly", () => {
    const step1 = new Step();
    step1.cutAt = 0;
    const step2 = new Step();
    step2.cutAt = 0.5;
    const step3 = new Step();
    step3.cutAt = 1;

    const startDate = new Date("2024-01-02");
    const endDate = new Date("2024-01-04");

    expect(generateStepDates(startDate, endDate, [step1, step2, step3], COUNTRY)).toStrictEqual([
      { step: step1, dt: new Date("2024-01-02") },
      { step: step2, dt: new Date("2024-01-03") },
      { step: step3, dt: new Date("2024-01-04") },
    ]);
  });

  it("should handle minimal interval correctly", () => {
    const startDate = new Date("2024-01-02");
    const endDate = new Date("2024-01-15");
    const step1 = new Step();
    step1.cutAt = 0.5;
    const step2 = new Step();
    step2.cutAt = 0.5;
    step2.minDays = 30;

    const result = generateStepDates(startDate, endDate, [step1, step2], COUNTRY);

    expect(result[0].dt.getTime() - startDate.getTime()).toBeGreaterThan(0);
    expect(result[1].dt.getTime() - startDate.getTime()).toBe(0);
  });

  it("should handle maximal interval correctly", () => {
    const startDate = new Date("2024-01-02");
    const endDate = new Date("2024-12-31");
    const step1 = new Step();
    step1.cutAt = 0.5;
    const step2 = new Step();
    step2.cutAt = 0.5;
    step2.maxDays = 90;

    const result = generateStepDates(startDate, endDate, [step1, step2], COUNTRY);

    const ninetyDaysMs = 90 * 24 * 60 * 60 * 1000;

    expect(endDate.getTime() - result[0].dt.getTime()).toBeGreaterThan(ninetyDaysMs);
    expect(endDate.getTime() - result[1].dt.getTime()).toBeLessThanOrEqual(ninetyDaysMs);
  });

  it("should handle multiple consecutive holidays", () => {
    const step1 = new Step();
    step1.cutAt = 0;
    const step2 = new Step();
    step2.cutAt = 1;

    const startDate1 = new Date("2024-05-08");
    const endDate1 = new Date("2024-05-09");

    expect(generateStepDates(startDate1, endDate1, [step1, step2], COUNTRY)).toStrictEqual([
      { step: step1, dt: new Date("2024-05-10") },
      { step: step2, dt: new Date("2024-05-10") },
    ]);

    const startDate2 = new Date("2043-05-07");
    const endDate2 = new Date("2043-05-10");

    expect(generateStepDates(startDate2, endDate2, [step1, step2], COUNTRY)).toStrictEqual([
      { step: step1, dt: new Date("2043-05-11") },
      { step: step2, dt: new Date("2043-05-11") },
    ]);
  });
});