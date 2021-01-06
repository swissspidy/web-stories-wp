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
import { useCallback } from 'react';
import styled from 'styled-components';

/**
 * WordPress dependencies
 */
import { __, _x } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { HIDDEN_PADDING } from '../../../../constants';
import clamp from '../../../../utils/clamp';
import { Lock, Unlock } from '../../../../icons';
import {
  Label,
  Row,
  Numeric,
  Toggle,
  usePresubmitHandler,
} from '../../../form';
import { useCommonObjectValue } from '../../shared';

const DEFAULT_PADDING = {
  horizontal: 0,
  vertical: 0,
  locked: true,
  hasHiddenPadding: false,
};

const MIN_MAX = {
  PADDING: {
    MIN: 0,
    MAX: 300,
  },
};

const BoxedNumeric = styled(Numeric)`
  padding: 6px 6px;
  border-radius: 4px;

  ${({ stretch }) => stretch && `flex-basis: auto;`}
`;

const Space = styled.div`
  flex: 0 0 10px;
`;

function PaddingControls({
  selectedElements,
  pushUpdateForObject,
  pushUpdate,
}) {
  const displayPadding = useCommonObjectValue(
    // Map over all elements and update display
    // values to not include hidden padding
    // if hidden padding is present
    selectedElements.map((el) => ({
      ...el,
      padding: {
        ...el.padding,
        horizontal:
          el.padding.horizontal -
          (el.padding.hasHiddenPadding ? HIDDEN_PADDING.horizontal : 0),
        vertical:
          el.padding.vertical -
          (el.padding.hasHiddenPadding ? HIDDEN_PADDING.vertical : 0),
      },
    })),
    'padding',
    DEFAULT_PADDING
  );

  // Only if true for all selected elements, will the toggle be true
  // (Note that this behavior is different from aspect lock ratio)
  const lockPadding = displayPadding.locked === true;

  const handleChange = useCallback(
    (updater, submit = false) => {
      pushUpdate((el) => {
        const updates = {};
        const { x, y, width, height } = el;
        const newPadding = updater(el);

        if ('horizontal' in newPadding) {
          updates.x =
            x - (newPadding.horizontal - (el.padding.horizontal || 0));
          updates.width =
            width + (newPadding.horizontal - (el.padding.horizontal || 0)) * 2;
        }

        if ('vertical' in newPadding) {
          updates.y = y - (newPadding.vertical - (el.padding.vertical || 0));
          updates.height =
            height + (newPadding.vertical - (el.padding.vertical || 0)) * 2;
        }

        return updates;
      });
      pushUpdateForObject(
        'padding',
        (v) => updater({ padding: v }),
        DEFAULT_PADDING,
        submit
      );
    },
    [pushUpdate, pushUpdateForObject]
  );

  usePresubmitHandler(
    ({ padding: { horizontal, vertical, ...rest } }) => ({
      padding: {
        ...rest,
        horizontal: clamp(horizontal, MIN_MAX.PADDING),
        vertical: clamp(vertical, MIN_MAX.PADDING),
      },
    }),
    []
  );

  const firstInputProperties = lockPadding
    ? {
        suffix: _x(
          `H\u00A0&\u00A0V`,
          'The Horizontal & Vertical padding',
          'web-stories'
        ),
        'aria-label': __('Horizontal & Vertical padding', 'web-stories'),
        onChange: (value) =>
          handleChange((el) => {
            return {
              horizontal:
                value +
                (el.padding.hasHiddenPadding ? HIDDEN_PADDING.horizontal : 0),
              vertical:
                value +
                (el.padding.hasHiddenPadding ? HIDDEN_PADDING.vertical : 0),
            };
          }),

        stretch: true,
      }
    : {
        suffix: _x('H', 'The Horizontal padding', 'web-stories'),
        'aria-label': __('Horizontal padding', 'web-stories'),
        onChange: (value) =>
          handleChange((el) => ({
            horizontal:
              value +
              (el.padding.hasHiddenPadding ? HIDDEN_PADDING.horizontal : 0),
          })),
      };

  return (
    <Row>
      <Label>{__('Padding', 'web-stories')}</Label>
      <BoxedNumeric
        value={displayPadding.horizontal}
        {...firstInputProperties}
      />
      <Space />
      <Toggle
        icon={<Lock />}
        uncheckedIcon={<Unlock />}
        value={lockPadding}
        onChange={() =>
          handleChange(
            (el) =>
              lockPadding
                ? {
                    locked: false,
                  }
                : {
                    locked: true,
                    // When setting the lock, set both dimensions to the value of horizontal
                    horizontal: el.padding.horizontal,
                    vertical:
                      el.padding.horizontal +
                      (el.padding.hasHiddenPadding
                        ? HIDDEN_PADDING.vertical - HIDDEN_PADDING.horizontal
                        : 0),
                  },
            // Not fully sure why this flag is the way it is here, but keeps tests happy
            !lockPadding
          )
        }
        aria-label={__('Toggle padding ratio lock', 'web-stories')}
      />
      {!lockPadding && (
        <>
          <Space />
          <BoxedNumeric
            suffix={_x('V', 'The Vertical padding', 'web-stories')}
            value={displayPadding.vertical}
            onChange={(value) =>
              handleChange((el) => ({
                vertical:
                  value +
                  (el.padding.hasHiddenPadding ? HIDDEN_PADDING.vertical : 0),
              }))
            }
            aria-label={__('Vertical padding', 'web-stories')}
          />
        </>
      )}
    </Row>
  );
}

PaddingControls.propTypes = {
  selectedElements: PropTypes.array.isRequired,
  pushUpdateForObject: PropTypes.func.isRequired,
  pushUpdate: PropTypes.func.isRequired,
};

export default PaddingControls;
