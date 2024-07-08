import { HttpException, HttpStatus } from '@nestjs/common';
import Holidays from 'date-holidays';
import dayjs from 'dayjs';
import { NUMBER_OF_STEPS, HOLIDAY_COUNTRY } from '@modules/welcome/constants';

const HOLIDAYS = new Holidays(HOLIDAY_COUNTRY, { types: ['public'] });

function getFirstBusinessDayFrom(date: dayjs.Dayjs) {
  while (
    [0, 6].includes(date.day()) || // Week-end
    HOLIDAYS.isHoliday(date.toDate()) // Holiday
  ) {
    date = date.add(1, 'day');
  }
  return date;
}

/**
 * Parcourt un tableau de dates et décale toutes les dates qui sont un samedi, un dimanche ou un jour férié
 * à la prochaine date libre.
 * @param {string[]} dateList tableau de date au format ISO 8601
 * @return {string[]} un tableau de date au format ISO 8601 sans samedi, dimanche ou jour férié
 */
export function verifyPublicHoliday(dateList: string[]): string[] {
  return dateList.map((date) => getFirstBusinessDayFrom(dayjs(date)).toISOString());
}

function isEndDateInvalid(endMoment: dayjs.Dayjs, startMoment: dayjs.Dayjs): boolean {
  return endMoment.unix() <= startMoment.unix();
}

function calculateInterval(startMoment: dayjs.Dayjs, endMoment: dayjs.Dayjs): number {
  const deltaInDays = endMoment.diff(startMoment, 'days');
  return Math.floor(deltaInDays / NUMBER_OF_STEPS) + 1;
}

function generateEmailDates(startMoment: dayjs.Dayjs, interval: number): string[] {
  const emailDates: string[] = [];
  let tempMoment = startMoment.startOf('day').add(1, 'day');

  for (let i = 0; i < NUMBER_OF_STEPS; i++) {
    emailDates.push(tempMoment.format());
    tempMoment = tempMoment.add(interval, 'days');
  }

  return emailDates;
}

/**
 * Calculate the date at which emails should be sent. It depends
 * on the number of steps with a minimal interval of 1 day between two dates.
 * @param {Date} startDate start date in milliseconds
 * @param {Date} endDate end date in milliseconds
 * @returns an array of string dates
 */
export function calculateEmailDate(startDate: number, endDate: number) {
  const startMoment = dayjs(startDate);
  const endMoment = dayjs(endDate);

  if (isEndDateInvalid(endMoment, startMoment)) {
    throw new HttpException('Invalid end date', HttpStatus.BAD_REQUEST);
  }

  const interval = calculateInterval(startMoment, endMoment);
  const emailDates = generateEmailDates(startMoment, interval);

  return verifyPublicHoliday(emailDates);
}
