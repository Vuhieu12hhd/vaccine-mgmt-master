import { UserInfo } from 'interfaces/models';
import React, { useState } from 'react';
import { Formik } from 'formik';
import TextInput from 'elements/TextInput';
import Loader from 'components/Loader';
import { isBlank, showError, showSuccess } from 'utils';
import { TERipple } from 'tw-elements-react';
import { updateProfile } from 'services/auth';
import Select from 'elements/Select';
import { GENDER } from 'config';
import DatePicker from 'elements/DatePicker';

interface ProfileFormProps {
  userInfo: UserInfo;
  onHide(): void;
}

const ProfileForm = (props: ProfileFormProps) => {
  console.log({ props });
  const [loading, setLoading] = useState(false);

  const onSubmit = async (values: UserInfo) => {
    console.log('111111');
    setLoading(true);
    const res = await updateProfile({
      name: values.name,
      address: values.address,
    });
    if (res.status) {
      showSuccess('Đổi thông tin thành công');
      props.onHide();
    } else {
      showError((res.error as Record<string, unknown>)?.message as string);
    }
    setLoading(false);
  };

  return (
    <Loader active={loading} className="w-full">
      <Formik initialValues={props.userInfo} onSubmit={onSubmit}>
        {({ values, handleChange, handleBlur, handleSubmit, touched, errors, setFieldValue }) => (
          <form className=" rounded-md " onSubmit={handleSubmit}>
            <div className="grid gap-5 grid-cols-1 md:grid-cols-2 mb-10 ">
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
                label="Email"
                autoComplete="off"
                aria-autocomplete="none"
                value={values.email}
                readOnly
                disabled
                name="email"
                onChange={handleChange}
                onBlur={handleBlur}
                hasError={touched.email && !isBlank(errors.email)}
                errorMessage={errors.email}
              ></TextInput>
              <TextInput
                type="text"
                label="Số điện thoại "
                autoComplete="off"
                readOnly
                disabled
                aria-autocomplete="none"
                value={values.phoneNumber}
                name="phoneNumber"
                onChange={handleChange}
                onBlur={handleBlur}
                hasError={touched.phoneNumber && !isBlank(errors.phoneNumber)}
                errorMessage={errors.phoneNumber}
              ></TextInput>

              <DatePicker label="Ngày sinh" onChange={date => setFieldValue('dob', date)} selected={values.dob ? new Date(values.dob) : new Date()} />

              <Select
                label="Giới tính"
                placeholder="Chọn giới tính...."
                options={[
                  {
                    label: 'Nam',
                    value: GENDER.MALE,
                  },
                  {
                    label: 'Nữ',
                    value: GENDER.FEMALE,
                  },
                ]}
                onChange={value => {
                  setFieldValue('gender', value);
                }}
                activeValue={values.gender}
              />

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
            </div>

            {/* <!-- Submit button --> */}

            <TERipple rippleColor="light" className="w-full mt-5">
              <button
                type="submit"
                className="inline-block w-full rounded px-7 py-1.5 text-sm font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_rgba(32,189,189,0.4)] transition duration-150 ease-in-out hover:shadow-[0_8px_18px_-4px_rgba(32,189,189,0.5)] hover:bg-[#0F9191]"
                style={{ backgroundColor: '#20BDBD' }}
              >
                LƯU THÔNG TIN
              </button>

            </TERipple>
          </form>
        )}
      </Formik>
    </Loader>
  );
};

export default ProfileForm;
