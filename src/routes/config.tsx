import React from 'react';
import VaccineList from 'components/VaccineList';
import ScheduleHistory from 'components/ScheduleHistory';
import Overview from 'components/Overview';
import CreateSchedule from 'components/CreateSchedule';
import UserManagement from 'components/UserManagement';
import ProviderManagement from 'components/ProviderManagement';
import { ROLE } from 'config';
import { getKey, removeKey } from 'utils';
import { ACCESS_TOKEN } from 'config/localStorage';
import { verifyAccessToken } from 'services/auth';
import { redirect } from 'react-router-dom';
import ScheduleDetail from 'components/ScheduleDetail';

export enum ROUTES {
  LOGIN = '/login',
  VERIFY_OTP = '/verify-email',
  REGISTER = '/register',
  FORGOT_PASSWORD = '/forgot-password',
  SCHEDULE_FORM = '/schedule-form',
  SCHEDULE_FORM_ADMIN = '/schedule-form-admin',
  SCHEDULE_HISTORY = '/schedule-history',
  VACCINE_MANAGEMENT = '/vaccine-management',
  CUSTOMER_MANAGEMENT = '/customer-management',
  EMPLOYEE_MANAGEMENT = '/employee-management',
  PROVIDER_MANAGEMENT = '/provider-management',
  SCHEDULE_DETAIL = '/schedule-detail',
}
const loader = async () => {
  //lấy token
  const token = getKey(ACCESS_TOKEN);
  if (token) {
    try {
      // call api để verify token
      const res = await verifyAccessToken();
      const user = res.result.user;
      // nếu user chưa verify email otp -> chuyển hướng nó về màn verify
      if (!user.isEmailVerified) {
        return redirect(ROUTES.VERIFY_OTP);
      }
      // cho phép vào cái route này
      return user;
    } catch (error) {
      // token k hợp lệ - xóa token k hợp lệ đi -> chuyển hướng qua màn login
      removeKey(ACCESS_TOKEN);
      return redirect(ROUTES.LOGIN);
    }
  }
  // token null -> chưa đăng nhập -? chuyển hướng về đăng nhập
  return redirect(ROUTES.LOGIN);
};
export const HomeNav = [
  {
    path: '/',
    element: <Overview />,
    label: '',
    roles: [ROLE.ADMIN, ROLE.CUSTOMER, ROLE.DOCTOR, ROLE.WAREHOUSE_MANAGER],
    loader,
  },
  {
    path: ROUTES.SCHEDULE_FORM,
    element: <CreateSchedule key={ROUTES.SCHEDULE_FORM} />,
    label: 'ĐĂNG KÝ TIÊM',
    roles: [ROLE.CUSTOMER],
    loader,
  },
  {
    path: ROUTES.SCHEDULE_FORM_ADMIN,
    element: <CreateSchedule key={ROUTES.SCHEDULE_FORM_ADMIN} />,
    label: 'LỊCH HẸN',
    roles: [ROLE.ADMIN, ROLE.DOCTOR],
    loader,
  },
  {
    path: ROUTES.SCHEDULE_HISTORY,
    element: <ScheduleHistory />,
    label: 'LỊCH SỬ TIÊM',
    roles: [ROLE.CUSTOMER],
    loader,
  },
  {
    path: ROUTES.SCHEDULE_HISTORY,
    element: <ScheduleHistory />,
    label: 'LỊCH SỬ',
    roles: [ROLE.DOCTOR, ROLE.ADMIN, ROLE.WAREHOUSE_MANAGER],
    loader,
  },
  {
    path: ROUTES.CUSTOMER_MANAGEMENT,
    element: <UserManagement key={ROUTES.CUSTOMER_MANAGEMENT} title="Khách Hàng" type="CUSTOMER" />,
    label: 'KHÁCH HÀNG',
    roles: [ROLE.ADMIN, ROLE.DOCTOR],
    loader,
  },
  {
    path: ROUTES.EMPLOYEE_MANAGEMENT,
    element: <UserManagement key={ROUTES.EMPLOYEE_MANAGEMENT} title="Nhân viên" type="EMPLOYEE" />,
    label: 'NHÂN VIÊN',
    roles: [ROLE.ADMIN],
    loader,
  },
  {
    path: ROUTES.VACCINE_MANAGEMENT,
    element: <VaccineList />,
    label: 'DANH MỤC VACCINE',
    roles: [ROLE.ADMIN, ROLE.CUSTOMER, ROLE.DOCTOR, ROLE.WAREHOUSE_MANAGER],
    loader,
  },
  {
    path: ROUTES.PROVIDER_MANAGEMENT,
    element: <ProviderManagement />,
    label: 'NHÀ CUNG CẤP',
    roles: [ROLE.WAREHOUSE_MANAGER],
    loader,
  },
  {
    path: `${ROUTES.SCHEDULE_DETAIL}/:scheduleId`,
    element: <ScheduleDetail />,
    label: '',
    roles: [ROLE.ADMIN, ROLE.DOCTOR],
    loader,
  },
];
