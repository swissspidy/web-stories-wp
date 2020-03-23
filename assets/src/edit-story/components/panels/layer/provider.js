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
import { useState, useCallback, useEffect, useRef } from 'react';

/**
 * Internal dependencies
 */
import StoryPropTypes from '../../../types';
import Context from './context';
import useLayers from './useLayers';

const SCROLL_DISTANCE = 5;

function LayerProvider({ children }) {
  const layers = useLayers();
  const [hasScrollAbove, setHasScrollAbove] = useState(false);
  const [hasScrollBelow, setHasScrollBelow] = useState(false);
  const [isReordering, setIsReordering] = useState(false);
  const [scrollDirection, setScrollDirection] = useState(0);
  const [currentSeparator, setCurrentSeparator] = useState(null);
  const scrollTarget = useRef(null);

  const setScrollTarget = useCallback(
    (node) => (scrollTarget.current = node.parentElement),
    []
  );

  const updateScrollMarkers = useCallback(() => {
    const node = scrollTarget.current;
    if (!node) {
      return;
    }
    const possibleScroll = node.scrollHeight - node.clientHeight;
    if (possibleScroll <= 0) {
      setHasScrollAbove(false);
      setHasScrollBelow(false);
    } else {
      setHasScrollAbove(node.scrollTop > 0);
      setHasScrollBelow(node.scrollTop < possibleScroll);
    }
  }, []);

  const stopScroll = useCallback(() => setScrollDirection(0), [
    setScrollDirection,
  ]);

  const canScrollUp = isReordering && hasScrollAbove;
  const canScrollDown = isReordering && hasScrollBelow;

  useEffect(() => {
    const isNotScrolling = scrollDirection === 0;
    const isScrollingUp = canScrollUp && scrollDirection < 0;
    const isScrollingDown = canScrollDown && scrollDirection > 0;
    const isScrollingAnywhere = isScrollingUp || isScrollingDown;
    if (isNotScrolling || !isScrollingAnywhere) {
      return undefined;
    }

    let mounted = true;
    const update = () => {
      scrollTarget.current.scrollTop += scrollDirection * SCROLL_DISTANCE;
      updateScrollMarkers();
      if (mounted) {
        window.requestAnimationFrame(update);
      }
    };
    update();

    return () => {
      mounted = false;
    };
  }, [scrollDirection, updateScrollMarkers, canScrollUp, canScrollDown]);

  // Update scroll markers whenever isReordering changes (to true really, but no harm)
  useEffect(() => updateScrollMarkers(), [isReordering, updateScrollMarkers]);

  const state = {
    state: {
      layers,
      isReordering,
      currentSeparator,
      canScrollUp,
      canScrollDown,
    },
    actions: {
      setIsReordering,
      setCurrentSeparator,
      setScrollTarget,
      startScroll: setScrollDirection,
      stopScroll,
    },
  };

  return <Context.Provider value={state}>{children}</Context.Provider>;
}

LayerProvider.propTypes = {
  children: StoryPropTypes.children,
};

export default LayerProvider;
