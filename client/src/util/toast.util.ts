import { ReactNode } from 'react';
import { toast as toastify, ToastOptions as ToastifyToastOptions } from 'react-toastify';

// see https://fkhadra.github.io/react-toastify/api/toast 

interface ToastOptions extends ToastifyToastOptions {
}

const defaultToastOptions: ToastOptions = {
  position: 'bottom-left',
  hideProgressBar: true,
  autoClose: 5000,
};

export const toast = (message: ReactNode, options: ToastOptions = {}) => {
  toastify(message, { ...defaultToastOptions, ...options });
};

export const toastSuccess = (message: ReactNode, options: ToastOptions = {}) => {
  toastify(
    message,
    {
      ...defaultToastOptions,
      className: 'success-toast',
      ...options
    }
  );
}

export const toastDanger = (message: ReactNode, options: ToastOptions = {}) => {
  toastify(
    message,
    {
      ...defaultToastOptions,
      className: 'danger-toast',
      ...options
    }
  )
}