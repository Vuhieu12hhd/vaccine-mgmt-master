import React, { forwardRef, useRef, useState } from 'react';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { isBlank, uuid } from 'utils';
import './style.scss';

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  errorMessage?: string;
  hasError?: boolean;
  inputClass?: string;
  label?: string;
  icon?: React.ReactNode;
}

const TextInput = forwardRef((props: TextInputProps) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { hasError, icon, errorMessage, label, inputClass, size, className, type, ...rest } = props;
  const [show, setShow] = useState(false);
  const componentId = useRef(uuid());
  return (
    <div className={className}>
      <label htmlFor={componentId.current} className={`block text-sm font-medium leading-6 text-gray-900 `}>
        {label}
      </label>
      <div className="relative mt-2 rounded-md shadow-sm">
        <input
          name="price"
          id={componentId.current}
          className={`
          block outline-none w-full rounded-md border-0 py-1.5 px-4 text-gray-900 ring-1 ring-inset
           ring-gray-300  placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6
           ${hasError ? 'ring-red-400' : ''}
           ${inputClass ?? ''}
          `}
          {...rest}
          type={type == 'password' ? (show ? 'text' : 'password') : type}
        />
        <div className="icon absolute top-1/2 right-0 mr-2 -translate-y-1/2 text-gray-900">{icon}</div>
        {type === 'password' && (
          <div className="icon absolute top-1/2 right-0 mr-2 -translate-y-1/2 text-gray-900" onClick={() => setShow(!show)}>
            {show ? <AiOutlineEyeInvisible className="text-gray-500 cursor-pointer" /> : <AiOutlineEye className="text-gray-500 cursor-pointer" />}
          </div>
        )}
      </div>
      {props.hasError && !isBlank(props.errorMessage) && <div className="text-base  text-red-500">{props.errorMessage}</div>}
    </div>
  );
});

TextInput.displayName = 'TextInput';

export default TextInput;
