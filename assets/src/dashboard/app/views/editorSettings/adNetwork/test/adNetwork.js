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
 * Internal dependencies
 */
import { renderWithProviders } from '../../../../../testUtils';
import AdNetworkSettings, { TEXT } from '../';

describe('Editor Settings: Ad network settings <AdNetworkSettings />', function () {
  let adNetwork;
  let mockUpdate;

  beforeEach(() => {
    adNetwork = 'none';
    mockUpdate = jest.fn((id) => {
      adNetwork = id;
    });
  });

  afterEach(() => {
    adNetwork = 'none';
  });

  it('should render ad network settings and helper text by default', function () {
    const { getByText } = renderWithProviders(
      <AdNetworkSettings
        adNetwork={adNetwork}
        handleUpdate={mockUpdate}
      />
    );

    const sectionHeader = getByText(TEXT.SECTION_HEADING);
    expect(sectionHeader).toBeInTheDocument();
  });
});
