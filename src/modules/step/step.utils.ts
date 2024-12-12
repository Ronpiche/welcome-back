import { HttpException, HttpStatus } from "@nestjs/common";
import Holidays from "date-holidays";
import type { Step } from "./entities/step.entity";

// is the result of 24h * 60min * 60sec * 1000
const DAY_IN_MS = 86400000;

/**
 * get the difference between 2 dates (date1 - date2) in days.
 * @param date1 - The first date
 * @return date2 - The second date
 */
function dayDiff(date1: Date, date2: Date) {
  return (date1.getTime() - date2.getTime()) / DAY_IN_MS;
}

/**
 * calculate the first business day from the date. It can be the same day if the date is also a business day.
 * @param date - Start date
 * @param holidays - Instance of Holidays
 * @returns The date of the first business day
 */
function getFirstBusinessDayFrom(date: Date, holidays: Holidays) {
  const businessDay = new Date(date);
  while (
    [0, 6].includes(businessDay.getDay()) || // week-end
    holidays.isHoliday(businessDay) // holiday
  ) {
    businessDay.setUTCDate(businessDay.getUTCDate() + 1);
  }
  return businessDay;
}

/**
 * calculate the date at which step should start.
 * @param startDate - Start date
 * @param endDate - End date
 * @param steps - List of steps
 * @param country - Country code used to take account holidays
 * @returns An array of step with date associated
 */
export function generateStepDates(startDate: Date, endDate: Date, steps: Step[], country: string) {
  const diff = dayDiff(endDate, startDate);
  if (diff < 0) {
    throw new HttpException("Invalid parameter: startDate > endDate", HttpStatus.BAD_REQUEST);
  }
  const holidays = new Holidays(country, { types: ["public"] });

  return steps.map(step => {
    const stepStartDate = new Date(startDate);
    const stepEndDate = new Date(endDate);
    if (step.minDays && diff < step.minDays) {
      stepEndDate.setTime(startDate.getTime());
    } else if (step.maxDays && diff > step.maxDays) {
      stepStartDate.setTime(endDate.getTime());
      stepStartDate.setUTCDate(stepStartDate.getUTCDate() - step.maxDays);
    }

    stepStartDate.setUTCDate(stepStartDate.getUTCDate() + Math.floor(dayDiff(stepEndDate, stepStartDate) * step.cutAt));

    return { step, dt: getFirstBusinessDayFrom(stepStartDate, holidays) };
  });
}