import Loader from 'components/Loader';
import Select from 'elements/Select';
import { SelectOption } from 'interfaces/models';
import React, { useState } from 'react';
import { showSuccess } from 'utils';

interface ButtonCellProps {
  options: SelectOption[];
  onChange: (data: Record<string, unknown>, value: string) => void;
  notification?: {
    success: string;
    failed: string
  }
  data: Record<string, unknown>;
  value?: string;
}

const SelectCell = (props: ButtonCellProps) => {
  const [active, setActive] = useState(String(props.value ?? props.options[0]?.value));
  const [loading, setLoading] = useState(false);
  const handleChange = async (value: string) => {
    setLoading(true);

    try {
      await props.onChange(props.data!, value);
      setActive(value);
      if (props.notification) {
        showSuccess(props.notification.success)
      }
    } catch (error) {
      if (props.notification) {
        showSuccess(props.notification.success)
      }
    }
    setLoading(false);
  };
  return (
    <Loader active={loading} className="w-full h-full">
      <Select activeValue={active} options={props.options} onChange={handleChange} />
    </Loader>
  );
};

export default SelectCell;
