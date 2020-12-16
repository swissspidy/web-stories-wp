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
import { useCallback, useMemo, useState } from 'react';

/**
 * Internal dependencies
 */
import useFocusOut from '../../../utils/useFocusOut';
import { isNullOrUndefinedOrEmptyString } from '../../../utils/isNullOrUndefinedOrEmptyString';
import { useKeyDownEffect } from '../../keyboard';
import {
  KEYS_CLOSE_MENU,
  KEYS_SELECT_ITEM,
  KEYS_SHIFT_FOCUS,
} from '../constants';

export default function useDropdownMenu({
  activeValue,
  handleMenuItemSelect,
  isRTL,
  items = [],
  listRef,
  onDismissMenu,
}) {
  const listLength = items.length;
  const [focusedValue, setFocusedValue] = useState(activeValue);

  const focusedIndex = useMemo(() => {
    if (isNullOrUndefinedOrEmptyString(focusedValue)) {
      return 0;
    }
    const foundIndex = items.findIndex((item) => {
      return item?.value?.toString() === focusedValue.toString();
    });
    return foundIndex;
  }, [items, focusedValue]);

  const handleMoveFocus = useCallback(
    (offset) => setFocusedValue(items[focusedIndex + offset].value),
    [items, focusedIndex]
  );

  const handleFocusChange = useCallback(
    ({ key }) => {
      if (
        ['ArrowUp', isRTL ? 'ArrowRight' : 'ArrowLeft'].includes(key) &&
        focusedIndex !== 0
      ) {
        handleMoveFocus(-1);
      } else if (
        ['ArrowDown', isRTL ? 'ArrowLeft' : 'ArrowRight'].includes(key) &&
        focusedIndex < listLength - 1
      ) {
        handleMoveFocus(1);
      }
    },
    [focusedIndex, handleMoveFocus, isRTL, listLength]
  );

  const handleMenuItemEnter = useCallback(
    (event) => handleMenuItemSelect(event, { value: focusedValue }),
    [focusedValue, handleMenuItemSelect]
  );

  useKeyDownEffect(
    listRef,
    { key: KEYS_SELECT_ITEM, shift: true },
    handleMenuItemEnter,
    [handleMenuItemEnter]
  );

  useKeyDownEffect(listRef, { key: KEYS_CLOSE_MENU }, () => onDismissMenu?.(), [
    onDismissMenu,
  ]);

  useKeyDownEffect(listRef, { key: KEYS_SHIFT_FOCUS }, handleFocusChange, [
    handleFocusChange,
  ]);

  useFocusOut(listRef, () => onDismissMenu?.(), []);

  return useMemo(
    () => ({
      focusedValue,
      focusedIndex,
      listLength,
    }),
    [focusedIndex, focusedValue, listLength]
  );
}
