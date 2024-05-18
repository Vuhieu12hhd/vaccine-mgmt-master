export const FETCH_COUNT = 30;

export enum METHOD {
  GET = 'get',
  POST = 'post',
  PUT = 'put',
  DELETE = 'delete',
}


export enum GENDER {
  MALE = 'MALE',
  FEMALE = 'FEMALE'
}

export enum ROLE {
  ADMIN = 'ADMIN',
  CUSTOMER = 'CUSTOMER',
  DOCTOR = 'DOCTOR',
  WAREHOUSE_MANAGER = 'WAREHOUSE_MANAGER'
}


export const mapRole: Record<string, string> = {
  [ROLE.ADMIN]: 'Admin',
  [ROLE.DOCTOR]: 'Bác sỹ',
  [ROLE.CUSTOMER]: 'Khách hàng',
  [ROLE.WAREHOUSE_MANAGER]: 'Nhân viên',
};


export const MapErrorCode: Record<string, string> = {
  BAD_REQUEST: 'Bad request',
  UNAUTHORIZED: 'Không có quyền',
  FORBIDDEN: 'Forbidden',
  NOT_FOUND: 'Không tìm thấy api',
  TOO_MANY_REQUESTS: 'Too many request',
  INTERNAL_SERVER_ERROR: 'Lỗi hệ thống',
  USER_NOT_FOUND: 'Không tìm thấy user',
  WRONG_PASSWORD: 'Sai mật khẩu',
  USER_EXISTS: 'User đã tồn tại',
  USER_NAME_EXIST: 'Username đã tồn tại',
  EMAIL_EXIST: 'Email đã tồn tại',
  PHONE_NUMBER_EXIST: 'Số điện thoại đã tồn tại',
  EMAIL_IS_NOT_VERIFIED: 'Email chưa được xác thực',
  EMAIL_IS_VERIFIED: 'Email đã được xác thực',
  USER_INACTIVE: 'User không hoạt động',
  USER_LOCKED: 'User đã khóa',
  MONITOR_USER_NOT_FOUND: 'Không tìm thấy thông tin user phân việc',
  MONITOR_USER_NOT_A_DOCTOR: 'Phân việc cho user không phải là bác sĩ',
  VACCINE_PROVIDER_NOT_FOUND: 'Nhà cung cấp vaccine không tìm thấy',
  VACCINE_PROVIDER_NAME_EXIST: 'Tên nhà cung cấp vaccine đã tồn tại',
  VACCINE_NOT_FOUND: 'Vaccine không tìm thấy',
  VACCINE_EXIST: 'Vaccine đã tồn tại',
  VACCINE_NUMBER_RUN_OUT: 'Đã hết vaccine trong kho',
  HEALTH_SURVEY_HISTORY_NOT_FOUND: 'Không tìm thấy thông tin khảo sát',
  VACCINATION_SCHEDULE_NOT_FOUND: 'Không tìm thấy lịch đặt tiêm',
  USER_ALREADY_EXIST_VACCINATION_SCHEDULE: 'User đã đăng kí lịch đặt tiêm',
  VERIFICATION_CODE_NOT_FOUND: 'Mã xác thực không tìm thấy',
  VERIFICATION_CODE_INVALID: 'Loại xác thực không hợp lệ',
  VERIFICATION_CODE_VERIFIED: 'Mã đã được xác thực',
  VERIFICATION_CODE_EXPIRED: 'Mã xác thực đã hết hạn',
  VERIFICATION_CODE_INCORRECT: 'Mã xác thực không đúng',
  VACCINATION_HISTORY_NOT_FOUND: 'Không tìm thấy lịch sử tiêm',
  VACCINATION_PAID: 'Đợt tiêm đã được thanh toán',
}