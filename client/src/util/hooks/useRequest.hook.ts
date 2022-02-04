import { useAppSelector } from "../../store"
import { RequestState } from "../../store/requests/slice";

export const useRequest = (requestKey: string) => {
  const request = useAppSelector(state => state.requests.requests[requestKey]);

  return {
    isPending: request?.state === RequestState.PENDING,
    error: request?.error
  };
}