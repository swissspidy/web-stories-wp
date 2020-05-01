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
import { useEffect } from 'react';

/**
 * Internal dependencies
 */
import documentHasSelection from './documentHasSelection';

/**
 * @param {?Element} container
 * @param {function(!ClipboardEvent)} copyCutHandler
 * @param {function(!ClipboardEvent)} pasteHandler
 */
function useClipboardHandlers(container, copyCutHandler, pasteHandler) {
  useEffect(() => {
    if (!container) {
      return undefined;
    }

    const copyCutHandlerWrapper = (evt) => {
      const { target, clipboardData } = evt;

      // Elements that either handle their own clipboard or have selection.
      if (documentHasSelection()) {
        return;
      }

      // A target can be anywhere in the container's full subtree, but not
      // in its siblings.
      if (!container.contains(target) && !target.contains(container)) {
        return;
      }

      // Someone has already put something in the clipboard. Do not override.
      if (clipboardData.types.length !== 0) {
        return;
      }

      copyCutHandler(evt);
    };

    // We always use global handler for pasting.
    const pasteHandlerWrapper = (evt) => {
      // Only proceed custom handling if there is no selection.
      if (!documentHasSelection()) {
        pasteHandler(evt);
      }
    };

    document.addEventListener('copy', copyCutHandlerWrapper);
    document.addEventListener('cut', copyCutHandlerWrapper);
    document.addEventListener('paste', pasteHandlerWrapper);
    return () => {
      document.removeEventListener('copy', copyCutHandlerWrapper);
      document.removeEventListener('cut', copyCutHandlerWrapper);
      document.removeEventListener('paste', pasteHandlerWrapper);
    };
  }, [container, copyCutHandler, pasteHandler]);
}

export default useClipboardHandlers;
