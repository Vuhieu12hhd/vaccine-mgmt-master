import Loader from 'components/Loader';
import { Formik } from 'formik';
import * as yup from 'yup';
import React, { useEffect, useRef, useState } from 'react';
import TextInput from 'elements/TextInput';
import { isBlank, showError, showSuccess, uuid } from 'utils';
import { TERipple } from 'tw-elements-react';
import OtpInput from 'react-otp-input';
import { confirmChangePassword, requestChangePassword } from 'services/auth';

const PasswordForm = (props: { onHide(): void }) => {
  const [loading, setLoading] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [expTime, setExpTime] = useState(0);
  const transactionId = useRef(uuid());
  const formValues = useRef<Record<string, unknown>>({});
  const timer = useRef<NodeJS.Timer | null>();
  useEffect(() => {
    return () => {
      if (timer.current) {
        clearInterval(timer.current);
      }
    };
  }, []);
  const schema = yup.object().shape({
    password: yup.string().label('Mật Khẩu').required('Mật khẩu không được để trống'),
    newPassword: yup
      .string()
      .label('Mật Khẩu')
      .required('Mật khẩu không được để trống')
      .notOneOf([yup.ref('password')], 'Mật khẩu mới không được trùng mật khẩu cũ'),
    confirmPassword: yup
      .string()
      .label('xác nhận mật khẩu')
      .required('Không được để trống')
      .oneOf([yup.ref('newPassword')], () => 'Mật khẩu không khớp'),
  });
  const onSubmit = async (values: Record<string, unknown>) => {
    formValues.current = values;
    setLoading(true);
    if (timer.current) {
      clearInterval(timer.current);
    }
    const res = await requestChangePassword({
      currentPassword: values.password,
    });
    if (res.status) {
      setExpTime((res.result as Record<string, number>).expirationTime);
      transactionId.current = (res.result as Record<string, string>).transactionId;
      timer.current = setInterval(() => {
        setExpTime(prev => prev - 1);
        if (expTime <= 0) {
          if (timer.current) {
            clearInterval(timer.current);
          }
          timer.current = null;
        }
      }, 1000);
      setShowOtp(true);
    } else {
      showError((res.error as Record<string, unknown>)?.message as string);
    }
    setLoading(false);
  };
  const verifyEmail = async (values: { otpValue: string }) => {
    try {
      await confirmChangePassword({ code: values.otpValue, transactionId: transactionId.current, newPassword: formValues.current.newPassword });
      showSuccess('Đổi mật khẩu thành công');
      props.onHide();
    } catch (error) {
      showError((error as Record<string, string>).message);
    }
  };

  if (showOtp) {
    return (
      <Loader active={loading} className="w-full flex items-start   justify-center  overflow-auto">
        <Formik onSubmit={verifyEmail} initialValues={{ otpValue: '' }}>
          {({ values, setFieldValue, handleSubmit }) => (
            <form className="flex flex-col items-center mt-20" onSubmit={handleSubmit}>
              <div className="header-text text-3xl mb-10">Nhập mã xác thực</div>
              <div className="header-text text-gray-600 text-base mb-5">Vui lòng nhập mã OTP đã được gửi đến email để hoàn tất đăng ký tài khoản</div>
              <div className="input mt-5 mb-10">
                <OtpInput
                  value={values.otpValue}
                  onChange={otp => {
                    setFieldValue('otpValue', otp);
                    if (otp.length === 6) {
                      handleSubmit();
                    }
                  }}
                  numInputs={6}
                  renderSeparator={<span className="mx-2">-</span>}
                  inputStyle="ring-gray-300 aspect-square border-primary otp-input"
                  renderInput={props => <input {...props} />}
                />
              </div>
              <div className="header-text text-gray-600 text-base mb-5">
                Hiệu lực của mã OTP : <strong>{expTime}</strong> giây
              </div>
              <div className="header-text text-gray-900 text-base mb-5 font-semibold cursor-pointer" onClick={() => onSubmit(formValues.current)}>
                Gửi lại mã
              </div>
              <TERipple rippleColor="light" className="w-full mt-5">
                <button
                  type="button"
                  onClick={() => setShowOtp(false)}
                  className="inline-block w-full rounded bg-primary px-7 py-1.5 text-sm font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#007EA6] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
                >
                  Quay lại
                </button>
              </TERipple>
            </form>
          )}
        </Formik>
      </Loader>
    );
  }

  return (
    <Loader active={loading} className="w-full">
      <Formik initialValues={{ newPassword: '', password: '', confirmPassword: '' }} onSubmit={onSubmit} validationSchema={schema}>
        {({ values, handleChange, handleBlur, handleSubmit, touched, errors }) => (
          <form className=" rounded-md " onSubmit={handleSubmit}>
            <div className="flex flex-col w-full">
              {/* <!--Password input--> */}
              <TextInput
                name="password"
                type="password"
                label="Mật Khẩu hiện tại"
                autoComplete="new-password"
                className="mb-5"
                role="presentation"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.password}
                hasError={touched.password && !isBlank(errors.password)}
                errorMessage={errors.password}
              ></TextInput>
              <TextInput
                name="newPassword"
                type="password"
                className="mb-5"
                label="Mật Khẩu mới"
                autoComplete="new-password"
                role="presentation"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.newPassword}
                hasError={touched.newPassword && !isBlank(errors.newPassword)}
                errorMessage={errors.newPassword}
              ></TextInput>
              <TextInput
                name="confirmPassword"
                type="password"
                className="mb-5"
                label="Xác nhận mật khẩu"
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

            <TERipple rippleColor="light" className="w-full mt-5">
            <button
                type="submit"
                className="inline-block w-full rounded px-7 py-1.5 text-sm font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_rgba(32,189,189,0.4)] transition duration-150 ease-in-out hover:shadow-[0_8px_18px_-4px_rgba(32,189,189,0.5)] hover:bg-[#0F9191]"
                style={{ backgroundColor: '#20BDBD' }}
              >
                lƯU MẬT KHẨU
              </button>
            </TERipple>
          </form>
        )}
      </Formik>
    </Loader>
  );
};

export default PasswordForm;
