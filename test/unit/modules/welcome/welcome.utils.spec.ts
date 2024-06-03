import { NUMBER_OF_STEPS } from '@modules/welcome/constants';
import { calculateEmailDate } from '@modules/welcome/welcome.utils';
import dayjs from 'dayjs';

describe('calculateEmailDate', () => {
  it('should throw an error for invalid end date', () => {
    const startDate = dayjs('2022-01-01').valueOf();
    const endDate = dayjs('2021-12-31').valueOf(); // End date is before start date

    expect(() => calculateEmailDate(startDate, endDate)).toThrow('Invalid end date');
  });

  it('should calculate email dates with valid input', () => {
    const startDate = dayjs('2022-01-01').valueOf();
    const endDate = dayjs('2022-01-30').valueOf();

    const result = calculateEmailDate(startDate, endDate);

    expect(result.length).toBe(NUMBER_OF_STEPS);
  });

  it('should handle minimal interval correctly', () => {
    const startDate = dayjs('2022-01-01').valueOf();
    const endDate = dayjs('2022-01-05').valueOf();

    const result = calculateEmailDate(startDate, endDate);

    const firstDate = result[0];
    const secondDate = result[1];

    expect(Math.abs(dayjs(firstDate).diff(secondDate, 'day'))).toBe(1);
  });

  it('should adjust dates falling on weekends to the next Monday', () => {
    const startDate = dayjs('2022-01-01').valueOf();
    const endDate = dayjs('2022-01-10').valueOf();

    const result = calculateEmailDate(startDate, endDate);

    // Check if any dates are weekends and if they have been adjusted correctly
    result.forEach((date) => {
      const day = dayjs(date).day();
      expect(day).not.toBe(0); // Sunday
      expect(day).not.toBe(6); // Saturday
    });
  });

  it('should adjust dates falling on public holidays to the next working day', () => {
    const startDate = dayjs('2022-12-23').valueOf();
    const endDate = dayjs('2022-12-31').valueOf();

    const result = calculateEmailDate(startDate, endDate);

    result.forEach((date) => {
      const formattedDate = dayjs(date).format('YYYY-MM-DD');
      expect(formattedDate).not.toBe('2022-12-25');
    });
  });

  it('should handle weekends followed by holidays correctly', () => {
    const startDate = dayjs('2022-12-30').valueOf();
    const endDate = dayjs('2023-01-10').valueOf();

    const result = calculateEmailDate(startDate, endDate);

    result.forEach((date) => {
      const formattedDate = dayjs(date).format('YYYY-MM-DD');
      expect(formattedDate).not.toBe('2022-12-31'); // Saturday
      expect(formattedDate).not.toBe('2023-01-01'); // Holiday
    });
  });
});
