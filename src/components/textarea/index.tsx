import { HtmlHTMLAttributes, ReactNode, forwardRef, useEffect } from 'react';
import './styles.css'
type TextareaProps = HtmlHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  type?: string;
  icon?: ReactNode;
  errors?: string;
  value?: string | number;
  mask?: string;
  disabled?: boolean;
  container?: {
    className: string;
  };
};

export const Textarea = forwardRef(function TextareaComponent(
  {
    mask,
    container,
    icon,
    disabled,
    errors,
    value,
    onChange,
    ...rest
  }: TextareaProps,
  ref: React.ForwardedRef<HTMLTextAreaElement>
) {
  return (
    <div className='container-textarea'>
      <label className='mb-1'>{rest.placeholder}</label>
      <div
        className={`${errors ? 'has-erro ' : ''} flex items-center rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding px-4 py-3 text-sm font-normal leading-5.6 text-gray-700 transition-all placeholder:text-gray-500 focus:border-blue-500 focus:bg-white focus:text-gray-700 focus:shadow-primary-outline focus:outline-none focus:transition-shadow ${rest.className}`}
      >
 <textarea
            className='ease block w-full appearance-none text-sm font-normal leading-5.6 text-gray-700 transition-all placeholder:text-gray-500 focus:border-blue-500 focus:bg-white focus:text-gray-700  focus:outline-none focus:transition-shadow'
            style={{ paddingLeft: '10px' }}
            onChange={onChange}
            value={value}
            {...rest}
            ref={ref}
          />
      </div>
      {/* {errors && <p className='mt-1 text-red-600'>{errors}</p>} */}
    </div>
  );
});
