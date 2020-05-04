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
import { renderToStaticMarkup } from 'react-dom/server';

/**
 * Internal dependencies
 */
import { useStory } from '../../app';
import useGlobalClipboardHandlers from '../../utils/useGlobalClipboardHandlers';
import processPastedNodeList from '../../utils/processPastedNodeList';
import { getDefinitionForType } from '../../elements';
import { useGlobalKeyDownEffect } from '../keyboard';
import processPastedElements from '../../utils/processPastedElements';
import useInsertElement from './useInsertElement';
import useUploadWithPreview from './useUploadWithPreview';

const DOUBLE_DASH_ESCAPE = '_DOUBLEDASH_';

function useCanvasGlobalKeys() {
  const {
    state: { currentPage, selectedElements },
    actions: { addElements, deleteSelectedElements },
  } = useStory();

  const uploadWithPreview = useUploadWithPreview();

  const insertElement = useInsertElement();

  const copyCutHandler = useCallback(
    (evt) => {
      const { type: eventType, clipboardData } = evt;

      if (selectedElements.length === 0) {
        return;
      }

      const payload = {
        sentinel: 'story-elements',
        // @todo: Ensure that there's no unserializable data here. The easiest
        // would be to keep all serializable data together and all non-serializable
        // in a separate property.
        items: selectedElements.map((element) => ({
          ...element,
          basedOn: element.id,
          id: undefined,
        })),
      };
      const serializedPayload = JSON.stringify(payload).replace(
        /--/g,
        DOUBLE_DASH_ESCAPE
      );

      const textContent = selectedElements
        .map(({ type, ...rest }) => {
          const { TextContent } = getDefinitionForType(type);
          if (TextContent) {
            return TextContent({ ...rest });
          }
          return type;
        })
        .join('\n');

      const htmlContent = selectedElements
        .map(({ type, ...rest }) => {
          const { Output } = getDefinitionForType(type);
          return renderToStaticMarkup(
            <Output element={rest} box={{ width: 100, height: 100 }} />
          );
        })
        .join('\n');

      clipboardData.setData('text/plain', textContent);
      clipboardData.setData(
        'text/html',
        `<!-- ${serializedPayload} -->${htmlContent}`
      );

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

  // @todo This should be in global handler by UX, not just Canvas.
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
    const clonedElements = selectedElements.map(({ id, x, y, ...rest }) => {
      return {
        x: x + 10,
        y: y + 10,
        id: uuidv4(),
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
