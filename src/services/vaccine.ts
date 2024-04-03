import { METHOD } from 'config';
import { request } from 'utils/apiClient';

export const getAllVaccine = async (params?: Record<string, unknown>) => {
  return await request('/api/v1/vaccines', METHOD.GET, params);
};

export const getAllProvider = async (params?: Record<string, unknown>) => {
  return await request('/api/v1/vaccineProviders', METHOD.GET, params);
};

export const addProvider = async (params?: Record<string, unknown>) => {
  try {
    const res = await request('/api/v1/admin/vaccineProviders', METHOD.POST, params);
    return res;
  } catch (error) {
    return { status: 0, error }
  }
};
export const addVaccine = async (params?: Record<string, unknown>) => {
  try {
    const res = await request('/api/v1/admin/vaccines', METHOD.POST, params);
    return res;
  } catch (error) {
    return { status: 0, error }
  }
};

export const updateVaccine = async (params: Record<string, unknown>) => {
  try {
    const { id, ...rest } = params;
    const res = await request(`/api/v1/admin/vaccines/${id}`, METHOD.PUT, rest);
    return res;
  } catch (error) {
    return { status: 0, error }
  }
};

export const updateProvider = async (params: Record<string, unknown>) => {
  try {
    const { id, ...rest } = params;
    const res = await request(`/api/v1/admin/vaccineProviders/${id}`, METHOD.PUT, rest);
    return res;
  } catch (error) {
    return { status: 0, error }
  }
};
export const deleteProvider = async (params: Record<string, unknown>) => {
  try {
    const { id } = params;
    const res = await request(`/api/v1/admin/vaccineProviders/${id}`, METHOD.DELETE);
    return res;
  } catch (error) {
    return { status: 0, error }
  }
};

export const deleteVaccine = async (params: Record<string, unknown>) => {
  try {
    const { id } = params;
    const res = await request(`/api/v1/admin/vaccines/${id}`, METHOD.DELETE);
    return res;
  } catch (error) {
    return { status: 0, error }
  }
};

export const getHealthSurvey = async () => {
  return await request('/api/v1/healthSurveyTemplates', METHOD.GET);
};

