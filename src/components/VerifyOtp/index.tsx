import { Formik } from 'formik';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from 'routes/config';
import { confirmVerifyEmail, requestVerifyEmail } from 'services/auth';
import { removeKey, showError, showSuccess, uuid } from 'utils';
import OtpInput from 'react-otp-input';
import { ACCESS_TOKEN } from 'config/localStorage';
import './style.scss';
import Loader from 'components/Loader';

const VerifyOtp = () => {
  const navigator = useNavigate();
  // const user = useLoaderData();
  const [expTime, setExpTime] = useState(0);
  const [loading, setLoading] = useState(false);
  const timer = useRef<NodeJS.Timer | null>();
  const transactionId = useRef(uuid());
  useEffect(() => {
    genOtp();
    return () => {
      if (timer.current) {
        clearInterval(timer.current);
      }
    };
  }, []);

  const genOtp = async () => {
    setLoading(true);
    if (timer.current) {
      clearInterval(timer.current);
    }
    const res = await requestVerifyEmail();
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
    } else {
      removeKey(ACCESS_TOKEN);
      navigator(ROUTES.LOGIN);
    }
    setLoading(false);
  };

  const verifyEmail = async (values: { otpValue: string }) => {
    try {
      await confirmVerifyEmail({ code: values.otpValue, transactionId: transactionId.current });
      showSuccess('Xác nhận email thành công');
      navigator('/');
    } catch (error) {
      showError((error as Record<string, string>).message);
    }
  };
  return (
    <Loader active={loading} className="h-screen w-screen flex items-start   justify-center  overflow-auto">
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
            <div className="header-text text-gray-900 text-base mb-5 font-semibold cursor-pointer" onClick={genOtp}>
              Gửi lại mã
            </div>

            <div className="header-text text-gray-600 text-base mb-5">
              Quay lại{' '}
              <strong
                className="text-primary cursor-pointer"
                onClick={() => {
                  removeKey(ACCESS_TOKEN);
                  navigator(ROUTES.LOGIN);
                }}
              >
                đăng nhập
              </strong>
            </div>
          </form>
        )}
      </Formik>
    </Loader>
  );
};

export default VerifyOtp;
