import { Home } from "./Home";
import { customRender, CustomRenderResult, debug, query } from "../test-utils";

describe('Home', () => {
  let initialState: any;
  let defaultRender: () => CustomRenderResult;

  beforeEach(() => {
    initialState = {};

    defaultRender = () => customRender(
      <Home />,
      initialState
    );
  });

  it('shows the skyline svg with a slideUp animation', () => {
    defaultRender();

    const skyline = () => query('.home-skyline-image');

    expect(skyline()).toBeInTheDocument();
    expect(skyline()).toHaveClass('animate__animated', 'animate__fadeInUp')
  });

  it('shows the banner with a zoomIn animation', () => {
    const { getByText } = defaultRender();

    const banner = () => query('.home-banner');

    expect(banner()).toBeInTheDocument();
    expect(banner()).toHaveClass('animate__animated', 'animate__zoomIn');
    expect(banner()?.querySelector('h2')).toHaveTextContent('Welcome to Survey Town');

    expect(getByText('Browse Surveys')).toBeInTheDocument();
    expect(getByText('Browse Surveys').tagName).toBe('A');
    expect(getByText('Browse Surveys')).toHaveAttribute('href', '/surveys');
    expect(getByText('Browse Surveys')).toHaveClass('btn-lg', 'btn-primary');
  });
});