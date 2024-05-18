import Loader from 'components/Loader';
import TextInput from 'elements/TextInput';
import { Formik } from 'formik';
import React, { useState } from 'react';
import { isBlank, showError, showSuccess } from 'utils';
import { getCreateProviderSchema } from 'config/validator';
import { addProvider, updateProvider } from 'services/vaccine';
interface EmployeeData {
  name?: string;
  role?: string;
  gender?: string;
  email?: string;
  password?: string;
  phoneNumber?: string;
}

/**
 * Form tạo nhà cung cấp
 * @returns
 */
const ProviderForm = (props: { onSuccess(): void; editData?: Record<string, unknown> }) => {
  const [loading, setLoading] = useState(false);

  const onSubmit = (values: EmployeeData) => {
    const payload = {
      ...values,
    };
    if (props.editData) {
      requestUpdate({
        ...payload,
        id: props.editData.id,
      });
    } else {
      requestAdd(payload);
    }
  };

  const requestAdd = async (payload: Record<string, unknown>) => {
    setLoading(true);
    const res = await addProvider(payload);
    if (res.status) {
      showSuccess('Thêm thành công');
      props.onSuccess();
    } else {
      showError((res.error as Record<string, unknown>)?.message as string);
    }
    setLoading(false);
  };
  const requestUpdate = async (payload: Record<string, unknown>) => {
    setLoading(true);
    const res = await updateProvider(payload);
    if (res.status) {
      showSuccess('Sửa thành công');
      props.onSuccess();
    } else {
      showError((res.error as Record<string, unknown>)?.message as string);
    }
    setLoading(false);
  };

  const schema = getCreateProviderSchema();

  return (
    <Loader active={loading} className="w-full p-5 min-h-full">
      <div className="w-full m-auto max-w-screen-xl">
        <Formik validationSchema={schema} onSubmit={onSubmit} initialValues={{ name: (props.editData?.name as string) ?? '' }}>
          {({ values, isValid, handleSubmit, handleChange, handleBlur, errors, touched }) => (
            <form onSubmit={handleSubmit} className="max-w-screen-lg m-auto">
              <div className="inputs grid grid-cols-1 gap-8 mb-8">
                <TextInput
                  type="text"
                  label="Tên nhà cung cấp"
                  className="mb"
                  autoComplete="off"
                  aria-autocomplete="none"
                  value={values.name}
                  name="name"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  autoFocus
                  hasError={touched.name && !isBlank(errors.name)}
                  errorMessage={errors.name}
                ></TextInput>
              </div>

              <div className="buttons w-full flex justify-center mt-10 ">
                <button
                  type="submit"
                  disabled={!isValid}
                  className="inline-block rounded px-7 py-1.5 text-sm font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_rgba(32,189,189,0.4)] transition duration-150 ease-in-out hover:shadow-[0_8px_18px_-4px_rgba(32,189,189,0.5)] hover:bg-[#0F9191]"
                style={{ backgroundColor: '#20BDBD' }}
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

export default ProviderForm;
