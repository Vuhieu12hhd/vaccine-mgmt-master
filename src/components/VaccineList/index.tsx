import React, { useRef, useState } from 'react';
import { ColDef, ColGroupDef, IDatasource } from 'ag-grid-community';
import DataGrid, { DataGridHandle } from 'components/DataGrid';
import { deleteVaccine, getAllVaccine } from 'services/vaccine';
import { dateFormatterFromTimestamp, integerFormatter } from 'utils/grid';
import { isBlank, showError, showSuccess } from 'utils';
import ActionsCell from 'components/DataGrid/ActionCell';
import Modal from 'elements/Modal';
import VaccineForm from 'components/VaccineForm';
import Button from 'elements/Button';
import { IoMdAddCircleOutline } from 'react-icons/io';
import { useLoaderData } from 'react-router-dom';
import { UserInfo } from 'interfaces/models';
import { ROLE } from 'config';
import { Formik } from 'formik';
import TextInput from 'elements/TextInput';

//Quản lý vaccine
const VaccineManagement = () => {
  const userInfo = useLoaderData() as UserInfo | null;
  const searchKey = useRef('')

  const [addModal, setAddModal] = useState<{ show?: boolean; data?: Record<string, unknown> }>({});
  const [delModal, setDelModal] = useState<{ show?: boolean; data?: Record<string, unknown>; loading?: boolean }>({});
  const gridRef = useRef<DataGridHandle>();
  const columnDefs: Array<ColDef | ColGroupDef> = [
    {
      headerName: ' STT',
      minWidth: 50,
      maxWidth: 50,
      valueGetter: params => (params.node?.rowIndex ?? 0) + 1,
      cellClass: 'al-center',
      colId: 'stt',
    },
    {
      headerName: 'Tên vaccine',
      field: 'name',
      colId: 'name',
      minWidth: 120,
    },
    {
      headerName: 'Đơn giá',
      field: 'price',
      cellClass: 'al-right',
      colId: 'price',
      maxWidth: 70,
      valueFormatter: integerFormatter
    },
    {
      headerName: 'Số lượng nhập',
      field: 'quantity',
      colId: 'quantity',
      cellClass: 'al-right',
      minWidth: 90,
      valueFormatter: integerFormatter
    },
    {
      headerName: 'Vaccine đã tiêm',
      field: 'injectedQuantity',
      colId: 'injectedQuantity',
      cellClass: 'al-right',
      minWidth: 90,
      valueFormatter: integerFormatter
    },
    {
      headerName: 'Vaccine hết hạn',
      field: 'expiredQuantity',
      colId: 'expiredQuantity',
      cellClass: 'al-right',
      minWidth: 90,
      valueFormatter: integerFormatter
    },
    {
      headerName: 'Vaccine bị lỗi ',
      field: 'errorQuantity',
      colId: 'errorQuantity',
      cellClass: 'al-right',
      minWidth: 90,
      valueFormatter: integerFormatter
    },
    {
      headerName: 'Tiêu chuẩn',
      field: 'standard',
      colId: 'standard',
      minWidth: 120,
    },
    {
      headerName: 'Số lô',
      field: 'lotNumber',
      colId: 'lotNumber',
      maxWidth: 60,
    },
    {
      headerName: 'Hạn sử dụng',
      field: 'expiredAt',
      colId: 'expiredAt',
      minWidth: 90,
      valueFormatter: dateFormatterFromTimestamp,
    },
    {
      headerName: 'Nhà cung cấp',
      field: 'vaccineProvider.name',
      colId: 'vaccineProviderId',
      minWidth: 300,
    },
    {
      headerName: 'Tùy chọn',
      cellRenderer: ActionsCell,
      maxWidth: 120,
      pinned: 'right',
      hide: userInfo?.role !== ROLE.WAREHOUSE_MANAGER, // chỉ cho phép quản kho chỉnh sửa
      cellRendererParams: {
        onDelete: (data: Record<string, unknown>) => {
          setDelModal({ show: true, data });
        },
        onEdit: (data: Record<string, unknown>) => {
          setAddModal({ show: true, data });
        },
      },
    },
  ];

  const dataSource: IDatasource = {
    async getRows(params) {
      const { startRow, endRow } = params;
      const size = endRow - startRow;
      gridRef.current?.gridApi?.showLoadingOverlay();
      const data = await getAllVaccine({
        pageNum: startRow / size + 1, limit: size, ...!isBlank(searchKey.current) && {
          searchKey: searchKey.current
        },
      });
      if (data.status) {
        params.successCallback(data.result.items, data.result.pagination.totalCount);
      } else {
        params.successCallback([], 0);
      }
      gridRef.current?.gridApi?.hideOverlay();
    },
    rowCount: 10,
  };

  const handleHideAddModal = () => {
    setAddModal({});
  };

  const handleShowAddModal = () => {
    setAddModal({ show: true });
  };
  const handleDel = async () => {
    console.log(delModal);
    if (delModal.data) {
      const res = await deleteVaccine({ id: delModal.data.id });
      if (res.status) {
        showSuccess('Xóa thành công');
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

  const handleSearch = (values: { searchKey: string }) => {
    searchKey.current = values.searchKey;
    refreshData();
  }

  return (
    <div className="w-full h-full p-10 flex flex-col bg-[#F3F4F6]">
      <div className="flex justify-between items-center mb-2">
        <div className="title  font-bold">Danh mục vaccine</div>
        {userInfo?.role === ROLE.WAREHOUSE_MANAGER && (
          <Button onClick={handleShowAddModal}>
            <div className="flex items-center">
              <IoMdAddCircleOutline width={24} height={24} className="mr-1 h-[1.4rem] w-[1.4rem]" />
              Thêm Vaccine
            </div>
          </Button>
        )}
      </div>
      <div className='mb-5'>
        <Formik
          onSubmit={handleSearch}
          initialValues={{ searchKey: '' }}>
          {({ handleChange, handleSubmit }) => (<form
            className='grid grid-cols-10 gap-4' // Grid với 6 cột
            onSubmit={handleSubmit}
          >
            <TextInput
              placeholder='Nhập thông tin ...'
              name="searchKey"
              onChange={handleChange}
              className='col-span-2' // TextInput chiếm 5 cột
            />
            <Button
              type='submit'
              className='col-span-1' // Button nhỏ hơn, chiếm 1 cột
            >
              Tìm kiếm
            </Button>
          </form>
          )}
        </Formik>
      </div>
      <DataGrid
        ref={(instance: DataGridHandle) => (gridRef.current = instance)}
        columnDefs={columnDefs}
        onGridReady={refreshData}
        rowModelType="infinite"
      ></DataGrid>

      <Modal title={addModal.data != null ? 'Cập nhật vaccine' : 'Thêm vaccine'} show={addModal.show} onHide={handleHideAddModal}>
        {addModal.show && (
          <VaccineForm
            editData={addModal.data}
            onSuccess={() => {
              handleHideAddModal();
              refreshData();
            }}
          />
        )}
      </Modal>
      <Modal title="Xóa vaccine" show={delModal.show} onConfirm={handleDel} onHide={handleHideDelModal}>
        Bạn có chắc chắn muốn xóa vaccine không ?
      </Modal>
    </div>
  );
};

export default VaccineManagement;
