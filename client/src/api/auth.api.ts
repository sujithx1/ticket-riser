
import { useMutation, useQuery } from '@tanstack/react-query';
import axios, { isAxiosError } from 'axios';
import toast from 'react-hot-toast';

export type SessionData = {
  user: {
    id: string;
    name: string;
    role: {
      id: string;
      name: string;
    };
    phone: string;
  };
  // permissions: AppPermission[];
};

export const getSessionId = () => localStorage.getItem('app_session_id');
export function UseGetSession({ enabled }: { enabled: boolean }) {
  return useQuery({
    queryKey: ['session'],
    queryFn: async (): Promise<SessionData | null> => {
      const sessionId = getSessionId();
      if (!sessionId) return null;

      try {
        const response = await axios.post(`${import.meta.env.VITE_AUTH_URL}/api/validate-session`, {
          app_session_id: sessionId,
        });

        const data = response.data;

        return {
          user: data.user,
        };
      } catch (error: unknown) {
        if (isAxiosError(error)) {
          toast.error(error.response?.data.message || 'Something went wrong');
          if (error?.response?.status === 401) {
            console.log('Session expired');
            window.location.href = '/login'; // redirect
          }

          throw error;
        }

        toast.error('Something went wrong');
        throw error;
      }
    },

    staleTime: Infinity,
    retry: false,
    enabled,
  });
}

export const UsePostLogout = () => {
  return useMutation({
    mutationFn: async (app_session_id: string) => {
      const res = await axios.post(`${import.meta.env.VITE_AUTH_URL}/api/logout`, {
        app_session_id: app_session_id,
      });
      return res;
    },
  });
};
