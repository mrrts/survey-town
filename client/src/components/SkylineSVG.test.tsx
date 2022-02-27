import { render } from "@testing-library/react";
import { SkylineSVG } from "./SkylineSVG";

describe('SkylineSVG', () => {
  it('matches the snapshot', () => {
    const { baseElement } = render(
      <SkylineSVG />
    );

    expect(baseElement).toMatchSnapshot();
  })
});