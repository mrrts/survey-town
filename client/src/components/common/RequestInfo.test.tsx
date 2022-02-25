import { RequestStatus } from '../../store/requests/slice';
import { customRender, query } from '../../test-utils';
import { RequestInfo } from './RequestInfo';

describe('RequestInfo', () => {
  let defaultRender: any;
  const requestKey = 'request1';

  beforeEach(() => {
    defaultRender = () => customRender(
      <RequestInfo requestKey={requestKey} />,
      { requests: { requests: { [requestKey]: { state: RequestStatus.PENDING } as any}}}
    );
  });

  it('shows a spinner whilst the request is pending', () => {
    defaultRender();

    expect(query('.spinner-wrapper')).toBeInTheDocument();
  });

  it('does not show a spinner when the request is in ERROR state', () => {
    customRender(
      <RequestInfo requestKey={requestKey} />,
      { requests: { requests: { [requestKey]: { state: RequestStatus.ERROR } as any}}}
    );

    expect(query('.spinner-wrapper')).not.toBeInTheDocument();
  });

  it('does not show a spinner when the request is in SUCCESS state', () => {
    customRender(
      <RequestInfo requestKey={requestKey} />,
      { requests: { requests: { [requestKey]: { state: RequestStatus.SUCCESS } as any}}}
    );

    expect(query('.spinner-wrapper')).not.toBeInTheDocument();
  });
});