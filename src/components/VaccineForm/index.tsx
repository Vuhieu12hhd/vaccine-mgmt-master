import Loader from 'components/Loader';
import TextInput from 'elements/TextInput';
import { Formik } from 'formik';
import React, { useState } from 'react';
import { isBlank, showError, showSuccess } from 'utils';
import { getCreateProviderSchema } from 'config/validator';
import { addVaccine, updateVaccine } from 'services/vaccine';
import DatePicker from 'elements/DatePicker';
import ProviderPicker from 'components/ProviderPicker';

/**
 * Form tạo vaccine
 * @returns
 */
const VaccineForm = (props: { onSuccess(): void; editData?: Record<string, unknown> }) => {
  const [loading, setLoading] = useState(false);

  const onSubmit = (values: Record<string, unknown>) => {
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
    const res = await addVaccine(payload);
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
    const res = await updateVaccine(payload);
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
        <Formik
          validationSchema={schema}
          onSubmit={onSubmit}
          initialValues={{
            name: (props.editData?.name as string) ?? '',
            description: (props.editData?.description as string) ?? '',
            vaccineProviderId: (props.editData?.vaccineProviderId as string) ?? '',
            lotNumber: (props.editData?.lotNumber as number) ?? '',
            price: (props.editData?.price as number) ?? '',
            quantity: (props.editData?.quantity as number) ?? '',
            expiredAt: (props.editData?.expiredAt as string) ? new Date((props.editData?.expiredAt as string) ?? '') : new Date(),
            standard: (props.editData?.standard as string) ?? '',
          }}
        >
          {({ values, isValid, handleSubmit, handleChange, handleBlur, setFieldValue, errors, touched }) => (
            <form onSubmit={handleSubmit} className="max-w-screen-lg m-auto">
              <div className="inputs grid grid-cols-2 gap-8 mb-8">
                <TextInput
                  type="text"
                  label="Tên"
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
                <TextInput
                  type="text"
                  label="Tiêu chuẩn"
                  className="mb"
                  autoComplete="off"
                  aria-autocomplete="none"
                  value={values.standard}
                  name="standard"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  autoFocus
                  hasError={touched.standard && !isBlank(errors.standard)}
                  errorMessage={errors.standard}
                ></TextInput>

                <ProviderPicker
                  label="Nhà cung cấp"
                  hasError={touched.vaccineProviderId && !isBlank(errors.vaccineProviderId)}
                  errorMessage={errors.vaccineProviderId}
                  onSelect={selected => setFieldValue('vaccineProviderId', selected?.value)}
                />

                <TextInput
                  type="text"
                  label="Số lô"
                  className="mb"
                  autoComplete="off"
                  aria-autocomplete="none"
                  value={values.lotNumber}
                  name="lotNumber"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  autoFocus
                  hasError={touched.lotNumber && !isBlank(errors.lotNumber)}
                  errorMessage={errors.lotNumber}
                ></TextInput>
                <TextInput
                  type="text"
                  label="Số lượng"
                  className="mb"
                  autoComplete="off"
                  aria-autocomplete="none"
                  value={values.quantity}
                  name="quantity"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  autoFocus
                  hasError={touched.quantity && !isBlank(errors.quantity)}
                  errorMessage={errors.quantity}
                ></TextInput>
                <TextInput
                  type="text"
                  label="Giá"
                  className="mb"
                  autoComplete="off"
                  aria-autocomplete="none"
                  value={values.price}
                  name="price"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  autoFocus
                  hasError={touched.price && !isBlank(errors.price)}
                  errorMessage={errors.price}
                ></TextInput>
                <DatePicker label="Hạn sử dụng" onChange={date => setFieldValue('expiredAt', date)} selected={values.expiredAt} />

                <TextInput
                  type="text"
                  label="Mô tả"
                  autoComplete="off"
                  aria-autocomplete="none"
                  value={values.description}
                  name="description"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  autoFocus
                  hasError={touched.description && !isBlank(errors.description)}
                  errorMessage={errors.description}
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

export default VaccineForm;
