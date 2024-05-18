import * as yup from 'yup';
export const getCreateScheduleSchema = () => {
  return yup.object().shape({
    name: yup.string().label('Tên').required(),
    vaccineId: yup.string().label('vaccineId').required(),
    time: yup.string().label('Thời gian').required(),
  })
}

export const getCreateEmployeeSchema = () => {
  return yup.object().shape({
    name: yup.string().label('Tên').required(),
    email: yup.string().label('Email').required(),
    password: yup.string().label('Mật khẩu').required(),
    role: yup.string().label('Chức vụ').required(),
  })
}

export const getCreateProviderSchema = () => {
  return yup.object().shape({
    name: yup.string().label('Tên').required(),
  })
}