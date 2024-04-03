import TextInput from 'elements/TextInput';
import React, { forwardRef } from 'react';
import { HiOutlineCalendarDays } from 'react-icons/hi2';
import DatePicker, { ReactDatePickerProps } from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';
interface DatePickerProps extends ReactDatePickerProps {
  label?: string;
}
const DatePickerCmp = (props: DatePickerProps) => {
  const CustomInput = forwardRef(({ value, onClick }: React.InputHTMLAttributes<HTMLInputElement>, ref) => {
    return (
      <TextInput
        inputClass="cursor-pointer"
        ref={ref}
        value={value}
        readOnly
        onClick={onClick}
        label={props.label}
        icon={<HiOutlineCalendarDays />}
      />
    );
  });

  CustomInput.displayName = 'CustomInput';

  return (
    <div className="date-picker-container">
      <DatePicker
        popperPlacement="auto-start"
        wrapperClassName="w-full"
        className="w-full"
        showMonthDropdown
        showYearDropdown
        customInput={<CustomInput />}
        dateFormat={props.showTimeInput ? 'hh:mm dd/MM/yyyy' : 'dd/MM/yyyy'}
        showTimeInput={props.showTimeInput}
        selected={props.selected}
        onChange={props.onChange}
      />
    </div>
  );
};

export default DatePickerCmp;
