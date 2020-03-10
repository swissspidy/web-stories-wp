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
import { render } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';

/**
 * Internal dependencies
 */
import theme from '../../../../theme';
import Color from '../color';

jest.mock('../getPreviewStyle', () => jest.fn());
jest.mock('../getPreviewText', () => jest.fn());

function arrange(props = {}) {
  const onChange = jest.fn();
  const { queryByLabelText } = render(
    <ThemeProvider theme={theme}>
      <Color label="Color" onChange={onChange} {...props} />
    </ThemeProvider>
  );
  const colorPreview = queryByLabelText(/Color/);
  const opacityInput = queryByLabelText(/Opacity/);
  return {
    colorPreview,
    opacityInput,
    onChange,
  };
}

describe('<Color />', () => {
  it('should render both color preview and opacity input', () => {
    const { colorPreview, opacityInput } = arrange();

    expect(colorPreview).toBeInTheDocument();
    expect(opacityInput).toBeInTheDocument();
  });
  it('should not render opacity input when disabled', () => {
    const { colorPreview, opacityInput } = arrange({ hasOpacity: false });

    expect(colorPreview).toBeInTheDocument();
    expect(opacityInput).toBeNull();
  });
});
