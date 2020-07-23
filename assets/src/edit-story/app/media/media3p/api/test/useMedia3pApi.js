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
import { renderHook } from '@testing-library/react-hooks';

/**
 * Internal dependencies
 */
import { useMedia3pApi } from '../index';
import Media3pApiProvider from '../media3pApiProvider';

jest.mock('../apiFetcher');

import apiFetcherMock from '../apiFetcher';

describe('useMedia3pApi', () => {
  apiFetcherMock.listMedia.mockImplementation(() =>
    Promise.resolve({
      media: [
        {
          name: 'media/unsplash:1234',
          provider: 'UNSPLASH',
          author: {
            displayName: 'Maria',
            url: 'http://maria.com',
          },
          imageUrls: [
            {
              url:
                'https://images.unsplash.com/photo-1515516089376-88db1e26e9c0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEzNzE5M30&fm=jpg&w=340&h=227&fit=max',
              mimeType: 'image/jpeg',
              width: 340,
              height: 227,
            },
            {
              url:
                'https://images.unsplash.com/photo-1515516089376-88db1e26e9c0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEzNzE5M30&fm=jpg&w=1060&h=707&fit=max',
              mimeType: 'image/jpeg',
              width: 1060,
              height: 707,
            },
            {
              url:
                'https://images.unsplash.com/photo-1515516089376-88db1e26e9c0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEzNzE5M30&fm=jpg&w=2121&h=1414&fit=max',
              mimeType: 'image/jpeg',
              width: 2121,
              height: 1414,
            },
            {
              url:
                'https://images.unsplash.com/photo-1515516089376-88db1e26e9c0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEzNzE5M30&fm=jpg&w=3182&h=2121&fit=max',
              mimeType: 'image/jpeg',
              width: 3182,
              height: 2121,
            },
            {
              url:
                'https://images.unsplash.com/photo-1515516089376-88db1e26e9c0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEzNzE5M30&fm=jpg&w=4243&h=2829&fit=max',
              mimeType: 'image/jpeg',
              width: 4243,
              height: 2829,
            },
            {
              url:
                'https://images.unsplash.com/photo-1515516089376-88db1e26e9c0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEzNzE5M30&fm=jpg&w=5304&h=3536&fit=max',
              mimeType: 'image/jpeg',
              width: 5304,
              height: 3536,
            },
          ],
          description: 'A cat',
          type: 'IMAGE',
          createTime: '1234',
          updateTime: '5678',
        },
      ],
      nextPageToken: 'lala',
    })
  );
  apiFetcherMock.listCategories.mockImplementation(() =>
    Promise.resolve({
      categories: [
        {
          name: 'categories/unsplash:1',
          displayName: 'Covid-19',
        },
        {
          name: 'categories/unsplash:2',
          displayName: 'Mountains',
        },
      ],
    })
  );

  it('should properly call listMedia and map the results', async () => {
    const wrapper = (params) => (
      <Media3pApiProvider>{params.children}</Media3pApiProvider>
    );
    const { result } = renderHook(() => useMedia3pApi(), { wrapper });

    const listMediaResult = await result.current.actions.listMedia({
      provider: 'unsplash',
    });

    expect(apiFetcherMock.listMedia).toHaveBeenCalledWith({
      filter: 'provider:unsplash',
      orderBy: undefined,
      pageSize: 20,
      pageToken: undefined,
    });
    expect(listMediaResult).toStrictEqual({
      media: [
        {
          alt: null,
          attribution: {
            author: {
              displayName: 'Maria',
              url: 'http://maria.com',
            },
          },
          creationDate: '1234',
          height: 3536,
          id: undefined,
          length: null,
          lengthFormatted: null,
          local: false,
          mimeType: 'image/jpeg',
          poster: null,
          posterId: null,
          sizes: {
            web_stories_thumbnail: {
              file: 'media/unsplash:1234',
              source_url:
                'https://images.unsplash.com/photo-1515516089376-88db1e26e9c0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEzNzE5M30&fm=jpg&w=340&h=227&fit=max',
              mime_type: 'image/jpeg',
              width: 340,
              height: 227,
            },
            '1060_707': {
              file: 'media/unsplash:1234',
              source_url:
                'https://images.unsplash.com/photo-1515516089376-88db1e26e9c0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEzNzE5M30&fm=jpg&w=1060&h=707&fit=max',
              mime_type: 'image/jpeg',
              width: 1060,
              height: 707,
            },
            '2121_1414': {
              file: 'media/unsplash:1234',
              source_url:
                'https://images.unsplash.com/photo-1515516089376-88db1e26e9c0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEzNzE5M30&fm=jpg&w=2121&h=1414&fit=max',
              mime_type: 'image/jpeg',
              width: 2121,
              height: 1414,
            },
            '3182_2121': {
              file: 'media/unsplash:1234',
              source_url:
                'https://images.unsplash.com/photo-1515516089376-88db1e26e9c0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEzNzE5M30&fm=jpg&w=3182&h=2121&fit=max',
              mime_type: 'image/jpeg',
              width: 3182,
              height: 2121,
            },
            large: {
              file: 'media/unsplash:1234',
              source_url:
                'https://images.unsplash.com/photo-1515516089376-88db1e26e9c0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEzNzE5M30&fm=jpg&w=4243&h=2829&fit=max',
              mime_type: 'image/jpeg',
              width: 4243,
              height: 2829,
            },
            full: {
              file: 'media/unsplash:1234',
              source_url:
                'https://images.unsplash.com/photo-1515516089376-88db1e26e9c0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEzNzE5M30&fm=jpg&w=5304&h=3536&fit=max',
              mime_type: 'image/jpeg',
              width: 5304,
              height: 3536,
            },
          },
          src:
            'https://images.unsplash.com/photo-1515516089376-88db1e26e9c0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEzNzE5M30&fm=jpg&w=5304&h=3536&fit=max',
          title: 'A cat',
          type: 'image',
          width: 5304,
        },
      ],
      nextPageToken: 'lala',
    });
  });

  it('should call listMedia with searchTerm', async () => {
    const wrapper = (params) => (
      <Media3pApiProvider>{params.children}</Media3pApiProvider>
    );
    const { result } = renderHook(() => useMedia3pApi(), { wrapper });

    await result.current.actions.listMedia({
      provider: 'unsplash',
      searchTerm: 'cat',
    });

    expect(apiFetcherMock.listMedia).toHaveBeenCalledWith({
      filter: 'provider:unsplash cat',
      orderBy: undefined,
      pageSize: 20,
      pageToken: undefined,
    });
  });

  it('should call listMedia with category and ignored search term', async () => {
    const wrapper = (params) => (
      <Media3pApiProvider>{params.children}</Media3pApiProvider>
    );
    const { result } = renderHook(() => useMedia3pApi(), { wrapper });

    await result.current.actions.listMedia({
      provider: 'unsplash',
      searchTerm: 'cat',
      selectedCategoryName: 'category/1',
    });

    expect(apiFetcherMock.listMedia).toHaveBeenCalledWith({
      filter: 'provider:unsplash category_id:category/1',
      orderBy: undefined,
      pageSize: 20,
      pageToken: undefined,
    });
  });

  it('should call listMedia with pageToken', async () => {
    const wrapper = (params) => (
      <Media3pApiProvider>{params.children}</Media3pApiProvider>
    );
    const { result } = renderHook(() => useMedia3pApi(), { wrapper });

    await result.current.actions.listMedia({
      provider: 'unsplash',
      pageToken: 'token',
    });

    expect(apiFetcherMock.listMedia).toHaveBeenCalledWith({
      filter: 'provider:unsplash',
      orderBy: undefined,
      pageSize: 20,
      pageToken: 'token',
    });
  });

  it('should call listMedia with orderBy', async () => {
    const wrapper = (params) => (
      <Media3pApiProvider>{params.children}</Media3pApiProvider>
    );
    const { result } = renderHook(() => useMedia3pApi(), { wrapper });

    await result.current.actions.listMedia({
      provider: 'unsplash',
      orderBy: 'latest',
    });

    expect(apiFetcherMock.listMedia).toHaveBeenCalledWith({
      filter: 'provider:unsplash',
      orderBy: 'latest',
      pageSize: 20,
      pageToken: undefined,
    });
  });

  it('should properly call listCategories and map the results', async () => {
    const wrapper = (params) => (
      <Media3pApiProvider>{params.children}</Media3pApiProvider>
    );
    const { result } = renderHook(() => useMedia3pApi(), { wrapper });

    const listCategoriesResult = await result.current.actions.listCategories({
      provider: 'unsplash',
    });

    expect(listCategoriesResult).toStrictEqual({
      categories: [
        {
          name: 'categories/unsplash:1',
          displayName: 'Covid-19',
        },
        {
          name: 'categories/unsplash:2',
          displayName: 'Mountains',
        },
      ],
    });
  });
});
