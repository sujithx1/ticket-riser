import { isAxiosError } from 'axios';
import toast from 'react-hot-toast';

export const handleError = (error: unknown) => {
  if (isAxiosError(error)) {
    toast.error(error.response?.data.message || 'Something went wrong');

    throw error;
  }

  toast.error('Something went wrong');
  throw error;
};
