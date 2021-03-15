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
import { useCallback, useEffect, useRef, useState } from 'react';
import styled, { css } from 'styled-components';
import { v4 as uuidv4 } from 'uuid';
import { __ } from '@web-stories-wp/i18n';

/**
 * Internal dependencies
 */
import { useStory } from '../../../../app/story';
import { useConfig } from '../../../../app/config';
import { useAPI } from '../../../../app/api';
import { useFocusHighlight, states, styles } from '../../../../app/highlights';
import { Row, AdvancedDropDown, Media, Required } from '../../../form';
import useInspector from '../../../inspector/useInspector';
import { Panel, PanelTitle, PanelContent } from '../../panel';
import { MEDIA_VARIANTS } from '../../../../../design-system/components/mediaInput/constants';
import { Text, THEME_CONSTANTS } from '../../../../../design-system';
import PublishTime from './publishTime';

const LabelWrapper = styled.div`
  height: 40px;
`;

const Label = styled(Text).attrs({
  as: 'label',
  size: THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL,
})`
  color: ${({ theme }) => theme.colors.fg.primary};
`;

const MediaWrapper = styled.div`
  ${({ isHighlighted }) =>
    isHighlighted &&
    css`
      ${styles.OUTLINE}
      border-radius: 0;
    `}
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  height: 96px;
`;

const Sizer = styled.div`
  width: ${({ width }) => width}px;
  height: ${({ height }) => height}px;
`;

const HighlightRow = styled(Row)`
  position: relative;
  justify-content: space-between;
  &::after {
    content: '';
    position: absolute;
    top: -10px;
    bottom: -10px;
    left: -20px;
    right: -10px;
    ${({ isHighlighted }) => isHighlighted && styles.FLASH}
    pointer-events: none;
  }
`;

const MediaInputWrapper = styled.div`
  height: 160px;
`;

function PublishPanel() {
  const {
    actions: { getAuthors },
  } = useAPI();
  const {
    state: { tab, users, isUsersLoading },
    actions: { loadUsers },
  } = useInspector();

  const posterButtonRef = useRef();
  const publisherLogoRef = useRef();

  const highlightPoster = useFocusHighlight(states.POSTER, posterButtonRef);
  const highlightLogo = useFocusHighlight(
    states.PUBLISHER_LOGO,
    publisherLogoRef
  );

  const {
    isSaving,
    author,
    featuredMedia,
    publisherLogoUrl,
    updateStory,
  } = useStory(
    ({
      state: {
        meta: { isSaving },
        story: {
          author = {},
          featuredMedia = { id: 0, url: '', height: 0, width: 0 },
          publisherLogoUrl = '',
        },
      },
      actions: { updateStory },
    }) => {
      return {
        isSaving,
        author,
        featuredMedia,
        publisherLogoUrl,
        updateStory,
      };
    }
  );

  const [queriedUsers, setQueriedUsers] = useState(null);
  const [visibleOptions, setVisibleOptions] = useState(null);

  useEffect(() => {
    if (tab === 'document') {
      loadUsers();
    }
  }, [tab, loadUsers]);

  const { capabilities, allowedImageMimeTypes } = useConfig();

  const handleChangePoster = useCallback(
    (image) =>
      updateStory({
        properties: {
          featuredMedia: {
            id: image.id,
            height: image.sizes?.full?.height || image.height,
            url: image.sizes?.full?.url || image.url,
            width: image.sizes?.full?.width || image.width,
          },
        },
      }),
    [updateStory]
  );

  const getAuthorsBySearch = useCallback(
    (search) => {
      return getAuthors(search).then((data) => {
        const userData = data.map(({ id, name }) => ({
          id,
          name,
        }));
        setQueriedUsers(userData);
      });
    },
    [getAuthors]
  );

  // @todo Enforce square image while selecting in Media Library.
  const handleChangePublisherLogo = useCallback(
    (image) => {
      updateStory({
        properties: {
          publisherLogo: image.id,
          publisherLogoUrl: image.sizes?.thumbnail?.url || image.url,
        },
      });
    },
    [updateStory]
  );

  useEffect(() => {
    if (users?.length) {
      const currentAuthor = users.find(({ id }) => author.id === id);
      if (!currentAuthor) {
        setVisibleOptions([author, ...users]);
      } else {
        setVisibleOptions(users);
      }
    }
  }, [author, users]);

  const handleChangeAuthor = useCallback(
    ({ id, name }) => {
      updateStory({
        properties: { author: { id, name } },
      });
    },
    [updateStory]
  );

  const authorLabelId = `author-label-${uuidv4()}`;
  const dropDownParams = {
    hasSearch: true,
    'aria-labelledby': authorLabelId,
    lightMode: true,
    onChange: handleChangeAuthor,
    getOptionsByQuery: getAuthorsBySearch,
    selectedId: author.id,
  };
  return (
    <Panel
      name="publishing"
      collapsedByDefault={false}
      isPersistable={!(highlightLogo || highlightPoster)}
    >
      <PanelTitle>{__('Publishing', 'web-stories')}</PanelTitle>
      <PanelContent>
        <PublishTime />
        {capabilities && capabilities.hasAssignAuthorAction && users && (
          <Row>
            {isUsersLoading || !visibleOptions ? (
              <AdvancedDropDown
                placeholder={__('Loading…', 'web-stories')}
                disabled
                primaryOptions={[]}
                {...dropDownParams}
              />
            ) : (
              <AdvancedDropDown
                options={queriedUsers}
                primaryOptions={visibleOptions}
                searchResultsLabel={__('Search results', 'web-stories')}
                disabled={isSaving}
                {...dropDownParams}
              />
            )}
          </Row>
        )}
        <HighlightRow isHighlighted={highlightPoster?.showEffect}>
          <MediaInputWrapper>
            <MediaWrapper isHighlighted={highlightPoster?.showEffect}>
              <Sizer width={54} height={96}>
                <Media
                  ref={posterButtonRef}
                  value={featuredMedia?.url}
                  onChange={handleChangePoster}
                  title={__('Select as poster image', 'web-stories')}
                  buttonInsertText={__('Select as poster image', 'web-stories')}
                  type={allowedImageMimeTypes}
                  ariaLabel={__('Poster image', 'web-stories')}
                />
              </Sizer>
            </MediaWrapper>
            <LabelWrapper>
              <Label>{__('Poster image', 'web-stories')}</Label>
              <Required />
            </LabelWrapper>
          </MediaInputWrapper>
          <MediaInputWrapper>
            <MediaWrapper isHighlighted={highlightLogo?.showEffect}>
              <Sizer width={72} height={72}>
                <Media
                  ref={publisherLogoRef}
                  value={publisherLogoUrl}
                  onChange={handleChangePublisherLogo}
                  title={__('Select as publisher logo', 'web-stories')}
                  buttonInsertText={__(
                    'Select as publisher logo',
                    'web-stories'
                  )}
                  type={allowedImageMimeTypes}
                  ariaLabel={__('Publisher logo', 'web-stories')}
                  variant={MEDIA_VARIANTS.CIRCLE}
                />
              </Sizer>
            </MediaWrapper>
            <LabelWrapper>
              <Label>{__('Publisher logo', 'web-stories')}</Label>
              <Required />
            </LabelWrapper>
          </MediaInputWrapper>
        </HighlightRow>
      </PanelContent>
    </Panel>
  );
}

export default PublishPanel;
