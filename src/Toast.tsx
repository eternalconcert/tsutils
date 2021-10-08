import React, { FC, ReactNode } from 'react';
import { BehaviorSubject } from 'rxjs';
import { useObservable } from './hooks';

interface Toast {
  title: string,
  body: string,
  variant?: string,
  timeout?: number,
}

const toastStream = new BehaviorSubject<Toast[]>([]);

export function pushToast(toast: Toast): void {
  toastStream.next([...toastStream.getValue(), toast]);
  setTimeout(() => {
    toastStream.next(toastStream.getValue().filter((t) => t !== toast));
  }, toast.timeout || 10000);
}

export const ToastList: FC = () => {
  const messages = useObservable(toastStream) || [];

  function handleClose(message: Toast) {
    toastStream.next(toastStream.getValue().filter((t) => t !== message));
  }

  return (
    <div className={'toast'}>
      { messages.map((toast, index) => (
        <div key={index} className={`card bg-${toast.variant || 'success'} mb-3`} style={{ width: '20rem' }}>
          <div className={'card-header text-white'}>
            {toast.title}
            <button
              style={{ right: '5px', top: '2px', position: 'absolute' }}
              type={'button'}
              className={'btn'}
              onClick={() => { handleClose(toast); }}
            >
              {'x'}
            </button>
          </div>
          <div className={'card-body bg-white'}>
            <p className={'card-text'}>{toast.body}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
