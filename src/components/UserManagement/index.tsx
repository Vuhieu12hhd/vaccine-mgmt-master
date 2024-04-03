import { ColDef, ColGroupDef, IDatasource } from 'ag-grid-community';
import DataGrid, { DataGridHandle } from 'components/DataGrid';
import { ROLE } from 'config';
import Button from 'elements/Button';
import React, { useRef, useState } from 'react';
import { IoMdAddCircleOutline } from 'react-icons/io';
import Modal from 'elements/Modal';
import { getColumnDefs } from './config';
import { getUsers, updateUser } from 'services/user';
import EmployeeForm from 'components/EmployeeForm';
import Loader from 'components/Loader';
import { isBlank, showError, showSuccess } from 'utils';
import { Formik } from 'formik';
import TextInput from 'elements/TextInput';

// Quản lý người dùng
const UserManagement = (props: { title: string; type: 'CUSTOMER' | 'EMPLOYEE' }) => {
  const [addModal, setAddModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const searchKey = useRef('')
  const gridRef = useRef<DataGridHandle>();
  const buttonClick = async (data: Record<string, unknown>) => {
    setLoading(true);
    const res = await updateUser({ id: data?.id, active: !data?.active });
    if (res.status) {
      showSuccess('Cạp nhật thành công');
      refreshData();
    } else {
      showError((res.error as Record<string, unknown>)?.message as string);
    }
    setLoading(false);
  };
  const columnDefs: Array<ColDef | ColGroupDef> = getColumnDefs(props.type, buttonClick);
  const handleHideAddModal = () => {
    setAddModal(false);
  };
  const handleShowAddModal = () => {
    setAddModal(true);
  };

  const refreshData = () => {
    setTimeout(() => {
      gridRef.current?.gridApi?.setDatasource(dataSource);
    });
  };

  const dataSource: IDatasource = {
    async getRows(params) {
      const { startRow, endRow } = params;
      const size = endRow - startRow;
      gridRef.current?.gridApi?.showLoadingOverlay();
      const data = await getUsers({
        pageNum: startRow / size + 1,
        limit: size,
        ...!isBlank(searchKey.current) && {
          searchKey: searchKey.current
        },
        ...(props.type === 'CUSTOMER'
          ? {
            'role[0]': ROLE.CUSTOMER,
          }
          : {
            'role[0]': ROLE.DOCTOR,
            'role[1]': ROLE.WAREHOUSE_MANAGER,
          }),
      });
      if (data.status) {
        params.successCallback(data.result.items, data.result.pagination.totalCount);
      } else {
        params.successCallback([], 0);
      }
      gridRef.current?.gridApi?.hideOverlay();
    },
  };

  const handleSearch = (values: { searchKey: string }) => {
    searchKey.current = values.searchKey;
    refreshData();
  }

  return (
    <Loader active={loading} className="w-full h-full p-10 flex flex-col bg-[#F3F4F6]">
      <div className="flex justify-between items-center mb-2">
        <div className="title  font-bold">{props.title}</div>
        {props.type === 'EMPLOYEE' && (
          <Button onClick={handleShowAddModal}>
            <div className="flex items-center">
              <IoMdAddCircleOutline width={24} height={24} className="mr-1 h-[1.4rem] w-[1.4rem]" />
              Thêm nhân viên
            </div>
          </Button>
        )}
      </div>
      <div className='mb-5'>
        <Formik
          onSubmit={handleSearch}
          initialValues={{ searchKey: '' }}>
          {({ handleChange, handleSubmit }) => (<form className='grid grid-cols-6 gap-4' onSubmit={handleSubmit}>
            <TextInput placeholder='Nhập ký tự tìm kiếm...' name="searchKey" onChange={handleChange} />
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

      <Modal title="Thêm nhân viên" show={addModal} onHide={handleHideAddModal}>
        <EmployeeForm
          onSuccess={() => {
            handleHideAddModal();
            refreshData();
          }}
        />
      </Modal>
    </Loader>
  );
};

export default UserManagement;
