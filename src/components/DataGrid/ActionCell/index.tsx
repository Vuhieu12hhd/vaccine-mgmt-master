import React from 'react';
import { ICellRendererParams } from 'ag-grid-community';
import { BiEditAlt } from 'react-icons/bi';
import { RiDeleteBinLine } from 'react-icons/ri';
import './style.scss';

interface ActionsCellProps extends ICellRendererParams {
  onEdit?: (data?: Record<string, unknown>) => void;
  onCopy?: (data?: Record<string, unknown>) => void;
  onDelete?: (data?: Record<string, unknown>) => void;
  onView?: (data?: Record<string, unknown>) => void;
  hideEdit?: (data?: Record<string, unknown>) => boolean;
  hideDelete?: (data?: Record<string, unknown>) => boolean;
}

const ActionsCell = (props: ActionsCellProps) => {
  const data = props.data;

  const hideEdit = props.hideEdit?.(data);
  const hideDelete = props.hideDelete?.(data);
  return (
    <div className="actions-cell flex w-full h-full items-center justify-center">
      {!hideEdit && (
        <BiEditAlt title="Sửa" className="mr-2 text-green-500 hover:text-green-400 cursor-pointer " onClick={() => props.onEdit?.(data)} />
      )}
      {!hideDelete && (
        <RiDeleteBinLine title="Hủy" className="mr-2 text-red-500 hover:text-red-400 cursor-pointer " onClick={() => props.onDelete?.(data)} />
      )}
    </div>
  );
};

export default ActionsCell;
