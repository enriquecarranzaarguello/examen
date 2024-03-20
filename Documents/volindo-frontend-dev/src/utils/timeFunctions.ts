import { utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz';
import { parse, format, isAfter, parseISO, differenceInDays } from 'date-fns';
import { enUS, es } from 'date-fns/locale';

export function timeOnRange(
  timeToCompare: string,
  limitInf: string,
  limitSup: string
) {
  const timeString = timeToCompare.split('-')[0].slice(0, 5);
  const timeLimitInf = HourtoDate(limitInf);
  const timeLimitSup = HourtoDate(limitSup);
  const time = HourtoDate(timeString);
  return time >= timeLimitInf && time <= timeLimitSup;
}

export function HourtoDate(hhmm: string) {
  const hhmmSplit = hhmm.split(':');
  return new Date().setHours(parseInt(hhmmSplit[0]), parseInt(hhmmSplit[1]));
}

export function hasDatePassed(dateString: string, isUTC: boolean = false) {
  const timeZone = isUTC ? 'Etc/UTC' : 'America/Chicago';
  let today = new Date();
  today = isUTC ? today : utcToZonedTime(today, timeZone);

  // Parse the input date in the specified timezone
  const targetDate = isUTC
    ? zonedTimeToUtc(dateString, timeZone)
    : utcToZonedTime(dateString, timeZone);

  return isAfter(targetDate, today);
}

export function passStringToDate(inputDate: string, language: any): string {
  const date = parseISO(inputDate);

  return formatDate(date, language);
}

export function formatDate(date: Date, language: string) {
  let locale;
  if (language === 'es') {
    locale = es;
  } else {
    locale = enUS;
  }

  return format(date, 'E, dd MMM', { locale });
}

export function passStringToDayMonthYear(inputDate: string): string {
  const fecha = parse(inputDate, 'dd-MM-yyyy HH:mm:ss', new Date());
  return format(fecha, 'dd/MM/yyyy');
}

export function getCheckInString(rateConditions: any[]): string {
  let horaCheckIn = null;

  rateConditions.forEach((dato: string) => {
    if (dato.includes('CheckIn Time-Begin')) {
      const startHour = dato.indexOf(':') + 2;
      horaCheckIn = dato.slice(startHour);
    }
  });

  return horaCheckIn || '';
}

export function getCheckOutString(rateConditions: any): string {
  let checkOutTime = null;

  rateConditions.forEach((dato: string) => {
    if (dato.includes('CheckOut Time')) {
      const endHour = dato.indexOf(':') + 2;
      checkOutTime = dato.slice(endHour);
    }
  });
  return checkOutTime || '';
}

export function getDaysDifference(checkIn: string, checkOut: string): number {
  const checkInDate = parseISO(checkIn);
  const checkOutDate = parseISO(checkOut);

  const daysDifference = differenceInDays(checkOutDate, checkInDate);

  return daysDifference;
}

export function formatChargeDate(chargeFromDate: string): string {
  const [day, month, year, hour, minute, second] = chargeFromDate
    .split(/[- :]/)
    .map(Number);
  let chargeDate = new Date(year, month - 1, day, hour, minute, second);

  const today = new Date();

  today.setHours(0, 0, 0, 0);

  if (chargeDate < today) {
    chargeDate = today;
  }

  const options = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  } as const;
  const formattedDate = chargeDate.toLocaleDateString('es-ES', options);

  return formattedDate;
}

export function calcDaysOfDifference(date: string): boolean {
  const today = new Date();
  today.setDate(today.getDate() + 7);

  //TODO Optimize this parse
  let parts = date.split(' ');
  let datePart = parts[0].split('-');
  let timePart = parts[1].split(':');
  let year = parseInt(datePart[2], 10);
  let month = parseInt(datePart[1], 10) - 1;
  let day = parseInt(datePart[0], 10);
  let hours = parseInt(timePart[0], 10);
  let minutes = parseInt(timePart[1], 10);
  let seconds = parseInt(timePart[2], 10);

  const transformDate = new Date(year, month, day, hours, minutes, seconds);

  return transformDate >= today;
}

/**
 * Convert a string to a date.
 * @param dateString - The date string to convert in format YYYY-MM-DD.
 * @returns The converted date, or the current date if the conversion fails.
 */
export function stringToDate(dateString: string): Date {
  const date = new Date(`${dateString}T00:00:00`);

  if (isNaN(date.getTime())) {
    return new Date();
  }

  return date;
}
