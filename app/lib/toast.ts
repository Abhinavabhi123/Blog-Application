import { toast } from "sonner";

export const successToast = (message: string) => {
  toast.success(message);
};

export const errorToast = (message: string) => {
  toast.error(message);
};

export const loadingToast = (message = "Loading...") => {
  return toast.loading(message);
};
