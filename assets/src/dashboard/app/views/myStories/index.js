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
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * External dependencies
 */
import { useContext, useEffect, useMemo } from 'react';

/**
 * Internal dependencies
 */
import { UnitsProvider } from '../../../../edit-story/units';
import { TransformProvider } from '../../../../edit-story/components/transform';
import {
  InfiniteScroller,
  ScrollToTop,
  Layout,
  StandardViewContentGutter,
  ToggleButtonGroup,
  DefaultParagraph1,
} from '../../../components';
import {
  VIEW_STYLE,
  STORY_STATUSES,
  DASHBOARD_VIEWS,
  STORY_SORT_MENU_ITEMS,
  STORY_ITEM_CENTER_ACTION_LABELS,
} from '../../../constants';
import { useDashboardResultsLabel, useStoryView } from '../../../utils';
import { ApiContext } from '../../api/apiProvider';
import FontProvider from '../../font/fontProvider';
import {
  BodyViewOptions,
  PageHeading,
  NoResults,
  StoryGridView,
  StoryListView,
  HeaderToggleButtonContainer,
} from '../shared';

function MyStories() {
  const {
    actions: {
      storyApi: { updateStory, fetchStories, trashStory, duplicateStory },
      templateApi: { createTemplateFromStory },
    },
    state: {
      stories: {
        allPagesFetched,
        isLoading,
        stories,
        storiesOrderById,
        totalStoriesByStatus,
        totalPages,
      },
      tags,
      categories,
      users,
    },
  } = useContext(ApiContext);

  const { view, sort, filter, page, search } = useStoryView({
    filters: STORY_STATUSES,
    totalPages,
  });

  const resultsLabel = useDashboardResultsLabel({
    isActiveSearch: Boolean(search.keyword),
    currentFilter: filter.value,
    totalResults: totalStoriesByStatus?.all,
    view: DASHBOARD_VIEWS.MY_STORIES,
  });

  useEffect(() => {
    fetchStories({
      sortOption: sort.value,
      searchTerm: search.keyword,
      sortDirection: view.style === VIEW_STYLE.LIST && sort.direction,
      status: filter.value,
      page: page.value,
    });
  }, [
    view.style,
    sort.direction,
    page.value,
    sort.value,
    filter.value,
    search.keyword,
    fetchStories,
  ]);

  const orderedStories = useMemo(() => {
    return storiesOrderById.map((storyId) => {
      return stories[storyId];
    });
  }, [stories, storiesOrderById]);

  const storiesView = useMemo(() => {
    switch (view.style) {
      case VIEW_STYLE.GRID:
        return (
          <StoryGridView
            trashStory={trashStory}
            updateStory={updateStory}
            createTemplateFromStory={createTemplateFromStory}
            duplicateStory={duplicateStory}
            stories={orderedStories}
            users={users}
            centerActionLabelByStatus={STORY_ITEM_CENTER_ACTION_LABELS}
            bottomActionLabel={__('Open in editor', 'web-stories')}
          />
        );
      case VIEW_STYLE.LIST:
        return (
          <StoryListView
            stories={orderedStories}
            storySort={sort.value}
            storyStatus={filter.value}
            sortDirection={sort.direction}
            handleSortChange={sort.set}
            handleSortDirectionChange={sort.setDirection}
            tags={tags}
            categories={categories}
            users={users}
          />
        );
      default:
        return null;
    }
  }, [
    view.style,
    trashStory,
    updateStory,
    createTemplateFromStory,
    duplicateStory,
    orderedStories,
    filter.value,
    sort,
    tags,
    categories,
    users,
  ]);

  const storiesViewControls = useMemo(() => {
    return (
      <BodyViewOptions
        showGridToggle
        resultsLabel={resultsLabel}
        layoutStyle={view.style}
        handleLayoutSelect={view.toggleStyle}
        currentSort={sort.value}
        pageSortOptions={STORY_SORT_MENU_ITEMS}
        handleSortChange={sort.set}
        sortDropdownAriaLabel={__(
          'Choose sort option for display',
          'web-stories'
        )}
      />
    );
  }, [sort, resultsLabel, view]);

  const BodyContent = useMemo(() => {
    if (orderedStories.length > 0) {
      return (
        <StandardViewContentGutter>
          {storiesView}
          <InfiniteScroller
            canLoadMore={!allPagesFetched}
            isLoading={isLoading}
            allDataLoadedMessage={__('No more stories', 'web-stories')}
            onLoadMore={page.requestNextPage}
          />
        </StandardViewContentGutter>
      );
    } else if (search.keyword.length > 0) {
      return <NoResults typeaheadValue={search.keyword} />;
    }

    return (
      <DefaultParagraph1>
        {__('Create a story to get started!', 'web-stories')}
      </DefaultParagraph1>
    );
  }, [
    orderedStories.length,
    isLoading,
    allPagesFetched,
    page.requestNextPage,
    search.keyword,
    storiesView,
  ]);

  const HeaderToggleButtons = useMemo(() => {
    if (
      totalStoriesByStatus &&
      Object.keys(totalStoriesByStatus).length === 0
    ) {
      return null;
    }

    return (
      <HeaderToggleButtonContainer>
        <ToggleButtonGroup
          buttons={STORY_STATUSES.map((storyStatus) => {
            return {
              handleClick: () => filter.set(storyStatus.value),
              key: storyStatus.value,
              isActive: filter.value === storyStatus.value,
              disabled: totalStoriesByStatus?.[storyStatus.status] <= 0,
              text: `${storyStatus.label} ${
                totalStoriesByStatus?.[storyStatus.status]
                  ? `(${totalStoriesByStatus?.[storyStatus.status]})`
                  : ''
              }`,
            };
          })}
        />
      </HeaderToggleButtonContainer>
    );
  }, [filter, totalStoriesByStatus]);

  return (
    <FontProvider>
      <TransformProvider>
        <Layout.Provider>
          <Layout.Squishable>
            <PageHeading
              defaultTitle={__('My Stories', 'web-stories')}
              searchPlaceholder={__('Search Stories', 'web-stories')}
              stories={orderedStories}
              handleTypeaheadChange={search.setKeyword}
              typeaheadValue={search.keyword}
            >
              {HeaderToggleButtons}
            </PageHeading>
            {storiesViewControls}
          </Layout.Squishable>
          <Layout.Scrollable>
            <UnitsProvider pageSize={view.pageSize}>
              {BodyContent}
            </UnitsProvider>
          </Layout.Scrollable>
          <Layout.Fixed>
            <ScrollToTop />
          </Layout.Fixed>
        </Layout.Provider>
      </TransformProvider>
    </FontProvider>
  );
}

export default MyStories;
