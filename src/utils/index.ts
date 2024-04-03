import { MapErrorCode } from 'config';
import { toast } from 'react-toastify';

export * from './apiClient';
/**
 * Kiểm tra 1 chuỗi ký tự có rỗng hay không 
 * vd: isBlank('') => return true; isBlank('abc') => return false
 * @param str chuỗi ký tự
 * @returns boolean
 */
export const isBlank = (str?: string): boolean => {
  return str == null || /^\s*$/.test(str);
};


/**
 * sinh 1 chuỗi ngẫu nhiên không trùng lặp
 * @param a 
 * @returns string
 */
export const uuid = (a?: number): string => {
  if (a != null) {
    return (a ^ ((Math.random() * 16) >> (a / 4))).toString(16);
  } else {
    // eslint-disable-next-line
    //@ts-ignore
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, uuid);
  }
};


/**
 * 
 * @param value giá trị của number
 * @param digit số kí tự thập phân vd digit = 2   2.01
 * @param offsetRate nó sẽ lấy value chia cho thằng offsetRate
 * @param toFixed Có làm tròn hay không
 * @param failoverValue giá trị trả về khi null
 * @param isSkipRound 
 * @param floor // làm tròn xuống
 * @returns 
 */
export const formatNumber = (
  value?: number,
  digit?: number,
  offsetRate?: number,
  toFixed?: boolean,
  failoverValue = '0',
  isSkipRound?: boolean,
  floor?: boolean
) => {
  if (value == null || isNaN(value)) {
    return failoverValue;
  }

  let data = value;

  if (offsetRate != null) {
    data = value / offsetRate;
  }

  let tempValueString = data.toString();
  let prefix = '';

  if (tempValueString[0] === '-') {
    prefix = '-';
    tempValueString = tempValueString.substring(1, tempValueString.length);
  }

  try {
    const tempValue = Number(tempValueString);
    let fractionDigit = 0;
    if (digit != null) {
      fractionDigit = digit;
    }
    if (fractionDigit > 0) {
      const mainNum = Number(`${Number(tempValue.toString())}e+${fractionDigit}`);
      const temp = +`${isSkipRound ? mainNum : floor ? Math.floor(mainNum) : Math.round(mainNum)}e-${fractionDigit}`;
      let fractionString = '';
      let i = '';
      if (toFixed === true) {
        i = temp.toFixed(fractionDigit);
        fractionString = i.substring(i.indexOf('.'), i.length);
        i = i.substring(0, i.indexOf('.'));
      } else {
        i = temp.toString();
        if (temp.toString().indexOf('.') >= 1) {
          fractionString = temp.toString().substring(temp.toString().indexOf('.'), temp.toString().length);
          i = temp.toString().substring(0, temp.toString().indexOf('.'));
        }
      }
      return prefix + i.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + fractionString;
    } else {
      const mainNum = Number(`${Number(tempValue.toString())}e+${fractionDigit}`);
      const temp = +`${isSkipRound ? mainNum : floor ? Math.floor(mainNum) : Math.round(mainNum)}e-${fractionDigit}`;
      const i = temp.toString();
      return prefix + i.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
  } catch {
    return '';
  }
};

/**
 * // lấy data từ local storage
 * @param key 
 * @returns string | null
 */
export const getKey = <T>(key: string): T | null => {
  try {
    let value = null;
    if (window.localStorage != null) {
      value = window.localStorage.getItem(key);
    }
    if (value == null) {
      return null;
    }

    return JSON.parse(value);
  } catch (error) {
    return null;
  }
};

/**
 * // gán  data vào  local storage
 * @param key 
 * @param value 
 * @returns string | null
 */
export const setKey = <T>(key: string, value: T): void => {
  try {
    if (value != null) {
      if (window.localStorage != null) {
        window.localStorage.setItem(key, JSON.stringify(value));
      }
    }
  } catch (error) {
    return;
  }
};

/**
 * Xóa local storage
 * @param key 
 * @returns 
 */
export const removeKey = (key: string): void => {
  try {
    if (window.localStorage != null) {
      window.localStorage.removeItem(key);
    }
  } catch (error) {
    return;
  }
};


/**
 * show thông báo thành công
 * @param message 
 */
export const showSuccess = (message: string) => {
  toast(message, { type: 'success' })
}

/**
 * show thông báo thất bại
 * @param message 
 */
export const showError = (message: string) => {
  const text = MapErrorCode[message] ?? message;
  toast(text, { type: 'error' })
}