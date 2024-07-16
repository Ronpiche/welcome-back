import { NUMBER_OF_STEPS } from '@modules/welcome/constants';
import { calculateEmailDate } from '@modules/welcome/welcome.utils';

describe('calculateEmailDate', () => {
  it('should throw an error for invalid end date', () => {
    const startDate = new Date('2022-01-01');
    const endDate = new Date('2021-12-31'); // End date is before start date

    expect(() => calculateEmailDate(startDate, endDate)).toThrow('Invalid end date');
  });

  it('should calculate email dates with valid input', () => {
    const startDate = new Date('2022-01-01');
    const endDate = new Date('2022-01-30');

    const result = calculateEmailDate(startDate, endDate);

    expect(result.length).toBe(NUMBER_OF_STEPS);
  });

  it('should handle minimal interval correctly', () => {
    const startDate = new Date('2022-01-01');
    const endDate = new Date('2022-01-05');

    const result = calculateEmailDate(startDate, endDate);

    const firstDate = result[0];
    const secondDate = result[1];

    //expect(Math.abs(new Date(firstDate).diff(secondDate, 'day'))).toBe(1);
    expect(secondDate.getTime() - firstDate.getTime()).toBe(24 * 60 * 60 * 1000);
  });

  it('should adjust dates falling on weekends to the next Monday', () => {
    const startDate = new Date('2022-01-01');
    const endDate = new Date('2022-01-10');

    const result = calculateEmailDate(startDate, endDate);

    // Check if any dates are weekends and if they have been adjusted correctly
    result.forEach((date) => {
      const day = new Date(date).getDay();
      expect(day).not.toBe(0); // Sunday
      expect(day).not.toBe(6); // Saturday
    });
  });

  it('should adjust dates falling on public holidays to the next working day', () => {
    const startDate = new Date('2022-12-23');
    const endDate = new Date('2022-12-31');

    const result = calculateEmailDate(startDate, endDate);

    result.forEach((date) => {
      const formattedDate = new Date(date).toISOString().substring(0, 10);
      expect(formattedDate).not.toBe('2022-12-25');
    });
  });

  it('should handle weekends followed by holidays correctly', () => {
    const startDate = new Date('2022-12-30');
    const endDate = new Date('2023-01-10');

    const result = calculateEmailDate(startDate, endDate);

    result.forEach((date) => {
      const formattedDate = new Date(date).toISOString().substring(0, 10);
      expect(formattedDate).not.toBe('2022-12-31'); // Saturday
      expect(formattedDate).not.toBe('2023-01-01'); // Holiday
    });
  });

  it('should handle multiple consecutive holidays', () => {
    const startDate = new Date('2024-05-07');
    const endDate = new Date('2024-05-12');

    const result = calculateEmailDate(startDate, endDate);

    result.forEach((date) => {
      const formattedDate = new Date(date).toISOString().substring(0, 10);
      expect(formattedDate).not.toBe('2024-05-08'); // Holiday
      expect(formattedDate).not.toBe('2024-05-09'); // Holiday
      expect(formattedDate).not.toBe('2024-05-11'); // Saturday
      expect(formattedDate).not.toBe('2024-05-12'); // Sunday
    });

    const startDate2 = new Date('2043-05-06');
    const endDate2 = new Date('2043-05-11');

    const result2 = calculateEmailDate(startDate2, endDate2);

    result2.forEach((date) => {
      const formattedDate = new Date(date).toISOString().substring(0, 10);
      expect(formattedDate).not.toBe('2043-05-07'); // Holiday
      expect(formattedDate).not.toBe('2043-05-08'); // Holiday
      expect(formattedDate).not.toBe('2043-05-09'); // Saturday
      expect(formattedDate).not.toBe('2043-05-10'); // Sunday
    });
  });
});
