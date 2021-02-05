/*
 * Copyright 2021 Google LLC
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
import PropTypes from 'prop-types';
import styled from 'styled-components';
/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
/**
 * Internal dependencies
 */
import {
  BUTTON_SIZES,
  BUTTON_TYPES,
  BUTTON_VARIANTS,
  Icons,
} from '../../../../design-system';
import { forceFocusCompanionToggle } from '../utils';
import { NavBar, NavButton } from './components';

const TopNavButtons = styled.div`
  padding-right: 15px;
`;

const Label = styled.div`
  padding-left: 24px;
`;

export function TopNavigation({ onClose }) {
  return (
    <NavBar>
      <Label>{__('Quick Tips', 'web-stories')}</Label>
      <TopNavButtons>
        <NavButton
          onClick={() => {
            forceFocusCompanionToggle();
            onClose();
          }}
          type={BUTTON_TYPES.PLAIN}
          size={BUTTON_SIZES.SMALL}
          variant={BUTTON_VARIANTS.CIRCLE}
        >
          <Icons.Close />
        </NavButton>
      </TopNavButtons>
    </NavBar>
  );
}

TopNavigation.propTypes = {
  onClose: PropTypes.func.isRequired,
};
