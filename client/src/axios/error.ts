import { isAxiosError } from 'axios';
import toast from 'react-hot-toast';

export const handleError = (error: unknown) => {
  if (isAxiosError(error)) {
    // 1. Extract the data from the response
    const data = error.response?.data;

    // 2. Logic to find the "Real" message
    // Check: data.message (string) OR data.message[0] (array) OR data.error
    const serverMessage =data.message  
    toast.error(serverMessage || 'SYSTEM_ERR: UNKNOWN_FAILURE');

    console.error('--- INDUSTRIAL_LOG_START ---');
    console.error('Status:', error.response?.status);
    console.error('Payload:', data);
    console.error('--- INDUSTRIAL_LOG_END ---');

    throw error;
  }

  toast.error('NON_AXIOS_ERROR_DETECTED');
  throw error;
};