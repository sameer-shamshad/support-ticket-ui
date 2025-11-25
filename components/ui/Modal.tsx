'use client';

import type { PropsWithChildren } from "react";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  widthClassName?: string;
};

const Modal = ({ isOpen, onClose, widthClassName = "max-w-md", children }: PropsWithChildren<ModalProps>) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className={`bg-white rounded-lg shadow-2xl w-full ${widthClassName}`}
        onClick={(event) => event.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

export default Modal;