import React, { useEffect, useRef, useState } from 'react';
import { AsyncPaginate } from 'react-select-async-paginate';
import { GroupBase, OptionProps, OptionsOrGroups } from 'react-select';
import { getAllProvider } from 'services/vaccine';
import './style.scss';
import { isBlank, uuid } from 'utils';
interface HousePickerProps {
  onSelect?: (value: Record<string, unknown> | null) => void;
  selectedOption?: Record<string, unknown> | null;
  value?: string;
  required?: boolean;
  isClearable?: boolean;
  inForm?: boolean;
  errorMessage?: string;
  hasError?: boolean;
  inputClass?: string;
  label?: string;
  icon?: React.ReactNode;
  className?: string;
}

const ProviderPicker = (props: HousePickerProps) => {
  const [selectedOption, setSelectedOption] = useState(props.selectedOption);
  const { hasError, icon, errorMessage, label, className } = props;
  const componentId = useRef(uuid());

  useEffect(() => {
    setSelectedOption(props.selectedOption);
  }, [props.selectedOption]);

  const loadOptions = async (inputValue: string, prevOption: OptionsOrGroups<Record<string, unknown>, GroupBase<Record<string, unknown>>>) => {
    try {
      const size = 20;
      const page = prevOption.length / size + 1;
      const data = await getAllProvider({ pageNum: page, limit: size });
      const vaccines = data.result.items ?? [];
      const options = (vaccines as Record<string, unknown>[]).map(item => ({ label: item.name, value: item.id, optionData: item }));
      if (prevOption.length) {
        if (props.value) {
          const selected = options.find(item => item.value === (props.selectedOption as Record<string, unknown>).value);
          setSelectedOption(selected);
        }
      }

      return {
        options,
        hasMore: page <= (data.result.pagination.totalPage as number),
      };
    } catch (error) {
      return {
        options: [],
        hasMore: false,
      };
    }
  };

  const onChange = (newValue?: unknown) => {
    if (!props.selectedOption) {
      setSelectedOption(newValue as Record<string, string>);
    }
    props.onSelect && props.onSelect(newValue as Record<string, unknown> | null);
  };

  const Option: React.ComponentType<OptionProps<Record<string, unknown>, boolean, GroupBase<Record<string, unknown>>>> = props => {
    return (
      <div
        className="text-gray-900 relative  select-none py-2 pl-3 pr-9 cursor-pointer hover:bg-gray-200"
        id="listbox-option-0"
        role="option"
        {...props.innerProps}
      >
        <div className="flex items-center">
          <span className="font-normal ml-3 block truncate">{props.label}</span>
        </div>

        {props.isSelected && (
          <span className="text-indigo-600 absolute inset-y-0 right-0 flex items-center pr-4">
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path
                fillRule="evenodd"
                d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                clipRule="evenodd"
              />
            </svg>
          </span>
        )}
      </div>
    );
  };

  const DropdownIndicator = () => (
    <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M10 3a.75.75 0 01.55.24l3.25 3.5a.75.75 0 11-1.1 1.02L10 4.852 7.3 7.76a.75.75 0 01-1.1-1.02l3.25-3.5A.75.75 0 0110 3zm-3.76 9.2a.75.75 0 011.06.04l2.7 2.908 2.7-2.908a.75.75 0 111.1 1.02l-3.25 3.5a.75.75 0 01-1.1 0l-3.25-3.5a.75.75 0 01.04-1.06z"
        clipRule="evenodd"
      />
    </svg>
  );

  return (
    <div className={className}>
      <label htmlFor={componentId.current} className={`block text-sm font-medium leading-6 text-gray-900 `}>
        {label}
      </label>
      <div className="relative mt-2 rounded-md shadow-sm">
        <AsyncPaginate
          placeholder="Nhà cung cấp"
          components={{ Option, DropdownIndicator }}
          defaultOptions
          value={selectedOption}
          onChange={onChange}
          className="vaccine-picker"
          loadOptions={loadOptions}
          isClearable={props.isClearable != null ? props.isClearable : true}
        />
        <div className="icon absolute top-1/2 right-0 mr-2 -translate-y-1/2 text-gray-900">{icon}</div>
      </div>
      {hasError && !isBlank(errorMessage) && <div className="text-base  text-red-500">{errorMessage}</div>}
    </div>
  );
};

export default ProviderPicker;
