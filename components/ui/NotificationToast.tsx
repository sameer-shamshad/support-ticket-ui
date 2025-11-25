'use client';

type NotificationToastProps = {
  message: string | null;
  onDismiss: () => void;
};

const NotificationToast = ({ message, onDismiss }: NotificationToastProps) => {
  if (!message) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-gray-900 text-white px-4 py-3 rounded-lg shadow-lg z-50 flex items-center gap-3 text-sm animate-fade-in-up">
      <i className="fa-solid fa-circle-check text-green-400" />
      <span>{message}</span>
      <button
        onClick={onDismiss}
        className="text-gray-400 hover:text-white transition"
        aria-label="Dismiss notification"
      >
        <i className="fa-solid fa-xmark text-sm" />
      </button>
    </div>
  );
};

export default NotificationToast;