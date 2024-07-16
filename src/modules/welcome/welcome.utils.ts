import { HttpException, HttpStatus } from '@nestjs/common';
import Holidays from 'date-holidays';
import { NUMBER_OF_STEPS, HOLIDAY_COUNTRY } from '@modules/welcome/constants';

const HOLIDAYS = new Holidays(HOLIDAY_COUNTRY, { types: ['public'] });

function toUTC(date: Date) {
  const result = new Date(date);
  result.setMinutes(result.getMinutes() - result.getTimezoneOffset());
  return result;
}

function getFirstBusinessDayFrom(date: Date) {
  const businessDay = new Date(date);
  while (
    [0, 6].includes(businessDay.getDay()) || // Week-end
    HOLIDAYS.isHoliday(businessDay) // Holiday
  ) {
    businessDay.setDate(businessDay.getDate() + 1);
  }
  return businessDay;
}

/**
 * Parcourt un tableau de dates et décale toutes les dates qui sont un samedi, un dimanche ou un jour férié
 * à la prochaine date libre.
 * @param {Date[]} dateList List of dates
 * @return {Date[]} List of business day dates
 */
export function verifyPublicHoliday(dateList: Date[]): Date[] {
  return dateList.map(getFirstBusinessDayFrom);
}

function calculateInterval(startDate: Date, endDate: Date): number {
  const days = (toUTC(endDate).getTime() - toUTC(startDate).getTime()) / (24 * 60 * 60 * 1000);
  return Math.ceil(days / NUMBER_OF_STEPS);
}

function generateEmailDates(startDate: Date, interval: number) {
  const dates = [];
  const tempDate = new Date(startDate);
  tempDate.setDate(tempDate.getDate() + 1);
  for (let i = 0; i < NUMBER_OF_STEPS; ++i) {
    dates.push(new Date(tempDate));
    tempDate.setDate(tempDate.getDate() + interval);
  }
  return dates;
}

/**
 * Calculate the date at which emails should be sent. It depends on the number of steps with a minimal interval of 1 day between two dates.
 * @param {Date} startDate start date in milliseconds
 * @param {Date} endDate end date in milliseconds
 * @returns an array of string dates
 */
export function calculateEmailDate(startDate: Date, endDate: Date) {
  if (startDate >= endDate) {
    throw new HttpException('Invalid end date', HttpStatus.BAD_REQUEST);
  }

  const interval = calculateInterval(startDate, endDate);
  const emailDates = generateEmailDates(startDate, interval);

  return verifyPublicHoliday(emailDates);
}
