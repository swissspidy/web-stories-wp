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
 * Internal dependencies
 */
import { isVideoElementOptimized } from '../videoOptimization';

describe('videoOptimization (pre-publish checklist card)', () => {
  it('should return true if the video element is currently being transcoded', () => {
    const largeUnoptimizedVideo = {
      id: 202,
      type: 'video',
      resource: {
        isTranscoding: true,
        isOptimized: false,
        height: 2160,
        width: 3840,
        local: false,
      },
    };

    const result = isVideoElementOptimized(largeUnoptimizedVideo);
    expect(result).toBe(true);
  });
  it('should return true if the video element is larger than 1080x1920 and not optimized', () => {
    const largeUnoptimizedVideo = {
      id: 202,
      type: 'video',
      resource: {
        isOptimized: false,
        height: 2160,
        width: 3840,
        local: false,
      },
    };

    const result = isVideoElementOptimized(largeUnoptimizedVideo);
    expect(result).toBe(true);
  });

  it('should not return true if the video element is larger than 1080x1920 and Optimized', () => {
    const largeUnoptimizedVideo = {
      id: 202,
      type: 'video',
      resource: {
        isOptimized: true,
        height: 2160,
        width: 3840,
        local: false,
      },
    };

    const result = isVideoElementOptimized(largeUnoptimizedVideo);
    expect(result).toBe(false);
  });

  it('should not return a message if the video element is smaller than 1080x1920', () => {
    const smallUnoptimizedVideo = {
      id: 202,
      type: 'video',
      resource: {
        isOptimized: false,
        height: 300,
        width: 400,
        local: false,
      },
    };
    const smallOptimizedVideo = {
      id: 203,
      type: 'video',
      resource: {
        isOptimized: true,
        height: 300,
        width: 400,
        local: false,
      },
    };

    expect(isVideoElementOptimized(smallUnoptimizedVideo)).toBe(false);
    expect(isVideoElementOptimized(smallOptimizedVideo)).toBe(false);
  });
});
