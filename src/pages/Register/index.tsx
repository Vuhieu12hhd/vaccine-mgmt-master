import { Formik } from 'formik';
import React, { useState } from 'react';
import { TERipple } from 'tw-elements-react';
import * as yup from 'yup';
import TextInput from 'elements/TextInput';
import LoginBanner from 'assets/png/login_banner.png';
import { Link, useNavigate } from 'react-router-dom';
import { ROUTES } from 'routes/config';
import { register } from 'services/auth';
import { RegisterForm } from 'interfaces/models';
import { isBlank, setKey, showError } from 'utils';
import Loader from 'components/Loader';
import { ACCESS_TOKEN } from 'config/localStorage';
import './style.scss';

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const schema = yup.object().shape({
    email: yup.string().label('Email').required('Email không được để trống'),
    password: yup.string().label('Mật Khẩu').required('Mật khẩu không được để trống'),
    name: yup.string().label('Tên').required('Tên không được để trống'),
    address: yup.string().label('Địa chỉ').required('Địa chỉ không được để trống'),
    phoneNumber: yup.string().label('Số điện thoại').required('Số điện thoại không được để trống'),
    confirmPassword: yup
      .string()
      .label('xác nhận mật khẩu')
      .required('Không được để trống')
      .oneOf([yup.ref('password')], () => 'Mật khẩu không khớp'),
  });
  const onSubmit = async (values: RegisterForm & { confirmPassword?: string }) => {
    setLoading(true);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { confirmPassword, ...rest } = values;
    try {
      const data = await register(rest);
      const accessToken = data.result.accessToken;
      setKey(ACCESS_TOKEN, accessToken);

      navigate(ROUTES.VERIFY_OTP);
    } catch (error) {
      console.log(error);
      showError((error as Record<string, unknown>)?.message as string);
    }
    setLoading(false);
  };

  return (
    <section className="h-screen w-screen flex items-center justify-center  overflow-auto">
      <div className=" w-full px-24 py-24 ">
        <div className="g-6 flex h-full flex-wrap items-center justify-center lg:justify-between">
          <div className=" md:block hidden mb-12 md:mb-0 md:w-8/12 lg:w-6/12">
            <img src={LoginBanner} className="w-full" alt="Phone image" />
          </div>
          {/* <!-- Right column container with form --> */}
          <Loader active={loading} className="md:w-8/12 lg:ml-6 lg:w-5/12">
            <Formik initialValues={{ email: '', password: '', address: '', name: '', phoneNumber: '' }} onSubmit={onSubmit} validationSchema={schema}>
              {({ values, handleChange, handleBlur, handleSubmit, touched, errors }) => (
                <form className="bg-[#D6E3F3] rounded-md p-[2rem]" onSubmit={handleSubmit}>
                  <div className="text-5xl font-medium leading-tight text-center mb-[5rem] mt-[5rem]">ĐĂNG KÝ</div>
                  <div className="grid gap-5 grid-cols-1 md:grid-cols-2 mb-10">
                    <TextInput
                      type="text"
                      label="Email"
                      autoComplete="off"
                      aria-autocomplete="none"
                      value={values.email}
                      name="email"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      hasError={touched.email && !isBlank(errors.email)}
                      errorMessage={errors.email}
                    ></TextInput>
                    <TextInput
                      type="text"
                      label="Tên"
                      autoComplete="off"
                      aria-autocomplete="none"
                      value={values.name}
                      name="name"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      hasError={touched.name && !isBlank(errors.name)}
                      errorMessage={errors.name}
                    ></TextInput>
                    <TextInput
                      type="text"
                      label="Số điện thoại "
                      autoComplete="off"
                      aria-autocomplete="none"
                      value={values.phoneNumber}
                      name="phoneNumber"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      hasError={touched.phoneNumber && !isBlank(errors.phoneNumber)}
                      errorMessage={errors.phoneNumber}
                    ></TextInput>
                    <TextInput
                      type="text"
                      label="Địa chỉ"
                      autoComplete="off"
                      aria-autocomplete="none"
                      value={values.address}
                      name="address"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      hasError={touched.address && !isBlank(errors.address)}
                      errorMessage={errors.address}
                    ></TextInput>

                    {/* <!--Password input--> */}
                    <TextInput
                      name="password"
                      type="password"
                      label="Mật Khẩu"
                      autoComplete="new-password"
                      role="presentation"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.password}
                      hasError={touched.password && !isBlank(errors.password)}
                      errorMessage={errors.password}
                    ></TextInput>
                    <TextInput
                      name="confirmPassword"
                      type="password"
                      label="Mật khẩu xác nhận"
                      autoComplete="new-password"
                      role="presentation"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.confirmPassword ?? ''}
                      hasError={touched.confirmPassword && !isBlank(errors.confirmPassword)}
                      errorMessage={errors.confirmPassword}
                    ></TextInput>
                  </div>

                  {/* <!-- Submit button --> */}

                  <TERipple rippleColor="light" className="w-full mb-[70px]">
                    <button
                      type="submit"
                      className="inline-block w-full rounded bg-primary px-7 py-1.5 text-sm font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#007EA6] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
                    >
                      Đăng ký
                    </button>
                  </TERipple>
                  <div className="flex justify-center">
                    <div className="mr-[1rem] text-base">Bạn đã có tài khoản?</div>
                    <Link to={ROUTES.LOGIN} className="text-primary text-base">
                      Đăng nhập
                    </Link>
                  </div>
                </form>
              )}
            </Formik>
          </Loader>
        </div>
      </div>
    </section>
  );
};

export default Register;
