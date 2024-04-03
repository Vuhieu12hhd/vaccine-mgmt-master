import React, { useRef, useState } from 'react';
import { ColDef, ColGroupDef, IDatasource } from 'ag-grid-community';
import DataGrid, { DataGridHandle } from 'components/DataGrid';
import { deleteProvider, getAllProvider } from 'services/vaccine';
import ActionsCell from 'components/DataGrid/ActionCell';
import Modal from 'elements/Modal';
import { showError, showSuccess } from 'utils';
import ProviderForm from 'components/ProviderForm';
import Button from 'elements/Button';
import { IoMdAddCircleOutline } from 'react-icons/io';

//Quản lý nhà cung cấp
const ProviderManagement = () => {
  // const userInfo = useLoaderData() as UserInfo | null;
  const [addModal, setAddModal] = useState<{ show?: boolean; data?: Record<string, unknown> }>({});
  const [delModal, setDelModal] = useState<{ show?: boolean; data?: Record<string, unknown>; loading?: boolean }>({});

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
      headerName: 'Tên nhà cung cấp',
      field: 'name',
      colId: 'name',
      minWidth: 120,
    },
    {
      headerName: 'Tùy chọn',
      cellRenderer: ActionsCell,
      maxWidth: 120,
      pinned: 'right',
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

  const handleHideAddModal = () => {
    setAddModal({});
  };

  const handleShowAddModal = () => {
    setAddModal({ show: true });
  };
  const handleDel = async () => {
    console.log(delModal);
    if (delModal.data) {
      const res = await deleteProvider({ id: delModal.data.id });
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

  const dataSource: IDatasource = {
    async getRows(params) {
      const { startRow, endRow } = params;
      const size = endRow - startRow;
      gridRef.current?.gridApi?.showLoadingOverlay();
      const data = await getAllProvider({
        pageNum: startRow / size + 1,
        limit: size,
      });
      if (data.status) {
        params.successCallback(data.result.items, data.result.pagination.totalCount);
      } else {
        params.successCallback([], 0);
      }
      gridRef.current?.gridApi?.hideOverlay();
    },
  };
  return (
    <div className="w-full h-full p-10 flex flex-col bg-[#F3F4F6]">
      <div className="flex justify-between items-center mb-10">
        <div className="title  font-bold">Nhà cung cấp</div>
        <Button onClick={handleShowAddModal}>
          <div className="flex items-center">
            <IoMdAddCircleOutline width={24} height={24} className="mr-1 h-[1.4rem] w-[1.4rem]" />
            Thêm nhà cung cấp
          </div>
        </Button>
      </div>
      <DataGrid
        ref={(instance: DataGridHandle) => (gridRef.current = instance)}
        columnDefs={columnDefs}
        onGridReady={refreshData}
        rowModelType="infinite"
      ></DataGrid>

      <Modal title="Thêm nhà cung cấp" show={addModal.show} onHide={handleHideAddModal}>
        {addModal.show && (
          <ProviderForm
            editData={addModal.data}
            onSuccess={() => {
              handleHideAddModal();
              refreshData();
            }}
          />
        )}
      </Modal>
      <Modal title="Xóa nhà cung cấp" show={delModal.show} onConfirm={handleDel} onHide={handleHideDelModal}>
        Bạn có chắc chắn muốn xóa nhà cung cấp không ?
      </Modal>
    </div>
  );
};

export default ProviderManagement;
