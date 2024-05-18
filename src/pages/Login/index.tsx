import { Formik } from 'formik';
import React, { useState } from 'react';
import { TERipple } from 'tw-elements-react';
import TextInput from 'elements/TextInput';
import LoginBanner from 'assets/png/login_banner.png';
import { Link, useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import { ROUTES } from 'routes/config';
import Loader from 'components/Loader';
import './style.scss';
import { isBlank, setKey, showError } from 'utils';
import { login } from 'services/auth';
import { ACCESS_TOKEN } from 'config/localStorage';
import { formatDateToString } from 'utils/dateTime';
import { MapErrorCode } from 'config';

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const schema = yup.object().shape({
    email: yup.string().label('Email').required('Email không được để trống'),
    password: yup.string().label('Mật Khẩu').required('Mật khẩu không được để trống'),
  });

  const handleLogin = (values: { email: string; password: string }) => {
    setLoading(true);
    login(values)
      .then(data => {
        console.log(data);
        const accessToken = data.result.accessToken;
        setKey(ACCESS_TOKEN, accessToken);
        navigate('/');
      })
      .catch((error: { message?: string, details: { wrongPasswordCount?: number; lockTo: string; lockReason: string } }) => {
        console.log(error);
        let message = (error as Record<string, unknown>)?.message as string
        if (message === 'WRONG_PASSWORD' && error.details.wrongPasswordCount) {
          message = `Bạn đã nhập sai mật khẩu ${error.details.wrongPasswordCount} lần. Bạn còn ${5 - error.details.wrongPasswordCount} lần nhập sai trước khi tài khoản bị khóa`
        } else if (message === 'USER_LOCKED') {
          message = `Tài khoản của bạn bị khóa đến: ${formatDateToString(new Date(error.details.lockTo), 'HH:mm:ss dd/MM/yyyy')} do ${MapErrorCode[error.details.lockReason]}`
        }
        showError(message);
      })
      .finally(() => {
        setLoading(false);
      });
  };



  return (
    <section className="h-screen w-screen flex items-center justify-center  overflow-auto">
      <div className=" w-full px-6 py-24 max-w-screen-lg">
        <div className="g-6 flex h-full flex-wrap items-center justify-center lg:justify-between">
          {/* <!-- Left column container with background--> */}
          <div className=" md:block hidden mb-12 md:mb-0 md:w-8/12 lg:w-6/12">
            <img src={LoginBanner} className="w-full" alt="Phone image" />
          </div>

          {/* <!-- Right column container with form --> */}
          <Loader active={loading} className="md:w-8/12 lg:ml-6 lg:w-5/12">
            <Formik initialValues={{ email: '', password: '' }} onSubmit={handleLogin} validationSchema={schema}>
              {({ values, handleChange, handleBlur, handleSubmit, errors, touched }) => (
                <form className="bg-[#D6E3F3] rounded-md p-[2rem]" onSubmit={handleSubmit}>
                  {/* <!-- Email input --> */}
                  <div className="text-5xl font-medium leading-tight text-center mb-[5rem] mt-[5rem]">Đăng nhập</div>
                  <TextInput
                    type="text"
                    label="Email"
                    className="mb-5"
                    inputClass="sm:text-base"
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

                  {/* <!--Password input--> */}
                  <TextInput
                    name="password"
                    type="password"
                    label="Mật Khẩu"
                    className="mb-5"
                    autoComplete="new-password"
                    role="presentation"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.password}
                    hasError={touched.password && !isBlank(errors.password)}
                    errorMessage={errors.password}
                  ></TextInput>

                  {/* <!-- Remember me checkbox --> */}
                  <div className="mb-10 flex items-center justify-between">
                    <div className="mb-[0.125rem] flex items-center min-h-[1.5rem] pl-[1.5rem]">
                      <input
                        className="relative float-left -ml-[1.5rem] mr-[6px]  h-[1.125rem] w-[1.125rem] appearance-none rounded-[0.25rem] border-[0.125rem] border-solid border-neutral-300 outline-none before:pointer-events-none before:absolute before:h-[0.875rem] before:w-[0.875rem] before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] checked:border-primary checked:bg-primary checked:before:opacity-[0.16] checked:after:absolute checked:after:-mt-px checked:after:ml-[0.25rem] checked:after:block checked:after:h-[0.8125rem] checked:after:w-[0.375rem] checked:after:rotate-45 checked:after:border-[0.125rem] checked:after:border-l-0 checked:after:border-t-0 checked:after:border-solid checked:after:border-white checked:after:bg-transparent checked:after:content-[''] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:transition-[border-color_0.2s] focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-[0.875rem] focus:after:w-[0.875rem] focus:after:rounded-[0.125rem] focus:after:content-[''] checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#007EA6] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:after:-mt-px checked:focus:after:ml-[0.25rem] checked:focus:after:h-[0.8125rem] checked:focus:after:w-[0.375rem] checked:focus:after:rotate-45 checked:focus:after:rounded-none checked:focus:after:border-[0.125rem] checked:focus:after:border-l-0 checked:focus:after:border-t-0 checked:focus:after:border-solid checked:focus:after:border-white checked:focus:after:bg-transparent dark:border-neutral-600 dark:checked:border-primary dark:checked:bg-primary dark:focus:before:shadow-[0px_0px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:before:shadow-[0px_0px_0px_13px_#007EA6]"
                        type="checkbox"
                        value=""
                        id="exampleCheck3"
                        defaultChecked
                      />
                      <label className="inline-block text-sm leading-sm pl-[0.15rem] hover:cursor-pointer" htmlFor="exampleCheck3">
                        Nhớ mật khẩu
                      </label>
                    </div>
                  </div>

                  {/* <!-- Submit button --> */}

                  <TERipple rippleColor="light" className="w-full mb-[70px]">
                    <button
                      type="submit"
                      className="inline-block w-full rounded bg-primary px-7 py-1.5 text-sm font-medium uppercase leading-sm text-white shadow-[0_4px_9px_-4px_#007EA6] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
                    >
                      Đăng nhập
                    </button>
                  </TERipple>
                  <div className="flex justify-center text-base">
                    <div className="mr-[1rem]">Bạn chưa có tài khoản?</div>
                    <Link to={ROUTES.REGISTER} className="text-primary">
                      Đăng ký
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

export default Login;
