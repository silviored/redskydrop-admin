import { ReactNode } from 'react';
import './styles.css';

type ModalProps = {
  children: ReactNode;
  onClose: () => void;
  visible: boolean;
};
export function Modal({ children, onClose, visible = true }: ModalProps) {
  if (!visible) {
    return null;
  }
  return (
    <div className='overlay'>
      <div className='content'>
        <div className='flex w-full shrink-0 items-center justify-end border-b border-solid border-slate-100'>
          <button
            type='button'
            className='fa fa-close h-4 w-4 mb-4'
            onClick={onClose}
          ></button>
        </div>

        {children}
      </div>
    </div>
  );
}
