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
import { useCallback } from 'react';
/**
 * Internal dependencies
 */
import { useAPI } from '../../app/api';
import { useConfig } from '../config';
import { useMedia } from '../media';
import {createResource} from '../media/utils';

function useUploader(refreshLibrary = true) {
  const {
    actions: { resetWithFetch },
  } = useMedia();
  const {
    actions: { uploadMedia },
  } = useAPI();
  const {
    storyId,
    maxUpload,
    allowedMimeTypes: {
      image: allowedImageMimeTypes,
      video: allowedVideoMimeTypes,
    },
  } = useConfig();
  const allowedMimeTypes = [...allowedImageMimeTypes, ...allowedVideoMimeTypes];

  const isValidType = useCallback(
    ({ type }) => {
      return allowedMimeTypes.includes(type);
    },
    [allowedMimeTypes]
  );

  const fileSizeCheck = useCallback(
    ({ size }) => {
      return size <= maxUpload;
    },
    [maxUpload]
  );

  // QQQQ: downstream.
  const uploadFile = (file) => {
    // TODO Add permission check here, see Gutenberg's userCan function.
    if (!fileSizeCheck(file)) {
      throw new Error('File size error');
    }

    if (!isValidType(file)) {
      throw new Error('File type error');
    }

    const additionalData = {
      post: storyId,
    };

    const promise = uploadMedia(file, additionalData);
    if (refreshLibrary) {
      promise.finally(resetWithFetch);
    }
    return promise.then(({
      guid: { rendered: src },
      mime_type: mimeType,
      media_details: { width, height, length_formatted: lengthFormatted },
      id: videoId,
      featured_media: posterId,
      featured_media_src: poster,
    }) => createResource({
      mimeType,
      src,
      width,
      height,
      lengthFormatted,
      poster,
      posterId,
      videoId,
      local: false,
    }));
  };

  return {
    uploadFile,
    isValidType,
  };
}

export default useUploader;
