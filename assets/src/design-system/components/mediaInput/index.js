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
import styled, { css } from 'styled-components';
import PropTypes from 'prop-types';
import { useState, forwardRef, useMemo } from 'react';
import { __ } from '@web-stories-wp/i18n';
import { v4 as uuidv4 } from 'uuid';

/**
 * Internal dependencies
 */
import { MULTIPLE_VALUE } from '../../../edit-story/constants';
import {
  Button as DefaultButton,
  BUTTON_SIZES,
  BUTTON_TYPES,
  BUTTON_VARIANTS,
  Icons,
  Menu,
} from '../../';
import { MEDIA_VARIANTS } from './constants';

const MediaRectangle = styled.section`
  width: 64px;
  height: 114px;
  background-color: ${({ theme }) => theme.colors.bg.primary};
  :focus {
    outline: -webkit-focus-ring-color auto 1px;
  }
  border-radius: 4px;
  position: relative;
`;

const MediaCircle = styled(MediaRectangle)`
  border-radius: 100px;
  height: 54px;
  width: 54px;
`;

const ImageWrapper = styled.div`
  border-radius: ${({ variant }) =>
    variant === MEDIA_VARIANTS.CIRCLE ? 100 : 4}px;
  overflow: hidden;
  height: 100%;
`;

const DefaultImage = styled(Icons.Landscape)`
  width: 100%;
  height: 100%;
  display: block;
  color: ${({ theme }) => theme.colors.standard.white};
`;

const Img = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const menuStyleOverride = css`
  min-width: 100px;
  margin-left: -50%;
  li {
    display: block;
  }
`;

const Button = styled(DefaultButton)`
  background-color: ${({ theme }) =>
    theme.colors.interactiveBg.secondaryNormal};
  position: absolute;
  bottom: -8px;
  right: -8px;
  &:hover {
    background-color: ${({ theme }) =>
      theme.colors.interactiveBg.secondaryHover};
  }
`;

const MediaOptions = {
  [MEDIA_VARIANTS.RECTANGLE]: MediaRectangle,
  [MEDIA_VARIANTS.CIRCLE]: MediaCircle,
};

const LoadingDots = styled.div`
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  pointer-events: none;
  border-radius: 50%;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  display: flex;

  &:after {
    pointer-events: none;
    color: ${({ theme }) => theme.colors.standard.white};
    content: '.';
    font-weight: bold;
    animation: dots 1s steps(5, end) infinite;
    margin-left: -12px;
  }

  @keyframes dots {
    0%,
    20% {
      color: transparent;
      text-shadow: 6px 0 0 transparent, 12px 0 0 transparent;
    }
    40% {
      color: white;
      text-shadow: 6px 0 0 transparent, 12px 0 0 transparent;
    }
    60% {
      text-shadow: 6px 0 0
          ${({ theme }) => theme.colors.standard.white},
        12px 0 0 transparent;
    }
    80%,
    100% {
      text-shadow: 6px 0 0
          ${({ theme }) => theme.colors.standard.white};
        12px 0 0 ${({ theme }) => theme.colors.standard.white};
    }
  }
`;

const MediaInput = forwardRef(function Media(
  {
    className,
    onBlur,
    onChange,
    alt = __('Preview image', 'web-stories'),
    value,
    ariaLabel = __('Choose an image', 'web-stories'),
    variant = MEDIA_VARIANTS.RECTANGLE,
    isLoading,
    menuOptions = [],
    onMenuOption,
    openMediaPicker,
    menuProps = {},
    ...rest
  },
  ref
) {
  const hasMenu = menuOptions?.length > 0;
  const isMultiple = value === MULTIPLE_VALUE;
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const listId = useMemo(() => `list-${uuidv4()}`, []);
  const buttonId = useMemo(() => `button-${uuidv4()}`, []);

  const StyledMedia = MediaOptions[variant];
  return (
    <StyledMedia ref={ref} className={className} {...rest}>
      <ImageWrapper variant={variant}>
        {value && !isMultiple ? (
          <Img src={value} alt={alt} />
        ) : (
          <DefaultImage />
        )}
        {isLoading && <LoadingDots />}
      </ImageWrapper>
      <Button
        id={buttonId}
        variant={BUTTON_VARIANTS.SQUARE}
        type={BUTTON_TYPES.TERTIARY}
        size={BUTTON_SIZES.SMALL}
        aria-label={ariaLabel}
        onClick={hasMenu ? () => setIsMenuOpen(true) : openMediaPicker}
        aria-owns={hasMenu ? listId : null}
        aria-pressed={isMenuOpen}
        aria-expanded={isMenuOpen}
        {...rest}
      >
        <Icons.Pencil />
      </Button>
      {isMenuOpen && (
        <Menu
          parentId={buttonId}
          listId={listId}
          hasMenuRole
          options={menuOptions}
          onMenuItemClick={(evt, val) => {
            onMenuOption(evt, val);
            setIsMenuOpen(false);
          }}
          onDismissMenu={() => setIsMenuOpen(false)}
          menuStylesOverride={menuStyleOverride}
          {...menuProps}
        />
      )}
    </StyledMedia>
  );
});

MediaInput.propTypes = {
  className: PropTypes.string,
  value: PropTypes.any,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func,
  ariaLabel: PropTypes.string,
  alt: PropTypes.string,
  isLoading: PropTypes.bool,
  variant: PropTypes.string,
  menuOptions: PropTypes.array,
  onMenuOption: PropTypes.func,
  openMediaPicker: PropTypes.func.isRequired,
  menuProps: PropTypes.object,
};

export default MediaInput;
