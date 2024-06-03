import { HttpException, HttpStatus } from '@nestjs/common';
import Holidays from 'date-holidays';
import dayjs from 'dayjs';
import { NUMBER_OF_STEPS } from '@modules/welcome/constants';

/**
 * Parcourt un tableau de dates et décale toutes les dates qui sont un samedi, un dimanche ou un jour férié
 * à la prochaine date libre.
 * @param {string[]} dateList tableau de date au format ISO 8601
 * @return {string[]} un tableau de date au format ISO 8601 sans samedi, dimanche ou jour férié
 */
export function verifyPublicHoliday(dateList: string[]): string[] {
  return dateList.map((date) => {
    const hd = new Holidays('FR');

    let currentMoment = dayjs(date);
    let holiday = hd.isHoliday(currentMoment.toDate());
    //si c'est un jour férié on décale la date à un jour plus tard

    if (holiday && holiday.find((element) => element.type === 'public')) {
      currentMoment = currentMoment.add(1, 'day');
    }
    //si le jour qui en résulte est un samedi ou un dimanche on décale au lundi
    if (currentMoment.day() === 6) {
      currentMoment = currentMoment.day(7 + 1);
    }

    if (currentMoment.day() === 0) {
      currentMoment = currentMoment.day(1);
    }

    //On vérifie le cas où le lundi serait férié
    holiday = hd.isHoliday(currentMoment.toDate());

    if (holiday && holiday.find((element) => element.type === 'public') && currentMoment.day() === 1) {
      currentMoment = currentMoment.add(1, 'day');
    }

    return currentMoment.toISOString();
  });
}

/**
 * Calculate the date at which email should be sent. It depends
 * on the number of steps with a minimal interval of 1 day between two dates.
 * @param {Date} startDate
 * @param {Date} endDate
 * @returns an array of date
 */
export function calculateEmailDate(startDate: number, endDate: number) {
  const startMoment = dayjs(startDate);
  const endMoment = dayjs(endDate);

  if (endMoment.unix() <= startMoment.unix()) {
    throw new HttpException('invalid end Date', HttpStatus.BAD_REQUEST);
  }
  const deltaInDay = endMoment.diff(startMoment, 'days');
  const interval = Math.floor(deltaInDay / NUMBER_OF_STEPS) + 1;
  const emailDates: string[] = [];

  let tempMoment = startMoment.startOf('day');
  tempMoment.add(1, 'days');

  for (let i = 0; i < NUMBER_OF_STEPS; i++) {
    emailDates.push(tempMoment.format());
    tempMoment = tempMoment.add(interval, 'days');
  }

  return verifyPublicHoliday(emailDates);
}
