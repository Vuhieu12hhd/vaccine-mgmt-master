import { METHOD } from 'config';
import { request } from 'utils';


export const getUsers = async (params: Record<string, unknown>) => {
  try {
    const res = await request('/api/v1/admin/users', METHOD.GET, params);
    return res;
  } catch (error) {
    return { status: 0, error }
  }
};

export const createUser = async (params: Record<string, unknown>) => {
  try {
    const res = await request('/api/v1/admin/users', METHOD.POST, params);
    return res;
  } catch (error) {
    return { status: 0, error }
  }
};

export const updateUser = async (params: Record<string, unknown>) => {
  try {
    const { id, ...rest } = params;
    const res = await request(`/api/v1/admin/users/${id}`, METHOD.PUT, rest);
    return res;
  } catch (error) {
    return { status: 0, error }
  }
};

export const getChartData = async (params: Record<string, unknown>) => {
  try {
    const res = await request('/api/v1/admin/statistic', METHOD.GET, params);
    return res;
  } catch (error) {
    return { status: 0, error }
  }
};