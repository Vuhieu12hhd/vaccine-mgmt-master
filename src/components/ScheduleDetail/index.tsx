import SelectCell from 'components/DataGrid/SelectCell';
import HealthSurveyTemplate from 'components/HealthSurveyTemplate';
import UserPicker from 'components/UserPicker';
import { GENDER, ROLE } from 'config';
import Button from 'elements/Button';
import Modal from 'elements/Modal';
import { Formik } from 'formik';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { createScheduleHistory, getScheduleById, updateHeathSurvey } from 'services/schedule';
import { isBlank, showError, showSuccess } from 'utils';
import { formatDateToString } from 'utils/dateTime';


const ScheduleDetail = () => {
  const { scheduleId } = useParams();
  const [schedule, setSchedule] = useState<any>({})
  const [success, setSuccess] = useState(false)
  const [assignModal, setAssignModal] = useState<{ show?: boolean; data?: Record<string, unknown> }>({});

  useEffect(() => {
    if (scheduleId) {
      getScheduleById(scheduleId).then((res) => {
        if (res.status) {
          setSchedule(res.result)
        }
      })
    }


  }, [scheduleId])


  const handleAssign = async (values: { monitorUserId: string; monitorName: string }) => {
    console.log(values)
    const res = await createScheduleHistory({
      vaccineId: assignModal.data?.vaccineId,
      note: assignModal.data?.note,
      injectorInfo: assignModal.data?.injectorInfo,
      monitorUserId: values.monitorUserId,
      userId: assignModal.data?.userId
    })

    if (res.status) {
      showSuccess(`Tạo việc cho ${values.monitorName ?? ''} thành công`);
      setAssignModal({ show: false });
      setSuccess(true)
    } else {
      showError((res.error as Record<string, unknown>)?.message as string);
    }

  }

  return (
    <div className='w-full max-w-screen-lg my-8 m-auto p-4 shadow-md rounded-md'>
      <div className='text-[1.4rem]  font-bold mx-auto text-center mb-[4rem] 'style={{ backgroundColor: '#20BDBD',width: '400px' }}>THÔNG TIN LỊCH TIÊM</div>
      <div>
        <div className='mb-3 text-gray-950 text-[1.2rem] font-bold'>Thông tin người tiêm</div>
        <div className='p-8 text-[1rem] grid grid-cols-2 gap-y-5'>
          <div className="flex">
            <div className='font-bold mr-3'>Họ và tên:</div>
            <div className='uppercase'>{schedule.injectorInfo?.name}</div>
          </div>
          <div className="flex">
            <div className='font-bold mr-3'>Giới tính:</div>
            <div className='uppercase'>{schedule.injectorInfo?.gender === GENDER.MALE ? 'Nam' : 'Nữ'}</div>
          </div>
          <div className="flex">
            <div className='font-bold mr-3'>Ngày sinh:</div>
            <div className='uppercase'>{schedule.injectorInfo?.dob ? formatDateToString(new Date(schedule.injectorInfo?.dob), 'dd/MM/yyyy') : ''}</div>
          </div>
        </div>
      </div>
      <div>
        <div className='mb-3 text-gray-950 text-[1.2rem] font-bold'>Thông tin dịch vụ</div>
        <div className='p-8 text-[1rem] grid grid-cols-2 gap-y-5'>
          <div className="flex">
            <div className='font-bold mr-3'>Loại vaccine:</div>
            <div className='uppercase'>{schedule.vaccine?.name}</div>
          </div>
          <div className="flex">
            <div className='font-bold mr-3'>Thời gian tiêm:</div>
            <div className='uppercase'>{schedule.date ? formatDateToString(new Date(schedule.date), 'dd/MM/yyyy') : ''}</div>
          </div>
        </div>
      </div>
      <div>
        <div className='mb-3 text-gray-950 text-[1.2rem] font-bold'>Khảo sát sức khỏe</div>
        <HealthSurveyTemplate initData={schedule?.healthSurveyAnswers as Record<string, string>[] ?? []} />
        <div className="flex items-center">
          <div className=' mr-8 text-gray-950 text-[1rem] font-bold'>Kết quả khảo sát</div>
          <div className='w-[10rem]'><SelectCell options={[
            {
              label: 'Thành công',
              value: 'SUCCESS',
            },
            {
              label: 'Thất bại',
              value: 'FAILED',
            },
            {
              label: 'Chờ duyệt',
              value: 'PENDING',
            },
          ]}
            onChange={async (data: Record<string, unknown>, value: string) => {
              await updateHeathSurvey({ id: data.id, status: value });
            }}
            notification={{
              success: 'Cập nhật kết quả khảo sát thành công',
              failed: 'Cập nhật kết quả khảo sát thất bại'
            }}
            data={schedule}
            value={schedule?.healthSurveyStatus}

          /></div>
        </div>

      </div>
      <div className='w-full flex justify-center mt-[3rem]'>
        {!success && <Button onClick={() => {
          setAssignModal({ show: true, data: schedule })
        }}>Bác sỹ phụ trách</Button>}
      </div>

      <Modal
        title="Bác sỹ phụ trách"
        size="sm"
        show={assignModal.show}
        bodyClassName='!overflow-y-visible'
        onHide={() => {
          setAssignModal({ show: false });
        }}
      >
        <Formik
          onSubmit={handleAssign}
          initialValues={{ monitorUserId: '', monitorName: '' }}
        >
          {({ handleSubmit, touched, errors, setFieldValue }) => (
            <form className='w-full h-full flex flex-col items-center justify-center ' onSubmit={handleSubmit}>
              <UserPicker
                className='w-full'
                label="Bác sỹ"
                placeholder='Giao việc cho bác sỹ'
                role={[ROLE.DOCTOR]}
                hasError={touched.monitorUserId && !isBlank(errors.monitorUserId)}
                errorMessage={errors.monitorUserId}
                onSelect={selected => {
                  setFieldValue('monitorUserId', selected?.value)
                  setFieldValue('monitorName', selected?.label)
                }}
              />
              <Button className="inline-block w-full rounded px-7 py-1.5 text-sm font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_rgba(32,189,189,0.4)] transition duration-150 ease-in-out hover:shadow-[0_8px_18px_-4px_rgba(32,189,189,0.5)] hover:bg-[#0F9191]"
                style={{ backgroundColor: '#20BDBD' }} type='submit' >Xác nhận</Button>
            </form>
          )}
        </Formik>
      </Modal>
    </div>
  )
}

export default ScheduleDetail