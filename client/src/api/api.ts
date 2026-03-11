import { handleError } from "@/axios/error";
import { api } from "@/axios/instance";
import type { Comment, CreateTicketFormValues, Issue } from "@/types/types";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export interface Developer {
  id: string;
  name: string;
  role: {
    id: string;
    name: string;
  };
}

type AxiosResponse<T> = {
  data: T;
  message?: string;
};
export const UseGetDeveolper = () => {
  return useQuery({
    queryKey: ["developers"],
    queryFn: async () => {
      const res = await api.get<AxiosResponse<Developer[]>>("/developers");
      return res.data.data;
    },
  });
};

export const UsePostTicket = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateTicketFormValues) => {
      const res = await api.post("/issue", data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["issues"] });
    },
    onError: (error) => {
      handleError(error);

      console.log("api -errorrrr ", error);
    },
  });
};

interface Paginations {
  page?: number;
  limit?: number;
  search?: string;
  filter?: string;
}

export const UseGetTickets = (filter: Paginations) => {
  return useQuery({
    queryKey: ["issues", filter],
    queryFn: async () => {
      const res = await api.get<AxiosResponse<Issue[]>>("/issues", {
        params: filter,
      });
      return res.data.data;
    },
  });
};

export const UsePostComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      issueId: string;
      comment: string;
      attachments?: {
        url: string;
        name: string;
      }[];
    }) => {
      const res = await api.post<AxiosResponse<Comment>>("/comment", data);
      return res.data.data 
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["issues"] });
    },
    onError: (error) => {
      handleError(error);
    },
  });
};
