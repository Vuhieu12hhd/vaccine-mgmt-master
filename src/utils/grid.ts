import { ValueFormatterParams } from 'ag-grid-community';
import { formatNumber } from 'utils';
import { formatDateToString, formatTimeToDisplay } from './dateTime';

export const integerFormatter = (params: ValueFormatterParams) => {
  return formatNumber(params.value, 0, undefined, false, params.value ?? '');
};

export const dateTimeFormatter = (param: ValueFormatterParams) => {
  const time = formatTimeToDisplay(param.value, 'dd/MM/yyyy HH:mm:ss', 'yyyyMMddHHmmss');
  if (time) {
    return time;
  }
  return param.value;
};

export const dateFormatter = (param: ValueFormatterParams) => {
  const time = formatTimeToDisplay(param.value, 'dd/MM/yyyy', 'yyyyMMdd');
  if (time) {
    return time;
  }
  if (param.value === '00000000') {
    return '00/00/0000';
  }
  return param.value;
};

export const dateTimeFormatterFromTimestamp = (params: Partial<ValueFormatterParams>) => {
  if (params.value) {
    const time = formatDateToString(new Date(params.value), 'HH:mm:ss dd/MM/yyyy');
    if (time) {
      return time;
    }
  }

  return params.value;
}

export const dateFormatterFromTimestamp = (params: Partial<ValueFormatterParams>) => {
  if (params.value) {
    const time = formatDateToString(new Date(params.value), 'dd/MM/yyyy');
    if (time) {
      return time;
    }
  }

  return params.value;
}