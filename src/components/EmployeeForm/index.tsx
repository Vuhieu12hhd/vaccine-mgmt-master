import Loader from 'components/Loader';
import { GENDER, ROLE } from 'config';
import TextInput from 'elements/TextInput';
import { Formik } from 'formik';
import React, { useState } from 'react';
import { isBlank, showError, showSuccess } from 'utils';
import { getCreateEmployeeSchema } from 'config/validator';
import { createUser } from 'services/user';
import Select from 'elements/Select';
interface EmployeeData {
  name?: string;
  role?: string;
  gender?: string;
  email?: string;
  password?: string;
  phoneNumber?: string;
}

const RoleOptions = [
  {
    label: 'Bác sỹ',
    value: ROLE.DOCTOR,
  },
  {
    label: 'Quản kho',
    value: ROLE.WAREHOUSE_MANAGER,
  },
];

/**
 * Form tạo nhân viên
 * @returns
 */
const EmployeeForm = (props: { onSuccess(): void }) => {
  const [loading, setLoading] = useState(false);

  const onSubmit = (values: EmployeeData) => {
    const payload = {
      ...values,
    };
    requestAdd(payload);
  };

  const requestAdd = async (payload: Record<string, unknown>) => {
    setLoading(true);
    const res = await createUser(payload);
    if (res.status) {
      showSuccess('Thêm thành công');
      props.onSuccess();
    } else {
      showError((res.error as Record<string, unknown>)?.message as string);
    }
    setLoading(false);
  };

  const schema = getCreateEmployeeSchema();

  return (
    <Loader active={loading} className="w-full p-5 min-h-full">
      <div className="w-full m-auto max-w-screen-xl">
        <Formik
          validationSchema={schema}
          onSubmit={onSubmit}
          initialValues={{ name: '', phoneNumber: '', gender: GENDER.FEMALE, password: '', role: ROLE.DOCTOR }}
        >
          {({ values, isValid, handleSubmit, handleChange, handleBlur, setFieldValue, errors, touched }) => (
            <form onSubmit={handleSubmit} className="max-w-screen-lg m-auto">
              <div className="inputs grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                <TextInput
                  type="text"
                  label="Họ và tên"
                  className="mb"
                  autoComplete="off"
                  aria-autocomplete="none"
                  placeholder="Nguyen Van A"
                  value={values.name}
                  name="name"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  autoFocus
                  hasError={touched.name && !isBlank(errors.name)}
                  errorMessage={errors.name}
                ></TextInput>
                <TextInput
                  type="text"
                  label="Số điện thoại"
                  className="mb"
                  autoComplete="off"
                  aria-autocomplete="none"
                  value={values.phoneNumber}
                  name="phoneNumber"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  autoFocus
                  hasError={touched.phoneNumber && !isBlank(errors.phoneNumber)}
                  errorMessage={errors.phoneNumber}
                ></TextInput>

                <div>
                  <label className={`block text-sm font-medium leading-6 text-gray-900 `}>Giới tính</label>
                  <div className="flex items-center justify-around">
                    <div className="mb-[0.125rem] mt-2 mr-5 flex items-center min-h-[1.5rem] pl-[1.5rem]">
                      <input
                        className="relative float-left -ml-[1.5rem] mr-1 mt-0.5 h-5 w-5 appearance-none rounded-full border-2 border-solid border-neutral-300 before:pointer-events-none before:absolute before:h-4 before:w-4 before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] after:absolute after:z-[1] after:block after:h-4 after:w-4 after:rounded-full after:content-[''] checked:border-primary checked:before:opacity-[0.16] checked:after:absolute checked:after:left-1/2 checked:after:top-1/2 checked:after:h-[0.625rem] checked:after:w-[0.625rem] checked:after:rounded-full checked:after:border-primary checked:after:bg-primary checked:after:content-[''] checked:after:[transform:translate(-50%,-50%)] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:outline-none focus:ring-0 focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:border-primary checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#007EA6] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] dark:border-neutral-600 dark:checked:border-primary dark:checked:after:border-primary dark:checked:after:bg-primary dark:focus:before:shadow-[0px_0px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:border-primary dark:checked:focus:before:shadow-[0px_0px_0px_13px_#007EA6]"
                        type="radio"
                        name="gender"
                        value={GENDER.MALE}
                        onChange={handleChange}
                        id="radioDefault01"
                      />
                      <label className="mt-px inline-block pl-[0.15rem] hover:cursor-pointer" htmlFor="radioDefault01">
                        Nam
                      </label>
                    </div>
                    <div className="mb-[0.125rem] flex items-center min-h-[1.5rem] pl-[1.5rem]">
                      <input
                        className="relative float-left -ml-[1.5rem] mr-1 mt-0.5 h-5 w-5 appearance-none rounded-full border-2 border-solid border-neutral-300 before:pointer-events-none before:absolute before:h-4 before:w-4 before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] after:absolute after:z-[1] after:block after:h-4 after:w-4 after:rounded-full after:content-[''] checked:border-primary checked:before:opacity-[0.16] checked:after:absolute checked:after:left-1/2 checked:after:top-1/2 checked:after:h-[0.625rem] checked:after:w-[0.625rem] checked:after:rounded-full checked:after:border-primary checked:after:bg-primary checked:after:content-[''] checked:after:[transform:translate(-50%,-50%)] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:outline-none focus:ring-0 focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:border-primary checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#007EA6] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] dark:border-neutral-600 dark:checked:border-primary dark:checked:after:border-primary dark:checked:after:bg-primary dark:focus:before:shadow-[0px_0px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:border-primary dark:checked:focus:before:shadow-[0px_0px_0px_13px_#007EA6]"
                        type="radio"
                        value={GENDER.FEMALE}
                        name="gender"
                        onChange={handleChange}
                        id="radioDefault02"
                        defaultChecked
                      />
                      <label className="mt-px inline-block pl-[0.15rem] hover:cursor-pointer" htmlFor="radioDefault02">
                        Nữ
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="inputs grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                {/* <TextInput
                  type="text"
                  label="Chức vụ"
                  className=""
                  autoComplete="off"
                  aria-autocomplete="none"
                  value={values.role}
                  name="role"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  autoFocus
                  hasError={touched.role && !isBlank(errors.role)}
                  errorMessage={errors.role}
                ></TextInput> */}
                <Select
                  label="Chức vụ"
                  options={RoleOptions}
                  onChange={value => {
                    setFieldValue('role', value);
                  }}
                  activeValue={values.role}
                />
                <TextInput
                  type="text"
                  label="Tên đăng nhập"
                  className=""
                  autoComplete="off"
                  aria-autocomplete="none"
                  value={values.email}
                  name="email"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  autoFocus
                  hasError={touched.email && !isBlank(errors.email)}
                  errorMessage={errors.email}
                ></TextInput>
                <TextInput
                  type="text"
                  label="Mật khẩu"
                  className=""
                  autoComplete="off"
                  aria-autocomplete="none"
                  value={values.password}
                  name="password"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  autoFocus
                  hasError={touched.password && !isBlank(errors.password)}
                  errorMessage={errors.password}
                ></TextInput>
              </div>

              <div className="buttons w-full flex justify-center mt-10 ">
                <button
                  type="submit"
                  disabled={!isValid}
                  className="inline-block rounded bg-primary px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#007EA6] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
                >
                  Xác nhận
                </button>
              </div>
            </form>
          )}
        </Formik>
      </div>
    </Loader>
  );
};

export default EmployeeForm;
