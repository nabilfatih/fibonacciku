import useSWR from "swr";
import axios from "axios";
import type { Libraries } from "@/types/types";

type ResponseData = {
  libraries: Libraries[];
};

const fetcher = (url: string): Promise<ResponseData> =>
  axios.get(url).then(res => res.data);

export default function useUserLibrary(userId: string) {
  // if userId is empty string, return not fetch
  const { data, error, isLoading, isValidating, mutate } = useSWR<ResponseData>(
    userId ? `/api/app/get-library/${userId}` : null,
    fetcher
  );

  return {
    libraries: data?.libraries,
    mutate,
    isLoading,
    isError: error,
    isValidating,
  };
}
