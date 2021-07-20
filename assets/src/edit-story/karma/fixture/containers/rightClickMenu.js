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
import { Container } from './container';

export class RightClickMenu extends Container {
  constructor(node, path) {
    super(node, path);
  }

  // default actions
  get copy() {
    return this.queryByRole('button', {
      name: 'Copy, or use Command C on a keyboard',
    });
  }

  get paste() {
    return this.queryByRole('button', {
      name: 'Paste, or use Command V on a keyboard',
    });
  }

  get delete() {
    return this.queryByRole('button', {
      name: 'Delete, or use Delete on a keyboard',
    });
  }

  // foreground media actions
  get sendBackward() {
    return this.getByRole('button', {
      name: 'Send backward, or use Option Command Open Bracket on a keyboard',
    });
  }

  get sendToBack() {
    return this.getByRole('button', {
      name: 'Send to back, or use Command Open Bracket on a keyboard',
    });
  }

  get bringForward() {
    return this.getByRole('button', {
      name: 'Bring forward, or use Command Close Bracket on a keyboard',
    });
  }

  get bringToFront() {
    return this.getByRole('button', {
      name: 'Bring to front, or use Option Command Close Bracket on a keyboard',
    });
  }

  get setAsPageBackground() {
    return this.getByRole('button', {
      name: 'Set as page background',
    });
  }

  get scaleAndCropImage() {
    return this.getByRole('button', {
      name: 'Scale & crop image',
    });
  }

  // page actions
  get duplicatePage() {
    return this.queryByRole('button', {
      name: 'Duplicate Page',
    });
  }

  get deletePage() {
    return this.queryByRole('button', {
      name: 'Delete Page',
    });
  }
}
