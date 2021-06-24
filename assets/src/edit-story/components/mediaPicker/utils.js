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

export const calculateImageSelectOptions = (attachment, controller) => {
  const control = controller.get('control');
  const flexWidth = Boolean(parseInt(control.params.flex_width));
  const flexHeight = Boolean(parseInt(control.params.flex_height));
  const realWidth = attachment.get('width');
  const realHeight = attachment.get('height');
  let xInit = parseInt(control.params.width);
  let yInit = parseInt(control.params.height);
  const ratio = xInit / yInit;
  const xImg = xInit;
  const yImg = yInit;

  controller.set(
    'canSkipCrop',
    !control.mustBeCropped(
      flexWidth,
      flexHeight,
      xInit,
      yInit,
      realWidth,
      realHeight
    )
  );

  if (realWidth / realHeight > ratio) {
    yInit = realHeight;
    xInit = yInit * ratio;
  } else {
    xInit = realWidth;
    yInit = xInit / ratio;
  }

  const x1 = (realWidth - xInit) / 2;
  const y1 = (realHeight - yInit) / 2;

  const imgSelectOptions = {
    handles: true,
    keys: true,
    instance: true,
    persistent: true,
    imageWidth: realWidth,
    imageHeight: realHeight,
    minWidth: xImg > xInit ? xInit : xImg,
    minHeight: yImg > yInit ? yInit : yImg,
    x1: x1,
    y1: y1,
    x2: xInit + x1,
    y2: yInit + y1,
  };

  if (flexHeight === false && flexWidth === false) {
    imgSelectOptions.aspectRatio = xInit + ':' + yInit;
  }

  if (true === flexHeight) {
    delete imgSelectOptions.minHeight;
    imgSelectOptions.maxWidth = realWidth;
  }

  if (true === flexWidth) {
    delete imgSelectOptions.minWidth;
    imgSelectOptions.maxHeight = realHeight;
  }

  return imgSelectOptions;
};

export const mustBeCropped = (flexW, flexH, dstW, dstH, imgW, imgH) => {
  if (true === flexW && true === flexH) {
    return false;
  }

  if (true === flexW && dstH === imgH) {
    return false;
  }

  if (true === flexH && dstW === imgW) {
    return false;
  }

  if (dstW === imgW && dstH === imgH) {
    return false;
  }

  if (imgW <= dstW) {
    return false;
  }

  return true;
};
