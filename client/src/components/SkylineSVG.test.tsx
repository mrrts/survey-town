import { render } from "@testing-library/react";
import { customRender } from "../test-utils";
import { SkylineSVG } from "./SkylineSVG";

describe('SkylineSVG', () => {
  it('matches the snapshot', () => {
    const { baseElement } = customRender(
      <SkylineSVG />
    );

    expect(baseElement).toMatchSnapshot();
  })
});