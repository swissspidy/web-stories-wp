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
 * common media typedefs =================================================
 */

/**
 * TODO(#3431) Move this to a media/typedef.js file as this is common for local
 * as well as media3p.
 *
 * @typedef Media
 * @property {Object} attribution
 * @property {string} creationDate
 * @property {number} height
 * @property {number} width
 * @property {string} id
 * @property {number} length
 * @property {*} lengthFormatted
 * @property {boolean} local
 * @property {string} mimeType
 * @property {string} poster
 * @property {string} posterId
 * @property {Object} sizes
 * @property {string} src
 * @property {string} title
 * @property {string} typedef
 */

/**
 * media3p/[provider] typedefs =================================================
 */

/**
 * 'media3p/[provider]' action typedef
 *
 * @typedef {(payload: {provider: string, id: string}) => undefined} DeleteMediaElement
 * @typedef {(payload: {provider: string}) => undefined} FetchMediaError
 * @typedef {(payload: {provider: string, pageToken: string}) => undefined} FetchMediaStart
 * @typedef {(payload: {provider: string, media, nextPageToken: string, totalPages: number}) => undefined} FetchMediaSuccess
 * (Can take extra properties in the payload)
 * @typedef {(payload: {provider: string}) => undefined} SetNextPage
 * @typedef {(payload: {provider: string, id: string }) => undefined} UpdateMediaElement
 * (Can take extra properties in the payload)
 */

/**
 * 'media3p/[provider]' actions exposed through context providers
 *
 * @typedef {Object} Media3pProviderContextActions
 * @property {SetNextPage} setNextPage action to set next page
 * @property {import('./categories/typedefs').SelectCategory} selectCategory action to select category
 * @property {import('./categories/typedefs').DeselectCategory} deselectCategory action to deselect current
 * category
 */

/**
 * 'media3p/[provider]' state object used by each provider, exposed to the rest
 * of application through context providers
 *
 * @typedef {Object} Media3pProviderContextState
 * @property {CategoriesState} categories Category state object
 * @property {boolean} hasMore has more media
 * @property {boolean} isMediaLoaded is media loaded
 * @property {boolean} isMediaLoading is media loading
 * @property {Array.<Media>} media array of media
 * @property {string} pageToken page token for current page
 * @property {string} nextPageToken the page token for the next page
 * @property {number} totalPages total pages
 */

/**
 * 'media3p/[provider]' state object used by each provider internally by the reducer.
 *
 * @typedef {Object} Media3pProviderReducerState
 * @property {CategoriesState} categories Category state object
 * @property {boolean} hasMore has more media
 * @property {boolean} isMediaLoaded is media loaded
 * @property {boolean} isMediaLoading is media loading
 * @property {Array} media array of media
 * @property {string} pageToken page token for current page
 * @property {string} nextPageToken the page token for the next page
 * @property {number} totalPages total pages
 */

/**
 *
 * @typedef {Object} Media3pProviderContext
 * @property {Media3pProviderContextState} state state of a single provider
 * @property {Media3pProviderContextActions} actions actions for the provider
 */

/**
 * media3p/ typedefs ===========================================================
 */

/**
 * 'media3p' root action typedefs
 *
 * @typedef {(payload: {searchTerm: string}) => undefined} SetSearchTerm
 * @typedef {(payload: {provider: string}) => undefined} SetSelectedProvider
 */

/**
 * 'media3p' root actions in the Media3pContext object.
 *
 * @typedef {Object} Media3pContextActions
 * @property {SetSearchTerm} setSearchTerm Sets current search term
 * @property {SetSelectedProvider} setSelectedProvider Sets provider
 */

/**
 * 'media3p' root state in the Media3pContext object.
 *
 * @typedef {Object} Media3pContextState
 * @property {string} searchTerm search term for media3p
 * @property {string} selectedProvider current selected provider
 * @property {Media3pProviderContextState} unsplash state for unsplash
 * @property {Media3pProviderContextState} coverr state for coverr
 */

/**
 * Context object representing all of media3p's state and actions.
 *
 * @typedef {Object} Media3pContext
 * @property {Media3pContextState} state Non-provider-specific state
 * @property {Media3pContextActions} actions Non-provider-specific actions
 * @property {Media3pProviderContext} unsplash Unsplash state and actions
 * @property {Media3pProviderContext} coverr Coverr state and actions
 */

/**
 * The 'media3p' fragment of the state returned from
 * `useMediaReducer`
 *
 * @typedef {Object} Media3pReducerState
 * @property {string} searchTerm current search term
 * @property {string} selectedProvider selected provider
 * @property {Media3pProviderReducerState} unsplash state for unsplash
 * @property {Media3pProviderReducerState} coverr state for coverr
 */

/**
 * The 'media3p/[provider]' fragment of the actions returned from
 * `useMediaReducer`
 *
 * @typedef {Object} Media3pReducerActions
 * @property {DeleteMediaElement} deleteMediaElement Action dispatched when
 * media element is deleted
 * @property {DeselectCategory} deselectCategory Action dispatched when current
 * category is deselected
 * @property {import('./categories/typedefs').FetchCategoriesStart} fetchCategoriesStart Action dispatched when
 * fetching categories starts
 * @property {import('./categories/typedefs').FetchCategoriesError} fetchCategoriesError Action dispatched when
 * fetching categories returns an error
 * @property {import('./categories/typedefs').FetchCategoriesSuccess} fetchCategoriesSuccess Action dispatched
 * when categories fetching is successful
 * @property {FetchMediaError} fetchMediaError Action dispatched when media
 * fetching returns an error
 * @property {FetchMediaStart} fetchMediaStart Action dispatched when media
 * fetching starts
 * @property {FetchMediaSuccess} fetchMediaSuccess Action dispatched when media
 * succesfully fetched
 * @property {import('./categories/typedefs').SelectCategory} selectCategory Selects current category
 * @property {SetNextPage} setNextPage Sets next page token
 * @property {SetSearchTerm} setSearchTerm Sets search term
 * @property {SetSelectedProvider} setSelectedProvider Sets current provider
 * @property {UpdateMediaElement} updateMediaElement Updates a media element
 */

// This is required so that the IDE doesn't ignore this file.
// Without it the types don't show up when you use {import('./typedefs)}.
export default {};
