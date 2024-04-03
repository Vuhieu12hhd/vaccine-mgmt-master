import React, { useRef, useState } from 'react';
import { ColDef, ColGroupDef, IDatasource } from 'ag-grid-community';
import DataGrid, { DataGridHandle } from 'components/DataGrid';
import { GENDER, ROLE } from 'config';
import { getScheduleHistory, payment, updateStatusScheduleHistory } from 'services/schedule';
import { dateFormatterFromTimestamp, dateTimeFormatterFromTimestamp, integerFormatter } from 'utils/grid';
import { useLoaderData } from 'react-router-dom';
import { UserInfo } from 'interfaces/models';
import { isBlank, showError, showSuccess } from 'utils';
import { Formik } from 'formik';
import TextInput from 'elements/TextInput';
import Button from 'elements/Button';
import SelectCell from 'components/DataGrid/SelectCell';
import ButtonCell from 'components/DataGrid/ButtonCell';
import Loader from 'components/Loader';

// Lịch sử đặt lịch
const ScheduleHistory = () => {
  const userInfo = useLoaderData() as UserInfo | null;
  const searchKey = useRef('')
  const [loading, setLoading] = useState(false);

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
      minWidth: 130,
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
      minWidth: 90,
      colId: 'gender',

      valueFormatter: params => {
        return params.value === GENDER.MALE ? 'Nam' : 'Nữ';
      },
    },
    {
      headerName: 'Cơ sở tiêm',
      field: 'address',
      minWidth: 120,
      colId: 'address',
    },
    {
      headerName: 'Ngày đặt lịch ',
      field: 'date',
      valueFormatter: dateTimeFormatterFromTimestamp,
      colId: 'date',
      cellClass: 'al-center',
      minWidth: 250,
    },
    {
      headerName: 'Loại vaccine',
      field: 'vaccine.name',
      cellClass: 'al-center',
      colId: 'vaccineId',
    },
    {
      headerName: 'Tổng chi phí',
      cellClass: 'al-right',
      field: 'totalCharge',
      valueFormatter: integerFormatter
    },
    {
      headerName: 'Trạng thái',
      cellClass: 'al-center',
      field: 'status',
      minWidth: 200,
      valueFormatter: params => {
        const MapHealthSurveyStatus: Record<string, string> = {
          SCREEN_TEST_WAITING: 'Chờ khám sàng lọc',
          SCREEN_TESTING: 'Đang khám sàng lọc',
          SCREEN_TEST_PASSED: 'Đã qua khám sàng lọc',
          SCREEN_TEST_REJECTED: 'Không qua khám sàng lọc',
          INJECT_WAITING: 'Đợi tiêm',
          INJECTING: 'Đang tiêm',
          INJECTED: 'Đã tiêm',
        };
        return MapHealthSurveyStatus[params.value];
      },
      hide: userInfo?.role !== ROLE.CUSTOMER && userInfo?.role !== ROLE.WAREHOUSE_MANAGER
    },
    {
      headerName: 'Trạng thái',
      cellClass: 'al-center',
      field: 'status',
      minWidth: 200,

      cellRenderer: SelectCell,
      cellRendererParams: {
        options: [
          {
            label: 'Chờ khám sàng lọc',
            value: 'SCREEN_TEST_WAITING',
          },
          {
            label: 'Đang khám sàng lọc',
            value: 'SCREEN_TESTING',
          },
          {
            label: 'Đã qua khám sàng lọc',
            value: 'SCREEN_TEST_PASSED',
          },
          {
            label: 'Không qua khám sàng lọc',
            value: 'SCREEN_TEST_REJECTED',
          },
          {
            label: 'Đợi tiêm',
            value: 'INJECT_WAITING',
          },
          {
            label: 'Đang tiêm',
            value: 'INJECTING',
          },
          {
            label: 'Đã tiêm',
            value: 'INJECTED',
          },
        ],
        onChange: async (data: Record<string, unknown>, value: string) => {
          await updateStatusScheduleHistory({ id: data.id, status: value });
        },
        notification: {
          success: 'Cập nhật trạng thái thành công',
          failed: 'Cập nhật trạng thái thất bại'
        }
      },
      pinned: 'right',
      hide: userInfo?.role === ROLE.CUSTOMER || userInfo?.role === ROLE.WAREHOUSE_MANAGER,
    },
    {
      headerName: 'Ghi chú',
      cellClass: 'al-center',
      field: 'note',
    },

    {
      headerName: 'Tùy chọn',
      pinned: 'right',
      field: 'active',
      cellClass: 'al-center',
      hide: userInfo?.role !== ROLE.WAREHOUSE_MANAGER,
      cellRenderer: ButtonCell,
      cellRendererParams: {
        onClick: async (data: Record<string, unknown>) => {
          setLoading(true);
          const res = await payment({ id: data?.id, paymentMethod: "CASH" });
          if (res.status) {
            showSuccess('Thanh toán thành công');
            refreshData();
          } else {
            showError((res.error as Record<string, unknown>)?.message as string);
          }
          setLoading(false);
        },
        label: () => {
          return 'Thanh toán'
        },
        isDisabled: (data?: Record<string, unknown>) => {
          return data?.isPaid
        }
      }
    },
  ];

  const refreshData = () => {
    setTimeout(() => {
      gridRef.current?.gridApi?.setDatasource(dataSource);
    });
  };

  const handleSearch = (values: { searchKey: string }) => {
    searchKey.current = values.searchKey;
    refreshData();
  }
  const dataSource: IDatasource = {
    async getRows(params) {
      const { startRow, endRow } = params;
      const size = endRow - startRow;
      gridRef.current?.gridApi?.showLoadingOverlay();
      const data = await getScheduleHistory(
        {
          pageNum: startRow / size + 1,
          limit: size,
          ...!isBlank(searchKey.current) && {
            searchKey: searchKey.current
          }
        },
        userInfo?.role,
      );
      if (data.status) {
        params.successCallback(data.result.items, data.result.pagination.totalCount);
      } else {
        params.successCallback([], 0);
      }
      gridRef.current?.gridApi?.hideOverlay();
    },
    rowCount: 10,
  };

  return (
    <Loader active={loading} className="w-full h-full p-10 flex flex-col bg-[#F3F4F6]">
      <div className="flex justify-between items-center mb-2">
        <div className="title  font-bold">Lịch sử</div>
      </div>
      <div className='mb-5'>
        <Formik
          onSubmit={handleSearch}
          initialValues={{ searchKey: '' }}>
          {({ handleChange, handleSubmit }) => (<form className='grid grid-cols-6 gap-4' onSubmit={handleSubmit}>
            <TextInput placeholder='Nhập ký tự tìm kiếm ...' name="searchKey" onChange={handleChange} />
            <Button type='submit' className='max-h-[3.6rem] w-fit mt-auto ml-auto'>Tìm kiếm</Button>
          </form>)}
        </Formik>
      </div>
      <DataGrid
        ref={(instance: DataGridHandle) => (gridRef.current = instance)}
        columnDefs={columnDefs}
        onGridReady={refreshData}
        rowModelType="infinite"
      ></DataGrid>
    </Loader>
  );
};

export default ScheduleHistory;
