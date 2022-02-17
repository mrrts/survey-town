import { useAppSelector } from "../../store"
import { RequestStatus } from "../../store/requests/slice";

export const useRequest = (requestKey: string) => {
  const request = useAppSelector(state => state.requests.requests[requestKey]);

  return {
    isPending: request?.state === RequestStatus.PENDING,
    error: request?.error
  };
}