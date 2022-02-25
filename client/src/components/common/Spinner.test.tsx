import { RenderResult } from '@testing-library/react';
import { customRender, debug, query } from '../../test-utils';
import { Spinner } from './Spinner';

describe('Spinner', () => {
  let defaultRender: () => RenderResult;

  beforeEach(() => {
    defaultRender = () => customRender(
      <Spinner />
    );
  });

  it('shows a spinner icon', () => {
    defaultRender();

    expect(query('.spinner-wrapper .mock-fa-icon')).toHaveAttribute('data-icon', 'spinner');
  });
});