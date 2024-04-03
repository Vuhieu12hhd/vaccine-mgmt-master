import { ColDef, ColGroupDef, IDatasource } from 'ag-grid-community';
import DataGrid, { DataGridHandle } from 'components/DataGrid';
import { GENDER, ROLE } from 'config';
import Button from 'elements/Button';
import React, { useRef, useState } from 'react';
import { createScheduleHistory, getScheduleCreated, updateHeathSurvey, updateSchedule } from 'services/schedule';
import { dateFormatterFromTimestamp, dateTimeFormatterFromTimestamp } from 'utils/grid';
import { IoMdAddCircleOutline } from 'react-icons/io';
import Modal from 'elements/Modal';
import ScheduleForm from 'components/ScheduleForm';
import ActionsCell from 'components/DataGrid/ActionCell';
import { isBlank, showError, showSuccess } from 'utils';
import QRCode from 'react-qr-code';
import { useLoaderData } from 'react-router-dom';
import { UserInfo } from 'interfaces/models';
import ButtonCell from 'components/DataGrid/ButtonCell';
import SelectCell from 'components/DataGrid/SelectCell';
import './style.scss';
import HealthSurveyTemplate from 'components/HealthSurveyTemplate';
import { Formik } from 'formik';
import UserPicker from 'components/UserPicker';
import { ROUTES } from 'routes/config';

// Lịch sử đặt lịch
const CreateSchedule = () => {

  const userInfo = useLoaderData() as UserInfo;
  const [addModal, setAddModal] = useState<{ show?: boolean; data?: Record<string, unknown>; loading?: boolean }>({});
  const [delModal, setDelModal] = useState<{ show?: boolean; data?: Record<string, unknown>; loading?: boolean }>({});
  const [qrModal, setQrModal] = useState<{ show?: boolean; data?: Record<string, unknown> }>({});
  const [assignModal, setAssignModal] = useState<{ show?: boolean; data?: Record<string, unknown> }>({});
  const gridRef = useRef<DataGridHandle>();
  const columnDefs: Array<ColDef | ColGroupDef> = [
    {
      headerName: ' STT',
      minWidth: 60,
      maxWidth: 60,
      valueGetter: params => (params.node?.rowIndex ?? 0) + 1,
      cellClass: 'al-center',
      colId: 'stt',
    },
    {
      headerName: 'Tên bệnh nhân ',
      minWidth: 90,
      field: 'injectorInfo.name',
      colId: 'name',
    },
    {
      headerName: 'Ngày sinh',
      field: 'injectorInfo.dob',
      valueFormatter: dateFormatterFromTimestamp,
      cellClass: 'al-center',
      minWidth: 110,
      colId: 'dob',
    },
    {
      headerName: 'Giới tính',
      field: 'injectorInfo.gender',
      cellClass: 'al-center',
      maxWidth: 70,
      colId: 'gender',

      valueFormatter: params => {
        return params.value === GENDER.MALE ? 'Nam' : 'Nữ';
      },
    },
    {
      headerName: 'Cơ sở tiêm',
      field: 'address',
      maxWidth: 100,
      colId: 'address',
    },
    {
      headerName: 'Ngày đặt lịch ',
      field: 'date',
      valueFormatter: dateTimeFormatterFromTimestamp,
      colId: 'date',
      cellClass: 'al-center',
      minWidth: 150,
    },
    {
      headerName: 'Loại vaccine',
      field: 'vaccine.name',
      cellClass: 'al-center',
      colId: 'vaccineId',
      minWidth: 120,
    },
    {
      headerName: 'Kết quả khảo sát',
      field: 'healthSurveyStatus',
      valueFormatter: params => {
        const MapHealthSurveyStatus: Record<string, string> = {
          SUCCESS: 'Thành công',
          FAILED: 'Thất bại',
          PENDING: 'Chờ duyệt',
        };
        return MapHealthSurveyStatus[params.value];
      },
      cellClass: 'al-center',
      colId: 'healthSurveyStatus',
      hide: userInfo.role !== ROLE.CUSTOMER,
    },
    {
      headerName: 'Kết quả khảo sát',
      field: 'healthSurveyStatus',
      cellClass: 'al-center',
      colId: 'healthSurveyStatus',
      cellRenderer: SelectCell,
      cellRendererParams: {
        options: [
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
        ],
        onChange: async (data: Record<string, unknown>, value: string) => {
          await updateHeathSurvey({ id: data.id, status: value });
        },
        notification: {
          success: 'Cập nhật kết quả khảo sát thành công',
          failed: 'Cập nhật kết quả khảo sát thất bại'
        }
      },
      pinned: 'right',
      hide: userInfo.role === ROLE.CUSTOMER,
    },

    {
      headerName: 'Giao việc',
      cellRenderer: ButtonCell,
      cellClass: 'al-center',
      maxWidth: 120,
      cellRendererParams: {
        onClick: (data?: Record<string, unknown>) => {
          setAssignModal({ show: true, data })
        },
        label: () => {
          return 'Giao việc'
        },
        backGroundColor: '',
      },
      pinned: 'right',
      hide: userInfo.role !== ROLE.DOCTOR && userInfo.role !== ROLE.ADMIN
      
    },
    {
      headerName: 'QR',
      cellClass: 'al-center qr-cell',
      field: 'qr',
      valueGetter: () => {
        return 'Xem';
      },
      pinned: 'right',
      maxWidth: 60,
      onCellClicked: event => {
        setQrModal({ show: true, data: event.data });
      },
    },
    {
      headerName: 'Tùy chọn',
      cellRenderer: ActionsCell,
      maxWidth: 120,
      pinned: 'right',
      hide: userInfo.role !== ROLE.CUSTOMER,
      cellRendererParams: {
        onDelete: (data: Record<string, unknown>) => {
          setDelModal({ show: true, data });
        },
        onEdit: (data: Record<string, unknown>) => {
          setAddModal({ show: true, data });
        },
        hideDelete: (data: Record<string, unknown>) => {
          return data?.isCanceled;
        },
      },
    },
  ];

  const handleHideAddModal = () => {
    setAddModal({});
  };

  const handleShowAddModal = () => {
    setAddModal({ show: true });
  };

  const handleDel = async () => {
    if (delModal.data) {
      const res = await updateSchedule({ id: delModal.data.id, isCanceled: true });
      if (res.status) {
        showSuccess('Hủy lịch thành công');
        handleHideDelModal();
        refreshData();
      } else {
        showError((res.error as Record<string, unknown>)?.message as string);
      }
    }
  };
  const handleHideDelModal = () => setDelModal({ show: false });

  const refreshData = () => {
    setTimeout(() => {
      gridRef.current?.gridApi?.setDatasource(dataSource);
    });
  };


  const dataSource: IDatasource = {
    async getRows(params) {
      const { startRow, endRow } = params; // thư viện cho mình biết cần lấy từ row nào đến row nào.
      const size = endRow - startRow; // sổ bản ghi cần lấy 
      gridRef.current?.gridApi?.showLoadingOverlay(); // show loading khi query
      const data = await getScheduleCreated({ pageNum: startRow / size + 1, limit: size }, userInfo.role); // query data 
      if (data.status) {
        // nếu thành công thì gọi hàm này để thư viện add data mới lấy được vào bảng
        params.successCallback(data.result.items, data.result.pagination.totalCount); // totalCount -> để cho thư viện hiển thị 
      } else {
        // nếu failed thì k add gì cả 
        params.successCallback([], 0);
      }
      gridRef.current?.gridApi?.hideOverlay();
    },
    rowCount: 10,
  };

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
      refreshData();
    } else {
      showError((res.error as Record<string, unknown>)?.message as string);
    }

  }

  return (
    <div className="w-full h-full p-10 flex flex-col bg-[#F3F4F6]">
      <div className="flex justify-between items-center mb-10">
        <div className="title  font-bold">{userInfo.role === ROLE.CUSTOMER ? 'Đăng ký tiêm chủng' : 'Danh sách lịch hẹn'}</div>
        <Button onClick={handleShowAddModal}>
          <div className="flex items-center">
            <IoMdAddCircleOutline width={24} height={24} className="mr-1 h-[1.4rem] w-[1.4rem]" />
            Đặt lịch
          </div>
        </Button>
      </div>
      <DataGrid
        ref={(instance: DataGridHandle) => (gridRef.current = instance)}
        columnDefs={columnDefs}
        onGridReady={refreshData}
        rowModelType="infinite"
      ></DataGrid>

      <Modal title={addModal.data != null ? 'Cập nhật lịch' : 'Đặt lịch'} unMounted show={addModal.show} onHide={handleHideAddModal}>
        <ScheduleForm
          editData={addModal.data}
          onHide={handleHideAddModal}
          onSuccess={() => {
            refreshData();
          }}
        />
      </Modal>
      <Modal
        title="Mã QR và phiếu khảo sát"
        size="lg"
        show={qrModal.show}
        onHide={() => {
          setQrModal({ show: false });
        }}
      >
        <div className="w-full h-full flex flex-col items-center justify-center pb-5">
          <QRCode value={`http://192.168.0.102:3001${ROUTES.SCHEDULE_DETAIL}/${(qrModal.data as Record<string, unknown>)?.id}`} />
          <div className="w-full my-10">
            <HealthSurveyTemplate initData={qrModal.data?.healthSurveyStatus as Record<string, string>[]} />
          </div>
          <Button onClick={() => {
            setQrModal({ show: false });
          }}>Xác nhận</Button>
        </div>
      </Modal>
      <Modal
        title="Giao việc"
        size="sm"
        bodyClassName='!overflow-y-visible'

        show={assignModal.show}
        onHide={() => {
          setAssignModal({ show: false });
        }}
      >
        <Formik
          onSubmit={handleAssign}
          initialValues={{ monitorUserId: '', monitorName: '' }}
        >
          {({ handleSubmit, touched, errors, setFieldValue }) => (
            <form className='w-full h-full flex flex-col items-center justify-center' onSubmit={handleSubmit}>
              <UserPicker
                className='w-full'
                label="Bác sỹ"
                placeholder='Chọn bác sỹ'
                role={[ROLE.DOCTOR]}
                hasError={touched.monitorUserId && !isBlank(errors.monitorUserId)}
                errorMessage={errors.monitorUserId}
                onSelect={selected => {
                  setFieldValue('monitorUserId', selected?.value)
                  setFieldValue('monitorName', selected?.label)
                }}
              />
              <Button className='w-full mt-20' type='submit' >Xác nhận</Button>
            </form>
          )}
        </Formik>
      </Modal>
      <Modal title="Hủy lịch tiêm" show={delModal.show} onConfirm={handleDel} onHide={handleHideDelModal}>
        Bạn có chắc chắn muốn hủy bỏ lịch tiêm không ?
      </Modal>
    </div>
  );
};

export default CreateSchedule;
