import { InputHTMLAttributes, ReactNode, forwardRef, useEffect } from 'react';
import InputMask from 'react-input-mask';
import './styles.css'
type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  type?: string;
  icon?: ReactNode;
  errors?: string;
  value?: string | number;
  mask?: string;
  list?: string;
  disabled?: boolean;
  accept?: string;
  container?: {
    className: string;
  };
};

export const Input = forwardRef(function InputComponent(
  {
    mask,
    container,
    icon,
    disabled,
    errors,
    list,
    value,
    onChange,
    accept,
    ...rest
  }: InputProps,
  ref: React.ForwardedRef<HTMLInputElement>
) {
  return (
    <div className='container-input'>
      <label className='mb-1'>{rest.placeholder}</label>
      <div
        className={`${errors ? 'has-erro ' : ''} flex items-center rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding px-4 py-3 text-sm font-normal leading-5.6 text-gray-700 transition-all placeholder:text-gray-500 focus:border-blue-500 focus:bg-white focus:text-gray-700 focus:shadow-primary-outline focus:outline-none focus:transition-shadow ${rest.className}`}
      >
        {icon}
        {mask ? (
          <InputMask
            mask={mask}
            value={value}
            onChange={onChange}
            disabled={disabled}
          >
            {/* @ts-ignore */}
            {(props: InputHTMLAttributes<HTMLInputElement>) => {
              const propsCopy = { ...rest };
              delete propsCopy.onBlur;
              return (
                <input
                  className='ease block w-full appearance-none text-sm font-normal leading-5.6 text-gray-700 transition-all placeholder:text-gray-500 focus:border-blue-500 focus:bg-white focus:text-gray-700  focus:outline-none focus:transition-shadow'
                  style={{ paddingLeft: '10px' }}
                  {...props}
                  {...propsCopy}
                  ref={ref}
                />
              );
            }}
          </InputMask>
        ) : (
          <input
            className='ease block w-full appearance-none text-sm font-normal leading-5.6 text-gray-700 transition-all placeholder:text-gray-500 focus:border-blue-500 focus:bg-white focus:text-gray-700  focus:outline-none focus:transition-shadow'
            style={{ paddingLeft: '10px' }}
            onChange={onChange}
            value={value}
            accept={accept}
            list={list}
            {...rest}
            ref={ref}
          />
        )}
      </div>
      {/* {errors && <p className='mt-1 text-red-600 container-error'>{errors}</p>} */}
    </div>
  );
});
