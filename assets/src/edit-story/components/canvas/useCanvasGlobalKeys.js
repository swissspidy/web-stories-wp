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
import { v4 as uuidv4 } from 'uuid';
import { useCallback } from 'react';

/**
 * Internal dependencies
 */
import { useStory } from '../../app';
import useGlobalClipboardHandlers from '../../utils/useGlobalClipboardHandlers';
import processPastedNodeList from '../../utils/processPastedNodeList';
import { useGlobalKeyDownEffect } from '../keyboard';
import processPastedElements from '../../utils/processPastedElements';
import { PAGE_HEIGHT, PAGE_WIDTH } from '../../constants';
import addElementsToClipboard from '../../utils/addElementsToClipboard';
import useInsertElement from './useInsertElement';
import useUploadWithPreview from './useUploadWithPreview';

function useCanvasGlobalKeys() {
  const {
    state: { currentPage, selectedElements },
    actions: { addElements, deleteSelectedElements },
  } = useStory();

  const uploadWithPreview = useUploadWithPreview();

  const insertElement = useInsertElement();

  const copyCutHandler = useCallback(
    (evt) => {
      const { type: eventType } = evt;

      if (selectedElements.length === 0) {
        return;
      }
      addElementsToClipboard(selectedElements, evt);
      if (eventType === 'cut') {
        deleteSelectedElements();
      }

      evt.preventDefault();
    },
    [deleteSelectedElements, selectedElements]
  );

  const elementPasteHandler = useCallback(
    (content) => {
      const elements = processPastedElements(content, currentPage);
      const foundElements = elements.length > 0;
      if (foundElements) {
        addElements({ elements });
      }
      return foundElements;
    },
    [addElements, currentPage]
  );

  const rawPasteHandler = useCallback(
    (content) => {
      let foundContent = false;
      // @todo Images.
      const copiedContent = processPastedNodeList(content.childNodes, '');
      if (copiedContent.trim().length) {
        insertElement('text', { id: uuidv4(), content: copiedContent });
        foundContent = true;
      }
      return foundContent;
    },
    [insertElement]
  );

  const pasteHandler = useCallback(
    (evt) => {
      const { clipboardData } = evt;

      try {
        // Get the html text and plain text but only if it's not a file being copied.
        const content =
          !clipboardData.files?.length &&
          (clipboardData.getData('text/html') ||
            clipboardData.getData('text/plain'));
        if (content) {
          const template = document.createElement('template');
          // Remove meta tag.
          template.innerHTML = content.replace(/<meta[^>]+>/g, '');
          let addedElements = elementPasteHandler(template.content);
          if (!addedElements) {
            addedElements = rawPasteHandler(template.content);
          }
          if (addedElements) {
            // @todo Should we always prevent default?
            evt.preventDefault();
          }
        }
        const { items } = clipboardData;
        /**
         * Loop through all items in clipboard to check if correct type. Ignore text here.
         */
        let files = [];
        for (let i = 0; i < items.length; i++) {
          const file = items[i].getAsFile();
          if (file) {
            files.push(file);
          }
        }
        if (files.length > 0) {
          uploadWithPreview(files);
        }
      } catch (e) {
        // Ignore.
      }
    },
    [elementPasteHandler, rawPasteHandler, uploadWithPreview]
  );

  const cloneHandler = () => {
    if (selectedElements.length === 0) {
      return;
    }
    const placementDiff = 20;
    const allowedBorderDistance = 20;
    const clonedElements = selectedElements.map(({ id, x, y, ...rest }) => {
      const cloneX = x + placementDiff;
      const cloneY = y + placementDiff;
      return {
        x: PAGE_WIDTH - cloneX > allowedBorderDistance ? cloneX : placementDiff,
        y:
          PAGE_HEIGHT - cloneY > allowedBorderDistance ? cloneY : placementDiff,
        id: uuidv4(),
        basedOn: id,
        ...rest,
      };
    });
    addElements({ elements: clonedElements });
  };

  useGlobalClipboardHandlers(copyCutHandler, pasteHandler);
  useGlobalKeyDownEffect('clone', () => cloneHandler(), [cloneHandler]);

  // @todo: return copy/cut/pasteAction that can be used in the context menus.
}

export default useCanvasGlobalKeys;
