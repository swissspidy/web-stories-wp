/*
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * External dependencies
 */
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { ThemeProvider } from 'styled-components';
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import theme from '../../../theme';
import Switch from '../switch';

function ThemeProviderWrapper({ children }) {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}

ThemeProviderWrapper.propTypes = {
  children: PropTypes.any.isRequired,
};

describe('SlideSwitch', () => {
  it('should render slide switch with On and Off label and false state and update when onlabel clicked', () => {
    const offLabel = 'Off';
    const onLabel = 'On';

    const { getByText, getByLabelText } = render(<Switch />, {
      wrapper: ThemeProviderWrapper,
    });

    expect(getByText(onLabel)).toBeInTheDocument();
    expect(getByText(offLabel)).toBeInTheDocument();

    const radioOff = getByLabelText(offLabel);
    const radioOn = getByLabelText(onLabel);

    expect(radioOff.checked).toStrictEqual(true);
    expect(radioOn.checked).toStrictEqual(false);

    fireEvent.click(getByText(onLabel));

    expect(radioOff.checked).toStrictEqual(false);
    expect(radioOn.checked).toStrictEqual(true);
  });

  it('should render slide switch with predefined value and update the state when offlabel click', () => {
    const offLabel = 'Fit to device';
    const onLabel = 'Do not fit';

    const { getByText, getByLabelText } = render(
      <Switch onLabel={onLabel} offLabel={offLabel} value={true} />,
      { wrapper: ThemeProviderWrapper }
    );

    expect(getByText(onLabel)).toBeInTheDocument();
    expect(getByText(offLabel)).toBeInTheDocument();

    const radioOff = getByLabelText(offLabel);
    const radioOn = getByLabelText(onLabel);

    expect(radioOff.checked).toStrictEqual(false);
    expect(radioOn.checked).toStrictEqual(true);

    fireEvent.click(getByText(offLabel));

    expect(radioOff.checked).toStrictEqual(true);
    expect(radioOn.checked).toStrictEqual(false);
  });

  it('should render slide switch with false value and then rerender with value true', () => {
    const offLabel = 'Off';
    const onLabel = 'On';

    const { getByLabelText, rerender } = render(<Switch />, {
      wrapper: ThemeProviderWrapper,
    });

    const radioOff = getByLabelText(offLabel);
    const radioOn = getByLabelText(onLabel);

    expect(radioOff.checked).toStrictEqual(true);
    expect(radioOn.checked).toStrictEqual(false);

    rerender(<Switch value={true} />, {
      wrapper: ThemeProviderWrapper,
    });

    expect(radioOff.checked).toStrictEqual(false);
    expect(radioOn.checked).toStrictEqual(true);
  });

  it('should render slide switch with false value and then call onChange when label clicked', () => {
    const onLabel = 'On';
    const offLabel = 'Off';

    const onChange = jest.fn();

    const { getByText } = render(<Switch onChange={onChange} />, {
      wrapper: ThemeProviderWrapper,
    });

    fireEvent.click(getByText(onLabel));
    expect(onChange).toHaveBeenCalledWith(true);
    expect(onChange).toHaveBeenCalledTimes(1);

    fireEvent.click(getByText(offLabel));
    expect(onChange).toHaveBeenCalledWith(false);
  });
});
