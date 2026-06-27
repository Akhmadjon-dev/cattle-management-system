import { type ReactNode, useRef } from 'react';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { shadows } from '@/styles/shadows';

interface ModalProps {
  isOpen: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
}

export default function Modal({ isOpen, title, children, onClose }: ModalProps) {
  const modalRef = useRef<HTMLDivElement | null>(null);

  // Trap focus within modal and handle Escape key
  useFocusTrap(modalRef, onClose);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        // Close modal only if backdrop is clicked (not content)
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      role="presentation"
    >
      <div
        ref={modalRef}
        className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto"
        aria-modal="true"
        aria-labelledby="modal-title"
        role="dialog"
        style={{
          boxShadow: shadows.modal,
        }}
      >
        {/* Header */}
        <div className="flex justify-between items-center border-b border-gray-200 p-6">
          <h2
            id="modal-title"
            className="text-xl font-bold text-gray-900"
          >
            {title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-700 hover:text-gray-900 text-2xl leading-none font-light"
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
