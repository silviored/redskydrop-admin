'use client';
import { ReactNode } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
type Toast = {
  children: ReactNode;
};
export function Toast({ children }: Toast) {
  return (
    <>
      {children}
      <ToastContainer />
    </>
  );
}
