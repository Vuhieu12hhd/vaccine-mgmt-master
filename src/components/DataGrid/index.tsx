import { ColumnApi, GridApi, GridReadyEvent } from 'ag-grid-community';
import { AgGridReact, AgGridReactProps } from 'ag-grid-react';
import { FETCH_COUNT } from 'config';
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import './style.scss';
import { AG_GRID_LOCALE_VI } from './locale';
interface DataGridProps extends AgGridReactProps {
  loadMore?: () => void;
}
export interface DataGridHandle {
  gridApi?: GridApi;
  columnApi?: ColumnApi;
}

const DataGrid = forwardRef(
  (props: DataGridProps, ref: ((instance: DataGridHandle) => void) | React.MutableRefObject<DataGridHandle | null> | null) => {
    const [gridInit, setGridInit] = useState<boolean>(false);

    const dataGridRef = useRef<{
      gridApi?: GridApi;
      columnApi?: ColumnApi;
      loading: boolean;
    }>({
      loading: false,
    });

    useEffect(() => {
      return () => {
        delete dataGridRef.current.gridApi;
        delete dataGridRef.current.columnApi;
      };
    }, []);

    useImperativeHandle(
      ref,
      () => ({
        gridApi: dataGridRef.current.gridApi,
        columnApi: dataGridRef.current.columnApi,
      }),
      [gridInit],
    );

    const onGridReady = (event: GridReadyEvent) => {
      event.api.sizeColumnsToFit();

      dataGridRef.current.gridApi = event.api;
      dataGridRef.current.columnApi = event.columnApi as unknown as ColumnApi;

      window.addEventListener('resize', function () {
        setTimeout(function () {
          event.api.sizeColumnsToFit();
        });
      });

      props.onGridReady?.(event);
      setGridInit(true);
    };
    return (
      <div className="ag-theme-alpine w-full flex-1 data-grid">
        <AgGridReact
          overlayLoadingTemplate={`<span class="ag-overlay-loading-center">Đang tải dữ liệu...</span>`}
          pagination
          paginationAutoPageSize
          cacheBlockSize={FETCH_COUNT}
          suppressCellFocus
          rowHeight={40}
          headerHeight={40}
          overlayNoRowsTemplate={`<span class="ag-overlay-no-rows-center">Không có dữ liệu hiển thị </span>`}
          suppressScrollOnNewData
          localeText={AG_GRID_LOCALE_VI}
          defaultColDef={{
            minWidth: 120,
          }}
          {...props}
          onGridReady={onGridReady}
        ></AgGridReact>
      </div>
    );
  },
);

DataGrid.displayName = 'DataGrid';

export default DataGrid;
