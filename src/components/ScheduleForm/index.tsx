import HealthSurveyTemplate from 'components/HealthSurveyTemplate';
import Loader from 'components/Loader';
import { GENDER } from 'config';
import DatePicker from 'elements/DatePicker';
import TextInput from 'elements/TextInput';
import { Formik } from 'formik';
import { HealthSurvey } from 'interfaces/models';
import React, { useRef, useState } from 'react';
import { createSchedule, updateSchedule } from 'services/schedule';
import { isBlank, showError, showSuccess } from 'utils';
import QRCode from 'react-qr-code';
import { getCreateScheduleSchema } from 'config/validator';
import VaccinePicker from 'components/VaccinePicker';
import Select from 'elements/Select';
interface ScheduleData {
  name?: string;
  address?: string;
  gender?: string;
  vaccineId?: string;
  time?: Date;
  dateOfBirth?: Date;
}

/**
 * Form đặt lịch
 * @returns
 */
const ScheduleForm = (props: { onSuccess(): void; onHide(): void; editData?: Record<string, unknown> }) => {
  const { editData } = props;
  const [loading, setLoading] = useState(false);
  const [showQr, setShowQr] = useState({ show: false, data: {} });
  const healthSurveyRef = useRef<HealthSurvey[]>([]);

  const onSubmit = (values: ScheduleData) => {
    const payload = {
      vaccineId: values.vaccineId, // loại vaccine
      address: values.address, // địa chỉ cơ sở
      date: values.time, // thời gian muốn tiêm
      injectorInfo: {
        name: values.name, // tên khách hàng
        dob: values.dateOfBirth, // ngày sinh khách hàng
        gender: values.gender, //giói tính
      },
      healthSurveyAnswers: healthSurveyRef.current.map(item => ({
        healthSurveyTemplateId: item.id,
        choice: item.checked ? 1 : 0,
      })),
    };
    if (editData) {
      requestUpdate({ ...payload, id: editData.id });
    } else {
      requestAdd(payload);
    }
  };

  const requestAdd = async (payload: Record<string, unknown>) => {
    setLoading(true);
    const res = await createSchedule(payload);
    if (res.status) {
      showSuccess('Đặt lịch thành công');
      setShowQr({ show: true, data: res.result });
      props.onSuccess();
    } else {
      showError((res.error as Record<string, unknown>)?.message as string);
    }
    setLoading(false);
  };

  const requestUpdate = async (payload: Record<string, unknown>) => {
    setLoading(true);
    const res = await updateSchedule(payload);
    if (res.status) {
      showSuccess('Sửa lịch thành công');
      setShowQr({ show: true, data: res.result });
      props.onSuccess();
    } else {
      showError((res.error as Record<string, unknown>)?.message as string);
    }

    setLoading(false);
  };

  const schema = getCreateScheduleSchema();

  const initialValues: ScheduleData = editData
    ? {
      name: (editData.injectorInfo as Record<string, unknown>)?.name as string,
      gender: (editData.injectorInfo as Record<string, unknown>)?.gender as string,
      vaccineId: editData.vaccineId as string,
      address: editData.address as string,
      time: editData.date ? new Date(editData.date as string) : new Date(),
      dateOfBirth: (editData.injectorInfo as Record<string, unknown>)?.dob
        ? new Date((editData.injectorInfo as Record<string, unknown>)?.dob as string)
        : new Date(),
    }
    : {
      name: '',
      vaccineId: '',
      address: '',
      time: new Date(),
      dateOfBirth: new Date(),
    };

  return (
    <Loader active={loading} className="w-full p-5 min-h-full">
      {!showQr.show ? (
        <div className="w-full m-auto max-w-screen-xl ">
          <Formik validationSchema={schema} onSubmit={onSubmit} initialValues={initialValues}>
            {({ values, isValid, handleSubmit, handleChange, handleBlur, setFieldValue, errors, touched }) => (
              <form onSubmit={handleSubmit} className="max-w-screen-lg m-auto">
                <h2 className="mb-3 text-gray-950 text-[1rem] font-bold">Thông tin người tiêm</h2>
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

                  <DatePicker label="Ngày sinh" onChange={date => setFieldValue('dateOfBirth', date)} selected={values.dateOfBirth} />
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
                </div>
                <h2 className="mb-3 text-gray-950 text-[1rem] font-bold">Thông tin dịch vụ</h2>
                <div className="inputs grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                  <VaccinePicker
                    label="Loại vaccine"
                    hasError={touched.vaccineId && !isBlank(errors.vaccineId)}
                    errorMessage={errors.vaccineId}
                    onSelect={selected => setFieldValue('vaccineId', selected?.value)}
                  />
                  <TextInput
                    type="text"
                    label="Cơ sở"
                    className=""
                    autoComplete="off"
                    aria-autocomplete="none"
                    value={values.address}
                    name="address"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    autoFocus
                    hasError={touched.address && !isBlank(errors.address)}
                    errorMessage={errors.address}
                  ></TextInput>
                  <DatePicker showTimeInput label="Thời gian" onChange={date => setFieldValue('time', date)} selected={values.time} />
                </div>
                <h2 className="mb-5 text-gray-950 text-[1rem] font-bold">Khảo sát sức khỏe</h2>
                <HealthSurveyTemplate initData={editData?.healthSurveyAnswers as Record<string, string>[]} onChange={data => (healthSurveyRef.current = data)} />
                <div className="buttons w-full flex justify-center mt-10 ">
                  <button
                    type="submit"
                    disabled={!isValid}
                    className="inline-block rounded bg-primary px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#007EA6] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
                  >
                    Tiếp tục
                  </button>
                </div>
              </form>
            )}
          </Formik>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <h2 className="mb-5">Bạn đã đặt lịch thành công</h2>
          <div className="mb-6">
            <QRCode value={`http://192.168.0.102:3001/schedule-detail/${(showQr.data as Record<string, unknown>).id}`} />
          </div>
          <div className="buttons">
            <button
              onClick={() => {
                setShowQr({ show: false, data: {} });
                props.onHide();
              }}
              type="button"
              className="inline-block rounded bg-primary px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#007EA6] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
            >
              Hoàn thành
            </button>
          </div>
        </div>
      )}
    </Loader>
  );
};

export default ScheduleForm;
