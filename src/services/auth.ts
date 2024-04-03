import { METHOD } from 'config';
import { RegisterForm, RestApiResponse } from 'interfaces/models';
import { request } from 'utils';

export const login = async (params: { email: string; password: string }) => {
  return await request('/api/v1/login', METHOD.POST, params);
};

export const register = async (params: RegisterForm) => {
  return await request('/api/v1/register', METHOD.POST, params as unknown as Record<string, unknown>);
};

export const verifyAccessToken = async () => {
  return await request('/api/v1/verifyAccessToken', METHOD.POST);
};

export const requestVerifyEmail = async (): Promise<RestApiResponse> => {
  try {
    const res = await request('/api/v1/users/me/requestVerifyEmail', METHOD.POST);
    return res
  } catch (error) {
    return { status: 0, error }
  }
};

export const requestChangePassword = async (params: Record<string, unknown>): Promise<RestApiResponse> => {
  try {
    const res = await request('/api/v1/users/me/requestChangePassword', METHOD.POST, params);
    return res
  } catch (error) {
    return { status: 0, error }
  }
};
export const confirmChangePassword = async (params: Record<string, unknown>): Promise<RestApiResponse> => {
  try {
    const res = await request('/api/v1/users/me/confirmChangePassword', METHOD.POST, params);
    return res
  } catch (error) {
    return { status: 0, error }
  }
};

export const confirmVerifyEmail = async (params: Record<string, unknown>) => {
  return await request('/api/v1/users/me/confirmVerifyEmail', METHOD.POST, params)
}


export const updateProfile = async (params: Record<string, unknown>): Promise<RestApiResponse> => {
  try {
    const res = await request('/api/v1/users/me/info', METHOD.PUT, params);
    return res
  } catch (error) {
    return { status: 0, error }
  }
};