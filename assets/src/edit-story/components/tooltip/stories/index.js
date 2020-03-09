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
import { text, select } from '@storybook/addon-knobs';
import styled from 'styled-components';

/**
 * Internal dependencies
 */
import WithTooltip from '../';

const Container = styled.div`
  margin: 60px 120px;
`;

const Content = styled.div`
  width: 100px;
  padding: 12px;
  background: #333;
  color: white;
  display: inline-block;
`;

export default {
  title: 'Components/Tooltip',
  component: WithTooltip,
};

export const _default = () => {
  const title = text('Title', 'Example');
  const shortcut = text('Shortcut', 'cmd+z');

  const placement = select(
    'Placement',
    {
      Top: 'top',
      Bottom: 'bottom',
      Right: 'right',
      Left: 'left',
    },
    'top'
  );

  return (
    <Container>
      <WithTooltip title={title} shortcut={shortcut} placement={placement}>
        <Content>{'Example'}</Content>
      </WithTooltip>
    </Container>
  );
};
