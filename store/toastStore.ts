type Listener = () => void;

class ToastStore {
  private message: string | null = null;
  private listeners: Set<Listener> = new Set();

  subscribe(listener: Listener) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((listener) => listener());
  }

  getMessage() {
    return this.message;
  }

  setMessage(message: string | null) {
    this.message = message;
    this.notify();
  }
}

export const toastStore = new ToastStore();

