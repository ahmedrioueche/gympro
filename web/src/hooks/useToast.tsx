import toast from "react-hot-toast";

type Callback = () => void;

export const useToast = () => {
  const withTimer = (
    fn: (msg: string) => string | void,
    message: string,
    delay?: number,
    callback?: Callback
  ) => {
    const id = fn(message);

    if (delay && callback) {
      setTimeout(() => {
        callback();
        if (id) toast.dismiss(id);
      }, delay);
    }

    return id;
  };

  return {
    success: (message: string, delay?: number, callback?: Callback) =>
      withTimer(toast.success, message, delay, callback),

    error: (message: string, delay?: number, callback?: Callback) =>
      withTimer(toast.error, message, delay, callback),

    loading: (message: string, delay?: number, callback?: Callback) =>
      withTimer(toast.loading, message, delay, callback),

    custom: (message: string, delay?: number, callback?: Callback) =>
      withTimer(toast, message, delay, callback),

    dismiss: (toastId?: string) => toast.dismiss(toastId),
  };
};
