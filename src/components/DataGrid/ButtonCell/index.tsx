import { ICellRendererParams } from 'ag-grid-community';
import Button from 'elements/Button';
import React from 'react';

interface ButtonCellProps extends ICellRendererParams {
  label: (data: Record<string, unknown>) => string;
  onClick: (data: Record<string, unknown>) => string;
  isDisabled?: (data: Record<string, unknown>) => boolean;
  class: (data: Record<string, unknown>) => string;
}

const ButtonCell = (props: ButtonCellProps) => {
  return (
    <div>
      <Button disabled={props.isDisabled?.(props.data)} onClick={() => props.onClick(props.data)}>{props.label(props.data)}</Button>
    </div>
  );
};

export default ButtonCell;
