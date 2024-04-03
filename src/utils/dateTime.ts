import * as dateFns from 'date-fns';

export const formatStringToDate = (stringInput: string | undefined, formatInput = 'yyyyMMdd', failOverDate?: Date) => {
  if (stringInput == null) {
    return new Date();
  }
  const date = dateFns.parse(stringInput, formatInput, new Date());
  return dateFns.isValid(date) ? dateFns.parse(stringInput, formatInput, new Date()) : failOverDate ?? null;
};

export const formatDateToString = (date: Date | null | undefined, formatOutput = 'yyyyMMdd') => {
  if (date == null) {
    return null;
  }

  return dateFns.format(date, formatOutput);
};

export const formatTimeToDisplay = (stringInput?: string, formatOutput = 'HH:mm:ss', formatInput = 'yyyyMMddHHmmss', ignoreTimeZone?: boolean) => {
  try {
    if (!stringInput) {
      return '';
    }
    let time = dateFns.parse(stringInput, formatInput, new Date());
    if (ignoreTimeZone !== true) {
      time = dateFns.addHours(time, 7);
    }
    return dateFns.format(time, formatOutput);
  } catch (error) {
    return null;
  }
};
