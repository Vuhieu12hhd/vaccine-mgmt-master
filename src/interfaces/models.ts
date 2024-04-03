import { GENDER, ROLE } from 'config';

export interface RegisterForm {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
  address: string;
}



export interface HealthSurvey {
  id: number;
  title: string;
  checked?: boolean;
}

export interface UserInfo {
  address: string;
  name: string;
  phoneNumber: string;
  role: ROLE;
  id: number;
  active: boolean;
  email: string;
  gender: GENDER;
  isEmailVerified: boolean;
  dob?: string;
}

export interface SelectOption { label: string; value: string; extraData?: unknown }


export interface RestApiResponse {
  status: number;
  result?: unknown;
  error?: unknown
}