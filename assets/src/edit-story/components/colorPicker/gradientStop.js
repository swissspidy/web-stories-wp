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
import { forwardRef } from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { __, sprintf } from '@web-stories-wp/i18n';

/**
 * Internal dependencies
 */
import generatePatternStyles from '../../utils/generatePatternStyles';
import { Icons } from '../../../design-system';
import { LINE_LENGTH, LINE_WIDTH, GRADIENT_STOP_SIZE } from './constants';

const POINTER_MARGIN = 10;
const OFFSET = 3;
const Stop = styled.button.attrs(({ position }) => ({
  style: {
    right: `${
      position * (LINE_LENGTH + GRADIENT_STOP_SIZE) - LINE_WIDTH / 2
    }px`,
  },
}))`
  position: absolute;
  top: -${POINTER_MARGIN + GRADIENT_STOP_SIZE}px;
  background: transparent;
  border: 0;
  padding: 0;

  &:focus {
    /* We auto-select stops on focus, so no extra focus display is necessary */
    outline: none;
  }
`;

const fillCss = css`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
`;

const Background = styled.div`
  ${fillCss}
  ${({ color }) => generatePatternStyles(color)}
`;

const Transparent = styled.div`
  ${fillCss}
  background: conic-gradient(
    #fff 0.25turn,
    #d3d4d4 0turn 0.5turn,
    #fff 0turn 0.75turn,
    #d3d4d4 0turn 1turn
  );
  background-size: 10px 10px;
`;

const StopPointer = styled.div`
  transform: translate(${({ offset }) => `${offset}px`}, 0);
  width: ${GRADIENT_STOP_SIZE}px;
  height: ${GRADIENT_STOP_SIZE}px;
  border-radius: 2px;
  overflow: hidden;
`;

const IconWrapper = styled.div`
  position: absolute;
  left: -${9 + OFFSET}px;
  top: -8px;
  color: ${({ theme, isSelected }) =>
    isSelected ? theme.colors.fg.primary : theme.colors.fg.tertiary};
  svg {
    width: 32px;
    height: 32px;
  }
`;

function GradientStopWithRef(
  { position, index, isSelected, color, onSelect },
  ref
) {
  return (
    <Stop
      ref={ref}
      key={index}
      isSelected={isSelected}
      position={position}
      onFocus={() => onSelect(index)}
      onClick={() => onSelect(index)}
      aria-selected={isSelected}
      aria-label={sprintf(
        /* translators: %d: stop percentage */
        __('Gradient stop at %1$d%%', 'web-stories'),
        Math.round(100 - position * 100)
      )}
    >
      <IconWrapper isSelected={isSelected}>
        <Icons.TailedRectangle />
      </IconWrapper>
      <StopPointer offset={-OFFSET}>
        <Transparent />
        <Background color={color} />
      </StopPointer>
    </Stop>
  );
}

const GradientStop = forwardRef(GradientStopWithRef);

GradientStop.propTypes = {
  position: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired,
  isSelected: PropTypes.bool.isRequired,
  color: PropTypes.object.isRequired,
  onSelect: PropTypes.func.isRequired,
};

GradientStopWithRef.propTypes = GradientStop.propTypes;

export default GradientStop;
