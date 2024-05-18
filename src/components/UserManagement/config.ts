import { ColDef, ColGroupDef } from 'ag-grid-community';
import ButtonCell from 'components/DataGrid/ButtonCell';
import { GENDER, ROLE, mapRole } from 'config';
import { dateFormatterFromTimestamp } from 'utils/grid';

export const getColumnDefs = (type: 'CUSTOMER' | 'EMPLOYEE', buttonClick: (data: Record<string, unknown>) => void): Array<ColDef | ColGroupDef> => [
  {
    headerName: ' STT',
    minWidth: 60,
    maxWidth: 60,
    valueGetter: params => (params.node?.rowIndex ?? 0) + 1,
    cellClass: 'al-center',
    colId: 'stt',
  },
  {
    headerName: type === 'CUSTOMER' ? 'Tên khách hàng' : 'Tên nhân viên',
    minWidth: 200,
    field: 'name',
    colId: 'name',
  },
  {
    headerName: 'Địa chỉ',
    field: 'address',
    minWidth: 90,
    cellClass: 'al-center',
    colId: 'address',
  },
  {
    headerName: 'Giới tính',
    field: 'gender',
    cellClass: 'al-center',
    minWidth: 90,
    colId: 'gender',
    valueFormatter: params => {
      return params.value === GENDER.MALE ? 'Nam' : 'Nữ';
    },
  },
  {
    headerName: 'Chức vụ',
    field: 'role',
    cellClass: 'al-center',
    minWidth: 90,
    colId: 'role',
    valueFormatter: params => {
      return mapRole[params.value];
    },
  },
  {
    headerName: 'Email',
    field: 'email',
    minWidth: 220,
    colId: 'email',
  },
  {
    headerName: 'Số điện thoại',
    field: 'phoneNumber',
    minWidth: 80,
    colId: 'phoneNumber',
    cellClass: 'al-center',
  },
  {
    headerName: 'Tùy chọn',
    field: 'active',
    hide: type === 'CUSTOMER',
    cellRenderer: ButtonCell,
    cellRendererParams: {
      onClick: buttonClick,
      label: (data: Record<string, unknown>) => {
        return data?.active ? 'Lock account' : 'Unlock account'
      },
    }
  },
]