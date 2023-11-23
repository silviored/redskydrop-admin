import './styles.css'
import { HtmlHTMLAttributes, ReactNode, forwardRef } from 'react';
type SelectProps = HtmlHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  type?: string;
  icon?: ReactNode;
  errors?: string;
  value?: string | number;
  mask?: string;
  disabled?: boolean;
  options: { label: string; value: string | number; disabled?: boolean }[];
  container?: {
    className: string;
  };
};

export const Select = forwardRef(function SelectComponent(
  {
    mask,
    container,
    icon,
    disabled,
    errors,
    options,
    value,
    onChange,
    ...rest
  }: SelectProps,
  ref: React.ForwardedRef<HTMLSelectElement>
) {
  return (
    <div className='container-select'>
      <label className='mb-1'>{rest.placeholder}</label>
      <div
        className={`${errors ? 'has-erro ' : ''} flex items-center rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding px-4 py-3 text-sm font-normal leading-5.6 text-gray-700 transition-all placeholder:text-gray-500 focus:border-blue-500 focus:bg-white focus:text-gray-700 focus:shadow-primary-outline focus:outline-none focus:transition-shadow `}
      >
        <select
            className='custom-select ease block  w-full text-sm font-normal leading-5.6 text-gray-700 transition-all placeholder:text-gray-500 focus:border-blue-500 focus:bg-white focus:text-gray-700  focus:outline-none focus:transition-shadow'
            style={{ paddingLeft: '10px' }}
            onChange={onChange}
            value={value}
            disabled={disabled}
            {...rest}
            ref={ref}
          >
            {rest.placeholder && (
              <option value="" selected>Selecione</option>
            )}
            {options?.map(option => (
              <option key={option.value} value={option.value} disabled={option.disabled}>{option.label}</option>
            ))}
          </select>
      </div>
      {/* {errors && <p className='mt-1 text-red-600 container-error'>{errors}</p>} */}
    </div>
  );
});
