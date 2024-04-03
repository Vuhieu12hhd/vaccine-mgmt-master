import { METHOD, ROLE } from 'config';
import { request } from 'utils';
export const createSchedule = async (params: Record<string, unknown>) => {
  try {
    const res = await request('/api/v1/vaccinationSchedules', METHOD.POST, params);
    return res
  } catch (error) {
    return { status: 0, error }
  }
};

export const getScheduleById = async (id: string) => {
  try {
    const res = await request(`/api/v1/admin/vaccinationSchedules/${id}`, METHOD.GET);
    return res
  } catch (error) {
    return { status: 0, error }
  }
};

export const getScheduleCreated = async (params: Record<string, unknown>, role?: ROLE) => {
  try {
    const res = await request(role === ROLE.CUSTOMER ? '/api/v1/vaccinationSchedules' : '/api/v1/admin/vaccinationSchedules', METHOD.GET, params);
    return res;
  } catch (error) {
    return { status: 0, error }
  }
};

export const updateSchedule = async (params: Record<string, unknown>) => {
  try {
    const { id, ...rest } = params
    const res = await request(`/api/v1/vaccinationSchedules/${id}`, METHOD.PUT, rest);
    return res;
  } catch (error) {
    return { status: 0, error }
  }
};

export const getScheduleHistory = async (params: Record<string, unknown>, role?: ROLE) => {
  try {
    const res = await request(role == null || role === ROLE.CUSTOMER ? '/api/v1/vaccinationHistories' : '/api/v1/admin/vaccinationHistories', METHOD.GET, params);
    return res;
  } catch (error) {
    return { status: 0, error }
  }
};

export const updateHeathSurvey = async (params: Record<string, unknown>) => {
  const { id, ...rest } = params
  const res = await request(`/api/v1/admin/vaccinationSchedules/${id}/healthSurveyStatus`, METHOD.PUT, rest);
  return res;
};

export const createScheduleHistory = async (params: Record<string, unknown>) => {
  try {
    const res = await request('/api/v1/admin/vaccinationHistories', METHOD.POST, params);
    return res;
  } catch (error) {
    return { status: 0, error }
  }
};
export const updateStatusScheduleHistory = async (params: Record<string, unknown>) => {
  const { id, ...rest } = params
  const res = await request(`/api/v1/admin/vaccinationHistories/${id}/status`, METHOD.PUT, rest);
  return res;
};

export const payment = async (params: Record<string, unknown>) => {
  const { id, ...rest } = params
  try {
    const res = await request(`/api/v1/admin/vaccinationHistories/${id}/payment`, METHOD.POST, rest);
    return res;
  } catch (error) {
    return { status: 0, error }
  }
};
