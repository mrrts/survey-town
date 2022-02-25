import { customRender, defaultTestAppState, wait } from "../../test-utils";
import { OnRouteChangeWorker } from './OnRouteChange';

describe('OnRouteChange', () => {
  let action: any;
  let defaultRender: any;

  beforeEach(() => {
    action = jest.fn();
    defaultRender = () => customRender(
      <OnRouteChangeWorker action={action} />,
      defaultTestAppState,
      '/'
    );
  });

  it('executes the provided action when the route changes', async () => {
    const { history } = defaultRender();

    expect(action).toHaveBeenCalledTimes(1);
    expect(action).toHaveBeenCalledWith(expect.objectContaining({ pathname: '/' }));

    await history.navigate('/surveys');
    await wait(100);

    expect(action).toHaveBeenCalledTimes(2);
    expect(action).toHaveBeenCalledWith(expect.objectContaining({ pathname: '/surveys' }));
  });

});