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
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { rgba } from 'polished';

/**
 * Internal dependencies
 */
import { Icons, Tooltip, TOOLTIP_PLACEMENT } from '../../../design-system';
import {
  KEYBOARD_USER_SELECTOR,
  VIEW_STYLE,
  VIEW_STYLE_LABELS,
} from '../../constants';

const Container = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

const ToggleButton = styled.button`
  border: none;
  padding: 0;
  background: transparent;
  cursor: pointer;

  &:hover svg {
    color: ${({ theme }) => theme.DEPRECATED_THEME.colors.gray700};
  }
  &:active svg {
    color: ${({ theme }) => theme.DEPRECATED_THEME.colors.gray800};
  }
  ${KEYBOARD_USER_SELECTOR} &:focus {
    outline: ${({ theme }) =>
      `2px solid ${rgba(
        theme.DEPRECATED_THEME.colors.bluePrimary,
        0.85
      )} !important`};
  }
`;

export default function ViewStyleBar({ onPress, layoutStyle }) {
  return (
    <Container>
      <Tooltip
        title={VIEW_STYLE_LABELS[layoutStyle]}
        placement={TOOLTIP_PLACEMENT.BOTTOM_END}
        hasTail
      >
        <ToggleButton
          aria-label={VIEW_STYLE_LABELS[layoutStyle]}
          onClick={onPress}
        >
          {layoutStyle === VIEW_STYLE.GRID && (
            <Icons.Table height="32px" width="32px" data-testid="list-icon" />
          )}
          {layoutStyle === VIEW_STYLE.LIST && (
            <Icons.Box4 height="32px" width="32px" data-testid="grid-icon" />
          )}
        </ToggleButton>
      </Tooltip>
    </Container>
  );
}

ViewStyleBar.propTypes = {
  onPress: PropTypes.func,
  layoutStyle: PropTypes.oneOf([VIEW_STYLE.GRID, VIEW_STYLE.LIST]).isRequired,
};
