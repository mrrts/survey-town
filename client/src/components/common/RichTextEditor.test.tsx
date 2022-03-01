import { RichTextEditor } from './RichTextEditor';
import { customRender, query, debug } from '../../test-utils';

describe('RichTextEditor', () => {
  const originalConsoleWarn = console.warn;

  beforeEach(() => {
    console.warn = jest.fn() // suppress react-rte src's warnings in test console
  });

  afterEach(() => {
    console.warn = originalConsoleWarn;
  });

  // most functionality is handled by ReactRTE component, so there's not a lot we 
  // can test here. They have no input/textarea on which to fire a change event.

  it('renders a rich text editor', () => {
    customRender(<RichTextEditor />);

    expect(query('.rich-text-editor')).toBeInTheDocument();
  });
});